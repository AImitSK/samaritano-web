import { defineType, defineField, defineArrayMember } from 'sanity'

// Nav-Item: Entweder Seiten-Referenz oder externer Link, optional mit Kindern
const navItem = defineArrayMember({
  name: 'navItem',
  title: 'Menüpunkt',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Angezeigter Text (leer = Seitenname wird verwendet)',
    }),
    defineField({
      name: 'type',
      title: 'Link-Typ',
      type: 'string',
      options: {
        list: [
          { title: 'Interne Seite', value: 'internal' },
          { title: 'Externer Link', value: 'external' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'internal',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'page',
      title: 'Seite',
      type: 'reference',
      to: [{ type: 'page' }],
      hidden: ({ parent }) => parent?.type !== 'internal',
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'string',
      description: 'Externer Link (https://...) oder # für Dropdown ohne eigene Seite',
      hidden: ({ parent }) => parent?.type !== 'external',
    }),
    defineField({
      name: 'openInNewTab',
      title: 'In neuem Tab öffnen',
      type: 'boolean',
      initialValue: false,
      hidden: ({ parent }) => parent?.type !== 'external',
    }),
    defineField({
      name: 'children',
      title: 'Untermenüpunkte',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'childNavItem',
          title: 'Untermenüpunkt',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Angezeigter Text (leer = Seitenname)',
            }),
            defineField({
              name: 'type',
              title: 'Link-Typ',
              type: 'string',
              options: {
                list: [
                  { title: 'Interne Seite', value: 'internal' },
                  { title: 'Externer Link', value: 'external' },
                ],
                layout: 'radio',
                direction: 'horizontal',
              },
              initialValue: 'internal',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'page',
              title: 'Seite',
              type: 'reference',
              to: [{ type: 'page' }],
              hidden: ({ parent }) => parent?.type !== 'internal',
            }),
            defineField({
              name: 'href',
              title: 'URL',
              type: 'string',
              hidden: ({ parent }) => parent?.type !== 'external',
            }),
            defineField({
              name: 'openInNewTab',
              title: 'In neuem Tab öffnen',
              type: 'boolean',
              initialValue: false,
              hidden: ({ parent }) => parent?.type !== 'external',
            }),
          ],
          preview: {
            select: {
              label: 'label',
              pageTitle: 'page.title',
              href: 'href',
              type: 'type',
            },
            prepare({ label, pageTitle, href, type }) {
              return {
                title: label || pageTitle || href || 'Ohne Titel',
                subtitle: type === 'external' ? `↗ ${href || ''}` : '→ Interne Seite',
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      label: 'label',
      pageTitle: 'page.title',
      href: 'href',
      type: 'type',
      childCount: 'children',
    },
    prepare({ label, pageTitle, href, type, childCount }) {
      const title = label || pageTitle || href || 'Ohne Titel'
      const children = childCount?.length || 0
      const subtitle =
        type === 'external'
          ? `↗ ${href || ''}`
          : children > 0
            ? `→ Interne Seite · ${children} Untermenüpunkte`
            : '→ Interne Seite'
      return { title, subtitle }
    },
  },
})

export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'mainNav',
      title: 'Hauptnavigation',
      description: 'Menüpunkte per Drag & Drop sortieren. Untermenüs über "Untermenüpunkte" hinzufügen.',
      type: 'array',
      of: [navItem],
    }),
    defineField({
      name: 'footerNav',
      title: 'Footer Navigation',
      description: 'Links im Footer. Per Drag & Drop sortieren.',
      type: 'array',
      of: [navItem],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Navigation' }
    },
  },
})
