'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/types'

/* eslint-disable @next/next/no-img-element */

interface HeaderProps {
  logoUrl?: string | null
  siteName?: string
  navigation?: NavItem[]
}

const mobileMenuVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

const mobileItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
}

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
  if (href === '#') return false
  return pathname === href || pathname.startsWith(href + '/')
}

export function Header({ logoUrl, siteName = 'Logo', navigation = [] }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl transition-all duration-300',
        scrolled ? 'border-border/40 shadow-elevated' : 'border-transparent'
      )}
    >
      <nav
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 sm:px-6 lg:px-8',
          scrolled ? 'py-3' : 'py-4'
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          {logoUrl ? (
            <img src={logoUrl} alt={siteName} className="h-8 w-auto" />
          ) : (
            <span className="font-display text-xl font-bold">{siteName}</span>
          )}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-x-6" ref={dropdownRef}>
          {navigation.map((item) => {
            const hasChildren = item.children && item.children.length > 0
            const href = getNavHref(item)
            const label = getNavLabel(item)
            const active = isActive(pathname, item)
            const childActive = item.children?.some((child) => isActive(pathname, child))
            const isExternal = item.type === 'external' && item.openInNewTab

            if (hasChildren) {
              return (
                <div key={item._key} className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item._key ? null : item._key)}
                    className={cn(
                      'flex items-center gap-1 text-sm font-medium transition-colors',
                      active || childActive
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {label}
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 transition-transform',
                        openDropdown === item._key && 'rotate-180'
                      )}
                    />
                    {(active || childActive) && (
                      <motion.div
                        layoutId="active-nav"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-accent"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>

                  <AnimatePresence>
                    {openDropdown === item._key && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full mt-2 min-w-[180px] rounded-lg border border-border/50 bg-background p-1.5 shadow-elevated"
                      >
                        {item.children!.map((child) => (
                          <Link
                            key={child._key}
                            href={getNavHref(child)}
                            target={child.type === 'external' && child.openInNewTab ? '_blank' : undefined}
                            rel={child.type === 'external' && child.openInNewTab ? 'noopener noreferrer' : undefined}
                            className={cn(
                              'block rounded-md px-3 py-2 text-sm transition-colors',
                              isActive(pathname, child)
                                ? 'bg-accent/10 text-accent'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )}
                          >
                            {getNavLabel(child)}
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
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className={cn(
                  'relative text-sm font-medium transition-colors',
                  active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {label}
                {active && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-accent"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-x-2">
          <ThemeToggle />
          <Button variant="accent" className="hidden md:inline-flex">
            Jetzt starten
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border/40 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              className="space-y-1 px-4 py-4"
            >
              {navigation.map((item) => {
                const hasChildren = item.children && item.children.length > 0

                return (
                  <motion.div key={item._key} variants={mobileItemVariants}>
                    {hasChildren ? (
                      <div>
                        <button
                          onClick={() =>
                            setOpenDropdown(openDropdown === item._key ? null : item._key)
                          }
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          {getNavLabel(item)}
                          <ChevronDown
                            className={cn(
                              'h-4 w-4 transition-transform',
                              openDropdown === item._key && 'rotate-180'
                            )}
                          />
                        </button>
                        <AnimatePresence>
                          {openDropdown === item._key && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="ml-4 space-y-1 overflow-hidden"
                            >
                              {item.children!.map((child) => (
                                <Link
                                  key={child._key}
                                  href={getNavHref(child)}
                                  className={cn(
                                    'block rounded-lg px-3 py-2 text-sm transition-colors',
                                    isActive(pathname, child)
                                      ? 'bg-accent/10 text-accent'
                                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                  )}
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {getNavLabel(child)}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={getNavHref(item)}
                        className={cn(
                          'block rounded-lg px-3 py-2.5 text-base font-medium transition-colors',
                          isActive(pathname, item)
                            ? 'bg-accent/10 text-accent'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {getNavLabel(item)}
                      </Link>
                    )}
                  </motion.div>
                )
              })}
              <motion.div variants={mobileItemVariants} className="pt-4">
                <Button variant="accent" className="w-full">
                  Jetzt starten
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
