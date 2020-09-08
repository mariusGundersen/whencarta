import React from "react";
import { generate } from "../../lib/generate";
import { TransformToPixels } from "../../lib/panzoom";
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
  return (
    <g>
      {[...generate(Math.floor(scaleTop), scaleBottom)].map((scale) => (
        <TimeMarkerRow
          key={scale}
          scale={-scale}
          transform={transformToPixels}
          timeFrom={timeLeft}
          timeTo={timeRight}
        />
      ))}
    </g>
  );
}
