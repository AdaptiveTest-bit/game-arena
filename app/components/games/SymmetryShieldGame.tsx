'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Zap, RefreshCw } from 'lucide-react';
import { useSymmetryShieldStore } from '@/app/store/useSymmetryShieldStore';
import { submitTelemetry } from '@/app/utils/gameUtils';
import SymmetryShieldCanvas from './SymmetryShieldCanvas';

const SymmetryShieldGame: React.FC = () => {
  const {
    startGame,
    toggleCell,
    resetGrid,
    activateShield,
    getAccuracy,
    getTelemetryLog,
    gameCompleted,
    isCorrect,
    levelAttempts,
    leftSide,
    rightSide,
  } = useSymmetryShieldStore();

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'celebrating'>('menu');
  const [celebrationStarted, setCelebrationStarted] = useState(false);

  // Handle game completion with 2-second delay
  useEffect(() => {
    if (gameCompleted && gameState === 'playing' && !celebrationStarted) {
      const celebrationTimer = setTimeout(() => {
        setCelebrationStarted(true);
        setGameState('celebrating');
      }, 2000);

      return () => clearTimeout(celebrationTimer);
    }
  }, [gameCompleted, gameState, celebrationStarted]);

  const handleStartGame = () => {
    startGame();
    setGameState('playing');
  };

  const handleCellClick = (row: number, col: number) => {
    toggleCell(row, col);
  };

  const handleActivateShield = () => {
    activateShield();
  };

  const handleReset = () => {
    resetGrid();
  };

  const handleBackToMenu = () => {
    resetGrid();
    setGameState('menu');
    setCelebrationStarted(false);
  };

  const handlePlayAgain = () => {
    const log = getTelemetryLog();
    submitTelemetry(log);
    console.log('Telemetry submitted:', log);
    handleBackToMenu();
    setTimeout(() => handleStartGame(), 100);
  };

  const accuracy = getAccuracy();
  const activeCellsCount = rightSide.filter(Boolean).length;
  const targetCellsCount = leftSide.filter(Boolean).length;

  // Menu State
  if (gameState === 'menu') {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
        {/* Mission Brief */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">🛡️ The Symmetry Shield</h1>
          <p className="text-lg opacity-90">
            The starship's defense shield is damaged! You must repair the right side of the shield so it perfectly mirrors the left side to activate the defenses.
          </p>
        </div>

        {/* Learning Objectives */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">📚 Learning Goals</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-3">
              <span className="text-xl">✓</span>
              <span>Understand <strong>reflection symmetry</strong> (mirror halves)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">✓</span>
              <span>Distinguish between <strong>translation</strong> (shifting) and <strong>reflection</strong> (flipping)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">✓</span>
              <span>Develop <strong>visual pattern completion</strong> skills</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">✓</span>
              <span>Practice <strong>spatial reasoning</strong> with grid-based puzzles</span>
            </li>
          </ul>
        </div>

        {/* How to Play */}
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-indigo-900 mb-4">🎮 How to Play</h3>
          <div className="space-y-3 text-indigo-800">
            <p className="flex items-start gap-3">
              <span className="text-2xl">1️⃣</span>
              <span><strong>See the Pattern:</strong> The left side shows the pattern you need to mirror (blue, read-only).</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-2xl">2️⃣</span>
              <span><strong>Click to Fill:</strong> Click cells on the right side (green) to toggle them ON/OFF.</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-2xl">3️⃣</span>
              <span><strong>Mirror the Pattern:</strong> Each cell on the right must match its mirror on the left.</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-2xl">4️⃣</span>
              <span><strong>Activate Shield:</strong> Click "Activate Shield" when ready. If perfect, the shield activates!</span>
            </p>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartGame}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition-all hover:shadow-xl active:scale-95"
        >
          <Zap className="inline mr-2" size={24} />
          Start Game
        </button>
      </div>
    );
  }

  // Playing State
  if (gameState === 'playing') {
    return (
      <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg p-4 text-white">
          <div>
            <h2 className="text-2xl font-bold">🛡️ The Symmetry Shield</h2>
            <p className="text-sm opacity-90">Mirror the left pattern on the right side to activate the defense</p>
          </div>
          <button
            onClick={handleBackToMenu}
            className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg font-semibold transition-all"
          >
            <RotateCcw size={18} />
            Back
          </button>
        </div>

        {/* Canvas */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <SymmetryShieldCanvas
            width={800}
            height={500}
            onCellClick={handleCellClick}
            isGameComplete={gameCompleted}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Accuracy */}
          <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4">
            <p className="text-sm text-gray-600 font-semibold mb-1">Accuracy</p>
            <p className="text-4xl font-bold text-purple-600">{Math.round(accuracy * 100)}%</p>
            <div className="mt-2 h-2 bg-purple-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all"
                style={{ width: `${accuracy * 100}%` }}
              />
            </div>
          </div>

          {/* Cells Filled */}
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
            <p className="text-sm text-gray-600 font-semibold mb-1">Cells Filled</p>
            <p className="text-4xl font-bold text-green-600">
              {activeCellsCount} / {targetCellsCount}
            </p>
          </div>

          {/* Attempts */}
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
            <p className="text-sm text-gray-600 font-semibold mb-1">Attempts</p>
            <p className="text-4xl font-bold text-blue-600">{levelAttempts}</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
          <p className="text-yellow-900 font-semibold">
            💡 <strong>Click on cells</strong> on the right side to toggle them. The glowing blue line is your symmetry axis. Match the pattern perfectly!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold transition-all"
          >
            <RefreshCw size={18} />
            Clear Right Side
          </button>
          <button
            onClick={handleActivateShield}
            disabled={gameCompleted}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 text-white px-8 py-3 rounded-lg font-bold shadow-lg transition-all hover:shadow-xl"
          >
            <Zap size={18} />
            Activate Shield
          </button>
        </div>
      </div>
    );
  }

  // Celebrating State
  if (gameState === 'celebrating') {
    const confettiPieces = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 0.2,
      duration: 2 + Math.random() * 1,
      left: Math.random() * 100,
      startRotation: Math.random() * 360,
      endRotation: Math.random() * 360 + 360,
    }));

    return (
      <div className="w-full max-w-5xl mx-auto p-6 relative">
        {/* Dimmed Canvas Background */}
        <div className="opacity-30 pointer-events-none">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <SymmetryShieldCanvas
              width={800}
              height={500}
              onCellClick={() => {}}
              isGameComplete={true}
            />
          </div>
        </div>

        {/* Confetti */}
        {confettiPieces.map((piece) => (
          <motion.div
            key={piece.id}
            className="fixed pointer-events-none text-2xl"
            initial={{
              left: `${piece.left}%`,
              top: '-30px',
              opacity: 1,
              rotate: piece.startRotation,
            }}
            animate={{
              top: '100vh',
              opacity: 0,
              rotate: piece.endRotation,
            }}
            transition={{
              duration: piece.duration,
              delay: piece.delay,
              ease: 'easeIn',
            }}
          >
            {['🛡️', '✨', '🌟', '⭐', '🔷'][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}

        {/* Modal */}
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal Card */}
          <motion.div
            className="relative w-full max-w-md mx-4 bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
          >
            {/* Header */}
            <div className={`p-8 text-white text-center ${isCorrect ? 'bg-gradient-to-r from-cyan-500 to-blue-600' : 'bg-gradient-to-r from-cyan-400 to-blue-500'}`}>
              <motion.div
                className="text-6xl mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              >
                {isCorrect ? '🛡️' : '✨'}
              </motion.div>
              <h2 className="text-3xl font-bold mb-2">
                {isCorrect ? 'Shield Activated!' : 'Good Try!'}
              </h2>
              <p className="text-lg opacity-90">
                {isCorrect
                  ? 'Perfect symmetry! The defense shield is now operational.'
                  : 'The pattern was not perfectly mirrored. Try again!'}
              </p>
            </div>

            {/* Performance Metrics */}
            <div className="p-6 space-y-4">
              {/* Accuracy Bar */}
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-700">Accuracy</span>
                  <span className="text-2xl font-bold text-purple-600">{Math.round(accuracy * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-purple-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${accuracy * 100}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                  />
                </div>
              </div>

              {/* Pattern Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-cyan-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Pattern Size</p>
                  <p className="text-xl font-bold text-cyan-600">{targetCellsCount}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Cells Filled</p>
                  <p className="text-xl font-bold text-green-600">{activeCellsCount}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Attempts</p>
                  <p className="text-xl font-bold text-blue-600">{levelAttempts}</p>
                </div>
              </div>

              {/* Status */}
              <div className="flex gap-3">
                <div className="flex-1 bg-yellow-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Status</p>
                  <p className={`text-lg font-bold ${isCorrect ? 'text-cyan-600' : 'text-yellow-600'}`}>
                    {isCorrect ? 'Perfect!' : 'Incomplete'}
                  </p>
                </div>
                <div className="flex-1 bg-indigo-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Symmetry</p>
                  <p className={`text-lg font-bold ${isCorrect ? 'text-indigo-600' : 'text-orange-600'}`}>
                    {isCorrect ? 'Mirrored ✓' : 'Not Matched'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
              <button
                onClick={handleBackToMenu}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition-colors"
              >
                Back to Menu
              </button>
              <button
                onClick={handlePlayAgain}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                <Zap size={18} />
                Try Again
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }
};

export default SymmetryShieldGame;
