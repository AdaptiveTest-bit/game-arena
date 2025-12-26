'use client';

import React, { useEffect, useState } from 'react';
import { useCargoCaptainStore } from '@/app/store/useCargoCaptainStore';
import { CargoCaptainCanvas } from './CargoCaptainCanvas';
import { submitTelemetry } from '@/app/utils/gameUtils';
import { motion } from 'framer-motion';
import { RotateCcw, Copy, CheckCircle } from 'lucide-react';
import { useSpring, animated } from '@react-spring/web';

export default function CargoCaptainGame() {
  const store = useCargoCaptainStore();
  const [celebrationTimeout, setCelebrationTimeout] = useState<NodeJS.Timeout | null>(null);
  const [guessInput, setGuessInput] = useState<string>('');

  // Handle game completion
  useEffect(() => {
    if (store.gameCompleted && store.gameState === 'packing') {
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full"
        >
          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                ⛴️ The Cargo Captain
              </h1>
              <p className="text-slate-400 text-lg">Master Volume Calculation & 3D Packing</p>
            </div>

            {/* Mission Brief */}
            <div className="bg-slate-900 rounded-lg p-6 mb-6 border-l-4 border-cyan-400">
              <h2 className="text-cyan-300 font-bold text-lg mb-3">📋 Mission Brief</h2>
              <p className="text-slate-300 leading-relaxed">
                Captain! A merchant ship needs its cargo container loaded. Your job is to calculate the total volume (L × B × H), estimate how many crates fit, then pack them layer by layer to verify your calculation!
              </p>
            </div>

            {/* Learning Goals */}
            <div className="bg-slate-900 rounded-lg p-6 mb-6">
              <h2 className="text-emerald-300 font-bold text-lg mb-4">🎯 Learning Goals</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold text-xl mt-1">✓</span>
                  <span className="text-slate-300">Understand <strong>Volume</strong> as the total space occupied (L×B×H)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold text-xl mt-1">✓</span>
                  <span className="text-slate-300">Transition from <strong>Counting Cubes</strong> (concrete) to <strong>Formula Application</strong> (abstract)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold text-xl mt-1">✓</span>
                  <span className="text-slate-300">Apply the concept that <strong>Base Area × Height = Volume</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold text-xl mt-1">✓</span>
                  <span className="text-slate-300">Develop <strong>spatial reasoning</strong> through 3D layer-by-layer packing</span>
                </li>
              </ul>
            </div>

            {/* How to Play */}
            <div className="bg-slate-900 rounded-lg p-6 mb-8">
              <h2 className="text-blue-300 font-bold text-lg mb-4">🎮 How to Play</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">1</span>
                  <span className="text-slate-300"><strong>Estimation Mode:</strong> Predict the container's volume (L × B × H)</span>
                </div>
                <div className="flex gap-3">
                  <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">2</span>
                  <span className="text-slate-300"><strong>Packing Mode:</strong> Click cells in the grid to pack crates layer by layer</span>
                </div>
                <div className="flex gap-3">
                  <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">3</span>
                  <span className="text-slate-300"><strong>Layer Replication:</strong> Once one layer is full, replicate it to fill all heights</span>
                </div>
                <div className="flex gap-3">
                  <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">4</span>
                  <span className="text-slate-300"><strong>Captain's Badge:</strong> Earn a bonus if your volume estimate was correct!</span>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => store.generateLevel()}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition"
            >
              ⚓ Set Sail!
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Estimation state
  if (store.gameState === 'estimating') {
    const targetVolume = store.getTargetVolume();

    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-slate-950 p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-cyan-400 mb-4">📊 Volume Estimation</h2>
              <p className="text-slate-300 mb-6">Before packing, estimate the container's total volume!</p>

              {/* Container Dimensions Display */}
              <div className="bg-slate-900 rounded-lg p-6 mb-6 border border-slate-700">
                <div className="text-6xl font-bold text-blue-400 mb-4">
                  {store.containerLength}m × {store.containerBreadth}m × {store.containerHeight}m
                </div>
                <p className="text-slate-400 text-sm">Length × Breadth × Height</p>
                <p className="text-slate-500 text-xs mt-2">Formula: V = L × B × H</p>
              </div>

              {/* Hint Box */}
              <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 mb-6">
                <p className="text-blue-300 text-sm">
                  <strong>💡 Hint:</strong> Multiply the three dimensions together to find the total volume.
                </p>
              </div>

              {/* Input Field */}
              <div className="mb-6">
                <label className="block text-slate-300 font-semibold mb-2">What's your volume estimate?</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={guessInput}
                    onChange={(e) => setGuessInput(e.target.value)}
                    placeholder="Enter your guess (e.g., 24)"
                    className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const guess = parseInt(guessInput);
                      if (!isNaN(guess)) {
                        store.setVolumeGuess(guess);
                        store.submitGuess();
                      }
                    }}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition"
                  >
                    Submit Guess
                  </motion.button>
                </div>
              </div>

              {/* Captain's Badge Info */}
              <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-3">
                <p className="text-amber-300 text-sm">
                  <strong>🏅 Captain's Badge:</strong> Guess the exact volume correctly to earn a special bonus!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Packing state
  if (store.gameState === 'packing') {
    const currentLayerCells = store.layersCellsPackaged[store.currentLayer];
    const cellsInLayer = store.getCellsInLayer();
    const filledCells = currentLayerCells.filter((c) => c).length;
    const layerComplete = filledCells === cellsInLayer;

    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-slate-950 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-white mb-2">⛴️ The Cargo Captain</h1>
            <p className="text-slate-400">Pack crates layer by layer to fill the container</p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Canvas */}
            <div className="lg:col-span-3 bg-slate-800 rounded-2xl p-4 border border-slate-700 shadow-xl overflow-x-auto">
              <CargoCaptainCanvas
                length={store.containerLength}
                breadth={store.containerBreadth}
                height={store.containerHeight}
                currentLayer={store.currentLayer}
                cellsPackaged={currentLayerCells}
                onCellClick={(idx) => store.toggleCellInLayer(idx)}
                isGameComplete={store.gameCompleted}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Estimation Result */}
              {store.volumeGuess !== null && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl p-4 border ${
                    store.guessCorrect
                      ? 'bg-emerald-900/30 border-emerald-700/50'
                      : 'bg-amber-900/30 border-amber-700/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={store.guessCorrect ? 'text-emerald-400' : 'text-amber-400'}>
                      {store.guessCorrect ? '✓' : '○'}
                    </span>
                    <span className={`font-bold ${store.guessCorrect ? 'text-emerald-300' : 'text-amber-300'}`}>
                      Your Guess: {store.volumeGuess}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">
                    Actual Volume: <span className="font-bold text-cyan-400">{store.getTargetVolume()}</span>
                  </p>
                  {store.guessCorrect && (
                    <div className="mt-2 pt-2 border-t border-emerald-700/50">
                      <p className="text-emerald-300 text-sm font-bold">🏅 Captain's Badge Earned!</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Layer Progress */}
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <h3 className="font-bold text-slate-300 mb-3">📦 Layer Progress</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-400">Layer {store.currentLayer + 1} / {store.containerHeight}</span>
                      <span className="text-sm font-bold text-cyan-400">{filledCells} / {cellsInLayer} crates</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(filledCells / cellsInLayer) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Layer Stack Visualization */}
                  <div className="grid grid-cols-4 gap-1 mt-4">
                    {Array.from({ length: store.containerHeight }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-8 rounded-sm border ${
                          idx < store.currentLayer
                            ? 'bg-emerald-500 border-emerald-600'
                            : idx === store.currentLayer
                            ? 'bg-cyan-500 border-cyan-600'
                            : 'bg-slate-700 border-slate-600'
                        }`}
                        title={`Layer ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {layerComplete ? (
                  <>
                    {store.currentLayer === store.containerHeight - 1 ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          store.advanceToNextLayer();
                        }}
                        className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={18} />
                        Complete Packing
                      </motion.button>
                    ) : (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => store.replicateLayer()}
                          className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition flex items-center justify-center gap-2"
                        >
                          <Copy size={18} />
                          Replicate Layer (Auto-fill remaining)
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => store.advanceToNextLayer()}
                          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={18} />
                          Next Layer
                        </motion.button>
                      </>
                    )}
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled
                    className="w-full bg-slate-700 text-slate-400 font-bold py-3 px-4 rounded-lg shadow-lg cursor-not-allowed opacity-50 transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Fill layer to continue...
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => store.resetCurrentLayer()}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition flex items-center justify-center gap-2"
                >
                  <RotateCcw size={18} />
                  Reset Layer
                </motion.button>
              </div>

              {/* Info */}
              <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3">
                <p className="text-blue-300 text-xs">
                  <strong>💡 Tip:</strong> Fill all {cellsInLayer} cells in this layer, then move to the next one!
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
    const confettiEmojis = ['⛴️', '📦', '✨', '🌟', '⭐', '🎯', '📐', '✓'];

    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Confetti */}
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 1,
              y: -20,
              x: Math.random() * window.innerWidth,
              rotate: 0,
            }}
            animate={{
              opacity: 0,
              y: window.innerHeight + 100,
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
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
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
              ⛴️
            </motion.div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-cyan-400 mb-2">Cargo Loaded!</h1>
            <p className="text-slate-400 mb-6">Your container is fully packed!</p>

            {/* Accuracy Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-6"
            >
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-slate-300">Completion</span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="text-sm font-bold text-cyan-400"
                >
                  {Math.round(accuracy)}%
                </motion.span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${accuracy}%` }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full"
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
                <div className="text-xs text-slate-400">Dimensions</div>
                <div className="text-xl font-bold text-cyan-400">
                  {store.containerLength}×{store.containerBreadth}×{store.containerHeight}
                </div>
              </div>
              <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
                <div className="text-xs text-slate-400">Volume</div>
                <div className="text-2xl font-bold text-blue-400">{store.getTargetVolume()}</div>
              </div>
              <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
                <div className="text-xs text-slate-400">Layers</div>
                <div className="text-2xl font-bold text-purple-400">{store.containerHeight}</div>
              </div>
            </motion.div>

            {/* Status */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="bg-cyan-900/30 border border-cyan-700/50 rounded-lg p-3 mb-6"
            >
              <p className="text-cyan-300 font-bold">✓ Container Full!</p>
              {store.captainsBadgeEarned && (
                <p className="text-amber-300 font-bold mt-1">🏅 Captain's Badge Earned!</p>
              )}
              <p className="text-cyan-400 text-sm">
                {store.containerLength} × {store.containerBreadth} × {store.containerHeight} = {store.getTargetVolume()} crates
              </p>
            </motion.div>

            {/* Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  store.resetGame();
                }}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 rounded-lg shadow-lg transition"
              >
                ⚓ Next Shipment
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  store.resetGame();
                  useCargoCaptainStore.setState({ gameState: 'menu' });
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
