'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CTASectionProps {
  title?: string
  description?: string
  primaryButton?: {
    label: string
    href: string
  }
  secondaryButton?: {
    label: string
    href: string
  }
  variant?: 'default' | 'primary' | 'dark'
}

export function CTASection({
  title = 'Bereit loszulegen?',
  description = 'Kontaktieren Sie uns für ein unverbindliches Gespräch.',
  primaryButton = {
    label: 'Kontakt aufnehmen',
    href: '/kontakt',
  },
  secondaryButton,
  variant = 'primary',
}: CTASectionProps) {
  const bgClasses = {
    default: 'bg-muted/50',
    primary: 'bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground',
    dark: 'bg-gradient-to-br from-foreground via-foreground/95 to-foreground/85 text-background',
  }

  const primaryBtnClasses =
    variant === 'default'
      ? 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-soft hover:shadow-elevated'
      : 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-soft hover:shadow-elevated'

  const secondaryBtnClasses =
    variant === 'default'
      ? 'border border-input bg-background hover:bg-muted'
      : 'border border-current/30 hover:bg-white/10'

  return (
    <section className={cn('relative overflow-hidden py-16 lg:py-24', bgClasses[variant])}>
      {variant !== 'default' && (
        <div className="bg-dot-pattern absolute inset-0 opacity-10" />
      )}
      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="mb-4 font-display text-3xl font-bold md:text-4xl">{title}</h2>
          <p
            className={`mb-8 text-lg ${variant === 'primary' || variant === 'dark' ? 'opacity-90' : 'text-muted-foreground'}`}
          >
            {description}
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href={primaryButton.href}
              className={cn(
                'inline-flex h-12 items-center justify-center gap-2 rounded-md px-10 text-base font-medium transition-all duration-200 active:scale-[0.98]',
                primaryBtnClasses
              )}
            >
              {primaryButton.label}
              <ArrowRight className="h-4 w-4" />
            </Link>

            {secondaryButton && (
              <Link
                href={secondaryButton.href}
                className={cn(
                  'inline-flex h-12 items-center justify-center rounded-md px-10 text-base font-medium transition-all duration-200',
                  secondaryBtnClasses
                )}
              >
                {secondaryButton.label}
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
