import sgMail from '@sendgrid/mail'
import type { ContactFormData } from '@/types'

// Initialisiere SendGrid mit API Key
const apiKey = process.env.SENDGRID_API_KEY
if (apiKey) {
  sgMail.setApiKey(apiKey)
}

interface SendEmailOptions {
  to: string
  subject: string
  text: string
  html?: string
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

  const msg = {
    to: options.to,
    from: {
      email: fromEmail,
      name: fromName || 'Website',
    },
    subject: options.subject,
    text: options.text,
    html: options.html || options.text,
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
