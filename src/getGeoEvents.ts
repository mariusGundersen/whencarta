import extent from "geojson-extent";
import { parseDate, yearMonthDayToTime } from "./lib/time";

export interface GeoEventSource {
  readonly id: string;
  readonly start: string;
  readonly end: string;
  readonly label: string;
  readonly geoJson: GeoJSON.GeoJSON;
}

export interface GeoEvent {
  readonly id: string;
  readonly start: number;
  readonly end: number;
  readonly bbox: [number, number, number, number];
  readonly label: string;
  readonly geoJson: GeoJSON.GeoJSON;
}

const source: GeoEventSource[] = [
  {
    id: "1",
    start: "-002580-01-01",
    end: "-002560-01-01",
    label: "Khufu's pyramid build",
    geoJson: {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [31.133015, 29.980149],
            [31.133015, 29.978166],
            [31.135398, 29.978166],
            [31.135398, 29.980149],
            [31.133015, 29.980149],
          ],
        ],
      },
      properties: null,
    },
  },
  {
    id: "2",
    start: "-002286-01-01",
    end: "-002251-01-01",
    label: "Enheduanna lived",
    geoJson: {
      type: "Feature",
      properties: null,
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [46.101987, 30.963102],
            [46.10159, 30.961726],
            [46.103332, 30.960241],
            [46.105285, 30.958934],
            [46.107302, 30.958842],
            [46.108117, 30.959817],
            [46.107903, 30.961676],
            [46.105544, 30.963001],
            [46.103521, 30.963691],
            [46.101987, 30.963102],
          ],
        ],
      },
    },
  },
];

const events = group(source.map(toGeoEvent));

console.log(events);

export default function getGeoEvents(
  timeScale: number,
  timeFrom: number,
  timeTo: number,
  spaceScale: number,
  {
    north,
    south,
    east,
    west,
  }: {
    north: number;
    south: number;
    east: number;
    west: number;
  }
) {
  return (
    events[timeScale]
      ?.filter(({ start, end }) => start < timeTo && end > timeFrom)
      ?.filter(
        ({ bbox: [w, s, e, n] }) =>
          w < east && s < north && e > west && n > south
      ) ?? []
  );
}

function group(list: [number, GeoEvent][]) {
  const result: Record<number, GeoEvent[]> = {};
  for (const [scale, entry] of list) {
    const found = result[scale];
    if (found) {
      found.push(entry);
      found.sort((a, b) => a.start - b.start);
    } else {
      result[scale] = [entry];
    }
  }
  return result;
}

function toGeoEvent({
  start: startDate,
  end: endDate,
  ...source
}: GeoEventSource): [number, GeoEvent] {
  const start = yearMonthDayToTime(...parseDate(startDate));
  const end = yearMonthDayToTime(...parseDate(endDate));
  const scale = Math.floor(-Math.log10(end - start));
  const bbox = extent(source.geoJson);

  return [
    scale,
    {
      start,
      end,
      bbox,
      ...source,
    },
  ];
}
