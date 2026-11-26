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
  /** PDF-Dateinamen aus brand/druck. */
  druckFiles: string[];
  /** Dateien aus brand/original, relativer Pfad und Grösse in Bytes. */
  originalFiles: { path: string; size: number }[];
  /** Word-Vorlagen (.dotx) aus brand/vorlagen, Dateiname und Grösse in Bytes. */
  vorlagenFiles: { file: string; size: number }[];
  /** QM-Vorlagen (.docx) aus brand/vorlagen-qm, Dateiname und Grösse in Bytes. */
  qmFiles: { file: string; size: number }[];
  /** Eintraege aus brand/kategorien.json (Ordnername -> Seite). */
  kategorien: Record<string, { seite: string; typ?: string }>;
  /** Ordner mit "typ": "sammlung": bekommen automatisch eine eigene Seite. */
  sammlungen: Sammlung[];
}

export interface Sammlung {
  ordner: string;
  /** Pfad der Seite, z. B. „fotobox". */
  seite: string;
  titel: string;
  kachel: string;
  lead: string;
  hinweis?: { titel: string; text: string };
  files: { file: string; size: number }[];
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

export interface NavItem {
  path: string;
  label: string;
}

/** Feste Seiten. Seiten fuer Sammlungen (brand/kategorien.json) kommen beim Build vor „Komponenten" dazu. */
export const BASE_NAV: NavItem[] = [
  { path: "", label: "Übersicht" },
  { path: "farben", label: "Farben" },
  { path: "typografie", label: "Typografie" },
  { path: "abstaende", label: "Abstände & Form" },
  { path: "logo", label: "Logo" },
  { path: "druck", label: "Druckdaten" },
  { path: "definitionen", label: "Definitionen" },
  { path: "originale", label: "Originale" },
  { path: "vorlagen", label: "Vorlagen" },
  { path: "komponenten", label: "Komponenten" },
];

export interface Vorlage {
  /** Dateiname ohne Endung, wie in brand/vorlagen. */
  base: string;
  title: string;
  gruppe: "Bewohnerschilder" | "Büro";
  layout: string;
  felder: string;
  hinweis?: string;
}

/** Die Beschilderungs-Vorlagen. Reihenfolge = Reihenfolge auf der Seite. */
export const VORLAGEN: Vorlage[] = [
  {
    base: "2026_Vorlage_Beschilderung_Sonnhalde_Einzeln_A6_Einerzimmer_V1",
    title: "Einerzimmer, einzeln",
    gruppe: "Bewohnerschilder",
    layout: "Ein A6-Schild in der linken Spalte der A4-quer-Seite.",
    felder: "Vorname Nachname · Nr. (Raum-ID)",
  },
  {
    base: "2026_Vorlage_Beschilderung_Sonnhalde_Einzeln_A6_Doppelzimmer_V1",
    title: "Doppelzimmer, einzeln",
    gruppe: "Bewohnerschilder",
    layout: "Ein A6-Schild in der linken Spalte der A4-quer-Seite.",
    felder: "Vorname Nachname mit «Fenster» · Vorname Nachname mit «Tür» · Nr. (Raum-ID)",
  },
  {
    base: "2026_Vorlage_Beschilderung_Sonnhalde_Kacheln_A6_Einerzimmer_V1",
    title: "Einerzimmer, Kacheln",
    gruppe: "Bewohnerschilder",
    layout: "Vier A6-Schilder (2 × 2) auf einer A4-quer-Seite.",
    felder: "Vorname Nachname · Nr. (Raum-ID), je Kachel",
  },
  {
    base: "2026_Vorlage_Beschilderung_Sonnhalde_Kacheln_A6_Doppelzimmer_V1",
    title: "Doppelzimmer, Kacheln",
    gruppe: "Bewohnerschilder",
    layout: "Vier A6-Schilder (2 × 2) auf einer A4-quer-Seite.",
    felder: "Vorname Nachname mit «Fenster» · Vorname Nachname mit «Tür» · Nr. (Raum-ID), je Kachel",
    hinweis: "Im Original ist bei «Nr. 1339» nur «133» gelb markiert, die letzte Ziffer nicht.",
  },
  {
    base: "2026_Vorlage_Beschilderung_Sonnhalde_Einzeln_A6_Buero_V1",
    title: "Büro, einzeln",
    gruppe: "Büro",
    layout: "Ein A6-Schild in der linken Spalte der A4-quer-Seite, mit Rahmen.",
    felder: "Büro Bezeichnung · bis zu drei Personen (Vorname Nachname, Arbeitstage, optional Arbeitszeit)",
    hinweis: "Die Namen und Arbeitstage im Original sind durch Platzhalter ersetzt.",
  },
];

export interface QmVorlage {
  /** Dateiname ohne Endung, wie in brand/vorlagen-qm. */
  base: string;
  /** Dateiname des Vorschaubilds in brand/vorlagen-qm/vorschau. */
  vorschau: string;
  title: string;
  layout: string;
  felder: string;
  hinweis?: string;
}

/** Die QM-Vorlagen für interne Dokumente. Reihenfolge = Reihenfolge auf der Seite. */
export const QM_VORLAGEN: QmVorlage[] = [
  {
    base: "Vorlage_QM_Hoch",
    vorschau: "Vorlage_QM_Hoch_V1.png",
    title: "QM-Vorlage hoch",
    layout: "A4 hoch, Seitenrand 12.7 mm.",
    felder:
      "Kopf: Dokumententitel · Gültig ab · Version. Fuss: Dokumentnummer · Ersteller in Funktion · Zuständiger Vorgesetzter in Funktion · Freigegeben · Seite",
    hinweis: "Die Fusszeile trägt als Beispiel «830 / QM / VORLAGE».",
  },
  {
    base: "Vorlage_QM_Quer",
    vorschau: "Vorlage_QM_Quer_V1.png",
    title: "QM-Vorlage quer",
    layout: "A4 quer, Seitenrand 12.7 mm.",
    felder:
      "Kopf: Dokumententitel · Gültig ab · Version. Fuss: Pfad Ordner (Ablage) · Ersteller in Funktion · Zuständiger Vorgesetzter in Funktion · Freigegeben · Seite",
    hinweis: "Beispielzeile im Text: «Schriftart Arial 10, Absatz 14».",
  },
];

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
