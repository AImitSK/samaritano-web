'use client'

import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/sanity/client'

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const imageUrl = urlFor(value)?.width(1000).url()
      if (!imageUrl) return null
      return (
        <figure className="my-10">
          <Image
            src={imageUrl}
            alt={value.alt || ''}
            width={1000}
            height={563}
            className="rounded-[12px]"
          />
          {value.caption && (
            <figcaption className="mt-3 text-center text-[14px] text-ink-muted">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="font-serif text-[32px] font-normal tracking-tight mt-12 mb-5">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-serif text-[24px] font-normal tracking-tight mt-10 mb-4">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-serif text-[20px] font-normal mt-8 mb-3">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-4 border-sky pl-5 font-serif text-[22px] font-light italic text-ink">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="mb-5 text-[17px] leading-relaxed text-ink-soft">{children}</p>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith('http') ? '_blank' : undefined}
        rel={value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="border-b border-sky text-sky transition-colors hover:border-ink hover:text-ink"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-5 ml-6 list-disc space-y-2 text-[17px] leading-relaxed text-ink-soft marker:text-sky">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-5 ml-6 list-decimal space-y-2 text-[17px] leading-relaxed text-ink-soft marker:text-sky">
        {children}
      </ol>
    ),
  },
}

interface PortableTextRendererProps {
  content: unknown[]
}

export function PortableTextRenderer({ content }: PortableTextRendererProps) {
  if (!content || content.length === 0) {
    return <p className="text-ink-muted">Kein Inhalt vorhanden.</p>
  }

  return (
    // @ts-expect-error Sanity content type is loosely typed
    <PortableText value={content} components={components} />
  )
}
