'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Plus, Minus, Home } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import canvas to avoid SSR issues
const TickTockCanvas = dynamic(() => import('./TickTockCanvas'), { ssr: false });

// ============================================
// TYPE DEFINITIONS
// ============================================

type QuestionType = 
  | 'set_clock' 
  | 'time_of_day' 
  | 'what_comes_first' 
  | 'duration_comparison' 
  | 'days_of_week';

type GamePhase = 'welcome' | 'playing' | 'celebrating';

interface Activity {
  emoji: string;
  text: string;
}

interface Question {
  type: QuestionType;
  prompt: string;
  // For set_clock
  targetHour?: number;
  // For time_of_day
  activity?: Activity;
  correctTimeOfDay?: string;
  // For what_comes_first
  activityA?: Activity;
  activityB?: Activity;
  correctAnswer?: 'A' | 'B';
  askForFirst?: boolean;
  // For duration_comparison
  askForLonger?: boolean;
  // For days_of_week
  referenceDay?: string;
  askForAfter?: boolean;
  dayOptions?: string[];
  correctDay?: string;
}

interface GameState {
  gamePhase: GamePhase;
  currentRound: number;
  totalRounds: number;
  score: number;
  correctAnswers: number;
  currentQuestion: Question | null;
  questionPoints: number;
  wrongAttempts: number;
  showWrongFeedback: boolean;
  showCorrectFeedback: boolean;
  clockHour: number;
}

// ============================================
// DATA CONSTANTS
// ============================================

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TIME_OF_DAY_ACTIVITIES: Record<string, Activity[]> = {
  morning: [
    { emoji: '🛏️', text: 'Wake up from bed' },
    { emoji: '🪥', text: 'Brush your teeth' },
    { emoji: '🚌', text: 'Go to school' },
    { emoji: '🍳', text: 'Eat breakfast' },
    { emoji: '☀️', text: 'Sun rises' },
  ],
  afternoon: [
    { emoji: '🍱', text: 'Eat lunch' },
    { emoji: '📖', text: 'Study in class' },
    { emoji: '☀️', text: 'Sun is high up' },
    { emoji: '🏫', text: 'School time' },
  ],
  evening: [
    { emoji: '🏠', text: 'Come home from school' },
    { emoji: '🎮', text: 'Play with friends' },
    { emoji: '🌆', text: 'Sun sets' },
    { emoji: '📺', text: 'Watch TV' },
  ],
  night: [
    { emoji: '🍽️', text: 'Eat dinner' },
    { emoji: '🌙', text: 'Moon comes out' },
    { emoji: '📖', text: 'Read a bedtime story' },
    { emoji: '😴', text: 'Go to sleep' },
    { emoji: '⭐', text: 'Stars twinkle' },
  ],
};

const ORDERED_DAILY_ACTIVITIES: Activity[] = [
  { emoji: '⏰', text: 'Wake up' },
  { emoji: '🪥', text: 'Brush teeth' },
  { emoji: '🍳', text: 'Eat breakfast' },
  { emoji: '🚌', text: 'Go to school' },
  { emoji: '📚', text: 'Morning classes' },
  { emoji: '🍱', text: 'Eat lunch' },
  { emoji: '📖', text: 'Afternoon classes' },
  { emoji: '🏠', text: 'Come home' },
  { emoji: '🎮', text: 'Play time' },
  { emoji: '🍽️', text: 'Eat dinner' },
  { emoji: '📺', text: 'Watch TV' },
  { emoji: '🌙', text: 'Go to sleep' },
];

const DURATION_PAIRS: { longer: Activity; shorter: Activity }[] = [
  { longer: { emoji: '🍳', text: 'Cooking dinner' }, shorter: { emoji: '🥛', text: 'Drinking milk' } },
  { longer: { emoji: '🎬', text: 'Watching a movie' }, shorter: { emoji: '📺', text: 'Watching an ad' } },
  { longer: { emoji: '🏫', text: 'A school day' }, shorter: { emoji: '⏰', text: 'One class' } },
  { longer: { emoji: '📖', text: 'Reading a book' }, shorter: { emoji: '📝', text: 'Writing your name' } },
  { longer: { emoji: '🛁', text: 'Taking a bath' }, shorter: { emoji: '🧼', text: 'Washing hands' } },
  { longer: { emoji: '😴', text: 'Sleeping at night' }, shorter: { emoji: '💤', text: 'A short nap' } },
  { longer: { emoji: '🎂', text: 'A birthday party' }, shorter: { emoji: '🍪', text: 'Eating a cookie' } },
  { longer: { emoji: '🏃', text: 'Running a race' }, shorter: { emoji: '👏', text: 'Clapping once' } },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

const shuffle = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const randomChoice = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// ============================================
// MASCOT COMPONENT
// ============================================
const CuckooMascot: React.FC<{ state: 'idle' | 'happy' | 'sad' | 'celebrating' }> = ({ state }) => {
  const stateEmojis = {
    idle: '🐦',
    happy: '🎉',
    sad: '😢',
    celebrating: '🏆',
  };
  
  return (
    <motion.div
      className="text-6xl"
      animate={state === 'celebrating' ? {
        scale: [1, 1.2, 1],
        rotate: [0, -10, 10, 0],
      } : state === 'sad' ? {
        x: [-5, 5, -5, 5, 0],
      } : {
        y: [0, -5, 0],
      }}
      transition={{
        duration: state === 'celebrating' ? 0.5 : state === 'sad' ? 0.4 : 2,
        repeat: state === 'idle' ? Infinity : 0,
        ease: "easeInOut",
      }}
    >
      {stateEmojis[state]}
    </motion.div>
  );
};

// ============================================
// BIG TAPPABLE BUTTON
// ============================================
const BigTapButton: React.FC<{
  emoji: string;
  label: string;
  color: string;
  onClick: () => void;
  disabled?: boolean;
  shake?: boolean;
}> = ({ emoji, label, color, onClick, disabled = false, shake = false }) => (
  <motion.button
    whileHover={!disabled ? { scale: 1.05 } : {}}
    whileTap={!disabled ? { scale: 0.95 } : {}}
    animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}}
    transition={shake ? { duration: 0.4 } : {}}
    onClick={onClick}
    disabled={disabled}
    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-4 transition-all shadow-lg min-h-[120px] ${color} ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-xl active:shadow-md'
    }`}
  >
    <span className="text-5xl mb-2">{emoji}</span>
    <span className="text-lg font-bold text-center">{label}</span>
  </motion.button>
);

// ============================================
// ACTIVITY CARD (for comparison questions)
// ============================================
const ActivityTapCard: React.FC<{
  activity: Activity;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  shake?: boolean;
}> = ({ activity, label, onClick, disabled = false, shake = false }) => (
  <motion.button
    whileHover={!disabled ? { scale: 1.05 } : {}}
    whileTap={!disabled ? { scale: 0.95 } : {}}
    animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}}
    transition={shake ? { duration: 0.4 } : {}}
    onClick={onClick}
    disabled={disabled}
    className={`flex flex-col items-center justify-center p-5 rounded-2xl border-4 bg-white border-gray-200 hover:border-indigo-400 shadow-lg transition-all min-h-[140px] ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-xl active:shadow-md'
    }`}
  >
    <span className="text-6xl mb-2">{activity.emoji}</span>
    <span className="text-base font-semibold text-gray-700 text-center">{activity.text}</span>
    <span className="text-sm font-bold text-indigo-500 mt-2">{label}</span>
  </motion.button>
);

// ============================================
// DAY BUTTON
// ============================================
const DayButton: React.FC<{
  day: string;
  onClick: () => void;
  disabled?: boolean;
  shake?: boolean;
}> = ({ day, onClick, disabled = false, shake = false }) => (
  <motion.button
    whileHover={!disabled ? { scale: 1.05 } : {}}
    whileTap={!disabled ? { scale: 0.95 } : {}}
    animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}}
    transition={shake ? { duration: 0.4 } : {}}
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-center gap-2 p-4 rounded-xl border-3 bg-white border-gray-200 hover:border-cyan-400 shadow-md transition-all ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'
    }`}
  >
    <span className="text-2xl">📅</span>
    <span className="text-lg font-bold text-gray-700">{day}</span>
  </motion.button>
);

// ============================================
// QUESTION GENERATORS
// ============================================

const generateSetClockQuestion = (): Question => {
  const targetHour = Math.floor(Math.random() * 12) + 1;
  return {
    type: 'set_clock',
    targetHour,
    prompt: `Set the clock to ${targetHour} o'clock!`,
  };
};

const generateTimeOfDayQuestion = (): Question => {
  const timeOfDay = randomChoice(['morning', 'afternoon', 'evening', 'night']);
  const activity = randomChoice(TIME_OF_DAY_ACTIVITIES[timeOfDay]);
  
  return {
    type: 'time_of_day',
    activity,
    correctTimeOfDay: timeOfDay,
    prompt: 'When do we do this?',
  };
};

const generateWhatComesFirstQuestion = (): Question => {
  // Pick two activities with different order
  const idx1 = Math.floor(Math.random() * (ORDERED_DAILY_ACTIVITIES.length - 2));
  const idx2 = idx1 + 2 + Math.floor(Math.random() * (ORDERED_DAILY_ACTIVITIES.length - idx1 - 2));
  
  const activityA = ORDERED_DAILY_ACTIVITIES[idx1];
  const activityB = ORDERED_DAILY_ACTIVITIES[Math.min(idx2, ORDERED_DAILY_ACTIVITIES.length - 1)];
  
  const askForFirst = Math.random() > 0.5;
  const swapPositions = Math.random() > 0.5;
  
  const finalA = swapPositions ? activityB : activityA;
  const finalB = swapPositions ? activityA : activityB;
  
  // The earlier one is always activityA (original), after swap we need to track
  const correctAnswer: 'A' | 'B' = askForFirst
    ? (swapPositions ? 'B' : 'A')
    : (swapPositions ? 'A' : 'B');
  
  return {
    type: 'what_comes_first',
    activityA: finalA,
    activityB: finalB,
    correctAnswer,
    askForFirst,
    prompt: askForFirst ? 'Which happens FIRST?' : 'Which happens LAST?',
  };
};

const generateDurationComparisonQuestion = (): Question => {
  const pair = randomChoice(DURATION_PAIRS);
  const askForLonger = Math.random() > 0.5;
  const swapPositions = Math.random() > 0.5;
  
  const activityA = swapPositions ? pair.shorter : pair.longer;
  const activityB = swapPositions ? pair.longer : pair.shorter;
  
  const correctAnswer: 'A' | 'B' = askForLonger 
    ? (swapPositions ? 'B' : 'A')
    : (swapPositions ? 'A' : 'B');
  
  return {
    type: 'duration_comparison',
    activityA,
    activityB,
    correctAnswer,
    askForLonger,
    prompt: askForLonger ? 'Which takes LONGER?' : 'Which is QUICKER?',
  };
};

const generateDaysOfWeekQuestion = (): Question => {
  const dayIndex = Math.floor(Math.random() * 7);
  const referenceDay = DAYS[dayIndex];
  const askForAfter = Math.random() > 0.5;
  
  const correctIndex = askForAfter 
    ? (dayIndex + 1) % 7 
    : (dayIndex - 1 + 7) % 7;
  const correctDay = DAYS[correctIndex];
  
  // Generate 2 wrong options
  const wrongDays = DAYS.filter(d => d !== correctDay && d !== referenceDay)
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);
  
  const dayOptions = shuffle([correctDay, ...wrongDays]);
  
  return {
    type: 'days_of_week',
    referenceDay,
    askForAfter,
    dayOptions,
    correctDay,
    prompt: `What day comes ${askForAfter ? 'AFTER' : 'BEFORE'} ${referenceDay}?`,
  };
};

const generateQuestion = (round: number): Question => {
  // Distribute question types across 20 rounds
  const types: QuestionType[] = [
    'set_clock', 'time_of_day', 'what_comes_first', 'duration_comparison', 'days_of_week'
  ];
  
  // Ensure variety - cycle through types with some randomness
  const typeIndex = (round - 1) % 5;
  const type = types[typeIndex];
  
  switch (type) {
    case 'set_clock':
      return generateSetClockQuestion();
    case 'time_of_day':
      return generateTimeOfDayQuestion();
    case 'what_comes_first':
      return generateWhatComesFirstQuestion();
    case 'duration_comparison':
      return generateDurationComparisonQuestion();
    case 'days_of_week':
      return generateDaysOfWeekQuestion();
    default:
      return generateSetClockQuestion();
  }
};

// ============================================
// MAIN GAME COMPONENT
// ============================================
const TickTockGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    gamePhase: 'welcome',
    currentRound: 0,
    totalRounds: 20,
    score: 0,
    correctAnswers: 0,
    currentQuestion: null,
    questionPoints: 10,
    wrongAttempts: 0,
    showWrongFeedback: false,
    showCorrectFeedback: false,
    clockHour: 12,
  });
  
  const [windowSize, setWindowSize] = useState({ width: 280, height: 280 });
  
  useEffect(() => {
    const updateSize = () => {
      const size = Math.min(window.innerWidth * 0.7, 280);
      setWindowSize({ width: size, height: size });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  // Start a new question
  const startNextQuestion = useCallback(() => {
    const nextRound = gameState.currentRound + 1;
    
    if (nextRound > gameState.totalRounds) {
      setGameState(prev => ({ ...prev, gamePhase: 'celebrating' }));
      return;
    }
    
    const newQuestion = generateQuestion(nextRound);
    
    setGameState(prev => ({
      ...prev,
      currentRound: nextRound,
      currentQuestion: newQuestion,
      questionPoints: 5,
      wrongAttempts: 0,
      showWrongFeedback: false,
      showCorrectFeedback: false,
      clockHour: Math.floor(Math.random() * 12) + 1, // Random starting position
    }));
  }, [gameState.currentRound, gameState.totalRounds]);
  
  // Handle correct answer
  const handleCorrect = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      showCorrectFeedback: true,
      score: prev.score + prev.questionPoints,
      correctAnswers: prev.correctAnswers + 1,
    }));
    
    // Auto-advance after celebration
    setTimeout(() => {
      startNextQuestion();
    }, 1500);
  }, [startNextQuestion]);
  
  // Handle wrong answer
  const handleWrong = useCallback(() => {
    // Determine penalty based on number of options for current question type
    // 2-option questions: what_comes_first, duration_comparison get higher penalty (-2)
    // Multi-option questions: days_of_week (3 options), time_of_day (4 options) get lower penalty (-1)
    const questionType = gameState.currentQuestion?.type;
    const penaltyAmount = (questionType === 'what_comes_first' || questionType === 'duration_comparison') ? 2 : 1;
    
    setGameState(prev => ({
      ...prev,
      showWrongFeedback: true,
      wrongAttempts: prev.wrongAttempts + 1,
      questionPoints: Math.max(1, prev.questionPoints - penaltyAmount),
    }));
    
    // Clear shake after animation
    setTimeout(() => {
      setGameState(prev => ({ ...prev, showWrongFeedback: false }));
    }, 500);
  }, [gameState.currentQuestion?.type]);
  
  // Start the game
  const startGame = () => {
    setGameState({
      gamePhase: 'playing',
      currentRound: 0,
      totalRounds: 20,
      score: 0,
      correctAnswers: 0,
      currentQuestion: null,
      questionPoints: 5,
      wrongAttempts: 0,
      showWrongFeedback: false,
      showCorrectFeedback: false,
      clockHour: 12,
    });
    
    setTimeout(() => {
      const firstQuestion = generateQuestion(1);
      setGameState(prev => ({
        ...prev,
        currentRound: 1,
        currentQuestion: firstQuestion,
        clockHour: Math.floor(Math.random() * 12) + 1,
      }));
    }, 100);
  };
  
  // Reset game
  const resetGame = () => {
    setGameState({
      gamePhase: 'welcome',
      currentRound: 0,
      totalRounds: 20,
      score: 0,
      correctAnswers: 0,
      currentQuestion: null,
      questionPoints: 5,
      wrongAttempts: 0,
      showWrongFeedback: false,
      showCorrectFeedback: false,
      clockHour: 12,
    });
  };
  
  // Calculate stars for celebration (based on 100-point max)
  const calculateStars = (score: number): number => {
    if (score >= 90) return 5;
    if (score >= 70) return 4;
    if (score >= 50) return 3;
    if (score >= 30) return 2;
    return 1;
  };
  
  // Adjust clock hour
  const adjustClock = (delta: number) => {
    setGameState(prev => {
      let newHour = prev.clockHour + delta;
      if (newHour > 12) newHour = 1;
      if (newHour < 1) newHour = 12;
      return { ...prev, clockHour: newHour };
    });
  };
  
  // Check if clock is correct
  const checkClock = useCallback(() => {
    if (gameState.currentQuestion?.type !== 'set_clock') return;
    
    if (gameState.clockHour === gameState.currentQuestion.targetHour) {
      handleCorrect();
    } else {
      handleWrong();
    }
  }, [gameState.clockHour, gameState.currentQuestion, handleCorrect, handleWrong]);
  
  // Auto-check clock when hour changes to correct value
  useEffect(() => {
    if (gameState.currentQuestion?.type === 'set_clock' && 
        gameState.clockHour === gameState.currentQuestion.targetHour &&
        !gameState.showCorrectFeedback) {
      handleCorrect();
    }
  }, [gameState.clockHour, gameState.currentQuestion, gameState.showCorrectFeedback, handleCorrect]);
  
  // ============================================
  // WELCOME SCREEN
  // ============================================
  if (gameState.gamePhase === 'welcome') {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full"
        >
          <div className="bg-white rounded-3xl p-8 shadow-2xl text-center">
            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl mb-4"
            >
              🕐
            </motion.div>
            
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-5xl mb-2"
            >
              🐦
            </motion.div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Tick-Tock Town
            </h1>
            
            <p className="text-gray-600 text-lg mb-6">
              Learn about Time with Cuckoo the Clock Bird!
            </p>
            
            <div className="bg-indigo-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-indigo-700 mb-2">🎯 What you'll do:</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-xl">🕐</span> Set the clock to the right time
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-xl">🌅</span> Match activities to time of day
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-xl">📅</span> Learn days of the week
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-xl">⏱️</span> Compare how long things take
                </li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 rounded-xl p-3 mb-6 border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>👆 Just tap</strong> the correct answer - no buttons needed!
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transition text-xl"
            >
              🎮 Let's Play!
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }
  
  // ============================================
  // CELEBRATION SCREEN
  // ============================================
  if (gameState.gamePhase === 'celebrating') {
    const stars = calculateStars(gameState.score);
    const maxScore = gameState.totalRounds * 10;
    
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full"
        >
          <div className="bg-white rounded-3xl p-8 shadow-2xl text-center">
            {/* Confetti effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -20, x: Math.random() * 300, opacity: 1 }}
                  animate={{ y: 400, opacity: 0 }}
                  transition={{ duration: 2, delay: Math.random() * 2, repeat: Infinity }}
                  className="absolute text-2xl"
                >
                  {['🎉', '⭐', '🎊', '✨', '🌟'][i % 5]}
                </motion.div>
              ))}
            </div>
            
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, -10, 10, 0],
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-8xl mb-4"
            >
              🏆
            </motion.div>
            
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-5xl mb-2"
            >
              🐦
            </motion.div>
            
            <h2 className="text-3xl font-bold text-orange-600 mb-4">
              You're a Time Master!
            </h2>
            
            <div className="text-5xl mb-4">
              {Array(stars).fill('⭐').join('')}
              {Array(5 - stars).fill('☆').join('')}
            </div>
            
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-6 mb-6">
              <div className="text-4xl font-bold text-indigo-600">
                {gameState.score}/{maxScore}
              </div>
              <div className="text-gray-600 text-lg">
                {gameState.correctAnswers} out of {gameState.totalRounds} correct!
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetGame}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transition flex items-center gap-2 mx-auto text-xl"
            >
              <RotateCcw size={24} />
              Play Again!
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }
  
  // ============================================
  // PLAYING PHASE
  // ============================================
  const question = gameState.currentQuestion;
  if (!question) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }
  
  // Get background gradient based on question type
  const getBackgroundGradient = () => {
    switch (question.type) {
      case 'set_clock':
        return 'from-blue-400 via-indigo-500 to-purple-500';
      case 'time_of_day':
        return 'from-orange-400 via-pink-500 to-purple-500';
      case 'what_comes_first':
        return 'from-green-400 via-teal-500 to-blue-500';
      case 'duration_comparison':
        return 'from-yellow-400 via-orange-500 to-red-500';
      case 'days_of_week':
        return 'from-cyan-400 via-blue-500 to-indigo-500';
      default:
        return 'from-indigo-400 via-purple-500 to-pink-500';
    }
  };
  
  // Render question-specific content
  const renderQuestionContent = () => {
    switch (question.type) {
      // ============================================
      // SET CLOCK - Tap +/- to adjust, auto-checks
      // ============================================
      case 'set_clock':
        return (
          <div className="flex flex-col items-center">
            <div className="bg-white rounded-2xl p-4 shadow-lg mb-4 relative">
              <TickTockCanvas
                width={windowSize.width}
                height={windowSize.height}
                displayHour={gameState.clockHour}
                interactive={false}
              />
              
              {/* Correct overlay */}
              <AnimatePresence>
                {gameState.showCorrectFeedback && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-green-500/80 rounded-2xl flex items-center justify-center"
                  >
                    <span className="text-7xl">✅</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="text-2xl font-bold text-indigo-700 bg-white/90 px-6 py-3 rounded-xl shadow mb-4">
              🕐 {gameState.clockHour} o'clock
            </div>
            
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => adjustClock(-1)}
                disabled={gameState.showCorrectFeedback}
                className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg disabled:opacity-50"
              >
                <Minus size={32} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => adjustClock(1)}
                disabled={gameState.showCorrectFeedback}
                className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg disabled:opacity-50"
              >
                <Plus size={32} />
              </motion.button>
            </div>
            
            <p className="text-white/80 text-sm mt-3">
              👆 Tap + or - to change the time
            </p>
          </div>
        );
      
      // ============================================
      // TIME OF DAY - Tap correct time period
      // ============================================
      case 'time_of_day':
        return (
          <div className="flex flex-col items-center">
            {/* Activity display */}
            {question.activity && (
              <motion.div
                animate={gameState.showWrongFeedback ? { x: [-8, 8, -8, 8, 0] } : {}}
                className="bg-white rounded-2xl p-6 shadow-lg mb-6 text-center relative"
              >
                <div className="text-7xl mb-2">{question.activity.emoji}</div>
                <div className="text-xl font-bold text-gray-700">{question.activity.text}</div>
                
                {/* Correct overlay */}
                <AnimatePresence>
                  {gameState.showCorrectFeedback && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-green-500/80 rounded-2xl flex items-center justify-center"
                    >
                      <span className="text-6xl">🎉</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
            
            {/* Wrong feedback */}
            <AnimatePresence>
              {gameState.showWrongFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-white text-lg font-bold mb-2"
                >
                  ❌ Try again!
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Time of day buttons */}
            <div className="grid grid-cols-2 gap-3 w-full">
              <BigTapButton
                emoji="🌅"
                label="Morning"
                color="bg-gradient-to-br from-yellow-200 to-orange-300 border-orange-400 text-orange-800"
                onClick={() => {
                  if (question.correctTimeOfDay === 'morning') {
                    handleCorrect();
                  } else {
                    handleWrong();
                  }
                }}
                disabled={gameState.showCorrectFeedback}
              />
              <BigTapButton
                emoji="☀️"
                label="Afternoon"
                color="bg-gradient-to-br from-yellow-300 to-yellow-400 border-yellow-500 text-yellow-800"
                onClick={() => {
                  if (question.correctTimeOfDay === 'afternoon') {
                    handleCorrect();
                  } else {
                    handleWrong();
                  }
                }}
                disabled={gameState.showCorrectFeedback}
              />
              <BigTapButton
                emoji="🌆"
                label="Evening"
                color="bg-gradient-to-br from-orange-300 to-pink-400 border-pink-500 text-pink-800"
                onClick={() => {
                  if (question.correctTimeOfDay === 'evening') {
                    handleCorrect();
                  } else {
                    handleWrong();
                  }
                }}
                disabled={gameState.showCorrectFeedback}
              />
              <BigTapButton
                emoji="🌙"
                label="Night"
                color="bg-gradient-to-br from-indigo-400 to-purple-500 border-purple-600 text-white"
                onClick={() => {
                  if (question.correctTimeOfDay === 'night') {
                    handleCorrect();
                  } else {
                    handleWrong();
                  }
                }}
                disabled={gameState.showCorrectFeedback}
              />
            </div>
          </div>
        );
      
      // ============================================
      // WHAT COMES FIRST/LAST - Tap correct activity
      // ============================================
      case 'what_comes_first':
        return (
          <div className="flex flex-col items-center">
            {/* Wrong feedback */}
            <AnimatePresence>
              {gameState.showWrongFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-white text-lg font-bold mb-4"
                >
                  ❌ Try again!
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Correct feedback */}
            <AnimatePresence>
              {gameState.showCorrectFeedback && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="grid grid-cols-2 gap-4 w-full">
              <ActivityTapCard
                activity={question.activityA!}
                label="(A)"
                onClick={() => {
                  if (question.correctAnswer === 'A') {
                    handleCorrect();
                  } else {
                    handleWrong();
                  }
                }}
                disabled={gameState.showCorrectFeedback}
                shake={gameState.showWrongFeedback}
              />
              <ActivityTapCard
                activity={question.activityB!}
                label="(B)"
                onClick={() => {
                  if (question.correctAnswer === 'B') {
                    handleCorrect();
                  } else {
                    handleWrong();
                  }
                }}
                disabled={gameState.showCorrectFeedback}
                shake={gameState.showWrongFeedback}
              />
            </div>
          </div>
        );
      
      // ============================================
      // DURATION COMPARISON - Tap longer/shorter
      // ============================================
      case 'duration_comparison':
        return (
          <div className="flex flex-col items-center">
            {/* Wrong feedback */}
            <AnimatePresence>
              {gameState.showWrongFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-white text-lg font-bold mb-4"
                >
                  ❌ Try again!
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Correct feedback */}
            <AnimatePresence>
              {gameState.showCorrectFeedback && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-6xl mb-4"
                >
                  ⏱️ 🎉
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="grid grid-cols-2 gap-4 w-full">
              <ActivityTapCard
                activity={question.activityA!}
                label="(A)"
                onClick={() => {
                  if (question.correctAnswer === 'A') {
                    handleCorrect();
                  } else {
                    handleWrong();
                  }
                }}
                disabled={gameState.showCorrectFeedback}
                shake={gameState.showWrongFeedback}
              />
              <ActivityTapCard
                activity={question.activityB!}
                label="(B)"
                onClick={() => {
                  if (question.correctAnswer === 'B') {
                    handleCorrect();
                  } else {
                    handleWrong();
                  }
                }}
                disabled={gameState.showCorrectFeedback}
                shake={gameState.showWrongFeedback}
              />
            </div>
          </div>
        );
      
      // ============================================
      // DAYS OF WEEK - Tap correct day
      // ============================================
      case 'days_of_week':
        return (
          <div className="flex flex-col items-center">
            {/* Reference day display */}
            <div className="bg-white rounded-2xl p-4 shadow-lg mb-4 text-center relative">
              <div className="text-5xl mb-2">📅</div>
              <div className="text-xl font-bold text-gray-700">{question.referenceDay}</div>
              
              {/* Correct overlay */}
              <AnimatePresence>
                {gameState.showCorrectFeedback && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-green-500/80 rounded-2xl flex items-center justify-center"
                  >
                    <span className="text-5xl">🎉</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="text-white text-lg font-semibold mb-4">
              {question.askForAfter ? '⬇️ What comes AFTER?' : '⬆️ What comes BEFORE?'}
            </div>
            
            {/* Wrong feedback */}
            <AnimatePresence>
              {gameState.showWrongFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-white text-lg font-bold mb-2"
                >
                  ❌ Try again!
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Day options */}
            <div className="flex flex-col gap-3 w-full">
              {question.dayOptions?.map((day, index) => (
                <DayButton
                  key={index}
                  day={day}
                  onClick={() => {
                    if (day === question.correctDay) {
                      handleCorrect();
                    } else {
                      handleWrong();
                    }
                  }}
                  disabled={gameState.showCorrectFeedback}
                  shake={gameState.showWrongFeedback}
                />
              ))}
            </div>
          </div>
        );
      
      default:
        return <div className="text-white">Unknown question type</div>;
    }
  };
  
  // ============================================
  // MAIN PLAYING UI
  // ============================================
  return (
    <div className={`min-h-screen w-full bg-gradient-to-br ${getBackgroundGradient()} flex flex-col`}>
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <CuckooMascot state={
            gameState.showCorrectFeedback ? 'happy' : 
            gameState.showWrongFeedback ? 'sad' : 'idle'
          } />
          <div className="text-white">
            <div className="text-sm opacity-80">
              Question {gameState.currentRound}/{gameState.totalRounds}
            </div>
            <div className="font-bold text-lg">
              ⭐ {gameState.score} points
            </div>
          </div>
        </div>
        
        {/* Points for this question */}
        <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-2">
          <div className="text-white text-sm opacity-80">This question</div>
          <div className="text-white font-bold text-xl text-center">
            +{gameState.questionPoints}
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="px-4 mb-2">
        <div className="h-3 bg-white/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(gameState.currentRound / gameState.totalRounds) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Question Card */}
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          key={gameState.currentRound}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 shadow-2xl max-w-md w-full"
        >
          {/* Question prompt */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white mb-2">
              🐦 Cuckoo asks:
            </h2>
            <p className="text-2xl text-white font-bold">
              {question.prompt}
            </p>
          </div>
          
          {/* Question content */}
          {renderQuestionContent()}
        </motion.div>
      </div>
      
      {/* Home button */}
      <div className="p-4 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetGame}
          className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full flex items-center gap-2 transition"
        >
          <Home size={18} />
          Exit Game
        </motion.button>
      </div>
    </div>
  );
};

export default TickTockGame;
