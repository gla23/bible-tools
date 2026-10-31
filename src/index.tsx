import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { PracticePage } from "./PracticePage";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {new URLSearchParams(window.location.search).has("practice") ? (
      <PracticePage />
    ) : (
      <App />
    )}
  </React.StrictMode>
);
