import React from "react";
import { TransformToPixels } from "../../lib/panzoom";
import range from "../../lib/range";
import TimeMarkerRow from "./TimeMarkerRow";

export interface Props {
  timeLeft: number;
  timeRight: number;
  scaleTop: number;
  scaleBottom: number;
  transformToPixels: TransformToPixels;
}

export default function TimeMarkerGroup({
  timeLeft,
  timeRight,
  scaleTop,
  scaleBottom,
  transformToPixels,
}: Props) {
  const scales = range(Math.floor(scaleTop), scaleBottom);
  return (
    <g>
      {scales.map((scale) => (
        <TimeMarkerRow
          key={scale}
          scale={scale}
          transform={transformToPixels}
          timeFrom={timeLeft}
          timeTo={timeRight}
        />
      ))}
    </g>
  );
}
