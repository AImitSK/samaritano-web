# Projekt: samaritano

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Sanity CMS
- Vercel Hosting
- Framer Motion + Lenis (Animationen)
- SendGrid (E-Mail)
- Gemini (KI)

## Wichtige Pfade
- Komponenten: src/components/{ui,layout,sections}
- Sanity Schemas: src/sanity/schemas/
- API Routes: src/app/api/
- Utilities: src/lib/

## Konventionen
- Sprache: Deutsche Kommentare OK, Code auf Englisch
- Styling: Tailwind, keine CSS-Dateien
- State: React useState/useReducer, kein Redux
- Forms: React Hook Form + Zod
- Animationen: Framer Motion fuer Komponenten
- Icons: Lucide React

---

## Skills (Slash Commands)

### /review
Code-Review durchfuehren: TypeScript, Accessibility, Performance, Tailwind

### /seo
SEO-Audit: Meta Tags, Open Graph, JSON-LD, Sitemap

### /docs
Dokumentation aktualisieren: JSDoc, CHANGELOG, README

### /component [Name] [Typ]
Neue Komponente erstellen (ui/sections/layout)

### /page [Pfad]
Neue Seite erstellen mit Metadata und Layout

### /deploy
Deployment-Checkliste durchgehen

---

## Sanity Schemas

### Singletons (einmalig)
- **settings**: Globale Einstellungen (Logo, Kontakt, Social Links)

### Objects
- **seo**: Wiederverwendbares SEO-Objekt (Meta, Social, Erweitert)

### Content Types
- **page**: CMS-gesteuerte Seiten mit pageType, Navigation, SEO (ersetzt alte navigation)
- **post**: Blog-Artikel
- **category**: Blog-Kategorien
- **team**: Teammitglieder / Ansprechpartner
- **news**: News, Events, Messen, Pressemitteilungen
- **job**: Stellenangebote
- **download**: Downloads (PDFs, Kataloge, Datenblaetter)
- **milestone**: Firmenhistorie / Meilensteine
- **legal**: Rechtliche Seiten (Impressum, Datenschutz, AGB)

### Philosophie
> "Kunde editiert Content, nicht Struktur. Fuer alles andere ruft er an."

---

## Section Components

Verfuegbare Sections in `src/components/sections/`:
- **Hero** - Hero-Bereich mit Titel, Subtitle, Buttons
- **TeamSection** - Team-Grid mit Kontaktinfos
- **NewsSection** - News/Events/Messen Liste
- **JobsSection** - Stellenangebote Liste
- **DownloadsSection** - Downloads nach Kategorie gruppiert
- **TimelineSection** - Firmenhistorie als Timeline
- **CTASection** - Call-to-Action (default/primary/dark Varianten)

---

## MCP Server

### Setup (einmalig pro Rechner)

```bash
# Sanity MCP - Content direkt in Claude bearbeiten
claude mcp add sanity -- npx -y @sanity/mcp-server

# GitHub MCP - Issues, PRs, Repos verwalten
claude mcp add github -- npx -y @modelcontextprotocol/server-github

# Tavily MCP - Web-Recherche
claude mcp add tavily -- npx -y tavily-mcp
```

### Bereits aktiv (Claude Code)
- **Vercel MCP** - Deployments, Logs, Domains
- **Figma MCP** - Design-to-Code

### Env Variables fuer MCPs

```env
# GitHub MCP
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxx

# Tavily MCP
TAVILY_API_KEY=tvly-xxx

# Sanity MCP (nutzt Projekt-Env)
# NEXT_PUBLIC_SANITY_PROJECT_ID und SANITY_API_TOKEN
```

---

## Deployment
- Push zu main → automatisches Vercel Deployment
- Preview Deployments fuer jeden Branch/PR
- Vercel CLI: `vercel` (Preview) / `vercel --prod` (Production)
