import * as React from "react";

export interface DepartmentCardProps {
  /** Kleine Kennung ueber dem Titel (Standard: „Abteilung"). */
  tag?: string;
  /** Name der Abteilung / des Wohnbereichs. */
  name: React.ReactNode;
  /** Beschreibung, z. B. Belegung und Team. */
  children?: React.ReactNode;
  className?: string;
}

/**
 * Abteilungskarte mit Gold-Oberkante als Kennung — fuer die 14 Wohnbereiche.
 */
export function DepartmentCard({
  tag = "Abteilung",
  name,
  children,
  className,
}: DepartmentCardProps): React.JSX.Element {
  return (
    <div className={["sonn-card-dept", className].filter(Boolean).join(" ")}>
      <div className="sonn-card-dept__tag">{tag}</div>
      <h3 className="sonn-card-dept__title">{name}</h3>
      {children ? <p className="sonn-card-dept__body">{children}</p> : null}
    </div>
  );
}

export interface StatCardProps {
  /** Die hervorgehobene Zahl (Logo-Gold auf Navy). */
  value: React.ReactNode;
  /** Beschriftung unter der Zahl. */
  children?: React.ReactNode;
  className?: string;
}

/** Kennzahl auf Navy-Grund — zur Hervorhebung einer einzelnen Zahl. */
export function StatCard({
  value,
  children,
  className,
}: StatCardProps): React.JSX.Element {
  return (
    <div className={["sonn-card-stat", className].filter(Boolean).join(" ")}>
      <div className="sonn-card-stat__num">{value}</div>
      {children ? <div className="sonn-card-stat__cap">{children}</div> : null}
    </div>
  );
}

export interface InfoCardProps {
  /** Titel der Info-Flaeche. */
  title: React.ReactNode;
  /** Fliesstext. */
  children?: React.ReactNode;
  className?: string;
}

/** Ruhige Info-Flaeche auf gedaempftem Cream — ohne Hervorhebung. */
export function InfoCard({
  title,
  children,
  className,
}: InfoCardProps): React.JSX.Element {
  return (
    <div className={["sonn-card-info", className].filter(Boolean).join(" ")}>
      <h3 className="sonn-card-info__title">{title}</h3>
      {children ? <p className="sonn-card-info__body">{children}</p> : null}
    </div>
  );
}
