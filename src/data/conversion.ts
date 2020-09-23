import { invertObject } from "../functions/invertObject";

const turkishLetterNumbers = {
  ç: 27,
  ş: 28,
  ö: 29,
  ü: 30,
  Ç: 57,
  Ş: 58,
  Ö: 59,
  Ü: 60,
} as const;

const reverse = invertObject(turkishLetterNumbers);

export const toNumber = (input: string): number | null => {
  const codepoint = input.codePointAt(0);
  if (!codepoint) return null;
  if (input.match(/^[a-z]/)) return codepoint - 96;
  if (input.match(/^[A-Z]/)) return codepoint - 34;
  if (input.match(/^0/)) return 30;
  if (input.match(/^[çÇşŞöÖüÜ]/))
    return turkishLetterNumbers[input[0] as keyof typeof turkishLetterNumbers];
  return null;
};

export const toString = (input: number): string | null => {
  if (reverse[input]) return reverse[input];
  if (input >= 1 && input <= 26) return String.fromCodePoint(input + 96);
  if (input >= 31 && input <= 56) return String.fromCodePoint(input + 34);
  return null;
};
