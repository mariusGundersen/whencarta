import React, { useMemo } from "react";
import TimeMarker from "./TimeMarker";

export interface Props {
  year: number;
  month: number;
  day: number;
  x: number;
  y: number;
  dx: number;
  height: number;
  showYear: boolean;
}

export default function DayMarker({
  year,
  month,
  day,
  x,
  y,
  dx,
  height,
  showYear,
}: Props) {
  const label = useMemo(() => format(day, month, year, showYear), [
    day,
    month,
    year,
    showYear,
  ]);
  return (
    <TimeMarker key={day} x={x} dx={dx} y={y} label={label} height={height} />
  );
}

const monthYearName = Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function format(
  day: number,
  month: number,
  year: number,
  showYear: boolean
) {
  return showYear ? monthYearName.format(new Date(year, month, day)) : day + 1;
}
