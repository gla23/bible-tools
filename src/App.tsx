import React, { useState } from "react";
import { parse } from "./exports";
import { PassageTokens } from "./components/PassageTokens";

function App() {
  document.title = "bible-tools";
  const [input, setInput] = useState("festival");
  const passage = parse(input);
  return (
    <div className="App">
      bible-tools
      <br />
      <br />
      Input:{" "}
      <input
        type="text"
        value={input}
        onKeyPress={(e) => e.key === "Enter" && setInput(passage.reference)}
        onChange={(e) => setInput(e.target.value)}
      />
      <br />
      <br />
      <PassageTokens passage={passage} />
      <br />
      {passage.reference}
      <br />
      <br />
      {passage.error?.toString()}
    </div>
  );
}

export default App;
