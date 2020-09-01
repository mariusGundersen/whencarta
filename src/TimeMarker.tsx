import React from "react";
import { clamp } from "./Timeline";

export interface Props {
  x: number,
  y: number,
  height: number,
  time: number,
  yPos: number,
}

export function TimeMarker({ time, yPos, x, y, height }: Props) {
  return <g stroke="darkblue" opacity={clamp(0, transform(y / height, 3 / 4, 1 / 4), 1)}>
    <line x1={x} x2={x} y1={0} y2={height} />
    <text x={x} y={y} textAnchor="middle" stroke="darkblue" fill="darkblue" dominantBaseline="middle">
      {yPos === -1 ? formatMonth(time) : yPos === -2 ? formatDay(time) : format(time)}
    </text>
  </g>;
}

const intl = Intl.DateTimeFormat('en-US', { month: 'long' });

function formatMonth(time: number): React.ReactNode {
  const year = Math.floor(time);
  const month = Math.round((time - year) * 12);
  return intl.format(new Date(year, month));
}

function formatDay(time: number): React.ReactNode {
  const year = Math.floor(time);
  const month = Math.floor((time - year) * 12);
  const day = Math.floor(((time - year) * 12 - month) * 31);
  return day + 1;
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
