import React, { useEffect, useRef, useState } from "react";
import { solveDouble, Transform, TransformToPixels, xToTime } from "./lib/panzoom";
import PanZoom from "./PanZoom";
import TimeMarkerRow, { generate } from "./TimeMarkerRow";
import TimeSpan from "./TimeSpan";

export interface Props {
  events: { y: number, moments: Moment[] }[],
  minYear: number,
  maxYear: number,
  initialPos?: { x: number, s: number },
  onChange?: (pos: { x: number, s: number }) => void,
}

export interface Moment {
  start: number,
  end: number,
  label: string
}

export default function Timeline({
  events,
  minYear,
  maxYear,
  initialPos,
  onChange
}: Props) {

  const ref = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(1000);
  const [height, setHeight] = useState(300);

  const minZoom = -width / minYear;
  const maxZoom = width * 366;

  function limit({ tx, ty, sx }: Transform) {
    //sx = clamp(minZoom, sx, maxZoom);
    //tx = clamp(width - maxYear * sx, tx, -minYear * sx);
    //ty = clamp(-Math.log10(maxZoom) / 3, ty, -Math.log10(minZoom) / 3);
    return ({
      tx,
      ty,
      sx,
    });
  };

  useEffect(() => {
    if (!ref.current) return;
    const size = ref.current.getBoundingClientRect();
    setWidth(size.width);
    setHeight(size.height);
    setTransformation({
      tx: initialPos?.x ?? size.width,
      ty: -Math.log10(initialPos?.s ?? minZoom) / 3,
      sx: initialPos?.s ?? minZoom,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener('resize', () => {
      if (!ref.current) return;
      const size = ref.current.getBoundingClientRect();
      setWidth(size.width);
      setHeight(size.height);
    });
  }, [])

  const [transformation, setTransformation] = useState(() => ({
    tx: initialPos?.x ?? width,
    ty: -Math.log10(initialPos?.s ?? minZoom) / 3,
    sx: initialPos?.s ?? minZoom,
  }));

  return (
    <div className="Timeline" ref={ref}>
      {ref.current && <PanZoom transformation={transformation} limit={limit} onTransform={onChange}>
        {(transform) => {
          const transformToPixels: TransformToPixels = {
            ...transform,
            width,
            height
          };
          const timeLeft = xToTime(-0.5, transform);
          const timeRight = xToTime(0.5, transform);
          const duration = timeRight - timeLeft;
          const logDuration = Math.log10(duration);

          console.log(logDuration);

          return (
            <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} style={{ border: '1px solid black' }}>
              <g>
                {[...generate(Math.max(-2, Math.floor(logDuration-0.5)), logDuration + 2.5)]
                  .map((yPos) => <TimeMarkerRow key={yPos} yPos={yPos} transform={transformToPixels} timeFrom={timeLeft} timeTo={timeRight} />)}
              </g>
              <g>
                {events
                  .filter(({ y }) => y > logDuration - 3 && y < logDuration + 1)
                  .map(({ moments, y }) => (
                    <g key={y}>
                      {moments
                        .filter(({ start, end }) => start < timeRight && end > timeLeft)
                        .map(({ start, end, label }) => (
                          <TimeSpan
                            key={start}
                            label={label}
                            y={3 - y}
                            transform={transformToPixels}
                            start={start}
                            end={end}
                            onClick={() => setTransformation(solveDouble(
                              {
                                viewPos: { x: 0, y: 0 },
                                modelPos: { x: start, y: 0 }
                              },
                              {
                                viewPos: { x: width, y: 0 },
                                modelPos: { x: end, y: 0 }
                              }
                            ))} />)
                        )}
                    </g>
                  ))}
              </g>
            </svg>
          );
        }}
      </PanZoom>}
    </div >
  );
}

export const clamp = (min: number, x: number, max: number) => Math.min(max, Math.max(x, min));
