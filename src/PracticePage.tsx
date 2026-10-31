import React from "react";
import { NumberToLetterAnimation } from "./explanation/NumberToLetterAnimation";

export function PracticePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 text-lg sm:px-6 sm:py-12 sm:text-xl">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl">Translation practice</h1>
        <a
          className="shrink-0 h-11 flex items-center px-4 rounded-full text-base border border-white/10 hover:border-white/30 transition-colors"
          href="./"
        >
          ← Back
        </a>
      </header>
      <p className="text-ink/75">
        The system relies on translating between numbers and letters. You can
        practise here until it feels natural.
      </p>
      {/* The scrolling letters are positioned within this box */}
      <div className="relative overflow-hidden">
        <NumberToLetterAnimation practice />
      </div>
    </div>
  );
}
