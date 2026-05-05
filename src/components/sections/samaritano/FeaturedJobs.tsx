import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SAMPLE_JOBS } from '@/data/jobs'
import { JobCard } from './JobCard'

export function FeaturedJobs() {
  const featured = SAMPLE_JOBS.filter((j) => j.featured)
  const totalJobs = SAMPLE_JOBS.length // ggf. spaeter durch Sanity-Count ersetzen

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
