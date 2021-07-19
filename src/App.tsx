import React, { useMemo, useRef, useState } from "react";
import { PassageTokens } from "./components/PassageTokens";
import { filterWords } from "./data/words";
import { parse } from "./passage/passage";
import { randomWordPassage, randomPassageReference } from "./functions/random";
import { NETPassage } from "./components/NETPassage";
import { Link } from "./Link";
import { Wikipedia } from "./Wikipedia";

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
      <Wikipedia />
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
