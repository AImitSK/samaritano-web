import { MetadataRoute } from 'next'
import { getAllSlugs } from '@/sanity/queries'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { pages, posts } = await getAllSlugs()

  const homeRoute: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]

  const pageRoutes: MetadataRoute.Sitemap = pages.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const postRoutes: MetadataRoute.Sitemap = posts.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...homeRoute, ...pageRoutes, ...postRoutes]
}
