/**
 * Verdrahtungs-Audit: zählt Dokumente pro _type in Sanity.
 * Aufruf: node --env-file=.env.local scripts/audit-sanity.mjs
 */
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error('NEXT_PUBLIC_SANITY_PROJECT_ID oder SANITY_API_TOKEN fehlt.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

const types = [
  'settings',
  'navigation',
  'post',
  'category',
  'job',
  'jobCategory',
  'faq',
  'faqCategory',
  'legal',
]

const result = await client.fetch(
  `{${types.map((t) => `"${t}": count(*[_type == "${t}"])`).join(',\n')}}`
)

console.log('Document counts per _type:')
console.log('')
for (const t of types) {
  const n = result[t] ?? 0
  const status = n === 0 ? '⛔ EMPTY' : n === 1 ? '✓' : `✓ (${n})`
  console.log(`  ${t.padEnd(20)} ${String(n).padStart(4)}  ${status}`)
}

