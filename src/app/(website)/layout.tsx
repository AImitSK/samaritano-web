import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { WebsiteShell } from '@/components/layout/WebsiteShell'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PreviewBanner } from '@/components/ui/PreviewBanner'
import { JsonLd } from '@/components/ui/JsonLd'
import { getSettings, getNavigation } from '@/sanity/queries'
import { urlFor } from '@/sanity/client'
import { generateOrganization, generateWebSite } from '@/lib/jsonld'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  // Raw URL ohne Resize — bei SVGs (typischer Favicon) liefert das die SVG-Datei direkt.
  // Bei PNG/JPG-Favicons wuerde Sanity die Originalgroesse liefern, was fuer Favicons OK ist.
  const faviconUrl = settings?.favicon ? urlFor(settings.favicon)?.url() ?? null : null
  return faviconUrl
    ? {
        icons: {
          icon: faviconUrl,
          shortcut: faviconUrl,
          apple: faviconUrl,
        },
      }
    : {}
}

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isEnabled: isPreview } = draftMode()
  const [settings, navigation] = await Promise.all([
    getSettings(isPreview),
    getNavigation(isPreview),
  ])

  const logoUrl = settings?.logo ? urlFor(settings.logo)?.url() ?? null : null

  return (
    <WebsiteShell>
      <JsonLd data={generateOrganization(settings)} />
      <JsonLd data={generateWebSite(settings)} />
      {isPreview && <PreviewBanner />}
      <Header
        logoUrl={logoUrl}
        siteName={settings?.title}
        navigation={navigation?.mainNav || []}
      />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer
        logoUrl={logoUrl}
        siteName={settings?.title}
        description={settings?.description}
        navigation={navigation?.footerNav || []}
        socialLinks={settings?.socialLinks || []}
      />
    </WebsiteShell>
  )
}
