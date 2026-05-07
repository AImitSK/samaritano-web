import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/client'

// Vercel Cron setzt automatisch den CRON_SECRET Header
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!client) {
    return NextResponse.json({ error: 'Sanity client not configured' }, { status: 500 })
  }

  try {
    // Abgelaufene Bewerbungen finden
    const expired = await client.fetch<{ _id: string; resumeRef?: string }[]>(
      `*[_type == "bewerbung" && expiresAt < now()]{
        _id,
        "resumeRef": resume.asset._ref
      }`
    )

    if (expired.length === 0) {
      return NextResponse.json({ deleted: 0, message: 'Keine abgelaufenen Bewerbungen' })
    }

    // Dokumente und zugehoerige Assets loeschen
    const transaction = client.transaction()

    for (const doc of expired) {
      transaction.delete(doc._id)
      // Lebenslauf-Asset auch loeschen
      if (doc.resumeRef) {
        transaction.delete(doc.resumeRef)
      }
    }

    await transaction.commit()

    console.log(`[cleanup] ${expired.length} abgelaufene Bewerbung(en) geloescht`)

    return NextResponse.json({
      deleted: expired.length,
      message: `${expired.length} Bewerbung(en) geloescht (DSGVO 6-Monats-Frist)`,
    })
  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json(
      { error: 'Fehler beim Aufraeumen' },
      { status: 500 }
    )
  }
}
