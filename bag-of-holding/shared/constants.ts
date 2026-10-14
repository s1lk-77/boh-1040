export const PLAYER_NAME_REGEX = /^[A-Za-z0-9][A-Za-z0-9\-]*$/;
export const GAME_CODE_REGEX = /^[A-Za-z0-9]*$/;

/* **** Feature Data structure, frontend */
export interface Feature {
  name: string;
  isMultiline: boolean;
  required: boolean;
}
export const BASE_FEATURES: Readonly<Feature[]> = [
  { name: "MYlookup", isMultiline: false, required: true },
  { name: "MYname", isMultiline: false, required: false },
];
export const ABIL_FEATURES: Readonly<Feature[]> = [
  { name: "MYtext", isMultiline: true, required: false },
  { name: "MYeffect", isMultiline: true, required: false },
];
