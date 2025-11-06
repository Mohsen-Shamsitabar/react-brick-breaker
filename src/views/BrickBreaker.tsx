import * as React from "react";
import Ball from "../classes/Ball.ts";
import Brick from "../classes/Brick.ts";
import Player from "../classes/Player.ts";
import {
  BALL_SETTINGS,
  BRICK_SETTINGS,
  PLAYER_SETTINGS,
  SCENE_SETTINGS,
} from "../settings.ts";
import {
  CollisionDirection,
  isBallColliding,
} from "../utils/isBallColliding.ts";

const BrickBreaker = () => {
  const canvasRef = React.useRef<null | HTMLCanvasElement>(null);

  const [dummyState, setDummyState] = React.useState(false);

  // init canvas
  React.useEffect(() => {
    const { current: canvas } = canvasRef;

    if (!canvas) return;

    const canvasParent = canvas.parentElement;

    if (!canvasParent) return;

    const { height: parentHeight, width: parentWidth } =
      canvasParent.getBoundingClientRect();

    canvas.width = parentWidth;
    canvas.height = parentHeight;
  }, []);

  // main logic
  React.useEffect(() => {
    const { current: canvas } = canvasRef;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    //========== GAME STATE LOGIC =========//

    let lastTime = 0;
    let isGameRunning = true;

    //========== SCENE =========//

    const {
      width: canvasWidth,
      height: canvasHeight,
      bottom: canvasBottom,
      left: canvasLeft,
      right: canvasRight,
      top: canvasTop,
    } = canvas.getBoundingClientRect();

    const playerX = canvasWidth / 2;
    const playerY = canvasHeight - PLAYER_SETTINGS.height * 2;

    const ballX = playerX;
    const ballY = playerY - PLAYER_SETTINGS.height * 5;

    //========== DATA =========//

    const initiateBricks = () => {
      const bricks: Set<Brick> = new Set();

      const rowBrickCount = Math.floor(canvasWidth / BRICK_SETTINGS.width);
      const remainingSpace = canvasWidth - rowBrickCount * BRICK_SETTINGS.width;
      const gapCount = rowBrickCount + 1;
      const gap = remainingSpace / gapCount;

      let y = 10;

      for (let row = 0; row < BRICK_SETTINGS.rows; row++) {
        let x = gap;

        for (let col = 0; col < rowBrickCount; col++) {
          const brick = new Brick({
            x,
            y,
            width: BRICK_SETTINGS.width,
            height: BRICK_SETTINGS.height,
            color: BRICK_SETTINGS.color,
          });

          bricks.add(brick);

          x = x + gap + BRICK_SETTINGS.width;
        }

        y = y + gap + BRICK_SETTINGS.height;
      }

      return bricks;
    };

    const bricks = initiateBricks();

    const initialBrickSize = bricks.size;

    const player = new Player({
      x: playerX,
      y: playerY,
      width: PLAYER_SETTINGS.width,
      height: PLAYER_SETTINGS.height,
      color: PLAYER_SETTINGS.color,
    });

    const ball = new Ball({
      x: ballX,
      y: ballY,
      radius: BALL_SETTINGS.radius,
      speed: BALL_SETTINGS.initialSpeed,
      color: BALL_SETTINGS.color,
    });

    //========== RENDERING =========//

    const renderBrickCounter = () => {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = SCENE_SETTINGS.brickCounterColor;
      ctx.font = "1rem system-ui";

      ctx.globalAlpha = 0.5;
      ctx.fillText(
        `${initialBrickSize - bricks.size} / ${initialBrickSize}`,
        canvasWidth / 2,
        canvasHeight / 2,
      );
      ctx.globalAlpha = 1;
    };

    const renderScene = () => {
      ctx.fillStyle = SCENE_SETTINGS.backgroundColor;
      ctx.beginPath();
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.closePath();
    };

    const renderBricks = () => {
      bricks.forEach(brick => brick.draw(ctx));
    };

    const renderFrame = () => {
      renderScene();
      renderBricks();
      player.draw(ctx);
      ball.draw(ctx);
      renderBrickCounter();
    };

    //========== HANDLERS =========//

    const handleRestartConfirmation = () => {
      // eslint-disable-next-line no-alert
      const response = confirm("Restart?");

      if (response) setDummyState(c => !c);
    };

    const handleGameState = () => {
      const ballY = ball.getY();
      const ballRadius = ball.getRadius();

      if (ballY + ballRadius > canvasBottom) {
        isGameRunning = false;
        return;
      }

      if (bricks.size === 0) {
        isGameRunning = false;
        return;
      }
    };

    const handleScreenCollision = () => {
      const ballX = ball.getX();
      const ballY = ball.getY();
      const ballRadius = ball.getRadius();
      const [directionX, directionY] = ball.getDirection();

      if (ballX + ballRadius > canvasRight && directionX > 0) {
        ball.rotateX();
      }

      if (ballX - ballRadius < canvasLeft && directionX < 0) {
        ball.rotateX();
      }

      if (ballY - ballRadius < canvasTop && directionY < 0) {
        ball.rotateY();
      }
    };

    const handleBallCollisionWithBricks = () => {
      const [directionX, directionY] = ball.getDirection();

      bricks.forEach(brick => {
        const { isColliding, collisionDirection } = isBallColliding(
          ball,
          brick,
        );

        if (!isColliding) return;

        bricks.delete(brick);

        switch (collisionDirection) {
          case CollisionDirection.TOP:
            if (directionY > 0) ball.rotateY();

            break;

          case CollisionDirection.BOTTOM:
            if (directionY < 0) ball.rotateY();

            break;

          case CollisionDirection.RIGHT:
            if (directionX < 0) ball.rotateY();

            break;

          case CollisionDirection.LEFT:
            if (directionX > 0) ball.rotateY();

            break;

          case CollisionDirection.BOTTOM_LEFT:
            if (directionY < 0 && directionX > 0) {
              ball.rotateY();
              ball.rotateX();
            }

            break;

          case CollisionDirection.BOTTOM_RIGHT:
            if (directionY < 0 && directionX < 0) {
              ball.rotateY();
              ball.rotateX();
            }

            break;

          case CollisionDirection.TOP_LEFT:
            if (directionY > 0 && directionX > 0) {
              ball.rotateY();
              ball.rotateX();
            }

            break;

          case CollisionDirection.TOP_RIGHT:
            if (directionY > 0 && directionX < 0) {
              ball.rotateY();
              ball.rotateX();
            }

            break;

          default:
            break;
        }
      });
    };

    const handleBallCollisionWithPlayer = () => {
      const { isColliding } = isBallColliding(ball, player);

      if (!isColliding) return;

      const ballX = ball.getX();
      const ballY = ball.getY();

      const playerX = player.getCenterX();
      const playerY = player.getCenterY();

      const distVectorX = ballX - playerX;
      const distVectorY = ballY - playerY;

      const distVectorLength = Math.sqrt(
        Math.pow(distVectorX, 2) + Math.pow(distVectorY, 2),
      );

      const normVectorX = distVectorX / distVectorLength;
      const normVectorY = distVectorY / distVectorLength;

      ball.setDirection(normVectorX, normVectorY);
    };

    const increaseBallSpeed = () => {
      const previousSpeed = ball.getSpeed();
      const newSpeed = previousSpeed + BALL_SETTINGS.incrementalSpeed;

      ball.setSpeed(newSpeed);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const { clientX } = event;

      player.MoveX(clientX);
    };

    const mainLoop = (time: number) => {
      if (lastTime <= 0) lastTime = time;

      const deltaTime = (time - lastTime) / 10;

      handleGameState();

      ball.move(deltaTime);
      handleScreenCollision();
      handleBallCollisionWithBricks();
      handleBallCollisionWithPlayer();
      increaseBallSpeed();

      ctx.reset();
      renderFrame();

      lastTime = time;

      if (!isGameRunning) {
        ball.stop();
        window.removeEventListener("pointermove", handlePointerMove);
        handleRestartConfirmation();

        return;
      }

      requestAnimationFrame(mainLoop);
    };

    const animationFrameId = requestAnimationFrame(time => mainLoop(time));

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [dummyState]);

  return <canvas ref={canvasRef}></canvas>;
};

export default BrickBreaker;
