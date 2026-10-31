import React from "react";

export const Link = React.forwardRef<
  HTMLAnchorElement,
  { url: string; children?: React.JSX.Element | string; className?: string }
>((props, ref) => (
  <a
    className={"hint " + props.className}
    style={{ marginLeft: "5px" }}
    ref={ref}
    target="_blank"
    rel="noopener noreferrer"
    href={props.url}
  >
    <span role="img" aria-label="link">
      {props.children || "🔗"}
    </span>
  </a>
));
