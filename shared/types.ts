export interface BaseCard extends Record<string, string> {
  MYname: string;
  MYlookup: string;
}

export interface AbilCard extends BaseCard {
  MYtext: string;
  MYeffect: string;
}

/* **** Feature Data structure, frontend */
export interface Feature {
  name: string;
  isMultiline: boolean;
  required: boolean;
}

export type AbilColor = "y" | "m" | "p";

export interface BaseFeatures {
  MYlookup: Feature;
  MYname: Feature;
}

export interface AbilFeatures extends BaseFeatures {
  MYtext: Feature;
  MYeffect: Feature;
}

export type CardType = "Ability" | "Card" | "Player";
export interface CatalogTypeMap {
  Ability: { model: AbilCard; features: AbilFeatures };
  Card: { model: BaseCard; features: BaseFeatures };
  Player: { model: BaseCard; features: BaseFeatures };
}
