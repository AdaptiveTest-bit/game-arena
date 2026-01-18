'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Difficulty = 'easy' | 'medium' | 'hard';
type GamePhase = 'welcome' | 'difficulty' | 'playing' | 'celebration';
type GameMode = 'coin-collector' | 'count-money' | 'make-amount' | 'piggy-sort' | 'shopping';

interface Coin {
  id: number;
  value: number;
  emoji: string;
  color: string;
}

interface Question {
  id: number;
  mode: GameMode;
  instruction: string;
  coins: Coin[];
  targetAmount?: number;
  options?: number[];
  correctAnswer: number;
  item?: { name: string; emoji: string; price: number };
}

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const COINS: Coin[] = [
  { id: 1, value: 1, emoji: '🪙', color: 'from-amber-300 to-amber-500' },
  { id: 2, value: 2, emoji: '🪙', color: 'from-amber-400 to-amber-600' },
  { id: 5, value: 5, emoji: '🪙', color: 'from-gray-300 to-gray-500' },
  { id: 10, value: 10, emoji: '🪙', color: 'from-yellow-400 to-yellow-600' },
];

const NOTES = [
  { id: 20, value: 20, emoji: '💵', color: 'from-green-400 to-green-600' },
  { id: 50, value: 50, emoji: '💵', color: 'from-blue-400 to-blue-600' },
];

const SHOP_ITEMS = [
  { name: 'Candy', emoji: '🍬', price: 2 },
  { name: 'Apple', emoji: '🍎', price: 5 },
  { name: 'Juice', emoji: '🧃', price: 10 },
  { name: 'Cookie', emoji: '🍪', price: 3 },
  { name: 'Banana', emoji: '🍌', price: 4 },
  { name: 'Ice Cream', emoji: '🍦', price: 8 },
  { name: 'Chocolate', emoji: '🍫', price: 7 },
  { name: 'Toy Car', emoji: '🚗', price: 15 },
  { name: 'Ball', emoji: '⚽', price: 12 },
  { name: 'Book', emoji: '📕', price: 20 },
];

// ─────────────────────────────────────────────────────────────
// QUESTION GENERATORS
// ─────────────────────────────────────────────────────────────

const generateCoinCollectorQuestion = (maxValue: number): Question => {
  const availableCoins = COINS.filter(c => c.value <= maxValue);
  const targetCoin = availableCoins[Math.floor(Math.random() * availableCoins.length)];
  
  const coins: Coin[] = [];
  const correctCount = Math.floor(Math.random() * 3) + 2;
  for (let i = 0; i < correctCount; i++) {
    coins.push({ ...targetCoin, id: Date.now() + i });
  }
  
  const otherCoins = availableCoins.filter(c => c.value !== targetCoin.value);
  for (let i = 0; i < 4; i++) {
    const other = otherCoins[Math.floor(Math.random() * otherCoins.length)];
    coins.push({ ...other, id: Date.now() + correctCount + i });
  }
  coins.sort(() => Math.random() - 0.5);
  
  return {
    id: Date.now(),
    mode: 'coin-collector',
    instruction: `Tap all the ₹${targetCoin.value} coins!`,
    coins,
    correctAnswer: correctCount,
    targetAmount: targetCoin.value,
  };
};

const generateCountMoneyQuestion = (maxTotal: number): Question => {
  const coins: Coin[] = [];
  let total = 0;
  const numCoins = Math.floor(Math.random() * 3) + 2;
  
  for (let i = 0; i < numCoins; i++) {
    const availableCoins = COINS.filter(c => total + c.value <= maxTotal);
    if (availableCoins.length === 0) break;
    const coin = availableCoins[Math.floor(Math.random() * availableCoins.length)];
    coins.push({ ...coin, id: Date.now() + i });
    total += coin.value;
  }
  
  const options = [total];
  while (options.length < 4) {
    const opt = Math.floor(Math.random() * maxTotal) + 1;
    if (!options.includes(opt)) options.push(opt);
  }
  options.sort(() => Math.random() - 0.5);
  
  return {
    id: Date.now(),
    mode: 'count-money',
    instruction: 'How much money is this?',
    coins,
    options,
    correctAnswer: total,
  };
};

const generateMakeAmountQuestion = (maxAmount: number): Question => {
  const targetAmount = Math.floor(Math.random() * (maxAmount - 5)) + 5;
  
  const allCoins: Coin[] = [];
  COINS.forEach((coin, idx) => {
    for (let i = 0; i < 3; i++) {
      allCoins.push({ ...coin, id: Date.now() + idx * 3 + i });
    }
  });
  allCoins.sort(() => Math.random() - 0.5);
  
  return {
    id: Date.now(),
    mode: 'make-amount',
    instruction: `Make ₹${targetAmount}`,
    coins: allCoins,
    targetAmount,
    correctAnswer: targetAmount,
  };
};

const generatePiggySortQuestion = (): Question => {
  const coins: Coin[] = [];
  COINS.forEach((coin, idx) => {
    const count = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < count; i++) {
      coins.push({ ...coin, id: Date.now() + idx * 2 + i });
    }
  });
  coins.sort(() => Math.random() - 0.5);
  
  const targetValue = COINS[Math.floor(Math.random() * COINS.length)].value;
  const correctCount = coins.filter(c => c.value === targetValue).length;
  
  return {
    id: Date.now(),
    mode: 'piggy-sort',
    instruction: `Put all ₹${targetValue} coins in the piggy bank!`,
    coins,
    targetAmount: targetValue,
    correctAnswer: correctCount,
  };
};

const generateShoppingQuestion = (maxPrice: number): Question => {
  const affordableItems = SHOP_ITEMS.filter(i => i.price <= maxPrice);
  const item = affordableItems[Math.floor(Math.random() * affordableItems.length)];
  
  const coins: Coin[] = [];
  let remaining = item.price;
  
  while (remaining > 0) {
    const usableCoins = COINS.filter(c => c.value <= remaining).sort((a, b) => b.value - a.value);
    if (usableCoins.length === 0) break;
    const coin = usableCoins[0];
    coins.push({ ...coin, id: Date.now() + coins.length });
    remaining -= coin.value;
  }
  
  for (let i = 0; i < 4; i++) {
    const extraCoin = COINS[Math.floor(Math.random() * COINS.length)];
    coins.push({ ...extraCoin, id: Date.now() + coins.length + i + 100 });
  }
  coins.sort(() => Math.random() - 0.5);
  
  return {
    id: Date.now(),
    mode: 'shopping',
    instruction: `Buy the ${item.name} for ₹${item.price}`,
    coins,
    item,
    targetAmount: item.price,
    correctAnswer: item.price,
  };
};

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

const CoinKingdomGame: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>('welcome');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions] = useState(10);
  const [score, setScore] = useState(0);
  const [currentPoints, setCurrentPoints] = useState(10);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [collectedCoins, setCollectedCoins] = useState<Set<number>>(new Set());
  const [currentSum, setCurrentSum] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [streak, setStreak] = useState(0);

  const maxValue = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 20;
  const maxTotal = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 50;

  const generateQuestion = useCallback(() => {
    const modes: GameMode[] = difficulty === 'easy' 
      ? ['coin-collector', 'count-money', 'piggy-sort']
      : difficulty === 'medium'
      ? ['coin-collector', 'count-money', 'make-amount', 'piggy-sort']
      : ['coin-collector', 'count-money', 'make-amount', 'piggy-sort', 'shopping'];
    
    const mode = modes[Math.floor(Math.random() * modes.length)];
    
    switch (mode) {
      case 'coin-collector': return generateCoinCollectorQuestion(maxValue);
      case 'count-money': return generateCountMoneyQuestion(maxTotal);
      case 'make-amount': return generateMakeAmountQuestion(maxTotal);
      case 'piggy-sort': return generatePiggySortQuestion();
      case 'shopping': return generateShoppingQuestion(maxTotal);
      default: return generateCoinCollectorQuestion(maxValue);
    }
  }, [difficulty, maxValue, maxTotal]);

  const startGame = (diff: Difficulty) => {
    setDifficulty(diff);
    setQuestionNumber(1);
    setScore(0);
    setStreak(0);
    setCurrentPoints(10);
    setWrongAttempts(0);
    setCollectedCoins(new Set());
    setCurrentSum(0);
    setPhase('playing');
  };

  useEffect(() => {
    if (phase === 'playing') {
      setCurrentQuestion(generateQuestion());
      setCollectedCoins(new Set());
      setCurrentSum(0);
    }
  }, [phase, questionNumber, generateQuestion]);

  const nextQuestion = () => {
    if (questionNumber >= totalQuestions) {
      setPhase('celebration');
    } else {
      setQuestionNumber(prev => prev + 1);
      setCurrentPoints(10);
      setWrongAttempts(0);
      setCollectedCoins(new Set());
      setCurrentSum(0);
      setShowFeedback(null);
    }
  };

  const handleCorrect = () => {
    setShowFeedback('correct');
    setScore(prev => prev + currentPoints + (streak >= 3 ? 5 : 0));
    setStreak(prev => prev + 1);
    setTimeout(nextQuestion, 1500);
  };

  const handleWrong = () => {
    setShowFeedback('wrong');
    setWrongAttempts(prev => prev + 1);
    setCurrentPoints(prev => Math.max(1, prev - 3));
    setStreak(0);
    setTimeout(() => setShowFeedback(null), 800);
  };

  const handleOptionTap = (value: number) => {
    if (!currentQuestion || showFeedback) return;
    
    if (value === currentQuestion.correctAnswer) {
      handleCorrect();
    } else {
      handleWrong();
    }
  };

  const handleCoinTap = (coinId: number, coinValue: number) => {
    if (!currentQuestion || showFeedback) return;
    
    if (collectedCoins.has(coinId)) return;
    
    const mode = currentQuestion.mode;
    
    if (mode === 'coin-collector' || mode === 'piggy-sort') {
      const isCorrectCoin = coinValue === currentQuestion.targetAmount;
      
      if (isCorrectCoin) {
        const newCollected = new Set([...collectedCoins, coinId]);
        setCollectedCoins(newCollected);
        
        const targetCount = currentQuestion.coins.filter(c => c.value === currentQuestion.targetAmount).length;
        if (newCollected.size === targetCount) {
          handleCorrect();
        }
      } else {
        handleWrong();
      }
    } else if (mode === 'make-amount' || mode === 'shopping') {
      const newCollected = new Set([...collectedCoins, coinId]);
      const newSum = currentSum + coinValue;
      
      setCollectedCoins(newCollected);
      setCurrentSum(newSum);
      
      if (newSum === currentQuestion.targetAmount) {
        handleCorrect();
      } else if (newSum > currentQuestion.targetAmount!) {
        handleWrong();
        setCollectedCoins(new Set());
        setCurrentSum(0);
      }
    }
  };

  // ─────────────────────────────────────────────────────────────
  // RENDER: WELCOME
  // ─────────────────────────────────────────────────────────────
  
  if (phase === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg text-center"
        >
          <motion.div 
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-8xl mb-4"
          >
            🏰💰
          </motion.div>
          
          <h1 className="text-4xl font-bold text-amber-600 mb-4">
            Coin Kingdom
          </h1>
          
          <p className="text-gray-600 mb-6 text-lg">
            Join Raja Rupee to learn about Indian money! 🪙
          </p>
          
          <div className="bg-amber-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-amber-800 font-semibold mb-2">🎯 You&apos;ll learn:</p>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>🪙 Recognizing Indian coins (₹1, ₹2, ₹5, ₹10)</li>
              <li>🔢 Counting money</li>
              <li>💳 Making exact amounts</li>
              <li>🛒 Simple shopping</li>
            </ul>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPhase('difficulty')}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold py-4 px-12 rounded-full text-xl shadow-lg"
          >
            Enter Kingdom! 👑
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
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <h2 className="text-4xl font-bold text-white text-center mb-8">Choose Your Treasury</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { level: 'easy' as Difficulty, emoji: '🥉', title: 'Bronze Coins', desc: '₹1, ₹2, ₹5 only', color: 'from-amber-400 to-amber-600' },
              { level: 'medium' as Difficulty, emoji: '🥈', title: 'Silver Coins', desc: 'All coins, up to ₹20', color: 'from-gray-400 to-gray-600' },
              { level: 'hard' as Difficulty, emoji: '🥇', title: 'Golden Treasury', desc: 'Coins & shopping!', color: 'from-yellow-400 to-yellow-600' },
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
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center"
        >
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="text-8xl mb-4"
          >
            🏆
          </motion.div>
          
          <h1 className="text-4xl font-bold text-amber-600 mb-4">Royal Success!</h1>
          
          <div className="flex justify-center gap-1 mb-6">
            {Array(5).fill(0).map((_, i) => (
              <motion.span 
                key={i} 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`text-4xl ${i < stars ? '' : 'opacity-30'}`}
              >
                ⭐
              </motion.span>
            ))}
          </div>
          
          <div className="bg-amber-50 rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl font-bold text-amber-600">₹{score}</div>
                <div className="text-sm text-gray-600">Treasure Earned</div>
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
            className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold py-3 px-8 rounded-full text-lg"
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-400 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-4 shadow-lg mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">👑</span>
            <span className="font-bold text-amber-600">Raja Rupee</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-yellow-100 px-3 py-1 rounded-full">
              <span className="font-bold text-yellow-700">💰 ₹{score}</span>
            </div>
            <div className="bg-amber-100 px-3 py-1 rounded-full">
              <span className="font-bold text-amber-700">{questionNumber}/{totalQuestions}</span>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            +{currentPoints} pts
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/50 rounded-full h-3 mb-4 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-yellow-500 to-amber-500"
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

          {/* Shopping Item */}
          {currentQuestion.mode === 'shopping' && currentQuestion.item && (
            <div className="text-center mb-6">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="inline-block bg-pink-100 rounded-2xl p-6"
              >
                <div className="text-6xl mb-2">{currentQuestion.item.emoji}</div>
                <div className="text-lg font-bold text-pink-600">{currentQuestion.item.name}</div>
                <div className="text-2xl font-bold text-green-600">₹{currentQuestion.item.price}</div>
              </motion.div>
            </div>
          )}

          {/* Current Sum (for make-amount and shopping) */}
          {(currentQuestion.mode === 'make-amount' || currentQuestion.mode === 'shopping') && (
            <div className="text-center mb-4">
              <div className="inline-block bg-green-100 px-6 py-3 rounded-xl">
                <span className="text-2xl font-bold text-green-700">
                  ₹{currentSum} / ₹{currentQuestion.targetAmount}
                </span>
              </div>
            </div>
          )}

          {/* Coins Display */}
          {currentQuestion.mode !== 'count-money' && (
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {currentQuestion.coins.map((coin) => {
                const isCollected = collectedCoins.has(coin.id);
                
                return (
                  <motion.button
                    key={coin.id}
                    whileHover={{ scale: isCollected ? 1 : 1.1 }}
                    whileTap={{ scale: isCollected ? 1 : 0.9 }}
                    onClick={() => handleCoinTap(coin.id, coin.value)}
                    disabled={isCollected}
                    className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${coin.color} 
                      shadow-lg flex items-center justify-center transition-all
                      ${isCollected ? 'opacity-30 scale-75' : 'hover:shadow-xl'}`}
                  >
                    <div className="text-center">
                      <div className="text-xl font-bold text-white">₹{coin.value}</div>
                    </div>
                    {isCollected && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center text-3xl"
                      >
                        ✓
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Count Money Display */}
          {currentQuestion.mode === 'count-money' && (
            <>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {currentQuestion.coins.map((coin, i) => (
                  <motion.div
                    key={coin.id}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${coin.color} 
                      shadow-lg flex items-center justify-center`}
                  >
                    <div className="text-xl font-bold text-white">₹{coin.value}</div>
                  </motion.div>
                ))}
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {currentQuestion.options?.map((opt) => (
                  <motion.button
                    key={opt}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOptionTap(opt)}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-700 text-2xl font-bold py-4 rounded-xl transition-all"
                  >
                    ₹{opt}
                  </motion.button>
                ))}
              </div>
            </>
          )}

          {/* Piggy Bank (for piggy-sort) */}
          {currentQuestion.mode === 'piggy-sort' && (
            <div className="text-center mt-4">
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="inline-block text-6xl"
              >
                🐷
              </motion.div>
              <div className="mt-2 text-gray-600">
                Collected: {collectedCoins.size} / {currentQuestion.correctAnswer}
              </div>
            </div>
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
                {showFeedback === 'correct' ? '💰' : '🤔'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CoinKingdomGame;
