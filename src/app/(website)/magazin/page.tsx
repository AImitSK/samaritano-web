import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/sanity/queries'
import { urlFor } from '@/sanity/client'

export const metadata: Metadata = {
  title: 'Magazin',
  description:
    'Aktuelles und Hintergründe aus der Pflegewelt — Berufsalltag, Branchen-Themen und Einblicke ins Samaritano-Netzwerk.',
}

/* eslint-disable @next/next/no-img-element */

function formatDate(iso?: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function estimateReadTime(content?: unknown[]): string {
  if (!content?.length) return '3 Min.'
  const words = (content as { children?: { text?: string }[] }[])
    .flatMap((b) => b.children?.map((c) => c.text || '') || [])
    .join(' ')
    .split(/\s+/).length
  return `${Math.max(1, Math.ceil(words / 200))} Min.`
}

export default async function MagazinPage() {
  const posts = await getAllPosts()

  return (
    <>
      {/* Hero */}
      <section className="pb-16 pt-16 lg:pt-20">
        <div className="wrap">
          <div className="grid items-end gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
            <div>
              <div className="eyebrow">Magazin</div>
              <h1 className="display mt-6">
                <span className="block whitespace-nowrap">Aus der</span>
                <span className="block whitespace-nowrap">
                  <em>Pflege­welt</em>.
                </span>
              </h1>
            </div>
            <p className="lede max-w-[420px]">
              Aktuelle Themen, Berufsalltag und Stimmen aus dem Samaritano-Netzwerk.
            </p>
          </div>
        </div>
      </section>

      {/* List */}
      <section className="pb-32 pt-8">
        <div className="wrap">
          {posts.length === 0 ? (
            <div className="rounded-[14px] border border-line bg-paper-2 p-12 text-center">
              <h2 className="h3 m-0">Noch keine Artikel.</h2>
              <p className="mt-3 text-ink-soft">
                Sobald im Sanity Studio Artikel angelegt werden, erscheinen sie hier.
              </p>
            </div>
          ) : (
            <div className="grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => {
                const img = p.mainImage
                  ? urlFor(p.mainImage)?.width(800).height(1000).url() ?? null
                  : null
                return (
                  <Link
                    href={`/magazin/${p.slug.current}`}
                    key={p._id}
                    className="group block text-inherit"
                  >
                    <div
                      className="mb-5 overflow-hidden rounded-[14px] bg-paper-2"
                      style={{ aspectRatio: '4 / 5' }}
                    >
                      {img ? (
                        <img
                          src={img}
                          alt={p.mainImage?.alt || ''}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-ink-muted">📝</div>
                      )}
                    </div>
                    <div className="mb-3.5 flex flex-wrap gap-3.5 text-[13px] text-ink-muted">
                      {p.categories?.[0] && (
                        <>
                          <span className="font-medium text-sky">{p.categories[0].title}</span>
                          <span aria-hidden>·</span>
                        </>
                      )}
                      <span>{formatDate(p.publishedAt)}</span>
                      <span aria-hidden>·</span>
                      <span>{estimateReadTime(p.content)} Lesezeit</span>
                    </div>
                    <h2 className="h3 m-0 text-pretty">{p.title}</h2>
                    {p.excerpt && (
                      <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                        {p.excerpt}
                      </p>
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
