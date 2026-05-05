'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import type { News } from '@/types'

interface NewsSectionProps {
  items: News[]
  title?: string
  subtitle?: string
  showAll?: boolean
  limit?: number
}

const typeLabels: Record<string, string> = {
  news: 'News',
  messe: 'Messe',
  event: 'Event',
  presse: 'Presse',
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const card = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function NewsSection({
  items,
  title = 'Aktuelles',
  subtitle = 'News, Events und Messen',
  showAll = true,
  limit = 6,
}: NewsSectionProps) {
  const displayItems = limit ? items.slice(0, limit) : items

  if (items.length === 0) {
    return (
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <p className="text-center text-muted-foreground">
            Keine aktuellen Neuigkeiten.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 lg:py-24">
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

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {displayItems.map((item) => (
            <motion.article
              key={item._id}
              variants={card}
              className="group overflow-hidden rounded-xl border border-border/50 bg-surface-raised shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-elevated"
            >
              {item.image?.asset && (
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={`https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${item.image.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png').replace('-webp', '.webp')}`}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}

              <div className="p-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                    {typeLabels[item.type] || item.type}
                  </span>
                </div>

                <h3 className="mb-2 text-lg font-semibold transition-colors group-hover:text-accent">
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <Link href={`/news/${item.slug.current}`}>{item.title}</Link>
                  )}
                </h3>

                <div className="mb-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(item.date)}
                    {item.endDate && ` - ${formatDate(item.endDate)}`}
                  </span>
                  {item.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {item.location}
                    </span>
                  )}
                </div>

                {item.excerpt && (
                  <p className="text-sm text-muted-foreground">{item.excerpt}</p>
                )}
              </div>
            </motion.article>
          ))}
        </motion.div>

        {showAll && items.length > limit && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <Link
              href="/news"
              className="inline-flex items-center gap-2 font-medium text-accent hover:underline"
            >
              Alle Neuigkeiten anzeigen
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
