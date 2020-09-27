import { TimelineMoment } from "./components/TimeSpanGroup";
import { parseDate, yearMonthDayToTime } from "./lib/time";

export const minYear = -10_000;
export const maxYear = new Date().getFullYear();

interface Momentish {
  id: string;
  start: string;
  end: string;
  label: string;
}

const momentishes: Momentish[] = [
  { id: "1", start: "1867-11-07", end: "1934-07-04", label: "Marie Curie" },
  { id: "2", start: "1642-12-25", end: "1727-03-31", label: "Isaac Newton" },
  { id: "3", start: "1707-04-15", end: "1783-09-18", label: "Leonhard Euler" },
  {
    id: "4",
    start: "1607-11-01",
    end: "1665-01-12",
    label: "Pierre de Fermat",
  },
  {
    id: "5",
    start: "1736-01-25",
    end: "1813-04-10",
    label: "Joseph Louis Lagrange",
  },
  {
    id: "6",
    start: "1646-07-01",
    end: "1716-11-14",
    label: "Gottfried Leibniz",
  },
  { id: "7", start: "1623-06-19", end: "1662-08-19", label: "Blaise Pascal" },
];

const moments = groupY(momentishes.map(toMoment));

export default function getMoments(
  scale: number,
  timeLeft: number,
  timeRight: number
): TimelineMoment[] {
  return (
    moments[scale]?.filter(
      ({ start, end }) => start < timeRight && end > timeLeft
    ) ?? []
  );
}

type MomentWithScale = TimelineMoment & {
  scale: number;
};

function groupY(list: MomentWithScale[]) {
  const result: Record<number, TimelineMoment[]> = {};
  for (const { scale, ...entry } of list) {
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

function toMoment(momentish: Momentish): MomentWithScale {
  const start = yearMonthDayToTime(...parseDate(momentish.start));
  const end = yearMonthDayToTime(...parseDate(momentish.end));
  const scale = Math.floor(-Math.log10(end - start));

  return {
    id: momentish.id,
    label: momentish.label,
    start,
    end,
    scale,
  };
}
