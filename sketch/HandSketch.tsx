import dynamic from "next/dynamic";
import p5Types from "p5";
import { MutableRefObject } from "react";
import { Hand } from "@tensorflow-models/hand-pose-detection";
import { getSmoothedHandpose } from "../lib/getSmoothedHandpose";
import { updateHandposeHistory } from "../lib/updateHandposeHistory";
import { Keypoint } from "@tensorflow-models/hand-pose-detection";
import { convertHandToHandpose } from "../lib/converter/convertHandToHandpose";
import { calcUnitVector } from "../lib/calculator/calcUnitVector";

type Props = {
  handpose: MutableRefObject<Hand[]>;
};

type Handpose = Keypoint[];

const Sketch = dynamic(import("react-p5"), {
  loading: () => <></>,
  ssr: false,
});

export const HandSketch = ({ handpose }: Props) => {
  let handposeHistory: {
    left: Handpose[];
    right: Handpose[];
  } = { left: [], right: [] };

  const preload = (p5: p5Types) => {
    // 画像などのロードを行う
  };

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    p5.stroke(220);
    p5.fill(255);
    p5.strokeWeight(10);
  };

  const draw = (p5: p5Types) => {
    const rawHands: {
      left: Handpose;
      right: Handpose;
    } = convertHandToHandpose(handpose.current); //平滑化されていない手指の動きを使用する
    handposeHistory = updateHandposeHistory(rawHands, handposeHistory); //handposeHistoryの更新
    const hands: {
      left: Handpose;
      right: Handpose;
    } = getSmoothedHandpose(rawHands, handposeHistory); //平滑化された手指の動きを取得する

    p5.background(1, 25, 96);
    p5.push();
    p5.translate(p5.width / 2, p5.height / 2);
    p5.noFill();
    p5.strokeWeight(1);
    const arcSize = 300;
    if (hands.left.length > 0) {
      const hand = hands.left;
      for (let i = 0; i < 4; i++) {
        const e0 = calcUnitVector({
          x: hand[4 * i + 4].x - hand[4 * i + 1].x,
          y: hand[4 * i + 4].y - hand[4 * i + 1].y,
        });
        const e1 = calcUnitVector({
          x: hand[4 * (i + 1) + 4].x - hand[4 * (i + 1) + 1].x,
          y: hand[4 * (i + 1) + 4].y - hand[4 * (i + 1) + 1].y,
        });
        const theta = Math.acos(e0.x * e1.x + e1.y * e0.y);
        p5.beginShape();
        p5.vertex(0, 0);
        p5.vertex(arcSize, 0);
        p5.vertex(arcSize * Math.cos(theta), arcSize * Math.sin(theta));
        p5.endShape(p5.CLOSE);
        p5.push();
        p5.noStroke();
        p5.fill(255);
        p5.text(
          String(Math.floor((100 * theta) / Math.PI) / 100) + "PI",
          arcSize,
          0
        );
        p5.pop();
        p5.rotate(theta);
      }
    }
    if (hands.right.length > 0) {
      const hand = hands.right;
      for (let i = 0; i < 4; i++) {
        const e0 = calcUnitVector({
          x: hand[4 * i + 4].x - hand[4 * i + 1].x,
          y: hand[4 * i + 4].y - hand[4 * i + 1].y,
        });
        const e1 = calcUnitVector({
          x: hand[4 * (i + 1) + 4].x - hand[4 * (i + 1) + 1].x,
          y: hand[4 * (i + 1) + 4].y - hand[4 * (i + 1) + 1].y,
        });
        const theta = Math.acos(e0.x * e1.x + e1.y * e0.y);
        p5.beginShape();
        p5.vertex(0, 0);
        p5.vertex(arcSize, 0);
        p5.vertex(arcSize * Math.cos(theta), arcSize * Math.sin(theta));
        p5.endShape(p5.CLOSE);
        p5.push();
        p5.noStroke();
        p5.fill(255);
        p5.text(
          String(Math.floor((100 * theta) / Math.PI) / 100) + "PI",
          arcSize,
          0
        );
        p5.pop();
        p5.rotate(theta);
      }
    }
    p5.pop();
  };

  const windowResized = (p5: p5Types) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  return (
    <>
      <Sketch
        preload={preload}
        setup={setup}
        draw={draw}
        windowResized={windowResized}
      />
    </>
  );
};
