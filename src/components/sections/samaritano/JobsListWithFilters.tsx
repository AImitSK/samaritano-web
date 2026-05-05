'use client'

import { useMemo, useState } from 'react'
import { Search, Sparkles } from 'lucide-react'
import { SAMPLE_JOBS } from '@/data/jobs'
import { JobRow } from './JobRow'

const ROLES = [
  'Alle Berufe',
  'Pflegefachkraft',
  'Fachkrankenpfleger',
  'ATA',
  'OTA',
  'Altenpfleger',
  'Kinderkrankenpfleger',
] as const
const REGIONS = ['Alle Regionen', 'NRW', 'Niedersachsen', 'Bayern', 'Hessen'] as const
const WORKLOAD = ['Alle', 'Vollzeit', 'Teilzeit', 'Minijob'] as const

type Filters = { q: string; role: string; region: string; workload: string }

export function JobsListWithFilters() {
  const [filters, setFilters] = useState<Filters>({
    q: '',
    role: 'Alle Berufe',
    region: 'Alle Regionen',
    workload: 'Alle',
  })

  const filtered = useMemo(() => {
    const q = filters.q.toLowerCase()
    return SAMPLE_JOBS.filter((j) => {
      if (
        q &&
        !(
          j.title.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.role.toLowerCase().includes(q)
        )
      )
        return false
      if (
        filters.role !== 'Alle Berufe' &&
        !j.role.includes(filters.role) &&
        !filters.role.includes(j.role)
      )
        return false
      if (filters.region !== 'Alle Regionen' && j.region !== filters.region) return false
      if (filters.workload !== 'Alle' && !j.workload.includes(filters.workload)) return false
      return true
    })
  }, [filters])

  return (
    <>
      <div className="sticky top-[72px] z-30 border-y border-line bg-paper/85 py-5 backdrop-blur-md">
        <div className="wrap flex flex-wrap items-center gap-3">
          <div className="flex min-w-[240px] flex-1 items-center gap-2.5 rounded-full border border-line bg-paper-2 px-4 py-2.5">
            <Search className="h-4 w-4 text-ink-muted" />
            <input
              type="search"
              placeholder="Suche nach Beruf, Stadt oder Klinik..."
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
              className="flex-1 border-0 bg-transparent text-[14px] outline-none"
            />
          </div>
          <SelectFilter
            value={filters.role}
            onChange={(v) => setFilters({ ...filters, role: v })}
            options={ROLES}
          />
          <SelectFilter
            value={filters.region}
            onChange={(v) => setFilters({ ...filters, region: v })}
            options={REGIONS}
          />
          <SelectFilter
            value={filters.workload}
            onChange={(v) => setFilters({ ...filters, workload: v })}
            options={WORKLOAD}
          />
          <div className="ml-auto flex items-center gap-3.5 text-[14px] text-ink-muted">
            <span>
              <strong className="text-ink">{filtered.length}</strong> Treffer
            </span>
            <button
              type="button"
              className="btn !rounded-full !bg-ink !px-4 !py-2.5 !text-[13px] !text-paper hover:!bg-ink-soft"
            >
              <Sparkles className="h-3 w-3" />
              KI-Match starten
            </button>
          </div>
        </div>
      </div>

      <section className="pb-32 pt-10">
        <div className="wrap">
          <div className="border-t border-line">
            {filtered.map((j) => (
              <JobRow key={j.id} job={j} />
            ))}
            {filtered.length === 0 && (
              <div className="py-20 text-center">
                <h3 className="h3">Keine Treffer.</h3>
                <p className="mt-2 text-ink-soft">
                  Ändere die Filter oder starte das KI-Matching.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

function SelectFilter({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: readonly string[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="cursor-pointer rounded-full border border-line bg-paper-2 py-2.5 pl-4 pr-9 text-[14px] outline-none"
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  )
}
