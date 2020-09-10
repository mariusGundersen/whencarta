import React from "react";

export interface Props {
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  onClick?: () => void;
}
export default function TimeSpan({
  label,
  x,
  y,
  width,
  height,
  onClick,
}: Props): JSX.Element {
  return (
    <g transform={`translate(0, ${y})`} onClick={onClick}>
      <rect
        x={x}
        y={height / 4}
        width={width}
        height={height / 2}
        fill="#36d"
        stroke="white"
      />
      <text
        fill="white"
        x={Math.max(0, x)}
        y={height / 2}
        dominantBaseline="middle"
      >
        {x < 0 ? "⇠" + label : label}
      </text>
    </g>
  );
}
