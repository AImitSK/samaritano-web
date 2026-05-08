import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { ArrowLeft, Calendar, Clock, Tag, User } from 'lucide-react'
import { getAllPosts, getPostBySlug } from '@/sanity/queries'
import { urlFor } from '@/sanity/client'
import { PortableTextRenderer } from '@/components/ui/PortableTextRenderer'
import { JsonLd } from '@/components/ui/JsonLd'
import { generateArticle, generateBreadcrumbs } from '@/lib/jsonld'
import { NewsletterCTA } from '@/components/sections/samaritano/NewsletterCTA'

interface PageProps {
  params: { slug: string }
}

function formatDate(iso?: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function estimateReadTime(content?: unknown[]): number {
  if (!content?.length) return 1
  const words = (content as { children?: { text?: string }[] }[])
    .flatMap((b) => b.children?.map((c) => c.text || '') || [])
    .join(' ')
    .split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((p) => ({ slug: p.slug.current }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function MagazinPostPage({ params }: PageProps) {
  const { isEnabled: preview } = draftMode()
  const post = await getPostBySlug(params.slug, preview)
  if (!post) notFound()

  const heroImg = post.mainImage
    ? urlFor(post.mainImage)?.width(1600).height(900).url() ?? null
    : null
  const authorImg = post.author?.image
    ? urlFor(post.author.image)?.width(80).height(80).url() ?? null
    : null
  const readingTime = estimateReadTime(post.content)

  return (
    <>
      <JsonLd data={generateArticle(post)} />
      <JsonLd
        data={generateBreadcrumbs([
          { name: 'Start', url: '/' },
          { name: 'Magazin', url: '/magazin' },
          { name: post.title, url: `/magazin/${post.slug.current}` },
        ])}
      />

      {/* Hero image */}
      {heroImg && (
        <div className="relative h-[300px] w-full overflow-hidden bg-paper-2 md:h-[420px] lg:h-[520px]">
          <Image
            src={heroImg}
            alt={post.mainImage?.alt || post.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}

      {/* Article header */}
      <article className="pb-32 pt-16 lg:pt-20">
        <div className="wrap">
          <div className="mx-auto max-w-[760px]">
            <Link
              href="/magazin"
              className="mb-8 inline-flex items-center gap-2 text-[14px] text-ink-muted transition-colors hover:text-sky"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Zurück zum Magazin
            </Link>

            {post.categories && post.categories.length > 0 && (
              <div className="mb-5 flex flex-wrap gap-2">
                {post.categories.map((cat) => (
                  <span
                    key={cat._id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-sky-soft px-3 py-1 text-[12px] font-medium text-ink"
                  >
                    <Tag className="h-3 w-3" />
                    {cat.title}
                  </span>
                ))}
              </div>
            )}

            <h1 className="h1 m-0 mb-6 leading-[1.05]">{post.title}</h1>

            {post.excerpt && (
              <p className="lede mb-10 max-w-none">{post.excerpt}</p>
            )}

            {/* Meta */}
            <div className="mb-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-line py-5 text-[14px] text-ink-muted">
              {post.author?.name && (
                <span className="inline-flex items-center gap-2">
                  {authorImg ? (
                    <Image
                      src={authorImg}
                      alt={post.author.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  {post.author.name}
                </span>
              )}
              {post.publishedAt && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(post.publishedAt)}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {readingTime} Min. Lesezeit
              </span>
            </div>

            {/* Content */}
            {post.content && <PortableTextRenderer content={post.content} />}

            <div className="mt-16 border-t border-line pt-8">
              <Link
                href="/magazin"
                className="inline-flex items-center gap-2 font-medium text-sky transition-colors hover:text-ink"
              >
                <ArrowLeft className="h-4 w-4" />
                Alle Artikel
              </Link>
            </div>
          </div>
        </div>
      </article>

      <NewsletterCTA variant="compact" source="magazin" />
    </>
  )
}
