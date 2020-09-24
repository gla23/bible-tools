import React, { useMemo, useRef, useState } from "react";
import { PassageTokens } from "./components/PassageTokens";
import { filterWords, randomWord } from "./data/words";
import { parse, Passage } from "./passage/passage";

const maxWords = 1000;

console.log(Passage);

function App() {
  const [input, setInput] = useState("");
  const [oddity, setOddity] = useState(3);
  const [showSlider, setShowSlider] = useState(false);
  const passage = parse(input);
  const { reference, mnemonic, error } = passage;
  const refEntered = input && input.includes(reference);
  const linkRef = useRef<HTMLAnchorElement>(null);

  const matches = useMemo(
    () => filterWords({ startsWith: mnemonic, oddity, maxWords }),
    [mnemonic, oddity]
  );

  const showMnemonics =
    (input === mnemonic || refEntered) &&
    (passage.verse || passage.testament === "o");

  const randomVerse = () => setInput(randomWordPassage(1).reference);
  const randomWord = () => {
    const passage = randomWordPassage(1);
    setInput(passage.string + passage.leftover);
  };

  return (
    <div className="App">
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
      {input !== "" && !passage.error && (
        <a
          className="hint"
          ref={linkRef}
          target="_blank"
          rel="noopener noreferrer"
          href={`https://www.biblegateway.com/passage/?search=${reference.replace(
            " ",
            "+"
          )}&version=ESV`}
        >
          <span role="img" aria-label="link">
            🔗
          </span>
        </a>
      )}
      <p>
        <PassageTokens passage={passage} />
      </p>
      <p>{error?.toString()}</p>
      {input !== "" && !refEntered && (
        <p>
          Reference: <PassageTokens passage={parse(reference)} />
        </p>
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
                No matching <PassageTokens passage={parse(mnemonic)} /> words
                found.
                <p className="hint">
                  Maybe it's an acronym? Good mental hooks take creativity!
                </p>
              </>
            )}
          </span>
          {showSlider && (
            <div>
              Word strangeness:{" "}
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
              <small>{word}</small>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function randomWordPassage(oddity: number) {
  while (true) {
    const word = randomWord(oddity);
    const passage = new Passage(word);
    if (!passage.error) return passage;
  }
}

export default App;
