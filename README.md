# SK Website Template

Ein modernes, kopierbares Next.js Template fuer Kunden-Webseiten.

## Ersteinrichtung (einmalig pro Rechner)

### 1. GitHub CLI installieren

```bash
winget install GitHub.cli
gh auth login
```

### 2. MCP Server installieren

```bash
# Sanity MCP - Content direkt bearbeiten
claude mcp add sanity -- npx -y @sanity/mcp-server

# GitHub MCP - Repos, Issues, PRs verwalten
claude mcp add github -- npx -y @modelcontextprotocol/server-github

# Tavily MCP - Web-Recherche
claude mcp add tavily -- npx -y tavily-mcp
```

---

## Neues Projekt starten

```bash
# 1. Repository aus Template erstellen
gh repo create kunde-website --template AImitSK/website-template --private --clone
cd kunde-website

# 2. Setup ausfuehren
./init.ps1 -ProjectName "kunde-website"

# 3. Entwicklungsserver starten
npm run dev
```

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **CMS:** Sanity
- **Hosting:** Vercel
- **Animationen:** Framer Motion + Lenis
- **KI:** Gemini (via Vercel AI SDK)
- **E-Mail:** SendGrid
- **Forms:** React Hook Form + Zod

## Projektstruktur

```
src/
├── app/              # Next.js App Router
│   ├── api/          # API Routes
│   └── page.tsx      # Seiten
├── components/
│   ├── ui/           # Buttons, Inputs, etc.
│   ├── layout/       # Header, Footer
│   └── sections/     # Hero, Features, etc.
├── lib/              # Utilities, Clients
├── sanity/           # CMS Konfiguration
└── types/            # TypeScript Types
```

## Umgebungsvariablen

Kopiere `.env.example` nach `.env.local` und trage die API Keys ein:

```bash
cp .env.example .env.local
```

Erforderliche Keys:
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Sanity Projekt ID
- `SENDGRID_API_KEY` - Fuer E-Mail-Versand
- `GEMINI_API_KEY` - Fuer KI-Chat

## Claude Code Skills

Im Projekt verfuegbare Slash Commands:

| Skill | Funktion |
|-------|----------|
| `/review` | Code-Review (TypeScript, A11y, Performance) |
| `/seo` | SEO-Audit (Meta, OG, JSON-LD) |
| `/docs` | Dokumentation aktualisieren |
| `/component Name typ` | Neue Komponente erstellen |
| `/page pfad` | Neue Seite erstellen |
| `/deploy` | Deployment-Checkliste |

## Scripts

```bash
npm run dev       # Entwicklungsserver
npm run build     # Production Build
npm run start     # Production Server
npm run lint      # ESLint
```

## Deployment

Push zu `main` loest automatisches Vercel Deployment aus.

## Dokumentation

- `docs/KUNDE-README.md` - Anleitung fuer Kunden
- `docs/CHANGELOG.md` - Feature Updates
- `CLAUDE.md` - Kontext fuer Claude Code

---

Entwickelt von [SK Online Marketing](https://sk-online-marketing.de)
