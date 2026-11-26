# Sonnhalde Design-System – Hinweise für Claude

React-Komponenten, Tokens und Brand-Dateien der Pflege- und Betreuungszentrum Sonnhalde AG. Überblick: `README.md`, Brand-Dateien: `brand/README.md`.

## Neue Inhalte brauchen eine Kategorie (wichtig)

Die Dokumentationsseite (GitHub Pages, `site/`) wird nach jedem Merge in `main` automatisch neu gebaut und veröffentlicht
(`.github/workflows/pages.yml`). Was nicht in der Seite eingetragen ist, fehlt dort. Deshalb gilt bei **jedem** neuen Inhalt unter `brand/`:

1. **Ordner unter `brand/`:** Jeder Ordner braucht einen Eintrag in `brand/kategorien.json` (Schlüssel = Ordnername).
   - Passt er zu einer bestehenden Seite: `"<ordner>": { "seite": "logo" }` (Seiten: `originale`, `logo`, `druck`, `definitionen`, `vorlagen`).
   - Sonst eigene Seite: `"typ": "sammlung"` mit `seite` (URL-Teil), `titel`, `lead`, optional `kachel` und `hinweis`. Die Seite listet alle Dateien des Ordners
     automatisch auf (Bilder als Vorschau, andere Dateien als Download). Beispiel: `fotobox-hintergruende`.
2. **Neue Datei in einem bestehenden Ordner:** Logos (`vektor`, `bildschirm`), Druck-PDF, Originale erscheinen automatisch.
   Word-Vorlagen brauchen zusätzlich einen Eintrag in `VORLAGEN` bzw. `QM_VORLAGEN` (`site/src/content.ts`) und ein Vorschaubild unter `vorschau/`.
3. **Neue Komponente** in `src/`: Dokumentation in `COMPONENTS` (`site/src/pages.tsx`) ergänzen (Beispiel, Code, Eigenschaften); der Build prüft das nicht.
4. Zusätzlich die `README.md` im Ordner (Herkunft, Farben, Stand) und `brand/README.md` (Tabelle) pflegen.

Fehlt eine Kategorie oder ein Eintrag, **schlägt `npm run site:build` fehl** (im Pull Request rot, mit Hinweis, was zu ergänzen ist).
Vor dem Push lokal prüfen: `npm ci && npm run typecheck && npm run site:build`.

## Weitere Regeln

- **Öffentlich:** Eine Pages-Seite ist öffentlich erreichbar, auch bei privatem Repository, samt allen Downloads. Keine Personendaten, Zugangsdaten
  oder Internes in `brand/` ablegen (Vorlagen mit echten Namen vorher durch Platzhalter ersetzen).
- **Entwürfe kennzeichnen:** Inhalte, die nicht vom Grafiker stammen oder nicht freigegeben sind, als «Entwurf» ausweisen (README des Ordners und `hinweis` in `kategorien.json`).
- **Sprache:** Deutsch mit der Nutzerperson (Schweizer Kontext, «ss» statt «ß»).
- **Git:** Entwickeln auf dem vorgegebenen Zweig, neuer PR als Entwurf. Merge macht die Nutzerperson.
