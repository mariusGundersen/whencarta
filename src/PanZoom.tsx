import React, { HTMLAttributes, ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { debouncedAnimationFrame, ease, easeInOutQuad, easeOutCubic, getViewPos, PosPos, solve, Transform, translateY, viewToModel } from "./lib/panzoom";

export interface Props extends HTMLAttributes<HTMLDivElement> {
  children(transform: Transform): ReactElement,
  transformation?: Transform,
  limit(t: Transform): Transform,
  onTransform?: (pos: { x: number, s: number }) => void,
}

const defaultTransform = { tx: 0, ty: 0, sx: 1, sy: 1 };

export default function PanZoom({
  children,
  style,
  limit,
  transformation = defaultTransform,
  onTransform,
  ...props
}: Props) {
  const pointers = useRef(new Map<number, PosPos>());
  const [transform, setTransform] = useState(transformation);
  const [easing, setEasing] = useState(() => ease(transform, transform, 0));

  const startEasing = useCallback((transformation) => {
    if (transformation.tx !== transform.tx
      || transformation.ty !== transform.ty
      || transformation.sx !== transform.sx
      || transformation.sy !== transform.sy) {
      setEasing(() => ease(transform, transformation, 2_000, easeInOutQuad));
    }
  }, [transform]);

  useEffect(() => {
    startEasing(transformation);
  }, [transformation.sx, transformation.sy, transformation.tx, transformation.ty]);

  useEffect(() => {
    const start = window.performance.now();
    const frame = (d: number) => {
      const { value, done } = easing(d - start);
      setTransform(value);
      if (!done) {
        handle = requestAnimationFrame(frame);
      }
    };
    let handle = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(handle);
  }, [easing])

  const requestSingleAnimationFrame = useSingleAnimationFrame(() => {
    setTransform(t => solve(t, limit, ...pointers.current.values()));
  });

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const viewPos = getViewPos(e);
    const modelPos = viewToModel(viewPos, transform);
    pointers.current.set(e.pointerId, { modelPos, viewPos });

    e.currentTarget.setPointerCapture(e.pointerId);
  }, [transform]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const pointer = pointers.current.get(e.pointerId);
    if (!pointer) return;

    const viewPos = getViewPos(e);
    pointer.viewPos = viewPos;

    requestSingleAnimationFrame.current();
    e.preventDefault();
  }, []);

  const onPointerUp = useCallback((e) => {
    if (!pointers.current.has(e.pointerId)) return;

    pointers.current.delete(e.pointerId);
  }, []);

  const onDoubleClick = useCallback(e => {
    const viewPos = getViewPos(e);
    const modelPos = viewToModel(viewPos, transform);
    setEasing(() => ease(transform, limit(translateY(viewPos, modelPos, transform.ty - 50)), 500, easeOutCubic));

    e.preventDefault();
    e.stopPropagation();

  }, [transform, limit]);

  const onWheel = useCallback((e: React.WheelEvent) => {
    const viewPos = getViewPos(e);
    const modelPos = viewToModel(viewPos, transform);
    setTransform(limit(translateY(viewPos, modelPos, transform.ty + (e.deltaY))));

    e.preventDefault();
    e.stopPropagation();
  }, [transform, limit]);


  useEffect(() => {
    onTransform?.({ x: transform.tx, s: transform.sx });
  }, [transform.tx, transform.sx]);

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
