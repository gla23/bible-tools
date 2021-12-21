import React from "react";

export type Renderable =
  | Exclude<React.ReactNode, undefined | React.ReactElement>
  | JSX.Element
  | Renderable[];
