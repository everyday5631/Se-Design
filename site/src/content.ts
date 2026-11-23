// Redaktioneller Inhalt der Dokumentationsseite.
// Farbwerte kommen NICHT von hier, sondern werden beim Build aus src/tokens*.css gelesen.

export interface CssVar {
  /** Variablenname ohne fuehrendes „--", z. B. „sonn-navy". */
  name: string;
  value: string;
  comment?: string;
}

export interface SiteData {
  vars: CssVar[];
  official: CssVar[];
  /** Dateinamen aus brand/vektor (SVG) und brand/bildschirm (PNG/JPG). */
  svgFiles: string[];
  rasterFiles: string[];
}

export const ROLES: Record<string, string> = {
  "sonn-navy": "Grundton, Header, Fliesstext auf Cream",
  "sonn-logo-gold": "Akzent auf dunklem Grund, Logo",
  "sonn-heading-gold": "Linien, Eyebrows, Tags, Buttons auf hellem Grund",
  "sonn-cream": "Seitenhintergrund",
  "sonn-navy-tint": "Heller Navy-Ton für ruhige Flächen",
  "sonn-navy-deep": "Dunklerer Navy-Ton",
  "sonn-stone": "Sekundärtext",
  "sonn-line": "Linien und Rahmen (Karten, Felder)",
  "sonn-gold-deep": "Links, Auszeichnungstext auf hellem Grund",
  "sonn-surface": "Weisse Fläche (Karten, Felder)",
  "sonn-cream-sink": "Gedämpfte Cream-Fläche (Info-Karten)",
  "sonn-ok": "Status «Erfolg» (Akzentkante im Hinweis)",
  "sonn-ok-bg": "Hintergrund «Erfolg»",
  "sonn-warn": "Status «Warnung» (Akzentkante im Hinweis)",
  "sonn-warn-bg": "Hintergrund «Warnung»",
  "sonn-error": "Fehlertext und Fehlerrahmen in Formularfeldern",
  "sonn-official-sonnengelb": "Logo und Flächen",
  "sonn-official-anthrazit": "Text",
  "sonn-official-dunkelblau": "Entspricht --sonn-navy",
  "sonn-official-dunkelblau-gemalt": "So im Blatt gemalt; Klärung beim Grafiker offen",
  "sonn-official-web-grau": "Farbpalette Website",
  "sonn-official-web-creme": "Farbpalette Website; entspricht --sonn-cream",
};

export const COLOR_GROUPS: { id: string; title: string; lead: string; names: string[] }[] = [
  {
    id: "grundfarben",
    title: "Grundfarben",
    lead: "Die verbindliche Palette. Alles andere leitet sich davon ab.",
    names: ["sonn-navy", "sonn-logo-gold", "sonn-heading-gold", "sonn-cream"],
  },
  {
    id: "stuetzfarben",
    title: "Stützfarben",
    lead: "Abgeleitete Töne für Flächen, Linien und Sekundärtext.",
    names: [
      "sonn-navy-tint",
      "sonn-navy-deep",
      "sonn-stone",
      "sonn-line",
      "sonn-gold-deep",
      "sonn-surface",
      "sonn-cream-sink",
    ],
  },
  {
    id: "signalfarben",
    title: "Signalfarben",
    lead: "Nur für Status, nie als Akzent. Bewusst gedämpft.",
    names: ["sonn-ok", "sonn-ok-bg", "sonn-warn", "sonn-warn-bg", "sonn-error"],
  },
];

export const NAV = [
  { path: "", label: "Übersicht" },
  { path: "farben", label: "Farben" },
  { path: "typografie", label: "Typografie" },
  { path: "abstaende", label: "Abstände & Form" },
  { path: "logo", label: "Logo" },
  { path: "komponenten", label: "Komponenten" },
] as const;

export interface PropDoc {
  name: string;
  type: string;
  description: string;
}

export interface ComponentDoc {
  id: string;
  name: string;
  summary: string;
  code: string;
  props: PropDoc[];
  /** Vorschau auf Navy-Grund (z. B. für onNavy-Buttons). */
  darkPreview?: boolean;
}
