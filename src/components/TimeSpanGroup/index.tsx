import React from "react";
import { getTransform, Transform, TransformToPixels } from "../../lib/panzoom";
import TimeSpan from "./TimeSpan";

export interface Moment {
  start: number;
  end: number;
  label: string;
}

export interface Props {
  readonly events: { y: number; moments: Moment[] }[];
  readonly timeLeft: number;
  readonly timeRight: number;
  readonly scaleTop: number;
  readonly scaleBottom: number;
  readonly transformToPixels: TransformToPixels;
  setTransformation(transform: Transform): void;
}

export default function TimeSpanGroup({
  events,
  timeLeft,
  timeRight,
  scaleTop,
  scaleBottom,
  transformToPixels,
  setTransformation,
}: Props) {
  return (
    <g>
      {events
        .filter(({ y }) => scaleTop - 1 < y && y < scaleBottom)
        .map(({ moments, y }) => (
          <g key={y}>
            {moments
              .filter(({ start, end }) => start < timeRight && end > timeLeft)
              .map(({ start, end, label }) => (
                <TimeSpan
                  key={start}
                  label={label}
                  y={y}
                  transform={transformToPixels}
                  start={start}
                  end={end}
                  onClick={() => setTransformation(getTransform(start, end))}
                />
              ))}
          </g>
        ))}
    </g>
  );
}
