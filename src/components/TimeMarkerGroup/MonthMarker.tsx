import React, { useMemo } from "react";
import { timeToPixelX, TransformToPixels } from "../../lib/panzoom";
import TimeMarker from "./TimeMarker";

export interface Props {
  time: number;
  transform: TransformToPixels;
  dx: number;
  y: number;
  showYear: boolean;
  month: number;
  year: number;
}

export default function MonthMarker({
  time,
  transform,
  dx,
  y,
  showYear,
  month,
  year,
}: Props): JSX.Element {
  const label = useMemo(() => format(month, year, showYear), [
    month,
    year,
    showYear,
  ]);
  return (
    <TimeMarker
      x={timeToPixelX(time, transform)}
      dx={dx}
      y={y}
      label={label}
      height={transform.height}
    />
  );
}

const monthName = Intl.DateTimeFormat("en-US", { month: "long" });
const monthYearName = Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

export function format(month: number, year: number, showYear: boolean) {
  return showYear
    ? monthYearName.format(new Date(year, month))
    : monthName.format(new Date(year, month));
}
