import React from "react";
import { modelToPixelY, timeToPixelX, TransformToPixels } from "./lib/panzoom";
import { clamp } from "./Timeline";
import TimeMarker from "./TimeMarker";

export interface Props {
  yPos: number;
  transform: TransformToPixels;
  timeFrom: number;
  timeTo: number;
}

export default function TimeMarkerRow({
  yPos,
  timeFrom,
  timeTo,
  transform,
}: Props) {
  const height = transform.height;
  const y = modelToPixelY(-yPos, transform);
  const opacity = normalize(y / height, 1, 0.9);

  if (yPos > 0) {
    const t = 10 ** yPos;
    return (
      <g opacity={opacity} data-key={yPos}>
        {[...generate(Math.floor(timeFrom / t) * t, timeTo, t)].map((time) => (
          <TimeMarker
            key={time}
            x={timeToPixelX(time, transform)}
            y={y}
            label={format(time)}
            height={height}
          />
        ))}
      </g>
    );
  } else if (yPos === 0) {
    const year = Math.floor(timeFrom);
    const dx = 0; //(1 / 2) * transform.sx * transform.width;
    return (
      <g opacity={opacity}>
        {[...generate(year, timeTo, 1)].map((time) => (
          <TimeMarker
            key={time}
            x={timeToPixelX(time, transform)}
            dx={dx}
            y={y}
            label={time}
            height={height}
          />
        ))}
      </g>
    );
  } else if (yPos === -1) {
    const t = 1 / 12;
    const year = Math.floor(timeFrom);
    const month = Math.floor((timeFrom % 1) * 12);
    const dx = 0; //(t / 2) * transform.sx * transform.width;
    return (
      <g opacity={opacity}>
        {[...generate(Math.floor(timeFrom * 12) / 12, timeTo, t)].map(
          (time, index) => (
            <TimeMarker
              key={time}
              x={timeToPixelX(time, transform)}
              dx={dx}
              y={y}
              label={formatMonth(month + index, year)}
              height={height}
            />
          )
        )}
      </g>
    );
  } else if (yPos === -2) {
    const t = 1 / 12;
    const year = Math.floor(timeFrom);
    const month = Math.floor((timeFrom % 1) * 12);
    return (
      <g opacity={opacity}>
        {[...generate(year + month / 12, timeTo, t)].flatMap((time, index) => {
          const daysInMonth = new Date(year, month + index + 1, 0).getDate();
          const dx = 0; //            (1 / 12 / daysInMonth / 2) * transform.sx * transform.width;
          return [...generate(0, daysInMonth, 1)].map((day) => (
            <TimeMarker
              key={time + (day * t) / daysInMonth}
              x={timeToPixelX(time + (day * t) / daysInMonth, transform)}
              dx={dx}
              y={y}
              label={day + 1}
              height={height}
            />
          ));
        })}
      </g>
    );
  } else {
    return <g></g>;
  }
}

function normalize(v: number, zero: number, one: number) {
  return clamp(0, (zero - v) / (zero - one), 1);
}

export function* generate(from: number, to: number, increment = 1) {
  for (let i = from, c = 0; i < to && c < 100; i += increment, c++) {
    yield i;
  }
}

const monthName = Intl.DateTimeFormat("en-US", { month: "long" });

function formatMonth(month: number, year: number) {
  return monthName.format(new Date(year, month));
}

function format(n: number) {
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) {
    return n / 1_000_000_000 + " billion";
  } else if (abs >= 1_000_000) {
    return n / 1_000_000 + " million";
  } else if (abs >= 10_000) {
    return n / 1_000 + " millennia";
  } else {
    return n;
  }
}
