import { defineType, defineField } from 'sanity'

export const legal = defineType({
  name: 'legal',
  title: 'Rechtliche Seiten',
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
      name: 'type',
      title: 'Seitentyp',
      type: 'string',
      options: {
        list: [
          { title: 'Impressum', value: 'impressum' },
          { title: 'Datenschutz', value: 'datenschutz' },
          { title: 'AGB', value: 'agb' },
          { title: 'Widerruf', value: 'widerruf' },
          { title: 'Sonstige', value: 'sonstige' },
        ],
      },
      validation: (Rule) => Rule.required(),
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
          ],
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
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                ],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Zuletzt aktualisiert',
      type: 'date',
      description: 'Wird auf der Seite angezeigt',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      type: 'type',
    },
    prepare({ title, type }) {
      const typeLabels: Record<string, string> = {
        impressum: 'Impressum',
        datenschutz: 'Datenschutz',
        agb: 'AGB',
        widerruf: 'Widerruf',
        sonstige: 'Sonstige',
      }
      return {
        title,
        subtitle: typeLabels[type] || type,
      }
    },
  },
})
