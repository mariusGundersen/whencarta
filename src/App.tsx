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

  ];

  return (
    <div className="App">
      <PanZoom initialTransform={{ x: 996.5912195703338, y: 232.03595308441666, s: 7.618320004039853e-8 }}>
        {(transform) => {

          const resize = ({ x: left, y: top, width, height }: { x: number, y: number, width: number, height: number }) => ({
            x: transform.s * left + transform.x,
            y: transform.s * top + transform.y,
            width: transform.s * width,
            height: transform.s * height,
          });
          const resizeTimeline = ({ x: left, y: top, width, height }: { x: number, y: number, width: number, height: number }) => ({
            x: transform.s * left + transform.x,
            y: top,
            width: transform.s * width,
            height: height,
          });
          const timeToX = (t: number) => transform.s * t + transform.x;

          return (
            <svg viewBox="0 0 1000 1000" width="1000" height="1000" style={{ border: '1px solid black' }}>
              {events.map(({ t, w = 0, y, label }, index) => (
                <React.Fragment key={index}>
                  <rect {...resizeTimeline({ width: w, height: 25, x: t, y: y * 25 })} fill="white" stroke="black" />
                  <text x={timeToX(t)} y={y * 25 + 12.5} dominantBaseline="middle">{label}</text>
                </React.Fragment>
              ))}
            </svg>
          );
        }}
      </PanZoom>
    </div >
  );
}

export default App;
