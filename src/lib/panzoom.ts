import { PointerEvent, WheelEvent } from "react";
import createMappers from "./createMappers";

export interface Pos {
  x: number;
  y: number;
}

export interface Transform {
  readonly tx: number;
  readonly ty: number;
  readonly sx: number;
}

export interface TransformToPixels extends Transform {
  readonly width: number;
  readonly height: number;
}

export interface PosPos {
  modelPos: Pos;
  viewPos: Pos;
}

export function yToScale(y: number) {
  return 10 ** -y;
}

export function scaleToY(s: number) {
  return -Math.log10(s);
}

const [yToPixelY, yToViewY] = createMappers([-0.5, 1.1], [0, 1]);
const [xToPixelX, xToViewX] = createMappers([-1.2, 1.2], [0, 1]);

export function getViewPos(event: PointerEvent | WheelEvent): Pos {
  const rect = event.currentTarget.getBoundingClientRect();

  return {
    x: xToViewX((event.clientX - rect.x) / rect.width),
    y: yToViewY((event.clientY - rect.y) / rect.height),
  };
}

export { xToViewX as pixelXToView };

export function timeToX(time: number, { sx, tx }: Transform): number {
  return sx * time + tx;
}

export function timeToPixelX(
  time: number,
  transform: TransformToPixels
): number {
  return xToPixelX(timeToX(time, transform)) * transform.width;
}

export function modelToViewY(y: number, { ty }: Transform): number {
  return y + ty;
}

export function modelToPixelY(y: number, transform: TransformToPixels): number {
  return yToPixelY(modelToViewY(y, transform)) * transform.height;
}

export function xToTime(x: number, transform: Transform): number {
  return (x - transform.tx) / transform.sx;
}

export function pixelXToTime(x: number, transform: TransformToPixels): number {
  return xToTime(xToViewX(x / transform.width), transform);
}

export function viewToModelY(y: number, { ty }: Transform): number {
  return y - ty;
}

export function pixelToModelY(y: number, transform: TransformToPixels): number {
  return viewToModelY(yToViewY(y / transform.height), transform);
}

export function modelToView(modelPos: Pos, transform: Transform): Pos {
  return {
    x: timeToX(modelPos.x, transform),
    y: modelToViewY(modelPos.y, transform),
  };
}

export function viewToModel(viewPos: Pos, transform: Transform): Pos {
  return {
    x: xToTime(viewPos.x, transform),
    y: viewPos.y - transform.ty,
  };
}

export function solve(
  transform: Transform,
  limit: (t: Transform) => Transform,
  ...positions: PosPos[]
): Transform {
  if (positions.length === 1) {
    const { viewPos, modelPos } = positions[0];

    transform = solveSingle(viewPos, modelPos);
  } else if (positions.length === 2) {
    transform = solveDouble(positions[0], positions[1]);
  } else if (positions.length > 1) {
    transform = solveMultiple(positions);
  }

  for (const position of positions) {
    position.modelPos = viewToModel(position.viewPos, transform);
  }

  transform = limit(transform);

  return transform;
}

export function translateY(viewPos: Pos, modelPos: Pos, ty: number): Transform {
  const sx = yToScale(ty);
  return {
    tx: viewPos.x - modelPos.x * sx,
    ty,
    sx,
  };
}

export function solveSingle(viewPos: Pos, modelPos: Pos): Transform {
  const ty = viewPos.y - modelPos.y;
  const sx = yToScale(ty);
  return {
    tx: viewPos.x - modelPos.x * sx,
    ty,
    sx,
  };
}

export function getTransform(start: number, end: number): Transform {
  return solveDouble(
    {
      viewPos: { x: xToViewX(0), y: 0 },
      modelPos: {
        x: start,
        y: 0,
      },
    },
    {
      viewPos: { x: xToViewX(1), y: 0 },
      modelPos: { x: end, y: 0 },
    }
  );
}

export function solveDouble(a: PosPos, b: PosPos): Transform {
  // a.vx = a.mx*sx + tx
  // b.vx = b.mx*sx + tx

  // tx = a.vx - a.mx*sx
  // b.vx - b.mx*sx = a.vx - a.mx*sx
  // b.vx - a.vx = b.mx*sx - a.mx*sx
  // sx = (b.vx - a.vx) / (b.mx - a.mx)

  const sx = (b.viewPos.x - a.viewPos.x) / (b.modelPos.x - a.modelPos.x);
  const tx = a.viewPos.x - a.modelPos.x * sx;
  const ty = scaleToY(sx);
  return {
    tx,
    ty,
    sx,
  };
}

export function solveMultiple(positions: PosPos[]): Transform {
  // ax = b
  // ata x = atb
  // ata^-1 ata x = ata^-1 atb
  // x = ata^-1 atb

  const len = positions.length;
  let m00 = 0,
    m01 = 0,
    m02 = 0;
  let v0 = 0,
    v1 = 0,
    v2 = 0;
  for (const { viewPos, modelPos } of positions) {
    m00 += modelPos.x ** 2 + modelPos.y ** 2;
    m01 += modelPos.x;
    m02 += modelPos.y;
    v0 += viewPos.x * modelPos.x + viewPos.y * modelPos.y;
    v1 += viewPos.x;
    v2 += viewPos.y;
  }

  //       [m00  m01  m02]
  // ata = [m01  len    0]
  //       [m02    0  len]
  //
  //       [v0]
  // atb = [v1]
  //       [v2]

  const det = m00 * len ** 2 - len * m01 ** 2 - len * m02 ** 2;
  const inv00 = len ** 2;
  const inv01 = -len * m01;
  const inv02 = -len * m02;
  const inv12 = m01 * m02;
  const inv11 = len * m00 - m02 ** 2;
  const inv22 = len * m00 - m01 ** 2;

  //            1   [inv00  inv01  inv02]
  // ata^-1 = ----- [inv01  inv11  inv12]
  //           det  [inv02  inv12  inv22]

  return {
    sx: (inv00 * v0 + inv01 * v1 + inv02 * v2) / det,
    tx: (inv01 * v0 + inv11 * v1 + inv12 * v2) / det,
    ty: (inv02 * v0 + inv12 * v1 + inv22 * v2) / det,
  };
}

export function toMatrix({ tx: x, ty: y, sx: s }: Transform) {
  return `matrix(${s}, 0, 0, ${s}, ${x}, ${y})`;
}

export function debouncedAnimationFrame() {
  let savedFunc: undefined | ((d: number) => void);
  let savedCancel: () => void;
  return (func: (d: number) => void): (() => void) => {
    if (savedFunc) {
      savedFunc = func;
      return savedCancel;
    }

    savedFunc = func;
    const id = requestAnimationFrame((d) => {
      let func = savedFunc;
      savedFunc = undefined;
      func!(d);
    });

    savedCancel = () => {
      savedFunc = undefined;
      cancelAnimationFrame(id);
    };
    return savedCancel;
  };
}

export type Easing<T extends string> = (
  d: number
) => { value: Record<T, number>; done: boolean };

export function ease<T extends string>(
  start: Record<T, number>,
  end: Record<T, number>,
  duration: number,
  ease: (v: number) => number = (x) => x
): Easing<T> {
  const diff: [T, number][] = Object.keys(end).map(
    (k) => [k, end[k as T] - start[k as T]] as [T, number]
  );

  return (d: number) => {
    const now = ease(Math.min(1, d / duration));
    return {
      value: (Object.fromEntries(
        diff.map(([k, v]) => [k, v * now + start[k]])
      ) as unknown) as Record<T, number>,
      done: now >= 1,
    };
  };
}

export function easeInOutQuad(x: number): number {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

export function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}
