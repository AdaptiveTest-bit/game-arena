'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useLiquidGameStore } from '@/app/store/useLiquidGameStore';
import { submitTelemetry } from '@/app/utils/gameUtils';
import LiquidLabCanvas from './LiquidLabCanvas';
import { RotateCcw, CheckCircle, AlertCircle, Zap } from 'lucide-react';

const LiquidLabGame: React.FC = () => {
  const {
    startGame,
    startPouring,
    stopPouring,
    updateLiquidLevels,
    resetGame,
    gameCompleted,
    isPouring,
    sourceLiters,
    targetLiters,
    targetVolume,
    tolerance,
    getTelemetryLog,
    getAccuracy,
    isWinConditionMet,
  } = useLiquidGameStore();

  const [gameState, setGameState] = useState<'ready' | 'playing' | 'completed'>('ready');
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());

  // Initialize game
  useEffect(() => {
    if (gameState === 'ready') {
      startGame();
      setGameState('playing');
    }
  }, [gameState, startGame]);

  // Animation loop for pouring
  useEffect(() => {
    const animate = () => {
      if (isPouring) {
        const now = Date.now();
        const deltaTime = now - lastTimeRef.current;
        lastTimeRef.current = now;

        updateLiquidLevels(deltaTime);
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPouring, updateLiquidLevels]);

  // Check for win condition
  useEffect(() => {
    if (!isPouring && gameState === 'playing' && isWinConditionMet()) {
      setGameState('completed');
      const telemetryLog = getTelemetryLog();
      submitTelemetry(telemetryLog);
    }
  }, [isPouring, gameState, isWinConditionMet, getTelemetryLog]);

  const handleMouseDown = () => {
    lastTimeRef.current = Date.now();
    startPouring();
  };

  const handleMouseUp = () => {
    stopPouring();
  };

  const handleReset = () => {
    resetGame();
    setGameState('ready');
  };

  const accuracy = getAccuracy();
  const errorAmount = Math.abs(targetLiters - targetVolume);
  const isClose = errorAmount <= tolerance * 1.5;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🧪 Liquid Lab</h1>
          <p className="text-lg text-gray-600">Master Fraction Subtraction with Unlike Denominators!</p>
        </div>

        {/* Mission Brief Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4 border-purple-400">
          <div className="flex items-start gap-4">
            <div className="text-3xl">🧬</div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Mission Brief</h2>
              <p className="text-gray-700 text-lg font-medium">
                The main beaker contains <strong>5/6 Liters</strong> of chemical.
              </p>
              <p className="text-gray-600 mt-1">
                Pour out exactly <strong>1/3 Liter</strong> into the test tube.
              </p>
              <p className="text-purple-600 font-semibold mt-3">
                💡 Hint: Think... 1/3 = 2/6. Can you find the equivalent?
              </p>
            </div>
          </div>
        </div>

        {/* Game Canvas Area */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {/* Status Display */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-6">
              {/* Source Display */}
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 rounded-full p-4">
                  <span className="text-3xl font-bold text-blue-600">{sourceLiters.toFixed(2)}</span>
                  <p className="text-xs text-blue-600 font-semibold">L</p>
                </div>
                <p className="text-gray-700">
                  <span className="font-semibold">Beaker</span>
                </p>
              </div>

              {/* Target Display */}
              <div className="flex items-center gap-3 border-l border-gray-300 pl-6">
                <div className="bg-purple-100 rounded-full p-4">
                  <span className="text-3xl font-bold text-purple-600">{targetLiters.toFixed(3)}</span>
                  <p className="text-xs text-purple-600 font-semibold">L</p>
                </div>
                <p className="text-gray-700">
                  <span className="font-semibold">Test Tube</span>
                  <br />
                  <span className="text-sm text-green-600">Goal: {targetVolume.toFixed(3)}L</span>
                </p>
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <RotateCcw size={20} />
              Reset
            </button>
          </div>

          {/* Canvas */}
          <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 mb-6">
            <LiquidLabCanvas onPouring={(isPour) => {}} />
          </div>

          {/* Pour Control */}
          <div className="flex flex-col items-center gap-4">
            <button
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
              className={`relative px-8 py-4 rounded-lg font-bold text-white text-lg transition-all transform ${
                isPouring
                  ? 'bg-yellow-500 scale-105 shadow-lg'
                  : 'bg-yellow-400 hover:bg-yellow-500 shadow-md'
              }`}
            >
              <span className="flex items-center gap-2">
                <Zap size={24} />
                {isPouring ? 'POURING...' : 'HOLD TO POUR'}
              </span>
            </button>

            <p className="text-sm text-gray-600 text-center">
              {isPouring ? 'Release when you reach the goal!' : 'Press and hold to pour the liquid'}
            </p>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-800">
              <strong>How to Play:</strong> Hold the button to pour liquid from the beaker into the test tube.
              Release when the liquid level reaches the green goal line (1/3 L). Watch the graduation marks
              on both containers—remember that the test tube shows thirds while the beaker shows sixths!
            </p>
          </div>
        </div>

        {/* Accuracy Feedback */}
        {gameState === 'playing' && targetLiters > 0 && (
          <div
            className={`bg-white rounded-lg shadow-lg p-6 mb-6 border-2 transition-colors ${
              isClose ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300'
            }`}
          >
            <div className="flex items-start gap-3">
              {isClose && <AlertCircle size={32} className="text-yellow-600 flex-shrink-0 mt-1" />}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {isClose ? '🎯 Getting Close!' : 'Current Progress'}
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    Target: <strong>{targetVolume.toFixed(3)}L</strong> | Current:{' '}
                    <strong>{targetLiters.toFixed(3)}L</strong>
                  </p>
                  <p className="text-gray-700">
                    Difference: <strong>{errorAmount.toFixed(3)}L</strong> (Tolerance: ±{tolerance.toFixed(3)}L)
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isClose ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(accuracy * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">Accuracy: {(accuracy * 100).toFixed(0)}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Game Status */}
        {gameState === 'completed' && (
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-green-500">
            <div className="flex items-center gap-4 mb-6">
              <CheckCircle size={48} className="text-green-500" />
              <h2 className="text-3xl font-bold text-gray-800">🎉 Mission Complete!</h2>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Accuracy</p>
                <p className="text-3xl font-bold text-green-600">
                  {(accuracy * 100).toFixed(0)}%
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Poured</p>
                <p className="text-3xl font-bold text-blue-600">{targetLiters.toFixed(3)}</p>
                <p className="text-xs text-blue-600">Liters</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Target</p>
                <p className="text-3xl font-bold text-purple-600">{targetVolume.toFixed(3)}</p>
                <p className="text-xs text-purple-600">Liters</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6 text-center">
              Excellent! You've mastered subtracting fractions with unlike denominators. You successfully
              identified that 1/3 = 2/6 and poured the exact amount!
            </p>

            <button
              onClick={handleReset}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiquidLabGame;
