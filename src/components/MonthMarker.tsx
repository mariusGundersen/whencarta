import React, { useMemo } from "react";
import { timeToPixelX, TransformToPixels } from "../lib/panzoom";
import TimeMarker from "./TimeMarker";
import { formatMonth } from "./TimeMarkerRow";

export interface Props {
  time: number;
  transform: TransformToPixels;
  dx: number;
  y: number;
  month: number;
  year: number;
}

export function MonthMarker({
  time,
  transform,
  dx,
  y,
  month,
  year,
}: Props): JSX.Element {
  const label = useMemo(() => formatMonth(month, year), [month, year]);
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
