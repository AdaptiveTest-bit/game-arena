'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useFractionFusionStore } from '@/app/store/useFractionFusionStore';
import { submitTelemetry } from '@/app/utils/gameUtils';
import FractionFusionCanvas from './FractionFusionCanvas';
import { RotateCcw, Trophy, ChevronRight, Home, Calculator } from 'lucide-react';

const FractionFusionGame: React.FC = () => {
  const {
    startGame,
    selectAnswer,
    nextChallenge,
    resetGame,
    gameCompleted,
    currentLevel,
    challenges,
    currentChallengeIndex,
    selectedAnswer,
    score,
    getTelemetryLog,
    getAccuracy,
  } = useFractionFusionStore();

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'completed'>('menu');

  // Initialize game on mount
  useEffect(() => {
    if (gameState === 'menu') {
      startGame(1);
    }
  }, [gameState, startGame]);

  // Handle answer selection
  const handleAnswerSelect = useCallback((answer: string) => {
    if (selectedAnswer !== null) return;
    
    selectAnswer(answer);
    
    // Move to next challenge after delay
    setTimeout(() => {
      nextChallenge();
    }, 1500);
  }, [selectedAnswer, selectAnswer, nextChallenge]);

  // Submit telemetry on completion
  useEffect(() => {
    if (gameCompleted && gameState === 'playing') {
      const telemetryLog = getTelemetryLog();
      submitTelemetry(telemetryLog);
      setGameState('completed');
    }
  }, [gameCompleted, gameState, getTelemetryLog]);

  const handleStartLevel = (level: number) => {
    startGame(level);
    setGameState('playing');
  };

  const handleReset = () => {
    resetGame();
    setGameState('menu');
  };

  const handleContinue = () => {
    if (currentLevel < 3) {
      startGame(currentLevel + 1);
      setGameState('playing');
    } else {
      handleReset();
    }
  };

  const accuracy = getAccuracy();
  const currentChallenge = challenges[currentChallengeIndex];

  // Level selection menu
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-pink-700 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">⚛️ Fraction Fusion</h1>
            <p className="text-xl text-gray-100">
              Master fractions through fusion power! Learn all operations
            </p>
          </div>

          {/* Level Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Level 1 */}
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                 onClick={() => handleStartLevel(1)}>
              <div className="bg-gradient-to-r from-purple-400 to-violet-500 p-6 text-white">
                <div className="text-5xl mb-3">➕</div>
                <h2 className="text-2xl font-bold">Level 1</h2>
                <p className="text-sm opacity-90">Like Fractions</p>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Add and compare fractions with the same denominator
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Calculator size={16} />
                  <span>5 challenges</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">Ch 5</span>
                  <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold">Addition</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Compare</span>
                </div>
                <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-lg transition-colors">
                  Start Fusion →
                </button>
              </div>
            </div>

            {/* Level 2 */}
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                 onClick={() => handleStartLevel(2)}>
              <div className="bg-gradient-to-r from-red-400 to-orange-500 p-6 text-white">
                <div className="text-5xl mb-3">➖</div>
                <h2 className="text-2xl font-bold">Level 2</h2>
                <p className="text-sm opacity-90">Unlike Fractions</p>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Subtract fractions with different denominators using LCM
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Calculator size={16} />
                  <span>7 challenges</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Ch 6</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">LCM</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">Subtraction</span>
                </div>
                <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-colors">
                  Start Fusion →
                </button>
              </div>
            </div>

            {/* Level 3 */}
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                 onClick={() => handleStartLevel(3)}>
              <div className="bg-gradient-to-r from-cyan-400 to-teal-500 p-6 text-white">
                <div className="text-5xl mb-3">✖️</div>
                <h2 className="text-2xl font-bold">Level 3</h2>
                <p className="text-sm opacity-90">Mixed Operations</p>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  All fraction operations: +, -, × with simplification
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Calculator size={16} />
                  <span>10 challenges</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-semibold">Ch 5</span>
                  <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-semibold">Ch 6</span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">×</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Simplify</span>
                </div>
                <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 rounded-lg transition-colors">
                  Start Fusion →
                </button>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={handleReset}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">⚛️ Fraction Fusion</h1>
          <p className="text-lg text-gray-600">
            Level {currentLevel}: {currentLevel === 1 ? 'Like Fractions' : currentLevel === 2 ? 'Unlike Fractions' : 'Mixed Operations'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Fusion Progress</span>
            <span className="text-gray-600">{currentChallengeIndex + 1} / {challenges.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-purple-400 to-pink-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${((currentChallengeIndex + 1) / challenges.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Game Canvas Area */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {/* Stats Display */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-6">
              {/* Score */}
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 rounded-full p-4">
                  <span className="text-2xl font-bold text-yellow-600">{score}</span>
                </div>
                <p className="text-gray-700">
                  <span className="font-semibold">Energy</span>
                </p>
              </div>

              {/* Accuracy */}
              <div className="flex items-center gap-3 border-l border-gray-300 pl-6">
                <div className="bg-green-100 rounded-full p-4">
                  <span className="text-2xl font-bold text-green-600">{(accuracy * 100).toFixed(0)}%</span>
                </div>
                <p className="text-gray-700">
                  <span className="font-semibold">Accuracy</span>
                </p>
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <RotateCcw size={20} />
              Stop Fusion
            </button>
          </div>

          {/* Canvas */}
          <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
            <FractionFusionCanvas 
              width={1000} 
              height={550} 
              onAnswerSelect={handleAnswerSelect}
              level={currentLevel}
            />
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-800">
              <strong>How to Play:</strong> Study the fraction operation and select the correct answer!
              {currentLevel === 1 && ' Add like fractions and compare them.'}
              {currentLevel === 2 && ' Find common denominators to subtract.'}
              {currentLevel === 3 && ' Perform all operations and simplify your answer.'}
            </p>
          </div>
        </div>

        {/* Completion Screen */}
        {gameState === 'completed' && (
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-purple-500">
            <div className="flex items-center gap-4 mb-6">
              <Trophy size={48} className="text-yellow-500" />
              <h2 className="text-3xl font-bold text-gray-800">
                {accuracy >= 0.8 ? '🎉 Reactor Stabilized!' : '⚛️ Fusion Complete!'}
              </h2>
            </div>

            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Accuracy</p>
                <p className="text-3xl font-bold text-green-600">
                  {(accuracy * 100).toFixed(0)}%
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Energy</p>
                <p className="text-3xl font-bold text-yellow-600">{score}</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Correct</p>
                <p className="text-3xl font-bold text-purple-600">
                  {challenges.filter((_, i) => 
                    i <= currentChallengeIndex && selectedAnswer !== null
                  ).length}
                </p>
              </div>

              <div className="bg-cyan-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Level</p>
                <p className="text-3xl font-bold text-cyan-600">{currentLevel}</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6 text-center">
              {accuracy >= 0.8 
                ? 'Outstanding! You\'ve mastered fraction operations!' 
                : 'Good effort! Keep practicing to perfect your fraction skills.'}
            </p>

            <div className="flex gap-4">
              {currentLevel < 3 ? (
                <button
                  onClick={handleContinue}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Next Level <ChevronRight size={20} />
                </button>
              ) : (
                <button
                  onClick={handleReset}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  Play Again
                </button>
              )}
              <button
                onClick={handleReset}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors px-8"
              >
                Menu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FractionFusionGame;

