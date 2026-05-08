import sgMail, { type MailDataRequired } from '@sendgrid/mail'
import type { ContactFormData } from '@/types'

// Initialisiere SendGrid mit API Key
const apiKey = process.env.SENDGRID_API_KEY
if (apiKey) {
  sgMail.setApiKey(apiKey)
}

// Produktions-URL fuer E-Mail-Links — niemals localhost verwenden
function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL
  if (url && !url.includes('localhost')) return url
  return 'https://samaritano.de'
}

interface SendEmailOptions {
  to: string
  subject: string
  text: string
  html?: string
  attachments?: { content: string; filename: string; type: string; disposition?: string }[]
}

export async function sendEmail(options: SendEmailOptions) {
  if (!apiKey) {
    throw new Error('SENDGRID_API_KEY is not configured')
  }

  const fromEmail = process.env.SENDGRID_FROM_EMAIL
  const fromName = process.env.SENDGRID_FROM_NAME

  if (!fromEmail) {
    throw new Error('SENDGRID_FROM_EMAIL is not configured')
  }

  const msg: MailDataRequired = {
    to: options.to,
    from: {
      email: fromEmail,
      name: fromName || 'Website',
    },
    subject: options.subject,
    text: options.text,
    html: options.html || options.text,
    ...(options.attachments?.length
      ? { attachments: options.attachments.map((a) => ({ ...a, disposition: a.disposition || 'attachment' })) }
      : {}),
  }

  try {
    await sgMail.send(msg)
    return { success: true }
  } catch (error) {
    console.error('SendGrid error:', error)
    throw error
  }
}

export async function sendContactFormEmail(data: ContactFormData, recipientEmail: string) {
  const subject = data.subject || `Neue Kontaktanfrage von ${data.name}`

  const text = `
Neue Kontaktanfrage

Name: ${data.name}
E-Mail: ${data.email}
${data.phone ? `Telefon: ${data.phone}` : ''}

Nachricht:
${data.message}
`.trim()

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #f4f4f4; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #666; }
    .message { background: #f9f9f9; padding: 15px; border-radius: 4px; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">Neue Kontaktanfrage</h2>
    </div>
    <div class="content">
      <div class="field">
        <span class="label">Name:</span> ${data.name}
      </div>
      <div class="field">
        <span class="label">E-Mail:</span> <a href="mailto:${data.email}">${data.email}</a>
      </div>
      ${data.phone ? `
      <div class="field">
        <span class="label">Telefon:</span> <a href="tel:${data.phone}">${data.phone}</a>
      </div>
      ` : ''}
      <div class="field">
        <span class="label">Nachricht:</span>
        <div class="message">${data.message.replace(/\n/g, '<br>')}</div>
      </div>
    </div>
  </div>
</body>
</html>
`.trim()

  return sendEmail({
    to: recipientEmail,
    subject,
    text,
    html,
  })
}

// ─── Bewerbungsformular ───

export interface ApplicationData {
  firstName: string
  lastName: string
  email: string
  phone: string
  zip: string
  city: string
  callTime?: string
  position: string
  employers?: { employer: string; period: string; role: string }[]
  aboutYou?: string
  jobTitle: string
}

export async function sendApplicationEmail(
  data: ApplicationData,
  recipientEmail: string,
  attachment?: { content: string; filename: string; type: string }
) {
  if (!apiKey) throw new Error('SENDGRID_API_KEY is not configured')

  const fromEmail = process.env.SENDGRID_FROM_EMAIL
  const fromName = process.env.SENDGRID_FROM_NAME
  if (!fromEmail) throw new Error('SENDGRID_FROM_EMAIL is not configured')

  const employerRows = (data.employers || [])
    .map((e) => `<tr><td style="padding:6px 12px;border:1px solid #ddd">${e.employer}</td><td style="padding:6px 12px;border:1px solid #ddd">${e.period}</td><td style="padding:6px 12px;border:1px solid #ddd">${e.role}</td></tr>`)
    .join('')

  const employerTable = employerRows
    ? `<table style="width:100%;border-collapse:collapse;margin-top:8px"><thead><tr style="background:#f4f4f4"><th style="padding:8px 12px;border:1px solid #ddd;text-align:left">Arbeitgeber</th><th style="padding:8px 12px;border:1px solid #ddd;text-align:left">Zeitraum</th><th style="padding:8px 12px;border:1px solid #ddd;text-align:left">Position</th></tr></thead><tbody>${employerRows}</tbody></table>`
    : '<em>Keine Angabe</em>'

  const subject = `Neue Bewerbung: ${data.position} – ${data.firstName} ${data.lastName}`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 640px; margin: 0 auto; padding: 20px; }
    .header { background: #1a1a2e; color: #fff; padding: 24px; border-radius: 8px 8px 0 0; }
    .header h2 { margin: 0; font-size: 20px; }
    .header p { margin: 6px 0 0; opacity: 0.7; font-size: 14px; }
    .content { padding: 24px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }
    .section { margin-bottom: 24px; }
    .section-title { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #888; margin-bottom: 10px; }
    .field { margin-bottom: 10px; }
    .label { font-weight: 600; color: #555; }
    .about { background: #f9f9f9; padding: 16px; border-radius: 6px; margin-top: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Neue Bewerbung eingegangen</h2>
      <p>Stelle: ${data.jobTitle}</p>
    </div>
    <div class="content">
      <div class="section">
        <div class="section-title">Persoenliche Daten</div>
        <div class="field"><span class="label">Name:</span> ${data.firstName} ${data.lastName}</div>
        <div class="field"><span class="label">E-Mail:</span> <a href="mailto:${data.email}">${data.email}</a></div>
        <div class="field"><span class="label">Telefon:</span> <a href="tel:${data.phone}">${data.phone}</a></div>
        <div class="field"><span class="label">Adresse:</span> ${data.zip} ${data.city}</div>
        ${data.callTime ? `<div class="field"><span class="label">Beste Anrufzeit:</span> ${data.callTime}</div>` : ''}
        <div class="field"><span class="label">Position:</span> ${data.position}</div>
      </div>
      <div class="section">
        <div class="section-title">Berufserfahrung</div>
        ${employerTable}
      </div>
      ${data.aboutYou ? `
      <div class="section">
        <div class="section-title">Ueber den Bewerber</div>
        <div class="about">${data.aboutYou.replace(/\n/g, '<br>')}</div>
      </div>
      ` : ''}
      ${attachment ? '<div class="section"><div class="section-title">Lebenslauf</div><p>Siehe Anhang: ' + attachment.filename + '</p></div>' : ''}
    </div>
  </div>
</body>
</html>`.trim()

  const text = `Neue Bewerbung: ${data.position}\n\nName: ${data.firstName} ${data.lastName}\nE-Mail: ${data.email}\nTelefon: ${data.phone}\nAdresse: ${data.zip} ${data.city}\n${data.callTime ? `Anrufzeit: ${data.callTime}\n` : ''}Position: ${data.position}\n\n${data.aboutYou ? `Ueber mich:\n${data.aboutYou}` : ''}`

  const msg: MailDataRequired = {
    to: recipientEmail,
    from: { email: fromEmail, name: fromName || 'Website' },
    subject,
    text,
    html,
    ...(attachment
      ? {
          attachments: [
            {
              content: attachment.content,
              filename: attachment.filename,
              type: attachment.type,
              disposition: 'attachment' as const,
            },
          ],
        }
      : {}),
  }

  await sgMail.send(msg)

  // Bestaetigungsmail an Bewerber
  const confirmHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1a1a2e; color: #fff; padding: 24px; border-radius: 8px 8px 0 0; }
    .content { padding: 24px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin:0;font-size:20px">Danke fuer deine Bewerbung!</h2>
    </div>
    <div class="content">
      <p>Hallo ${data.firstName},</p>
      <p>wir haben deine Bewerbung als <strong>${data.position}</strong> erhalten und melden uns innerhalb von 24 Stunden bei dir.</p>
      <p>Dein Ansprechpartner Alexander Esau wird sich persoenlich bei dir melden.</p>
      <p style="margin-top:24px">Herzliche Gruesse,<br>Dein Samaritano-Team</p>
    </div>
  </div>
</body>
</html>`.trim()

  await sgMail.send({
    to: data.email,
    from: { email: fromEmail, name: fromName || 'Samaritano' },
    subject: `Bewerbung erhalten – ${data.position}`,
    text: `Hallo ${data.firstName},\n\nwir haben deine Bewerbung als ${data.position} erhalten und melden uns innerhalb von 24 Stunden.\n\nHerzliche Gruesse,\nDein Samaritano-Team`,
    html: confirmHtml,
  })

  return { success: true }
}

// ─── Newsletter ───

export interface NewsletterConfirmData {
  firstName: string
  email: string
  confirmToken: string
}

export async function sendNewsletterConfirmEmail(data: NewsletterConfirmData) {
  const siteUrl = getSiteUrl()
  const confirmUrl = `${siteUrl}/api/newsletter/confirm?token=${data.confirmToken}`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1B3763; color: #fff; padding: 24px; border-radius: 8px 8px 0 0; }
    .header h2 { margin: 0; font-size: 20px; }
    .content { padding: 24px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }
    .btn { display: inline-block; background: #1B3763; color: #fff; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; margin: 16px 0; }
    .footer { margin-top: 24px; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Bitte bestaetigen: Dein Newsletter-Abo</h2>
    </div>
    <div class="content">
      <p>Hallo ${data.firstName},</p>
      <p>du hast dich fuer unseren Newsletter angemeldet. Bitte bestaetigen deine Anmeldung mit einem Klick auf den folgenden Button:</p>
      <p><a href="${confirmUrl}" class="btn" style="color: #fff;">Anmeldung bestaetigen</a></p>
      <p>Falls du diese Anmeldung nicht angefordert hast, kannst du diese E-Mail einfach ignorieren.</p>
      <div class="footer">
        <p>Falls der Button nicht funktioniert, kopiere diesen Link in deinen Browser:<br>
        <a href="${confirmUrl}">${confirmUrl}</a></p>
      </div>
    </div>
  </div>
</body>
</html>`.trim()

  const text = `Hallo ${data.firstName},\n\ndu hast dich fuer unseren Newsletter angemeldet.\n\nBitte bestaetigen deine Anmeldung:\n${confirmUrl}\n\nFalls du diese Anmeldung nicht angefordert hast, kannst du diese E-Mail ignorieren.`

  return sendEmail({
    to: data.email,
    subject: 'Bitte bestaetigen: Dein Newsletter-Abo',
    text,
    html,
  })
}

export interface NewsletterWelcomeData {
  firstName: string
  email: string
  unsubscribeToken: string
}

export async function sendNewsletterWelcomeEmail(data: NewsletterWelcomeData) {
  const siteUrl = getSiteUrl()
  const unsubscribeUrl = `${siteUrl}/api/newsletter/unsubscribe?token=${data.unsubscribeToken}`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1B3763; color: #fff; padding: 24px; border-radius: 8px 8px 0 0; }
    .header h2 { margin: 0; font-size: 20px; }
    .content { padding: 24px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }
    .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #eee; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Willkommen beim Samaritano-Newsletter!</h2>
    </div>
    <div class="content">
      <p>Hallo ${data.firstName},</p>
      <p>deine Anmeldung ist bestaetigt! Ab sofort erhaeltst du unseren Newsletter mit den neuesten Stellenangeboten und Brancheninfos.</p>
      <p style="margin-top:24px">Herzliche Gruesse,<br>Dein Samaritano-Team</p>
      <div class="footer">
        <p>Du moechtest keine E-Mails mehr erhalten?<br>
        <a href="${unsubscribeUrl}">Hier abmelden</a></p>
      </div>
    </div>
  </div>
</body>
</html>`.trim()

  const text = `Hallo ${data.firstName},\n\nwillkommen beim Samaritano-Newsletter! Deine Anmeldung ist bestaetigt.\n\nHerzliche Gruesse,\nDein Samaritano-Team\n\nAbmelden: ${unsubscribeUrl}`

  return sendEmail({
    to: data.email,
    subject: 'Willkommen beim Samaritano-Newsletter!',
    text,
    html,
  })
}
