import React from "react";

export interface Props {
  x: number;
  dx?: number;
  y: number;
  height: number;
  label: string | number;
}

export default function TimeMarker({ x, dx = 0, y, height, label }: Props) {
  return (
    <g stroke="darkblue" transform={`translate(${x}, ${y})`}>
      <line x1={0} x2={0} y1={0} y2={height} />
      <text
        x={dx}
        y={0}
        textAnchor="middle"
        stroke="darkblue"
        fill="darkblue"
        dominantBaseline="middle"
        style={{ background: "white" }}
      >
        {label}
      </text>
    </g>
  );
}
