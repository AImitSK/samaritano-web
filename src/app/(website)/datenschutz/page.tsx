import type { Metadata } from 'next'
import { LegalPageView } from '@/components/sections/samaritano/LegalPageView'
import { getLegalPageByType } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Datenschutz',
  robots: { index: false, follow: true },
}

export default async function DatenschutzPage() {
  const legal = await getLegalPageByType('datenschutz')
  return (
    <LegalPageView
      legal={legal}
      fallbackTitle="Datenschutzerklärung"
      fallbackHint={`Der Datenschutz-Text wird im Sanity Studio gepflegt — Document-Type "Rechtliche Seiten" mit Seitentyp "Datenschutz" anlegen.`}
    />
  )
}
