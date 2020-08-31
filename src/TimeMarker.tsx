import React from "react";
import { clamp } from "./Timeline";

export interface Props {
  x: number,
  y: number,
  height: number,
  time: number
}

export function TimeMarker({ time, x, y, height }: Props) {
  return <g stroke="darkblue" opacity={clamp(0, transform(y / height, 3 / 4, 1 / 4), 1)}>
    <line x1={x} x2={x} y1={0} y2={height} />
    <text x={x} y={y} textAnchor="middle" stroke="darkblue" fill="darkblue" dominantBaseline="middle">
      {format(time)}
    </text>
  </g>;
}

function transform(v: number, zero: number, one: number) {
  return (zero - v) / one;
}

function format(n: number) {
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) {
    return n / 1_000_000_000 + ' billion';
  } else if (abs >= 1_000_000) {
    return n / 1_000_000 + ' million';
  } else if (abs >= 10_000) {
    return n / 1_000 + ' millennia';
  } else {
    return n;
  }
}
