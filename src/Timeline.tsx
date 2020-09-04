import React, { useEffect, useRef, useState } from "react";
import {
  pixelToModelY,
  pixelXToTime,
  scaleToY,
  Transform,
  TransformToPixels,
} from "./lib/panzoom";
import PanZoom from "./PanZoom";
import TimeMarkerRow, { generate } from "./TimeMarkerRow";

export interface Props {
  events: { y: number; moments: Moment[] }[];
  minYear: number;
  maxYear: number;
  initialPos?: { x: number; s: number };
  onChange?: (pos: { x: number; s: number }) => void;
}

export interface Moment {
  start: number;
  end: number;
  label: string;
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

  const minZoom = -width / minYear;
  const maxZoom = width * 366;

  function limit({ tx, ty, sx }: Transform) {
    //sx = clamp(minZoom, sx, maxZoom);
    //tx = clamp(width - maxYear * sx, tx, -minYear * sx);
    //ty = clamp(scaleToY(maxZoom), ty, scaleToY(minZoom));
    return {
      tx,
      ty,
      sx,
    };
  }

  useEffect(() => {
    if (!ref.current) return;
    const size = ref.current.getBoundingClientRect();
    setWidth(size.width);
    setHeight(size.height);
    setTransformation({
      tx: initialPos?.x ?? size.width,
      ty: scaleToY(initialPos?.s ?? minZoom),
      sx: initialPos?.s ?? minZoom,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (!ref.current) return;
      const size = ref.current.getBoundingClientRect();
      setWidth(size.width);
      setHeight(size.height);
    });
  }, []);

  const [transformation, setTransformation] = useState(() => ({
    tx: initialPos?.x ?? width,
    ty: scaleToY(initialPos?.s ?? minZoom),
    sx: initialPos?.s ?? minZoom,
  }));

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

            console.log(transform.ty, scaleTop, scaleBottom);

            return (
              <svg
                viewBox={`0 0 ${width} ${height}`}
                width={width}
                height={height}
                style={{ border: "1px solid black" }}
              >
                <g>
                  {[...generate(Math.floor(scaleTop), scaleBottom)].map(
                    (yPos) => (
                      <TimeMarkerRow
                        key={yPos}
                        yPos={-yPos}
                        transform={transformToPixels}
                        timeFrom={timeLeft}
                        timeTo={timeRight}
                      />
                    )
                  )}
                </g>
                <g>
                  {/*events
                    .filter(
                      ({ y }) => y > logDuration - 3 && y < logDuration + 1
                    )
                    .map(({ moments, y }) => (
                      <g key={y}>
                        {moments
                          .filter(
                            ({ start, end }) =>
                              start < timeRight && end > timeLeft
                          )
                          .map(({ start, end, label }) => (
                            <TimeSpan
                              key={start}
                              label={label}
                              y={3 - y}
                              transform={transformToPixels}
                              start={start}
                              end={end}
                              onClick={() =>
                                setTransformation(
                                  solveDouble(
                                    {
                                      viewPos: { x: 0, y: 0 },
                                      modelPos: { x: start, y: 0 },
                                    },
                                    {
                                      viewPos: { x: width, y: 0 },
                                      modelPos: { x: end, y: 0 },
                                    }
                                  )
                                )
                              }
                            />
                          ))}
                      </g>
                            ))*/}
                </g>
              </svg>
            );
          }}
        </PanZoom>
      )}
    </div>
  );
}

export const clamp = (min: number, x: number, max: number) =>
  Math.min(max, Math.max(x, min));
