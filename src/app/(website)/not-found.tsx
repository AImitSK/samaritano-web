import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="mb-2 text-9xl font-bold text-muted-foreground/20">
            404
          </h1>
          <h2 className="mb-4 text-2xl font-semibold">Seite nicht gefunden</h2>
          <p className="mb-8 max-w-md text-muted-foreground">
            Die angeforderte Seite existiert nicht oder wurde verschoben.
          </p>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Zur Startseite
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
