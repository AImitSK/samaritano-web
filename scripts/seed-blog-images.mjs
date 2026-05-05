/**
 * Seed-Skript: laedt og:image jedes Posts von samaritano.de,
 * uploadet als Sanity-Asset, patcht mainImage am Post.
 * Aufruf: node --env-file=.env.local scripts/seed-blog-images.mjs
 */
import { createClient } from '@sanity/client'
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

const POSTS = [
  { slug: 'fachkraeftemangel-anaesthesiepflege-beste-karten', url: 'https://samaritano.de/2026/03/17/fachkraeftemangel-in-der-anaesthesiepflege-warum-du-gerade-die-besten-karten-hast/' },
  { slug: 'du-liebst-die-pflege-bedingungen-zermuerben', url: 'https://samaritano.de/2026/03/17/du-liebst-die-pflege-aber-die-bedingungen-zermuerben-dich/' },
  { slug: 'samaritano-vs-andere-christliche-zeitarbeit', url: 'https://samaritano.de/2025/06/05/samaritano-vs-andere-warum-unser-ansatz-fuer-christliche-zeitarbeit-anders-ist/' },
  { slug: 'gemeinschaft-im-glauben-pflegealltag', url: 'https://samaritano.de/2025/05/27/gemeinschaft-im-glauben-wie-der-austausch-mit-christlichen-kollegen-im-pflegealltag-staerkt/' },
  { slug: 'work-life-balance-pflege-5-tipps', url: 'https://samaritano.de/2025/05/10/work-life-balance-in-der-pflege-mehr-als-ein-wunschtraum-5-tipps-fuer-christliche-pflegekraefte/' },
  { slug: 'pflege-als-berufung-glauben-im-alltag', url: 'https://samaritano.de/2025/04/30/mehr-als-nur-ein-job-pflege-als-berufung-den-glauben-im-berufsalltag-leben/' },
  { slug: 'zeitarbeit-pflege-mythos-vs-realitaet', url: 'https://samaritano.de/2025/04/24/zeitarbeit-pflege-mythos-vs-realitaet-warum-es-fuer-werteorientierte-pflegekraefte-eine-echte-chance-sein-kann/' },
  { slug: 'pflege-am-limit-5-wege-christliche-werte', url: 'https://samaritano.de/2025/04/19/pflege-am-limit-5-wege-wie-christliche-werte-im-joballtag-neue-kraft-geben-koennen/' },
  { slug: 'vielfalt-der-pflegeberufe-uebersicht', url: 'https://samaritano.de/2024/07/27/die-vielfalt-der-pflegeberufe-eine-uebersicht/' },
  { slug: 'einfuehrung-pflegeberufegesetz-2020', url: 'https://samaritano.de/2024/07/27/einfuehrung-zum-pflegeberufegesetz-vom-1-januar-2020/' },
  { slug: 'beste-zeitarbeitsfirma-pflege-finden', url: 'https://samaritano.de/2023/10/03/die-beste-zeitarbeitsfirma-in-der-pflege-finden/' },
]

const UA = 'Mozilla/5.0 (compatible; samaritano-migration/1.0)'

function extractOgImage(html) {
  // Verschiedene Reihenfolgen attr=value
  const patterns = [
    /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i,
    /<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i,
    /<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i,
  ]
  for (const re of patterns) {
    const m = html.match(re)
    if (m) return m[1]
  }
  return null
}

console.log(`Lade Bilder fuer ${POSTS.length} Posts...\n`)
let ok = 0
let fail = 0

for (const post of POSTS) {
  try {
    const htmlRes = await fetch(post.url, { headers: { 'User-Agent': UA } })
    if (!htmlRes.ok) throw new Error(`HTTP ${htmlRes.status} fuer ${post.url}`)
    const html = await htmlRes.text()

    const imgUrl = extractOgImage(html)
    if (!imgUrl) {
      console.warn(`  [SKIP] ${post.slug} — kein og:image gefunden`)
      fail++
      continue
    }

    const imgRes = await fetch(imgUrl, { headers: { 'User-Agent': UA } })
    if (!imgRes.ok) throw new Error(`Image HTTP ${imgRes.status}`)
    const buf = Buffer.from(await imgRes.arrayBuffer())

    const filename = (imgUrl.split('/').pop() || `${post.slug}.jpg`).split('?')[0]
    const asset = await client.assets.upload('image', buf, { filename })

    await client
      .patch(`post-${post.slug}`)
      .set({
        mainImage: {
          _type: 'image',
          asset: { _type: 'reference', _ref: asset._id },
        },
      })
      .commit()

    ok++
    const kb = Math.round(buf.length / 1024)
    console.log(`  [${ok}/${POSTS.length}] ${post.slug}  (${kb} KB, ${asset._id})`)
  } catch (e) {
    fail++
    console.warn(`  [FAIL] ${post.slug}: ${e.message}`)
  }
}

console.log(`\nFertig. ${ok} OK, ${fail} fehlgeschlagen.`)
