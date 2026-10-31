import React, { useEffect, useRef, useState } from "react";
import { animated, config, useSpring } from "react-spring";
import { NTBookGrid } from "../components/NTBookGrid";
import { RangeSlider } from "../components/RangeSlider";
import { ntBooks } from "../data/books";
import { Renderable } from "../utils/Renderable";

// Prefers a big jump so the change is noticeable, settling for any other
// number when the range is too narrow for one
function nextNumber(number: number, [low, high]: [number, number]) {
  const minChangeDiff = 6;
  const range = new Array(high - low + 1).fill(null).map((_, i) => low + i);
  const far = range.filter((n) => Math.abs(n - number) >= minChangeDiff);
  const other = range.filter((n) => n !== number);
  const options = far.length ? far : other.length ? other : range;
  return options[Math.floor(Math.random() * options.length)];
}

// With practice set, extra settings let the range and the symbols be chosen
export function NumberToLetterAnimation(props: {
  children?: Renderable;
  practice?: boolean;
}) {
  const [reversed, setReversed] = useState(false);
  const [books, setBooks] = useState(false);
  const [range, setRange] = useState<[number, number]>([1, 26]);
  const rangeRef = useRef(range);
  rangeRef.current = range;
  const [number, setNumber] = useState(1);
  const [displacement, setDisplacement] = useState(0);
  const changeFrequency = 3000;

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplacement(1);
      setTimeout(() => setDisplacement(0), 50);
      setTimeout(() => setNumber((n) => nextNumber(n, rangeRef.current)), 150);
    }, changeFrequency);
    return () => clearInterval(interval);
  }, []);

  const shakeSpring = useSpring({
    to: { x: -displacement * 25 },
    config: config.wobbly,
  });
  const letterSpring = useSpring({
    to: { number },
    config: { tension: 20, friction: 10 },
  });
  const letter = (n: number) => String.fromCodePoint(64 + n);
  const symbol = (n: number) => (books ? ntBooks[n - 1] : n);
  return (
    <div>
      {/* Book names vary in width, so both sides align towards the middle.
          The height is fixed so changing text size doesn't move what's below */}
      <div
        className={`flex h-9 leading-9 m-auto my-11 whitespace-nowrap ${
          books ? "gap-4 max-w-md text-xl sm:text-2xl" : "w-40 text-3xl"
        }`}
      >
        <animated.div
          className={books ? "flex-1 text-right" : "flex-grow w-4 text-center"}
          style={shakeSpring}
        >
          {reversed ? letter(number) : symbol(number)}
        </animated.div>
        <div className={books ? "flex-1" : "flex-grow"}>
          {new Array(26).fill(null).map((_, index) => {
            const i = index + 1;
            return (
              <animated.div
                key={index}
                className="absolute"
                style={{
                  opacity: letterSpring.number.to(
                    (n) => 1 - Math.abs((n - index - 1) * 0.85)
                  ),
                  y: letterSpring.number.to((n) => `${(n - index - 1) * -1.2}em`),
                }}
              >
                {reversed ? symbol(i) : letter(i)}
              </animated.div>
            );
          })}
        </div>
      </div>
      {props.children}
      {props.practice ? (
        <div className="mt-4 text-sm">
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            <span>
              <input
                id="practice-reverse"
                type="checkbox"
                checked={reversed}
                onChange={(e) => setReversed(e.target.checked)}
              />{" "}
              <label htmlFor="practice-reverse">Practise the reverse</label>
            </span>
            <span>
              <input
                id="books"
                type="checkbox"
                checked={books}
                onChange={(e) => setBooks(e.target.checked)}
              />{" "}
              <label htmlFor="books">Use book names</label>
            </span>
          </div>
          <div className="mt-6 mb-2 text-ink/70">
            This slider can be used to practise a few letters at a time, then
            widen the range as they become familiar.{" "}
            <button
              className="ml-1 rounded border border-white/15 px-2 py-0.5 text-xs text-ink hover:border-white/30"
              onClick={() => setRange([1, 8])}
            >
              Start simple
            </button>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <span className="w-10 tabular-nums">
              {letter(range[0])}–{letter(range[1])}
            </span>
            <RangeSlider
              className="flex-1"
              min={1}
              max={26}
              value={range}
              onChange={setRange}
            />
          </div>
          <NTBookGrid books={books} range={range} current={number} />
        </div>
      ) : (
        <p>
          <input
            id="reverse"
            type="checkbox"
            checked={reversed}
            onChange={(e) => setReversed(e.target.checked)}
          />{" "}
          <label htmlFor="reverse">Practise the reverse</label>
        </p>
      )}
    </div>
  );
}
