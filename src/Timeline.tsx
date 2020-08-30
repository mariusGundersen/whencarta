import React, { ReactNode, useEffect, useRef, useState } from "react";
import { modelToView, Transform } from "./lib/panzoom";
import PanZoom from "./PanZoom";

export interface Props {
  events: Moment[],
  minYear: number,
  maxYear: number
}

export interface Moment {
  start: number,
  y: number,
  end: number,
  label: string
}

export default function Timeline({ events, minYear, maxYear }: Props) {

  const ref = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(1000);
  const [height, setHeight] = useState(300);

  const minZoom = width / -minYear;
  const maxZoom = 1000;

  function limit({ tx, ty, sx, sy }: Transform) {
    sx = clamp(minZoom, sx, maxZoom);
    tx = clamp(width - maxYear * sx, tx, -minYear * sx);
    ty = clamp(-Math.log10(maxZoom) * 100, ty, -Math.log10(minZoom) * 100);
    return ({
      tx,
      ty,
      sx,
      sy
    });
  };

  useEffect(() => {
    if (!ref.current) return;
    const size = ref.current.getBoundingClientRect();
    setWidth(size.width);
    setHeight(size.height);
  }, []);

  return (
    <div className="Timeline" ref={ref}>
      {ref.current && <PanZoom initialTransform={{ tx: width, ty: -Math.log10(minZoom) * 100, sx: minZoom, sy: 100 }} limit={limit}>
        {(transform) => {

          const unitHeight = height / 3;

          const yOffset = Math.max(0, Math.log10(transform.sx) + 7);

          const timeToX = (t: number) => transform.sx * t + transform.tx;
          const transformY = (y: number) => transform.sy * y + transform.ty;
          const xToTime = (x: number) => (x - transform.tx) / transform.sx;

          const timeLeft = xToTime(0);
          const timeRight = xToTime(width);

          console.log(transform, yOffset, timeLeft, timeRight);

          const resizeTimeline = ({ x, y, width, height }: { x: number, y: number, width: number, height: number }) => ({
            x: timeToX(x),
            y: transformY(y),
            width: transform.sx * width,
            height: transform.sy * height,
          });

          return (
            <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} style={{ border: '1px solid black' }}>
              {[...generate(Math.floor(yOffset), yOffset + 1.5)]
                .flatMap((y) => {
                  const t = 10_000_000_000 / (10 ** y);
                  const markers: ReactNode[] = [];
                  for (let x = Math.floor(timeLeft / t) * t, key = 0; x <= timeRight && key < 100; x += t, key++) {
                    const viewPos = modelToView({ x, y: y - 6 }, transform);
                    markers.push(
                      <g key={y + '-' + key} stroke="darkblue" opacity={clamp(0, 0.3 + (1 + yOffset - y) * 3, 0.9)}>
                        <line x1={viewPos.x} x2={viewPos.x} y1={0} y2={height} />
                        <text x={viewPos.x} y={viewPos.y} textAnchor="middle" fill="white">
                          {format(x, t)}
                        </text>
                      </g>
                    );
                  }

                  return markers;
                })}
              {events
                .filter(({ y }) => y > yOffset - 1 && y < yOffset + 3)
                .filter(({ start, end }) => start < timeRight && end > timeLeft)
                .map(({ start, end, y, label }) => {

                  return (
                    <React.Fragment key={label}>
                      <rect
                        {...resizeTimeline({
                          x: start,
                          y: y + 1 / 4 - 7,
                          width: end - start,
                          height: 1 / 2,
                        })}
                        fill="white"
                        stroke="black" />
                      <text
                        x={Math.max(0, timeToX(start))}
                        y={transformY(y + 1 / 2 - 7)}
                        dominantBaseline="middle">
                        {label}
                      </text>
                    </React.Fragment>
                  );
                })}
            </svg>
          );
        }}
      </PanZoom>}
    </div >
  );
}


function format(n: number, t: number) {
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) {
    return n / 1_000_000_000 + ' billion';
  } else if (abs >= 1_000_000) {
    return n / 1_000_000 + ' million';
  } else if (abs >= 10_000) {
    return n / 1_000 + ' millennia';
  } else {
    return n;
  }
}


function* generate(from: number, to: number) {
  console.log('generate', from, to);
  for (let i = from; i < to; i++) {
    yield i;
  }
}

const clamp = (min: number, x: number, max: number) => Math.min(max, Math.max(x, min));
