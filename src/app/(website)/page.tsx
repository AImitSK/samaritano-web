import { draftMode } from 'next/headers'
import { Hero, CTASection } from '@/components/sections'

// On-Demand Revalidation via Sanity Webhook
import { getSettings } from '@/sanity/queries'

export default async function Home() {
  const { isEnabled: preview } = draftMode()
  const settings = await getSettings(preview)

  return (
    <>
      <Hero />

      {/* Kurze Vorstellung */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 font-display text-3xl font-bold md:text-4xl">
              Willkommen bei{' '}
              <span className="text-gradient">
                {settings?.title || 'Firmenname'}
              </span>
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {settings?.description ||
                'Wir sind Ihr Partner für maßgeschneiderte Lösungen. Mit über 20 Jahren Erfahrung begleiten wir Unternehmen bei der Umsetzung ihrer Ziele.'}
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-3">
            {[
              { value: '20+', label: 'Jahre Erfahrung' },
              { value: '500+', label: 'Zufriedene Kunden' },
              { value: '50+', label: 'Mitarbeiter' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-4xl font-extrabold text-accent">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leistungen Teaser */}
      <section className="bg-surface-raised py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-accent" />
            <h2 className="mb-4 font-display text-3xl font-bold md:text-4xl">
              Unsere Leistungen
            </h2>
            <p className="text-lg text-muted-foreground">
              Von der Beratung bis zur Umsetzung — alles aus einer Hand.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
            {[
              {
                title: 'Beratung',
                description: 'Individuelle Analyse und Strategieentwicklung für Ihr Unternehmen.',
                icon: '💡',
              },
              {
                title: 'Umsetzung',
                description: 'Professionelle Realisierung Ihrer Projekte — termingerecht und qualitativ.',
                icon: '⚙️',
              },
              {
                title: 'Betreuung',
                description: 'Langfristige Partnerschaft und kontinuierliche Optimierung.',
                icon: '🤝',
              },
            ].map((service) => (
              <div
                key={service.title}
                className="rounded-xl border border-border/50 bg-background p-6 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated"
              >
                <div className="mb-3 text-3xl">{service.icon}</div>
                <h3 className="mb-2 font-display text-lg font-semibold">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Bereit loszulegen?"
        description="Kontaktieren Sie uns für ein unverbindliches Gespräch."
        primaryButton={{ label: 'Kontakt aufnehmen', href: '/kontakt' }}
        secondaryButton={{ label: 'Leistungen ansehen', href: '/leistungen' }}
        variant="primary"
      />
    </>
  )
}
