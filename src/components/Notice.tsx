import * as React from "react";

export type NoticeTone = "info" | "success" | "warning";

export interface NoticeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Art des Hinweises. Bestimmt die (gedaempfte, warme) Signalfarbe. */
  tone?: NoticeTone;
  /** Optionaler fett gesetzter Auftakt, z. B. „Hinweis." */
  title?: React.ReactNode;
  children?: React.ReactNode;
}

const TONE_CLASS: Record<NoticeTone, string> = {
  info: "",
  success: "sonn-notice--success",
  warning: "sonn-notice--warning",
};

/**
 * Hinweis- oder Statusbox mit linker Akzentkante. Die Signalfarben fuer Erfolg
 * und Warnung sind bewusst gedaempft und ersetzen nie das Gold als Akzent.
 */
export function Notice({
  tone = "info",
  title,
  className,
  children,
  ...rest
}: NoticeProps): React.JSX.Element {
  return (
    <div
      className={["sonn-notice", TONE_CLASS[tone], className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {title ? <b className="sonn-notice__title">{title} </b> : null}
      {children}
    </div>
  );
}
