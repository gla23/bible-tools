import { stateFromString } from "./parse";
import { State } from "./state";
import { Input } from "./input";
import { books, bookAbbrvs } from "../data/books";

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
  constructor(string: string) {
    this.string = string;
    this.state = stateFromString(string);
    this.leftover = string.slice(this.state.string.length);
  }
  protected state: State;
  public string: string;
  public leftover: string;

  get reference() {
    return this.state.reference;
  }
  get error() {
    return this.state.error;
  }
  get tokens() {
    return this.state.inputs.map((input) => new Token(this.state, input));
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
