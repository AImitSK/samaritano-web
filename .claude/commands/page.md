# Neue Seite erstellen

Erstelle eine neue Next.js Seite nach Projekt-Konventionen.

## Parameter

$ARGUMENTS = Seitenname/Pfad

Beispiele:
- `/page leistungen` - Erstellt /leistungen
- `/page blog/[slug]` - Erstellt dynamische Blog-Seite
- `/page kontakt` - Erstellt /kontakt

## Struktur

### Statische Seite

```typescript
import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: '[Seitentitel]',
  description: '[Beschreibung]',
}

export default function [Name]Page() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Sections hier */}
      </main>
      <Footer />
    </>
  )
}
```

### Dynamische Seite (mit Sanity)

```typescript
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPageBySlug } from '@/sanity/queries'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPageBySlug(params.slug)
  if (!page) return {}

  return {
    title: page.title,
    description: page.description,
  }
}

export default async function Page({ params }: Props) {
  const page = await getPageBySlug(params.slug)
  if (!page) notFound()

  return (
    // ...
  )
}
```

## Checkliste

- [ ] Metadata (Title, Description)
- [ ] Header/Footer eingebunden
- [ ] Navigation aktualisiert
- [ ] Sitemap wird generiert

Erstelle: $ARGUMENTS
