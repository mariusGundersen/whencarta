import React from "react";
import { TransformToPixels } from "../../lib/panzoom";
import range from "../../lib/range";
import TimeMarkerRow from "./TimeMarkerRow";

export interface Props {
  timeLeft: number;
  timeRight: number;
  scaleTop: number;
  scaleBottom: number;
  transform: TransformToPixels;
}

export default function TimeMarkerGroup({
  timeLeft,
  timeRight,
  scaleTop,
  scaleBottom,
  transform,
}: Props) {
  const scales = range(Math.floor(scaleTop), scaleBottom);
  return (
    <g>
      {scales.map((scale) => (
        <TimeMarkerRow
          key={scale}
          scale={scale}
          transform={transform}
          timeFrom={timeLeft}
          timeTo={timeRight}
        />
      ))}
    </g>
  );
}
