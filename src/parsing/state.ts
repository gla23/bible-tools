import { Input } from "./input";
import { nextStateType, StateType } from "./transition";
import { toMnemonic, toReference } from "./outputs";
import { ParseError, errorCheckInput } from "./errors";

export const valueStates = [
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
  testament: "o" | "n" | null = null;
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
    input = this.errorCheckInput(input);
    const newStateType = nextStateType(this.type, input.type);
    const newState: State = new State(this);
    newState.type = newStateType;
    newState.testament = input.testament || this.testament;
    newState.inputs = [...this.inputs, input];
    newState.string = this.string + input.string;
    newState.error = this.error || input.error;
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

  errorCheckInput(input: Input) {
    return errorCheckInput(this, input);
  }

  get reference(): string {
    return toReference(this);
  }
  get mnemonic(): string {
    return toMnemonic(this);
  }

  static fromValues(input: PassageDescription) {
    let state = new State();
    let doingEnd = false;
    valueStates.forEach((inputType, index) => {
      if (!input[inputType]) return null;
      if (!doingEnd && inputType.includes("End")) {
        state = state.transition(new Input("hyphen", "", null));
        doingEnd = true;
      }
      state = state.transition(
        new Input("number", "", input[inputType] || null, input.testament)
      );
    });
    return state;
  }
}
export interface PassageDescription {
  testament: "o" | "n";
  book: number;
  chapter?: number;
  verse?: number;
  bookEnd?: number;
  chapterEnd?: number;
  verseEnd?: number;
}
export const initialState = new State();
