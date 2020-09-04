
export function* generate(from: number, to: number, increment = 1) {
  for (let i = from, c = 0; i < to && c < 100; i += increment, c++) {
    yield i;
  }
}
