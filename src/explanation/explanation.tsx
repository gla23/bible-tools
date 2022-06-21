import React from "react";
import { NumberToLetter } from "./NumberToLetter";
import { Wobble } from "../utils/Wobble";

export const explanation = [
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
  </>,
  <>
    <p>
      <span className="text-gray-400">A quick note first:</span> To use this
      system you need to be able to translate between numbers and letters:
    </p>
    <NumberToLetter>
      <p>
        This may take some time investment but becomes easy with practice ✨
      </p>
    </NumberToLetter>
  </>,
  <>
    Now onto an example:
    <p>
      Lets say we want to link <span className="text-sky-400">John 5:19</span>{" "}
      with its verse content:
    </p>
    <blockquote>
      So Jesus said to them, “Truly, truly, I say to you, the Son can do nothing
      of his own accord, but only what he sees the Father doing. For whatever
      the Father does, that the Son does likewise.
    </blockquote>
  </>,
  <>
    <p>
      Well, John is the 4th book, so it's{" "}
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
