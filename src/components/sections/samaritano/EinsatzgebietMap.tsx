'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import germany from '@svg-maps/germany'

const HIGHLIGHT_IDS = ['ni', 'nw', 'hh', 'hb']
// Stadtstaaten muessen NACH ihrem umgebenden Bundesland gerendert werden
const RENDER_LAST = ['hh', 'hb', 'be']

// Minden: ca. 195, 282 im SVG-Koordinatensystem
const MINDEN = { x: 195, y: 282 }

type SvgLocation = { id: string; name: string; path: string }

export function EinsatzgebietMap() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  // Sortieren: Stadtstaaten ans Ende, damit sie nicht ueberdeckt werden
  const sorted = [...germany.locations].sort((a: SvgLocation, b: SvgLocation) => {
    const aLast = RENDER_LAST.includes(a.id) ? 1 : 0
    const bLast = RENDER_LAST.includes(b.id) ? 1 : 0
    return aLast - bLast
  }) as SvgLocation[]

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
              {/* Radial Gradient fuer den Glow */}
              <defs>
                <radialGradient id="minden-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#e74c3c" stopOpacity={1} />
                  <stop offset="25%" stopColor="#e74c3c" stopOpacity={1} />
                  <stop offset="50%" stopColor="#c0392b" stopOpacity={0.6} />
                  <stop offset="75%" stopColor="#c0392b" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#c0392b" stopOpacity={0} />
                </radialGradient>
              </defs>

              {/* Bundeslaender */}
              {sorted.map((state, i) => {
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
                    strokeWidth={isHighlighted ? 0.5 : 1.5}
                    style={{ transition: 'filter 0.2s' }}
                  >
                    <title>{state.name}</title>
                  </motion.path>
                )
              })}

              {/* Pulsierender Glow um Minden */}
              <motion.circle
                cx={MINDEN.x}
                cy={MINDEN.y}
                r={90}
                fill="url(#minden-glow)"
                initial={{ opacity: 0, scale: 0 }}
                animate={
                  isInView
                    ? {
                        opacity: [0, 1, 0.7, 1],
                        scale: [0, 1, 1.12, 1],
                      }
                    : undefined
                }
                transition={{
                  opacity: { duration: 3, delay: 1.0, repeat: Infinity, repeatType: 'reverse' },
                  scale: { duration: 3, delay: 1.0, repeat: Infinity, repeatType: 'reverse' },
                }}
                style={{ transformOrigin: `${MINDEN.x}px ${MINDEN.y}px` }}
              />
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
