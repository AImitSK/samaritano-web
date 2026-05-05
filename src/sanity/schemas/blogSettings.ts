import { defineType, defineField } from 'sanity'

export const blogSettings = defineType({
  name: 'blogSettings',
  title: 'Blog-Einstellungen',
  type: 'document',
  groups: [
    { name: 'layout', title: 'Layout', default: true },
    { name: 'cards', title: 'Artikelkarten' },
    { name: 'author', title: 'Autor' },
    { name: 'detail', title: 'Detailseite' },
    { name: 'filter', title: 'Filter & Sortierung' },
  ],
  fields: [
    // ─── Layout ───
    defineField({
      name: 'gridColumns',
      title: 'Grid-Spalten',
      type: 'number',
      group: 'layout',
      description: 'Anzahl der Spalten im Artikel-Grid',
      options: {
        list: [
          { title: '1 Spalte (Liste)', value: 1 },
          { title: '2 Spalten', value: 2 },
          { title: '3 Spalten', value: 3 },
        ],
      },
      initialValue: 1,
    }),
    defineField({
      name: 'postsPerPage',
      title: 'Artikel pro Seite',
      type: 'number',
      group: 'layout',
      description: '0 = alle Artikel anzeigen',
      options: {
        list: [
          { title: '6 Artikel', value: 6 },
          { title: '9 Artikel', value: 9 },
          { title: '12 Artikel', value: 12 },
          { title: 'Alle', value: 0 },
        ],
      },
      initialValue: 0,
    }),
    defineField({
      name: 'pagination',
      title: 'Pagination',
      type: 'string',
      group: 'layout',
      options: {
        list: [
          { title: 'Load More Button', value: 'loadMore' },
          { title: 'Seitenzahlen', value: 'pages' },
          { title: 'Keine (alle anzeigen)', value: 'none' },
        ],
        layout: 'radio',
      },
      initialValue: 'none',
      hidden: ({ parent }) => !parent?.postsPerPage,
    }),

    // ─── Artikelkarten ───
    defineField({
      name: 'showImage',
      title: 'Bild anzeigen',
      type: 'boolean',
      group: 'cards',
      initialValue: true,
    }),
    defineField({
      name: 'imageRatio',
      title: 'Bildverhältnis',
      type: 'string',
      group: 'cards',
      options: {
        list: [
          { title: '16:9 (Widescreen)', value: '16/9' },
          { title: '4:3 (Standard)', value: '4/3' },
          { title: '1:1 (Quadrat)', value: '1/1' },
          { title: 'Frei (Originalgröße)', value: 'auto' },
        ],
      },
      initialValue: '16/9',
      hidden: ({ parent }) => !parent?.showImage,
    }),
    defineField({
      name: 'showExcerpt',
      title: 'Kurzfassung anzeigen',
      type: 'boolean',
      group: 'cards',
      initialValue: true,
    }),
    defineField({
      name: 'excerptMaxChars',
      title: 'Max. Zeichen Kurzfassung',
      type: 'number',
      group: 'cards',
      description: '0 = nicht kürzen',
      initialValue: 150,
      hidden: ({ parent }) => !parent?.showExcerpt,
    }),
    defineField({
      name: 'showDate',
      title: 'Datum anzeigen',
      type: 'boolean',
      group: 'cards',
      initialValue: true,
    }),
    defineField({
      name: 'dateFormat',
      title: 'Datumsformat',
      type: 'string',
      group: 'cards',
      options: {
        list: [
          { title: '01.01.2026', value: 'short' },
          { title: '1. Januar 2026', value: 'long' },
          { title: 'vor 3 Tagen', value: 'relative' },
        ],
      },
      initialValue: 'long',
      hidden: ({ parent }) => !parent?.showDate,
    }),
    defineField({
      name: 'showCategory',
      title: 'Kategorie anzeigen',
      type: 'boolean',
      group: 'cards',
      initialValue: true,
    }),
    defineField({
      name: 'showReadingTime',
      title: 'Lesezeit anzeigen',
      type: 'boolean',
      group: 'cards',
      description: 'Geschätzte Lesezeit basierend auf Wortanzahl',
      initialValue: false,
    }),

    // ─── Autor ───
    defineField({
      name: 'showAuthor',
      title: 'Autor anzeigen',
      type: 'boolean',
      group: 'author',
      initialValue: true,
    }),
    defineField({
      name: 'showAuthorImage',
      title: 'Autorbild anzeigen',
      type: 'boolean',
      group: 'author',
      initialValue: false,
      hidden: ({ parent }) => !parent?.showAuthor,
    }),
    defineField({
      name: 'showAuthorPosition',
      title: 'Position des Autors anzeigen',
      type: 'boolean',
      group: 'author',
      description: 'z.B. "Geschäftsführer" unter dem Autornamen',
      initialValue: false,
      hidden: ({ parent }) => !parent?.showAuthor,
    }),

    // ─── Detailseite ───
    defineField({
      name: 'showHeroImage',
      title: 'Hauptbild anzeigen',
      type: 'boolean',
      group: 'detail',
      description: 'Großes Bild am Anfang des Artikels',
      initialValue: true,
    }),
    defineField({
      name: 'showSharingButtons',
      title: 'Sharing-Buttons anzeigen',
      type: 'boolean',
      group: 'detail',
      description: 'Teilen auf Social Media',
      initialValue: false,
    }),
    defineField({
      name: 'sharingPlatforms',
      title: 'Sharing-Plattformen',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'detail',
      options: {
        list: [
          { title: 'Facebook', value: 'facebook' },
          { title: 'Twitter/X', value: 'twitter' },
          { title: 'LinkedIn', value: 'linkedin' },
          { title: 'WhatsApp', value: 'whatsapp' },
          { title: 'E-Mail', value: 'email' },
          { title: 'Link kopieren', value: 'copy' },
        ],
      },
      hidden: ({ parent }) => !parent?.showSharingButtons,
    }),
    defineField({
      name: 'showRelatedPosts',
      title: 'Ähnliche Artikel anzeigen',
      type: 'boolean',
      group: 'detail',
      initialValue: false,
    }),
    defineField({
      name: 'relatedPostsCount',
      title: 'Anzahl ähnliche Artikel',
      type: 'number',
      group: 'detail',
      options: {
        list: [
          { title: '2 Artikel', value: 2 },
          { title: '3 Artikel', value: 3 },
          { title: '4 Artikel', value: 4 },
        ],
      },
      initialValue: 3,
      hidden: ({ parent }) => !parent?.showRelatedPosts,
    }),
    defineField({
      name: 'showPostNavigation',
      title: 'Artikel-Navigation',
      type: 'boolean',
      group: 'detail',
      description: 'Links zu "Vorheriger Artikel" und "Nächster Artikel"',
      initialValue: false,
    }),

    // ─── Filter & Sortierung ───
    defineField({
      name: 'showCategoryFilter',
      title: 'Kategorie-Filter anzeigen',
      type: 'boolean',
      group: 'filter',
      description: 'Dropdown oder Tabs zum Filtern nach Kategorie',
      initialValue: false,
    }),
    defineField({
      name: 'showSearch',
      title: 'Suchfeld anzeigen',
      type: 'boolean',
      group: 'filter',
      initialValue: false,
    }),
    defineField({
      name: 'defaultSort',
      title: 'Standard-Sortierung',
      type: 'string',
      group: 'filter',
      options: {
        list: [
          { title: 'Neueste zuerst', value: 'newest' },
          { title: 'Älteste zuerst', value: 'oldest' },
        ],
        layout: 'radio',
      },
      initialValue: 'newest',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Blog-Einstellungen' }
    },
  },
})
