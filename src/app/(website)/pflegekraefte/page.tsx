import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { FAQSection } from '@/components/sections/samaritano/FAQSection'
import { TestimonialSlider } from '@/components/sections/samaritano/TestimonialSlider'
import { FeaturedJobs } from '@/components/sections/samaritano/FeaturedJobs'
import { SalaryTeaserAnimated } from '@/components/sections/samaritano/SalaryTeaserAnimated'
import { getTestimonialsByContext } from '@/sanity/queries'
import { urlFor } from '@/sanity/client'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { ParallaxImage } from '@/components/ui/ParallaxImage'
import { TiltCard } from '@/components/ui/TiltCard'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'

export const metadata: Metadata = {
  title: 'Für Pflegekräfte',
  description:
    'Bereit für ein neues Abenteuer in der Pflege? samaritano öffnet Dir das Tor zu einer Welt voller Möglichkeiten. Entdecke die Freiheit der Zeitarbeit Pflege.',
}

const BENEFITS = [
  {
    n: '01',
    t: 'Gerechte Bezahlung',
    d: 'Bei samaritano schätzen wir deine Arbeit und bieten eine faire Vergütung, die deiner Rolle in der Gesundheitsversorgung gerecht wird. Unsere effizienten Prozesse ermöglichen attraktive Gehälter, damit du dich auf deine Patienten konzentrieren kannst.',
  },
  {
    n: '02',
    t: 'Transparente Kommunikation',
    d: 'Bei uns stehst du immer im Mittelpunkt. Wir pflegen eine offene und transparente Kommunikation, damit du jederzeit informiert bist und deine Anliegen Gehör finden.',
  },
  {
    n: '03',
    t: 'Starke Gemeinschaft',
    d: 'Bei samaritano wirst du Teil eines Teams, das auf gegenseitige Unterstützung und Zusammenarbeit setzt. Gemeinsam schaffen wir ein Arbeitsumfeld, in dem du dich wertgeschätzt und aufgehoben fühlst.',
  },
  {
    n: '04',
    t: 'Geleitet von ehemaligen Pflegekräften',
    d: 'Als ehemalige Pflegekräfte verstehen wir die Bedürfnisse unserer Mitarbeiterinnen und Mitarbeiter genau und setzen uns für ihre Zufriedenheit ein.',
  },
  {
    n: '05',
    t: 'Mehr Flexibilität',
    d: 'Wir ermöglichen dir, deine Arbeitszeiten flexibler zu gestalten und Beruf und Privatleben besser zu vereinbaren.',
  },
]

const PROCESS = [
  {
    n: '1',
    t: 'Bewerbung einreichen',
    d: 'Lebenslauf hochladen — mehr brauchen wir nicht.',
  },
  {
    n: '2',
    t: 'Persönliches Gespräch',
    d: 'Wir melden uns kurzfristig bei dir, um alle Details zu klären und deine Fragen zu beantworten.',
  },
  {
    n: '3',
    t: 'Einsatzmöglichkeiten besprechen',
    d: 'Gemeinsam besprechen wir deine Wünsche und finden die passenden Einsatzmöglichkeiten für dich.',
  },
  {
    n: '4',
    t: 'Schnell ins Team',
    d: 'Unser Ziel ist es, dich schnell und unkompliziert in unser Team aufzunehmen.',
  },
]

export default async function PflegekraeftePage() {
  const testimonials = await getTestimonialsByContext('pflegekraefte')

  // Build image URLs server-side (urlFor needs the Sanity client)
  const imageUrls: Record<string, string | null> = {}
  for (const t of testimonials) {
    imageUrls[t._id] = t.image ? urlFor(t.image)?.width(600).height(750).url() ?? null : null
  }
  return (
    <>
      {/* Hero */}
      <section className="pb-20 pt-16 lg:pb-24 lg:pt-20">
        <div className="wrap grid items-center gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <ScrollReveal>
            <div>
              <div className="eyebrow">Für Pflegekräfte</div>
              <h1 className="display mt-6">
                <span className="block sm:whitespace-nowrap">Angebot für</span>
                <span className="block sm:whitespace-nowrap">
                  <em>Pflegekräfte</em>.
                </span>
              </h1>
              <p className="lede mt-8 max-w-[560px]">
                Bereit für ein neues Abenteuer in der Pflege? samaritano öffnet Dir das Tor zu einer
                Welt voller Möglichkeiten. Entdecke die Freiheit der Zeitarbeit Pflege und werde Teil
                einer Gemeinschaft, die Fachkompetenz mit Herzenswärme vereint.
              </p>
              <blockquote className="mt-6 border-l-2 border-sky pl-4 text-[15px] italic text-ink-soft">
                &bdquo;Wähle einen Job, wo man dich liebt, und du wirst nie wieder arbeiten müssen.&ldquo;
              </blockquote>
              <div className="mt-10 flex flex-wrap gap-3.5">
                <Link href="/jobs" className="btn btn-primary !px-6 !py-4">
                  Stellenangebote ansehen
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
                <Link href="/gehaltsrechner" className="btn btn-quiet">
                  Gehalt berechnen
                </Link>
              </div>
            </div>
          </ScrollReveal>
          <ParallaxImage
            src="https://cdn.sanity.io/images/vnx2p4mc/production/d31480f48ab826443ad240042f3ac7c4d37b0ead-2560x1707.jpg"
            alt="Pflegekraft bei der Arbeit"
            aspectRatio="4 / 5"
            className="rounded-[20px]"
          />
        </div>
      </section>

      {/* Featured Jobs */}
      <FeaturedJobs />

      {/* Gehaltsrechner Teaser */}
      <SalaryTeaserAnimated />

      {/* Benefits */}
      <section className="bg-paper-2 py-24 lg:py-32">
        <div className="wrap">
          <ScrollReveal>
            <div className="mb-16 max-w-[820px] lg:mb-20">
              <div className="eyebrow">Deine Vorteile</div>
              <h2 className="h1 mt-5">
                Deine Vorteile mit <em>samaritano</em>.
              </h2>
              <p className="lede mt-4">Und was Du von uns erwarten kannst.</p>
            </div>
          </ScrollReveal>
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b, i) => (
              <ScrollReveal key={b.n} delay={i * 0.1}>
                <TiltCard className="h-full border-t border-line pt-6">
                  <div className="mb-4 font-mono text-[13px] text-sky">{b.n}</div>
                  <h3 className="mb-3.5 font-serif text-[26px] font-normal tracking-tight">{b.t}</h3>
                  <p className="m-0 text-[15px] leading-relaxed text-ink-soft">{b.d}</p>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 lg:py-32">
        <div className="wrap">
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <ScrollReveal className="lg:sticky lg:top-24">
              <div className="eyebrow">In vier Schritten</div>
              <h2 className="h1 mt-5">
                So läuft das bei <em>uns</em>.
              </h2>
              <p className="lede mt-6">
                Kein Bewerbungsmarathon, kein Standardprozess. Wir nehmen uns Zeit, weil deine
                Entscheidung Zeit verdient.
              </p>
            </ScrollReveal>
            <div className="grid gap-8">
              {PROCESS.map((s, i) => (
                <ScrollReveal key={s.n} delay={i * 0.12}>
                  <div className="grid grid-cols-[56px_1fr] gap-4 border-b border-line pb-8 sm:grid-cols-[80px_1fr] sm:gap-6">
                    <AnimatedCounter
                      value={parseInt(s.n)}
                      className="font-serif font-light leading-none text-sky text-[44px] sm:text-[64px]"
                    />
                    <div className="min-w-0">
                      <h3 className="mb-3 mt-1 font-serif font-normal text-[22px] sm:text-[26px]">{s.t}</h3>
                      <p className="m-0 text-[16px] leading-relaxed text-ink-soft">{s.d}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Voices */}
      {testimonials.length > 0 && (
        <section className="bg-ink py-24 text-paper lg:py-32">
          <div className="wrap">
            <ScrollReveal>
              <div className="mb-16 lg:mb-20">
                <div className="eyebrow !text-white/55">Stimmen aus dem Netzwerk</div>
                <h2 className="h1 mt-5 !text-paper">
                  Was <em className="text-sky">Samaritanos</em> sagen.
                </h2>
              </div>
            </ScrollReveal>
            <TestimonialSlider testimonials={testimonials} imageUrls={imageUrls} />
          </div>
        </section>
      )}

      {/* FAQ */}
      <FAQSection
        categorySlug="pflegekraefte"
        eyebrow="FAQ"
        title="Antworten auf eure Fragen."
        description="Was Bewerber*innen oft fragen — alles, was du vor dem ersten Gespräch wissen willst."
      />

      {/* CTA */}
      <section className="py-24 lg:py-32">
        <div className="wrap">
          <ScrollReveal>
            <div className="grid items-center gap-8 rounded-[20px] bg-accent p-6 text-white sm:p-10 md:p-14 lg:grid-cols-[1.5fr_auto] lg:p-20">
              <div>
                <h2 className="h1 m-0 !text-white">
                  Bereit für den
                  <br />
                  nächsten Schritt?
                </h2>
                <p className="mt-5 max-w-[520px] text-[17px] text-white/85">
                  Wir helfen dir, die richtige Stelle zu finden. Bewirb dich jetzt und werde Teil
                  unseres Teams.
                </p>
              </div>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2.5 self-start rounded-full bg-white px-7 py-4 text-[15px] font-semibold text-accent transition-all hover:-translate-y-0.5 hover:bg-paper lg:self-center"
              >
                Jetzt Traumjob finden
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
