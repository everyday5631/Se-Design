// Sonnhalde Design-System — oeffentliche API.
// Styles separat einbinden: import "@sonnhalde/design-system/styles.css";

export { SonnhaldeProvider } from "./components/SonnhaldeProvider";
export type { SonnhaldeProviderProps } from "./components/SonnhaldeProvider";

export { Button } from "./components/Button";
export type { ButtonProps, ButtonVariant } from "./components/Button";

export { SectionHeading, GoldRule } from "./components/SectionHeading";
export type {
  SectionHeadingProps,
  GoldRuleProps,
} from "./components/SectionHeading";

export { DepartmentCard, StatCard, InfoCard } from "./components/Cards";
export type {
  DepartmentCardProps,
  StatCardProps,
  InfoCardProps,
} from "./components/Cards";

export { TextField, SelectField, TextareaField } from "./components/Fields";
export type {
  TextFieldProps,
  SelectFieldProps,
  TextareaFieldProps,
} from "./components/Fields";

export { Notice } from "./components/Notice";
export type { NoticeProps, NoticeTone } from "./components/Notice";

export { DocumentHeader, AppBar } from "./components/Headers";
export type {
  DocumentHeaderProps,
  AppBarProps,
  AppBarLink,
} from "./components/Headers";

export { tokens } from "./tokens";
export type { SonnhaldeTokens } from "./tokens";
