import type { DemoEntry } from "./types";
import { COMPONENTS_DEMOS } from "./demos-components";
import { TEXT_DEMOS } from "./demos-text";
import { EFFECTS_DEMOS } from "./demos-effects";
import { BUTTONS_DEMOS } from "./demos-buttons";

export const DEMOS: DemoEntry[] = [
  ...COMPONENTS_DEMOS,
  ...TEXT_DEMOS,
  ...EFFECTS_DEMOS,
  ...BUTTONS_DEMOS,
];
