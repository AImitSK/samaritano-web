import type { Metadata } from 'next'
import { Gehaltsrechner } from '@/components/sections/samaritano/calculator/Gehaltsrechner'

export const metadata: Metadata = {
  title: 'Gehaltsrechner',
  description:
    'Was verdienst du als Pflegekraft bei Samaritano? Stell deine Eckdaten ein und sieh transparent, wie das im Vergleich zum Tarif aussieht.',
}

export default function GehaltsrechnerPage() {
  return <Gehaltsrechner />
}
