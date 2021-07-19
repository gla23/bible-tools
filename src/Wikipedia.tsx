import React from "react";
import wikipedia from "wikipedia";

export const Wikipedia = () => {
  return (
    <button
      onClick={() => {
        console.log(wikipedia.search("batman").then(console.log));
      }}
    >
      Wiki
    </button>
  );
};
