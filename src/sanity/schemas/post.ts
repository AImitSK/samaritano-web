import { defineType, defineField } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Blog Artikel',
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
      name: 'excerpt',
      title: 'Kurzfassung',
      type: 'text',
      rows: 3,
      description: 'Kurze Zusammenfassung für Vorschau',
    }),
    defineField({
      name: 'mainImage',
      title: 'Hauptbild',
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
      name: 'author',
      title: 'Autor',
      type: 'object',
      description: 'Name und (optional) Foto des Autors. Optional.',
      fields: [
        { name: 'name', title: 'Name', type: 'string' },
        {
          name: 'image',
          title: 'Foto',
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', title: 'Alt-Text', type: 'string' }],
        },
      ],
    }),
    defineField({
      name: 'categories',
      title: 'Kategorien',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Veröffentlicht am',
      type: 'datetime',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
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
            { title: 'H4', value: 'h4' },
            { title: 'Zitat', value: 'blockquote' },
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
            {
              name: 'caption',
              title: 'Bildunterschrift',
              type: 'string',
            },
          ],
        },
      ],
    }),
  ],
  orderings: [
    {
      title: 'Veröffentlichungsdatum, Neu',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      date: 'publishedAt',
    },
    prepare({ title, media, date }) {
      return {
        title,
        media,
        subtitle: date ? new Date(date).toLocaleDateString('de-DE') : 'Entwurf',
      }
    },
  },
})
