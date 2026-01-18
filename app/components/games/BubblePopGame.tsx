'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useBubblePopStore } from '@/app/store/useBubblePopStore';
import BubblePopCanvas from './BubblePopCanvas';
import { submitTelemetry } from '@/app/utils/gameUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Sparkles, Trophy, Target, Home, Star } from 'lucide-react';

// ============================================
// SIMPLE BUBBLE POP GAME FOR CLASS 1 KIDS
// No phases, no check button - just pop until you hit the target!
// ============================================

export default function BubblePopGame() {
  const store = useBubblePopStore();
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 500 });
  const [showOops, setShowOops] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [levelPoints, setLevelPoints] = useState(10);
  const celebrationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Reset wrong attempts when level changes
  useEffect(() => {
    setWrongAttempts(0);
    setLevelPoints(10);
    setShowOops(false);
  }, [store.currentLevel, store.startingBubbles]);

  // Check for win condition: remaining bubbles == target
  useEffect(() => {
    if (store.gamePhase === 'playing' && store.remainingCount === store.targetRemaining) {
      // Player wins! Trigger celebration
      store.checkPops(); // This will set gamePhase to 'success'
    }
  }, [store.remainingCount, store.targetRemaining, store.gamePhase, store]);

  // Check for over-pop condition
  useEffect(() => {
    if (store.gamePhase === 'playing' && store.remainingCount < store.targetRemaining) {
      // Player popped too many! Auto-undo
      setShowOops(true);
      setWrongAttempts(prev => prev + 1);
      setLevelPoints(prev => Math.max(0, prev - 2));
      
      // Auto-undo after a short delay
      const timeout = setTimeout(() => {
        store.undoPop();
        setShowOops(false);
      }, 800);
      
      return () => clearTimeout(timeout);
    }
  }, [store.remainingCount, store.targetRemaining, store.gamePhase, store]);

  // Auto-advance after celebration
  useEffect(() => {
    if (store.gamePhase === 'success' || store.gamePhase === 'celebrating') {
      if (!store.celebrationStarted) {
        store.setCelebrationStarted();
        const telemetry = store.getTelemetryLog();
        submitTelemetry(telemetry);
      }
      
      // Auto-advance after 2.5 seconds
      celebrationTimeoutRef.current = setTimeout(() => {
        if (store.roundsCompleted < store.totalRoundsPerSession) {
          store.nextLevel();
        }
      }, 2500);
      
      return () => {
        if (celebrationTimeoutRef.current) {
          clearTimeout(celebrationTimeoutRef.current);
        }
      };
    }
  }, [store.gamePhase, store.celebrationStarted, store]);

  // Handle bubble pop with sound placeholder
  const handlePopBubble = useCallback((bubbleId: string) => {
    // Sound effect placeholder - you can add actual audio here
    // const popSound = new Audio('/sounds/pop.mp3');
    // popSound.play();
    
    store.popBubble(bubbleId);
  }, [store]);

  // ============================================
  // MENU STATE - Fun difficulty selection
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
            {/* Header with bouncing bubble */}
            <div className="text-center mb-8">
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="text-8xl mb-4"
              >
                🫧
              </motion.div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 bg-clip-text text-transparent mb-2">
                Bubble Pop Fun!
              </h1>
              <p className="text-gray-600 text-xl">Pop bubbles & learn to subtract! 🎉</p>
            </div>

            {/* Cute Puppy Story Box */}
            <div className="bg-gradient-to-r from-cyan-100 to-teal-100 rounded-2xl p-6 mb-6 border-l-4 border-cyan-500">
              <div className="flex items-start gap-4">
                <motion.span 
                  className="text-5xl"
                  animate={{ rotate: [-5, 5, -5] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  🐕
                </motion.span>
                <div>
                  <h2 className="text-cyan-700 font-bold text-lg mb-2">
                    Meet Bubbles the Puppy! 🎈
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Bubbles has <strong>too many bubbles</strong> in his garden! 
                    Help him pop some bubbles until only the right number remain!
                  </p>
                </div>
              </div>
            </div>

            {/* Simple How to Play */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-6">
              <h2 className="text-purple-700 font-bold text-xl mb-4 flex items-center gap-2">
                🎮 How to Play
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 text-lg font-bold">1</span>
                  <span className="text-gray-700 text-lg">See how many bubbles need to <strong>stay</strong></span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="bg-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 text-lg font-bold">2</span>
                  <span className="text-gray-700 text-lg"><strong>Tap bubbles</strong> to pop them! 🫧💥</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 text-lg font-bold">3</span>
                  <span className="text-gray-700 text-lg">When the right number is left, <strong>you win!</strong> 🎉</span>
                </div>
              </div>
            </div>

            {/* Difficulty Selection */}
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 mb-6">
              <h2 className="text-orange-700 font-bold text-xl mb-4 flex items-center gap-2">
                <Target size={24} />
                Pick Your Level
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {/* Easy */}
                <motion.button
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => store.startGame('easy')}
                  className="bg-gradient-to-br from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white rounded-2xl p-5 shadow-lg transition border-4 border-green-300"
                >
                  <div className="text-4xl mb-2">🌱</div>
                  <div className="font-bold text-xl">Easy</div>
                  <div className="text-sm opacity-90 mt-1">10-20 bubbles</div>
                </motion.button>

                {/* Medium */}
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => store.startGame('medium')}
                  className="bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-2xl p-5 shadow-lg transition border-4 border-yellow-300"
                >
                  <div className="text-4xl mb-2">🌟</div>
                  <div className="font-bold text-xl">Medium</div>
                  <div className="text-sm opacity-90 mt-1">20-40 bubbles</div>
                </motion.button>

                {/* Hard */}
                <motion.button
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => store.startGame('hard')}
                  className="bg-gradient-to-br from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white rounded-2xl p-5 shadow-lg transition border-4 border-red-300"
                >
                  <div className="text-4xl mb-2">🔥</div>
                  <div className="font-bold text-xl">Hard</div>
                  <div className="text-sm opacity-90 mt-1">40-60 bubbles</div>
                </motion.button>
              </div>
            </div>

            {/* Big Start Button */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: ["0 0 0 0 rgba(34, 211, 238, 0.4)", "0 0 0 20px rgba(34, 211, 238, 0)", "0 0 0 0 rgba(34, 211, 238, 0.4)"]
                }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                onClick={() => store.startGame('easy')}
                className="bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-600 hover:via-teal-600 hover:to-emerald-600 text-white font-bold py-5 px-16 rounded-full text-2xl shadow-xl transition flex items-center gap-3"
              >
                <Sparkles size={28} />
                Let's Play! 🎮
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ============================================
  // PLAYING STATE - Simple pop-until-target gameplay
  // ============================================
  if (store.gamePhase === 'playing' || store.gamePhase === 'thinking') {
    const bubblesLeft = store.remainingCount;
    const goal = store.targetRemaining;
    const needToPop = bubblesLeft - goal;

    const difficultyColors = {
      easy: 'from-green-400 to-emerald-500',
      medium: 'from-yellow-400 to-orange-500',
      hard: 'from-red-400 to-pink-500',
    };

    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-cyan-400 via-teal-500 to-emerald-600 p-4">
        <div className="max-w-5xl mx-auto">
          
          {/* Top Header Bar */}
          <div className="flex justify-between items-center mb-4">
            {/* Left side - Title and Round */}
            <div className="flex items-center gap-4">
              <motion.span 
                className="text-4xl"
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              >
                🐕
              </motion.span>
              <div>
                <h1 className="text-2xl font-bold text-white">Help Bubbles!</h1>
                <div className="text-white/80 text-sm">
                  Round {store.roundsCompleted + 1} of {store.totalRoundsPerSession}
                </div>
              </div>
            </div>
            
            {/* Right side - Score and Menu */}
            <div className="flex items-center gap-3">
              <div className="bg-yellow-400 px-5 py-2 rounded-full text-yellow-900 font-bold flex items-center gap-2 text-lg">
                <Trophy size={20} />
                {store.score} pts
              </div>
              <button
                onClick={() => store.resetGame()}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition flex items-center gap-2"
              >
                <Home size={20} />
                Menu
              </button>
            </div>
          </div>

          {/* Main Instruction Card - BIG and CLEAR */}
          <motion.div 
            className="bg-white rounded-2xl p-5 mb-4 shadow-xl border-4 border-pink-300"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Left - The Goal */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-gray-500 text-sm font-medium">Bubbles Left</div>
                  <motion.div 
                    key={bubblesLeft}
                    initial={{ scale: 1.3 }}
                    animate={{ scale: 1 }}
                    className="text-5xl font-bold text-blue-600"
                  >
                    {bubblesLeft}
                  </motion.div>
                </div>
                
                <div className="text-4xl text-gray-300">→</div>
                
                <div className="text-center">
                  <div className="text-gray-500 text-sm font-medium">Goal</div>
                  <div className="text-5xl font-bold text-green-600">{goal}</div>
                </div>
              </div>

              {/* Center - The Action */}
              <div className="flex-1 text-center px-4">
                <motion.div 
                  className={`inline-block px-6 py-3 rounded-2xl text-xl font-bold ${
                    needToPop > 0 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                      : 'bg-green-500 text-white'
                  }`}
                  animate={needToPop > 0 ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  {needToPop > 0 ? (
                    <>🫧 Pop {needToPop} more bubble{needToPop !== 1 ? 's' : ''}!</>
                  ) : (
                    <>✨ Perfect! Just right!</>
                  )}
                </motion.div>
              </div>

              {/* Right - Points info */}
              <div className="text-center">
                <div className="text-gray-500 text-sm font-medium">Points this round</div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={24}
                      className={i < Math.ceil(levelPoints / 2) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                {wrongAttempts > 0 && (
                  <div className="text-orange-500 text-xs mt-1">
                    -{wrongAttempts * 2} for oops
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Oops Overlay */}
          <AnimatePresence>
            {showOops && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
              >
                <div className="bg-orange-500 text-white px-12 py-8 rounded-3xl shadow-2xl text-center border-4 border-orange-300">
                  <motion.div 
                    className="text-6xl mb-3"
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    🙈
                  </motion.div>
                  <div className="text-3xl font-bold">Oops! Too many!</div>
                  <div className="text-xl mt-2">Bringing one back... 🫧</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Game Canvas */}
          <div 
            id="bubble-game-container" 
            className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-teal-300"
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
              gamePhase={store.gamePhase as 'menu' | 'playing' | 'success' | 'overpop' | 'celebrating'}
              onPopBubble={handlePopBubble}
            />
          </div>

          {/* Bottom Helper Text */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-6 py-3 rounded-full text-white text-lg">
              <span className="text-2xl">👆</span>
              Tap the bubbles to pop them!
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // SUCCESS / CELEBRATING STATE - Auto-advance
  // ============================================
  if (store.gamePhase === 'success' || store.gamePhase === 'celebrating') {
    const isSessionComplete = store.roundsCompleted >= store.totalRoundsPerSession;
    const earnedPoints = Math.max(0, 10 - (wrongAttempts * 2));

    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex items-center justify-center p-4 overflow-hidden">
        {/* Floating celebration bubbles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl pointer-events-none"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800), 
              y: (typeof window !== 'undefined' ? window.innerHeight : 600) + 50,
              rotate: 0
            }}
            animate={{ 
              y: -100,
              rotate: 360,
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800)
            }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          >
            {['🫧', '⭐', '🎉', '✨', '🎈'][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="max-w-lg w-full relative z-10"
        >
          <div className="bg-white rounded-3xl p-8 shadow-2xl text-center border-4 border-yellow-400">
            {/* Dancing Puppy */}
            <motion.div
              animate={{ 
                rotate: [-10, 10, -10],
                y: [0, -20, 0]
              }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="text-8xl mb-4"
            >
              🐕
            </motion.div>

            <motion.h1 
              className="text-5xl font-bold text-emerald-600 mb-3"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              {isSessionComplete ? '🏆 Amazing Job! 🏆' : 'Yay! Perfect! 🎉'}
            </motion.h1>
            
            <p className="text-gray-600 text-xl mb-6">
              {isSessionComplete 
                ? 'You finished all the rounds!' 
                : 'Bubbles the puppy is so happy!'}
            </p>

            {/* Stats Card */}
            <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">{store.startingBubbles}</div>
                  <div className="text-sm text-gray-500">Started</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-pink-600">{store.poppedCount}</div>
                  <div className="text-sm text-gray-500">Popped</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600">{store.targetRemaining}</div>
                  <div className="text-sm text-gray-500">Left</div>
                </div>
              </div>
              
              {/* Math equation */}
              <div className="bg-white rounded-xl p-4 text-2xl font-bold text-gray-800">
                {store.startingBubbles} - {store.poppedCount} = {store.targetRemaining} ✓
              </div>
            </div>

            {/* Points Earned */}
            <motion.div 
              className="bg-yellow-400 rounded-xl py-4 px-8 inline-block mb-6"
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 0.3 }}
            >
              <div className="text-yellow-900 font-bold text-2xl flex items-center gap-2">
                <Trophy size={28} />
                +{earnedPoints} points!
              </div>
            </motion.div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>Progress</span>
                <span>{store.roundsCompleted}/{store.totalRoundsPerSession} rounds</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(store.roundsCompleted / store.totalRoundsPerSession) * 100}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              {!isSessionComplete ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (celebrationTimeoutRef.current) {
                        clearTimeout(celebrationTimeoutRef.current);
                      }
                      store.nextLevel();
                    }}
                    className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-4 px-10 rounded-full shadow-lg transition flex items-center gap-2 text-xl"
                  >
                    Next Level →
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => store.resetGame()}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-10 rounded-full shadow-lg transition flex items-center gap-2 text-xl"
                >
                  <Trophy size={24} />
                  Play Again!
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (celebrationTimeoutRef.current) {
                    clearTimeout(celebrationTimeoutRef.current);
                  }
                  store.resetGame();
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 px-6 rounded-full transition flex items-center gap-2"
              >
                <Home size={20} />
                Menu
              </motion.button>
            </div>

            {/* Total Score */}
            <div className="mt-6 text-gray-500 text-lg">
              Total Score: <span className="font-bold text-emerald-600">{store.score}</span> points
            </div>

            {/* Auto-advance notice */}
            {!isSessionComplete && (
              <motion.div 
                className="mt-4 text-sm text-gray-400"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                Next round starting soon... ⏳
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // ============================================
  // WRONG ANSWER / WRONG POPS - Redirect to playing
  // (These states shouldn't occur with new logic, but handle gracefully)
  // ============================================
  if (store.gamePhase === 'wrong_answer' || store.gamePhase === 'wrong_pops') {
    // In the new simplified flow, we don't need these states
    // Just redirect back to playing
    store.retryPopping?.();
    return null;
  }

  // Fallback
  return null;
}
