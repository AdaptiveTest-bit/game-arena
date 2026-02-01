'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { useNumberSnakeStore, GameType } from '../../store/useNumberSnakeStore';
import NumberSnakeCanvas from './NumberSnakeCanvas';

const TYPE_INFO: Record<GameType, { name: string; emoji: string; description: string }> = {
  'counting-up': {
    name: 'Count Up',
    emoji: '⬆️',
    description: 'Count numbers in increasing order (1, 2, 3...)',
  },
  'counting-down': {
    name: 'Count Down',
    emoji: '⬇️',
    description: 'Count numbers in decreasing order (100, 99, 98...)',
  },
  'skip-counting-2': {
    name: 'Skip by 2s',
    emoji: '2️⃣',
    description: 'Skip count by 2s (2, 4, 6, 8...)',
  },
  'skip-counting-5': {
    name: 'Skip by 5s',
    emoji: '5️⃣',
    description: 'Skip count by 5s (5, 10, 15, 20...)',
  },
  'skip-counting-10': {
    name: 'Skip by 10s',
    emoji: '🔟',
    description: 'Skip count by 10s (10, 20, 30...)',
  },
};

const TYPE_COLORS: Record<GameType, string> = {
  'counting-up': 'bg-green-500 hover:bg-green-600',
  'counting-down': 'bg-blue-500 hover:bg-blue-600',
  'skip-counting-2': 'bg-amber-500 hover:bg-amber-600',
  'skip-counting-5': 'bg-pink-500 hover:bg-pink-600',
  'skip-counting-10': 'bg-purple-500 hover:bg-purple-600',
};

const GAME_TYPES: GameType[] = [
  'counting-up',
  'counting-down',
  'skip-counting-2',
  'skip-counting-5',
  'skip-counting-10',
];

const NumberSnakeGame: React.FC = () => {
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(200); // ms between moves
  
  const {
    gameStarted,
    gameOver,
    gamePaused,
    gameWon,
    currentType,
    currentQuestion,
    expectedNumber,
    score,
    level,
    collectedNumbers,
    questionsCompleted,
    startGame,
    resetGame,
    pauseGame,
    resumeGame,
    setDirection,
    moveSnake,
    switchGameType,
  } = useNumberSnakeStore();
  
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
  
  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver || gamePaused || gameWon) return;
    
    const gameLoop = setInterval(() => {
      moveSnake();
    }, gameSpeed);
    
    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, gamePaused, gameWon, moveSnake, gameSpeed]);
  
  const handleStartGame = () => {
    startGame();
  };
  
  const handleSelectType = (type: GameType) => {
    switchGameType(type);
    setShowTypeSelector(false);
    startGame();
  };
  
  const handleSpeedChange = (speed: number) => {
    setGameSpeed(speed);
  };
  
  const typeInfo = TYPE_INFO[currentType];
  
  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">
          🐍 Number Snake 🔢
        </h1>
        <p className="text-gray-300">
          Chapter 2: Numbers from 1 to 100 - Counting Practice
        </p>
      </div>
      
      {/* Game Type Selector */}
      {showTypeSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Select Game Type
            </h2>
            <div className="grid gap-4">
              {GAME_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => handleSelectType(type)}
                  className={`${TYPE_COLORS[type]} text-white p-4 rounded-xl flex items-center gap-4 transition-transform hover:scale-102`}
                >
                  <span className="text-3xl">{TYPE_INFO[type].emoji}</span>
                  <div className="text-left">
                    <div className="font-bold text-lg">{TYPE_INFO[type].name}</div>
                    <div className="text-sm opacity-90">{TYPE_INFO[type].description}</div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowTypeSelector(false)}
              className="mt-6 w-full py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Current Type Badge */}
      <div className={`${TYPE_COLORS[currentType]} text-white px-6 py-2 rounded-full font-bold flex items-center gap-2`}>
        <span>{typeInfo.emoji}</span>
        <span>Type {GAME_TYPES.indexOf(currentType) + 1}: {typeInfo.name}</span>
      </div>
      
      {/* Question Display */}
      {gameStarted && !gameOver && !gameWon && (
        <div className="bg-white rounded-2xl p-4 shadow-lg max-w-2xl w-full text-center">
          <p className="text-xl font-bold text-gray-800">{currentQuestion}</p>
          <div className="mt-2 flex items-center justify-center gap-4">
            <span className="text-gray-600">Next number to eat:</span>
            <span className="text-3xl font-bold text-green-500 animate-pulse">
              {expectedNumber}
            </span>
          </div>
        </div>
      )}
      
      {/* Game Stats */}
      <div className="flex gap-6 flex-wrap justify-center">
        <div className="bg-white rounded-xl px-6 py-3 shadow-lg">
          <span className="text-gray-500">Score:</span>
          <span className="ml-2 text-2xl font-bold text-green-600">{score}</span>
        </div>
        <div className="bg-white rounded-xl px-6 py-3 shadow-lg">
          <span className="text-gray-500">Level:</span>
          <span className="ml-2 text-2xl font-bold text-blue-600">{level}</span>
        </div>
        <div className="bg-white rounded-xl px-6 py-3 shadow-lg">
          <span className="text-gray-500">Completed:</span>
          <span className="ml-2 text-2xl font-bold text-purple-600">{questionsCompleted}</span>
        </div>
      </div>
      
      {/* Collected Numbers Trail */}
      {collectedNumbers.length > 0 && (
        <div className="bg-white bg-opacity-20 rounded-xl px-4 py-2 max-w-2xl">
          <span className="text-white mr-2">Collected:</span>
          <span className="text-green-400 font-mono">
            {collectedNumbers.slice(-10).join(' → ')}
            {collectedNumbers.length > 10 && '...'}
          </span>
        </div>
      )}
      
      {/* Game Canvas */}
      <div className="relative">
        <NumberSnakeCanvas width={600} height={600} />
      </div>
      
      {/* Controls */}
      <div className="flex gap-4 flex-wrap justify-center">
        {!gameStarted ? (
          <>
            <button
              onClick={handleStartGame}
              className="px-8 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors shadow-lg text-xl"
            >
              🎮 START GAME
            </button>
            <button
              onClick={() => setShowTypeSelector(true)}
              className="px-8 py-4 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-600 transition-colors shadow-lg text-xl"
            >
              📋 SELECT TYPE
            </button>
          </>
        ) : (
          <>
            {!gameOver && !gameWon && (
              <button
                onClick={gamePaused ? resumeGame : pauseGame}
                className="px-6 py-3 bg-yellow-500 text-white font-bold rounded-xl hover:bg-yellow-600 transition-colors shadow-lg"
              >
                {gamePaused ? '▶️ Resume' : '⏸️ Pause'}
              </button>
            )}
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg"
            >
              🔄 Restart
            </button>
          </>
        )}
      </div>
      
      {/* Speed Control */}
      <div className="flex items-center gap-4 bg-white bg-opacity-10 rounded-xl px-6 py-3">
        <span className="text-white">Speed:</span>
        <button
          onClick={() => handleSpeedChange(300)}
          className={`px-4 py-2 rounded-lg ${gameSpeed === 300 ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'}`}
        >
          🐢 Slow
        </button>
        <button
          onClick={() => handleSpeedChange(200)}
          className={`px-4 py-2 rounded-lg ${gameSpeed === 200 ? 'bg-yellow-500 text-white' : 'bg-gray-600 text-gray-300'}`}
        >
          🚶 Normal
        </button>
        <button
          onClick={() => handleSpeedChange(100)}
          className={`px-4 py-2 rounded-lg ${gameSpeed === 100 ? 'bg-red-500 text-white' : 'bg-gray-600 text-gray-300'}`}
        >
          🏃 Fast
        </button>
      </div>
      
      {/* Mobile Controls */}
      <div className="grid grid-cols-3 gap-2 md:hidden">
        <div></div>
        <button
          onClick={() => setDirection('UP')}
          className="p-4 bg-gray-700 text-white rounded-xl text-2xl active:bg-gray-600"
        >
          ⬆️
        </button>
        <div></div>
        <button
          onClick={() => setDirection('LEFT')}
          className="p-4 bg-gray-700 text-white rounded-xl text-2xl active:bg-gray-600"
        >
          ⬅️
        </button>
        <button
          onClick={() => setDirection('DOWN')}
          className="p-4 bg-gray-700 text-white rounded-xl text-2xl active:bg-gray-600"
        >
          ⬇️
        </button>
        <button
          onClick={() => setDirection('RIGHT')}
          className="p-4 bg-gray-700 text-white rounded-xl text-2xl active:bg-gray-600"
        >
          ➡️
        </button>
      </div>
      
      {/* Instructions */}
      <div className="bg-white bg-opacity-10 rounded-xl p-6 max-w-2xl text-white">
        <h3 className="font-bold text-lg mb-3">🎯 How to Play:</h3>
        <ul className="space-y-2 text-gray-300">
          <li>• Use <span className="text-yellow-400">Arrow Keys</span> or <span className="text-yellow-400">WASD</span> to move the snake</li>
          <li>• Eat numbers in the <span className="text-green-400">correct order</span> shown in the question</li>
          <li>• The <span className="text-green-400">highlighted number</span> is your next target</li>
          <li>• Avoid walls and don&apos;t bite yourself!</li>
          <li>• Complete all 5 types to master counting 1-100!</li>
        </ul>
        
        <h3 className="font-bold text-lg mt-4 mb-3">📚 Game Types:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          {GAME_TYPES.map((type, index) => (
            <div key={type} className="flex items-center gap-2">
              <span>{TYPE_INFO[type].emoji}</span>
              <span className="text-gray-300">Type {index + 1}:</span>
              <span className="text-white">{TYPE_INFO[type].name}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Keyboard shortcuts */}
      <div className="text-gray-400 text-sm">
        <span className="mr-4">⏸️ Space: Pause</span>
        <span>🔄 Esc: Reset</span>
      </div>
    </div>
  );
};

export default NumberSnakeGame;
