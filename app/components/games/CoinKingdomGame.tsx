'use client';

// Coin Kingdom - Main Game Component
// CBSE Class 1 Mathematics - Chapter 7: Money

import React, { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useCoinKingdomStore } from '@/app/store/useCoinKingdomStore';
import { GameMode, DifficultyLevel, MoneyCounterRoundConfig } from '@/app/utils/moneyUtils';
import { Lightbulb, RotateCcw, ChevronRight, Sparkles, Trophy, Star, Home } from 'lucide-react';

// Dynamic import to avoid SSR issues with Konva
const CoinKingdomCanvas = dynamic(
  () => import('./CoinKingdomCanvas'),
  { ssr: false, loading: () => <div className="w-full h-[450px] bg-amber-50 animate-pulse rounded-2xl" /> }
);

const GAME_MODES: { id: GameMode; name: string; emoji: string; description: string }[] = [
  { id: 'coin-collector', name: 'Coin Collector', emoji: '🔍', description: 'Find the right coin or note' },
  { id: 'piggy-bank-sort', name: 'Piggy Bank Sort', emoji: '🐷', description: 'Sort coins into piggy banks' },
  { id: 'money-counter', name: 'Money Counter', emoji: '🧮', description: 'Count the total money' },
  { id: 'exact-change', name: 'Exact Change', emoji: '🎯', description: 'Make the exact amount' },
  { id: 'money-balance', name: 'Money Balance', emoji: '⚖️', description: 'Compare money amounts' },
  { id: 'shop-and-pay', name: 'Shop & Pay', emoji: '🛒', description: 'Buy items with coins' },
];

const DIFFICULTY_OPTIONS: { id: DifficultyLevel; name: string; emoji: string; color: string; coins: string }[] = [
  { id: 'easy', name: 'Easy', emoji: '🌟', color: 'from-green-400 to-green-500', coins: '₹1, ₹2, ₹5' },
  { id: 'medium', name: 'Medium', emoji: '⭐', color: 'from-yellow-400 to-orange-500', coins: '₹1, ₹2, ₹5, ₹10' },
  { id: 'hard', name: 'Hard', emoji: '💫', color: 'from-red-400 to-pink-500', coins: 'Coins + Notes' },
];

const CoinKingdomGame: React.FC = () => {
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
    startGame,
    selectCounterAnswer,
    selectBalanceAnswer,
    nextRound,
    tryAgain,
    skipRound,
    resetGame,
    getHintText,
    hideCelebration,
  } = useCoinKingdomStore();

  const [gameState, setGameState] = useState<'menu' | 'difficulty' | 'playing' | 'complete'>('menu');
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 700, height: 450 });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const containerWidth = Math.min(window.innerWidth - 48, 800);
      setCanvasSize({
        width: Math.max(350, containerWidth),
        height: 450,
      });
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle celebration timeout
  useEffect(() => {
    if (showCelebration && celebrationType !== 'complete') {
      const timer = setTimeout(() => {
        hideCelebration();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showCelebration, celebrationType, hideCelebration]);

  // Handle game completion
  useEffect(() => {
    if (celebrationType === 'complete') {
      setGameState('complete');
    }
  }, [celebrationType]);

  const handleModeSelect = (mode: GameMode) => {
    setSelectedMode(mode);
    setGameState('difficulty');
  };

  const handleDifficultySelect = (diff: DifficultyLevel) => {
    if (selectedMode) {
      startGame(selectedMode, diff);
      setGameState('playing');
      setShowHint(false);
    }
  };

  const handleBackToMenu = () => {
    resetGame();
    setGameState('menu');
    setSelectedMode(null);
    setShowHint(false);
  };

  // ============== RENDER: MENU ==============
  const renderMenu = () => (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 via-yellow-50 to-orange-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-800 mb-2">
            🪙 Coin Kingdom
          </h1>
          <p className="text-lg text-amber-600">Learn about Indian Money!</p>
        </div>

        {/* Game Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GAME_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleModeSelect(mode.id)}
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-amber-400"
            >
              <div className="text-4xl mb-3">{mode.emoji}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{mode.name}</h3>
              <p className="text-sm text-gray-500">{mode.description}</p>
            </button>
          ))}
        </div>

        {/* Currency Preview */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Indian Currency</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold">₹1</div>
              <span className="text-xs mt-1">1 Rupee</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center text-xl font-bold text-white">₹2</div>
              <span className="text-xs mt-1">2 Rupees</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-amber-700 flex items-center justify-center text-xl font-bold text-white">₹5</div>
              <span className="text-xs mt-1">5 Rupees</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-xl font-bold">₹10</div>
              <span className="text-xs mt-1">10 Rupees</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-8 rounded bg-orange-500 flex items-center justify-center text-sm font-bold text-white">₹10</div>
              <span className="text-xs mt-1">10 Note</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-8 rounded bg-green-600 flex items-center justify-center text-sm font-bold text-white">₹20</div>
              <span className="text-xs mt-1">20 Note</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-8 rounded bg-blue-600 flex items-center justify-center text-sm font-bold text-white">₹50</div>
              <span className="text-xs mt-1">50 Note</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ============== RENDER: DIFFICULTY SELECTION ==============
  const renderDifficultySelection = () => {
    const mode = GAME_MODES.find(m => m.id === selectedMode);
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-100 via-yellow-50 to-orange-100 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => setGameState('menu')}
            className="flex items-center gap-2 text-amber-700 hover:text-amber-900 mb-6"
          >
            <ChevronRight className="rotate-180" size={20} />
            Back to Games
          </button>

          {/* Selected mode */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-2">{mode?.emoji}</div>
            <h2 className="text-3xl font-bold text-amber-800">{mode?.name}</h2>
            <p className="text-amber-600 mt-2">{mode?.description}</p>
          </div>

          {/* Difficulty options */}
          <div className="space-y-4">
            {DIFFICULTY_OPTIONS.map((diff) => (
              <button
                key={diff.id}
                onClick={() => handleDifficultySelect(diff.id)}
                className={`w-full bg-gradient-to-r ${diff.color} text-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-102`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{diff.emoji}</span>
                    <div className="text-left">
                      <div className="text-xl font-bold">{diff.name}</div>
                      <div className="text-sm opacity-90">Uses: {diff.coins}</div>
                    </div>
                  </div>
                  <ChevronRight size={24} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ============== RENDER: GAME COMPLETE ==============
  const renderComplete = () => {
    const accuracy = totalRounds > 0 ? Math.round((roundsCorrect / totalRounds) * 100) : 0;
    const mode = GAME_MODES.find(m => m.id === currentMode);

    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-100 via-yellow-50 to-orange-100 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          {/* Trophy */}
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold text-amber-800 mb-2">Amazing Job!</h2>
          <p className="text-amber-600 mb-6">You completed {mode?.name}!</p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-amber-50 rounded-xl p-4">
              <div className="text-3xl font-bold text-amber-600">{score}</div>
              <div className="text-sm text-amber-800">Total Score</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-3xl font-bold text-green-600">{accuracy}%</div>
              <div className="text-sm text-green-800">Accuracy</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-3xl font-bold text-blue-600">{roundsCorrect}/{totalRounds}</div>
              <div className="text-sm text-blue-800">Correct</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="text-3xl font-bold text-purple-600">{maxStreak}🔥</div>
              <div className="text-sm text-purple-800">Best Streak</div>
            </div>
          </div>

          {/* Stars */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                size={40}
                className={accuracy >= star * 30 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => {
                if (selectedMode) {
                  startGame(selectedMode, difficulty);
                  setGameState('playing');
                }
              }}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              Play Again
            </button>
            <button
              onClick={handleBackToMenu}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <Home size={20} />
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ============== RENDER: PLAYING ==============
  const renderPlaying = () => {
    const mode = GAME_MODES.find(m => m.id === currentMode);

    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-100 via-yellow-50 to-orange-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Game info */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToMenu}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Home size={24} />
                </button>
                <div>
                  <div className="text-sm text-gray-500">
                    {mode?.emoji} {mode?.name}
                  </div>
                  <div className="font-bold text-amber-800">
                    Round {currentRound} / {totalRounds}
                  </div>
                </div>
              </div>

              {/* Score & Streak */}
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">₹{score}</div>
                  <div className="text-xs text-gray-500">Score</div>
                </div>
                {streak > 0 && (
                  <div className="bg-orange-100 px-3 py-1 rounded-full">
                    <span className="font-bold text-orange-600">🔥 {streak}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
            <CoinKingdomCanvas width={canvasSize.width} height={canvasSize.height} />
          </div>

          {/* Answer Options for Money Counter */}
          {currentMode === 'money-counter' && roundConfig && !isRoundComplete && (
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
              <p className="text-center text-gray-600 mb-3">What is the total?</p>
              <div className="flex flex-wrap justify-center gap-3">
                {(roundConfig as MoneyCounterRoundConfig).options.map((option) => (
                  <button
                    key={option}
                    onClick={() => selectCounterAnswer(option)}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-6 py-3 rounded-xl font-bold text-lg transition-colors"
                  >
                    ₹{option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Answer Options for Money Balance */}
          {currentMode === 'money-balance' && !isRoundComplete && (
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => selectBalanceAnswer('left')}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-6 py-3 rounded-xl font-bold transition-colors"
                >
                  ⬅️ Left has more
                </button>
                <button
                  onClick={() => selectBalanceAnswer('equal')}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-6 py-3 rounded-xl font-bold transition-colors"
                >
                  ⚖️ Both equal
                </button>
                <button
                  onClick={() => selectBalanceAnswer('right')}
                  className="bg-green-100 hover:bg-green-200 text-green-800 px-6 py-3 rounded-xl font-bold transition-colors"
                >
                  Right has more ➡️
                </button>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            {/* Hint button */}
            <button
              onClick={() => setShowHint(!showHint)}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Lightbulb size={18} />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>

            {/* Next Round button */}
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

            {/* Try Again & Skip buttons */}
            {showFeedback && !isCorrect && !isRoundComplete && (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    tryAgain();
                    setShowHint(false);
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

          {/* Celebration Overlay */}
          {showCelebration && celebrationType !== 'complete' && (
            <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
              <div className="text-center animate-bounce">
                {celebrationType === 'streak' ? (
                  <>
                    <div className="text-8xl mb-2">🔥</div>
                    <div className="text-4xl font-bold text-orange-500">{streak} Streak!</div>
                  </>
                ) : (
                  <>
                    <div className="text-8xl mb-2">🎉</div>
                    <div className="text-4xl font-bold text-green-500">Correct!</div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ============== MAIN RENDER ==============
  switch (gameState) {
    case 'menu':
      return renderMenu();
    case 'difficulty':
      return renderDifficultySelection();
    case 'complete':
      return renderComplete();
    case 'playing':
    default:
      return renderPlaying();
  }
};

export default CoinKingdomGame;
