import type { Metadata } from 'next'
import { JobsHero } from '@/components/sections/samaritano/JobsHero'
import { JobsListWithFilters } from '@/components/sections/samaritano/JobsListWithFilters'
import { getAllActiveJobs } from '@/sanity/queries'
import { SAMPLE_JOBS, sanityJobToSample } from '@/data/jobs'

export const metadata: Metadata = {
  title: 'Stellenangebote',
  description:
    'Aktuelle Stellenangebote in der Pflege bei Samaritano. Vorgeprüfte Einrichtungen, faire Bezahlung, persönliche Betreuung.',
}

export default async function JobsPage() {
  const sanityJobs = await getAllActiveJobs()
  const jobs = sanityJobs.length > 0 ? sanityJobs.map(sanityJobToSample) : SAMPLE_JOBS
  return (
    <>
      <JobsHero count={jobs.length} />
      <JobsListWithFilters jobs={jobs} />
    </>
  )
}
