'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useBalloonBlastoffStore } from '@/app/store/useBalloonBlastoffStore';
import BalloonBlastoffCanvas from './BalloonBlastoffCanvas';
import { submitTelemetry } from '@/app/utils/gameUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Sparkles, Trophy, Target, Lightbulb, Volume2, VolumeX } from 'lucide-react';

// ============================================
// CONFETTI COMPONENT
// ============================================
const Confetti: React.FC<{ show: boolean }> = ({ show }) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#F7DC6F', '#BB8FCE'];
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    size: 8 + Math.random() * 8,
  }));

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute"
          initial={{ y: -20, x: `${piece.left}vw`, opacity: 1, rotate: 0 }}
          animate={{ 
            y: '110vh', 
            opacity: [1, 1, 0],
            rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
          }}
          transition={{ 
            duration: piece.duration,
            delay: piece.delay,
            ease: 'linear',
          }}
          style={{
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
};

// ============================================
// PROGRESS BAR COMPONENT
// ============================================
const ProgressBar: React.FC<{ current: number; target: number; isOver: boolean }> = ({ 
  current, 
  target, 
  isOver 
}) => {
  const percentage = Math.min((current / target) * 100, 100);
  const isExact = current === target;
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-white font-medium">Progress to {target}</span>
        <span className={`font-bold ${isExact ? 'text-green-300' : isOver ? 'text-red-300' : 'text-yellow-300'}`}>
          {current} / {target}
        </span>
      </div>
      <div className="h-4 bg-white/30 rounded-full overflow-hidden backdrop-blur">
        <motion.div
          className={`h-full rounded-full transition-colors duration-300 ${
            isExact 
              ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
              : isOver 
                ? 'bg-gradient-to-r from-red-400 to-red-500' 
                : 'bg-gradient-to-r from-yellow-400 to-orange-500'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        />
      </div>
      {isExact && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-1 text-green-300 font-bold text-sm"
        >
          ✨ Perfect! Bunny is flying! ✨
        </motion.div>
      )}
    </div>
  );
};

// ============================================
// FEEDBACK MESSAGE COMPONENT
// ============================================
const FeedbackMessage: React.FC<{ 
  type: 'success' | 'warning' | 'info' | null;
  message: string;
}> = ({ type, message }) => {
  if (!type) return null;

  const styles = {
    success: 'bg-green-100 border-green-400 text-green-800',
    warning: 'bg-red-100 border-red-400 text-red-800',
    info: 'bg-blue-100 border-blue-400 text-blue-800',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className={`${styles[type]} border-2 rounded-xl p-3 text-center font-bold text-lg shadow-lg`}
    >
      {type === 'warning' && (
        <motion.span
          animate={{ x: [-2, 2, -2, 2, 0] }}
          transition={{ duration: 0.4 }}
        >
          {message}
        </motion.span>
      )}
      {type !== 'warning' && message}
    </motion.div>
  );
};

// ============================================
// MAIN GAME COMPONENT
// ============================================

export default function BalloonBlastoffGame() {
  const store = useBalloonBlastoffStore();
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [showHint, setShowHint] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'success' | 'warning' | 'info' | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [hasReachedTarget, setHasReachedTarget] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const celebrationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const advanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle responsive canvas
  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById('balloon-game-container');
      if (container) {
        const maxWidth = Math.min(container.clientWidth - 40, 800);
        const height = maxWidth * 0.75;
        setCanvasSize({ width: maxWidth, height });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset state when level changes
  useEffect(() => {
    setWrongAttempts(0);
    setHasReachedTarget(false);
    setFeedbackType(null);
    setFeedbackMessage('');
    setShowConfetti(false);
  }, [store.targetSum, store.currentLevel]);

  // AUTOMATIC CHECK: Monitor currentSum and trigger celebration instantly
  useEffect(() => {
    if (store.gamePhase !== 'playing') return;

    const { currentSum, targetSum } = store;

    // EXACT MATCH - Celebrate immediately!
    if (currentSum === targetSum && currentSum > 0) {
      setHasReachedTarget(true);
      
      // Calculate points: 5 - wrongAttempts, minimum 1 point (20 questions × 5 = 100 max)
      const pointsEarned = Math.max(1, 5 - wrongAttempts);
      
      // Show celebration immediately
      setShowConfetti(true);
      setFeedbackType('success');
      setFeedbackMessage(`🎉 Perfect! +${pointsEarned} points!`);
      
      // Trigger floating animation
      store.setGamePhase('floating');
      
      // Auto-advance after 2.5 seconds
      advanceTimeoutRef.current = setTimeout(() => {
        handleAutoAdvance(pointsEarned);
      }, 2500);
    }
    // OVER TARGET - Show warning
    else if (currentSum > targetSum) {
      setFeedbackType('warning');
      setFeedbackMessage('🎈 Too many! Remove some balloons!');
    }
    // UNDER TARGET - Clear warning, show encouragement
    else if (currentSum > 0 && currentSum < targetSum) {
      const remaining = targetSum - currentSum;
      if (remaining <= 5) {
        setFeedbackType('info');
        setFeedbackMessage(`Almost there! Just ${remaining} more! 💪`);
      } else {
        setFeedbackType(null);
      }
    } else {
      setFeedbackType(null);
    }
  }, [store.currentSum, store.targetSum, store.gamePhase, wrongAttempts]);

  // Handle auto-advance to next level
  const handleAutoAdvance = useCallback((pointsEarned: number) => {
    const { roundsCompleted, totalRoundsPerSession, score, currentLevel, correctRounds } = store;
    
    const newRoundsCompleted = roundsCompleted + 1;
    const newCorrectRounds = correctRounds + 1;
    const newScore = Math.min(100, score + pointsEarned);

    // Check if session complete
    if (newRoundsCompleted >= totalRoundsPerSession) {
      // Session complete - go to celebrating
      store.setGamePhase('celebrating');
      submitTelemetry(store.getTelemetryLog());
    } else {
      // Advance to next level
      useBalloonBlastoffStore.setState({
        currentLevel: currentLevel + 1,
        roundsCompleted: newRoundsCompleted,
        correctRounds: newCorrectRounds,
        score: newScore,
      });
      store.generateLevel();
    }
    
    // Reset states
    setShowConfetti(false);
    setFeedbackType(null);
    setWrongAttempts(0);
    setHasReachedTarget(false);
  }, [store]);

  // Track balloon removals as potential mistakes
  const handleDetachBalloon = useCallback((balloonId: string) => {
    // If they remove after hitting target, count as wrong attempt
    if (hasReachedTarget || store.currentSum >= store.targetSum) {
      setWrongAttempts(prev => prev + 1);
    }
    store.detachBalloon(balloonId);
  }, [store, hasReachedTarget]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (celebrationTimeoutRef.current) clearTimeout(celebrationTimeoutRef.current);
      if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    };
  }, []);

  // Submit telemetry on session complete
  useEffect(() => {
    if (store.gamePhase === 'celebrating' && store.celebrationStarted) {
      const telemetry = store.getTelemetryLog();
      submitTelemetry(telemetry);
    }
  }, [store.gamePhase, store.celebrationStarted, store]);

  // Generate hint
  const getHint = (): string => {
    const remaining = store.targetSum - store.currentSum;
    
    if (remaining === 0) {
      return "🎉 Perfect! Your basket is ready to fly!";
    }
    
    if (remaining < 0) {
      return `⚠️ Your sum is ${Math.abs(remaining)} too big! Remove a balloon.`;
    }
    
    const helpfulBalloon = store.availableBalloons.find(
      (b) => b.value <= remaining
    );
    
    if (helpfulBalloon) {
      return `💡 You need ${remaining} more. Look for a balloon with ${remaining} or less!`;
    }
    
    return `🤔 You need ${remaining} more to reach ${store.targetSum}!`;
  };

  // ============================================
  // MENU STATE
  // ============================================
  if (store.gamePhase === 'menu') {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full"
        >
          <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl border-4 border-yellow-400">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-7xl mb-4"
              >
                🎈
              </motion.div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent mb-2">
                Balloon Blastoff!
              </h1>
              <p className="text-gray-600 text-lg">Learn Addition Through Fun!</p>
            </div>

            {/* Story Box */}
            <div className="bg-gradient-to-r from-sky-100 to-blue-100 rounded-2xl p-6 mb-6 border-l-4 border-sky-500">
              <h2 className="text-sky-700 font-bold text-lg mb-3 flex items-center gap-2">
                📖 The Story
              </h2>
              <p className="text-gray-700 leading-relaxed">
                A cute bunny wants to fly up to the clouds! Help the bunny by attaching 
                the right balloons to the basket. The numbers on the balloons must 
                <strong className="text-sky-600"> add up to the target number</strong> to make the basket fly!
              </p>
            </div>

            {/* Learning Goals */}
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 mb-6">
              <h2 className="text-emerald-700 font-bold text-lg mb-4 flex items-center gap-2">
                <Target size={20} />
                What You&apos;ll Learn
              </h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="text-emerald-500 font-bold text-xl">✓</span>
                  <span className="text-gray-700">Add numbers from <strong>1 to 100</strong></span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-500 font-bold text-xl">✓</span>
                  <span className="text-gray-700">Find <strong>different ways</strong> to make the same sum</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-500 font-bold text-xl">✓</span>
                  <span className="text-gray-700">Use <strong>mental math</strong> to solve problems</span>
                </li>
              </ul>
            </div>

            {/* How to Play - Updated instructions */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-6">
              <h2 className="text-purple-700 font-bold text-lg mb-4 flex items-center gap-2">
                🎮 How to Play
              </h2>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 text-sm font-bold">1</span>
                  <span className="text-gray-700">Look at the <strong>Target Number</strong> at the top</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 text-sm font-bold">2</span>
                  <span className="text-gray-700"><strong>Drag balloons</strong> from the shop to the basket</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 text-sm font-bold">3</span>
                  <span className="text-gray-700">When the sum <strong>matches exactly</strong>, bunny flies automatically! 🚀</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 text-sm font-bold">4</span>
                  <span className="text-gray-700">Too many? <strong>Drag balloons away</strong> to remove them!</span>
                </li>
              </ol>
            </div>

            {/* Difficulty Selection */}
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 mb-6">
              <h2 className="text-orange-700 font-bold text-lg mb-4 flex items-center gap-2">
                🎯 Choose Your Level
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {/* Easy */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => store.startGame('easy')}
                  className="bg-gradient-to-br from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white rounded-xl p-4 shadow-lg transition"
                >
                  <div className="text-3xl mb-2">🌱</div>
                  <div className="font-bold text-lg">Easy</div>
                  <div className="text-xs opacity-90 mt-1">Sums 5-20</div>
                  <div className="text-xs opacity-75">2 balloons needed</div>
                </motion.button>

                {/* Medium */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => store.startGame('medium')}
                  className="bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-xl p-4 shadow-lg transition"
                >
                  <div className="text-3xl mb-2">🌟</div>
                  <div className="font-bold text-lg">Medium</div>
                  <div className="text-xs opacity-90 mt-1">Sums 15-50</div>
                  <div className="text-xs opacity-75">2-3 balloons needed</div>
                </motion.button>

                {/* Hard */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => store.startGame('hard')}
                  className="bg-gradient-to-br from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white rounded-xl p-4 shadow-lg transition"
                >
                  <div className="text-3xl mb-2">🔥</div>
                  <div className="font-bold text-lg">Hard</div>
                  <div className="text-xs opacity-90 mt-1">Sums 40-100</div>
                  <div className="text-xs opacity-75">3-4 balloons needed</div>
                </motion.button>
              </div>
            </div>

            {/* Quick Start Button */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => store.startGame('easy')}
                className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 text-white font-bold py-4 px-12 rounded-full text-xl shadow-lg transition flex items-center gap-3"
              >
                <Sparkles size={24} />
                Quick Start (Easy)
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ============================================
  // PLAYING / FLOATING STATE
  // ============================================
  if (store.gamePhase === 'playing' || store.gamePhase === 'floating') {
    // Difficulty badge colors
    const difficultyColors = {
      easy: 'bg-green-400 text-green-900',
      medium: 'bg-yellow-400 text-yellow-900',
      hard: 'bg-red-400 text-red-900',
    };
    const difficultyEmojis = {
      easy: '🌱',
      medium: '🌟',
      hard: '🔥',
    };

    const isExactMatch = store.currentSum === store.targetSum;
    const isOver = store.currentSum > store.targetSum;

    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 p-4">
        {/* Celebration Confetti */}
        <Confetti show={showConfetti} />
        
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                🎈 Balloon Blastoff
              </h1>
              <div className={`px-3 py-1.5 rounded-full font-bold flex items-center gap-2 text-sm ${difficultyColors[store.difficulty]}`}>
                {difficultyEmojis[store.difficulty]} {store.difficulty.charAt(0).toUpperCase() + store.difficulty.slice(1)}
              </div>
              <div className="bg-white/20 backdrop-blur px-3 py-1.5 rounded-full text-white text-sm">
                Level {store.currentLevel}
              </div>
              <div className="bg-blue-400 px-3 py-1.5 rounded-full text-white font-medium text-sm">
                Round {store.roundsCompleted + 1}/{store.totalRoundsPerSession}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Score */}
              <div className="bg-yellow-400 px-4 py-2 rounded-full text-yellow-900 font-bold flex items-center gap-2">
                <Trophy size={18} />
                {store.score}/100
              </div>
              
              {/* Wrong Attempts Indicator */}
              {wrongAttempts > 0 && (
                <div className="bg-orange-400 px-3 py-1.5 rounded-full text-orange-900 font-medium text-sm">
                  Retries: {wrongAttempts}
                </div>
              )}
              
              {/* Hint Button */}
              <button
                onClick={() => setShowHint(!showHint)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full transition flex items-center gap-2"
              >
                <Lightbulb size={18} />
                Hint
              </button>
              
              {/* Sound Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition"
              >
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
              
              {/* Reset Button */}
              <button
                onClick={() => store.resetGame()}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full transition flex items-center gap-2"
              >
                <RotateCcw size={18} />
                Menu
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <ProgressBar 
              current={store.currentSum} 
              target={store.targetSum} 
              isOver={isOver}
            />
          </div>

          {/* Feedback Message */}
          <AnimatePresence mode="wait">
            {feedbackType && (
              <div className="mb-4">
                <FeedbackMessage type={feedbackType} message={feedbackMessage} />
              </div>
            )}
          </AnimatePresence>

          {/* Hint Display */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-purple-100 border-2 border-purple-300 rounded-xl p-4 mb-4 text-purple-800 font-medium overflow-hidden"
              >
                {getHint()}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Game Canvas */}
          <motion.div 
            id="balloon-game-container" 
            className={`bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
              isExactMatch ? 'ring-4 ring-green-400 ring-opacity-75' : ''
            } ${isOver ? 'ring-4 ring-red-400 ring-opacity-75' : ''}`}
            animate={isOver ? { x: [-5, 5, -5, 5, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <BalloonBlastoffCanvas
              width={canvasSize.width}
              height={canvasSize.height}
              targetSum={store.targetSum}
              currentSum={store.currentSum}
              availableBalloons={store.availableBalloons}
              attachedBalloons={store.attachedBalloons}
              gamePhase={store.gamePhase}
              onAttachBalloon={store.attachBalloon}
              onDetachBalloon={handleDetachBalloon}
            />
          </motion.div>

          {/* Bottom Stats */}
          <div className="mt-4 flex justify-center gap-4 flex-wrap">
            <motion.div 
              className={`backdrop-blur px-6 py-3 rounded-xl text-center transition-all duration-300 ${
                isExactMatch 
                  ? 'bg-green-500/50 text-white ring-2 ring-green-300' 
                  : isOver 
                    ? 'bg-red-500/30 text-white' 
                    : 'bg-white/20 text-white'
              }`}
              animate={isExactMatch ? { scale: [1, 1.05, 1] } : {}}
              transition={{ repeat: isExactMatch ? Infinity : 0, duration: 1 }}
            >
              <div className="text-sm opacity-80">Current Sum</div>
              <div className="font-bold text-2xl">
                {store.currentSum} {isExactMatch ? '✓' : ''} / {store.targetSum}
              </div>
            </motion.div>
            <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-xl text-white text-center">
              <div className="text-sm opacity-80">Balloons Used</div>
              <div className="font-bold text-xl">{store.attachedBalloons.length}</div>
            </div>
            <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-xl text-white text-center">
              <div className="text-sm opacity-80">Points This Round</div>
              <div className="font-bold text-xl text-yellow-300">
                {Math.max(1, 5 - wrongAttempts)}
              </div>
            </div>
          </div>

          {/* Instructions reminder */}
          <div className="mt-4 text-center text-white/70 text-sm">
            💡 Drag balloons to the basket. When sum = {store.targetSum}, bunny flies automatically!
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // SUCCESS STATE (Brief transition - auto-advances)
  // ============================================
  if (store.gamePhase === 'success') {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex items-center justify-center p-4">
        <Confetti show={true} />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="text-9xl mb-6"
          >
            🎉
          </motion.div>
          <h1 className="text-5xl font-bold text-white mb-4">Amazing!</h1>
          <p className="text-2xl text-white/90">Moving to next level...</p>
        </motion.div>
      </div>
    );
  }

  // ============================================
  // CELEBRATING STATE (Session Complete)
  // ============================================
  if (store.gamePhase === 'celebrating') {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 flex items-center justify-center p-4">
        <Confetti show={true} />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full"
        >
          <div className="bg-white rounded-3xl p-8 shadow-2xl text-center">
            {/* Trophy Animation */}
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-8xl mb-6"
            >
              🏆
            </motion.div>

            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500 mb-2">
              Session Complete!
            </h1>
            
            <p className="text-gray-600 text-lg mb-6">
              You finished all {store.totalRoundsPerSession} rounds! The bunny is so happy!
            </p>

            {/* Final Score */}
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 mb-6">
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600 mb-2">
                {store.score}/100
              </div>
              <div className="text-gray-500">Final Score</div>
              
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/50 rounded-xl p-3">
                  <div className="text-2xl font-bold text-emerald-600">{store.correctRounds}</div>
                  <div className="text-gray-500">Rounds Won</div>
                </div>
                <div className="bg-white/50 rounded-xl p-3">
                  <div className="text-2xl font-bold text-blue-600">{store.currentLevel}</div>
                  <div className="text-gray-500">Levels Played</div>
                </div>
              </div>
            </div>

            {/* Performance Message */}
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 mb-6">
              {store.score >= 80 && (
                <p className="text-emerald-700 font-medium">
                  🌟 Outstanding! You&apos;re an addition superstar!
                </p>
              )}
              {store.score >= 60 && store.score < 80 && (
                <p className="text-emerald-700 font-medium">
                  ⭐ Great job! You&apos;re getting really good at this!
                </p>
              )}
              {store.score < 60 && (
                <p className="text-emerald-700 font-medium">
                  💪 Good effort! Practice makes perfect!
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => store.startGame(store.difficulty)}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition flex items-center gap-2"
              >
                <Sparkles size={20} />
                Play Again
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => store.resetGame()}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-full transition flex items-center gap-2"
              >
                <RotateCcw size={18} />
                Menu
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Fallback
  return null;
}
