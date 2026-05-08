'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// Vereinfachte SVG-Pfade der deutschen Bundeslaender
const STATES: { id: string; name: string; d: string; highlight?: boolean }[] = [
  {
    id: 'sh',
    name: 'Schleswig-Holstein',
    d: 'M256,12 L270,8 L285,15 L298,10 L305,18 L295,35 L300,50 L290,58 L278,52 L265,60 L255,55 L248,42 L252,28 Z',
  },
  {
    id: 'hh',
    name: 'Hamburg',
    d: 'M272,58 L282,55 L288,62 L280,68 L270,65 Z',
  },
  {
    id: 'mv',
    name: 'Mecklenburg-Vorpommern',
    d: 'M298,10 L320,5 L345,8 L365,15 L378,12 L385,25 L375,40 L355,45 L335,50 L315,48 L300,50 L295,35 L305,18 Z',
  },
  {
    id: 'ni',
    name: 'Niedersachsen',
    highlight: true,
    d: 'M180,55 L200,50 L220,55 L248,42 L255,55 L265,60 L278,52 L290,58 L300,50 L315,48 L320,60 L325,75 L318,90 L310,100 L295,105 L280,110 L265,115 L250,120 L240,130 L225,125 L210,118 L195,125 L185,115 L175,105 L165,95 L170,80 L175,65 Z',
  },
  {
    id: 'hb',
    name: 'Bremen',
    d: 'M218,68 L228,65 L232,72 L224,76 L216,74 Z',
  },
  {
    id: 'bb',
    name: 'Brandenburg',
    d: 'M335,50 L355,45 L375,40 L385,55 L390,75 L395,95 L388,110 L375,120 L360,125 L345,118 L335,108 L340,95 L338,80 L330,70 L325,60 Z',
  },
  {
    id: 'be',
    name: 'Berlin',
    d: 'M358,72 L368,68 L374,76 L366,82 L356,78 Z',
  },
  {
    id: 'st',
    name: 'Sachsen-Anhalt',
    d: 'M310,100 L318,90 L325,75 L330,70 L338,80 L340,95 L335,108 L325,118 L312,125 L298,130 L290,120 L295,105 Z',
  },
  {
    id: 'nw',
    name: 'Nordrhein-Westfalen',
    highlight: true,
    d: 'M165,95 L175,105 L185,115 L195,125 L210,118 L225,125 L240,130 L245,145 L238,158 L225,165 L210,170 L195,165 L180,158 L168,148 L155,140 L148,128 L142,115 L150,105 Z',
  },
  {
    id: 'he',
    name: 'Hessen',
    d: 'M210,170 L225,165 L238,158 L245,145 L250,120 L265,115 L280,110 L290,120 L285,138 L278,155 L270,168 L260,178 L248,185 L235,190 L222,185 L215,175 Z',
  },
  {
    id: 'th',
    name: 'Thüringen',
    d: 'M290,120 L298,130 L312,125 L325,118 L335,130 L328,145 L318,155 L305,160 L290,158 L278,155 L285,138 Z',
  },
  {
    id: 'sn',
    name: 'Sachsen',
    d: 'M335,108 L345,118 L360,125 L375,120 L388,130 L395,145 L385,158 L370,165 L355,160 L340,155 L328,145 L335,130 L325,118 Z',
  },
  {
    id: 'rp',
    name: 'Rheinland-Pfalz',
    d: 'M155,140 L168,148 L180,158 L195,165 L210,170 L215,175 L222,185 L218,200 L208,212 L195,218 L182,215 L170,205 L160,195 L150,185 L145,170 L148,155 Z',
  },
  {
    id: 'sl',
    name: 'Saarland',
    d: 'M150,195 L160,195 L165,205 L158,212 L148,208 Z',
  },
  {
    id: 'bw',
    name: 'Baden-Württemberg',
    d: 'M195,218 L208,212 L218,200 L222,185 L235,190 L248,185 L260,195 L268,210 L272,228 L265,245 L255,258 L240,268 L225,272 L210,265 L198,255 L188,242 L182,228 L182,215 Z',
  },
  {
    id: 'by',
    name: 'Bayern',
    d: 'M260,178 L270,168 L278,155 L290,158 L305,160 L318,155 L328,145 L340,155 L355,160 L370,165 L378,180 L382,200 L378,220 L370,238 L358,252 L342,262 L325,268 L308,270 L292,265 L278,258 L268,245 L265,228 L268,210 L260,195 L248,185 Z',
  },
]

export function EinsatzgebietMap() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="py-24 lg:py-32">
      <div className="wrap">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          {/* Karte */}
          <div className="relative mx-auto w-full max-w-[420px]">
            <svg viewBox="120 0 300 285" className="w-full" aria-label="Karte von Deutschland">
              {STATES.map((state, i) => (
                <motion.path
                  key={state.id}
                  d={state.d}
                  initial={{ opacity: 0, fill: state.highlight ? '#1B3763' : '#e8e8e8' }}
                  animate={
                    isInView
                      ? {
                          opacity: 1,
                          fill: state.highlight ? '#1B3763' : '#e8e8e8',
                        }
                      : undefined
                  }
                  transition={{ duration: 0.5, delay: state.highlight ? 0.8 : i * 0.04 }}
                  stroke="#fff"
                  strokeWidth={1.5}
                  className={`transition-colors duration-300 ${
                    state.highlight ? 'hover:brightness-125' : 'hover:fill-[#d0d0d0]'
                  }`}
                >
                  <title>{state.name}</title>
                </motion.path>
              ))}

              {/* Pulse auf highlighted Bundeslaender */}
              {isInView &&
                STATES.filter((s) => s.highlight).map((state) => (
                  <motion.path
                    key={`pulse-${state.id}`}
                    d={state.d}
                    fill="none"
                    stroke="#1B3763"
                    strokeWidth={2}
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 0, strokeWidth: 4 }}
                    transition={{ duration: 1.5, delay: 1, ease: 'easeOut' }}
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
