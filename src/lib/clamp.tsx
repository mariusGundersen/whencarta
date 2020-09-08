export default function clamp(min: number, x: number, max: number) {
  return Math.min(max, Math.max(x, min));
}
