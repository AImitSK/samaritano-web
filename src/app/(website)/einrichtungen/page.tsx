import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Check } from 'lucide-react'
import { EinrichtungenAnfrageForm } from '@/components/sections/samaritano/landing/EinrichtungenAnfrageForm'
import { FAQSection } from '@/components/sections/samaritano/FAQSection'
import { FounderQuote } from '@/components/sections/samaritano/FounderQuote'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { ParallaxImage } from '@/components/ui/ParallaxImage'
import { TiltCard } from '@/components/ui/TiltCard'

export const metadata: Metadata = {
  title: 'Für Einrichtungen',
  description:
    'samaritano ist Ihr verlässlicher Partner für die Vermittlung hochqualifizierter Pflegefachkräfte. Flexibel, zuverlässig und werteorientiert.',
}

const STATS = [
  { n: 'Persönlich', l: 'Feste Ansprechpartner' },
  { n: 'Schnell', l: 'Kurze Vermittlungswege' },
  { n: 'Fair', l: 'Transparente Konditionen' },
  { n: '4,9 ★', l: 'Bewertung von Pflegekräften' },
]

const VORTEILE = [
  {
    n: '01',
    t: 'Expertise & Erfahrung',
    d: 'Über 20 Jahre Branchenerfahrung unseres Gründers und ein Netzwerk erfahrener Fachpflegekräfte garantieren optimale Lösungen für Ihren Personalbedarf.',
  },
  {
    n: '02',
    t: 'Flexible Personallösungen',
    d: 'Maßgeschneiderte Unterstützung für kurzfristige Engpässe und langfristige Personalherausforderungen. Wir passen uns Ihren individuellen Bedürfnissen an.',
  },
  {
    n: '03',
    t: 'Qualitätsgarantie',
    d: 'Sorgfältig ausgewählte und kontinuierlich weitergebildete Fachkräfte sichern höchste Standards in der Patientenversorgung für Ihre Einrichtung.',
  },
  {
    n: '04',
    t: 'Christliche Grundwerte',
    d: 'Nächstenliebe, Integrität und Mitgefühl sind Grundpfeiler unserer täglichen Arbeit. Wir sehen Patientenversorgung als Ausdruck christlicher Nächstenliebe.',
  },
  {
    n: '05',
    t: 'Kosteneffizienz',
    d: 'Optimieren Sie Ihre Personalkosten durch unsere effizienten Vermittlungsprozesse und wettbewerbsfähigen Konditionen, ohne Qualitätseinbußen.',
  },
]

const LEISTUNGEN = [
  'Pflegekräfte über Samaritano angestellt, flexibel einsetzbar in Ihrem Haus',
  'Tarifkonforme Vergütung',
  'Übernahmeoption möglich',
  'Kurzfristige Engpässe und langfristige Lösungen',
  'Schichtdienst inklusive',
  'Sorgfältige Vorauswahl aller Fachkräfte',
]

const PROCESS = [
  { n: '01', t: 'Kontakt', d: 'Sie schildern Ihren Bedarf — wir hören zu und verstehen Ihr Haus.' },
  { n: '02', t: 'Suche', d: 'Aus unserem Netzwerk finden wir passende Fachkräfte für Ihre Anforderungen.' },
  { n: '03', t: 'Vorstellung', d: 'Sie erhalten vorgeprüfte Profile — Sie entscheiden, wer zu Ihnen passt.' },
  { n: '04', t: 'Einsatz', d: 'Wir begleiten den Start und bleiben Ihr Ansprechpartner vor Ort.' },
]

export default function EinrichtungenPage() {
  return (
    <>
      {/* Hero */}
      <section className="pb-20 pt-16 lg:pb-24 lg:pt-20">
        <div className="wrap grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <ScrollReveal>
            <div>
              <div className="eyebrow">Für Einrichtungen</div>
              <h1 className="display mt-6">
                <span className="block sm:whitespace-nowrap">Pflegekräfte,</span>
                <span className="block sm:whitespace-nowrap">
                  die <em>bleiben</em>
                </span>
                <span className="block sm:whitespace-nowrap">wollen.</span>
              </h1>
              <p className="lede mt-8 max-w-[540px]">
                samaritano ist Ihr verlässlicher Partner für die Vermittlung hochqualifizierter
                Pflegefachkräfte. Unser Gründer Alexander Esau bringt über 20 Jahre Erfahrung
                in der Anästhesiepflege mit. Flexibel. Zuverlässig. Kompetent.
              </p>
              <div className="mt-10 flex flex-wrap gap-3.5">
                <Link href="#anfrage" className="btn btn-primary !px-6 !py-4">
                  Personal anfragen
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
                <Link href="#leistung" className="btn btn-quiet">
                  Unsere Leistung
                </Link>
              </div>
            </div>
          </ScrollReveal>
          <ParallaxImage
            src="/uploads/_DSC9380-46b8d86e.jpg"
            alt="Pflegeteam in einer Einrichtung"
            aspectRatio="4 / 5"
            className="rounded-[20px]"
          />
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-line bg-paper-2 py-16">
        <div className="wrap">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <ScrollReveal key={s.l} delay={i * 0.1}>
                <div>
                  <div className="font-serif font-light leading-none tracking-tight text-sky text-[44px] sm:text-[52px] lg:text-[64px]">
                    {s.n}
                  </div>
                  <div className="mt-3 text-[14px] text-ink-soft">{s.l}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Vorteile */}
      <section className="py-24 lg:py-32">
        <div className="wrap">
          <ScrollReveal>
            <div className="mb-16 max-w-[820px] lg:mb-20">
              <div className="eyebrow">Ihre Vorteile</div>
              <h2 className="h1 mt-5">
                Ihre Vorteile mit <em>samaritano</em>.
              </h2>
              <p className="lede mt-4">Und was Sie von uns erwarten können.</p>
            </div>
          </ScrollReveal>
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {VORTEILE.map((v, i) => (
              <ScrollReveal key={v.n} delay={i * 0.1}>
                <TiltCard className="h-full border-t border-line pt-6">
                  <div className="mb-4 font-mono text-[13px] text-sky">{v.n}</div>
                  <h3 className="mb-3.5 font-serif text-[26px] font-normal tracking-tight">{v.t}</h3>
                  <p className="m-0 text-[15px] leading-relaxed text-ink-soft">{v.d}</p>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Leistung: Zeitarbeit */}
      <section id="leistung" className="bg-ink py-24 text-paper lg:py-32">
        <div className="wrap">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <ScrollReveal>
              <div className="eyebrow !text-white/55">Unser Angebot</div>
              <h2 className="h1 mt-5 !text-paper">
                Zeitarbeit in der <em className="text-sky">Pflege</em>.
              </h2>
              <p className="lede mt-6 !text-white/75">
                Pflegekräfte über Samaritano angestellt, flexibel einsetzbar in Ihrem Haus.
                Wir unterstützen Sie bei kurzfristigen Engpässen ebenso wie bei langfristigen
                Personalherausforderungen.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <ul className="grid gap-4 text-[16px]">
                {LEISTUNGEN.map((l) => (
                  <li key={l} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-[20px] w-[20px] flex-shrink-0 items-center justify-center rounded-full bg-accent text-white">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="text-white/85">{l}</span>
                  </li>
                ))}
              </ul>
              <Link href="#anfrage" className="btn btn-primary mt-10 !inline-flex">
                Jetzt anfragen
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-paper-2 py-24 lg:py-32">
        <div className="wrap">
          <ScrollReveal>
            <div className="mb-12 max-w-[600px] lg:mb-16">
              <div className="eyebrow">So arbeiten wir</div>
              <h2 className="h1 mt-5">
                Vier Schritte zum <em>passenden</em> Profil.
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((s, i) => (
              <ScrollReveal key={s.n} delay={i * 0.12}>
                <div className="border-t-2 border-ink pt-6">
                  <div className="mb-3.5 font-mono text-[13px] text-sky">{s.n}</div>
                  <h3 className="mb-3 font-serif text-[24px] font-normal">{s.t}</h3>
                  <p className="m-0 text-[14px] leading-relaxed text-ink-soft">{s.d}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Quote */}
      <FounderQuote />

      {/* FAQ */}
      <FAQSection
        categorySlug="einrichtungen"
        eyebrow="FAQ"
        title="Was Häuser oft fragen."
        description="Konditionen, Verfügbarkeit, Wechselmöglichkeiten — die wichtigsten Fragen."
      />

      {/* Anfrage */}
      <section id="anfrage" className="py-24 lg:py-32">
        <div className="wrap">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <ScrollReveal>
              <div className="eyebrow">Personal anfragen</div>
              <h2 className="h1 mt-5">
                Sag uns, wen ihr <em>sucht</em>.
              </h2>
              <p className="lede mt-6">
                Antwort innerhalb von 24 Stunden. Erstes Gespräch kostenlos und unverbindlich.
              </p>
              <div className="mt-12 grid gap-5 text-[15px]">
                <div>
                  <strong>Tel.</strong>{' '}
                  <a
                    href="tel:+495717846640"
                    className="border-b border-line transition-colors hover:border-sky hover:text-sky"
                  >
                    +49 571 7846640
                  </a>
                </div>
                <div>
                  <strong>Mail</strong>{' '}
                  <a
                    href="mailto:a.esau@samaritano.de"
                    className="border-b border-line transition-colors hover:border-sky hover:text-sky"
                  >
                    a.esau@samaritano.de
                  </a>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <EinrichtungenAnfrageForm />
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  )
}
