import { stateFromString } from "../parsing/parse";
import { PassageDescription, State } from "../parsing/state";
import { Input } from "../parsing/input";
import { books, bookAbbrvs } from "../data/books";
import { verseCounts } from "../data/verses";
import { toString } from "../data/conversion";
class Book {
  constructor(public number: number, public testament: "o" | "n" = "n") {}
  get name() {
    return books[this.testament][this.number - 1];
  }
  get abbrv() {
    return bookAbbrvs[this.testament][this.number - 1];
  }
  get shortcut() {
    return this.testament === "o" || this.number === 27
      ? this.abbrv.toLocaleLowerCase()
      : toString(this.number);
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

const addUp = (acc: number, val: number) => acc + val;

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
  get verseNumber(): number | null {
    const { testament, book: bookObj, chapter, verse } = this;
    if (!testament || !bookObj || !chapter || !verse) return null;
    const book = bookObj.number;
    return (
      (testament === "n" ? verseCounts["o"].total : 0) +
      verseCounts[testament]
        .slice(0, book - 1)
        .reduce((acc, book) => acc + book.total, 0) +
      verseCounts[testament][book - 1].slice(0, chapter - 1).reduce(addUp, 0) +
      verse
    );
  }
  static get random(): Passage {
    const n = Math.floor(Math.random() * verseCounts.total);
    return Passage.nthVerse(n);
  }
  static nthVerse(n: number): Passage {
    const testament = n > verseCounts["o"].total ? "n" : "o";
    let count = testament === "n" ? verseCounts["o"].total : 0;
    const book =
      verseCounts[testament].findIndex((book, index) => {
        if (count + book.total < n) {
          count += book.total;
          return false;
        }
        return true;
      }) + 1;
    const chapter =
      verseCounts[testament][book - 1].findIndex((chapterCount, index) => {
        if (count + chapterCount < n) {
          count += chapterCount;
          return false;
        }
        return true;
      }) + 1;
    const verse = n - count;
    return new Passage({ testament, book, chapter, verse });
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
    if (!this.testament) return null;
    if (!book || !book.value) return null;
    return new Book(book.value, this.testament);
  }
  get bookEnd() {
    const bookEnd = this.state.bookEnd;
    if (!this.testament) return null;
    if (!bookEnd || !bookEnd.value) return null;
    return new Book(bookEnd.value, this.testament);
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
  get endVerse(): Passage {
    const {
      testament,
      book,
      bookEnd,
      chapter,
      chapterEnd,
      verse,
      verseEnd,
    } = this;
    if (!testament || !book || !(bookEnd || chapterEnd || verseEnd))
      return this;
    return new Passage({
      testament,
      book: bookEnd?.number || book.number,
      chapter: chapterEnd || chapter || undefined,
      verse: verseEnd || verse || undefined,
    });
  }
}

export const parse = (string: string) => new Passage(string);
