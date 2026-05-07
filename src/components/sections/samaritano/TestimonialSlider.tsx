'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useAnimation, PanInfo } from 'framer-motion'
import type { Testimonial } from '@/types'

interface TestimonialSliderProps {
  testimonials: Testimonial[]
  /** Pre-built image URLs from the server component */
  imageUrls: Record<string, string | null>
}

const CARD_WIDTH = 360
const CARD_GAP = 24
const DRAG_THRESHOLD = 50
const AUTO_INTERVAL = 5000

export function TestimonialSlider({ testimonials, imageUrls }: TestimonialSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const controls = useAnimation()
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const totalCards = testimonials.length
  const cardStep = CARD_WIDTH + CARD_GAP

  // Measure container
  useEffect(() => {
    function measure() {
      if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // How many cards visible at once
  const visibleCards = Math.max(1, Math.floor((containerWidth + CARD_GAP) / cardStep))
  const maxIndex = Math.max(0, totalCards - visibleCards)

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

  // Auto-advance
  useEffect(() => {
    autoRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev >= maxIndex ? 0 : prev + 1
        goTo(next)
        return next
      })
    }, AUTO_INTERVAL)
    return () => {
      if (autoRef.current) clearInterval(autoRef.current)
    }
  }, [maxIndex, goTo])

  function resetAuto() {
    if (autoRef.current) clearInterval(autoRef.current)
    autoRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev >= maxIndex ? 0 : prev + 1
        goTo(next)
        return next
      })
    }, AUTO_INTERVAL)
  }

  function handleDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    const offset = info.offset.x
    if (offset < -DRAG_THRESHOLD) {
      goTo(currentIndex + 1)
    } else if (offset > DRAG_THRESHOLD) {
      goTo(currentIndex - 1)
    } else {
      goTo(currentIndex)
    }
    resetAuto()
  }

  if (totalCards === 0) return null

  return (
    <div className="relative">
      {/* Track container */}
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
          {testimonials.map((t) => {
            const img = imageUrls[t._id]
            return (
              <motion.div
                key={t._id}
                className="flex-shrink-0 select-none"
                style={{ width: CARD_WIDTH }}
              >
                {/* Image */}
                {img && (
                  <div className="mb-6 overflow-hidden rounded-2xl" style={{ aspectRatio: '4 / 5' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={t.image?.alt || t.name}
                      className="pointer-events-none h-full w-full object-cover"
                      draggable={false}
                    />
                  </div>
                )}

                {/* Quote */}
                <p className="mb-5 font-serif text-[20px] font-light leading-snug lg:text-[22px]">
                  {`\u201E${t.quote}\u201C`}
                </p>

                {/* Author */}
                <div>
                  <div className="font-medium">{t.name}</div>
                  <div className="mt-0.5 text-[14px] text-white/60">{t.role}</div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Dots + Arrows */}
      <div className="mt-10 flex items-center justify-between">
        {/* Dots */}
        <div className="flex gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                goTo(i)
                resetAuto()
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'w-8 bg-sky'
                  : 'w-2 bg-white/25 hover:bg-white/40'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Arrow buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              goTo(currentIndex - 1)
              resetAuto()
            }}
            disabled={currentIndex === 0}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/40 hover:text-white disabled:opacity-30 disabled:hover:border-white/20 disabled:hover:text-white/70"
            aria-label="Vorheriges Testimonial"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => {
              goTo(currentIndex + 1)
              resetAuto()
            }}
            disabled={currentIndex >= maxIndex}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/40 hover:text-white disabled:opacity-30 disabled:hover:border-white/20 disabled:hover:text-white/70"
            aria-label="Nächstes Testimonial"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
