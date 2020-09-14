import React, { useEffect, useState } from "react";
import "./App.css";
import { Map } from "./components/Map";
import Timeline from "./components/Timeline";
import { MomentScale } from "./components/TimeSpanGroup";
import getMoments, { maxYear, minYear } from "./getMoments";
import range from "./lib/range";
import useDebounce from "./lib/useDebounce";

export default function App() {
  const [pos, setPos] = useDebounce({ lat: 0, lng: 0, zoom: 2 }, 100);
  const [time, setTime] = useDebounce({ x: 0, s: 1 }, 100);

  useEffect(() => {
    window.history.replaceState(null, "", `#${time.x}|${time.s}`);
  }, [time]);

  const initialPos = getInitialPos();

  const [moments, setMoments] = useState<MomentScale[]>([]);
  const [timelineBounds, setTimelineBounds] = useState({
    minScale: 0,
    maxScale: 0,
    fromTime: 0,
    toTime: 0,
  });
  const [mapBounds, setMapBounds] = useState({
    north: 0,
    east: 0,
    south: 0,
    west: 0,
  });

  useEffect(() => {
    const { minScale, maxScale, fromTime, toTime } = timelineBounds;
    const scales = range(Math.floor(minScale), maxScale);
    const moments = scales.map((scale) => ({
      scale,
      moments: getMoments(scale, fromTime, toTime),
    }));
    setMoments(moments);
  }, [timelineBounds]);

  return (
    <div className="app">
      <input type="search" className="search" />
      <Map pos={pos} onChange={setPos} onBoundsChange={setMapBounds} />
      <div className="info">info</div>
      <Timeline
        moments={moments}
        minYear={minYear}
        maxYear={maxYear}
        initialPos={initialPos}
        onBoundsChange={setTimelineBounds}
      />
    </div>
  );
}

function getInitialPos(): { x: number; s: number } | undefined {
  const result = /^#(.*)\|(.*)$/.exec(document.location.hash);
  if (result) {
    const x = parseFloat(result[1]);
    const s = parseFloat(result[2]);
    return { x: x || 0, s: s || 1 };
  }
}
