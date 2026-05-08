'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import germany from '@svg-maps/germany'

const HIGHLIGHT_IDS = ['ni', 'nw']

export function EinsatzgebietMap() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="py-24 lg:py-32">
      <div className="wrap">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          {/* Karte */}
          <div className="relative mx-auto w-full max-w-[420px]">
            <svg
              viewBox={germany.viewBox}
              className="w-full"
              aria-label="Karte von Deutschland"
            >
              {germany.locations.map((state: { id: string; name: string; path: string }, i: number) => {
                const isHighlighted = HIGHLIGHT_IDS.includes(state.id)
                return (
                  <motion.path
                    key={state.id}
                    d={state.path}
                    initial={{ opacity: 0 }}
                    animate={
                      isInView
                        ? {
                            opacity: 1,
                            fill: isHighlighted ? '#1B3763' : '#e2e4e8',
                          }
                        : { opacity: 0, fill: '#e2e4e8' }
                    }
                    transition={{
                      duration: 0.5,
                      delay: isHighlighted ? 0.8 : i * 0.05,
                    }}
                    stroke="#fff"
                    strokeWidth={1.5}
                    className={
                      isHighlighted
                        ? 'cursor-pointer hover:brightness-125'
                        : 'hover:fill-[#d0d0d0]'
                    }
                    style={{ transition: 'filter 0.2s' }}
                  >
                    <title>{state.name}</title>
                  </motion.path>
                )
              })}

              {/* Pulse-Effekt auf highlighted Bundeslaender */}
              {isInView &&
                germany.locations
                  .filter((s: { id: string }) => HIGHLIGHT_IDS.includes(s.id))
                  .map((state: { id: string; path: string }) => (
                    <motion.path
                      key={`pulse-${state.id}`}
                      d={state.path}
                      fill="none"
                      stroke="#1B3763"
                      strokeWidth={2}
                      initial={{ opacity: 0.6 }}
                      animate={{ opacity: 0, strokeWidth: 5 }}
                      transition={{ duration: 1.5, delay: 1.2, ease: 'easeOut' }}
                    />
                  ))}
            </svg>
          </div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="eyebrow">Unser Einsatzgebiet</div>
            <h2 className="h1 mt-5">
              <em>Niedersachsen</em>
              <br />
              und <em>NRW</em>.
            </h2>
            <p className="lede mt-6 max-w-[480px]">
              Wir sind in Niedersachsen und Nordrhein-Westfalen zuhause. Unsere Nähe zu den
              Einrichtungen bedeutet kurze Wege, persönliche Betreuung und schnelle Einsätze
              vor Ort.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div className="rounded-[12px] border border-line p-5">
                <div className="font-serif text-[32px] font-light text-accent">NDS</div>
                <div className="mt-1 text-[14px] text-ink-soft">Niedersachsen</div>
              </div>
              <div className="rounded-[12px] border border-line p-5">
                <div className="font-serif text-[32px] font-light text-accent">NRW</div>
                <div className="mt-1 text-[14px] text-ink-soft">Nordrhein-Westfalen</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
