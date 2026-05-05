'use client'

import { motion } from 'framer-motion'
import { FileDown, FileText, File } from 'lucide-react'
import type { Download } from '@/types'

interface DownloadsSectionProps {
  downloads: Download[]
  title?: string
  subtitle?: string
  groupByCategory?: boolean
}

const categoryLabels: Record<string, string> = {
  katalog: 'Kataloge',
  datenblatt: 'Datenblätter',
  broschuere: 'Broschüren',
  zertifikat: 'Zertifikate',
  anleitung: 'Anleitungen',
  sonstiges: 'Sonstiges',
}

const languageLabels: Record<string, string> = {
  de: 'DE',
  en: 'EN',
  fr: 'FR',
}

function getFileIcon(title: string) {
  const lower = title.toLowerCase()
  if (lower.includes('pdf')) return FileText
  return File
}

export function DownloadsSection({
  downloads,
  title = 'Downloads',
  subtitle = 'Kataloge, Datenblätter und mehr',
  groupByCategory = true,
}: DownloadsSectionProps) {
  if (downloads.length === 0) {
    return (
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <p className="text-center text-muted-foreground">
            Keine Downloads verfügbar.
          </p>
        </div>
      </section>
    )
  }

  // Group by category if needed
  const grouped = groupByCategory
    ? downloads.reduce(
        (acc, download) => {
          const cat = download.category || 'sonstiges'
          if (!acc[cat]) acc[cat] = []
          acc[cat].push(download)
          return acc
        },
        {} as Record<string, Download[]>
      )
    : { all: downloads }

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

        <div className="mx-auto max-w-4xl space-y-10">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              {groupByCategory && (
                <h3 className="mb-4 font-display text-xl font-semibold">
                  {categoryLabels[category] || category}
                </h3>
              )}

              <div className="space-y-3">
                {items.map((download, index) => {
                  const Icon = getFileIcon(download.title)
                  const fileUrl = download.file?.asset?.url

                  return (
                    <motion.div
                      key={download._id}
                      initial={{ opacity: 0, scale: 0.97, y: 8 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.35,
                        delay: index * 0.05,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <a
                        href={fileUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-4 rounded-xl border border-border/50 bg-surface-raised p-4 transition-all duration-300 hover:border-accent/30 hover:shadow-elevated"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="flex-1">
                          <h4 className="font-medium transition-colors group-hover:text-accent">
                            {download.title}
                          </h4>
                          {download.description && (
                            <p className="text-sm text-muted-foreground">
                              {download.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          {download.language && (
                            <span className="rounded bg-muted px-2 py-0.5">
                              {languageLabels[download.language]}
                            </span>
                          )}
                          {download.fileSize && (
                            <span>{download.fileSize}</span>
                          )}
                          <FileDown className="h-5 w-5 text-accent" />
                        </div>
                      </a>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
