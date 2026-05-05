import type { Metadata } from 'next'
import { LegalPageView } from '@/components/sections/samaritano/LegalPageView'
import { getLegalPageByType } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'AGB',
  robots: { index: false, follow: true },
}

export default async function AgbPage() {
  const legal = await getLegalPageByType('agb')
  return (
    <LegalPageView
      legal={legal}
      fallbackTitle="Allgemeine Geschäftsbedingungen"
      fallbackHint={`Der AGB-Text wird im Sanity Studio gepflegt — Document-Type "Rechtliche Seiten" mit Seitentyp "AGB" anlegen.`}
    />
  )
}
