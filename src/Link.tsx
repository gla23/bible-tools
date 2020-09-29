import React from "react";

export const Link = React.forwardRef<HTMLAnchorElement, { reference: string }>(
  (props, ref) => (
    <a
      className="hint"
      ref={ref}
      target="_blank"
      rel="noopener noreferrer"
      href={`https://www.biblegateway.com/passage/?search=${props.reference.replace(
        " ",
        "+"
      )}&version=ESV`}
    >
      <span role="img" aria-label="link">
        🔗
      </span>
    </a>
  )
);
