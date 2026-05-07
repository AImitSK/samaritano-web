/**
 * Downloads portrait photos from Unsplash and uploads them as
 * images to the existing testimonial documents in Sanity.
 *
 * Usage: node --env-file=.env.local scripts/seed-testimonial-images.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

// CLI auth token
let token
try {
  const cfgPath = join(homedir(), '.config', 'sanity', 'config.json')
  const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'))
  token = cfg?.authToken
} catch (e) {
  console.error('Sanity CLI Config nicht lesbar:', e.message)
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

// Unsplash portrait photos of healthcare/nursing professionals
// These are free-to-use Unsplash photos (landscape links with ixid for tracking)
const PHOTOS = [
  // Sarah K. - Intensivpflegerin
  { docId: 'e7cda289-9c6c-479b-ae7c-9f26a6a2a079', url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=750&fit=crop&crop=face', alt: 'Sarah K., Intensivpflegerin' },
  // Thomas M. - Altenpfleger
  { docId: '424250a7-a4f1-4723-b4e1-03cafb328d27', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&h=750&fit=crop&crop=face', alt: 'Thomas M., Altenpfleger' },
  // Lena F. - OP-Schwester
  { docId: '83de3c02-1bda-49e2-8408-17f0b5804474', url: 'https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=600&h=750&fit=crop&crop=face', alt: 'Lena F., OP-Schwester' },
  // David O. - Pflegehelfer
  { docId: 'df7e3237-60cb-4082-8682-79872f02be86', url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=750&fit=crop&crop=face', alt: 'David O., Pflegehelfer' },
  // Miriam B. - Palliativpflegerin
  { docId: 'ec48016c-6089-4744-8f42-4f63730254b1', url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=750&fit=crop&crop=face', alt: 'Miriam B., Palliativpflegerin' },
  // Yusuf A. - Fachkrankenpfleger
  { docId: '2649dfbb-1880-42e1-a2e9-9a917851fad6', url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&h=750&fit=crop&crop=face', alt: 'Yusuf A., Fachkrankenpfleger' },
]

for (const photo of PHOTOS) {
  console.log(`Uploading image for ${photo.alt}...`)
  try {
    const res = await fetch(photo.url)
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
    const buffer = Buffer.from(await res.arrayBuffer())

    const asset = await client.assets.upload('image', buffer, {
      filename: `testimonial-${photo.docId}.jpg`,
      contentType: 'image/jpeg',
    })

    await client
      .patch(photo.docId)
      .set({
        image: {
          _type: 'image',
          alt: photo.alt,
          asset: { _type: 'reference', _ref: asset._id },
        },
      })
      .commit()

    console.log(`  ✓ ${photo.alt} → ${asset._id}`)
  } catch (err) {
    console.error(`  ✗ ${photo.alt}: ${err.message}`)
  }
}

console.log('\nDone!')
