'use client'

import { useState } from 'react'
import { ArrowUpRight, Loader2, CheckCircle } from 'lucide-react'

const FIELDS = [
  { name: 'einrichtung', label: 'Einrichtung', type: 'text', placeholder: 'Name & Träger', required: true },
  { name: 'kontakt', label: 'Ansprechpartner:in', type: 'text', placeholder: 'Vor- und Nachname', required: true },
  { name: 'email', label: 'E-Mail', type: 'email', placeholder: 'name@einrichtung.de', required: true },
  { name: 'telefon', label: 'Telefon', type: 'tel', placeholder: 'optional', required: false },
] as const

export function EinrichtungenAnfrageForm() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))

    try {
      const res = await fetch('/api/einrichtungen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const json = await res.json()
        setError(json.error || 'Ein Fehler ist aufgetreten.')
        return
      }

      setSent(true)
    } catch {
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="rounded-[16px] border border-line bg-paper-2 p-10 text-center">
        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-sky" />
        <h3 className="m-0 mb-3 font-serif text-[28px] font-normal">Anfrage erhalten</h3>
        <p className="m-0 text-ink-soft">
          Wir melden uns innerhalb von 24 Stunden bei Ihnen.
        </p>
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
            className="w-full rounded-[10px] border border-line bg-white px-4 py-3.5 text-[15px] outline-none transition-colors focus:border-sky focus:ring-2 focus:ring-sky/20"
          />
        </div>
      ))}
      <div>
        <label htmlFor="interesse" className="eyebrow mb-2 block">
          Interesse an
        </label>
        <select
          id="interesse"
          name="interesse"
          className="w-full rounded-[10px] border border-line bg-white px-4 py-3.5 text-[15px] outline-none transition-colors focus:border-sky focus:ring-2 focus:ring-sky/20"
        >
          <option>Zeitarbeit / Personaldienstleistung</option>
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
          className="w-full resize-y rounded-[10px] border border-line bg-white px-4 py-3.5 text-[15px] outline-none transition-colors focus:border-sky focus:ring-2 focus:ring-sky/20"
        />
      </div>

      {error && <p className="text-[13px] font-medium text-red-600">{error}</p>}

      <button type="submit" disabled={loading} className="btn btn-primary mt-2 !px-6 !py-4 disabled:opacity-60">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            Anfrage senden
            <ArrowUpRight className="h-3.5 w-3.5" />
          </>
        )}
      </button>
    </form>
  )
}
