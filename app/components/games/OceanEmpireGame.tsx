'use client';

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useOceanEmpireStore, formatIndian } from '@/app/store/useOceanEmpireStore';
import PlaceValuePhaseCanvas from './PlaceValuePhaseCanvas';
import MentalMathPhaseCanvas from './MentalMathPhaseCanvas';
import ComparisonPhaseCanvas from './ComparisonPhaseCanvas';

const OceanEmpireGame: React.FC = () => {
  const {
    phase,
    score,
    streak,
    challengeIndex,
    totalChallenges,
    isPhaseCorrect,
    showPhaseComplete,
    gameComplete,
    generateChallenge,
    nextChallenge,
    resetGame,
    dismissPhaseComplete,
    hintsRemaining,
    useHint,
    currentHint
  } = useOceanEmpireStore();

  useEffect(() => {
    generateChallenge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPhaseTitle = () => {
    switch (phase) {
      case 'placeValue':
        return '🐟 Phase 1: Fish Population Sorter';
      case 'mentalMath':
        return '🧮 Phase 2: Mental Math Deep Dive';
      case 'comparison':
        return '🏆 Phase 3: Ocean Zone Comparison';
    }
  };

  const getPhaseDescription = () => {
    switch (phase) {
      case 'placeValue':
        return 'Sort fish population digits into the correct place values!';
      case 'mentalMath':
        return 'Calculate fish population changes using mental math!';
      case 'comparison':
        return 'Order ocean zones by population from smallest to largest!';
    }
  };

  // Game Complete Screen
  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-700 to-cyan-600 flex items-center justify-center p-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-12 max-w-2xl text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-8xl mb-6"
          >
            🏆
          </motion.div>
          <h1 className="text-4xl font-bold text-blue-800 mb-4">
            Congratulations, Ocean Master!
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            You&apos;ve mastered large numbers in the Indian number system!
          </p>
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl p-6 mb-8">
            <p className="text-lg opacity-80">Final Score</p>
            <p className="text-5xl font-bold">{formatIndian(score)}</p>
            <p className="mt-2">Best Streak: {streak} 🔥</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xl font-bold rounded-xl shadow-lg"
          >
            🔄 Play Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-700 to-cyan-600 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              🌊 Ocean Number Empire
            </h1>
            <p className="text-blue-100 text-sm">CBSE Class 5 - Large Numbers</p>
          </div>
          
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-blue-200 text-xs">Score</p>
              <p className="text-2xl font-bold text-white">{formatIndian(score)}</p>
            </div>
            <div className="text-center">
              <p className="text-blue-200 text-xs">Streak</p>
              <p className="text-2xl font-bold text-yellow-400">{streak} 🔥</p>
            </div>
            <div className="text-center">
              <p className="text-blue-200 text-xs">Progress</p>
              <p className="text-2xl font-bold text-white">{challengeIndex + 1}/{totalChallenges}</p>
            </div>
          </div>
        </div>

        {/* Phase Header */}
        <div className="bg-white rounded-xl shadow-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{getPhaseTitle()}</h2>
              <p className="text-gray-600">{getPhaseDescription()}</p>
            </div>
            
            {/* Phase Progress */}
            <div className="flex gap-2">
              <div className={`w-24 h-2 rounded-full ${phase === 'placeValue' ? 'bg-blue-500' : 'bg-green-500'}`} />
              <div className={`w-24 h-2 rounded-full ${phase === 'mentalMath' ? 'bg-blue-500' : phase === 'comparison' ? 'bg-green-500' : 'bg-gray-300'}`} />
              <div className={`w-24 h-2 rounded-full ${phase === 'comparison' ? 'bg-blue-500' : 'bg-gray-300'}`} />
            </div>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-4">
          {phase === 'placeValue' && <PlaceValuePhaseCanvas />}
          {phase === 'mentalMath' && <MentalMathPhaseCanvas />}
          {phase === 'comparison' && <ComparisonPhaseCanvas />}
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-xl p-4">
          <div className="flex gap-4 items-center justify-between">
            <button
              onClick={useHint}
              disabled={hintsRemaining <= 0}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                hintsRemaining > 0
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              💡 Hint ({hintsRemaining} left)
            </button>

            {isPhaseCorrect && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextChallenge}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg"
              >
                {challengeIndex + 1 >= totalChallenges ? '🎉 Complete Phase!' : '➡️ Next Challenge'}
              </motion.button>
            )}
          </div>

          {/* Hint Display */}
          {currentHint && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded-lg"
            >
              <p className="text-yellow-800">
                💡 <strong>Hint:</strong> {currentHint}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Phase Complete Modal */}
      {showPhaseComplete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Phase Complete!
            </h2>
            <p className="text-gray-600 mb-6">
              {phase === 'placeValue' && 'Great job with place values! Time for mental math.'}
              {phase === 'mentalMath' && 'Excellent calculations! Final challenge awaits.'}
              {phase === 'comparison' && 'Amazing! You\'ve mastered large numbers!'}
            </p>
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <p className="text-blue-600">Current Score</p>
              <p className="text-3xl font-bold text-blue-800">{formatIndian(score)}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={dismissPhaseComplete}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl"
            >
              {phase === 'comparison' ? '🏆 See Results' : '➡️ Next Phase'}
            </motion.button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default OceanEmpireGame;
