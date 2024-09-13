import React, { useEffect, useRef, useState } from 'react';

const PingPongGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [ballSpeed, setBallSpeed] = useState<number>(2);
  const [gameInterval, setGameInterval] = useState<NodeJS.Timeout | null>(null);

  const canvasWidth = 800;
  const canvasHeight = 600;
  const paddleHeight = 100;
  const paddleWidth = 10;
  const ballRadius = 10;
  const paddleSpeed = 10;

  let paddle1Y = (canvasHeight - paddleHeight) / 2;
  let paddle2Y = (canvasHeight - paddleHeight) / 2;
  let ballX = canvasWidth / 2;
  let ballY = canvasHeight / 2;
  let ballSpeedX = ballSpeed;
  let ballSpeedY = ballSpeed;

  // Key states
  const keys: { [key: string]: boolean } = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false,
  };

  const drawEverything = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Canvas background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(0, paddle1Y, paddleWidth, paddleHeight); // Left paddle
    ctx.fillRect(canvasWidth - paddleWidth, paddle2Y, paddleWidth, paddleHeight); // Right paddle

    // Ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
  };

  const moveBall = () => {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Bouncing off top and bottom walls
    if (ballY + ballRadius > canvasHeight || ballY - ballRadius < 0) {
      ballSpeedY = -ballSpeedY;
    }

    // Bouncing off paddles
    if (
      ballX - ballRadius < paddleWidth && // Left paddle
      ballY > paddle1Y &&
      ballY < paddle1Y + paddleHeight
    ) {
      ballSpeedX = -ballSpeedX;
    } else if (
      ballX + ballRadius > canvasWidth - paddleWidth && // Right paddle
      ballY > paddle2Y &&
      ballY < paddle2Y + paddleHeight
    ) {
      ballSpeedX = -ballSpeedX;
    }

    // Ball goes out of bounds (score condition)
    if (ballX - ballRadius < 0 || ballX + ballRadius > canvasWidth) {
      resetBall();
    }
  };

  const movePaddles = () => {
    if (keys.w && paddle1Y > 0) {
      paddle1Y -= paddleSpeed;
    } else if (keys.s && paddle1Y < canvasHeight - paddleHeight) {
      paddle1Y += paddleSpeed;
    }

    if (keys.ArrowUp && paddle2Y > 0) {
      paddle2Y -= paddleSpeed;
    } else if (keys.ArrowDown && paddle2Y < canvasHeight - paddleHeight) {
      paddle2Y += paddleSpeed;
    }
  };

  const resetBall = () => {
    ballX = canvasWidth / 2;
    ballY = canvasHeight / 2;
    ballSpeedX = ballSpeed;
    ballSpeedY = ballSpeed;
  };

  const gameLoop = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      moveBall();
      movePaddles();
      drawEverything(ctx);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key in keys) {
      keys[e.key] = true;
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key in keys) {
      keys[e.key] = false;
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      if (gameInterval) {
        clearInterval(gameInterval);
        setGameInterval(null);
      }
    } else {
      const interval = setInterval(gameLoop, 1000 / 60);
      setGameInterval(interval);
    }
    setIsPlaying(!isPlaying);
  };

  const handleBallSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = Number(e.target.value);
    setBallSpeed(newSpeed);
    ballSpeedX = newSpeed;
    ballSpeedY = newSpeed;
  };

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(gameLoop, 1000 / 60); // 60 FPS
      setGameInterval(interval);

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
        if (gameInterval) {
          clearInterval(gameInterval);
        }
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [isPlaying]);

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} className="bg-black" />

      <button
        onClick={togglePlay}
        className="mt-4 px-4 py-2 bg-emerald-700 hover:bg-emerald-950 rounded-3xl"
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>

      <div className="mt-4">
        <label className="text-white">
          Ball Speed: {ballSpeed}
          <input
            type="range"
            min="1"
            max="10"
            value={ballSpeed}
            onChange={handleBallSpeedChange}
            className="ml-2"
          />
        </label>
      </div>
    </div>
  );
};

export default PingPongGame;
