'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Difficulty = 'easy' | 'medium' | 'hard';
type GamePhase = 'welcome' | 'difficulty' | 'playing' | 'celebration';
type QuestionType = 
  | 'compare-length' 
  | 'compare-height' 
  | 'compare-weight' 
  | 'compare-capacity'
  | 'measure-units'
  | 'order-size';

interface MeasurableObject {
  id: string;
  name: string;
  emoji: string;
  value: number;
}

interface Question {
  type: QuestionType;
  instruction: string;
  objects: MeasurableObject[];
  correctAnswer: string | number | string[];
  options?: number[]; // For measure-units type
  comparison?: 'longer' | 'shorter' | 'taller' | 'heavier' | 'lighter' | 'more' | 'less';
  unit?: string;
}

// ─────────────────────────────────────────────────────────────
// OBJECT POOLS
// ─────────────────────────────────────────────────────────────

const lengthObjects: MeasurableObject[] = [
  { id: 'ant', name: 'Ant', emoji: '🐜', value: 1 },
  { id: 'eraser', name: 'Eraser', emoji: '🧽', value: 2 },
  { id: 'pencil', name: 'Pencil', emoji: '✏️', value: 3 },
  { id: 'banana', name: 'Banana', emoji: '🍌', value: 4 },
  { id: 'ruler', name: 'Ruler', emoji: '📏', value: 5 },
  { id: 'umbrella', name: 'Umbrella', emoji: '☂️', value: 6 },
  { id: 'bat', name: 'Cricket Bat', emoji: '🏏', value: 7 },
  { id: 'rope', name: 'Rope', emoji: '🪢', value: 8 },
];

const heightObjects: MeasurableObject[] = [
  { id: 'ant', name: 'Ant', emoji: '🐜', value: 1 },
  { id: 'cat', name: 'Cat', emoji: '🐈', value: 2 },
  { id: 'dog', name: 'Dog', emoji: '🐕', value: 3 },
  { id: 'child', name: 'Child', emoji: '👧', value: 4 },
  { id: 'adult', name: 'Adult', emoji: '🧑', value: 5 },
  { id: 'elephant', name: 'Elephant', emoji: '🐘', value: 6 },
  { id: 'giraffe', name: 'Giraffe', emoji: '🦒', value: 7 },
  { id: 'tree', name: 'Tree', emoji: '🌳', value: 8 },
];

const weightObjects: MeasurableObject[] = [
  { id: 'feather', name: 'Feather', emoji: '🪶', value: 1 },
  { id: 'balloon', name: 'Balloon', emoji: '🎈', value: 2 },
  { id: 'apple', name: 'Apple', emoji: '🍎', value: 3 },
  { id: 'ball', name: 'Ball', emoji: '⚽', value: 4 },
  { id: 'book', name: 'Book', emoji: '📚', value: 5 },
  { id: 'watermelon', name: 'Watermelon', emoji: '🍉', value: 6 },
  { id: 'pumpkin', name: 'Pumpkin', emoji: '🎃', value: 7 },
  { id: 'stone', name: 'Stone', emoji: '🪨', value: 8 },
];

const capacityObjects: MeasurableObject[] = [
  { id: 'spoon', name: 'Spoon', emoji: '🥄', value: 1 },
  { id: 'cup', name: 'Cup', emoji: '☕', value: 2 },
  { id: 'glass', name: 'Glass', emoji: '🥛', value: 3 },
  { id: 'bowl', name: 'Bowl', emoji: '🥣', value: 4 },
  { id: 'bottle', name: 'Bottle', emoji: '🍼', value: 5 },
  { id: 'jug', name: 'Jug', emoji: '🫗', value: 6 },
  { id: 'bucket', name: 'Bucket', emoji: '🪣', value: 7 },
  { id: 'bathtub', name: 'Bathtub', emoji: '🛁', value: 8 },
];

const measureItems = [
  { name: 'Table', emoji: '🪑', unit: 'handspans' },
  { name: 'Book', emoji: '📖', unit: 'fingers' },
  { name: 'Door', emoji: '🚪', unit: 'footsteps' },
  { name: 'Desk', emoji: '🪑', unit: 'pencils' },
  { name: 'Window', emoji: '🪟', unit: 'cubes' },
];

// ─────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function pickTwoDistinct(objects: MeasurableObject[]): MeasurableObject[] {
  const shuffled = shuffleArray(objects);
  const result: MeasurableObject[] = [];
  for (const obj of shuffled) {
    if (result.length === 0 || result[0].value !== obj.value) {
      result.push(obj);
    }
    if (result.length === 2) break;
  }
  return result;
}

function pickThreeDistinct(objects: MeasurableObject[]): MeasurableObject[] {
  const shuffled = shuffleArray(objects);
  const result: MeasurableObject[] = [];
  const usedValues = new Set<number>();
  for (const obj of shuffled) {
    if (!usedValues.has(obj.value)) {
      result.push(obj);
      usedValues.add(obj.value);
    }
    if (result.length === 3) break;
  }
  return result;
}

function generateQuestion(type: QuestionType): Question {
  switch (type) {
    case 'compare-length': {
      const picked = pickTwoDistinct(lengthObjects);
      const isLonger = Math.random() > 0.5;
      const correctId = isLonger
        ? (picked[0].value > picked[1].value ? picked[0].id : picked[1].id)
        : (picked[0].value < picked[1].value ? picked[0].id : picked[1].id);
      return {
        type,
        instruction: isLonger ? '👆 Tap the LONGER one!' : '👆 Tap the SHORTER one!',
        objects: shuffleArray(picked),
        correctAnswer: correctId,
        comparison: isLonger ? 'longer' : 'shorter',
      };
    }

    case 'compare-height': {
      const picked = pickTwoDistinct(heightObjects);
      const isTaller = Math.random() > 0.5;
      const correctId = isTaller
        ? (picked[0].value > picked[1].value ? picked[0].id : picked[1].id)
        : (picked[0].value < picked[1].value ? picked[0].id : picked[1].id);
      return {
        type,
        instruction: isTaller ? '👆 Tap the TALLER one!' : '👆 Tap the SHORTER one!',
        objects: shuffleArray(picked),
        correctAnswer: correctId,
        comparison: isTaller ? 'taller' : 'shorter',
      };
    }

    case 'compare-weight': {
      const picked = pickTwoDistinct(weightObjects);
      const isHeavier = Math.random() > 0.5;
      const correctId = isHeavier
        ? (picked[0].value > picked[1].value ? picked[0].id : picked[1].id)
        : (picked[0].value < picked[1].value ? picked[0].id : picked[1].id);
      return {
        type,
        instruction: isHeavier ? '⚖️ Tap the HEAVIER one!' : '⚖️ Tap the LIGHTER one!',
        objects: shuffleArray(picked),
        correctAnswer: correctId,
        comparison: isHeavier ? 'heavier' : 'lighter',
      };
    }

    case 'compare-capacity': {
      const picked = pickTwoDistinct(capacityObjects);
      const isMore = Math.random() > 0.5;
      const correctId = isMore
        ? (picked[0].value > picked[1].value ? picked[0].id : picked[1].id)
        : (picked[0].value < picked[1].value ? picked[0].id : picked[1].id);
      return {
        type,
        instruction: isMore ? '💧 Tap what holds MORE!' : '💧 Tap what holds LESS!',
        objects: shuffleArray(picked),
        correctAnswer: correctId,
        comparison: isMore ? 'more' : 'less',
      };
    }

    case 'measure-units': {
      const item = measureItems[Math.floor(Math.random() * measureItems.length)];
      const correctValue = Math.floor(Math.random() * 5) + 3; // 3-7
      const options = shuffleArray([
        correctValue - 1,
        correctValue,
        correctValue + 1,
        correctValue + 2,
      ]).filter(n => n > 0);
      return {
        type,
        instruction: `🖐️ How many ${item.unit} is this ${item.name}?`,
        objects: [{ id: 'item', name: item.name, emoji: item.emoji, value: correctValue }],
        correctAnswer: correctValue,
        options,
        unit: item.unit,
      };
    }

    case 'order-size': {
      const allPools = [lengthObjects, heightObjects, weightObjects, capacityObjects];
      const pool = allPools[Math.floor(Math.random() * allPools.length)];
      const picked = pickThreeDistinct(pool);
      const isSmallestFirst = Math.random() > 0.5;
      const sortedIds = [...picked]
        .sort((a, b) => isSmallestFirst ? a.value - b.value : b.value - a.value)
        .map(o => o.id);
      return {
        type,
        instruction: isSmallestFirst
          ? '📏 Tap from SMALLEST to BIGGEST!'
          : '📏 Tap from BIGGEST to SMALLEST!',
        objects: shuffleArray(picked),
        correctAnswer: sortedIds,
      };
    }

    default:
      return generateQuestion('compare-length');
  }
}

const difficultyConfig: Record<Difficulty, { types: QuestionType[]; rounds: number }> = {
  easy: {
    types: ['compare-length', 'compare-height', 'compare-weight'],
    rounds: 10,
  },
  medium: {
    types: ['compare-length', 'compare-height', 'compare-weight', 'compare-capacity', 'measure-units'],
    rounds: 15,
  },
  hard: {
    types: ['compare-length', 'compare-height', 'compare-weight', 'compare-capacity', 'measure-units', 'order-size'],
    rounds: 20,
  },
};

// ─────────────────────────────────────────────────────────────
// WELCOME SCREEN
// ─────────────────────────────────────────────────────────────

const WelcomeScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0 }}
    className="min-h-screen bg-gradient-to-br from-cyan-400 via-teal-500 to-emerald-600 flex items-center justify-center p-4"
  >
    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-lg w-full text-center">
      {/* Mascot */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="text-8xl mb-4"
      >
        🐒
      </motion.div>
      
      <h1 className="text-3xl md:text-4xl font-bold text-teal-600 mb-2">
        Measure Island
      </h1>
      
      <p className="text-lg md:text-xl text-gray-600 mb-6">
        Join <span className="font-bold text-amber-600">Milo the Monkey</span> on a fun adventure!
      </p>
      
      <div className="bg-teal-50 rounded-xl p-4 mb-6 text-left">
        <h3 className="font-bold text-teal-700 mb-3 text-lg">🎯 What you'll do:</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-center gap-3">
            <span className="text-2xl">📏</span>
            <span>Find longer and shorter things!</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="text-2xl">⚖️</span>
            <span>Find heavier and lighter things!</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="text-2xl">💧</span>
            <span>Find what holds more or less!</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="text-2xl">👆</span>
            <span>Just tap to answer - so easy!</span>
          </li>
        </ul>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-xl px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-shadow w-full"
      >
        🏝️ Let's Go!
      </motion.button>
    </div>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────
// DIFFICULTY SELECT SCREEN
// ─────────────────────────────────────────────────────────────

const DifficultyScreen: React.FC<{ onSelect: (d: Difficulty) => void }> = ({ onSelect }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="min-h-screen bg-gradient-to-br from-cyan-400 via-teal-500 to-emerald-600 flex items-center justify-center p-4"
  >
    <div className="max-w-md w-full">
      <div className="text-center mb-6">
        <span className="text-6xl">🐒</span>
        <h2 className="text-3xl font-bold text-white mt-2">Choose Your Adventure!</h2>
      </div>
      
      <div className="space-y-4">
        {/* Easy */}
        <motion.button
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('easy')}
          className="w-full bg-white rounded-2xl shadow-xl p-5 text-left border-4 border-green-400 hover:border-green-500 transition-all"
        >
          <div className="flex items-center gap-4">
            <span className="text-5xl">🌱</span>
            <div>
              <h3 className="text-2xl font-bold text-green-600">Easy</h3>
              <p className="text-gray-600">10 questions • Perfect for beginners!</p>
            </div>
          </div>
        </motion.button>
        
        {/* Medium */}
        <motion.button
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('medium')}
          className="w-full bg-white rounded-2xl shadow-xl p-5 text-left border-4 border-yellow-400 hover:border-yellow-500 transition-all"
        >
          <div className="flex items-center gap-4">
            <span className="text-5xl">🌿</span>
            <div>
              <h3 className="text-2xl font-bold text-yellow-600">Medium</h3>
              <p className="text-gray-600">15 questions • A fun challenge!</p>
            </div>
          </div>
        </motion.button>
        
        {/* Hard */}
        <motion.button
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('hard')}
          className="w-full bg-white rounded-2xl shadow-xl p-5 text-left border-4 border-red-400 hover:border-red-500 transition-all"
        >
          <div className="flex items-center gap-4">
            <span className="text-5xl">🌳</span>
            <div>
              <h3 className="text-2xl font-bold text-red-600">Hard</h3>
              <p className="text-gray-600">20 questions • Master explorer!</p>
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────
// TAPPABLE OBJECT CARD
// ─────────────────────────────────────────────────────────────

interface ObjectCardProps {
  object: MeasurableObject;
  onClick: () => void;
  isSelected?: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  size?: 'normal' | 'large';
  orderNumber?: number;
  disabled?: boolean;
}

const ObjectCard: React.FC<ObjectCardProps> = ({
  object,
  onClick,
  isSelected,
  isCorrect,
  isWrong,
  size = 'normal',
  orderNumber,
  disabled,
}) => {
  const sizeClasses = size === 'large' 
    ? 'w-36 h-44 md:w-44 md:h-52' 
    : 'w-28 h-36 md:w-32 md:h-40';
  
  const emojiSize = size === 'large' ? 'text-6xl md:text-7xl' : 'text-5xl md:text-6xl';
  const nameSize = size === 'large' ? 'text-lg md:text-xl' : 'text-sm md:text-base';

  let borderColor = 'border-amber-300 hover:border-amber-400';
  let bgColor = 'bg-amber-50';
  
  if (isCorrect) {
    borderColor = 'border-green-500';
    bgColor = 'bg-green-100';
  } else if (isWrong) {
    borderColor = 'border-red-500';
    bgColor = 'bg-red-100';
  } else if (isSelected) {
    borderColor = 'border-blue-500';
    bgColor = 'bg-blue-100';
  }

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      animate={isWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={isWrong ? { duration: 0.4 } : {}}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${sizeClasses} ${bgColor} ${borderColor} border-4 rounded-2xl shadow-lg flex flex-col items-center justify-center gap-2 transition-all relative ${
        disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {orderNumber !== undefined && (
        <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
          {orderNumber}
        </div>
      )}
      <span className={emojiSize}>{object.emoji}</span>
      <span className={`${nameSize} font-bold text-gray-700`}>{object.name}</span>
      {isCorrect && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 text-3xl"
        >
          ✅
        </motion.div>
      )}
    </motion.button>
  );
};

// ─────────────────────────────────────────────────────────────
// NUMBER OPTION BUTTON
// ─────────────────────────────────────────────────────────────

interface NumberOptionProps {
  value: number;
  onClick: () => void;
  isCorrect?: boolean;
  isWrong?: boolean;
  disabled?: boolean;
}

const NumberOption: React.FC<NumberOptionProps> = ({
  value,
  onClick,
  isCorrect,
  isWrong,
  disabled,
}) => {
  let bgColor = 'bg-purple-100 border-purple-400 hover:bg-purple-200';
  if (isCorrect) bgColor = 'bg-green-200 border-green-500';
  if (isWrong) bgColor = 'bg-red-200 border-red-500';

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.1 } : {}}
      whileTap={!disabled ? { scale: 0.9 } : {}}
      animate={isWrong ? { x: [-8, 8, -8, 8, 0] } : {}}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`w-20 h-20 md:w-24 md:h-24 ${bgColor} border-4 rounded-2xl shadow-lg flex items-center justify-center transition-all ${
        disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      <span className="text-3xl md:text-4xl font-bold text-gray-800">{value}</span>
    </motion.button>
  );
};

// ─────────────────────────────────────────────────────────────
// SEESAW VISUAL (for weight comparison)
// ─────────────────────────────────────────────────────────────

interface SeesawDisplayProps {
  leftObject: MeasurableObject;
  rightObject: MeasurableObject;
  tilt: 'left' | 'right' | 'balanced';
  onLeftClick: () => void;
  onRightClick: () => void;
  selectedId: string | null;
  correctId: string | null;
  wrongId: string | null;
  disabled: boolean;
}

const SeesawDisplay: React.FC<SeesawDisplayProps> = ({
  leftObject,
  rightObject,
  tilt,
  onLeftClick,
  onRightClick,
  selectedId,
  correctId,
  wrongId,
  disabled,
}) => {
  const rotation = tilt === 'left' ? -15 : tilt === 'right' ? 15 : 0;
  const leftY = tilt === 'left' ? 30 : tilt === 'right' ? -30 : 0;
  const rightY = tilt === 'right' ? 30 : tilt === 'left' ? -30 : 0;

  return (
    <div className="relative w-full max-w-lg mx-auto h-64">
      {/* Fulcrum */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
        <div className="w-0 h-0 border-l-[40px] border-r-[40px] border-b-[60px] border-l-transparent border-r-transparent border-b-amber-700" />
      </div>
      
      {/* Beam */}
      <motion.div
        animate={{ rotate: rotation }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute bottom-14 left-1/2 transform -translate-x-1/2 w-80 h-4 bg-amber-600 rounded-full origin-center"
        style={{ transformOrigin: 'center' }}
      >
        {/* Left Platform */}
        <motion.div
          animate={{ y: leftY }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute -left-8 -top-32"
        >
          <ObjectCard
            object={leftObject}
            onClick={onLeftClick}
            isSelected={selectedId === leftObject.id}
            isCorrect={correctId === leftObject.id}
            isWrong={wrongId === leftObject.id}
            disabled={disabled}
          />
        </motion.div>
        
        {/* Right Platform */}
        <motion.div
          animate={{ y: rightY }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute -right-8 -top-32"
        >
          <ObjectCard
            object={rightObject}
            onClick={onRightClick}
            isSelected={selectedId === rightObject.id}
            isCorrect={correctId === rightObject.id}
            isWrong={wrongId === rightObject.id}
            disabled={disabled}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// PLAYING SCREEN
// ─────────────────────────────────────────────────────────────

interface PlayingScreenProps {
  question: Question;
  round: number;
  totalRounds: number;
  score: number;
  difficulty: Difficulty;
  basePoints: number; // Dynamic points per question based on difficulty
  onCorrect: (points: number) => void;
  onWrong: () => void;
  attempts: number;
}

const PlayingScreen: React.FC<PlayingScreenProps> = ({
  question,
  round,
  totalRounds,
  score,
  difficulty,
  basePoints,
  onCorrect,
  onWrong,
  attempts,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [correctId, setCorrectId] = useState<string | null>(null);
  const [orderSelected, setOrderSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [seesawTilt, setSeesawTilt] = useState<'left' | 'right' | 'balanced'>('balanced');
  const [disabled, setDisabled] = useState(false);
  
  // Calculate penalty based on question type: compare-X (2 options) = -3, measure-units (4 options) = -2, order-size = -2
  const isCompareType = question.type.startsWith('compare-');
  const penaltyPerAttempt = isCompareType ? 3 : 2;
  const currentPoints = Math.max(1, basePoints - (attempts * penaltyPerAttempt));
  
  // Reset state when question changes
  useEffect(() => {
    setSelectedId(null);
    setWrongId(null);
    setCorrectId(null);
    setOrderSelected([]);
    setFeedback(null);
    setSeesawTilt('balanced');
    setDisabled(false);
  }, [question]);
  
  const handleCompareClick = useCallback((id: string) => {
    if (disabled) return;
    
    setSelectedId(id);
    
    // For weight, animate seesaw
    if (question.type === 'compare-weight') {
      const leftObj = question.objects[0];
      const rightObj = question.objects[1];
      if (id === leftObj.id) {
        setSeesawTilt(leftObj.value > rightObj.value ? 'left' : 'right');
      } else {
        setSeesawTilt(rightObj.value > leftObj.value ? 'right' : 'left');
      }
    }
    
    if (id === question.correctAnswer) {
      setCorrectId(id);
      setFeedback('correct');
      setDisabled(true);
      setTimeout(() => {
        onCorrect(currentPoints);
      }, 1500);
    } else {
      setWrongId(id);
      setFeedback('wrong');
      onWrong();
      setTimeout(() => {
        setWrongId(null);
        setSelectedId(null);
        setFeedback(null);
        setSeesawTilt('balanced');
      }, 800);
    }
  }, [disabled, question, currentPoints, onCorrect, onWrong]);
  
  const handleMeasureClick = useCallback((value: number) => {
    if (disabled) return;
    
    if (value === question.correctAnswer) {
      setCorrectId(value.toString());
      setFeedback('correct');
      setDisabled(true);
      setTimeout(() => {
        onCorrect(currentPoints);
      }, 1500);
    } else {
      setWrongId(value.toString());
      setFeedback('wrong');
      onWrong();
      setTimeout(() => {
        setWrongId(null);
        setFeedback(null);
      }, 800);
    }
  }, [disabled, question.correctAnswer, currentPoints, onCorrect, onWrong]);
  
  const handleOrderClick = useCallback((id: string) => {
    if (disabled || orderSelected.includes(id)) return;
    
    const correctOrder = question.correctAnswer as string[];
    const nextIndex = orderSelected.length;
    
    if (id === correctOrder[nextIndex]) {
      const newOrder = [...orderSelected, id];
      setOrderSelected(newOrder);
      
      if (newOrder.length === correctOrder.length) {
        setFeedback('correct');
        setDisabled(true);
        setTimeout(() => {
          onCorrect(currentPoints);
        }, 1500);
      }
    } else {
      setWrongId(id);
      setFeedback('wrong');
      onWrong();
      setTimeout(() => {
        setWrongId(null);
        setFeedback(null);
      }, 800);
    }
  }, [disabled, orderSelected, question.correctAnswer, currentPoints, onCorrect, onWrong]);
  
  const difficultyColors: Record<Difficulty, string> = {
    easy: 'bg-green-500',
    medium: 'bg-yellow-500',
    hard: 'bg-red-500',
  };

  const renderQuestion = () => {
    switch (question.type) {
      case 'compare-weight':
        return (
          <SeesawDisplay
            leftObject={question.objects[0]}
            rightObject={question.objects[1]}
            tilt={seesawTilt}
            onLeftClick={() => handleCompareClick(question.objects[0].id)}
            onRightClick={() => handleCompareClick(question.objects[1].id)}
            selectedId={selectedId}
            correctId={correctId}
            wrongId={wrongId}
            disabled={disabled}
          />
        );
      
      case 'compare-length':
      case 'compare-height':
      case 'compare-capacity':
        return (
          <div className="flex justify-center items-center gap-6 md:gap-10 flex-wrap">
            {question.objects.map((obj) => (
              <ObjectCard
                key={obj.id}
                object={obj}
                onClick={() => handleCompareClick(obj.id)}
                isSelected={selectedId === obj.id}
                isCorrect={correctId === obj.id}
                isWrong={wrongId === obj.id}
                size="large"
                disabled={disabled}
              />
            ))}
          </div>
        );
      
      case 'measure-units':
        return (
          <div className="text-center">
            {/* Object being measured */}
            <div className="mb-6">
              <span className="text-8xl md:text-9xl">{question.objects[0].emoji}</span>
              <p className="text-xl font-bold text-gray-700 mt-2">{question.objects[0].name}</p>
            </div>
            
            {/* Unit visualization */}
            <div className="flex justify-center items-center gap-1 mb-6 flex-wrap">
              {Array.from({ length: question.correctAnswer as number }).map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-3xl"
                >
                  {question.unit === 'handspans' ? '🖐️' :
                   question.unit === 'fingers' ? '👆' :
                   question.unit === 'footsteps' ? '👣' :
                   question.unit === 'pencils' ? '✏️' : '🧊'}
                </motion.span>
              ))}
            </div>
            
            {/* Number options */}
            <div className="flex justify-center gap-4 flex-wrap">
              {question.options?.map((num) => (
                <NumberOption
                  key={num}
                  value={num}
                  onClick={() => handleMeasureClick(num)}
                  isCorrect={correctId === num.toString()}
                  isWrong={wrongId === num.toString()}
                  disabled={disabled}
                />
              ))}
            </div>
          </div>
        );
      
      case 'order-size':
        return (
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-4">
              Tapped: {orderSelected.length} / {question.objects.length}
            </p>
            <div className="flex justify-center items-center gap-4 md:gap-6 flex-wrap">
              {question.objects.map((obj) => {
                const orderIndex = orderSelected.indexOf(obj.id);
                return (
                  <ObjectCard
                    key={obj.id}
                    object={obj}
                    onClick={() => handleOrderClick(obj.id)}
                    isSelected={orderSelected.includes(obj.id)}
                    isCorrect={orderSelected.includes(obj.id)}
                    isWrong={wrongId === obj.id}
                    orderNumber={orderIndex >= 0 ? orderIndex + 1 : undefined}
                    disabled={disabled || orderSelected.includes(obj.id)}
                  />
                );
              })}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-teal-500 to-emerald-600 p-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-4">
        <div className="bg-white/95 backdrop-blur rounded-xl shadow-lg p-3 md:p-4">
          <div className="flex items-center justify-between gap-2">
            {/* Round */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏝️</span>
              <span className="font-bold text-gray-700">
                {round}/{totalRounds}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-white text-xs font-bold ${difficultyColors[difficulty]}`}>
                {difficulty}
              </span>
            </div>
            
            {/* Score */}
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 px-3 py-1 rounded-lg">
                <span className="text-amber-600 font-bold">⭐ {score}</span>
              </div>
              <div className="bg-purple-100 px-3 py-1 rounded-lg">
                <span className="text-purple-600 font-bold text-sm">+{currentPoints} pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Instruction */}
      <div className="max-w-2xl mx-auto mb-6">
        <motion.div
          key={question.instruction}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-4 text-center"
        >
          <div className="flex items-center justify-center gap-3">
            <motion.span
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-4xl"
            >
              🐒
            </motion.span>
            <p className="text-xl md:text-2xl font-bold text-gray-700">
              {question.instruction}
            </p>
          </div>
        </motion.div>
      </div>
      
      {/* Question Area */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 md:p-8 min-h-[300px] flex items-center justify-center">
          {renderQuestion()}
        </div>
      </div>
      
      {/* Feedback Overlay */}
      <AnimatePresence>
        {feedback === 'correct' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <div className="bg-green-500/90 text-white px-8 py-6 rounded-2xl shadow-2xl text-center">
              <span className="text-6xl">🎉</span>
              <p className="text-3xl font-bold mt-2">Correct!</p>
              <p className="text-xl">+{currentPoints} points</p>
            </div>
          </motion.div>
        )}
        
        {feedback === 'wrong' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <div className="bg-red-500/90 text-white px-8 py-6 rounded-2xl shadow-2xl text-center">
              <span className="text-5xl">🤔</span>
              <p className="text-2xl font-bold mt-2">Try again!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// CELEBRATION SCREEN
// ─────────────────────────────────────────────────────────────

interface CelebrationScreenProps {
  score: number;
  totalRounds: number;
  correctCount: number;
  difficulty: Difficulty;
  onPlayAgain: () => void;
}

const CelebrationScreen: React.FC<CelebrationScreenProps> = ({
  score,
  totalRounds,
  correctCount,
  difficulty,
  onPlayAgain,
}) => {
  const accuracy = Math.round((correctCount / totalRounds) * 100);
  
  const getMedal = () => {
    if (accuracy >= 90) return { emoji: '🥇', text: 'Gold Medal!', color: 'text-yellow-500' };
    if (accuracy >= 70) return { emoji: '🥈', text: 'Silver Medal!', color: 'text-gray-400' };
    if (accuracy >= 50) return { emoji: '🥉', text: 'Bronze Medal!', color: 'text-amber-600' };
    return { emoji: '🌟', text: 'Great Effort!', color: 'text-purple-500' };
  };
  
  const medal = getMedal();
  
  // Generate floating stars
  const stars = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Floating Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          initial={{ y: '100vh', x: `${star.x}vw`, opacity: 0 }}
          animate={{ y: '-20vh', opacity: [0, 1, 1, 0] }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute text-3xl pointer-events-none"
        >
          ⭐
        </motion.div>
      ))}
      
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-md w-full text-center relative z-10"
      >
        {/* Medal */}
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
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-teal-50 rounded-xl p-4">
            <div className="text-3xl font-bold text-teal-600">{score}</div>
            <div className="text-sm text-teal-700">Total Score</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <div className="text-3xl font-bold text-green-600">{accuracy}%</div>
            <div className="text-sm text-green-700">Accuracy</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 col-span-2">
            <div className="text-3xl font-bold text-blue-600">{correctCount}/{totalRounds}</div>
            <div className="text-sm text-blue-700">Correct Answers</div>
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
            <p className="text-gray-700 text-left text-sm md:text-base">
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
          onClick={onPlayAgain}
          className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-xl px-8 py-4 rounded-full shadow-lg w-full"
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
  const [phase, setPhase] = useState<GamePhase>('welcome');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  const totalRounds = difficultyConfig[difficulty].rounds;
  const currentQuestion = questions[round - 1];
  
  const startGame = useCallback((selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    const config = difficultyConfig[selectedDifficulty];
    
    // Generate all questions upfront
    const generatedQuestions: Question[] = [];
    for (let i = 0; i < config.rounds; i++) {
      const type = config.types[Math.floor(Math.random() * config.types.length)];
      generatedQuestions.push(generateQuestion(type));
    }
    
    setQuestions(generatedQuestions);
    setRound(1);
    setScore(0);
    setCorrectCount(0);
    setAttempts(0);
    setPhase('playing');
  }, []);
  
  const handleCorrect = useCallback((points: number) => {
    setScore(prev => Math.min(100, prev + points)); // Cap score at 100
    setCorrectCount(prev => prev + 1);
    
    if (round >= totalRounds) {
      setTimeout(() => setPhase('celebration'), 500);
    } else {
      setTimeout(() => {
        setRound(prev => prev + 1);
        setAttempts(0);
      }, 1500);
    }
  }, [round, totalRounds]);
  
  const handleWrong = useCallback(() => {
    setAttempts(prev => prev + 1);
  }, []);
  
  const resetGame = useCallback(() => {
    setPhase('welcome');
    setRound(1);
    setScore(0);
    setCorrectCount(0);
    setAttempts(0);
    setQuestions([]);
  }, []);

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
          onSelect={startGame}
        />
      )}
      
      {phase === 'playing' && currentQuestion && (
        <PlayingScreen
          key={`playing-${round}`}
          question={currentQuestion}
          round={round}
          totalRounds={totalRounds}
          score={score}
          difficulty={difficulty}
          basePoints={Math.floor(100 / totalRounds)} // Dynamic: easy=10, medium=6, hard=5
          onCorrect={handleCorrect}
          onWrong={handleWrong}
          attempts={attempts}
        />
      )}
      
      {phase === 'celebration' && (
        <CelebrationScreen
          key="celebration"
          score={score}
          totalRounds={totalRounds}
          correctCount={correctCount}
          difficulty={difficulty}
          onPlayAgain={resetGame}
        />
      )}
    </AnimatePresence>
  );
};

export default MeasureIslandGame;