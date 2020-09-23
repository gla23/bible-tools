import React, { useMemo, useState } from "react";
import { PassageTokens } from "./components/PassageTokens";
import { filterWords } from "./data/words";
import { randomWordPassage, parse, Passage } from "./passage/passage";

const maxWords = 1000;

// TODO:
// random verse
// add view on bible gateway button

function App() {
  document.title = "bible-tools";
  const [input, setInput] = useState("");
  const [oddity, setOddity] = useState(3);
  const [showSlider, setShowSlider] = useState(false);
  const passage = parse(input);
  const { reference, mnemonic, error } = passage;
  const matches = useMemo(
    () => filterWords({ startsWith: mnemonic, oddity, maxWords }),
    [mnemonic, oddity]
  );

  const refEntered = input && input.includes(reference);
  const showMnemonics =
    (input === mnemonic || refEntered) &&
    (passage.verse || passage.testament === "o");

  const setMnemonic = () => setInput(mnemonic);
  const randomVerse = () => setInput(randomWordPassage(1).reference);
  const randomWord = () => {
    const passage = randomWordPassage(1);
    setInput(passage.string + passage.leftover);
  };

  return (
    <div className="App">
      <button onClick={randomWord}>Random word</button>
      <button onClick={randomVerse}>Random verse</button>
      <br />
      Input:{" "}
      <input
        type="text"
        value={input}
        onKeyPress={(e) => e.key === "Enter" && setMnemonic()}
        onChange={(e) => setInput(e.target.value)}
      />{" "}
      {!showMnemonics && <button onClick={setMnemonic}>↵</button>}
      <p>
        <PassageTokens passage={passage} />
      </p>
      <p>{error?.toString()}</p>
      <p>
        {!refEntered && "Reference: "}
        {!refEntered && <PassageTokens passage={parse(reference)} />}
      </p>
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
                No matching words found.
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

export default App;
