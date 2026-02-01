'use client';

import React, { useState } from 'react';
import RopeCutterGame from './games/RopeCutter';
import LiquidLabGame from './games/LiquidLab';
import FractionBridgeGame from './games/FractionBridge';
import AngleArchitectGame from './games/AngleArchitectGame';
import SymmetryShieldGame from './games/SymmetryShieldGame';
import FactorFactoryGame from './games/FactorFactoryGame';
import CargoCaptainGame from './games/CargoCaptainGame';
import ShapeSafariGame from './games/ShapeSafariGame';
import NumberJungleGame from './games/NumberJungleGame';
import BalloonBlastoffGame from './games/BalloonBlastoffGame';
import BubblePopGame from './games/BubblePopGame';
import TickTockGame from './games/TickTockGame';
import MeasureIslandGame from './games/MeasureIslandGame';
import DataDetectiveGame from './games/DataDetectiveGame';
import PatternParadeGame from './games/PatternParadeGame';
import CoinKingdomGame from './games/CoinKingdomGame';
import NumberSnakeGame from './games/NumberSnakeGame';
import AdditionSnakeGame from './games/AdditionSnakeGame';
import SubtractionSnakeGame from './games/SubtractionSnakeGame';
import { RotateCcw } from 'lucide-react';

type GameType = 'home' | 'rope-cutter' | 'liquid-lab' | 'fraction-bridge' | 'angle-architect' | 'symmetry-shield' | 'factor-factory' | 'cargo-captain' | 'shape-safari' | 'number-jungle' | 'balloon-blastoff' | 'bubble-pop' | 'tick-tock' | 'measure-island' | 'data-detective' | 'pattern-parade' | 'coin-kingdom' | 'number-snake' | 'addition-snake' | 'subtraction-snake';

type SubjectType = 'mathematics' | 'english' | 'evs' | 'hindi' | 'gk';

const SUBJECTS = [
  { id: 'mathematics' as SubjectType, name: 'Mathematics', emoji: '🔢', color: 'from-blue-500 to-purple-600' },
  { id: 'english' as SubjectType, name: 'English', emoji: '📖', color: 'from-green-500 to-teal-600' },
  { id: 'evs' as SubjectType, name: 'EVS', emoji: '🌍', color: 'from-emerald-500 to-green-600' },
  { id: 'hindi' as SubjectType, name: 'Hindi', emoji: '🕉️', color: 'from-orange-500 to-red-600' },
  { id: 'gk' as SubjectType, name: 'GK', emoji: '🧠', color: 'from-purple-500 to-pink-600' },
];

const GameSelector: React.FC = () => {
  const [currentGame, setCurrentGame] = useState<GameType>('home');
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>('mathematics');

  if (currentGame !== 'home') {
    return (
      <div>
        {/* Back Button */}
        <button
          onClick={() => setCurrentGame('home')}
          className="fixed top-4 left-4 flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors z-50"
        >
          <RotateCcw size={18} />
          Back to Menu
        </button>

        {currentGame === 'rope-cutter' && <RopeCutterGame />}
        {currentGame === 'liquid-lab' && <LiquidLabGame />}
        {currentGame === 'fraction-bridge' && <FractionBridgeGame />}
        {currentGame === 'angle-architect' && <AngleArchitectGame />}
        {currentGame === 'symmetry-shield' && <SymmetryShieldGame />}
        {currentGame === 'factor-factory' && <FactorFactoryGame />}
        {currentGame === 'cargo-captain' && <CargoCaptainGame />}
        {currentGame === 'shape-safari' && <ShapeSafariGame />}
        {currentGame === 'number-jungle' && <NumberJungleGame />}
        {currentGame === 'balloon-blastoff' && <BalloonBlastoffGame />}
        {currentGame === 'bubble-pop' && <BubblePopGame />}
        {currentGame === 'tick-tock' && <TickTockGame />}
        {currentGame === 'measure-island' && <MeasureIslandGame />}
        {currentGame === 'data-detective' && <DataDetectiveGame />}
        {currentGame === 'pattern-parade' && <PatternParadeGame />}
        {currentGame === 'coin-kingdom' && <CoinKingdomGame />}
        {currentGame === 'number-snake' && <NumberSnakeGame />}
        {currentGame === 'addition-snake' && <AdditionSnakeGame />}
        {currentGame === 'subtraction-snake' && <SubtractionSnakeGame />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">🎮 Game Arena</h1>
          <p className="text-xl text-gray-100">
            Master CBSE Math Concepts Through Interactive Games
          </p>
        </div>

        {/* Game Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Rope Cutter Game Card */}
          <div
            onClick={() => setCurrentGame('rope-cutter')}
            className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all transform cursor-pointer group"
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-8 text-white">
              <div className="text-6xl mb-4">🪢</div>
              <h2 className="text-2xl font-bold mb-2">The Rope Cutter</h2>
              <p className="text-sm opacity-90">Learn Mixed Fractions</p>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">📚 Concept:</h3>
                <p className="text-gray-600 text-sm">Division of Mixed Fractions</p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">🎯 Problem:</h3>
                <p className="text-gray-600 text-sm">
                  "Cut a randomly-sized rope into equal pieces (12-20m, 4-6 pieces)."
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">💡 Task:</h3>
                <p className="text-gray-600 text-sm">
                  Make precise cuts at calculated intervals with ±0.2m tolerance.
                </p>
              </div>

              <div className="mb-4 p-3 bg-orange-100 rounded-lg border border-orange-300">
                <p className="text-xs text-orange-800 font-semibold">
                  🎲 Procedurally Generated: Different rope length every play!
                </p>
              </div>

              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors">
                Play Game →
              </button>
            </div>
          </div>

          {/* Liquid Lab Game Card */}
          <div
            onClick={() => setCurrentGame('liquid-lab')}
            className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all transform cursor-pointer group"
          >
            <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-8 text-white">
              <div className="text-6xl mb-4">🧪</div>
              <h2 className="text-2xl font-bold mb-2">Liquid Lab</h2>
              <p className="text-sm opacity-90">Master Fraction Subtraction</p>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">📚 Concept:</h3>
                <p className="text-gray-600 text-sm">Fraction Subtraction with Unlike Denominators</p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">🎯 Problem:</h3>
                <p className="text-gray-600 text-sm">
                  "Pour a random target volume from a randomly-filled beaker."
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">💡 Task:</h3>
                <p className="text-gray-600 text-sm">
                  Find equivalent fractions and pour precisely to match the target.
                </p>
              </div>

              <div className="mb-4 p-3 bg-pink-100 rounded-lg border border-pink-300">
                <p className="text-xs text-pink-800 font-semibold">
                  🎲 Procedurally Generated: 100+ unique fraction combinations!
                </p>
              </div>

              <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-lg transition-colors">
                Play Game →
              </button>
            </div>
          </div>

          {/* Fraction Bridge Game Card */}
          <div
            onClick={() => setCurrentGame('fraction-bridge')}
            className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all transform cursor-pointer group"
          >
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-8 text-white">
              <div className="text-6xl mb-4">🌉</div>
              <h2 className="text-2xl font-bold mb-2">The Fraction Bridge</h2>
              <p className="text-sm opacity-90">Master Fraction Ordering</p>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">📚 Concept:</h3>
                <p className="text-gray-600 text-sm">Ordering & Comparison of Fractions</p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">🎯 Problem:</h3>
                <p className="text-gray-600 text-sm">
                  "Arrange 5 randomly-generated fractions in descending order."
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">💡 Task:</h3>
                <p className="text-gray-600 text-sm">
                  Drag planks to build the bridge by ordering fractions (largest → smallest).
                </p>
              </div>

              <div className="mb-4 p-3 bg-cyan-100 rounded-lg border border-cyan-300">
                <p className="text-xs text-cyan-800 font-semibold">
                  🎲 Procedurally Generated: Thousands of unique challenges!
                </p>
              </div>

              <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 rounded-lg transition-colors">
                Play Game →
              </button>
            </div>
          </div>

          {/* Angle Architect Game Card */}
          <div
            onClick={() => setCurrentGame('angle-architect')}
            className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all transform cursor-pointer group"
          >
            <div className="bg-gradient-to-r from-indigo-400 to-purple-500 p-8 text-white">
              <div className="text-6xl mb-4">🌉</div>
              <h2 className="text-2xl font-bold mb-2">The Angle Architect</h2>
              <p className="text-sm opacity-90">Master Angles & Rotation</p>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">📚 Concept:</h3>
                <p className="text-gray-600 text-sm">Angles as Turns & Classification</p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">🎯 Problem:</h3>
                <p className="text-gray-600 text-sm">
                  "Rotate the bridge to connect floating platforms for citizens to cross."
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">💡 Task:</h3>
                <p className="text-gray-600 text-sm">
                  Drag to rotate the bridge to the target angle with ±5° tolerance.
                </p>
              </div>

              <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-lg transition-colors">
                Play Game →
              </button>
            </div>
          </div>

          {/* Symmetry Shield Game Card */}
          <div
            onClick={() => setCurrentGame('symmetry-shield')}
            className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all transform cursor-pointer group"
          >
            <div className="bg-gradient-to-r from-teal-400 to-cyan-500 p-8 text-white">
              <div className="text-6xl mb-4">🛡️</div>
              <h2 className="text-2xl font-bold mb-2">The Symmetry Shield</h2>
              <p className="text-sm opacity-90">Master Reflection & Patterns</p>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">📚 Concept:</h3>
                <p className="text-gray-600 text-sm">Reflection Symmetry & Pattern Completion</p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">🎯 Problem:</h3>
                <p className="text-gray-600 text-sm">
                  "Mirror the left side pattern on the right side to repair the starship's defense shield."
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">💡 Task:</h3>
                <p className="text-gray-600 text-sm">
                  Click cells on the right to match the left pattern perfectly using reflection symmetry.
                </p>
              </div>

              <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 rounded-lg transition-colors">
                Play Game →
              </button>
            </div>
          </div>

          {/* Factor Factory Game Card */}
          <div
            onClick={() => setCurrentGame('factor-factory')}
            className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all transform cursor-pointer group"
          >
            <div className="bg-gradient-to-r from-orange-400 to-amber-500 p-8 text-white">
              <div className="text-6xl mb-4">🏭</div>
              <h2 className="text-2xl font-bold mb-2">The Factor Factory</h2>
              <p className="text-sm opacity-90">Explore Rectangular Arrays</p>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">📚 Concept:</h3>
                <p className="text-gray-600 text-sm">Factors & Rectangular Arrays</p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">🎯 Problem:</h3>
                <p className="text-gray-600 text-sm">
                  "Find all factor pairs of randomly-selected composite numbers (12, 18, 24, 30...)."
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">💡 Task:</h3>
                <p className="text-gray-600 text-sm">
                  Drag across the grid to create rectangles and discover all factor pairs.
                </p>
              </div>

              <div className="mb-4 p-3 bg-amber-100 rounded-lg border border-amber-300">
                <p className="text-xs text-amber-800 font-semibold">
                  🎲 Procedurally Generated: 10 different composite numbers!
                </p>
              </div>

              <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition-colors">
                Play Game →
              </button>
            </div>
          </div>

          {/* Cargo Captain Game Card */}
          <div
            onClick={() => setCurrentGame('cargo-captain')}
            className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all transform cursor-pointer group"
          >
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-8 text-white">
              <div className="text-6xl mb-4">⛴️</div>
              <h2 className="text-2xl font-bold mb-2">The Cargo Captain</h2>
              <p className="text-sm opacity-90">Master Volume Calculation</p>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">📚 Concept:</h3>
                <p className="text-gray-600 text-sm">Volume Packing & 3D Estimation</p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">🎯 Problem:</h3>
                <p className="text-gray-600 text-sm">
                  "Captain! Estimate the container's volume, then pack crates layer by layer to verify."
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">💡 Task:</h3>
                <p className="text-gray-600 text-sm">
                  Guess the volume, then click cells in each layer to pack crates. Replicate layers to fill the height.
                </p>
              </div>

              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors">
                Play Game →
              </button>
            </div>
          </div>
        </div>

        {/* Class 1 Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-2">🌟 Class 1</h2>
            <p className="text-lg text-gray-200">Fun games for our youngest learners!</p>
          </div>

          {/* Subject Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {SUBJECTS.map((subject) => (
              <button
                key={subject.id}
                onClick={() => setSelectedSubject(subject.id)}
                className={`px-6 py-3 rounded-full font-bold text-lg transition-all transform hover:scale-105 ${
                  selectedSubject === subject.id
                    ? `bg-gradient-to-r ${subject.color} text-white shadow-lg scale-105`
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {subject.emoji} {subject.name}
              </button>
            ))}
          </div>

          {/* Mathematics Games */}
          {selectedSubject === 'mathematics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Shape Safari Game Card */}
            <div
              onClick={() => setCurrentGame('shape-safari')}
              className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all transform cursor-pointer group"
            >
              <div className="bg-gradient-to-r from-pink-400 to-purple-500 p-8 text-white">
                <div className="text-6xl mb-4">🦁🔺🟦</div>
                <h2 className="text-2xl font-bold mb-2">Shape Safari Adventure</h2>
                <p className="text-sm opacity-90">Explore the World of Shapes!</p>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">📚 Concept:</h3>
                  <p className="text-gray-600 text-sm">Shapes & Space (CBSE Class 1)</p>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">🎯 Learn About:</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>🔺 2D Shapes: Circle, Square, Rectangle, Triangle</li>
                    <li>🧊 3D Shapes: Cube, Sphere, Cone, Cylinder</li>
                    <li>📏 Lines: Straight, Curved, Slanting</li>
                    <li>🧭 Positions: Above, Below, Inside, Outside</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">💡 Activities:</h3>
                  <p className="text-gray-600 text-sm">
                    Identify shapes, complete patterns, count shapes, find positions, and match shapes to objects!
                  </p>
                </div>

                <div className="mb-4 p-3 bg-purple-100 rounded-lg border border-purple-300">
                  <p className="text-xs text-purple-800 font-semibold">
                    🎲 Procedurally Generated: Unique challenges every play!
                  </p>
                </div>

                <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-lg transition-colors">
                  Play Game →
                </button>
              </div>
            </div>

            {/* Number Jungle Game Card */}
            <div
              onClick={() => setCurrentGame('number-jungle')}
              className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all transform cursor-pointer group"
            >
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-8 text-white">
                <div className="text-6xl mb-4">🌴🐒🔢</div>
                <h2 className="text-2xl font-bold mb-2">Number Jungle Explorer</h2>
                <p className="text-sm opacity-90">Learn Numbers 1-100!</p>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">📚 Concept:</h3>
                  <p className="text-gray-600 text-sm">Numbers from One to Hundred (CBSE Class 1)</p>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">🎯 Learn About:</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>🔢 Count objects from 1 to 100</li>
                    <li>🔗 Match numbers to quantities</li>
                    <li>📈 Before & After numbers</li>
                    <li>⚖️ Compare quantities (more/less)</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">💡 Activities:</h3>
                  <p className="text-gray-600 text-sm">
                    Count jungle animals, find missing numbers, tap the number, and number sequences!
                  </p>
                </div>

                <div className="mb-4 p-3 bg-green-100 rounded-lg border border-green-300">
                  <p className="text-xs text-green-800 font-semibold">
                    🎲 Procedurally Generated: Unique challenges every play!
                  </p>
                </div>

                <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-colors">
                  Play Game →
                </button>
              </div>
            </div>

            {/* Balloon Blastoff Game Card */}
            <div
              onClick={() => setCurrentGame('balloon-blastoff')}
              className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all transform cursor-pointer group"
            >
              <div className="bg-gradient-to-r from-pink-400 to-red-500 p-8 text-white">
                <div className="text-6xl mb-4">🎈🐰☁️</div>
                <h2 className="text-2xl font-bold mb-2">Balloon Blastoff</h2>
                <p className="text-sm opacity-90">Learn Addition (1-100)!</p>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">📚 Concept:</h3>
                  <p className="text-gray-600 text-sm">Addition within 100 (CBSE Class 1, Chapter 3)</p>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">🎯 Learn About:</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>➕ Add numbers to reach a target sum</li>
                    <li>🧮 Mental math strategies</li>
                    <li>🔄 Multiple ways to make the same sum</li>
                    <li>🎯 Problem-solving with constraints</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">💡 How to Play:</h3>
                  <p className="text-gray-600 text-sm">
                    Drag numbered balloons to the basket until they add up to the target. Help the bunny fly to the clouds!
                  </p>
                </div>

                <div className="mb-4 p-3 bg-pink-100 rounded-lg border border-pink-300">
                  <p className="text-xs text-pink-800 font-semibold">
                    🎲 Procedurally Generated: New target sums every level!
                  </p>
                </div>

                <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-colors">
                  Play Game →
                </button>
              </div>
            </div>

            {/* Bubble Pop Game Card */}
            <div
              onClick={() => setCurrentGame('bubble-pop')}
              className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all transform cursor-pointer group"
            >
              <div className="bg-gradient-to-r from-cyan-400 to-teal-500 p-8 text-white">
                <div className="text-6xl mb-4">🫧🐕✨</div>
                <h2 className="text-2xl font-bold mb-2">Bubble Pop Countdown</h2>
                <p className="text-sm opacity-90">Learn Subtraction (1-100)!</p>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">📚 Concept:</h3>
                  <p className="text-gray-600 text-sm">Subtraction within 100 (CBSE Class 1, Chapter 4)</p>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">🎯 Learn About:</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>➖ Subtract by "taking away"</li>
                    <li>🔢 Find the difference between numbers</li>
                    <li>🧮 Count backwards mentally</li>
                    <li>🔄 Undo mistakes and try again</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">💡 How to Play:</h3>
                  <p className="text-gray-600 text-sm">
                    Tap bubbles to pop them until only the target number remains. Help Bubbles the puppy!
                  </p>
                </div>

                <div className="mb-4 p-3 bg-cyan-100 rounded-lg border border-cyan-300">
                  <p className="text-xs text-cyan-800 font-semibold">
                    🎲 Procedurally Generated: New numbers every level!
                  </p>
                </div>

                <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg transition-colors">
                  Play Game →
                </button>
              </div>
            </div>

            {/* Tick-Tock Town Game Card */}
            <div
              onClick={() => setCurrentGame('tick-tock')}
              className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all transform cursor-pointer group"
            >
              <div className="bg-gradient-to-r from-indigo-400 to-purple-500 p-8 text-white">
                <div className="text-6xl mb-4">🕐🐦⏰</div>
                <h2 className="text-2xl font-bold mb-2">Tick-Tock Town</h2>
                <p className="text-sm opacity-90">Learn About Time!</p>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">📚 Concept:</h3>
                  <p className="text-gray-600 text-sm">Time (CBSE Class 1, Chapter 5)</p>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">🎯 Learn About:</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>🕐 Reading o'clock times</li>
                    <li>🌅 Morning, Afternoon, Evening, Night</li>
                    <li>📅 Days of the week</li>
                    <li>⏱️ Longer & shorter durations</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">💡 How to Play:</h3>
                  <p className="text-gray-600 text-sm">
                    Set clocks, sort daily routines, order events, and learn about time with Cuckoo!
                  </p>
                </div>

                <div className="mb-4 p-3 bg-indigo-100 rounded-lg border border-indigo-300">
                  <p className="text-xs text-indigo-800 font-semibold">
                    🎲 Procedurally Generated: 7 different activity types!
                  </p>
                </div>

                <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-lg transition-colors">
                  Play Game →
                </button>
              </div>
            </div>

            {/* Measure Island Game Card */}
            <div
              onClick={() => setCurrentGame('measure-island')}
              className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all transform cursor-pointer group"
            >
              <div className="bg-gradient-to-r from-teal-400 to-cyan-500 p-8 text-white">
                <div className="text-6xl mb-4">🏝️🐒📏</div>
                <h2 className="text-2xl font-bold mb-2">Measure Island</h2>
                <p className="text-sm opacity-90">Learn About Measurement!</p>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">📚 Concept:</h3>
                  <p className="text-gray-600 text-sm">Measurement (CBSE Class 1, Chapter 6)</p>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">🎯 Learn About:</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>📏 Compare lengths & heights</li>
                    <li>⚖️ Compare weights (heavier/lighter)</li>
                    <li>🫗 Compare capacities (holds more/less)</li>
                    <li>🖐️ Measure with handspans & footsteps</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">💡 How to Play:</h3>
                  <p className="text-gray-600 text-sm">
                    Use seesaws to compare, measure objects with non-standard units, and order items by size!
                  </p>
                </div>

                <div className="mb-4 p-3 bg-teal-100 rounded-lg border border-teal-300">
                  <p className="text-xs text-teal-800 font-semibold">
                    🎲 Procedurally Generated: 8 different activity types!
                  </p>
                </div>

                <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg transition-colors">
                  Play Game →
                </button>
              </div>
            </div>

            {/* Data Detective Island Game Card */}
            <div
              onClick={() => setCurrentGame('data-detective')}
              className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all transform cursor-pointer group"
            >
              <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-8 text-white">
                <div className="text-6xl mb-4">🐕‍🦺📊🔍</div>
                <h2 className="text-2xl font-bold mb-2">Data Detective Island</h2>
                <p className="text-sm opacity-90">Learn About Data Handling!</p>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">📚 Concept:</h3>
                  <p className="text-gray-600 text-sm">Data Handling (CBSE Class 1, Chapter 7)</p>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">🎯 Learn About:</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>🔢 Counting & collecting data</li>
                    <li>📊 Tally marks & pictographs</li>
                    <li>🧺 Sorting by color, type, size</li>
                    <li>⚖️ Comparing data (more/less)</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">💡 How to Play:</h3>
                  <p className="text-gray-600 text-sm">
                    Count objects, make tally marks, read pictographs, and solve data mysteries with Dotty!
                  </p>
                </div>

                <div className="mb-4 p-3 bg-purple-100 rounded-lg border border-purple-300">
                  <p className="text-xs text-purple-800 font-semibold">
                    🎲 Procedurally Generated: 8 different activity types!
                  </p>
                </div>

                <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-lg transition-colors">
                  Play Game →
                </button>
              </div>
            </div>

            {/* Pattern Parade Game Card */}
            <div
              onClick={() => setCurrentGame('pattern-parade')}
              className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all transform cursor-pointer group"
            >
              <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 p-8 text-white">
                <div className="text-6xl mb-4">🚂🔴🔵🔴🔵</div>
                <h2 className="text-2xl font-bold mb-2">Pattern Parade</h2>
                <p className="text-sm opacity-90">Master Pattern Recognition!</p>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">📚 Concept:</h3>
                  <p className="text-gray-600 text-sm">Patterns (CBSE Class 1, Chapter 7)</p>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">🎯 Learn About:</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>🔍 Identifying repeating patterns (AB, ABC, AAB)</li>
                    <li>🔮 Extending patterns - What comes next?</li>
                    <li>🧩 Finding missing elements in patterns</li>
                    <li>🌱 Growing patterns & 🪞 Mirror symmetry</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">💡 How to Play:</h3>
                  <p className="text-gray-600 text-sm">
                    Help the magical train by solving 6 types of pattern puzzles! Drag items, spot rules, and build your own patterns.
                  </p>
                </div>

                <div className="mb-4 p-3 bg-pink-100 rounded-lg border border-pink-300">
                  <p className="text-xs text-pink-800 font-semibold">
                    🎲 6 Game Modes with Dynamic Pattern Generation!
                  </p>
                </div>

                <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-lg transition-colors">
                  Play Game →
                </button>
              </div>
            </div>

            {/* Coin Kingdom Game Card */}
            <div
              onClick={() => setCurrentGame('coin-kingdom')}
              className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all transform cursor-pointer group"
            >
              <div className="bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 p-8 text-white">
                <div className="text-6xl mb-4">🪙💰🐷🛒</div>
                <h2 className="text-2xl font-bold mb-2">Coin Kingdom</h2>
                <p className="text-sm opacity-90">Master Indian Currency!</p>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">📚 Concept:</h3>
                  <p className="text-gray-600 text-sm">Money (CBSE Class 1, Chapter 7)</p>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">🎯 Learn About:</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>🔍 Identifying Indian coins and notes</li>
                    <li>🧮 Counting money and finding totals</li>
                    <li>🎯 Making exact amounts with coins</li>
                    <li>🛒 Shopping and paying with money</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">💡 How to Play:</h3>
                  <p className="text-gray-600 text-sm">
                    Collect coins, sort piggy banks, count money, and shop in 6 fun game modes!
                  </p>
                </div>

                <div className="mb-4 p-3 bg-amber-100 rounded-lg border border-amber-300">
                  <p className="text-xs text-amber-800 font-semibold">
                    🪙 6 Game Modes: Coins ₹1-₹10 & Notes ₹10-₹50
                  </p>
                </div>

                <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 rounded-lg transition-colors">
                  Play Game →
                </button>
              </div>
            </div>

            {/* Number Snake Game Card */}
            <div
              onClick={() => setCurrentGame('number-snake')}
              className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all transform cursor-pointer group"
            >
              <div className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 p-8 text-white">
                <div className="text-6xl mb-4">🐍🔢📊⬆️⬇️</div>
                <h2 className="text-2xl font-bold mb-2">Number Snake</h2>
                <p className="text-sm opacity-90">Master Counting 1 to 100!</p>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">📚 Concept:</h3>
                  <p className="text-gray-600 text-sm">Numbers from 1 to 100 (CBSE Chapter 2)</p>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">🎯 5 Game Types:</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>⬆️ Type 1: Count Up (1, 2, 3...)</li>
                    <li>⬇️ Type 2: Count Down (100, 99, 98...)</li>
                    <li>2️⃣ Type 3: Skip Count by 2s</li>
                    <li>5️⃣ Type 4: Skip Count by 5s</li>
                    <li>🔟 Type 5: Skip Count by 10s</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">💡 How to Play:</h3>
                  <p className="text-gray-600 text-sm">
                    Guide the snake to eat numbers in the correct order. Counting up, down, or skip counting!
                  </p>
                </div>

                <div className="mb-4 p-3 bg-green-100 rounded-lg border border-green-300">
                  <p className="text-xs text-green-800 font-semibold">
                    🐍 Classic Snake Game + Math Learning = Fun!
                  </p>
                </div>

                <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition-colors">
                  Play Game →
                </button>
              </div>
            </div>

            {/* Addition Snake Game Card */}
            <div
              onClick={() => setCurrentGame('addition-snake')}
              className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all transform cursor-pointer group"
            >
              <div className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 p-8 text-white">
                <div className="text-6xl mb-4">🐍➕🧮🎯✨</div>
                <h2 className="text-2xl font-bold mb-2">Addition Snake</h2>
                <p className="text-sm opacity-90">Master Addition from 1 to 100!</p>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">📚 Concept:</h3>
                  <p className="text-gray-600 text-sm">Addition within 100 (CBSE Chapter 3)</p>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">🎯 Features:</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>➕ Addition questions on the snake</li>
                    <li>🔢 5 answer options to choose from</li>
                    <li>🎯 Eat the correct answer to grow</li>
                    <li>🔥 Build streaks for bonus points</li>
                    <li>📊 3 difficulty levels (Easy/Medium/Hard)</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">💡 How to Play:</h3>
                  <p className="text-gray-600 text-sm">
                    Solve the addition question and guide the snake to eat the correct answer!
                  </p>
                </div>

                <div className="mb-4 p-3 bg-indigo-100 rounded-lg border border-indigo-300">
                  <p className="text-xs text-indigo-800 font-semibold">
                    🧠 Slow speed for thinking time! Perfect for learning!
                  </p>
                </div>

                <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 rounded-lg transition-colors">
                  Play Game →
                </button>
              </div>
            </div>

            {/* Subtraction Snake Game Card */}
            <div
              onClick={() => setCurrentGame('subtraction-snake')}
              className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all transform cursor-pointer group"
            >
              <div className="bg-gradient-to-r from-rose-400 via-pink-500 to-red-600 p-8 text-white">
                <div className="text-6xl mb-4">🐍➖🧮🎯✨</div>
                <h2 className="text-2xl font-bold mb-2">Subtraction Snake</h2>
                <p className="text-sm opacity-90">Master Subtraction from 1 to 100!</p>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">📚 Concept:</h3>
                  <p className="text-gray-600 text-sm">Subtraction within 100 (CBSE Chapter 3)</p>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">🎯 Features:</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>➖ Subtraction questions on the snake</li>
                    <li>🔢 5 answer options to choose from</li>
                    <li>🎯 Eat the correct answer to grow</li>
                    <li>🔥 Build streaks for bonus points</li>
                    <li>📊 3 difficulty levels (Easy/Medium/Hard)</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">💡 How to Play:</h3>
                  <p className="text-gray-600 text-sm">
                    Solve the subtraction question and guide the snake to eat the correct answer!
                  </p>
                </div>

                <div className="mb-4 p-3 bg-rose-100 rounded-lg border border-rose-300">
                  <p className="text-xs text-rose-800 font-semibold">
                    🧠 Slow speed for thinking time! Perfect for learning!
                  </p>
                </div>

                <button className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition-colors">
                  Play Game →
                </button>
              </div>
            </div>
          </div>
          )}

          {/* English Section - Coming Soon */}
          {selectedSubject === 'english' && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 text-center">
              <div className="text-8xl mb-6">📖</div>
              <h3 className="text-3xl font-bold text-white mb-4">English Games Coming Soon!</h3>
              <p className="text-xl text-gray-200 mb-6">
                Fun games for learning alphabets, words, and sentences are being developed.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <span className="bg-white/20 text-white px-4 py-2 rounded-full">🔤 Alphabet Fun</span>
                <span className="bg-white/20 text-white px-4 py-2 rounded-full">📝 Word Builder</span>
                <span className="bg-white/20 text-white px-4 py-2 rounded-full">📚 Story Time</span>
                <span className="bg-white/20 text-white px-4 py-2 rounded-full">🎵 Rhymes & Poems</span>
              </div>
            </div>
          )}

          {/* EVS Section - Coming Soon */}
          {selectedSubject === 'evs' && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 text-center">
              <div className="text-8xl mb-6">🌍</div>
              <h3 className="text-3xl font-bold text-white mb-4">EVS Games Coming Soon!</h3>
              <p className="text-xl text-gray-200 mb-6">
                Explore the world around you with fun environmental science games.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <span className="bg-white/20 text-white px-4 py-2 rounded-full">🌱 Plants & Animals</span>
                <span className="bg-white/20 text-white px-4 py-2 rounded-full">👨‍👩‍👧 My Family</span>
                <span className="bg-white/20 text-white px-4 py-2 rounded-full">🏠 My Home</span>
                <span className="bg-white/20 text-white px-4 py-2 rounded-full">🌤️ Weather</span>
              </div>
            </div>
          )}

          {/* Hindi Section - Coming Soon */}
          {selectedSubject === 'hindi' && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 text-center">
              <div className="text-8xl mb-6">🕉️</div>
              <h3 className="text-3xl font-bold text-white mb-4">हिंदी खेल जल्द आ रहे हैं!</h3>
              <p className="text-xl text-gray-200 mb-6">
                Learn Hindi alphabets, words, and sentences through fun games.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <span className="bg-white/20 text-white px-4 py-2 rounded-full">🔤 वर्णमाला</span>
                <span className="bg-white/20 text-white px-4 py-2 rounded-full">📝 शब्द निर्माण</span>
                <span className="bg-white/20 text-white px-4 py-2 rounded-full">📖 कहानियाँ</span>
                <span className="bg-white/20 text-white px-4 py-2 rounded-full">🎵 कविताएँ</span>
              </div>
            </div>
          )}

          {/* GK Section - Coming Soon */}
          {selectedSubject === 'gk' && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 text-center">
              <div className="text-8xl mb-6">🧠</div>
              <h3 className="text-3xl font-bold text-white mb-4">GK Games Coming Soon!</h3>
              <p className="text-xl text-gray-200 mb-6">
                Learn about the world with general knowledge games.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <span className="bg-white/20 text-white px-4 py-2 rounded-full">🇮🇳 India</span>
                <span className="bg-white/20 text-white px-4 py-2 rounded-full">🎨 Colors</span>
                <span className="bg-white/20 text-white px-4 py-2 rounded-full">🦁 Animals</span>
                <span className="bg-white/20 text-white px-4 py-2 rounded-full">🍎 Fruits & Vegetables</span>
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">✨ Features</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li className="flex items-start gap-3">
              <span className="text-2xl">🎮</span>
              <div>
                <p className="font-semibold text-gray-800">Interactive Gameplay</p>
                <p className="text-sm text-gray-600">Engaging canvas-based experiences with smooth animations</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <p className="font-semibold text-gray-800">Detailed Telemetry</p>
                <p className="text-sm text-gray-600">Stealth assessment with precision tracking and performance logs</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">🧠</span>
              <div>
                <p className="font-semibold text-gray-800">Concept-Based</p>
                <p className="text-sm text-gray-600">Teaches CBSE Class 5 Math concepts through gameplay</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="font-semibold text-gray-800">Real-Time Feedback</p>
                <p className="text-sm text-gray-600">Instant hints and progress tracking as you play</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-white">
          <p className="text-sm opacity-75">
            🚀 Built with Next.js 14, Konva, React Spring, and Zustand
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameSelector;