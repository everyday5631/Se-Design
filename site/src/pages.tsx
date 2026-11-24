import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  SonnhaldeProvider,
  SectionHeading,
  GoldRule,
  Button,
  DepartmentCard,
  StatCard,
  InfoCard,
  TextField,
  SelectField,
  TextareaField,
  Notice,
  DocumentHeader,
  AppBar,
} from "../../src/index";
import { COLOR_GROUPS, NAV, QM_VORLAGEN, ROLES, VORLAGEN } from "./content";
import type { ComponentDoc, CssVar, SiteData } from "./content";

/* ---------- Hilfsfunktionen ---------- */

function luminance(hex: string): number {
  const n = parseInt(hex.replace("#", ""), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function rating(ratio: number): { label: string; tone: "good" | "mid" | "bad" } {
  if (ratio >= 7) return { label: "AAA", tone: "good" };
  if (ratio >= 4.5) return { label: "AA", tone: "good" };
  if (ratio >= 3) return { label: "nur gross / Grafik", tone: "mid" };
  return { label: "nicht für Text", tone: "bad" };
}

const isHex = (v: string) => /^#[0-9a-f]{6}$/i.test(v);
const upper = (v: string) => v.toUpperCase();

function varValue(vars: CssVar[], name: string): string {
  const v = vars.find((x) => x.name === name);
  if (!v) throw new Error(`Token fehlt: --${name}`);
  return v.value;
}

/* ---------- Layout ---------- */

const COPY_SCRIPT = `
document.addEventListener("click", function (e) {
  var el = e.target.closest("[data-copy]");
  if (!el) return;
  var text = el.getAttribute("data-copy");
  var done = function () {
    var old = el.getAttribute("data-label") || el.textContent;
    el.setAttribute("data-label", old);
    el.textContent = "Kopiert";
    setTimeout(function () { el.textContent = old; }, 1200);
  };
  if (navigator.clipboard) navigator.clipboard.writeText(text).then(done);
});`;

interface LayoutProps {
  path: string;
  title: string;
  children: React.ReactNode;
}

function Layout({ path, title, children }: LayoutProps) {
  const depth = path === "" ? 0 : path.split("/").length;
  const root = depth === 0 ? "./" : "../".repeat(depth);
  return (
    <html lang="de-CH">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Seite ist vorerst nicht für die Öffentlichkeit gedacht. */}
        <meta name="robots" content="noindex,nofollow" />
        <title>{title === "Übersicht" ? "Sonnhalde Design" : `${title} · Sonnhalde Design`}</title>
        <link rel="stylesheet" href={`${root}assets/styles.css`} />
        <link rel="stylesheet" href={`${root}assets/site.css`} />
      </head>
      <body>
        <SonnhaldeProvider className="docs">
          <aside className="docs__nav">
            <a className="docs__brand" href={root}>
              <img
                src={`${root}assets/logos/svg/Sonnhalde-Logo-hor-neg.svg`}
                alt="Sonnhalde"
                height={34}
              />
              <span>Design</span>
            </a>
            <nav aria-label="Hauptnavigation">
              <ul>
                {NAV.map((n) => (
                  <li key={n.path}>
                    <a
                      href={n.path === "" ? root : `${root}${n.path}/`}
                      aria-current={n.path === path ? "page" : undefined}
                    >
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <p className="docs__nav-foot">Pflege- und Betreuungszentrum Sonnhalde AG, Grüningen</p>
          </aside>
          <main className="docs__main">{children}</main>
        </SonnhaldeProvider>
        <script dangerouslySetInnerHTML={{ __html: COPY_SCRIPT }} />
      </body>
    </html>
  );
}

/* ---------- Seiten ---------- */

function Overview() {
  return (
    <>
      <SectionHeading
        as="h1"
        eyebrow="Design-System"
        title="Sonnhalde Design"
        lead="Warm, seriös, ruhig und würdevoll. Kein klinischer Look, kein generischer SaaS-Karten-Stil. Struktur entsteht durch klare Linien in Heading-Gold, nicht durch Dekoration."
      />
      <div className="grid grid--3">
        {NAV.filter((n) => n.path).map((n) => (
          <a key={n.path} className="tile" href={`${n.path}/`}>
            <InfoCard title={n.label}>{TILE_TEXT[n.path]}</InfoCard>
          </a>
        ))}
      </div>
      <Notice title="Vorabversion.">
        Diese Seite ist vorerst nicht öffentlich gedacht und für Suchmaschinen gesperrt.
      </Notice>
      <h2 className="docs__h2">Grundsätze</h2>
      <ul className="docs__list">
        <li>Durchgängig <b>Arial</b>, gut lesbar auch für ältere Nutzende.</li>
        <li>Lese-Überschriften und Fliesstext bleiben in Navy.</li>
        <li>Heading-Gold und Logo-Gold sind auf Cream nicht für Fliesstext geeignet; für kleine Auszeichnungen auf Hell das dunklere Gold-Deep.</li>
        <li>Signalfarben dienen nur dem Status und ersetzen nie das Gold als Akzent.</li>
      </ul>
    </>
  );
}

const TILE_TEXT: Record<string, string> = {
  farben: "Grundfarben, Stützfarben, Signalfarben und die offiziellen Werte des Grafikers.",
  typografie: "Arial und die Schriftgrössen-Skala.",
  abstaende: "Abstände, Linienstärke und Eckenradius.",
  logo: "Alle Logo-Varianten als SVG und PNG zum Herunterladen.",
  druck: "Logos als Druck-PDF in 4C und Pantone.",
  definitionen: "Das Blatt «SONNHALDE Definitionen» des Grafikers mit allen Farbwerten.",
  originale: "Die unveränderte Lieferung des Grafikers (EPS, SVG, PNG, PDF).",
  vorlagen: "Word-Vorlagen: QM-Vorlagen für interne Dokumente (hoch, quer) und Türschilder.",
  komponenten: "React-Komponenten mit Live-Vorschau, Code und Eigenschaften.",
};

function Swatch({ v }: { v: CssVar }) {
  const hex = upper(v.value);
  const cream = varValue(CREAM_REF.vars, "sonn-cream");
  const navy = varValue(CREAM_REF.vars, "sonn-navy");
  const onCream = contrast(v.value, cream);
  const onNavy = contrast(v.value, navy);
  const rc = rating(onCream);
  const rn = rating(onNavy);
  return (
    <div className="swatch">
      <div className="swatch__chip" style={{ background: v.value }} />
      <div className="swatch__body">
        <div className="swatch__name">--{v.name}</div>
        <button className="swatch__hex" data-copy={hex} title="Hex-Wert kopieren" type="button">
          {hex}
        </button>
        {ROLES[v.name] ? <p className="swatch__role">{ROLES[v.name]}</p> : null}
        {v.comment ? <p className="swatch__note">{v.comment}</p> : null}
        <dl className="swatch__contrast">
          <div>
            <dt>auf Cream</dt>
            <dd>
              {onCream.toFixed(2)}:1 <span className={`tag tag--${rc.tone}`}>{rc.label}</span>
            </dd>
          </div>
          <div>
            <dt>auf Navy</dt>
            <dd>
              {onNavy.toFixed(2)}:1 <span className={`tag tag--${rn.tone}`}>{rn.label}</span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

// Wird in renderSite gesetzt; Swatch braucht Cream und Navy als Referenz.
const CREAM_REF: { vars: CssVar[] } = { vars: [] };

function Colors({ data }: { data: SiteData }) {
  const byName = (n: string) => data.vars.find((v) => v.name === n);
  return (
    <>
      <SectionHeading
        as="h1"
        eyebrow="Grundlagen"
        title="Farben"
        lead="Klick auf einen Hex-Wert kopiert ihn. Die Kontrastwerte (WCAG) sind live aus den Tokens berechnet."
      />
      {COLOR_GROUPS.map((g) => (
        <section key={g.id} id={g.id}>
          <h2 className="docs__h2">{g.title}</h2>
          <p className="docs__lead">{g.lead}</p>
          <div className="grid grid--2">
            {g.names.map((n) => {
              const v = byName(n);
              return v && isHex(v.value) ? <Swatch key={n} v={v} /> : null;
            })}
          </div>
        </section>
      ))}
      <section id="offiziell">
        <h2 className="docs__h2">Offizielle Werte des Grafikers</h2>
        <p className="docs__lead">
          Aus «SONNHALDE Definitionen» (eightynine.ch, Oktober 2024). Sie ergänzen die Palette oben und
          ersetzen dort nichts. Ob sie die bisherigen Gold- und Navy-Töne ablösen, ist noch nicht entschieden.
        </p>
        <div className="grid grid--2">
          {data.official
            .filter((v) => isHex(v.value))
            .map((v) => (
              <Swatch key={v.name} v={v} />
            ))}
        </div>
      </section>
    </>
  );
}

function Typography({ data }: { data: SiteData }) {
  const family = varValue(data.vars, "sonn-font");
  const sizes = data.vars.filter((v) => v.name.startsWith("sonn-size-"));
  const sample: Record<string, string> = {
    display: "Willkommen in der Sonnhalde",
    h2: "Unser Angebot",
    h3: "Wohnbereich Sonnenblick",
    h4: "Tagesablauf",
    lead: "Wir begleiten Menschen mit Wärme, Ruhe und Respekt.",
    body: "Fliesstext in Arial, 16 Pixel, Zeilenhöhe 1.6. Gut lesbar auch bei längeren Texten.",
    label: "FELDBESCHRIFTUNG",
    caption: "Stand November 2026",
  };
  return (
    <>
      <SectionHeading
        as="h1"
        eyebrow="Grundlagen"
        title="Typografie"
        lead="Durchgängig Arial. Keine Webfonts, keine Ladezeit, überall gleich."
      />
      <h2 className="docs__h2">Schrift</h2>
      <div className="specimen" style={{ fontFamily: family }}>
        <div className="specimen__big">Aa</div>
        <div>
          <b>Arial</b>
          <p className="docs__code-inline">font-family: {family}</p>
          <p>ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />abcdefghijklmnopqrstuvwxyz<br />0123456789 ÄÖÜ äöü é è à</p>
        </div>
      </div>
      <h2 className="docs__h2">Grössen</h2>
      <table className="docs__table">
        <thead>
          <tr><th>Token</th><th>Wert</th><th>Beispiel</th></tr>
        </thead>
        <tbody>
          {sizes.map((s) => {
            const key = s.name.replace("sonn-size-", "");
            return (
              <tr key={s.name}>
                <td><code>--{s.name}</code></td>
                <td>{s.value}</td>
                <td><span style={{ fontSize: s.value, lineHeight: 1.25 }}>{sample[key] ?? "Beispieltext"}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

function Spacing({ data }: { data: SiteData }) {
  const spaces = data.vars.filter((v) => v.name.startsWith("sonn-space-"));
  return (
    <>
      <SectionHeading
        as="h1"
        eyebrow="Grundlagen"
        title="Abstände & Form"
        lead="Eine kleine, ruhige Skala. Ecken sind kaum gerundet, Struktur entsteht durch Linien."
      />
      <h2 className="docs__h2">Abstände</h2>
      <table className="docs__table">
        <thead>
          <tr><th>Token</th><th>Wert</th><th>Vorschau</th></tr>
        </thead>
        <tbody>
          {spaces.map((s) => (
            <tr key={s.name}>
              <td><code>--{s.name}</code></td>
              <td>{s.value}</td>
              <td><span className="spacebar" style={{ width: s.value }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="docs__h2">Linie und Radius</h2>
      <div className="grid grid--2">
        <InfoCard title={`Gold-Linie · ${varValue(data.vars, "sonn-rule")}`}>
          <code>--sonn-rule</code>. Die Linie in Heading-Gold ist das zentrale Strukturelement.
        </InfoCard>
        <InfoCard title={`Eckenradius · ${varValue(data.vars, "sonn-radius")}`}>
          <code>--sonn-radius</code>. Bewusst klein, damit nichts verspielt wirkt.
        </InfoCard>
      </div>
      <GoldRule tall />
      <h2 className="docs__h2">Fokus</h2>
      <p>
        Der Tastaturfokus ist ein <code>{varValue(data.vars, "sonn-focus-ring")}</code> Ring in Logo-Gold
        (<code>--sonn-focus-ring</code>). Er wird nie entfernt.
      </p>
    </>
  );
}

interface LogoInfo {
  file: string;
  base: string;
  group: string;
  bg: "light" | "navy" | "yellow";
  png?: string;
}

const GROUPS: [RegExp, string][] = [
  [/Bildmarke/i, "Bildmarke (Sonne)"],
  [/Logo-Zusatz-ver/i, "Logo mit Zusatz, vertikal"],
  [/Logo-Zusatz-hor/i, "Logo mit Zusatz, horizontal"],
  [/Logo-hor/i, "Wortmarke, horizontal"],
];

function logoInfo(data: SiteData): LogoInfo[] {
  const raster = new Map(data.rasterFiles.map((f) => [f.replace(/\.[^.]+$/, "").toLowerCase(), f]));
  return data.svgFiles.map((file) => {
    const base = file.replace(/\.svg$/, "");
    const group = GROUPS.find(([re]) => re.test(base))?.[1] ?? "Weitere";
    const bg = /auf-blau|-neg$/.test(base) ? "navy" : /auf-gelb/.test(base) ? "yellow" : "light";
    return { file, base, group, bg, png: raster.get(base.toLowerCase()) };
  });
}

function Logos({ data }: { data: SiteData }) {
  const logos = logoInfo(data);
  const groups = GROUPS.map(([, name]) => name);
  return (
    <>
      <SectionHeading
        as="h1"
        eyebrow="Marke"
        title="Logo"
        lead="Die Logos des Grafikers (eightynine.ch). Für jede Farbvariante gibt es eine eigene Datei, die Farbe lässt sich nicht per CSS ändern. Hintergründe gehören nicht zur Datei."
      />
      <Notice tone="warning" title="Hinweis.">
        Die weisse Sonne auf Sonnengelb («auf-gelb») erreicht nur 1.85:1 und ist so vom Grafiker gestaltet.
      </Notice>
      {groups.map((g) => (
        <section key={g}>
          <h2 className="docs__h2">{g}</h2>
          <div className="grid grid--2">
            {logos
              .filter((l) => l.group === g)
              .map((l) => (
                <figure key={l.file} className="logo">
                  <div className={`logo__stage logo__stage--${l.bg}`}>
                    <img src={`../assets/logos/svg/${l.file}`} alt={l.base} loading="lazy" />
                  </div>
                  <figcaption>
                    <code>{l.base}</code>
                    <span className="logo__links">
                      <a href={`../assets/logos/svg/${l.file}`} download>SVG</a>
                      {l.png ? <a href={`../assets/logos/png/${l.png}`} download>PNG</a> : <span title="Nur als SVG vorhanden">kein PNG</span>}
                    </span>
                  </figcaption>
                </figure>
              ))}
          </div>
        </section>
      ))}
      <p className="docs__lead">
        Für den Druck gibt es die <a href="../druck/">Druckdaten</a> (4C und Pantone), die Rohlieferung
        des Grafikers liegt unter <a href="../originale/">Originale</a>.
      </p>
    </>
  );
}

function formatSize(b: number): string {
  return b >= 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`;
}

const enc = (p: string) => p.split("/").map(encodeURIComponent).join("/");

function Druck({ data }: { data: SiteData }) {
  const sets: [string, string][] = [
    ["4C", "4C (CMYK)"],
    ["Pantone", "Pantone (Sonderfarben)"],
  ];
  return (
    <>
      <SectionHeading
        as="h1"
        eyebrow="Marke"
        title="Druckdaten"
        lead="Logos als PDF, umgewandelt aus den EPS-Dateien des Grafikers. Pfade und Farben bleiben unverändert."
      />
      <ul className="docs__list">
        <li><b>4C</b> ist DeviceCMYK, zum Beispiel Sonnengelb 0 / 35 / 92 / 0 und Anthrazit 0 / 0 / 0 / 90.</li>
        <li><b>Pantone</b> trägt Sonderfarben: Sonnengelb als Pantone 129U / 137C. Es gibt keine Pantone-Fassung «neg».</li>
        <li>Weisse Dateien («neg») erscheinen auf weissem Grund leer. Das ist richtig.</li>
      </ul>
      {sets.map(([key, title]) => (
        <section key={key}>
          <h2 className="docs__h2">{title}</h2>
          <FileTable
            rows={data.druckFiles
              .filter((f) => f.endsWith(`-${key}.pdf`))
              .map((f) => ({ name: f, href: `../assets/druck/${encodeURIComponent(f)}` }))}
          />
        </section>
      ))}
    </>
  );
}

function FileTable({ rows }: { rows: { name: string; href: string; size?: number }[] }) {
  return (
    <table className="docs__table">
      <thead>
        <tr><th>Datei</th><th>Grösse</th></tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.href}>
            <td><a href={r.href} download>{r.name}</a></td>
            <td>{r.size ? formatSize(r.size) : ""}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Definitions() {
  const pdf = "../assets/definitionen/SONNHALDE-Definitionen.pdf";
  const rows = [
    ["Sonnhalde Sonnengelb", "129U / 137C", "0 35 92 0", "249 177 25", "#F9B119", "1037 Sonnengelb", "764 Saffron"],
    ["Sonnhalde Anthrazit", "Black 3U", "0 0 0 90", "40 40 40", "#282828", "7021 Schwarzgrau", "759 Komatsu Grey"],
    ["Sonnhalde Dunkelblau", "655U / 539C", "100 60 25 70", "35 52 70", "#233446", "5011 Stahlblau", "724-01 Alfa Blue"],
  ];
  return (
    <>
      <SectionHeading
        as="h1"
        eyebrow="Marke"
        title="Definitionen"
        lead="«SONNHALDE Definitionen — Logos und Farben», A3-Blatt von eightynine.ch, Oktober 2024."
      />
      <p><a href={pdf} download>PDF herunterladen</a></p>
      <h2 className="docs__h2">Farben</h2>
      <p className="docs__lead">Wörtlich aus dem Blatt übernommen.</p>
      <div className="table-scroll">
        <table className="docs__table">
          <thead>
            <tr><th>Farbe</th><th>Pantone</th><th>CMYK</th><th>RGB</th><th>HEX</th><th>RAL</th><th>Avery</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]}>
                <td>
                  <span className="dot" style={{ background: r[4] }} />
                  {r[0]}
                </td>
                {r.slice(1).map((c, i) => <td key={i}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="docs__list">
        <li><b>Farbpalette Website:</b> Anthrazit, Dunkelblau, Sonnengelb und zwei weitere, beschriftet mit <code>#AC9F95</code> (warmes Grau, ohne Namen) und <code>#FDF9F6</code> (Cream).</li>
        <li><b>Schriften laut Blatt:</b> Open Sans und Source Serif Pro. Das Design-System verwendet durchgängig Arial.</li>
        <li>Das Blatt nennt keine Schutzräume, Mindestgrössen und keinen Einsatzbereich der Schriften.</li>
      </ul>
      <Notice tone="warning" title="Beim Grafiker zu klären.">
        Das Dunkelblau ist mit #233446 beschriftet, die Farbfläche und die blauen Logoflächen sind aber etwa
        #00263F gemalt (gemessen am gerasterten Blatt).
      </Notice>
      <h2 className="docs__h2">Vorschau</h2>
      <iframe className="pdf" src={pdf} title="SONNHALDE Definitionen" />
    </>
  );
}

function Originals({ data }: { data: SiteData }) {
  const total = data.originalFiles.reduce((a, f) => a + f.size, 0);
  const folders = new Map<string, { path: string; size: number }[]>();
  for (const f of data.originalFiles) {
    const dir = f.path.includes("/") ? f.path.slice(0, f.path.lastIndexOf("/")) : "";
    folders.set(dir, [...(folders.get(dir) ?? []), f]);
  }
  return (
    <>
      <SectionHeading
        as="h1"
        eyebrow="Marke"
        title="Originale"
        lead={`Die unveränderte Lieferung des Grafikers (eightynine.ch), ${data.originalFiles.length} Dateien, ${formatSize(total)}. Hier liegen auch die EPS-Dateien.`}
      />
      {[...folders.entries()].map(([dir, files]) => (
        <section key={dir}>
          <h2 className="docs__h3">{dir.replace(/^02 SONNHALDE Logos\//, "")}</h2>
          <FileTable
            rows={files.map((f) => ({
              name: f.path.slice(f.path.lastIndexOf("/") + 1),
              href: `../assets/original/${enc(f.path)}`,
              size: f.size,
            }))}
          />
        </section>
      ))}
    </>
  );
}

/* ---------- Komponenten ---------- */

const COMPONENTS: (ComponentDoc & { preview: React.ReactNode })[] = [
  {
    id: "button",
    name: "Button",
    summary: "Vier Rollen: primary für die Hauptaktion, secondary für Nebenaktionen, quiet für Unaufdringliches, onNavy für dunkle Flächen.",
    code: `<Button variant="primary">Termin bestätigen</Button>
<Button variant="secondary">Abbrechen</Button>
<Button variant="quiet">Mehr erfahren</Button>`,
    props: [
      { name: "variant", type: '"primary" | "secondary" | "quiet" | "onNavy"', description: "Visuelle Rolle. Standard: primary." },
      { name: "…", type: "ButtonHTMLAttributes", description: "Alle üblichen Button-Attribute." },
    ],
    preview: (
      <div className="row">
        <Button variant="primary">Termin bestätigen</Button>
        <Button variant="secondary">Abbrechen</Button>
        <Button variant="quiet">Mehr erfahren</Button>
      </div>
    ),
  },
  {
    id: "button-on-navy",
    name: "Button · onNavy",
    summary: "Auf Navy-Flächen in Logo-Gold.",
    darkPreview: true,
    code: `<Button variant="onNavy">Kontakt aufnehmen</Button>`,
    props: [],
    preview: <Button variant="onNavy">Kontakt aufnehmen</Button>,
  },
  {
    id: "section-heading",
    name: "SectionHeading",
    summary: "Abschnittsüberschrift mit Eyebrow, Titel und Einleitung. Struktur über die Gold-Linie.",
    code: `<SectionHeading
  eyebrow="Verwaltung"
  title="Dienstplan Neubau OG"
  lead="Interne Übersicht der Belegung."
/>`,
    props: [
      { name: "eyebrow", type: "string", description: "Kleine Zeile über dem Titel." },
      { name: "title", type: "ReactNode", description: "Titel (Pflicht)." },
      { name: "lead", type: "ReactNode", description: "Einleitungstext." },
      { name: "as", type: '"h1" | "h2" | "h3"', description: "HTML-Ebene. Standard: h2." },
    ],
    preview: <SectionHeading eyebrow="Verwaltung" title="Dienstplan Neubau OG" lead="Interne Übersicht der Belegung." />,
  },
  {
    id: "gold-rule",
    name: "GoldRule",
    summary: "Trennlinie in Heading-Gold.",
    code: `<GoldRule />
<GoldRule tall />`,
    props: [{ name: "tall", type: "boolean", description: "Höhere Variante." }],
    preview: (
      <>
        <GoldRule />
        <GoldRule tall />
      </>
    ),
  },
  {
    id: "department-card",
    name: "DepartmentCard",
    summary: "Abteilungskarte mit Gold-Oberkante, für die Wohnbereiche.",
    code: `<DepartmentCard name="Sonnenblick">
  Belegung und Team auf einen Blick.
</DepartmentCard>`,
    props: [
      { name: "tag", type: "string", description: "Kennung über dem Titel. Standard: «Abteilung»." },
      { name: "name", type: "ReactNode", description: "Name des Bereichs (Pflicht)." },
      { name: "children", type: "ReactNode", description: "Beschreibung." },
    ],
    preview: <DepartmentCard name="Sonnenblick">Belegung und Team auf einen Blick.</DepartmentCard>,
  },
  {
    id: "stat-card",
    name: "StatCard",
    summary: "Einzelne Kennzahl auf Navy, Zahl in Logo-Gold.",
    code: `<StatCard value="14">Wohnbereiche</StatCard>`,
    props: [
      { name: "value", type: "ReactNode", description: "Die hervorgehobene Zahl (Pflicht)." },
      { name: "children", type: "ReactNode", description: "Beschriftung." },
    ],
    preview: <StatCard value="14">Wohnbereiche</StatCard>,
  },
  {
    id: "info-card",
    name: "InfoCard",
    summary: "Ruhige Info-Fläche auf gedämpftem Cream, ohne Hervorhebung.",
    code: `<InfoCard title="Besuchszeiten">Täglich von 10 bis 18 Uhr.</InfoCard>`,
    props: [
      { name: "title", type: "ReactNode", description: "Titel (Pflicht)." },
      { name: "children", type: "ReactNode", description: "Fliesstext." },
    ],
    preview: <InfoCard title="Besuchszeiten">Täglich von 10 bis 18 Uhr.</InfoCard>,
  },
  {
    id: "fields",
    name: "TextField · SelectField · TextareaField",
    summary: "Formularfelder mit Label, Hilfetext, Pflicht- und Fehlerzustand.",
    code: `<TextField label="Name" required help="Vor- und Nachname" />
<SelectField label="Bereich">
  <option>Sonnenblick</option>
</SelectField>
<TextareaField label="Nachricht" error="Bitte ausfüllen." />`,
    props: [
      { name: "label", type: "ReactNode", description: "Sichtbare Beschriftung (Pflicht)." },
      { name: "required", type: "boolean", description: "Pflichtfeld (Gold-Stern)." },
      { name: "help", type: "ReactNode", description: "Hilfetext unter dem Feld." },
      { name: "error", type: "ReactNode", description: "Fehlermeldung; setzt den Fehlerzustand." },
      { name: "fieldClassName", type: "string", description: "Klasse für den äusseren Container." },
    ],
    preview: (
      <div className="stack">
        <TextField label="Name" required help="Vor- und Nachname" placeholder="Maria Muster" />
        <SelectField label="Bereich">
          <option>Sonnenblick</option>
          <option>Morgenrot</option>
        </SelectField>
        <TextareaField label="Nachricht" error="Bitte ausfüllen." />
      </div>
    ),
  },
  {
    id: "notice",
    name: "Notice",
    summary: "Hinweis- oder Statusbox mit linker Akzentkante. Signalfarben sind bewusst gedämpft.",
    code: `<Notice title="Hinweis.">Neutraler Hinweis.</Notice>
<Notice tone="success" title="Gespeichert.">…</Notice>
<Notice tone="warning" title="Achtung.">…</Notice>`,
    props: [
      { name: "tone", type: '"info" | "success" | "warning"', description: "Art des Hinweises. Standard: info." },
      { name: "title", type: "ReactNode", description: "Fett gesetzter Auftakt." },
    ],
    preview: (
      <div className="stack">
        <Notice title="Hinweis.">Neutraler Hinweis.</Notice>
        <Notice tone="success" title="Gespeichert.">Die Änderung wurde übernommen.</Notice>
        <Notice tone="warning" title="Achtung.">Bitte vor dem Absenden prüfen.</Notice>
      </div>
    ),
  },
  {
    id: "document-header",
    name: "DocumentHeader",
    summary: "Dokument- und PDF-Kopf: Navy-Fläche mit Logo-Gold-Kante, für Vorlagen, Protokolle, Flyer.",
    code: `<DocumentHeader kicker="Intern" title="Protokoll Teamsitzung" />`,
    props: [
      { name: "brand", type: "ReactNode", description: "Markenzeile. Standard: «Sonnhalde AG»." },
      { name: "kicker", type: "ReactNode", description: "Einordnung, z. B. «Intern»." },
      { name: "title", type: "ReactNode", description: "Dokumenttitel (Pflicht)." },
    ],
    preview: <DocumentHeader kicker="Intern" title="Protokoll Teamsitzung" />,
  },
  {
    id: "app-bar",
    name: "AppBar",
    summary: "Kopfzeile interner Web-Werkzeuge: Navy-Leiste mit Wortmarke, Navigation, Brotkrumen und Seitentitel.",
    code: `<AppBar
  links={[{ label: "Dienstplan", active: true }, { label: "Belegung" }]}
  crumb="Verwaltung / Dienstplan"
  heading="Neubau OG"
/>`,
    props: [
      { name: "brand", type: "{ lead; accent }", description: "Wortmarke, zweiter Teil in Logo-Gold." },
      { name: "links", type: "AppBarLink[]", description: "Navigation; aktiver Punkt in Heading-Gold." },
      { name: "crumb", type: "ReactNode", description: "Brotkrumen-Pfad." },
      { name: "heading", type: "ReactNode", description: "Seitentitel." },
    ],
    preview: (
      <AppBar
        links={[{ label: "Dienstplan", active: true }, { label: "Belegung" }]}
        crumb="Verwaltung / Dienstplan"
        heading="Neubau OG"
      />
    ),
  },
];

function Vorlagen({ data }: { data: SiteData }) {
  const size = new Map(data.vorlagenFiles.map((f) => [f.file, f.size]));
  const qmSize = new Map(data.qmFiles.map((f) => [f.file, f.size]));
  const gruppen = ["Bewohnerschilder", "Büro"] as const;
  return (
    <>
      <SectionHeading
        as="h1"
        eyebrow="Marke"
        title="Vorlagen"
        lead="Word-Vorlagen der SONNHALDE: die QM-Vorlagen für interne Dokumente und die Vorlagen für Türschilder."
      />
      <h2 className="docs__h2">Interne Dokumente (QM)</h2>
      <Notice tone="info" title="Pflicht.">
        Für interne Dokumente muss eine der beiden QM-Vorlagen verwendet werden. Sie gelten
        ausschliesslich für interne Zwecke, sind schwarz-weiss und in Arial. Es sind normale
        Word-Dateien (.docx): vor dem Ausfüllen als Kopie unter neuem Namen speichern, damit das
        Original unverändert bleibt.
      </Notice>
      <div className="grid grid--2">
        {QM_VORLAGEN.map((v) => (
          <figure key={v.base} className="logo">
            <div className="logo__stage logo__stage--light vorlage__stage">
              <img
                src={`../assets/vorlagen-qm/vorschau/${v.vorschau}`}
                alt={`Vorschau ${v.title}`}
                loading="lazy"
              />
            </div>
            <figcaption className="vorlage__cap">
              <div>
                <b>{v.title}</b>
                <p className="vorlage__meta">{v.layout}</p>
                <p className="vorlage__meta"><b>Felder:</b> {v.felder}</p>
                {v.hinweis ? <p className="vorlage__meta"><b>Hinweis:</b> {v.hinweis}</p> : null}
              </div>
              <span className="logo__links">
                <a href={`../assets/vorlagen-qm/${v.base}.docx`} download>
                  .docx{qmSize.get(`${v.base}.docx`) ? ` (${formatSize(qmSize.get(`${v.base}.docx`)!)})` : ""}
                </a>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <h2 className="docs__h2">Türschilder</h2>
      <p className="docs__lead">
        Word-Vorlagen (.dotx) für die Türschilder im A6-Format. Ein Doppelklick auf die Datei öffnet
        ein neues Dokument, die Vorlage selbst bleibt unverändert.
      </p>
      <Notice tone="warning" title="Hinweis.">
        Die Schilder werden auf A4 quer gedruckt, Seitenrand 0. Schrift ist durchgehend Arial,
        das Logo ist als PNG eingebettet. Die gelbe und cyanfarbene Markierung hebt die
        Platzhalter hervor.
      </Notice>
      {gruppen.map((g) => (
        <section key={g}>
          <h3 className="docs__h3">{g}</h3>
          <div className="grid grid--2">
            {VORLAGEN.filter((v) => v.gruppe === g).map((v) => (
              <figure key={v.base} className="logo">
                <div className="logo__stage logo__stage--light vorlage__stage">
                  <img
                    src={`../assets/vorlagen/vorschau/${v.base}.png`}
                    alt={`Vorschau ${v.title}`}
                    loading="lazy"
                  />
                </div>
                <figcaption className="vorlage__cap">
                  <div>
                    <b>{v.title}</b>
                    <p className="vorlage__meta">{v.layout}</p>
                    <p className="vorlage__meta"><b>Felder:</b> {v.felder}</p>
                    {v.hinweis ? <p className="vorlage__meta"><b>Hinweis:</b> {v.hinweis}</p> : null}
                  </div>
                  <span className="logo__links">
                    <a href={`../assets/vorlagen/${v.base}.dotx`} download>
                      .dotx{size.get(`${v.base}.dotx`) ? ` (${formatSize(size.get(`${v.base}.dotx`)!)})` : ""}
                    </a>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
      <h2 className="docs__h2">Benennung</h2>
      <p className="docs__lead">
        <code>2026_Vorlage_Beschilderung_Sonnhalde_&lt;Layout&gt;_A6_&lt;Zimmerart&gt;_V&lt;n&gt;.dotx</code>.
        Layout ist «Einzeln» (ein Schild) oder «Kacheln» (2 × 2). Bei jeder neuen Fassung zählt die
        Versionsnummer hoch.
      </p>
    </>
  );
}

function Components() {
  return (
    <>
      <SectionHeading
        as="h1"
        eyebrow="Bibliothek"
        title="Komponenten"
        lead="React-Komponenten aus @sonnhalde/design-system. Alle stehen innerhalb des SonnhaldeProviders, der Tokens, Arial und den Cream-Grund setzt."
      />
      <h2 className="docs__h2" id="einrichten">Einrichten</h2>
      <pre className="code"><code>{`import { SonnhaldeProvider, Button } from "@sonnhalde/design-system";
import "@sonnhalde/design-system/styles.css";

export function App() {
  return (
    <SonnhaldeProvider>
      <Button variant="primary">Termin bestätigen</Button>
    </SonnhaldeProvider>
  );
}`}</code></pre>
      {COMPONENTS.map((c) => (
        <section key={c.id} id={c.id} className="component">
          <h2 className="docs__h2">{c.name}</h2>
          <p className="docs__lead">{c.summary}</p>
          <div className={`preview${c.darkPreview ? " preview--navy" : ""}`}>{c.preview}</div>
          <pre className="code"><code>{c.code}</code></pre>
          {c.props.length > 0 ? (
            <table className="docs__table">
              <thead>
                <tr><th>Eigenschaft</th><th>Typ</th><th>Beschreibung</th></tr>
              </thead>
              <tbody>
                {c.props.map((p) => (
                  <tr key={p.name}>
                    <td><code>{p.name}</code></td>
                    <td><code>{p.type}</code></td>
                    <td>{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </section>
      ))}
    </>
  );
}

/* ---------- Einstieg ---------- */

export function renderSite(data: SiteData): { path: string; html: string }[] {
  CREAM_REF.vars = data.vars;
  const pages: { path: string; title: string; body: React.ReactNode }[] = [
    { path: "", title: "Übersicht", body: <Overview /> },
    { path: "farben", title: "Farben", body: <Colors data={data} /> },
    { path: "typografie", title: "Typografie", body: <Typography data={data} /> },
    { path: "abstaende", title: "Abstände & Form", body: <Spacing data={data} /> },
    { path: "logo", title: "Logo", body: <Logos data={data} /> },
    { path: "druck", title: "Druckdaten", body: <Druck data={data} /> },
    { path: "definitionen", title: "Definitionen", body: <Definitions /> },
    { path: "originale", title: "Originale", body: <Originals data={data} /> },
    { path: "vorlagen", title: "Vorlagen", body: <Vorlagen data={data} /> },
    { path: "komponenten", title: "Komponenten", body: <Components /> },
  ];
  return pages.map((p) => ({
    path: p.path,
    html:
      "<!doctype html>" +
      renderToStaticMarkup(
        <Layout path={p.path} title={p.title}>
          {p.body}
        </Layout>,
      ),
  }));
}
