import React, { useState } from "react";
import { parse } from "./parsing/parse";
import { ParsedPassage } from "./components/ParsedPassage";

function App() {
  const [input, setInput] = useState("festival");
  const state = parse(input);
  return (
    <div className="App">
      Bible-tools
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
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
}

export default App;
