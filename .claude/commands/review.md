# Code Review

Fuehre einen Code-Review fuer das Projekt durch.

## Pruefpunkte

### 1. TypeScript
- Strict Mode Fehler
- Fehlende Types
- Any-Verwendung minimieren

### 2. Accessibility
- ARIA Labels vorhanden
- Keyboard Navigation moeglich
- Farbkontraste ausreichend
- Alt-Texte fuer Bilder

### 3. Performance
- Next.js Image statt img-Tag
- Lazy Loading fuer Bilder/Komponenten
- Keine unnoetig grossen Bundle-Imports

### 4. Tailwind
- Keine doppelten/widerspruchlichen Klassen
- Responsive Breakpoints konsistent
- Dark Mode Klassen vorhanden

### 5. Best Practices
- Keine console.log im Production Code
- Error Boundaries vorhanden
- Loading States implementiert

## Ausgabe

Erstelle einen Report mit:
1. Kritische Fehler (muessen behoben werden)
2. Warnungen (sollten behoben werden)
3. Verbesserungsvorschlaege (optional)

Pruefe: $ARGUMENTS oder alle Dateien in src/
