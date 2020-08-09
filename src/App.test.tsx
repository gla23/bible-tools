import { ntVerseCounts, otVerseCounts } from "./data/verses";
import { ntChapterCounts, otChapterCounts } from "./data/chapters";

test("chapter counts are correct", () => {
  ntChapterCounts.forEach((chapterCount, index) =>
    expect(chapterCount).toBe(ntVerseCounts[index].length)
  );
  otChapterCounts.forEach((chapterCount, index) => {
    expect(chapterCount).toBe(otVerseCounts[index].length);
  });
});
