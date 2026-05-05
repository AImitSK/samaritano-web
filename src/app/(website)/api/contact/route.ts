import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendContactFormEmail } from '@/lib/sendgrid'

const contactSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben'),
  email: z.string().email('Ungueltige E-Mail-Adresse'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Nachricht muss mindestens 10 Zeichen haben'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validierung
    const result = contactSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validierungsfehler',
          details: result.error.flatten().fieldErrors
        },
        { status: 400 }
      )
    }

    const recipientEmail = process.env.SENDGRID_FROM_EMAIL

    if (!recipientEmail) {
      console.error('SENDGRID_FROM_EMAIL is not configured')
      return NextResponse.json(
        {
          success: false,
          error: 'E-Mail-Service ist nicht konfiguriert'
        },
        { status: 500 }
      )
    }

    await sendContactFormEmail(result.data, recipientEmail)

    return NextResponse.json({
      success: true,
      message: 'Nachricht erfolgreich gesendet',
    })
  } catch (error) {
    console.error('Contact form error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es spaeter erneut.'
      },
      { status: 500 }
    )
  }
}
