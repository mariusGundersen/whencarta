import React, { ReactNode } from 'react';
import logo from './logo.svg';
import './App.css';
import PanZoom from './PanZoom';
import { modelToView, Transform } from './lib/panzoom';
import { timeline } from 'console';

interface Timespan {
  start: number,
  end: number,
  label: string,
  children?: Timespan[]
}

interface MomentWithWidth {
  start: number,
  w: number,
  label: string,
  children?: MomentNode[]
}
interface MomentWithEnd {
  start: number,
  end: number,
  label: string,
  children?: MomentNode[]
}

type MomentNode = MomentWithEnd | MomentWithWidth;

const minYear = -13_800_000_000;
const maxYear = new Date().getFullYear();

const root: MomentNode = {
  start: minYear, end: maxYear, label: 'The universe exists',
  children: [
    { start: -4_600_000_000, end: -4_000_000_000, label: 'Hadean eon' },
    {
      start: -4_000_000_000, w: 1_500_000_000, label: 'Archean eon', children: [
        { start: -4_000_000_000, w: 400_000_000, label: 'Eoarchean era' },
        { start: -3_600_000_000, w: 400_000_000, label: 'Paleoarchean era' },
        { start: -3_200_000_000, w: 400_000_000, label: 'Mesoarchean era' },
        { start: -2_800_000_000, w: 300_000_000, label: 'Neoarchean era' },
      ]
    },
    {
      start: -2_500_000_000, w: 1_959_000_000, label: 'Proterozoic eon', children: [
        {
          start: -2_500_000_000, w: 900_000_000, label: 'Paleoproterozoic era', children: [
            { start: -2_500_000_000, end: -2_300_000_000, label: 'Sideran' },
            { start: -2_300_000_000, end: -2_050_000_000, label: 'Rhyacian' },
            { start: -2_050_000_000, end: -1_800_000_000, label: 'Orosirian' },
            { start: -1_800_000_000, end: -1_600_000_000, label: 'Statherian' },
          ]
        },
        {
          start: -1_600_000_000, w: 600_000_000, label: 'Mesoproterozoic era', children: [
            { start: -1_600_000_000, end: -1_400_000_000, label: 'Calymmian' },
            { start: -1_400_000_000, end: -1_200_000_000, label: 'Ectasian' },
            { start: -1_200_000_000, end: -1_000_000_000, label: 'Stenian' },
          ]
        },
        {
          start: -1_000_000_000, w: 459_000_000, label: 'Neoproterozoic era', children: [
            { start: -1_000_000_000, end: -720_000_000, label: 'Tonian' },
            { start: -720_000_000, end: -635_000_000, label: 'Cryogenian' },
            { start: -635_000_000, end: -541_000_000, label: 'Ediacaran' },
          ]
        },
      ]
    },
    {
      start: -541_000_000, w: 541_000_000, label: 'Phanerozoic eon', children: [
        {
          start: -541_000_000, w: 289_098_000, label: 'Paleozoic era', children: [
            { start: -541_000_000, end: -485_400_000, label: 'Cambrian' },
            { start: -485_400_000, end: -443_400_000, label: 'Ordovician' },
            { start: -443_400_000, end: -419_200_000, label: 'Silurian' },
            { start: -419_200_000, end: -358_900_000, label: 'Devonian' },
            { start: -358_900_000, end: -298_900_000, label: 'Carboniferous' },
            { start: -298_900_000, end: -251_902_000, label: 'Permian' },
          ]
        },
        {
          start: -251_902_000, w: 185_902_000, label: 'Mesozoic era', children: [
            { start: -251_902_000, end: -201_300_000, label: 'Triassic' },
            { start: -201_300_000, end: -145_000_000, label: 'Jurassic' },
            { start: -145_000_000, end: -66_000_000, label: 'Cretaceous' },
          ]
        },
        {
          start: -66_000_000, w: 66_000_000, label: 'Cenozoic era', children: [
            { start: -66_000_000, end: -23_030_000, label: 'Paleogene' },
            { start: -23_030_000, end: -2_580_000, label: 'Neogene' },
            {
              start: -2_580_000, end: maxYear, label: 'Quaternary', children: [
                { start: -2_580_000, end: -11_700, label: 'Pleistocene' },
                {
                  start: -11_700, end: maxYear, label: 'Holocene-1', children: [
                    {
                      start: -11_700, end: maxYear, label: 'Holocene', children: [

                      ]
                    }
                  ]
                },
              ]
            },
          ]
        },
      ]
    },
  ]
};

interface Moment {
  start: number,
  y: number,
  end: number,
  label: string
}

function flattenChildren({ children, start, label, ...m }: MomentNode, y: number): Moment[] {
  return [
    {
      start,
      label,
      end: 'end' in m ? m.end : start + m.w,
      y
    },
    ...children?.flatMap(m => flattenChildren(m, y + 1)) ?? []
  ];
}

const events = flattenChildren(root, 0);

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

const timescales = [
  { y: 0, t: 10_000_000_000, label: '10 billion' },
  { y: 1, t: 1_000_000_000, label: '1 billion' },
  { y: 2, t: 100_000_000, label: '100 million' },
  { y: 3, t: 10_000_000, label: '10 million' },
  { y: 4, t: 1_000_000, label: '1 million' },
  { y: 5, t: 100_000, label: '100 thousand' },
  { y: 6, t: 10_000, label: '10 thousand' },
  { y: 7, t: 1_000, label: 'millennium' },
  { y: 8, t: 100, label: 'century' },
  { y: 9, t: 10, label: 'decade' },
  { y: 10, t: 1, label: 'year' },
];

function App() {

  const width = 1000;
  const height = 300;

  const minZoom = width / -minYear;
  const maxZoom = 1000;

  function limit({ x, s }: Transform) {
    s = clamp(minZoom, s, maxZoom);
    x = clamp(width - maxYear * s, x, -minYear * s);
    return ({
      x,
      y: 0,
      s
    });
  };

  return (
    <div className="App">
      <PanZoom initialTransform={{ x: width, y: 0, s: minZoom }} limit={limit}>
        {(transform) => {

          const unitHeight = height / 3;

          const yOffset = Math.max(0, Math.log10(transform.s) + 7);

          const timeToX = (t: number) => transform.s * t + transform.x;
          const transformY = (y: number) => y - yOffset * unitHeight;
          const xToTime = (x: number) => (x - transform.x) / transform.s;

          const timeLeft = xToTime(0);
          const timeRight = xToTime(width);

          const resizeTimeline = ({ x, y, width, height }: { x: number, y: number, width: number, height: number }) => ({
            x: timeToX(x),
            y: transformY(y),
            width: transform.s * width,
            height: height,
          });

          return (
            <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} style={{ border: '1px solid black' }}>
              {timescales
                .filter(({ y }) => y > yOffset - 1 && y < yOffset + 1.5)
                .flatMap(({ y, t, label }) => {

                  const markers: ReactNode[] = [];
                  for (let i = Math.floor(timeLeft / t) * t, key = 0; i <= timeRight; i += t, key++) {
                    markers.push(
                      <g key={label + key} stroke="darkblue" opacity={clamp(0, 0.3 + (1 + yOffset - y) * 3, 0.9)}>
                        <line x1={timeToX(i)} x2={timeToX(i)} y1={0} y2={height} />
                        <text x={timeToX(i)} y={transformY((y + 1) * unitHeight)} textAnchor="middle" fill="white">
                          {format(i, t)}
                        </text>
                      </g>
                    );
                  }

                  return markers;
                })}
              {events
                .filter(({ y }) => y > yOffset - 1 && y < yOffset + 3)
                .filter(({ start, end }) => start < timeRight && end > timeLeft)
                .map(({ start, end, y, label }) => (
                  <React.Fragment key={label}>
                    <rect {...resizeTimeline({ width: end - start, height: unitHeight / 2, x: start, y: y * unitHeight + unitHeight / 4 })} fill="white" stroke="black" />
                    <text x={Math.max(0, timeToX(start))} y={transformY(y * unitHeight + unitHeight / 2)} dominantBaseline="middle">{label}</text>
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
