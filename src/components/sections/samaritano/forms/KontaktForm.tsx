'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const TOPICS = [
  'Allgemeine Anfrage',
  'Ich suche eine Stelle',
  'Wir suchen Pflegepersonal',
  'Presse / Partnerschaft',
  'Beschwerde / Feedback',
] as const

export function KontaktForm() {
  const [sent, setSent] = useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // TODO: POST -> /api/contact (Sendgrid)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="rounded-[16px] border border-line bg-white p-10 text-center">
        <div className="mb-4 text-[48px] text-sky">✓</div>
        <h3 className="m-0 mb-3 font-serif text-[30px] font-normal">Nachricht erhalten</h3>
        <p className="m-0 text-ink-soft">Wir melden uns innerhalb eines Werktags.</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-[18px] rounded-[16px] border border-line bg-white p-8 sm:p-10"
    >
      <div>
        <label htmlFor="topic" className="eyebrow mb-2 block">
          Anliegen
        </label>
        <select
          id="topic"
          name="topic"
          defaultValue={TOPICS[0]}
          className="w-full rounded-[8px] border border-line bg-white px-4 py-3.5 text-[15px] outline-none focus:border-sky"
        >
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      {[
        { name: 'name', label: 'Name', type: 'text', placeholder: 'Vor- und Nachname', required: true },
        { name: 'email', label: 'E-Mail', type: 'email', placeholder: 'name@beispiel.de', required: true },
        { name: 'phone', label: 'Telefon', type: 'tel', placeholder: 'optional', required: false },
      ].map((f) => (
        <div key={f.name}>
          <label htmlFor={f.name} className="eyebrow mb-2 block">
            {f.label}
          </label>
          <input
            id={f.name}
            name={f.name}
            type={f.type}
            placeholder={f.placeholder}
            required={f.required}
            className="w-full rounded-[8px] border border-line bg-white px-4 py-3.5 text-[15px] outline-none focus:border-sky"
          />
        </div>
      ))}
      <div>
        <label htmlFor="message" className="eyebrow mb-2 block">
          Nachricht
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Worum geht es?"
          required
          className="w-full resize-y rounded-[8px] border border-line bg-white px-4 py-3.5 text-[15px] outline-none focus:border-sky"
        />
      </div>
      <label className="flex items-start gap-2.5 text-[13px] leading-relaxed text-ink-soft">
        <input type="checkbox" required className="mt-1 accent-accent" />
        <span>
          Ich habe die{' '}
          <Link href="/datenschutz" className="border-b border-line transition-colors hover:border-sky hover:text-sky">
            Datenschutzerklärung
          </Link>{' '}
          gelesen.
        </span>
      </label>
      <button type="submit" className="btn btn-primary mt-2 !px-6 !py-4">
        Nachricht senden
        <ArrowUpRight className="h-3.5 w-3.5" />
      </button>
    </form>
  )
}
