import React from "react";

// Two range inputs stacked on one track; only their thumbs take the pointer,
// so each end can be dragged independently
export function RangeSlider(props: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  className?: string;
}) {
  const { min, max, value, onChange } = props;
  const [low, high] = value;
  const percent = (n: number) => ((n - min) / (max - min)) * 100;
  return (
    <div className={`relative h-5 ${props.className ?? ""}`}>
      <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-ink/20" />
      <div
        className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-accent"
        style={{ left: `${percent(low)}%`, right: `${100 - percent(high)}%` }}
      />
      <input
        type="range"
        className="range-thumb"
        aria-label="Lowest"
        // When the thumbs meet near the top, only the low one can still move
        style={{ zIndex: low === high && low > (min + max) / 2 ? 1 : undefined }}
        min={min}
        max={max}
        value={low}
        onChange={(e) => onChange([Math.min(Number(e.target.value), high), high])}
      />
      <input
        type="range"
        className="range-thumb"
        aria-label="Highest"
        min={min}
        max={max}
        value={high}
        onChange={(e) => onChange([low, Math.max(Number(e.target.value), low)])}
      />
    </div>
  );
}
