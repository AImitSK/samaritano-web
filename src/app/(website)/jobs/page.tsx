import type { Metadata } from 'next'
import { JobsHero } from '@/components/sections/samaritano/JobsHero'
import { JobsListWithFilters } from '@/components/sections/samaritano/JobsListWithFilters'

export const metadata: Metadata = {
  title: 'Stellenangebote',
  description:
    'Aktuelle Stellenangebote in der Pflege bei Samaritano. Vorgeprüfte Einrichtungen, faire Bezahlung, persönliche Betreuung.',
}

export default function JobsPage() {
  return (
    <>
      <JobsHero />
      <JobsListWithFilters />
    </>
  )
}
