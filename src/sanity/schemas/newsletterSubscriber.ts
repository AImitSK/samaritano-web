import { defineType, defineField } from 'sanity'

export const newsletterSubscriber = defineType({
  name: 'newsletterSubscriber',
  title: 'Newsletter-Abonnenten',
  type: 'document',
  fieldsets: [
    {
      name: 'contact',
      title: 'Kontaktdaten',
      options: { collapsible: true, collapsed: false },
    },
    {
      name: 'internal',
      title: 'Intern',
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    // ─── Kontaktdaten (readOnly) ───
    defineField({
      name: 'salutation',
      title: 'Anrede',
      type: 'string',
      fieldset: 'contact',
      readOnly: true,
      options: {
        list: [
          { title: 'Herr', value: 'Herr' },
          { title: 'Frau', value: 'Frau' },
          { title: 'Divers', value: 'Divers' },
        ],
      },
    }),
    defineField({
      name: 'firstName',
      title: 'Vorname',
      type: 'string',
      fieldset: 'contact',
      readOnly: true,
    }),
    defineField({
      name: 'lastName',
      title: 'Nachname',
      type: 'string',
      fieldset: 'contact',
      readOnly: true,
    }),
    defineField({
      name: 'email',
      title: 'E-Mail',
      type: 'string',
      fieldset: 'contact',
      readOnly: true,
    }),

    // ─── Tokens (hidden) ───
    defineField({
      name: 'confirmToken',
      title: 'Bestaetigungs-Token',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'unsubscribeToken',
      title: 'Abmelde-Token',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),

    // ─── Intern (editierbar) ───
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      fieldset: 'internal',
      options: {
        list: [
          { title: 'Ausstehend', value: 'ausstehend' },
          { title: 'Aktiv', value: 'aktiv' },
          { title: 'Abgemeldet', value: 'abgemeldet' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'ausstehend',
    }),
    defineField({
      name: 'notes',
      title: 'Interne Notizen',
      type: 'text',
      rows: 4,
      fieldset: 'internal',
      description: 'Nur fuer interne Zwecke',
    }),
    defineField({
      name: 'source',
      title: 'Quelle',
      type: 'string',
      readOnly: true,
      description: 'Wo die Anmeldung erfolgte',
    }),

    // ─── Timestamps ───
    defineField({
      name: 'subscribedAt',
      title: 'Angemeldet am',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'confirmedAt',
      title: 'Bestaetigt am',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'unsubscribedAt',
      title: 'Abgemeldet am',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: 'Neueste zuerst',
      name: 'subscribedDesc',
      by: [{ field: 'subscribedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      status: 'status',
      date: 'subscribedAt',
    },
    prepare({ firstName, lastName, email, status, date }) {
      const statusLabels: Record<string, string> = {
        ausstehend: '🟡 Ausstehend',
        aktiv: '🟢 Aktiv',
        abgemeldet: '🔴 Abgemeldet',
      }
      const dateStr = date
        ? new Date(date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : ''
      return {
        title: `${firstName || ''} ${lastName || ''} — ${email || ''}`,
        subtitle: `${statusLabels[status] || status || 'Ausstehend'} · ${dateStr}`,
      }
    },
  },
})
