import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createHash } from 'crypto'
import { client } from '@/sanity/client'
import { sendNewsletterConfirmEmail } from '@/lib/sendgrid'

const subscribeSchema = z.object({
  salutation: z.enum(['Herr', 'Frau', 'Divers'], { required_error: 'Bitte Anrede waehlen' }),
  firstName: z.string().min(2, 'Vorname muss mindestens 2 Zeichen haben'),
  lastName: z.string().min(2, 'Nachname muss mindestens 2 Zeichen haben'),
  email: z.string().email('Ungueltige E-Mail-Adresse'),
  source: z.string().optional(),
  datenschutz: z.literal(true, { errorMap: () => ({ message: 'Bitte Datenschutz akzeptieren' }) }),
})

function emailToId(email: string): string {
  const hash = createHash('sha256').update(email.toLowerCase().trim()).digest('hex').slice(0, 12)
  return `newsletter-${hash}`
}

export async function POST(request: NextRequest) {
  try {
    if (!client) {
      return NextResponse.json({ success: false, error: 'Server nicht konfiguriert' }, { status: 500 })
    }

    const body = await request.json()
    const result = subscribeSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Validierungsfehler', details: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = result.data
    const docId = emailToId(data.email)

    // Pruefen ob Subscriber bereits existiert
    const existing = (await client.fetch(
      `*[_type == "newsletterSubscriber" && _id == $id][0]{ _id, status }`,
      { id: docId }
    )) as { _id: string; status: string } | null

    const confirmToken = crypto.randomUUID()
    const unsubscribeToken = crypto.randomUUID()

    if (existing) {
      if (existing.status === 'aktiv') {
        return NextResponse.json({
          success: true,
          message: 'Du bist bereits fuer unseren Newsletter angemeldet.',
        })
      }

      // Status ausstehend oder abgemeldet: Tokens erneuern, erneut bestaetigen
      await client.patch(docId).set({
        salutation: data.salutation,
        firstName: data.firstName,
        lastName: data.lastName,
        confirmToken,
        unsubscribeToken,
        status: 'ausstehend',
        subscribedAt: new Date().toISOString(),
        confirmedAt: undefined,
        unsubscribedAt: undefined,
        source: data.source || 'homepage',
      }).commit()
    } else {
      await client.create({
        _id: docId,
        _type: 'newsletterSubscriber',
        salutation: data.salutation,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email.toLowerCase().trim(),
        confirmToken,
        unsubscribeToken,
        status: 'ausstehend',
        subscribedAt: new Date().toISOString(),
        source: data.source || 'homepage',
      })
    }

    await sendNewsletterConfirmEmail({
      firstName: data.firstName,
      email: data.email.toLowerCase().trim(),
      confirmToken,
    })

    return NextResponse.json({
      success: true,
      message: 'Wir haben dir eine Bestaetigungsmail gesendet. Bitte pruefe dein Postfach.',
    })
  } catch (error) {
    console.error('Newsletter subscribe error:', error)
    return NextResponse.json(
      { success: false, error: 'Ein Fehler ist aufgetreten. Bitte versuche es spaeter erneut.' },
      { status: 500 }
    )
  }
}
