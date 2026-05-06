'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export function NewsletterCTA() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (email) {
      // TODO: API-Call zu /api/newsletter (Sendgrid)
      setDone(true)
    }
  }

  return (
    <section className="section-pad-tight" data-screen-label="Newsletter">
      <div className="wrap">
        <div className="relative grid items-center gap-8 overflow-hidden rounded-[20px] bg-accent p-8 text-white sm:p-10 md:grid-cols-2 md:gap-12 md:p-20">
          {/* deco */}
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -right-24 h-[400px] w-[400px] rounded-full bg-accent-deep opacity-40"
          />

          <div className="relative z-10">
            <div className="eyebrow !text-white/70">Job-Newsletter</div>
            <h2 className="h2 mt-4 !text-white">
              Die <em>besten Stellen</em>,
              <br />
              direkt in dein Postfach.
            </h2>
            <p className="mt-4 max-w-[420px] text-[16px] text-white/85">
              Einmal pro Woche. Keine Werbung. Nur Stellen, die wirklich zu dir passen.
            </p>
          </div>

          <div className="relative z-10">
            <form
              onSubmit={onSubmit}
              className="flex w-full max-w-[520px] overflow-hidden rounded-full border border-ink bg-paper-2"
            >
              <input
                type="email"
                placeholder="deine@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 border-0 bg-transparent px-5 py-4 text-[15px] text-ink outline-none placeholder:text-ink-muted"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-accent px-6 py-4 text-[15px] font-medium text-white transition-colors hover:bg-accent-deep"
              >
                {done ? (
                  'Eingetragen ✓'
                ) : (
                  <>
                    Anmelden
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </form>
            <div className="mt-3.5 text-[12px] text-white/70">
              Mit der Anmeldung stimmst du unserer{' '}
              <Link href="/datenschutz" className="underline hover:text-white">
                Datenschutzerklärung
              </Link>{' '}
              zu.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
