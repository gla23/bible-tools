import React, { useState } from "react";
import { parse } from "./parsing/parse";
import { ParsedPassage } from "./components/ParsedPassage";

function App() {
  document.title = "bible-tools";
  const [input, setInput] = useState("festival");
  const state = parse(input);
  return (
    <div className="App">
      bible-tools
      <br />
      <br />
      Input:{" "}
      <input
        type="text"
        value={input}
        onKeyPress={(e) => e.key === "Enter" && setInput(state.reference)}
        onChange={(e) => setInput(e.target.value)}
      />
      <br />
      <br />
      <ParsedPassage input={input} state={state} />
      <br />
      {state.reference}
      <br />
      <br />
      {state.error?.toString()}
      <br />
      <br />
      {false && <pre>{JSON.stringify(state, null, 2)}</pre>}
    </div>
  );
}

export default App;
