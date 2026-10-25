import { Feature } from "./types";

export const PLAYER_NAME_REGEX = /^[A-Za-z0-9][A-Za-z0-9\-]*$/;
export const GAME_CODE_REGEX = /^[A-Za-z0-9]*$/;

export const BASE_FEATURES: Readonly<Feature[]> = [
  { name: "MYlookup", isMultiline: false, required: true },
  { name: "MYname", isMultiline: false, required: false },
];
export const ABIL_FEATURES: Readonly<Feature[]> = [
  { name: "MYtext", isMultiline: true, required: false },
  { name: "MYeffect", isMultiline: true, required: false },
];

export const STANDARD_FRAME_WIDTH = "min(100%, 30rem)";
export const SMALL_FRAME_WIDTH = "min(90%, 28rem)";

export type PlayerPage = "home" | "display" | "settings";

// default log message
export const LOG_DEFAULT =
  "(Or select a card from the right to edit its content)";
