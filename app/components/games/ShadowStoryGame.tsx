'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useShadowStoryStore } from '../../store/useShadowStoryStore';
import ShadowSpotterCanvas from './ShadowSpotterCanvas';
import BundleBuilderCanvas from './BundleBuilderCanvas';
import PlaceValuePalaceCanvas from './PlaceValuePalaceCanvas';
import VillageCounterCanvas from './VillageCounterCanvas';

interface ShadowStoryGameProps {
  onBack?: () => void;
}

const phaseInfo = {
  'shadow-spotter': {
    title: 'Shadow Spotter 🌙',
    description: 'Find shapes hiding in the shadows! Tap to reveal, then drag to the matching bucket.',
    icon: '👀'
  },
  'bundle-builder': {
    title: 'Bundle Builder 💎',
    description: 'Collect gems and group them into bundles of 10. Drag gems to the glowing zone!',
    icon: '📦'
  },
  'place-value': {
    title: 'Place Value Palace 🏰',
    description: 'Show the number using tens and ones. How many groups of 10? How many extras?',
    icon: '🔢'
  },
  'village-counter': {
    title: 'Village Counter 🏘️',
    description: 'Count all the gems in Shadow Village by skip counting in 10s!',
    icon: '✨'
  },
};

const LUMINA_HINTS = {
  'shadow-spotter': {
    intro: "Can you find my shape gems hiding in the shadows? Tap to reveal them! 🌙",
    success: "You found all my shapes! You have amazing shadow vision! ✨"
  },
  'bundle-builder': {
    intro: "Help me gather 10 gems at a time to make magical bundles! 💎",
    success: "Perfect bundles! You're a grouping genius!"
  },
  'place-value': {
    intro: "Can you show me this number using tens and ones? 🏰",
    success: "You're a Place Value Pro! ⭐"
  },
  'village-counter': {
    intro: "Let's count all the gems in Shadow Village by 10s! 🏘️",
    success: "We counted them all! The village is glowing bright! 🌟"
  }
};

export default function ShadowStoryGame({ onBack }: ShadowStoryGameProps) {
  const {
    phase,
    level,
    score,
    stars,
    showPhaseComplete,
    showGameComplete,
    nextPhase,
    resetGame,
  } = useShadowStoryStore();

  const currentPhaseInfo = phaseInfo[phase];
  const currentHints = LUMINA_HINTS[phase];

  const renderPhaseCanvas = () => {
    switch (phase) {
      case 'shadow-spotter':
        return <ShadowSpotterCanvas />;
      case 'bundle-builder':
        return <BundleBuilderCanvas />;
      case 'place-value':
        return <PlaceValuePalaceCanvas />;
      case 'village-counter':
        return <VillageCounterCanvas />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-2xl p-4 mb-4 border border-purple-500/30">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-purple-200">
                {currentPhaseInfo.icon} {currentPhaseInfo.title}
              </h1>
              <p className="text-sm text-purple-300/70">Level {level}</p>
            </div>
            <div className="text-right">
              <p className="text-yellow-400 font-bold text-xl">⭐ {stars}</p>
              <p className="text-purple-300 text-sm">Score: {score}</p>
            </div>
          </div>
        </div>

        {/* Lumina Helper */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-violet-900/40 to-purple-900/40 rounded-xl p-3 mb-4 border border-violet-400/30"
        >
          <div className="flex items-center gap-3">
            <div className="text-4xl">🌟</div>
            <div>
              <p className="font-semibold text-violet-300">Lumina says:</p>
              <p className="text-violet-200/80 text-sm">{currentHints.intro}</p>
            </div>
          </div>
        </motion.div>

        {/* Game Canvas */}
        <div className="bg-[#1a1a2e] rounded-2xl overflow-hidden shadow-2xl border border-purple-500/20">
          {renderPhaseCanvas()}
        </div>

        {/* Instructions */}
        <div className="mt-4 text-center">
          <p className="text-purple-300/60 text-sm">{currentPhaseInfo.description}</p>
        </div>

        {/* Phase Complete Modal */}
        <AnimatePresence>
          {showPhaseComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl p-8 max-w-md mx-4 text-center border-2 border-yellow-400/50 shadow-2xl"
              >
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold text-yellow-400 mb-2">Phase Complete!</h2>
                <p className="text-purple-200 mb-4">{currentHints.success}</p>
                <div className="flex justify-center gap-2 mb-6">
                  {[...Array(3)].map((_, i) => (
                    <span key={i} className={`text-3xl ${i < stars ? '' : 'opacity-30'}`}>⭐</span>
                  ))}
                </div>
                <p className="text-purple-300 mb-6">Score: {score} points</p>
                <button
                  onClick={nextPhase}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-purple-900 font-bold px-8 py-3 rounded-xl transition-all transform hover:scale-105"
                >
                  Next Phase →
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Complete Modal */}
        <AnimatePresence>
          {showGameComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                className="bg-gradient-to-br from-yellow-600 via-purple-900 to-indigo-900 rounded-3xl p-8 max-w-md mx-4 text-center border-2 border-yellow-400 shadow-2xl"
              >
                <div className="text-7xl mb-4">🏆</div>
                <h2 className="text-4xl font-bold text-yellow-400 mb-2">Shadow Master!</h2>
                <p className="text-purple-200 mb-4">
                  You&apos;ve restored light to the Shadow Village!
                </p>
                <div className="flex justify-center gap-2 mb-4">
                  {[...Array(stars)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: i * 0.2 }}
                      className="text-4xl"
                    >
                      ⭐
                    </motion.span>
                  ))}
                </div>
                <p className="text-2xl text-yellow-300 font-bold mb-6">Final Score: {score}</p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={resetGame}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-6 py-3 rounded-xl transition-all"
                  >
                    Play Again
                  </button>
                  {onBack && (
                    <button
                      onClick={onBack}
                      className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-6 py-3 rounded-xl transition-all"
                    >
                      Back to Menu
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
