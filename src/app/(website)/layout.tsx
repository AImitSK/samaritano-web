import { draftMode } from 'next/headers'
import { WebsiteShell } from '@/components/layout/WebsiteShell'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PreviewBanner } from '@/components/ui/PreviewBanner'
import { JsonLd } from '@/components/ui/JsonLd'
import { getSettings, getNavigation } from '@/sanity/queries'
import { urlFor } from '@/sanity/client'
import { generateOrganization, generateWebSite } from '@/lib/jsonld'

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
  const faviconUrl = settings?.favicon ? urlFor(settings.favicon)?.width(64).height(64).url() ?? null : null

  return (
    <WebsiteShell>
      {faviconUrl && (
        <link rel="icon" href={faviconUrl} />
      )}
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
      />
    </WebsiteShell>
  )
}
