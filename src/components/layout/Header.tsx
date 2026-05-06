'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/types'

/* eslint-disable @next/next/no-img-element */

interface HeaderProps {
  logoUrl?: string | null
  siteName?: string
  navigation?: NavItem[]
}

const FALLBACK_NAV: NavItem[] = [
  { _key: 'pflegekraefte', label: 'Pflegekräfte', type: 'external', href: '/pflegekraefte' },
  { _key: 'einrichtungen', label: 'Einrichtungen', type: 'external', href: '/einrichtungen' },
  { _key: 'gehaltsrechner', label: 'Gehaltsrechner', type: 'external', href: '/gehaltsrechner' },
  { _key: 'magazin', label: 'Magazin', type: 'external', href: '/magazin' },
  { _key: 'ueber-uns', label: 'Über uns', type: 'external', href: '/ueber-uns' },
]

const STATIC_LOGO = '/uploads/Logo-Samaritano-Web.svg'

function getNavLabel(item: NavItem): string {
  return item.label || item.page?.title || item.href || ''
}

function getNavHref(item: NavItem): string {
  if (item.type === 'external') return item.href || '#'
  if (item.page?.slug?.current) return `/${item.page.slug.current}`
  return '#'
}

function isActive(pathname: string, item: NavItem): boolean {
  const href = getNavHref(item)
  if (href === '#' || href === '/') return pathname === href
  return pathname === href || pathname.startsWith(href + '/')
}

export function Header({ logoUrl, siteName = 'Samaritano', navigation = [] }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()
  const navRef = useRef<HTMLDivElement>(null)

  const items = navigation.length > 0 ? navigation : FALLBACK_NAV
  const logo = logoUrl || STATIC_LOGO

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-[background,border-color,backdrop-filter] duration-200',
        scrolled
          ? 'border-b border-line bg-paper/85 backdrop-blur-md backdrop-saturate-150'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <div ref={navRef} className="wrap flex h-[72px] items-center justify-between">
        <Link href="/" aria-label={siteName} className="flex items-center">
          <img
            src={logo}
            alt={siteName}
            className="h-7 w-auto md:h-8"
            width={160}
            height={32}
          />
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {items.map((item) => {
            const hasChildren = item.children && item.children.length > 0
            const href = getNavHref(item)
            const label = getNavLabel(item)
            const active = isActive(pathname, item)
            const childActive = item.children?.some((c) => isActive(pathname, c))
            const open = openDropdown === item._key

            if (hasChildren) {
              return (
                <div key={item._key} className="relative">
                  <button
                    onClick={() => setOpenDropdown(open ? null : item._key)}
                    onMouseEnter={() => setOpenDropdown(item._key)}
                    aria-expanded={open}
                    className={cn(
                      'flex items-center gap-1 py-2 text-[14px] font-medium transition-colors',
                      active || childActive ? 'text-sky' : 'text-ink hover:text-sky'
                    )}
                  >
                    {label}
                    <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
                  </button>
                  <AnimatePresence>
                    {open && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        onMouseLeave={() => setOpenDropdown(null)}
                        className="absolute left-0 top-full mt-2 min-w-[220px] rounded-xl border border-line bg-paper-2 p-2 shadow-elevated"
                      >
                        {item.children!.map((child) => (
                          <Link
                            key={child._key}
                            href={getNavHref(child)}
                            target={child.type === 'external' && child.openInNewTab ? '_blank' : undefined}
                            rel={child.type === 'external' && child.openInNewTab ? 'noopener noreferrer' : undefined}
                            className={cn(
                              'group flex items-center justify-between rounded-md px-3 py-2 text-[14px] transition-colors',
                              isActive(pathname, child)
                                ? 'bg-sky-soft text-ink'
                                : 'text-ink-soft hover:bg-line-soft hover:text-ink'
                            )}
                          >
                            <span>{getNavLabel(child)}</span>
                            <ArrowUpRight className="h-3 w-3 -translate-x-1 text-sky opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            }

            return (
              <Link
                key={item._key}
                href={href}
                target={item.type === 'external' && item.openInNewTab ? '_blank' : undefined}
                rel={item.type === 'external' && item.openInNewTab ? 'noopener noreferrer' : undefined}
                className={cn(
                  'relative py-2 text-[14px] font-medium transition-colors',
                  active ? 'text-sky' : 'text-ink hover:text-sky'
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <Link href="/kontakt" className="hidden text-[14px] text-ink hover:text-sky md:inline-block">
            Kontakt
          </Link>
          <Link
            href="/jobs"
            className="btn btn-primary hidden !px-5 !py-3 !text-[14px] lg:inline-flex"
          >
            Traumjob finden
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Menü schließen' : 'Menü öffnen'}
            className="grid h-10 w-10 place-items-center rounded-md text-ink hover:bg-line-soft lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-line bg-paper/95 backdrop-blur-md lg:hidden"
          >
            <div className="wrap py-4">
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item._key}>
                    <Link
                      href={getNavHref(item)}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'block rounded-md px-3 py-3 text-base font-medium',
                        isActive(pathname, item) ? 'bg-sky-soft text-ink' : 'text-ink hover:bg-line-soft'
                      )}
                    >
                      {getNavLabel(item)}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/kontakt"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-md px-3 py-3 text-base font-medium text-ink hover:bg-line-soft"
                  >
                    Kontakt
                  </Link>
                </li>
              </ul>
              <Link
                href="/jobs"
                onClick={() => setMobileOpen(false)}
                className="btn btn-primary mt-4 flex w-full justify-center"
              >
                Traumjob finden
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
