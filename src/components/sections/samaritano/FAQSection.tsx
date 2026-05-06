import { Plus } from 'lucide-react'
import { PortableTextRenderer } from '@/components/ui/PortableTextRenderer'
import { getFAQsByCategorySlug } from '@/sanity/queries'
import { cn } from '@/lib/utils'
import type { Faq } from '@/types'

interface FAQSectionProps {
  /** Optionale Headline (Default: "Häufig gestellte Fragen") */
  title?: string
  /** Optionales Eyebrow (Default: "FAQ") */
  eyebrow?: string
  /** Optionale Lede unter dem Titel */
  description?: string
  /** Vorgeladene FAQs — wenn gesetzt, wird Sanity nicht mehr abgefragt */
  faqs?: Faq[]
  /** Sanity-Kategorie-Slug — wenn gesetzt + faqs leer, holt der Server die FAQs selbst */
  categorySlug?: string
  /** Brand-Variante */
  variant?: 'light' | 'dark'
  /** id für Anker-Link */
  id?: string
  /** Anchor-Slug pro Item für Deep-Links auf der Übersichtsseite */
  itemAnchors?: boolean
}

export async function FAQSection({
  title = 'Häufig gestellte Fragen',
  eyebrow = 'FAQ',
  description,
  faqs,
  categorySlug,
  variant = 'light',
  id,
  itemAnchors = false,
}: FAQSectionProps) {
  const items = faqs ?? (categorySlug ? await getFAQsByCategorySlug(categorySlug) : [])

  if (!items.length) return null

  const isDark = variant === 'dark'

  return (
    <section
      id={id}
      data-screen-label="FAQ"
      className={cn('section-pad-tight', isDark && 'bg-ink text-paper')}
    >
      <div className="wrap">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div className="lg:sticky lg:top-24">
            <div className={cn('eyebrow', isDark && '!text-white/55')}>{eyebrow}</div>
            <h2 className={cn('h1 mt-5', isDark && '!text-paper')}>{title}</h2>
            {description && (
              <p className={cn('lede mt-6 max-w-[440px]', isDark && '!text-white/70')}>
                {description}
              </p>
            )}
          </div>

          <ul
            className={cn(
              'm-0 list-none border-t p-0',
              isDark ? 'border-white/10' : 'border-line'
            )}
          >
            {items.map((item) => (
              <li
                key={item._id}
                id={itemAnchors ? `faq-${item.slug.current}` : undefined}
                className={cn('border-b', isDark ? 'border-white/10' : 'border-line')}
              >
                <details className="group [&_summary::-webkit-details-marker]:hidden">
                  <summary
                    className={cn(
                      'flex cursor-pointer list-none items-start justify-between gap-6 py-6 pr-2 font-serif font-normal tracking-tight transition-colors',
                      'text-[20px] sm:text-[22px] lg:text-[24px]',
                      isDark
                        ? 'text-paper hover:text-sky-soft'
                        : 'text-ink hover:text-sky'
                    )}
                  >
                    <span className="text-pretty">{item.question}</span>
                    <span
                      aria-hidden
                      className={cn(
                        'mt-1 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border transition-transform duration-200 group-open:rotate-45',
                        isDark
                          ? 'border-white/30 text-paper'
                          : 'border-line text-ink'
                      )}
                    >
                      <Plus className="h-4 w-4" strokeWidth={2.25} />
                    </span>
                  </summary>
                  <div
                    className={cn(
                      'pb-7 pr-12 text-[16px] leading-relaxed sm:text-[17px]',
                      isDark ? 'text-white/75' : 'text-ink-soft'
                    )}
                  >
                    <PortableTextRenderer content={item.answer || []} />
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
