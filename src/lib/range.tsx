import generate from "./generate";

export default function range(from: number, to: number, increment = 1) {
  return [...generate(from, to, increment)];
}
