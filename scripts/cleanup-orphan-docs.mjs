/**
 * Cleanup-Skript: löscht verwaiste Documents aus Sanity, deren Schema-Type
 * im Code entfernt wurde (page, blogSettings, news, team, download, milestone).
 * Aufruf: node --env-file=.env.local scripts/cleanup-orphan-docs.mjs
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

const ORPHAN_TYPES = ['page', 'blogSettings', 'news', 'team', 'download', 'milestone']

console.log(`Cleanup verwaiste Docs (project: ${projectId}, dataset: ${dataset})...`)
console.log('')

let total = 0
for (const type of ORPHAN_TYPES) {
  const docs = await client.fetch(`*[_type == $type]{ _id }`, { type })
  if (docs.length === 0) {
    console.log(`  ${type.padEnd(15)} keine Docs vorhanden`)
    continue
  }
  console.log(`  ${type.padEnd(15)} ${docs.length} Doc(s) wird gelöscht`)
  for (const d of docs) {
    await client.delete(d._id)
    console.log(`    [DEL] ${d._id}`)
    total++
  }
}

console.log('')
console.log(`Fertig: ${total} verwaiste Doc(s) gelöscht.`)
