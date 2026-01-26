'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import RopeCutterGame from './games/RopeCutter';
import LiquidLabGame from './games/LiquidLab';
import FractionBridgeGame from './games/FractionBridge';
import AngleArchitectGame from './games/AngleArchitectGame';
import SymmetryShieldGame from './games/SymmetryShieldGame';
import FactorFactoryGame from './games/FactorFactoryGame';
import CargoCaptainGame from './games/CargoCaptainGame';
import PatternDetectiveGame from './games/PatternDetectiveGame';
import OceanEmpireGame from './games/OceanEmpireGame';
import TreasureMapGame from './games/TreasureMapGame';
import BeachSafariGame from './games/BeachSafariGame';
import ShapeCityGame from './games/ShapeCityGame';
import WeightWarehouseGame from './games/WeightWarehouseGame';
import ShadowStoryGame from './games/ShadowStoryGame';
import { RotateCcw } from 'lucide-react';
import { LogoutButton } from './auth/LogoutButton';

type GameType = 'home' | 'rope-cutter' | 'liquid-lab' | 'fraction-bridge' | 'angle-architect' | 'symmetry-shield' | 'factor-factory' | 'cargo-captain' | 'pattern-detective' | 'ocean-empire' | 'treasure-map' | 'beach-safari' | 'shape-city' | 'weight-warehouse' | 'shadow-story';

const GameSelector: React.FC = () => {
  const { data: session } = useSession();
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
        {currentGame === 'pattern-detective' && <PatternDetectiveGame />}
        {currentGame === 'ocean-empire' && <OceanEmpireGame />}
        {currentGame === 'treasure-map' && <TreasureMapGame />}
        {currentGame === 'beach-safari' && <BeachSafariGame />}
        {currentGame === 'shape-city' && <ShapeCityGame onBack={() => setCurrentGame('home')} />}
        {currentGame === 'weight-warehouse' && <WeightWarehouseGame />}
        {currentGame === 'shadow-story' && <ShadowStoryGame onBack={() => setCurrentGame('home')} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            {session?.user && (
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                {/* User Avatar */}
                <div className="text-4xl bg-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
                  {(session.user as any).avatar || "😊"}
                </div>
                <div className="text-white text-right">
                  <p className="font-semibold">{session.user.name}</p>
                  <p className="text-sm opacity-75">Class {session.user.class}</p>
                </div>
                <LogoutButton />
              </div>
            )}
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">🎮 Game Arena</h1>
          <p className="text-xl text-gray-100">
            Master CBSE Class 5 Math Concepts Through Interactive Games
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

          {/* Pattern Detective Game Card */}
          <div
            onClick={() => setCurrentGame('pattern-detective')}
            className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all transform cursor-pointer group"
          >
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-8 text-white">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold mb-2">Pattern Detective</h2>
              <p className="text-sm opacity-90">Master Number Patterns</p>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">📚 Concept:</h3>
                <p className="text-gray-600 text-sm">Number Patterns & Sequences</p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">🎯 Problem:</h3>
                <p className="text-gray-600 text-sm">
                  "Detective! Analyze patterns, find missing numbers, and create your own sequences."
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">💡 Task:</h3>
                <p className="text-gray-600 text-sm">
                  Complete 3 phases: Discovery (find missing), Builder (construct sequence), Creator (design your own).
                </p>
              </div>

              <div className="mb-4 p-3 bg-purple-100 rounded-lg border border-purple-300">
                <p className="text-xs text-purple-800 font-semibold">
                  🎲 Procedurally Generated: Add, subtract, or multiply patterns!
                </p>
              </div>

              <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-lg transition-colors">
                Play Game →
              </button>
            </div>
          </div>

          {/* Ocean Empire Game Card */}
          <div
            onClick={() => setCurrentGame('ocean-empire')}
            className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all transform cursor-pointer group"
          >
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white">
              <div className="text-6xl mb-4">🐟</div>
              <h2 className="text-2xl font-bold mb-2">Ocean Number Empire</h2>
              <p className="text-sm opacity-90">Master Large Numbers (Hard)</p>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">📚 Concept:</h3>
                <p className="text-gray-600 text-sm">Large Numbers - Lakhs & Crores (Indian System)</p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">🎯 Problem:</h3>
                <p className="text-gray-600 text-sm">
                  "Marine biologist! Track fish populations using 7-8 digit numbers."
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">💡 Task:</h3>
                <p className="text-gray-600 text-sm">
                  3 Phases: Place Value Sorting, Mental Math Operations, Population Comparison.
                </p>
              </div>

              <div className="mb-4 p-3 bg-blue-100 rounded-lg border border-blue-300">
                <p className="text-xs text-blue-800 font-semibold">
                  🎲 The Fish Tale Chapter - Hard Level Challenge!
                </p>
              </div>

              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors">
                Play Game →
              </button>
            </div>
          </div>

          {/* Treasure Map Navigator Game Card */}
          <div
            onClick={() => setCurrentGame('treasure-map')}
            className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all transform cursor-pointer group"
          >
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-8 text-white">
              <div className="text-6xl mb-4">🗺️</div>
              <h2 className="text-2xl font-bold mb-2">Treasure Map Navigator</h2>
              <p className="text-sm opacity-90">Master Coordinates & Maps</p>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">📚 Concept:</h3>
                <p className="text-gray-600 text-sm">Introduction to Coordinates and Maps</p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">🎯 Problem:</h3>
                <p className="text-gray-600 text-sm">
                  "Explorer! Navigate treasure maps using (X, Y) coordinates."
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">💡 Task:</h3>
                <p className="text-gray-600 text-sm">
                  3 Phases: Plot Landmarks, Navigate Paths, Calculate Grid Distances.
                </p>
              </div>

              <div className="mb-4 p-3 bg-amber-100 rounded-lg border border-amber-300">
                <p className="text-xs text-amber-800 font-semibold">
                  🎲 Mapping Your Way Chapter - Hard Level Challenge!
                </p>
              </div>

              <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition-colors">
                Play Game →
              </button>
            </div>
          </div>

          {/* Beach Shape Safari Game Card */}
          <div
            onClick={() => setCurrentGame('beach-safari')}
            className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all transform cursor-pointer group"
          >
            <div className="bg-gradient-to-r from-cyan-400 to-teal-500 p-8 text-white">
              <div className="text-6xl mb-4">🏖️</div>
              <h2 className="text-2xl font-bold mb-2">Beach Shape Safari</h2>
              <p className="text-sm opacity-90">Learn Shapes, Length & Counting</p>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">📚 Concept:</h3>
                <p className="text-gray-600 text-sm">Introduction to Length, Shapes, Counting & Comparing</p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">🎯 Problem:</h3>
                <p className="text-gray-600 text-sm">
                  "Help Coco the Crab sort beach treasures by shape and size!"
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">💡 Task:</h3>
                <p className="text-gray-600 text-sm">
                  4 Phases: Shape Sorting, Length Comparison, Bucket Counting, Balance Scale.
                </p>
              </div>

              <div className="mb-4 p-3 bg-cyan-100 rounded-lg border border-cyan-300">
                <p className="text-xs text-cyan-800 font-semibold">
                  🎲 A Day at the Beach Chapter - CBSE Class 2!
                </p>
              </div>

              <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg transition-colors">
                Play Game →
              </button>
            </div>
          </div>

          {/* Shape City Builder Game Card */}
          <div
            onClick={() => setCurrentGame('shape-city')}
            className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all transform cursor-pointer group"
          >
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white">
              <div className="text-6xl mb-4">🏙️</div>
              <h2 className="text-2xl font-bold mb-2">Shape City Builder</h2>
              <p className="text-sm opacity-90">Shapes & Counting in Groups</p>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">📚 Concept:</h3>
                <p className="text-gray-600 text-sm">Shapes Around Us & Counting in Groups</p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">🎯 Problem:</h3>
                <p className="text-gray-600 text-sm">
                  "Help Mayor Bot build a city by finding shapes and counting in groups!"
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">💡 Task:</h3>
                <p className="text-gray-600 text-sm">
                  4 Phases: Shape Detective, Group Counter, Pattern Builder, City Constructor.
                </p>
              </div>

              <div className="mb-4 p-3 bg-purple-100 rounded-lg border border-purple-300">
                <p className="text-xs text-purple-800 font-semibold">
                  🎲 Shapes Around Us + Counting in Groups - CBSE Class 5!
                </p>
              </div>

              <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-lg transition-colors">
                Play Game →
              </button>
            </div>
          </div>

          {/* Weight Warehouse Game Card */}
          <div
            onClick={() => setCurrentGame('weight-warehouse')}
            className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all transform cursor-pointer group"
          >
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-8 text-white">
              <div className="text-6xl mb-4">🏗️</div>
              <h2 className="text-2xl font-bold mb-2">Weight Warehouse</h2>
              <p className="text-sm opacity-90">Cargo Loading Challenge</p>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">📚 Concept:</h3>
                <p className="text-gray-600 text-sm">Fun with Numbers - How Much Can You Carry?</p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">🎯 Problem:</h3>
                <p className="text-gray-600 text-sm">
                  "Help Weighty the Forklift load trucks, balance scales, and plan deliveries!"
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">💡 Task:</h3>
                <p className="text-gray-600 text-sm">
                  4 Phases: Cargo Loading, Weight Balancing, Number Breaking, Delivery Planning.
                </p>
              </div>

              <div className="mb-4 p-3 bg-amber-100 rounded-lg border border-amber-300">
                <p className="text-xs text-amber-800 font-semibold">
                  🎲 Fun with Numbers Chapter - CBSE Class 5!
                </p>
              </div>

              <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition-colors">
                Play Game →
              </button>
            </div>
          </div>

          {/* Shadow Story Game Card */}
          <div
            onClick={() => setCurrentGame('shadow-story')}
            className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all transform cursor-pointer group"
          >
            <div className="bg-gradient-to-r from-purple-600 to-indigo-800 p-8 text-white">
              <div className="text-6xl mb-4">🌙</div>
              <h2 className="text-2xl font-bold mb-2">Shadow Story</h2>
              <p className="text-sm opacity-90">The Shape Collector</p>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">📚 Concept:</h3>
                <p className="text-gray-600 text-sm">Counting in Tens + 2D Shapes (Place Value)</p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">🎯 Problem:</h3>
                <p className="text-gray-600 text-sm">
                  "Help Lumina find shapes, bundle them in 10s, and count the Shadow Village!"
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">💡 Task:</h3>
                <p className="text-gray-600 text-sm">
                  4 Phases: Shadow Spotter, Bundle Builder, Place Value Palace, Village Counter.
                </p>
              </div>

              <div className="mb-4 p-3 bg-purple-100 rounded-lg border border-purple-300">
                <p className="text-xs text-purple-800 font-semibold">
                  🎲 Counting in Tens Chapter - CBSE Class 2!
                </p>
              </div>

              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors">
                Play Game →
              </button>
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
