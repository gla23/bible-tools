## bible-tools

### Contents:

- Bible data:
  - Book names
  - Book abbreviations
  - Verse counts per chapter book and testament (with sum and cumulative totals)
- Random verse finder
- A verse reference and mnemonic parsing tool
- Type declarations for all exports

See the parser in action [here](https://gla23.github.io/bible-tools/)

### Usage:

```
npm install --save bible-tools
```

```
import { books, verseCounts, parse, Passage } from "bible-tools"

books["o"] // ["Genesis", "Exodus", ...]
books["n"] // ["Matthew", "Mark", ...]

verseCounts.total // 31102
verseCounts["n"].total // 7957 (verses in OT)
verseCounts["n"][0].total // 1071 (verses in Matthew)
verseCounts["n"][0].cumulative // 31102 (verses up to and including Matthew)
verseCounts["n"][0][0] // 25 (verses in Matthew 1)

parse("aaa").reference // "Matthew 1:1"
parse("bbb").reference // "Mark 2:2"
parse("dope").reference // "John 15:16"
parse("gene").reference // "Genesis 5"

parse("Matthew 29").error // 29 is over maximum of 28 chapters in Matthew
parse("Isaiah 12:7").error // 7 is over maximum of 6 verses in Isaiah 12

const parable = parse("Luke 18:9-14")
parable.book?.name // "Luke"
parable.book?.number // 3
parable.chapter // 18
parable.mnemonic // "cri-n"

Passage.random.reference // "Micah 3:3"
Passage.random.reference // "Jonah 4:7"

const sermon = new Passage({
  testament: "n",
  book: 1,
  chapter: 5,
  chapterEnd: 7,
});
sermon.reference // Matthew 5-7
sermon.mnemonic // ae-g
sermon.book?.name // Matthew
sermon.chapter // 5
sermon.chapterEnd // 7

```
