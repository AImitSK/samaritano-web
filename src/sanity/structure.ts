import type { StructureBuilder } from 'sanity/structure'
import {
  Settings,
  FileText,
  Tags,
  Users,
  Milestone,
  Newspaper,
  Briefcase,
  FolderDown,
  Scale,
  Globe,
  Menu,
  SlidersHorizontal,
  HelpCircle,
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
              S.listItem()
                .title('Seiten')
                .icon(Globe)
                .child(
                  S.documentTypeList('page')
                    .title('Seiten')
                    .defaultOrdering([{ field: 'title', direction: 'asc' }])
                ),
              singletonItem(S, 'navigation', 'Navigation', Menu),
            ])
        ),

      S.divider(),

      // ─── Blog ───
      S.listItem()
        .title('Blog')
        .icon(FileText)
        .child(
          S.list()
            .title('Blog')
            .items([
              S.listItem()
                .title('Artikel')
                .icon(FileText)
                .child(S.documentTypeList('post').title('Artikel')),
              S.listItem()
                .title('Kategorien')
                .icon(Tags)
                .child(S.documentTypeList('category').title('Kategorien')),
              S.divider(),
              singletonItem(S, 'blogSettings', 'Einstellungen', SlidersHorizontal),
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
                .child(S.documentTypeList('team').title('Teammitglieder')),
              S.listItem()
                .title('Meilensteine')
                .icon(Milestone)
                .child(S.documentTypeList('milestone').title('Meilensteine')),
            ])
        ),

      // ─── Aktuelles ───
      S.listItem()
        .title('Aktuelles')
        .icon(Newspaper)
        .child(S.documentTypeList('news').title('News & Events')),

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

      // ─── Downloads ───
      S.listItem()
        .title('Downloads')
        .icon(FolderDown)
        .child(S.documentTypeList('download').title('Downloads')),

      S.divider(),

      // ─── Rechtliches ───
      S.listItem()
        .title('Rechtliches')
        .icon(Scale)
        .child(S.documentTypeList('legal').title('Rechtliche Seiten')),
    ])
}
