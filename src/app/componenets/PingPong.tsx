import React, { useEffect, useRef, useState } from 'react';

const PingPongGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [ballSpeed, setBallSpeed] = useState<number>(2);
  const [scoreLeft, setScoreLeft] = useState<number>(0);
  const [scoreRight, setScoreRight] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameInterval, setGameInterval] = useState<NodeJS.Timeout | null>(null);

  const maxScore = 5;
  const canvasWidth = 800;
  const canvasHeight = 600;
  const paddleHeight = 100;
  const paddleWidth = 10;
  const ballRadius = 10;
  const paddleSpeed = 10;

  // State variables for paddles and ball
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
    Enter: false,
  };

  const moveBall = () => {
    if (isGameOver) return;

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Bouncing off top and bottom walls
    if (ballY + ballRadius > canvasHeight || ballY - ballRadius < 0) {
      ballSpeedY = -ballSpeedY;
    }

    // Bouncing off paddles
    if (
      ballX - ballRadius < paddleWidth &&
      ballY > paddle1Y &&
      ballY < paddle1Y + paddleHeight
    ) {
      ballSpeedX = -ballSpeedX;
    } else if (
      ballX + ballRadius > canvasWidth - paddleWidth &&
      ballY > paddle2Y &&
      ballY < paddle2Y + paddleHeight
    ) {
      ballSpeedX = -ballSpeedX;
    }

    // Ball goes out of bounds (score condition)
    if (ballX - ballRadius < 0) {
      setScoreRight(prev => prev + 1);
      resetBall();
    } else if (ballX + ballRadius > canvasWidth) {
      setScoreLeft(prev => prev + 1);
      resetBall();
    }

    // Check for game over
    if (scoreLeft >= maxScore || scoreRight >= maxScore) {
      setIsGameOver(true);
      stopGame();
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
    
    // Top border
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
  
    // Paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(0, paddle1Y, paddleWidth, paddleHeight); // Left paddle
    ctx.fillRect(canvasWidth - paddleWidth, paddle2Y, paddleWidth, paddleHeight); // Right paddle
  
    // Ball
    if (!isGameOver) {
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.closePath();
    }
  
    // Scores
    ctx.font = '48px Arial';
    ctx.fillText(`${scoreLeft}`, canvasWidth / 4, 50);
    ctx.fillText(`${scoreRight}`, (3 * canvasWidth) / 4, 50);
  
    // Game Over screen
    if (isGameOver) {
      ctx.fillStyle = 'red';
      ctx.fillText('Game Over', canvasWidth / 2 - 150, canvasHeight / 2);
    }
  };
  

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key in keys) {
      keys[e.key] = true;
    }

    // Start the game when "Enter" is pressed
    if (e.key === 'Enter' && !isPlaying) {
      togglePlay();
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key in keys) {
      keys[e.key] = false;
    }
  };

  const togglePlay = () => {
    if (!isPlaying) {
      // Start the game
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
    ballSpeedX = newSpeed;
    ballSpeedY = newSpeed;
  };

  const restartGame = () => {
    setScoreLeft(0);
    setScoreRight(0);
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
          disabled={!isPlaying} // Disable the button until game starts
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
