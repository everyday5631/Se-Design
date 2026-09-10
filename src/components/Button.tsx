import * as React from "react";

export type ButtonVariant = "primary" | "secondary" | "quiet" | "onNavy";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visuelle Rolle des Buttons. */
  variant?: ButtonVariant;
  /** Button-Beschriftung. */
  children?: React.ReactNode;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "sonn-btn--primary",
  secondary: "sonn-btn--secondary",
  quiet: "sonn-btn--quiet",
  onNavy: "sonn-btn--on-navy",
};

/**
 * Button in den vier Sonnhalde-Rollen. `primary` (Heading-Gold, Navy-Text) fuer
 * die Hauptaktion, `secondary` (Navy-Umriss) fuer Nebenaktionen, `quiet` fuer
 * unaufdringliche Aktionen, `onNavy` (Logo-Gold) fuer dunkle Flaechen.
 */
export function Button({
  variant = "primary",
  className,
  type = "button",
  children,
  ...rest
}: ButtonProps): React.JSX.Element {
  return (
    <button
      type={type}
      className={["sonn-btn", VARIANT_CLASS[variant], className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}
