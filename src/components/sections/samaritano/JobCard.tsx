import Link from 'next/link'
import { ArrowRight, MapPin, Clock, Euro } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SampleJob } from '@/data/jobs'

interface JobCardProps {
  job: SampleJob
  featured?: boolean
}

export function JobCard({ job, featured = false }: JobCardProps) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className={cn(
        'group relative block overflow-hidden rounded-[16px] border p-8 transition-all hover:-translate-y-[3px] hover:shadow-soft',
        featured ? 'border-ink bg-ink text-paper' : 'border-line bg-paper-2 text-ink'
      )}
    >
      <div className="mb-6 flex items-start justify-between">
        <div className="flex flex-wrap gap-2">
          {featured && <span className="tag tag-accent">Top-Job</span>}
          <span
            className={cn(
              'tag',
              featured && '!border-white/20 !bg-white/10 !text-paper'
            )}
          >
            {job.workload}
          </span>
        </div>
        <div className={cn('meta', featured ? '!text-white/60' : '')}>{job.posted}</div>
      </div>

      <h3 className="h3 m-0 mb-4 text-inherit">{job.title}</h3>

      <p
        className={cn(
          'mb-7 text-[15px] leading-relaxed text-pretty',
          featured ? 'text-white/70' : 'text-ink-soft'
        )}
      >
        {job.excerpt}
      </p>

      <div
        className={cn(
          'flex items-center justify-between border-t pt-6',
          featured ? 'border-white/10' : 'border-line'
        )}
      >
        <div
          className={cn(
            'flex flex-wrap gap-4 text-[13px]',
            featured ? 'text-white/70' : 'text-ink-muted'
          )}
        >
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {job.workload}
          </span>
          {job.salary && (
            <span className="inline-flex items-center gap-1.5">
              <Euro className="h-3.5 w-3.5" />
              {job.salary}
            </span>
          )}
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-2 text-[14px] font-medium',
            featured ? 'text-sky-soft' : 'text-sky'
          )}
        >
          Mehr erfahren
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}
