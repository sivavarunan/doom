import React, { useEffect, useRef, useState } from 'react';
import { db } from '@/app/firebase';
import { doc, onSnapshot, updateDoc, setDoc, getDoc } from 'firebase/firestore';

interface PingPongGameProps {
  gameId: string;
  userId: string;
  opponentId: string;
}

interface GameState {
  ballX: number;
  ballY: number;
  ballSpeedX: number;
  ballSpeedY: number;
  paddle1Y: number;
  paddle2Y: number;
  scoreLeft: number;
  scoreRight: number;
  isGameOver: boolean;
  isPlaying: boolean;
}

const PingPongGame: React.FC<PingPongGameProps> = ({ gameId, userId, opponentId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = doc(db, 'games', gameId);
  const keys = useRef<{ [key: string]: boolean }>({ w: false, s: false, ArrowUp: false, ArrowDown: false });

  const [gameState, setGameState] = useState<GameState>({
    ballX: 400,
    ballY: 300,
    ballSpeedX: 5,
    ballSpeedY: 5,
    paddle1Y: 250,
    paddle2Y: 250,
    scoreLeft: 0,
    scoreRight: 0,
    isGameOver: false,
    isPlaying: false,
  });

  const createOrUpdateGame = async () => {
    const gameDoc = await getDoc(gameRef);
    if (!gameDoc.exists()) {
      await setDoc(gameRef, {
        ballX: canvasWidth / 2,
        ballY: canvasHeight / 2,
        ballSpeedX: 5,
        ballSpeedY: 5,
        paddle1Y: (canvasHeight - paddleHeight) / 2,
        paddle2Y: (canvasHeight - paddleHeight) / 2,
        scoreLeft: 0,
        scoreRight: 0,
        isGameOver: false,
        isPlaying: false,
      }).catch((error) => {
        console.error('Error creating document:', error);
      });
    }
  };

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [gameInterval, setGameInterval] = useState<NodeJS.Timeout | null>(null);

  const maxScore = 5;
  const canvasWidth = window.innerWidth * 0.8;
  const canvasHeight = window.innerHeight * 0.6;
  const paddleHeight = 100;
  const paddleWidth = 10;
  const ballRadius = 10;
  const paddleSpeed = 10;

  const resetBall = () => {
    setGameState(prevState => ({
      ...prevState,
      ballX: canvasWidth / 2,
      ballY: canvasHeight / 2,
      ballSpeedX: 5,
      ballSpeedY: 5,
    }));
  };

  const moveBall = () => {
    if (gameState.isGameOver) return;

    setGameState(prevState => {
      let newBallX = prevState.ballX + prevState.ballSpeedX;
      let newBallY = prevState.ballY + prevState.ballSpeedY;

      if (newBallY + ballRadius > canvasHeight || newBallY - ballRadius < 0) {
        prevState.ballSpeedY = -prevState.ballSpeedY;
      }

      if (
        newBallX - ballRadius < paddleWidth &&
        newBallY > prevState.paddle1Y &&
        newBallY < prevState.paddle1Y + paddleHeight
      ) {
        prevState.ballSpeedX = -prevState.ballSpeedX;
      } else if (
        newBallX + ballRadius > canvasWidth - paddleWidth &&
        newBallY > prevState.paddle2Y &&
        newBallY < prevState.paddle2Y + paddleHeight
      ) {
        prevState.ballSpeedX = -prevState.ballSpeedX;
      }

      if (newBallX - ballRadius < 0) {
        return {
          ...prevState,
          scoreRight: prevState.scoreRight + 1,
          ballX: canvasWidth / 2,
          ballY: canvasHeight / 2,
          ballSpeedX: 5,
          ballSpeedY: 5,
        };
      } else if (newBallX + ballRadius > canvasWidth) {
        return {
          ...prevState,
          scoreLeft: prevState.scoreLeft + 1,
          ballX: canvasWidth / 2,
          ballY: canvasHeight / 2,
          ballSpeedX: 5,
          ballSpeedY: 5,
        };
      }

      if (prevState.scoreLeft >= maxScore || prevState.scoreRight >= maxScore) {
        return { ...prevState, isGameOver: true };
      }

      return { ...prevState, ballX: newBallX, ballY: newBallY };
    });
  };

  const movePaddles = () => {
    if (gameState.isGameOver) return;

    setGameState(prevState => {
      const newPaddle1Y = prevState.paddle1Y;
      const newPaddle2Y = prevState.paddle2Y;

      let updatedState = { ...prevState };

      if (userId === opponentId) {
        if (keys.current.w && newPaddle1Y > 0) {
          updatedState.paddle1Y = newPaddle1Y - paddleSpeed;
        } else if (keys.current.s && newPaddle1Y < canvasHeight - paddleHeight) {
          updatedState.paddle1Y = newPaddle1Y + paddleSpeed;
        }

        if (keys.current.ArrowUp && newPaddle2Y > 0) {
          updatedState.paddle2Y = newPaddle2Y - paddleSpeed;
        } else if (keys.current.ArrowDown && newPaddle2Y < canvasHeight - paddleHeight) {
          updatedState.paddle2Y = newPaddle2Y + paddleSpeed;
        }
      }

      updateDoc(gameRef, updatedState).catch(error => {
        console.error('Error updating document:', error);
      });

      return updatedState;
    });
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

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvasWidth, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, canvasHeight);
    ctx.lineTo(canvasWidth, canvasHeight);
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.fillRect(0, gameState.paddle1Y, paddleWidth, paddleHeight);
    ctx.fillRect(canvasWidth - paddleWidth, gameState.paddle2Y, paddleWidth, paddleHeight);

    ctx.beginPath();
    ctx.arc(gameState.ballX, gameState.ballY, ballRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '30px Arial';
    ctx.fillText(gameState.scoreLeft.toString(), canvasWidth / 2 - 50, 50);
    ctx.fillText(gameState.scoreRight.toString(), canvasWidth / 2 + 20, 50);

    if (gameState.isGameOver) {
      ctx.fillText('Game Over', canvasWidth / 2 - 75, canvasHeight / 2);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    keys.current[event.key] = true;
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    keys.current[event.key] = false;
  };

  const restartGame = async () => {
    const newGameState: GameState = {
      ballX: canvasWidth / 2,
      ballY: canvasHeight / 2,
      ballSpeedX: 5,
      ballSpeedY: 5,
      paddle1Y: (canvasHeight - paddleHeight) / 2,
      paddle2Y: (canvasHeight - paddleHeight) / 2,
      scoreLeft: 0,
      scoreRight: 0,
      isGameOver: false,
      isPlaying: true,
    };

    setGameState(newGameState);
    setIsPlaying(true);

    // Update Firestore document
    try {
      await updateDoc(gameRef, newGameState as Record<string, any>);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };


  useEffect(() => {
    createOrUpdateGame();

    const unsubscribe = onSnapshot(gameRef, (doc) => {
      const data = doc.data();
      if (data) {
        setGameState(prevState => ({
          ...data as GameState
        }));
      }
    });

    return () => {
      unsubscribe();
      stopGame();
    };
  }, [gameId]);

  useEffect(() => {
    if (isPlaying) {
      const intervalId = setInterval(gameLoop, 1000 / 60);
      setGameInterval(intervalId);
    } else {
      stopGame();
    }

    return () => {
      stopGame();
    };
  }, [isPlaying, gameState]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ border: '1px solid black' }}
      />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <button onClick={restartGame} disabled={isPlaying}>
        Restart
      </button>
    </div>
  );
};

export default PingPongGame;
