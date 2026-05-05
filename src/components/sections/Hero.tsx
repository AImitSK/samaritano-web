'use client'

import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-24 sm:py-36">
      {/* Layered background */}
      <div className="absolute inset-0 -z-10">
        <div className="bg-dot-pattern absolute inset-0 opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/8" />
        <div className="absolute -right-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-3xl text-center"
        >
          <motion.h1
            variants={item}
            className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl"
            style={{ lineHeight: 1.1 }}
          >
            Ihre Überschrift{' '}
            <span className="text-gradient">hier einsetzen</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-8 max-w-2xl text-xl leading-relaxed text-muted-foreground"
          >
            Eine überzeugende Beschreibung Ihres Angebots. Erklären Sie kurz
            und prägnant, welchen Mehrwert Sie bieten und warum Besucher bei
            Ihnen richtig sind.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button variant="accent" size="lg">
              Jetzt starten
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              Mehr erfahren
            </Button>
          </motion.div>
        </motion.div>

        {/* Hero image placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20"
        >
          <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border/50 bg-muted/50 shadow-float">
            <div className="flex aspect-video items-center justify-center text-muted-foreground">
              Hero Image Placeholder
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-16 flex justify-center"
        >
          <ChevronDown className="h-6 w-6 text-muted-foreground/40" />
        </motion.div>
      </div>
    </section>
  )
}
