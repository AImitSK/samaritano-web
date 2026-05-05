import type { Metadata } from 'next'
import { KontaktForm } from '@/components/sections/samaritano/forms/KontaktForm'
import { getSettings } from '@/sanity/queries'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Kontakt',
  description:
    'Schreib uns, ruf an oder buch dir 30 Minuten. Wir antworten innerhalb eines Werktags.',
}

const CHANNELS = [
  {
    t: 'Pflegekräfte',
    d: 'Du suchst eine neue Stelle oder hast Fragen zur Vermittlung.',
    mail: 'hallo@samaritano.de',
    tel: '0800 SAMARI',
    h: 'Mo–Fr 8–18 Uhr',
  },
  {
    t: 'Einrichtungen',
    d: 'Du suchst Pflegepersonal oder willst Partner werden.',
    mail: 'einrichtungen@samaritano.de',
    tel: '0221 4711 200',
    h: 'Mo–Fr 9–17 Uhr',
  },
  {
    t: 'Presse & Partnerschaften',
    d: 'Medienanfragen, Kooperationen, Veranstaltungen.',
    mail: 'presse@samaritano.de',
    tel: '0221 4711 280',
    h: 'Mo–Fr 10–16 Uhr',
  },
]

const FAQS = [
  {
    q: 'Was kostet die Vermittlung für mich als Pflegekraft?',
    a: 'Nichts. Für Pflegekräfte ist die Vermittlung komplett kostenfrei, wir werden von den Einrichtungen bezahlt.',
  },
  {
    q: 'Wie lange dauert es bis zur ersten Stelle?',
    a: 'Im Schnitt 6 Tage vom Erstgespräch bis zum unterschriebenen Vertrag. Manche Vermittlungen gehen schneller, andere brauchen länger, wir nehmen uns die Zeit, die nötig ist.',
  },
  {
    q: 'Muss ich christlich sein, um vermittelt zu werden?',
    a: 'Nein. Wir vermitteln in christlich geprägte Häuser, aber Werte werden gelebt, nicht abgefragt. Die Mehrheit unserer Pflegekräfte hat keinen religiösen Hintergrund.',
  },
  {
    q: 'In welcher Region seid ihr aktiv?',
    a: 'Schwerpunkt NRW und Niedersachsen, aber wir vermitteln deutschlandweit, und seit 2024 auch nach Österreich und in die Schweiz.',
  },
]

export default async function KontaktPage() {
  const settings = await getSettings()
  const address = settings?.address || 'samaritano GmbH\nVon Oeynhausen Str. 34\n32479 Hille'
  const contactEmail = settings?.contactEmail
  const contactPhone = settings?.contactPhone

  return (
    <>
      {/* Hero */}
      <section className="pb-16 pt-16 lg:pt-20">
        <div className="wrap">
          <div className="eyebrow">Kontakt</div>
          <h1 className="display mt-6 max-w-[1000px]">
            <span className="block whitespace-nowrap">
              Wir <em>hören</em> dir zu.
            </span>
          </h1>
          <p className="lede mt-8 max-w-[680px]">
            Schreib uns, ruf an, oder buch dir 30 Minuten, wir antworten innerhalb eines Werktags.
          </p>
        </div>
      </section>

      {/* Channels */}
      <section className="pb-24 pt-10 lg:pb-32">
        <div className="wrap">
          <div className="grid gap-6 lg:grid-cols-3">
            {CHANNELS.map((c, i) => {
              const dark = i === 0
              return (
                <div
                  key={c.t}
                  className={cn(
                    'flex min-h-[340px] flex-col rounded-[16px] border p-9',
                    dark ? 'border-ink bg-ink text-paper' : 'border-line bg-paper-2 text-ink'
                  )}
                >
                  <h3 className="m-0 mb-3 font-serif text-[30px] font-normal text-inherit">{c.t}</h3>
                  <p
                    className={cn(
                      'mb-8 text-[15px] leading-relaxed',
                      dark ? 'text-white/70' : 'text-ink-soft'
                    )}
                  >
                    {c.d}
                  </p>
                  <div className="mt-auto grid gap-3.5 text-[14px]">
                    <div>
                      <div className={cn('eyebrow mb-1', dark && '!text-white/50')}>E-Mail</div>
                      <a
                        href={`mailto:${c.mail}`}
                        className="border-b border-current pb-px hover:opacity-80"
                      >
                        {c.mail}
                      </a>
                    </div>
                    <div>
                      <div className={cn('eyebrow mb-1', dark && '!text-white/50')}>Telefon</div>
                      <a
                        href={`tel:${c.tel.replace(/\s/g, '')}`}
                        className="hover:opacity-80"
                      >
                        {c.tel}
                      </a>
                      <div
                        className={cn('mt-1 text-[13px]', dark ? 'text-white/50' : 'text-ink-muted')}
                      >
                        {c.h}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="bg-paper-2 py-24 lg:py-32">
        <div className="wrap">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <div className="eyebrow">Allgemeine Anfrage</div>
              <h2 className="h1 mt-5">
                Schreib uns,
                <br />
                wir <em>antworten</em>.
              </h2>
              <p className="lede mt-6">Innerhalb eines Werktags. Versprochen.</p>
              <div className="mt-12 grid gap-6 text-[15px] leading-relaxed">
                <div>
                  <div className="eyebrow mb-1.5 !text-ink-muted">Adresse</div>
                  {address.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < address.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </div>
                {(contactEmail || contactPhone) && (
                  <div>
                    <div className="eyebrow mb-1.5 !text-ink-muted">Direkt erreichbar</div>
                    {contactEmail && (
                      <div>
                        <a
                          href={`mailto:${contactEmail}`}
                          className="border-b border-line transition-colors hover:border-sky hover:text-sky"
                        >
                          {contactEmail}
                        </a>
                      </div>
                    )}
                    {contactPhone && (
                      <div>
                        <a
                          href={`tel:${contactPhone.replace(/\s/g, '')}`}
                          className="border-b border-line transition-colors hover:border-sky hover:text-sky"
                        >
                          {contactPhone}
                        </a>
                      </div>
                    )}
                  </div>
                )}
                <div>
                  <div className="eyebrow mb-1.5 !text-ink-muted">Bürozeiten</div>
                  Mo–Fr 8–18 Uhr
                  <br />
                  Termine nach Vereinbarung
                </div>
              </div>
            </div>
            <KontaktForm />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 lg:py-32">
        <div className="wrap">
          <div className="mb-12 max-w-[600px]">
            <div className="eyebrow">Häufige Fragen</div>
            <h2 className="h1 mt-5">
              Schon mal <em>gefragt</em>.
            </h2>
          </div>
          <div className="max-w-[880px]">
            {FAQS.map((item, i) => (
              <details
                key={item.q}
                open={i === 0}
                className="group border-t border-line py-2 [&[open]_summary_.plus]:rotate-45"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-serif text-[22px] font-normal text-ink">
                  <span>{item.q}</span>
                  <span className="plus inline-block flex-shrink-0 font-sans text-[24px] text-sky transition-transform duration-200">
                    +
                  </span>
                </summary>
                <div className="max-w-[720px] pb-6 text-[16px] leading-relaxed text-ink-soft">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
