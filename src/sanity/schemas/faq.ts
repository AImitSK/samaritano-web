import { defineType, defineField } from 'sanity'

export const faq = defineType({
  name: 'faq',
  title: 'FAQ-Einträge',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Frage',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'question', maxLength: 96 },
      validation: (Rule) => Rule.required(),
      description: 'Wird für den Anker-Link auf /faq verwendet',
    }),
    defineField({
      name: 'categories',
      title: 'Kategorien',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'faqCategory' } }],
      validation: (Rule) => Rule.min(1).error('Mindestens eine Kategorie zuweisen'),
      description: 'Mehrfachauswahl möglich, z.B. wenn dieselbe FAQ auf Pflegekräfte- und Einrichtungs-Seite angezeigt werden soll',
    }),
    defineField({
      name: 'answer',
      title: 'Antwort',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [{ name: 'href', type: 'url', title: 'URL' }],
              },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Reihenfolge',
      type: 'number',
      description: 'Niedrigere Zahl = weiter oben innerhalb der Kategorie',
      initialValue: 0,
    }),
    defineField({
      name: 'featured',
      title: 'Top-FAQ',
      type: 'boolean',
      initialValue: false,
      description: 'Hervorhebung für Teaser auf der Übersichtsseite',
    }),
    defineField({
      name: 'isActive',
      title: 'Aktiv',
      type: 'boolean',
      initialValue: true,
      description: 'Deaktivieren um FAQ zu verbergen, ohne sie zu löschen',
    }),
  ],
  orderings: [
    {
      title: 'Reihenfolge (manuell)',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Frage A–Z',
      name: 'questionAsc',
      by: [{ field: 'question', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      question: 'question',
      isActive: 'isActive',
      cat0: 'categories.0.title',
    },
    prepare({ question, isActive, cat0 }) {
      return {
        title: `${isActive === false ? '[INAKTIV] ' : ''}${question}`,
        subtitle: cat0,
      }
    },
  },
})
