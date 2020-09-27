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
];

const events = group(source.map(toGeoEvent));

export default function getGeoEvents(
  timeScale: number,
  timeFrom: number,
  timeTo: number,
  spaceScale: number,
  latFrom: number,
  latTo: number,
  lngFrom: number,
  lngTo: number
) {
  return (
    events[timeScale]?.filter(
      ({ start, end }) => start < timeTo && end > timeFrom
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

  return [
    scale,
    {
      start,
      end,
      ...source,
    },
  ];
}
