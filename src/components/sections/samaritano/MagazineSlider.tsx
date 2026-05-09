'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useAnimation, type PanInfo } from 'framer-motion'
import Link from 'next/link'

/* eslint-disable @next/next/no-img-element */

interface Article {
  slug: string
  cat: string
  title: string
  date: string
  read: string
  img: string
}

const CARD_GAP = 24
const DRAG_THRESHOLD = 50

export function MagazineSlider({ articles }: { articles: Article[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cardWidth, setCardWidth] = useState(360)
  const containerRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const controls = useAnimation()

  const totalCards = articles.length
  const cardStep = cardWidth + CARD_GAP

  // Measure container + calculate card width
  useEffect(() => {
    function measure() {
      if (!containerRef.current) return
      const w = containerRef.current.offsetWidth
      // Mobile: 1 card, Tablet: 2, Desktop: 3
      let cols = 1
      if (w >= 1024) cols = 3
      else if (w >= 640) cols = 2
      setCardWidth((w - CARD_GAP * (cols - 1)) / cols)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const visibleCards = Math.max(1, Math.floor((containerRef.current?.offsetWidth || 0) + CARD_GAP) / cardStep) || 1
  const maxIndex = Math.max(0, totalCards - Math.round(visibleCards))

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, maxIndex))
      setCurrentIndex(clamped)
      controls.start({
        x: -clamped * cardStep,
        transition: { type: 'spring', stiffness: 300, damping: 35 },
      })
    },
    [maxIndex, cardStep, controls]
  )

  function handleDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    const offset = info.offset.x
    if (offset < -DRAG_THRESHOLD) {
      goTo(currentIndex + 1)
    } else if (offset > DRAG_THRESHOLD) {
      goTo(currentIndex - 1)
    } else {
      goTo(currentIndex)
    }
  }

  if (totalCards === 0) return null

  return (
    <div className="relative">
      {/* Track */}
      <div ref={containerRef} className="overflow-hidden">
        <motion.div
          className="flex cursor-grab active:cursor-grabbing"
          style={{ x, gap: CARD_GAP }}
          animate={controls}
          drag="x"
          dragConstraints={{
            left: -maxIndex * cardStep,
            right: 0,
          }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
        >
          {articles.map((a) => (
            <motion.div
              key={a.slug}
              className="flex-shrink-0 select-none"
              style={{ width: cardWidth }}
            >
              <Link href={`/magazin/${a.slug}`} className="group block text-inherit" draggable={false}>
                <div
                  className="mb-5 overflow-hidden rounded-[14px] bg-paper-2"
                  style={{ aspectRatio: '4 / 5' }}
                >
                  {a.img ? (
                    <img
                      src={a.img}
                      alt=""
                      className="pointer-events-none h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      draggable={false}
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-ink-muted">📝</div>
                  )}
                </div>
                <div className="mb-3.5 flex flex-wrap gap-3.5 text-[13px] text-ink-muted">
                  <span className="font-medium text-sky">{a.cat}</span>
                  <span aria-hidden>·</span>
                  <span>{a.date}</span>
                  <span aria-hidden>·</span>
                  <span>{a.read} Lesezeit</span>
                </div>
                <h3 className="h3 m-0 text-pretty">{a.title}</h3>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Dots + Arrows */}
      {maxIndex > 0 && (
        <div className="mt-10 flex items-center justify-between">
          <div className="flex gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'w-8 bg-sky'
                    : 'w-2 bg-ink/15 hover:bg-ink/30'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => goTo(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-sky hover:text-sky disabled:opacity-30"
              aria-label="Vorheriger Artikel"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={() => goTo(currentIndex + 1)}
              disabled={currentIndex >= maxIndex}
              className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-sky hover:text-sky disabled:opacity-30"
              aria-label="Nächster Artikel"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
