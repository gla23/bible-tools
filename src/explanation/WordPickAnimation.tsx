import React, { useMemo, useState } from "react";
import { animated, useSpring } from "react-spring";
import { filterWords } from "../data/words";
import { useInterval } from "../utils/useInterval";
import { useWords } from "../functions/useWords";

export function WordPickAnimation() {
  const loaded = useWords(0);
  const words = useMemo(
    () =>
      loaded
        ? filterWords({ startsWith: "des", oddity: 0 }).sort(
            (a, b) => Math.random() - 0.5
          )
        : [],
    [loaded]
  );
  const [count, setCount] = useState(0);
  const next = () => setCount(count + 1);
  const wordIndex = words.length ? count % words.length : 0;

  const spring = useSpring({
    to: { wordIndex },
    // config: { tension: 20, friction: 10 },
  });
  useInterval(next, 900);

  return (
    <div className="my-[2.5em] ml-4 sm:my-[3.5em]">
      d e s{" "}
      {words.length > 0 && [-2, -1, 0, 1, 2].map((offset) => {
        const wordIndexMap = (wordIndex + offset + words.length) % words.length;
        const word = words[wordIndexMap];
        // Deal with the mod boundary
        const difference1 = wordIndex - wordIndexMap;
        const cycle = Math.floor(words.length / 2);
        const difference2 =
          ((wordIndex + cycle) % words.length) -
          ((wordIndexMap + cycle) % words.length);
        const difference =
          Math.abs(difference2) < Math.abs(difference1)
            ? difference2
            : difference1;

        return (
          <animated.span
            key={wordIndexMap}
            className="absolute ml-1 mr-2"
            style={{
              opacity: spring.wordIndex.to((n) => {
                const fraction =
                  wordIndex === 0 ? -n / (words.length - 1) : n - Math.ceil(n);
                return 1 - Math.abs(difference + fraction) * 0.5;
              }),
              y: spring.wordIndex.to((n) => {
                const fraction =
                  wordIndex === 0 ? -n / (words.length - 1) : n - Math.ceil(n);
                return `${(offset - fraction) * 1.5}em`;
              }),
            }}
          >
            {[...word.slice(3)].join(" ")}
          </animated.span>
        );
      })}
    </div>
  );
}
