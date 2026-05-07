import { defineType, defineField } from 'sanity'

export const notifications = defineType({
  name: 'notifications',
  title: 'Benachrichtigungen',
  type: 'document',
  fieldsets: [
    {
      name: 'bewerbungen',
      title: 'Bewerbungen',
      options: { collapsible: true, collapsed: false },
    },
    {
      name: 'kontakt',
      title: 'Kontaktanfragen',
      options: { collapsible: true, collapsed: true },
    },
    {
      name: 'gehaltsrechner',
      title: 'Gehaltsrechner',
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    // ─── Bewerbungen ───
    defineField({
      name: 'bewerbungenEmail',
      title: 'E-Mail',
      type: 'string',
      fieldset: 'bewerbungen',
      description: 'Empfaenger fuer Bewerbungen (Fallback wenn beim Job keine eigene E-Mail hinterlegt ist)',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'bewerbungenSlack',
      title: 'Slack Webhook',
      type: 'url',
      fieldset: 'bewerbungen',
      description: 'Optional: Slack-Benachrichtigung bei neuer Bewerbung',
    }),
    defineField({
      name: 'bewerbungenWebhook',
      title: 'Webhook URL',
      type: 'url',
      fieldset: 'bewerbungen',
      description: 'Optional: Externer Webhook (z.B. Zapier, Make)',
    }),

    // ─── Kontaktanfragen ───
    defineField({
      name: 'kontaktEmail',
      title: 'E-Mail',
      type: 'string',
      fieldset: 'kontakt',
      description: 'Empfaenger fuer Anfragen vom Kontaktformular',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'kontaktSlack',
      title: 'Slack Webhook',
      type: 'url',
      fieldset: 'kontakt',
      description: 'Optional: Slack-Benachrichtigung bei neuer Kontaktanfrage',
    }),
    defineField({
      name: 'kontaktWebhook',
      title: 'Webhook URL',
      type: 'url',
      fieldset: 'kontakt',
      description: 'Optional: Externer Webhook',
    }),

    // ─── Gehaltsrechner ───
    defineField({
      name: 'gehaltsrechnerEmail',
      title: 'E-Mail',
      type: 'string',
      fieldset: 'gehaltsrechner',
      description: 'Empfaenger fuer Gehaltsrechner-Leads',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'gehaltsrechnerSlack',
      title: 'Slack Webhook',
      type: 'url',
      fieldset: 'gehaltsrechner',
      description: 'Optional: Slack-Benachrichtigung bei neuem Lead',
    }),
    defineField({
      name: 'gehaltsrechnerWebhook',
      title: 'Webhook URL',
      type: 'url',
      fieldset: 'gehaltsrechner',
      description: 'Optional: Externer Webhook',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Benachrichtigungen' }
    },
  },
})
