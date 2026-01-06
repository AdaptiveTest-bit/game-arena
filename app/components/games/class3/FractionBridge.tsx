'use client';

import React, { useEffect, useState } from 'react';
import { useFractionBridgeStore } from '@/app/store/useFractionBridgeStore';
import { submitTelemetry } from '@/app/utils/gameUtils';
import BridgeZone from './BridgeZone';
import { RotateCcw, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const FractionBridgeGame: React.FC = () => {
  const {
    startGame,
    planks,
    correctOrder,
    currentOrder,
    reorderPlanks,
    validateBridge,
    setBridgeShaking,
    bridgeShaking,
    resetGame,
    gameCompleted,
    isSuccess,
    getTelemetryLog,
  } = useFractionBridgeStore();

  const [gameState, setGameState] = useState<'ready' | 'playing' | 'completed'>('ready');
  const [validationMessage, setValidationMessage] = useState<string>('');

  // Initialize game
  useEffect(() => {
    if (gameState === 'ready') {
      startGame();
      setGameState('playing');
    }
  }, [gameState, startGame]);

  // Handle bridge validation
  const handleCrossBridge = () => {
    if (currentOrder.length === 0) {
      setValidationMessage('❌ Please place all planks first!');
      return;
    }

    if (currentOrder.length < planks.length) {
      setValidationMessage(
        `❌ You need to place all ${planks.length} planks. Currently placed: ${currentOrder.length}`
      );
      return;
    }

    const isCorrect = validateBridge();

    if (isCorrect) {
      // Success!
      setGameState('completed');
      const telemetryLog = getTelemetryLog();
      useFractionBridgeStore.setState({ isSuccess: true, gameCompleted: true });
      submitTelemetry(telemetryLog);
    } else {
      // Failure - shake the bridge
      setBridgeShaking(true);
      setValidationMessage('❌ Oops! The bridge collapsed! Check your order...');
      setTimeout(() => {
        setBridgeShaking(false);
      }, 1000);
    }
  };

  const handleReset = () => {
    resetGame();
    setGameState('ready');
    setValidationMessage('');
  };

  const isAllPlaced = currentOrder.length === planks.length;
  const correctPositions = currentOrder.filter(
    (id, idx) => id === correctOrder[idx].id
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🌉 The Fraction Bridge</h1>
          <p className="text-lg text-gray-600">Rebuild the bridge with fractions in order!</p>
        </div>

        {/* Mission Brief Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4 border-cyan-400">
          <div className="flex items-start gap-4">
            <div className="text-3xl">📋</div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Mission Brief</h2>
              <p className="text-gray-700 text-lg font-medium">
                A bridge has been broken! To cross the chasm, you must rebuild it.
              </p>
              <p className="text-gray-600 mt-2">
                You have 5 wooden planks labeled with fractions: <strong>7/12, 5/12, 9/12, 1/12, 2/12</strong>
              </p>
              <p className="text-cyan-600 font-semibold mt-3">
                💡 Challenge: Arrange them in <strong>DESCENDING ORDER</strong> (largest to smallest)
              </p>
              <p className="text-cyan-600 font-semibold mt-2">
                Correct order: <strong>9/12 → 7/12 → 5/12 → 2/12 → 1/12</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {/* Status Bar */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-6">
              {/* Planks placed counter */}
              <div className="flex items-center gap-3">
                <div className="bg-cyan-100 rounded-full p-4">
                  <span className="text-3xl font-bold text-cyan-600">{currentOrder.length}</span>
                  <p className="text-xs text-cyan-600 font-semibold">/ {planks.length}</p>
                </div>
                <p className="text-gray-700">
                  <span className="font-semibold">Planks Placed</span>
                </p>
              </div>

              {/* Correct positions */}
              <div className="flex items-center gap-3 border-l border-gray-300 pl-6">
                <div className="bg-green-100 rounded-full p-4">
                  <span className="text-3xl font-bold text-green-600">{correctPositions}</span>
                  <p className="text-xs text-green-600 font-semibold">Correct</p>
                </div>
                <p className="text-gray-700">
                  <span className="font-semibold">Position</span>
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

          {/* Bridge Zone */}
          <BridgeZone
            planks={planks}
            currentOrder={currentOrder}
            onReorder={reorderPlanks}
            isShaking={bridgeShaking}
            isCompleted={gameState === 'completed' && isSuccess}
          />

          {/* Instructions */}
          <div className="mt-6 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
            <p className="text-sm text-cyan-800">
              <strong>How to Play:</strong> Drag planks from the available pool and drop them into the bridge zone.
              Rearrange them by dragging again. When all planks are correctly ordered (descending),
              click "Cross Bridge" to proceed!
            </p>
          </div>
        </div>

        {/* Validation Feedback */}
        {validationMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-4 mb-6 border-l-4 border-yellow-400"
          >
            <p className="text-gray-800 font-semibold">{validationMessage}</p>
          </motion.div>
        )}

        {/* Accuracy Feedback */}
        {gameState === 'playing' && currentOrder.length > 0 && (
          <div
            className={`bg-white rounded-lg shadow-lg p-6 mb-6 border-2 transition-colors ${
              correctPositions === currentOrder.length && isAllPlaced
                ? 'border-green-500 bg-green-50'
                : 'border-yellow-400 bg-yellow-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <AlertCircle
                size={32}
                className={`flex-shrink-0 mt-1 ${
                  correctPositions === currentOrder.length && isAllPlaced
                    ? 'text-green-600'
                    : 'text-yellow-600'
                }`}
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {correctPositions === currentOrder.length && isAllPlaced
                    ? '✅ Perfect Order!'
                    : '🎯 Progress Update'}
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    Planks placed: <strong>{currentOrder.length}</strong> / {planks.length}
                  </p>
                  <p className="text-gray-700">
                    Correct positions: <strong>{correctPositions}</strong> / {currentOrder.length}
                  </p>

                  {/* Visual comparison hint */}
                  {currentOrder.length > 0 && (
                    <div className="mt-3 p-2 bg-white rounded border-l-4 border-cyan-400">
                      <p className="text-xs text-gray-600 font-semibold">Current order:</p>
                      <p className="text-sm text-gray-800">
                        {currentOrder
                          .map((id) => planks.find((p) => p.id === id)?.label)
                          .join(' → ')}
                      </p>
                      <p className="text-xs text-gray-600 font-semibold mt-2">Needed:</p>
                      <p className="text-sm text-green-700">
                        {correctOrder.map((p) => p.label).join(' → ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cross Bridge Button */}
        <div className="text-center mb-6">
          <button
            onClick={handleCrossBridge}
            disabled={!isAllPlaced}
            className={`px-8 py-4 rounded-lg font-bold text-white text-lg transition-all transform flex items-center gap-2 justify-center mx-auto ${
              isAllPlaced
                ? 'bg-cyan-600 hover:bg-cyan-700 scale-100 shadow-lg'
                : 'bg-gray-400 cursor-not-allowed scale-95 shadow-sm'
            }`}
          >
            <Zap size={24} />
            Cross Bridge ({currentOrder.length} / {planks.length})
          </button>
        </div>

        {/* Game Status */}
        {gameState === 'completed' && isSuccess && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-lg p-8 border-2 border-green-500"
          >
            <div className="flex items-center gap-4 mb-6">
              <CheckCircle size={48} className="text-green-500" />
              <h2 className="text-3xl font-bold text-gray-800">🎉 You Crossed the Bridge!</h2>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Order</p>
                <p className="text-3xl font-bold text-green-600">✓ Correct</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Planks Placed</p>
                <p className="text-3xl font-bold text-blue-600">{currentOrder.length}</p>
                <p className="text-xs text-blue-600">/ {planks.length}</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Accuracy</p>
                <p className="text-3xl font-bold text-purple-600">100%</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6 text-center">
              Excellent work! You've successfully ordered fractions in descending order!
              You now understand how to compare fractions with the same denominator.
              The avatar safely crossed the bridge! 🧑‍🦽
            </p>

            <button
              onClick={handleReset}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {gameState === 'completed' && !isSuccess && (
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-yellow-500">
            <div className="flex items-center gap-4 mb-6">
              <AlertCircle size={48} className="text-yellow-600" />
              <h2 className="text-3xl font-bold text-gray-800">⚠️ Bridge Collapsed!</h2>
            </div>

            <p className="text-gray-700 mb-6 text-center">
              Oh no! The bridge wasn't stable. Let's try again and make sure the planks
              are in the correct descending order.
            </p>

            <button
              onClick={handleReset}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FractionBridgeGame;
