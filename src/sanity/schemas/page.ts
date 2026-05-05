import { defineType, defineField } from 'sanity'

export const PAGE_TYPES = [
  { title: 'Standard', value: 'standard' },
  { title: 'Home', value: 'home' },
  { title: 'Blog', value: 'blog' },
  { title: 'Karriere', value: 'karriere' },
  { title: 'Aktuelles', value: 'aktuelles' },
  { title: 'Downloads', value: 'downloads' },
  { title: 'Kontakt', value: 'kontakt' },
  { title: 'Team', value: 'team' },
  { title: 'Timeline', value: 'timeline' },
  { title: 'Impressum', value: 'impressum' },
  { title: 'Datenschutz', value: 'datenschutz' },
] as const

export const page = defineType({
  name: 'page',
  title: 'Seiten',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Seitenname',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL-Pfad',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pageType',
      title: 'Seitentyp',
      type: 'string',
      options: {
        list: [...PAGE_TYPES],
        layout: 'dropdown',
      },
      initialValue: 'standard',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  orderings: [
    {
      title: 'Titel A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      pageType: 'pageType',
    },
    prepare({ title, slug, pageType }) {
      const typeLabel = PAGE_TYPES.find((t) => t.value === pageType)?.title || pageType
      return {
        title,
        subtitle: `${typeLabel} — /${slug || ''}`,
      }
    },
  },
})
