import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { renderToBuffer } from '@react-pdf/renderer'
import React from 'react'
import { SalaryPdf, type SalaryPdfData } from '@/lib/gehalts-pdf'
import { sendEmail } from '@/lib/sendgrid'
import { getNotifications } from '@/sanity/queries'
import { client } from '@/sanity/client'

const schema = z.object({
  salutation: z.string().min(1),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  role: z.string().min(1),
  hours: z.number(),
  experience: z.number(),
  nightShifts: z.number(),
  weekendShifts: z.number(),
  holidayShifts: z.number(),
  // Pre-calculated values from client
  samaBase: z.number(),
  nightBonus: z.number(),
  weekendBonus: z.number(),
  holidayBonusMonthly: z.number(),
  totalSalary: z.number(),
  tarifSalary: z.number(),
  diff: z.number(),
  diffPct: z.number(),
  yearly: z.number(),
  hourlyRate: z.number(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = schema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Validierungsfehler', details: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = result.data

    // PDF generieren
    const pdfData: SalaryPdfData = {
      salutation: data.salutation,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      hours: data.hours,
      experience: data.experience,
      nightShifts: data.nightShifts,
      weekendShifts: data.weekendShifts,
      holidayShifts: data.holidayShifts,
      samaBase: data.samaBase,
      nightBonus: data.nightBonus,
      weekendBonus: data.weekendBonus,
      holidayBonusMonthly: data.holidayBonusMonthly,
      totalSalary: data.totalSalary,
      tarifSalary: data.tarifSalary,
      diff: data.diff,
      diffPct: data.diffPct,
      yearly: data.yearly,
      hourlyRate: data.hourlyRate,
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = await renderToBuffer(React.createElement(SalaryPdf, { data: pdfData }) as any)
    const pdfBase64 = Buffer.from(pdfBuffer).toString('base64')

    const fmt = (n: number) => n.toLocaleString('de-DE')
    const greeting = data.salutation === 'Herr' ? 'Lieber' : data.salutation === 'Frau' ? 'Liebe' : 'Hallo'

    // E-Mail an Lead mit PDF
    await sendEmail({
      to: data.email,
      subject: 'Dein persoenliches Gehaltsangebot bei Samaritano',
      text: `${greeting} ${data.firstName},\n\nim Anhang findest du dein persoenliches Gehaltsangebot als ${data.role}: ${fmt(data.totalSalary)} EUR brutto/Monat.\n\nDas sind ${fmt(data.diff)} EUR (+${data.diffPct}%) mehr als der Tarif-Durchschnitt.\n\nAlexander Esau meldet sich persoenlich bei dir.\n\nHerzliche Gruesse,\nDein Samaritano-Team`,
      attachments: [{ content: pdfBase64, filename: 'Gehaltsangebot-Samaritano.pdf', type: 'application/pdf' }],
      html: `
<!DOCTYPE html>
<html>
<head><style>
  body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { background: #1a1a2e; color: #fff; padding: 24px; border-radius: 8px 8px 0 0; }
  .content { padding: 24px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }
  .big { font-size: 36px; font-weight: bold; color: #0ea5e9; margin: 16px 0; }
  .badge { display: inline-block; background: #22c55e; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 13px; }
  .cta { display: inline-block; background: #0ea5e9; color: #fff; padding: 12px 28px; border-radius: 24px; text-decoration: none; font-weight: bold; margin-top: 20px; }
</style></head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin:0">Dein Gehaltsangebot</h2>
      <p style="margin:4px 0 0;opacity:0.7;font-size:14px">${data.role} bei Samaritano</p>
    </div>
    <div class="content">
      <p>${greeting} ${data.firstName},</p>
      <p>basierend auf deinen Angaben haben wir dein individuelles Gehaltsangebot berechnet:</p>
      <div class="big">${fmt(data.totalSalary)} &euro;/Monat</div>
      <div class="badge">+${fmt(data.diff)} &euro; (+${data.diffPct}%) ueber Tarif</div>
      <p style="margin-top:20px">Die detaillierte Aufschluesselung findest du im angehaengten PDF.</p>
      <p>Alexander Esau meldet sich persoenlich bei dir — oder ruf einfach an: <a href="tel:+4905717846640">+49 (0) 571 7846640</a></p>
      <a href="https://samaritano-web.vercel.app/jobs" class="cta">Passende Stellen ansehen</a>
      <p style="margin-top:24px">Herzliche Gruesse,<br>Dein Samaritano-Team</p>
    </div>
  </div>
</body>
</html>`.trim(),
    })

    // Notification an Team
    const notifications = await getNotifications()
    const teamEmail = notifications?.gehaltsrechnerEmail || process.env.SENDGRID_FROM_EMAIL

    if (teamEmail) {
      await sendEmail({
        to: teamEmail,
        subject: `Neuer Lead: ${data.firstName} ${data.lastName} – ${data.role} (${fmt(data.totalSalary)} EUR)`,
        text: `Neuer Gehaltsrechner-Lead\n\nName: ${data.salutation} ${data.firstName} ${data.lastName}\nE-Mail: ${data.email}\n\nBeruf: ${data.role}\nGehalt: ${fmt(data.totalSalary)} EUR/Monat (+${data.diffPct}% ueber Tarif)\nStunden: ${data.hours}h/Woche\nErfahrung: ${data.experience} Jahre`,
        html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
  <h2 style="margin:0">Neuer Gehaltsrechner-Lead</h2>
  <table style="margin-top:16px;border-collapse:collapse;width:100%">
    <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;width:140px">Name</td><td style="padding:8px;border-bottom:1px solid #eee">${data.salutation} ${data.firstName} ${data.lastName}</td></tr>
    <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">E-Mail</td><td style="padding:8px;border-bottom:1px solid #eee"><a href="mailto:${data.email}">${data.email}</a></td></tr>
    <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Beruf</td><td style="padding:8px;border-bottom:1px solid #eee">${data.role}</td></tr>
    <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Gehalt</td><td style="padding:8px;border-bottom:1px solid #eee;color:#0ea5e9;font-weight:bold">${fmt(data.totalSalary)} EUR/Monat</td></tr>
    <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">vs. Tarif</td><td style="padding:8px;border-bottom:1px solid #eee;color:#22c55e">+${fmt(data.diff)} EUR (+${data.diffPct}%)</td></tr>
    <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Stunden</td><td style="padding:8px;border-bottom:1px solid #eee">${data.hours}h/Woche</td></tr>
    <tr><td style="padding:8px;font-weight:bold">Erfahrung</td><td style="padding:8px">${data.experience} Jahre</td></tr>
  </table>
</div>`.trim(),
      })
    }

    // Slack Webhook
    if (notifications?.gehaltsrechnerSlack) {
      fetch(notifications.gehaltsrechnerSlack, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: `Neuer Gehaltsrechner-Lead: ${data.firstName} ${data.lastName} – ${data.role} (${fmt(data.totalSalary)} EUR)` }),
      }).catch(() => {})
    }

    // Externer Webhook
    if (notifications?.gehaltsrechnerWebhook) {
      fetch(notifications.gehaltsrechnerWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'gehaltsrechner_lead', ...data }),
      }).catch(() => {})
    }

    // In Sanity speichern
    if (client) {
      try {
        await client.create({
          _type: 'gehaltsrechnerLead',
          salutation: data.salutation,
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          role: data.role,
          hours: data.hours,
          experience: data.experience,
          nightShifts: data.nightShifts,
          weekendShifts: data.weekendShifts,
          holidayShifts: data.holidayShifts,
          calculatedSalary: data.totalSalary,
          tarifSalary: data.tarifSalary,
          status: 'neu',
          submittedAt: new Date().toISOString(),
        })
      } catch (err) {
        console.error('Sanity create lead error:', err)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Gehaltsrechner API error:', error)
    return NextResponse.json({ success: false, error: 'Fehler beim Verarbeiten' }, { status: 500 })
  }
}
