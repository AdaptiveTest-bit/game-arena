'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import { useNumberJungleStore, type NumberOption } from '../../store/useNumberJungleStore';
import NumberJungleCanvas from './NumberJungleCanvas';

// Animated components
const AnimatedDiv = animated.div;

// Constants
const MAX_POINTS_PER_QUESTION = 10;
const WRONG_ATTEMPT_PENALTY = 3;
const AUTO_ADVANCE_DELAY = 1500;

// Level info
const LEVEL_INFO = {
  1: { name: 'Cub', emoji: '🐱', range: '1-10', color: 'from-green-400 to-emerald-500' },
  2: { name: 'Explorer', emoji: '🦁', range: '1-20', color: 'from-yellow-400 to-orange-500' },
  3: { name: 'Ranger', emoji: '🐯', range: '1-50', color: 'from-blue-400 to-indigo-500' },
  4: { name: 'Master', emoji: '🦅', range: '1-100', color: 'from-purple-400 to-pink-500' },
  5: { name: 'Jungle King', emoji: '👑', range: '1-100+', color: 'from-red-400 to-rose-500' },
};

// Confetti particle component
const ConfettiParticle: React.FC<{ delay: number; color: string }> = ({ delay, color }) => {
  const spring = useSpring({
    from: { y: 0, x: 0, opacity: 1, rotate: 0 },
    to: { y: 300, x: (Math.random() - 0.5) * 200, opacity: 0, rotate: 720 },
    delay,
    config: { duration: 1500 },
  });

  return (
    <AnimatedDiv
      style={{
        position: 'absolute',
        top: -20,
        left: `${50 + (Math.random() - 0.5) * 80}%`,
        transform: spring.y.to(
          (y) => `translateY(${y}px) translateX(${spring.x.get()}px) rotate(${spring.rotate.get()}deg)`
        ),
        opacity: spring.opacity,
      }}
      className={`text-2xl ${color}`}
    >
      {['🎉', '⭐', '🌟', '✨', '🎊'][Math.floor(Math.random() * 5)]}
    </AnimatedDiv>
  );
};

// Confetti explosion component
const ConfettiExplosion: React.FC = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    delay: i * 50,
    color: ['text-yellow-400', 'text-pink-400', 'text-blue-400', 'text-green-400', 'text-purple-400'][i % 5],
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
      {particles.map((p) => (
        <ConfettiParticle key={p.id} delay={p.delay} color={p.color} />
      ))}
    </div>
  );
};

// Interactive tap option button
const TapOptionButton: React.FC<{
  option: NumberOption;
  isWrong: boolean;
  isCorrect: boolean;
  isDisabled: boolean;
  onTap: () => void;
}> = ({ option, isWrong, isCorrect, isDisabled, onTap }) => {
  const [isShaking, setIsShaking] = useState(false);

  // Shake animation when wrong
  useEffect(() => {
    if (isWrong) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isWrong]);

  const buttonSpring = useSpring({
    scale: isCorrect ? 1.2 : 1,
    backgroundColor: isCorrect 
      ? '#22c55e' 
      : isWrong 
        ? '#ef4444' 
        : '#ffffff',
    config: config.wobbly,
  });

  return (
    <AnimatedDiv
      style={{
        transform: buttonSpring.scale.to((s: number) => `scale(${s})`),
      }}
      className={`${isShaking ? 'animate-shake' : ''}`}
    >
      <button
        onClick={onTap}
        disabled={isDisabled || isCorrect}
        className={`
          w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-4
          flex items-center justify-center
          text-4xl sm:text-5xl font-bold
          shadow-xl transition-all duration-200
          active:scale-95
          ${isCorrect 
            ? 'bg-green-400 border-green-600 text-white' 
            : isWrong 
              ? 'bg-red-100 border-red-400 text-red-600' 
              : 'bg-white border-blue-300 text-gray-800 hover:bg-blue-50 hover:border-blue-500 hover:shadow-2xl'
          }
          ${isDisabled && !isCorrect ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {option.label}
      </button>
    </AnimatedDiv>
  );
};

// Points feedback popup
const PointsFeedback: React.FC<{ points: number; isPositive: boolean }> = ({ points, isPositive }) => {
  const spring = useSpring({
    from: { y: 0, opacity: 1 },
    to: { y: -50, opacity: 0 },
    config: { duration: 800 },
  });

  return (
    <AnimatedDiv
      style={{
        transform: spring.y.to((y) => `translateY(${y}px)`),
        opacity: spring.opacity,
      }}
      className={`absolute top-0 left-1/2 -translate-x-1/2 text-2xl font-bold ${
        isPositive ? 'text-green-500' : 'text-red-500'
      }`}
    >
      {isPositive ? `+${points}` : `-${Math.abs(points)}`}
    </AnimatedDiv>
  );
};

// Progress bar component
const ProgressBar: React.FC<{ current: number; total: number }> = ({ current, total }) => {
  const progress = (current / total) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
      <div
        className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 transition-all duration-500 rounded-full"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// Celebration component
const Celebration: React.FC<{ score: number; onPlayAgain: () => void }> = ({
  score,
  onPlayAgain,
}) => {
  const celebrationSpring = useSpring({
    from: { opacity: 0, scale: 0.5 },
    to: { opacity: 1, scale: 1 },
    config: config.wobbly,
  });

  // Calculate star rating based on score (out of 200)
  const percentage = (score / 200) * 100;
  const starRating = percentage >= 90 ? 5 : percentage >= 70 ? 4 : percentage >= 50 ? 3 : percentage >= 30 ? 2 : 1;

  return (
    <AnimatedDiv
      style={{
        opacity: celebrationSpring.opacity,
        transform: celebrationSpring.scale.to((s: number) => `scale(${s})`),
      }}
      className="flex flex-col items-center justify-center min-h-[500px] p-8 relative"
    >
      <ConfettiExplosion />
      <div className="text-8xl mb-6 animate-bounce">🎉</div>
      <h1 className="text-4xl font-bold text-green-600 mb-4">Amazing Job!</h1>
      <p className="text-2xl text-gray-600 mb-2">You&apos;re a Number Jungle Champion!</p>

      <div className="flex gap-2 my-6">
        {[...Array(starRating)].map((_, i) => (
          <span key={i} className="text-5xl animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>⭐</span>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-xl mb-6">
        <p className="text-xl text-gray-600">Total Score</p>
        <p className="text-5xl font-bold text-green-600">{score}<span className="text-2xl text-gray-400">/200</span></p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onPlayAgain}
          className="px-10 py-5 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-2xl
                   text-2xl font-bold shadow-xl hover:scale-110 transition-transform active:scale-95"
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

      <p className="text-gray-600 mb-6 text-center max-w-md text-lg">
        👆 Tap to count and find numbers! 🐒🦁🌺
      </p>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        {([1, 2, 3, 4, 5] as const).map((level) => {
          const info = LEVEL_INFO[level];
          return (
            <button
              key={level}
              onClick={() => onStartGame(level)}
              className={`
                px-6 py-4 bg-gradient-to-r ${info.color} text-white rounded-2xl
                text-xl font-bold shadow-xl hover:scale-105 transition-transform active:scale-95
                flex items-center justify-between
              `}
            >
              <span className="text-3xl">{info.emoji}</span>
              <span>{info.name}</span>
              <span className="text-sm opacity-80">Numbers {info.range}</span>
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
    streak,
    challengesCompleted,
    totalChallengesPerLevel,
    currentChallenge,
    startGame,
    nextChallenge,
    resetGame,
  } = useNumberJungleStore();

  // Local state for tap-to-answer logic
  const [wrongAttempts, setWrongAttempts] = useState<Set<string>>(new Set());
  const [wrongCount, setWrongCount] = useState(0);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [pointsFeedback, setPointsFeedback] = useState<{ points: number; isPositive: boolean; key: number } | null>(null);
  const [localScore, setLocalScore] = useState(0);

  // Sync local score with store score
  useEffect(() => {
    setLocalScore(score);
  }, [score]);

  // Reset local state when challenge changes
  useEffect(() => {
    setWrongAttempts(new Set());
    setWrongCount(0);
    setIsCorrectAnswer(false);
    setShowConfetti(false);
    setPointsFeedback(null);
  }, [currentChallenge?.id]);

  // Auto-advance after correct answer
  useEffect(() => {
    if (isCorrectAnswer) {
      const timer = setTimeout(() => {
        nextChallenge();
      }, AUTO_ADVANCE_DELAY);
      return () => clearTimeout(timer);
    }
  }, [isCorrectAnswer, nextChallenge]);

  // Handle option tap
  const handleOptionTap = useCallback((optionId: string) => {
    if (!currentChallenge || isCorrectAnswer) return;

    const isCorrect = optionId === currentChallenge.correctOptionId;

    if (isCorrect) {
      // Calculate points: start at 10, minus 3 for each wrong attempt
      const earnedPoints = Math.max(1, MAX_POINTS_PER_QUESTION - (wrongCount * WRONG_ATTEMPT_PENALTY));
      
      setIsCorrectAnswer(true);
      setShowConfetti(true);
      setLocalScore(prev => prev + earnedPoints);
      setPointsFeedback({ points: earnedPoints, isPositive: true, key: Date.now() });

      // Update store
      useNumberJungleStore.setState(state => ({
        score: state.score + earnedPoints,
        stars: state.stars + 1,
        streak: state.streak + 1,
        isCorrect: true,
        showFeedback: true,
      }));
    } else {
      // Wrong answer
      if (!wrongAttempts.has(optionId)) {
        const newWrongAttempts = new Set(wrongAttempts);
        newWrongAttempts.add(optionId);
        setWrongAttempts(newWrongAttempts);
        setWrongCount(prev => prev + 1);
        setPointsFeedback({ points: -WRONG_ATTEMPT_PENALTY, isPositive: false, key: Date.now() });
      }
    }
  }, [currentChallenge, isCorrectAnswer, wrongAttempts, wrongCount]);

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
        <Celebration score={localScore} onPlayAgain={resetGame} />
      </div>
    );
  }

  const levelInfo = LEVEL_INFO[level];
  const potentialPoints = Math.max(1, MAX_POINTS_PER_QUESTION - (wrongCount * WRONG_ATTEMPT_PENALTY));

  return (
    <div className="max-w-lg mx-auto bg-gradient-to-b from-green-50 to-emerald-100 rounded-3xl shadow-2xl overflow-hidden relative">
      {/* Confetti */}
      {showConfetti && <ConfettiExplosion />}

      {/* Header */}
      <div className={`bg-gradient-to-r ${levelInfo.color} p-4 text-white relative`}>
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={resetGame}
            className="text-white/80 hover:text-white text-lg flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-white/20 transition-colors"
          >
            ← Menu
          </button>
          <div className="flex items-center gap-2">
            <span className="text-3xl">{levelInfo.emoji}</span>
            <span className="font-bold text-lg">{levelInfo.name}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
            <span className="text-xl">⭐</span>
            <span className="font-bold text-lg">{localScore}</span>
          </div>
        </div>

        <ProgressBar current={challengesCompleted} total={totalChallengesPerLevel} />

        <div className="flex justify-between text-sm mt-2 text-white/90">
          <span className="bg-white/20 px-2 py-1 rounded-full">
            Question {challengesCompleted + 1} / {totalChallengesPerLevel}
          </span>
          {!isCorrectAnswer && (
            <span className="bg-yellow-400/30 px-2 py-1 rounded-full">
              Worth: {potentialPoints} ⭐
            </span>
          )}
          {streak >= 2 && <span className="bg-orange-400/30 px-2 py-1 rounded-full">🔥 {streak} streak!</span>}
        </div>
      </div>

      {/* Challenge Area */}
      <div className="p-4 relative">
        {/* Points feedback */}
        {pointsFeedback && (
          <PointsFeedback 
            key={pointsFeedback.key} 
            points={pointsFeedback.points} 
            isPositive={pointsFeedback.isPositive} 
          />
        )}

        {currentChallenge && (
          <>
            {/* Title and instruction */}
            <div className="text-center mb-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-green-800">{currentChallenge.title}</h2>
              <p className="text-gray-600 mt-2 text-lg">{currentChallenge.instruction}</p>
              {isCorrectAnswer && (
                <p className="text-green-600 text-xl font-bold mt-2 animate-bounce">
                  🎉 Correct! Well done! 🎉
                </p>
              )}
              {wrongCount > 0 && !isCorrectAnswer && (
                <p className="text-orange-500 text-lg mt-2 animate-pulse">
                  Try again! 💪
                </p>
              )}
            </div>

            {/* Canvas */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
              <NumberJungleCanvas width={400} height={280} />
            </div>

            {/* Tap options - bigger and more tappable */}
            {currentChallenge.options.length > 0 && currentChallenge.type !== 'number-sequence' && (
              <div className="flex justify-center gap-4 mb-4 flex-wrap">
                {currentChallenge.options.map((option) => (
                  <TapOptionButton
                    key={option.id}
                    option={option}
                    isWrong={wrongAttempts.has(option.id)}
                    isCorrect={isCorrectAnswer && option.id === currentChallenge.correctOptionId}
                    isDisabled={wrongAttempts.has(option.id)}
                    onTap={() => handleOptionTap(option.id)}
                  />
                ))}
              </div>
            )}

            {/* Helpful hint after multiple wrong attempts */}
            {wrongCount >= 2 && !isCorrectAnswer && (
              <div className="text-center mt-4 p-3 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                <p className="text-yellow-700 text-lg">
                  💡 Hint: Count carefully one by one!
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add shake animation keyframes via style tag */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default NumberJungleGame;
