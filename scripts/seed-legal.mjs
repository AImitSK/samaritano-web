/**
 * Seed-Skript: legt Impressum und Datenschutzerklaerung als Entwuerfe in Sanity an.
 * Lauft idempotent (createOrReplace bei festen _id).
 *
 * Aufruf:
 *   node --env-file=.env.local scripts/seed-legal.mjs
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

let blockKey = 0
const block = (children, style = 'normal') => ({
  _key: `b${++blockKey}`,
  _type: 'block',
  style,
  markDefs: [],
  children: (Array.isArray(children) ? children : [{ text: children }]).map((c, i) => ({
    _key: `c${blockKey}-${i}`,
    _type: 'span',
    text: c.text,
    marks: c.marks || [],
  })),
})
const h2 = (text) => block(text, 'h2')
const h3 = (text) => block(text, 'h3')
const p = (text) => block(text, 'normal')
const bullet = (text) => ({
  _key: `b${++blockKey}`,
  _type: 'block',
  style: 'normal',
  listItem: 'bullet',
  level: 1,
  markDefs: [],
  children: [{ _key: `c${blockKey}-0`, _type: 'span', text, marks: [] }],
})

const today = new Date().toISOString().slice(0, 10)

// ============================================================
// IMPRESSUM
// ============================================================
const impressumContent = [
  p(
    'Hinweis: Dieses Impressum ist ein Entwurf auf Basis von § 5 TMG. Vor Live-Gang anwaltlich pruefen lassen und alle mit XXX markierten Platzhalter durch echte Firmendaten ersetzen.'
  ),

  h2('Angaben gemaess § 5 TMG'),
  p('Samaritano GmbH'),
  p('Hohenstaufenring 62'),
  p('50674 Koeln'),

  h3('Vertreten durch'),
  p('Martin Schaefer (Geschaeftsfuehrer)'),

  h3('Kontakt'),
  p('Telefon: 0221 4711 200'),
  p('E-Mail: hallo@samaritano.de'),

  h3('Registereintrag'),
  p('Eintragung im Handelsregister'),
  p('Registergericht: Amtsgericht Koeln'),
  p('Registernummer: HRB XXXXXX'),

  h3('Umsatzsteuer-ID'),
  p('Umsatzsteuer-Identifikationsnummer gemaess § 27 a UStG: DE XXX XXX XXX'),

  h3('Erlaubnis zur Arbeitnehmerueberlassung'),
  p('Erlaubnis gem. § 1 AUEG erteilt durch:'),
  p('Bundesagentur fuer Arbeit, Regionaldirektion Nordrhein-Westfalen'),
  p('Josef-Goerres-Platz 5, 56068 Koblenz'),

  h3('Verantwortlich fuer den Inhalt nach § 55 Abs. 2 RStV'),
  p('Martin Schaefer'),
  p('Hohenstaufenring 62, 50674 Koeln'),

  h2('Streitschlichtung'),
  p(
    'Die Europaeische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr/. Unsere E-Mail-Adresse finden Sie oben im Impressum.'
  ),
  p(
    'Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.'
  ),

  h2('Haftung fuer Inhalte'),
  p(
    'Als Diensteanbieter sind wir gemaess § 7 Abs. 1 TMG fuer eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, uebermittelte oder gespeicherte fremde Informationen zu ueberwachen oder nach Umstaenden zu forschen, die auf eine rechtswidrige Taetigkeit hinweisen.'
  ),
  p(
    'Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberuehrt. Eine diesbezuegliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung moeglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.'
  ),

  h2('Haftung fuer Links'),
  p(
    'Unser Angebot enthaelt Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb koennen wir fuer diese fremden Inhalte auch keine Gewaehr uebernehmen. Fuer die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.'
  ),

  h2('Urheberrecht'),
  p(
    'Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfaeltigung, Bearbeitung, Verbreitung und jede Art der Verwertung ausserhalb der Grenzen des Urheberrechtes beduerfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.'
  ),
]

// ============================================================
// DATENSCHUTZERKLAERUNG
// ============================================================
const datenschutzContent = [
  p(
    'Hinweis: Diese Datenschutzerklaerung ist ein Entwurf. Vor Live-Gang muss sie anwaltlich gepruefr werden. Insbesondere die Liste der eingebundenen externen Dienste, die Speicherdauern und die rechtlichen Grundlagen sind auf den konkreten Anwendungsfall anzupassen.'
  ),

  h2('1. Verantwortlicher'),
  p('Verantwortlich fuer die Datenverarbeitung auf dieser Website ist:'),
  p('Samaritano GmbH'),
  p('Hohenstaufenring 62'),
  p('50674 Koeln'),
  p('E-Mail: datenschutz@samaritano.de'),
  p('Telefon: 0221 4711 200'),

  h2('2. Allgemeine Hinweise'),
  p(
    'Die folgenden Hinweise geben einen einfachen UEberblick darueber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persoenlich identifiziert werden koennen.'
  ),

  h2('3. Datenerfassung beim Besuch der Website'),

  h3('Server-Logfiles'),
  p(
    'Beim Aufruf dieser Website werden automatisch Informationen in sogenannten Server-Logfiles gespeichert, die Ihr Browser uebermittelt. Dies sind:'
  ),
  bullet('Browsertyp und Browserversion'),
  bullet('Verwendetes Betriebssystem'),
  bullet('Referrer URL'),
  bullet('Hostname des zugreifenden Rechners'),
  bullet('Uhrzeit der Serveranfrage'),
  bullet('IP-Adresse'),
  p(
    'Diese Daten sind nicht bestimmten Personen zuordenbar. Eine Zusammenfuehrung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer technisch fehlerfreien Darstellung).'
  ),

  h3('Hosting bei Vercel'),
  p(
    'Diese Website wird bei Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA gehostet. Vercel verarbeitet bei jedem Aufruf Server-Logfiles inkl. IP-Adresse zur Bereitstellung der Website. Die Datenuebermittlung in die USA stuetzt sich auf Standardvertragsklauseln gemaess Art. 46 Abs. 2 lit. c DSGVO. Weitere Informationen: https://vercel.com/legal/privacy-policy'
  ),

  h2('4. Cookies'),
  p(
    'Diese Website verwendet technisch notwendige Cookies, um die Funktionalitaet der Website sicherzustellen. Diese Cookies werden auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO gespeichert.'
  ),
  p(
    'Sofern auf dieser Website weitere Cookies (Analyse, Tracking) eingesetzt werden, erfolgt dies nur nach Ihrer ausdruecklichen Einwilligung gemaess Art. 6 Abs. 1 lit. a DSGVO. Sie koennen Ihre Cookie-Einstellungen jederzeit ueber den Link im Footer anpassen.'
  ),

  h2('5. Kontaktformular'),
  p(
    'Wenn Sie uns ueber das Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und fuer den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.'
  ),
  p(
    'Die Verarbeitung der in das Kontaktformular eingegebenen Daten erfolgt auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Sie koennen diese Einwilligung jederzeit widerrufen.'
  ),
  p(
    'Fuer den E-Mail-Versand nutzen wir den Dienst SendGrid (Twilio Inc., 375 Beale Street, Suite 300, San Francisco, CA 94105, USA). Auftragsverarbeitungsvertrag und Standardvertragsklauseln liegen vor.'
  ),

  h2('6. Inhalte aus dem Sanity Content-Management-System'),
  p(
    'Diese Website laedt Bilder und Inhalte ueber das Sanity Content Delivery Network (Sanity.io ApS, Vesterbrogade 1E, 1620 Kopenhagen, Daenemark). Beim Aufruf wird Ihre IP-Adresse an die Sanity-Server uebermittelt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.'
  ),

  h2('7. Schriftarten'),
  p(
    'Diese Website verwendet die Schriftarten Fraunces, Inter Tight und JetBrains Mono. Die Schriftarten werden lokal auf unserem Server bereitgestellt (Self-Hosting via Next.js Font-Optimization). Es findet keine Datenuebertragung an Google oder Dritte statt.'
  ),

  h2('8. Ihre Rechte'),
  p('Sie haben jederzeit das Recht, unentgeltlich Auskunft ueber Herkunft, Empfaenger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Daneben haben Sie folgende Rechte:'),
  bullet('Recht auf Auskunft (Art. 15 DSGVO)'),
  bullet('Recht auf Berichtigung (Art. 16 DSGVO)'),
  bullet('Recht auf Loeschung (Art. 17 DSGVO)'),
  bullet('Recht auf Einschraenkung der Verarbeitung (Art. 18 DSGVO)'),
  bullet('Recht auf Datenuebertragbarkeit (Art. 20 DSGVO)'),
  bullet('Widerspruchsrecht (Art. 21 DSGVO)'),
  bullet('Widerrufsrecht bei einwilligungsbasierter Verarbeitung (Art. 7 Abs. 3 DSGVO)'),
  p(
    'Hierzu sowie zu weiteren Fragen zum Thema personenbezogene Daten koennen Sie sich jederzeit unter datenschutz@samaritano.de an uns wenden.'
  ),

  h2('9. Beschwerderecht bei der Aufsichtsbehoerde'),
  p(
    'Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehoerde zu beschweren (Art. 77 DSGVO). Zustaendig ist:'
  ),
  p('Landesbeauftragte fuer Datenschutz und Informationsfreiheit Nordrhein-Westfalen'),
  p('Kavalleriestrasse 2-4, 40213 Duesseldorf'),
  p('https://www.ldi.nrw.de'),

  h2('10. Aenderungen dieser Datenschutzerklaerung'),
  p(
    'Wir behalten uns vor, diese Datenschutzerklaerung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um AEnderungen unserer Leistungen umzusetzen. Fuer Ihren erneuten Besuch gilt dann die neue Datenschutzerklaerung.'
  ),
]

// ============================================================
// Documents
// ============================================================
const impressum = {
  _id: 'legal-impressum',
  _type: 'legal',
  title: 'Impressum',
  slug: { _type: 'slug', current: 'impressum' },
  type: 'impressum',
  content: impressumContent,
  lastUpdated: today,
}

const datenschutz = {
  _id: 'legal-datenschutz',
  _type: 'legal',
  title: 'Datenschutzerklärung',
  slug: { _type: 'slug', current: 'datenschutz' },
  type: 'datenschutz',
  content: datenschutzContent,
  lastUpdated: today,
}

console.log(`Schreibe in Sanity (project: ${projectId}, dataset: ${dataset})...`)
const r1 = await client.createOrReplace(impressum)
console.log(`  [OK] Impressum: ${r1._id}`)
const r2 = await client.createOrReplace(datenschutz)
console.log(`  [OK] Datenschutz: ${r2._id}`)
console.log('')
console.log('Beide Dokumente liegen nun in Sanity. Editier-Link:')
console.log(`  https://www.sanity.io/manage/project/${projectId}`)
console.log('Oder im Studio dieses Projekts unter /studio.')
