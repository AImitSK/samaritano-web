# Deployment vorbereiten

Bereite das Projekt fuer Deployment vor und pruefe alle Voraussetzungen.

## Checkliste

### 1. Build Test
```bash
npm run build
```
- [ ] Build erfolgreich
- [ ] Keine TypeScript Fehler
- [ ] Keine ESLint Fehler

### 2. Environment Variables
Pruefe ob alle noetig ENV Vars gesetzt sind:
- [ ] NEXT_PUBLIC_SANITY_PROJECT_ID
- [ ] NEXT_PUBLIC_SITE_URL
- [ ] SENDGRID_API_KEY (falls Kontaktformular)
- [ ] GEMINI_API_KEY (falls AI Chat)

### 3. SEO
- [ ] Alle Seiten haben Meta Title/Description
- [ ] OG Images vorhanden
- [ ] robots.txt Sitemap-URL aktualisiert
- [ ] Favicon vorhanden

### 4. Performance
- [ ] Bilder optimiert (WebP, richtige Groessen)
- [ ] Keine unused Dependencies
- [ ] Bundle Size akzeptabel

### 5. Content
- [ ] Alle Platzhalter-Texte ersetzt
- [ ] Kontaktdaten korrekt
- [ ] Impressum/Datenschutz vorhanden

### 6. Funktionalitaet
- [ ] Kontaktformular getestet
- [ ] Navigation funktioniert
- [ ] Mobile Ansicht geprueft
- [ ] Dark Mode funktioniert

## Vercel Deployment

```bash
# Preview Deployment
vercel

# Production Deployment
vercel --prod
```

## Nach Deployment

- [ ] Live-Seite testen
- [ ] Google Search Console einrichten
- [ ] Analytics einrichten (falls gewuenscht)

Pruefe: Projekt fuer $ARGUMENTS
