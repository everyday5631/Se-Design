# Sonnhalde Design-System

React-Komponenten, Design-Tokens und Styles der **Pflege- und Betreuungszentrum
Sonnhalde AG** (Gerbistrasse 9, CH-8627 Grüningen).

Warm, seriös, ruhig und würdevoll — kein klinischer Look, kein generischer
SaaS-Karten-Stil. Struktur entsteht durch klare Linien in Heading-Gold, nicht
durch Dekoration. Durchgängig **Arial**, gut lesbar auch für ältere Nutzende.

## Installation

```bash
npm install
npm run build
```

## Verwendung

```tsx
import { SonnhaldeProvider, SectionHeading, Button } from "@sonnhalde/design-system";
import "@sonnhalde/design-system/styles.css";

export function App() {
  return (
    <SonnhaldeProvider>
      <SectionHeading
        eyebrow="Verwaltung"
        title="Dienstplan Neubau OG"
        lead="Interne Übersicht der Belegung."
      />
      <Button variant="primary">Termin bestätigen</Button>
    </SonnhaldeProvider>
  );
}
```

## Farbpalette

| Token | Hex | Rolle |
|---|---|---|
| `--sonn-navy` | `#233446` | Grundton, Header, Fliesstext auf Cream |
| `--sonn-logo-gold` | `#EFBB50` | Akzent auf dunklem Grund, Logo |
| `--sonn-heading-gold` | `#C8962E` | Linien, Eyebrows, Tags, Buttons auf hellem Grund |
| `--sonn-cream` | `#FDF9F6` | Seitenhintergrund |
| `--sonn-gold-deep` | `#A97C22` | Links, Auszeichnungstext auf hellem Grund |
| `--sonn-stone` | `#6B6459` | Sekundärtext |

**Kontrast:** Heading-Gold und Logo-Gold sind auf Cream nicht für Fliesstext
geeignet. Lese-Überschriften und Fliesstext bleiben in Navy; für kleine
Auszeichnungen auf Hell das dunklere Gold-Deep.

## Komponenten

- `SonnhaldeProvider` — Wurzel-Wrapper (Tokens, Arial, Cream-Grund)
- `Button` — `primary` · `secondary` · `quiet` · `onNavy`
- `SectionHeading` / `GoldRule` — das Gold-Linien-System
- `DepartmentCard` · `StatCard` · `InfoCard`
- `TextField` · `SelectField` · `TextareaField`
- `Notice` — `info` · `success` · `warning`
- `DocumentHeader` · `AppBar`

## Logos und Marken-Definition

Die Logos des Grafikers (SVG, PNG/JPG, Druck-PDF in 4C und Pantone, EPS-Originale) und
das Definitionen-Blatt liegen unter [`brand/`](brand/README.md). Die offiziellen
Farbwerte des Grafikers (Sonnengelb `#F9B119`, Anthrazit `#282828`, Dunkelblau `#233446`)
stehen zusätzlich in `src/tokens-official.css`; die Tokens oben sind unverändert.

**Offen:** Das Definitionen-Blatt nennt **Open Sans** und **Source Serif Pro** als Schriften,
dieses System verwendet durchgängig Arial. Dunkelblau ist im Blatt mit `#233446` beschriftet,
aber etwa `#00263F` gemalt; die Klärung beim Grafiker steht aus.

## Dokumentationsseite

Unter `site/` liegt die Dokumentationsseite des Design-Systems (Farben, Typografie,
Abstände, Logo, Druckdaten, Definitionen, Originale, Vorlagen, Komponenten). Farben,
Schriftgrössen und Abstände werden beim Build direkt aus `src/tokens.css` und
`src/tokens-official.css` gelesen; die Seite kann also nicht von den Tokens abweichen.
Die Brand-Dateien aus `brand/` (Logos, Druck-PDF, Definitionen, Originale des Grafikers,
Beschilderungs-Vorlagen, QM-Vorlagen, zusammen rund 40 MB) werden mitgebaut und stehen auf der Seite zum Download.

```bash
npm run site:build   # baut nach site-dist/
npm run site:serve   # Vorschau auf http://localhost:4173/
```

**Veröffentlichung:** `.github/workflows/pages.yml` läuft nur von Hand (Actions →
«Dokumentationsseite» → Run workflow), nie automatisch. Vorher unter Settings → Pages
die Quelle auf «GitHub Actions» stellen. Eine Pages-Seite ist öffentlich erreichbar,
auch bei privatem Repository, und damit auch alle Downloads inklusive der Originale des
Grafikers. Die Seiten sind mit `noindex` markiert, das ist aber kein Zugriffsschutz.
