import { getClient } from './client'
import type {
  Page,
  Post,
  Settings,
  Navigation,
  BlogSettings,
  TeamMember,
  News,
  Job,
  Download,
  Milestone,
  LegalPage,
} from '@/types'

// Fetch options: im Preview-Modus kein Caching
function fetchOptions(tags: string[], preview = false) {
  if (preview) return { cache: 'no-store' as const }
  return { next: { tags } }
}

// Settings (Singleton)
export async function getSettings(preview = false): Promise<Settings | null> {
  const client = getClient(preview)
  if (!client) return null
  return client.fetch(
    `*[_type == "settings"][0]{
      _id,
      _type,
      title,
      description,
      logo,
      favicon,
      socialLinks,
      contactEmail,
      contactPhone,
      address
    }`,
    {},
    fetchOptions(['settings'], preview)
  )
}

// ─── Navigation (Singleton) ───

export async function getNavigation(preview = false): Promise<Navigation | null> {
  const client = getClient(preview)
  if (!client) return null
  return client.fetch(
    `*[_type == "navigation"][0]{
      _id,
      _type,
      mainNav[]{
        _key,
        label,
        type,
        page->{_id, title, slug, pageType},
        href,
        openInNewTab,
        children[]{
          _key,
          label,
          type,
          page->{_id, title, slug, pageType},
          href,
          openInNewTab
        }
      },
      footerNav[]{
        _key,
        label,
        type,
        page->{_id, title, slug, pageType},
        href,
        openInNewTab
      }
    }`,
    {},
    fetchOptions(['navigation'], preview)
  )
}

// ─── Blog Settings (Singleton) ───

export async function getBlogSettings(preview = false): Promise<BlogSettings | null> {
  const client = getClient(preview)
  if (!client) return null
  return client.fetch(
    `*[_type == "blogSettings"][0]`,
    {},
    fetchOptions(['blogSettings'], preview)
  )
}

// ─── Pages ───

export async function getPageBySlug(slug: string, preview = false): Promise<Page | null> {
  const client = getClient(preview)
  if (!client) return null
  return client.fetch(
    `*[_type == "page" && slug.current == $slug][0]{
      _id,
      _type,
      title,
      slug,
      pageType,
      seo
    }`,
    { slug },
    fetchOptions(['page', `page:${slug}`], preview)
  )
}

export async function getAllPages(preview = false): Promise<Page[]> {
  const client = getClient(preview)
  if (!client) return []
  return client.fetch(
    `*[_type == "page"] | order(title asc){
      _id,
      _type,
      title,
      slug,
      pageType
    }`,
    {},
    fetchOptions(['page'], preview)
  )
}

// ─── Posts ───

export async function getPostBySlug(slug: string, preview = false): Promise<Post | null> {
  const client = getClient(preview)
  if (!client) return null
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      _id,
      _type,
      title,
      slug,
      excerpt,
      content,
      publishedAt,
      author->{
        name,
        image
      },
      mainImage,
      categories[]->{
        _id,
        title,
        slug
      },
      seo
    }`,
    { slug },
    fetchOptions(['post', `post:${slug}`], preview)
  )
}

export async function getAllPosts(preview = false): Promise<Post[]> {
  const client = getClient(preview)
  if (!client) return []
  return client.fetch(
    `*[_type == "post"] | order(publishedAt desc){
      _id,
      _type,
      title,
      slug,
      excerpt,
      publishedAt,
      mainImage,
      content,
      author->{
        name,
        image
      },
      categories[]->{
        _id,
        title,
        slug
      }
    }`,
    {},
    fetchOptions(['post'], preview)
  )
}

// ─── Sitemap helper ───

export async function getAllSlugs(): Promise<{
  pages: string[]
  posts: string[]
  jobs: string[]
  news: string[]
  legal: string[]
}> {
  const client = getClient()
  if (!client) {
    return { pages: [], posts: [], jobs: [], news: [], legal: [] }
  }

  const [pages, posts, jobs, news, legal] = await Promise.all([
    client.fetch<{ slug: { current: string }; pageType: string }[]>(
      `*[_type == "page" && pageType != "home"]{ slug, pageType }`
    ),
    client.fetch<{ slug: { current: string } }[]>(`*[_type == "post"]{ slug }`),
    client.fetch<{ slug: { current: string } }[]>(
      `*[_type == "job" && isActive == true]{ slug }`
    ),
    client.fetch<{ slug: { current: string } }[]>(`*[_type == "news"]{ slug }`),
    client.fetch<{ slug: { current: string } }[]>(`*[_type == "legal"]{ slug }`),
  ])

  return {
    pages: pages.map((p) => p.slug.current),
    posts: posts.map((p) => p.slug.current),
    jobs: jobs.map((j) => j.slug.current),
    news: news.map((n) => n.slug.current),
    legal: legal.map((l) => l.slug.current),
  }
}

// ─── Team ───

export async function getAllTeamMembers(preview = false): Promise<TeamMember[]> {
  const client = getClient(preview)
  if (!client) return []
  return client.fetch(
    `*[_type == "team"] | order(order asc){
      _id,
      _type,
      name,
      position,
      image,
      email,
      phone,
      bio,
      order
    }`,
    {},
    fetchOptions(['team'], preview)
  )
}

// ─── News ───

export async function getNewsBySlug(slug: string, preview = false): Promise<News | null> {
  const client = getClient(preview)
  if (!client) return null
  return client.fetch(
    `*[_type == "news" && slug.current == $slug][0]{
      _id,
      _type,
      title,
      slug,
      type,
      date,
      endDate,
      location,
      excerpt,
      content,
      image,
      link
    }`,
    { slug },
    fetchOptions(['news', `news:${slug}`], preview)
  )
}

export async function getAllNews(preview = false): Promise<News[]> {
  const client = getClient(preview)
  if (!client) return []
  return client.fetch(
    `*[_type == "news"] | order(date desc){
      _id,
      _type,
      title,
      slug,
      type,
      date,
      endDate,
      location,
      excerpt,
      image
    }`,
    {},
    fetchOptions(['news'], preview)
  )
}

// ─── Jobs ───

const jobProjection = `
  _id,
  _type,
  title,
  slug,
  department,
  role,
  region,
  salary,
  featured,
  location,
  type,
  excerpt,
  description,
  requirements,
  benefits,
  contactEmail,
  publishedAt,
  isActive
`

export async function getJobBySlug(slug: string, preview = false): Promise<Job | null> {
  const client = getClient(preview)
  if (!client) return null
  return client.fetch(
    `*[_type == "job" && slug.current == $slug][0]{${jobProjection}}`,
    { slug },
    fetchOptions(['job', `job:${slug}`], preview)
  )
}

export async function getAllActiveJobs(preview = false): Promise<Job[]> {
  const client = getClient(preview)
  if (!client) return []
  return client.fetch(
    `*[_type == "job" && isActive == true] | order(publishedAt desc){${jobProjection}}`,
    {},
    fetchOptions(['job'], preview)
  )
}

// ─── Downloads ───

export async function getAllDownloads(preview = false): Promise<Download[]> {
  const client = getClient(preview)
  if (!client) return []
  return client.fetch(
    `*[_type == "download"] | order(order asc){
      _id,
      _type,
      title,
      description,
      "file": file{
        _type,
        "asset": asset->{
          _ref,
          _type,
          url
        }
      },
      category,
      fileSize,
      language,
      order
    }`,
    {},
    fetchOptions(['download'], preview)
  )
}

export async function getDownloadsByCategory(
  category: string,
  preview = false
): Promise<Download[]> {
  const client = getClient(preview)
  if (!client) return []
  return client.fetch(
    `*[_type == "download" && category == $category] | order(order asc){
      _id,
      _type,
      title,
      description,
      "file": file{
        _type,
        "asset": asset->{
          _ref,
          _type,
          url
        }
      },
      category,
      fileSize,
      language,
      order
    }`,
    { category },
    fetchOptions(['download', `download:${category}`], preview)
  )
}

// ─── Milestones ───

export async function getAllMilestones(preview = false): Promise<Milestone[]> {
  const client = getClient(preview)
  if (!client) return []
  return client.fetch(
    `*[_type == "milestone"] | order(year desc){
      _id,
      _type,
      year,
      title,
      description,
      image
    }`,
    {},
    fetchOptions(['milestone'], preview)
  )
}

// ─── Legal Pages ───

export async function getLegalPageBySlug(slug: string, preview = false): Promise<LegalPage | null> {
  const client = getClient(preview)
  if (!client) return null
  return client.fetch(
    `*[_type == "legal" && slug.current == $slug][0]{
      _id,
      _type,
      title,
      slug,
      type,
      content,
      lastUpdated
    }`,
    { slug },
    fetchOptions(['legal', `legal:${slug}`], preview)
  )
}

export async function getLegalPageByType(
  type: string,
  preview = false
): Promise<LegalPage | null> {
  const client = getClient(preview)
  if (!client) return null
  return client.fetch(
    `*[_type == "legal" && type == $type][0]{
      _id,
      _type,
      title,
      slug,
      type,
      content,
      lastUpdated
    }`,
    { type },
    fetchOptions(['legal', `legal:${type}`], preview)
  )
}

export async function getAllLegalPages(preview = false): Promise<LegalPage[]> {
  const client = getClient(preview)
  if (!client) return []
  return client.fetch(
    `*[_type == "legal"]{
      _id,
      _type,
      title,
      slug,
      type,
      lastUpdated
    }`,
    {},
    fetchOptions(['legal'], preview)
  )
}
