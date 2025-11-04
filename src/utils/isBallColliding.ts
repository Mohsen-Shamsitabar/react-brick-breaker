import type Ball from "../classes/Ball.ts";
import { type Rect } from "../classes/Rect.ts";
import clamp from "./clamp.ts";

export const CollisionDirection = {
  TOP: "TOP",
  RIGHT: "RIGHT",
  BOTTOM: "BOTTOM",
  LEFT: "LEFT",
  TOP_RIGHT: "TOP_RIGHT",
  TOP_LEFT: "TOP_LEFT",
  BOTTOM_RIGHT: "BOTTOM_RIGHT",
  BOTTOM_LEFT: "BOTTOM_LEFT",
} as const;

type CollisionDirectionType =
  (typeof CollisionDirection)[keyof typeof CollisionDirection];

const ballRectIntersect = (ball: Ball, rect: Rect) => {
  const rectBounds = rect.getBounds();

  const ballX = ball.getX();
  const ballY = ball.getY();
  const ballRadius = ball.getRadius();

  const x = clamp(rectBounds.left, ballX, rectBounds.right);
  const y = clamp(rectBounds.top, ballY, rectBounds.bottom);

  const distVectorX = x - ballX;
  const distVectorY = y - ballY;

  const distance = Math.sqrt(
    Math.pow(distVectorX, 2) + Math.pow(distVectorY, 2),
  );

  const isColliding = distance < ballRadius;

  let collisionDirection: CollisionDirectionType = CollisionDirection.BOTTOM;

  if (distVectorX === 0 && distVectorY < 0) {
    collisionDirection = CollisionDirection.BOTTOM;
  } else if (distVectorX === 0 && distVectorY > 0) {
    collisionDirection = CollisionDirection.TOP;
  } else if (distVectorX > 0 && distVectorY === 0) {
    collisionDirection = CollisionDirection.LEFT;
  } else if (distVectorX < 0 && distVectorY === 0) {
    collisionDirection = CollisionDirection.RIGHT;
  } else if (distVectorX > 0 && distVectorY > 0) {
    collisionDirection = CollisionDirection.TOP_LEFT;
  } else if (distVectorX > 0 && distVectorY < 0) {
    collisionDirection = CollisionDirection.BOTTOM_LEFT;
  } else if (distVectorX < 0 && distVectorY > 0) {
    collisionDirection = CollisionDirection.TOP_RIGHT;
  } else if (distVectorX < 0 && distVectorY < 0) {
    collisionDirection = CollisionDirection.BOTTOM_RIGHT;
  }

  return { isColliding, collisionDirection };
};

export const isBallColliding = (ball: Ball, rect: Rect) => {
  return ballRectIntersect(ball, rect);
};
