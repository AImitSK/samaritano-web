import { defineType, defineField } from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  groups: [
    { name: 'seo', title: 'SEO', default: true },
    { name: 'social', title: 'Social Media' },
    { name: 'advanced', title: 'Erweitert' },
  ],
  fields: [
    // ─── SEO Tab ───
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
      description: 'Titel in Suchergebnissen. Optimal: 50–60 Zeichen.',
      validation: (Rule) =>
        Rule.max(70)
          .warning('Über 60 Zeichen wird in Google abgeschnitten.')
          .error('Maximal 70 Zeichen erlaubt.'),
    }),
    defineField({
      name: 'titleTemplate',
      title: 'Firmenname anhängen?',
      type: 'boolean',
      group: 'seo',
      description: 'Zeigt "Titel | Firmenname" in Suchergebnissen',
      initialValue: true,
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'Beschreibung in Suchergebnissen. Optimal: 140–160 Zeichen.',
      validation: (Rule) =>
        Rule.max(170)
          .warning('Über 160 Zeichen wird in Google abgeschnitten.')
          .error('Maximal 170 Zeichen erlaubt.'),
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'seo',
      options: { layout: 'tags' },
      description: 'Suchbegriffe für diese Seite (kommagetrennt eingeben)',
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      group: 'seo',
      description: 'Nur setzen wenn dieser Inhalt unter einer anderen URL existiert.',
    }),
    defineField({
      name: 'noIndex',
      title: 'Von Google ausschließen',
      type: 'boolean',
      group: 'seo',
      description: 'Seite wird nicht in Suchergebnissen angezeigt.',
      initialValue: false,
    }),
    defineField({
      name: 'noFollow',
      title: 'Links nicht folgen',
      type: 'boolean',
      group: 'seo',
      description: 'Google folgt Links auf dieser Seite nicht.',
      initialValue: false,
    }),

    // ─── Social Media Tab ───
    defineField({
      name: 'metaImage',
      title: 'Standard-Bild',
      type: 'image',
      group: 'social',
      description: 'Wird für Social Media verwendet wenn kein OG/Twitter-Bild gesetzt ist. Empfohlen: 1200×630px.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'ogTitle',
      title: 'OG Title',
      type: 'string',
      group: 'social',
      description: 'Titel beim Teilen auf Facebook/LinkedIn. Fallback: Meta Title.',
    }),
    defineField({
      name: 'ogDescription',
      title: 'OG Description',
      type: 'text',
      rows: 3,
      group: 'social',
      description: 'Beschreibung beim Teilen. Fallback: Meta Description.',
    }),
    defineField({
      name: 'ogImage',
      title: 'OG Image',
      type: 'image',
      group: 'social',
      description: 'Bild beim Teilen auf Facebook/LinkedIn. Fallback: Standard-Bild.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'twitterTitle',
      title: 'Twitter/X Title',
      type: 'string',
      group: 'social',
      description: 'Titel beim Teilen auf X. Fallback: OG Title.',
    }),
    defineField({
      name: 'twitterDescription',
      title: 'Twitter/X Description',
      type: 'text',
      rows: 3,
      group: 'social',
      description: 'Beschreibung für X. Fallback: OG Description.',
    }),
    defineField({
      name: 'twitterImage',
      title: 'Twitter/X Image',
      type: 'image',
      group: 'social',
      description: 'Bild für X. Fallback: OG Image → Standard-Bild.',
      options: { hotspot: true },
    }),

    // ─── Erweitert Tab ───
    defineField({
      name: 'breadcrumbTitle',
      title: 'Breadcrumb Titel',
      type: 'string',
      group: 'advanced',
      description: 'Kurztitel für Breadcrumbs. Fallback: Seitenname.',
    }),
    defineField({
      name: 'schemaType',
      title: 'Schema.org Typ',
      type: 'string',
      group: 'advanced',
      description: 'Strukturierte Daten für Google Rich Results.',
      options: {
        list: [
          { title: 'WebPage (Standard)', value: 'WebPage' },
          { title: 'Article (Blog/News)', value: 'Article' },
          { title: 'FAQPage', value: 'FAQPage' },
          { title: 'ContactPage', value: 'ContactPage' },
          { title: 'AboutPage', value: 'AboutPage' },
        ],
      },
      initialValue: 'WebPage',
    }),
    defineField({
      name: 'isCornerstone',
      title: 'Cornerstone Content',
      type: 'boolean',
      group: 'advanced',
      description: 'Markiert diese Seite als besonders wichtigen Inhalt.',
      initialValue: false,
    }),
  ],
})
