import { getClient } from './client'
import type {
  Post,
  Settings,
  Navigation,
  Notifications,
  Job,
  LegalPage,
  Faq,
  FaqCategory,
  TeamMember,
  Milestone,
  Testimonial,
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

// ─── Notifications (Singleton) ───

export async function getNotifications(preview = false): Promise<Notifications | null> {
  const client = getClient(preview)
  if (!client) return null
  return client.fetch(
    `*[_type == "notifications"][0]{
      _id,
      _type,
      bewerbungenEmail,
      bewerbungenSlack,
      bewerbungenWebhook,
      kontaktEmail,
      kontaktSlack,
      kontaktWebhook,
      gehaltsrechnerEmail,
      gehaltsrechnerSlack,
      gehaltsrechnerWebhook
    }`,
    {},
    fetchOptions(['notifications'], preview)
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
        href,
        openInNewTab,
        children[]{
          _key,
          label,
          href,
          openInNewTab
        }
      },
      footerNav[]{
        _key,
        label,
        href,
        openInNewTab
      }
    }`,
    {},
    fetchOptions(['navigation'], preview)
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
      author{
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
      author{
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

// ─── Job Stats (fuer Homepage) ───

export async function getJobStats(preview = false) {
  const jobs = await getAllActiveJobs(preview)
  const roles = new Set(jobs.map((j) => j.role || j.department).filter(Boolean))
  return {
    totalJobs: jobs.length,
    totalRoles: roles.size,
  }
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

// ─── Team ───

export async function getAllTeamMembers(preview = false): Promise<TeamMember[]> {
  const client = getClient(preview)
  if (!client) return []
  return client.fetch(
    `*[_type == "team"] | order(order asc, name asc){
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

// ─── Meilensteine ───

export async function getAllMilestones(preview = false): Promise<Milestone[]> {
  const client = getClient(preview)
  if (!client) return []
  return client.fetch(
    `*[_type == "milestone"] | order(year asc){
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

// ─── Testimonials ───

export async function getTestimonialsByContext(
  context: string,
  preview = false
): Promise<Testimonial[]> {
  const client = getClient(preview)
  if (!client) return []
  return client.fetch(
    `*[_type == "testimonial" && context == $context] | order(order asc){
      _id,
      _type,
      name,
      role,
      quote,
      image,
      context,
      order
    }`,
    { context },
    fetchOptions(['testimonial'], preview)
  )
}

// ─── FAQ ───

const faqProjection = `
  _id,
  _type,
  question,
  slug,
  answer,
  order,
  featured,
  isActive,
  categories[]->{
    _id,
    _type,
    title,
    slug,
    order,
    pageContext
  }
`

export async function getAllFAQs(preview = false): Promise<Faq[]> {
  const client = getClient(preview)
  if (!client) return []
  return client.fetch(
    `*[_type == "faq" && isActive == true] | order(order asc, question asc){${faqProjection}}`,
    {},
    fetchOptions(['faq'], preview)
  )
}

export async function getFAQsByCategorySlug(
  slug: string,
  preview = false
): Promise<Faq[]> {
  const client = getClient(preview)
  if (!client) return []
  return client.fetch(
    `*[_type == "faq" && isActive == true && $slug in categories[]->slug.current] | order(order asc, question asc){${faqProjection}}`,
    { slug },
    fetchOptions(['faq', `faqCategory:${slug}`], preview)
  )
}

export async function getAllFAQCategories(preview = false): Promise<FaqCategory[]> {
  const client = getClient(preview)
  if (!client) return []
  return client.fetch(
    `*[_type == "faqCategory"] | order(order asc, title asc){
      _id,
      _type,
      title,
      slug,
      description,
      order,
      pageContext
    }`,
    {},
    fetchOptions(['faqCategory'], preview)
  )
}
