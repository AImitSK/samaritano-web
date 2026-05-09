import Link from 'next/link'
import { getAllPosts } from '@/sanity/queries'
import { urlFor } from '@/sanity/client'
import type { Post } from '@/types'
import { MagazineSlider } from './MagazineSlider'

interface Article {
  slug: string
  cat: string
  title: string
  date: string
  read: string
  img: string
}

const FALLBACK_ARTICLES: Article[] = [
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

function estimateReadTime(content?: unknown[]): string {
  if (!content?.length) return '3 Min.'
  const words = (content as { children?: { text?: string }[] }[])
    .flatMap((b) => b.children?.map((c) => c.text || '') || [])
    .join(' ')
    .split(/\s+/).length
  return `${Math.max(1, Math.ceil(words / 200))} Min.`
}

function formatDate(iso?: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function postToArticle(p: Post): Article {
  return {
    slug: p.slug.current,
    cat: p.categories?.[0]?.title || 'Magazin',
    title: p.title,
    date: formatDate(p.publishedAt),
    read: estimateReadTime(p.content),
    img: p.mainImage ? urlFor(p.mainImage)?.width(800).height(1000).url() ?? '' : '',
  }
}

export async function Magazine() {
  const posts = await getAllPosts()
  const fromSanity = posts.length > 0
  const articles = fromSanity ? posts.slice(0, 3).map(postToArticle) : FALLBACK_ARTICLES

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
        <MagazineSlider articles={articles} />
      </div>
    </section>
  )
}
