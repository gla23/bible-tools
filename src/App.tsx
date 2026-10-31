import React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { PassageTokens } from "./components/PassageTokens";
import { filterWords } from "./data/words";
import { parse } from "./passage/passage";
import { randomWordPassage, randomPassageReference } from "./functions/random";
import { useWords } from "./functions/useWords";
import { NETPassage } from "./components/NETPassage";
import { Link } from "./components/Link";
import { explanation } from "./explanation/explanation";
import { ContentModal } from "content-modal";

const card = "bg-surface rounded-xl p-4 sm:p-6";
const outlined = "border border-white/10 hover:border-white/30 transition-colors";
const button = "rounded-lg px-4 py-2 " + outlined;
function App() {
  const [open, setOpen] = useState(initialParams.has("help"));
  const [input, setInput] = useState(defaultInput);
  const [oddity, setOddity] = useState(defaultOddity);
  const [showSlider, setShowSlider] = useState(false);

  // Keep the URL in step so the current page can be shared or bookmarked
  useEffect(() => {
    const params = new URLSearchParams();
    if (input) params.set("v", input);
    if (oddity !== standardOddity) params.set("o", String(oddity));
    if (open) params.set("help", "");
    // A bare ?help reads better than ?help=
    const search = params.toString().replace(/(^|&)help=(?=&|$)/, "$1help");
    const url = window.location.pathname + (search ? "?" + search : "");
    window.history.replaceState(null, "", url);
  }, [input, oddity, open]);
  const wordsLoaded = useWords(oddity);
  const passage = parse(input);
  const { reference, mnemonic, error } = passage;
  const refEntered = input && input.includes(reference);
  const valid = input !== "" && !passage.error;
  const translation = refEntered ? mnemonic : reference;
  const linkRef = useRef<HTMLAnchorElement>(null);
  const matches = useMemo(
    () => filterWords({ startsWith: mnemonic, oddity, maxWords }),
    // wordsLoaded: recompute once the word lists for this oddity arrive
    [mnemonic, oddity, wordsLoaded]
  );

  const showMnemonics =
    (input === mnemonic || refEntered) &&
    (passage.verse || passage.testament === "o");

  const randomWord = async () => {
    const passage = await randomWordPassage(1);
    setInput(passage.string + passage.leftover);
  };
  const randomVerse = async () =>
    setInput(await randomPassageReference(oddity));

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 text-lg sm:px-6 sm:py-12 sm:text-xl">
      <ContentModal
        content={explanation.map((a) => (
          <div className="flex min-h-full flex-col justify-center-safe px-3 pb-2 text-[1.0625rem] leading-relaxed text-pretty sm:px-8 sm:text-[1.375rem]">
            <div>{a}</div>
          </div>
        ))}
        width={832}
        height={500}
        isOpen={open}
        onClose={() => setOpen(false)}
        darkMode
      ></ContentModal>

      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl">Bible mnemonic creator</h1>
        <button
          className={
            "shrink-0 flex items-center gap-2 h-11 pl-2 pr-4 rounded-full text-base " +
            outlined
          }
          onClick={() => setOpen(true)}
        >
          <span
            className="flex items-center justify-center w-7 h-7 rounded-full bg-accent text-page text-sm font-semibold"
            aria-hidden
          >
            ?
          </span>
          How it works
        </button>
      </header>

      <div className="flex items-center gap-3">
        <input
          type="text"
          className="min-w-0 flex-1 rounded-xl px-4 py-3 text-2xl sm:text-3xl border border-white/10 focus:border-white/40"
          placeholder="e.g. dope or John 15:16"
          value={input}
          onKeyDown={(e) => e.key === "Enter" && linkRef.current?.click()}
          onChange={(e) => setInput(e.target.value)}
        />
        {valid && (
          <span className="flex shrink-0 gap-1">
            <Link
              ref={linkRef}
              className="text-2xl"
              url={`https://www.stepbible.org/?q=version=ESV|reference=${reference.replace(
                " ",
                "+"
              )}`}
            >
              α
            </Link>
            <Link
              className="text-2xl"
              url={`https://www.biblegateway.com/passage/?search=${reference.replace(
                " ",
                "+"
              )}&version=ESV`}
            />
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        <button className={button} onClick={randomWord}>
          Random word
        </button>
        <button className={button} onClick={randomVerse}>
          Random verse
        </button>
      </div>

      {input && (
        <div className={card + " mt-6 text-center"}>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-3xl sm:text-4xl break-words">
            <PassageTokens passage={passage} />
            {valid && (
              <>
                <button
                  className="bg-transparent opacity-40 hover:opacity-80 transition-opacity"
                  title="Swap"
                  aria-label={"Swap to " + translation}
                  onClick={() => setInput(translation)}
                >
                  ↔
                </button>
                <button
                  className="bg-transparent"
                  title="Swap"
                  onClick={() => setInput(translation)}
                >
                  <PassageTokens passage={parse(translation)} />
                </button>
              </>
            )}
          </div>
          {error && (
            <p className="mb-0 text-base text-error">{error.toString()}</p>
          )}
        </div>
      )}

      {valid && passage.chapter && (
        <NETPassage
          className={card + " mt-6 leading-relaxed [&_p]:my-3 [&_p]:text-base"}
          reference={reference}
        />
      )}

      {showMnemonics && (
        <div className={card + " mt-6"}>
          <button
            className="text-left bg-transparent"
            onClick={() => setShowSlider((a) => !a)}
          >
            {!wordsLoaded ? (
              <>Loading words…</>
            ) : matches.length > 0 ? (
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
                <span className="hint block mt-2">
                  Maybe it's an acronym? Good mental hooks take creativity!
                </span>
              </>
            )}
          </button>
          {showSlider && (
            <label className="flex items-center gap-3 mt-4 text-base">
              Word esotericism
              <input
                type="range"
                className="flex-1 accent-accent"
                value={oddity}
                min={0}
                max={7}
                onChange={(e) => setOddity(Number(e.target.value))}
              />
            </label>
          )}
          {wordsLoaded && matches.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 mt-4 text-base">
              {matches.map((word, index) => (
                <button
                  key={index + word}
                  className="text-left truncate bg-transparent opacity-80 hover:opacity-100"
                  onClick={() => {
                    setInput(word);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  {word}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
const maxWords = 1000;
const standardOddity = 3;
const initialParams = new URLSearchParams(window.location.search);
const defaultInput = initialParams.get("v") || "";
const urlOddity = Number(initialParams.get("o"));
const defaultOddity =
  initialParams.has("o") && urlOddity >= 0 && urlOddity <= 7
    ? Math.round(urlOddity)
    : standardOddity;
export default App;
