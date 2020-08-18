## bible-tools

### Contents:

- Bible data e.g. book names, abbreviations and verse counts
- A verse reference mnemonic parsing tool
- Type declarations for all exports

See the parser in action [here](https://gla23.github.io/bible-tools/)

### Usage:

```
npm install --save bible-tools
```

```
import { books, parse } from "bible-tools"

books["o"] // ["Genesis", "Exodus", ...]
parse("dope").reference // "John 15:16"

```
