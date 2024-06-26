import React, { useState } from "react";
import { config, animated, useSpring, useSprings } from "react-spring";
import { ntBooks } from "../exports";
import { useInterval } from "../utils/useInterval";

export function TranslateAnimation() {
  const stageItems: {
    x: number;
    y: number;
    index: number;
    x2: number;
  }[] = [
    { x: 39, y: 35, index: 4, x2: 28 },
    { x: 9, y: 72, index: 5, x2: 52 },
    { x: -7, y: 109, index: 19, x2: 80 },
  ];
  const [stageAt, setState] = useState(0);
  const stageCount = (stageItems.length + 1) * 2;
  const next = () => setState((s) => (s + 1) % stageCount);
  // const [from, size] = [0, 1];
  // const next = () => setState((s) => (s < from + size ? s + 1 : from));

  const springs = useSprings(
    stageCount,
    new Array(stageCount).fill(null).map((_, index) => ({
      to: { fraction: Math.min(1, Math.max(stageAt - index, 0)) },
      config: index === 6 ? config.molasses : undefined,
    }))
  );
  const wholeSpring = useSpring({
    to: { fraction: stageAt / (stageCount - 1) },
  });

  useInterval(next, 1000);

  const extraXLine1 = -20;
  const extraXLine2 = -50;
  const lineHeightDiff = 192;
  const textOpacityLoss = 0.3;
  const textSwapSpring = springs[3];

  // https://www.desmos.com/calculator/bwemicfbfn
  const peak = 0.4;
  const steepness = 4;
  const offset = 0.2;
  return (
    <>
      <div>
        <animated.span
          style={{
            opacity: textSwapSpring.fraction.to((f) => 1 - textOpacityLoss * f),
          }}
        >
          John is the 4th book:{" "}
        </animated.span>
        <div></div>
        <span className="block w-24 mt-4 ml-12 select-none">
          {stageItems.map((stageItem, itemIndex) => {
            const { index, x, y, x2 } = stageItem;
            const y2 = lineHeightDiff - y;
            const part2 = stageAt > 3;
            const stage = itemIndex + (part2 ? 3 : 0);
            const spring = springs[stage];
            const centerTranslate = itemIndex === 0 ? "translate(13px)" : "";
            return (
              <React.Fragment key={itemIndex}>
                <animated.span
                  className={`inline-block ml-${itemIndex === 1 ? "3" : "0"}`}
                  style={{
                    transform:
                      stageAt === 0
                        ? wholeSpring.fraction.to(
                            (f) =>
                              `translate(${
                                f * (x + x2 + extraXLine1 + extraXLine2)
                              }px, ${f * lineHeightDiff}px)`
                          )
                        : spring.fraction.to((fraction) => {
                            const part1Fraction = part2 ? 1 : fraction;
                            const part2Fraction = part2 ? fraction : 0;
                            return `translate(${
                              part1Fraction * (x + extraXLine1) +
                              part2Fraction * (x2 + extraXLine2)
                            }px, ${part1Fraction * y + part2Fraction * y2}px)`;
                          }),
                  }}
                >
                  <animated.span
                    className="absolute"
                    style={{
                      opacity: stage === 0 ? spring.fraction.to((s) => s) : 1,
                      transform:
                        stageAt === 0
                          ? centerTranslate
                          : springs[6].fraction.to(
                              (f) =>
                                `${centerTranslate} scale(${
                                  1 +
                                  peak *
                                    (1 -
                                      Math.min(
                                        1,
                                        steepness *
                                          Math.abs(
                                            f - 0.5 - (itemIndex - 1) * offset
                                          )
                                      ))
                                }) `
                            ),
                    }}
                  >
                    {spring.fraction.to((f) =>
                      f < 0.5 || !part2
                        ? index
                        : String.fromCodePoint(index + 64)
                    )}
                  </animated.span>
                  <animated.span
                    style={{
                      opacity:
                        stage === 0 ? spring.fraction.to((s) => 1 - s) : 0,
                    }}
                  >
                    {itemIndex === 0 ? ntBooks[index - 1] : index}
                  </animated.span>
                </animated.span>
                <animated.span
                  style={{
                    opacity: spring.fraction.to((s) =>
                      part2 ? 0 : Math.pow(1 - s, 2)
                    ),
                  }}
                >
                  {itemIndex === 1 && ":"}
                </animated.span>
              </React.Fragment>
            );
          })}
        </span>
      </div>
      <p className="ml-0 mt-4">Book</p>
      <p className="ml-0">Chapter</p>
      <p className="ml-0">Verse</p>
      <animated.p
        className="mt-6"
        style={{
          opacity: textSwapSpring.fraction.to(
            (f) => 1 - textOpacityLoss + textOpacityLoss * f
          ),
        }}
      >
        Then convert to letters:
      </animated.p>
    </>
  );
}
