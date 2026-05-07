import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { FAQSection } from '@/components/sections/samaritano/FAQSection'
import { TestimonialSlider } from '@/components/sections/samaritano/TestimonialSlider'
import { getTestimonialsByContext } from '@/sanity/queries'
import { urlFor } from '@/sanity/client'

export const metadata: Metadata = {
  title: 'Für Pflegekräfte',
  description:
    'Samaritano vermittelt Pflegekräfte in christliche Einrichtungen, deren Werte zu deinen passen, nicht nur in offene Stellen.',
}

const BENEFITS = [
  {
    n: '01',
    t: 'Werte als Fundament',
    d: 'Wir vermitteln dich gezielt in Häuser, in denen Diakonie, Caritas oder freie Träger nicht nur Etikett sind, sondern gelebte Kultur.',
  },
  {
    n: '02',
    t: 'Faire, transparente Bezahlung',
    d: 'Tarif AVR, AVR-DD, TVöD-P, du weißt vorher, was du verdienst. Plus Zulagen, Wechselprämie, Fortbildungsbudget.',
  },
  {
    n: '03',
    t: 'Persönliche Begleitung',
    d: 'Eine feste Ansprechpartnerin, die deinen Werdegang kennt, von der ersten Frage bis nach der Probezeit.',
  },
  {
    n: '04',
    t: 'Schnell zur Zusage',
    d: 'Im Schnitt 6 Tage von Erstgespräch bis Vertrag. Wir prüfen vor, du bekommst nur Stellen, die wirklich passen.',
  },
  {
    n: '05',
    t: 'Echte Auswahl',
    d: '147 offene Positionen in über 89 Partner-Einrichtungen. Vollzeit, Teilzeit, Minijob, Springer.',
  },
  {
    n: '06',
    t: 'Weiterentwicklung',
    d: 'Fachweiterbildungen, Praxisanleiter-Qualifikation, Studium berufsbegleitend, wir vermitteln auch in Häuser, die das fördern.',
  },
]

const PROCESS = [
  {
    n: '1',
    t: 'Bewerben in 3 Minuten',
    d: 'Lebenslauf hochladen oder LinkedIn verbinden. Mehr brauchen wir nicht.',
  },
  {
    n: '2',
    t: 'Gespräch auf Augenhöhe',
    d: '30 Minuten Telefon oder Video. Wir wollen dich verstehen, nicht abhaken.',
  },
  {
    n: '3',
    t: 'Passende Stellen',
    d: 'Du bekommst 3–5 Vorschläge mit echtem Match-Score. Du entscheidest, was dich interessiert.',
  },
  {
    n: '4',
    t: 'Probearbeit & Vertrag',
    d: 'Wir organisieren Hospitation, begleiten Verhandlung, klären Vertragsdetails.',
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
          <div>
            <div className="eyebrow">Für Pflegekräfte</div>
            <h1 className="display mt-6">
              <span className="block sm:whitespace-nowrap">Dein Beruf</span>
              <span className="block sm:whitespace-nowrap">
                ist <em>Berufung</em>.
              </span>
              <span className="block sm:whitespace-nowrap">Wir finden den Ort.</span>
            </h1>
            <p className="lede mt-8 max-w-[560px]">
              Samaritano vermittelt Pflegekräfte in christliche Einrichtungen, deren Werte zu deinen
              passen, nicht nur in offene Stellen.
            </p>
            <div className="mt-10 flex flex-wrap gap-3.5">
              <Link href="/jobs" className="btn btn-primary !px-6 !py-4">
                Stellen ansehen
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/gehaltsrechner" className="btn btn-quiet">
                Gehalt berechnen
              </Link>
            </div>
          </div>
          <div
            className="relative overflow-hidden rounded-[20px]"
            style={{ aspectRatio: '4 / 5' }}
          >
            <Image
              src="/uploads/_DSC9356-Bearbeitet.jpg"
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-paper-2 py-24 lg:py-32">
        <div className="wrap">
          <div className="mb-16 max-w-[820px] lg:mb-20">
            <div className="eyebrow">Was wir anders machen</div>
            <h2 className="h1 mt-5">
              Sechs Dinge, die wir dir <em>versprechen</em>.
            </h2>
          </div>
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <div key={b.n} className="border-t border-line pt-6">
                <div className="mb-4 font-mono text-[13px] text-sky">{b.n}</div>
                <h3 className="mb-3.5 font-serif text-[26px] font-normal tracking-tight">{b.t}</h3>
                <p className="m-0 text-[15px] leading-relaxed text-ink-soft">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 lg:py-32">
        <div className="wrap">
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <div className="lg:sticky lg:top-24">
              <div className="eyebrow">In vier Schritten</div>
              <h2 className="h1 mt-5">
                So läuft das bei <em>uns</em>.
              </h2>
              <p className="lede mt-6">
                Kein Bewerbungsmarathon, kein Standardprozess. Wir nehmen uns Zeit, weil deine
                Entscheidung Zeit verdient.
              </p>
            </div>
            <div className="grid gap-8">
              {PROCESS.map((s) => (
                <div
                  key={s.n}
                  className="grid grid-cols-[56px_1fr] gap-4 border-b border-line pb-8 sm:grid-cols-[80px_1fr] sm:gap-6"
                >
                  <div className="font-serif font-light leading-none text-sky text-[44px] sm:text-[64px]">
                    {s.n}
                  </div>
                  <div className="min-w-0">
                    <h3 className="mb-3 mt-1 font-serif font-normal text-[22px] sm:text-[26px]">{s.t}</h3>
                    <p className="m-0 text-[16px] leading-relaxed text-ink-soft">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Voices */}
      {testimonials.length > 0 && (
        <section className="bg-ink py-24 text-paper lg:py-32">
          <div className="wrap">
            <div className="mb-16 lg:mb-20">
              <div className="eyebrow !text-white/55">Stimmen aus dem Netzwerk</div>
              <h2 className="h1 mt-5 !text-paper">
                Was <em className="text-sky">Samaritanos</em> sagen.
              </h2>
            </div>
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
          <div className="grid items-center gap-8 rounded-[20px] bg-accent p-6 text-white sm:p-10 md:p-14 lg:grid-cols-[1.5fr_auto] lg:p-20">
            <div>
              <h2 className="h1 m-0 !text-white">
                Bereit für den
                <br />
                nächsten Schritt?
              </h2>
              <p className="mt-5 max-w-[520px] text-[17px] text-white/85">
                147 offene Stellen warten, wir helfen dir, die richtige zu finden.
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
        </div>
      </section>
    </>
  )
}
