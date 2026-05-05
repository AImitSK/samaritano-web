'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import type { Milestone } from '@/types'

interface TimelineSectionProps {
  milestones: Milestone[]
  title?: string
  subtitle?: string
}

export function TimelineSection({
  milestones,
  title = 'Unsere Geschichte',
  subtitle = 'Meilensteine unserer Entwicklung',
}: TimelineSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const lineHeight = useTransform(scrollYProgress, [0.1, 0.85], ['0%', '100%'])

  if (milestones.length === 0) {
    return (
      <section className="bg-surface-raised py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <p className="text-center text-muted-foreground">
            Keine Meilensteine vorhanden.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="bg-surface-raised py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 text-center"
        >
          <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-accent" />
          <h2 className="mb-4 font-display text-3xl font-bold md:text-4xl">{title}</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {subtitle}
          </p>
        </motion.div>

        <div className="relative mx-auto max-w-4xl">
          {/* Static timeline line (background) */}
          <div className="absolute left-4 top-0 hidden h-full w-0.5 bg-border/30 md:left-1/2 md:block md:-translate-x-1/2" />
          {/* Animated timeline line (foreground) */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-4 top-0 hidden w-0.5 bg-accent md:left-1/2 md:block md:-translate-x-1/2"
          />

          <div className="space-y-8 md:space-y-12">
            {milestones.map((milestone, index) => {
              const isEven = index % 2 === 0

              return (
                <motion.div
                  key={milestone._id}
                  initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`relative flex flex-col gap-4 md:flex-row md:gap-8 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Year badge */}
                  <div className="absolute left-0 top-0 md:left-1/2 md:-translate-x-1/2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground shadow-elevated ring-4 ring-background md:h-12 md:w-20 md:text-sm">
                      {milestone.year}
                    </div>
                  </div>

                  {/* Content */}
                  <div
                    className={`ml-12 md:ml-0 md:w-1/2 ${
                      isEven ? 'md:pr-16' : 'md:pl-16'
                    }`}
                  >
                    <div className="rounded-xl border border-border/50 bg-background p-6 shadow-soft transition-all duration-300 hover:shadow-elevated">
                      {milestone.image?.asset && (
                        <div className="relative mb-4 aspect-video overflow-hidden rounded-lg">
                          <Image
                            src={`https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${milestone.image.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png').replace('-webp', '.webp')}`}
                            alt={milestone.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      <h3 className="mb-2 text-lg font-semibold">
                        {milestone.title}
                      </h3>
                      {milestone.description && (
                        <p className="text-muted-foreground">
                          {milestone.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block md:w-1/2" />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
