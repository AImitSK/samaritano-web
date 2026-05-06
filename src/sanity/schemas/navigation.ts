import { defineType, defineField, defineArrayMember } from 'sanity'

// Nav-Item: einfach Label + URL. Interne URLs als Pfad ('/jobs'), externe als 'https://...'
const childNavItem = defineArrayMember({
  name: 'childNavItem',
  title: 'Untermenüpunkt',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'string',
      description: 'Interner Pfad (z.B. /jobs) oder externe URL (https://...)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'In neuem Tab öffnen',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { label: 'label', href: 'href' },
    prepare({ label, href }) {
      return { title: label || 'Ohne Titel', subtitle: href }
    },
  },
})

const navItem = defineArrayMember({
  name: 'navItem',
  title: 'Menüpunkt',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'string',
      description: 'Interner Pfad (z.B. /jobs) oder externe URL (https://...). Leer lassen für Dropdown ohne eigene Seite.',
    }),
    defineField({
      name: 'openInNewTab',
      title: 'In neuem Tab öffnen',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'children',
      title: 'Untermenüpunkte',
      type: 'array',
      of: [childNavItem],
    }),
  ],
  preview: {
    select: {
      label: 'label',
      href: 'href',
      childCount: 'children',
    },
    prepare({ label, href, childCount }) {
      const children = childCount?.length || 0
      const subtitle =
        children > 0
          ? `${href || '(Dropdown)'} · ${children} Untermenüpunkte`
          : href || ''
      return { title: label || 'Ohne Titel', subtitle }
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
      title: 'Hauptnavigation (Header)',
      description: 'Menüpunkte per Drag & Drop sortieren. Untermenüs über "Untermenüpunkte" hinzufügen.',
      type: 'array',
      of: [navItem],
    }),
    defineField({
      name: 'footerNav',
      title: 'Footer-Navigation',
      description: 'Links in der "Unternehmen"-Spalte des Footers. Per Drag & Drop sortieren.',
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
