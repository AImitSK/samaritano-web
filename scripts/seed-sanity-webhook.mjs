/**
 * Legt einen GROQ-Webhook in Sanity an, der bei jeder Inhaltsaenderung
 * die Next.js-Revalidate-Route aufruft.
 *
 * Aufruf: node --env-file=.env.local scripts/seed-sanity-webhook.mjs
 *
 * Auth: erfordert den Sanity-CLI-Auth-Token aus
 *   ~/.config/sanity/config.json (auto-eingelesen).
 *   Falls nicht vorhanden: `npx sanity login` einmalig laufen lassen.
 */
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET
const targetUrl =
  process.env.WEBHOOK_TARGET_URL ||
  'https://samaritano-web.vercel.app/api/revalidate'

if (!projectId) {
  console.error('NEXT_PUBLIC_SANITY_PROJECT_ID fehlt.')
  process.exit(1)
}
if (!revalidateSecret) {
  console.error('SANITY_REVALIDATE_SECRET fehlt — wird als HMAC-Secret benoetigt.')
  process.exit(1)
}

// CLI-Auth-Token aus ~/.config/sanity/config.json holen
let authToken
try {
  const cfgPath = join(homedir(), '.config', 'sanity', 'config.json')
  const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'))
  authToken = cfg?.authToken
} catch (e) {
  console.error('Sanity CLI Config nicht lesbar:', e.message)
  process.exit(1)
}
if (!authToken) {
  console.error(
    'Kein Auth-Token in ~/.config/sanity/config.json. Bitte einmal `npx sanity login` ausfuehren.'
  )
  process.exit(1)
}

const HOOK = {
  type: 'document',
  name: 'Frontend revalidation',
  description:
    'Triggert /api/revalidate bei jeder Aenderung an Content-Dokumenten.',
  url: targetUrl,
  rule: {
    on: ['create', 'update', 'delete'],
    projection: '{_type, _id, slug}',
  },
  httpMethod: 'POST',
  apiVersion: 'v2021-03-25',
  includeDrafts: false,
  includeAllVersions: false,
  secret: revalidateSecret,
  headers: {},
  dataset,
}

console.log(`Listing existing hooks for project ${projectId}...`)
const listRes = await fetch(`https://api.sanity.io/v2024-01-01/hooks/projects/${projectId}`, {
  headers: { Authorization: `Bearer ${authToken}` },
})
const listText = await listRes.text()
if (!listRes.ok) {
  console.error(`List failed: HTTP ${listRes.status}: ${listText}`)
  process.exit(1)
}
const existing = JSON.parse(listText)
console.log(`Found ${existing.length} existing hook(s).`)
for (const h of existing) {
  console.log(`  - ${h.id}  ${h.name}  -> ${h.url}`)
}

// Wenn ein Hook mit derselben Ziel-URL existiert, ueberschreiben wir ihn (PUT).
const sameTarget = existing.find((h) => h.url === targetUrl)
let res
if (sameTarget) {
  console.log(`\nExisting hook with same URL found (${sameTarget.id}). Updating...`)
  res = await fetch(
    `https://api.sanity.io/v2024-01-01/hooks/projects/${projectId}/${sameTarget.id}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(HOOK),
    }
  )
} else {
  console.log(`\nCreating new hook...`)
  res = await fetch(`https://api.sanity.io/v2024-01-01/hooks/projects/${projectId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(HOOK),
  })
}

const text = await res.text()
if (!res.ok) {
  console.error(`Failed: HTTP ${res.status}`)
  console.error(text)
  process.exit(1)
}
const result = JSON.parse(text)
console.log(`\n[OK] Webhook ${sameTarget ? 'updated' : 'created'}:`)
console.log(`  id:       ${result.id}`)
console.log(`  name:     ${result.name}`)
console.log(`  url:      ${result.url}`)
console.log(`  on:       ${result.on}`)
console.log(`  filter:   ${result.filter}`)
console.log(`  enabled:  ${result.isDisabled === false ? 'yes' : (result.isDisabled === true ? 'no' : 'unknown')}`)
