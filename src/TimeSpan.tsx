import React from "react";
import { timeToPixelX, TransformToPixels, transformToPixelY } from "./lib/panzoom";

export interface Props {
  label: string
  y: number
  transform: TransformToPixels
  start: number
  end: number
  onClick?: () => void
}
export default function TimeSpan({ label, start, end, transform, y, onClick }: Props): JSX.Element {
  const x = timeToPixelX(start, transform);
  const width = timeToPixelX(end, transform) - x;
  const height = 1/3*transform.height;

  return (
    <g transform={`translate(0, ${transformToPixelY(y, transform)})`}
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
