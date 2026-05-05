import { defineType, defineField } from 'sanity'

export const jobCategory = defineType({
  name: 'jobCategory',
  title: 'Stellen-Kategorien',
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
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Kurzbeschreibung',
      type: 'text',
      rows: 2,
      description: 'Optional, z.B. fuer Filter-Tooltip',
    }),
  ],
  orderings: [
    {
      title: 'Titel A–Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title' },
  },
})
