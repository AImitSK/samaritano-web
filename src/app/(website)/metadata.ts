import type { Metadata } from 'next'

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'SK Website Template'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

export const siteMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: 'Eine moderne Website erstellt mit Next.js und Sanity CMS.',
  keywords: [],
  authors: [
    { name: 'SK Online Marketing', url: 'https://sk-online-marketing.de' },
  ],
  creator: 'SK Online Marketing',
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: siteUrl,
    siteName: siteName,
    title: siteName,
    description: 'Eine moderne Website erstellt mit Next.js und Sanity CMS.',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: 'Eine moderne Website erstellt mit Next.js und Sanity CMS.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}
