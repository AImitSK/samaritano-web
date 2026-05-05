import type { Settings, Post, Job, News } from '@/types'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

// Organization Schema – auf jeder Seite
export function generateOrganization(settings: Settings | null) {
  if (!settings) return null

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.title,
    url: siteUrl,
  }

  if (settings.description) {
    schema.description = settings.description
  }

  if (settings.contactEmail) {
    schema.email = settings.contactEmail
  }

  if (settings.contactPhone) {
    schema.telephone = settings.contactPhone
  }

  if (settings.address) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
    }
  }

  if (settings.socialLinks?.length) {
    schema.sameAs = settings.socialLinks.map((link) => link.url)
  }

  return schema
}

// WebSite Schema – auf jeder Seite
export function generateWebSite(settings: Settings | null) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings?.title || process.env.NEXT_PUBLIC_SITE_NAME || 'Website',
    url: siteUrl,
  }
}

// BreadcrumbList – für Unterseiten
export function generateBreadcrumbs(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  }
}

// Article Schema – für Blog-Posts
export function generateArticle(post: Post) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    url: `${siteUrl}/blog/${post.slug.current}`,
  }

  if (post.excerpt) {
    schema.description = post.excerpt
  }

  if (post.publishedAt) {
    schema.datePublished = post.publishedAt
  }

  if (post._updatedAt) {
    schema.dateModified = post._updatedAt
  }

  if (post.author?.name) {
    schema.author = {
      '@type': 'Person',
      name: post.author.name,
    }
  }

  return schema
}

// JobPosting Schema – für Stellenangebote
export function generateJobPosting(job: Job, settings: Settings | null) {
  const employmentTypeMap: Record<string, string> = {
    vollzeit: 'FULL_TIME',
    teilzeit: 'PART_TIME',
    ausbildung: 'FULL_TIME',
    praktikum: 'INTERN',
    werkstudent: 'PART_TIME',
    freelance: 'CONTRACTOR',
  }

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    url: `${siteUrl}/jobs/${job.slug.current}`,
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
        addressCountry: 'DE',
      },
    },
    employmentType: employmentTypeMap[job.type] || 'FULL_TIME',
  }

  if (job.excerpt) {
    schema.description = job.excerpt
  }

  if (job.publishedAt) {
    schema.datePosted = job.publishedAt
  }

  if (settings?.title) {
    schema.hiringOrganization = {
      '@type': 'Organization',
      name: settings.title,
      sameAs: siteUrl,
    }
  }

  return schema
}

// Event Schema – für Messen und Events
export function generateEvent(news: News) {
  if (news.type !== 'messe' && news.type !== 'event') return null

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: news.title,
    startDate: news.date,
    url: `${siteUrl}/news/${news.slug.current}`,
  }

  if (news.endDate) {
    schema.endDate = news.endDate
  }

  if (news.location) {
    schema.location = {
      '@type': 'Place',
      name: news.location,
    }
  }

  if (news.excerpt) {
    schema.description = news.excerpt
  }

  return schema
}
