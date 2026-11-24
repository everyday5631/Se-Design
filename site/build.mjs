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
};

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
