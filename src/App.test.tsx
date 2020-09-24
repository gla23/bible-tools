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
  "ps118-119:81": "Psalm 118-119:81",
};
test("Passages parse correctly", () => {
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
  fea: "Romans 5:1",
  gos: "1 Corinthians 15:19",
  gentl: "Genesis 20:12",
  tap: "James 1:16",
  fes: "Romans 5:19",
  che: "Luke 8:5",
  fis: "Romans 9:19",
  exp: "Acts 24:16",
  "ae-g": "Matthew 5-7",
  "aeq-t": "Matthew 5:17-20",
  "ae-ft": "Matthew 5-6:20",
  "ps119:71": "Psalm 119:71",
  "ps119:71-81": "Psalm 119:71-81",
  "ps118-119:81": "Psalm 118-119:81",
  "ps118-119e": "Psalm 118-119:5",
};

test("Mnemonics and verses parse both ways", () => {
  Object.entries(mnemonics).forEach(([mnemonic, verse]) => {
    const attempt = parse(verse).mnemonic;
    expect(attempt).toBe(mnemonic);
    expect(parse(attempt).reference).toBe(verse);
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

test("Passages are creatable from objects", () => {
  Object.entries(passageValueSets).forEach(([reference, valueSet]) => {
    expect(new Passage(valueSet).reference).toBe(reference);
  });
  expect(
    new Passage({ testament: "n", book: 1, chapter: 29, verse: 340958 }).error
  ).not.toBe(null);
});

const verseNumbers = {
  "Genesis 1:1": 1,
  "Matthew 1:1": 23146,
  "Mark 5:5": 24216 + 45 + 28 + 35 + 41 + 5,
};

test("The Nth verse can be found/constructed", () => {
  Object.entries(verseNumbers).forEach(([ref, n]) => {
    expect(new Passage(ref).verseNumber).toBe(n);
    expect(Passage.nthVerse(n).reference).toBe(ref);
  });
});

test("A Passage's ending verse can be found", () => {
  expect(new Passage("asd-f").endVerse.mnemonic).toBe("asf");
  expect(new Passage("as-tr").endVerse.mnemonic).toBe("atr");
});
