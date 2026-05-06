import Link from 'next/link'
import { ArrowUpRight, Check } from 'lucide-react'

const PFLEGE_USPS = [
  'Bis zu 30 % über Tarif',
  'Flexible Schichtplanung',
  'KI-Matching für deinen passenden Job',
  'Persönliche Betreuung, kein Callcenter',
]

const EINRICHTUNG_USPS = [
  'Vorgeprüftes Pflegepersonal',
  'Schnelle Vermittlung in Ø 6 Tagen',
  'Faire Konditionen, transparente Preise',
  'Christliche Werte als Fundament',
]

export function TwoPaths() {
  return (
    <section className="section-pad" data-screen-label="Pfade">
      <div className="wrap">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Pflegekräfte */}
          <Link
            href="/jobs"
            className="group relative flex min-h-[420px] flex-col overflow-hidden rounded-[20px] border border-line bg-paper-2 p-8 transition-transform hover:-translate-y-1 sm:min-h-[520px] sm:p-12"
          >
            <div className="eyebrow">Für Pflegekräfte</div>
            <h2 className="h2 mt-6 max-w-[380px]">
              Finde den Ort,
              <br />
              an dem deine
              <br />
              Arbeit <em>zählt</em>.
            </h2>
            <ul className="mt-10 grid list-none gap-3 p-0 text-base">
              {PFLEGE_USPS.map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-accent text-white">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex items-center justify-between pt-10">
              <span className="link">Stellenangebote ansehen</span>
              <span className="grid h-[54px] w-[54px] place-items-center rounded-full bg-ink text-paper">
                <ArrowUpRight className="h-[18px] w-[18px]" />
              </span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/uploads/_DSC9356-Bearbeitet.jpg"
              alt=""
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-10 hidden h-[320px] w-[320px] rounded-full border-8 border-paper-2 object-cover opacity-85 md:block"
            />
          </Link>

          {/* Einrichtungen */}
          <Link
            href="/einrichtungen"
            className="group relative flex min-h-[420px] flex-col overflow-hidden rounded-[20px] bg-ink p-8 text-paper transition-transform hover:-translate-y-1 sm:min-h-[520px] sm:p-12"
          >
            <div className="eyebrow !text-white/55">Für Einrichtungen</div>
            <h2 className="h2 mt-6 max-w-[420px] !text-paper">
              Pflegekräfte,
              <br />
              die <em>bleiben</em> wollen.
            </h2>
            <ul className="mt-10 grid list-none gap-3 p-0 text-base text-white/85">
              {EINRICHTUNG_USPS.map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-accent text-white">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex items-center justify-between pt-10">
              <span className="border-b border-paper pb-0.5 text-[15px]">Personal anfragen</span>
              <span className="grid h-[54px] w-[54px] place-items-center rounded-full bg-accent text-white">
                <ArrowUpRight className="h-[18px] w-[18px]" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
