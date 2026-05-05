import Link from 'next/link'

/* eslint-disable @next/next/no-img-element */

interface Article {
  slug: string
  cat: string
  title: string
  date: string
  read: string
  img: string
}

const ARTICLES: Article[] = [
  {
    slug: 'fachkraeftemangel-anaesthesiepflege',
    cat: 'Aktuelle Themen',
    title: 'Fachkräftemangel in der Anästhesiepflege: Warum du gerade die besten Karten hast',
    date: '17. März 2026',
    read: '6 Min.',
    img: '/uploads/_DSC9413-Bearbeitet.jpg',
  },
  {
    slug: 'beruf-liebt-bedingungen',
    cat: 'Berufsalltag',
    title: 'Du liebst deinen Beruf. Die Bedingungen lieben dich gerade nicht zurück.',
    date: '17. März 2026',
    read: '4 Min.',
    img: '/uploads/_DSC9396.jpg',
  },
  {
    slug: 'samaritano-vs-andere',
    cat: 'Über uns',
    title: 'Samaritano vs. andere: Warum unser Ansatz für Zeitarbeit anders ist',
    date: '5. Juni 2025',
    read: '5 Min.',
    img: '/uploads/_DSC9380.jpg',
  },
]

export function Magazine() {
  return (
    <section className="section-pad" data-screen-label="Magazin">
      <div className="wrap">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-10 lg:mb-20">
          <div>
            <div className="eyebrow">Magazin</div>
            <h2 className="h1 mt-5">
              Aus der <em>Pflege­welt</em>.
            </h2>
          </div>
          <Link href="/magazin" className="link">
            Alle Artikel
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((a) => (
            <Link
              href={`/magazin/${a.slug}`}
              key={a.slug}
              className="group block text-inherit"
            >
              <div
                className="mb-5 overflow-hidden rounded-[14px] bg-paper-2"
                style={{ aspectRatio: '4 / 5' }}
              >
                <img
                  src={a.img}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <div className="mb-3.5 flex flex-wrap gap-3.5 text-[13px] text-ink-muted">
                <span className="font-medium text-sky">{a.cat}</span>
                <span aria-hidden>·</span>
                <span>{a.date}</span>
                <span aria-hidden>·</span>
                <span>{a.read} Lesezeit</span>
              </div>
              <h3 className="h3 m-0 text-pretty">{a.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
