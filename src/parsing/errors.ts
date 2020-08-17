import { State } from "./state";
import { ntVerseCounts, otVerseCounts } from "../data/verses";
import { nextStateType } from "./transition";

export abstract class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParseError";
  }
}
export class BoundsError extends ParseError {
  constructor(message: string) {
    super(message);
    this.name = "BoundsError";
  }
}
export class BadInputError extends ParseError {
  constructor(message: string) {
    super(message);
    this.name = "BadInputError";
  }
}
export class ParseLogicError extends ParseError {
  constructor(message: string) {
    super(message);
    this.name = "BadInputError";
  }
}

export const maxValue = (state: State): number => {
  const book = state.book?.value || 1;
  const chapter = state.chapter?.value || 1;
  const verseCounts = state.testament === "o" ? otVerseCounts : ntVerseCounts;
  const next = nextStateType(state.type, "number");
  if (next === "book" || next === "bookEnd") return verseCounts.length;
  if (next === "chapter" || next === "chapterEnd")
    return verseCounts[book - 1].length;
  if (next === "verse" || next === "verseEnd")
    return verseCounts[book - 1][chapter - 1];
  console.log("Hmmm", state.type);
  return 0;
};
export const minValue = (state: State): number => {
  const next = nextStateType(state.type, "number");
  const book = state.book?.value || -1;
  const chapter = state.chapter?.value || -1;
  const verse = state.verse?.value || -1;
  if (next === "bookEnd") return book + 1;
  if (next === "chapterEnd") return chapter + 1;
  if (next === "verseEnd") return verse + 1;
  return 0;
};

export const checkValueBounds = (state: State, value: number): Error | null => {
  const min = minValue(state);
  const max = maxValue(state);
  const next = nextStateType(state.type, "number");
  const boundType = next.endsWith("To") ? next.slice(0, -2) : next;
  if (max < min) return new BoundsError(`No valid ${boundType}`);
  if (value < min)
    return new BoundsError(`${boundType} must be over ${min - 1}`);
  if (value > max)
    return new BoundsError(`${value} is over maximum of ${max} ${boundType}s`);
  return null;
};
