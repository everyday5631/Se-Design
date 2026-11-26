// Baut die Sonnhalde-Dokumentationsseite als statische Dateien nach site-dist/.
//   node site/build.mjs           -> site-dist/
// Keine neuen Abhaengigkeiten: esbuild und react-dom sind bereits vorhanden.
import { build } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "site-dist");
const tmp = join(root, ".site-build");

// 0) Kategorien: jeder Ordner unter brand/ muss in brand/kategorien.json stehen (und umgekehrt).
//    So landet nichts Neues unbemerkt ausserhalb der Seite. Fehler erscheinen im Pull Request.
const kategorien = JSON.parse(readFileSync(join(root, "brand/kategorien.json"), "utf8")).ordner;
const brandFolders = readdirSync(join(root, "brand"), { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name).sort();
const kategorieFehler = [
  ...brandFolders
    .filter((d) => !kategorien[d])
    .map((d) => `brand/${d}/ hat keine Kategorie. In brand/kategorien.json unter "ordner" eintragen: "${d}": { "seite": "<bestehende Seite>" } oder als eigene Seite mit "typ": "sammlung" (siehe CLAUDE.md).`),
  ...Object.keys(kategorien)
    .filter((d) => !brandFolders.includes(d))
    .map((d) => `brand/kategorien.json nennt "${d}", aber brand/${d}/ gibt es nicht.`),
  ...Object.entries(kategorien)
    .filter(([, k]) => !k.seite)
    .map(([d]) => `brand/kategorien.json: "${d}" hat kein Feld "seite".`),
  ...Object.entries(kategorien)
    .filter(([, k]) => k.typ === "sammlung" && !(k.titel && k.lead))
    .map(([d]) => `brand/kategorien.json: Sammlung "${d}" braucht "titel" und "lead".`),
];
if (kategorieFehler.length) {
  for (const m of kategorieFehler) console.error(`::error file=brand/kategorien.json::${m}`);
  process.exit(1);
}

rmSync(out, { recursive: true, force: true });
rmSync(tmp, { recursive: true, force: true });
mkdirSync(join(out, "assets", "logos", "svg"), { recursive: true });
mkdirSync(join(out, "assets", "logos", "png"), { recursive: true });
mkdirSync(tmp, { recursive: true });

// 1) Design-System-Styles (Tokens + Komponenten) und Site-Styles
await build({
  entryPoints: [join(root, "src/styles.css")],
  bundle: true,
  outfile: join(out, "assets/styles.css"),
  loader: { ".css": "css" },
  logLevel: "warning",
});
copyFileSync(join(root, "site/site.css"), join(out, "assets/site.css"));

// 2) CSS-Variablen aus den Token-Dateien lesen (Quelle der Wahrheit bleibt src/)
function parseVars(file) {
  const css = readFileSync(join(root, file), "utf8");
  const vars = [];
  const re = /--([a-z0-9-]+)\s*:\s*([^;]+);(?:[ \t]*\/\*\s*(.*?)\s*\*\/)?/g;
  for (const m of css.matchAll(re)) {
    vars.push({ name: m[1], value: m[2].trim(), comment: m[3] });
  }
  return vars;
}
const data = {
  vars: parseVars("src/tokens.css"),
  official: parseVars("src/tokens-official.css"),
  svgFiles: readdirSync(join(root, "brand/vektor")).filter((f) => f.endsWith(".svg")).sort(),
  rasterFiles: readdirSync(join(root, "brand/bildschirm")).filter((f) => /\.(png|jpg)$/i.test(f)).sort(),
  druckFiles: readdirSync(join(root, "brand/druck")).filter((f) => f.endsWith(".pdf")).sort(),
  originalFiles: [],
  vorlagenFiles: readdirSync(join(root, "brand/vorlagen"))
    .filter((f) => f.endsWith(".dotx"))
    .sort()
    .map((f) => ({ file: f, size: statSync(join(root, "brand/vorlagen", f)).size })),
  qmFiles: readdirSync(join(root, "brand/vorlagen-qm"))
    .filter((f) => f.endsWith(".docx"))
    .sort()
    .map((f) => ({ file: f, size: statSync(join(root, "brand/vorlagen-qm", f)).size })),
};

// Sammlungen: Ordner mit "typ": "sammlung" bekommen automatisch eine eigene Seite (Bilder + Downloads)
data.kategorien = kategorien;
data.sammlungen = Object.entries(kategorien)
  .filter(([, k]) => k.typ === "sammlung")
  .map(([ordner, k]) => ({
    ordner,
    seite: k.seite,
    titel: k.titel,
    kachel: k.kachel ?? "",
    lead: k.lead,
    hinweis: k.hinweis,
    files: readdirSync(join(root, "brand", ordner))
      .filter((f) => !/^readme(\.md)?$/i.test(f) && statSync(join(root, "brand", ordner, f)).isFile())
      .sort()
      .map((f) => ({ file: f, size: statSync(join(root, "brand", ordner, f)).size })),
  }));
const seitenIds = new Set(data.sammlungen.map((s) => s.seite));
if (seitenIds.size !== data.sammlungen.length) {
  console.error("::error file=brand/kategorien.json::Zwei Sammlungen verwenden dieselbe \"seite\".");
  process.exit(1);
}

// Alle Dateien unter brand/original rekursiv sammeln (relativ zu brand/original)
function walk(dir, rel = "") {
  for (const e of readdirSync(join(dir, rel), { withFileTypes: true })) {
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) walk(dir, r);
    else data.originalFiles.push({ path: r, size: statSync(join(dir, r)).size });
  }
}
walk(join(root, "brand/original"));
data.originalFiles.sort((a, b) => a.path.localeCompare(b.path, "de"));

// 3) Brand-Dateien kopieren: Logos (SVG/PNG), Druckdaten, Definitionen und Originale des Grafikers
mkdirSync(join(out, "assets/druck"), { recursive: true });
mkdirSync(join(out, "assets/definitionen"), { recursive: true });
for (const f of data.druckFiles) copyFileSync(join(root, "brand/druck", f), join(out, "assets/druck", f));
for (const f of readdirSync(join(root, "brand/definitionen")).filter((f) => f.endsWith(".pdf")))
  copyFileSync(join(root, "brand/definitionen", f), join(out, "assets/definitionen", f));
for (const { path } of data.originalFiles) {
  const dest = join(out, "assets/original", path);
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(join(root, "brand/original", path), dest);
}
// Beschilderungs-Vorlagen (Word) mit Vorschaubildern
mkdirSync(join(out, "assets/vorlagen/vorschau"), { recursive: true });
for (const { file } of data.vorlagenFiles) copyFileSync(join(root, "brand/vorlagen", file), join(out, "assets/vorlagen", file));
for (const f of readdirSync(join(root, "brand/vorlagen/vorschau")).filter((f) => f.endsWith(".png")))
  copyFileSync(join(root, "brand/vorlagen/vorschau", f), join(out, "assets/vorlagen/vorschau", f));
// QM-Vorlagen (Word, interne Dokumente) mit Vorschaubildern
mkdirSync(join(out, "assets/vorlagen-qm/vorschau"), { recursive: true });
for (const { file } of data.qmFiles) copyFileSync(join(root, "brand/vorlagen-qm", file), join(out, "assets/vorlagen-qm", file));
for (const f of readdirSync(join(root, "brand/vorlagen-qm/vorschau")).filter((f) => f.endsWith(".png")))
  copyFileSync(join(root, "brand/vorlagen-qm/vorschau", f), join(out, "assets/vorlagen-qm/vorschau", f));
// Sammlungen (z. B. Fotobox-Hintergruende)
for (const s of data.sammlungen) {
  mkdirSync(join(out, "assets", s.ordner), { recursive: true });
  for (const { file } of s.files) copyFileSync(join(root, "brand", s.ordner, file), join(out, "assets", s.ordner, file));
}
for (const f of data.svgFiles) copyFileSync(join(root, "brand/vektor", f), join(out, "assets/logos/svg", f));
for (const f of data.rasterFiles) copyFileSync(join(root, "brand/bildschirm", f), join(out, "assets/logos/png", f));

// 4) Seiten rendern (React -> statisches HTML)
await build({
  entryPoints: [join(root, "site/src/pages.tsx")],
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: join(tmp, "pages.mjs"),
  jsx: "automatic",
  external: ["react", "react-dom", "react/jsx-runtime", "react-dom/server"],
  logLevel: "warning",
});
const { renderSite } = await import(pathToFileURL(join(tmp, "pages.mjs")).href);
const pages = renderSite(data);
for (const { path, html } of pages) {
  const dir = join(out, path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html);
}
// Verhindert, dass GitHub Pages die Dateien durch Jekyll schickt
writeFileSync(join(out, ".nojekyll"), "");
rmSync(tmp, { recursive: true, force: true });
console.log(`Site gebaut: ${pages.length} Seiten -> site-dist/`);
