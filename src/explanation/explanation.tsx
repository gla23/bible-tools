import React from "react";
import { NumberToLetterAnimation } from "./NumberToLetterAnimation";
import { Wobble } from "../utils/Wobble";
import { TranslateAnimation } from "./TranslateAnimation";
import { WordPickAnimation } from "./WordPickAnimation";

const verseText = (
  <span className="text-ink/75">
    So Jesus said to them, “Truly, truly, I say to you, the Son can do nothing
    of his own accord, but only what he sees the Father doing. For whatever the
    Father does, that the Son does likewise.
  </span>
);
const threeSteps = (
  <ul>
    <li className="block">1. Translate the verse reference into 3 letters</li>
    <li className="block">
      2. Think about the meaning of the verse that you want to capture
    </li>
    <li className="block">3. Link the 3 letters to the meaning</li>
  </ul>
);
export const explanation = [
  <>
    <h2 className="text-[1.35em] leading-snug mb-2">Welcome to the Bible mnemonic creator!</h2>

    <blockquote className="quote">
      <span className="text-ink/60">Mnemonic:</span> A system such as a
      pattern of letters which assists in remembering something.
    </blockquote>

    <p className="">
      This system links a verse's <span className="text-accent">concept</span>{" "}
      with <span className="text-accent">where it is</span>.
    </p>
    <p className="">
      See more for an explanation <Wobble>→</Wobble>
    </p>
  </>,
  <span
    style={{
      display: "block",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <p>
      <span className="text-ink/75">A quick note first:</span> To use this
      system you need to be able to translate between numbers and letters:
    </p>
    <NumberToLetterAnimation>
      <p>
        Learning this takes an initial investment, but it becomes easy with
        practice ✨
        {/* It may take some time investment to learn this, but becomes easy with practice ✨ */}
      </p>
    </NumberToLetterAnimation>
  </span>,
  <>
    <div className="my-4"></div>
    Now onto an example: <span className="text-accent">John 5:19</span>
    {/* <p>The system uses 3 easy steps:</p> */}
    <p>
      First translate the reference into 3 letters <Wobble>→</Wobble>
    </p>
    {/* <p>
      Let's say we read  and want
      to remember where it is.
    </p> */}
    {/* <p>
      Lets say we want to link <span className="text-accent">John 5:19</span>{" "}
      with its verse content:
    </p> */}
  </>,
  <>
    <TranslateAnimation></TranslateAnimation>
  </>,
  <>
    <p>Then think about the verse meaning:</p>
    <blockquote className="quote">{verseText}</blockquote>
    <p>What is the concept you want to remember?</p>
  </>,
  <>
    <p>Now for the creative step!</p>
    <p>
      Link the verse concept with the mnemonic in a way that's memorable for
      you.
    </p>
    <div className="flex flex-wrap">
      <div className="basis-48 grow">
        <WordPickAnimation></WordPickAnimation>
      </div>
      <div className="basis-48 grow pr-4 py-4">
        e.g. Jesus was completely available for his Father's{" "}
        <span className="text-accent">des</span>ires. He only did what he saw
        his Father doing.
      </div>
    </div>
  </>,
  <>
    <p>This link can then be used as a hook into the theme.</p>
    <p>
      E.g.{' "'}
      <span className="text-ink/75">
        Where was that verse about Jesus being dependent on his Father?
      </span>
      " Then work backwards:
    </p>
    <div>
      <div className="text-center">
        <div>
          only does Father's <span className="text-accent">des</span>
          ires
        </div>{" "}
        ↓<div>des</div> ↓<div>John 5:19</div>
      </div>
    </div>
  </>,
  <>
    <p>That's it!</p>Close this to play around with some examples.
    {/* Have a look at some other examples, look at the FAQs, or play around with
    the mnemonic generator. I hope others will enjoy this and find this useful.
    <p>
      Please get in touch if you have any feedback, clarification or ideas!
      GitHub
    </p> */}
  </>,
];
