import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getAllActiveJobs } from '@/sanity/queries'
import { SAMPLE_JOBS, sanityJobToSample } from '@/data/jobs'
import { JobCard } from './JobCard'

export async function FeaturedJobs() {
  const sanityJobs = await getAllActiveJobs()
  const jobs = sanityJobs.length > 0 ? sanityJobs.map(sanityJobToSample) : SAMPLE_JOBS
  const featured = jobs.filter((j) => j.featured)
  const totalJobs = jobs.length

  if (featured.length === 0) return null

  return (
    <section className="section-pad" data-screen-label="Stellen">
      <div className="wrap">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-10 lg:mb-20">
          <div>
            <div className="eyebrow">Top-Stellen</div>
            <h2 className="h1 mt-5">
              <span className="block whitespace-nowrap">
                Aktuelle <em>Lieblingsjobs</em>
              </span>
              <span className="block whitespace-nowrap">für Samaritanos.</span>
            </h2>
          </div>
          <Link href="/jobs" className="btn btn-ghost">
            Alle {totalJobs} Stellen ansehen
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {featured.map((j) => (
            <JobCard key={j.id} job={j} featured={j.featured} />
          ))}
        </div>
      </div>
    </section>
  )
}
