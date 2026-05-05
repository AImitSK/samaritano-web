'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const ROLES = [
  'Pflegefachkraft',
  'Fachkrankenpfleger Intensiv',
  'Anästhesietechnischer Assistent',
  'Operationstechnischer Assistent',
  'Altenpfleger',
] as const

const BASE_RATES: Record<(typeof ROLES)[number], number> = {
  Pflegefachkraft: 4200,
  'Fachkrankenpfleger Intensiv': 5400,
  'Anästhesietechnischer Assistent': 5100,
  'Operationstechnischer Assistent': 4900,
  Altenpfleger: 3700,
}

export function SalaryTeaser() {
  const [role, setRole] = useState<(typeof ROLES)[number]>('Fachkrankenpfleger Intensiv')
  const [hours, setHours] = useState(38)
  const [shifts, setShifts] = useState(8)

  const base = useMemo(() => {
    const b = BASE_RATES[role] ?? 4500
    const hourFactor = hours / 38
    const shiftBonus = shifts * 45
    return Math.round((b * hourFactor + shiftBonus) / 10) * 10
  }, [role, hours, shifts])

  const tarifPlus = Math.round((base / 4200 - 1) * 100)

  return (
    <section className="section-pad bg-paper-2" data-screen-label="Gehalt">
      <div className="wrap">
        <div className="grid items-center gap-20 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <div className="eyebrow">Gehaltsrechner</div>
            <h2 className="h1 mt-5">
              Was
              <br />
              <em>verdienst</em>
              <br />
              du wirklich?
            </h2>
            <p className="lede mt-6 max-w-[480px]">
              Probier&apos;s selbst aus, und sieh in Sekunden, wie Samaritano gegenüber Tarif abschneidet.
            </p>
            <Link href="/gehaltsrechner" className="btn btn-primary mt-8 !inline-flex">
              Vollen Rechner öffnen
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-[20px] border border-line bg-paper-2 p-9 shadow-soft">
            <div className="grid gap-6">
              <div>
                <label className="eyebrow mb-2 block" htmlFor="salary-role">
                  Beruf
                </label>
                <select
                  id="salary-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as (typeof ROLES)[number])}
                  className="w-full rounded-[10px] border border-line bg-paper px-4 py-3.5 text-[15px] text-ink focus:outline-none focus:ring-2 focus:ring-sky"
                >
                  {ROLES.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="eyebrow mb-2 block" htmlFor="salary-hours">
                    Wochenstunden: {hours} h
                  </label>
                  <input
                    id="salary-hours"
                    type="range"
                    min={20}
                    max={40}
                    value={hours}
                    onChange={(e) => setHours(+e.target.value)}
                    className="w-full accent-accent"
                  />
                </div>
                <div>
                  <label className="eyebrow mb-2 block" htmlFor="salary-shifts">
                    Nachtdienste/Mo: {shifts}
                  </label>
                  <input
                    id="salary-shifts"
                    type="range"
                    min={0}
                    max={15}
                    value={shifts}
                    onChange={(e) => setShifts(+e.target.value)}
                    className="w-full accent-accent"
                  />
                </div>
              </div>

              <div className="mt-2 flex items-baseline justify-between gap-3 rounded-[14px] bg-ink px-7 py-6 text-paper">
                <div>
                  <div className="text-[13px] text-white/60">Geschätztes Bruttogehalt</div>
                  <div className="mt-1 font-serif text-[64px] font-light leading-none">
                    {base.toLocaleString('de-DE')}
                    <span className="ml-1.5 text-[24px] opacity-60">€/Mo</span>
                  </div>
                </div>
                <div className="rounded-full bg-accent px-3 py-1.5 text-[12px] tracking-wider">
                  +{tarifPlus}% vs. Tarif
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
