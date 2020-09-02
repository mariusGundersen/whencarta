import React from "react";
import { timeToX, Transform, transformY } from "./lib/panzoom";

export interface Props {
  label: string
  y: number
  transform: Transform
  start: number
  end: number
  onClick?: () => void
}
export default function TimeSpan({ label, start, end, transform, y, onClick }: Props): JSX.Element {
  const x = timeToX(start, transform);
  const width = (end - start) * transform.sx;
  const height = transform.sy;

  return (
    <g transform={`translate(0, ${transformY(y, transform)})`}
      onClick={onClick}>
      <rect
        x={x}
        y={height / 4}
        width={width}
        height={height / 2}
        fill="#36d"
        stroke="white" />
      <text
        fill="white"
        x={Math.max(0, x)}
        y={height / 2}
        dominantBaseline="middle">
        {x < 0 ? '⇠' + label : label}
      </text>
    </g>
  );
}
