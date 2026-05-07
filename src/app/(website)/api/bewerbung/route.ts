import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendApplicationEmail } from '@/lib/sendgrid'
import { getNotifications } from '@/sanity/queries'
import { client } from '@/sanity/client'

const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25 MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const applicationSchema = z.object({
  firstName: z.string().min(2, 'Vorname muss mindestens 2 Zeichen haben'),
  lastName: z.string().min(2, 'Nachname muss mindestens 2 Zeichen haben'),
  email: z.string().email('Ungueltige E-Mail-Adresse'),
  phone: z.string().min(5, 'Telefonnummer muss mindestens 5 Zeichen haben'),
  zip: z.string().min(4, 'PLZ muss mindestens 4 Zeichen haben'),
  city: z.string().min(2, 'Stadt muss mindestens 2 Zeichen haben'),
  callTime: z.string().optional(),
  position: z.string().min(1, 'Position ist erforderlich'),
  employers: z.string().optional(), // JSON-String
  aboutYou: z.string().optional(),
  jobTitle: z.string().min(1),
  jobSlug: z.string().optional(),
  contactEmail: z.string().email().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Felder extrahieren
    const fields: Record<string, string> = {}
    formData.forEach((value, key) => {
      if (typeof value === 'string') {
        fields[key] = value
      }
    })

    // Validierung
    const result = applicationSchema.safeParse(fields)
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Validierungsfehler', details: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = result.data

    // Arbeitgeber parsen
    let employers: { employer: string; period: string; role: string }[] = []
    if (data.employers) {
      try {
        employers = JSON.parse(data.employers)
      } catch {
        // Ignorieren wenn nicht parsebar
      }
    }

    // Lebenslauf verarbeiten
    let attachment: { content: string; filename: string; type: string } | undefined
    const file = formData.get('resume') as File | null
    if (file && file.size > 0) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, error: 'Datei ist zu gross (max. 25 MB)' },
          { status: 400 }
        )
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: 'Nur PDF, DOC und DOCX erlaubt' },
          { status: 400 }
        )
      }

      const buffer = Buffer.from(await file.arrayBuffer())
      attachment = {
        content: buffer.toString('base64'),
        filename: file.name,
        type: file.type,
      }
    }

    // Empfaenger-Kaskade: Job-E-Mail → Sanity Notifications → Env-Fallback
    const notifications = await getNotifications()
    const recipientEmail =
      data.contactEmail ||
      notifications?.bewerbungenEmail ||
      process.env.SENDGRID_FROM_EMAIL

    if (!recipientEmail) {
      return NextResponse.json(
        { success: false, error: 'E-Mail-Service ist nicht konfiguriert' },
        { status: 500 }
      )
    }

    const applicationData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      zip: data.zip,
      city: data.city,
      callTime: data.callTime,
      position: data.position,
      employers,
      aboutYou: data.aboutYou,
      jobTitle: data.jobTitle,
    }

    await sendApplicationEmail(applicationData, recipientEmail, attachment)

    // ─── In Sanity speichern ───
    if (client) {
      try {
        const now = new Date()
        const expiresAt = new Date(now)
        expiresAt.setMonth(expiresAt.getMonth() + 6)

        // Lebenslauf als File-Asset hochladen
        let resumeAsset: { _id: string } | undefined
        if (file && file.size > 0) {
          const buffer = Buffer.from(await file.arrayBuffer())
          resumeAsset = await client.assets.upload('file', buffer, {
            filename: file.name,
            contentType: file.type,
          })
        }

        // Job-Reference per Slug nachschlagen
        let jobReference: { _type: 'reference'; _ref: string } | undefined
        if (data.jobSlug) {
          const job = await client.fetch<{ _id: string } | null>(
            `*[_type == "job" && slug.current == $slug][0]{_id}`,
            { slug: data.jobSlug }
          )
          if (job) {
            jobReference = { _type: 'reference', _ref: job._id }
          }
        }

        await client.create({
          _type: 'bewerbung',
          applicantName: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone,
          address: `${data.zip} ${data.city}`,
          callTime: data.callTime || undefined,
          position: data.position,
          jobReference,
          employers: employers.length > 0
            ? employers.map((e) => ({ _type: 'object', _key: crypto.randomUUID(), ...e }))
            : undefined,
          aboutYou: data.aboutYou || undefined,
          resume: resumeAsset
            ? { _type: 'file', asset: { _type: 'reference', _ref: resumeAsset._id } }
            : undefined,
          status: 'neu',
          submittedAt: now.toISOString(),
          expiresAt: expiresAt.toISOString(),
        })
      } catch (err) {
        // Sanity-Speicherung darf den E-Mail-Versand nicht blockieren
        console.error('Sanity create bewerbung error:', err)
      }
    }

    // Optional: Slack-Benachrichtigung
    if (notifications?.bewerbungenSlack) {
      fetch(notifications.bewerbungenSlack, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `Neue Bewerbung: ${data.position} – ${data.firstName} ${data.lastName} (${data.email})`,
        }),
      }).catch(() => {})
    }

    // Optional: Externer Webhook
    if (notifications?.bewerbungenWebhook) {
      fetch(notifications.bewerbungenWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'bewerbung', ...applicationData }),
      }).catch(() => {})
    }

    return NextResponse.json({ success: true, message: 'Bewerbung erfolgreich gesendet' })
  } catch (error) {
    console.error('Application form error:', error)
    return NextResponse.json(
      { success: false, error: 'Ein Fehler ist aufgetreten. Bitte versuche es spaeter erneut.' },
      { status: 500 }
    )
  }
}
