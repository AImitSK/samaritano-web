import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import Image from 'next/image'

// On-Demand Revalidation via Sanity Webhook
import { JsonLd } from '@/components/ui/JsonLd'
import { generateArticle, generateBreadcrumbs } from '@/lib/jsonld'
import { CTASection } from '@/components/sections'
import { PortableTextRenderer } from '@/components/ui/PortableTextRenderer'
import { getPostBySlug, getAllPosts, getBlogSettings } from '@/sanity/queries'
import { urlFor } from '@/sanity/client'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Calendar, User, Tag, Share2 } from 'lucide-react'
import type { BlogSettings } from '@/types'

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function estimateReadingTime(content?: unknown[]): number {
  if (!content) return 1
  const text = content
    .filter((b: any) => b._type === 'block')
    .map((b: any) => b.children?.map((c: any) => c.text).join(' ') || '')
    .join(' ')
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 200))
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug.current }))
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const { isEnabled: preview } = draftMode()
  const [post, settings, allPosts] = await Promise.all([
    getPostBySlug(params.slug, preview),
    getBlogSettings(preview),
    getAllPosts(preview),
  ])

  if (!post) {
    notFound()
  }

  const s: BlogSettings = {
    showHeroImage: true,
    showSharingButtons: false,
    sharingPlatforms: [],
    showRelatedPosts: false,
    relatedPostsCount: 3,
    showPostNavigation: false,
    showAuthor: true,
    showAuthorImage: false,
    showAuthorPosition: false,
    showReadingTime: false,
    showCategory: true,
    showDate: true,
    ...settings,
  }

  // Prev/Next Navigation
  const currentIndex = allPosts.findIndex((p) => p._id === post._id)
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null

  // Ähnliche Artikel (gleiche Kategorie, nicht der aktuelle)
  const relatedPosts = s.showRelatedPosts
    ? allPosts
        .filter(
          (p) =>
            p._id !== post._id &&
            p.categories?.some((c) =>
              post.categories?.some((pc) => pc._id === c._id)
            )
        )
        .slice(0, s.relatedPostsCount || 3)
    : []

  const heroImageUrl = post.mainImage
    ? urlFor(post.mainImage)?.width(1200).height(630).url()
    : null
  const readingTime = estimateReadingTime(post.content)
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <>
      <JsonLd data={generateArticle(post)} />
      <JsonLd
        data={generateBreadcrumbs([
          { name: 'Start', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: post.title, url: `/blog/${post.slug.current}` },
        ])}
      />

      {/* Hero Image */}
      {s.showHeroImage && heroImageUrl && (
        <div className="relative h-[300px] w-full overflow-hidden bg-muted md:h-[400px] lg:h-[500px]">
          <Image
            src={heroImageUrl}
            alt={post.mainImage?.alt || post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Article Header */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto max-w-3xl px-4">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück zum Blog
          </Link>

          {/* Categories */}
          {s.showCategory && post.categories && post.categories.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.categories.map((cat) => (
                <span
                  key={cat._id}
                  className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                >
                  <Tag className="h-3 w-3" />
                  {cat.title}
                </span>
              ))}
            </div>
          )}

          <h1 className="mb-6 font-display text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mb-8 text-xl leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 border-b border-border pb-8 text-sm text-muted-foreground">
            {s.showAuthor && post.author?.name && (
              <div className="flex items-center gap-2">
                {s.showAuthorImage && post.author.image ? (
                  <Image
                    src={urlFor(post.author.image)?.width(40).height(40).url() || ''}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <User className="h-4 w-4" />
                )}
                <span>{post.author.name}</span>
              </div>
            )}
            {s.showDate && post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(post.publishedAt)}
              </span>
            )}
            {s.showReadingTime && (
              <span>⏱ {readingTime} Min. Lesezeit</span>
            )}
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-16 lg:pb-24">
        <div className="container mx-auto max-w-3xl px-4">
          {post.content && <PortableTextRenderer content={post.content} />}

          {/* Sharing Buttons */}
          {s.showSharingButtons && s.sharingPlatforms && s.sharingPlatforms.length > 0 && (
            <div className="mt-12 border-t border-border pt-8">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Share2 className="h-4 w-4" /> Teilen:
                </span>
                <div className="flex gap-2">
                  {s.sharingPlatforms.includes('facebook') && (
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-accent">Facebook</a>
                  )}
                  {s.sharingPlatforms.includes('twitter') && (
                    <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-accent">X</a>
                  )}
                  {s.sharingPlatforms.includes('linkedin') && (
                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-accent">LinkedIn</a>
                  )}
                  {s.sharingPlatforms.includes('whatsapp') && (
                    <a href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + shareUrl)}`} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-accent">WhatsApp</a>
                  )}
                  {s.sharingPlatforms.includes('email') && (
                    <a href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(shareUrl)}`} className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-accent">E-Mail</a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Post Navigation (Prev/Next) */}
          {s.showPostNavigation && (prevPost || nextPost) && (
            <div className="mt-12 grid gap-4 border-t border-border pt-8 md:grid-cols-2">
              {prevPost ? (
                <Link
                  href={`/blog/${prevPost.slug.current}`}
                  className="group rounded-lg border border-border p-4 transition-colors hover:border-accent/30"
                >
                  <span className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <ArrowLeft className="h-3 w-3" /> Vorheriger Artikel
                  </span>
                  <span className="font-medium transition-colors group-hover:text-accent">
                    {prevPost.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {nextPost && (
                <Link
                  href={`/blog/${nextPost.slug.current}`}
                  className="group rounded-lg border border-border p-4 text-right transition-colors hover:border-accent/30"
                >
                  <span className="mb-1 flex items-center justify-end gap-1 text-xs text-muted-foreground">
                    Nächster Artikel <ArrowRight className="h-3 w-3" />
                  </span>
                  <span className="font-medium transition-colors group-hover:text-accent">
                    {nextPost.title}
                  </span>
                </Link>
              )}
            </div>
          )}

          {/* Back Link (wenn keine Post-Navigation) */}
          {!s.showPostNavigation && (
            <div className="mt-12 border-t border-border pt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 font-medium text-accent hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Alle Artikel anzeigen
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Ähnliche Artikel */}
      {s.showRelatedPosts && relatedPosts.length > 0 && (
        <section className="border-t border-border bg-surface-raised py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center font-display text-2xl font-bold">
              Ähnliche Artikel
            </h2>
            <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related) => {
                const relatedImageUrl = related.mainImage
                  ? urlFor(related.mainImage)?.width(400).height(225).url()
                  : null
                return (
                  <Link
                    key={related._id}
                    href={`/blog/${related.slug.current}`}
                    className="group overflow-hidden rounded-xl border border-border/50 bg-background shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elevated"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-muted">
                      {relatedImageUrl ? (
                        <Image
                          src={relatedImageUrl}
                          alt={related.mainImage?.alt || related.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-3xl text-muted-foreground/30">📝</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-display font-semibold transition-colors group-hover:text-accent">
                        {related.title}
                      </h3>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <CTASection
        title="Hat Ihnen dieser Artikel gefallen?"
        description="Kontaktieren Sie uns für weitere Informationen zu diesem Thema."
        primaryButton={{ label: 'Kontakt aufnehmen', href: '/kontakt' }}
        variant="dark"
      />
    </>
  )
}
