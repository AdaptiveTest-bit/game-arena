'use client';

import React, { useEffect } from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import { useNumberJungleStore, type NumberOption } from '../../store/useNumberJungleStore';
import NumberJungleCanvas from './NumberJungleCanvas';

// Animated components
const AnimatedDiv = animated.div;

// Level info
const LEVEL_INFO = {
  1: { name: 'Cub', emoji: '🐱', range: '1-10', color: 'from-green-400 to-emerald-500' },
  2: { name: 'Explorer', emoji: '🦁', range: '1-20', color: 'from-yellow-400 to-orange-500' },
  3: { name: 'Ranger', emoji: '🐯', range: '1-50', color: 'from-blue-400 to-indigo-500' },
  4: { name: 'Master', emoji: '🦅', range: '1-100', color: 'from-purple-400 to-pink-500' },
  5: { name: 'Jungle King', emoji: '👑', range: '1-100+', color: 'from-red-400 to-rose-500' },
};

// Option button component
const OptionButton: React.FC<{
  option: NumberOption;
  isSelected: boolean;
  isCorrect?: boolean;
  showFeedback: boolean;
  onClick: () => void;
}> = ({ option, isSelected, isCorrect, showFeedback, onClick }) => {
  const buttonSpring = useSpring({
    scale: isSelected ? 1.1 : 1,
    config: config.wobbly,
  });

  let bgColor = 'bg-white hover:bg-blue-50';
  let borderColor = 'border-gray-300';
  let textColor = 'text-gray-800';

  if (isSelected && !showFeedback) {
    bgColor = 'bg-blue-100';
    borderColor = 'border-blue-500';
    textColor = 'text-blue-800';
  } else if (showFeedback && isSelected) {
    if (isCorrect) {
      bgColor = 'bg-green-100';
      borderColor = 'border-green-500';
      textColor = 'text-green-800';
    } else {
      bgColor = 'bg-red-100';
      borderColor = 'border-red-500';
      textColor = 'text-red-800';
    }
  }

  return (
    <AnimatedDiv style={{ transform: buttonSpring.scale.to((s: number) => `scale(${s})`) }}>
      <button
        onClick={onClick}
        disabled={showFeedback}
        className={`
          w-20 h-20 rounded-2xl border-4 ${bgColor} ${borderColor}
          flex items-center justify-center
          text-3xl font-bold ${textColor}
          shadow-lg transition-all duration-200
          disabled:cursor-not-allowed
        `}
      >
        {option.label}
      </button>
    </AnimatedDiv>
  );
};

// Progress bar component
const ProgressBar: React.FC<{ current: number; total: number }> = ({ current, total }) => {
  const progress = (current / total) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// Celebration component
const Celebration: React.FC<{ score: number; stars: number; onPlayAgain: () => void }> = ({
  score,
  stars,
  onPlayAgain,
}) => {
  const celebrationSpring = useSpring({
    from: { opacity: 0, scale: 0.5 },
    to: { opacity: 1, scale: 1 },
    config: config.wobbly,
  });

  // Calculate star rating based on score (out of 100)
  const starRating = score >= 90 ? 5 : score >= 70 ? 4 : score >= 50 ? 3 : score >= 30 ? 2 : 1;

  return (
    <AnimatedDiv
      style={{
        opacity: celebrationSpring.opacity,
        transform: celebrationSpring.scale.to((s: number) => `scale(${s})`),
      }}
      className="flex flex-col items-center justify-center min-h-[500px] p-8"
    >
      <div className="text-8xl mb-6 animate-bounce">🎉</div>
      <h1 className="text-4xl font-bold text-green-600 mb-4">Amazing Job!</h1>
      <p className="text-2xl text-gray-600 mb-2">You&apos;re a Number Jungle Champion!</p>

      <div className="flex gap-2 my-6">
        {[...Array(starRating)].map((_, i) => (
          <span key={i} className="text-5xl animate-pulse">⭐</span>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-xl mb-6">
        <p className="text-xl text-gray-600">Total Score</p>
        <p className="text-5xl font-bold text-green-600">{score}<span className="text-2xl text-gray-400">/100</span></p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onPlayAgain}
          className="px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl
                   text-xl font-bold shadow-lg hover:scale-105 transition-transform"
        >
          🔄 Play Again
        </button>
      </div>
    </AnimatedDiv>
  );
};

// Menu component
const GameMenu: React.FC<{ onStartGame: (level: 1 | 2 | 3 | 4 | 5) => void }> = ({ onStartGame }) => {
  const menuSpring = useSpring({
    from: { opacity: 0, y: 50 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  });

  return (
    <AnimatedDiv
      style={{
        opacity: menuSpring.opacity,
        transform: menuSpring.y.to((y: number) => `translateY(${y}px)`),
      }}
      className="flex flex-col items-center p-8"
    >
      <div className="text-7xl mb-4 animate-bounce">🌴</div>
      <h1 className="text-4xl font-bold text-green-700 mb-2">Number Jungle</h1>
      <p className="text-xl text-green-600 mb-8">Explorer</p>

      <p className="text-gray-600 mb-6 text-center max-w-md">
        Explore the jungle and learn numbers from 1 to 100! 🐒🦁🌺
      </p>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        {([1, 2, 3, 4, 5] as const).map((level) => {
          const info = LEVEL_INFO[level];
          return (
            <button
              key={level}
              onClick={() => onStartGame(level)}
              className={`
                px-6 py-3 bg-gradient-to-r ${info.color} text-white rounded-xl
                text-lg font-bold shadow-lg hover:scale-105 transition-transform
                flex items-center justify-between
              `}
            >
              <span className="text-2xl">{info.emoji}</span>
              <span>{info.name}</span>
              <span className="text-xs opacity-80">Numbers {info.range}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 text-center text-gray-500 text-sm">
        <p>Class 1 • Chapter 2 • CBSE Maths</p>
      </div>
    </AnimatedDiv>
  );
};

// Main game component
const NumberJungleGame: React.FC = () => {
  const {
    gameState,
    level,
    score,
    stars,
    streak,
    challengesCompleted,
    totalChallengesPerLevel,
    currentChallenge,
    selectedOption,
    selectedObjects,
    showFeedback,
    isCorrect,
    startGame,
    selectOption,
    submitAnswer,
    nextChallenge,
    resetGame,
  } = useNumberJungleStore();

  // Auto-advance to next question after showing feedback
  useEffect(() => {
    if (showFeedback) {
      const timer = setTimeout(() => {
        nextChallenge();
      }, 1200); // Show feedback for 1.2 seconds then auto-advance
      return () => clearTimeout(timer);
    }
  }, [showFeedback, nextChallenge]);

  // Keyboard shortcut for submit
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && gameState === 'playing' && !showFeedback) {
        if (currentChallenge?.type === 'make-the-number') {
          if (selectedObjects.length > 0) submitAnswer();
        } else if (selectedOption) {
          submitAnswer();
        }
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [gameState, selectedOption, selectedObjects, showFeedback, currentChallenge, submitAnswer]);

  if (gameState === 'menu') {
    return (
      <div className="max-w-lg mx-auto bg-gradient-to-b from-green-100 to-emerald-200 rounded-3xl shadow-2xl overflow-hidden">
        <GameMenu onStartGame={startGame} />
      </div>
    );
  }

  if (gameState === 'celebrating') {
    return (
      <div className="max-w-lg mx-auto bg-gradient-to-b from-yellow-100 to-orange-200 rounded-3xl shadow-2xl overflow-hidden">
        <Celebration score={score} stars={stars} onPlayAgain={resetGame} />
      </div>
    );
  }

  const levelInfo = LEVEL_INFO[level];
  const canSubmit =
    currentChallenge?.type === 'make-the-number'
      ? selectedObjects.length > 0
      : currentChallenge?.type === 'number-sequence'
        ? true // Always can submit for sequence (they just need to arrange)
        : selectedOption !== null;

  return (
    <div className="max-w-lg mx-auto bg-gradient-to-b from-green-50 to-emerald-100 rounded-3xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${levelInfo.color} p-4 text-white`}>
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={resetGame}
            className="text-white/80 hover:text-white text-sm flex items-center gap-1"
          >
            ← Menu
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{levelInfo.emoji}</span>
            <span className="font-bold">{levelInfo.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>⭐</span>
            <span className="font-bold">{stars}</span>
          </div>
        </div>

        <ProgressBar current={challengesCompleted} total={totalChallengesPerLevel} />

        <div className="flex justify-between text-sm mt-2 text-white/80">
          <span>Score: {score}</span>
          <span>
            {challengesCompleted + 1} / {totalChallengesPerLevel}
          </span>
          {streak >= 2 && <span>🔥 {streak} streak!</span>}
        </div>
      </div>

      {/* Challenge Area */}
      <div className="p-4">
        {currentChallenge && (
          <>
            {/* Title and instruction */}
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-green-800">{currentChallenge.title}</h2>
              <p className="text-gray-600 mt-1">{currentChallenge.instruction}</p>
            </div>

            {/* Canvas */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
              <NumberJungleCanvas width={400} height={280} />
            </div>

            {/* Options - don't show for sequence challenges */}
            {currentChallenge.options.length > 0 && currentChallenge.type !== 'number-sequence' && (
              <div className="flex justify-center gap-3 mb-4 flex-wrap">
                {currentChallenge.options.map((option) => (
                  <OptionButton
                    key={option.id}
                    option={option}
                    isSelected={selectedOption === option.id}
                    isCorrect={option.id === currentChallenge.correctOptionId}
                    showFeedback={showFeedback}
                    onClick={() => selectOption(option.id)}
                  />
                ))}
              </div>
            )}

            {/* Feedback */}
            {showFeedback && (
              <div
                className={`text-center p-4 rounded-xl mb-4 ${
                  isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                <p className="text-2xl font-bold">
                  {isCorrect ? '🎉 Correct! Great job!' : '😢 Oops! Try again!'}
                </p>
                {!isCorrect && currentChallenge.type !== 'make-the-number' && currentChallenge.type !== 'number-sequence' && (
                  <p className="text-sm mt-1">
                    The answer was:{' '}
                    {currentChallenge.options.find(
                      (o) => o.id === currentChallenge.correctOptionId
                    )?.label}
                  </p>
                )}
                {!isCorrect && currentChallenge.type === 'number-sequence' && (
                  <p className="text-sm mt-1">
                    Correct order: {(currentChallenge.data.correctAnswer as number[]).join(' → ')}
                  </p>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-center">
              {!showFeedback && (
                <button
                  onClick={submitAnswer}
                  disabled={!canSubmit}
                  className={`
                    px-8 py-3 rounded-xl text-xl font-bold shadow-lg
                    transition-all duration-200
                    ${
                      canSubmit
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:scale-105'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  ✓ Submit
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NumberJungleGame;
