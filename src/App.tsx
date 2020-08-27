import React from 'react';
import logo from './logo.svg';
import './App.css';
import PanZoom from './PanZoom';
import { modelToView } from './lib/panzoom';

interface Timespan {
  start: number,
  end: number,
  label: string,
  children?: Timespan[]
}

const root = {
  start: -13_000_000_000, end: 2020, label: 'The universe exists',
  children: [
    { start: -4_600_000_000, w: 600_000_000, y: 1, label: 'Hadean eon', children: [] },
    {
      start: -4_000_000_000, w: 1_500_000_000, y: 1, label: 'Archean eon', children: [
        { start: -4_000_000_000, w: 400_000_000, y: 2, label: 'Eoarchean era' },
        { start: -3_600_000_000, w: 400_000_000, y: 2, label: 'Paleoarchean era' },
        { start: -3_200_000_000, w: 400_000_000, y: 2, label: 'Mesoarchean era' },
        { start: -2_800_000_000, w: 300_000_000, y: 2, label: 'Neoarchean era' },
      ]
    },
    {
      start: -2_500_000_000, w: 1_959_000_000, y: 1, label: 'Proterozoic eon', children: [
        { start: -2_500_000_000, w: 900_000_000, y: 2, label: 'Paleoproterozoic era' },
        { start: -1_600_000_000, w: 600_000_000, y: 2, label: 'Mesoproterozoic era' },
        { start: -1_000_000_000, w: 459_000_000, y: 2, label: 'Neoproterozoic era' },
      ]
    },
    {
      start: -541_000_000, w: 541_000_000, y: 1, label: 'Phanerozoic eon', children: [
        { start: -541_000_000, w: 289_098_000, y: 2, label: 'Paleozoic era' },
        { start: -251_902_000, w: 185_902_000, y: 2, label: 'Mesozoic era' },
        { start: -66_000_000, w: 66_000_000, y: 2, label: 'Cenozoic era' },

      ]
    },
  ]
};


function App() {
  const events = [
    { t: -13_000_000_000, w: 13_000_002_020, y: 0, label: 'The universe' },
    { t: -4_600_000_000, w: 600_000_000, y: 1, label: 'Hadean eon' },

    { t: -4_000_000_000, w: 1_500_000_000, y: 1, label: 'Archean eon' },

    { t: -4_000_000_000, w: 400_000_000, y: 2, label: 'Eoarchean era' },
    { t: -3_600_000_000, w: 400_000_000, y: 2, label: 'Paleoarchean era' },
    { t: -3_200_000_000, w: 400_000_000, y: 2, label: 'Mesoarchean era' },
    { t: -2_800_000_000, w: 300_000_000, y: 2, label: 'Neoarchean era' },

    { t: -2_500_000_000, w: 1_959_000_000, y: 1, label: 'Proterozoic eon' },

    { t: -2_500_000_000, w: 900_000_000, y: 2, label: 'Paleoproterozoic era' },
    { t: -1_600_000_000, w: 600_000_000, y: 2, label: 'Mesoproterozoic era' },
    { t: -1_000_000_000, w: 459_000_000, y: 2, label: 'Neoproterozoic era' },

    { t: -541_000_000, w: 541_000_000, y: 1, label: 'Phanerozoic eon' },

    { t: -541_000_000, w: 289_098_000, y: 2, label: 'Paleozoic era' },
    { t: -251_902_000, w: 185_902_000, y: 2, label: 'Mesozoic era' },
    { t: -66_000_000, w: 66_000_000, y: 2, label: 'Cenozoic era' },

    { t: 2020, y: 3, label: 'Now' },
    { t: 0, w: 2020, y: 4, label: 'The common era' },
    { t: -10_000, y: 3, label: 'The start of the holocene' },

    { t: -10_000_000_000, w: 10_000_000_000, y: 0, label: '10 billion' },
    { t: -1_000_000_000, w: 1_000_000_000, y: 1, label: '1 billion' },
    { t: -100_000_000, w: 100_000_000, y: 2, label: '100 million' },
    { t: -10_000_000, w: 10_000_000, y: 3, label: '10 million' },
    { t: -1_000_000, w: 1_000_000, y: 4, label: '1 million' },
    { t: -100_000, w: 100_000, y: 5, label: '100 thousand' },
    { t: -10_000, w: 10_000, y: 6, label: '10 thousand' },
    { t: -1_000, w: 1_000, y: 7, label: 'millenium' },
    { t: -100, w: 100, y: 8, label: 'century' },
    { t: -10, w: 10, y: 9, label: 'decade' },
    { t: -1, w: 1, y: 10, label: 'year' },
    { t: 0, w: 2_000, y: 7, label: 'The common ear' },

  ];

  return (
    <div className="App">
      <PanZoom initialTransform={{ x: 1000, y: 0, s: 1 / 13_000_000 }} limit={({ x, y, s }) => ({ x: clamp(1000 - 2020 * s, x, 13_000_000_000 * s), y: 0, s: clamp(1 / 13_000_000, s, 1_000) })}>
        {(transform) => {

          const unitHeight = 100;

          const resize = ({ x: left, y: top, width, height }: { x: number, y: number, width: number, height: number }) => ({
            x: transform.s * left + transform.x,
            y: transform.s * top + transform.y,
            width: transform.s * width,
            height: transform.s * height,
          });

          const yOffset = Math.max(0, Math.log10(transform.s) + 7);

          console.log(transform.x, yOffset);
          const timeToX = (t: number) => transform.s * t + transform.x;
          const transformY = (y: number) => y - yOffset * unitHeight;

          const resizeTimeline = ({ x, y, width, height }: { x: number, y: number, width: number, height: number }) => ({
            x: timeToX(x),
            y: transformY(y),
            width: transform.s * width,
            height: height,
          });

          return (
            <svg viewBox="0 0 1000 300" width="1000" height="300" style={{ border: '1px solid black' }}>
              {events
                .filter(({ y }) => y > yOffset - 1 && y < yOffset + 3)
                .map(({ t, w = 0, y, label }, index) => (
                  <React.Fragment key={index}>
                    <rect {...resizeTimeline({ width: w, height: unitHeight, x: t, y: y * unitHeight })} fill="white" stroke="black" />
                    <text x={timeToX(t)} y={transformY(y * unitHeight + unitHeight / 2)} dominantBaseline="middle">{label}</text>
                  </React.Fragment>
                ))}
            </svg>
          );
        }}
      </PanZoom>
    </div >
  );
}

const clamp = (min: number, x: number, max: number) => Math.min(max, Math.max(x, min));

export default App;
