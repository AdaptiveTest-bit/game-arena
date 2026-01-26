'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useFactorFactoryStore } from '@/app/store/useFactorFactoryStore';
import { FactorFactoryCanvas } from './FactorFactoryCanvas';
import { submitTelemetry } from '@/app/utils/gameUtils';
import { RotateCcw, Zap } from 'lucide-react';

export default function FactorFactoryGame() {
  const store = useFactorFactoryStore();
  const [celebrationTimeout, setCelebrationTimeout] = useState<NodeJS.Timeout | null>(null);

  // Handle game completion
  useEffect(() => {
    if (store.gameCompleted && store.gameState === 'playing') {
      // Wait 2 seconds before celebration
      const timeout = setTimeout(() => {
        store.startCelebration();
      }, 2000);
      setCelebrationTimeout(timeout);

      return () => clearTimeout(timeout);
    }
  }, [store.gameCompleted, store.gameState, store]);

  // Submit telemetry on celebration
  useEffect(() => {
    if (store.gameState === 'celebrating' && store.celebrationStarted) {
      const telemetry = store.getTelemetryLog();
      submitTelemetry(telemetry);
    }
  }, [store.gameState, store.celebrationStarted, store]);

  // Menu state
  if (store.gameState === 'menu') {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full animate-fade-in">
          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent mb-2">
                🏭 The Factor Factory
              </h1>
              <p className="text-slate-400 text-lg">Arrange Energy Cores into Rectangular Arrays</p>
            </div>

            {/* Mission Brief */}
            <div className="bg-slate-900 rounded-lg p-6 mb-6 border-l-4 border-orange-400">
              <h2 className="text-orange-300 font-bold text-lg mb-3">📋 Mission Brief</h2>
              <p className="text-slate-300 leading-relaxed">
                The starship's energy core has fractured into 12 identical Energy Cores. You must arrange them into all possible rectangular configurations to rebuild the factory. Each configuration represents a <strong>factor pair</strong> of 12!
              </p>
            </div>

            {/* Learning Goals */}
            <div className="bg-slate-900 rounded-lg p-6 mb-6">
              <h2 className="text-emerald-300 font-bold text-lg mb-4">🎯 Learning Goals</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold text-xl mt-1">✓</span>
                  <span className="text-slate-300">Understand <strong>factors</strong> as divisors that divide a number evenly</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold text-xl mt-1">✓</span>
                  <span className="text-slate-300">Visualize the <strong>Commutative Property</strong> (3×4 = 4×3)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold text-xl mt-1">✓</span>
                  <span className="text-slate-300">Identify <strong>Prime vs. Composite</strong> numbers using rectangles</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold text-xl mt-1">✓</span>
                  <span className="text-slate-300">Find all <strong>factor pairs</strong> systematically</span>
                </li>
              </ul>
            </div>

            {/* How to Play */}
            <div className="bg-slate-900 rounded-lg p-6 mb-8">
              <h2 className="text-blue-300 font-bold text-lg mb-4">🎮 How to Play</h2>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">1</span>
                  <span className="text-slate-300"><strong>Click and drag</strong> across the grid to select a rectangular area</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">2</span>
                  <span className="text-slate-300">The selected area <strong>must contain exactly 12 cells</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">3</span>
                  <span className="text-slate-300">Click <strong>"Add Blueprint"</strong> to save the rectangle</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">4</span>
                  <span className="text-slate-300"><strong>Find all possible rectangles</strong> to complete the factory!</span>
                </li>
              </ol>
            </div>

            {/* Start Button */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => store.startGame(12, false)}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition hover:scale-105 active:scale-95"
              >
                ▶ Start Game (Normal Mode)
              </button>
              <button
                onClick={() => store.startGame(12, true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition hover:scale-105 active:scale-95"
              >
                🔐 Strict Mode
              </button>
            </div>

            {/* Mode Description */}
            <p className="text-center text-slate-400 text-sm mt-4">
              <strong>Normal:</strong> 3×4 and 4×3 count as one | <strong>Strict:</strong> Find all ordered pairs
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Playing state
  if (store.gameState === 'playing') {
    const allFactorPairs = store.getAllFactorPairs(store.targetNumber);
    const targetCount = store.strictMode ? allFactorPairs.length : new Set(allFactorPairs.map((f) => [Math.min(f.width, f.height), Math.max(f.width, f.height)].join(','))).size;
    const accuracy = store.getAccuracy() * 100;

    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-slate-950 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-white mb-2">🏭 The Factor Factory</h1>
            <p className="text-slate-400">Find all rectangular arrangements of {store.targetNumber} Energy Cores</p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Canvas */}
            <div className="lg:col-span-3 bg-slate-800 rounded-2xl p-4 border border-slate-700 shadow-xl overflow-x-auto">
              <FactorFactoryCanvas
                width={800}
                height={600}
                targetNumber={store.targetNumber}
                currentSelection={store.currentSelection}
                onCellSelection={(w, h) => store.setCurrentSelection(w, h)}
                onSubmit={() => {
                  const success = store.submitRectangle();
                  if (success) {
                    store.clearSelection();
                  }
                }}
                isGameComplete={store.gameCompleted}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Stats */}
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <h3 className="font-bold text-slate-300 mb-3">📊 Progress</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-400">Accuracy</span>
                      <span className="text-sm font-bold text-emerald-400">{Math.round(accuracy)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-400 to-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${accuracy}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-slate-900 rounded p-2 text-center">
                      <div className="text-slate-400 text-xs">Blueprints</div>
                      <div className="text-xl font-bold text-blue-400">{store.foundFactors.length}</div>
                    </div>
                    <div className="bg-slate-900 rounded p-2 text-center">
                      <div className="text-slate-400 text-xs">Target</div>
                      <div className="text-xl font-bold text-amber-400">{targetCount}</div>
                    </div>
                  </div>
                  <div className="bg-slate-900 rounded p-2 text-center">
                    <div className="text-slate-400 text-xs">Attempts</div>
                    <div className="text-lg font-bold text-purple-400">{store.levelAttempts}</div>
                  </div>
                </div>
              </div>

              {/* Blueprints Found */}
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <h3 className="font-bold text-slate-300 mb-3">📋 Blueprints Found</h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {store.foundFactors.length === 0 ? (
                    <p className="text-slate-500 text-sm">No blueprints yet. Start dragging!</p>
                  ) : (
                    store.foundFactors.map((factor, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-900 rounded p-2 border-l-4 border-green-500"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">✓</span>
                          <span className="font-bold text-green-400">
                            {factor.width} × {factor.height}
                          </span>
                          <span className="text-slate-500">(= {factor.area})</span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const success = store.submitRectangle();
                    if (success) {
                      store.clearSelection();
                    }
                  }}
                  disabled={!store.currentSelection.isValid || store.gameCompleted}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Zap size={18} />
                  Add Blueprint
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    store.clearSelection();
                  }}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition flex items-center justify-center gap-2"
                >
                  <RotateCcw size={18} />
                  Clear Selection
                </motion.button>
              </div>

              {/* Hint */}
              <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3">
                <p className="text-blue-300 text-xs">
                  <strong>💡 Tip:</strong> {store.targetNumber} is a {allFactorPairs.length === 2 ? '🔴 Prime' : '🟢 Composite'} number with {targetCount} unique factor pair{targetCount !== 1 ? 's' : ''}!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Celebrating state
  if (store.gameState === 'celebrating') {
    const accuracy = store.getAccuracy() * 100;
    const allFactorPairs = store.getAllFactorPairs(store.targetNumber);
    const targetCount = store.strictMode ? allFactorPairs.length : new Set(allFactorPairs.map((f) => [Math.min(f.width, f.height), Math.max(f.width, f.height)].join(','))).size;

    const confettiEmojis = ['🏭', '✨', '🌟', '⭐', '🔷', '📐', '📏', '✓'];

    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Confetti */}
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 1,
              y: -20,
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
              rotate: 0,
            }}
            animate={{
              opacity: 0,
              y: (typeof window !== 'undefined' ? window.innerHeight : 600) + 100,
              rotate: 360,
            }}
            transition={{
              duration: 2 + Math.random() * 1,
              delay: Math.random() * 0.3,
              ease: 'easeIn',
            }}
            className="fixed pointer-events-none text-2xl"
          >
            {confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)]}
          </motion.div>
        ))}

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl text-center"
          >
            {/* Emoji */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 400 }}
              className="text-6xl mb-4"
            >
              🏭
            </motion.div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-emerald-400 mb-2">Factory Complete!</h1>
            <p className="text-slate-400 mb-6">You've found all the factor pairs!</p>

            {/* Accuracy Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-6"
            >
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-slate-300">Accuracy</span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="text-sm font-bold text-emerald-400"
                >
                  {Math.round(accuracy)}%
                </motion.span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${accuracy}%` }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="bg-gradient-to-r from-emerald-400 to-green-500 h-3 rounded-full"
                />
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-3 mb-6"
            >
              <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
                <div className="text-xs text-slate-400">Blueprints</div>
                <div className="text-2xl font-bold text-blue-400">{store.foundFactors.length}</div>
              </div>
              <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
                <div className="text-xs text-slate-400">Total Found</div>
                <div className="text-2xl font-bold text-amber-400">{targetCount}</div>
              </div>
              <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
                <div className="text-xs text-slate-400">Attempts</div>
                <div className="text-2xl font-bold text-purple-400">{store.levelAttempts}</div>
              </div>
            </motion.div>

            {/* Status */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="bg-emerald-900/30 border border-emerald-700/50 rounded-lg p-3 mb-6"
            >
              <p className="text-emerald-300 font-bold">✓ All Rectangles Found!</p>
              <p className="text-emerald-400 text-sm">
                {store.targetNumber} is a {allFactorPairs.length === 2 ? '🔴 Prime' : '🟢 Composite'} number
              </p>
            </motion.div>

            {/* Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  store.resetGame();
                  store.startGame(12, store.strictMode);
                }}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 rounded-lg shadow-lg transition"
              >
                🔄 Try Again
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  store.resetGame();
                  useFactorFactoryStore.setState({ gameState: 'menu' });
                }}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg shadow-lg transition"
              >
                ← Back
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }
}
