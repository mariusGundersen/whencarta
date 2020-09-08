import React, { useEffect, useRef, useState } from "react";
import clamp from "../lib/clamp";
import {
  getTransform,
  pixelToModelY,
  pixelXToTime,
  pixelXToView,
  scaleToY,
  Transform,
  TransformToPixels,
} from "../lib/panzoom";
import PanZoom from "./PanZoom";
import TimeMarkerGroup from "./TimeMarkerGroup";
import TimeSpanGroup, { Moment } from "./TimeSpanGroup";

export interface Props {
  events: { y: number; moments: Moment[] }[];
  minYear: number;
  maxYear: number;
  initialPos?: { x: number; s: number };
  onChange?: (pos: { x: number; s: number }) => void;
}

export default function Timeline({
  events,
  minYear,
  maxYear,
  initialPos,
  onChange,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(1000);
  const [height, setHeight] = useState(300);

  const minZoom = -1 / minYear;
  const maxZoom = width * 366;

  function limit({ tx, ty, sx }: Transform) {
    sx = clamp(minZoom, sx, maxZoom);
    tx = clamp(
      pixelXToView(1) - maxYear * sx,
      tx,
      pixelXToView(0) - minYear * sx
    );
    ty = clamp(scaleToY(maxZoom), ty, scaleToY(minZoom));
    return {
      tx,
      ty,
      sx,
    };
  }

  const [transformation, setTransformation] = useState(() =>
    initialPos
      ? {
          tx: initialPos.x,
          ty: scaleToY(initialPos.s),
          sx: initialPos.s,
        }
      : getTransform(minYear, maxYear)
  );

  useEffect(() => {
    if (!ref.current) return;
    const size = ref.current.getBoundingClientRect();
    setWidth(size.width);
    setHeight(size.height);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (!ref.current) return;
      const size = ref.current.getBoundingClientRect();
      setWidth(window.innerWidth);
      setHeight(size.height);
    });
  }, []);

  return (
    <div className="Timeline" ref={ref}>
      {ref.current && (
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

            console.log(scaleTop, scaleBottom);

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
                  transformToPixels={transformToPixels}
                />
                <TimeSpanGroup
                  events={events}
                  timeLeft={timeLeft}
                  timeRight={timeRight}
                  scaleTop={scaleTop}
                  scaleBottom={scaleBottom}
                  transformToPixels={transformToPixels}
                  setTransformation={setTransformation}
                />
              </svg>
            );
          }}
        </PanZoom>
      )}
    </div>
  );
}
