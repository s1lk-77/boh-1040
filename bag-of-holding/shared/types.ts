export interface BaseCard {
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
