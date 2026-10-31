// The word lists are most of the app's weight, so each oddity level is its own
// chunk, fetched on first use. Until a level loads, it counts as empty.
const groupLoaders = [
  () =>
    Promise.all([
      import("wordlist-english/english-words-10.json"),
      import("wordlist-english/british-words-10.json"),
    ]),
  () =>
    Promise.all([
      import("wordlist-english/english-words-20.json"),
      import("wordlist-english/british-words-20.json"),
    ]),
  () =>
    Promise.all([
      import("wordlist-english/english-words-35.json"),
      import("wordlist-english/british-words-35.json"),
    ]),
  () =>
    Promise.all([
      import("wordlist-english/english-words-40.json"),
      import("wordlist-english/british-words-40.json"),
    ]),
  () =>
    Promise.all([
      import("wordlist-english/english-words-50.json"),
      import("wordlist-english/british-words-50.json"),
    ]),
  () =>
    Promise.all([
      import("wordlist-english/english-words-55.json"),
      import("wordlist-english/british-words-55.json"),
    ]),
  () =>
    Promise.all([
      import("wordlist-english/english-words-60.json"),
      import("wordlist-english/british-words-60.json"),
    ]),
  () =>
    Promise.all([
      import("wordlist-english/english-words-70.json"),
      import("wordlist-english/british-words-70.json"),
    ]),
];
const maxOddity = groupLoaders.length - 1;
const wordGroups: string[][] = groupLoaders.map(() => []);
const groupPromises: Promise<void>[] = [];

const clampOddity = (oddity: number) => Math.max(0, Math.min(maxOddity, oddity));

function loadGroup(group: number): Promise<void> {
  groupPromises[group] ??= groupLoaders[group]().then(([english, british]) => {
    wordGroups[group] = [...english.default, ...british.default];
  });
  return groupPromises[group];
}

export function wordsLoaded(oddity: number): boolean {
  return wordGroups
    .slice(0, clampOddity(oddity) + 1)
    .every((group) => group.length > 0);
}

export async function loadWords(oddity: number): Promise<void> {
  const groups = Array.from({ length: clampOddity(oddity) + 1 }, (_, i) => i);
  await Promise.all(groups.map(loadGroup));
}

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function randomWord(oddity = 0): string {
  return randomElement(randomElement(wordGroups.slice(0, clampOddity(oddity) + 1)));
}

interface Filters {
  oddity?: number;
  startsWith?: string;
  maxWords?: number;
}
export function wordExists(filters: Filters = {}): string | false {
  const { oddity = 0, startsWith = "" } = filters;
  for (let group = 0; group < wordGroups.length; group++) {
    if (group > oddity) return false;
    const match = wordGroups[group].find((word) => word.startsWith(startsWith));
    if (match) return match;
  }
  return false;
}
export function filterWords(filters: Filters = {}): string[] {
  const { oddity = 0, startsWith, maxWords = 1000 } = filters;
  const filteredWords: string[] = [];
  wordGroups.forEach(
    (group, groupOddity) =>
      groupOddity <= oddity &&
      group.forEach(
        (word) =>
          filteredWords.length < maxWords &&
          (startsWith ? word.startsWith(startsWith) : true) &&
          filteredWords.push(word)
      )
  );
  return filteredWords.sort();
}
