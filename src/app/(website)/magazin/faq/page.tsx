import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { JsonLd } from '@/components/ui/JsonLd'
import { FAQSection } from '@/components/sections/samaritano/FAQSection'
import { getAllFAQCategories, getAllFAQs } from '@/sanity/queries'
import { generateFAQPage } from '@/lib/jsonld'
import type { Faq, FaqCategory } from '@/types'

export const metadata: Metadata = {
  title: 'FAQ — Häufig gestellte Fragen',
  description:
    'Antworten auf die häufigsten Fragen rund um Bewerbung, Vergütung, Einsätze und Personalvermittlung bei Samaritano.',
}

function groupByCategory(faqs: Faq[], cats: FaqCategory[]) {
  return cats
    .map((cat) => ({
      category: cat,
      items: faqs.filter((f) => f.categories?.some((c) => c._id === cat._id)),
    }))
    .filter((g) => g.items.length > 0)
}

export default async function FAQPage() {
  const [allFAQs, allCategories] = await Promise.all([
    getAllFAQs(),
    getAllFAQCategories(),
  ])

  const groups = groupByCategory(allFAQs, allCategories)
  const jsonLd = generateFAQPage(allFAQs)

  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}

      {/* Hero */}
      <section className="pb-16 pt-16 lg:pt-20">
        <div className="wrap">
          <div className="grid items-end gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
            <div>
              <div className="eyebrow">FAQ</div>
              <h1 className="display mt-6">
                <span className="block sm:whitespace-nowrap">Häufig</span>
                <span className="block sm:whitespace-nowrap">
                  gestellte <em>Fragen</em>.
                </span>
              </h1>
            </div>
            <p className="lede max-w-[420px]">
              Bewerbung, Einsätze, Vergütung, Vermittlung — die wichtigsten Antworten auf
              einen Blick. Wenn etwas fehlt, schreib uns.
            </p>
          </div>
        </div>
      </section>

      {/* Kategorie-Anker-Nav */}
      {groups.length > 1 && (
        <div className="border-y border-line bg-paper-2">
          <div className="wrap">
            <nav className="flex flex-wrap gap-2 py-4">
              {groups.map(({ category }) => (
                <a
                  key={category._id}
                  href={`#${category.slug.current}`}
                  className="rounded-full border border-line bg-paper px-4 py-2 text-[13px] font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                >
                  {category.title}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* FAQ-Sections pro Kategorie */}
      {groups.map(({ category, items }) => (
        <FAQSection
          key={category._id}
          id={category.slug.current}
          title={category.title}
          eyebrow="Kategorie"
          description={category.description}
          faqs={items}
          itemAnchors
        />
      ))}

      {/* Empty state */}
      {groups.length === 0 && (
        <section className="section-pad-tight">
          <div className="wrap">
            <div className="rounded-[14px] border border-line bg-paper-2 p-12 text-center">
              <h2 className="h3 m-0">Noch keine FAQs.</h2>
              <p className="mt-3 text-ink-soft">
                Sobald im Sanity Studio Einträge angelegt werden, erscheinen sie hier.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-pad-tight">
        <div className="wrap">
          <div className="grid items-center gap-8 rounded-[20px] bg-ink p-6 text-paper sm:p-10 md:p-14 lg:grid-cols-[1.5fr_auto] lg:p-20">
            <div>
              <div className="eyebrow !text-white/55">Noch Fragen?</div>
              <h2 className="h2 mt-4 !text-paper">
                Sprich uns <em className="text-sky">direkt an</em>.
              </h2>
              <p className="mt-5 max-w-[520px] text-[17px] text-white/80">
                Persönliche Antworten gibt&apos;s schneller als jede FAQ. Ruf uns an oder schreib
                uns eine kurze Nachricht.
              </p>
            </div>
            <div className="flex flex-wrap gap-3.5">
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2.5 self-start rounded-full bg-accent px-7 py-4 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-accent-deep lg:self-center"
              >
                Kontakt
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/pflegekraefte"
                className="inline-flex items-center gap-2.5 self-start rounded-full border border-white/30 px-7 py-4 text-[15px] font-medium text-paper transition-all hover:border-paper lg:self-center"
              >
                Für Pflegekräfte
              </Link>
              <Link
                href="/einrichtungen"
                className="inline-flex items-center gap-2.5 self-start rounded-full border border-white/30 px-7 py-4 text-[15px] font-medium text-paper transition-all hover:border-paper lg:self-center"
              >
                Für Einrichtungen
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
