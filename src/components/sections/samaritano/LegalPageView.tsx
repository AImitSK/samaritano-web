import { PortableTextRenderer } from '@/components/ui/PortableTextRenderer'
import type { LegalPage } from '@/types'

interface LegalPageViewProps {
  legal: LegalPage | null
  fallbackTitle: string
  fallbackHint: string
}

function formatDate(iso?: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function LegalPageView({ legal, fallbackTitle, fallbackHint }: LegalPageViewProps) {
  return (
    <section className="pb-32 pt-16 lg:pt-20">
      <div className="wrap">
        <div className="mx-auto max-w-[760px]">
          <div className="eyebrow">Rechtliches</div>
          <h1 className="h1 mb-12 mt-5">{legal?.title || fallbackTitle}</h1>

          {legal?.content && legal.content.length > 0 ? (
            <PortableTextRenderer content={legal.content} />
          ) : (
            <div className="rounded-[14px] border border-line bg-paper-2 p-10">
              <p className="m-0 text-ink-soft">{fallbackHint}</p>
            </div>
          )}

          {legal?.lastUpdated && (
            <p className="mt-12 border-t border-line pt-6 text-[13px] text-ink-muted">
              Zuletzt aktualisiert: {formatDate(legal.lastUpdated)}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
