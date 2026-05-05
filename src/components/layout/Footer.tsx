'use client'

import Link from 'next/link'
import { resetConsent } from '@/lib/cookies'
import type { NavItem } from '@/types'

/* eslint-disable @next/next/no-img-element */

interface FooterProps {
  logoUrl?: string | null
  siteName?: string
  description?: string
  navigation?: NavItem[]
}

const STATIC_LOGO = '/uploads/Logo-Samaritano-Web.svg'

const PFLEGE_LINKS = [
  { label: 'Stellenangebote', href: '/jobs' },
  { label: 'Minijobs', href: '/jobs?type=minijob' },
  { label: 'Gehaltsrechner', href: '/gehaltsrechner' },
  { label: 'Pfleger werben Pfleger', href: '/pfleger-werben-pfleger' },
]

const EINRICHTUNGEN_LINKS = [
  { label: 'Angebot', href: '/einrichtungen' },
  { label: 'Personal anfragen', href: '/einrichtungen#anfrage' },
  { label: 'Referenzen', href: '/einrichtungen#referenzen' },
]

const UNTERNEHMEN_LINKS = [
  { label: 'Wofür wir stehen', href: '/ueber-uns' },
  { label: 'Magazin', href: '/magazin' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Kontakt', href: '/kontakt' },
]

const LEGAL_LINKS = [
  { label: 'Impressum', href: '/impressum' },
  { label: 'Datenschutz', href: '/datenschutz' },
  { label: 'AGB', href: '/agb' },
]

function getNavLabel(item: NavItem): string {
  return item.label || item.page?.title || item.href || ''
}

function getNavHref(item: NavItem): string {
  if (item.type === 'external') return item.href || '#'
  if (item.page?.slug?.current) return `/${item.page.slug.current}`
  return '#'
}

export function Footer({
  logoUrl,
  siteName = 'Samaritano',
  description = 'Pflegeberufe für Leute mit Herz und Hingabe. Wir vermitteln dort, wo deine Arbeit den größten Unterschied macht.',
  navigation = [],
}: FooterProps) {
  const currentYear = new Date().getFullYear()
  const logo = logoUrl || STATIC_LOGO

  // navigation aus Sanity ueberschreibt die Unternehmen-Spalte, falls gepflegt
  const unternehmen =
    navigation.length > 0
      ? navigation.map((it) => ({ label: getNavLabel(it), href: getNavHref(it), key: it._key }))
      : UNTERNEHMEN_LINKS.map((l) => ({ ...l, key: l.href }))

  return (
    <footer className="bg-paper-2 pt-32 pb-10 mt-20 border-t border-line">
      <div className="wrap">
        <div className="grid gap-10 pb-20 border-b border-line md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" aria-label={siteName} className="inline-flex items-center">
              <img src={logo} alt={siteName} width={180} height={36} className="h-9 w-auto" />
            </Link>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink-soft">{description}</p>
          </div>

          <div>
            <div className="eyebrow !text-ink-muted">Pflegekräfte</div>
            <ul className="mt-5 space-y-3 text-[15px]">
              {PFLEGE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ink-soft transition-colors hover:text-sky">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="eyebrow !text-ink-muted">Einrichtungen</div>
            <ul className="mt-5 space-y-3 text-[15px]">
              {EINRICHTUNGEN_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ink-soft transition-colors hover:text-sky">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="eyebrow !text-ink-muted">Unternehmen</div>
            <ul className="mt-5 space-y-3 text-[15px]">
              {unternehmen.map((l) => (
                <li key={l.key}>
                  <Link href={l.href} className="text-ink-soft transition-colors hover:text-sky">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-8 text-[13px] text-ink-muted">
          <div>
            © {currentYear} {siteName} GmbH, alle Rechte vorbehalten.
          </div>
          <div className="flex flex-wrap items-center gap-6">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-ink-muted hover:text-ink">
                {l.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => resetConsent()}
              className="text-ink-muted hover:text-ink"
            >
              Cookie-Einstellungen
            </button>
          </div>
        </div>

        <div className="mt-8 text-[12px] text-ink-muted">
          Entwickelt von{' '}
          <a
            href="https://sk-online-marketing.de"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent transition-colors hover:text-accent-deep"
          >
            SK Online Marketing
          </a>
        </div>
      </div>
    </footer>
  )
}
