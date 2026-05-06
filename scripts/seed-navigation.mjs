/**
 * Seed-Skript: legt den Navigation-Singleton in Sanity an
 * (Hauptnavigation + Footer-Navigation).
 * Aufruf: node --env-file=.env.local scripts/seed-navigation.mjs
 */
import { createClient } from '@sanity/client'
import { randomUUID } from 'node:crypto'

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

const k = () => randomUUID().replace(/-/g, '').slice(0, 12)

const mainNav = [
  { label: 'Pflegekräfte', href: '/pflegekraefte' },
  { label: 'Einrichtungen', href: '/einrichtungen' },
  { label: 'Gehaltsrechner', href: '/gehaltsrechner' },
  { label: 'Magazin', href: '/magazin' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Über uns', href: '/ueber-uns' },
]

const footerNav = [
  { label: 'Wofür wir stehen', href: '/ueber-uns' },
  { label: 'Magazin', href: '/magazin' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Kontakt', href: '/kontakt' },
]

const doc = {
  _id: 'navigation',
  _type: 'navigation',
  mainNav: mainNav.map((i) => ({
    _key: k(),
    _type: 'navItem',
    label: i.label,
    href: i.href,
    openInNewTab: false,
  })),
  footerNav: footerNav.map((i) => ({
    _key: k(),
    _type: 'navItem',
    label: i.label,
    href: i.href,
    openInNewTab: false,
  })),
}

console.log(`Schreibe Navigation-Singleton (project: ${projectId}, dataset: ${dataset})...`)
await client.createOrReplace(doc)
console.log(`  [OK] mainNav: ${mainNav.length} Items`)
console.log(`  [OK] footerNav: ${footerNav.length} Items`)
console.log('')
console.log(`Editier-Link: https://www.sanity.io/manage/project/${projectId}`)
