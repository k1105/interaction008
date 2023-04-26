import { Keypoint } from "@tensorflow-models/hand-pose-detection";

export const calcUnitVector = (vec: Keypoint) => {
  const norm = Math.sqrt(vec.x ** 2 + vec.y ** 2);
  return { x: vec.x / norm, y: vec.y / norm };
};
