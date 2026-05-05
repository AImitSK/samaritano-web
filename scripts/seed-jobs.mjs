/**
 * Seed-Skript: legt 10 Jobs aus samaritano.de in Sanity an.
 * Idempotent (createOrReplace).
 * Aufruf: node --env-file=.env.local scripts/seed-jobs.mjs
 */
import { createClient } from '@sanity/client'

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

// Portable-Text-Helper
let k = 0
const blk = (text, style = 'normal') => ({
  _key: `b${++k}`,
  _type: 'block',
  style,
  markDefs: [],
  children: [{ _key: `c${k}`, _type: 'span', text, marks: [] }],
})
const bullet = (text) => ({
  _key: `b${++k}`,
  _type: 'block',
  style: 'normal',
  listItem: 'bullet',
  level: 1,
  markDefs: [],
  children: [{ _key: `c${k}`, _type: 'span', text, marks: [] }],
})

const desc = (paragraph, aufgaben) => [
  blk(paragraph, 'normal'),
  blk('Deine Aufgaben', 'h3'),
  ...aufgaben.map(bullet),
]

const today = new Date().toISOString().slice(0, 10)

// Helper für Kategorie-Referenzen
const cat = (slug) => ({
  _type: 'reference',
  _ref: `jobCategory-${slug}`,
})

const JOBS = [
  {
    slug: 'anaesthesietechnischer-assistent-minden-luebbecke',
    title: 'Anästhesietechnischer Assistent (m/w/d)',
    role: 'ATA',
    location: 'Raum Minden-Lübbecke',
    region: 'NRW',
    type: 'vollzeit',
    excerpt:
      'ATA-Fachkraft für OP-Einsätze mit übertariflicher Bezahlung und Flexibilität. Spannende Herausforderungen in diversen Fachbereichen mit selbstbestimmter Karrieregestaltung.',
    salary: 'ab 30 €/Std + Zulagen',
    featured: false,
    categoryRefs: ['anaesthesietechnischer-assistent'],
    description: desc(
      'Du bist ATA (m/w/d) und suchst eine neue Herausforderung, die Deine Expertise wertschätzt und Dir gleichzeitig mehr Freiraum bietet? Entdecke bei uns spannende OP-Einsätze, übertarifliche Bezahlung und echte Flexibilität.',
      [
        'Vorbereitung, Assistenz und Nachbereitung von Narkosen in diversen Fachbereichen',
        'Überwachung der Vitalfunktionen von Patienten vor, während und nach operativen Eingriffen',
        'Sicherstellung der Funktionsfähigkeit von medizinischen Geräten im Anästhesiebereich',
        'Professionelle Zusammenarbeit im interdisziplinären OP-Team',
        'Dokumentation gemäß den Qualitätsstandards',
      ]
    ),
    requirements: [
      'Abgeschlossene Ausbildung als Anästhesietechnischer Assistent (ATA) (m/w/d)',
      'Hohe Fachkompetenz und Verantwortungsbewusstsein',
      'Flexibilität und Freude an neuen Herausforderungen und unterschiedlichen Teams',
      'Teamfähigkeit und Kommunikationsstärke',
    ],
    benefits: [
      'Stundenlohn ab 30 Euro, je nach Erfahrung plus attraktive Zulagen',
      'Mitspracherecht bei der Dienstplangestaltung',
      'Verlässliche Freizeit – kein kurzfristiges Einspringen an freien Tagen',
      'Unbefristeter Arbeitsvertrag',
      'Umfangreiche, finanzierte Weiterbildungsmöglichkeiten',
      'Persönliche Betreuung durch festen Ansprechpartner',
    ],
  },
  {
    slug: 'anaesthesietechnischer-assistent-bielefeld',
    title: 'Anästhesietechnischer Assistent (m/w/d) – Top-Job',
    role: 'ATA',
    location: 'Raum Bielefeld',
    region: 'NRW',
    type: 'vollzeit',
    salary: 'bis 5.039 € brutto',
    featured: true,
    categoryRefs: ['anaesthesietechnischer-assistent', 'top-angebot'],
    excerpt:
      'Suchen Sie eine herausfordernde Position als ATA? In einer renommierten Spezialklinik im Raum Bielefeld erwartet Sie ein vielseitiges Aufgabenfeld in einem hochmodernen Anästhesiebereich.',
    description: desc(
      'Gehobene Fachposition in einer spezialisierten Klinik mit modernem Anästhesiebereich. Berufseinsteiger und erfahrene Fachkräfte sind gleichermaßen willkommen. Arbeitsbeginn ab sofort.',
      [
        'Vorbereitung und Überprüfung der Anästhesiegeräte und -materialien',
        'Assistenz bei Einleitung, Aufrechterhaltung und Ausleitung der Anästhesie',
        'Dokumentation des Anästhesieverlaufs',
        'Betreuung der Patienten im Aufwachraum',
        'Mitwirkung bei Notfallmanagement und Reanimation',
        'Hygienemaßnahmen und Qualitätssicherung im Arbeitsbereich',
      ]
    ),
    requirements: [
      'Abgeschlossene Ausbildung als Anästhesietechnische/r Assistent/in (ATA)',
      'Idealerweise erste Berufserfahrung, aber auch Berufseinsteiger willkommen',
      'Ausgeprägtes Verantwortungsbewusstsein und Zuverlässigkeit',
      'Teamfähigkeit und exzellente Kommunikationsfähigkeiten',
      'Belastbarkeit und Ruhe in Stresssituationen',
      'Interesse an kontinuierlicher Weiterbildung im Fachbereich Anästhesie',
    ],
    benefits: [
      'Bis zu 5.039 € brutto monatlich',
      'Zuschläge für Sonn- und Feiertage, Nachtschichten und Überstunden',
      '37-Stunden-Woche oder Teilzeit ab 20 Stunden',
      '30 Tage Urlaub',
      'Betriebliche Altersvorsorge',
      'Fahrtkostenerstattung 0,30 €/km',
      'Fortbildungsmöglichkeiten',
      'Unbefristeter Arbeitsvertrag',
      'Work & Travel Option',
    ],
  },
  {
    slug: 'operationstechnischer-assistent-bielefeld',
    title: 'Operationstechnischer Assistent (m/w/d) – Top-Job',
    role: 'OTA',
    location: 'Raum Bielefeld',
    region: 'NRW',
    type: 'vollzeit',
    salary: 'bis 5.039 € brutto',
    featured: true,
    categoryRefs: ['operationstechnischer-assistent', 'top-angebot'],
    excerpt:
      'Erleben Sie spannende Einsätze in modernen Kliniken, flexible Arbeitszeiten und beste Entwicklungsmöglichkeiten — als OTA bei samaritano in Ostwestfalen-Lippe.',
    description: desc(
      'Erleben Sie spannende Einsätze in modernen Kliniken, flexible Arbeitszeiten und beste Entwicklungsmöglichkeiten. Starten Sie Ihre Karriere bei samaritano und werden Sie Teil unseres engagierten Teams in Ostwestfalen-Lippe.',
      [
        'Vorbereitung und Durchführung von operativen Eingriffen',
        'Bedienung und Wartung medizinischer Geräte im OP',
        'Assistenz bei chirurgischen Eingriffen',
        'Gewährleistung der Hygiene und Sterilität im OP-Bereich',
        'Instrumentieren bei verschiedenen operativen Eingriffen',
        'Vor- und Nachbereitung des Operationssaals',
        'Dokumentation der durchgeführten Tätigkeiten',
      ]
    ),
    requirements: [
      'Abgeschlossene Ausbildung als Operationstechnische/r Assistent/in (OTA)',
      'Berufserfahrung im OP-Bereich wünschenswert, aber nicht Bedingung',
      'Teamfähigkeit und Belastbarkeit',
      'Flexibilität und Bereitschaft zum Schichtdienst',
      'Verantwortungsbewusstsein und Zuverlässigkeit',
      'Gute Kommunikationsfähigkeiten',
      'Interesse an kontinuierlicher Weiterbildung',
    ],
    benefits: [
      'Bis zu 5.039 € brutto monatlich',
      'Zuschläge für Wochenenden, Nachtschichten und Überstunden',
      '37-Stunden-Woche oder Teilzeit ab 20 Stunden',
      '30 Tage Urlaub',
      'Betriebliche Altersvorsorge',
      'Fahrtkostenerstattung',
      'Fester Ansprechpartner',
      'Unbefristeter Arbeitsvertrag',
      'Weiterbildungsmöglichkeiten',
      'Work & Travel Option',
    ],
  },
  {
    slug: 'fachkrankenpfleger-intensivpflege-bielefeld',
    title: 'Fachkrankenpfleger Intensivpflege (m/w/d)',
    role: 'Fachkrankenpfleger',
    location: 'Raum Bielefeld',
    region: 'NRW',
    type: 'vollzeit',
    featured: false,
    categoryRefs: ['fachkrankenpfleger'],
    excerpt:
      'Fachpflegekraft für Intensivpflege gesucht — mit Top-Konditionen, maximaler Dienstplanflexibilität und Wertschätzung in der Arbeitnehmerüberlassung.',
    description: desc(
      'Deine Expertise auf der Intensivstation ist unersetzlich. Wir bieten Dir als Fachpflegekraft (m/w/d) für Intensivpflege Top-Konditionen, maximale Dienstplanflexibilität und die Wertschätzung, die Du verdienst.',
      [
        'Eigenverantwortliche Durchführung allgemeiner und spezieller Intensivpflege sowie Überwachung schwerstkranker Patienten',
        'Bedienung und Überwachung komplexer medizinischer Geräte (Beatmungsgeräte, Dialysegeräte, Monitore)',
        'Vorbereitung und Assistenz bei ärztlichen diagnostischen und therapeutischen Maßnahmen',
        'Erkennung und Reaktion auf lebensbedrohliche Gesundheitsveränderungen',
        'Professionelle und empathische Kommunikation mit Patienten, Angehörigen und interdisziplinären Teams',
        'Sorgfältige Pflegedokumentation und Mitwirkung an Qualitätssicherungsmaßnahmen',
      ]
    ),
    requirements: [
      'Abgeschlossene Ausbildung als Gesundheits- und Krankenpfleger mit Fachweiterbildung Intensivpflege und Anästhesie',
      'Fundierte Berufserfahrung im Bereich Intensivpflege',
      'Hohe fachliche und soziale Kompetenz mit ausgeprägter Belastbarkeit',
      'Teamfähigkeit und professionelles Verhalten in kritischen Situationen',
      'Bereitschaft zur flexiblen Anpassung an neue intensivmedizinische Herausforderungen',
    ],
    benefits: [
      'Exzellente Vergütung mit attraktiven steuerfreien Zulagen für Schicht-, Wochenend- und Feiertagsdienste',
      'Wunschdienstplan mit bindender Gestaltung und Berücksichtigung persönlicher Wünsche',
      'Keine unerwarteten Diensteinsätze während freier Tage',
      'Unbefristeter Arbeitsvertrag mit verlässlichem Arbeitgeber',
      'Vielfältige Einsätze auf verschiedenen Intensivstationen (operativ, konservativ, kardiologisch)',
      'Professionelle persönliche Betreuung durch erfahrenes Team',
      'Zugang zu spezialisierten Fortbildungen und fachlicher Entwicklungsunterstützung',
    ],
  },
  {
    slug: 'fachkrankenpfleger-anaesthesiepflege-hannover',
    title: 'Fachkrankenpfleger (m/w/d) – Anästhesiepflege',
    role: 'Fachkrankenpfleger',
    location: 'Raum Hannover',
    region: 'Niedersachsen',
    type: 'vollzeit',
    featured: false,
    categoryRefs: ['fachkrankenpfleger'],
    excerpt:
      'Werde als Fachkrankenpfleger/in für Anästhesiepflege Teil unseres engagierten Teams im Raum Hannover und trage zur optimalen Patientenversorgung bei.',
    description: desc(
      'Wir suchen Fachkrankenpfleger/innen für Anästhesiepflege zur Verstärkung unseres Teams. Wir bieten attraktive Vergütung, flexible Arbeitszeiten und spezialisierte Weiterbildungen. Die Position startet ab sofort im Raum Hannover.',
      [
        'Assistenz bei Anästhesie-Einleitung, -Aufrechterhaltung und -Ausleitung',
        'Überwachung von Vitalzeichen und Anpassung von Anästhesieparametern',
        'Betreuung im Aufwachraum nach Operationen',
        'Sicherstellung der Einsatzbereitschaft von Anästhesiegeräten',
        'Erkennung von Komplikationen und lebensrettende Maßnahmen',
        'Dokumentation in Anästhesieprotokollen',
      ]
    ),
    requirements: [
      'Abgeschlossene Ausbildung als Gesundheits- und Krankenpfleger/in mit Fachweiterbildung',
      'Fundierte Kenntnisse in Anästhesietechniken und Gerätehandhabung',
      'Hohes Verantwortungsbewusstsein und ruhiges Handeln in kritischen Situationen',
      'Teamfähigkeit und Kommunikationsstärke',
      'Patientenorientierung und Engagement für kontinuierliche Weiterbildung',
    ],
    benefits: [
      'Wettbewerbsfähiges Gehalt mit zusätzlichen Prämien und Sozialleistungen',
      'Spezialisierte Fort- und Weiterbildungen',
      'Flexible Arbeitszeitmodelle',
      'Modernes Arbeitsumfeld mit hochmoderner Technologie',
      'Respektvolle Unternehmenskultur und Förderung individueller Ideen',
    ],
  },
  {
    slug: 'gesundheits-und-krankenpfleger-bielefeld-minijob',
    title: 'Gesundheits- und Krankenpfleger (m/w/d) – Minijob',
    role: 'Gesundheits- und Krankenpfleger',
    location: 'Raum Bielefeld',
    region: 'NRW',
    type: 'minijob',
    featured: false,
    categoryRefs: ['gesundheits-und-krankenpfleger', 'minijobs'],
    excerpt:
      'Setze deine Expertise als Gesundheits- und Krankenpfleger/in im Minijob ein und unterstütze unsere Patienten in der Genesung.',
    description: desc(
      'Profitiere von einer attraktiven Vergütung, flexiblen Arbeitszeiten und umfassenden Weiterbildungsmöglichkeiten. Werde Teil eines engagierten Teams in der Patientenbetreuung.',
      [
        'Eigenverantwortliche Durchführung pflegerischer Maßnahmen und Überwachung der Vitalzeichen',
        'Individuelle Betreuung und Beratung von Patienten sowie deren Angehörigen',
        'Assistenz bei ärztlichen Untersuchungen und medizinischen Behandlungen',
        'Planung, Organisation und Dokumentation der Pflegeprozesse',
        'Unterstützung bei der Umsetzung von therapeutischen Maßnahmen und Rehabilitation',
        'Teilnahme an Teambesprechungen und kontinuierliche Verbesserung der Pflegequalität',
      ]
    ),
    requirements: [
      'Abgeschlossene Ausbildung als Gesundheits- und Krankenpfleger/in oder vergleichbare Qualifikation',
      'Leidenschaft für die Pflege und ausgeprägte soziale Kompetenz',
      'Teamfähigkeit sowie eigenverantwortliche und strukturierte Arbeitsweise',
      'Bereitschaft, in verschiedenen Fachbereichen zu arbeiten und Neues zu lernen',
      'Sicheres Auftreten und gute Kommunikationsfähigkeiten',
    ],
    benefits: [
      'Wettbewerbsfähiges Gehalt mit zusätzlichen Prämien und Sozialleistungen',
      'Individuelle Arbeitszeitmodelle für ausgewogene Lebensgestaltung',
      'Zugang zu vielfältigen Fortbildungen und beruflichen Entwicklungschancen',
      'Unterstützung durch engagiertes und freundliches Team',
      'Respektvolle Zusammenarbeit und Förderung persönlicher Initiativen',
    ],
  },
  {
    slug: 'gesundheits-und-krankenpfleger-hannover',
    title: 'Gesundheits- und Krankenpfleger (m/w/d)',
    role: 'Gesundheits- und Krankenpfleger',
    location: 'Raum Hannover',
    region: 'Niedersachsen',
    type: 'vollzeit',
    featured: false,
    categoryRefs: ['gesundheits-und-krankenpfleger'],
    excerpt:
      'Nutze deine Fähigkeiten als Gesundheits- und Krankenpfleger/in, um das Leben unserer Patienten im Raum Hannover zu verbessern.',
    description: desc(
      'Genieße eine attraktive Vergütung, flexible Arbeitszeiten und umfassende Weiterbildungsmöglichkeiten. Werde Teil unseres engagierten Teams.',
      [
        'Durchführung pflegerischer Maßnahmen und Überwachung des Gesundheitszustands der Patienten',
        'Unterstützung bei Diagnostik und Therapie in enger Zusammenarbeit mit Ärzten',
        'Einfühlsame Betreuung und Beratung von Patienten und ihren Angehörigen',
        'Dokumentation der Pflegemaßnahmen und Erstellung von Pflegeplänen',
        'Mitarbeit in einem interdisziplinären Team und Teilnahme an Besprechungen',
      ]
    ),
    requirements: [
      'Abgeschlossene Ausbildung als Gesundheits- und Krankenpfleger/in oder vergleichbare Qualifikation',
      'Engagement und Empathie im Umgang mit Patienten',
      'Teamfähigkeit und selbstständige, zuverlässige Arbeitsweise',
      'Flexibilität und Freude an der Arbeit in verschiedenen Fachbereichen',
      'Kommunikationsstärke und freundliches Auftreten',
    ],
    benefits: [
      'Attraktive Vergütung mit zusätzlichen Zuschlägen und Sozialleistungen',
      'Vielfältige Fort- und Weiterbildungsmöglichkeiten',
      'Flexible Arbeitszeiten für gute Work-Life-Balance',
      'Kollegiales Arbeitsumfeld mit erfahrenen Kollegen',
      'Respektvolle Zusammenarbeit und Unterstützung',
    ],
  },
  {
    slug: 'altenpfleger-bielefeld',
    title: 'Altenpfleger (m/w/d)',
    role: 'Altenpfleger',
    location: 'Raum Bielefeld',
    region: 'NRW',
    type: 'vollzeit',
    featured: false,
    categoryRefs: ['altenpfleger'],
    excerpt:
      'Gestalte als Altenpfleger/in das Leben älterer Menschen mit Herz und Verstand — mit attraktivem Gehalt, unterstützendem Team und Weiterbildungsmöglichkeiten.',
    description: desc(
      'Gestalte als Altenpfleger/in das Leben älterer Menschen mit Herz und Verstand. Genieße ein attraktives Gehalt, ein unterstützendes Team und Weiterbildungsmöglichkeiten. Starte deine neue Herausforderung noch heute.',
      [
        'Unterstützung bei der Körperpflege, beim Essen und bei der Mobilität der Bewohner',
        'Umsetzung von pflegerischen Maßnahmen und Förderung der Eigenständigkeit',
        'Einfühlsame Unterstützung der Bewohner bei persönlichen Fragen und Anliegen',
        'Förderung von Freizeitaktivitäten und sozialer Interaktion',
        'Dokumentation der Pflegeabläufe und enge Zusammenarbeit mit dem medizinischen Fachpersonal',
        'Aktive Mitgestaltung im Team und Teilnahme an Besprechungen und Schulungen',
      ]
    ),
    requirements: [
      'Erfolgreich abgeschlossene Ausbildung als Altenpfleger/in oder vergleichbare Qualifikation',
      'Begeisterung für die Arbeit mit älteren Menschen und ausgeprägtes Einfühlungsvermögen',
      'Flexibilität und Freude daran, in verschiedenen Einrichtungen zu arbeiten',
      'Fähigkeit zur Teamarbeit sowie zuverlässige und selbstständige Arbeitsweise',
      'Kommunikationsstärke und positive Ausstrahlung',
    ],
    benefits: [
      'Attraktives Vergütungspaket mit fairer Bezahlung, Zuschlägen und Sozialleistungen',
      'Weiterbildungsmöglichkeiten zur beruflichen und persönlichen Weiterentwicklung',
      'Flexible Arbeitszeiten für bessere Work-Life-Balance',
      'Kollegiales Umfeld mit unterstützendem, erfahrenem Team',
      'Respektvolle Arbeitskultur mit wertschätzendem Umgang',
    ],
  },
  {
    slug: 'altenpfleger-hannover',
    title: 'Altenpfleger (m/w/d)',
    role: 'Altenpfleger',
    location: 'Raum Hannover',
    region: 'Niedersachsen',
    type: 'vollzeit',
    featured: false,
    categoryRefs: ['altenpfleger'],
    excerpt:
      'Nutze deine Erfahrung als Altenpfleger/in, um die Lebensqualität unserer Senioren im Raum Hannover zu verbessern — mit fairer Vergütung und Entwicklungsmöglichkeiten.',
    description: desc(
      'Profitiere von fairer Vergütung, flexiblen Arbeitszeiten und Möglichkeiten zur Weiterentwicklung in einem wertschätzenden Umfeld.',
      [
        'Unterstützung bei Körperpflege, Ernährung und Mobilität der Bewohner',
        'Durchführung pflegerischer Maßnahmen und Förderung der Selbstständigkeit',
        'Empathische Begleitung der Bewohner und Hilfe bei persönlichen Anliegen',
        'Förderung von Freizeitaktivitäten und sozialer Teilhabe',
        'Dokumentation der Pflegeprozesse und Zusammenarbeit mit medizinischem Personal',
        'Mitarbeit im engagierten Pflegeteam und Teilnahme an Teambesprechungen',
      ]
    ),
    requirements: [
      'Abgeschlossene Ausbildung als Altenpfleger/in oder gleichwertige Qualifikation',
      'Leidenschaft für Pflege älterer Menschen und hohes Maß an Empathie',
      'Flexibilität und Freude an Arbeit in verschiedenen Einrichtungen',
      'Teamgeist und zuverlässige, selbstständige Arbeitsweise',
      'Gute Kommunikationsfähigkeit und positives Auftreten',
    ],
    benefits: [
      'Attraktives Gehalt mit leistungsgerechter Bezahlung, Zuschlägen und Sozialleistungen',
      'Fort- und Weiterbildung für berufliche und persönliche Entwicklung',
      'Kollegiales Arbeitsumfeld mit erfahrenen Kollegen',
      'Wertschätzende Arbeitskultur mit respektvoller Zusammenarbeit',
    ],
  },
  {
    slug: 'fachkrankenpfleger-bielefeld',
    title: 'Fachkrankenpfleger (m/w/d)',
    role: 'Fachkrankenpfleger',
    location: 'Raum Bielefeld',
    region: 'NRW',
    type: 'vollzeit',
    featured: false,
    categoryRefs: ['fachkrankenpfleger'],
    excerpt:
      'Nutze deine Spezialkenntnisse als Fachkrankenpfleger/in im Raum Bielefeld — mit attraktiver Vergütung, flexiblen Arbeitszeiten und Weiterentwicklung im modernen Arbeitsumfeld.',
    description: desc(
      'Wir bieten dir als Fachkrankenpfleger/in eine attraktive Vergütung, flexible Arbeitszeiten und die Möglichkeit zur fachlichen Weiterentwicklung in einem modernen und unterstützenden Arbeitsumfeld.',
      [
        'Durchführung komplexer pflegerischer Maßnahmen und Überwachung von Patienten in spezialisierten Bereichen',
        'Assistenz bei anspruchsvollen medizinischen Eingriffen und Therapien',
        'Beratung und Schulung von Patienten und Angehörigen im Umgang mit speziellen Behandlungsmethoden',
        'Planung und Koordination des Pflegeprozesses in Zusammenarbeit mit dem Ärzteteam',
        'Dokumentation und Evaluation der Pflegequalität zur kontinuierlichen Verbesserung',
      ]
    ),
    requirements: [
      'Abgeschlossene Ausbildung als Fachkrankenpfleger/in oder vergleichbare Qualifikation',
      'Fundierte Fachkenntnisse und Erfahrung in spezialisierter Krankenpflege',
      'Hohe soziale Kompetenz und professionelles Verhalten in anspruchsvollen Situationen',
      'Teamfähigkeit und proaktive, strukturierte Arbeitsweise',
      'Bereitschaft zur kontinuierlichen Weiterbildung',
    ],
    benefits: [
      'Wettbewerbsfähiges Gehalt mit zusätzlichen Boni und umfassenden Sozialleistungen',
      'Zugang zu spezialisierten Fortbildungen und fachliche Unterstützung',
      'Flexible Arbeitszeitmodelle zur Work-Life-Balance',
      'Respektvolle Zusammenarbeit und Förderung individueller Ideen',
    ],
  },
]

console.log(`Schreibe ${JOBS.length} Jobs in Sanity (project: ${projectId})...`)
let count = 0
for (const j of JOBS) {
  k = 0 // reset block keys per doc
  const doc = {
    _id: `job-${j.slug}`,
    _type: 'job',
    title: j.title,
    slug: { _type: 'slug', current: j.slug },
    role: j.role,
    location: j.location,
    region: j.region,
    type: j.type,
    salary: j.salary,
    featured: j.featured,
    excerpt: j.excerpt,
    description: j.description,
    requirements: j.requirements,
    benefits: j.benefits,
    categories: j.categoryRefs.map((slug, i) => ({
      _key: `cat${i}`,
      ...cat(slug),
    })),
    publishedAt: today,
    isActive: true,
  }
  await client.createOrReplace(doc)
  count++
  console.log(`  [${count}/${JOBS.length}] ${j.title}  ->  /jobs/${j.slug}`)
}
console.log('')
console.log('Fertig.')
