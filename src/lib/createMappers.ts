export default function createMappers(
  x: [number, number],
  y: [number, number]
) {
  const { m, c } = solveMxC(x, y);

  return [
    (x: number) => m * x + c,
    (y: number) => (y - c) / m,
  ] as const;
}

export function solveMxC(x: [number, number], y: [number, number]) {
  const m = (y[1] - y[0]) / (x[1] - x[0]);
  const c = y[0] - m * x[0];
  return { m, c };
}
