import Link from 'next/link'

const STATS = [
  { n: '312', l: 'Zufriedene Samaritanos' },
  { n: '89', l: 'Partner-Einrichtungen' },
  { n: '6 Tage', l: 'Ø Vermittlungsdauer' },
  { n: '+30 %', l: 'über Tarif' },
]

export function Manifest() {
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
              {STATS.map((s) => (
                <div key={s.l} className="border-t border-line pt-5">
                  <div className="font-serif text-[56px] font-light leading-none tracking-tight text-sky">
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
