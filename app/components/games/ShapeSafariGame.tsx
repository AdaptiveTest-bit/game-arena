'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';
import ShapeSafariCanvas from './ShapeSafariCanvas';
import { useShapeSafariStore, ChallengeOption } from '@/app/store/useShapeSafariStore';
import { RotateCcw, Star, Trophy, Sparkles } from 'lucide-react';

// Helper function to render shape icons for options - BIGGER for small fingers!
const ShapeIcon = ({ shape, size = 100 }: { shape: string; size?: number }) => {
  const shapeColors: Record<string, string> = {
    circle: '#FF6B6B',
    square: '#4ECDC4',
    rectangle: '#45B7D1',
    triangle: '#96CEB4',
    cube: '#DDA0DD',
    sphere: '#FFB347',
    cone: '#87CEEB',
    cylinder: '#98D8C8',
    cuboid: '#F7DC6F',
  };

  const color = shapeColors[shape] || '#888';

  switch (shape) {
    case 'circle':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill={color} stroke="#333" strokeWidth="3" />
        </svg>
      );
    case 'square':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <rect x="12" y="12" width="76" height="76" fill={color} stroke="#333" strokeWidth="3" />
        </svg>
      );
    case 'rectangle':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <rect x="8" y="25" width="84" height="50" fill={color} stroke="#333" strokeWidth="3" />
        </svg>
      );
    case 'triangle':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <polygon points="50,10 90,85 10,85" fill={color} stroke="#333" strokeWidth="3" />
        </svg>
      );
    case 'cube':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <polygon points="20,35 50,20 80,35 80,70 50,85 20,70" fill={color} stroke="#333" strokeWidth="2" />
          <line x1="50" y1="20" x2="50" y2="55" stroke="#333" strokeWidth="2" />
          <line x1="20" y1="35" x2="50" y2="55" stroke="#333" strokeWidth="2" />
          <line x1="80" y1="35" x2="50" y2="55" stroke="#333" strokeWidth="2" />
        </svg>
      );
    case 'sphere':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <defs>
            <radialGradient id={`sphereGrad-${size}`} cx="35%" cy="35%">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="100%" stopColor={color} />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="42" fill={`url(#sphereGrad-${size})`} stroke="#333" strokeWidth="2" />
        </svg>
      );
    case 'cone':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <polygon points="50,10 85,80 15,80" fill={color} stroke="#333" strokeWidth="2" />
          <ellipse cx="50" cy="80" rx="35" ry="10" fill={color} stroke="#333" strokeWidth="2" />
        </svg>
      );
    case 'cylinder':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <ellipse cx="50" cy="25" rx="35" ry="12" fill={color} stroke="#333" strokeWidth="2" />
          <rect x="15" y="25" width="70" height="50" fill={color} />
          <line x1="15" y1="25" x2="15" y2="75" stroke="#333" strokeWidth="2" />
          <line x1="85" y1="25" x2="85" y2="75" stroke="#333" strokeWidth="2" />
          <ellipse cx="50" cy="75" rx="35" ry="12" fill={color} stroke="#333" strokeWidth="2" />
        </svg>
      );
    case 'cuboid':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <polygon points="10,30 40,20 90,30 90,75 60,85 10,75" fill={color} stroke="#333" strokeWidth="2" />
          <line x1="40" y1="20" x2="40" y2="65" stroke="#333" strokeWidth="2" />
          <line x1="10" y1="30" x2="40" y2="45" stroke="#333" strokeWidth="2" />
          <line x1="90" y1="30" x2="40" y2="45" stroke="#333" strokeWidth="2" />
        </svg>
      );
    default:
      return <span className="text-5xl">{shape}</span>;
  }
};

// Celebration component
const Celebration = ({ score, stars, level, onPlayAgain, onMenu }: {
  score: number;
  stars: number;
  level: number;
  onPlayAgain: () => void;
  onMenu: () => void;
}) => {
  const springProps = useSpring({
    from: { scale: 0, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    config: { tension: 200, friction: 15 },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-300 flex items-center justify-center p-4">
      <animated.div
        style={{
          transform: springProps.scale.to((s) => `scale(${s})`),
          opacity: springProps.opacity,
        }}
        className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-md border-4 border-yellow-400"
      >
        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        <h1 className="text-4xl font-bold text-purple-600 mb-4">Level Complete!</h1>

        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((i) => {
            // Star rating based on score out of 100
            const starRating = score >= 90 ? 5 : score >= 70 ? 4 : score >= 50 ? 3 : score >= 30 ? 2 : 1;
            return (
              <Star
                key={i}
                size={40}
                className={`${i <= starRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} transition-all`}
              />
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 mb-6">
          <div className="flex justify-around">
            <div>
              <p className="text-gray-600 text-sm">Score</p>
              <p className="text-3xl font-bold text-purple-600">{score}<span className="text-lg text-gray-400">/100</span></p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Correct</p>
              <p className="text-3xl font-bold text-yellow-500">{stars} ⭐</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Level</p>
              <p className="text-3xl font-bold text-blue-500">{level}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onPlayAgain}
            className="flex-1 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-transform"
          >
            🔄 Play Again
          </button>
          <button
            onClick={onMenu}
            className="flex-1 bg-gradient-to-r from-purple-400 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-transform"
          >
            🏠 Menu
          </button>
        </div>
      </animated.div>
    </div>
  );
};

// Confetti burst component for correct answers
const ConfettiBurst = () => {
  const confettiColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFB347'];
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-20px',
            width: `${Math.random() * 15 + 10}px`,
            height: `${Math.random() * 15 + 10}px`,
            backgroundColor: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${Math.random() * 1 + 1.5}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default function ShapeSafariGame() {
  const store = useShapeSafariStore();
  const {
    gameState,
    level,
    score,
    stars,
    currentChallenge,
    challengesCompleted,
    totalChallengesPerLevel,
    resetGame,
    startGame,
    nextChallenge,
  } = store;

  // Local state for interactive tap-to-answer gameplay
  const [wrongAttempts, setWrongAttempts] = useState<Set<string>>(new Set());
  const [currentScore, setCurrentScore] = useState(5); // Max 5 points per question (20 × 5 = 100)
  const [showSuccess, setShowSuccess] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'wrong' | 'correct' | null; optionId: string | null }>({ type: null, optionId: null });
  const [showConfetti, setShowConfetti] = useState(false);
  const [localScore, setLocalScore] = useState(0);
  const [localStars, setLocalStars] = useState(0);
  
  // Track previous challenge ID to detect changes
  const prevChallengeIdRef = useRef<string | null>(null);

  // Reset local state when challenge changes
  useEffect(() => {
    if (currentChallenge && currentChallenge.id !== prevChallengeIdRef.current) {
      setWrongAttempts(new Set());
      setCurrentScore(5);
      setShowSuccess(false);
      setFeedback({ type: null, optionId: null });
      setShowConfetti(false);
      prevChallengeIdRef.current = currentChallenge.id;
    }
  }, [currentChallenge]);

  // Sync with store score on game start
  useEffect(() => {
    if (gameState === 'playing' && challengesCompleted === 0) {
      setLocalScore(0);
      setLocalStars(0);
    }
  }, [gameState, challengesCompleted]);

  // Handle shape tap
  const handleShapeTap = useCallback((optionId: string) => {
    if (!currentChallenge || showSuccess || feedback.type === 'correct') return;
    
    const isCorrect = optionId === currentChallenge.correctOptionId;
    
    if (isCorrect) {
      // Correct answer!
      setShowSuccess(true);
      setFeedback({ type: 'correct', optionId });
      setShowConfetti(true);
      
      // Add points to local score (capped at 100)
      const earnedPoints = Math.max(1, currentScore);
      setLocalScore(prev => Math.min(100, prev + earnedPoints));
      setLocalStars(prev => prev + 1);
      
      // Auto-advance after 1.5 seconds
      setTimeout(() => {
        setShowConfetti(false);
        nextChallenge();
      }, 1500);
    } else {
      // Wrong answer - shake and allow retry
      setWrongAttempts(prev => new Set([...prev, optionId]));
      // Deduct more marks when only 2 options (50% guess chance = bigger penalty)
      const optionCount = currentChallenge.options.length;
      const deduction = optionCount <= 2 ? 3 : 1; // -3 for 2 options, -1 for more options
      setCurrentScore(prev => Math.max(1, prev - deduction));
      setFeedback({ type: 'wrong', optionId });
      
      // Clear wrong feedback after shake animation
      setTimeout(() => {
        setFeedback({ type: null, optionId: null });
      }, 600);
    }
  }, [currentChallenge, showSuccess, feedback.type, currentScore, nextChallenge]);

  // Menu screen
  if (gameState === 'menu') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-4">
        <div className="text-center max-w-2xl bg-white rounded-3xl p-8 shadow-2xl border-4 border-purple-300">
          {/* Title */}
          <div className="mb-6">
            <div className="text-7xl mb-4 animate-bounce">🦁🔺🟦</div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
              Shape Safari
            </h1>
            <p className="text-xl text-gray-600 font-semibold">Adventure</p>
            <p className="text-lg text-gray-500 mt-2">Explore the World of Shapes! 🌟</p>
          </div>

          {/* What you'll learn */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-4 border-yellow-300 rounded-2xl p-4 mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">📚 Learn About:</h3>
            <div className="grid grid-cols-2 gap-2 text-left">
              <div className="flex items-center gap-2 text-lg">
                <span className="text-2xl">🔺</span>
                <span className="text-gray-700">Circles, Squares, Triangles</span>
              </div>
              <div className="flex items-center gap-2 text-lg">
                <span className="text-2xl">🧊</span>
                <span className="text-gray-700">Cubes, Spheres, Cones</span>
              </div>
              <div className="flex items-center gap-2 text-lg">
                <span className="text-2xl">📏</span>
                <span className="text-gray-700">Lines & Patterns</span>
              </div>
              <div className="flex items-center gap-2 text-lg">
                <span className="text-2xl">🧭</span>
                <span className="text-gray-700">Above, Below, Inside</span>
              </div>
            </div>
          </div>

          {/* How to Play - UPDATED for tap gameplay */}
          <div className="bg-green-50 border-4 border-green-300 rounded-2xl p-4 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">🎮 How to Play:</h3>
            <ul className="text-left space-y-2 text-lg text-gray-700">
              <li>👆 <strong>TAP</strong> the shape you think is correct!</li>
              <li>✅ Right answer = <strong>Celebrate & move on!</strong></li>
              <li>🔄 Wrong? <strong>Try again!</strong> (lose 1-3 points)</li>
              <li>⭐ Get 5 points for first try! (Max: 100)</li>
            </ul>
          </div>

          {/* Level Selection */}
          <h3 className="text-2xl font-bold text-gray-800 mb-4">🎯 Choose Your Level:</h3>

          <div className="grid grid-cols-1 gap-4 mb-4">
            {/* Level 1 - Easy */}
            <button
              onClick={() => startGame(1)}
              className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-4 px-8 rounded-2xl text-2xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
            >
              <span className="text-3xl">🌱</span>
              <span>Level 1 - EASY</span>
              <span className="text-sm bg-white/20 px-2 py-1 rounded">2D Shapes</span>
            </button>

            {/* Level 2 - Medium */}
            <button
              onClick={() => startGame(2)}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-2xl text-2xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
            >
              <span className="text-3xl">🌳</span>
              <span>Level 2 - MEDIUM</span>
              <span className="text-sm bg-white/20 px-2 py-1 rounded">3D Shapes + Patterns</span>
            </button>

            {/* Level 3 - Hard */}
            <button
              onClick={() => startGame(3)}
              className="bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-2xl text-2xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
            >
              <span className="text-3xl">🏆</span>
              <span>Level 3 - HARD</span>
              <span className="text-sm bg-white/20 px-2 py-1 rounded">All Challenges!</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Celebration screen - use local scores
  if (gameState === 'celebrating') {
    return (
      <Celebration
        score={localScore || score}
        stars={localStars || stars}
        level={level}
        onPlayAgain={() => {
          setLocalScore(0);
          setLocalStars(0);
          startGame(level);
        }}
        onMenu={() => {
          setLocalScore(0);
          setLocalStars(0);
          resetGame();
        }}
      />
    );
  }

  // Playing screen
  if (!currentChallenge) return null;

  const options = currentChallenge.options;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4">
      {/* Confetti effect on correct answer */}
      {showConfetti && <ConfettiBurst />}
      
      <div className="max-w-4xl mx-auto flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-lg">
          <button
            onClick={() => {
              setLocalScore(0);
              setLocalStars(0);
              resetGame();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200 transition-all"
          >
            <RotateCcw size={20} />
            <span className="font-bold">Menu</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
              <Star size={20} className="text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-yellow-700">{localStars}</span>
            </div>
            <div className="flex items-center gap-1 bg-purple-100 px-3 py-1 rounded-full">
              <Trophy size={20} className="text-purple-500" />
              <span className="font-bold text-purple-700">{localScore}</span>
            </div>
            {/* Show potential points for this question */}
            <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
              <span className="text-sm text-green-700">+{currentScore} pts</span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">Level {level}</p>
            <p className="font-bold text-gray-700">
              {challengesCompleted + 1} / {totalChallengesPerLevel}
            </p>
          </div>
        </div>

        {/* Challenge Title & Instruction */}
        <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
          <h2 className="text-3xl font-bold text-purple-600 mb-2">{currentChallenge.title}</h2>
          <p className="text-xl text-gray-700">{currentChallenge.instruction}</p>
        </div>

        {/* Canvas with visualization */}
        <ShapeSafariCanvas />

        {/* Answer Options - TAP TO ANSWER! */}
        <div className="w-full">
          <p className="text-center text-2xl font-bold text-gray-700 mb-4">
            👆 Tap the correct shape!
          </p>

          {/* Bigger grid for small fingers */}
          <div className="grid grid-cols-2 gap-6 max-w-3xl mx-auto px-4">
            {options.map((option: ChallengeOption, idx: number) => {
              const colors = [
                'from-red-400 to-red-600',
                'from-blue-400 to-blue-600',
                'from-green-400 to-green-600',
                'from-yellow-400 to-orange-500',
                'from-purple-400 to-purple-600',
                'from-pink-400 to-pink-600',
              ];
              const colorClass = colors[idx % colors.length];
              const isCorrectOption = option.id === currentChallenge?.correctOptionId;
              const wasWrong = wrongAttempts.has(option.id);
              const isShaking = feedback.type === 'wrong' && feedback.optionId === option.id;
              const isCorrectAndShowing = showSuccess && isCorrectOption;

              // Dynamic styling based on state
              let borderClass = 'border-white/50';
              let extraClasses = '';
              
              if (isCorrectAndShowing) {
                borderClass = 'border-green-400 ring-8 ring-green-300';
                extraClasses = 'animate-pulse scale-110';
              } else if (isShaking) {
                borderClass = 'border-red-500 ring-4 ring-red-300';
                extraClasses = 'animate-shake';
              } else if (wasWrong) {
                borderClass = 'border-gray-400';
                extraClasses = 'opacity-50';
              }

              // Check if option has a renderable shape
              const isRenderableShape = option.shape && [
                'circle', 'square', 'rectangle', 'triangle',
                'cube', 'sphere', 'cone', 'cylinder', 'cuboid'
              ].includes(option.shape);

              // Hide labels for shape identification challenges
              const hideShapeLabel = currentChallenge?.type === 'identify-2d' || 
                                     currentChallenge?.type === 'identify-3d' ||
                                     currentChallenge?.type === 'pattern-complete' ||
                                     currentChallenge?.type === 'odd-one-out';

              return (
                <button
                  key={option.id}
                  onClick={() => handleShapeTap(option.id)}
                  disabled={showSuccess || wasWrong}
                  className={`bg-gradient-to-br ${colorClass} p-6 rounded-3xl border-4 ${borderClass} transition-all transform shadow-xl text-center text-white font-bold ${extraClasses} ${
                    showSuccess || wasWrong ? 'cursor-not-allowed' : 'hover:scale-105 hover:shadow-2xl active:scale-95'
                  }`}
                  style={{
                    minHeight: '160px', // Bigger touch target for kids
                  }}
                >
                  <div className="min-h-28 flex flex-col items-center justify-center gap-2">
                    {isRenderableShape ? (
                      <>
                        <div className="bg-white/90 rounded-2xl p-3 shadow-lg">
                          {/* Bigger shape icon for kids */}
                          <ShapeIcon shape={option.shape!} size={90} />
                        </div>
                        {!hideShapeLabel && <span className="text-lg mt-2 font-bold">{option.label}</span>}
                      </>
                    ) : (
                      <span className="text-3xl font-bold">{option.label}</span>
                    )}
                  </div>
                  
                  {/* Wrong attempt indicator */}
                  {wasWrong && !isShaking && (
                    <div className="mt-2 text-white/80 text-sm">❌ Try another!</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Success Feedback */}
        {showSuccess && (
          <div className="w-full max-w-2xl mx-auto text-center py-6 px-8 rounded-2xl text-3xl font-bold shadow-lg animate-bounce bg-green-200 border-4 border-green-500 text-green-800">
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="text-yellow-500" size={40} />
              <span>🎉 Amazing! +{currentScore} points! ⭐</span>
              <Sparkles className="text-yellow-500" size={40} />
            </div>
          </div>
        )}

        {/* Wrong attempt feedback */}
        {feedback.type === 'wrong' && (
          <div className="w-full max-w-md mx-auto text-center py-4 px-6 rounded-2xl text-2xl font-bold shadow-lg bg-orange-200 border-4 border-orange-400 text-orange-800 animate-bounce">
            🤔 Try again! (-3 points)
          </div>
        )}
      </div>

      {/* Shake animation CSS */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
