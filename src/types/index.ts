// Sanity Document Types
export interface SanityDocument {
  _id: string
  _type: string
  _createdAt: string
  _updatedAt: string
  _rev: string
}

// SEO Type
export interface SEO {
  metaTitle?: string
  titleTemplate?: boolean
  metaDescription?: string
  keywords?: string[]
  canonicalUrl?: string
  noIndex?: boolean
  noFollow?: boolean
  metaImage?: SanityImage
  ogTitle?: string
  ogDescription?: string
  ogImage?: SanityImage
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: SanityImage
  breadcrumbTitle?: string
  schemaType?: 'WebPage' | 'Article' | 'FAQPage' | 'ContactPage' | 'AboutPage'
  isCornerstone?: boolean
}

// Navigation Item (aus Navigation-Singleton)
export interface NavItem {
  _key: string
  label: string
  href?: string
  openInNewTab?: boolean
  children?: NavItem[]
}

// Navigation (Singleton)
export interface Navigation extends SanityDocument {
  _type: 'navigation'
  mainNav?: NavItem[]
  footerNav?: NavItem[]
}

// Post Type
export interface Post extends SanityDocument {
  _type: 'post'
  title: string
  slug: { current: string }
  excerpt?: string
  content?: unknown[]
  publishedAt?: string
  author?: {
    name: string
    image?: SanityImage
  }
  mainImage?: SanityImage
  categories?: Category[]
  seo?: SEO
}

// Category Type
export interface Category extends SanityDocument {
  _type: 'category'
  title: string
  slug: { current: string }
  description?: string
}

// Settings Type (Singleton)
export interface Settings extends SanityDocument {
  _type: 'settings'
  title: string
  description?: string
  logo?: SanityImage
  favicon?: SanityImage
  socialLinks?: SocialLink[]
  contactEmail?: string
  contactPhone?: string
  address?: string
}

// Supporting Types
export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
}

export interface SocialLink {
  _key: string
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube'
  url: string
}

// Contact Form
export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

// Chat Message
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}

// Job Type
export interface Job extends SanityDocument {
  _type: 'job'
  title: string
  slug: { current: string }
  department?: string
  role?: string
  region?: string
  salary?: string
  featured?: boolean
  location: string
  type: 'vollzeit' | 'teilzeit' | 'minijob' | 'ausbildung' | 'praktikum' | 'werkstudent' | 'freelance'
  excerpt?: string
  description?: unknown[]
  requirements?: string[]
  benefits?: string[]
  contactEmail?: string
  publishedAt?: string
  isActive: boolean
}

// Legal Page Type
export interface LegalPage extends SanityDocument {
  _type: 'legal'
  title: string
  slug: { current: string }
  type: 'impressum' | 'datenschutz' | 'agb' | 'widerruf' | 'sonstige'
  content?: unknown[]
  lastUpdated?: string
}

// FAQ Category Type
export interface FaqCategory extends SanityDocument {
  _type: 'faqCategory'
  title: string
  slug: { current: string }
  description?: string
  order?: number
  pageContext?: '' | 'pflegekraefte' | 'einrichtungen'
}

// Team Member Type
export interface TeamMember extends SanityDocument {
  _type: 'team'
  name: string
  position: string
  image?: SanityImage
  email?: string
  phone?: string
  bio?: string
  order?: number
}

// Milestone Type
export interface Milestone extends SanityDocument {
  _type: 'milestone'
  year: string
  title: string
  description?: string
  image?: SanityImage
}

// FAQ Type
export interface Faq extends SanityDocument {
  _type: 'faq'
  question: string
  slug: { current: string }
  categories?: FaqCategory[]
  answer: unknown[]
  order?: number
  featured?: boolean
  isActive: boolean
}
