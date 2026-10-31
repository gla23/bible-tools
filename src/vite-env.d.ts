/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

import type React from "react";

// React 19 dropped the global JSX namespace; content-modal still relies on it
declare global {
  namespace JSX {
    type Element = React.JSX.Element;
    type IntrinsicElements = React.JSX.IntrinsicElements;
  }
}
