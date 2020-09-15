import { BadInputError, checkValueBounds, maxValue } from "./errors";
import { State, initialState } from "./state";
import { nextStateType } from "./transition";
import { Input } from "./input";
import { books, bookAbbrvs } from "../data/books";

const turkishLetterNumbers = {
  231: 27, // ç
  351: 28, // ş
  246: 29, // ö
  252: 30, // ü
  199: 57, // Ç
  350: 58, // Ş
  214: 59, // Ö
  220: 60, // Ü
} as const;
const parseSingleLetterNumber = (input: string): number | null => {
  const codepoint = input.codePointAt(0);
  if (!codepoint) return null;
  if (input.match(/^[a-z]/)) return codepoint - 96;
  if (input.match(/^[A-Z]/)) return codepoint - 34;
  if (input.match(/^0/)) return 30;
  if (input.match(/^[çÇşŞöÖüÜ]/))
    return turkishLetterNumbers[codepoint as keyof typeof turkishLetterNumbers];
  return null;
};

const parseMultiDigitNumber = (input: string, state: State): Input | null => {
  const availableDigits = input.match(/^\d+/);
  if (!availableDigits) return null;
  const max = maxValue(state);
  for (let cutOff = 0; cutOff < input.length; cutOff++) {
    const testString = cutOff ? input.slice(0, -cutOff) : input;
    if (Number(testString) <= max)
      return new Input("number", testString, Number(testString));
  }
  return null;
};

const parseBookName = (input: string, testament: "o" | "n"): Input | null => {
  const matches = (name: string) =>
    input.toLowerCase().startsWith(name.toLowerCase());
  const nameIndex = books[testament].findIndex(matches);
  const abbrvIndex = bookAbbrvs[testament].findIndex(matches);
  const nameFound = nameIndex !== -1;
  const abbrvFound = abbrvIndex !== -1;
  if (!nameFound && !abbrvFound) return null;
  const array = nameFound ? books[testament] : bookAbbrvs[testament];
  const index = nameFound ? nameIndex : abbrvIndex;
  return new Input(
    "number",
    input.slice(0, array[index].length),
    index + 1,
    testament
  );
};

const whitespaceRegex = /^\s+/;
const parseInput = (state: State, input: string): Input => {
  if (input === "") return new Input("end", "", null);
  if (input.startsWith("-")) return new Input("hyphen", "-", null);
  if (input.startsWith(":")) return new Input("colon", ":", null);

  if (state.type === "verse") return new Input("end", "", null);
  if (state.type === "verseEnd") return new Input("end", "", null);

  if (!state.book) {
    const ntBookInput = parseBookName(input, "n");
    const otBookInput = parseBookName(input, "o");
    if (ntBookInput) return ntBookInput;
    if (otBookInput) return otBookInput;
  }

  const singleLetterNumber = parseSingleLetterNumber(input);
  if (singleLetterNumber) {
    const error = checkValueBounds(state, singleLetterNumber);
    return new Input(
      error ? "error" : "number",
      input[0],
      singleLetterNumber,
      nextStateType(state.type, "number") === "book" ? "n" : null,
      error
    );
  }

  const numberInput = parseMultiDigitNumber(input, state);
  if (numberInput) return numberInput;

  const whitespaceMatch = input.match(whitespaceRegex);
  if (whitespaceMatch) return new Input("whitespace", whitespaceMatch[0], null);

  return new Input(
    "error",
    input,
    null,
    null,
    new BadInputError("Unexpected input " + input)
  );
};

export const stateFromString = (string: string): State => {
  let state = initialState;
  while (true) {
    const remainingString = string.slice(state.string.length);
    const input: Input = parseInput(state, remainingString);
    state = state.transition(input);
    if (state.type === "error" || state.type === "end") return state;
  }
};
