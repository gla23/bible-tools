import { bookAbbrvs, ntBooks, otBooks } from "../data/books";
import { toString } from "../data/conversion";
import { Input } from "./input";
import { State } from "./state";

export function toReference(state: State) {
  const {
    testament,
    book,
    chapter,
    verse,
    bookEnd,
    chapterEnd,
    verseEnd,
  } = state;
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

export function toMnemonic(state: State): string {
  const {
    testament,
    book,
    chapter,
    verse,
    bookEnd,
    chapterEnd,
    verseEnd,
  } = state;
  const section = (input: Input | null): string =>
    (input?.value && toString(input?.value)) || "";
  const otBook = (input: Input | null): string =>
    ((input?.value && bookAbbrvs["o"][input?.value - 1]) || "").toLowerCase();
  const bookSection = testament === "n" ? section : otBook;
  const from = bookSection(book) + section(chapter) + section(verse);
  const to = bookSection(bookEnd) + section(chapterEnd) + section(verseEnd);
  return to ? from + "-" + to : from;
}
