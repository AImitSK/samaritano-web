import { defineType, defineField } from 'sanity'

export const download = defineType({
  name: 'download',
  title: 'Downloads',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Beschreibung',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'file',
      title: 'Datei',
      type: 'file',
      validation: (Rule) => Rule.required(),
      options: {
        accept: '.pdf,.doc,.docx,.xls,.xlsx,.zip,.png,.jpg,.jpeg',
      },
    }),
    defineField({
      name: 'category',
      title: 'Kategorie',
      type: 'string',
      options: {
        list: [
          { title: 'Katalog', value: 'katalog' },
          { title: 'Datenblatt', value: 'datenblatt' },
          { title: 'Broschüre', value: 'broschuere' },
          { title: 'Zertifikat', value: 'zertifikat' },
          { title: 'Anleitung', value: 'anleitung' },
          { title: 'Sonstiges', value: 'sonstiges' },
        ],
      },
      initialValue: 'sonstiges',
    }),
    defineField({
      name: 'fileSize',
      title: 'Dateigröße',
      type: 'string',
      description: 'z.B. "2.5 MB" (optional)',
    }),
    defineField({
      name: 'language',
      title: 'Sprache',
      type: 'string',
      options: {
        list: [
          { title: 'Deutsch', value: 'de' },
          { title: 'Englisch', value: 'en' },
          { title: 'Französisch', value: 'fr' },
        ],
      },
      initialValue: 'de',
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
    {
      title: 'Kategorie',
      name: 'categoryAsc',
      by: [{ field: 'category', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      fileSize: 'fileSize',
    },
    prepare({ title, category, fileSize }) {
      const categoryLabels: Record<string, string> = {
        katalog: 'Katalog',
        datenblatt: 'Datenblatt',
        broschuere: 'Broschüre',
        zertifikat: 'Zertifikat',
        anleitung: 'Anleitung',
        sonstiges: 'Sonstiges',
      }
      return {
        title,
        subtitle: `${categoryLabels[category] || category}${fileSize ? ` - ${fileSize}` : ''}`,
      }
    },
  },
})
