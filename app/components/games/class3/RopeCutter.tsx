'use client';

import React, { useEffect, useState } from 'react';
import { useGameStore } from '@/app/store/useGameStore';
import { submitTelemetry, decimalToMixedFraction } from '@/app/utils/gameUtils';
import RopeCutterCanvas from './RopeCutterCanvas';
import { RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';

const RopeCutterGame: React.FC = () => {
  const {
    startGame,
    makeCut,
    resetGame,
    gameCompleted,
    correctCuts,
    requiredCuts,
    cuts,
    getTelemetryLog,
    totalLength,
    targetPieceSize,
  } = useGameStore();

  const [gameState, setGameState] = useState<'ready' | 'playing' | 'completed'>('ready');

  useEffect(() => {
    if (gameState === 'ready') {
      startGame();
      setGameState('playing');
    }
  }, [gameState, startGame]);

  useEffect(() => {
    if (gameCompleted) {
      setGameState('completed');
      const telemetryLog = getTelemetryLog();
      submitTelemetry(telemetryLog);
    }
  }, [gameCompleted, getTelemetryLog]);

  const handleCut = (location: number): boolean => {
    return makeCut(location);
  };

  const handleReset = () => {
    resetGame();
    setGameState('ready');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🎮 The Rope Cutter</h1>
          <p className="text-lg text-gray-600">Master Mixed Fractions by Cutting!</p>
        </div>

        {/* Mission Brief Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4 border-yellow-400">
          <div className="flex items-start gap-4">
            <div className="text-3xl">📋</div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Mission Brief</h2>
              <p className="text-gray-700 text-lg font-medium">
                A rope <span className="font-bold text-indigo-600">{totalLength}m</span> long is cut into pieces of <span className="font-bold text-indigo-600">{decimalToMixedFraction(targetPieceSize)}m</span> each.
              </p>
              <p className="text-gray-600 mt-1">How many pieces can you create?</p>
              <p className="text-indigo-600 font-semibold mt-3">
                💡 You need to make exactly <span className="text-2xl">{requiredCuts}</span> cuts at the correct positions.
              </p>
            </div>
          </div>
        </div>

        {/* Game Canvas Area */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-6">
              {/* Counter */}
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 rounded-full p-4">
                  <span className="text-3xl font-bold text-indigo-600">{correctCuts}</span>
                  <p className="text-xs text-indigo-600 font-semibold">/ {requiredCuts}</p>
                </div>
                <p className="text-gray-700">
                  <span className="font-semibold">Correct Cuts</span>
                </p>
              </div>

              {/* Total Cuts Made */}
              <div className="flex items-center gap-3 border-l border-gray-300 pl-6">
                <div className="bg-gray-100 rounded-full p-4">
                  <span className="text-3xl font-bold text-gray-600">{cuts.length}</span>
                </div>
                <p className="text-gray-700">
                  <span className="font-semibold">Total Cuts</span>
                </p>
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <RotateCcw size={20} />
              Reset Game
            </button>
          </div>

          {/* Canvas */}
          <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
            <RopeCutterCanvas width={1000} height={250} onCut={handleCut} />
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>How to Play:</strong> Click on the rope at the positions marked by faint dashed lines (every 2.5m).
              You need precision within ±0.2m tolerance. Red marks show incorrect cuts, green marks show correct cuts.
            </p>
          </div>
        </div>

        {/* Game Status */}
        {gameState === 'completed' && (
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-green-500">
            <div className="flex items-center gap-4 mb-6">
              <CheckCircle size={48} className="text-green-500" />
              <h2 className="text-3xl font-bold text-gray-800">🎉 Mission Complete!</h2>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Accuracy</p>
                <p className="text-3xl font-bold text-green-600">
                  {((correctCuts / requiredCuts) * 100).toFixed(0)}%
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Total Cuts Made</p>
                <p className="text-3xl font-bold text-blue-600">{cuts.length}</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6 text-center">
              Excellent work! You've mastered cutting a rope into equal pieces using mixed fractions.
            </p>

            <button
              onClick={handleReset}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Error State for Conceptual Issues */}
        {gameState === 'playing' && cuts.length > 0 && correctCuts < cuts.length && cuts.length > 3 && (
          <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-yellow-400 mt-6">
            <div className="flex items-start gap-3">
              <AlertCircle size={32} className="text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Hint: Check Your Accuracy</h3>
                <p className="text-gray-700 mb-2">
                  You've made {cuts.length} cuts but only {correctCuts} are correct.
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>✓ Each piece should be exactly <strong>2.5m</strong> (or 2½m)</li>
                  <li>✓ First cut should be at <strong>2.5m</strong>, second at <strong>5.0m</strong>, etc.</li>
                  <li>✓ You can be ±0.2m off and the cut will still be valid</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RopeCutterGame;
