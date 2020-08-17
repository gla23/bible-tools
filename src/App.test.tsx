import { parse } from "./parsing/parse";

const tests: { [index: string]: string } = {
  "  abc": "Matthew 2:3",
  çvu: "Revelation 22:21",
  ciÜ: "Luke 9:60",
  genw: "Genesis 23",
  revff: "Revelation 6:6",
  "ae-g": "Matthew 5-7",
  "aeq-t": "Matthew 5:17-20",
  "ae-ft": "Matthew 5-6:20",
  ps11959: "Psalm 119:59",
  " Matthew 2:3": "Matthew 2:3",
};
test("Passage parsing", () => {
  Object.keys(tests).forEach((passage) => {
    const parsed = parse(passage).reference;
    expect(parsed).toBe(tests[passage]);
  });
  expect(parse("lll").error).not.toBe(null);
  expect(parse("aeR-Q").error).not.toBe(null);
  expect(parse("aeQ-P").error).not.toBe(null);
  expect(parse("Ma").error).not.toBe(null);
});

test("Parsed verses are parsable", () => {
  Object.keys(tests).forEach((passage) => {
    const parsedRef = parse(passage).reference;
    expect(parse(parsedRef).reference).toBe(parsedRef);
  });
});

// test("After hyphen backtrack to chapter and book on fail)", () => {
//   expect(parse("aeq-ft").reference).toBe("Matthew 5:17-6:20");
//   expect(parse("af-ag").reference).toBe("Matthew 6-7")
// });
