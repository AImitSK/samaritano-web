'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { ArrowUpRight, Check, Lock } from 'lucide-react'

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
    <div className="min-w-0">
      <div className="mb-3.5 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
        <label className="eyebrow">{label}</label>
        <span className="font-serif text-[24px] leading-none tracking-tight">
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

const leadSchema = z.object({
  salutation: z.string().min(1, 'Bitte waehlen'),
  firstName: z.string().min(2, 'Mindestens 2 Zeichen'),
  lastName: z.string().min(2, 'Mindestens 2 Zeichen'),
  email: z.string().email('Ungueltige E-Mail'),
  privacy: z.literal(true, { errorMap: () => ({ message: 'Bitte zustimmen' }) }),
})
type LeadForm = z.infer<typeof leadSchema>

const inputClass = 'w-full rounded-[8px] border border-line bg-white px-4 py-3 text-[14px] outline-none focus:border-sky'

export function Gehaltsrechner() {
  const [role, setRole] = useState<RoleKey>('Fachkrankenpfleger Intensiv')
  const [hours, setHours] = useState(38)
  const [exp, setExp] = useState(5)
  const [nights, setNights] = useState(8)
  const [weekends, setWeekends] = useState(4)
  const [holidays, setHolidays] = useState(2)
  const [unlocked, setUnlocked] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LeadForm>({
    resolver: zodResolver(leadSchema),
  })

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
              <span className="block sm:whitespace-nowrap">Was du</span>
              <span className="block sm:whitespace-nowrap">
                als <em>Samaritano</em>
              </span>
              <span className="block sm:whitespace-nowrap">verdienst.</span>
            </h1>
          </div>
          <p className="lede max-w-[380px]">
            Stell deine Eckdaten ein. Wir zeigen dir transparent, was du bei uns verdienst, und wie das im
            Vergleich zum Tarif aussieht.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.1fr]">
          {/* Inputs */}
          <div className="min-w-0 rounded-[20px] border border-line bg-paper-2 p-6 sm:p-10 lg:sticky lg:top-24">
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
          <div className="min-w-0">
            <div className="overflow-hidden rounded-[20px] bg-ink p-6 text-paper sm:p-10 lg:p-12">
              <div className="eyebrow !text-white/55">Dein Bruttogehalt bei Samaritano</div>
              <div
                className="mt-3.5 font-serif font-light leading-none tracking-tight"
                style={{ fontSize: 'clamp(40px, 9vw, 112px)' }}
              >
                {calc.sama.toLocaleString('de-DE')}
                <span className="ml-2.5 text-[20px] opacity-50 sm:text-[28px] lg:text-[32px]">€/Mo</span>
              </div>
              <div className="mt-6 inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 rounded-full bg-accent px-4 py-2.5 text-[13px] font-medium sm:text-[14px]">
                +{calc.diff.toLocaleString('de-DE')} €
                <span className="opacity-80">(+{calc.diffPct} %)</span> über Tarif
              </div>
              <div className="mt-8 grid gap-6 border-t border-white/10 pt-7 sm:grid-cols-2">
                <div>
                  <div className="text-[13px] text-white/55">Pro Jahr (inkl. 13.)</div>
                  <div className="mt-1 font-serif text-[24px] font-light sm:text-[28px] lg:text-[32px]">
                    {calc.yearly.toLocaleString('de-DE')} €
                  </div>
                </div>
                <div>
                  <div className="text-[13px] text-white/55">Stundensatz</div>
                  <div className="mt-1 font-serif text-[24px] font-light sm:text-[28px] lg:text-[32px]">
                    {calc.hourlyRate} €
                  </div>
                </div>
              </div>
            </div>

            {/* Breakdown — gated */}
            <div className="relative mt-6 overflow-hidden rounded-[20px] border border-line bg-paper-2 p-5 sm:p-8">
              <div className="eyebrow mb-5">Zusammensetzung</div>

              {/* Blurred preview when locked */}
              <div className={unlocked ? '' : 'pointer-events-none select-none blur-[6px]'}>
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

              {/* Lead gate overlay */}
              {!unlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-paper-2/80 backdrop-blur-[2px]">
                  <div className="w-full max-w-[400px] px-4">
                    {submitted ? (
                      <div className="text-center">
                        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-accent text-white">
                          <Check className="h-5 w-5" strokeWidth={3} />
                        </div>
                        <div className="font-serif text-[22px]">Check dein Postfach!</div>
                        <p className="mt-2 text-[14px] text-ink-soft">
                          Dein Gehaltsangebot ist unterwegs.
                        </p>
                        <button
                          type="button"
                          onClick={() => setUnlocked(true)}
                          className="btn btn-primary mt-4 !px-5 !py-3 text-[14px]"
                        >
                          Aufschluesselung jetzt ansehen
                        </button>
                      </div>
                    ) : (
                      <form
                        onSubmit={handleSubmit(async (formData) => {
                          setSubmitting(true)
                          try {
                            const res = await fetch('/api/gehaltsrechner', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                salutation: formData.salutation,
                                firstName: formData.firstName,
                                lastName: formData.lastName,
                                email: formData.email,
                                role,
                                hours,
                                experience: exp,
                                nightShifts: nights,
                                weekendShifts: weekends,
                                holidayShifts: holidays,
                                samaBase: calc.samaBase,
                                nightBonus: calc.nightBonus,
                                weekendBonus: calc.weekendBonus,
                                holidayBonusMonthly: calc.holidayBonusMonthly,
                                totalSalary: calc.sama,
                                tarifSalary: calc.tarif,
                                diff: calc.diff,
                                diffPct: calc.diffPct,
                                yearly: calc.yearly,
                                hourlyRate: calc.hourlyRate,
                              }),
                            })
                            if (res.ok) setSubmitted(true)
                          } finally {
                            setSubmitting(false)
                          }
                        })}
                        className="rounded-[14px] bg-white p-6 shadow-elevated"
                      >
                        <div className="mb-1 flex items-center gap-2 text-[13px] font-medium text-ink-muted">
                          <Lock className="h-3 w-3" />
                          Exklusiv
                        </div>
                        <div className="mb-4 font-serif text-[20px] leading-snug">
                          Detaillierte Aufschluesselung kostenlos per E-Mail erhalten
                        </div>
                        <div className="grid gap-3">
                          <select {...register('salutation')} className={inputClass}>
                            <option value="">Anrede</option>
                            <option value="Herr">Herr</option>
                            <option value="Frau">Frau</option>
                            <option value="Divers">Divers</option>
                          </select>
                          {errors.salutation && <p className="text-[12px] text-red-500">{errors.salutation.message}</p>}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <input {...register('firstName')} placeholder="Vorname" className={inputClass} />
                              {errors.firstName && <p className="mt-1 text-[12px] text-red-500">{errors.firstName.message}</p>}
                            </div>
                            <div>
                              <input {...register('lastName')} placeholder="Nachname" className={inputClass} />
                              {errors.lastName && <p className="mt-1 text-[12px] text-red-500">{errors.lastName.message}</p>}
                            </div>
                          </div>
                          <div>
                            <input type="email" {...register('email')} placeholder="E-Mail" className={inputClass} />
                            {errors.email && <p className="mt-1 text-[12px] text-red-500">{errors.email.message}</p>}
                          </div>
                          <label className="flex items-start gap-2 text-[12px] leading-relaxed text-ink-soft">
                            <input type="checkbox" {...register('privacy')} className="mt-0.5 accent-accent" />
                            <span>
                              Ich habe die{' '}
                              <Link href="/datenschutz" target="_blank" className="underline hover:text-sky">
                                Datenschutzerklaerung
                              </Link>{' '}
                              gelesen.
                            </span>
                          </label>
                          {errors.privacy && <p className="text-[12px] text-red-500">{errors.privacy.message}</p>}
                          <button
                            type="submit"
                            disabled={submitting}
                            className="btn btn-accent w-full justify-center !py-3.5 text-[14px] disabled:opacity-60"
                          >
                            {submitting ? 'Wird gesendet...' : 'Aufschluesselung anfordern'}
                            {!submitting && <ArrowUpRight className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Comparison */}
            <div className="mt-6 rounded-[20px] border border-line bg-paper p-5 sm:p-8">
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
