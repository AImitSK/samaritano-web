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
  siteName = 'Firmenname',
  description,
  navigation = [],
}: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-surface-raised">
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              {logoUrl ? (
                <img src={logoUrl} alt={siteName} className="h-8 w-auto" />
              ) : (
                <span className="font-display text-xl font-bold">{siteName}</span>
              )}
            </Link>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              {description || 'Eine kurze Beschreibung des Unternehmens oder der Website.'}
            </p>
          </div>

          {/* Footer Navigation */}
          {navigation.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold">Links</h3>
              <ul className="mt-4 space-y-2">
                {navigation.map((item) => {
                  const href = getNavHref(item)
                  const isExternal = item.type === 'external' && item.openInNewTab
                  return (
                    <li key={item._key}>
                      <Link
                        href={href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {getNavLabel(item)}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {/* Cookie */}
          <div>
            <h3 className="text-sm font-semibold">Rechtliches</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <button
                  onClick={() => resetConsent()}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Cookie-Einstellungen
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 pt-8 md:flex-row">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent md:hidden" />
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} {siteName}. Alle Rechte vorbehalten.
          </p>
          <p className="text-sm text-muted-foreground">
            Entwickelt von{' '}
            <a
              href="https://sk-online-marketing.de"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent transition-colors hover:text-accent/80"
            >
              SK Online Marketing
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
