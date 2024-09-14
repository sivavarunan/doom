import React, { useEffect, useRef, useState } from 'react';

const PingPongGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Game state and settings
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [ballSpeed, setBallSpeed] = useState<number>(2);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameInterval, setGameInterval] = useState<NodeJS.Timeout | null>(null);

  const maxScore = 5;
  const canvasWidth = 800;
  const canvasHeight = 600;
  const paddleHeight = 100;
  const paddleWidth = 10;
  const ballRadius = 10;
  const paddleSpeed = 10;

  // State for paddles, ball positions, and scores using useRef to keep these persistent
  const paddle1Y = useRef<number>((canvasHeight - paddleHeight) / 2);
  const paddle2Y = useRef<number>((canvasHeight - paddleHeight) / 2);
  const ballX = useRef<number>(canvasWidth / 2);
  const ballY = useRef<number>(canvasHeight / 2);
  const ballSpeedX = useRef<number>(ballSpeed);
  const ballSpeedY = useRef<number>(ballSpeed);
  const scoreLeft = useRef<number>(0);
  const scoreRight = useRef<number>(0);

  // Key states
  const keys = useRef<{ [key: string]: boolean }>({
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false,
  });

  const moveBall = () => {
    if (isGameOver) return;

    ballX.current += ballSpeedX.current;
    ballY.current += ballSpeedY.current;

    // Bouncing off top and bottom walls
    if (ballY.current + ballRadius > canvasHeight || ballY.current - ballRadius < 0) {
      ballSpeedY.current = -ballSpeedY.current;
    }

    // Bouncing off paddles
    if (
      ballX.current - ballRadius < paddleWidth &&
      ballY.current > paddle1Y.current &&
      ballY.current < paddle1Y.current + paddleHeight
    ) {
      ballSpeedX.current = -ballSpeedX.current;
    } else if (
      ballX.current + ballRadius > canvasWidth - paddleWidth &&
      ballY.current > paddle2Y.current &&
      ballY.current < paddle2Y.current + paddleHeight
    ) {
      ballSpeedX.current = -ballSpeedX.current;
    }

    // Ball goes out of bounds (score condition)
    if (ballX.current - ballRadius < 0) {
      scoreRight.current += 1;
      resetBall();
    } else if (ballX.current + ballRadius > canvasWidth) {
      scoreLeft.current += 1;
      resetBall();
    }

    // Check for game over
    if (scoreLeft.current >= maxScore || scoreRight.current >= maxScore) {
      setIsGameOver(true);
      stopGame();
    }
  };

  const movePaddles = () => {
    if (keys.current.w && paddle1Y.current > 0) {
      paddle1Y.current -= paddleSpeed;
    } else if (keys.current.s && paddle1Y.current < canvasHeight - paddleHeight) {
      paddle1Y.current += paddleSpeed;
    }

    if (keys.current.ArrowUp && paddle2Y.current > 0) {
      paddle2Y.current -= paddleSpeed;
    } else if (keys.current.ArrowDown && paddle2Y.current < canvasHeight - paddleHeight) {
      paddle2Y.current += paddleSpeed;
    }
  };

  const resetBall = () => {
    ballX.current = canvasWidth / 2;
    ballY.current = canvasHeight / 2;
    ballSpeedX.current = ballSpeed;
    ballSpeedY.current = ballSpeed;
  };

  const stopGame = () => {
    if (gameInterval) {
      clearInterval(gameInterval);
      setGameInterval(null);
    }
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

  const drawEverything = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Canvas background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw borders with gaps
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5; // Border thickness

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvasWidth, 0);
    ctx.stroke();

    // Bottom border
    ctx.beginPath();
    ctx.moveTo(0, canvasHeight);
    ctx.lineTo(canvasWidth, canvasHeight);
    ctx.stroke();
      // Left border with gap in the middle
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(30, 0); // Gap start
      ctx.lineTo(30, canvasHeight); // Gap end
      ctx.lineTo(0, canvasHeight);
      ctx.stroke();
    
      // Right border with gap in the middle
      ctx.beginPath();
      ctx.moveTo(canvasWidth, 0);
      ctx.lineTo(canvasWidth - 30, 0); // Gap start
      ctx.lineTo(canvasWidth - 30, canvasHeight); // Gap end
      ctx.lineTo(canvasWidth, canvasHeight);
      ctx.stroke();
    
      // Draw the vertical middle line
      ctx.strokeStyle = 'white'; // Color of the line
      ctx.lineWidth = 1; // Thin line width
      ctx.beginPath();
      ctx.moveTo(canvasWidth / 2, 0);
      ctx.lineTo(canvasWidth / 2, canvasHeight);
      ctx.stroke();
    

    // Draw the paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(0, paddle1Y.current, paddleWidth, paddleHeight); // Left paddle
    ctx.fillRect(canvasWidth - paddleWidth, paddle2Y.current, paddleWidth, paddleHeight); // Right paddle

    // Draw the ball
    if (!isGameOver) {
      ctx.beginPath();
      ctx.arc(ballX.current, ballY.current, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.closePath();
    }

    // Scores
    ctx.font = '48px Arial';
    ctx.fillText(`${scoreLeft.current}`, canvasWidth / 4, 50);
    ctx.fillText(`${scoreRight.current}`, (3 * canvasWidth) / 4, 50);

    // Game Over screen
    if (isGameOver) {
      ctx.fillStyle = 'red';
      ctx.fillText('Game Over', canvasWidth / 2 - 150, canvasHeight / 2);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key in keys.current) {
      keys.current[e.key] = true;
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key in keys.current) {
      keys.current[e.key] = false;
    }
  };

  const togglePlay = () => {
    if (!isPlaying) {
      // Resume the game
      const interval = setInterval(gameLoop, 1000 / 60); // 60 FPS
      setGameInterval(interval);
    } else {
      // Pause the game
      stopGame();
    }
    setIsPlaying(!isPlaying);
  };

  const handleBallSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = Number(e.target.value);
    setBallSpeed(newSpeed);
    ballSpeedX.current = newSpeed;
    ballSpeedY.current = newSpeed;
  };

  const restartGame = () => {
    scoreLeft.current = 0;
    scoreRight.current = 0;
    setIsGameOver(false);
    resetBall();
    if (!isPlaying) togglePlay(); // Ensure the game starts if paused
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      stopGame();
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} className="bg-black" />

      {isGameOver ? (
        <button
          onClick={restartGame}
          className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-900 rounded-3xl"
        >
          Restart Game
        </button>
      ) : (
        <button
          onClick={togglePlay}
          className="mt-4 px-4 py-2 bg-emerald-700 hover:bg-emerald-950 rounded-3xl"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      )}

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
