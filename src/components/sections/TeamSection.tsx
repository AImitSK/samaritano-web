'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Mail, Phone } from 'lucide-react'
import type { TeamMember } from '@/types'

interface TeamSectionProps {
  members: TeamMember[]
  title?: string
  subtitle?: string
}

const cardVariant = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
}

export function TeamSection({
  members,
  title = 'Unser Team',
  subtitle = 'Die Menschen hinter unserem Erfolg',
}: TeamSectionProps) {
  if (members.length === 0) {
    return (
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <p className="text-center text-muted-foreground">
            Noch keine Teammitglieder vorhanden.
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

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => (
            <motion.div
              key={member._id}
              custom={index}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group rounded-xl border border-border/50 bg-surface-raised p-6 text-center shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-elevated"
            >
              {member.image?.asset && (
                <div className="relative mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full ring-4 ring-background">
                  <Image
                    src={`https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${member.image.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png').replace('-webp', '.webp')}`}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}

              <h3 className="mb-1 text-lg font-semibold">{member.name}</h3>
              <p className="mb-3 text-sm font-medium text-accent">
                {member.position}
              </p>

              {member.bio && (
                <p className="mb-4 text-sm text-muted-foreground">
                  {member.bio}
                </p>
              )}

              <div className="flex justify-center gap-3">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
                    aria-label={`E-Mail an ${member.name}`}
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                )}
                {member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
                    aria-label={`${member.name} anrufen`}
                  >
                    <Phone className="h-5 w-5" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
