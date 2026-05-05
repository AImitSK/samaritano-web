import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Über uns',
  description:
    'Samaritano ist ein christlich geprägtes Vermittlungsunternehmen für Pflegekräfte. Gegründet 2018 in Köln, mit Werten als Fundament.',
}

const WERTE = [
  {
    n: '01',
    t: 'Würde',
    d: 'Jeder Mensch ist mehr als sein Lebenslauf. Wir behandeln Pflegekräfte und Einrichtungen mit der gleichen Sorgfalt, die wir am Krankenbett erwarten.',
  },
  {
    n: '02',
    t: 'Wahrhaftigkeit',
    d: 'Wir empfehlen nur, was passt, auch wenn das heißt, eine Stelle nicht zu besetzen. Provision ist nicht unser Kompass.',
  },
  {
    n: '03',
    t: 'Verbindlichkeit',
    d: 'Was wir zusagen, machen wir. Schnelle Antworten, klare Konditionen, persönliche Begleitung, über die Vermittlung hinaus.',
  },
  {
    n: '04',
    t: 'Hoffnung',
    d: 'Gute Pflege ist möglich. Wir arbeiten jeden Tag dafür, Pflegekräfte und Häuser zusammenzubringen, die das beweisen.',
  },
]

const STORY = [
  {
    y: '2018',
    t: 'Gründung in Köln',
    d: 'Drei Pflegekräfte, ein Geschäftsführer, ein Versprechen: Vermittlung mit Werten als Fundament.',
  },
  {
    y: '2020',
    t: 'Erste 50 Einrichtungen',
    d: 'Während der Pandemie wuchs unser Netzwerk schneller als geplant, weil wir geliefert haben, als andere überfordert waren.',
  },
  {
    y: '2023',
    t: 'Werte-Match-Modell',
    d: 'Wir entwickeln das erste strukturierte Verfahren, um Werte zwischen Pflegekraft und Einrichtung zu prüfen, nicht nur Skills.',
  },
  {
    y: '2026',
    t: '89 Partner, 312 Vermittlungen',
    d: 'Heute begleiten wir Pflegekräfte in der gesamten DACH-Region, und bleiben dem Anspruch treu, mit dem wir angefangen haben.',
  },
]

const TEAM = [
  { name: 'Martin Schäfer', role: 'Geschäftsführer', img: '/uploads/Geschäftsführer.jpg' },
  { name: 'Anna-Lena Porsche', role: 'Leitung Vermittlung', img: '/uploads/_DSC9603.jpg' },
  { name: 'Magnus Reuter', role: 'Senior Recruiter', img: '/uploads/_DSC9356-Bearbeitet.jpg' },
  { name: 'John Würth', role: 'Recruiter Endoskopie', img: '/uploads/_DSC9544.jpg' },
]

const ZERTIFIKATE = ['AÜG-Erlaubnis', 'DiAG MAV', 'Diakonieverband', 'TÜV-zertifiziert']

export default function UeberUnsPage() {
  return (
    <>
      {/* Hero */}
      <section className="pb-16 pt-16 lg:pb-20 lg:pt-20">
        <div className="wrap">
          <div className="eyebrow">Über uns</div>
          <h1 className="display mt-6 max-w-[1100px]">
            <span className="block whitespace-nowrap">
              Pflege braucht <em>Menschen</em>,
            </span>
            <span className="block whitespace-nowrap">nicht Algorithmen.</span>
          </h1>
          <p className="lede mt-8 max-w-[720px]">
            Wir sind ein christlich geprägtes Vermittlungsunternehmen für Pflegekräfte. Gegründet 2018, weil
            wir gesehen haben: Personalvermittlung in der Pflege funktioniert nur mit Werten als Fundament.
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
              <div className="eyebrow !text-white/55">Was uns trägt</div>
              <h2 className="h1 mt-5 !text-paper">
                Vier <em className="text-sky">Werte</em>,
                <br />
                kein Marketing.
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

      {/* Story */}
      <section className="py-24 lg:py-32">
        <div className="wrap">
          <div className="grid items-start gap-16 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <div className="lg:sticky lg:top-24">
              <div className="eyebrow">Unsere Geschichte</div>
              <h2 className="h1 mt-5">
                Wie wir <em>angefangen</em> haben.
              </h2>
            </div>
            <div className="grid gap-12">
              {STORY.map((s) => (
                <div
                  key={s.y}
                  className="grid grid-cols-[100px_1fr] gap-8 border-b border-line pb-10"
                >
                  <div className="font-serif text-[48px] font-light leading-none tracking-tight text-sky">
                    {s.y}
                  </div>
                  <div>
                    <h3 className="m-0 mb-3 mt-1 font-serif text-[26px] font-normal">{s.t}</h3>
                    <p className="m-0 text-[16px] leading-relaxed text-ink-soft">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-paper-2 py-24 lg:py-32">
        <div className="wrap">
          <div className="mb-12 max-w-[600px] lg:mb-16">
            <div className="eyebrow">Wer hinter Samaritano steht</div>
            <h2 className="h1 mt-5">
              Das <em>Team</em>.
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((p) => (
              <div key={p.name}>
                <div
                  className="relative mb-4 overflow-hidden rounded-[12px]"
                  style={{ aspectRatio: '4 / 5' }}
                >
                  <Image src={p.img} alt={p.name} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
                </div>
                <div className="mb-1 font-serif text-[22px] font-normal">{p.name}</div>
                <div className="text-[14px] text-ink-muted">{p.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
