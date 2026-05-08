'use client'

import { useRef, useState } from 'react'

interface TiltCardProps {
  children: React.ReactNode
  className?: string
}

export function TiltCard({ children, className }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<React.CSSProperties>({})

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setStyle({
      transform: `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.02)`,
      boxShadow: `${-x * 20}px ${y * 20}px 40px rgba(0,0,0,0.08)`,
    })
  }

  function handleMouseLeave() {
    setStyle({
      transform: 'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)',
      boxShadow: 'none',
    })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-[box-shadow] duration-300 ${className ?? ''}`}
      style={{ ...style, transition: 'transform 0.15s ease-out, box-shadow 0.3s ease-out' }}
    >
      {children}
    </div>
  )
}
