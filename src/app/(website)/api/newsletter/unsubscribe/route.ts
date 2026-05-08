import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/client'

export async function GET(request: NextRequest) {
  // Redirect bleibt auf der Domain, über die der Request reinkam
  const siteUrl = request.nextUrl.origin
  const token = request.nextUrl.searchParams.get('token')

  if (!token || !client) {
    return NextResponse.redirect(`${siteUrl}/newsletter/abmelden?status=error`)
  }

  try {
    const params = { token }
    const subscriber = (await client.fetch(
      `*[_type == "newsletterSubscriber" && unsubscribeToken == $token][0]{ _id }`,
      params as Record<string, string>
    )) as { _id: string } | null

    if (!subscriber) {
      return NextResponse.redirect(`${siteUrl}/newsletter/abmelden?status=error`)
    }

    await client.patch(subscriber._id).set({
      status: 'abgemeldet',
      unsubscribedAt: new Date().toISOString(),
    }).commit()

    return NextResponse.redirect(`${siteUrl}/newsletter/abmelden?status=success`)
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error)
    return NextResponse.redirect(`${siteUrl}/newsletter/abmelden?status=error`)
  }
}
