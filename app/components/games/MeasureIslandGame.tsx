'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useMeasureIslandStore, Difficulty } from '../../store/useMeasureIslandStore';

// Dynamic import for Konva (client-side only)
const MeasureIslandCanvas = dynamic(() => import('./MeasureIslandCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gradient-to-b from-sky-200 to-green-200 rounded-xl flex items-center justify-center">
      <div className="text-2xl text-gray-600 animate-pulse">🏝️ Loading Island...</div>
    </div>
  ),
});

// ─────────────────────────────────────────────────────────────
// ACTIVITY TYPE LABELS
// ─────────────────────────────────────────────────────────────

const activityLabels: Record<string, string> = {
  'compare-length': '📏 Length Comparison',
  'compare-height': '📐 Height Comparison',
  'compare-weight': '⚖️ Weight Comparison',
  'compare-capacity': '🫗 Capacity Comparison',
  'measure-length': '📏 Measuring Length',
  'order-length': '📏 Ordering by Length',
  'order-weight': '⚖️ Ordering by Weight',
  'order-capacity': '🫗 Ordering by Capacity',
};

// ─────────────────────────────────────────────────────────────
// WELCOME SCREEN
// ─────────────────────────────────────────────────────────────

const WelcomeScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="min-h-screen bg-gradient-to-br from-cyan-400 via-teal-500 to-emerald-600 flex items-center justify-center p-8"
  >
    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl text-center">
      {/* Mascot */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-8xl mb-4"
      >
        🐒
      </motion.div>
      
      <h1 className="text-4xl font-bold text-teal-600 mb-2">
        Measure Island
      </h1>
      
      <p className="text-xl text-gray-600 mb-6">
        Join <span className="font-bold text-amber-600">Milo the Monkey</span> on a measurement adventure!
      </p>
      
      <div className="bg-teal-50 rounded-xl p-6 mb-6 text-left">
        <h3 className="font-bold text-teal-700 mb-3">🎯 What you'll learn:</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-center gap-2">
            <span className="text-2xl">📏</span>
            <span>Compare lengths and heights</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-2xl">⚖️</span>
            <span>Find what's heavier or lighter</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-2xl">🫗</span>
            <span>Discover what holds more or less</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-2xl">🖐️</span>
            <span>Measure with handspans, footsteps & more!</span>
          </li>
        </ul>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-xl px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        🏝️ Start Adventure!
      </motion.button>
    </div>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────
// DIFFICULTY SELECT SCREEN
// ─────────────────────────────────────────────────────────────

interface DifficultyCardProps {
  difficulty: Difficulty;
  emoji: string;
  title: string;
  description: string;
  features: string[];
  color: string;
  onClick: () => void;
}

const DifficultyCard: React.FC<DifficultyCardProps> = ({
  emoji, title, description, features, color, onClick
}) => (
  <motion.div
    whileHover={{ scale: 1.03, y: -5 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`bg-white rounded-2xl shadow-xl p-6 cursor-pointer border-4 ${color} transition-all`}
  >
    <div className="text-5xl mb-3">{emoji}</div>
    <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    <ul className="text-sm text-gray-500 space-y-1">
      {features.map((f, i) => (
        <li key={i} className="flex items-center gap-2">
          <span className="text-green-500">✓</span> {f}
        </li>
      ))}
    </ul>
  </motion.div>
);

const DifficultyScreen: React.FC<{ 
  onSelect: (d: Difficulty) => void 
}> = ({ onSelect }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="min-h-screen bg-gradient-to-br from-cyan-400 via-teal-500 to-emerald-600 flex items-center justify-center p-8"
  >
    <div className="max-w-4xl w-full">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-2">Choose Your Path</h2>
        <p className="text-xl text-teal-100">How challenging do you want your adventure?</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DifficultyCard
          difficulty="easy"
          emoji="🌱"
          title="Easy"
          description="Perfect for beginners!"
          features={[
            '10 rounds',
            'Length & height comparison',
            'Weight comparison',
          ]}
          color="border-green-400 hover:border-green-500"
          onClick={() => onSelect('easy')}
        />
        
        <DifficultyCard
          difficulty="medium"
          emoji="🌿"
          title="Medium"
          description="A good challenge!"
          features={[
            '15 rounds',
            'All comparison types',
            'Non-standard measurement',
          ]}
          color="border-yellow-400 hover:border-yellow-500"
          onClick={() => onSelect('medium')}
        />
        
        <DifficultyCard
          difficulty="hard"
          emoji="🌳"
          title="Hard"
          description="Master explorer level!"
          features={[
            '20 rounds',
            'All activity types',
            'Ordering challenges',
          ]}
          color="border-red-400 hover:border-red-500"
          onClick={() => onSelect('hard')}
        />
      </div>
    </div>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────
// PLAYING SCREEN
// ─────────────────────────────────────────────────────────────

const PlayingScreen: React.FC = () => {
  const {
    round,
    totalRounds,
    score,
    streak,
    difficulty,
    currentQuestion,
    selectedAnswer,
    orderedAnswers,
    submitAnswer,
    submitMeasurement,
  } = useMeasureIslandStore();
  
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 500 });
  
  useEffect(() => {
    const updateSize = () => {
      const width = Math.min(window.innerWidth - 32, 900);
      const height = Math.min(window.innerHeight - 300, 500);
      setCanvasSize({ width, height });
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  if (!currentQuestion) return null;
  
  const isCompare = currentQuestion.type.startsWith('compare');
  const isOrder = currentQuestion.type.startsWith('order');
  const isMeasure = currentQuestion.type === 'measure-length';
  
  const canSubmit = isCompare 
    ? selectedAnswer !== null
    : isOrder 
      ? orderedAnswers.length === currentQuestion.objects.length
      : true;
  
  const difficultyColors: Record<Difficulty, string> = {
    easy: 'bg-green-500',
    medium: 'bg-yellow-500',
    hard: 'bg-red-500',
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-teal-500 to-emerald-600 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-4">
        <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Round & Difficulty */}
            <div className="flex items-center gap-4">
              <div className="text-lg font-bold text-gray-700">
                Round {round}/{totalRounds}
              </div>
              <span className={`px-3 py-1 rounded-full text-white text-sm font-bold ${difficultyColors[difficulty]}`}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </span>
            </div>
            
            {/* Score & Streak */}
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 px-4 py-2 rounded-lg">
                <span className="text-amber-600 font-bold">⭐ {score}</span>
              </div>
              {streak > 1 && (
                <div className="bg-orange-100 px-4 py-2 rounded-lg">
                  <span className="text-orange-600 font-bold">🔥 {streak} streak!</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Activity Type */}
          <div className="mt-3 text-center">
            <span className="text-sm text-gray-500">
              {activityLabels[currentQuestion.type] || currentQuestion.type}
            </span>
          </div>
        </div>
      </div>
      
      {/* Instruction */}
      <div className="max-w-4xl mx-auto mb-4">
        <motion.div
          key={currentQuestion.instruction}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-4 text-center"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl">🐒</span>
            <p className="text-xl font-bold text-gray-700">
              {currentQuestion.instruction}
            </p>
          </div>
        </motion.div>
      </div>
      
      {/* Canvas */}
      <div className="max-w-4xl mx-auto mb-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <MeasureIslandCanvas 
            width={canvasSize.width} 
            height={canvasSize.height} 
          />
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="max-w-4xl mx-auto text-center">
        <motion.button
          whileHover={{ scale: canSubmit ? 1.05 : 1 }}
          whileTap={{ scale: canSubmit ? 0.95 : 1 }}
          onClick={isMeasure ? submitMeasurement : submitAnswer}
          disabled={!canSubmit}
          className={`px-8 py-4 rounded-xl font-bold text-xl shadow-lg transition-all ${
            canSubmit
              ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isMeasure ? '📏 Submit Measurement' : isOrder ? '✓ Check Order' : '✓ Check Answer'}
        </motion.button>
        
        {!canSubmit && (
          <p className="text-white/80 mt-2 text-sm">
            {isCompare ? 'Tap an object to select it!' : isOrder ? 'Place all items in order!' : 'Adjust the measurement!'}
          </p>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// FEEDBACK SCREEN
// ─────────────────────────────────────────────────────────────

const FeedbackScreen: React.FC = () => {
  const { 
    isCorrect, 
    currentQuestion, 
    selectedAnswer, 
    orderedAnswers,
    measurementCount,
    proceedAfterFeedback 
  } = useMeasureIslandStore();
  
  if (!currentQuestion) return null;
  
  // Find correct object(s) for display
  const getCorrectDisplay = () => {
    if (currentQuestion.type === 'measure-length') {
      return `${currentQuestion.correctAnswer} ${currentQuestion.unit}`;
    }
    if (currentQuestion.type.startsWith('order')) {
      const correctOrder = currentQuestion.correctAnswer as string[];
      return correctOrder.map(id => {
        const obj = currentQuestion.objects.find(o => o.id === id);
        return obj ? `${obj.emoji} ${obj.name}` : id;
      }).join(' → ');
    }
    const correctObj = currentQuestion.objects.find(
      o => o.id === currentQuestion.correctAnswer
    );
    return correctObj ? `${correctObj.emoji} ${correctObj.name}` : '';
  };
  
  // Get player's answer display
  const getPlayerDisplay = () => {
    if (currentQuestion.type === 'measure-length') {
      return `${measurementCount} ${currentQuestion.unit}`;
    }
    if (currentQuestion.type.startsWith('order')) {
      return orderedAnswers.map(id => {
        const obj = currentQuestion.objects.find(o => o.id === id);
        return obj ? `${obj.emoji} ${obj.name}` : id;
      }).join(' → ');
    }
    const selectedObj = currentQuestion.objects.find(o => o.id === selectedAnswer);
    return selectedObj ? `${selectedObj.emoji} ${selectedObj.name}` : '';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-cyan-400 via-teal-500 to-emerald-600 flex items-center justify-center p-8"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center ${
          isCorrect ? 'border-4 border-green-400' : 'border-4 border-amber-400'
        }`}
      >
        {/* Result icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: isCorrect ? [0, -10, 10, 0] : 0 }}
          transition={{ delay: 0.2 }}
          className="text-8xl mb-4"
        >
          {isCorrect ? '🎉' : '🤔'}
        </motion.div>
        
        <h2 className={`text-3xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-amber-600'}`}>
          {isCorrect ? 'Correct!' : 'Not quite!'}
        </h2>
        
        {/* Milo's message */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-4xl">🐒</span>
            <div className="text-left">
              {isCorrect ? (
                <p className="text-gray-700">
                  <span className="font-bold text-green-600">Great job!</span> You picked{' '}
                  <span className="font-bold">{getPlayerDisplay()}</span>. That's right!
                </p>
              ) : (
                <div>
                  <p className="text-gray-700 mb-2">
                    You chose <span className="font-bold text-amber-600">{getPlayerDisplay()}</span>
                  </p>
                  <p className="text-gray-700">
                    The correct answer was{' '}
                    <span className="font-bold text-green-600">{getCorrectDisplay()}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={proceedAfterFeedback}
          className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-xl px-8 py-4 rounded-full shadow-lg"
        >
          Next →
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────
// CELEBRATION SCREEN
// ─────────────────────────────────────────────────────────────

const CelebrationScreen: React.FC = () => {
  const { score, totalRounds, difficulty, telemetry, resetGame } = useMeasureIslandStore();
  
  // Calculate stats
  const correctCount = telemetry.filter(t => t.isCorrect).length;
  const accuracy = Math.round((correctCount / totalRounds) * 100);
  const avgTime = Math.round(
    telemetry.reduce((sum, t) => sum + t.timeSpentMs, 0) / telemetry.length / 1000
  );
  
  // Determine medal
  const getMedal = () => {
    if (accuracy >= 90) return { emoji: '🥇', text: 'Gold Medal!', color: 'text-yellow-500' };
    if (accuracy >= 70) return { emoji: '🥈', text: 'Silver Medal!', color: 'text-gray-400' };
    if (accuracy >= 50) return { emoji: '🥉', text: 'Bronze Medal!', color: 'text-amber-600' };
    return { emoji: '🌟', text: 'Great Effort!', color: 'text-purple-500' };
  };
  
  const medal = getMedal();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 flex items-center justify-center p-8"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center"
      >
        {/* Celebration animation */}
        <motion.div
          animate={{ 
            rotate: [0, -5, 5, -5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-8xl mb-4"
        >
          {medal.emoji}
        </motion.div>
        
        <h1 className={`text-4xl font-bold ${medal.color} mb-2`}>
          {medal.text}
        </h1>
        
        <p className="text-gray-600 text-lg mb-6">
          Adventure Complete! 🏝️
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-teal-50 rounded-xl p-4">
            <div className="text-3xl font-bold text-teal-600">{score}</div>
            <div className="text-sm text-teal-700">Total Score</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <div className="text-3xl font-bold text-green-600">{accuracy}%</div>
            <div className="text-sm text-green-700">Accuracy</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="text-3xl font-bold text-blue-600">{correctCount}/{totalRounds}</div>
            <div className="text-sm text-blue-700">Correct</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <div className="text-3xl font-bold text-purple-600">{avgTime}s</div>
            <div className="text-sm text-purple-700">Avg. Time</div>
          </div>
        </div>
        
        {/* Difficulty badge */}
        <div className="mb-6">
          <span className={`px-4 py-2 rounded-full text-white font-bold ${
            difficulty === 'easy' ? 'bg-green-500' :
            difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
          }`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Mode
          </span>
        </div>
        
        {/* Milo's message */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🐒</span>
            <p className="text-gray-700 text-left">
              {accuracy >= 80 
                ? "Amazing! You're a measurement master! 🎉"
                : accuracy >= 50
                  ? "Good work! Keep practicing to become a pro! 💪"
                  : "Nice try! Let's practice more together! 🌟"
              }
            </p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetGame}
          className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-xl px-8 py-4 rounded-full shadow-lg"
        >
          🏝️ Play Again
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN GAME COMPONENT
// ─────────────────────────────────────────────────────────────

const MeasureIslandGame: React.FC = () => {
  const { phase, setPhase, setDifficulty, startGame } = useMeasureIslandStore();
  
  const handleDifficultySelect = (difficulty: Difficulty) => {
    setDifficulty(difficulty);
    startGame();
  };
  
  return (
    <AnimatePresence mode="wait">
      {phase === 'welcome' && (
        <WelcomeScreen 
          key="welcome" 
          onStart={() => setPhase('difficulty')} 
        />
      )}
      
      {phase === 'difficulty' && (
        <DifficultyScreen 
          key="difficulty" 
          onSelect={handleDifficultySelect} 
        />
      )}
      
      {phase === 'playing' && (
        <PlayingScreen key="playing" />
      )}
      
      {phase === 'feedback' && (
        <FeedbackScreen key="feedback" />
      )}
      
      {phase === 'celebration' && (
        <CelebrationScreen key="celebration" />
      )}
    </AnimatePresence>
  );
};

export default MeasureIslandGame;
