import React from 'react';
import './App.css';
import Timeline, { Moment } from './Timeline';

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


function App() {

  return <div className="app">
    <input type="search" className="search" />
    <div className="map">

    </div>
    <div className="info">
      info
    </div>
    <Timeline events={events} minYear={minYear} maxYear={maxYear} />
  </div>
}




export default App;
