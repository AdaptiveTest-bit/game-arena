'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useMathMarathonStore } from '@/app/store/useMathMarathonStore';
import { submitTelemetry } from '@/app/utils/gameUtils';
import MathMarathonCanvas from './MathMarathonCanvas';
import { RotateCcw, CheckCircle, Trophy, ChevronRight, Flag } from 'lucide-react';

const MathMarathonGame: React.FC = () => {
  const {
    startGame,
    selectAnswer,
    nextQuestion,
    resetGame,
    gameCompleted,
    levelCompleted,
    currentLevel,
    questions,
    currentQuestionIndex,
    selectedAnswer,
    score,
    streak,
    getTelemetryLog,
    getAccuracy,
  } = useMathMarathonStore();

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'completed'>('menu');

  // Initialize game on mount
  useEffect(() => {
    if (gameState === 'menu') {
      startGame(1);
    }
  }, [gameState, startGame]);

  // Handle answer selection
  const handleAnswerSelect = useCallback((answer: number) => {
    if (selectedAnswer !== null) return; // Already answered
    
    const isCorrect = selectAnswer(answer);
    
    // Move to next question after delay
    setTimeout(() => {
      nextQuestion();
    }, 1500);
  }, [selectedAnswer, selectAnswer, nextQuestion]);

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
  const currentQuestion = questions[currentQuestionIndex];
  const progressPercent = ((currentQuestionIndex) / questions.length) * 100;

  // Level selection menu
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">🏃 Math Marathon</h1>
            <p className="text-xl text-gray-100">
              Race through math challenges! Master Class 5 Operations
            </p>
          </div>

          {/* Level Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Level 1 */}
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                 onClick={() => handleStartLevel(1)}>
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-6 text-white">
                <div className="text-5xl mb-3">🔢</div>
                <h2 className="text-2xl font-bold">Level 1</h2>
                <p className="text-sm opacity-90">Basic Operations</p>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Master multiplication and division fundamentals
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Flag size={16} />
                  <span>5 questions</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Ch 2</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">× ÷</span>
                </div>
                <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors">
                  Start Race →
                </button>
              </div>
            </div>

            {/* Level 2 */}
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                 onClick={() => handleStartLevel(2)}>
              <div className="bg-gradient-to-r from-orange-400 to-amber-500 p-6 text-white">
                <div className="text-5xl mb-3">📊</div>
                <h2 className="text-2xl font-bold">Level 2</h2>
                <p className="text-sm opacity-90">Word Problems</p>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Solve real-world problems with mixed operations
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Flag size={16} />
                  <span>7 questions</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Ch 2</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">Ch 3</span>
                  <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold">Ch 5</span>
                </div>
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors">
                  Start Race →
                </button>
              </div>
            </div>

            {/* Level 3 */}
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                 onClick={() => handleStartLevel(3)}>
              <div className="bg-gradient-to-r from-red-400 to-rose-500 p-6 text-white">
                <div className="text-5xl mb-3">🎯</div>
                <h2 className="text-2xl font-bold">Level 3</h2>
                <p className="text-sm opacity-90">Multi-Step Challenge</p>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Complex problems combining all operations
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Flag size={16} />
                  <span>10 questions</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Ch 2</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">Ch 3</span>
                  <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold">Ch 5</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Ch 6</span>
                </div>
                <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-colors">
                  Start Race →
                </button>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={handleReset}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} />
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🏃 Math Marathon</h1>
          <p className="text-lg text-gray-600">Level {currentLevel}: Race through math challenges!</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="text-gray-600">{currentQuestionIndex + 1} / {questions.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-green-400 to-emerald-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
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
                  <span className="font-semibold">Score</span>
                </p>
              </div>

              {/* Streak */}
              <div className="flex items-center gap-3 border-l border-gray-300 pl-6">
                <div className={`rounded-full p-4 ${streak > 2 ? 'bg-orange-100' : 'bg-gray-100'}`}>
                  <span className="text-2xl font-bold" style={{ color: streak > 2 ? '#F39C12' : '#6B7280' }}>
                    {streak > 2 ? '🔥' : '📊'} {streak}
                  </span>
                </div>
                <p className="text-gray-700">
                  <span className="font-semibold">Streak</span>
                </p>
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <RotateCcw size={20} />
              Quit Race
            </button>
          </div>

          {/* Canvas */}
          <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
            <MathMarathonCanvas 
              width={1000} 
              height={450} 
              onAnswerSelect={handleAnswerSelect}
              level={currentLevel}
            />
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>How to Play:</strong> Click on the correct answer to move your race car forward!
              Build your streak for bonus points. Complete all questions to finish the race.
            </p>
          </div>
        </div>

        {/* Completion Screen */}
        {gameState === 'completed' && (
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-green-500">
            <div className="flex items-center gap-4 mb-6">
              <Trophy size={48} className="text-yellow-500" />
              <h2 className="text-3xl font-bold text-gray-800">
                {accuracy >= 0.8 ? '🎉 Race Complete!' : '🏁 Finish Line!'}
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
                <p className="text-gray-600 text-sm">Score</p>
                <p className="text-3xl font-bold text-yellow-600">{score}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Best Streak</p>
                <p className="text-3xl font-bold text-blue-600">{streak}</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Level</p>
                <p className="text-3xl font-bold text-purple-600">{currentLevel}</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6 text-center">
              {accuracy >= 0.8 
                ? 'Outstanding performance! You\'ve mastered these operations!' 
                : 'Good effort! Practice more to improve your score.'}
            </p>

            <div className="flex gap-4">
              {currentLevel < 3 && (
                <button
                  onClick={handleContinue}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Next Level <ChevronRight size={20} />
                </button>
              )}
              <button
                onClick={handleReset}
                className={`${currentLevel < 3 ? 'flex-1' : 'w-full'} bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors`}
              >
                Back to Menu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MathMarathonGame;

