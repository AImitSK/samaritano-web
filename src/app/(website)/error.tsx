'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Optional: Log error to error reporting service
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-2 text-6xl font-bold text-muted-foreground/20">
          Fehler
        </h1>
        <h2 className="mb-4 text-2xl font-semibold">
          Etwas ist schiefgelaufen
        </h2>
        <p className="mb-8 max-w-md text-muted-foreground">
          Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es
          erneut.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => reset()}>Erneut versuchen</Button>
          <Button variant="outline" onClick={() => (window.location.href = '/')}>
            Zur Startseite
          </Button>
        </div>
      </div>
    </main>
  )
}
