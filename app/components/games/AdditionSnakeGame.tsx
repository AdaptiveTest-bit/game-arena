'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { useAdditionSnakeStore } from '../../store/useAdditionSnakeStore';
import AdditionSnakeCanvas from './AdditionSnakeCanvas';

const AdditionSnakeGame: React.FC = () => {
  const [gameSpeed, setGameSpeed] = useState(350); // Slower speed for thinking time (350ms = ~3 cells per second)
  
  const {
    gameStarted,
    gameOver,
    gamePaused,
    currentQuestion,
    score,
    correctAnswers,
    wrongAnswers,
    streak,
    bestStreak,
    difficulty,
    maxNumber,
    startGame,
    resetGame,
    pauseGame,
    resumeGame,
    setDirection,
    moveSnake,
    setDifficulty,
  } = useAdditionSnakeStore();
  
  // Handle keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        e.preventDefault();
        setDirection('UP');
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        e.preventDefault();
        setDirection('DOWN');
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        e.preventDefault();
        setDirection('LEFT');
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        e.preventDefault();
        setDirection('RIGHT');
        break;
      case ' ':
        e.preventDefault();
        if (gamePaused) {
          resumeGame();
        } else if (gameStarted && !gameOver) {
          pauseGame();
        }
        break;
      case 'Escape':
        e.preventDefault();
        resetGame();
        break;
    }
  }, [setDirection, gamePaused, gameStarted, gameOver, pauseGame, resumeGame, resetGame]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  // Game loop - slower for thinking time
  useEffect(() => {
    if (!gameStarted || gameOver || gamePaused) return;
    
    const gameLoop = setInterval(() => {
      moveSnake();
    }, gameSpeed);
    
    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, gamePaused, moveSnake, gameSpeed]);
  
  const handleStartGame = () => {
    startGame();
  };
  
  const handleDifficultyChange = (diff: 'easy' | 'medium' | 'hard') => {
    setDifficulty(diff);
  };
  
  const handleSpeedChange = (speed: number) => {
    setGameSpeed(speed);
  };
  
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return 'from-green-500 to-emerald-600';
      case 'medium': return 'from-amber-500 to-orange-600';
      case 'hard': return 'from-red-500 to-rose-600';
      default: return 'from-green-500 to-emerald-600';
    }
  };
  
  return (
    <div className={`flex flex-col items-center gap-6 p-6 bg-gradient-to-br ${getDifficultyColor()} min-h-screen`}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
          🐍 Addition Snake ➕
        </h1>
        <p className="text-white/90 text-lg">
          Master Addition from 1 to 100!
        </p>
      </div>
      
      {/* Current Question Display */}
      {gameStarted && currentQuestion && !gameOver && (
        <div className="bg-white rounded-2xl px-8 py-4 shadow-2xl">
          <div className="text-center">
            <span className="text-gray-500 text-sm">Solve:</span>
            <div className="text-4xl font-bold text-gray-800 mt-1">
              {currentQuestion.num1} + {currentQuestion.num2} = <span className="text-blue-500">?</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              🎯 Find and eat the correct answer: <span className="font-bold text-green-600">{currentQuestion.answer}</span>
            </p>
          </div>
        </div>
      )}
      
      {/* Game Stats */}
      <div className="flex gap-4 flex-wrap justify-center">
        <div className="bg-white/95 rounded-xl px-5 py-3 shadow-lg">
          <span className="text-gray-500 text-sm">Score</span>
          <div className="text-2xl font-bold text-green-600">{score}</div>
        </div>
        <div className="bg-white/95 rounded-xl px-5 py-3 shadow-lg">
          <span className="text-gray-500 text-sm">Correct ✅</span>
          <div className="text-2xl font-bold text-blue-600">{correctAnswers}</div>
        </div>
        <div className="bg-white/95 rounded-xl px-5 py-3 shadow-lg">
          <span className="text-gray-500 text-sm">Wrong ❌</span>
          <div className="text-2xl font-bold text-red-500">{wrongAnswers}</div>
        </div>
        <div className="bg-white/95 rounded-xl px-5 py-3 shadow-lg">
          <span className="text-gray-500 text-sm">Streak 🔥</span>
          <div className="text-2xl font-bold text-orange-500">{streak}</div>
        </div>
        <div className="bg-white/95 rounded-xl px-5 py-3 shadow-lg">
          <span className="text-gray-500 text-sm">Best 🏆</span>
          <div className="text-2xl font-bold text-purple-600">{bestStreak}</div>
        </div>
      </div>
      
      {/* Streak Bonus Indicator */}
      {streak >= 3 && gameStarted && !gameOver && (
        <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-2 rounded-full font-bold animate-pulse shadow-lg">
          🔥 {streak} Streak! {streak >= 5 ? '+20 Bonus!' : '+10 Bonus!'}
        </div>
      )}
      
      {/* Game Canvas */}
      <div className="relative">
        <AdditionSnakeCanvas width={600} height={600} />
      </div>
      
      {/* Difficulty Selector */}
      {!gameStarted && (
        <div className="flex flex-col items-center gap-4">
          <span className="text-white font-semibold text-lg">Select Difficulty:</span>
          <div className="flex gap-3">
            <button
              onClick={() => handleDifficultyChange('easy')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                difficulty === 'easy'
                  ? 'bg-green-500 text-white scale-110 shadow-lg'
                  : 'bg-white/80 text-gray-700 hover:bg-white'
              }`}
            >
              🌱 Easy (1-20)
            </button>
            <button
              onClick={() => handleDifficultyChange('medium')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                difficulty === 'medium'
                  ? 'bg-amber-500 text-white scale-110 shadow-lg'
                  : 'bg-white/80 text-gray-700 hover:bg-white'
              }`}
            >
              🌿 Medium (1-50)
            </button>
            <button
              onClick={() => handleDifficultyChange('hard')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                difficulty === 'hard'
                  ? 'bg-red-500 text-white scale-110 shadow-lg'
                  : 'bg-white/80 text-gray-700 hover:bg-white'
              }`}
            >
              🌳 Hard (1-100)
            </button>
          </div>
        </div>
      )}
      
      {/* Controls */}
      <div className="flex gap-4 flex-wrap justify-center">
        {!gameStarted ? (
          <button
            onClick={handleStartGame}
            className="px-10 py-4 bg-white text-gray-800 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-xl text-xl hover:scale-105"
          >
            🎮 START GAME
          </button>
        ) : (
          <>
            {!gameOver && (
              <button
                onClick={gamePaused ? resumeGame : pauseGame}
                className="px-6 py-3 bg-yellow-400 text-gray-800 font-bold rounded-xl hover:bg-yellow-500 transition-colors shadow-lg"
              >
                {gamePaused ? '▶️ Resume' : '⏸️ Pause'}
              </button>
            )}
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-white/90 text-gray-800 font-bold rounded-xl hover:bg-white transition-colors shadow-lg"
            >
              🔄 Restart
            </button>
          </>
        )}
      </div>
      
      {/* Speed Control */}
      <div className="flex items-center gap-4 bg-white/20 rounded-xl px-6 py-3">
        <span className="text-white font-semibold">Speed:</span>
        <button
          onClick={() => handleSpeedChange(500)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            gameSpeed === 500 ? 'bg-green-500 text-white' : 'bg-white/70 text-gray-700'
          }`}
        >
          🐢 Very Slow
        </button>
        <button
          onClick={() => handleSpeedChange(350)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            gameSpeed === 350 ? 'bg-yellow-500 text-white' : 'bg-white/70 text-gray-700'
          }`}
        >
          🚶 Slow
        </button>
        <button
          onClick={() => handleSpeedChange(250)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            gameSpeed === 250 ? 'bg-orange-500 text-white' : 'bg-white/70 text-gray-700'
          }`}
        >
          🏃 Normal
        </button>
        <button
          onClick={() => handleSpeedChange(150)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            gameSpeed === 150 ? 'bg-red-500 text-white' : 'bg-white/70 text-gray-700'
          }`}
        >
          ⚡ Fast
        </button>
      </div>
      
      {/* Mobile Controls */}
      <div className="grid grid-cols-3 gap-2 md:hidden">
        <div></div>
        <button
          onClick={() => setDirection('UP')}
          className="p-4 bg-white/80 text-gray-800 rounded-xl text-2xl active:bg-white shadow-lg"
        >
          ⬆️
        </button>
        <div></div>
        <button
          onClick={() => setDirection('LEFT')}
          className="p-4 bg-white/80 text-gray-800 rounded-xl text-2xl active:bg-white shadow-lg"
        >
          ⬅️
        </button>
        <button
          onClick={() => setDirection('DOWN')}
          className="p-4 bg-white/80 text-gray-800 rounded-xl text-2xl active:bg-white shadow-lg"
        >
          ⬇️
        </button>
        <button
          onClick={() => setDirection('RIGHT')}
          className="p-4 bg-white/80 text-gray-800 rounded-xl text-2xl active:bg-white shadow-lg"
        >
          ➡️
        </button>
      </div>
      
      {/* Instructions */}
      <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 max-w-2xl text-white">
        <h3 className="font-bold text-xl mb-3">🎯 How to Play:</h3>
        <ul className="space-y-2 text-white/90">
          <li>• Use <span className="text-yellow-300 font-semibold">Arrow Keys</span> or <span className="text-yellow-300 font-semibold">WASD</span> to move the snake</li>
          <li>• Look at the <span className="text-cyan-300 font-semibold">addition question</span> above the snake</li>
          <li>• Eat the <span className="text-green-300 font-semibold">correct answer</span> to grow and score points!</li>
          <li>• <span className="text-red-300 font-semibold">Wrong answers</span> will disappear - don&apos;t eat them!</li>
          <li>• Build a <span className="text-orange-300 font-semibold">streak</span> for bonus points! 🔥</li>
          <li>• Avoid walls and don&apos;t bite yourself!</li>
        </ul>
        
        <div className="mt-4 pt-4 border-t border-white/20">
          <h4 className="font-semibold mb-2">📊 Difficulty Levels:</h4>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="bg-green-500/30 rounded-lg p-2 text-center">
              <div className="font-bold">🌱 Easy</div>
              <div>Numbers 1-20</div>
            </div>
            <div className="bg-amber-500/30 rounded-lg p-2 text-center">
              <div className="font-bold">🌿 Medium</div>
              <div>Numbers 1-50</div>
            </div>
            <div className="bg-red-500/30 rounded-lg p-2 text-center">
              <div className="font-bold">🌳 Hard</div>
              <div>Numbers 1-100</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Keyboard shortcuts */}
      <div className="text-white/70 text-sm flex gap-6">
        <span>⏸️ Space: Pause/Resume</span>
        <span>🔄 Esc: Reset Game</span>
      </div>
    </div>
  );
};

export default AdditionSnakeGame;
