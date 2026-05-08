import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Newsletter abmelden',
  robots: { index: false, follow: false },
}

interface PageProps {
  searchParams: { status?: string }
}

const states = {
  success: {
    icon: CheckCircle,
    iconClass: 'text-green-600',
    title: 'Du wurdest erfolgreich abgemeldet.',
    text: 'Du erhaeltst ab sofort keine Newsletter-E-Mails mehr von uns.',
  },
  error: {
    icon: AlertCircle,
    iconClass: 'text-red-600',
    title: 'Der Link ist ungueltig.',
    text: 'Der Abmeldelink ist ungueltig oder wurde bereits verwendet.',
  },
} as const

export default function NewsletterUnsubscribePage({ searchParams }: PageProps) {
  const key = (searchParams.status as keyof typeof states) || 'error'
  const state = states[key] || states.error
  const Icon = state.icon

  return (
    <section className="flex min-h-[60vh] items-center justify-center py-20">
      <div className="wrap">
        <div className="mx-auto max-w-[520px] text-center">
          <Icon className={`mx-auto mb-6 h-16 w-16 ${state.iconClass}`} />
          <h1 className="h2 mb-4">{state.title}</h1>
          <p className="text-ink-muted">{state.text}</p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-accent-deep"
          >
            Zur Startseite
          </Link>
        </div>
      </div>
    </section>
  )
}
