import * as React from "react";

export interface SonnhaldeProviderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Inhalt, der im Sonnhalde-Kontext (Tokens, Arial, Cream-Grund) gerendert wird. */
  children?: React.ReactNode;
}

/**
 * Wurzel-Wrapper des Design-Systems. Setzt die Klasse `sonn-root`, unter der
 * alle Design-Tokens (`--sonn-*`), die Schrift Arial und der Cream-Grund liegen.
 * Alle Sonnhalde-Komponenten sollten innerhalb dieses Providers stehen.
 *
 * Voraussetzung: einmalig `import "@sonnhalde/design-system/styles.css";`.
 */
export function SonnhaldeProvider({
  children,
  className,
  ...rest
}: SonnhaldeProviderProps): React.JSX.Element {
  return (
    <div className={["sonn-root", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </div>
  );
}
