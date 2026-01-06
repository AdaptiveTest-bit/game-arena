'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import DataDetectiveCanvas from './DataDetectiveCanvas';
import { useDataDetectiveStore, Difficulty } from '../../store/useDataDetectiveStore';

// ─────────────────────────────────────────────────────────────
// CONFETTI COMPONENT (CSS-based)
// ─────────────────────────────────────────────────────────────

interface ConfettiProps {
  count?: number;
  duration?: number;
}

const Confetti: React.FC<ConfettiProps> = ({ count = 50, duration = 3000 }) => {
  const [pieces, setPieces] = useState<Array<{ id: number; x: number; delay: number; emoji: string }>>([]);
  
  useEffect(() => {
    const emojis = ['🎉', '⭐', '✨', '🌟', '💫', '🎊', '💜', '💖'];
    const newPieces = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
    setPieces(newPieces);
    
    const timer = setTimeout(() => setPieces([]), duration);
    return () => clearTimeout(timer);
  }, [count, duration]);
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ y: -50, x: `${piece.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '100vh', opacity: 0, rotate: 360 }}
          transition={{ duration: 2 + Math.random(), delay: piece.delay, ease: 'linear' }}
          className="absolute text-2xl"
        >
          {piece.emoji}
        </motion.div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MASCOT COMPONENT - Dotty the Detective Dog
// ─────────────────────────────────────────────────────────────

interface MascotProps {
  message: string;
  mood: 'happy' | 'thinking' | 'celebrating' | 'encouraging';
  showBubble?: boolean;
}

const Mascot: React.FC<MascotProps> = ({ message, mood, showBubble = true }) => {
  const getMascotEmoji = () => {
    switch (mood) {
      case 'happy': return '🐕‍🦺';
      case 'thinking': return '🔍';
      case 'celebrating': return '🎉';
      case 'encouraging': return '💪';
      default: return '🐕‍🦺';
    }
  };
  
  const bounce = useSpring({
    from: { y: 0 },
    to: async (next) => {
      while (true) {
        await next({ y: -8 });
        await next({ y: 0 });
      }
    },
    config: { tension: 300, friction: 10 },
  });
  
  return (
    <div className="flex items-end gap-3">
      <animated.div style={bounce} className="text-5xl">
        {getMascotEmoji()}
      </animated.div>
      
      {showBubble && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: -10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          className="relative bg-white rounded-2xl px-4 py-3 shadow-lg border-2 border-purple-200 max-w-xs"
        >
          <div className="absolute -left-2 bottom-4 w-4 h-4 bg-white border-l-2 border-b-2 border-purple-200 transform rotate-45" />
          <p className="text-gray-700 font-medium text-sm relative z-10">{message}</p>
        </motion.div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// WELCOME SCREEN
// ─────────────────────────────────────────────────────────────

const WelcomeScreen: React.FC = () => {
  const { setPhase } = useDataDetectiveStore();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center p-6"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="text-8xl mb-4"
        >
          🐕‍🦺📊
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold text-purple-600 mb-4"
        >
          Data Detective Island
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-6 text-lg"
        >
          Join Dotty the Detective Dog to collect clues, count objects, and solve data mysteries! 🔍
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-3 mb-6 text-left bg-purple-50 rounded-xl p-4"
        >
          <p className="text-purple-800 font-semibold">📚 You'll learn:</p>
          <ul className="text-gray-600 text-sm space-y-2">
            <li>🔢 Counting & collecting data</li>
            <li>📊 Reading tally marks & pictographs</li>
            <li>🔄 Sorting objects by properties</li>
            <li>⚖️ Comparing quantities</li>
          </ul>
        </motion.div>
        
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPhase('difficulty')}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-12 rounded-full text-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          Start Adventure! 🚀
        </motion.button>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────
// DIFFICULTY SELECTION SCREEN
// ─────────────────────────────────────────────────────────────

const DifficultyScreen: React.FC = () => {
  const { setDifficulty } = useDataDetectiveStore();
  
  const difficulties: { level: Difficulty; emoji: string; title: string; desc: string; color: string }[] = [
    {
      level: 'easy',
      emoji: '🌱',
      title: 'Junior Detective',
      desc: 'Count to 5, simple sorting, tally marks',
      color: 'from-green-400 to-emerald-500',
    },
    {
      level: 'medium',
      emoji: '⭐',
      title: 'Smart Detective',
      desc: 'Count to 8, pictographs, comparisons',
      color: 'from-yellow-400 to-orange-500',
    },
    {
      level: 'hard',
      emoji: '🏆',
      title: 'Master Detective',
      desc: 'Count to 10, build pictographs, data questions',
      color: 'from-purple-500 to-pink-500',
    },
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center p-6"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <span className="text-5xl">🐕‍🦺</span>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">Choose Your Level!</h2>
        </div>
        
        <div className="space-y-4">
          {difficulties.map((diff, idx) => (
            <motion.button
              key={diff.level}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * idx }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDifficulty(diff.level)}
              className={`w-full bg-gradient-to-r ${diff.color} text-white rounded-2xl p-4 text-left shadow-lg hover:shadow-xl transition-shadow`}
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{diff.emoji}</span>
                <div>
                  <h3 className="font-bold text-lg">{diff.title}</h3>
                  <p className="text-sm opacity-90">{diff.desc}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────
// PLAYING SCREEN
// ─────────────────────────────────────────────────────────────

const PlayingScreen: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 450 });
  
  const {
    currentQuestion,
    round,
    totalRounds,
    score,
    streak,
    selectedAnswer,
    selectedObjects,
    tallyCount,
    pictographBuilt,
    attempts,
    submitAnswer,
    selectAnswer,
  } = useDataDetectiveStore();
  
  // Resize canvas
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = Math.min(containerRef.current.clientWidth - 32, 700);
        const height = Math.min(500, window.innerHeight - 320);
        setCanvasSize({ width, height: Math.max(400, height) });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  if (!currentQuestion) return null;
  
  // Determine if can submit for MCQ questions
  const canSubmitMCQ = ['count-objects', 'read-tally', 'read-pictograph', 'compare-data', 'data-question'].includes(currentQuestion.type) && selectedAnswer !== null;
  
  // Get activity type icon
  const getActivityIcon = () => {
    switch (currentQuestion.type) {
      case 'count-objects': return '🔢';
      case 'sort-objects': return '🧺';
      case 'make-tally': return '📊';
      case 'read-tally': return '📈';
      case 'read-pictograph': return '📉';
      case 'compare-data': return '⚖️';
      case 'data-question': return '❓';
      case 'build-pictograph': return '🏗️';
      default: return '📊';
    }
  };
  
  // Get mascot message
  const getMascotMessage = () => {
    if (attempts > 0) {
      return "Hmm, let's try again! Look carefully! 🔍";
    }
    switch (currentQuestion.type) {
      case 'count-objects': return 'Count each one carefully!';
      case 'sort-objects': return 'Find all the matching items!';
      case 'make-tally': return 'Tap + to add tally marks!';
      case 'read-tally': return 'Count the tally marks!';
      case 'read-pictograph': return 'Look at the picture chart!';
      case 'compare-data': return 'Which group has more?';
      case 'data-question': return 'Read the data carefully!';
      case 'build-pictograph': return 'Add the right amount!';
      default: return "Let's solve this mystery!";
    }
  };
  
  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50 p-4"
    >
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-3">
        <div className="flex justify-between items-center bg-white rounded-2xl px-6 py-3 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 rounded-xl px-4 py-2">
              <span className="text-purple-600 font-bold">
                Round {round}/{totalRounds}
              </span>
            </div>
            <div className="bg-yellow-100 rounded-xl px-4 py-2">
              <span className="text-yellow-600 font-bold">⭐ {score}</span>
            </div>
            {streak >= 2 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-orange-100 rounded-xl px-3 py-2"
              >
                <span className="text-orange-600 font-bold">🔥 {streak}</span>
              </motion.div>
            )}
          </div>
          
          <div className="text-3xl">{getActivityIcon()}</div>
        </div>
      </div>
      
      {/* Mascot & Question */}
      <div className="max-w-4xl mx-auto mb-3">
        <div className="bg-white rounded-2xl px-6 py-4 shadow-lg">
          <Mascot
            message={getMascotMessage()}
            mood={attempts > 0 ? 'encouraging' : 'thinking'}
          />
          
          <motion.div
            key={currentQuestion.instruction}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-center"
          >
            <p className="text-xl font-bold text-gray-800">{currentQuestion.instruction}</p>
          </motion.div>
        </div>
      </div>
      
      {/* Canvas */}
      <div className="max-w-4xl mx-auto mb-3">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex justify-center p-4">
          <DataDetectiveCanvas width={canvasSize.width} height={canvasSize.height} />
        </div>
      </div>
      
      {/* Submit Button for MCQ types */}
      {canSubmitMCQ && (
        <div className="max-w-4xl mx-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={submitAnswer}
            className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold py-4 rounded-2xl text-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            Check Answer ✓
          </motion.button>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// FEEDBACK SCREEN
// ─────────────────────────────────────────────────────────────

const FeedbackScreen: React.FC = () => {
  const { isCorrect, currentQuestion, streak, nextRound } = useDataDetectiveStore();
  
  // Get correct answer display
  const getCorrectAnswerDisplay = () => {
    if (!currentQuestion) return '';
    
    switch (currentQuestion.type) {
      case 'count-objects':
      case 'read-tally':
      case 'data-question':
        return currentQuestion.correctAnswer.toString();
      case 'sort-objects':
        return `${currentQuestion.correctObjectIds.length} items`;
      case 'make-tally':
        return currentQuestion.targetNumber.toString();
      case 'read-pictograph':
      case 'compare-data':
        return currentQuestion.correctAnswer;
      case 'build-pictograph':
        return currentQuestion.targetCount.toString();
      default:
        return '';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50 flex items-center justify-center p-6"
    >
      {isCorrect && <Confetti count={50} duration={3000} />}
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
      >
        {isCorrect ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className="text-8xl mb-4"
            >
              🎉
            </motion.div>
            
            <h2 className="text-3xl font-bold text-green-600 mb-2">Fantastic!</h2>
            <p className="text-gray-600 mb-4">
              You solved it! +10 points!
              {streak >= 2 && <span className="text-orange-500"> (+5 streak bonus! 🔥)</span>}
            </p>
            
            <Mascot message="Great detective work! 🐕‍🦺" mood="celebrating" />
          </>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className="text-8xl mb-4"
            >
              🤔
            </motion.div>
            
            <h2 className="text-3xl font-bold text-orange-600 mb-2">Not Quite!</h2>
            <p className="text-gray-600 mb-4">
              The answer was: <strong className="text-purple-600">{getCorrectAnswerDisplay()}</strong>
            </p>
            
            <Mascot message="No worries! Let's try the next one! 💪" mood="encouraging" />
          </>
        )}
        
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextRound}
          className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-12 rounded-full text-xl shadow-lg"
        >
          Continue →
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────
// CELEBRATION SCREEN
// ─────────────────────────────────────────────────────────────

const CelebrationScreen: React.FC = () => {
  const { score, totalRounds, difficulty, telemetry, reset } = useDataDetectiveStore();
  const [showConfetti, setShowConfetti] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);
  
  // Calculate stats
  const correctAnswers = telemetry.filter(t => t.isCorrect).length;
  const accuracy = Math.round((correctAnswers / telemetry.length) * 100);
  const avgTime = Math.round(telemetry.reduce((acc, t) => acc + t.timeSpentMs, 0) / telemetry.length / 1000);
  
  // Get badge
  const getBadge = () => {
    if (accuracy >= 90) return { emoji: '🏆', title: 'Master Detective!' };
    if (accuracy >= 70) return { emoji: '⭐', title: 'Great Detective!' };
    if (accuracy >= 50) return { emoji: '🌟', title: 'Good Detective!' };
    return { emoji: '🎯', title: 'Detective in Training!' };
  };
  
  const badge = getBadge();
  
  // Log final telemetry
  useEffect(() => {
    console.log('📊 Final Game Telemetry:', {
      difficulty,
      totalRounds,
      score,
      correctAnswers,
      accuracy,
      avgTimePerRound: avgTime,
      details: telemetry,
    });
  }, [difficulty, totalRounds, score, correctAnswers, accuracy, avgTime, telemetry]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center p-6"
    >
      {showConfetti && <Confetti count={80} duration={5000} />}
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring' }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="text-8xl mb-4"
        >
          {badge.emoji}
        </motion.div>
        
        <h2 className="text-3xl font-bold text-purple-600 mb-2">{badge.title}</h2>
        <p className="text-gray-600 mb-6">You completed the Data Detective adventure!</p>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-purple-50 rounded-2xl p-4">
            <p className="text-3xl font-bold text-purple-600">{score}</p>
            <p className="text-sm text-gray-600">Points</p>
          </div>
          <div className="bg-green-50 rounded-2xl p-4">
            <p className="text-3xl font-bold text-green-600">{accuracy}%</p>
            <p className="text-sm text-gray-600">Accuracy</p>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4">
            <p className="text-3xl font-bold text-blue-600">{correctAnswers}/{totalRounds}</p>
            <p className="text-sm text-gray-600">Correct</p>
          </div>
          <div className="bg-orange-50 rounded-2xl p-4">
            <p className="text-3xl font-bold text-orange-600">{avgTime}s</p>
            <p className="text-sm text-gray-600">Avg Time</p>
          </div>
        </div>
        
        <Mascot message="You're an amazing detective! 🐕‍🦺✨" mood="celebrating" />
        
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={reset}
          className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-12 rounded-full text-xl shadow-lg"
        >
          Play Again! 🔄
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN GAME COMPONENT
// ─────────────────────────────────────────────────────────────

const DataDetectiveGame: React.FC = () => {
  const { phase, reset } = useDataDetectiveStore();
  
  // Reset on mount
  useEffect(() => {
    reset();
  }, [reset]);
  
  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {phase === 'welcome' && <WelcomeScreen key="welcome" />}
        {phase === 'difficulty' && <DifficultyScreen key="difficulty" />}
        {phase === 'playing' && <PlayingScreen key="playing" />}
        {phase === 'feedback' && <FeedbackScreen key="feedback" />}
        {phase === 'celebration' && <CelebrationScreen key="celebration" />}
      </AnimatePresence>
    </div>
  );
};

export default DataDetectiveGame;
