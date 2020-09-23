import english_10 from "wordlist-english/english-words-10.json";
import english_20 from "wordlist-english/english-words-20.json";
import english_35 from "wordlist-english/english-words-35.json";
import english_40 from "wordlist-english/english-words-40.json";
import english_50 from "wordlist-english/english-words-50.json";
import english_55 from "wordlist-english/english-words-55.json";
import english_60 from "wordlist-english/english-words-60.json";
import english_70 from "wordlist-english/english-words-70.json";
import british_10 from "wordlist-english/british-words-10.json";
import british_20 from "wordlist-english/british-words-20.json";
import british_35 from "wordlist-english/british-words-35.json";
import british_40 from "wordlist-english/british-words-40.json";
import british_50 from "wordlist-english/british-words-50.json";
import british_55 from "wordlist-english/british-words-55.json";
import british_60 from "wordlist-english/british-words-60.json";
import british_70 from "wordlist-english/british-words-70.json";

const wordGroups = [
  [...english_10, ...british_10],
  [...english_20, ...british_20],
  [...english_35, ...british_35],
  [...english_40, ...british_40],
  [...english_50, ...british_50],
  [...english_55, ...british_55],
  [...english_60, ...british_60],
  [...english_70, ...british_70],
];

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function randomWord(oddity = 0): string {
  const clamped = Math.max(0, Math.min(7, oddity));
  return randomElement(randomElement(wordGroups.slice(0, clamped + 1)));
}

interface Filters {
  oddity?: number;
  startsWith?: string;
  maxWords?: number;
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
