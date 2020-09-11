import React, { useCallback, useState } from "react";
import useResizeObserver from "use-resize-observer";
import clamp from "../lib/clamp";
import {
  pixelToModelY,
  pixelXToTime,
  scaleToY,
  screenXToView,
  Transform,
  TransformToPixels,
} from "../lib/panzoom";
import PanZoom from "./PanZoom";
import TimeMarkerGroup from "./TimeMarkerGroup";
import TimeSpanGroup, { Moment } from "./TimeSpanGroup";

export interface Props {
  getMoments(scale: number, fromTime: number, toTime: number): Moment[];
  minYear: number;
  maxYear: number;
  initialPos?: { x: number; s: number };
  onChange?: (pos: { x: number; s: number }) => void;
}

export default function Timeline({
  getMoments,
  minYear,
  maxYear,
  initialPos,
  onChange,
}: Props) {
  const { width = 1000, height = 300, ref } = useResizeObserver<
    HTMLDivElement
  >();

  const limit = useCallback(
    ({ tx, ty, sx }: Transform) => {
      const minZoom = -1 / minYear;
      const maxZoom = width * 366;

      sx = clamp(minZoom, sx, maxZoom);
      tx = clamp(
        screenXToView(1) - maxYear * sx,
        tx,
        screenXToView(0) - minYear * sx
      );
      ty = clamp(scaleToY(maxZoom), ty, scaleToY(minZoom));
      return {
        tx,
        ty,
        sx,
      };
    },
    [maxYear, minYear, width]
  );

  const [transformation, setTransformation] = useState(() => ({
    tx: initialPos?.x ?? 0,
    ty: scaleToY(initialPos?.s ?? 1),
    sx: initialPos?.s ?? 1,
  }));

  return (
    <div className="Timeline" ref={ref}>
      <PanZoom
        transformation={transformation}
        limit={limit}
        onTransform={onChange}
      >
        {(transform) => {
          const transformToPixels: TransformToPixels = {
            ...transform,
            width,
            height,
          };
          const timeLeft = pixelXToTime(0, transformToPixels);
          const timeRight = pixelXToTime(width, transformToPixels);
          const scaleTop = pixelToModelY(0, transformToPixels);
          const scaleBottom = pixelToModelY(height, transformToPixels);

          return (
            <svg
              viewBox={`0 0 ${width} ${height}`}
              width={width}
              height={height}
            >
              <TimeMarkerGroup
                timeLeft={timeLeft}
                timeRight={timeRight}
                scaleTop={scaleTop}
                scaleBottom={scaleBottom}
                transform={transformToPixels}
              />
              <TimeSpanGroup
                getMoments={getMoments}
                timeLeft={timeLeft}
                timeRight={timeRight}
                scaleTop={scaleTop}
                scaleBottom={scaleBottom}
                transform={transformToPixels}
                setTransformation={setTransformation}
              />
            </svg>
          );
        }}
      </PanZoom>
    </div>
  );
}
