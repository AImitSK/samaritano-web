'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

type RoleKey =
  | 'Pflegefachkraft'
  | 'Fachkrankenpfleger Intensiv'
  | 'Anästhesietechnischer Assistent'
  | 'Operationstechnischer Assistent'
  | 'Altenpfleger'
  | 'Kinderkrankenpfleger'

const ROLES_DATA: Record<RoleKey, { tarif: number; base: number; top: number }> = {
  Pflegefachkraft: { tarif: 3400, base: 4200, top: 4900 },
  'Fachkrankenpfleger Intensiv': { tarif: 4100, base: 5100, top: 5900 },
  'Anästhesietechnischer Assistent': { tarif: 3900, base: 4900, top: 5600 },
  'Operationstechnischer Assistent': { tarif: 3800, base: 4800, top: 5500 },
  Altenpfleger: { tarif: 2900, base: 3600, top: 4200 },
  Kinderkrankenpfleger: { tarif: 3500, base: 4300, top: 5000 },
}

const ROLES = Object.keys(ROLES_DATA) as RoleKey[]

interface SliderProps {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  suffix?: string
}

function Slider({ label, value, onChange, min, max, suffix = '' }: SliderProps) {
  return (
    <div>
      <div className="mb-3.5 flex items-baseline justify-between">
        <label className="eyebrow">{label}</label>
        <span className="font-serif text-[24px] tracking-tight">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="h-1 w-full accent-accent"
      />
      <div className="mt-1.5 flex justify-between font-mono text-[11px] text-ink-muted">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

export function Gehaltsrechner() {
  const [role, setRole] = useState<RoleKey>('Fachkrankenpfleger Intensiv')
  const [hours, setHours] = useState(38)
  const [exp, setExp] = useState(5)
  const [nights, setNights] = useState(8)
  const [weekends, setWeekends] = useState(4)
  const [holidays, setHolidays] = useState(2)

  const calc = useMemo(() => {
    const r = ROLES_DATA[role]
    const expBoost = Math.min(exp / 10, 1) * 0.25
    const baseFor = (b: number) => Math.round((b * (1 + expBoost) * (hours / 38)) / 10) * 10
    const tarif = baseFor(r.tarif)
    const samaBase = baseFor(r.base)
    const nightBonus = nights * 45
    const weekendBonus = weekends * 65
    const holidayBonusYearly = holidays * 120
    const holidayBonusMonthly = Math.round(holidayBonusYearly / 12)
    const sama = samaBase + nightBonus + weekendBonus + holidayBonusMonthly
    const tarifTotal = tarif + nights * 25 + weekends * 30 + Math.round((holidays * 60) / 12)
    const diff = sama - tarifTotal
    const diffPct = Math.round((sama / tarifTotal - 1) * 100)
    return {
      tarif: tarifTotal,
      sama,
      samaBase,
      nightBonus,
      weekendBonus,
      holidayBonusMonthly,
      diff,
      diffPct,
      yearly: sama * 13,
      hourlyRate: Math.round(sama / (hours * 4.33)),
    }
  }, [role, hours, exp, nights, weekends, holidays])

  return (
    <section className="pb-20 pt-16 lg:pt-20">
      <div className="wrap">
        {/* Hero */}
        <div className="mb-12 grid items-end gap-10 lg:mb-16 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <div className="eyebrow">Gehaltsrechner</div>
            <h1 className="display mt-6">
              <span className="block whitespace-nowrap">Was du</span>
              <span className="block whitespace-nowrap">
                als <em>Samaritano</em>
              </span>
              <span className="block whitespace-nowrap">verdienst.</span>
            </h1>
          </div>
          <p className="lede max-w-[380px]">
            Stell deine Eckdaten ein. Wir zeigen dir transparent, was du bei uns verdienst, und wie das im
            Vergleich zum Tarif aussieht.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.1fr]">
          {/* Inputs */}
          <div className="rounded-[20px] border border-line bg-paper-2 p-10 lg:sticky lg:top-24">
            <div className="mb-8">
              <label className="eyebrow mb-3.5 block">Beruf</label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {ROLES.map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRole(r)}
                    className={`rounded-[10px] border px-3.5 py-3 text-left text-[13px] leading-tight transition-colors ${
                      role === r
                        ? 'border-ink bg-ink text-paper'
                        : 'border-line bg-paper text-ink hover:border-ink'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-7">
              <Slider label="Wochenstunden" value={hours} onChange={setHours} min={20} max={40} suffix="h" />
              <Slider label="Berufserfahrung" value={exp} onChange={setExp} min={0} max={15} suffix=" Jahre" />
              <hr className="divider" />
              <Slider label="Nachtdienste / Monat" value={nights} onChange={setNights} min={0} max={15} />
              <Slider
                label="Wochenend-Dienste / Monat"
                value={weekends}
                onChange={setWeekends}
                min={0}
                max={10}
              />
              <Slider
                label="Feiertags-Dienste / Jahr"
                value={holidays}
                onChange={setHolidays}
                min={0}
                max={12}
              />
            </div>
          </div>

          {/* Results */}
          <div>
            <div className="overflow-hidden rounded-[20px] bg-ink p-10 text-paper sm:p-12">
              <div className="eyebrow !text-white/55">Dein Bruttogehalt bei Samaritano</div>
              <div
                className="mt-3.5 font-serif font-light leading-none tracking-tight"
                style={{ fontSize: 'clamp(56px, 9vw, 112px)' }}
              >
                {calc.sama.toLocaleString('de-DE')}
                <span className="ml-2.5 text-[32px] opacity-50">€/Mo</span>
              </div>
              <div className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-accent px-4 py-2.5 text-[14px] font-medium">
                +{calc.diff.toLocaleString('de-DE')} €
                <span className="opacity-80">(+{calc.diffPct} %)</span> über Tarif
              </div>
              <div className="mt-8 grid gap-6 border-t border-white/10 pt-7 sm:grid-cols-2">
                <div>
                  <div className="text-[13px] text-white/55">Pro Jahr (inkl. 13.)</div>
                  <div className="mt-1 font-serif text-[32px] font-light">
                    {calc.yearly.toLocaleString('de-DE')} €
                  </div>
                </div>
                <div>
                  <div className="text-[13px] text-white/55">Stundensatz</div>
                  <div className="mt-1 font-serif text-[32px] font-light">{calc.hourlyRate} €</div>
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="mt-6 rounded-[20px] border border-line bg-paper-2 p-8">
              <div className="eyebrow mb-5">Zusammensetzung</div>
              <table className="w-full border-collapse text-[15px]">
                <tbody>
                  {[
                    ['Grundgehalt', calc.samaBase, '+ ggü. Tarif'],
                    ['Nachtdienste', calc.nightBonus, `${nights} × 45 €`],
                    ['Wochenenden', calc.weekendBonus, `${weekends} × 65 €`],
                    ['Feiertage (anteilig)', calc.holidayBonusMonthly, `${holidays}/Jahr × 120 €`],
                  ].map(([k, v, sub]) => (
                    <tr key={k as string} className="border-b border-line">
                      <td className="py-4">
                        <div className="font-medium">{k}</div>
                        <div className="mt-0.5 text-[12px] text-ink-muted">{sub}</div>
                      </td>
                      <td className="py-4 text-right font-mono">{(v as number).toLocaleString('de-DE')} €</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="pt-5 font-semibold">Gesamt brutto / Monat</td>
                    <td className="pt-5 text-right font-serif text-[22px] text-sky">
                      {calc.sama.toLocaleString('de-DE')} €
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Comparison */}
            <div className="mt-6 rounded-[20px] border border-line bg-paper p-8">
              <div className="eyebrow mb-5">Vergleich Tarif vs. Samaritano</div>
              <div className="grid gap-4">
                <div>
                  <div className="mb-1.5 flex justify-between text-[13px]">
                    <span className="text-ink-muted">Tarif (Durchschnitt)</span>
                    <span className="font-mono">{calc.tarif.toLocaleString('de-DE')} €</span>
                  </div>
                  <div className="h-3.5 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-ink-muted"
                      style={{ width: `${(calc.tarif / calc.sama) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-1.5 flex justify-between text-[13px]">
                    <span className="font-medium text-sky">Samaritano</span>
                    <span className="font-mono font-medium text-sky">
                      {calc.sama.toLocaleString('de-DE')} €
                    </span>
                  </div>
                  <div className="h-3.5 overflow-hidden rounded-full bg-line">
                    <div className="h-full w-full rounded-full bg-sky transition-[width] duration-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link href="/jobs" className="btn btn-primary">
                Passende Stellen ansehen
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <button type="button" className="btn btn-ghost" disabled>
                PDF herunterladen
              </button>
            </div>

            <p className="mt-5 max-w-[580px] text-[12px] leading-relaxed text-ink-muted">
              Hinweis: Unverbindliche Schätzung auf Basis von Durchschnittswerten 2026. Dein konkretes
              Angebot besprechen wir gern persönlich, Zulagen, Boni und Wechselprämien individuell.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
