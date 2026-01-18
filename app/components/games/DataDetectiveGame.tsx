'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Difficulty = 'easy' | 'medium' | 'hard';
type GamePhase = 'welcome' | 'difficulty' | 'playing' | 'celebration';
type QuestionType = 'count-objects' | 'sort-objects' | 'compare-groups' | 'read-tally' | 'read-pictograph';

interface Question {
  id: number;
  type: QuestionType;
  instruction: string;
  data: {
    objects?: string[];
    targetColor?: string;
    targetCount?: number;
    groupA?: string[];
    groupB?: string[];
    askMore?: boolean;
    tallyCount?: number;
    pictographData?: { emoji: string; count: number }[];
  };
  options: number[];
  correctAnswer: number;
}

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const EMOJIS = {
  fruits: ['🍎', '🍌', '🍊', '🍇', '🍓', '🍉', '🥝', '🍑'],
  animals: ['🐶', '🐱', '🐰', '🐻', '🦊', '🐼', '🐨', '🐸'],
  colors: {
    red: ['🍎', '🍓', '❤️', '🌹'],
    yellow: ['🍌', '⭐', '🌻', '🌽'],
    blue: ['💙', '🫐', '🦋', '💎'],
    green: ['🥒', '🥦', '🍀', '🐸'],
    orange: ['🍊', '🥕', '🎃', '🧡'],
  }
};

// ─────────────────────────────────────────────────────────────
// QUESTION GENERATORS
// ─────────────────────────────────────────────────────────────

const generateCountQuestion = (maxCount: number): Question => {
  const category = Math.random() > 0.5 ? 'fruits' : 'animals';
  const emojis = EMOJIS[category];
  const targetEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  const targetCount = Math.floor(Math.random() * (maxCount - 2)) + 2;
  
  const objects: string[] = [];
  for (let i = 0; i < targetCount; i++) {
    objects.push(targetEmoji);
  }
  const otherEmojis = emojis.filter(e => e !== targetEmoji);
  const distractorCount = Math.floor(Math.random() * 4) + 2;
  for (let i = 0; i < distractorCount; i++) {
    objects.push(otherEmojis[Math.floor(Math.random() * otherEmojis.length)]);
  }
  objects.sort(() => Math.random() - 0.5);
  
  const options = [targetCount];
  while (options.length < 4) {
    const opt = Math.floor(Math.random() * maxCount) + 1;
    if (!options.includes(opt)) options.push(opt);
  }
  options.sort(() => Math.random() - 0.5);
  
  return {
    id: Date.now(),
    type: 'count-objects',
    instruction: `How many ${targetEmoji} do you see?`,
    data: { objects, targetCount },
    options,
    correctAnswer: targetCount,
  };
};

const generateCompareQuestion = (maxCount: number): Question => {
  const emojis = EMOJIS.fruits;
  const emojiA = emojis[Math.floor(Math.random() * emojis.length)];
  const emojiB = emojis.filter(e => e !== emojiA)[Math.floor(Math.random() * (emojis.length - 1))];
  
  const countA = Math.floor(Math.random() * (maxCount - 2)) + 2;
  let countB = Math.floor(Math.random() * (maxCount - 2)) + 2;
  while (countB === countA) {
    countB = Math.floor(Math.random() * (maxCount - 2)) + 2;
  }
  
  const groupA = Array(countA).fill(emojiA);
  const groupB = Array(countB).fill(emojiB);
  const askMore = Math.random() > 0.5;
  
  const correctAnswer = askMore ? (countA > countB ? 1 : 2) : (countA < countB ? 1 : 2);
  
  return {
    id: Date.now(),
    type: 'compare-groups',
    instruction: askMore ? 'Which group has MORE?' : 'Which group has LESS?',
    data: { groupA, groupB, askMore },
    options: [1, 2],
    correctAnswer,
  };
};

const generateTallyQuestion = (maxCount: number): Question => {
  const tallyCount = Math.floor(Math.random() * (maxCount - 2)) + 3;
  
  const options = [tallyCount];
  while (options.length < 4) {
    const opt = Math.floor(Math.random() * maxCount) + 1;
    if (!options.includes(opt)) options.push(opt);
  }
  options.sort(() => Math.random() - 0.5);
  
  return {
    id: Date.now(),
    type: 'read-tally',
    instruction: 'How many does this tally show?',
    data: { tallyCount },
    options,
    correctAnswer: tallyCount,
  };
};

const generatePictographQuestion = (): Question => {
  const emojis = ['🍎', '🍌', '🍊'];
  const pictographData = emojis.map(emoji => ({
    emoji,
    count: Math.floor(Math.random() * 5) + 1,
  }));
  
  const targetIdx = Math.floor(Math.random() * emojis.length);
  const targetEmoji = emojis[targetIdx];
  const correctAnswer = pictographData[targetIdx].count;
  
  const options = [correctAnswer];
  while (options.length < 4) {
    const opt = Math.floor(Math.random() * 6) + 1;
    if (!options.includes(opt)) options.push(opt);
  }
  options.sort(() => Math.random() - 0.5);
  
  return {
    id: Date.now(),
    type: 'read-pictograph',
    instruction: `How many ${targetEmoji} are in the chart?`,
    data: { pictographData },
    options,
    correctAnswer,
  };
};

const generateSortQuestion = (): Question => {
  const colors = Object.keys(EMOJIS.colors) as Array<keyof typeof EMOJIS.colors>;
  const targetColor = colors[Math.floor(Math.random() * colors.length)];
  const targetEmojis = EMOJIS.colors[targetColor];
  
  const objects: string[] = [];
  const targetCount = Math.floor(Math.random() * 3) + 3;
  for (let i = 0; i < targetCount; i++) {
    objects.push(targetEmojis[Math.floor(Math.random() * targetEmojis.length)]);
  }
  const otherColors = colors.filter(c => c !== targetColor);
  for (let i = 0; i < 4; i++) {
    const color = otherColors[Math.floor(Math.random() * otherColors.length)];
    const colorEmojis = EMOJIS.colors[color];
    objects.push(colorEmojis[Math.floor(Math.random() * colorEmojis.length)]);
  }
  objects.sort(() => Math.random() - 0.5);
  
  return {
    id: Date.now(),
    type: 'sort-objects',
    instruction: `Tap all the ${targetColor.toUpperCase()} items!`,
    data: { objects, targetColor, targetCount },
    options: [],
    correctAnswer: targetCount,
  };
};

// ─────────────────────────────────────────────────────────────
// TALLY MARKS COMPONENT
// ─────────────────────────────────────────────────────────────

const TallyMarks: React.FC<{ count: number }> = ({ count }) => {
  const groups = Math.floor(count / 5);
  const remainder = count % 5;
  
  return (
    <div className="flex gap-4 justify-center items-center flex-wrap">
      {Array(groups).fill(0).map((_, i) => (
        <div key={`group-${i}`} className="relative w-16 h-16">
          <div className="absolute left-1 top-2 w-2 h-12 bg-amber-800 rounded" />
          <div className="absolute left-4 top-2 w-2 h-12 bg-amber-800 rounded" />
          <div className="absolute left-7 top-2 w-2 h-12 bg-amber-800 rounded" />
          <div className="absolute left-10 top-2 w-2 h-12 bg-amber-800 rounded" />
          <div className="absolute left-0 top-4 w-14 h-2 bg-amber-900 rounded transform rotate-[-30deg] origin-left" />
        </div>
      ))}
      {remainder > 0 && (
        <div className="flex gap-1">
          {Array(remainder).fill(0).map((_, i) => (
            <div key={`rem-${i}`} className="w-2 h-12 bg-amber-800 rounded" />
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

const DataDetectiveGame: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>('welcome');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [score, setScore] = useState(0);
  const [basePoints, setBasePoints] = useState(10); // Points per question based on difficulty
  const [currentPoints, setCurrentPoints] = useState(10);
  const [wrongAttempts, setWrongAttempts] = useState<Set<number>>(new Set());
  const [sortedItems, setSortedItems] = useState<Set<number>>(new Set());
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [streak, setStreak] = useState(0);

  const maxCount = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 7 : 10;

  const generateQuestion = useCallback(() => {
    const types: QuestionType[] = difficulty === 'easy' 
      ? ['count-objects', 'compare-groups', 'sort-objects']
      : difficulty === 'medium'
      ? ['count-objects', 'compare-groups', 'sort-objects', 'read-tally']
      : ['count-objects', 'compare-groups', 'sort-objects', 'read-tally', 'read-pictograph'];
    
    const type = types[Math.floor(Math.random() * types.length)];
    
    switch (type) {
      case 'count-objects': return generateCountQuestion(maxCount);
      case 'compare-groups': return generateCompareQuestion(maxCount);
      case 'read-tally': return generateTallyQuestion(maxCount);
      case 'read-pictograph': return generatePictographQuestion();
      case 'sort-objects': return generateSortQuestion();
      default: return generateCountQuestion(maxCount);
    }
  }, [difficulty, maxCount]);

  const startGame = (diff: Difficulty) => {
    setDifficulty(diff);
    const questions = diff === 'easy' ? 10 : diff === 'medium' ? 12 : 15;
    const pointsPerQuestion = Math.floor(100 / questions); // easy=10, medium=8, hard=6
    setTotalQuestions(questions);
    setBasePoints(pointsPerQuestion);
    setQuestionNumber(1);
    setScore(0);
    setStreak(0);
    setCurrentPoints(pointsPerQuestion);
    setWrongAttempts(new Set());
    setSortedItems(new Set());
    setPhase('playing');
  };

  useEffect(() => {
    if (phase === 'playing') {
      setCurrentQuestion(generateQuestion());
    }
  }, [phase, questionNumber, generateQuestion]);

  const handleAnswer = (answer: number) => {
    if (!currentQuestion || showFeedback) return;
    
    if (answer === currentQuestion.correctAnswer) {
      setShowFeedback('correct');
      // Cap score at 100, no streak bonus for cleaner 100-point system
      setScore(prev => Math.min(100, prev + currentPoints));
      setStreak(prev => prev + 1);
      
      setTimeout(() => {
        if (questionNumber >= totalQuestions) {
          setPhase('celebration');
        } else {
          setQuestionNumber(prev => prev + 1);
          setCurrentPoints(basePoints);
          setWrongAttempts(new Set());
          setSortedItems(new Set());
          setShowFeedback(null);
        }
      }, 1500);
    } else {
      setShowFeedback('wrong');
      setWrongAttempts(prev => new Set([...prev, answer]));
      // 2-option questions (compare-groups) get higher penalty (-3), others get -2
      const penaltyAmount = currentQuestion.options?.length === 2 ? 3 : 2;
      setCurrentPoints(prev => Math.max(1, prev - penaltyAmount));
      setStreak(0);
      
      setTimeout(() => {
        setShowFeedback(null);
      }, 800);
    }
  };

  const handleSortTap = (index: number) => {
    if (!currentQuestion || currentQuestion.type !== 'sort-objects' || showFeedback) return;
    
    const objects = currentQuestion.data.objects || [];
    const targetColor = currentQuestion.data.targetColor as keyof typeof EMOJIS.colors;
    const targetEmojis = EMOJIS.colors[targetColor];
    
    if (sortedItems.has(index)) return;
    
    const isCorrect = targetEmojis.includes(objects[index]);
    
    if (isCorrect) {
      const newSorted = new Set([...sortedItems, index]);
      setSortedItems(newSorted);
      
      const totalTarget = objects.filter(o => targetEmojis.includes(o)).length;
      if (newSorted.size === totalTarget) {
        setShowFeedback('correct');
        setScore(prev => Math.min(100, prev + currentPoints));
        setStreak(prev => prev + 1);
        
        setTimeout(() => {
          if (questionNumber >= totalQuestions) {
            setPhase('celebration');
          } else {
            setQuestionNumber(prev => prev + 1);
            setCurrentPoints(basePoints);
            setWrongAttempts(new Set());
            setSortedItems(new Set());
            setShowFeedback(null);
          }
        }, 1500);
      }
    } else {
      setShowFeedback('wrong');
      setCurrentPoints(prev => Math.max(1, prev - 2));
      setStreak(0);
      setTimeout(() => setShowFeedback(null), 800);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // RENDER: WELCOME
  // ─────────────────────────────────────────────────────────────
  
  if (phase === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg text-center"
        >
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-8xl mb-4"
          >
            🐕‍🦺📊
          </motion.div>
          
          <h1 className="text-4xl font-bold text-purple-600 mb-4">
            Data Detective Island
          </h1>
          
          <p className="text-gray-600 mb-6 text-lg">
            Join Dotty the Detective Dog to collect clues and solve data mysteries! 🔍
          </p>
          
          <div className="bg-purple-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-purple-800 font-semibold mb-2">📚 You&apos;ll learn:</p>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>🔢 Counting & collecting data</li>
              <li>📊 Reading tally marks & pictographs</li>
              <li>🔄 Sorting objects by properties</li>
              <li>⚖️ Comparing quantities</li>
            </ul>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPhase('difficulty')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-12 rounded-full text-xl shadow-lg"
          >
            Start Adventure! 🚀
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER: DIFFICULTY
  // ─────────────────────────────────────────────────────────────
  
  if (phase === 'difficulty') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <h2 className="text-4xl font-bold text-white text-center mb-8">Choose Your Level</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { level: 'easy' as Difficulty, emoji: '🌱', title: 'Junior Detective', desc: 'Count to 5, sorting', color: 'from-green-400 to-emerald-500' },
              { level: 'medium' as Difficulty, emoji: '⭐', title: 'Smart Detective', desc: 'Count to 7, tally marks', color: 'from-yellow-400 to-orange-500' },
              { level: 'hard' as Difficulty, emoji: '🏆', title: 'Super Detective', desc: 'Count to 10, pictographs', color: 'from-red-400 to-pink-500' },
            ].map((d) => (
              <motion.button
                key={d.level}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => startGame(d.level)}
                className={`bg-gradient-to-br ${d.color} text-white rounded-2xl p-6 shadow-xl`}
              >
                <div className="text-5xl mb-3">{d.emoji}</div>
                <div className="text-xl font-bold mb-2">{d.title}</div>
                <div className="text-sm opacity-90">{d.desc}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER: CELEBRATION
  // ─────────────────────────────────────────────────────────────
  
  if (phase === 'celebration') {
    const accuracy = Math.round((score / (totalQuestions * 10)) * 100);
    const stars = accuracy >= 90 ? 5 : accuracy >= 70 ? 4 : accuracy >= 50 ? 3 : accuracy >= 30 ? 2 : 1;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-pink-400 to-purple-500 flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center"
        >
          <motion.div 
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="text-8xl mb-4"
          >
            🎉
          </motion.div>
          
          <h1 className="text-4xl font-bold text-purple-600 mb-4">Case Solved!</h1>
          
          <div className="flex justify-center gap-1 mb-6">
            {Array(5).fill(0).map((_, i) => (
              <span key={i} className={`text-4xl ${i < stars ? '' : 'opacity-30'}`}>⭐</span>
            ))}
          </div>
          
          <div className="bg-purple-50 rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl font-bold text-purple-600">{score}</div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">{accuracy}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPhase('welcome')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-full text-lg"
          >
            Play Again 🔄
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER: PLAYING
  // ─────────────────────────────────────────────────────────────
  
  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-4 shadow-lg mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🐕‍🦺</span>
            <span className="font-bold text-purple-600">Dotty</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-yellow-100 px-3 py-1 rounded-full">
              <span className="font-bold text-yellow-700">⭐ {score}</span>
            </div>
            <div className="bg-purple-100 px-3 py-1 rounded-full">
              <span className="font-bold text-purple-700">{questionNumber}/{totalQuestions}</span>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            +{currentPoints} pts
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/50 rounded-full h-3 mb-4 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Streak */}
        {streak >= 3 && (
          <div className="text-center mb-2">
            <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold animate-pulse">
              🔥 {streak} Streak! +5 Bonus
            </span>
          </div>
        )}

        {/* Question Card */}
        <motion.div 
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-xl"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {currentQuestion.instruction}
          </h2>

          {/* COUNT OBJECTS */}
          {currentQuestion.type === 'count-objects' && (
            <>
              <div className="flex flex-wrap justify-center gap-3 mb-8 min-h-[120px]">
                {currentQuestion.data.objects?.map((obj, i) => (
                  <motion.span 
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="text-5xl"
                  >
                    {obj}
                  </motion.span>
                ))}
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {currentQuestion.options.map((opt) => (
                  <motion.button
                    key={opt}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer(opt)}
                    disabled={wrongAttempts.has(opt)}
                    className={`text-3xl font-bold py-4 rounded-xl transition-all ${
                      wrongAttempts.has(opt)
                        ? 'bg-red-100 text-red-400'
                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    }`}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            </>
          )}

          {/* COMPARE GROUPS */}
          {currentQuestion.type === 'compare-groups' && (
            <div className="grid grid-cols-2 gap-6">
              {[1, 2].map((group) => {
                const items = group === 1 ? currentQuestion.data.groupA : currentQuestion.data.groupB;
                return (
                  <motion.button
                    key={group}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleAnswer(group)}
                    disabled={wrongAttempts.has(group)}
                    className={`p-6 rounded-2xl border-4 transition-all ${
                      wrongAttempts.has(group)
                        ? 'border-red-300 bg-red-50'
                        : 'border-purple-200 bg-purple-50 hover:border-purple-400'
                    }`}
                  >
                    <div className="flex flex-wrap justify-center gap-2 mb-3">
                      {items?.map((item, i) => (
                        <span key={i} className="text-4xl">{item}</span>
                      ))}
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      Group {group}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* READ TALLY */}
          {currentQuestion.type === 'read-tally' && (
            <>
              <div className="bg-amber-50 rounded-2xl p-6 mb-8">
                <TallyMarks count={currentQuestion.data.tallyCount || 0} />
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {currentQuestion.options.map((opt) => (
                  <motion.button
                    key={opt}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer(opt)}
                    disabled={wrongAttempts.has(opt)}
                    className={`text-3xl font-bold py-4 rounded-xl transition-all ${
                      wrongAttempts.has(opt)
                        ? 'bg-red-100 text-red-400'
                        : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    }`}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            </>
          )}

          {/* READ PICTOGRAPH */}
          {currentQuestion.type === 'read-pictograph' && (
            <>
              <div className="bg-blue-50 rounded-2xl p-6 mb-8">
                {currentQuestion.data.pictographData?.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 mb-2">
                    <span className="text-3xl w-12">{item.emoji}</span>
                    <div className="flex gap-1">
                      {Array(item.count).fill(0).map((_, j) => (
                        <span key={j} className="text-2xl">{item.emoji}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {currentQuestion.options.map((opt) => (
                  <motion.button
                    key={opt}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer(opt)}
                    disabled={wrongAttempts.has(opt)}
                    className={`text-3xl font-bold py-4 rounded-xl transition-all ${
                      wrongAttempts.has(opt)
                        ? 'bg-red-100 text-red-400'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            </>
          )}

          {/* SORT OBJECTS */}
          {currentQuestion.type === 'sort-objects' && (
            <>
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 mb-4">
                <div className="flex flex-wrap justify-center gap-3">
                  {currentQuestion.data.objects?.map((obj, i) => {
                    const targetColor = currentQuestion.data.targetColor as keyof typeof EMOJIS.colors;
                    const isSorted = sortedItems.has(i);
                    
                    return (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleSortTap(i)}
                        className={`text-5xl p-2 rounded-xl transition-all ${
                          isSorted 
                            ? 'bg-green-200 ring-4 ring-green-400' 
                            : 'hover:bg-white/50'
                        }`}
                      >
                        {obj}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
              
              <div className="text-center text-gray-600">
                <span className="bg-purple-100 px-4 py-2 rounded-full">
                  Found: {sortedItems.size} / {currentQuestion.data.targetCount}
                </span>
              </div>
            </>
          )}
        </motion.div>

        {/* Feedback Overlay */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
            >
              <div className={`text-8xl ${showFeedback === 'correct' ? 'animate-bounce' : ''}`}>
                {showFeedback === 'correct' ? '🎉' : '🤔'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DataDetectiveGame;
