import Link from 'next/link'
import { MapPin, Clock, ArrowUpRight } from 'lucide-react'
import type { SampleJob } from '@/data/jobs'

export function JobRow({ job }: { job: SampleJob }) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group grid grid-cols-1 items-center gap-3 border-b border-line py-8 transition-[background,padding] duration-150 hover:bg-paper-2 hover:px-4 lg:grid-cols-[1fr_200px_180px_140px_auto] lg:gap-6"
    >
      <div>
        <div className="mb-2.5 flex flex-wrap gap-2">
          {job.featured && <span className="tag tag-accent">Top-Job</span>}
          <span className="tag">{job.role}</span>
        </div>
        <h3 className="h3 m-0">{job.title}</h3>
        <div className="meta mt-2">
          {job.posted} · ID #{job.id}
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-[14px]">
        <MapPin className="h-3.5 w-3.5 text-ink-muted" />
        <span>
          {job.location}, {job.region}
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-[14px]">
        <Clock className="h-3.5 w-3.5 text-ink-muted" />
        <span>{job.workload}</span>
      </div>
      <div className="font-serif text-[20px] text-sky">{job.salary}</div>
      <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full border border-ink transition-colors group-hover:bg-ink group-hover:text-paper">
        <ArrowUpRight className="h-3.5 w-3.5" />
      </div>
    </Link>
  )
}
