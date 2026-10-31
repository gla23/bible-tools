import React, { useEffect, useRef, useState } from "react";
import { ntBooks } from "../data/books";

// Classic groupings, each running up to the book number given
const groups = [
  {
    name: "Gospels",
    end: 4,
    fill: "bg-rose-400/15",
    border: "border-rose-300/60",
  },
  {
    name: "History",
    end: 5,
    fill: "bg-amber-400/15",
    border: "border-amber-300/60",
  },
  {
    name: "Paul's letters",
    end: 18,
    fill: "bg-sky-400/15",
    border: "border-sky-300/60",
  },
  {
    name: "General letters",
    end: 26,
    fill: "bg-emerald-400/15",
    border: "border-emerald-300/60",
  },
  {
    name: "Prophecy",
    end: 27,
    fill: "bg-violet-400/15",
    border: "border-violet-300/60",
  },
];
const groupOf = (n: number) => groups.findIndex((group) => n <= group.end);

// Books run down sets of ten, two to a row: 1 2 / 3 4 / ... then 11 12 / ...
const blockSize = 10;
const position = (n: number) => {
  const index = n - 1;
  const within = index % blockSize;
  return {
    block: Math.floor(index / blockSize),
    row: Math.floor(within / 2),
    col: within % 2,
  };
};
const bookAt = (block: number, row: number, col: number) => {
  if (row < 0 || row >= blockSize / 2 || col < 0 || col > 1) return null;
  const n = block * blockSize + row * 2 + col + 1;
  return n >= 1 && n <= ntBooks.length ? n : null;
};
// Off the bottom of a set of ten carries on at the top of the next
const bookBelowOrAbove = (block: number, row: number, col: number) =>
  row < 0
    ? bookAt(block - 1, blockSize / 2 - 1, col)
    : row >= blockSize / 2
    ? bookAt(block + 1, 0, col)
    : bookAt(block, row, col);

// "1 Timothy" -> "Timothy", so numbered books can be kept together as a set
const setOf = (n: number) => ntBooks[n - 1].match(/^\d (.+)$/)?.[1] ?? null;
const sets = [...new Set(ntBooks.map((_, i) => setOf(i + 1)))]
  .filter((name): name is string => name !== null)
  .map((name) => ({
    name,
    books: ntBooks.map((_, i) => i + 1).filter((n) => setOf(n) === name),
  }));
// Each title covers a single book's square or all of a set's squares
const titles = [
  ...ntBooks
    .map((name, i) => ({ name, books: [i + 1] }))
    .filter(({ books }) => !setOf(books[0])),
  ...sets,
];

// A book or set's name drawn across its squares, as SVG so the text scales
// with them. Squares are 100 units; 1-3 John turns a corner, so its name
// curves up and round onto the row above
function Title(props: {
  name: string;
  books: number[];
  shown: boolean;
  dimmed: boolean;
}) {
  const first = position(props.books[0]);
  const rows = new Set(props.books.map((n) => position(n).row)).size;
  const columns = new Set(props.books.map((n) => position(n).col)).size;
  const [width, height] = [columns * 100, rows * 100];
  const id = `title-${props.name}`;
  // 16 just fits "Philippians" in one square, and 26 "Thessalonians" in two.
  // Short names like Mark get the bigger size too
  const fontSize =
    props.books.length > 1 || props.name.length <= 4 ? 26 : 16;
  // Absolute within a wrapper, so the SVG's own size can't stretch the grid
  return (
    <div
      className={`pointer-events-none relative z-10 ${fade(
        props.shown,
        props.dimmed
      )}`}
      style={{
        gridColumn: `${first.block * 3 + first.col + 1} / span ${columns}`,
        gridRow: `${first.row + 1} / span ${rows}`,
      }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${width} ${height}`}
      >
        {rows === 1 ? (
          <text
            x={width / 2}
            y={height / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={fontSize}
            fill="currentColor"
          >
            {props.name}
          </text>
        ) : (
          <>
            <path
              id={id}
              d="M 50 185 L 50 100 Q 50 50 100 50 L 185 50"
              fill="none"
            />
            <text
              fontSize={fontSize}
              fill="currentColor"
              dominantBaseline="central"
            >
              <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
                {props.name}
              </textPath>
            </text>
          </>
        )}
      </svg>
    </div>
  );
}

const sides = [
  { dRow: -1, dCol: 0, border: "border-t", hidden: "border-t-transparent" },
  { dRow: 0, dCol: 1, border: "border-r", hidden: "border-r-transparent" },
  { dRow: 1, dCol: 0, border: "border-b", hidden: "border-b-transparent" },
  { dRow: 0, dCol: -1, border: "border-l", hidden: "border-l-transparent" },
];

// Everything stays rendered and fades, so switching modes animates
const cellText = "absolute inset-0 flex items-center justify-center";
const fade = (shown: boolean, dimmed = false) =>
  `transition-opacity duration-500 ${
    !shown ? "opacity-0" : dimmed ? "opacity-25" : "opacity-100"
  }`;

// How long a square must be hovered (or held) before counting up to it, a
// shorter wait to move the count to another square, and the gap between
// squares as they fill in order
const countDelay = 600;
const switchDelay = 300;
const sweepStep = 15;

// Shows the book names, or with books off just the letters in plain boxes.
// Books outside the range being practised are dimmed. Hovering a square for a
// moment fills every square up to it and shows its number, so the shape that
// makes the number can be seen: 4 is the top block, 12 is ten and two more.
// The square being practised slowly lights up, as a hint
export function NTBookGrid(props: {
  books: boolean;
  range: [number, number];
  current: number;
}) {
  const { books } = props;
  const [low, high] = props.range;
  const full = low === 1 && high === 26;

  const [counted, setCounted] = useState<number | null>(null);
  // While counting first starts, the squares fill one after another
  const [sweeping, setSweeping] = useState(false);
  const countTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const sweepTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(
    () => () => {
      clearTimeout(countTimer.current);
      clearTimeout(sweepTimer.current);
    },
    []
  );
  const hover = (n: number) => {
    clearTimeout(countTimer.current);
    countTimer.current = setTimeout(() => {
      setCounted(n);
      setSweeping(true);
      clearTimeout(sweepTimer.current);
      sweepTimer.current = setTimeout(
        () => setSweeping(false),
        n * sweepStep + 500
      );
    }, counted === null ? countDelay : switchDelay);
  };
  const stopCounting = () => {
    clearTimeout(countTimer.current);
    clearTimeout(sweepTimer.current);
    setCounted(null);
    setSweeping(false);
  };

  const counting = counted !== null;
  const dimmed = (n: number) => !counting && !full && (n < low || n > high);
  const fill = (n: number) =>
    counting
      ? n <= counted && "bg-accent/35"
      : books && groups[groupOf(n)].fill;
  return (
    <div className="mt-14 mb-8 px-2 sm:px-6">
      <div
        className="grid select-none [-webkit-touch-callout:none] grid-cols-[repeat(2,minmax(0,1fr))_0.75rem_repeat(2,minmax(0,1fr))_0.75rem_repeat(2,minmax(0,1fr))]"
        onPointerLeave={stopCounting}
      >
        {ntBooks.map((_, index) => {
          const n = index + 1;
          // There are only 26 letters, so Revelation has none
          const hasLetter = n <= 26;
          const { block, row, col } = position(n);
          const group = groupOf(n);
          // With books, outline groups and sets: a border wherever the
          // neighbour isn't in the same one, following a group that wraps on
          // to the next set of ten. With letters, only the sets of ten are
          // outlined. Unused borders turn transparent rather than going, so
          // nothing changes size and the switch animates
          const edges = sides.map(({ dRow, dCol }) => {
            const outer = bookAt(block, row + dRow, col + dCol) === null;
            const neighbour = bookBelowOrAbove(block, row + dRow, col + dCol);
            const differs =
              neighbour === null ||
              groupOf(neighbour) !== group ||
              setOf(neighbour) !== setOf(n);
            return { border: outer || differs, visible: books ? differs : outer };
          });
          const [top, right, bottom, left] = edges.map(
            (edge) => edge.border && edge.visible
          );
          const borders = edges.map(
            (edge, i) =>
              edge.border &&
              (edge.visible
                ? sides[i].border
                : `${sides[i].border} ${sides[i].hidden}`)
          );
          // Round the visible outline's outer corners only, or the curve
          // breaks a straight edge where a hidden border meets it. A filled
          // square while counting follows the filled shape in its set of ten
          const filled = counting && n <= counted;
          const [fillTop, fillRight, fillBottom, fillLeft] = sides.map(
            ({ dRow, dCol }) => {
              const neighbour = bookAt(block, row + dRow, col + dCol);
              return neighbour === null || neighbour > counted!;
            }
          );
          const corners = filled
            ? [
                fillTop && fillLeft && "rounded-tl-md",
                fillTop && fillRight && "rounded-tr-md",
                fillBottom && fillRight && "rounded-br-md",
                fillBottom && fillLeft && "rounded-bl-md",
              ]
            : [
                top && left && "rounded-tl-md",
                top && right && "rounded-tr-md",
                bottom && right && "rounded-br-md",
                bottom && left && "rounded-bl-md",
              ];
          const delay = sweeping ? `${(n - 1) * sweepStep}ms` : "0ms";
          return (
            <div
              key={n}
              className={[
                "relative aspect-square text-center transition-[background-color,border-color,border-radius,opacity] duration-500",
                dimmed(n) && "opacity-25",
                fill(n),
                books ? groups[group].border : "border-ink/30",
                ...borders,
                ...corners,
              ]
                .filter(Boolean)
                .join(" ")}
              style={{
                gridColumn: block * 3 + col + 1,
                gridRow: row + 1,
                transitionDelay: delay,
              }}
              onPointerEnter={() => hover(n)}
              onPointerLeave={() => clearTimeout(countTimer.current)}
            >
              <span
                className={`absolute inset-0 rounded-md bg-ink/[0.08] transition-opacity ${
                  !counting && n === props.current
                    ? "opacity-100 duration-[3000ms] ease-in"
                    : "opacity-0 duration-300"
                }`}
              />
              {hasLetter && (
                <span
                  className={`${cellText} text-xl sm:text-3xl ${fade(
                    !books && !counting
                  )}`}
                >
                  {String.fromCodePoint(64 + n)}
                </span>
              )}
              {/* The counted number, with the ones before it faint */}
              <span
                className={`${cellText} text-xl sm:text-3xl transition-opacity duration-500 ${
                  !counting || n > counted
                    ? "opacity-0"
                    : n === counted
                    ? "opacity-100"
                    : "opacity-10"
                }`}
                style={{ transitionDelay: delay }}
              >
                {n}
              </span>
            </div>
          );
        })}
        {/* Book names are drawn over the squares by Title */}
        {titles.map((title) => (
          <Title
            key={title.name}
            {...title}
            shown={books && !counting}
            dimmed={title.books.every(dimmed)}
          />
        ))}
      </div>
      <div
        className={`mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs ${fade(books)}`}
      >
        {groups.map((group) => (
          <span key={group.name} className="flex items-center gap-1.5">
            <span
              className={`inline-block h-3 w-3 rounded-sm border ${group.fill} ${group.border}`}
            />
            {group.name}
          </span>
        ))}
      </div>
    </div>
  );
}
