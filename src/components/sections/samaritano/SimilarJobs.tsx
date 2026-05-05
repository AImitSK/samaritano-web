import { getAllActiveJobs } from '@/sanity/queries'
import { SAMPLE_JOBS, sanityJobToSample } from '@/data/jobs'
import { JobCard } from './JobCard'

export async function SimilarJobs({ excludeId }: { excludeId: string }) {
  const sanityJobs = await getAllActiveJobs()
  const all = sanityJobs.length > 0 ? sanityJobs.map(sanityJobToSample) : SAMPLE_JOBS
  const others = all.filter((j) => j.id !== excludeId).slice(0, 3)
  if (others.length === 0) return null
  return (
    <section className="section-pad" data-screen-label="Ähnliche Stellen">
      <div className="wrap">
        <div className="eyebrow">Auch interessant</div>
        <h2 className="h2 mb-12 mt-5">
          Ähnliche <em>Stellen</em>.
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((j) => (
            <JobCard key={j.id} job={j} />
          ))}
        </div>
      </div>
    </section>
  )
}
