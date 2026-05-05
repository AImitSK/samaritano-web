import { MapPin, Clock, Euro, ArrowUpRight, Sparkles, Check } from 'lucide-react'
import { PortableTextRenderer } from '@/components/ui/PortableTextRenderer'
import type { SampleJob } from '@/data/jobs'

const PROCESS = [
  { n: '01', t: 'Bewerben', d: 'In 2 Min., kein Lebenslauf nötig' },
  { n: '02', t: 'Kennenlernen', d: 'Telefonat mit Alexander' },
  { n: '03', t: 'Match prüfen', d: 'Wir besuchen die Einrichtung mit dir' },
  { n: '04', t: 'Starten', d: "Vertrag, Onboarding, los geht's" },
]

export function JobDetailContent({ job }: { job: SampleJob }) {
  const hasDescription = job.description && job.description.length > 0
  const hasRequirements = job.requirements && job.requirements.length > 0
  const hasBenefits = job.benefits && job.benefits.length > 0

  return (
    <>
      {/* Header */}
      <section className="pb-12 pt-10 lg:pb-16">
        <div className="wrap">
          <div className="max-w-[820px]">
            <div className="mb-6 flex flex-wrap gap-2">
              {job.featured && <span className="tag tag-accent">Top-Job</span>}
              {job.role && <span className="tag">{job.role}</span>}
              <span className="tag tag-sage">{job.workload}</span>
            </div>
            <h1 className="h1 m-0 mb-8">{job.title}</h1>
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-[15px] text-ink-soft">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                {job.location}
                {job.region ? `, ${job.region}` : ''}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                {job.workload}
              </span>
              {job.salary && (
                <span className="inline-flex items-center gap-2">
                  <Euro className="h-3.5 w-3.5" />
                  {job.salary}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Body + Sidebar */}
      <section className="border-t border-line bg-paper-2 pb-32 pt-16 lg:pt-20">
        <div className="wrap">
          <div className="grid items-start gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
            <div>
              <div className="max-w-[680px]">
                {/* Lead */}
                {job.excerpt && (
                  <>
                    <div className="eyebrow">Über die Stelle</div>
                    <p className="mb-8 mt-5 text-[18px] leading-relaxed text-ink">
                      {job.excerpt}
                    </p>
                  </>
                )}

                {/* Description (Portable Text aus Sanity) */}
                {hasDescription && <PortableTextRenderer content={job.description!} />}

                {/* Requirements */}
                {hasRequirements && (
                  <>
                    <h3 className="h3 mb-5 mt-14">Was du mitbringst</h3>
                    <ul className="m-0 grid list-none gap-3.5 p-0">
                      {job.requirements!.map((t) => (
                        <li key={t} className="flex gap-3.5 text-base leading-relaxed">
                          <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-[1.5px] border-ink text-[11px] text-ink">
                            •
                          </span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {/* Benefits */}
                {hasBenefits && (
                  <>
                    <h3 className="h3 mb-5 mt-14">Was wir dir bieten</h3>
                    <ul className="m-0 grid list-none gap-3.5 p-0">
                      {job.benefits!.map((t) => (
                        <li key={t} className="flex gap-3.5 text-base leading-relaxed">
                          <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent text-white">
                            <Check className="h-2.5 w-2.5" strokeWidth={3} />
                          </span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {/* Bewerbungsablauf — gilt fuer alle Stellen identisch (Design-Inhalt) */}
              <div className="mt-20 border-t border-line pt-10">
                <div className="eyebrow">Bewerbungsablauf</div>
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {PROCESS.map((s) => (
                    <div key={s.n}>
                      <div className="mb-3.5 font-mono text-[13px] text-sky">{s.n}</div>
                      <div className="mb-2 font-serif text-[22px]">{s.t}</div>
                      <div className="text-[14px] text-ink-soft">{s.d}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-24">
              <div className="rounded-[16px] bg-ink p-8 text-paper">
                <div className="eyebrow !text-white/50">Bewerbung</div>
                <div className="mt-3.5 font-serif text-[40px] font-light leading-none tracking-tight">
                  Ø 6 Tage
                  <br />
                  <span className="text-accent-soft">bis zur Zusage</span>
                </div>
                {job.salary && (
                  <div className="mt-7 border-y border-white/10 py-5">
                    <div className="text-[13px] text-white/60">Bruttogehalt</div>
                    <div className="mt-1 font-serif text-[28px] font-light tracking-tight">
                      {job.salary}
                    </div>
                  </div>
                )}
                <a
                  href={`mailto:a.esau@samaritano.de?subject=${encodeURIComponent('Bewerbung: ' + job.title)}`}
                  className="btn btn-accent mt-6 w-full justify-center !px-6 !py-[18px]"
                >
                  Jetzt bewerben
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <button
                  type="button"
                  className="btn mt-2.5 w-full justify-center border border-white/25 !bg-transparent !px-6 !py-3.5 !text-paper"
                >
                  <Sparkles className="h-3 w-3" />
                  KI-Match prüfen
                </button>
                <div className="mt-6 border-t border-white/10 pt-6 text-[13px] text-white/70">
                  Dein Ansprechpartner Alexander Esau meldet sich werktags innerhalb von 24 Stunden.
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
