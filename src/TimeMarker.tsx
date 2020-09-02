import React from "react";

export interface Props {
  x: number,
  dx?: number,
  y: number,
  height: number,
  label: string | number,
}

export default function TimeMarker({ x, dx = 0, y, height, label }: Props) {
  return <g stroke="darkblue">
    <line x1={x} x2={x} y1={0} y2={height} />
    <text x={x + dx} y={y} textAnchor="middle" stroke="darkblue" fill="darkblue" dominantBaseline="middle" style={{ background: 'white' }}>
      {label}
    </text>
  </g>;
}