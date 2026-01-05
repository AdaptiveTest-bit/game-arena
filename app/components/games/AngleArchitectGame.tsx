'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Play, Zap } from 'lucide-react';

import { useAngleArchitectStore } from '@/app/store/useAngleArchitectStore';
import { submitTelemetry } from '@/app/utils/gameUtils';
import AngleArchitectCanvas from './AngleArchitectCanvas';

const AngleArchitectGame: React.FC = () => {
  const {
    startGame,
    setCurrentAngle,
    startDrag,
    stopDrag,
    resetGame,
    startCelebration,
    currentAngle,
    targetAngle,
    gameCompleted,
    celebrationStarted,
    currentLevel,
    showTarget,
    getAccuracy,
    isWithinTolerance,
    getTelemetryLog,
  } = useAngleArchitectStore();

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'celebrating'>('menu');
  const [selectedLevel, setSelectedLevel] = useState<'direct' | 'blind'>('direct');

  // Handle game completion and start 2-second celebration delay
  useEffect(() => {
    if (gameCompleted && gameState === 'playing' && !celebrationStarted) {
      // Wait 2 seconds before showing celebration modal
      const celebrationTimer = setTimeout(() => {
        startCelebration();
        setGameState('celebrating');
      }, 2000);

      return () => clearTimeout(celebrationTimer);
    }
  }, [gameCompleted, gameState, celebrationStarted, startCelebration]);

  const handleStartGame = (level: 'direct' | 'blind') => {
    setSelectedLevel(level);
    startGame(level);
    setGameState('playing');
  };

  const handleReset = () => {
    resetGame();
    setGameState('menu');
  };

  const handleRotate = (angle: number) => {
    setCurrentAngle(angle);
  };

  const handleTelemetrySubmit = () => {
    const log = getTelemetryLog();
    submitTelemetry(log);
    console.log('Telemetry submitted:', log);
  };

  const handlePlayAgain = () => {
    handleTelemetrySubmit();
    handleReset();
  };

  // Menu state
  if (gameState === 'menu') {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
        {/* Mission Brief Card */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">🌉 The Angle Architect</h1>
          <p className="text-lg opacity-90">
            You are a bridge builder in a futuristic city. Rotate the bridge to the correct angle to connect the floating platforms so citizens can cross!
          </p>
        </div>

        {/* Mode Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Direct Mode */}
          <button
            onClick={() => handleStartGame('direct')}
            className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
          >
            <div className="relative z-10">
              <div className="mb-2 text-4xl">👁️</div>
              <h2 className="text-2xl font-bold mb-2">Level 1: Direct</h2>
              <p className="text-sm opacity-90">
                See the target platform and rotate to connect it. Perfect for learning angle basics.
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold">
                <Play size={16} />
                Start Level 1
              </div>
            </div>
          </button>

          {/* Blind Mode */}
          <button
            onClick={() => handleStartGame('blind')}
            className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
          >
            <div className="relative z-10">
              <div className="mb-2 text-4xl">🎯</div>
              <h2 className="text-2xl font-bold mb-2">Level 2: Blind</h2>
              <p className="text-sm opacity-90">
                No target visible! Use your angle intuition to estimate and rotate correctly.
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold">
                <Play size={16} />
                Start Level 2
              </div>
            </div>
          </button>
        </div>

        {/* Learning Goals */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">📚 Learning Goals</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-3">
              <span className="text-xl">✓</span>
              <span>Understand <strong>angles as turns</strong> (Quarter turn = 90°, Half turn = 180°)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">✓</span>
              <span>Classify angles: <strong>Acute</strong> (&lt;90°), <strong>Right</strong> (90°), <strong>Obtuse</strong> (&gt;90°)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">✓</span>
              <span>Develop <strong>visual estimation skills</strong> without a protractor</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  // Playing state
  if (gameState === 'playing') {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
        {/* Header with mission and level info */}
        <div className="flex items-center justify-between bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-4 text-white">
          <div>
            <h2 className="text-2xl font-bold">🌉 The Angle Architect</h2>
            <p className="text-sm opacity-90">
              {currentLevel === 'direct'
                ? `Rotate to ${targetAngle}° (${showTarget ? 'Target Visible' : 'Hidden'})`
                : 'Blind Mode: Estimate and rotate to the target angle'}
            </p>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg font-semibold transition-all"
          >
            <RotateCcw size={18} />
            Back to Menu
          </button>
        </div>

        {/* Canvas */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <AngleArchitectCanvas
            width={800}
            height={500}
            onDragStart={startDrag}
            onDragEnd={stopDrag}
            onRotate={handleRotate}
          />
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Current Angle */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-4">
            <p className="text-sm text-gray-600 font-semibold mb-1">Current Angle</p>
            <p className="text-4xl font-bold text-blue-600">{Math.round(currentAngle)}°</p>
          </div>

          {/* Target */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-lg p-4">
            <p className="text-sm text-gray-600 font-semibold mb-1">Target Angle</p>
            <p className="text-4xl font-bold text-green-600">{targetAngle}°</p>
          </div>

          {/* Accuracy */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-lg p-4">
            <p className="text-sm text-gray-600 font-semibold mb-1">Accuracy</p>
            <p className="text-4xl font-bold text-purple-600">{Math.round(getAccuracy() * 100)}%</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
          <p className="text-yellow-900 font-semibold">
            💡 <strong>Drag the golden handle</strong> to rotate the bridge. Release when you reach the target angle. Tolerance: ±5°
          </p>
        </div>
      </div>
    );
  }

  // Celebrating state - shows canvas with confetti and modal popup
  if (gameState === 'celebrating') {
    const accuracy = getAccuracy();
    const isCorrect = isWithinTolerance();
    const errorDegrees = Math.min(
      Math.abs(currentAngle - targetAngle),
      360 - Math.abs(currentAngle - targetAngle)
    );

    // Confetti particles
    const confettiPieces = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 0.2,
      duration: 2 + Math.random() * 1,
      left: Math.random() * 100,
      startRotation: Math.random() * 360,
      endRotation: Math.random() * 360 + 360,
    }));

    return (
      <div className="w-full max-w-4xl mx-auto p-6 relative">
        {/* Background game canvas (dimmed) */}
        <div className="opacity-40 pointer-events-none">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <AngleArchitectCanvas
              width={800}
              height={500}
              onDragStart={() => {}}
              onDragEnd={() => {}}
              onRotate={() => {}}
            />
          </div>
        </div>

        {/* Confetti animation */}
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
            {['🎉', '✨', '🌟', '⭐', '🎊'][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}

        {/* Modal Popup - Celebration Stats */}
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
            {/* Celebration Header */}
            <div className={`p-8 text-white text-center ${isCorrect ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-blue-500 to-indigo-600'}`}>
              <motion.div
                className="text-6xl mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              >
                {isCorrect ? '🎉' : '✨'}
              </motion.div>
              <h2 className="text-3xl font-bold mb-2">
                {isCorrect ? 'Perfect Angle!' : 'Great Job!'}
              </h2>
              <p className="text-lg opacity-90">
                {isCorrect
                  ? 'You perfectly aligned the bridge!'
                  : 'You got the bridge connected!'}
              </p>
            </div>

            {/* Performance Metrics */}
            <div className="p-6 space-y-4">
              {/* Accuracy */}
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

              {/* Angle Details */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Target</p>
                  <p className="text-xl font-bold text-blue-600">{targetAngle}°</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Your Angle</p>
                  <p className="text-xl font-bold text-indigo-600">{currentAngle}°</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Error</p>
                  <p className={`text-xl font-bold ${errorDegrees <= 5 ? 'text-green-600' : 'text-orange-600'}`}>
                    {errorDegrees}°
                  </p>
                </div>
              </div>

              {/* Level & Status */}
              <div className="flex gap-3">
                <div className="flex-1 bg-yellow-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Level</p>
                  <p className="text-lg font-bold text-yellow-700 capitalize">{currentLevel}</p>
                </div>
                <div className="flex-1 bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Status</p>
                  <p className={`text-lg font-bold ${isCorrect ? 'text-green-600' : 'text-blue-600'}`}>
                    {isCorrect ? 'Perfect!' : 'Good!'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition-colors"
              >
                Back to Menu
              </button>
              <button
                onClick={handlePlayAgain}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                <Zap size={18} />
                Play Again
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }
};

export default AngleArchitectGame;
