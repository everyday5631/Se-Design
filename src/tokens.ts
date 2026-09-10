// Design-Tokens als JS-Objekt — Spiegel von tokens.css fuer programmatischen Zugriff.
// Die CSS-Variablen (--sonn-*) bleiben die Quelle der Wahrheit fuer das Styling;
// diese Werte sind fuer Fälle gedacht, in denen Tokens in JS gebraucht werden.
export const tokens = {
  color: {
    navy: "#233446",
    logoGold: "#efbb50",
    headingGold: "#c8962e",
    cream: "#fdf9f6",
    navyTint: "#e7ebef",
    navyDeep: "#1a2836",
    stone: "#6b6459",
    line: "#dcd4c9",
    goldDeep: "#a97c22",
    surface: "#ffffff",
    creamSink: "#f6efe8",
    ok: "#3f6b4c",
    okBg: "#e7efe8",
    warn: "#8a5a1e",
    warnBg: "#f6e9d6",
    error: "#b23b3b",
  },
  font: {
    family: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
  },
  fontSize: {
    display: "48px",
    h2: "32px",
    h3: "24px",
    h4: "20px",
    lead: "18px",
    body: "16px",
    label: "13px",
    caption: "12px",
  },
  radius: "3px",
  rule: "3px",
  space: {
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "24px",
    6: "32px",
    7: "48px",
  },
} as const;

export type SonnhaldeTokens = typeof tokens;
