import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, AlertCircle, Info } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Newsletter bestaetigen',
  robots: { index: false, follow: false },
}

interface PageProps {
  searchParams: { status?: string }
}

const states = {
  success: {
    icon: CheckCircle,
    iconClass: 'text-green-600',
    title: 'Dein Newsletter-Abo ist bestaetigt!',
    text: 'Du erhaeltst ab sofort unseren Newsletter mit den neuesten Stellenangeboten und Brancheninfos.',
  },
  already: {
    icon: Info,
    iconClass: 'text-sky',
    title: 'Du bist bereits angemeldet.',
    text: 'Deine E-Mail-Adresse ist bereits fuer unseren Newsletter registriert.',
  },
  error: {
    icon: AlertCircle,
    iconClass: 'text-red-600',
    title: 'Der Link ist ungueltig.',
    text: 'Der Bestaetigungslink ist ungueltig oder abgelaufen. Bitte melde dich erneut an.',
  },
  pending: {
    icon: Info,
    iconClass: 'text-sky',
    title: 'Pruefe dein Postfach!',
    text: 'Wir haben dir eine Bestaetigungsmail gesendet. Klicke auf den Link in der E-Mail, um deine Anmeldung abzuschliessen.',
  },
} as const

export default function NewsletterConfirmPage({ searchParams }: PageProps) {
  const key = (searchParams.status as keyof typeof states) || 'pending'
  const state = states[key] || states.pending
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
