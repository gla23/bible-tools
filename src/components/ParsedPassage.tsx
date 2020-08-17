import React from "react";
import { State } from "../parsing/state";
import "./ParsedPassage.css";

interface ParsedPassageProps {
  state: State;
  input?: string;
}
export const ParsedPassage = (props: ParsedPassageProps) => {
  const { state, input = state.string } = props;
  return (
    <span className="parsedPassage">
      {state.inputs.map((input, index) => (
        <span key={index} className={state.inputType(input) + "Text"}>
          {input.string}
        </span>
      ))}
      {input.slice(state.string.length)}
    </span>
  );
};
