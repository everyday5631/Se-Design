import * as React from "react";

interface FieldShellProps {
  id: string;
  label: React.ReactNode;
  required?: boolean;
  help?: React.ReactNode;
  error?: React.ReactNode;
  className?: string;
  children: (opts: { id: string; describedBy?: string; invalid: boolean }) => React.ReactNode;
}

function FieldShell({
  id,
  label,
  required,
  help,
  error,
  className,
  children,
}: FieldShellProps): React.JSX.Element {
  const helpId = help ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, helpId].filter(Boolean).join(" ") || undefined;
  return (
    <div
      className={["sonn-field", error ? "sonn-field--error" : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      <label className="sonn-field__label" htmlFor={id}>
        {label}
        {required ? (
          <span className="sonn-field__req" aria-hidden="true">
            {" *"}
          </span>
        ) : null}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {error ? (
        <div className="sonn-field__error" id={errorId}>
          {error}
        </div>
      ) : null}
      {help ? (
        <div className="sonn-field__help" id={helpId}>
          {help}
        </div>
      ) : null}
    </div>
  );
}

type SharedFieldProps = {
  /** Sichtbare Feldbeschriftung. */
  label: React.ReactNode;
  /** Markiert das Feld als Pflichtfeld (Gold-Stern). */
  required?: boolean;
  /** Hilfetext unter dem Feld. */
  help?: React.ReactNode;
  /** Fehlermeldung; setzt das Feld in den Fehlerzustand. */
  error?: React.ReactNode;
  /** Klasse fuer den aeusseren Feld-Container. */
  fieldClassName?: string;
};

export interface TextFieldProps
  extends SharedFieldProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "id"> {
  id?: string;
}

/** Einzeiliges Textfeld mit Label, Hilfetext, Fehler- und Pflichtzustand. */
export function TextField({
  label,
  required,
  help,
  error,
  fieldClassName,
  id,
  className,
  type = "text",
  ...rest
}: TextFieldProps): React.JSX.Element {
  const reactId = React.useId();
  const fieldId = id ?? reactId;
  return (
    <FieldShell
      id={fieldId}
      label={label}
      required={required}
      help={help}
      error={error}
      className={fieldClassName}
    >
      {({ id: cid, describedBy, invalid }) => (
        <input
          id={cid}
          type={type}
          className={["sonn-field__control", className].filter(Boolean).join(" ")}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          required={required}
          {...rest}
        />
      )}
    </FieldShell>
  );
}

export interface SelectFieldProps
  extends SharedFieldProps,
    Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  id?: string;
  children?: React.ReactNode;
}

/** Auswahlfeld mit derselben Label-/Hilfe-/Fehler-Struktur wie TextField. */
export function SelectField({
  label,
  required,
  help,
  error,
  fieldClassName,
  id,
  className,
  children,
  ...rest
}: SelectFieldProps): React.JSX.Element {
  const reactId = React.useId();
  const fieldId = id ?? reactId;
  return (
    <FieldShell
      id={fieldId}
      label={label}
      required={required}
      help={help}
      error={error}
      className={fieldClassName}
    >
      {({ id: cid, describedBy, invalid }) => (
        <select
          id={cid}
          className={["sonn-field__control", className].filter(Boolean).join(" ")}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          required={required}
          {...rest}
        >
          {children}
        </select>
      )}
    </FieldShell>
  );
}

export interface TextareaFieldProps
  extends SharedFieldProps,
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> {
  id?: string;
}

/** Mehrzeiliges Textfeld (vertikal skalierbar). */
export function TextareaField({
  label,
  required,
  help,
  error,
  fieldClassName,
  id,
  className,
  ...rest
}: TextareaFieldProps): React.JSX.Element {
  const reactId = React.useId();
  const fieldId = id ?? reactId;
  return (
    <FieldShell
      id={fieldId}
      label={label}
      required={required}
      help={help}
      error={error}
      className={fieldClassName}
    >
      {({ id: cid, describedBy, invalid }) => (
        <textarea
          id={cid}
          className={["sonn-field__control", className].filter(Boolean).join(" ")}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          required={required}
          {...rest}
        />
      )}
    </FieldShell>
  );
}
