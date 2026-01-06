'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Check, SkipForward, Volume2, Home } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useTickTockStore } from '../../store/useTickTockStore';

// Dynamically import canvas to avoid SSR issues
const TickTockCanvas = dynamic(() => import('./TickTockCanvas'), { ssr: false });

// ============================================
// MASCOT COMPONENT
// ============================================
const CuckooMascot: React.FC<{ state: 'idle' | 'happy' | 'thinking' | 'celebrating' }> = ({ state }) => {
  const stateEmojis = {
    idle: '🐦',
    happy: '🎉',
    thinking: '🤔',
    celebrating: '🏆',
  };
  
  return (
    <motion.div
      className="text-6xl"
      animate={state === 'celebrating' ? {
        scale: [1, 1.2, 1],
        rotate: [0, -10, 10, 0],
      } : {
        y: [0, -5, 0],
      }}
      transition={{
        duration: state === 'celebrating' ? 0.5 : 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {stateEmojis[state]}
    </motion.div>
  );
};

// ============================================
// TIME OF DAY BUTTON
// ============================================
const TimeOfDayButton: React.FC<{
  timeOfDay: string;
  emoji: string;
  isSelected: boolean;
  onClick: () => void;
}> = ({ timeOfDay, emoji, isSelected, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex flex-col items-center p-4 rounded-xl border-3 transition-all ${
      isSelected 
        ? 'bg-indigo-500 text-white border-indigo-600 shadow-lg' 
        : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
    }`}
  >
    <span className="text-3xl mb-1">{emoji}</span>
    <span className="text-sm font-semibold capitalize">{timeOfDay}</span>
  </motion.button>
);

// ============================================
// DRAGGABLE ACTIVITY CARD
// ============================================
const ActivityCard: React.FC<{
  activity: { emoji: string; text: string };
  onClick?: () => void;
  isSmall?: boolean;
  isDimmed?: boolean;
}> = ({ activity, onClick, isSmall = false, isDimmed = false }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`bg-white rounded-xl shadow-md border-2 border-gray-200 cursor-pointer transition-all
      ${isSmall ? 'p-2' : 'p-4'}
      ${isDimmed ? 'opacity-50' : 'opacity-100'}
      hover:border-indigo-400 hover:shadow-lg`}
  >
    <div className={`text-center ${isSmall ? 'text-2xl' : 'text-4xl'} mb-1`}>{activity.emoji}</div>
    <div className={`text-center text-gray-700 font-medium ${isSmall ? 'text-xs' : 'text-sm'}`}>
      {activity.text}
    </div>
  </motion.div>
);

// ============================================
// SLOT FOR SEQUENCING
// ============================================
const SequenceSlot: React.FC<{
  index: number;
  label: string;
  item: { emoji: string; text: string } | null;
  onRemove: () => void;
  onClick: () => void;
  isSelected: boolean;
}> = ({ index, label, item, onRemove, onClick, isSelected }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    onClick={onClick}
    className={`flex flex-col items-center p-2 rounded-xl border-3 min-w-[80px] cursor-pointer transition-all
      ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-dashed border-gray-300 bg-gray-50'}
      ${item ? 'border-solid border-green-400 bg-green-50' : ''}`}
  >
    <span className="text-xs font-bold text-gray-500 mb-1">{label}</span>
    {item ? (
      <div className="text-center">
        <div className="text-2xl">{item.emoji}</div>
        <div className="text-xs text-gray-600 max-w-[70px] truncate">{item.text}</div>
        <button 
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="text-red-400 text-xs mt-1 hover:text-red-600"
        >
          ✕ Remove
        </button>
      </div>
    ) : (
      <div className="text-2xl text-gray-300">?</div>
    )}
  </motion.div>
);

// ============================================
// MAIN GAME COMPONENT
// ============================================
const TickTockGame: React.FC = () => {
  const store = useTickTockStore();
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 300, height: 300 });
  
  useEffect(() => {
    const updateSize = () => {
      const size = Math.min(window.innerWidth * 0.8, 300);
      setWindowSize({ width: size, height: size });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  // Calculate stars for celebration
  const calculateStars = (score: number): number => {
    if (score >= 90) return 5;
    if (score >= 75) return 4;
    if (score >= 60) return 3;
    if (score >= 40) return 2;
    return 1;
  };
  
  // ============================================
  // WELCOME SCREEN
  // ============================================
  if (store.gamePhase === 'welcome') {
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
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Tick-Tock Town
            </h1>
            
            <p className="text-gray-600 text-lg mb-6">
              Learn about Time with Cuckoo the Clock Bird! 🐦
            </p>
            
            <div className="bg-indigo-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-indigo-700 mb-2">📚 You'll Learn:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>🕐 Reading the clock</li>
                <li>🌅 Morning, Afternoon, Evening, Night</li>
                <li>📅 Days of the week</li>
                <li>⏱️ Which takes longer or shorter</li>
                <li>🔢 Order of events</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 rounded-xl p-3 mb-6 border border-yellow-200">
              <p className="text-sm text-yellow-800">
                🎯 Answer 20 questions to become a <strong>Time Master!</strong>
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => store.startGame()}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transition text-xl"
            >
              🎮 Start Adventure!
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }
  
  // ============================================
  // DIFFICULTY SELECTION SCREEN
  // ============================================
  if (store.gamePhase === 'difficulty_select') {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full"
        >
          <div className="bg-white rounded-3xl p-8 shadow-2xl text-center">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🐦
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Choose Your Level!
            </h2>
            <p className="text-gray-600 mb-6">
              How well do you know about Time?
            </p>
            
            {/* Easy Level */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => store.selectDifficulty('easy')}
              className="w-full mb-4 p-4 rounded-xl border-3 border-green-400 bg-green-50 hover:bg-green-100 transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">🌱</span>
                <div>
                  <h3 className="font-bold text-green-700 text-lg">Easy</h3>
                  <p className="text-sm text-green-600">
                    Clock reading & Time of Day
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    🕐 Set clock • 📖 Read clock • 🌅 Morning/Evening
                  </p>
                </div>
              </div>
            </motion.button>
            
            {/* Medium Level */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => store.selectDifficulty('medium')}
              className="w-full mb-4 p-4 rounded-xl border-3 border-yellow-400 bg-yellow-50 hover:bg-yellow-100 transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">🌟</span>
                <div>
                  <h3 className="font-bold text-yellow-700 text-lg">Medium</h3>
                  <p className="text-sm text-yellow-600">
                    + Days of Week & Sequences
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    📅 Days order • 🔢 Event sequences • ➡️ Before/After
                  </p>
                </div>
              </div>
            </motion.button>
            
            {/* Hard Level */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => store.selectDifficulty('hard')}
              className="w-full mb-4 p-4 rounded-xl border-3 border-red-400 bg-red-50 hover:bg-red-100 transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">🔥</span>
                <div>
                  <h3 className="font-bold text-red-700 text-lg">Hard</h3>
                  <p className="text-sm text-red-600">
                    + Duration & Earlier/Later
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ⏱️ Longer/Shorter • 🌞 Earlier/Later • All questions!
                  </p>
                </div>
              </div>
            </motion.button>
            
            {/* Back button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => store.resetGame()}
              className="text-gray-500 hover:text-gray-700 font-medium mt-2"
            >
              ← Back to Welcome
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }
  
  // ============================================
  // CELEBRATION SCREEN
  // ============================================
  if (store.gamePhase === 'celebrating') {
    const stars = calculateStars(store.score);
    
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full"
        >
          <div className="bg-white rounded-3xl p-8 shadow-2xl text-center">
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
            
            <h2 className="text-3xl font-bold text-orange-600 mb-2">
              You're a Time Master!
            </h2>
            
            {/* Difficulty Badge */}
            <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold mb-4 ${
              store.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
              store.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {store.difficulty === 'easy' ? '🌱 Easy' : 
               store.difficulty === 'medium' ? '🌟 Medium' : '🔥 Hard'} Level
            </div>
            
            <div className="text-5xl mb-4">
              {Array(stars).fill('⭐').join('')}
              {Array(5 - stars).fill('☆').join('')}
            </div>
            
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-6 mb-6">
              <div className="text-4xl font-bold text-indigo-600">
                {store.score}/100
              </div>
              <div className="text-gray-600">
                {store.correctAnswers} out of {store.totalRounds} correct
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => store.resetGame()}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition flex items-center gap-2"
              >
                <RotateCcw size={20} />
                Play Again
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
  
  // ============================================
  // FEEDBACK OVERLAY
  // ============================================
  if (store.gamePhase === 'feedback') {
    return (
      <div className={`min-h-screen w-full flex items-center justify-center p-4 ${
        store.isCorrect 
          ? 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500'
          : 'bg-gradient-to-br from-orange-400 via-red-500 to-pink-500'
      }`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <div className="bg-white rounded-3xl p-8 shadow-2xl text-center">
            <motion.div
              animate={store.isCorrect ? {
                scale: [1, 1.3, 1],
                rotate: [0, -15, 15, 0],
              } : {
                x: [-5, 5, -5, 5, 0],
              }}
              transition={{ duration: 0.5 }}
              className="text-7xl mb-4"
            >
              {store.isCorrect ? '🎉' : '🤔'}
            </motion.div>
            
            <h2 className={`text-2xl font-bold mb-4 ${
              store.isCorrect ? 'text-green-600' : 'text-orange-600'
            }`}>
              {store.feedbackMessage}
            </h2>
            
            {/* Show correct answer for sequence/order questions */}
            {!store.isCorrect && store.currentQuestion && (
              <div className="bg-yellow-50 rounded-xl p-4 mb-4 border border-yellow-200">
                {store.currentQuestion.type === 'set_clock' && store.currentQuestion.targetHour && (
                  <p className="text-gray-700">
                    The correct time was <strong>{store.currentQuestion.targetHour} o'clock</strong>
                  </p>
                )}
                {(store.currentQuestion.type === 'read_clock' || 
                  store.currentQuestion.type === 'days_before_after' ||
                  store.currentQuestion.type === 'daily_routine') && (
                  <p className="text-gray-700">
                    The correct answer was <strong>{store.currentQuestion.correctAnswer}</strong>
                  </p>
                )}
                {store.currentQuestion.type === 'duration' && (
                  <p className="text-gray-700">
                    {store.currentQuestion.correctAnswer === 'A' 
                      ? store.currentQuestion.optionA?.text
                      : store.currentQuestion.optionB?.text
                    } takes {store.currentQuestion.askForLonger ? 'longer' : 'shorter'} time
                  </p>
                )}
                {store.currentQuestion.type === 'earlier_later' && (
                  <p className="text-gray-700">
                    {store.currentQuestion.correctAnswer === 'A' 
                      ? store.currentQuestion.optionA?.text
                      : store.currentQuestion.optionB?.text
                    } happens {store.currentQuestion.askForEarlier ? 'earlier' : 'later'}
                  </p>
                )}
              </div>
            )}
            
            <div className="text-gray-500 mb-6">
              Round {store.currentRound} of {store.totalRounds} • Score: {store.score}/100
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => store.nextQuestion()}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transition flex items-center gap-2 mx-auto"
            >
              {store.currentRound >= store.totalRounds ? 'See Results' : 'Next Question'} →
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }
  
  // ============================================
  // PLAYING PHASE - RENDER BASED ON QUESTION TYPE
  // ============================================
  const question = store.currentQuestion;
  if (!question) return null;
  
  const renderQuestionContent = () => {
    switch (question.type) {
      // ============================================
      // SET CLOCK QUESTION
      // ============================================
      case 'set_clock':
        return (
          <div className="flex flex-col items-center">
            <div className="bg-white rounded-2xl p-4 shadow-lg mb-6">
              <TickTockCanvas
                width={windowSize.width}
                height={windowSize.height}
                hourHandAngle={store.hourHandAngle}
                onAngleChange={(angle) => store.setHourHandAngle(angle)}
                interactive={true}
              />
            </div>
            <p className="text-gray-600 text-sm mb-4">
              👆 Tap on the clock to set the hour hand
            </p>
            <div className="text-lg font-semibold text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg">
              Current: {Math.round(((store.hourHandAngle + 360) % 360) / 30) || 12} o'clock
            </div>
          </div>
        );
      
      // ============================================
      // READ CLOCK QUESTION
      // ============================================
      case 'read_clock':
        return (
          <div className="flex flex-col items-center">
            <div className="bg-white rounded-2xl p-4 shadow-lg mb-6">
              <TickTockCanvas
                width={windowSize.width}
                height={windowSize.height}
                displayHour={question.displayHour}
                interactive={false}
              />
            </div>
            <div className="grid grid-cols-3 gap-3 w-full">
              {question.options?.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => store.selectOption(option)}
                  className={`py-3 px-4 rounded-xl font-bold text-lg transition-all border-3 ${
                    store.selectedOption === option
                      ? 'bg-indigo-500 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </div>
        );
      
      // ============================================
      // DAILY ROUTINE QUESTION
      // ============================================
      case 'daily_routine':
        return (
          <div className="flex flex-col items-center">
            {question.activity && (
              <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 text-center">
                <div className="text-6xl mb-2">{question.activity.emoji}</div>
                <div className="text-xl font-semibold text-gray-700">{question.activity.text}</div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-3 w-full">
              <TimeOfDayButton
                timeOfDay="morning"
                emoji="🌅"
                isSelected={store.selectedOption === 'morning'}
                onClick={() => store.selectOption('morning')}
              />
              <TimeOfDayButton
                timeOfDay="afternoon"
                emoji="☀️"
                isSelected={store.selectedOption === 'afternoon'}
                onClick={() => store.selectOption('afternoon')}
              />
              <TimeOfDayButton
                timeOfDay="evening"
                emoji="🌆"
                isSelected={store.selectedOption === 'evening'}
                onClick={() => store.selectOption('evening')}
              />
              <TimeOfDayButton
                timeOfDay="night"
                emoji="🌙"
                isSelected={store.selectedOption === 'night'}
                onClick={() => store.selectOption('night')}
              />
            </div>
          </div>
        );
      
      // ============================================
      // SEQUENCE EVENTS QUESTION
      // ============================================
      case 'sequence_events':
        const sequenceLabels = ['1st', '2nd', '3rd', '4th'];
        return (
          <div className="flex flex-col items-center">
            {/* Slots */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {store.placedItems.map((item, index) => (
                <SequenceSlot
                  key={index}
                  index={index}
                  label={sequenceLabels[index] || `${index + 1}`}
                  item={item}
                  onRemove={() => store.removeItemFromSlot(index)}
                  onClick={() => setSelectedSlot(index)}
                  isSelected={selectedSlot === index}
                />
              ))}
            </div>
            
            {/* Available items */}
            <div className="bg-gray-100 rounded-xl p-4 w-full">
              <p className="text-sm text-gray-500 mb-3 text-center">
                {selectedSlot !== null 
                  ? `👆 Tap a card to place it in slot ${sequenceLabels[selectedSlot]}`
                  : '👆 First tap a slot above, then tap a card below'
                }
              </p>
              <div className="grid grid-cols-2 gap-3">
                {store.availableItems.map((item, index) => (
                  <ActivityCard
                    key={index}
                    activity={item}
                    isSmall={true}
                    onClick={() => {
                      if (selectedSlot !== null) {
                        store.placeItemInSlot(item, selectedSlot);
                        // Auto-advance to next empty slot
                        const nextEmpty = store.placedItems.findIndex((p, i) => p === null && i !== selectedSlot);
                        setSelectedSlot(nextEmpty >= 0 ? nextEmpty : null);
                      }
                    }}
                    isDimmed={selectedSlot === null}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      
      // ============================================
      // DAYS ORDER QUESTION
      // ============================================
      case 'days_order':
        const dayLabels = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'];
        return (
          <div className="flex flex-col items-center">
            {/* Slots */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 flex-wrap justify-center">
              {store.placedItems.map((item, index) => (
                <SequenceSlot
                  key={index}
                  index={index}
                  label={dayLabels[index]}
                  item={item}
                  onRemove={() => store.removeItemFromSlot(index)}
                  onClick={() => setSelectedSlot(index)}
                  isSelected={selectedSlot === index}
                />
              ))}
            </div>
            
            {/* Available days */}
            <div className="bg-gray-100 rounded-xl p-4 w-full">
              <p className="text-sm text-gray-500 mb-3 text-center">
                {selectedSlot !== null 
                  ? `👆 Tap a day to place it in slot ${dayLabels[selectedSlot]}`
                  : '👆 First tap a slot above, then tap a day below'
                }
              </p>
              <div className="grid grid-cols-2 gap-2">
                {store.availableItems.map((item, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (selectedSlot !== null) {
                        store.placeItemInSlot(item, selectedSlot);
                        const nextEmpty = store.placedItems.findIndex((p, i) => p === null && i !== selectedSlot);
                        setSelectedSlot(nextEmpty >= 0 ? nextEmpty : null);
                      }
                    }}
                    className={`py-2 px-3 rounded-xl font-semibold transition-all border-2 ${
                      selectedSlot !== null
                        ? 'bg-white text-gray-700 border-gray-200 hover:border-indigo-400'
                        : 'bg-gray-200 text-gray-400 border-gray-200'
                    }`}
                  >
                    📅 {item.text}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        );
      
      // ============================================
      // DAYS BEFORE/AFTER QUESTION
      // ============================================
      case 'days_before_after':
        return (
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-1 gap-3 w-full">
              {question.options?.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => store.selectOption(option)}
                  className={`py-4 px-6 rounded-xl font-bold text-lg transition-all border-3 flex items-center justify-center gap-3 ${
                    store.selectedOption === option
                      ? 'bg-indigo-500 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <span className="text-2xl">📅</span>
                  {option}
                </motion.button>
              ))}
            </div>
          </div>
        );
      
      // ============================================
      // DURATION COMPARISON QUESTION
      // ============================================
      case 'duration':
        return (
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-2 gap-4 w-full mb-4">
              {/* Option A */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => store.selectOption('A')}
                className={`p-4 rounded-xl border-3 transition-all ${
                  store.selectedOption === 'A'
                    ? 'bg-indigo-500 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="text-4xl mb-2">{question.optionA?.emoji}</div>
                <div className="font-semibold">{question.optionA?.text}</div>
                <div className={`text-sm mt-2 font-bold ${store.selectedOption === 'A' ? 'text-white' : 'text-indigo-500'}`}>
                  (A)
                </div>
              </motion.button>
              
              {/* Option B */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => store.selectOption('B')}
                className={`p-4 rounded-xl border-3 transition-all ${
                  store.selectedOption === 'B'
                    ? 'bg-indigo-500 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="text-4xl mb-2">{question.optionB?.emoji}</div>
                <div className="font-semibold">{question.optionB?.text}</div>
                <div className={`text-sm mt-2 font-bold ${store.selectedOption === 'B' ? 'text-white' : 'text-indigo-500'}`}>
                  (B)
                </div>
              </motion.button>
            </div>
          </div>
        );
      
      // ============================================
      // EARLIER/LATER QUESTION
      // ============================================
      case 'earlier_later':
        return (
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-2 gap-4 w-full mb-4">
              {/* Option A */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => store.selectOption('A')}
                className={`p-4 rounded-xl border-3 transition-all ${
                  store.selectedOption === 'A'
                    ? 'bg-indigo-500 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="text-4xl mb-2">{question.optionA?.emoji}</div>
                <div className="font-semibold text-sm">{question.optionA?.text}</div>
                <div className={`text-sm mt-2 font-bold ${store.selectedOption === 'A' ? 'text-white' : 'text-indigo-500'}`}>
                  (A)
                </div>
              </motion.button>
              
              {/* Option B */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => store.selectOption('B')}
                className={`p-4 rounded-xl border-3 transition-all ${
                  store.selectedOption === 'B'
                    ? 'bg-indigo-500 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="text-4xl mb-2">{question.optionB?.emoji}</div>
                <div className="font-semibold text-sm">{question.optionB?.text}</div>
                <div className={`text-sm mt-2 font-bold ${store.selectedOption === 'B' ? 'text-white' : 'text-indigo-500'}`}>
                  (B)
                </div>
              </motion.button>
            </div>
          </div>
        );
      
      default:
        return <div>Unknown question type</div>;
    }
  };
  
  // Check if submit is enabled
  const isSubmitEnabled = () => {
    switch (question.type) {
      case 'set_clock':
        return true; // Always can submit
      case 'read_clock':
      case 'daily_routine':
      case 'days_before_after':
      case 'duration':
      case 'earlier_later':
        return store.selectedOption !== null;
      case 'sequence_events':
      case 'days_order':
        return store.placedItems.every(item => item !== null);
      default:
        return false;
    }
  };
  
  // Get background gradient based on question type
  const getBackgroundGradient = () => {
    switch (question.type) {
      case 'set_clock':
      case 'read_clock':
        return 'from-blue-400 via-indigo-500 to-purple-500';
      case 'daily_routine':
        return 'from-orange-400 via-pink-500 to-purple-500';
      case 'sequence_events':
        return 'from-green-400 via-teal-500 to-blue-500';
      case 'days_order':
      case 'days_before_after':
        return 'from-cyan-400 via-blue-500 to-indigo-500';
      case 'duration':
        return 'from-yellow-400 via-orange-500 to-red-500';
      case 'earlier_later':
        return 'from-pink-400 via-purple-500 to-indigo-500';
      default:
        return 'from-indigo-400 via-purple-500 to-pink-500';
    }
  };
  
  // ============================================
  // MAIN PLAYING UI
  // ============================================
  return (
    <div className={`min-h-screen w-full bg-gradient-to-br ${getBackgroundGradient()} flex flex-col`}>
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <CuckooMascot state="idle" />
          <div className="text-white">
            <div className="flex items-center gap-2">
              <span className="text-sm opacity-80">Round {store.currentRound}/{store.totalRounds}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                store.difficulty === 'easy' ? 'bg-green-400 text-green-900' :
                store.difficulty === 'medium' ? 'bg-yellow-400 text-yellow-900' :
                'bg-red-400 text-red-900'
              }`}>
                {store.difficulty === 'easy' ? '🌱' : store.difficulty === 'medium' ? '🌟' : '🔥'}
              </span>
            </div>
            <div className="font-bold">Score: {store.score}/100</div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="flex-1 mx-4 max-w-xs">
          <div className="h-3 bg-white/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(store.currentRound / store.totalRounds) * 100}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Question Card */}
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          key={store.currentRound}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/95 backdrop-blur rounded-3xl p-6 shadow-2xl max-w-md w-full"
        >
          {/* Question prompt */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              🐦 Cuckoo asks:
            </h2>
            <p className="text-lg text-indigo-600 font-semibold">
              {question.prompt}
            </p>
          </div>
          
          {/* Question content */}
          {renderQuestionContent()}
          
          {/* Action buttons */}
          <div className="flex gap-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => store.skipQuestion()}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-full transition flex items-center justify-center gap-2"
            >
              <SkipForward size={18} />
              Skip
            </motion.button>
            
            <motion.button
              whileHover={{ scale: isSubmitEnabled() ? 1.05 : 1 }}
              whileTap={{ scale: isSubmitEnabled() ? 0.95 : 1 }}
              onClick={() => isSubmitEnabled() && store.submitAnswer()}
              disabled={!isSubmitEnabled()}
              className={`flex-1 font-bold py-3 px-4 rounded-full transition flex items-center justify-center gap-2 ${
                isSubmitEnabled()
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Check size={18} />
              Check Answer
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TickTockGame;
