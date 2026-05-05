import { defineType, defineField } from 'sanity'

export const job = defineType({
  name: 'job',
  title: 'Stellenangebote',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Stellentitel',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'department',
      title: 'Abteilung',
      type: 'string',
    }),
    defineField({
      name: 'location',
      title: 'Standort',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Anstellungsart',
      type: 'string',
      options: {
        list: [
          { title: 'Vollzeit', value: 'vollzeit' },
          { title: 'Teilzeit', value: 'teilzeit' },
          { title: 'Ausbildung', value: 'ausbildung' },
          { title: 'Praktikum', value: 'praktikum' },
          { title: 'Werkstudent', value: 'werkstudent' },
          { title: 'Freelance', value: 'freelance' },
        ],
      },
      initialValue: 'vollzeit',
    }),
    defineField({
      name: 'role',
      title: 'Berufsbezeichnung',
      type: 'string',
      description: 'Z.B. ATA, OTA, Pflegefachkraft (wird als Tag angezeigt)',
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'string',
      description: 'Z.B. NRW, Niedersachsen (für Filter)',
    }),
    defineField({
      name: 'salary',
      title: 'Gehaltsspanne',
      type: 'string',
      description: 'Z.B. "4.800 – 5.600 €"',
    }),
    defineField({
      name: 'featured',
      title: 'Top-Job',
      type: 'boolean',
      initialValue: false,
      description: 'Auf der Startseite hervorheben',
    }),
    defineField({
      name: 'image',
      title: 'Bild',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Alt-Text',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Kurzbeschreibung',
      type: 'text',
      rows: 3,
      description: 'Kurze Zusammenfassung für Stellenliste',
    }),
    defineField({
      name: 'description',
      title: 'Stellenbeschreibung',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
        },
      ],
    }),
    defineField({
      name: 'requirements',
      title: 'Anforderungen',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Liste der Anforderungen (eine pro Zeile)',
    }),
    defineField({
      name: 'benefits',
      title: 'Wir bieten',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Liste der Benefits (eine pro Zeile)',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Kontakt E-Mail',
      type: 'string',
      description: 'E-Mail für Bewerbungen (optional, sonst Standard)',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Veröffentlicht am',
      type: 'date',
    }),
    defineField({
      name: 'isActive',
      title: 'Aktiv',
      type: 'boolean',
      description: 'Deaktivieren um Stelle zu verbergen',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Veröffentlichungsdatum',
      name: 'publishedDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      location: 'location',
      type: 'type',
      isActive: 'isActive',
    },
    prepare({ title, location, type, isActive }) {
      return {
        title: `${isActive ? '' : '[INAKTIV] '}${title}`,
        subtitle: `${location} - ${type}`,
      }
    },
  },
})
