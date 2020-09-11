import React, { useEffect } from "react";
import "./App.css";
import Timeline from "./components/Timeline";
import getMoments, { maxYear, minYear } from "./getMoments";
import useDebounce from "./lib/useDebounce";

export default function App() {
  const [pos, setPos] = useDebounce({ x: 0, s: 1 }, 100);

  useEffect(() => {
    window.history.replaceState(null, "", `#${pos.x}|${pos.s}`);
  }, [pos]);

  const initialPos = getInitialPos();

  return (
    <div className="app">
      <input type="search" className="search" />
      <div className="map"></div>
      <div className="info">info</div>
      <Timeline
        getMoments={getMoments}
        minYear={minYear}
        maxYear={maxYear}
        initialPos={initialPos}
        onChange={setPos}
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
