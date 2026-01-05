'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBeachSafariStore } from '@/app/store/useBeachSafariStore';
import ShapeSorterCanvas from './ShapeSorterCanvas';
import LengthCompareCanvas from './LengthCompareCanvas';
import BucketCounterCanvas from './BucketCounterCanvas';
import ShellBalanceCanvas from './ShellBalanceCanvas';

const BeachSafariGame: React.FC = () => {
  const {
    phase,
    score,
    streak,
    stars,
    challengeIndex,
    totalChallenges,
    showPhaseComplete,
    gameComplete,
    hintsRemaining,
    currentHint,
    generateChallenge,
    advancePhase,
    nextChallenge,
    resetGame,
    dismissPhaseComplete,
    useHint,
    isPhaseCorrect
  } = useBeachSafariStore();

  useEffect(() => {
    generateChallenge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPhaseTitle = () => {
    switch (phase) {
      case 'sorting': return '🐚 Shape Sorter Beach';
      case 'length': return '📏 Length Detective';
      case 'counting': return '🪣 Bucket Filler';
      case 'balance': return '⚖️ Shell Balance';
    }
  };

  const getPhaseDescription = () => {
    switch (phase) {
      case 'sorting': return 'Sort the beach treasures by shape! Drag round things to the round bin and long things to the long bin.';
      case 'length': return 'Look at the objects. Which one is longer? Which one is shorter? Tap to answer!';
      case 'counting': return 'Count carefully and put the exact number of items in the bucket!';
      case 'balance': return 'Look at the balance scale. Which side has more? Which has less? Or are they equal?';
    }
  };

  const getPhaseNumber = () => {
    switch (phase) {
      case 'sorting': return 1;
      case 'length': return 2;
      case 'counting': return 3;
      case 'balance': return 4;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-yellow-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl">🏖️</span>
              <div>
                <h1 className="text-2xl font-bold text-amber-800">Beach Shape Safari</h1>
                <p className="text-amber-600 text-sm">Help Coco the Crab sort beach treasures!</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Stars */}
              <div className="text-center">
                <div className="text-2xl">{'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}</div>
                <p className="text-xs text-gray-500">Stars</p>
              </div>
              
              {/* Score */}
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl px-4 py-2 text-center">
                <p className="text-2xl font-bold">{score}</p>
                <p className="text-xs opacity-80">Points</p>
              </div>
              
              {/* Streak */}
              {streak > 1 && (
                <div className="bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-xl px-3 py-2 text-center">
                  <p className="text-lg font-bold">🔥 {streak}</p>
                  <p className="text-xs opacity-80">Streak</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Phase Info */}
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-amber-700">{getPhaseTitle()}</h2>
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                Phase {getPhaseNumber()}/4
              </span>
              {phase !== 'sorting' && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Round {challengeIndex + 1}/{totalChallenges}
                </span>
              )}
            </div>
          </div>
          <p className="text-gray-600">{getPhaseDescription()}</p>
        </div>

        {/* Coco's Hint */}
        <AnimatePresence>
          {currentHint && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-orange-100 to-yellow-100 border-2 border-orange-300 rounded-2xl p-4 mb-4 flex items-center gap-4"
            >
              <span className="text-4xl">🦀</span>
              <p className="text-orange-800 font-medium">{currentHint}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Canvas */}
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl overflow-hidden mb-4">
          {phase === 'sorting' && <ShapeSorterCanvas />}
          {phase === 'length' && <LengthCompareCanvas />}
          {phase === 'counting' && <BucketCounterCanvas />}
          {phase === 'balance' && <ShellBalanceCanvas />}
        </div>

        {/* Controls */}
        <div className="flex gap-4">
          <button
            onClick={useHint}
            disabled={hintsRemaining === 0}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold ${
              hintsRemaining > 0
                ? 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span className="text-xl">💡</span>
            Hint ({hintsRemaining})
          </button>

          {phase !== 'sorting' && isPhaseCorrect && (
            <button
              onClick={nextChallenge}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl"
            >
              Next Challenge →
            </button>
          )}

          <button
            onClick={resetGame}
            className="px-4 py-3 rounded-xl font-bold bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            🔄 Restart
          </button>
        </div>

        {/* Phase Complete Modal */}
        <AnimatePresence>
          {showPhaseComplete && !gameComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl"
              >
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-amber-800 mb-2">
                  {getPhaseTitle()} Complete!
                </h2>
                <p className="text-gray-600 mb-6">
                  Great job! You earned {score} points so far!
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      dismissPhaseComplete();
                      advancePhase();
                    }}
                    className="flex-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold py-3 px-6 rounded-xl hover:from-amber-500 hover:to-orange-600"
                  >
                    Continue to Next Phase →
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Complete Modal */}
        <AnimatePresence>
          {gameComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                className="bg-gradient-to-b from-yellow-100 to-orange-100 rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl border-4 border-yellow-400"
              >
                <div className="text-7xl mb-4">🏆</div>
                <h2 className="text-3xl font-bold text-amber-800 mb-2">
                  Beach Shape Master!
                </h2>
                <p className="text-amber-700 mb-4">
                  Amazing! You completed all challenges!
                </p>
                <div className="bg-white/80 rounded-xl p-4 mb-6">
                  <p className="text-4xl font-bold text-amber-600">{score} Points</p>
                  <p className="text-gray-600">Final Score</p>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={resetGame}
                    className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold py-3 px-6 rounded-xl hover:from-green-500 hover:to-emerald-600"
                  >
                    🎮 Play Again
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BeachSafariGame;
