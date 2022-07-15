import React from "react";
import { NumberToLetterAnimation } from "./NumberToLetterAnimation";
import { Wobble } from "../utils/Wobble";
import { TranslateAnimation } from "./TranslateAnimation";
import { WordPickAnimation } from "./WordPickAnimation";

export const explanation = [
  <>
    <h2 className="text-4xl">Welcome to the Bible mnemonic creator!</h2>

    <span className="flex m-8 text-gray-400">
      Mnemonic:
      <blockquote className="ml-8">
        A system such as a pattern of letters, ideas, or associations which
        assists in remembering something.
      </blockquote>
    </span>

    <p className="">
      This system links <span className="text-sky-400">verse content</span> with{" "}
      <span className="text-sky-400">where it is</span>.
    </p>
    <p className="">
      See more for an explanation <Wobble>→</Wobble>
    </p>
  </>,
  <>
    <p>
      <span className="text-gray-400">A quick note first:</span> To use this
      system you need to be able to translate between numbers and letters:
    </p>
    <NumberToLetterAnimation>
      <p>
        This may take some time investment, but it becomes easy with practice ✨
        {/* It may take some time investment to learn this, but becomes easy with practice ✨ */}
      </p>
    </NumberToLetterAnimation>
  </>,
  <>
    Now for an example:
    <p>
      Let's say we read <span className="text-sky-400">John 5:19</span> and want
      to remember where it is.
    </p>
    {/* <p>
      Lets say we want to link <span className="text-sky-400">John 5:19</span>{" "}
      with its verse content:
    </p> */}
    <blockquote>
      <span className="text-gray-400">
        So Jesus said to them, “Truly, truly, I say to you, the Son can do
        nothing of his own accord, but only what he sees the Father doing. For
        whatever the Father does, that the Son does likewise.
      </span>
    </blockquote>
  </>,
  <>
    <TranslateAnimation></TranslateAnimation>
  </>,
  <>
    <p>
      So we have an initial peg: <span className="text-sky-400">des</span>
    </p>
    <p>
      Now we can make it more memorable by adding some padding:
      <WordPickAnimation></WordPickAnimation>
    </p>
  </>,
  <>
    <p>
      To do: Make a list of the good verses with explanation and pick a great
      one for the initial example
    </p>
    Jesus was completely available for his Father's desires. He only did what he
    saw his Father doing.
  </>,
  <>
    Then find a word that starts with those letters (same random scroll between
    list of possible words??)
    <p>User you have a go, if not the next section has what sticked for me?</p>
  </>,
  <>Something about how it doesn't have to work exactly e.g. fou or tap</>,
  <>
    , so it's <span className="bookToken">book 4</span>,{" "}
    <span className="chapterToken">chapter 5</span>,{" "}
    <span className="verseToken">verse 19</span>.
  </>,
  <>
    Could do a NT "number line" that pegs the image into a certain place? As you
    pick on the examples it scrolls over to the place?
  </>,
];
