import { SAMPLE_JOBS } from '@/data/jobs'

export function JobsHero() {
  const count = SAMPLE_JOBS.length
  return (
    <section className="pt-16 pb-16 lg:pt-20 lg:pb-20">
      <div className="wrap">
        <div className="grid items-end gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          <div>
            <div className="eyebrow">Stellenangebote</div>
            <h1 className="display mt-6">
              <span className="block whitespace-nowrap">
                <em>{count}</em> offene
              </span>
              <span className="block whitespace-nowrap">Stellen, finde</span>
              <span className="block whitespace-nowrap">deine.</span>
            </h1>
          </div>
          <p className="lede max-w-[380px]">
            Jede Stelle wurde von uns persönlich besucht. Wir wissen, wo du arbeitest, und wer dein Team
            sein wird.
          </p>
        </div>
      </div>
    </section>
  )
}
