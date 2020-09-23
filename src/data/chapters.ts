import { ntVerseCounts, otVerseCounts } from "./verses";

export const otChapterCounts = otVerseCounts.map((book) => book.length);
export const ntChapterCounts = ntVerseCounts.map((book) => book.length);
export const chapterCounts = {
  o: otChapterCounts,
  n: ntChapterCounts,
};
