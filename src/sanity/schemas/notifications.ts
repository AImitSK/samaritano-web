import { defineType, defineField } from 'sanity'

export const notifications = defineType({
  name: 'notifications',
  title: 'Benachrichtigungen',
  type: 'document',
  groups: [
    { name: 'bewerbungen', title: 'Bewerbungen', default: true },
    { name: 'kontakt', title: 'Kontaktanfragen' },
    { name: 'gehaltsrechner', title: 'Gehaltsrechner' },
  ],
  fields: [
    // ─── Bewerbungen ───
    defineField({
      name: 'bewerbungenEmail',
      title: 'E-Mail',
      type: 'string',
      group: 'bewerbungen',
      description: 'Empfaenger fuer Bewerbungen (Fallback wenn beim Job keine eigene E-Mail hinterlegt ist)',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'bewerbungenSlack',
      title: 'Slack Webhook',
      type: 'url',
      group: 'bewerbungen',
      description: 'Optional: Slack-Benachrichtigung bei neuer Bewerbung',
    }),
    defineField({
      name: 'bewerbungenWebhook',
      title: 'Webhook URL',
      type: 'url',
      group: 'bewerbungen',
      description: 'Optional: Externer Webhook bei neuer Bewerbung (z.B. Zapier, Make)',
    }),

    // ─── Kontaktanfragen ───
    defineField({
      name: 'kontaktEmail',
      title: 'E-Mail',
      type: 'string',
      group: 'kontakt',
      description: 'Empfaenger fuer Anfragen vom Kontaktformular',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'kontaktSlack',
      title: 'Slack Webhook',
      type: 'url',
      group: 'kontakt',
      description: 'Optional: Slack-Benachrichtigung bei neuer Kontaktanfrage',
    }),
    defineField({
      name: 'kontaktWebhook',
      title: 'Webhook URL',
      type: 'url',
      group: 'kontakt',
      description: 'Optional: Externer Webhook bei neuer Kontaktanfrage',
    }),

    // ─── Gehaltsrechner ───
    defineField({
      name: 'gehaltsrechnerEmail',
      title: 'E-Mail',
      type: 'string',
      group: 'gehaltsrechner',
      description: 'Empfaenger fuer Gehaltsrechner-Leads',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'gehaltsrechnerSlack',
      title: 'Slack Webhook',
      type: 'url',
      group: 'gehaltsrechner',
      description: 'Optional: Slack-Benachrichtigung bei neuem Lead',
    }),
    defineField({
      name: 'gehaltsrechnerWebhook',
      title: 'Webhook URL',
      type: 'url',
      group: 'gehaltsrechner',
      description: 'Optional: Externer Webhook bei neuem Lead',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Benachrichtigungen' }
    },
  },
})
