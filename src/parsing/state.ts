import { Input } from "./input";
import { nextStateType, StateType } from "./transition";
import { otBooks, ntBooks } from "../data/books";
import { ParseError } from "./errors";

const valueStates = [
  "book",
  "chapter",
  "verse",
  "bookEnd",
  "chapterEnd",
  "verseEnd",
] as const;
type ValueState = typeof valueStates[number];
const isValueState = (state: StateType): state is ValueState =>
  valueStates.indexOf(state as ValueState) !== -1;

export type Testament = "o" | "n";

export class State {
  constructor(state?: State) {
    if (state) {
      this.type = state.type;
      this.testament = state.testament;
      this.book = state.book;
      this.chapter = state.chapter;
      this.verse = state.verse;
      this.bookEnd = state.bookEnd;
      this.chapterEnd = state.chapterEnd;
      this.verseEnd = state.verseEnd;
      this.inputs = state.inputs;
      this.string = state.string;
      this.error = state.error;
    }
  }
  type: StateType = "initial";
  testament: Testament | null = null;
  book: Input | null = null;
  chapter: Input | null = null;
  verse: Input | null = null;
  bookEnd: Input | null = null;
  chapterEnd: Input | null = null;
  verseEnd: Input | null = null;
  inputs: Input[] = [];
  string: string = "";
  error: ParseError | null = null;

  transition(this: State, input: Input): State {
    const newStateType = nextStateType(this.type, input.type);
    const newState: State = new State(this);
    newState.type = newStateType;
    newState.testament = input.testament || this.testament;
    newState.inputs = [...this.inputs, input];
    newState.string = this.string + input.string;
    newState.error = input.error || this.error;
    if (input.type === "number" && isValueState(newStateType)) {
      newState[newStateType] = input;
    }
    return newState;
  }
  inputType(this: State, input: Input): string {
    for (let valueState of valueStates) {
      if (this[valueState] === input) return valueState;
    }
    return input.type;
  }
  get reference(): string {
    const {
      testament,
      book,
      chapter,
      verse,
      bookEnd,
      chapterEnd,
      verseEnd,
    } = this;
    const books = testament === "o" ? otBooks : ntBooks;
    const sectionTo =
      (bookEnd ? books[(bookEnd.value || 1) - 1] + " " : "") +
      (chapterEnd?.value || "") +
      (chapterEnd && verseEnd ? ":" : "") +
      (verseEnd?.value || "");
    return (
      (book ? books[(book.value || 1) - 1] : "") +
      (chapter ? " " + chapter.value : "") +
      (verse ? ":" + verse.value : "") +
      (sectionTo ? "-" + sectionTo : "")
    );
  }
}

export const initialState = new State();
