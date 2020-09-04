import createMappers, { solveMxC } from "./createMappers";


test('createMappers simple', () => {
  const [ xToY, yToX ] = createMappers(
    [0, 1], 
    [0, 1]
  );

  expect(xToY(0)).toBe(0);
  expect(yToX(1)).toBe(1);
});


test('createMappers width', () => {
  const x = 5;
  const W = 1200;
  const [ xToY, yToX ] = createMappers(
    [-x, x], 
    [0, W]
  );

  expect(xToY(0)).toBe(W/2);
  expect(yToX(0)).toBe(-x);
});

test('createMappers centered', () => {
  const {m, c} = solveMxC(
    [-1, 1], 
    [0, 1]
  );

  expect(m).toBe(1/2);
  expect(c).toBe(1/2);
});