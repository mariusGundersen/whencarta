import React, { useCallback, useEffect, useState } from "react";
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
import TimeSpanGroup, { MomentScale } from "./TimeSpanGroup";

export interface Props {
  moments: MomentScale[];
  minYear: number;
  maxYear: number;
  initialPos?: { x: number; s: number };
  onBoundsChange?: (bounds: {
    fromTime: number;
    toTime: number;
    minScale: number;
    maxScale: number;
  }) => void;
}

export default function Timeline({
  moments,
  minYear,
  maxYear,
  initialPos,
  onBoundsChange,
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

  const [transform, setTransform] = useState(() => ({
    tx: initialPos?.x ?? 0,
    ty: scaleToY(initialPos?.s ?? 1),
    sx: initialPos?.s ?? 1,
  }));

  const transformToPixels: TransformToPixels = {
    ...transform,
    width,
    height,
  };
  const fromTime = pixelXToTime(0, transformToPixels);
  const toTime = pixelXToTime(width, transformToPixels);
  const minScale = pixelToModelY(0, transformToPixels);
  const maxScale = pixelToModelY(height, transformToPixels);

  useEffect(() => {
    onBoundsChange?.({ fromTime, toTime, minScale, maxScale });
  }, [onBoundsChange, fromTime, toTime, minScale, maxScale]);

  return (
    <PanZoom
      className="Timeline"
      ref={ref}
      transformation={transformation}
      limit={limit}
      onTransform={setTransform}
    >
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
        <TimeMarkerGroup
          timeLeft={fromTime}
          timeRight={toTime}
          scaleTop={minScale}
          scaleBottom={maxScale}
          transform={transformToPixels}
        />
        <TimeSpanGroup
          moments={moments}
          transform={transformToPixels}
          setTransformation={setTransformation}
        />
      </svg>
    </PanZoom>
  );
}
