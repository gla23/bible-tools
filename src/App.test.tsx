import { parse, Passage } from "./passage/passage";

const tests: { [index: string]: string } = {
  "  abc": "Matthew 2:3",
  ciÜ: "Luke 9:60",
  revff: "Revelation 6:6",
  çvu: "Revelation 22:21",
  genw: "Genesis 23",
  mal: "Malachi",
  "ae-g": "Matthew 5-7",
  "aeq-t": "Matthew 5:17-20",
  "ae-ft": "Matthew 5-6:20",
  "ps119:59": "Psalm 119:59",
  " Matthew 2:3": "Matthew 2:3",
  "Mat 2 9": "Matthew 2:9",
  "Mat 29": "Matthew",
  exo: "Exodus", // exo Exodus with Acts 24:15 collision
  heb: "Hebrews", // heb Hebrews with 2 Cor 5:2 collision
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
  expect(parse("Matthew 29").error).not.toBe(null);
});

// test("After hyphen backtrack to chapter and book on fail)", () => {
//   expect(parse("aeq-ft").reference).toBe("Matthew 5:17-6:20");
//   expect(parse("af-ag").reference).toBe("Matthew 6-7")
// });

test("Parsed verses are parsable", () => {
  Object.keys(tests).forEach((passage) => {
    const parsedRef = parse(passage).reference;
    expect(parse(parsedRef).reference).toBe(parsedRef);
  });
});

const mnemonics = {
  age: "Matthew 7:5",
  fear: "Romans 5:1",
  gospel: "1 Corinthians 15:19",
  gentle: "Genesis 20:12",
  tap: "James 1:16",
  festival: "Romans 5:19",
  cheese: "Luke 8:5",
  fish: "Romans 9:19",
  explain: "Acts 24:16",
  "ae-g": "Matthew 5-7",
  "aeq-t": "Matthew 5:17-20",
  "ae-ft": "Matthew 5-6:20",
};

test("Verses give correct mnemonic", () => {
  Object.entries(mnemonics).forEach(([mnemonic, verse]) => {
    const parsed = parse(verse).mnemonic;
    expect(parsed).toBe(mnemonic.slice(0, parsed.length));
  });
});

const passageValueSets = {
  "Matthew 5:5": { testament: "n", book: 1, chapter: 5, verse: 5 },
  "Joshua 5:14": { testament: "o", book: 6, chapter: 5, verse: 14 },
  "Exodus 5-14": { testament: "o", book: 2, chapter: 5, chapterEnd: 14 },
  "Revelation 2:18-29": {
    testament: "n",
    book: 27,
    chapter: 2,
    verse: 18,
    verseEnd: 29,
  },
  "Luke 18:9-14": {
    testament: "n",
    book: 3,
    chapter: 18,
    verse: 9,
    verseEnd: 14,
  },
} as const;

test("Can create passage from values", () => {
  Object.entries(passageValueSets).forEach(([reference, valueSet]) => {
    expect(new Passage(valueSet).reference).toBe(reference);
  });
  expect(
    new Passage({ testament: "n", book: 1, chapter: 29, verse: 340958 }).error
  ).not.toBe(null);
});
