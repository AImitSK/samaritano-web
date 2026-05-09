'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/* eslint-disable @next/next/no-img-element */

interface Article {
  slug: string
  cat: string
  title: string
  date: string
  read: string
  img: string
}

export function MagazineSlider({ articles }: { articles: Article[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  function updateButtons() {
    const el = trackRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 10)
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  useEffect(() => {
    updateButtons()
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', updateButtons, { passive: true })
    window.addEventListener('resize', updateButtons)
    return () => {
      el.removeEventListener('scroll', updateButtons)
      window.removeEventListener('resize', updateButtons)
    }
  }, [])

  function scroll(dir: 'prev' | 'next') {
    const el = trackRef.current
    if (!el) return
    const cardWidth = el.querySelector(':scope > a')?.clientWidth || 300
    el.scrollBy({ left: dir === 'next' ? cardWidth + 24 : -(cardWidth + 24), behavior: 'smooth' })
  }

  return (
    <div className="relative">
      {/* Navigation */}
      <div className="absolute -top-14 right-0 flex gap-2 lg:-top-16">
        <button
          type="button"
          onClick={() => scroll('prev')}
          disabled={!canPrev}
          className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-sky hover:text-sky disabled:opacity-30 disabled:hover:border-line disabled:hover:text-ink-soft"
          aria-label="Vorheriger Artikel"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => scroll('next')}
          disabled={!canNext}
          className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-sky hover:text-sky disabled:opacity-30 disabled:hover:border-line disabled:hover:text-ink-soft"
          aria-label="Nächster Artikel"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Slider Track */}
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {articles.map((a) => (
          <Link
            href={`/magazin/${a.slug}`}
            key={a.slug}
            className="group block w-[85vw] flex-shrink-0 text-inherit sm:w-[60vw] md:w-[45vw] lg:w-[calc(33.333%-16px)]"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div
              className="mb-5 overflow-hidden rounded-[14px] bg-paper-2"
              style={{ aspectRatio: '4 / 5' }}
            >
              {a.img ? (
                <img
                  src={a.img}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
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
        ))}
      </div>
    </div>
  )
}
