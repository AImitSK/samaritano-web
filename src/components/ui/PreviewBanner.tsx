'use client'

import Link from 'next/link'

export function PreviewBanner() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-amber-500 px-4 py-2 text-center text-sm font-medium text-amber-950">
      Vorschau-Modus aktiv — Entwuerfe werden angezeigt.{' '}
      <Link
        href="/api/disable-draft"
        className="underline hover:no-underline"
        prefetch={false}
      >
        Vorschau beenden
      </Link>
    </div>
  )
}
