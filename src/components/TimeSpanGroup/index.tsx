import React from "react";
import {
  durationToPixelWidth,
  scaleToPixelY,
  timeAndScaleToTransform,
  timeToPixelX,
  Transform,
  TransformToPixels,
} from "../../lib/panzoom";
import TimeSpan from "./TimeSpan";

export interface TimelineMoment {
  readonly id: string;
  readonly start: number;
  readonly end: number;
  readonly label: string;
}

export interface TimelineScaleMoments {
  readonly scale: number;
  readonly moments: TimelineMoment[];
}

export interface Props {
  moments: TimelineScaleMoments[];
  readonly transform: TransformToPixels;
  setTransformation(transform: Transform): void;
}

export default function TimeSpanGroup({
  moments,
  transform,
  setTransformation,
}: Props) {
  const height = 25;
  return (
    <g>
      {moments.map(({ scale, moments }) => {
        const y = scaleToPixelY(scale, transform);
        return (
          <g key={scale}>
            {toLanes(moments).map(({ id, start, end, label, yIndex }) => {
              const x = timeToPixelX(start, transform);
              const width = durationToPixelWidth(end - start, transform);
              return (
                <TimeSpan
                  key={id}
                  label={label}
                  x={x}
                  y={y + height}
                  dy={height * yIndex}
                  width={width}
                  height={height}
                  onClick={() =>
                    setTransformation(
                      timeAndScaleToTransform((start + end) / 2, scale)
                    )
                  }
                />
              );
            })}
          </g>
        );
      })}
    </g>
  );
}

// todo: make this remember the result from last time
function toLanes(data: TimelineMoment[]) {
  const lanesData: (TimelineMoment & { yIndex: number })[] = [];
  let stack: TimelineMoment[] = [];
  for (const e of data) {
    const lane = stack.findIndex((s) => s.end <= e.start);
    const yIndex = lane === -1 ? stack.length : lane;
    if (yIndex > 3) continue;
    lanesData.push({
      ...e,
      yIndex,
    });
    stack[yIndex] = e;
  }
  return lanesData;
}
