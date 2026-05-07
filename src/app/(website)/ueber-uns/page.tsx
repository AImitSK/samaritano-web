import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { getAllTeamMembers, getAllMilestones } from '@/sanity/queries'
import { urlFor } from '@/sanity/client'

export const metadata: Metadata = {
  title: 'Über uns',
  description:
    'Samaritano ist ein christlich geprägtes Vermittlungsunternehmen für Pflegekräfte. Gegründet 2023 – wir sind Pfleger, keine Betriebswirte.',
}

const WERTE = [
  {
    n: '01',
    t: 'Gerechte Bezahlung',
    d: 'Faire Vergütung für unsere Mitarbeiter und gleichzeitig kostengünstige Lösungen für Einrichtungen. Durch effiziente Prozesse schaffen wir ein Umfeld, in dem sich Pflegekräfte wertgeschätzt fühlen und sich auf die Versorgung konzentrieren können.',
  },
  {
    n: '02',
    t: 'Chancengleichheit',
    d: 'Alle Mitarbeiter werden unabhängig von Herkunft, Geschlecht oder persönlichen Umständen respektiert und gefördert. Regelmäßige Weiterbildungen ermöglichen persönliche und berufliche Entwicklung.',
  },
  {
    n: '03',
    t: 'Christliche Werte',
    d: 'Nächstenliebe, Integrität und Mitgefühl sind Grundpfeiler unserer täglichen Arbeit. Wir sehen Patientenversorgung als Ausdruck christlicher Nächstenliebe und engagieren uns in lokalen Gemeinschaftsinitiativen.',
  },
]

const ZERTIFIKATE = ['AÜG-Erlaubnis', 'DiAG MAV', 'Diakonieverband', 'TÜV-zertifiziert']

export default async function UeberUnsPage() {
  const [team, milestones] = await Promise.all([
    getAllTeamMembers(),
    getAllMilestones(),
  ])

  return (
    <>
      {/* Hero */}
      <section className="pb-16 pt-16 lg:pb-20 lg:pt-20">
        <div className="wrap">
          <div className="eyebrow">Über uns</div>
          <h1 className="display mt-6 max-w-[1100px]">
            <span className="block sm:whitespace-nowrap">
              Wir sind <em>Pfleger</em>,
            </span>
            <span className="block sm:whitespace-nowrap">keine Betriebswirte.</span>
          </h1>
          <p className="lede mt-8 max-w-[720px]">
            Samaritano wurde im Januar 2023 von Alexander Esau gegründet — aus persönlichen
            Erfahrungen und dem Wunsch, positive Veränderungen im Gesundheitswesen zu bewirken.
            Von Niedersachsen und Nordrhein-Westfalen aus unterstützen wir Kliniken, Pflegeeinrichtungen
            und Pflegedienste mit hochqualifiziertem Fachpersonal.
          </p>
        </div>
      </section>

      {/* Image band */}
      <section className="pb-24 lg:pb-32">
        <div className="wrap grid gap-6 md:grid-cols-[1.4fr_1fr]">
          {[
            { src: '/uploads/_DSC9472-Bearbeitet.jpg', alt: '' },
            { src: '/uploads/_DSC9356-Bearbeitet.jpg', alt: '' },
          ].map((img) => (
            <div
              key={img.src}
              className="relative overflow-hidden rounded-[16px]"
              style={{ aspectRatio: '4 / 3' }}
            >
              <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          ))}
        </div>
      </section>

      {/* Werte */}
      <section className="bg-ink py-24 text-paper lg:py-32">
        <div className="wrap">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="eyebrow !text-white/55">Was uns antreibt</div>
              <h2 className="h1 mt-5 !text-paper">
                Drei <em className="text-sky">Werte</em>,
                <br />
                die uns leiten.
              </h2>
            </div>
            <div className="grid gap-10">
              {WERTE.map((w) => (
                <div
                  key={w.n}
                  className="grid grid-cols-[60px_1fr] gap-6 border-b border-white/10 pb-8"
                >
                  <div className="font-mono text-[13px] text-sky">{w.n}</div>
                  <div>
                    <h3 className="m-0 mb-3.5 font-serif text-[32px] font-normal !text-paper">{w.t}</h3>
                    <p className="m-0 text-[16px] leading-relaxed text-white/75">{w.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gründungsgeschichte */}
      <section className="py-24 lg:py-32">
        <div className="wrap">
          <div className="grid items-start gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <div>
              <div className="eyebrow">Unsere Geschichte</div>
              <h2 className="h1 mt-5">
                Wie alles <em>begann</em>.
              </h2>
            </div>
            <div>
              <p className="m-0 text-[20px] font-light leading-relaxed text-ink-soft lg:text-[22px]">
                <span className="font-serif text-[48px] font-light leading-none text-sky lg:text-[56px]">&bdquo;</span>
                Wähle einen Job, wo man dich liebt, und du wirst nie wieder arbeiten müssen.
              </p>
              <p className="mt-6 text-[16px] leading-relaxed text-ink-soft">
                Als Geschäftsführer Alexander Esau Samaritano im Januar 2023 gründete, war der Antrieb
                persönlich: eigene Erfahrungen im Gesundheitswesen und der Wunsch, es besser zu machen.
                Heute unterstützen wir von Niedersachsen und Nordrhein-Westfalen aus Kliniken,
                Pflegeeinrichtungen und Pflegedienste mit hochqualifiziertem Fachpersonal.
              </p>
              {milestones.length > 0 && (
                <div className="mt-10 grid gap-8">
                  {milestones.map((m) => (
                    <div
                      key={m._id}
                      className="grid grid-cols-[80px_1fr] gap-6 border-t border-line pt-6"
                    >
                      <div className="font-serif text-[40px] font-light leading-none tracking-tight text-sky">
                        {m.year}
                      </div>
                      <div>
                        <h3 className="m-0 mb-2 mt-1 font-serif text-[22px] font-normal">{m.title}</h3>
                        {m.description && (
                          <p className="m-0 text-[15px] leading-relaxed text-ink-soft">{m.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      {team.length > 0 && (
        <section className="bg-paper-2 py-24 lg:py-32">
          <div className="wrap">
            <div className="mb-12 max-w-[600px] lg:mb-16">
              <div className="eyebrow">Wer hinter Samaritano steht</div>
              <h2 className="h1 mt-5">
                Das <em>Team</em>.
              </h2>
            </div>
            {/* eslint-disable @next/next/no-img-element */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((p) => {
                const img = p.image
                  ? urlFor(p.image)?.width(600).height(750).url() ?? null
                  : null
                return (
                  <div key={p._id}>
                    <div
                      className="mb-4 overflow-hidden rounded-[12px] bg-paper-2"
                      style={{ aspectRatio: '4 / 5' }}
                    >
                      {img && (
                        <img
                          src={img}
                          alt={p.image?.alt || p.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="mb-1 font-serif text-[22px] font-normal">{p.name}</div>
                    <div className="text-[14px] text-ink-muted">{p.position}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Zertifizierungen */}
      <section className="py-24 lg:py-32">
        <div className="wrap">
          <div className="mb-12 max-w-[600px]">
            <div className="eyebrow">Geprüft &amp; verlässlich</div>
            <h2 className="h2 mt-5">Zertifizierungen &amp; Mitgliedschaften.</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ZERTIFIKATE.map((c) => (
              <div
                key={c}
                className="grid place-items-center rounded-[12px] border border-line p-8 text-center font-serif text-[18px] text-ink-soft"
                style={{ aspectRatio: '3 / 2' }}
              >
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 pt-12 lg:pb-32">
        <div className="wrap">
          <div className="grid items-center gap-10 rounded-[20px] bg-ink p-10 text-paper sm:p-14 lg:grid-cols-2 lg:p-20">
            <h2 className="h1 m-0 !text-paper">
              Lerne uns
              <br />
              persönlich kennen.
            </h2>
            <div>
              <p className="mt-0 text-[17px] text-white/75">
                Egal ob du Pflegekraft bist oder eine Einrichtung leitest, schreib uns. Wir nehmen uns
                Zeit.
              </p>
              <div className="mt-6 flex flex-wrap gap-3.5">
                <Link href="/kontakt" className="btn btn-primary !px-6 !py-4">
                  Kontakt aufnehmen
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-transparent px-6 py-4 text-[15px] font-medium text-paper transition-colors hover:bg-white/10"
                >
                  Stellen ansehen
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
