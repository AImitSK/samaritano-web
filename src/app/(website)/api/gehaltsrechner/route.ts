import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { renderToBuffer } from '@react-pdf/renderer'
import React from 'react'
import { SalaryPdf, type SalaryPdfData } from '@/lib/gehalts-pdf'
import { sendEmail } from '@/lib/sendgrid'
import { getNotifications, getSettings } from '@/sanity/queries'
import { client, urlFor } from '@/sanity/client'

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

export const maxDuration = 30

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

    // Settings aus Sanity laden (Logo, Kontaktdaten)
    const settings = await getSettings()
    const logoUrl = settings?.logo ? urlFor(settings.logo)?.width(200).format('png').url() ?? null : null

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
      logoUrl,
      contactPhone: settings?.contactPhone,
      contactEmail: settings?.contactEmail,
      address: settings?.address,
    }

    // @ts-expect-error — renderToBuffer expects Document element but wrapper component works fine
    const pdfBuffer = await renderToBuffer(React.createElement(SalaryPdf, { data: pdfData }))
    const pdfBase64 = Buffer.from(pdfBuffer).toString('base64')

    const fmt = (n: number) => n.toLocaleString('de-DE')
    const greeting = data.salutation === 'Herr' ? 'Lieber' : data.salutation === 'Frau' ? 'Liebe' : 'Hallo'
    const phone = settings?.contactPhone || '+49 (0) 571 7846640'
    const email = settings?.contactEmail || 'a.esau@samaritano.de'
    const addr = settings?.address || 'samaritano GmbH\nVon Oeynhausen Str. 34\n32479 Hille'
    const addrHtml = addr.replace(/\n/g, '<br>')

    // E-Mail an Lead mit PDF
    await sendEmail({
      to: data.email,
      subject: 'Dein Gehaltspotenzial bei Samaritano',
      text: `${greeting} ${data.firstName},\n\nim Anhang findest du deine persönliche Gehaltsübersicht als ${data.role}: ${fmt(data.totalSalary)} EUR brutto/Monat.\n\nDas sind ${fmt(data.diff)} EUR (+${data.diffPct}%) mehr als der Tarif-Durchschnitt.\n\nAlexander Esau meldet sich persönlich bei dir.\n\nHerzliche Grüße,\nDein Samaritano-Team\n\n${addr}\nTel: ${phone}\nE-Mail: ${email}`,
      attachments: [{ content: pdfBase64, filename: 'Gehaltspotenzial-Samaritano.pdf', type: 'application/pdf' }],
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: Arial, sans-serif; color: #1B3763; line-height: 1.6; margin: 0; padding: 0; background: #F6F8FB; }
</style></head>
<body>
  <div style="max-width:600px;margin:0 auto;padding:20px">
    <div style="background:#1B3763;color:#fff;padding:28px 32px;border-radius:10px 10px 0 0">
      ${logoUrl ? `<img src="${logoUrl}" alt="samaritano" height="28" style="margin-bottom:16px;display:block">` : '<div style="font-size:22px;font-weight:300;margin-bottom:16px">samari<span style="color:#64B2C9">tano</span></div>'}
      <h2 style="margin:0;font-size:20px;font-weight:600">Dein Gehaltspotenzial</h2>
      <p style="margin:4px 0 0;opacity:0.7;font-size:14px">${data.role} bei Samaritano</p>
    </div>
    <div style="padding:28px 32px;background:#fff;border:1px solid #DFE4EC;border-top:none;border-radius:0 0 10px 10px">
      <p>${greeting} ${data.firstName},</p>
      <p>basierend auf deinen Angaben haben wir dein persönliches Gehaltspotenzial berechnet:</p>
      <div style="font-size:36px;font-weight:bold;color:#64B2C9;margin:16px 0">${fmt(data.totalSalary)} &euro;/Monat</div>
      <div style="display:inline-block;background:#CB344C;color:#fff;padding:5px 14px;border-radius:20px;font-size:13px">+${fmt(data.diff)} &euro; (+${data.diffPct}%) über Tarif</div>
      <p style="margin-top:20px">Die detaillierte Aufschlüsselung findest du im angehängten PDF.</p>
      <p>Alexander Esau meldet sich persönlich bei dir — oder ruf einfach an: <a href="tel:${phone.replace(/[^+\d]/g, '')}" style="color:#64B2C9">${phone}</a></p>
      <a href="https://samaritano-web.vercel.app/jobs" style="display:inline-block;background:#CB344C;color:#fff;padding:12px 28px;border-radius:24px;text-decoration:none;font-weight:bold;margin-top:16px">Passende Stellen ansehen</a>
      <p style="margin-top:28px">Herzliche Grüße,<br>Dein Samaritano-Team</p>
      <div style="margin-top:24px;padding-top:20px;border-top:1px solid #DFE4EC;font-size:13px;color:#6B7A93;line-height:1.5">
        ${addrHtml}<br>
        Tel: <a href="tel:${phone.replace(/[^+\d]/g, '')}" style="color:#6B7A93">${phone}</a><br>
        E-Mail: <a href="mailto:${email}" style="color:#6B7A93">${email}</a>
      </div>
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
        text: `Neuer Gehaltsrechner-Lead\n\nName: ${data.salutation} ${data.firstName} ${data.lastName}\nE-Mail: ${data.email}\n\nBeruf: ${data.role}\nGehalt: ${fmt(data.totalSalary)} EUR/Monat (+${data.diffPct}% über Tarif)\nStunden: ${data.hours}h/Woche\nErfahrung: ${data.experience} Jahre`,
        html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
  <h2 style="margin:0">Neuer Gehaltsrechner-Lead</h2>
  <table style="margin-top:16px;border-collapse:collapse;width:100%">
    <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;width:140px">Name</td><td style="padding:8px;border-bottom:1px solid #eee">${data.salutation} ${data.firstName} ${data.lastName}</td></tr>
    <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">E-Mail</td><td style="padding:8px;border-bottom:1px solid #eee"><a href="mailto:${data.email}">${data.email}</a></td></tr>
    <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Beruf</td><td style="padding:8px;border-bottom:1px solid #eee">${data.role}</td></tr>
    <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Gehalt</td><td style="padding:8px;border-bottom:1px solid #eee;color:#64B2C9;font-weight:bold">${fmt(data.totalSalary)} EUR/Monat</td></tr>
    <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">vs. Tarif</td><td style="padding:8px;border-bottom:1px solid #eee;color:#CB344C">+${fmt(data.diff)} EUR (+${data.diffPct}%)</td></tr>
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
    const errMsg = error instanceof Error ? `${error.message}\n${error.stack}` : String(error)
    console.error('Gehaltsrechner API error:', errMsg)
    return NextResponse.json({ success: false, error: 'Fehler beim Verarbeiten' }, { status: 500 })
  }
}
