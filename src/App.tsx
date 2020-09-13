import React, { useEffect } from "react";
import "./App.css";
import { Map } from "./components/Map";
import Timeline from "./components/Timeline";
import getMoments, { maxYear, minYear } from "./getMoments";
import useDebounce from "./lib/useDebounce";

export default function App() {
  const [pos, setPos] = useDebounce({ lat: 0, lng: 0, zoom: 2 }, 100);
  const [time, setTime] = useDebounce({ x: 0, s: 1 }, 100);

  useEffect(() => {
    window.history.replaceState(null, "", `#${time.x}|${time.s}`);
  }, [time]);

  const initialPos = getInitialPos();

  return (
    <div className="app">
      <input type="search" className="search" />
      <Map pos={pos} onChange={setPos} />
      <div className="info">info</div>
      <Timeline
        getMoments={getMoments}
        minYear={minYear}
        maxYear={maxYear}
        initialPos={initialPos}
        onChange={setTime}
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
