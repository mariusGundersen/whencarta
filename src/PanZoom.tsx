import { Transform, PosPos, debouncedAnimationFrame, solve, getViewPos, viewToModel, solveSingle } from "./lib/panzoom";
import { ReactElement, useRef, useState, useCallback, HTMLAttributes } from "react";
import React from "react";

export interface Props extends HTMLAttributes<HTMLDivElement> {
  children(transform: Transform): ReactElement,
  initialTransform?: Transform,
  limit(t: Transform): Transform
}

const defaultTransform = { x: 0, y: 0, s: 1 };

export default function PanZoom({ children, style, limit, initialTransform = defaultTransform, ...props }: Props) {
  const pointers = useRef(new Map<number, PosPos>());
  const [transform, setTransform] = useState(initialTransform);
  const requestSingleAnimationFrame = useSingleAnimationFrame(() => {
    setTransform(t => solve(t, limit, ...pointers.current.values()));
  });

  const onPointerDown = useCallback((/** @type {PointerEvent} */ e) => {
    const viewPos = getViewPos(e);
    const modelPos = viewToModel(viewPos, transform);
    pointers.current.set(e.pointerId, { modelPos, viewPos });

    e.currentTarget.setPointerCapture(e.pointerId);
  }, [transform]);

  const onPointerMove = useCallback((/** @type {PointerEvent} */ e) => {
    const pointer = pointers.current.get(e.pointerId);
    if (!pointer) return;

    const viewPos = getViewPos(e);
    pointer.viewPos = viewPos;

    requestSingleAnimationFrame.current();
  }, []);

  const onPointerUp = useCallback((e) => {
    if (!pointers.current.has(e.pointerId)) return;

    pointers.current.delete(e.pointerId);
  }, []);

  const onDoubleClick = useCallback(e => {
    const viewPos = getViewPos(e);
    const modelPos = viewToModel(viewPos, transform);
    setTransform(limit(solveSingle(viewPos, modelPos, transform.s * (1.2))));

    e.preventDefault();
    e.stopPropagation();

  }, [transform]);

  const onWheel = useCallback(e => {
    const viewPos = getViewPos(e);
    const modelPos = viewToModel(viewPos, transform);
    setTransform(limit(solveSingle(viewPos, modelPos, transform.s * (1 + e.deltaY / 100))));

    e.preventDefault();
    e.stopPropagation();
  }, [transform]);

  return (
    <div
      {...props}
      style={{ ...style, touchAction: 'none' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onLostPointerCapture={onPointerUp}
      onDoubleClick={onDoubleClick}
      onWheel={onWheel}>
      {children(transform)}
    </div>
  )

}
export function useSingleAnimationFrame(func: () => void) {
  return useRef(debouncedAnimationFrame(func));
}
