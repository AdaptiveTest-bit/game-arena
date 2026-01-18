'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { RotateCcw, Sparkles, Trophy, Star, Home } from 'lucide-react';

// ============== TYPE DEFINITIONS ==============

type DifficultyLevel = 'easy' | 'medium' | 'hard';
type PatternMode = 'spot-pattern' | 'find-missing' | 'complete-pattern' | 'growing-pattern' | 'mirror-pattern';

interface PatternOption {
  id: string;
  emoji: string;
  label?: string;
}

interface PatternQuestion {
  mode: PatternMode;
  pattern: string[];
  missingIndex: number | number[];
  correctAnswer: string | string[];
  options: PatternOption[];
  instruction: string;
}

// ============== PATTERN DATA ==============

const COLORS = {
  shapes: ['🔴', '🔵', '🟡', '🟢', '🟣', '🟠'],
  fruits: ['🍎', '🍌', '🍊', '🍇', '🍓', '🍑'],
  animals: ['🐶', '🐱', '🐰', '🐸', '🦊', '🐻'],
  objects: ['⭐', '❤️', '🌙', '🌸', '⚡', '🌈'],
  shapes2d: ['△', '□', '○', '◇', '⬡', '⬟'],
  plants: ['🌱', '🌿', '🌳', '🌻', '🌹', '🌺'],
};

const GROWING_EMOJIS = ['🌱', '🌿', '🌳', '⭐', '❤️', '🌸'];

// ============== HELPER FUNCTIONS ==============

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ============== QUESTION GENERATORS ==============

function generateSpotPatternQuestion(difficulty: DifficultyLevel): PatternQuestion {
  const category = randomChoice(Object.keys(COLORS) as (keyof typeof COLORS)[]);
  const items = shuffleArray(COLORS[category]).slice(0, difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4);
  
  const patternLength = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 6 : 7;
  const pattern: string[] = [];
  
  // Create repeating pattern
  for (let i = 0; i < patternLength; i++) {
    pattern.push(items[i % items.length]);
  }
  
  // Last slot is the question
  const correctAnswer = items[patternLength % items.length];
  pattern.push('❓');
  
  // Create options - include correct answer and 3 random distractors
  const allItems = COLORS[category];
  const distractors = allItems.filter(item => item !== correctAnswer).slice(0, 3);
  const options: PatternOption[] = shuffleArray([
    { id: correctAnswer, emoji: correctAnswer },
    ...distractors.map(d => ({ id: d, emoji: d }))
  ]);
  
  return {
    mode: 'spot-pattern',
    pattern,
    missingIndex: pattern.length - 1,
    correctAnswer,
    options,
    instruction: '🔮 What comes next?',
  };
}

function generateFindMissingQuestion(difficulty: DifficultyLevel): PatternQuestion {
  const category = randomChoice(Object.keys(COLORS) as (keyof typeof COLORS)[]);
  const items = shuffleArray(COLORS[category]).slice(0, difficulty === 'easy' ? 2 : 3);
  
  const patternLength = difficulty === 'easy' ? 6 : 8;
  const fullPattern: string[] = [];
  
  // Create repeating pattern
  for (let i = 0; i < patternLength; i++) {
    fullPattern.push(items[i % items.length]);
  }
  
  // Pick a random middle position to be missing
  const missingIndex = getRandomInt(2, patternLength - 2);
  const correctAnswer = fullPattern[missingIndex];
  
  const pattern = [...fullPattern];
  pattern[missingIndex] = '❓';
  
  // Create options
  const distractors = COLORS[category].filter(item => item !== correctAnswer).slice(0, 3);
  const options: PatternOption[] = shuffleArray([
    { id: correctAnswer, emoji: correctAnswer },
    ...distractors.map(d => ({ id: d, emoji: d }))
  ]);
  
  return {
    mode: 'find-missing',
    pattern,
    missingIndex,
    correctAnswer,
    options,
    instruction: '🧩 What\'s missing?',
  };
}

function generateCompletePatternQuestion(difficulty: DifficultyLevel): PatternQuestion {
  const category = randomChoice(Object.keys(COLORS) as (keyof typeof COLORS)[]);
  const items = shuffleArray(COLORS[category]).slice(0, 2);
  
  const visibleLength = difficulty === 'easy' ? 4 : 6;
  const missingCount = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 2 : 3;
  
  const fullPattern: string[] = [];
  for (let i = 0; i < visibleLength + missingCount; i++) {
    fullPattern.push(items[i % items.length]);
  }
  
  // Last N slots are missing
  const pattern = [...fullPattern];
  const missingIndices: number[] = [];
  const correctAnswers: string[] = [];
  
  for (let i = 0; i < missingCount; i++) {
    const idx = visibleLength + i;
    missingIndices.push(idx);
    correctAnswers.push(pattern[idx]);
    pattern[idx] = '❓';
  }
  
  // Create options - just the two pattern items
  const options: PatternOption[] = items.map(item => ({ id: item, emoji: item }));
  
  return {
    mode: 'complete-pattern',
    pattern,
    missingIndex: missingIndices,
    correctAnswer: correctAnswers,
    options,
    instruction: '✨ Complete the pattern!',
  };
}

function generateGrowingPatternQuestion(difficulty: DifficultyLevel): PatternQuestion {
  const emoji = randomChoice(GROWING_EMOJIS);
  const startCount = 1;
  const steps = difficulty === 'easy' ? 3 : 4;
  
  // Growing pattern: 1, 2, 3, 4... or 1, 2, 3...
  const pattern: string[] = [];
  for (let i = 1; i <= steps; i++) {
    pattern.push(emoji.repeat(i));
  }
  pattern.push('❓');
  
  const correctAnswer = (steps + 1).toString();
  
  // Create number options
  const correctNum = steps + 1;
  const optionNums = shuffleArray([correctNum, correctNum - 1, correctNum + 1, correctNum + 2].filter(n => n > 0 && n <= 10));
  const options: PatternOption[] = optionNums.slice(0, 4).map(n => ({
    id: n.toString(),
    emoji: n.toString(),
    label: n.toString(),
  }));
  
  return {
    mode: 'growing-pattern',
    pattern,
    missingIndex: pattern.length - 1,
    correctAnswer,
    options,
    instruction: `🌱 How many ${emoji} come next?`,
  };
}

function generateMirrorPatternQuestion(difficulty: DifficultyLevel): PatternQuestion {
  const category = randomChoice(Object.keys(COLORS) as (keyof typeof COLORS)[]);
  const items = shuffleArray(COLORS[category]).slice(0, difficulty === 'easy' ? 2 : 3);
  
  const leftSideLength = difficulty === 'easy' ? 2 : 3;
  const leftSide: string[] = [];
  
  for (let i = 0; i < leftSideLength; i++) {
    leftSide.push(items[i % items.length]);
  }
  
  // Right side should be reverse (mirror)
  const rightSide = [...leftSide].reverse();
  
  // Create pattern with mirror separator
  const pattern = [...leftSide, '|', ...rightSide.map(() => '❓')];
  
  const missingIndices: number[] = [];
  for (let i = 0; i < rightSide.length; i++) {
    missingIndices.push(leftSideLength + 1 + i);
  }
  
  // Options are the items used
  const options: PatternOption[] = items.map(item => ({ id: item, emoji: item }));
  
  return {
    mode: 'mirror-pattern',
    pattern,
    missingIndex: missingIndices,
    correctAnswer: rightSide,
    options,
    instruction: '🪞 Complete the mirror!',
  };
}

function generateQuestion(mode: PatternMode, difficulty: DifficultyLevel): PatternQuestion {
  switch (mode) {
    case 'spot-pattern':
      return generateSpotPatternQuestion(difficulty);
    case 'find-missing':
      return generateFindMissingQuestion(difficulty);
    case 'complete-pattern':
      return generateCompletePatternQuestion(difficulty);
    case 'growing-pattern':
      return generateGrowingPatternQuestion(difficulty);
    case 'mirror-pattern':
      return generateMirrorPatternQuestion(difficulty);
  }
}

function getRandomMode(): PatternMode {
  const modes: PatternMode[] = ['spot-pattern', 'find-missing', 'complete-pattern', 'growing-pattern', 'mirror-pattern'];
  return randomChoice(modes);
}

// ============== GAME COMPONENT ==============

const PatternParadeGame: React.FC = () => {
  // Game State
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'complete'>('menu');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy');
  
  // Round State
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(10);
  const [score, setScore] = useState(0);
  const [baseRoundScore, setBaseRoundScore] = useState(10); // Dynamic points per round based on totalRounds
  const [roundScore, setRoundScore] = useState(10);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [roundsCorrect, setRoundsCorrect] = useState(0);
  
  // Question State
  const [question, setQuestion] = useState<PatternQuestion | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [currentSlotIndex, setCurrentSlotIndex] = useState(0);
  
  // Feedback State
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shakeWrong, setShakeWrong] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Calculate total required answers
  const totalSlotsToFill = useMemo(() => {
    if (!question) return 0;
    return Array.isArray(question.missingIndex) ? question.missingIndex.length : 1;
  }, [question]);
  
  // Generate new question
  const generateNewQuestion = useCallback(() => {
    const mode = getRandomMode();
    const newQuestion = generateQuestion(mode, difficulty);
    setQuestion(newQuestion);
    setUserAnswers([]);
    setCurrentSlotIndex(0);
    setRoundScore(baseRoundScore);
    setShowFeedback(false);
    setIsCorrect(false);
  }, [difficulty, baseRoundScore]);
  
  // Start game
  const startGame = useCallback(() => {
    const rounds = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 12 : 15;
    const pointsPerRound = Math.floor(100 / rounds); // easy=10, medium=8, hard=6
    setTotalRounds(rounds);
    setBaseRoundScore(pointsPerRound);
    setRoundScore(pointsPerRound);
    setCurrentRound(1);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setRoundsCorrect(0);
    setGameState('playing');
    generateNewQuestion();
  }, [difficulty, generateNewQuestion]);
  
  // Handle option tap
  const handleOptionTap = useCallback((option: PatternOption) => {
    if (showFeedback || !question) return;
    
    const newAnswers = [...userAnswers, option.id];
    setUserAnswers(newAnswers);
    
    // Check if this is the last slot
    if (newAnswers.length === totalSlotsToFill) {
      // Validate answer
      let correct = false;
      
      if (Array.isArray(question.correctAnswer)) {
        correct = newAnswers.every((ans, idx) => ans === question.correctAnswer[idx]);
      } else {
        correct = newAnswers[0] === question.correctAnswer;
      }
      
      if (correct) {
        // Correct answer!
        setIsCorrect(true);
        setShowFeedback(true);
        setShowCelebration(true);
        setScore(prev => Math.min(100, prev + roundScore)); // Cap score at 100
        setStreak(prev => {
          const newStreak = prev + 1;
          setMaxStreak(current => Math.max(current, newStreak));
          return newStreak;
        });
        setRoundsCorrect(prev => prev + 1);
        
        // Auto-advance after 1.5s
        setTimeout(() => {
          setShowCelebration(false);
          if (currentRound >= totalRounds) {
            setGameState('complete');
          } else {
            setCurrentRound(prev => prev + 1);
            generateNewQuestion();
          }
        }, 1500);
      } else {
        // Wrong answer!
        setIsCorrect(false);
        setShowFeedback(true);
        setShakeWrong(true);
        setStreak(0);
        // 2-option questions (complete-pattern) get higher penalty (-3), others get -2
        const penaltyAmount = question.options.length === 2 ? 3 : 2;
        setRoundScore(prev => Math.max(0, prev - penaltyAmount));
        
        // Reset and allow retry
        setTimeout(() => {
          setShakeWrong(false);
          setShowFeedback(false);
          setUserAnswers([]);
          setCurrentSlotIndex(0);
        }, 1000);
      }
    } else {
      setCurrentSlotIndex(newAnswers.length);
    }
  }, [showFeedback, question, userAnswers, totalSlotsToFill, roundScore, currentRound, totalRounds, generateNewQuestion]);
  
  // Get display pattern with user answers filled in
  const displayPattern = useMemo(() => {
    if (!question) return [];
    
    const pattern = [...question.pattern];
    const missingIndices = Array.isArray(question.missingIndex) 
      ? question.missingIndex 
      : [question.missingIndex];
    
    userAnswers.forEach((answer, answerIdx) => {
      if (answerIdx < missingIndices.length) {
        pattern[missingIndices[answerIdx]] = answer;
      }
    });
    
    return pattern;
  }, [question, userAnswers]);
  
  // Highlight current slot
  const getCurrentSlotIndex = useMemo(() => {
    if (!question) return -1;
    const missingIndices = Array.isArray(question.missingIndex) 
      ? question.missingIndex 
      : [question.missingIndex];
    return missingIndices[currentSlotIndex] ?? -1;
  }, [question, currentSlotIndex]);

  // ============== MENU SCREEN ==============
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block animate-bounce mb-4">
              <span className="text-8xl">🚂</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-3 drop-shadow-lg">
              Pattern Parade
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              🎉 Help the magical train solve patterns!
            </p>
            <p className="text-sm text-white/70 mt-2">
              CBSE Class 1 • Chapter 7: Patterns
            </p>
          </div>
          
          {/* Train Animation */}
          <div className="flex justify-center items-center gap-2 mb-8 overflow-hidden">
            <span className="text-5xl animate-pulse">🚂</span>
            <span className="text-4xl">🔴</span>
            <span className="text-4xl">🔵</span>
            <span className="text-4xl">🔴</span>
            <span className="text-4xl">🔵</span>
            <span className="text-4xl animate-bounce">❓</span>
          </div>
          
          {/* Difficulty Selection */}
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 mb-8">
            <h2 className="text-center text-white font-bold mb-6 text-2xl">🎯 Choose Difficulty:</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {[
                { id: 'easy' as DifficultyLevel, name: 'Easy', emoji: '🌟', color: 'from-green-400 to-green-500', desc: '10 puzzles' },
                { id: 'medium' as DifficultyLevel, name: 'Medium', emoji: '⭐', color: 'from-yellow-400 to-orange-500', desc: '12 puzzles' },
                { id: 'hard' as DifficultyLevel, name: 'Hard', emoji: '💫', color: 'from-red-400 to-pink-500', desc: '15 puzzles' },
              ].map((diff) => (
                <button
                  key={diff.id}
                  className={`px-8 py-4 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 ${
                    difficulty === diff.id
                      ? `bg-gradient-to-r ${diff.color} text-white scale-110 shadow-xl ring-4 ring-white/50`
                      : 'bg-white/40 text-white hover:bg-white/60'
                  }`}
                  onClick={() => setDifficulty(diff.id)}
                >
                  <span className="text-3xl">{diff.emoji}</span>
                  <div>{diff.name}</div>
                  <div className="text-sm opacity-80">{diff.desc}</div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Pattern Types Preview */}
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 mb-8">
            <h2 className="text-center text-white font-bold mb-4 text-xl">🎮 Pattern Games:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-white text-center">
              <div className="bg-white/20 rounded-xl p-3">
                <div className="text-2xl mb-1">🔮</div>
                <div className="font-bold">What Comes Next?</div>
                <div className="text-sm opacity-80">🔴🔵🔴🔵❓</div>
              </div>
              <div className="bg-white/20 rounded-xl p-3">
                <div className="text-2xl mb-1">🧩</div>
                <div className="font-bold">Find the Missing</div>
                <div className="text-sm opacity-80">🍎🍌❓🍌🍎</div>
              </div>
              <div className="bg-white/20 rounded-xl p-3">
                <div className="text-2xl mb-1">✨</div>
                <div className="font-bold">Complete Pattern</div>
                <div className="text-sm opacity-80">△□△□❓❓</div>
              </div>
              <div className="bg-white/20 rounded-xl p-3">
                <div className="text-2xl mb-1">🌱</div>
                <div className="font-bold">Growing Pattern</div>
                <div className="text-sm opacity-80">🌱 🌱🌱 🌱🌱🌱 ❓</div>
              </div>
              <div className="bg-white/20 rounded-xl p-3 sm:col-span-2 lg:col-span-1">
                <div className="text-2xl mb-1">🪞</div>
                <div className="font-bold">Mirror Pattern</div>
                <div className="text-sm opacity-80">🔴🔵 | ❓❓</div>
              </div>
            </div>
          </div>
          
          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={startGame}
              className="bg-white text-purple-600 px-12 py-5 rounded-full font-bold text-2xl hover:scale-110 transition-transform shadow-2xl inline-flex items-center gap-3 animate-pulse"
            >
              <Sparkles size={32} />
              Start Playing!
              <span className="text-3xl">🚂</span>
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
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 md:p-12 text-center max-w-lg shadow-2xl">
          <div className="text-8xl mb-6 animate-bounce">
            {accuracy >= 80 ? '🏆' : accuracy >= 60 ? '🌟' : '👏'}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-purple-600 mb-4">
            {accuracy >= 80 ? 'Pattern Master!' : accuracy >= 60 ? 'Great Job!' : 'Good Try!'}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            You completed all {totalRounds} puzzles! 🎉
          </p>
          
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600">{score}</div>
                <div className="text-sm text-gray-600">⭐ Points</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">{accuracy}%</div>
                <div className="text-sm text-gray-600">✅ Accuracy</div>
              </div>
            </div>
            <div className="flex justify-center items-center gap-2 text-orange-500">
              <Star size={24} fill="currentColor" />
              <span className="font-bold text-lg">Best Streak: {maxStreak} 🔥</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setGameState('menu')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-lg"
            >
              <Home size={24} />
              Menu
            </button>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-lg"
            >
              <RotateCcw size={24} />
              Play Again! 🚂
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============== GAME SCREEN ==============
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-sky-100">
      {/* Top Bar */}
      <div className="bg-white/95 shadow-lg p-3 md:p-4 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-3 md:gap-6">
          <span className="text-2xl md:text-3xl">🚂</span>
          <span className="bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-lg font-bold">
            {currentRound}/{totalRounds}
          </span>
        </div>
        
        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full">
            <Trophy size={20} className="text-yellow-500" />
            <span className="font-bold text-yellow-700 text-lg">{score}</span>
          </div>
          {streak > 1 && (
            <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full font-bold animate-pulse text-lg">
              🔥 {streak}x
            </div>
          )}
          <div className="bg-green-100 text-green-600 px-3 py-2 rounded-full font-bold text-sm">
            +{roundScore} pts
          </div>
          <button
            onClick={() => setGameState('menu')}
            className="bg-gray-200 hover:bg-gray-300 p-2 rounded-xl"
          >
            <Home size={24} />
          </button>
        </div>
      </div>
      
      {/* Instruction */}
      {question && (
        <div className="bg-yellow-50 border-b-4 border-yellow-300 p-4 md:p-6 text-center">
          <p className="text-2xl md:text-3xl font-bold text-yellow-800">
            {question.instruction}
          </p>
        </div>
      )}
      
      {/* Pattern Display */}
      <div className="flex justify-center p-6 md:p-10">
        <div 
          className={`bg-white rounded-3xl shadow-2xl p-6 md:p-10 border-4 border-purple-200 ${
            shakeWrong ? 'animate-shake' : ''
          }`}
          style={{
            animation: shakeWrong ? 'shake 0.5s ease-in-out' : undefined,
          }}
        >
          {/* Pattern Items */}
          <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
            {displayPattern.map((item, idx) => {
              const isCurrentSlot = idx === getCurrentSlotIndex && item === '❓';
              const isMirrorSeparator = item === '|';
              const isQuestion = item === '❓';
              
              if (isMirrorSeparator) {
                return (
                  <div 
                    key={idx}
                    className="text-5xl md:text-6xl text-purple-400 font-bold px-2"
                  >
                    🪞
                  </div>
                );
              }
              
              // For growing pattern, display items in a box
              if (question?.mode === 'growing-pattern' && !isQuestion) {
                return (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-3 md:p-4 min-w-[60px] md:min-w-[80px] text-center shadow-lg border-2 border-green-300"
                  >
                    <span className="text-2xl md:text-3xl">{item}</span>
                  </div>
                );
              }
              
              return (
                <div
                  key={idx}
                  className={`
                    text-4xl md:text-6xl p-3 md:p-4 rounded-2xl transition-all
                    ${isQuestion 
                      ? `bg-gradient-to-br from-purple-100 to-pink-100 border-4 ${
                          isCurrentSlot 
                            ? 'border-purple-500 animate-pulse shadow-xl scale-110' 
                            : 'border-purple-300'
                        }`
                      : 'bg-gray-50'
                    }
                  `}
                >
                  {item}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Options */}
      {question && !showFeedback && (
        <div className="max-w-3xl mx-auto px-4 pb-8">
          <p className="text-center text-gray-600 mb-4 text-lg font-medium">
            👆 Tap to choose:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {question.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionTap(option)}
                className="bg-white hover:bg-purple-50 active:scale-95 text-5xl md:text-6xl p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border-4 border-transparent hover:border-purple-300 active:bg-purple-100"
              >
                {option.emoji}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Feedback */}
      {showFeedback && (
        <div className="max-w-xl mx-auto px-4 pb-8">
          <div className={`rounded-2xl p-6 text-center text-2xl font-bold ${
            isCorrect 
              ? 'bg-green-100 text-green-800 border-4 border-green-300' 
              : 'bg-red-100 text-red-800 border-4 border-red-300'
          }`}>
            {isCorrect ? '🎉 Perfect!' : '❌ Try again!'}
          </div>
        </div>
      )}
      
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className="text-center">
            <div className="text-9xl animate-bounce mb-4">
              {streak >= 3 ? '🔥' : '🎉'}
            </div>
            {streak >= 3 && (
              <div className="text-4xl font-bold text-orange-500 drop-shadow-lg animate-pulse">
                {streak}x Streak!
              </div>
            )}
          </div>
          {/* Confetti effect */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute text-3xl animate-fall"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              >
                {['⭐', '🎉', '✨', '🌟', '💫'][Math.floor(Math.random() * 5)]}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Shake animation styles */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        @keyframes fall {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animate-fall {
          animation: fall 2s ease-in forwards;
        }
      `}</style>
    </div>
  );
};

export default PatternParadeGame;
