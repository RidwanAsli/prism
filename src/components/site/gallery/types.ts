export type DemoCategory = "text" | "effects" | "buttons" | "components";

export type DemoHeight = "sm" | "md" | "lg" | "xl";

export interface DemoEntry {
  /** unique id, kebab-case */
  id: string;
  /** display name, e.g. "Border Beam" */
  name: string;
  /** one-line description shown under the name */
  description: string;
  category: DemoCategory;
  /** registry slug used to build the copy-paste install command */
  install: string;
  /** small interaction hint, e.g. "hover", "click", "drag" */
  hint?: string;
  /** force a dark stage even in light mode (for cosmic effects) */
  darkStage?: boolean;
  /** extra classes for the stage */
  stageClassName?: string;
  /** stage height */
  height?: DemoHeight;
  /** the live demo itself */
  element: React.ReactNode;
}

export const CATEGORY_META: Record<
  DemoCategory,
  { label: string; dot: string }
> = {
  text: { label: "Text", dot: "bg-violet-400" },
  effects: { label: "Effects", dot: "bg-cyan-400" },
  buttons: { label: "Buttons", dot: "bg-fuchsia-400" },
  components: { label: "Components", dot: "bg-emerald-400" },
};

export const HEIGHTS: Record<DemoHeight, string> = {
  sm: "h-40",
  md: "h-52",
  lg: "h-64",
  xl: "h-80",
};
