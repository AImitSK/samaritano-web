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

// Page Types
export type PageType =
  | 'standard'
  | 'home'
  | 'blog'
  | 'karriere'
  | 'aktuelles'
  | 'downloads'
  | 'kontakt'
  | 'team'
  | 'timeline'
  | 'impressum'
  | 'datenschutz'

// Page Type
export interface Page extends SanityDocument {
  _type: 'page'
  title: string
  slug: { current: string }
  pageType: PageType
  seo?: SEO
}

// Navigation Item (aus Navigation-Singleton)
export interface NavItem {
  _key: string
  label?: string
  type: 'internal' | 'external'
  page?: { _id: string; title: string; slug: { current: string }; pageType: PageType }
  href?: string
  openInNewTab?: boolean
  children?: NavItem[]
}

// Blog Settings (Singleton)
export interface BlogSettings {
  // Layout
  gridColumns?: 1 | 2 | 3
  postsPerPage?: number
  pagination?: 'loadMore' | 'pages' | 'none'
  // Artikelkarten
  showImage?: boolean
  imageRatio?: '16/9' | '4/3' | '1/1' | 'auto'
  showExcerpt?: boolean
  excerptMaxChars?: number
  showDate?: boolean
  dateFormat?: 'short' | 'long' | 'relative'
  showCategory?: boolean
  showReadingTime?: boolean
  // Autor
  showAuthor?: boolean
  showAuthorImage?: boolean
  showAuthorPosition?: boolean
  // Detailseite
  showHeroImage?: boolean
  showSharingButtons?: boolean
  sharingPlatforms?: string[]
  showRelatedPosts?: boolean
  relatedPostsCount?: number
  showPostNavigation?: boolean
  // Filter
  showCategoryFilter?: boolean
  showSearch?: boolean
  defaultSort?: 'newest' | 'oldest'
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

// Team Member Type
export interface TeamMember extends SanityDocument {
  _type: 'team'
  name: string
  position: string
  image?: SanityImage
  email?: string
  phone?: string
  bio?: string
  order: number
}

// News Type
export interface News extends SanityDocument {
  _type: 'news'
  title: string
  slug: { current: string }
  type: 'news' | 'messe' | 'event' | 'presse'
  date: string
  endDate?: string
  location?: string
  excerpt?: string
  content?: unknown[]
  image?: SanityImage
  link?: string
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
  image?: SanityImage
  location: string
  type: 'vollzeit' | 'teilzeit' | 'ausbildung' | 'praktikum' | 'werkstudent' | 'freelance'
  excerpt?: string
  description?: unknown[]
  requirements?: string[]
  benefits?: string[]
  contactEmail?: string
  publishedAt?: string
  isActive: boolean
}

// Download Type
export interface Download extends SanityDocument {
  _type: 'download'
  title: string
  description?: string
  file: {
    _type: 'file'
    asset: {
      _ref: string
      _type: 'reference'
      url?: string
    }
  }
  category: 'katalog' | 'datenblatt' | 'broschuere' | 'zertifikat' | 'anleitung' | 'sonstiges'
  fileSize?: string
  language: 'de' | 'en' | 'fr'
  order: number
}

// Milestone Type
export interface Milestone extends SanityDocument {
  _type: 'milestone'
  year: string
  title: string
  description?: string
  image?: SanityImage
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
