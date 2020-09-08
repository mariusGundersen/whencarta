import React, { useMemo } from "react";
import { timeToPixelX, TransformToPixels } from "../../lib/panzoom";
import TimeMarker from "./TimeMarker";
import { format } from "./TimeMarkerRow";

export interface Props {
  time: number;
  transform: TransformToPixels;
  y: number;
}

export default function YearsMarker({ time, transform, y }: Props) {
  const label = useMemo(() => format(time), [time]);
  return (
    <TimeMarker
      key={time}
      x={timeToPixelX(time, transform)}
      y={y}
      label={label}
      height={transform.height}
    />
  );
}
