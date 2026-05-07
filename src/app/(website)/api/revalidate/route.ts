import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

// Sanity Webhook → On-Demand Revalidation
// Jede Änderung in Sanity triggert diesen Endpoint und
// invalidiert die betroffenen Cache-Tags sofort.

const secret = process.env.SANITY_REVALIDATE_SECRET

export async function POST(req: NextRequest) {
  try {
    if (!secret) {
      return NextResponse.json(
        { message: 'SANITY_REVALIDATE_SECRET nicht konfiguriert' },
        { status: 500 }
      )
    }

    const { isValidSignature, body } = await parseBody<{
      _type: string
      _id: string
      slug?: { current: string }
    }>(req, secret)

    if (!isValidSignature) {
      return NextResponse.json({ message: 'Ungültige Signatur' }, { status: 401 })
    }

    console.log('[revalidate] body:', JSON.stringify(body))

    if (!body?._type) {
      console.log('[revalidate] kein _type im body')
      return NextResponse.json({ message: 'Kein _type im Body' }, { status: 400 })
    }

    // Revalidiere nach Dokumenttyp
    const type = body._type
    const tags: string[] = [type]

    // Spezifische Tags für einzelne Dokumente
    if (body.slug?.current) {
      tags.push(`${type}:${body.slug.current}`)
    }

    // Singletons beeinflussen alle Seiten
    if (['settings', 'navigation', 'blogSettings'].includes(type)) {
      tags.push('settings')
      tags.push('navigation')
      tags.push('blogSettings')
    }

    // Navigation + Layout bei Seitenänderungen
    if (type === 'page') {
      tags.push('navigation')
    }

    // Alle Tags revalidieren
    for (const tag of tags) {
      console.log(`[revalidate] revalidateTag('${tag}')`)
      revalidateTag(tag)
    }

    console.log('[revalidate] done, tags:', tags)

    return NextResponse.json({
      revalidated: true,
      tags,
      now: Date.now(),
    })
  } catch (err) {
    console.error('Revalidation error:', err)
    return NextResponse.json(
      { message: 'Fehler bei Revalidation' },
      { status: 500 }
    )
  }
}
