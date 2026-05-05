'use client'

import Link from 'next/link'
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react'
import { resetConsent } from '@/lib/cookies'
import type { NavItem, SocialLink } from '@/types'

/* eslint-disable @next/next/no-img-element */

interface FooterProps {
  logoUrl?: string | null
  siteName?: string
  description?: string
  navigation?: NavItem[]
  socialLinks?: SocialLink[]
}

const STATIC_LOGO = '/uploads/Logo-Samaritano-Web.svg'
const FALLBACK_DESCRIPTION =
  'Pflegeberufe für Leute mit Herz und Hingabe. Wir vermitteln dort, wo deine Arbeit den größten Unterschied macht.'

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

const SOCIAL_ICONS: Record<SocialLink['platform'], typeof Facebook> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
}

const SOCIAL_LABELS: Record<SocialLink['platform'], string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  twitter: 'Twitter',
  youtube: 'YouTube',
}

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
  description,
  navigation = [],
  socialLinks = [],
}: FooterProps) {
  const currentYear = new Date().getFullYear()
  const logo = logoUrl || STATIC_LOGO
  const desc = description || FALLBACK_DESCRIPTION

  const unternehmen =
    navigation.length > 0
      ? navigation.map((it) => ({ label: getNavLabel(it), href: getNavHref(it), key: it._key }))
      : UNTERNEHMEN_LINKS.map((l) => ({ ...l, key: l.href }))

  return (
    <footer className="mt-20 border-t border-line bg-paper-2 pb-10 pt-32">
      <div className="wrap">
        <div className="grid gap-10 border-b border-line pb-20 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" aria-label={siteName} className="inline-flex items-center">
              <img src={logo} alt={siteName} width={180} height={36} className="h-9 w-auto" />
            </Link>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink-soft">{desc}</p>

            {socialLinks.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-3">
                {socialLinks.map((s) => {
                  const Icon = SOCIAL_ICONS[s.platform]
                  if (!Icon || !s.url) return null
                  return (
                    <a
                      key={s._key || s.platform}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={SOCIAL_LABELS[s.platform]}
                      className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-sky hover:text-sky"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  )
                })}
              </div>
            )}
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
            className="text-sky transition-colors hover:text-ink"
          >
            SK Online Marketing
          </a>
        </div>
      </div>
    </footer>
  )
}
