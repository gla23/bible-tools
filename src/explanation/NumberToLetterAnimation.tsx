import React, { useEffect, useRef, useState } from "react";
import { animated, config, useSpring } from "react-spring";
import { Renderable } from "../utils/Renderable";

function nextNumber(number: number) {
  const minChangeDiff = 6;
  let newNumber: number = Math.floor(Math.random() * 26) + 1;
  while (Math.abs(newNumber - number) < minChangeDiff) {
    newNumber = Math.floor(Math.random() * 26) + 1;
  }
  return newNumber;
}

export function NumberToLetterAnimation(props: { children: Renderable }) {
  const [reversed, setReversed] = useState(false);
  const [number, setNumber] = useState(1);
  const [displacement, setDisplacement] = useState(0);
  const changeFrequency = 3000;

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplacement(1);
      setTimeout(() => setDisplacement(0), 50);
      setTimeout(() => setNumber(nextNumber), 150);
    }, changeFrequency);
    return () => clearInterval(interval);
  }, []);

  const shakeSpring = useSpring({
    to: { x: -displacement * 25 },
    config: config.wobbly,
  });
  const letterSpring = useSpring({
    to: { number },
    config: { tension: 20, friction: 10 },
  });
  return (
    <div>
      <div className={`flex w-40 m-auto text-3xl my-8`}>
        <animated.div className="flex-grow w-4 text-center" style={shakeSpring}>
          {reversed ? String.fromCodePoint(64 + number) : number}
        </animated.div>
        <div className="flex-grow">
          {new Array(26).fill(null).map((_, index) => {
            const i = index + 1;
            return (
              <animated.div
                key={index}
                className="absolute"
                style={{
                  opacity: letterSpring.number.to(
                    (n) => 1 - Math.abs((n - index - 1) * 0.85)
                  ),
                  y: letterSpring.number.to((n) => (n - index - 1) * -35),
                }}
              >
                {reversed ? i : String.fromCodePoint(64 + i)}
              </animated.div>
            );
          })}
        </div>
      </div>
      {props.children}
      <p>
        <input
          id="reverse"
          type="checkbox"
          checked={reversed}
          onChange={(e) => setReversed(e.target.checked)}
        />{" "}
        <label htmlFor="reverse">Try the reverse</label>
      </p>
    </div>
  );
}
