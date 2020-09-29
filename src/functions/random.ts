import { randomWord, wordExists } from "../data/words";
import { Passage } from "../passage/passage";

export function randomWordPassage(oddity: number) {
  while (true) {
    const word = randomWord(oddity);
    const passage = new Passage(word);
    if (!passage.error) return passage;
  }
}
export function randomPassageReference(oddity: number): string {
  let count = 0;
  while (true) {
    count++;
    const passage = Passage.random;
    const word = wordExists({ startsWith: passage.mnemonic, oddity });
    if (word || count >= 70) {
      console.log(count);
      return passage.reference;
    }
  }
}
