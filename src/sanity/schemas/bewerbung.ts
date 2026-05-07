import { defineType, defineField } from 'sanity'

export const bewerbung = defineType({
  name: 'bewerbung',
  title: 'Bewerbungen',
  type: 'document',
  fieldsets: [
    {
      name: 'applicant',
      title: 'Bewerberdaten',
      options: { collapsible: true, collapsed: false },
    },
    {
      name: 'experience',
      title: 'Berufserfahrung & Motivation',
      options: { collapsible: true, collapsed: false },
    },
    {
      name: 'internal',
      title: 'Intern',
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    // ─── Bewerberdaten (readOnly) ───
    defineField({
      name: 'applicantName',
      title: 'Name',
      type: 'string',
      fieldset: 'applicant',
      readOnly: true,
    }),
    defineField({
      name: 'email',
      title: 'E-Mail',
      type: 'string',
      fieldset: 'applicant',
      readOnly: true,
    }),
    defineField({
      name: 'phone',
      title: 'Telefon',
      type: 'string',
      fieldset: 'applicant',
      readOnly: true,
    }),
    defineField({
      name: 'address',
      title: 'Adresse',
      type: 'string',
      fieldset: 'applicant',
      readOnly: true,
    }),
    defineField({
      name: 'callTime',
      title: 'Beste Anrufzeit',
      type: 'string',
      fieldset: 'applicant',
      readOnly: true,
    }),
    defineField({
      name: 'position',
      title: 'Position',
      type: 'string',
      fieldset: 'applicant',
      readOnly: true,
    }),
    defineField({
      name: 'jobReference',
      title: 'Verknuepfte Stelle',
      type: 'reference',
      to: [{ type: 'job' }],
      fieldset: 'applicant',
      readOnly: true,
    }),

    // ─── Berufserfahrung ───
    defineField({
      name: 'employers',
      title: 'Fruehere Arbeitgeber',
      type: 'array',
      fieldset: 'experience',
      readOnly: true,
      of: [
        {
          type: 'object',
          fields: [
            { name: 'employer', title: 'Arbeitgeber', type: 'string' },
            { name: 'period', title: 'Zeitraum', type: 'string' },
            { name: 'role', title: 'Position', type: 'string' },
          ],
          preview: {
            select: { title: 'employer', subtitle: 'period' },
          },
        },
      ],
    }),
    defineField({
      name: 'aboutYou',
      title: 'Ueber den Bewerber',
      type: 'text',
      rows: 5,
      fieldset: 'experience',
      readOnly: true,
    }),
    defineField({
      name: 'resume',
      title: 'Lebenslauf',
      type: 'file',
      fieldset: 'experience',
      readOnly: true,
      options: {
        accept: '.pdf,.doc,.docx',
      },
    }),

    // ─── Intern (editierbar) ───
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      fieldset: 'internal',
      options: {
        list: [
          { title: 'Neu', value: 'neu' },
          { title: 'In Bearbeitung', value: 'in_bearbeitung' },
          { title: 'Angenommen', value: 'angenommen' },
          { title: 'Abgelehnt', value: 'abgelehnt' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'neu',
    }),
    defineField({
      name: 'notes',
      title: 'Interne Notizen',
      type: 'text',
      rows: 4,
      fieldset: 'internal',
      description: 'Nur fuer interne Zwecke, nicht sichtbar fuer Bewerber',
    }),
    defineField({
      name: 'submittedAt',
      title: 'Eingegangen am',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'expiresAt',
      title: 'Wird geloescht am',
      type: 'datetime',
      readOnly: true,
      description: 'Automatische Loeschung 6 Monate nach Einreichung (DSGVO)',
    }),
  ],
  orderings: [
    {
      title: 'Neueste zuerst',
      name: 'submittedDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      name: 'applicantName',
      position: 'position',
      status: 'status',
      date: 'submittedAt',
    },
    prepare({ name, position, status, date }) {
      const statusLabels: Record<string, string> = {
        neu: '🔵 Neu',
        in_bearbeitung: '🟡 In Bearbeitung',
        angenommen: '🟢 Angenommen',
        abgelehnt: '🔴 Abgelehnt',
      }
      const dateStr = date
        ? new Date(date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : ''
      return {
        title: `${name || 'Unbekannt'} — ${position || ''}`,
        subtitle: `${statusLabels[status] || status || 'Neu'} · ${dateStr}`,
      }
    },
  },
})
