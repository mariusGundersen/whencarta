import {
  parseDate,
  timeToYear,
  yearMonthDayToTime,
  yearMonthToTime,
  yearToTime,
} from "./time";

describe("yearToTime", () => {
  test("yearToTime(126, 0) == 126", () => {
    expect(yearToTime(126, 0)).toBe(126);
  });

  test("yearToTime(126, 1) == 12.6", () => {
    expect(yearToTime(126, 1)).toBe(12.6);
  });

  test("yearToTime(126, 2) == 1.26", () => {
    expect(yearToTime(126, 2)).toBe(1.26);
  });
});

describe("yearMonthToTime", () => {
  test("yearMonthToTime(1997, 0) == 1997", () => {
    expect(yearMonthToTime(1997, 0)).toBe(1997);
  });

  test("yearMonthToTime(1997, 1) == 1997.083333", () => {
    expect(yearMonthToTime(1997, 1)).toBeCloseTo(1997.083333);
  });

  test("yearMonthToTime(1997, 2) == 1997.16666", () => {
    expect(yearMonthToTime(1997, 2)).toBeCloseTo(1997.16666);
  });

  test("yearMonthToTime(1997, 11) == 1997.916666", () => {
    expect(yearMonthToTime(1997, 11)).toBeCloseTo(1997.916666);
  });
});

describe("yearMonthDayToTime", () => {
  test("yearMonthDayToTime(1997, 0, 0) == 1997", () => {
    expect(yearMonthDayToTime(1997, 0, 0)).toBe(1997);
  });

  test("yearMonthDayToTime(1997, 0, 1) == 1997.00268817", () => {
    expect(yearMonthDayToTime(1997, 0, 1)).toBeCloseTo(1997.00268817, 5);
  });

  test("yearMonthDayToTime(1997, 1, 0) == 1997.086309", () => {
    expect(yearMonthDayToTime(1997, 1, 1)).toBeCloseTo(1997.086309, 5);
  });

  test("yearMonthDayToTime(1996, 1, 0) == 1996.086206", () => {
    expect(yearMonthDayToTime(1996, 1, 1)).toBeCloseTo(1996.086206, 5);
  });
});

describe("timeToYear", () => {
  test("timeToYear(126, 0) == 126", () => {
    expect(timeToYear(126, 0)).toBe(126);
  });

  test("timeToYear(12.6, 1) == 126", () => {
    expect(timeToYear(12.6, 1)).toBe(126);
  });

  test("timeToYear(1.26, 2) == 126", () => {
    expect(timeToYear(1.26, 2)).toBe(126);
  });
});

test.each([
  ["2020-01-01", [2020, 0, 0]],
  ["2020-12-13", [2020, 11, 12]],
])("parseDate(%s) == %p", (input, output) => {
  expect(parseDate(input)).toEqual(output);
});
