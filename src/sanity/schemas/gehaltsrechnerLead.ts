import { defineType, defineField } from 'sanity'

export const gehaltsrechnerLead = defineType({
  name: 'gehaltsrechnerLead',
  title: 'Gehaltsrechner-Leads',
  type: 'document',
  fieldsets: [
    { name: 'contact', title: 'Kontaktdaten', options: { collapsible: true, collapsed: false } },
    { name: 'config', title: 'Rechner-Konfiguration', options: { collapsible: true, collapsed: false } },
    { name: 'result', title: 'Ergebnis', options: { collapsible: true, collapsed: false } },
    { name: 'internal', title: 'Intern', options: { collapsible: true, collapsed: false } },
  ],
  fields: [
    defineField({ name: 'salutation', title: 'Anrede', type: 'string', fieldset: 'contact', readOnly: true }),
    defineField({ name: 'name', title: 'Name', type: 'string', fieldset: 'contact', readOnly: true }),
    defineField({ name: 'email', title: 'E-Mail', type: 'string', fieldset: 'contact', readOnly: true }),

    defineField({ name: 'role', title: 'Beruf', type: 'string', fieldset: 'config', readOnly: true }),
    defineField({ name: 'hours', title: 'Wochenstunden', type: 'number', fieldset: 'config', readOnly: true }),
    defineField({ name: 'experience', title: 'Berufserfahrung (Jahre)', type: 'number', fieldset: 'config', readOnly: true }),
    defineField({ name: 'nightShifts', title: 'Nachtdienste/Monat', type: 'number', fieldset: 'config', readOnly: true }),
    defineField({ name: 'weekendShifts', title: 'Wochenend-Dienste/Monat', type: 'number', fieldset: 'config', readOnly: true }),
    defineField({ name: 'holidayShifts', title: 'Feiertags-Dienste/Jahr', type: 'number', fieldset: 'config', readOnly: true }),

    defineField({ name: 'calculatedSalary', title: 'Samaritano-Gehalt (brutto)', type: 'number', fieldset: 'result', readOnly: true }),
    defineField({ name: 'tarifSalary', title: 'Tarif-Vergleichswert', type: 'number', fieldset: 'result', readOnly: true }),

    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      fieldset: 'internal',
      options: {
        list: [
          { title: 'Neu', value: 'neu' },
          { title: 'Kontaktiert', value: 'kontaktiert' },
          { title: 'Beworben', value: 'beworben' },
          { title: 'Kein Interesse', value: 'kein_interesse' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'neu',
    }),
    defineField({ name: 'notes', title: 'Interne Notizen', type: 'text', rows: 4, fieldset: 'internal' }),
    defineField({ name: 'submittedAt', title: 'Eingegangen am', type: 'datetime', readOnly: true }),
  ],
  orderings: [
    { title: 'Neueste zuerst', name: 'submittedDesc', by: [{ field: 'submittedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { name: 'name', role: 'role', salary: 'calculatedSalary', status: 'status', date: 'submittedAt' },
    prepare({ name, role, salary, status, date }) {
      const labels: Record<string, string> = {
        neu: '🔵 Neu', kontaktiert: '🟡 Kontaktiert', beworben: '🟢 Beworben', kein_interesse: '⚪ Kein Interesse',
      }
      const d = date ? new Date(date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''
      return {
        title: `${name || 'Unbekannt'} — ${role || ''} (${salary ? salary.toLocaleString('de-DE') + ' €' : ''})`,
        subtitle: `${labels[status] || 'Neu'} · ${d}`,
      }
    },
  },
})
