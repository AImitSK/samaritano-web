import { createClient, type SanityClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImage } from '@/types'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = '2024-01-01'
const token = process.env.SANITY_API_TOKEN

// Production client (CDN, published content only — Drafts werden ausgeblendet)
export const client: SanityClient | null = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: !token,
      token,
      perspective: 'published',
    })
  : null

// Preview client (no CDN, draft content)
export const previewClient: SanityClient | null = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token,
      perspective: 'previewDrafts',
    })
  : null

// Helper: returns the correct client based on preview mode
export function getClient(preview = false): SanityClient | null {
  return preview ? previewClient : client
}

export function urlFor(source: SanityImage) {
  if (!client) {
    console.warn('Sanity client not configured')
    return null
  }
  if (!source?.asset) {
    return null
  }
  const builder = imageUrlBuilder(client)
  return builder.image(source)
}

// Revalidation helper for on-demand ISR
export async function revalidateTag(tag: string) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    console.warn('SANITY_REVALIDATE_SECRET is not set')
    return
  }

  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate?tag=${tag}&secret=${secret}`
  await fetch(url, { method: 'POST' })
}
