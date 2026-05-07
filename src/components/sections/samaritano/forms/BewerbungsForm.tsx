'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, ArrowLeft, Plus, Trash2, Upload, FileText, Check } from 'lucide-react'

// ─── Schema ───

const POSITIONS = [
  'Altenpfleger',
  'Anaesthesietechnischer Assistent',
  'Fachkrankenpfleger',
  'Gesundheits- und Kinderkrankenpfleger',
  'Gesundheits- und Krankenpfleger',
  'Hebamme / Entbindungspfleger',
  'Operationstechnischer Assistent',
  'Pflegefachfrau / Pflegefachmann',
  'Minijob',
  'Etwas anderes',
] as const

const CALL_TIMES = [
  'Morgens',
  'Frueher Nachmittag',
  'Spaeter Nachmittag',
  'Frueher Abend',
] as const

const formSchema = z.object({
  firstName: z.string().min(2, 'Mindestens 2 Zeichen'),
  lastName: z.string().min(2, 'Mindestens 2 Zeichen'),
  email: z.string().email('Ungueltige E-Mail'),
  phone: z.string().min(5, 'Mindestens 5 Zeichen'),
  zip: z.string().min(4, 'Mindestens 4 Zeichen'),
  city: z.string().min(2, 'Mindestens 2 Zeichen'),
  callTime: z.string().optional(),
  position: z.string().min(1, 'Bitte waehlen'),
  employers: z.array(z.object({
    employer: z.string(),
    period: z.string(),
    role: z.string(),
  })).optional(),
  aboutYou: z.string().optional(),
  privacy: z.literal(true, { errorMap: () => ({ message: 'Bitte zustimmen' }) }),
})

type FormData = z.infer<typeof formSchema>

// Per-step field validation
const STEP_FIELDS: (keyof FormData)[][] = [
  ['firstName', 'lastName', 'email', 'phone', 'zip', 'city', 'position'],
  [], // Step 2: no required fields
  ['privacy'],
]

interface BewerbungsFormProps {
  jobTitle: string
  jobId: string
  defaultPosition?: string
  contactEmail?: string
}

// ─── Shared Input Styles ───

const inputClass =
  'w-full rounded-[8px] border border-line bg-white px-4 py-3.5 text-[15px] outline-none transition-colors focus:border-sky'
const labelClass = 'eyebrow mb-2 block'
const errorClass = 'mt-1.5 text-[13px] text-red-500'

// ─── Component ───

export function BewerbungsForm({ jobTitle, jobId, defaultPosition, contactEmail }: BewerbungsFormProps) {
  const [step, setStep] = useState(0)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      position: defaultPosition || '',
      employers: [],
      privacy: undefined,
    },
  })

  const { fields: employerFields, append: addEmployer, remove: removeEmployer } = useFieldArray({
    control,
    name: 'employers',
  })

  async function goNext() {
    const fieldsToValidate = STEP_FIELDS[step]
    if (fieldsToValidate.length > 0) {
      const valid = await trigger(fieldsToValidate)
      if (!valid) return
    }
    setStep((s) => Math.min(s + 1, 2))
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0))
  }

  async function onSubmit(data: FormData) {
    setSubmitting(true)
    setSubmitError(null)

    try {
      const fd = new FormData()
      fd.append('firstName', data.firstName)
      fd.append('lastName', data.lastName)
      fd.append('email', data.email)
      fd.append('phone', data.phone)
      fd.append('zip', data.zip)
      fd.append('city', data.city)
      fd.append('position', data.position)
      fd.append('jobTitle', jobTitle)
      fd.append('jobSlug', jobId)
      if (data.callTime) fd.append('callTime', data.callTime)
      if (data.aboutYou) fd.append('aboutYou', data.aboutYou)
      if (contactEmail) fd.append('contactEmail', contactEmail)
      if (data.employers && data.employers.length > 0) {
        fd.append('employers', JSON.stringify(data.employers))
      }
      if (resumeFile) {
        fd.append('resume', resumeFile)
      }

      const res = await fetch('/api/bewerbung', { method: 'POST', body: fd })
      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Fehler beim Senden')
      }

      setSubmitted(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Unbekannter Fehler')
    } finally {
      setSubmitting(false)
    }
  }

  // ─── Success State ───

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-[16px] border border-line bg-white p-10 text-center sm:p-14"
      >
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-accent text-white">
          <Check className="h-7 w-7" strokeWidth={3} />
        </div>
        <h3 className="m-0 mb-3 font-serif text-[30px] font-normal">Bewerbung gesendet!</h3>
        <p className="m-0 mb-2 text-ink-soft">
          Wir haben deine Bewerbung als <strong>{getValues('position')}</strong> erhalten.
        </p>
        <p className="m-0 text-ink-soft">
          Alexander Esau meldet sich werktags innerhalb von 24 Stunden bei dir.
        </p>
        <Link href={`/jobs/${jobId}`} className="btn btn-primary mt-8 !px-6 !py-4">
          Zurueck zur Stelle
        </Link>
      </motion.div>
    )
  }

  // ─── Progress Bar ───

  const progress = ((step + 1) / 3) * 100

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-[16px] border border-line bg-white p-8 sm:p-10">
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-[13px]">
          <span className="font-medium text-ink">Schritt {step + 1} von 3</span>
          <span className="text-ink-muted">
            {step === 0 && 'Persoenliche Daten'}
            {step === 1 && 'Berufserfahrung'}
            {step === 2 && 'Zusammenfassung'}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-paper-2">
          <motion.div
            className="h-full rounded-full bg-accent"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* ─── Step 1: Persoenliche Daten ─── */}
          {step === 0 && (
            <div className="grid gap-[18px]">
              <div className="grid gap-[18px] sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className={labelClass}>Vorname *</label>
                  <input id="firstName" {...register('firstName')} placeholder="Max" className={inputClass} />
                  {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
                </div>
                <div>
                  <label htmlFor="lastName" className={labelClass}>Nachname *</label>
                  <input id="lastName" {...register('lastName')} placeholder="Mustermann" className={inputClass} />
                  {errors.lastName && <p className={errorClass}>{errors.lastName.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>E-Mail *</label>
                <input id="email" type="email" {...register('email')} placeholder="name@beispiel.de" className={inputClass} />
                {errors.email && <p className={errorClass}>{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="phone" className={labelClass}>Telefon *</label>
                <input id="phone" type="tel" {...register('phone')} placeholder="+49 170 1234567" className={inputClass} />
                {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
              </div>

              <div className="grid gap-[18px] sm:grid-cols-[120px_1fr]">
                <div>
                  <label htmlFor="zip" className={labelClass}>PLZ *</label>
                  <input id="zip" {...register('zip')} placeholder="33602" className={inputClass} />
                  {errors.zip && <p className={errorClass}>{errors.zip.message}</p>}
                </div>
                <div>
                  <label htmlFor="city" className={labelClass}>Stadt *</label>
                  <input id="city" {...register('city')} placeholder="Bielefeld" className={inputClass} />
                  {errors.city && <p className={errorClass}>{errors.city.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="callTime" className={labelClass}>Beste Anrufzeit</label>
                <select id="callTime" {...register('callTime')} className={inputClass}>
                  <option value="">Keine Praeferenz</option>
                  {CALL_TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="position" className={labelClass}>Position *</label>
                <select id="position" {...register('position')} className={inputClass}>
                  <option value="">Bitte waehlen</option>
                  {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                {errors.position && <p className={errorClass}>{errors.position.message}</p>}
              </div>
            </div>
          )}

          {/* ─── Step 2: Berufserfahrung ─── */}
          {step === 1 && (
            <div className="grid gap-[18px]">
              {/* Fruehere Arbeitgeber */}
              <div>
                <label className={labelClass}>Fruehere Arbeitgeber</label>
                {employerFields.map((field, index) => (
                  <div key={field.id} className="mb-3 grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
                    <input
                      {...register(`employers.${index}.employer`)}
                      placeholder="Arbeitgeber"
                      className={inputClass}
                    />
                    <input
                      {...register(`employers.${index}.period`)}
                      placeholder="z.B. 2020–2023"
                      className={inputClass}
                    />
                    <input
                      {...register(`employers.${index}.role`)}
                      placeholder="Position"
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={() => removeEmployer(index)}
                      className="grid h-[50px] w-[50px] flex-shrink-0 place-items-center rounded-[8px] border border-line text-ink-muted transition-colors hover:border-red-300 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addEmployer({ employer: '', period: '', role: '' })}
                  className="inline-flex items-center gap-2 rounded-[8px] border border-dashed border-line px-4 py-3 text-[14px] text-ink-muted transition-colors hover:border-sky hover:text-sky"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Arbeitgeber hinzufuegen
                </button>
              </div>

              {/* Ueber dich */}
              <div>
                <label htmlFor="aboutYou" className={labelClass}>Erzaehl uns von dir</label>
                <textarea
                  id="aboutYou"
                  {...register('aboutYou')}
                  rows={5}
                  placeholder="Was motiviert dich? Warum diese Stelle?"
                  className={`${inputClass} resize-y`}
                />
              </div>

              {/* Lebenslauf */}
              <div>
                <label className={labelClass}>Lebenslauf hochladen</label>
                <label
                  htmlFor="resume"
                  className="flex cursor-pointer flex-col items-center gap-3 rounded-[12px] border-2 border-dashed border-line p-8 text-center transition-colors hover:border-sky hover:bg-sky/5"
                >
                  {resumeFile ? (
                    <>
                      <FileText className="h-8 w-8 text-accent" />
                      <span className="font-medium text-ink">{resumeFile.name}</span>
                      <span className="text-[13px] text-ink-muted">
                        {(resumeFile.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-ink-muted" />
                      <span className="text-[15px] text-ink-muted">
                        PDF, DOC oder DOCX (max. 25 MB)
                      </span>
                    </>
                  )}
                </label>
                <input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>
          )}

          {/* ─── Step 3: Zusammenfassung ─── */}
          {step === 2 && (
            <div className="grid gap-6">
              <div className="rounded-[12px] bg-paper-2 p-6">
                <div className="eyebrow mb-4">Deine Angaben</div>
                <div className="grid gap-3 text-[15px]">
                  <Row label="Name" value={`${getValues('firstName')} ${getValues('lastName')}`} />
                  <Row label="E-Mail" value={getValues('email')} />
                  <Row label="Telefon" value={getValues('phone')} />
                  <Row label="Adresse" value={`${getValues('zip')} ${getValues('city')}`} />
                  {getValues('callTime') && <Row label="Anrufzeit" value={getValues('callTime')!} />}
                  <Row label="Position" value={getValues('position')} />
                  {resumeFile && <Row label="Lebenslauf" value={resumeFile.name} />}
                  {getValues('employers')?.length ? (
                    <div className="border-t border-line pt-3">
                      <span className="text-[13px] font-medium text-ink-muted">Arbeitgeber:</span>
                      {getValues('employers')!.map((e, i) => (
                        <div key={i} className="ml-4 mt-1 text-[14px] text-ink-soft">
                          {e.employer} ({e.period}) — {e.role}
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {getValues('aboutYou') && (
                    <div className="border-t border-line pt-3">
                      <span className="text-[13px] font-medium text-ink-muted">Ueber dich:</span>
                      <p className="m-0 mt-1 text-[14px] text-ink-soft">{getValues('aboutYou')}</p>
                    </div>
                  )}
                </div>
              </div>

              <label className="flex items-start gap-2.5 text-[13px] leading-relaxed text-ink-soft">
                <input type="checkbox" {...register('privacy')} className="mt-1 accent-accent" />
                <span>
                  Ich habe die{' '}
                  <Link href="/datenschutz" target="_blank" className="border-b border-line transition-colors hover:border-sky hover:text-sky">
                    Datenschutzerklaerung
                  </Link>{' '}
                  gelesen und stimme der Verarbeitung meiner Daten zu. *
                </span>
              </label>
              {errors.privacy && <p className={errorClass}>{errors.privacy.message}</p>}

              {submitError && (
                <div className="rounded-[8px] bg-red-50 px-4 py-3 text-[14px] text-red-600">
                  {submitError}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-4">
        {step > 0 ? (
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 text-[15px] font-medium text-ink-soft transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Zurueck
          </button>
        ) : (
          <div />
        )}

        {step < 2 ? (
          <button type="button" onClick={goNext} className="btn btn-primary !px-6 !py-4">
            Weiter
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-accent !px-8 !py-4 disabled:opacity-60"
          >
            {submitting ? 'Wird gesendet...' : 'Bewerbung absenden'}
            {!submitting && <ArrowUpRight className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>
    </form>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <span className="w-24 flex-shrink-0 text-[13px] font-medium text-ink-muted">{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  )
}
