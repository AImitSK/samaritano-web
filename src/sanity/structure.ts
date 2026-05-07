import type { StructureBuilder } from 'sanity/structure'
import {
  Settings,
  FileText,
  Tags,
  Briefcase,
  Scale,
  Menu,
  HelpCircle,
  Users,
  Milestone,
  Quote,
  Bell,
} from 'lucide-react'

// Singleton-Helper
function singletonItem(
  S: StructureBuilder,
  typeName: string,
  title: string,
  icon: React.ComponentType
) {
  return S.listItem()
    .title(title)
    .icon(icon)
    .child(S.document().schemaType(typeName).documentId(typeName))
}

export function structure(S: StructureBuilder) {
  return S.list()
    .title('Inhalt')
    .items([
      // ─── Einstellungen ───
      S.listItem()
        .title('Einstellungen')
        .icon(Settings)
        .child(
          S.list()
            .title('Einstellungen')
            .items([
              singletonItem(S, 'settings', 'Allgemein', Settings),
              singletonItem(S, 'navigation', 'Navigation', Menu),
              singletonItem(S, 'notifications', 'Benachrichtigungen', Bell),
            ])
        ),

      S.divider(),

      // ─── Magazin ───
      S.listItem()
        .title('Magazin')
        .icon(FileText)
        .child(
          S.list()
            .title('Magazin')
            .items([
              S.listItem()
                .title('Artikel')
                .icon(FileText)
                .child(S.documentTypeList('post').title('Artikel')),
              S.listItem()
                .title('Kategorien')
                .icon(Tags)
                .child(S.documentTypeList('category').title('Kategorien')),
            ])
        ),

      // ─── Karriere ───
      S.listItem()
        .title('Karriere')
        .icon(Briefcase)
        .child(
          S.list()
            .title('Karriere')
            .items([
              S.listItem()
                .title('Stellenangebote')
                .icon(Briefcase)
                .child(S.documentTypeList('job').title('Stellenangebote')),
              S.listItem()
                .title('Kategorien')
                .icon(Tags)
                .child(S.documentTypeList('jobCategory').title('Kategorien')),
            ])
        ),

      // ─── FAQ ───
      S.listItem()
        .title('FAQ')
        .icon(HelpCircle)
        .child(
          S.list()
            .title('FAQ')
            .items([
              S.listItem()
                .title('Einträge')
                .icon(HelpCircle)
                .child(
                  S.documentTypeList('faq')
                    .title('FAQ-Einträge')
                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                ),
              S.listItem()
                .title('Kategorien')
                .icon(Tags)
                .child(
                  S.documentTypeList('faqCategory')
                    .title('FAQ-Kategorien')
                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                ),
            ])
        ),

      // ─── Unternehmen ───
      S.listItem()
        .title('Unternehmen')
        .icon(Users)
        .child(
          S.list()
            .title('Unternehmen')
            .items([
              S.listItem()
                .title('Team')
                .icon(Users)
                .child(
                  S.documentTypeList('team')
                    .title('Teammitglieder')
                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                ),
              S.listItem()
                .title('Meilensteine')
                .icon(Milestone)
                .child(
                  S.documentTypeList('milestone')
                    .title('Meilensteine')
                    .defaultOrdering([{ field: 'year', direction: 'asc' }])
                ),
              S.listItem()
                .title('Testimonials')
                .icon(Quote)
                .child(
                  S.documentTypeList('testimonial')
                    .title('Testimonials')
                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                ),
            ])
        ),

      S.divider(),

      // ─── Rechtliches ───
      S.listItem()
        .title('Rechtliches')
        .icon(Scale)
        .child(S.documentTypeList('legal').title('Rechtliche Seiten')),
    ])
}
