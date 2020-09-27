import React, { useEffect, useState } from "react";
import "./App.css";
import { Feature, Map } from "./components/Map";
import Timeline from "./components/Timeline";
import { TimelineScaleMoments } from "./components/TimeSpanGroup";
import getGeoEvents from "./getGeoEvents";
import { maxYear, minYear } from "./getMoments";
import range from "./lib/range";
import useDebounce from "./lib/useDebounce";

export default function App() {
  const pos = { lat: 0, lng: 0, zoom: 2 };
  const [time, setTime] = useState({ x: 0, s: 1 });

  const initialPos = getInitialPos();

  const [moments, setMoments] = useState<TimelineScaleMoments[]>([]);
  const [geoFeatures, setGeoFeatures] = useState<Feature[]>([]);
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
      moments: getGeoEvents(scale, fromTime, toTime, 1, mapBounds),
    }));
    setMoments(moments);
    setGeoFeatures(moments.flatMap(({ moments }) => moments));
  }, [mapBounds, timelineBounds]);

  const delayedTime = useDebounce(time, 500);

  useEffect(() => {
    setInitialPos(delayedTime.x, delayedTime.s);
  }, [delayedTime.s, delayedTime.x]);

  return (
    <div className="app">
      <input type="search" className="search" />
      <Map pos={pos} onBoundsChange={setMapBounds} features={geoFeatures} />
      <div className="info">info</div>
      <Timeline
        moments={moments}
        minYear={minYear}
        maxYear={maxYear}
        initialPos={initialPos}
        onBoundsChange={setTimelineBounds}
        onPosChange={setTime}
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

function setInitialPos(x: number, s: number) {
  window.history.replaceState(null, "", `#${x}|${s}`);
}
