import "proposal-temporal";
import { Temporal } from "proposal-temporal";

export function yearToTime(year: number, y: number) {
  return year / 10 ** y;
}

export function yearMonthToTime(year: number, month: number) {
  return year + month / 12;
}

export function yearMonthDayToTime(
  year: number,
  month: Month = 0,
  day: Day = 0
) {
  const daysInMonth = getDaysInMonth(year, month);
  const yearFraction = 1 / 12 / daysInMonth;

  return year + month / 12 + day * yearFraction;
}

export function timeToYear(time: number, y: number) {
  return time * 10 ** y;
}

function getDaysInMonth(year: number, month: Month): number {
  // this is a dirty trick, but it works
  return new Date(year, month + 1, 0).getDate();
}

export type Month = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export type Day =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31;

export function parseDate(input: string): [number, Month, Day] {
  const { year, month, day } = Temporal.Date.from(input);

  return [year, (month - 1) as Month, (day - 1) as Day];
}
