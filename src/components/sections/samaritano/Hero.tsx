import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Star } from 'lucide-react'

const HERO_AVATARS = [
  '/uploads/_DSC9603.jpg',
  '/uploads/_DSC9589.jpg',
  '/uploads/_DSC9610-Bearbeitet.jpg',
  '/uploads/_DSC9413-Bearbeitet.jpg',
]

interface HeroProps {
  openJobsCount?: number
  rating?: number
  ratingCount?: number
  professionsCount?: number
}

export function Hero({
  openJobsCount = 0,
  rating = 4.9,
  ratingCount = 312,
  professionsCount = 0,
}: HeroProps) {
  return (
    <section className="relative section-pad pt-16 lg:pt-24" data-screen-label="Hero">
      <div className="wrap">
        <div className="grid items-end gap-16 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <div className="mb-8 flex items-center gap-3.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper-2 py-1.5 pl-2 pr-3.5 text-[13px]">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Aktuell <strong className="font-semibold">{openJobsCount}</strong> offene Stellen in der Pflege
              </span>
            </div>

            <h1 className="display m-0">
              <span className="block sm:whitespace-nowrap">Wähle einen</span>
              <span className="block sm:whitespace-nowrap">Job, wo man</span>
              <span className="block sm:whitespace-nowrap">
                dich <em>liebt</em>.
              </span>
            </h1>

            <p className="lede mt-9 max-w-[540px]">
              Bei Samaritano findest du mehr als nur eine Schicht. Setze deine Fähigkeiten dort ein, wo
              sie gebraucht werden, und arbeite in einem Umfeld, das dich als Mensch sieht.
            </p>

            <div className="mt-11 flex flex-wrap gap-3.5">
              <Link href="/jobs" className="btn btn-primary !px-6 !py-[18px]">
                Traumjob finden
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/gehaltsrechner" className="btn btn-ghost">
                Gehalt berechnen
              </Link>
            </div>

            <div className="mt-14 flex flex-wrap items-center gap-9">
              <div className="flex">
                {HERO_AVATARS.map((src, i) => (
                  <span
                    key={src}
                    className="relative inline-block h-11 w-11 overflow-hidden rounded-full border-[3px] border-paper"
                    style={{ marginLeft: i ? -12 : 0 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </span>
                ))}
              </div>
              <div>
                <div className="mb-1 flex gap-0.5 text-sky">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <div className="text-[14px] text-ink-soft">
                  <strong className="text-ink">{rating.toString().replace('.', ',')}</strong> · {ratingCount}{' '}
                  Bewertungen von Samaritanos
                </div>
              </div>
            </div>
          </div>

          {/* Hero image with floating cards */}
          <div className="relative">
            <div
              className="overflow-hidden bg-accent-soft shadow-float"
              style={{ aspectRatio: '3 / 4', borderRadius: '200px 200px 16px 16px' }}
            >
              <Image
                src="/uploads/_DSC9497-Bearbeitet2-ca306b47.jpg"
                alt="Samaritano-Team, Pflege mit Herz"
                width={900}
                height={1200}
                priority
                className="h-full w-full object-cover"
              />
            </div>

            {/* Top-right code-style card — desktop only */}
            <div
              className="absolute -right-7 top-7 hidden rounded-[12px] bg-ink px-[18px] py-3.5 font-mono text-[12px] tracking-wider text-paper md:block"
              style={{ transform: 'rotate(3deg)' }}
            >
              <div className="mb-1 opacity-60">{'// jetzt verfügbar'}</div>
              <div>
                {openJobsCount} Stellen · {professionsCount} Berufe
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
