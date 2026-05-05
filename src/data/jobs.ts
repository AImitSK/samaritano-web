export interface SampleJob {
  id: string
  title: string
  role: string
  excerpt: string
  location: string
  region: string
  workload: string
  salary?: string
  posted: string
  featured?: boolean
  image?: string
}

// Platzhalter bis Jobs aus Sanity geladen werden.
export const SAMPLE_JOBS: SampleJob[] = [
  {
    id: 'ata-bielefeld',
    title: 'Anästhesietechnischer Assistent (m/w/d)',
    role: 'ATA',
    excerpt:
      'Herausfordernde Position in einer renommierten Spezialklinik mit hochmodernem Anästhesiebereich und vielseitigem Aufgabenfeld.',
    location: 'Raum Bielefeld',
    region: 'NRW',
    workload: 'Vollzeit',
    salary: '4.800 – 5.600 €',
    posted: 'Feb. 2026',
    featured: true,
    image: '/uploads/_DSC9336-Bearbeitet-Bearbeitet-Bearbeitet.jpg',
  },
  {
    id: 'ota-bielefeld',
    title: 'Operationstechnischer Assistent (m/w/d)',
    role: 'OTA',
    excerpt:
      'Spannende Einsätze in modernen Kliniken, flexible Arbeitszeiten und beste Entwicklungsmöglichkeiten, direkt im OP.',
    location: 'Raum Bielefeld',
    region: 'NRW',
    workload: 'Vollzeit',
    salary: '4.600 – 5.400 €',
    posted: 'Feb. 2026',
    featured: true,
    image: '/uploads/_DSC9472-Bearbeitet.jpg',
  },
  {
    id: 'pflegefachkraft-muenster',
    title: 'Pflegefachfrau / Pflegefachmann',
    role: 'Pflegefachkraft',
    excerpt:
      'Allgemeinstation in einem Lehrkrankenhaus. Wertschätzendes Team, faire Touren, geregelte Übergabezeiten.',
    location: 'Münster',
    region: 'NRW',
    workload: 'Vollzeit · Teilzeit',
    salary: '4.200 – 4.900 €',
    posted: 'März 2026',
    image: '/uploads/_DSC9487-Bearbeitet.jpg',
  },
  {
    id: 'intensiv-osnabrueck',
    title: 'Fachkrankenpfleger Intensiv (m/w/d)',
    role: 'Fachkrankenpfleger',
    excerpt:
      'ITS mit 14 Betten in einem Maximalversorger. Ein eingespieltes Team und Einsatzplanung mit echtem Mitspracherecht.',
    location: 'Osnabrück',
    region: 'Niedersachsen',
    workload: 'Vollzeit',
    salary: '5.100 – 5.900 €',
    posted: 'März 2026',
    image: '/uploads/_DSC9356-Bearbeitet.jpg',
  },
  {
    id: 'altenpfleger-paderborn',
    title: 'Altenpfleger (m/w/d)',
    role: 'Altenpfleger',
    excerpt:
      'Stationäre Pflegeeinrichtung mit familiärem Team. Du gestaltest den Alltag mit, statt nur Schichten abzuarbeiten.',
    location: 'Paderborn',
    region: 'NRW',
    workload: 'Teilzeit',
    salary: '3.600 – 4.100 €',
    posted: 'April 2026',
    image: '/uploads/_DSC9380.jpg',
  },
  {
    id: 'kinderkrankenpfleger-bielefeld',
    title: 'Gesundheits- & Kinderkrankenpfleger (m/w/d)',
    role: 'Kinderkrankenpfleger',
    excerpt:
      'Pädiatrische Station, Schwerpunkt Säuglings- und Kleinkindversorgung. Engagiertes Team, individuelle Einarbeitung.',
    location: 'Bielefeld',
    region: 'NRW',
    workload: 'Vollzeit',
    salary: '4.300 – 5.000 €',
    posted: 'April 2026',
    image: '/uploads/_DSC9356-Bearbeitet.jpg',
  },
]
