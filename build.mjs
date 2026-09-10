// Deterministischer Build des Sonnhalde Design-Systems.
//  1. JS-Bundle: React-Komponenten (ESM, externes React) -> dist/index.js
//  2. CSS-Bundle: Tokens + Komponenten-Styles, ueber @import zusammengefuehrt -> dist/styles.css
import { build } from "esbuild";
import { rmSync, mkdirSync } from "node:fs";

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist", { recursive: true });

// 1) JavaScript
await build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  format: "esm",
  outfile: "dist/index.js",
  jsx: "automatic",
  target: ["es2020"],
  platform: "browser",
  sourcemap: true,
  // React wird vom Host bereitgestellt — nicht mitbuendeln.
  external: ["react", "react-dom", "react/jsx-runtime"],
  logLevel: "info",
});

// 2) CSS (eine einzige, vollstaendige styles.css als @import-Huelle)
await build({
  entryPoints: ["src/styles.css"],
  bundle: true,
  outfile: "dist/styles.css",
  loader: { ".css": "css" },
  logLevel: "info",
});

console.log("Build fertig: dist/index.js + dist/styles.css");
