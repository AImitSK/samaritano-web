import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { JobDetailContent } from '@/components/sections/samaritano/JobDetailContent'
import { SimilarJobs } from '@/components/sections/samaritano/SimilarJobs'
import { SAMPLE_JOBS } from '@/data/jobs'

interface PageProps {
  params: { id: string }
}

export function generateStaticParams() {
  return SAMPLE_JOBS.map((j) => ({ id: j.id }))
}

export function generateMetadata({ params }: PageProps): Metadata {
  const job = SAMPLE_JOBS.find((j) => j.id === params.id)
  if (!job) return {}
  return {
    title: job.title,
    description: job.excerpt,
  }
}

export default function JobDetailPage({ params }: PageProps) {
  const job = SAMPLE_JOBS.find((j) => j.id === params.id)
  if (!job) notFound()

  return (
    <>
      <div className="wrap pb-6 pt-8 text-[13px] text-ink-muted">
        <Link href="/" className="transition-colors hover:text-ink">
          Start
        </Link>
        <span className="mx-2.5">/</span>
        <Link href="/jobs" className="transition-colors hover:text-ink">
          Stellenangebote
        </Link>
        <span className="mx-2.5">/</span>
        <span className="text-ink">{job.role}</span>
      </div>
      <JobDetailContent job={job} />
      <SimilarJobs excludeId={job.id} />
    </>
  )
}
