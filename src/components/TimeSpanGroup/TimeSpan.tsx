import React from "react";

export interface Props {
  label: string;
  x: number;
  y: number;
  dy: number;
  width: number;
  height: number;
  onClick?: () => void;
}
export default function TimeSpan({
  label,
  x,
  y,
  dy,
  width,
  height,
  onClick,
}: Props): JSX.Element {
  return (
    <g transform={`translate(0, ${y})`}>
      <g
        style={{
          transition: "transform .5s",
          transform: `translateY(${dy}px)`,
        }}
        onClick={onClick}
      >
        <rect
          x={x}
          y={0}
          width={width}
          height={height}
          fill="#36d"
          stroke="white"
        />
        <text
          fill="white"
          x={Math.max(0, x + 2)}
          y={height / 2}
          dominantBaseline="middle"
        >
          {x < 0 ? "⇠" + label : label}
        </text>
      </g>
    </g>
  );
}
