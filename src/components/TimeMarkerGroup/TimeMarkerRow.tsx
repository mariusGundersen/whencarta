import React from "react";
import normalize from "../../lib/normalize";
import {
  durationToPixelWidth,
  scaleToPixelY,
  timeToPixelX,
  TransformToPixels,
} from "../../lib/panzoom";
import range from "../../lib/range";
import DayMarkerGroup from "./DayMarkerGroup";
import MonthMarker from "./MonthMarker";
import TimeMarker from "./TimeMarker";
import YearsMarker from "./YearsMarker";

export interface Props {
  scale: number;
  transform: TransformToPixels;
  timeFrom: number;
  timeTo: number;
}

export default function TimeMarkerRow({
  scale,
  timeFrom,
  timeTo,
  transform,
}: Props) {
  const height = transform.height;
  const y = scaleToPixelY(scale, transform);
  const opacity = normalize(y / height, 1, 0.9);

  if (scale < 0) {
    const delta = 10 ** -scale;
    const from = Math.floor(timeFrom / delta) * delta;
    return (
      <g opacity={opacity} data-scale={scale}>
        {range(from, timeTo, delta).map((time) => (
          <YearsMarker key={time} time={time} transform={transform} y={y} />
        ))}
      </g>
    );
  } else if (scale === 0) {
    const year = Math.floor(timeFrom);
    const dx = durationToPixelWidth(1 / 2, transform);
    return (
      <g opacity={opacity} data-scale={scale}>
        {range(year, timeTo, 1).map((time) => (
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
  } else {
    const delta = 1 / 12;
    const year = Math.floor(timeFrom);
    const month = Math.floor((timeFrom % 1) / delta);
    const from = Math.floor(timeFrom * 12) / 12;
    if (scale === 1) {
      const dx = durationToPixelWidth(delta / 2, transform);
      return (
        <g opacity={opacity}>
          {range(from, timeTo, delta).map((time, index) => (
            <MonthMarker
              key={time}
              time={time}
              transform={transform}
              dx={dx}
              y={y}
              month={month + index}
              year={year}
            />
          ))}
        </g>
      );
    } else if (scale === 2) {
      return (
        <g opacity={opacity}>
          {range(from, timeTo, delta).flatMap((time, index) => (
            <DayMarkerGroup
              key={month + index}
              year={year}
              month={month + index}
              monthTime={time}
              transform={transform}
              y={y}
              timeFrom={timeFrom}
              timeTo={timeTo}
            />
          ))}
        </g>
      );
    } else {
      return <g></g>;
    }
  }
}

const monthName = Intl.DateTimeFormat("en-US", { month: "long" });

export function formatMonth(month: number, year: number) {
  return monthName.format(new Date(year, month));
}

export function format(n: number) {
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
