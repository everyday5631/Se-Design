import * as React from "react";

export interface SectionHeadingProps {
  /** Kleine Auszeichnung ueber dem Titel (Gold-Deep, Grossbuchstaben). */
  eyebrow?: string;
  /** Der Abschnittstitel. */
  title: React.ReactNode;
  /** Optionaler Einleitungssatz unter der Gold-Linie. */
  lead?: React.ReactNode;
  /** Ueberschriftebene fuer die Semantik (Standard: h2). */
  as?: "h1" | "h2" | "h3";
  className?: string;
}

/**
 * Abschnittskopf mit Eyebrow, Titel und der tragenden Gold-Linie darunter —
 * das Grundmotiv des Systems, das Struktur ohne Karten-Dekor schafft.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  as: Tag = "h2",
  className,
}: SectionHeadingProps): React.JSX.Element {
  return (
    <div className={["sonn-heading", className].filter(Boolean).join(" ")}>
      {eyebrow ? <p className="sonn-heading__eyebrow">{eyebrow}</p> : null}
      <Tag className="sonn-heading__title">{title}</Tag>
      <hr className="sonn-heading__rule" />
      {lead ? <p className="sonn-heading__lead">{lead}</p> : null}
    </div>
  );
}

export interface GoldRuleProps extends React.HTMLAttributes<HTMLHRElement> {
  /** Etwas laengere, kraeftigere Variante. */
  tall?: boolean;
}

/** Freistehende Gold-Linie zum Gliedern von Inhalten. */
export function GoldRule({
  tall,
  className,
  ...rest
}: GoldRuleProps): React.JSX.Element {
  return (
    <hr
      className={["sonn-rule", tall ? "sonn-rule--tall" : "", className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    />
  );
}
