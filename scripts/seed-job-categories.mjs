/**
 * Seed-Skript: legt Stellen-Kategorien in Sanity an.
 * Aufruf: node --env-file=.env.local scripts/seed-job-categories.mjs
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

const TITLES = [
  'Altenpfleger',
  'Anästhesietechnischer Assistent',
  'Fachkrankenpfleger',
  'Gesundheits- und Krankenpfleger',
  'Minijobs',
  'Operationstechnischer Assistent',
  'Pflegefachkraft',
  'Top-Angebot',
]

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

console.log(`Schreibe Stellen-Kategorien (project: ${projectId}, dataset: ${dataset})...`)
for (const title of TITLES) {
  const slug = slugify(title)
  const doc = {
    _id: `jobCategory-${slug}`,
    _type: 'jobCategory',
    title,
    slug: { _type: 'slug', current: slug },
  }
  await client.createOrReplace(doc)
  console.log(`  [OK] ${title}  (id: ${doc._id})`)
}
console.log('')
console.log(`Fertig. Editier-Link: https://www.sanity.io/manage/project/${projectId}`)
