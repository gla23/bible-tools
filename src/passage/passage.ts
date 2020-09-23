import { stateFromString } from "../parsing/parse";
import { PassageDescription, State } from "../parsing/state";
import { Input } from "../parsing/input";
import { books, bookAbbrvs } from "../data/books";
import { randomWord } from "../data/words";

class Book {
  constructor(public number: number, public testament: "o" | "n" = "n") {}
  get name() {
    return books[this.testament][this.number - 1];
  }
  get abbrv() {
    return bookAbbrvs[this.testament][this.number - 1];
  }
}

class Token {
  constructor(protected state: State, protected input: Input) {}
  get type() {
    return this.state.inputType(this.input);
  }
  get string() {
    return this.input.string;
  }
  get value() {
    return this.input.value;
  }
}

export class Passage {
  constructor(input: string | PassageDescription) {
    if (typeof input === "string") {
      this.state = stateFromString(input);
      this.string = this.state.string;
      this.leftover = input.slice(this.string.length);
      return this;
    }
    this.state = State.fromValues(input);
    this.string = "";
    this.leftover = "";
  }
  protected state: State;
  public string: string;
  public leftover: string;

  get reference() {
    return this.state.reference;
  }
  get mnemonic() {
    return this.state.mnemonic;
  }

  static get random(): Passage {
    return new Passage("genrr");
  }

  get error() {
    return this.state.error;
  }
  get tokens() {
    return this.state.inputs.map((input) => new Token(this.state, input));
  }

  get testament() {
    return this.state.testament;
  }
  get book() {
    const book = this.state.book;
    return book ? new Book(book.value || 0) : null;
  }
  get bookEnd() {
    const bookEnd = this.state.bookEnd;
    return bookEnd ? new Book(bookEnd.value || 0) : null;
  }
  get chapter() {
    const chapter = this.state.chapter;
    return chapter ? chapter.value : null;
  }
  get chapterEnd() {
    const chapterEnd = this.state.chapterEnd;
    return chapterEnd ? chapterEnd.value : null;
  }
  get verse() {
    const verse = this.state.verse;
    return verse ? verse.value : null;
  }
  get verseEnd() {
    const verseEnd = this.state.verseEnd;
    return verseEnd ? verseEnd.value : null;
  }
}

export const parse = (string: string) => new Passage(string);

export function randomWordPassage(oddity: number) {
  while (true) {
    const word = randomWord(oddity);
    const passage = new Passage(word);
    if (!passage.error) return passage;
  }
}
