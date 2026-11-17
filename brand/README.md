# Sonnhalde Brand-Assets — V1

Stand 17.11.2026. Quelle: Lieferung des Grafikers (eightynine.ch, «26-11_SONNHALDE_Logos.zip»).
Gleicher Inhalt wie in den Gruppen `assets/Logos-*` und `assets/Definitionen/` des
Sonnhalde-Design-Systems (Artifact).

| Ordner | Inhalt |
|---|---|
| `original/` | Lieferung des Grafikers, unverändert (EPS, SVG, PNG, JPG, PDF, Definitionen) |
| `vektor/` | 17 SVG, einheitlich benannt; Füllfarben als `fill`-Attribute (Pfade unverändert) |
| `bildschirm/` | 20 PNG/JPG, einheitlich benannt, byte-identisch zur Lieferung |
| `druck/` | 26 PDF (4C und Pantone), aus den EPS umgewandelt (Ghostscript) |
| `definitionen/` | «SONNHALDE Definitionen» (Logos, Farben, Schriften) |

Jede Gruppe hat eine eigene README mit der Zuordnung von Datei, Farben, Untergrund und
Original. Die offiziellen Farbwerte stehen zusätzlich in `src/tokens-official.css`
(Variablen `--sonn-official-*`); sie ist bewusst nicht in `styles.css` eingebunden.
