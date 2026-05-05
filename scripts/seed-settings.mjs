/**
 * Seed-Skript: legt das Sanity-Settings-Dokument mit echten samaritano.de Daten an
 * inkl. Logo und Favicon als Sanity-Assets.
 * Aufruf: node --env-file=.env.local scripts/seed-settings.mjs
 */
import { createClient } from '@sanity/client'
import { readFile } from 'node:fs/promises'
import { Buffer } from 'node:buffer'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const token = process.env.SANITY_API_TOKEN
if (!projectId || !token) {
  console.error('SANITY-Env-Vars fehlen.'); process.exit(1)
}

const client = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

async function uploadAsset(buf, filename, contentType) {
  return await client.assets.upload('image', buf, { filename, contentType })
}

async function uploadAssetWithFallback(svgBuf, baseName) {
  try {
    return await uploadAsset(svgBuf, `${baseName}.svg`, 'image/svg+xml')
  } catch (e) {
    console.warn(`  SVG upload fuer ${baseName} fehlgeschlagen (${e.message}), versuche PNG...`)
    const sharp = (await import('sharp')).default
    const png = await sharp(svgBuf, { density: 300 }).resize(1200, null, { fit: 'inside' }).png().toBuffer()
    return await uploadAsset(png, `${baseName}.png`, 'image/png')
  }
}

// ─── Logo (lokales Asset) ───
console.log('Lade Logo aus public/uploads/...')
const logoSvg = await readFile('public/uploads/Logo-Samaritano-Web.svg')
const logoAsset = await uploadAssetWithFallback(logoSvg, 'samaritano-logo')
console.log(`  [OK] Logo: ${logoAsset._id}`)

// ─── Favicon (von samaritano.de) ───
console.log('Lade Favicon von samaritano.de...')
const faviconUrl = 'https://samaritano.de/wp-content/uploads/2024/03/Logo-Samaritano-Web.svg'
const faviconRes = await fetch(faviconUrl, { headers: { 'User-Agent': 'samaritano-seed/1.0' } })
const faviconBuf = Buffer.from(await faviconRes.arrayBuffer())
const faviconAsset = await uploadAssetWithFallback(faviconBuf, 'samaritano-favicon')
console.log(`  [OK] Favicon: ${faviconAsset._id}`)

// ─── Settings-Dokument ───
const settings = {
  _id: 'settings',
  _type: 'settings',
  title: 'Samaritano',
  description:
    'Samaritano vermittelt Pflegekräfte in christliche Einrichtungen, deren Werte zu deinen passen — mit Sinn, Flexibilität und fairer Bezahlung.',
  logo: {
    _type: 'image',
    asset: { _type: 'reference', _ref: logoAsset._id },
  },
  favicon: {
    _type: 'image',
    asset: { _type: 'reference', _ref: faviconAsset._id },
  },
  contactEmail: 'a.esau@samaritano.de',
  contactPhone: '+49 5717846640',
  address: 'samaritano GmbH\nVon Oeynhausen Str. 34\n32479 Hille',
  socialLinks: [
    {
      _key: 'fb',
      platform: 'facebook',
      url: 'https://www.facebook.com/samaritanogmbh',
    },
    {
      _key: 'ig',
      platform: 'instagram',
      url: 'https://www.instagram.com/samaritano_gmbh/',
    },
  ],
}

console.log('Schreibe Settings-Dokument...')
const result = await client.createOrReplace(settings)
console.log(`  [OK] settings: ${result._id}`)
console.log('\nFertig.')
