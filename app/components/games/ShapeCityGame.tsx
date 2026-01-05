'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useShapeCityStore } from '../../store/useShapeCityStore';
import ShapeDetectorCanvas from './ShapeDetectorCanvas';
import GroupCounterCanvas from './GroupCounterCanvas';
import ShapeCityPatternCanvas from './ShapeCityPatternCanvas';
import CityConstructorCanvas from './CityConstructorCanvas';

interface ShapeCityGameProps {
  onBack: () => void;
}

const phaseInfo = {
  'shape-detector': {
    title: 'Shape Detective 🔍',
    description: 'Find all the hidden shapes in the city scene! Tap on shapes that match the target.',
    icon: '🏙️'
  },
  'group-counter': {
    title: 'Group Counter 🔢',
    description: 'Count items by grouping them! How many complete groups can you make?',
    icon: '📦'
  },
  'pattern-builder': {
    title: 'Pattern Builder 🎨',
    description: 'Complete the pattern! Select a shape and place it in the empty slot.',
    icon: '🧩'
  },
  'city-constructor': {
    title: 'City Constructor 🏗️',
    description: 'Build amazing structures! Match blocks to their outlines to complete the building.',
    icon: '🏛️'
  }
};

export default function ShapeCityGame({ onBack }: ShapeCityGameProps) {
  const {
    phase,
    score,
    totalScore,
    streak,
    level,
    showInstructions,
    showSuccess,
    showHint,
    hintMessage,
    showHintMessage,
    hideHint,
    nextChallenge,
    resetGame,
    dismissInstructions,
    dismissSuccess
  } = useShapeCityStore();

  const renderPhaseCanvas = () => {
    switch (phase) {
      case 'shape-detector':
        return <ShapeDetectorCanvas />;
      case 'group-counter':
        return <GroupCounterCanvas />;
      case 'pattern-builder':
        return <ShapeCityPatternCanvas />;
      case 'city-constructor':
        return <CityConstructorCanvas />;
      default:
        return null;
    }
  };

  const currentPhaseInfo = phaseInfo[phase];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-200 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={onBack}
            className="bg-white/80 hover:bg-white px-4 py-2 rounded-full font-bold text-gray-700 shadow-lg transition-all hover:scale-105"
          >
            ← Back
          </button>
          
          <div className="flex gap-3 items-center">
            <div className="bg-yellow-400 px-4 py-2 rounded-full font-bold text-yellow-900 shadow-lg">
              ⭐ {score}
            </div>
            <div className="bg-purple-500 px-4 py-2 rounded-full font-bold text-white shadow-lg">
              🏆 {totalScore}
            </div>
            <div className="bg-orange-400 px-4 py-2 rounded-full font-bold text-orange-900 shadow-lg">
              🔥 {streak}
            </div>
            <div className="bg-blue-500 px-4 py-2 rounded-full font-bold text-white shadow-lg">
              Lv.{level}
            </div>
          </div>
        </div>

        {/* Phase Title */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
            {currentPhaseInfo.icon} {currentPhaseInfo.title}
          </h1>
        </div>

        {/* Game Canvas */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {renderPhaseCanvas()}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={showHintMessage}
            className="bg-amber-400 hover:bg-amber-500 px-6 py-3 rounded-full font-bold text-amber-900 shadow-lg transition-all hover:scale-105"
          >
            💡 Hint
          </button>
          <button
            onClick={resetGame}
            className="bg-red-400 hover:bg-red-500 px-6 py-3 rounded-full font-bold text-white shadow-lg transition-all hover:scale-105"
          >
            🔄 Reset
          </button>
        </div>

        {/* Mayor Bot Helper */}
        <div className="fixed bottom-4 right-4 flex items-end gap-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl p-3 shadow-xl max-w-xs"
          >
            <p className="text-gray-700 text-sm font-medium">
              🏗️ Welcome to Shape City! I&apos;m Mayor Bot. Find shapes, count in groups, and help build our city!
            </p>
          </motion.div>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-6xl"
          >
            🤖
          </motion.div>
        </div>
      </div>

      {/* Instructions Modal */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-white rounded-3xl p-8 max-w-md text-center shadow-2xl"
            >
              <div className="text-6xl mb-4">{currentPhaseInfo.icon}</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {currentPhaseInfo.title}
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                {currentPhaseInfo.description}
              </p>
              <button
                onClick={dismissInstructions}
                className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:scale-105 transition-transform"
              >
                Let&apos;s Build! 🏙️
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-gradient-to-br from-yellow-300 to-orange-400 rounded-3xl p-8 max-w-md text-center shadow-2xl"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-7xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Amazing Work!
              </h2>
              <p className="text-white/90 mb-4 text-lg">
                You&apos;re a true Shape City architect!
              </p>
              <div className="bg-white/30 rounded-xl p-4 mb-6">
                <p className="text-white font-bold text-xl">
                  +{score} points earned!
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    dismissSuccess();
                    nextChallenge();
                  }}
                  className="bg-white text-orange-600 px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:scale-105 transition-transform"
                >
                  Next Challenge →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint Modal */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
            onClick={hideHint}
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              className="bg-gradient-to-br from-amber-100 to-yellow-200 rounded-3xl p-6 max-w-sm text-center shadow-2xl border-4 border-amber-400"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-5xl mb-3">💡</div>
              <h3 className="text-xl font-bold text-amber-800 mb-3">Hint</h3>
              <p className="text-amber-900 mb-4">{hintMessage}</p>
              <button
                onClick={hideHint}
                className="bg-amber-500 text-white px-6 py-2 rounded-full font-bold hover:bg-amber-600 transition-colors"
              >
                Got it!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
