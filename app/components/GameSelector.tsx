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
import { RotateCcw } from 'lucide-react';

type GameType = 'home' | 'rope-cutter' | 'liquid-lab' | 'fraction-bridge' | 'angle-architect' | 'symmetry-shield' | 'factor-factory' | 'cargo-captain' | 'shape-safari' | 'number-jungle';

const GameSelector: React.FC = () => {
  const [currentGame, setCurrentGame] = useState<GameType>('home');

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
            <h2 className="text-3xl font-bold text-white mb-2">🌟 Class 1 Games</h2>
            <p className="text-lg text-gray-200">Fun games for our youngest learners!</p>
          </div>

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
          </div>
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