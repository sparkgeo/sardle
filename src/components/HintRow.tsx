import React from "react";

interface HintRowProps {
  children: JSX.Element | string;
}

export function HintRow({ children }: HintRowProps) {
  return <div className="pb-3">{children}</div>;
}
