import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { JobDetailContent } from '@/components/sections/samaritano/JobDetailContent'
import { SimilarJobs } from '@/components/sections/samaritano/SimilarJobs'
import { getAllActiveJobs, getJobBySlug } from '@/sanity/queries'
import { SAMPLE_JOBS, sanityJobToSample, type SampleJob } from '@/data/jobs'

interface PageProps {
  params: { id: string }
}

export async function generateStaticParams() {
  const sanityJobs = await getAllActiveJobs()
  if (sanityJobs.length > 0) {
    return sanityJobs.map((j) => ({ id: j.slug.current }))
  }
  return SAMPLE_JOBS.map((j) => ({ id: j.id }))
}

async function resolveJob(id: string): Promise<SampleJob | null> {
  const sanityJob = await getJobBySlug(id)
  if (sanityJob) return sanityJobToSample(sanityJob)
  return SAMPLE_JOBS.find((j) => j.id === id) ?? null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const job = await resolveJob(params.id)
  if (!job) return {}
  return {
    title: job.title,
    description: job.excerpt,
  }
}

export default async function JobDetailPage({ params }: PageProps) {
  const job = await resolveJob(params.id)
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
