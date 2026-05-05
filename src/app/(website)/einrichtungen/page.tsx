import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Check } from 'lucide-react'
import { EinrichtungenAnfrageForm } from '@/components/sections/samaritano/landing/EinrichtungenAnfrageForm'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Für Einrichtungen',
  description:
    'Samaritano vermittelt Pflegepersonal nach Werte-Match, nicht nach Skill-Liste. Weniger Fluktuation, höhere Bindung.',
}

const STATS = [
  { n: '89', l: 'Partner-Einrichtungen' },
  { n: '6 Tage', l: 'Ø Vermittlungsdauer' },
  { n: '94 %', l: 'Verbleib nach 12 Monaten' },
  { n: '4,9 ★', l: 'Bewertung von Pflegekräften' },
]

const ANGEBOTE = [
  {
    t: 'Direktvermittlung',
    p: 'Ab 18 % Jahresgehalt',
    d: 'Wir finden, prüfen und vermitteln. Du übernimmst, wir treten zurück.',
    inc: [
      'Vorprüfung & Referenzcheck',
      'Persönliches Onboarding',
      '6 Monate Garantiezeit',
      'Werte-Match-Profil',
    ],
  },
  {
    t: 'Personaldienstleistung',
    p: 'Stundensatz auf Anfrage',
    d: 'Pflegekräfte über Samaritano angestellt, flexibel einsetzbar in deinem Haus.',
    inc: [
      'Tarifkonforme Vergütung',
      'Übernahmeoption nach 6 Monaten',
      'Springer-Pool verfügbar',
      'Schichtdienst inkl.',
    ],
    featured: true,
  },
  {
    t: 'Recruiting-Partnerschaft',
    p: 'Pauschal pro Quartal',
    d: 'Wir bauen deine Pipeline mit auf, kontinuierlich, planbar, datenbasiert.',
    inc: [
      'Eigene Stellen-Microsite',
      'Monatlicher Bewerber-Report',
      'Employer-Branding-Workshop',
      'Dedicated Account',
    ],
  },
]

const PROCESS = [
  { n: '01', t: 'Briefing', d: '30 Minuten, wir verstehen Haus, Team, Werte.' },
  { n: '02', t: 'Suche', d: 'Aus Pool & aktiver Ansprache, Werte-Match priorisiert.' },
  { n: '03', t: 'Vorstellung', d: '3–5 vorgeprüfte Profile mit Match-Score.' },
  { n: '04', t: 'Onboarding', d: 'Wir begleiten die ersten 6 Monate aktiv mit.' },
]

export default function EinrichtungenPage() {
  return (
    <>
      {/* Hero */}
      <section className="pb-20 pt-16 lg:pb-24 lg:pt-20">
        <div className="wrap grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="eyebrow">Für Einrichtungen</div>
            <h1 className="display mt-6">
              <span className="block whitespace-nowrap">Pflegekräfte,</span>
              <span className="block whitespace-nowrap">
                die <em>bleiben</em>
              </span>
              <span className="block whitespace-nowrap">wollen.</span>
            </h1>
            <p className="lede mt-8 max-w-[540px]">
              Wir vermitteln Pflegepersonal nach Werte-Match, nicht nach Skill-Liste. Das Ergebnis:
              weniger Fluktuation, höhere Bindung.
            </p>
            <div className="mt-10 flex flex-wrap gap-3.5">
              <Link href="#anfrage" className="btn btn-primary !px-6 !py-4">
                Personal anfragen
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="#angebot" className="btn btn-quiet">
                Angebot ansehen
              </Link>
            </div>
          </div>
          <div
            className="relative overflow-hidden rounded-[20px]"
            style={{ aspectRatio: '4 / 5' }}
          >
            <Image
              src="/uploads/_DSC9380-46b8d86e.jpg"
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-line bg-paper-2 py-16">
        <div className="wrap">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.l}>
                <div className="font-serif text-[64px] font-light leading-none tracking-tight text-sky">
                  {s.n}
                </div>
                <div className="mt-3 text-[14px] text-ink-soft">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Angebot */}
      <section id="angebot" className="py-24 lg:py-32">
        <div className="wrap">
          <div className="mb-12 max-w-[600px] lg:mb-16">
            <div className="eyebrow">Drei Wege zur Pflegekraft</div>
            <h2 className="h1 mt-5">
              Modelle, die zu deinem <em>Haus</em> passen.
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {ANGEBOTE.map((a) => {
              const featured = a.featured
              return (
                <div
                  key={a.t}
                  className={cn(
                    'flex min-h-[480px] flex-col rounded-[16px] border p-9',
                    featured
                      ? 'border-ink bg-ink text-paper'
                      : 'border-line bg-paper-2 text-ink'
                  )}
                >
                  {featured && (
                    <span className="tag tag-accent mb-4 self-start">Beliebteste Wahl</span>
                  )}
                  <h3 className="m-0 mb-2 font-serif text-[32px] font-normal text-inherit">
                    {a.t}
                  </h3>
                  <div
                    className={cn(
                      'mb-5 font-mono text-[13px]',
                      featured ? 'text-sky' : 'text-ink-muted'
                    )}
                  >
                    {a.p}
                  </div>
                  <p
                    className={cn(
                      'mb-6 text-[15px] leading-relaxed',
                      featured ? 'text-white/75' : 'text-ink-soft'
                    )}
                  >
                    {a.d}
                  </p>
                  <ul className="m-0 mb-8 grid list-none gap-2.5 p-0 text-[14px]">
                    {a.inc.map((i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="mt-1 h-3.5 w-3.5 flex-shrink-0 text-sky" strokeWidth={3} />
                        <span>{i}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="#anfrage"
                    className={cn(
                      'btn mt-auto justify-center !px-5 !py-3.5',
                      featured ? '!bg-accent !text-white hover:!bg-accent-deep' : '!bg-ink !text-paper'
                    )}
                  >
                    Anfragen
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-paper-2 py-24 lg:py-32">
        <div className="wrap">
          <div className="mb-12 max-w-[600px] lg:mb-16">
            <div className="eyebrow">So arbeiten wir</div>
            <h2 className="h1 mt-5">
              Vier Schritte zum <em>passenden</em> Profil.
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((s) => (
              <div key={s.n} className="border-t-2 border-ink pt-6">
                <div className="mb-3.5 font-mono text-[13px] text-sky">{s.n}</div>
                <h3 className="mb-3 font-serif text-[24px] font-normal">{s.t}</h3>
                <p className="m-0 text-[14px] leading-relaxed text-ink-soft">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Anfrage */}
      <section id="anfrage" className="py-24 lg:py-32">
        <div className="wrap">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <div className="eyebrow">Personal anfragen</div>
              <h2 className="h1 mt-5">
                Sag uns, wen ihr <em>sucht</em>.
              </h2>
              <p className="lede mt-6">
                Antwort innerhalb von 24 Stunden. Erstes Briefing kostenlos, unverbindlich.
              </p>
              <div className="mt-12 grid gap-5 text-[15px]">
                <div>
                  <strong>Tel.</strong>{' '}
                  <a
                    href="tel:+498007262744"
                    className="border-b border-line transition-colors hover:border-sky hover:text-sky"
                  >
                    0800 SAMARI (726 274)
                  </a>
                </div>
                <div>
                  <strong>Mail</strong>{' '}
                  <a
                    href="mailto:einrichtungen@samaritano.de"
                    className="border-b border-line transition-colors hover:border-sky hover:text-sky"
                  >
                    einrichtungen@samaritano.de
                  </a>
                </div>
              </div>
            </div>
            <EinrichtungenAnfrageForm />
          </div>
        </div>
      </section>
    </>
  )
}
