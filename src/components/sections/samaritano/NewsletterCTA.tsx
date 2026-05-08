'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Loader2, CheckCircle, Mail } from 'lucide-react'

interface NewsletterCTAProps {
  variant?: 'full' | 'compact'
  source?: string
}

export function NewsletterCTA({ variant = 'full', source = 'homepage' }: NewsletterCTAProps) {
  const [salutation, setSalutation] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [datenschutz, setDatenschutz] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ salutation, firstName, lastName, email, source, datenschutz }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error || 'Ein Fehler ist aufgetreten.')
        return
      }

      setDone(true)
    } catch {
      setError('Ein Fehler ist aufgetreten. Bitte versuche es spaeter erneut.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <section className={variant === 'compact' ? 'py-12' : 'section-pad-tight'} data-screen-label="Newsletter">
        <div className="wrap">
          <div className={`relative overflow-hidden rounded-[20px] bg-accent p-8 text-center text-white sm:p-10 ${variant === 'full' ? 'md:p-20' : 'md:p-12'}`}>
            <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 h-[400px] w-[400px] rounded-full bg-accent-deep opacity-40" />
            <div className="relative z-10">
              <CheckCircle className="mx-auto mb-4 h-12 w-12" />
              <h3 className="h3 !text-white">Fast geschafft!</h3>
              <p className="mx-auto mt-3 max-w-[420px] text-[16px] text-white/85">
                Wir haben dir eine Bestaetigungsmail gesendet. Bitte klicke auf den Link in der E-Mail, um deine Anmeldung abzuschliessen.
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'compact') {
    return (
      <section className="py-12" data-screen-label="Newsletter">
        <div className="wrap">
          <div className="relative overflow-hidden rounded-[20px] bg-accent p-8 text-white sm:p-10 md:p-12">
            <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 h-[400px] w-[400px] rounded-full bg-accent-deep opacity-40" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-[13px] font-medium uppercase tracking-wider text-white/70">
                <Mail className="h-4 w-4" />
                Newsletter
              </div>
              <h3 className="h3 mt-3 !text-white">Keine Artikel mehr verpassen</h3>
              <p className="mt-2 max-w-[480px] text-[15px] text-white/85">
                Erhalte die neuesten Stellenangebote und Brancheninfos direkt in dein Postfach.
              </p>

              <form onSubmit={onSubmit} className="mt-6 space-y-3">
                <div className="grid gap-3 sm:grid-cols-3">
                  <select
                    value={salutation}
                    onChange={(e) => setSalutation(e.target.value)}
                    required
                    className="rounded-lg border-0 bg-white/10 px-4 py-3 text-[14px] text-white outline-none backdrop-blur placeholder:text-white/50 focus:ring-2 focus:ring-white/30"
                  >
                    <option value="" disabled className="text-ink">Anrede *</option>
                    <option value="Herr" className="text-ink">Herr</option>
                    <option value="Frau" className="text-ink">Frau</option>
                    <option value="Divers" className="text-ink">Divers</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Vorname *"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    minLength={2}
                    className="rounded-lg border-0 bg-white/10 px-4 py-3 text-[14px] text-white outline-none backdrop-blur placeholder:text-white/50 focus:ring-2 focus:ring-white/30"
                  />
                  <input
                    type="text"
                    placeholder="Nachname *"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    minLength={2}
                    className="rounded-lg border-0 bg-white/10 px-4 py-3 text-[14px] text-white outline-none backdrop-blur placeholder:text-white/50 focus:ring-2 focus:ring-white/30"
                  />
                </div>

                <div className="flex overflow-hidden rounded-lg border border-white/20 bg-white/10 backdrop-blur">
                  <input
                    type="email"
                    placeholder="deine@email.de *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 border-0 bg-transparent px-4 py-3 text-[14px] text-white outline-none placeholder:text-white/50"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-white/20 px-6 py-3 text-[14px] font-medium text-white transition-colors hover:bg-white/30 disabled:opacity-60"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Anmelden
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>

                <label className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    checked={datenschutz}
                    onChange={(e) => setDatenschutz(e.target.checked)}
                    required
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/30 bg-white/10 text-white accent-white"
                  />
                  <span className="text-[12px] leading-relaxed text-white/70">
                    Ich stimme der{' '}
                    <Link href="/datenschutz" className="underline hover:text-white">
                      Datenschutzerklaerung
                    </Link>{' '}
                    zu und moechte den Newsletter erhalten. *
                  </span>
                </label>

                {error && (
                  <p className="text-[13px] font-medium text-red-300">{error}</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // ─── Full variant (Homepage) ───
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
            <form onSubmit={onSubmit} className="w-full max-w-[520px] space-y-3">
              <div className="grid gap-3 sm:grid-cols-3">
                <select
                  value={salutation}
                  onChange={(e) => setSalutation(e.target.value)}
                  required
                  className="rounded-lg border-0 bg-white/10 px-4 py-3 text-[14px] text-white outline-none backdrop-blur placeholder:text-white/50 focus:ring-2 focus:ring-white/30"
                >
                  <option value="" disabled className="text-ink">Anrede *</option>
                  <option value="Herr" className="text-ink">Herr</option>
                  <option value="Frau" className="text-ink">Frau</option>
                  <option value="Divers" className="text-ink">Divers</option>
                </select>
                <input
                  type="text"
                  placeholder="Vorname *"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  minLength={2}
                  className="rounded-lg border-0 bg-white/10 px-4 py-3 text-[14px] text-white outline-none backdrop-blur placeholder:text-white/50 focus:ring-2 focus:ring-white/30"
                />
                <input
                  type="text"
                  placeholder="Nachname *"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  minLength={2}
                  className="rounded-lg border-0 bg-white/10 px-4 py-3 text-[14px] text-white outline-none backdrop-blur placeholder:text-white/50 focus:ring-2 focus:ring-white/30"
                />
              </div>

              <div className="flex overflow-hidden rounded-full border border-white/20 bg-white/10 backdrop-blur">
                <input
                  type="email"
                  placeholder="deine@email.de *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 border-0 bg-transparent px-5 py-4 text-[15px] text-white outline-none placeholder:text-white/50"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-white/20 px-6 py-4 text-[15px] font-medium text-white transition-colors hover:bg-white/30 disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Anmelden
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>

              <label className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  checked={datenschutz}
                  onChange={(e) => setDatenschutz(e.target.checked)}
                  required
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/30 bg-white/10 text-white accent-white"
                />
                <span className="text-[12px] leading-relaxed text-white/70">
                  Ich stimme der{' '}
                  <Link href="/datenschutz" className="underline hover:text-white">
                    Datenschutzerklaerung
                  </Link>{' '}
                  zu und moechte den Newsletter erhalten. *
                </span>
              </label>

              {error && (
                <p className="text-[13px] font-medium text-red-300">{error}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
