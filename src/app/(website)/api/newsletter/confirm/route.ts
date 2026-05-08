import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/client'
import { sendNewsletterWelcomeEmail } from '@/lib/sendgrid'

export async function GET(request: NextRequest) {
  // Niemals localhost in Redirect-URLs verwenden
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL
  const siteUrl = rawUrl && !rawUrl.includes('localhost') ? rawUrl : 'https://samaritano.de'
  const token = request.nextUrl.searchParams.get('token')

  if (!token || !client) {
    return NextResponse.redirect(`${siteUrl}/newsletter/bestaetigen?status=error`)
  }

  try {
    const params = { token }
    const subscriber = (await client.fetch(
      `*[_type == "newsletterSubscriber" && confirmToken == $token][0]{ _id, firstName, email, status, unsubscribeToken }`,
      params as Record<string, string>
    )) as { _id: string; firstName: string; email: string; status: string; unsubscribeToken: string } | null

    if (!subscriber) {
      return NextResponse.redirect(`${siteUrl}/newsletter/bestaetigen?status=error`)
    }

    if (subscriber.status === 'aktiv') {
      return NextResponse.redirect(`${siteUrl}/newsletter/bestaetigen?status=already`)
    }

    await client.patch(subscriber._id).set({
      status: 'aktiv',
      confirmedAt: new Date().toISOString(),
    }).commit()

    await sendNewsletterWelcomeEmail({
      firstName: subscriber.firstName,
      email: subscriber.email,
      unsubscribeToken: subscriber.unsubscribeToken,
    })

    return NextResponse.redirect(`${siteUrl}/newsletter/bestaetigen?status=success`)
  } catch (error) {
    console.error('Newsletter confirm error:', error)
    return NextResponse.redirect(`${siteUrl}/newsletter/bestaetigen?status=error`)
  }
}
