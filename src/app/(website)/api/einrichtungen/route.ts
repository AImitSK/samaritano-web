import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendEinrichtungenAnfrageEmail } from '@/lib/sendgrid'

const anfrageSchema = z.object({
  einrichtung: z.string().min(2, 'Einrichtungsname ist erforderlich'),
  kontakt: z.string().min(2, 'Ansprechpartner ist erforderlich'),
  email: z.string().email('Ungueltige E-Mail-Adresse'),
  telefon: z.string().optional(),
  interesse: z.string().optional(),
  anliegen: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = anfrageSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validierungsfehler', details: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    await sendEinrichtungenAnfrageEmail(result.data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Einrichtungen-Anfrage error:', error)
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es spaeter erneut.' },
      { status: 500 }
    )
  }
}
