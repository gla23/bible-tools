import React from "react";
import { useState } from "react";
import { Renderable } from "./Renderable";
import { animated, config, useSpring } from "react-spring";

export const Wobble = (props: { children: Renderable }) => {
  const [power, setPower] = useState(false);
  const wait = 1000;
  const distance = 8;
  const spring = useSpring({
    from: { x: 1 },
    to: { x: power ? distance : 0, display: "inline-block" },
    onRest: () => {
      setTimeout(() => setPower(true), wait);
      setTimeout(() => setPower(false), wait + 100);
    },
    config: config.wobbly,
  });
  return (
    <span className="relative">
      <animated.span style={spring}>{props.children}</animated.span>
    </span>
  );
};
