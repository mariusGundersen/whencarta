import React, {
  HTMLAttributes,
  MouseEvent,
  PointerEvent,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  WheelEvent,
} from "react";
import {
  debouncedAnimationFrame,
  ease,
  easeInOutQuad,
  easeOutCubic,
  getViewPos,
  PosPos,
  solve,
  Transform,
  translateY,
  viewToModel,
} from "../lib/panzoom";

export interface Props extends HTMLAttributes<HTMLDivElement> {
  children(transform: Transform): ReactElement;
  transformation?: Transform;
  limit(t: Transform): Transform;
  onTransform?: (pos: { x: number; s: number }) => void;
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
  const requestSingleAnimationFrame = useSingleAnimationFrame();

  const startEasing = useCallback(
    (transformation) => {
      if (
        transformation.tx !== transform.tx ||
        transformation.ty !== transform.ty ||
        transformation.sx !== transform.sx
      ) {
        setEasing(() => ease(transform, transformation, 500, easeInOutQuad));
      }
    },
    [transform]
  );

  const updateDrag = useCallback(() => {
    setTransform((t) => solve(t, limit, ...pointers.current.values()));
  }, [limit]);

  useEffect(() => {
    startEasing(limit(transformation));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transformation]);

  useEffect(() => {
    const start = window.performance.now();
    const frame = (d: number) => {
      const { value, done } = easing(d - start);
      setTransform(value);
      if (!done) {
        cancelAnimationFrame = requestSingleAnimationFrame.current(frame);
      }
    };
    let cancelAnimationFrame = requestSingleAnimationFrame.current(frame);
    return cancelAnimationFrame;
  }, [easing, requestSingleAnimationFrame]);

  const onPointerDown = useCallback(
    (e: PointerEvent) => {
      const viewPos = getViewPos(e);
      const modelPos = viewToModel(viewPos, transform);
      pointers.current.set(e.pointerId, { modelPos, viewPos });

      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [transform]
  );

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      const pointer = pointers.current.get(e.pointerId);
      if (!pointer) return;

      const viewPos = getViewPos(e);
      pointer.viewPos = viewPos;

      requestSingleAnimationFrame.current(updateDrag);
      e.preventDefault();
      e.stopPropagation();
    },
    [requestSingleAnimationFrame, updateDrag]
  );

  const onPointerUp = useCallback((e: PointerEvent) => {
    if (pointers.current.has(e.pointerId)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  const onLostPointer = useCallback((e: PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;

    pointers.current.delete(e.pointerId);
  }, []);

  const onDoubleClick = useCallback(
    (e: MouseEvent) => {
      const viewPos = getViewPos(e);
      const modelPos = viewToModel(viewPos, transform);
      setEasing(() =>
        ease(
          transform,
          limit(translateY(viewPos, modelPos, transform.ty - 50)),
          500,
          easeOutCubic
        )
      );

      e.preventDefault();
      e.stopPropagation();
    },
    [transform, limit]
  );

  const onWheel = useCallback(
    (e: WheelEvent) => {
      const viewPos = getViewPos(e);
      const modelPos = viewToModel(viewPos, transform);
      setTransform(
        limit(translateY(viewPos, modelPos, transform.ty + e.deltaY))
      );

      e.preventDefault();
      e.stopPropagation();
    },
    [transform, limit]
  );

  useEffect(() => {
    onTransform?.({ x: transform.tx, s: transform.sx });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transform.tx, transform.sx]);

  return (
    <div
      {...props}
      style={{ ...style, touchAction: "none" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUpCapture={onPointerUp}
      onLostPointerCapture={onLostPointer}
      onDoubleClick={onDoubleClick}
      onWheel={onWheel}
    >
      {children(transform)}
    </div>
  );
}
export function useSingleAnimationFrame() {
  return useRef(debouncedAnimationFrame());
}
