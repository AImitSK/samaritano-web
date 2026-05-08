'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'

export function FounderQuote() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="py-24 lg:py-32">
      <div className="wrap">
        {/* Box mit overflow-visible damit der Kopf rausragt */}
        <div className="relative overflow-visible rounded-[20px] bg-ink text-paper">
          <div className="grid items-end lg:grid-cols-[auto_1fr] lg:gap-12">
            {/* Bild — ragt oben raus */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7 }}
              className="relative mx-auto w-[280px] sm:w-[320px] lg:w-[360px] lg:-mt-20"
            >
              <Image
                src="/uploads/alexander-esau.png"
                alt="Alexander Esau, Geschäftsführer von samaritano"
                width={360}
                height={440}
                className="relative z-10"
              />
            </motion.div>

            {/* Zitat — vertikal zentriert */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="px-6 pb-10 pt-6 sm:px-10 sm:pb-14 lg:py-16 lg:pr-16"
            >
              <blockquote className="border-l-2 border-sky pl-6 sm:pl-8">
                <p className="font-serif text-[22px] font-normal leading-relaxed text-paper sm:text-[28px] lg:text-[32px]">
                  &bdquo;Als ehemaliger Pfleger kenne ich Ihre Herausforderungen. Bei samaritano schaffen wir
                  faire Arbeitsbedingungen und setzen uns für Ihre berufliche Entwicklung ein.&ldquo;
                </p>
              </blockquote>
              <div className="mt-8 pl-6 sm:pl-8">
                <div className="text-[17px] font-semibold text-paper">Alexander Esau</div>
                <div className="mt-1 text-[14px] text-white/60">
                  Gründer &amp; Geschäftsführer · ehem. Pfleger
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
