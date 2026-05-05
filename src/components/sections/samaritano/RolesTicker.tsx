const DEFAULT_ROLES = [
  'Anästhesietechnischer Assistent',
  'Operationstechnischer Assistent',
  'Pflegefachfrau',
  'Fachkrankenpfleger Intensiv',
  'Altenpfleger',
  'Gesundheits- und Kinderkrankenpfleger',
  'Pflegefachmann',
  'Hebamme',
  'Praxisanleiter',
  'Notfallsanitäter',
  'Heilerziehungspfleger',
]

interface RolesTickerProps {
  roles?: string[]
}

export function RolesTicker({ roles = DEFAULT_ROLES }: RolesTickerProps) {
  // doppeln fuer endlose Marquee
  const items = [...roles, ...roles]
  return (
    <div className="overflow-hidden border-y border-line bg-paper-2 py-6">
      <div className="ticker">
        {items.map((role, i) => (
          <div
            key={`${role}-${i}`}
            className="inline-flex items-center gap-8 whitespace-nowrap px-8 font-serif text-2xl font-light text-ink"
          >
            <span>{role}</span>
            <span aria-hidden className="text-sky">
              ✦
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
