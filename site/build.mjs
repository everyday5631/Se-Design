// Baut die Sonnhalde-Dokumentationsseite als statische Dateien nach site-dist/.
//   node site/build.mjs           -> site-dist/
// Keine neuen Abhaengigkeiten: esbuild und react-dom sind bereits vorhanden.
import { build } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync, readdirSync } from "node:fs";
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
};

// 3) Nur Logos veroeffentlichen (SVG + PNG), nicht brand/original, druck oder definitionen
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
