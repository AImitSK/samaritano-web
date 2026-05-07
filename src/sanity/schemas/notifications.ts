import { defineType, defineField } from 'sanity'

export const notifications = defineType({
  name: 'notifications',
  title: 'Benachrichtigungen',
  type: 'document',
  fields: [
    // ─── Bewerbungen ───
    defineField({
      name: 'bewerbungenHeading',
      title: 'Bewerbungen',
      type: 'string',
      components: {
        field: (props) => props.renderDefault({ ...props, title: '── Bewerbungen ──' }),
      },
      hidden: true,
    }),
    defineField({
      name: 'bewerbungenEmail',
      title: 'E-Mail fuer Bewerbungen',
      type: 'string',
      description: 'An diese Adresse gehen alle Bewerbungen (Fallback wenn beim Job keine eigene E-Mail hinterlegt ist)',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'bewerbungenSlack',
      title: 'Slack Webhook (Bewerbungen)',
      type: 'url',
      description: 'Optional: Slack-Benachrichtigung bei neuer Bewerbung',
    }),
    defineField({
      name: 'bewerbungenWebhook',
      title: 'Webhook URL (Bewerbungen)',
      type: 'url',
      description: 'Optional: Externer Webhook bei neuer Bewerbung (z.B. Zapier, Make)',
    }),

    // ─── Kontaktanfragen (spaeter) ───
    defineField({
      name: 'kontaktEmail',
      title: 'E-Mail fuer Kontaktanfragen',
      type: 'string',
      description: 'An diese Adresse gehen Anfragen vom Kontaktformular',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'kontaktSlack',
      title: 'Slack Webhook (Kontakt)',
      type: 'url',
      description: 'Optional: Slack-Benachrichtigung bei neuer Kontaktanfrage',
    }),
    defineField({
      name: 'kontaktWebhook',
      title: 'Webhook URL (Kontakt)',
      type: 'url',
      description: 'Optional: Externer Webhook bei neuer Kontaktanfrage',
    }),

    // ─── Gehaltsrechner (spaeter) ───
    defineField({
      name: 'gehaltsrechnerEmail',
      title: 'E-Mail fuer Gehaltsrechner-Leads',
      type: 'string',
      description: 'An diese Adresse gehen Gehaltsrechner-Anfragen',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'gehaltsrechnerSlack',
      title: 'Slack Webhook (Gehaltsrechner)',
      type: 'url',
      description: 'Optional: Slack-Benachrichtigung bei neuem Lead',
    }),
    defineField({
      name: 'gehaltsrechnerWebhook',
      title: 'Webhook URL (Gehaltsrechner)',
      type: 'url',
      description: 'Optional: Externer Webhook bei neuem Lead',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Benachrichtigungen' }
    },
  },
})
