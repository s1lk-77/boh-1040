export const parseGametexName = (name: string): string => {
  if (/^MY[a-z]+$/.test(name)) {
    const word: string = name.substring(2);
    return `My ${word[0].toUpperCase() + word.slice(1)}`;
  } else {
    return name;
  }
};
