'use client';

import React, { useEffect, useState } from 'react';
import { useBalloonBlastoffStore } from '@/app/store/useBalloonBlastoffStore';
import BalloonBlastoffCanvas from './BalloonBlastoffCanvas';
import { submitTelemetry } from '@/app/utils/gameUtils';
import { motion } from 'framer-motion';
import { RotateCcw, Sparkles, Trophy, Target, Lightbulb } from 'lucide-react';

// ============================================
// MAIN GAME COMPONENT
// ============================================

export default function BalloonBlastoffGame() {
  const store = useBalloonBlastoffStore();
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [showHint, setShowHint] = useState(false);

  // Handle responsive canvas
  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById('balloon-game-container');
      if (container) {
        const maxWidth = Math.min(container.clientWidth - 40, 800);
        const height = maxWidth * 0.75;
        setCanvasSize({ width: maxWidth, height });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Submit telemetry on celebration
  useEffect(() => {
    if (store.gamePhase === 'celebrating' && store.celebrationStarted) {
      const telemetry = store.getTelemetryLog();
      submitTelemetry(telemetry);
    }
  }, [store.gamePhase, store.celebrationStarted, store]);

  // Generate hint
  const getHint = (): string => {
    const remaining = store.targetSum - store.currentSum;
    
    if (remaining === 0) {
      return "🎉 Perfect! Your basket is ready to fly!";
    }
    
    if (remaining < 0) {
      return `⚠️ Your sum is ${Math.abs(remaining)} too big! Remove a balloon.`;
    }
    
    const helpfulBalloon = store.availableBalloons.find(
      (b) => b.value <= remaining
    );
    
    if (helpfulBalloon) {
      return `💡 You need ${remaining} more. Look for a balloon with ${remaining} or less!`;
    }
    
    return `🤔 You need ${remaining} more to reach ${store.targetSum}!`;
  };

  // ============================================
  // MENU STATE
  // ============================================
  if (store.gamePhase === 'menu') {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full"
        >
          <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl border-4 border-yellow-400">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-7xl mb-4"
              >
                🎈
              </motion.div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent mb-2">
                Balloon Blastoff!
              </h1>
              <p className="text-gray-600 text-lg">Learn Addition Through Fun!</p>
            </div>

            {/* Story Box */}
            <div className="bg-gradient-to-r from-sky-100 to-blue-100 rounded-2xl p-6 mb-6 border-l-4 border-sky-500">
              <h2 className="text-sky-700 font-bold text-lg mb-3 flex items-center gap-2">
                📖 The Story
              </h2>
              <p className="text-gray-700 leading-relaxed">
                A cute bunny wants to fly up to the clouds! Help the bunny by attaching 
                the right balloons to the basket. The numbers on the balloons must 
                <strong className="text-sky-600"> add up to the target number</strong> to make the basket fly!
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
                  <span className="text-gray-700">Add numbers from <strong>1 to 100</strong></span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-500 font-bold text-xl">✓</span>
                  <span className="text-gray-700">Find <strong>different ways</strong> to make the same sum</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-500 font-bold text-xl">✓</span>
                  <span className="text-gray-700">Use <strong>mental math</strong> to solve problems</span>
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
                  <span className="text-gray-700">Look at the <strong>Target Number</strong> at the top</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 text-sm font-bold">2</span>
                  <span className="text-gray-700"><strong>Drag balloons</strong> from the shop to the basket</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 text-sm font-bold">3</span>
                  <span className="text-gray-700">Make the balloon numbers <strong>add up to the target</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 text-sm font-bold">4</span>
                  <span className="text-gray-700">Watch the bunny <strong>fly to the clouds!</strong> 🎉</span>
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
                  <div className="text-xs opacity-90 mt-1">Sums 5-20</div>
                  <div className="text-xs opacity-75">2 balloons needed</div>
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
                  <div className="text-xs opacity-90 mt-1">Sums 15-50</div>
                  <div className="text-xs opacity-75">2-3 balloons needed</div>
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
                  <div className="text-xs opacity-90 mt-1">Sums 40-100</div>
                  <div className="text-xs opacity-75">3-4 balloons needed</div>
                </motion.button>
              </div>
            </div>

            {/* Quick Start Button */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => store.startGame('easy')}
                className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 text-white font-bold py-4 px-12 rounded-full text-xl shadow-lg transition flex items-center gap-3"
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
  // PLAYING STATE
  // ============================================
  if (store.gamePhase === 'playing' || store.gamePhase === 'floating') {
    // Difficulty badge colors
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

    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 p-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                🎈 Balloon Blastoff
              </h1>
              <div className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 ${difficultyColors[store.difficulty]}`}>
                {difficultyEmojis[store.difficulty]} {store.difficulty.charAt(0).toUpperCase() + store.difficulty.slice(1)}
              </div>
              <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white">
                Level {store.currentLevel}
              </div>
              <div className="bg-blue-400 px-4 py-2 rounded-full text-white font-medium">
                Round {store.roundsCompleted + 1}/{store.totalRoundsPerSession}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Score */}
              <div className="bg-yellow-400 px-4 py-2 rounded-full text-yellow-900 font-bold flex items-center gap-2">
                <Trophy size={18} />
                {store.score}/100
              </div>
              
              {/* Hint Button */}
              <button
                onClick={() => setShowHint(!showHint)}
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

          {/* Hint Display */}
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-purple-100 border-2 border-purple-300 rounded-xl p-4 mb-4 text-purple-800 font-medium"
            >
              {getHint()}
            </motion.div>
          )}

          {/* Game Canvas */}
          <div 
            id="balloon-game-container" 
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <BalloonBlastoffCanvas
              width={canvasSize.width}
              height={canvasSize.height}
              targetSum={store.targetSum}
              currentSum={store.currentSum}
              availableBalloons={store.availableBalloons}
              attachedBalloons={store.attachedBalloons}
              gamePhase={store.gamePhase}
              onAttachBalloon={store.attachBalloon}
              onDetachBalloon={store.detachBalloon}
            />
          </div>

          {/* Bottom Stats */}
          <div className="mt-4 flex justify-center gap-8">
            <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-xl text-white text-center">
              <div className="text-sm opacity-80">Difficulty</div>
              <div className="font-bold capitalize">{store.difficulty}</div>
            </div>
            <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-xl text-white text-center">
              <div className="text-sm opacity-80">Balloons Used</div>
              <div className="font-bold">{store.attachedBalloons.length}</div>
            </div>
            <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-xl text-white text-center">
              <div className="text-sm opacity-80">Current Sum</div>
              <div className="font-bold text-xl">{store.currentSum} / {store.targetSum}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // SUCCESS / CELEBRATING STATE
  // ============================================
  if (store.gamePhase === 'success' || store.gamePhase === 'celebrating') {
    const isSessionComplete = store.roundsCompleted >= store.totalRoundsPerSession;
    const nextScore = Math.min(100, store.score + 5);

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
              {isSessionComplete ? 'Session Complete!' : 'Level Complete!'}
            </h1>
            
            <p className="text-gray-600 text-lg mb-6">
              {isSessionComplete ? 'You finished all 20 rounds!' : 'The bunny reached the clouds!'}
            </p>

            {/* Stats */}
            <div className="bg-emerald-50 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">
                    {store.targetSum}
                  </div>
                  <div className="text-sm text-gray-500">Target Sum</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">
                    {store.attachedBalloons.length}
                  </div>
                  <div className="text-sm text-gray-500">Balloons Used</div>
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
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <div className="text-sm text-gray-500 mb-2">Your Addition:</div>
              <div className="text-2xl font-bold text-blue-600">
                {store.attachedBalloons.map((b) => b.value).join(' + ')} = {store.targetSum}
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
