'use client';

import React, { useEffect, useState } from 'react';
import { useBubblePopStore } from '@/app/store/useBubblePopStore';
import BubblePopCanvas from './BubblePopCanvas';
import { submitTelemetry } from '@/app/utils/gameUtils';
import { motion } from 'framer-motion';
import { RotateCcw, Sparkles, Trophy, Target, Lightbulb, Undo2, CheckCircle } from 'lucide-react';

// ============================================
// MAIN GAME COMPONENT
// ============================================

export default function BubblePopGame() {
  const store = useBubblePopStore();
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 500 });
  const [showHint, setShowHint] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);

  // Handle responsive canvas
  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById('bubble-game-container');
      if (container) {
        const maxWidth = Math.min(container.clientWidth - 40, 800);
        const height = maxWidth * 0.625;
        setCanvasSize({ width: maxWidth, height });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Submit telemetry on success
  useEffect(() => {
    if (store.gamePhase === 'success' && !store.celebrationStarted) {
      store.setCelebrationStarted();
      const telemetry = store.getTelemetryLog();
      submitTelemetry(telemetry);
    }
  }, [store.gamePhase, store.celebrationStarted, store]);

  // Reset hint when level changes
  useEffect(() => {
    setShowHint(false);
    setHintLevel(0);
  }, [store.currentLevel]);

  // Generate hints for thinking phase
  const getThinkingHint = (): string => {
    const { startingBubbles, targetRemaining, bubblesToPop } = store;
    
    if (hintLevel === 0) {
      return `💡 Think: What number do you subtract from ${startingBubbles} to get ${targetRemaining}?`;
    } else if (hintLevel === 1) {
      return `🤔 ${startingBubbles} - ? = ${targetRemaining}. Count backwards from ${startingBubbles} to ${targetRemaining}!`;
    } else {
      return `✨ The answer is ${bubblesToPop}! (${startingBubbles} - ${bubblesToPop} = ${targetRemaining})`;
    }
  };

  // Generate hints for popping phase
  const getPoppingHint = (): string => {
    const { studentAnswer, poppedCount } = store;
    const remaining = (studentAnswer || 0) - poppedCount;
    
    if (remaining > 0) {
      return `🫧 You said you'd pop ${studentAnswer} bubbles. You've popped ${poppedCount}. Pop ${remaining} more!`;
    } else if (remaining === 0) {
      return `✅ You've popped ${poppedCount} bubbles. Click "Check Answer" to verify!`;
    } else {
      return `⚠️ You've popped ${poppedCount} but said ${studentAnswer}. Use Undo to fix it!`;
    }
  };

  const handleUseHint = () => {
    if (!showHint) {
      setShowHint(true);
      store.useHint();
    } else {
      setHintLevel((prev) => Math.min(prev + 1, 2));
      if (hintLevel < 2) {
        store.useHint();
      }
    }
  };

  // ============================================
  // MENU STATE
  // ============================================
  if (store.gamePhase === 'menu') {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-cyan-400 via-teal-500 to-emerald-600 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full"
        >
          <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl border-4 border-pink-400">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-7xl mb-4"
              >
                🫧
              </motion.div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 bg-clip-text text-transparent mb-2">
                Bubble Pop Countdown!
              </h1>
              <p className="text-gray-600 text-lg">Learn Subtraction Through Fun!</p>
            </div>

            {/* Story Box */}
            <div className="bg-gradient-to-r from-cyan-100 to-teal-100 rounded-2xl p-6 mb-6 border-l-4 border-cyan-500">
              <h2 className="text-cyan-700 font-bold text-lg mb-3 flex items-center gap-2">
                📖 The Story
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to the Magic Bubble Garden! Bubbles the puppy has <strong>too many bubbles</strong>! 
                First <strong className="text-purple-600">THINK</strong> about how many to pop, 
                then <strong className="text-teal-600">POP</strong> that exact number! 🐕
              </p>
            </div>

            {/* Learning Goals */}
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 mb-6">
              <h2 className="text-emerald-700 font-bold text-lg mb-4 flex items-center gap-2">
                <Target size={20} />
                What You'll Learn
              </h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="text-emerald-500 font-bold text-xl">✓</span>
                  <span className="text-gray-700">Subtract numbers from <strong>1 to 100</strong></span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-500 font-bold text-xl">✓</span>
                  <span className="text-gray-700"><strong>Think first</strong>, then verify with action</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-500 font-bold text-xl">✓</span>
                  <span className="text-gray-700">Solve: <strong>X - ? = Y</strong></span>
                </li>
              </ul>
            </div>

            {/* How to Play */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-6">
              <h2 className="text-purple-700 font-bold text-lg mb-4 flex items-center gap-2">
                🎮 How to Play
              </h2>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 text-sm font-bold">1</span>
                  <span className="text-gray-700"><strong>THINK:</strong> See the equation and choose your answer</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-teal-500 text-white rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 text-sm font-bold">2</span>
                  <span className="text-gray-700"><strong>POP:</strong> Tap bubbles to pop the number you chose</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-green-500 text-white rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 text-sm font-bold">3</span>
                  <span className="text-gray-700"><strong>CHECK:</strong> Click "Check Answer" to verify!</span>
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
                  <div className="text-xs opacity-90 mt-1">10-20 bubbles</div>
                  <div className="text-xs opacity-75">Pop 2-7</div>
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
                  <div className="text-xs opacity-90 mt-1">20-40 bubbles</div>
                  <div className="text-xs opacity-75">Pop 5-12</div>
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
                  <div className="text-xs opacity-90 mt-1">40-60 bubbles</div>
                  <div className="text-xs opacity-75">Pop 10-20</div>
                </motion.button>
              </div>
            </div>

            {/* Quick Start Button */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => store.startGame('easy')}
                className="bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-600 hover:via-teal-600 hover:to-emerald-600 text-white font-bold py-4 px-12 rounded-full text-xl shadow-lg transition flex items-center gap-3"
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
  // THINKING PHASE - Student must answer first!
  // ============================================
  if (store.gamePhase === 'thinking') {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-purple-400 via-pink-500 to-rose-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full"
        >
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full text-purple-700 font-bold mb-4">
                <span className="text-2xl">🧠</span> Step 1: THINK!
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                How many bubbles should you pop?
              </h2>
            </div>

            {/* Equation Display */}
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 mb-6 text-center border-2 border-yellow-300">
              <div className="text-lg text-gray-600 mb-2">Solve this:</div>
              <div className="text-4xl font-bold text-gray-800">
                <span className="text-blue-600">{store.startingBubbles}</span>
                <span className="mx-3">-</span>
                <span className="inline-block w-16 h-14 bg-white border-4 border-dashed border-purple-400 rounded-lg text-purple-500 leading-[3.2rem]">?</span>
                <span className="mx-3">=</span>
                <span className="text-green-600">{store.targetRemaining}</span>
              </div>
              <div className="text-sm text-gray-500 mt-3">
                You have {store.startingBubbles} bubbles. You need {store.targetRemaining} to remain.
              </div>
            </div>

            {/* Answer Options */}
            <div className="mb-6">
              <div className="text-center text-gray-600 mb-4 font-medium">
                Choose your answer:
              </div>
              <div className="grid grid-cols-2 gap-4">
                {store.answerOptions.map((option) => (
                  <motion.button
                    key={option}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => store.submitAnswer(option)}
                    className="bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-3xl font-bold py-6 rounded-2xl shadow-lg transition"
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Hint Button */}
            <div className="flex justify-center gap-4">
              <button
                onClick={handleUseHint}
                className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-6 py-3 rounded-full transition flex items-center gap-2"
              >
                <Lightbulb size={20} />
                Need a Hint?
              </button>
              
              <button
                onClick={() => store.resetGame()}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-6 py-3 rounded-full transition flex items-center gap-2"
              >
                <RotateCcw size={20} />
                Menu
              </button>
            </div>

            {/* Hint Display */}
            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-purple-50 border-2 border-purple-200 rounded-xl p-4 text-purple-700"
              >
                {getThinkingHint()}
              </motion.div>
            )}

            {/* Level Info */}
            <div className="mt-6 flex justify-center gap-4 text-sm text-gray-500">
              <span>Round {store.roundsCompleted + 1}/{store.totalRoundsPerSession}</span>
              <span>•</span>
              <span className="capitalize">{store.difficulty}</span>
              <span>•</span>
              <span>Score: {store.score}/100</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ============================================
  // WRONG ANSWER STATE
  // ============================================
  if (store.gamePhase === 'wrong_answer') {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-red-400 via-orange-500 to-yellow-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <div className="bg-white rounded-3xl p-8 shadow-2xl text-center">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
              className="text-7xl mb-4"
            >
              🤔
            </motion.div>
            
            <h2 className="text-2xl font-bold text-orange-600 mb-2">
              Not quite right!
            </h2>
            
            <p className="text-gray-700 mb-6">
              You said <strong className="text-red-600">{store.studentAnswer}</strong>, but that's not the answer to:
            </p>
            
            <div className="bg-yellow-100 rounded-xl p-4 mb-6 text-2xl font-bold text-gray-900 border-2 border-yellow-400">
              {store.startingBubbles} - ? = {store.targetRemaining}
            </div>
            
            <p className="text-gray-700 mb-6">
              💡 Hint: Count backwards from {store.startingBubbles} to {store.targetRemaining}
            </p>
            
            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => store.retryThinking()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transition flex items-center gap-2"
              >
                <RotateCcw size={20} />
                Try Again!
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => store.skipToNext()}
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition flex items-center gap-2"
              >
                Next →
              </motion.button>
            </div>
            
            <div className="mt-4 text-sm text-gray-400">
              Correct answer: <strong className="text-green-600">{store.bubblesToPop}</strong>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ============================================
  // PLAYING / POPPING PHASE
  // ============================================
  if (store.gamePhase === 'playing') {
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

    const popsRemaining = (store.studentAnswer || 0) - store.poppedCount;

    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-cyan-400 via-teal-500 to-emerald-600 p-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                🫧 Step 2: POP!
              </h1>
              <div className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 ${difficultyColors[store.difficulty]}`}>
                {difficultyEmojis[store.difficulty]} {store.difficulty.charAt(0).toUpperCase() + store.difficulty.slice(1)}
              </div>
              <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white">
                Round {store.roundsCompleted + 1}/{store.totalRoundsPerSession}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Score */}
              <div className="bg-yellow-400 px-4 py-2 rounded-full text-yellow-900 font-bold flex items-center gap-2">
                <Trophy size={18} />
                {store.score}/100
              </div>
              
              {/* Undo Button */}
              <button
                onClick={() => store.undoPop()}
                disabled={store.undoStack.length === 0}
                className={`px-4 py-2 rounded-full transition flex items-center gap-2 ${
                  store.undoStack.length > 0 
                    ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                <Undo2 size={18} />
                Undo ({store.undoStack.length})
              </button>
              
              {/* Hint Button */}
              <button
                onClick={handleUseHint}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full transition flex items-center gap-2"
              >
                <Lightbulb size={18} />
                Hint
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

          {/* Your Answer Reminder */}
          <div className="bg-purple-100 border-2 border-purple-300 rounded-xl p-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-purple-700 font-medium">
                📝 Your answer: Pop <strong className="text-2xl text-purple-600">{store.studentAnswer}</strong> bubbles
              </span>
              <span className="text-gray-500">|</span>
              <span className={`font-bold ${popsRemaining > 0 ? 'text-orange-600' : popsRemaining === 0 ? 'text-green-600' : 'text-red-600'}`}>
                {popsRemaining > 0 ? `${popsRemaining} more to go!` : popsRemaining === 0 ? '✓ Ready to check!' : `${Math.abs(popsRemaining)} too many!`}
              </span>
            </div>
            
            {/* Check Answer Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => store.checkPops()}
              className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg transition ${
                popsRemaining === 0 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-gray-300 text-gray-500'
              }`}
            >
              <CheckCircle size={20} />
              Check Answer
            </motion.button>
          </div>

          {/* Hint Display */}
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-purple-100 border-2 border-purple-300 rounded-xl p-4 mb-4 font-medium text-purple-800"
            >
              {getPoppingHint()}
            </motion.div>
          )}

          {/* Game Canvas */}
          <div 
            id="bubble-game-container" 
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <BubblePopCanvas
              width={canvasSize.width}
              height={canvasSize.height}
              startingBubbles={store.startingBubbles}
              targetRemaining={store.targetRemaining}
              bubblesToPop={store.bubblesToPop}
              bubbles={store.bubbles}
              poppedCount={store.poppedCount}
              remainingCount={store.remainingCount}
              gamePhase={store.gamePhase}
              onPopBubble={store.popBubble}
            />
          </div>

          {/* Bottom Stats */}
          <div className="mt-4 flex justify-center gap-8">
            <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-xl text-white text-center">
              <div className="text-sm opacity-80">Your Answer</div>
              <div className="font-bold text-xl">{store.studentAnswer}</div>
            </div>
            <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-xl text-white text-center">
              <div className="text-sm opacity-80">Popped</div>
              <div className="font-bold text-xl">{store.poppedCount}</div>
            </div>
            <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-xl text-white text-center">
              <div className="text-sm opacity-80">Remaining</div>
              <div className="font-bold text-xl">{store.remainingCount}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // WRONG POPS STATE
  // ============================================
  if (store.gamePhase === 'wrong_pops') {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <div className="bg-white rounded-3xl p-8 shadow-2xl text-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="text-7xl mb-4"
            >
              🫧
            </motion.div>
            
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              Oops! Count doesn't match!
            </h2>
            
            <div className="bg-orange-100 rounded-xl p-4 mb-6 space-y-2 border-2 border-orange-300">
              <p className="text-gray-700">
                You said you'd pop: <strong className="text-purple-700 text-xl">{store.studentAnswer}</strong>
              </p>
              <p className="text-gray-700">
                You actually popped: <strong className="text-orange-700 text-xl">{store.poppedCount}</strong>
              </p>
              <p className="text-gray-700">
                Correct answer was: <strong className="text-green-700 text-xl">{store.bubblesToPop}</strong>
              </p>
            </div>
            
            <div className="bg-yellow-100 rounded-xl p-4 mb-6 text-xl font-bold text-gray-900 border-2 border-yellow-400">
              {store.startingBubbles} - {store.bubblesToPop} = {store.targetRemaining}
            </div>
            
            <div className="flex gap-4 justify-center flex-wrap">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => store.retryPopping()}
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition flex items-center gap-2"
              >
                <RotateCcw size={18} />
                Try Popping Again
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => store.retryThinking()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition flex items-center gap-2"
              >
                Start Over
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => store.skipToNext()}
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition flex items-center gap-2"
              >
                Next →
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ============================================
  // SUCCESS / CELEBRATING STATE
  // ============================================
  if (store.gamePhase === 'success' || store.gamePhase === 'celebrating') {
    const isSessionComplete = store.roundsCompleted >= store.totalRoundsPerSession;

    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full"
        >
          <div className="bg-white rounded-3xl p-8 shadow-2xl text-center">
            {/* Celebration Animation */}
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-8xl mb-6"
            >
              {isSessionComplete ? '🏆' : '🎉'}
            </motion.div>

            <h1 className="text-4xl font-bold text-emerald-600 mb-2">
              {isSessionComplete ? 'Session Complete!' : 'Perfect! You Did It!'}
            </h1>
            
            <p className="text-gray-600 text-lg mb-6">
              {isSessionComplete ? 'You finished all 20 rounds!' : 'You thought correctly AND popped correctly! 🧠✨'}
            </p>

            {/* Stats */}
            <div className="bg-emerald-50 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">
                    {store.startingBubbles}
                  </div>
                  <div className="text-sm text-gray-500">Started With</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">
                    {store.poppedCount}
                  </div>
                  <div className="text-sm text-gray-500">Bubbles Popped</div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-emerald-200">
                <div className="text-2xl font-bold text-yellow-600">
                  +5 points!
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Round {store.roundsCompleted}/{store.totalRoundsPerSession} complete
                </div>
              </div>
            </div>

            {/* Equation Display */}
            <div className="bg-yellow-50 rounded-xl p-4 mb-6">
              <div className="text-sm text-gray-500 mb-2">Your Subtraction:</div>
              <div className="text-2xl font-bold text-yellow-700">
                {store.startingBubbles} - {store.poppedCount} = {store.targetRemaining}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              {!isSessionComplete ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => store.nextLevel()}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition flex items-center gap-2"
                >
                  Next Level →
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => store.resetGame()}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition flex items-center gap-2"
                >
                  🏆 View Final Score
                </motion.button>
              )}
              
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

            {/* Total Score */}
            <div className="mt-6 text-gray-500">
              Score: <span className="font-bold text-emerald-600">{store.score}/100</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Fallback
  return null;
}
