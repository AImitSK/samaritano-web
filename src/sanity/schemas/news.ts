import { defineType, defineField } from 'sanity'

export const news = defineType({
  name: 'news',
  title: 'News',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
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
      name: 'date',
      title: 'Datum',
      type: 'date',
      options: {
        dateFormat: 'DD.MM.YYYY',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Art',
      type: 'string',
      options: {
        list: [
          { title: 'News', value: 'news' },
          { title: 'Messe', value: 'messe' },
          { title: 'Event', value: 'event' },
          { title: 'Pressemitteilung', value: 'presse' },
        ],
      },
      initialValue: 'news',
    }),
    defineField({
      name: 'excerpt',
      title: 'Kurztext',
      type: 'text',
      rows: 3,
      description: 'Kurze Zusammenfassung für Vorschau',
    }),
    defineField({
      name: 'image',
      title: 'Bild',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'content',
      title: 'Inhalt',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
          ],
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'location',
      title: 'Ort',
      type: 'string',
      description: 'Optional: Veranstaltungsort (z.B. für Messen)',
    }),
  ],
  orderings: [
    {
      title: 'Datum, Neu',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      type: 'type',
      media: 'image',
    },
    prepare({ title, date, type, media }) {
      const typeLabels: Record<string, string> = {
        news: 'News',
        messe: 'Messe',
        event: 'Event',
        presse: 'Presse',
      }
      return {
        title,
        subtitle: `${typeLabels[type] || type} - ${date || 'Kein Datum'}`,
        media,
      }
    },
  },
})
