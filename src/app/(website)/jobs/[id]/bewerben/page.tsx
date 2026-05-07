import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getAllActiveJobs, getJobBySlug } from '@/sanity/queries'
import { SAMPLE_JOBS, sanityJobToSample, type SampleJob } from '@/data/jobs'
import { BewerbungsForm } from '@/components/sections/samaritano/forms/BewerbungsForm'

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
    title: `Bewerben: ${job.title}`,
    description: `Jetzt als ${job.title} bei Samaritano bewerben.`,
  }
}

export default async function BewerbenPage({ params }: PageProps) {
  const job = await resolveJob(params.id)
  if (!job) notFound()

  return (
    <>
      <section className="pb-8 pt-10 lg:pb-12">
        <div className="wrap max-w-[760px]">
          <Link
            href={`/jobs/${job.id}`}
            className="mb-8 inline-flex items-center gap-2 text-[14px] text-ink-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {job.title}
          </Link>

          <div className="eyebrow">Bewerbung</div>
          <h1 className="h1 mt-5 mb-3">
            Jetzt <em>bewerben</em>.
          </h1>
          <p className="lede mb-12 max-w-[560px]">
            In wenigen Schritten — kein langes Anschreiben noetig. Alexander Esau meldet
            sich werktags innerhalb von 24 Stunden.
          </p>

          <BewerbungsForm
            jobTitle={job.title}
            jobId={job.id}
            defaultPosition={job.role || undefined}
            contactEmail={job.contactEmail}
          />
        </div>
      </section>
    </>
  )
}
