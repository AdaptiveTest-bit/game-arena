'use client';

import React, { useEffect, useState } from 'react';
import { usePatternDetectiveStore } from '@/app/store/usePatternDetectiveStore';
import PatternDiscoveryCanvas from './PatternDiscoveryCanvas';
import PatternBuilderCanvas from './PatternBuilderCanvas';
import PatternCreatorCanvas from './PatternCreatorCanvas';

const PatternDetectiveGame: React.FC = () => {
  const {
    phase,
    generateChallenge,
    generateBuilderChallenge,
    advancePhase,
    resetGame,
    isPhaseCorrect,
    score,
    hintsUsed,
    patternRule,
  } = usePatternDetectiveStore();

  const [gameState, setGameState] = useState<'ready' | 'playing' | 'completed'>('ready');
  const [modalDismissedForPhase, setModalDismissedForPhase] = useState<string | null>(null);

  // Initialize game on mount
  useEffect(() => {
    if (gameState === 'ready') {
      generateChallenge();
      setGameState('playing');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Derive modal visibility: show when phase correct AND we haven't dismissed it yet for this phase
  const shouldShowModal = isPhaseCorrect && gameState === 'playing' && modalDismissedForPhase !== phase;

  // Compute the modal message based on current phase
  const getModalMessage = () => {
    if (phase === 'discovery') {
      return `🎉 Correct! The pattern was: ${patternRule.operation}${patternRule.operand}`;
    } else if (phase === 'builder') {
      return '🎉 Excellent! You built the sequence correctly!';
    } else if (phase === 'creator') {
      return '🎨 Amazing! You created your own pattern!';
    }
    return '';
  };

  const handleContinue = () => {
    setModalDismissedForPhase(phase);
    
    if (phase === 'creator') {
      setGameState('completed');
    } else if (phase === 'discovery') {
      generateBuilderChallenge();
      advancePhase();
    } else {
      advancePhase();
    }
  };

  const handlePlayAgain = () => {
    resetGame();
    setModalDismissedForPhase(null);
    setGameState('ready');
    generateChallenge();
    setGameState('playing');
  };

  if (gameState === 'completed') {
    return (
      <div className="w-full max-w-5xl mx-auto p-6">
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border-4 border-purple-500 p-8 text-center">
          <h1 className="text-4xl font-bold text-purple-700 mb-4">🎉 Pattern Master! 🎉</h1>
          <p className="text-xl text-purple-600 mb-6">
            You completed all pattern challenges!
          </p>
          <div className="bg-white rounded-lg p-6 mb-6 inline-block">
            <p className="text-lg font-semibold text-gray-800 mb-2">Final Score: {score}</p>
            <p className="text-gray-700">Hints Used: {hintsUsed}</p>
            <p className="text-gray-700 mt-2">
              {hintsUsed === 0 ? '⭐ Perfect - No hints used!' : hintsUsed <= 2 ? '👍 Good job!' : '💪 Keep practicing!'}
            </p>
          </div>
          <button
            onClick={handlePlayAgain}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg text-white">
        <h1 className="text-3xl font-bold">🔍 Pattern Detective</h1>
        <p className="text-purple-100 mt-1">Discover, build, and create number patterns!</p>
      </div>

      {/* Phase Indicator */}
      <div className="mb-4 flex gap-2 justify-center">
        {['Discovery', 'Builder', 'Creator'].map((label, idx) => {
          const phases: Array<'discovery' | 'builder' | 'creator' | 'completed'> = [
            'discovery',
            'builder',
            'creator',
          ];
          const isActive = phase === phases[idx];
          const phaseIndex = phases.indexOf(phase);
          const isCompleted = phaseIndex > idx;

          return (
            <div
              key={label}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                isCompleted
                  ? 'bg-green-500 text-white'
                  : isActive
                    ? 'bg-purple-600 text-white scale-105'
                    : 'bg-gray-300 text-gray-600'
              }`}
            >
              {isCompleted ? '✓' : idx + 1}. {label}
            </div>
          );
        })}
      </div>

      {/* Score Display */}
      <div className="mb-4 text-center">
        <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold">
          ⭐ Score: {score}
        </span>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg border border-gray-300 p-6 mb-6">
        {phase === 'discovery' && <PatternDiscoveryCanvas />}
        {phase === 'builder' && <PatternBuilderCanvas />}
        {phase === 'creator' && <PatternCreatorCanvas />}
      </div>

      {/* Modal */}
      {shouldShowModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
            <p className="text-2xl font-bold mb-4">{getModalMessage()}</p>
            <button
              onClick={handleContinue}
              className="w-full py-3 px-4 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600 transition-all"
            >
              {phase === 'creator' ? 'Complete Game' : 'Continue to Next Phase'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatternDetectiveGame;
