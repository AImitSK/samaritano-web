'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ParallaxImageProps {
  src: string
  alt: string
  aspectRatio?: string
  className?: string
}

export function ParallaxImage({ src, alt, aspectRatio = '4 / 5', className }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className ?? ''}`}
      style={{ aspectRatio }}
    >
      <motion.div className="absolute inset-[-16%]" style={{ y }}>
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover"
        />
      </motion.div>
    </div>
  )
}
