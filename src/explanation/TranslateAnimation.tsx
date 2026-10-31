import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { config, animated, useSpring, useSprings } from "react-spring";
import { ntBooks } from "../exports";
import { useInterval } from "../utils/useInterval";
import { useInView } from "../utils/useInView";

// John 5:19: each number flies from the reference to its label, then on to
// its letter. Positions are measured from hidden slots in the layout, so the
// animation follows whatever size the text is.
const items = [4, 5, 19];
const labels = ["Book", "Chapter", "Verse"];
const sources = [ntBooks[items[0] - 1], String(items[1]), String(items[2])];
const letters = items.map((n) => String.fromCodePoint(n + 64));

type Point = { x: number; y: number };
type Slots = { source: Point[]; label: Point[]; letter: Point[] };
type SlotName = keyof Slots;

// Item i stays in the reference until stage i + 1, sits by its label for three
// stages, then becomes a letter
function slotAt(item: number, stage: number): SlotName {
  if (stage <= item) return "source";
  if (stage <= item + 3) return "label";
  return "letter";
}
// Once a number has moved on, a faded copy stays behind (appearing at once,
// as if left under the moving number) so the whole translation can be read
const ghostOpacity = 0.35;
function slotOpacity(name: SlotName, item: number, stage: number) {
  if (name === "letter") return 0;
  const order: SlotName[] = ["source", "label", "letter"];
  const passed = order.indexOf(slotAt(item, stage)) > order.indexOf(name);
  return passed ? ghostOpacity : 0;
}

export function TranslateAnimation() {
  const container = useRef<HTMLDivElement>(null);
  const active = useInView(container);
  const [stageAt, setState] = useState(0);
  const lastStage = (items.length + 1) * 2 - 1;
  const next = () => setState((s) => (s + 1) % (lastStage + 1));
  // Starts when the slide comes into view, pausing on the result each cycle
  useInterval(next, active ? (stageAt === lastStage ? 4000 : 1000) : null);
  useEffect(() => {
    if (!active) setState(0);
  }, [active]);

  const slotRefs = useRef<Record<SlotName, (HTMLSpanElement | null)[]>>({
    source: [],
    label: [],
    letter: [],
  });
  const [slots, setSlots] = useState<Slots | null>(null);

  useLayoutEffect(() => {
    const box = container.current;
    if (!box) return;
    const measure = () => {
      const origin = box.getBoundingClientRect();
      // Centre of each slot, so different widths of glyph line up
      const pointsOf = (name: SlotName) =>
        slotRefs.current[name].map((el) => {
          const rect = el!.getBoundingClientRect();
          return {
            x: rect.left + rect.width / 2 - origin.left,
            y: rect.top - origin.top,
          };
        });
      setSlots({
        source: pointsOf("source"),
        label: pointsOf("label"),
        letter: pointsOf("letter"),
      });
    };
    measure();
    // Slots move when the web font arrives or the text reflows
    document.fonts.ready.then(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    Object.values(slotRefs.current)
      .flat()
      .forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const springs = useSprings(
    items.length,
    items.map((_, item) => {
      const slot = slotAt(item, stageAt);
      const point = slots?.[slot][item] ?? { x: 0, y: 0 };
      return {
        to: {
          ...point,
          // 0 shows the reference text, 1 the number, 2 the letter
          form: slot === "source" ? 0 : slot === "label" ? 1 : 2,
        },
        immediate: !slots,
      };
    })
  );
  const partTwo = useSpring({ to: { fraction: stageAt > 3 ? 1 : 0 } });
  const pulse = useSpring({
    to: { fraction: stageAt === lastStage ? 1 : 0 },
    config: stageAt === lastStage ? config.molasses : { duration: 0 },
  });

  // https://www.desmos.com/calculator/bwemicfbfn
  const peak = 0.4;
  const steepness = 4;
  const offset = 0.2;
  const textOpacityLoss = 0.3;
  const slot = (name: SlotName, index: number) => ({
    ref: (el: HTMLSpanElement | null) => {
      slotRefs.current[name][index] = el;
    },
    className: "inline-block",
    style: { opacity: slotOpacity(name, index, stageAt) },
  });

  return (
    <div ref={container} className="relative mx-auto w-fit">
      <div className="text-center text-[1.5em] select-none">
        <span {...slot("source", 0)}>{sources[0]}</span>{" "}
        <span {...slot("source", 1)}>{sources[1]}</span>
        <span style={{ opacity: stageAt < 2 ? 1 : ghostOpacity }}>
          :
        </span>
        <span {...slot("source", 2)}>{sources[2]}</span>
      </div>
      <div className="grid grid-cols-[auto_auto_auto] items-center gap-x-5 gap-y-1 my-4">
        {labels.map((label, index) => (
          <React.Fragment key={label}>
            <span>{label}</span>
            <span className="text-center text-[1.5em] select-none">
              <span {...slot("label", index)}>{items[index]}</span>
            </span>
            {index === 0 ? (
              <animated.span
                className="text-[0.85em] text-ink/70 text-pretty"
                style={{
                  opacity: partTwo.fraction.to((f) => 1 - textOpacityLoss * f),
                }}
              >
                ← John is the 4th book
              </animated.span>
            ) : (
              <span />
            )}
          </React.Fragment>
        ))}
      </div>
      <animated.p
        className="text-center"
        style={{
          opacity: partTwo.fraction.to(
            (f) => 1 - textOpacityLoss + textOpacityLoss * f
          ),
        }}
      >
        Then convert to letters:
      </animated.p>
      <div className="flex justify-center gap-[0.5em] text-[1.95em] select-none">
        {letters.map((letter, index) => (
          <span key={index} {...slot("letter", index)}>
            {letter}
          </span>
        ))}
      </div>

      {springs.map((spring, item) => (
        <animated.span
          key={item}
          className="absolute top-0 left-0 text-[1.5em] select-none"
          style={{ x: spring.x, y: spring.y, opacity: slots ? 1 : 0 }}
        >
          {/* Both forms share one grid cell, centred on the slot */}
          <span
            className="inline-grid justify-items-center"
            style={{ transform: "translateX(-50%)" }}
          >
            <animated.span
              className="[grid-area:1/1]"
              style={{ opacity: spring.form.to((f) => 1 - Math.min(f, 1)) }}
            >
              {sources[item]}
            </animated.span>
            <animated.span
              className="[grid-area:1/1]"
              style={{
                opacity: spring.form.to((f) => Math.min(f, 1)),
                fontSize: spring.form.to(
                  (f) => `${1 + Math.max(0, f - 1) * 0.3}em`
                ),
                transform: pulse.fraction.to(
                  (f) =>
                    `scale(${
                      1 +
                      peak *
                        (1 -
                          Math.min(
                            1,
                            steepness * Math.abs(f - 0.5 - (item - 1) * offset)
                          ))
                    })`
                ),
              }}
            >
              {spring.form.to((f) => (f < 1.5 ? items[item] : letters[item]))}
            </animated.span>
          </span>
        </animated.span>
      ))}
    </div>
  );
}
