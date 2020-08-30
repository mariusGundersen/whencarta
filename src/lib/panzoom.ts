import { PointerEvent } from "react";

export interface Pos {
  x: number,
  y: number
};
export interface Transform {
  tx: number,
  ty: number,
  sx: number,
  sy: number
};
export interface PosPos {
  modelPos: Pos,
  viewPos: Pos
};

export function getViewPos(event: PointerEvent): Pos {
  const rect = event.currentTarget.getBoundingClientRect();

  return {
    x: event.clientX - rect.x,
    y: event.clientY - rect.y
  };
}

export function modelToView(modelPos: Pos, transform: Transform): Pos {
  return {
    x: transform.sx * modelPos.x + transform.tx,
    y: transform.sy * modelPos.y + transform.ty
  };
}

export function viewToModel(viewPos: Pos, transform: Transform): Pos {
  return {
    x: (viewPos.x - transform.tx) / transform.sx,
    y: (viewPos.y - transform.ty) / transform.sy
  };
}

export function solve(transform: Transform, limit: (t: Transform) => Transform, ...positions: PosPos[]): Transform {
  if (positions.length === 1) {
    const { viewPos, modelPos } = positions[0];

    transform = solveSingle(viewPos, modelPos);
  } else if (positions.length === 2) {
    transform = solveDouble(positions[0], positions[1]);
  } else if (positions.length > 1) {
    transform = solveMultiple(positions);
    for (const position of positions) {
      position.modelPos = viewToModel(position.viewPos, transform);
    }
  }

  transform = limit(transform);

  return transform;
}

export function translateY(viewPos: Pos, modelPos: Pos, ty: number): Transform {
  const sx = 10 ** (-ty / 100);
  return {
    tx: viewPos.x - modelPos.x * sx,
    ty,
    sx,
    sy: 100
  };
}

export function solveSingle(viewPos: Pos, modelPos: Pos): Transform {
  const ty = viewPos.y - modelPos.y * 100;
  const sx = 10 ** (-ty / 100);
  return {
    tx: viewPos.x - modelPos.x * sx,
    ty,
    sx,
    sy: 100
  };
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
  const ty = -Math.log10(sx) * 100;
  return {
    tx,
    ty,
    sx,
    sy: 100
  };
}

export function solveMultiple(positions: PosPos[]): Transform {

  // ax = b
  // ata x = atb
  // ata^-1 ata x = ata^-1 atb
  // x = ata^-1 atb

  const len = positions.length;
  let m00 = 0, m01 = 0, m02 = 0;
  let v0 = 0, v1 = 0, v2 = 0;
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
    sy: 100,
    tx: (inv01 * v0 + inv11 * v1 + inv12 * v2) / det,
    ty: (inv02 * v0 + inv12 * v1 + inv22 * v2) / det
  };
}

export function toMatrix({ tx: x, ty: y, sx: s }: Transform) {
  return `matrix(${s}, 0, 0, ${s}, ${x}, ${y})`;
}

export function debouncedAnimationFrame(func: () => void) {
  let requested = false;
  return () => {
    if (!requested) {
      requested = true;
      requestAnimationFrame(() => {
        requested = false;
        func();
      });
    }
  }
}