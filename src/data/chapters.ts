import { ntVerseCounts, otVerseCounts } from "./verses";

export const ntChapterCounts = ntVerseCounts.map((book) => book.length);
export const otChapterCounts = otVerseCounts.map((book) => book.length);
