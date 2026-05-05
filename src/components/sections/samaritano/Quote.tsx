/* eslint-disable @next/next/no-img-element */

interface QuoteProps {
  text?: string
  authorName?: string
  authorTitle?: string
  authorImage?: string
}

export function Quote({
  text = 'Bei Samaritano werde ich gefragt, wo ich arbeiten möchte, nicht, wo gerade ein Loch zu stopfen ist. Das hat meine Sicht auf Zeitarbeit komplett verändert.',
  authorName = 'Sandra K.',
  authorTitle = 'Fachkrankenpflegerin Intensiv · seit 2024 bei Samaritano',
  authorImage = '/uploads/_DSC9603.jpg',
}: QuoteProps) {
  // Wir markieren das Wort "ich" im Standardtext - bei Custom-Text einfach roh anzeigen
  const isDefault =
    text ===
    'Bei Samaritano werde ich gefragt, wo ich arbeiten möchte, nicht, wo gerade ein Loch zu stopfen ist. Das hat meine Sicht auf Zeitarbeit komplett verändert.'

  return (
    <section className="section-pad" data-screen-label="Stimme">
      <div className="wrap">
        <div className="mx-auto max-w-[1100px]">
          <div
            aria-hidden
            className="font-serif text-sky"
            style={{ fontSize: 240, lineHeight: 0.5, height: 80 }}
          >
            “
          </div>
          <p className="h2 my-10 max-w-[1000px] font-light leading-[1.15]">
            {isDefault ? (
              <>
                Bei Samaritano werde ich gefragt, wo <em className="text-sky">ich</em> arbeiten möchte, nicht, wo
                gerade ein Loch zu stopfen ist. Das hat meine Sicht auf Zeitarbeit komplett verändert.
              </>
            ) : (
              text
            )}
          </p>
          <div className="mt-12 flex items-center gap-5">
            <img
              src={authorImage}
              alt={authorName}
              className="h-16 w-16 rounded-full object-cover"
            />
            <div>
              <div className="font-serif text-[22px]">{authorName}</div>
              <div className="meta">{authorTitle}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
