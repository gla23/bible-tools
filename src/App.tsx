import React from "react";
import { useMemo, useRef, useState } from "react";
import { PassageTokens } from "./components/PassageTokens";
import { filterWords } from "./data/words";
import { parse } from "./passage/passage";
import { randomWordPassage, randomPassageReference } from "./functions/random";
import { NETPassage } from "./components/NETPassage";
import { Link } from "./components/Link";
import { Wobble } from "./utils/Wobble";

const box = "text-xl p-8";
const content = [
  <>
    <h2 className="text-4xl">Welcome to the Bible Mnemonic playground!</h2>

    <span className="flex m-8 text-gray-400">
      Mnemonic:
      <blockquote className="ml-8">
        A system such as a pattern of letters, ideas, or associations which
        assists in remembering something.
      </blockquote>
    </span>

    <p className="">
      This system links <span className="text-sky-400">what a verse means</span>{" "}
      with <span className="text-sky-400">where it is</span>.
    </p>
    <p className="">
      See more for an explanation <Wobble>→</Wobble>
    </p>
    {/* (make this wobble nicely - ankify keyframes?
      or just use a spring) */}
  </>,
  <>
    <p>
      A quick note first: To use this system you need to be able to translate
      between numbers and letters:
    </p>
    Number get chosen (shake animation to swap into the new one!) Then the other
    one tweens to the correct answer. Then a Reverse checkbox to swap which one
    is set to see the other way round!
    <p>
      This takes a little practice but is quick once you get the hang of it.
    </p>
  </>,
  <>
    Now onto an example:
    <p>
      Lets say we want to link <b>John 5:19</b> with its verse content:
    </p>
    <blockquote>
      "So Jesus said to them, “Truly, truly, I say to you, the Son can do
      nothing of his own accord, but only what he sees the Father doing. For
      whatever the Father does, that the Son does likewise."
    </blockquote>
    <p>
      Well for John 5:19, John is the 4th book, so it's{" "}
      <span className="bookToken">book 4</span>,{" "}
      <span className="chapterToken">chapter 5</span>,{" "}
      <span className="verseToken">verse 19</span>.
    </p>
    Have John 5:19 in plain text, then animate into the coloured numbers!
  </>,
  <>Then animate from the numbers to the letters</>,
  <>
    Then find a word that starts with those letters (same random scroll between
    list of possible words??)
    <p>User you have a go, if not the next section has what sticked for me?</p>
  </>,
  <>Something about how it doesn't have to work exactly e.g. fou or tap</>,
];
function App() {
  const [input, setInput] = useState(defaultInput);
  const [oddity, setOddity] = useState(3);
  const [showSlider, setShowSlider] = useState(false);
  const passage = parse(input);
  const { reference, mnemonic, error } = passage;
  const refEntered = input && input.includes(reference);
  const valid = input !== "" && !passage.error;
  const linkRef = useRef<HTMLAnchorElement>(null);
  const matches = useMemo(
    () => filterWords({ startsWith: mnemonic, oddity, maxWords }),
    [mnemonic, oddity]
  );

  const showMnemonics =
    (input === mnemonic || refEntered) &&
    (passage.verse || passage.testament === "o");

  const randomWord = () => {
    const passage = randomWordPassage(1);
    setInput(passage.string + passage.leftover);
  };
  const randomVerse = () => setInput(randomPassageReference(oddity));

  return (
    <div className="App">
      {content.map((page, i) => (
        <div
          className={box}
          style={{ border: "white solid 1px", margin: 12 }}
          key={i}
        >
          {page}
        </div>
      ))}
      <button onClick={randomWord}>Random word</button>{" "}
      <button onClick={randomVerse}>Random verse</button>
      <br />
      Input:{" "}
      <input
        type="text"
        value={input}
        onKeyPress={(e) => e.key === "Enter" && linkRef.current?.click()}
        onChange={(e) => setInput(e.target.value)}
      />{" "}
      {valid && (
        <>
          <Link
            ref={linkRef}
            url={`https://www.stepbible.org/?q=version=ESV|reference=${reference.replace(
              " ",
              "+"
            )}`}
          >
            α
          </Link>
          <Link
            url={`https://www.biblegateway.com/passage/?search=${reference.replace(
              " ",
              "+"
            )}&version=ESV`}
          />
        </>
      )}
      <p>
        <PassageTokens passage={passage} />
      </p>
      <p>{error?.toString()}</p>
      {valid && !refEntered && (
        <p onClick={() => setInput(reference)}>
          Reference: <PassageTokens passage={parse(reference)} />
        </p>
      )}
      {valid && refEntered && (
        <p>
          Mnemonic: <PassageTokens passage={parse(mnemonic)} />
        </p>
      )}
      {valid && (
        <NETPassage reference={input && passage.chapter ? reference : null} />
      )}
      {showMnemonics && (
        <div>
          <span onClick={() => setShowSlider((a) => !a)}>
            {matches.length > 0 ? (
              <>
                {matches.length === maxWords
                  ? matches.length + "+"
                  : matches.length}{" "}
                potential <PassageTokens passage={parse(mnemonic)} /> mnemonic
                {matches.length > 1 && "s"}
              </>
            ) : (
              <>
                No words matching <PassageTokens passage={parse(mnemonic)} />{" "}
                found.
                <p className="hint">
                  Maybe it's an acronym? Good mental hooks take creativity!
                </p>
              </>
            )}
          </span>
          {showSlider && (
            <div>
              Word esotericism:{" "}
              <input
                type="range"
                value={oddity}
                min={0}
                max={7}
                onChange={(e) => setOddity(Number(e.target.value))}
              />
            </div>
          )}
          {matches.map((word, index) => (
            <p key={index + word} style={{ margin: "5px" }}>
              <small onClick={() => (window.location.search = "?v=" + word)}>
                {word}
              </small>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
const maxWords = 1000;
const defaultInput = new URLSearchParams(window.location.search).get("v") || "";
export default App;
