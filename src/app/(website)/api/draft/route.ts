import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug') || '/'

  // Validate secret
  if (!process.env.PREVIEW_SECRET) {
    return new Response('PREVIEW_SECRET is not configured', { status: 500 })
  }

  if (secret !== process.env.PREVIEW_SECRET) {
    return new Response('Invalid secret', { status: 401 })
  }

  draftMode().enable()
  redirect(slug)
}
