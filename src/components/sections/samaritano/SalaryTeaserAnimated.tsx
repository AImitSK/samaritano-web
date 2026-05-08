'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { motion, useInView } from 'framer-motion'

const ROLES = [
  { label: 'Pflegefachkraft', salary: 4200 },
  { label: 'Fachkrankenpfleger Intensiv', salary: 5400 },
  { label: 'ATA', salary: 5100 },
  { label: 'OTA', salary: 4900 },
  { label: 'Altenpfleger', salary: 3700 },
]

export function SalaryTeaserAnimated() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [activeIndex, setActiveIndex] = useState(0)
  const [displaySalary, setDisplaySalary] = useState(0)

  // Berufe durchrotieren
  useEffect(() => {
    if (!isInView) return
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ROLES.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [isInView])

  // Gehalt animiert hochzaehlen
  useEffect(() => {
    if (!isInView) return
    const target = ROLES[activeIndex].salary
    const start = displaySalary
    const startTime = performance.now()
    const duration = 600

    function tick(now: number) {
      const t = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplaySalary(Math.round(start + (target - start) * eased))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, isInView])

  return (
    <section ref={ref} className="section-pad bg-paper-2" data-screen-label="Gehalt">
      <div className="wrap">
        <div className="grid items-center gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6 }}
          >
            <div className="eyebrow">Gehaltsrechner</div>
            <h2 className="h1 mt-5">
              Erfahre jetzt,
              <br />
              was du <em>verdienen</em>
              <br />
              könntest.
            </h2>
            <p className="lede mt-6 max-w-[480px]">
              Nutze unseren Gehaltsrechner, um herauszufinden, wo du stehst.
            </p>
            <Link href="/gehaltsrechner" className="btn btn-primary mt-8 !inline-flex">
              Zum Gehaltsrechner
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="min-w-0 rounded-[20px] border border-line bg-paper-2 p-6 shadow-soft sm:p-9"
          >
            {/* Berufe-Tabs */}
            <div className="mb-6 flex flex-wrap gap-2">
              {ROLES.map((r, i) => (
                <button
                  key={r.label}
                  onClick={() => setActiveIndex(i)}
                  className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all ${
                    i === activeIndex
                      ? 'bg-accent text-white shadow-sm'
                      : 'bg-paper text-ink-soft hover:bg-paper-2'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Gehalt-Anzeige */}
            <div className="rounded-[14px] bg-ink px-5 py-6 text-paper sm:px-7 sm:py-8">
              <div className="text-[13px] text-white/60">Geschätztes Bruttogehalt</div>
              <div className="mt-2 flex items-baseline gap-3">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-serif font-light leading-none text-[48px] sm:text-[64px]"
                >
                  {displaySalary.toLocaleString('de-DE')}
                  <span className="ml-1.5 opacity-60 text-[18px] sm:text-[22px]">€/Mo</span>
                </motion.div>
              </div>
              <motion.div
                key={`role-${activeIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-3 text-[14px] text-white/50"
              >
                {ROLES[activeIndex].label} · Vollzeit · inkl. Zulagen
              </motion.div>
            </div>

            {/* Hinweis */}
            <p className="mt-4 text-center text-[12px] text-ink-soft">
              Beispielwerte — berechne dein individuelles Gehalt mit unserem Rechner
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
