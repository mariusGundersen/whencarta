import clamp from "./clamp";
export default function normalize(v: number, zero: number, one: number) {
  return clamp(0, (zero - v) / (zero - one), 1);
}
