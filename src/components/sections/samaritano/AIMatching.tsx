'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Sparkles } from 'lucide-react'

const MATCHES = [
  { role: 'ATA', loc: 'Bielefeld', score: 96 },
  { role: 'OTA', loc: 'Münster', score: 91 },
  { role: 'Pflegefachkraft', loc: 'Osnabrück', score: 87 },
]

export function AIMatching() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % MATCHES.length), 2500)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="section-pad bg-ink text-paper" data-screen-label="KI-Matching">
      <div className="wrap">
        <div className="grid items-center gap-20 lg:grid-cols-2">
          <div>
            <div className="eyebrow !text-white/55">
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 fill-current" /> Neu · KI-Matching
              </span>
            </div>
            <h2 className="h1 mt-5 !text-paper">
              Passt der Job
              <br />
              wirklich zu mir?
              <br />
              <em>Frag die KI.</em>
            </h2>
            <p className="lede mt-8 max-w-[520px] !text-white/70">
              Unser KI-Matching prüft in 60 Sekunden, ob eine Stelle wirklich zu dir passt, anhand deiner
              Qualifikationen, Vorlieben und Werte. Ehrlich, transparent, mit Begründung.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3.5">
              <Link href="/ki-matching" className="btn btn-accent">
                KI-Matching starten
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/ki-matching/wie-es-funktioniert" className="border-b border-white/40 py-4 text-[15px] text-paper">
                Wie funktioniert das?
              </Link>
            </div>
          </div>

          {/* Mock UI */}
          <div className="min-w-0 rounded-[18px] border border-white/10 bg-white/[0.04] p-5 font-mono text-[13px] sm:p-7">
            <div className="mb-6 flex items-center justify-between text-white/50">
              <span>samaritano.match</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7AC974]" />
                <span>analysiert</span>
              </span>
            </div>
            <div className="grid gap-3">
              {MATCHES.map((m, i) => {
                const active = i === step
                return (
                  <div
                    key={`${m.role}-${m.loc}`}
                    className={`grid grid-cols-[1fr_auto] items-center gap-3 rounded-[12px] border px-4 py-[14px] transition-all duration-500 sm:gap-4 sm:px-5 sm:py-[18px] ${
                      active
                        ? 'border-accent bg-accent'
                        : 'border-white/10 bg-white/[0.04]'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="truncate font-serif text-[16px] font-normal text-paper sm:text-[18px]">{m.role}</div>
                      <div
                        className={`mt-1 truncate ${
                          active ? 'text-white/85' : 'text-white/50'
                        }`}
                      >
                        📍 {m.loc}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-serif font-light leading-none text-paper text-[24px] sm:text-[28px] lg:text-[32px]">
                        {m.score}
                        <span className="opacity-60 text-[14px] sm:text-[16px]">%</span>
                      </div>
                      <div
                        className={`mt-0.5 text-[11px] ${
                          active ? 'text-white/85' : 'text-white/50'
                        }`}
                      >
                        match
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-5 rounded-[10px] border border-dashed border-[#7AC974]/30 bg-[#7AC974]/[0.08] px-[18px] py-3.5 text-[12px] text-[#A8E6A4]">
              ✓ 3 passende Stellen gefunden · Ergebnis in 47 s
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
