# Neue Komponente erstellen

Erstelle eine neue React-Komponente nach Projekt-Konventionen.

## Parameter

$ARGUMENTS = Komponentenname und Typ

Beispiele:
- `/component Button ui` - UI Komponente
- `/component Hero sections` - Section Komponente
- `/component Sidebar layout` - Layout Komponente

## Struktur

```typescript
'use client' // nur wenn Client-Features benoetigt

import { cn } from '@/lib/utils'

interface [Name]Props {
  // Props hier
  className?: string
}

export function [Name]({ className, ...props }: [Name]Props) {
  return (
    <div className={cn('', className)} {...props}>
      {/* Inhalt */}
    </div>
  )
}
```

## Konventionen

1. **Dateiname**: PascalCase (z.B. `Button.tsx`)
2. **Export**: Named Export (kein default)
3. **Styling**: Tailwind CSS, cn() fuer bedingte Klassen
4. **Types**: Interface fuer Props, mit `[Name]Props`
5. **Client**: `'use client'` nur wenn noetig (useState, useEffect, etc.)

## Pfade

- UI: `src/components/ui/[Name].tsx`
- Sections: `src/components/sections/[Name].tsx`
- Layout: `src/components/layout/[Name].tsx`

Erstelle: $ARGUMENTS
