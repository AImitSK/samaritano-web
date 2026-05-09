import Link from 'next/link'

interface ManifestProps {
  totalJobs?: number
  totalDepartments?: number
}

export function Manifest({ totalJobs = 0, totalDepartments = 0 }: ManifestProps) {
  const stats = [
    { n: totalJobs > 0 ? `${totalJobs}` : '–', l: 'Offene Stellen' },
    { n: totalDepartments > 0 ? `${totalDepartments}` : '–', l: 'Berufsfelder' },
    { n: 'Über Tarif', l: 'Faire Gehälter' },
    { n: 'Persönlich', l: 'Ehemalige Pflegekräfte als Gründer' },
  ]

  return (
    <section className="section-pad bg-paper-2" data-screen-label="Manifest">
      <div className="wrap">
        <div className="grid items-start gap-20 lg:grid-cols-[1fr_1.4fr]">
          <div className="lg:sticky lg:top-32">
            <div className="eyebrow">Wofür wir stehen</div>
            <h2 className="h1 mt-5">
              Pflegeberufe
              <br />
              für Leute mit
              <br />
              <em>Herz und Hingabe</em>.
            </h2>
          </div>
          <div>
            <p className="lede mb-12">
              Pflege ist keine Ware. Sie ist eine Berufung. Bei Samaritano vermitteln wir nicht einfach
              Schichten, wir bringen Menschen dorthin, wo ihre Arbeit den größten Unterschied macht. Mit Sinn.
              Mit Flexibilität. Und mit fairer Bezahlung.
            </p>
            <div className="mb-12 grid gap-8 sm:grid-cols-2">
              {stats.map((s) => (
                <div key={s.l} className="border-t border-line pt-5">
                  <div className="font-serif font-light leading-none tracking-tight text-sky text-[40px] sm:text-[48px] lg:text-[56px]">
                    {s.n}
                  </div>
                  <div className="mt-2 text-[14px] text-ink-soft">{s.l}</div>
                </div>
              ))}
            </div>
            <Link href="/ueber-uns" className="link">
              Mehr über uns erfahren
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
