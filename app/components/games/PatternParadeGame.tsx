'use client';

import React, { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { usePatternParadeStore } from '@/app/store/usePatternParadeStore';
import { GameMode, DifficultyLevel, PATTERN_LABELS } from '@/app/utils/patternUtils';
import { Lightbulb, RotateCcw, ChevronRight, Check, Sparkles, Trophy, Star } from 'lucide-react';

// Dynamic import to avoid SSR issues with Konva
const PatternParadeCanvas = dynamic(
  () => import('./PatternParadeCanvas'),
  { ssr: false, loading: () => <div className="w-full h-[450px] bg-sky-100 animate-pulse rounded-2xl" /> }
);

const GAME_MODES: { id: GameMode; name: string; emoji: string; description: string }[] = [
  { id: 'spot-pattern', name: 'Spot the Pattern', emoji: '🔍', description: 'Find the pattern rule' },
  { id: 'what-next', name: 'What Comes Next?', emoji: '🔮', description: 'Complete the pattern' },
  { id: 'find-missing', name: 'Find the Missing', emoji: '🧩', description: 'Fix the gap in the pattern' },
  { id: 'build-pattern', name: 'Build Your Pattern', emoji: '🎨', description: 'Create your own pattern' },
  { id: 'growing-garden', name: 'Growing Garden', emoji: '🌱', description: 'Count growing patterns' },
  { id: 'mirror-match', name: 'Mirror Match', emoji: '🪞', description: 'Complete the mirror' },
];

const DIFFICULTY_OPTIONS: { id: DifficultyLevel; name: string; emoji: string; color: string }[] = [
  { id: 'easy', name: 'Easy', emoji: '🌟', color: 'from-green-400 to-green-500' },
  { id: 'medium', name: 'Medium', emoji: '⭐', color: 'from-yellow-400 to-orange-500' },
  { id: 'hard', name: 'Hard', emoji: '💫', color: 'from-red-400 to-pink-500' },
];

const PatternParadeGame: React.FC = () => {
  const {
    currentMode,
    difficulty,
    roundConfig,
    currentRound,
    totalRounds,
    score,
    streak,
    maxStreak,
    roundsCorrect,
    isRoundComplete,
    isCorrect,
    showFeedback,
    feedbackMessage,
    showCelebration,
    celebrationType,
    selectedRule,
    selectedGrowthCount,
    hasAttempted,
    wrongAttempts,
    startGame,
    submitAnswer,
    nextRound,
    skipRound,
    tryAgain,
    resetGame,
    selectPatternRule,
    selectGrowthAnswer,
    getHintText,
    getTelemetryLog,
    hideCelebration,
  } = usePatternParadeStore();

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'complete'>('menu');
  const [showHint, setShowHint] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('easy');

  // Start specific game mode
  const handleStartMode = useCallback((modeId: GameMode) => {
    startGame(modeId, selectedDifficulty);
    setGameState('playing');
    setShowHint(false);
  }, [selectedDifficulty, startGame]);

  // Check completion
  useEffect(() => {
    if (currentRound > totalRounds && gameState === 'playing') {
      setGameState('complete');
      console.log('Game Complete - Telemetry:', getTelemetryLog());
    }
  }, [currentRound, totalRounds, gameState, getTelemetryLog]);

  // Handle celebration dismiss
  useEffect(() => {
    if (showCelebration && celebrationType !== 'complete') {
      const timer = setTimeout(() => {
        hideCelebration();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showCelebration, celebrationType, hideCelebration]);

  // ============== MENU SCREEN ==============
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-block animate-bounce mb-4">
              <span className="text-7xl">🚂</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
              Pattern Parade
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              Help the magical train by solving pattern puzzles!
            </p>
            <p className="text-sm text-white/70 mt-2">
              CBSE Class 1 • Chapter 7: Patterns
            </p>
          </div>

          {/* Difficulty Selection */}
          <div className="mb-8">
            <h2 className="text-center text-white font-bold mb-4 text-lg">Choose Difficulty:</h2>
            <div className="flex justify-center gap-4">
              {DIFFICULTY_OPTIONS.map((diff) => (
                <button
                  key={diff.id}
                  className={`px-6 py-3 rounded-full font-bold text-lg transition-all transform hover:scale-105 ${
                    selectedDifficulty === diff.id
                      ? `bg-gradient-to-r ${diff.color} text-white scale-110 shadow-lg`
                      : 'bg-white/30 text-white hover:bg-white/50'
                  }`}
                  onClick={() => setSelectedDifficulty(diff.id)}
                >
                  {diff.emoji} {diff.name}
                </button>
              ))}
            </div>
          </div>

          {/* Game Mode Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {GAME_MODES.map((mode) => (
              <div
                key={mode.id}
                onClick={() => handleStartMode(mode.id)}
                className="bg-white rounded-2xl p-5 cursor-pointer hover:scale-105 transition-all shadow-xl hover:shadow-2xl group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl group-hover:animate-bounce">{mode.emoji}</span>
                  <h3 className="text-xl font-bold text-gray-800">
                    {mode.name}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">{mode.description}</p>
                <div className="mt-4 flex items-center text-purple-600 font-semibold text-sm group-hover:translate-x-2 transition-transform">
                  Play Now <ChevronRight size={18} className="ml-1" />
                </div>
              </div>
            ))}
          </div>

          {/* Play Random Button */}
          <div className="mt-10 text-center">
            <button
              onClick={() => {
                const randomMode = GAME_MODES[Math.floor(Math.random() * GAME_MODES.length)];
                handleStartMode(randomMode.id);
              }}
              className="bg-white text-purple-600 px-10 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-lg inline-flex items-center gap-2"
            >
              <Sparkles size={24} />
              Surprise Me!
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============== COMPLETE SCREEN ==============
  if (gameState === 'complete') {
    const accuracy = Math.round((roundsCorrect / totalRounds) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 md:p-12 text-center max-w-lg shadow-2xl">
          <div className="text-7xl mb-6 animate-bounce">
            {accuracy >= 80 ? '🏆' : accuracy >= 60 ? '🌟' : '👏'}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-purple-600 mb-4">
            {accuracy >= 80 ? 'Pattern Master!' : accuracy >= 60 ? 'Great Job!' : 'Good Try!'}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            You completed all {totalRounds} rounds!
          </p>
          
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{score}</div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{accuracy}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
            </div>
            <div className="flex justify-center items-center gap-2 text-orange-500">
              <Star size={20} fill="currentColor" />
              <span className="font-bold">Best Streak: {maxStreak}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                resetGame();
                setGameState('menu');
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} />
              Back to Menu
            </button>
            <button
              onClick={() => {
                resetGame();
                handleStartMode(currentMode);
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <Sparkles size={20} />
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============== GAME SCREEN ==============
  const currentModeInfo = GAME_MODES.find(m => m.id === currentMode);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-sky-100">
      {/* Top Bar */}
      <div className="bg-white/95 shadow-md p-3 md:p-4 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-3 md:gap-6">
          <span className="text-xl md:text-2xl font-bold text-purple-600 flex items-center gap-2">
            {currentModeInfo?.emoji} 
            <span className="hidden sm:inline">{currentModeInfo?.name}</span>
          </span>
          <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-semibold">
            Round {Math.min(currentRound, totalRounds)}/{totalRounds}
          </span>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <div className="text-sm md:text-base flex items-center gap-1">
            <Trophy size={18} className="text-yellow-500" />
            <span className="font-bold text-purple-600">{score}</span>
          </div>
          {streak > 1 && (
            <div className="text-sm bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-bold animate-pulse">
              🔥 {streak}x streak!
            </div>
          )}
          <button
            onClick={() => {
              resetGame();
              setGameState('menu');
            }}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1"
          >
            <RotateCcw size={16} /> Menu
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 border-b-2 border-yellow-200 p-3 md:p-4 mx-auto max-w-4xl">
        <p className="text-sm md:text-base text-yellow-800 text-center font-medium">
          {currentMode === 'spot-pattern' && '🔍 Look at the train cars and select the correct pattern rule below!'}
          {currentMode === 'what-next' && '🔮 What item comes next? Click an item below, then click the empty car to place it!'}
          {currentMode === 'find-missing' && '🧩 One item is missing! Click an item below, then click the empty car with "?" to place it!'}
          {currentMode === 'build-pattern' && '🎨 Create a repeating pattern! Example: 🔴🔵🔴🔵 or 🍎🍊🍇🍎🍊🍇. Click items to place them in the train cars!'}
          {currentMode === 'growing-garden' && '🌱 Count the flowers in each pot! Select how many will be in the last pot.'}
          {currentMode === 'mirror-match' && '🪞 Complete the mirror! The right side should be a reflection of the left side.'}
        </p>
      </div>

      {/* Canvas */}
      <div className="flex justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-purple-200">
          <PatternParadeCanvas width={850} height={450} />
        </div>
      </div>

      {/* Mode-Specific Controls */}
      <div className="max-w-4xl mx-auto px-4">
        {/* Spot Pattern Mode - Rule Selection */}
        {currentMode === 'spot-pattern' && roundConfig?.ruleOptions && (
          <div className="bg-white rounded-xl p-4 shadow-lg mb-4">
            <h3 className="text-center font-bold text-gray-700 mb-3">
              Which pattern do you see? Select one:
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {roundConfig.ruleOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => selectPatternRule(option.id)}
                  disabled={isRoundComplete}
                  className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                    selectedRule === option.id
                      ? 'bg-purple-500 text-white scale-105 shadow-lg'
                      : 'bg-gray-100 hover:bg-purple-100 text-gray-700'
                  } ${isRoundComplete ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Growing Garden Mode - Count Selection */}
        {currentMode === 'growing-garden' && roundConfig?.options && (
          <div className="bg-white rounded-xl p-4 shadow-lg mb-4">
            <h3 className="text-center font-bold text-gray-700 mb-3">
              How many flowers will be in the last pot?
            </h3>
            <div className="flex justify-center gap-4">
              {roundConfig.options.map((option) => {
                const count = parseInt(option.emoji);
                return (
                  <button
                    key={option.id}
                    onClick={() => selectGrowthAnswer(count)}
                    disabled={isRoundComplete}
                    className={`w-16 h-16 rounded-xl font-bold text-2xl transition-all ${
                      selectedGrowthCount === count
                        ? 'bg-green-500 text-white scale-110 shadow-lg'
                        : 'bg-gray-100 hover:bg-green-100 text-gray-700'
                    } ${isRoundComplete ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    {count}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={() => setShowHint(!showHint)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors"
          >
            <Lightbulb size={18} />
            Hint
          </button>
          
          {(currentMode === 'spot-pattern' || currentMode === 'growing-garden') && !isRoundComplete && (
            <button
              onClick={submitAnswer}
              disabled={
                (currentMode === 'spot-pattern' && !selectedRule) ||
                (currentMode === 'growing-garden' && selectedGrowthCount === null)
              }
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors"
            >
              <Check size={18} />
              Check Answer
            </button>
          )}

          {isRoundComplete && (
            <button
              onClick={() => {
                if (currentRound >= totalRounds) {
                  setGameState('complete');
                } else {
                  nextRound();
                }
                setShowHint(false);
              }}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 animate-pulse transition-colors"
            >
              {currentRound >= totalRounds ? 'See Results' : 'Next Round'}
              <ChevronRight size={18} />
            </button>
          )}

          {/* Show both Try Again and Skip buttons when wrong answer */}
          {showFeedback && !isCorrect && !isRoundComplete && (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  tryAgain();
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors"
              >
                <RotateCcw size={18} />
                Try Again
              </button>
              <button
                onClick={() => {
                  if (currentRound >= totalRounds) {
                    setGameState('complete');
                  } else {
                    skipRound();
                  }
                  setShowHint(false);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors"
              >
                Skip to Next
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Hint Display */}
        {showHint && (
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-4 mb-4">
            <p className="text-blue-800 flex items-start gap-2">
              <Lightbulb size={20} className="flex-shrink-0 mt-0.5" />
              {getHintText()}
            </p>
          </div>
        )}

        {/* Feedback Display */}
        {showFeedback && (
          <div className={`rounded-xl p-4 mb-4 text-center font-bold text-lg ${
            isCorrect 
              ? 'bg-green-100 text-green-800 border-2 border-green-300' 
              : 'bg-red-100 text-red-800 border-2 border-red-300'
          }`}>
            {feedbackMessage}
          </div>
        )}
      </div>

      {/* Celebration Overlay */}
      {showCelebration && celebrationType === 'correct' && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className="text-center animate-bounce">
            <div className="text-8xl mb-4">🎉</div>
          </div>
        </div>
      )}

      {showCelebration && celebrationType === 'streak' && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className="text-center animate-bounce">
            <div className="text-8xl mb-4">🔥</div>
            <div className="text-3xl font-bold text-orange-500 drop-shadow-lg">
              {streak}x Streak!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatternParadeGame;
