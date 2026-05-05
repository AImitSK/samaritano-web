import { defineType, defineField } from 'sanity'

export const milestone = defineType({
  name: 'milestone',
  title: 'Meilensteine',
  type: 'document',
  fields: [
    defineField({
      name: 'year',
      title: 'Jahr',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'z.B. "2020" oder "1985"',
    }),
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'z.B. "Gruendung" oder "Neuer Standort"',
    }),
    defineField({
      name: 'description',
      title: 'Beschreibung',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Bild',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Optional: Bild zum Meilenstein',
    }),
  ],
  orderings: [
    {
      title: 'Jahr (neueste zuerst)',
      name: 'yearDesc',
      by: [{ field: 'year', direction: 'desc' }],
    },
    {
      title: 'Jahr (aelteste zuerst)',
      name: 'yearAsc',
      by: [{ field: 'year', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      year: 'year',
      media: 'image',
    },
    prepare({ title, year, media }) {
      return {
        title: `${year} - ${title}`,
        media,
      }
    },
  },
})
