'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MapPin, Briefcase, ArrowRight } from 'lucide-react'
import type { Job } from '@/types'

interface JobsSectionProps {
  jobs: Job[]
  title?: string
  subtitle?: string
  showAll?: boolean
  limit?: number
}

const typeLabels: Record<string, string> = {
  vollzeit: 'Vollzeit',
  teilzeit: 'Teilzeit',
  ausbildung: 'Ausbildung',
  praktikum: 'Praktikum',
  werkstudent: 'Werkstudent',
  freelance: 'Freelance',
}

export function JobsSection({
  jobs,
  title = 'Karriere',
  subtitle = 'Werden Sie Teil unseres Teams',
  showAll = true,
  limit = 4,
}: JobsSectionProps) {
  const displayJobs = limit ? jobs.slice(0, limit) : jobs

  if (jobs.length === 0) {
    return (
      <section className="bg-surface-raised py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <h2 className="mb-4 font-display text-3xl font-bold md:text-4xl">{title}</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Aktuell keine offenen Stellen. Initiativbewerbungen sind jederzeit
              willkommen.
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-surface-raised py-16 lg:py-24">
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

        <div className="mx-auto max-w-3xl space-y-4">
          {displayJobs.map((job, index) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={`/jobs/${job.slug.current}`}
                className="group flex flex-col gap-4 rounded-xl border border-border/50 bg-background p-6 shadow-soft transition-all duration-300 hover:border-accent/30 hover:shadow-elevated sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="mb-2 text-lg font-semibold transition-colors group-hover:text-accent">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {typeLabels[job.type] || job.type}
                    </span>
                    {job.department && (
                      <span className="text-muted-foreground">
                        {job.department}
                      </span>
                    )}
                  </div>
                </div>

                <ArrowRight className="h-5 w-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-accent" />
              </Link>
            </motion.div>
          ))}
        </div>

        {showAll && jobs.length > limit && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 font-medium text-accent hover:underline"
            >
              Alle Stellenangebote anzeigen
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
