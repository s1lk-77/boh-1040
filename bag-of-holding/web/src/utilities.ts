import { BaseCard } from "../../shared/types";

export const parseGametexName = (name: string): string => {
  if (/^MY[a-z]+$/.test(name)) {
    const word: string = name.substring(2);
    return `My ${word[0].toUpperCase() + word.slice(1)}`;
  } else {
    return name;
  }
};

export const unwrapCard = (
  rawCard: { feature: string; value: string }[],
): BaseCard | undefined => {
  const card: Record<any, any> = {};
  rawCard.forEach((binding) => {
    card[binding.feature] = binding.value;
  });
  if (!("MYlookup" in card) || !("MYname" in card)) return undefined;
  return card as BaseCard;
};
