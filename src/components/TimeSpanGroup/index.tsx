import React from "react";
import {
  durationToPixelWidth,
  scaleToPixelY,
  timeAndScaleToTransform,
  timeToPixelX,
  Transform,
  TransformToPixels,
} from "../../lib/panzoom";
import range from "../../lib/range";
import TimeSpan from "./TimeSpan";

export interface Moment {
  start: number;
  end: number;
  label: string;
}

export interface Props {
  getMoments(scale: number, fromTime: number, toTime: number): Moment[];
  readonly timeLeft: number;
  readonly timeRight: number;
  readonly scaleTop: number;
  readonly scaleBottom: number;
  readonly transform: TransformToPixels;
  setTransformation(transform: Transform): void;
}

export default function TimeSpanGroup({
  getMoments,
  timeLeft,
  timeRight,
  scaleTop,
  scaleBottom,
  transform,
  setTransformation,
}: Props) {
  const height = 25;
  const scales = range(Math.floor(scaleTop), scaleBottom);
  return (
    <g>
      {scales.map((scale) => {
        const y = scaleToPixelY(scale, transform);
        return (
          <g key={scale}>
            {toLanes(getMoments(scale, timeLeft, timeRight)).map(
              ({ start, end, label, yIndex }) => {
                const x = timeToPixelX(start, transform);
                const width = durationToPixelWidth(end - start, transform);
                return (
                  <TimeSpan
                    key={start}
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
              }
            )}
          </g>
        );
      })}
    </g>
  );
}

// todo: make this remember the result from last time
function toLanes(data: Moment[]) {
  const lanesData: (Moment & { yIndex: number })[] = [];
  let stack: Moment[] = [];
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
