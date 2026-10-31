import { useEffect, useState } from "react";
import { loadWords, wordsLoaded } from "../data/words";

/** Loads the word lists up to `oddity`, returning whether they're ready */
export const useWords = (oddity: number) => {
  const [loaded, setLoaded] = useState(() => wordsLoaded(oddity));

  useEffect(() => {
    let current = true;
    setLoaded(wordsLoaded(oddity));
    loadWords(oddity).then(() => current && setLoaded(true));
    return () => {
      current = false;
    };
  }, [oddity]);

  return loaded;
};
