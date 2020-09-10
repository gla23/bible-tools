import React from "react";
import "./PassageTokens.css";
import { Passage } from "../parsing/passage";

export const PassageTokens = (props: { passage: Passage }) => {
  const { tokens, leftover } = props.passage;
  return (
    <span className="parsedPassage">
      {tokens.map((token, index) => (
        <span key={index} className={token.type + "Token"}>
          {token.string}
        </span>
      ))}
      {leftover}
    </span>
  );
};
