import Image from 'next/image'
import { MapPin, Clock, Euro, ArrowUpRight, Sparkles } from 'lucide-react'
import type { SampleJob } from '@/data/jobs'

const AUFGABEN = [
  'Vor- und Nachbereitung von Anästhesien in einem hochmodernen OP-Bereich',
  'Assistenz bei sämtlichen anästhesiologischen Verfahren',
  'Betreuung der Patient:innen vor, während und nach der OP',
  'Sicherstellung von Hygiene- und Qualitätsstandards',
  'Enge Zusammenarbeit im interprofessionellen Team',
]

const MITBRINGEN = [
  'Abgeschlossene Ausbildung im jeweiligen Pflegeberuf',
  'Berufserfahrung im Einsatzbereich (wünschenswert)',
  'Hohes Maß an Verantwortungsbewusstsein und Empathie',
  'Bereitschaft zur Schichtarbeit',
]

const BENEFITS = [
  { k: 'Gehalt', v: '+30 % über Tarif' },
  { k: 'Schichten', v: 'flexibel planbar' },
  { k: 'Wechselprämie', v: 'bis zu 3.000 €' },
  { k: 'Urlaub', v: '30 Tage + Brückentage' },
  { k: 'Firmenwagen', v: 'oder Mobilitätszuschuss' },
  { k: 'Weiterbildung', v: '100 % bezahlt' },
]

const PROCESS = [
  { n: '01', t: 'Bewerben', d: 'In 2 Min., kein Lebenslauf nötig' },
  { n: '02', t: 'Kennenlernen', d: 'Telefonat mit Alexander' },
  { n: '03', t: 'Match prüfen', d: 'Wir besuchen die Einrichtung mit dir' },
  { n: '04', t: 'Starten', d: "Vertrag, Onboarding, los geht's" },
]

const SCHNELLINFO: [string, string][] = [
  ['Arbeitsbeginn', 'ab sofort'],
  ['Vertrag', 'unbefristet'],
  ['Schichten', 'Früh / Spät / Bereitschaft'],
  ['Probezeit', '6 Monate'],
  ['Wechselprämie', 'bis 3.000 €'],
]

export function JobDetailContent({ job }: { job: SampleJob }) {
  return (
    <>
      {/* Header */}
      <section className="pt-10 pb-12 lg:pb-16">
        <div className="wrap">
          <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <div>
              <div className="mb-6 flex flex-wrap gap-2">
                {job.featured && <span className="tag tag-accent">Top-Job</span>}
                <span className="tag">{job.role}</span>
                <span className="tag tag-sage">{job.workload}</span>
              </div>
              <h1 className="h1 m-0 mb-8">{job.title}</h1>
              <div className="flex flex-wrap gap-x-8 gap-y-3 text-[15px] text-ink-soft">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" />
                  {job.location}, {job.region}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  {job.workload}
                </span>
                {job.salary && (
                  <span className="inline-flex items-center gap-2">
                    <Euro className="h-3.5 w-3.5" />
                    {job.salary} brutto
                  </span>
                )}
              </div>
            </div>
            <div
              className="overflow-hidden bg-accent-soft shadow-float"
              style={{ aspectRatio: '4 / 5', borderRadius: '160px 160px 14px 14px' }}
            >
              {job.image && (
                <Image
                  src={job.image}
                  alt=""
                  width={600}
                  height={750}
                  priority
                  className="h-full w-full object-cover"
                />
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
                <div className="eyebrow">Über die Stelle</div>
                <h2 className="h2 mb-8 mt-5">
                  In einer renommierten Spezialklinik erwartet dich ein vielseitiges Aufgabenfeld.
                </h2>
                <p className="text-[18px] leading-relaxed text-ink-soft">{job.excerpt}</p>

                <h3 className="h3 mb-5 mt-14">Deine Aufgaben</h3>
                <ul className="m-0 grid list-none gap-3.5 p-0">
                  {AUFGABEN.map((t) => (
                    <li key={t} className="flex gap-3.5 text-base leading-relaxed">
                      <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent text-[11px] text-white">
                        ✓
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>

                <h3 className="h3 mb-5 mt-14">Was du mitbringst</h3>
                <ul className="m-0 grid list-none gap-3.5 p-0">
                  {MITBRINGEN.map((t) => (
                    <li key={t} className="flex gap-3.5 text-base leading-relaxed">
                      <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-[1.5px] border-ink text-[11px] text-ink">
                        •
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>

                <h3 className="h3 mb-5 mt-14">Was wir dir bieten</h3>
                <div className="grid gap-3.5 sm:grid-cols-2">
                  {BENEFITS.map((b) => (
                    <div
                      key={b.k}
                      className="rounded-[12px] border border-line bg-paper p-5"
                    >
                      <div className="eyebrow">{b.k}</div>
                      <div className="mt-1.5 font-serif text-[22px] tracking-tight">
                        {b.v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

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

            <aside className="lg:sticky lg:top-24">
              <div className="rounded-[16px] bg-ink p-8 text-paper">
                <div className="eyebrow !text-white/50">Bewerbung</div>
                <div className="mt-3.5 font-serif text-[48px] font-light leading-none tracking-tight">
                  Ø 6 Tage
                  <br />
                  <span className="text-accent-soft">bis zur Zusage</span>
                </div>
                <div className="mt-7 border-y border-white/10 py-5">
                  <div className="text-[13px] text-white/60">Bruttogehalt (Vollzeit)</div>
                  <div className="mt-1 font-serif text-[36px] font-light tracking-tight">
                    {job.salary || '—'}
                    {job.salary && (
                      <span className="ml-1.5 text-[16px] opacity-60">€/Mo</span>
                    )}
                  </div>
                  <div className="mt-2 text-[12px] text-white/55">
                    + Zulagen für Nacht- &amp; Wochenenddienste
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-accent mt-6 w-full justify-center !px-6 !py-[18px]"
                >
                  Jetzt bewerben
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  className="btn mt-2.5 w-full justify-center border border-white/25 !bg-transparent !px-6 !py-3.5 !text-paper"
                >
                  <Sparkles className="h-3 w-3" />
                  KI-Match prüfen
                </button>
                <div className="mt-6 flex items-center gap-3.5 border-t border-white/10 pt-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/uploads/Geschäftsführer.jpg"
                    alt="Alexander Esau"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="text-[14px]">Alexander Esau</div>
                    <div className="text-[12px] text-white/50">Dein Ansprechpartner</div>
                  </div>
                  <a href="tel:+49" className="text-[13px] text-accent-soft hover:underline">
                    Anrufen
                  </a>
                </div>
              </div>

              <div className="mt-5 rounded-[14px] border border-line bg-paper-2 p-6">
                <div className="eyebrow">Schnellinfo</div>
                <ul className="m-0 mt-4 grid list-none gap-3 p-0 text-[14px]">
                  {SCHNELLINFO.map(([k, v]) => (
                    <li key={k} className="flex justify-between">
                      <span className="text-ink-muted">{k}</span>
                      <span className="font-medium">{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
