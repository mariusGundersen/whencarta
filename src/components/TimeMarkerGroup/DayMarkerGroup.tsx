import React, { useMemo } from "react";
import {
  durationToPixelWidth,
  timeToPixelX,
  TransformToPixels,
} from "../../lib/panzoom";
import range from "../../lib/range";
import DayMarker from "./DayMarker";

export interface Props {
  year: number;
  month: number;
  monthTime: number;
  transform: TransformToPixels;
  y: number;
  timeFrom: number;
  timeTo: number;
  showYear: boolean;
}

export default function DayMarkerGroup({
  year,
  month,
  monthTime,
  transform,
  y,
  timeFrom,
  timeTo,
  showYear,
}: Props) {
  const daysInMonth = useMemo(() => getDaysInMonth(year, month), [year, month]);
  const yearFraction = 1 / 12 / daysInMonth;
  const dx = durationToPixelWidth(0.5 * yearFraction, transform);
  return (
    <>
      {range(0, daysInMonth, 1).map((day) => {
        const time = monthTime + day * yearFraction;
        if (time < timeFrom - yearFraction || time > timeTo) return null;
        const x = timeToPixelX(time, transform);
        return (
          <DayMarker
            key={day}
            day={day}
            month={month}
            year={year}
            x={x}
            y={y}
            dx={dx}
            height={transform.height}
            showYear={showYear}
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
