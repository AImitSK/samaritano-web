import { defineType, defineField } from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonials',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'z.B. "Anna-Lena P."',
    }),
    defineField({
      name: 'role',
      title: 'Rolle / Position',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'z.B. "Pflegefachkraft"',
    }),
    defineField({
      name: 'quote',
      title: 'Zitat',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Foto',
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
      name: 'context',
      title: 'Kontext',
      type: 'string',
      options: {
        list: [
          { title: 'Pflegekräfte', value: 'pflegekraefte' },
          { title: 'Einrichtungen', value: 'einrichtungen' },
          { title: 'Allgemein', value: 'allgemein' },
        ],
      },
      initialValue: 'pflegekraefte',
      description: 'Auf welcher Seite soll das Testimonial erscheinen?',
    }),
    defineField({
      name: 'order',
      title: 'Reihenfolge',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Reihenfolge',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'image',
    },
  },
})
