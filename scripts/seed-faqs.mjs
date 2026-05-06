/**
 * Seed-Skript: legt FAQ-Kategorien + FAQ-Einträge in Sanity an.
 * Quelle: https://samaritano.de/magazin/faq/ (Stand 2026-05-06)
 * Aufruf: node --env-file=.env.local scripts/seed-faqs.mjs
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

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)

// Kategorien: Reihenfolge entspricht der alten /magazin/faq-Seite
const CATEGORIES = [
  {
    title: 'Für Pflegekräfte',
    slug: 'pflegekraefte',
    description:
      'Bewerbung, Vergütung, Arbeitszeiten, Unterstützung im Einsatz — alles, was du als Pflegekraft wissen willst.',
    order: 10,
    pageContext: 'pflegekraefte',
  },
  {
    title: 'Für Einrichtungen',
    slug: 'einrichtungen',
    description:
      'Ansprechpartner, Buchungs- und Kündigungsfristen, Verfügbarkeit — die wichtigsten Konditionen für Häuser auf einen Blick.',
    order: 20,
    pageContext: 'einrichtungen',
  },
  {
    title: 'Stellenangebote',
    slug: 'stellenangebote',
    description:
      'Wie der Bewerbungsprozess auf eine Stelle abläuft, Festanstellung, Initiativbewerbung und vieles mehr.',
    order: 30,
    pageContext: '',
  },
  {
    title: 'Minijobs',
    slug: 'minijobs',
    description:
      'Was Minijobs in der Pflege bei Samaritano bedeuten, welche Bereiche wir abdecken und welche Vorteile es gibt.',
    order: 40,
    pageContext: '',
  },
]

// Antworten: jeder String wird als ein Portable-Text-Block (Absatz) angelegt.
// Bei mehreren Absätzen einfach Array von Strings.
const FAQS = [
  // ─── Für Pflegekräfte ───
  {
    question: 'Wie geht es nach meiner Bewerbung weiter?',
    category: 'pflegekraefte',
    order: 10,
    answer: [
      'Nachdem du deine Bewerbung eingereicht hast, prüft unser Team sie schnellstmöglich. Kurz darauf melden wir uns bei dir, um ein persönliches Gespräch zu vereinbaren. In diesem Gespräch klären wir alle Details, beantworten deine Fragen und besprechen deine möglichen Einsatzmöglichkeiten. Unser Ziel ist es, dich schnell und unkompliziert in unser Team aufzunehmen.',
    ],
  },
  {
    question: 'Welche Unterstützung erhalte ich während meiner Einsätze?',
    category: 'pflegekraefte',
    order: 20,
    answer: [
      'Während deiner Einsätze steht dir unser Team jederzeit zur Seite. Wir bieten regelmäßige Feedbackgespräche und unterstützen dich bei allen Fragen und Herausforderungen.',
    ],
  },
  {
    question: 'Wie wird meine Vergütung bei samaritano geregelt?',
    category: 'pflegekraefte',
    order: 30,
    answer: [
      'Deine Vergütung basiert auf einer fairen und transparenten Lohnstruktur, die deiner Qualifikation und Erfahrung gerecht wird. Zudem bieten wir zusätzliche Leistungen wie Zuschläge für Nacht- und Wochenendarbeit.',
    ],
  },
  {
    question: 'Welche Arbeitszeiten erwarten mich bei samaritano?',
    category: 'pflegekraefte',
    order: 40,
    answer: [
      'Bei Samaritano bieten wir flexible Arbeitszeitmodelle, einschließlich einer 37-Stunden-Woche, um sicherzustellen, dass du eine gesunde Work-Life-Balance halten kannst.',
    ],
  },

  // ─── Für Einrichtungen ───
  {
    question: 'Wer ist mein Ansprechpartner?',
    category: 'einrichtungen',
    order: 10,
    answer: [
      'Bei samaritano legen wir großen Wert auf persönliche und zuverlässige Betreuung unserer Kunden. Jeder Kunde hat feste Ansprechpartner pro Region.',
    ],
  },
  {
    question: 'Wie sind die Abmelde- und Kündigungsfristen?',
    category: 'einrichtungen',
    order: 20,
    answer: [
      'In der ersten Einsatzwoche beträgt die Kündigungsfrist einen Werktag. Ab der zweiten Woche gilt eine Kündigungsfrist von drei Werktagen.',
    ],
  },
  {
    question: 'Wie lange müssen Pflegekräfte mindestens gebucht werden?',
    category: 'einrichtungen',
    order: 30,
    answer: [
      'Die Fachkräfte können ab einer Dauer von 14 Tagen gebucht werden. Allerdings sind wir flexibel und können auch individuelle Vereinbarungen treffen. Sprechen Sie uns gerne an, um Ihre spezifischen Bedürfnisse zu besprechen.',
    ],
  },
  {
    question: 'Ab wann ist der Mitarbeiter verfügbar?',
    category: 'einrichtungen',
    order: 40,
    answer: [
      'In der Regel können wir innerhalb weniger Tage eine passende Pflegekraft für Ihren Bedarf vermitteln. Die genaue Verfügbarkeit hängt von den spezifischen Anforderungen und dem Einsatzort ab.',
    ],
  },
  {
    question: 'Kann ich eine bestimmte Fachkraft immer wieder ausleihen?',
    category: 'einrichtungen',
    order: 50,
    answer: [
      'Ja, die maximale Überlassungsdauer beträgt 18 Monate, gefolgt von einer Pause von drei Monaten und einem Tag.',
    ],
  },

  // ─── Stellenangebote ───
  {
    question: 'Werde ich fest angestellt?',
    category: 'stellenangebote',
    order: 10,
    answer: [
      'Ja, du wirst bei samaritano fest angestellt. Als Zeitarbeitsfirma für Pflege bieten wir dir ein sicheres Arbeitsverhältnis mit allen üblichen Vorteilen. Du bleibst bei uns angestellt, auch wenn du bei verschiedenen Kunden im Einsatz bist. So kannst du in unterschiedlichen Einrichtungen arbeiten und hast gleichzeitig eine stabile berufliche Perspektive.',
    ],
  },
  {
    question: 'Wie läuft der Bewerbungsprozess bei samaritano ab?',
    category: 'stellenangebote',
    order: 20,
    answer: [
      'Der Bewerbungsprozess ist bei uns unkompliziert und schnell. Nachdem du eine passende Stelle gefunden hast, kannst du dich direkt über ein kurzes Formular auf unserer Webseite bewerben — ganz ohne zusätzliche Unterlagen. Ein Mitglied unseres Teams meldet sich dann zeitnah bei dir, um den weiteren Verlauf zu besprechen und deine Fragen zu klären.',
    ],
  },
  {
    question:
      'Kann ich mich auch initiativ bewerben, wenn aktuell keine passende Stelle ausgeschrieben ist?',
    category: 'stellenangebote',
    order: 30,
    answer: [
      'Ja, Initiativbewerbungen sind willkommen! Kontaktiere uns gerne über unsere Hotline oder per E-Mail. Wir prüfen dann, ob wir passende Positionen für dich haben oder in naher Zukunft erwarten.',
    ],
  },
  {
    question: 'Was bedeutet „NEU“ bei den Stellenangeboten und wie läuft die Vermittlung ab?',
    category: 'stellenangebote',
    order: 40,
    answer: [
      '„NEU“ kennzeichnet Stellen, für die wir dringend Pflegekräfte suchen. Wie bei allen Stellen, die samaritano bietet, vermitteln wir dich nach Beendigung eines Einsatzes — wie in der Zeitarbeit üblich — weitere passende Stellen. So hast du kontinuierlich interessante Arbeitsmöglichkeiten.',
    ],
  },
  {
    question: 'Wie bewerbe ich mich auf eine der ausgeschriebenen Stellen?',
    category: 'stellenangebote',
    order: 50,
    answer: [
      'Um dich zu bewerben, klick bitte auf den „Mehr Informationen“-Button bei der gewünschten Stelle. Dort findest du detaillierte Informationen zum Bewerbungsprozess. Alternativ kannst du uns direkt über unsere Hotline 0571 - 7 846 640 oder per E-Mail an info@samaritano.de kontaktieren.',
    ],
  },

  // ─── Minijobs ───
  {
    question: 'Was ist ein Minijob im Pflegebereich?',
    category: 'minijobs',
    order: 10,
    answer: [
      'Ein Minijob im Pflegebereich ermöglicht Pflegekräften, ihr Einkommen zu verbessern und gleichzeitig flexible Arbeitszeiten zu genießen.',
    ],
  },
  {
    question: 'Wer kann sich für einen Minijob bei samaritano bewerben?',
    category: 'minijobs',
    order: 20,
    answer: [
      'Erfahrene Pflegekräfte, die ihr Einkommen aufbessern oder neue berufliche Perspektiven erkunden möchten, können sich bewerben.',
    ],
  },
  {
    question: 'Welche Vorteile bietet ein Minijob bei samaritano?',
    category: 'minijobs',
    order: 30,
    answer: [
      'Samaritano bietet flexible Arbeitszeiten, vielfältige Einsatzbereiche, faire Bezahlung und Karriereentwicklungsmöglichkeiten.',
    ],
  },
  {
    question: 'Welche Pflegeleistungen sind in den Minijob-Positionen enthalten?',
    category: 'minijobs',
    order: 40,
    answer: [
      'Minijobs decken eine Vielzahl von Fachbereichen ab, darunter Altenpflege, Anästhesie und weitere Gesundheitsbereiche.',
    ],
  },
  {
    question: 'Wie stellt samaritano eine faire Bezahlung für Pflegekräfte sicher?',
    category: 'minijobs',
    order: 50,
    answer: [
      'Samaritano legt Wert auf attraktive Löhne und Zusatzleistungen, um eine faire Vergütung der Mitarbeiter sicherzustellen.',
    ],
  },
]

function paragraphsToBlocks(paragraphs) {
  return paragraphs.map((text) => ({
    _type: 'block',
    _key: randomUUID().replace(/-/g, '').slice(0, 12),
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: randomUUID().replace(/-/g, '').slice(0, 12),
        text,
        marks: [],
      },
    ],
  }))
}

console.log(`Schreibe FAQ-Kategorien (project: ${projectId}, dataset: ${dataset})...`)
for (const cat of CATEGORIES) {
  const doc = {
    _id: `faqCategory-${cat.slug}`,
    _type: 'faqCategory',
    title: cat.title,
    slug: { _type: 'slug', current: cat.slug },
    description: cat.description,
    order: cat.order,
    pageContext: cat.pageContext,
  }
  await client.createOrReplace(doc)
  console.log(`  [OK] Kategorie ${cat.title}  (id: ${doc._id})`)
}

console.log('')
console.log('Schreibe FAQ-Einträge...')
for (const f of FAQS) {
  const slug = slugify(f.question)
  const doc = {
    _id: `faq-${slug}`,
    _type: 'faq',
    question: f.question,
    slug: { _type: 'slug', current: slug },
    answer: paragraphsToBlocks(f.answer),
    order: f.order,
    isActive: true,
    featured: false,
    categories: [
      {
        _type: 'reference',
        _key: randomUUID().replace(/-/g, '').slice(0, 12),
        _ref: `faqCategory-${f.category}`,
      },
    ],
  }
  await client.createOrReplace(doc)
  console.log(`  [OK] [${f.category}] ${f.question.slice(0, 70)}...`)
}

console.log('')
console.log(`Fertig: ${CATEGORIES.length} Kategorien + ${FAQS.length} FAQs.`)
console.log(`Editier-Link: https://www.sanity.io/manage/project/${projectId}`)
