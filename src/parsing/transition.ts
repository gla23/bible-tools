export type StateType =
  | "initial"
  | "book"
  | "chapter"
  | "verse"
  | "chapterHyphen"
  | "bookEnd"
  | "chapterEnd"
  | "verseEnd"
  | "error"
  | "end";

export type InputType =
  | "number"
  | "hyphen"
  | "whitespace"
  | "end"
  | "error"
  | "colon";

type StateTransition = {
  readonly [E in InputType]?: StateType;
};
type TransitionMatrix = {
  readonly [E in StateType]: StateTransition;
};

const transitionMatrix: TransitionMatrix = {
  initial: {
    number: "book",
  },
  book: {
    number: "chapter",
  },
  chapter: {
    number: "verse",
    colon: "chapter",
    hyphen: "chapterHyphen",
  },
  verse: {
    hyphen: "chapterEnd", // or ChapterHyphen! Change to array when upgrading to have paths
  },
  chapterHyphen: {
    number: "chapterEnd",
  },
  bookEnd: {},
  chapterEnd: {
    number: "verseEnd",
    colon: "chapterEnd",
  },
  verseEnd: {},
  error: {},
  end: {},
};

export function nextStateType(
  stateType: StateType,
  inputType: InputType
): StateType {
  return inputType === "end"
    ? "end"
    : transitionMatrix[stateType][inputType] ||
        (inputType === "whitespace" ? stateType : "error");
}
