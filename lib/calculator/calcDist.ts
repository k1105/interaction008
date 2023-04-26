import { Keypoint } from "@tensorflow-models/hand-pose-detection";

export const calcDist = (p0: Keypoint, p1: Keypoint) => {
  return Math.sqrt((p0.x - p1.x) ** 2 + (p0.y - p1.y) ** 2);
};
