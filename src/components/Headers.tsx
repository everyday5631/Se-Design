import * as React from "react";

export interface DocumentHeaderProps {
  /** Kleiner Marken-Zeile oben (Standard: „Sonnhalde AG"). */
  brand?: React.ReactNode;
  /** Einordnung, z. B. „Intern" oder „Fuer Angehoerige". */
  kicker?: React.ReactNode;
  /** Dokumenttitel. */
  title: React.ReactNode;
  className?: string;
}

/**
 * Dokument-/PDF-Kopf: Navy-Flaeche mit Logo-Gold-Kante. Fuer Word-Vorlagen,
 * Protokolle, Flyer und Broschueren.
 */
export function DocumentHeader({
  brand = "Sonnhalde AG",
  kicker,
  title,
  className,
}: DocumentHeaderProps): React.JSX.Element {
  return (
    <div className={["sonn-docheader", className].filter(Boolean).join(" ")}>
      {brand ? <div className="sonn-docheader__brand">{brand}</div> : null}
      {kicker ? <div className="sonn-docheader__kicker">{kicker}</div> : null}
      <h4 className="sonn-docheader__title">{title}</h4>
    </div>
  );
}

export interface AppBarLink {
  label: string;
  href?: string;
  active?: boolean;
}

export interface AppBarProps {
  /** Wortmarke; der zweite Teil wird in Logo-Gold gesetzt. */
  brand?: { lead: string; accent: string };
  /** Navigationslinks in der oberen Leiste. */
  links?: AppBarLink[];
  /** Brotkrumen-Pfad ueber der Ueberschrift. */
  crumb?: React.ReactNode;
  /** Seitentitel im Werkzeug. */
  heading?: React.ReactNode;
  className?: string;
}

/**
 * Kopfzeile eines internen Web-Werkzeugs: Navy-Leiste mit Wortmarke, Navigation
 * (aktiver Punkt in Heading-Gold) und darunter Brotkrumen plus Seitentitel.
 */
export function AppBar({
  brand = { lead: "Sonn", accent: "halde" },
  links = [],
  crumb,
  heading,
  className,
}: AppBarProps): React.JSX.Element {
  return (
    <div className={["sonn-appbar", className].filter(Boolean).join(" ")}>
      <div className="sonn-appbar__top">
        <span className="sonn-appbar__brand">
          {brand.lead}
          <span className="sonn-appbar__brand-accent">{brand.accent}</span>
        </span>
        {links.length > 0 ? (
          <nav className="sonn-appbar__nav">
            {links.map((l, i) => (
              <a
                key={i}
                href={l.href ?? "#"}
                className={["sonn-appbar__link", l.active ? "is-active" : ""]
                  .filter(Boolean)
                  .join(" ")}
                aria-current={l.active ? "page" : undefined}
              >
                {l.label}
              </a>
            ))}
          </nav>
        ) : null}
      </div>
      {(crumb || heading) && (
        <div className="sonn-appbar__body">
          {crumb ? <div className="sonn-appbar__crumb">{crumb}</div> : null}
          {heading ? <h4 className="sonn-appbar__heading">{heading}</h4> : null}
        </div>
      )}
    </div>
  );
}
