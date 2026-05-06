import { defineType, defineField } from 'sanity'

export const faqCategory = defineType({
  name: 'faqCategory',
  title: 'FAQ-Kategorien',
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
      description: 'Optional, wird als Intro-Text unter der Kategorie auf /faq angezeigt',
    }),
    defineField({
      name: 'order',
      title: 'Reihenfolge',
      type: 'number',
      description: 'Niedrigere Zahl = weiter oben',
      initialValue: 0,
    }),
    defineField({
      name: 'pageContext',
      title: 'Auto-Wiring auf Landing-Page',
      type: 'string',
      description:
        'Optional. "pflegekraefte" zeigt FAQs dieser Kategorie auf /pflegekraefte, "einrichtungen" auf /einrichtungen.',
      options: {
        list: [
          { title: '— keiner —', value: '' },
          { title: 'Pflegekräfte (/pflegekraefte)', value: 'pflegekraefte' },
          { title: 'Einrichtungen (/einrichtungen)', value: 'einrichtungen' },
        ],
        layout: 'radio',
      },
    }),
  ],
  orderings: [
    {
      title: 'Reihenfolge (manuell)',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Titel A–Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', pageContext: 'pageContext' },
    prepare({ title, pageContext }) {
      return {
        title,
        subtitle: pageContext ? `→ /${pageContext}` : undefined,
      }
    },
  },
})
