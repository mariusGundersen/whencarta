import React, { useMemo } from "react";
import { generate } from "../../lib/generate";
import { timeToPixelX, TransformToPixels } from "../../lib/panzoom";
import TimeMarker from "./TimeMarker";

export interface Props {
  year: number;
  month: number;
  monthTime: number;
  transform: TransformToPixels;
  y: number;
  timeFrom: number;
  timeTo: number;
}

export function DayMarkerGroup({
  year,
  month,
  monthTime,
  transform,
  y,
  timeFrom,
  timeTo,
}: Props) {
  const daysInMonth = useMemo(() => getDaysInMonth(year, month), [year, month]);
  const yearFraction = 1 / 12 / daysInMonth;
  const dx =
    timeToPixelX(monthTime + 0.5 * yearFraction, transform) -
    timeToPixelX(monthTime, transform);
  return (
    <>
      {[...generate(0, daysInMonth, 1)].map((day) => {
        const time = monthTime + day * yearFraction;
        if (time < timeFrom - yearFraction || time > timeTo) return null;
        const x = timeToPixelX(time, transform);
        return (
          <TimeMarker
            key={day}
            x={x}
            dx={dx}
            y={y}
            label={day + 1}
            height={transform.height}
          />
        );
      })}
    </>
  );
}

function getDaysInMonth(year: number, month: number): number {
  // this is a dirty trick, but it works
  return new Date(year, month + 1, 0).getDate();
}
