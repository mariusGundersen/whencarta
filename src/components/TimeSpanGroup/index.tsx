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
  getEvents(scale: number, fromTime: number, toTime: number): Moment[];
  readonly timeLeft: number;
  readonly timeRight: number;
  readonly scaleTop: number;
  readonly scaleBottom: number;
  readonly transform: TransformToPixels;
  setTransformation(transform: Transform): void;
}

export default function TimeSpanGroup({
  getEvents,
  timeLeft,
  timeRight,
  scaleTop,
  scaleBottom,
  transform,
  setTransformation,
}: Props) {
  const height = (1 / 2) * transform.height;
  const scales = range(Math.floor(scaleTop), scaleBottom);
  return (
    <g>
      {scales.map((scale) => {
        const y = scaleToPixelY(scale, transform);
        return (
          <g key={scale}>
            {getEvents(scale, timeLeft, timeRight).map(
              ({ start, end, label }) => {
                const x = timeToPixelX(start, transform);
                const width = durationToPixelWidth(end - start, transform);
                return (
                  <TimeSpan
                    key={start}
                    label={label}
                    x={x}
                    y={y}
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
