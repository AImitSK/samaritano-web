import type { Metadata } from 'next'
import { LegalPageView } from '@/components/sections/samaritano/LegalPageView'
import { getLegalPageByType } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Impressum',
  robots: { index: false, follow: true },
}

export default async function ImpressumPage() {
  const legal = await getLegalPageByType('impressum')
  return (
    <LegalPageView
      legal={legal}
      fallbackTitle="Impressum"
      fallbackHint={`Der Impressums-Text wird im Sanity Studio gepflegt — Document-Type "Rechtliche Seiten" mit Seitentyp "Impressum" anlegen.`}
    />
  )
}
