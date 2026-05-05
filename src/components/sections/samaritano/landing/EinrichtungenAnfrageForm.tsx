'use client'

import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

const FIELDS = [
  { name: 'einrichtung', label: 'Einrichtung', type: 'text', placeholder: 'Name & Träger', required: true },
  { name: 'kontakt', label: 'Ansprechpartner:in', type: 'text', placeholder: 'Vor- und Nachname', required: true },
  { name: 'email', label: 'E-Mail', type: 'email', placeholder: 'name@einrichtung.de', required: true },
  { name: 'telefon', label: 'Telefon', type: 'tel', placeholder: 'optional', required: false },
] as const

export function EinrichtungenAnfrageForm() {
  const [sent, setSent] = useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // TODO: POST -> /api/contact mit Sendgrid-Bridge
    setSent(true)
  }

  if (sent) {
    return (
      <div className="rounded-[16px] border border-line bg-paper-2 p-10 text-center">
        <div className="mb-4 text-[40px] text-sky">✓</div>
        <h3 className="m-0 mb-3 font-serif text-[28px] font-normal">Anfrage erhalten</h3>
        <p className="m-0 text-ink-soft">Wir melden uns innerhalb von 24 Stunden.</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-[18px] rounded-[16px] border border-line bg-paper-2 p-8 sm:p-10"
    >
      {FIELDS.map((f) => (
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
        <label htmlFor="modell" className="eyebrow mb-2 block">
          Modell
        </label>
        <select
          id="modell"
          name="modell"
          className="w-full rounded-[8px] border border-line bg-white px-4 py-3.5 text-[15px] outline-none focus:border-sky"
        >
          <option>Direktvermittlung</option>
          <option>Personaldienstleistung</option>
          <option>Recruiting-Partnerschaft</option>
          <option>Erstmal beraten lassen</option>
        </select>
      </div>
      <div>
        <label htmlFor="anliegen" className="eyebrow mb-2 block">
          Anliegen
        </label>
        <textarea
          id="anliegen"
          name="anliegen"
          rows={4}
          placeholder="Welche Stelle, welcher Zeitrahmen?"
          className="w-full resize-y rounded-[8px] border border-line bg-white px-4 py-3.5 text-[15px] outline-none focus:border-sky"
        />
      </div>
      <button type="submit" className="btn btn-primary mt-2 !px-6 !py-4">
        Anfrage senden
        <ArrowUpRight className="h-3.5 w-3.5" />
      </button>
    </form>
  )
}
