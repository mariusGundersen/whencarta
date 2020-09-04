import { clamp } from "./clamp";
export function normalize(v: number, zero: number, one: number) {
  return clamp(0, (zero - v) / (zero - one), 1);
}
