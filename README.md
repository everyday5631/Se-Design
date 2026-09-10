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
