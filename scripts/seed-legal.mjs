/**
 * Seed-Skript: legt Impressum + Datenschutz als Sanity-Dokumente an.
 * Idempotent (createOrReplace).
 * Aufruf: node --env-file=.env.local scripts/seed-legal.mjs
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

// Portable-Text-Helper
let k = 0
const blk = (text, style = 'normal') => ({
  _key: `b${++k}`,
  _type: 'block',
  style,
  markDefs: [],
  children: [{ _key: `c${k}`, _type: 'span', text, marks: [] }],
})
const li = (text) => ({
  _key: `b${++k}`,
  _type: 'block',
  style: 'normal',
  listItem: 'bullet',
  level: 1,
  markDefs: [],
  children: [{ _key: `c${k}`, _type: 'span', text, marks: [] }],
})
const h2 = (t) => blk(t, 'h2')
const h3 = (t) => blk(t, 'h3')
const p = (t) => blk(t, 'normal')

const today = new Date().toISOString().slice(0, 10)

// ============================================================
// IMPRESSUM (echte samaritano.de Daten)
// ============================================================
const impressum = [
  h2('Angaben gemaess Paragraf 5 TMG'),
  p('samaritano GmbH'),
  p('Von Oeynhausen Str. 34'),
  p('32479 Hille'),

  h3('Vertreten durch'),
  p('Geschaeftsfuehrung: Alexander Esau'),

  h3('Kontakt'),
  p('Telefon: +49 (0) 5717846640'),
  p('E-Mail: a.esau@samaritano.de'),

  h3('Registereintrag'),
  p('Registergericht: Amtsgericht Bad Oeynhausen'),
  p('Registernummer: HRB 18946'),

  h3('Umsatzsteuer-ID'),
  p('USt-IdNr. gemaess Paragraf 27a UStG: DE 360582153'),

  h3('Verantwortlich nach Paragraf 55 Abs. 2 RStV'),
  p('Alexander Esau, Von Oeynhausen Str. 34, 32479 Hille'),

  h2('Streitschlichtung'),
  p(
    'Plattform der EU zur Online-Streitbeilegung: https://ec.europa.eu/consumers/odr/. Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.'
  ),

  h2('Haftung fuer Inhalte und Links'),
  p(
    'Inhalte werden mit Sorgfalt erstellt. Fuer fremde Inhalte verlinkter Seiten ist deren jeweiliger Anbieter verantwortlich. Bei bekannt gewordenen Rechtsverletzungen werden wir entsprechende Inhalte umgehend entfernen.'
  ),

  h2('Urheberrecht'),
  p(
    'Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Vervielfaeltigung, Bearbeitung, Verbreitung und Verwertung beduerfen der schriftlichen Zustimmung des jeweiligen Autors.'
  ),
]

// ============================================================
// DATENSCHUTZ (projektspezifisches Geruest)
// ============================================================
const datenschutz = [
  p(
    'Hinweis fuer den Betreiber: Dieses Dokument ist ein technisches Geruest, das die auf dieser Website tatsaechlich eingebundenen Dienste auflistet. Den juristischen Volltext (Rechte der Betroffenen, Rechtsgrundlagen im Detail, Speicherdauern) bitte vom Datenschutzbeauftragten oder einem Anwalt ergaenzen lassen, dann diesen Hinweis loeschen.'
  ),

  h2('1. Verantwortlicher'),
  p('samaritano GmbH, Von Oeynhausen Str. 34, 32479 Hille'),
  p('E-Mail: a.esau@samaritano.de · Telefon: +49 (0) 5717846640'),

  h2('2. Hosting'),
  p(
    'Diese Website wird bei Vercel Inc. (340 S Lemon Ave #4133, Walnut, CA 91789, USA) gehostet. Beim Aufruf werden Server-Logfiles inkl. IP-Adresse verarbeitet. Datenuebermittlung in die USA auf Basis von Standardvertragsklauseln (Art. 46 DSGVO).'
  ),
  p('Datenschutzhinweise des Anbieters: https://vercel.com/legal/privacy-policy'),

  h2('3. Erfasste Daten beim Besuch'),
  p('Beim Aufruf werden folgende Daten in Server-Logfiles gespeichert:'),
  li('IP-Adresse'),
  li('Datum und Uhrzeit der Anfrage'),
  li('Browsertyp und Version'),
  li('Betriebssystem'),
  li('Referrer-URL'),
  p('Rechtsgrundlage: berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO).'),

  h2('4. Cookies und Cookie-Einwilligung'),
  p(
    'Diese Website verwendet ausschliesslich technisch notwendige Cookies. Die Einwilligung in optionale Kategorien (Analyse, Marketing) wird ueber unser Cookie-Banner eingeholt. Die Einstellungen koennen jederzeit ueber den Link "Cookie-Einstellungen" im Footer angepasst oder widerrufen werden.'
  ),
  p('Speicherort der Einwilligung: localStorage des Browsers, Schluessel "cookie-consent".'),

  h2('5. Kontaktformular'),
  p(
    'Bei Anfragen ueber das Kontaktformular werden die uebermittelten Angaben (Name, E-Mail, ggf. Telefon, Nachricht) zur Bearbeitung der Anfrage gespeichert. Rechtsgrundlage: Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) bzw. vorvertragliche Massnahmen (Art. 6 Abs. 1 lit. b DSGVO).'
  ),
  p(
    'Fuer den E-Mail-Versand nutzen wir SendGrid (Twilio Inc., 375 Beale Street, Suite 300, San Francisco, CA 94105, USA). Auftragsverarbeitungsvertrag liegt vor.'
  ),

  h2('6. Inhalte und Bilder via Sanity'),
  p(
    'Bilder und redaktionelle Inhalte werden ueber das Sanity Content Delivery Network ausgeliefert (Sanity.io ApS, Vesterbrogade 1E, 1620 Kopenhagen, Daenemark). Beim Laden wird die IP-Adresse an Sanity uebermittelt. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.'
  ),

  h2('7. Schriftarten'),
  p(
    'Verwendete Schriften: Fraunces, Inter Tight, JetBrains Mono. Die Auslieferung erfolgt lokal vom eigenen Server (Self-Hosting via Next.js Font-Optimization). Es findet keine Verbindung zu Google-Servern statt.'
  ),

  h2('8. Rechte der Betroffenen'),
  p('Sie haben das Recht auf:'),
  li('Auskunft (Art. 15 DSGVO)'),
  li('Berichtigung (Art. 16 DSGVO)'),
  li('Loeschung (Art. 17 DSGVO)'),
  li('Einschraenkung der Verarbeitung (Art. 18 DSGVO)'),
  li('Datenuebertragbarkeit (Art. 20 DSGVO)'),
  li('Widerspruch (Art. 21 DSGVO)'),
  li('Widerruf erteilter Einwilligungen (Art. 7 Abs. 3 DSGVO)'),
  p('Anfragen bitte per E-Mail an a.esau@samaritano.de.'),

  h2('9. Beschwerderecht'),
  p('Aufsichtsbehoerde fuer Nordrhein-Westfalen:'),
  p('Landesbeauftragte fuer Datenschutz und Informationsfreiheit NRW'),
  p('Kavalleriestrasse 2-4, 40213 Duesseldorf · https://www.ldi.nrw.de'),

  h2('10. Aenderungen'),
  p(
    'Wir passen diese Datenschutzerklaerung an, wenn sich rechtliche Vorgaben oder eingebundene Dienste aendern. Es gilt jeweils die aktuell auf dieser Seite veroeffentlichte Fassung.'
  ),
]

// ============================================================
// Schreiben
// ============================================================
const docs = [
  {
    _id: 'legal-impressum',
    _type: 'legal',
    title: 'Impressum',
    slug: { _type: 'slug', current: 'impressum' },
    type: 'impressum',
    content: impressum,
    lastUpdated: today,
  },
  {
    _id: 'legal-datenschutz',
    _type: 'legal',
    title: 'Datenschutzerklärung',
    slug: { _type: 'slug', current: 'datenschutz' },
    type: 'datenschutz',
    content: datenschutz,
    lastUpdated: today,
  },
]

console.log(`Schreibe in Sanity (project: ${projectId}, dataset: ${dataset})...`)
for (const d of docs) {
  await client.createOrReplace(d)
  console.log(`  [OK] ${d.title}  (${d._id})`)
}
console.log('')
console.log(`Studio: https://samaritano-web.vercel.app/studio`)
