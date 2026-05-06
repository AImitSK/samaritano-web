import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

// On-Demand Revalidation via Sanity Webhook
// Kein festes Zeitintervall — Seiten werden sofort aktualisiert wenn sich Daten ändern
import Link from 'next/link'
import { ArrowRight, Calendar, User } from 'lucide-react'
import {
  getPageBySlug,
  getAllPosts,
  getAllActiveJobs,
  getAllNews,
  getAllDownloads,
  getAllTeamMembers,
  getAllMilestones,
  getLegalPageByType,
  getAllPages,
  getBlogSettings,
} from '@/sanity/queries'
import { urlFor } from '@/sanity/client'
import Image from 'next/image'
import type { BlogSettings, Post } from '@/types'
import {
  TeamSection,
  NewsSection,
  JobsSection,
  DownloadsSection,
  TimelineSection,
  CTASection,
  ContactForm,
} from '@/components/sections'
import { PortableTextRenderer } from '@/components/ui/PortableTextRenderer'
import type { Page } from '@/types'

interface PageProps {
  params: Promise<{ slug: string[] }>
}

async function getPage(slug: string[]): Promise<Page | null> {
  const pageSlug = slug[slug.length - 1]
  return getPageBySlug(pageSlug)
}

// ─── Metadata ───

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) return {}

  const seo = page.seo
  const title = seo?.metaTitle || page.title
  const description = seo?.metaDescription

  // Bild-Fallback: OG → Meta → Twitter (jeweils spezifisch > allgemein)
  const ogImageUrl = seo?.ogImage ? urlFor(seo.ogImage)?.url() : seo?.metaImage ? urlFor(seo.metaImage)?.url() : undefined
  const twitterImageUrl = seo?.twitterImage ? urlFor(seo.twitterImage)?.url() : ogImageUrl

  return {
    title,
    description,
    keywords: seo?.keywords,
    openGraph: {
      title: seo?.ogTitle || seo?.metaTitle || page.title,
      description: seo?.ogDescription || seo?.metaDescription || undefined,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
    twitter: {
      title: seo?.twitterTitle || seo?.ogTitle || seo?.metaTitle || page.title,
      description: seo?.twitterDescription || seo?.ogDescription || seo?.metaDescription || undefined,
      images: twitterImageUrl ? [twitterImageUrl] : [],
    },
    robots: {
      index: !seo?.noIndex,
      follow: !seo?.noFollow,
    },
    alternates: {
      canonical: seo?.canonicalUrl || undefined,
    },
  }
}

// ─── Static Params ───

export async function generateStaticParams() {
  const pages = await getAllPages()
  return pages
    .filter((p) => p.pageType !== 'home')
    .map((p) => ({
      slug: [p.slug.current],
    }))
}

// ─── Page Component ───

export default async function CatchAllPage({ params }: PageProps) {
  const { slug } = await params
  const { isEnabled: preview } = draftMode()
  const page = await getPage(slug)

  if (!page) {
    notFound()
  }

  return <PageRenderer page={page} preview={preview} />
}

// ─── Renderer ───

async function PageRenderer({ page, preview }: { page: Page; preview: boolean }) {
  switch (page.pageType) {
    case 'standard':
      return <StandardPage page={page} />

    case 'blog':
      return <BlogListing preview={preview} />

    case 'karriere':
      return <KarriereListing preview={preview} />

    case 'aktuelles':
      return <AktuellesListing preview={preview} />

    case 'downloads':
      return <DownloadsListing preview={preview} />

    case 'kontakt':
      return <ContactForm />

    case 'team':
      return <TeamPage preview={preview} />

    case 'timeline':
      return <TimelinePage preview={preview} />

    case 'impressum':
      return <LegalContent type="impressum" preview={preview} />

    case 'datenschutz':
      return <LegalContent type="datenschutz" preview={preview} />

    default:
      notFound()
  }
}

// ─── Standard Page ───

function StandardPage({ page }: { page: Page }) {
  return (
    <div className="py-16 lg:py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="mb-8 font-display text-4xl font-bold">{page.title}</h1>
        <p className="text-muted-foreground">
          Diese Seite wird vom Entwickler individuell gestaltet.
        </p>
      </div>
    </div>
  )
}

// ─── Blog Helpers ───

function formatDate(dateString: string, format: string = 'long'): string {
  const date = new Date(dateString)
  if (format === 'short') {
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }
  if (format === 'relative') {
    const diff = Date.now() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Heute'
    if (days === 1) return 'Gestern'
    if (days < 7) return `vor ${days} Tagen`
    if (days < 30) return `vor ${Math.floor(days / 7)} Wochen`
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
  }
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
}

function estimateReadingTime(content?: unknown[]): number {
  if (!content) return 1
  const text = content
    .filter((b: any) => b._type === 'block')
    .map((b: any) => b.children?.map((c: any) => c.text).join(' ') || '')
    .join(' ')
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 200))
}

function truncateExcerpt(text: string, maxChars: number): string {
  if (!maxChars || text.length <= maxChars) return text
  return text.slice(0, maxChars).replace(/\s+\S*$/, '') + '…'
}

function getPostImageUrl(post: Post): string | null {
  if (!post.mainImage) return null
  return urlFor(post.mainImage)?.width(800).height(450).url() ?? null
}

// ─── Blog Listing ───

async function BlogListing({ preview }: { preview: boolean }) {
  const [posts, settings] = await Promise.all([
    getAllPosts(preview),
    getBlogSettings(preview),
  ])

  const s: BlogSettings = {
    gridColumns: 1,
    showImage: true,
    imageRatio: '16/9',
    showExcerpt: true,
    excerptMaxChars: 150,
    showDate: true,
    dateFormat: 'long',
    showCategory: true,
    showReadingTime: false,
    showAuthor: true,
    showAuthorImage: false,
    ...settings,
  }

  const gridClass =
    s.gridColumns === 3
      ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'
      : s.gridColumns === 2
        ? 'grid gap-6 md:grid-cols-2'
        : 'mx-auto max-w-4xl space-y-6'

  const aspectClass =
    s.imageRatio === '4/3'
      ? 'aspect-[4/3]'
      : s.imageRatio === '1/1'
        ? 'aspect-square'
        : s.imageRatio === 'auto'
          ? ''
          : 'aspect-video'

  return (
    <>
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 font-display text-4xl font-bold md:text-5xl">Blog</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Einblicke, Tipps und Neuigkeiten aus unserer Branche.
          </p>
        </div>
      </section>

      <section className="pb-16 lg:pb-24">
        <div className="container mx-auto px-4">
          <div className={gridClass}>
            {posts.length === 0 && (
              <p className="text-center text-muted-foreground">
                Noch keine Blogartikel vorhanden.
              </p>
            )}
            {posts.map((post) => {
              const imageUrl = getPostImageUrl(post)
              const readingTime = estimateReadingTime(post.content)

              return (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug.current}`}
                  className="group block overflow-hidden rounded-xl border border-border/50 bg-surface-raised shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-elevated"
                >
                  {/* Bild */}
                  {s.showImage && (
                    <div className={`relative w-full overflow-hidden bg-muted ${aspectClass}`}>
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={post.mainImage?.alt || post.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full min-h-[200px] items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                          <span className="text-4xl text-muted-foreground/30">📝</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-6 sm:p-8">
                    {/* Meta-Daten */}
                    <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      {s.showCategory && post.categories?.[0] && (
                        <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                          {post.categories[0].title}
                        </span>
                      )}
                      {s.showDate && post.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(post.publishedAt, s.dateFormat)}
                        </span>
                      )}
                      {s.showReadingTime && (
                        <span className="flex items-center gap-1">
                          ⏱ {readingTime} Min.
                        </span>
                      )}
                    </div>

                    {/* Titel */}
                    <h2 className="mb-2 font-display text-xl font-semibold transition-colors group-hover:text-accent sm:text-2xl">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    {s.showExcerpt && post.excerpt && (
                      <p className="mb-4 text-muted-foreground">
                        {truncateExcerpt(post.excerpt, s.excerptMaxChars || 0)}
                      </p>
                    )}

                    {/* Autor */}
                    {s.showAuthor && post.author?.name && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {s.showAuthorImage && post.author.image ? (
                          <Image
                            src={urlFor(post.author.image)?.width(32).height(32).url() || ''}
                            alt={post.author.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                        <span>{post.author.name}</span>
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <CTASection
        title="Themenvorschlag?"
        description="Schreiben Sie uns, worüber wir als nächstes berichten sollen."
        primaryButton={{ label: 'Kontakt aufnehmen', href: '/kontakt' }}
        variant="dark"
      />
    </>
  )
}

// ─── Karriere Listing ───

async function KarriereListing({ preview }: { preview: boolean }) {
  const jobs = await getAllActiveJobs(preview)

  return (
    <>
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 font-display text-4xl font-bold md:text-5xl">Karriere</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Werden Sie Teil unseres Teams. Wir bieten spannende Aufgaben und ein motiviertes
            Arbeitsumfeld.
          </p>
        </div>
      </section>

      <JobsSection
        jobs={jobs}
        title="Offene Stellen"
        subtitle="Finden Sie Ihre nächste Herausforderung"
        showAll={false}
      />

      <CTASection
        title="Keine passende Stelle gefunden?"
        description="Initiativbewerbungen sind jederzeit willkommen."
        primaryButton={{ label: 'Initiativbewerbung senden', href: '/kontakt' }}
        variant="primary"
      />
    </>
  )
}

// ─── Aktuelles Listing ───

async function AktuellesListing({ preview }: { preview: boolean }) {
  const news = await getAllNews(preview)

  return (
    <>
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 font-display text-4xl font-bold md:text-5xl">Aktuelles</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Neuigkeiten, Events und Pressemitteilungen aus unserem Unternehmen.
          </p>
        </div>
      </section>

      <NewsSection
        items={news}
        title="News & Events"
        subtitle="Was bei uns passiert"
        showAll={false}
      />

      <CTASection
        title="Bleiben Sie informiert"
        description="Kontaktieren Sie uns für weitere Informationen."
        primaryButton={{ label: 'Kontakt aufnehmen', href: '/kontakt' }}
        variant="dark"
      />
    </>
  )
}

// ─── Downloads Listing ───

async function DownloadsListing({ preview }: { preview: boolean }) {
  const downloads = await getAllDownloads(preview)

  return (
    <>
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 font-display text-4xl font-bold md:text-5xl">Downloads</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Kataloge, Datenblätter, Zertifikate und weitere Dokumente zum Herunterladen.
          </p>
        </div>
      </section>

      <DownloadsSection downloads={downloads} title="Dokumente" subtitle="Alle Downloads auf einen Blick" />
    </>
  )
}

// ─── Team Page ───

async function TeamPage({ preview }: { preview: boolean }) {
  const [team, milestones] = await Promise.all([
    getAllTeamMembers(preview),
    getAllMilestones(preview),
  ])

  return (
    <>
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 font-display text-4xl font-bold md:text-5xl">Über uns</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Lernen Sie unser Unternehmen und die Menschen dahinter kennen. Wir stehen für
            Qualität, Innovation und partnerschaftliche Zusammenarbeit.
          </p>
        </div>
      </section>

      <TeamSection members={team} title="Unser Team" subtitle="Die Menschen hinter unserem Erfolg" />

      <TimelineSection
        milestones={milestones}
        title="Unsere Geschichte"
        subtitle="Meilensteine unserer Entwicklung"
      />

      <CTASection
        title="Neugierig geworden?"
        description="Wir freuen uns, Sie persönlich kennenzulernen."
        primaryButton={{ label: 'Kontakt aufnehmen', href: '/kontakt' }}
        variant="primary"
      />
    </>
  )
}

// ─── Timeline Page ───

async function TimelinePage({ preview }: { preview: boolean }) {
  const milestones = await getAllMilestones(preview)

  return (
    <>
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 font-display text-4xl font-bold md:text-5xl">Unsere Geschichte</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Meilensteine unserer Unternehmensentwicklung.
          </p>
        </div>
      </section>

      <TimelineSection
        milestones={milestones}
        title="Meilensteine"
        subtitle="Von den Anfängen bis heute"
      />
    </>
  )
}

// ─── Legal Content ───

async function LegalContent({ type, preview }: { type: string; preview: boolean }) {
  const legalPage = await getLegalPageByType(type, preview)

  return (
    <div className="py-16 lg:py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="mb-8 font-display text-4xl font-bold">
          {legalPage?.title || (type === 'impressum' ? 'Impressum' : 'Datenschutzerklärung')}
        </h1>

        {legalPage?.content ? (
          <PortableTextRenderer content={legalPage.content} />
        ) : (
          <p className="text-muted-foreground">
            Inhalt wird aus Sanity geladen. Bitte erstellen Sie ein Dokument vom Typ
            &quot;Legal&quot; mit dem Typ &quot;{type}&quot; im Studio.
          </p>
        )}
      </div>
    </div>
  )
}
