'use client';

import React, { useState } from 'react';
import RopeCutterGame from './games/class3/RopeCutter';
import LiquidLabGame from './games/class3/LiquidLab';
import FractionBridgeGame from './games/class3/FractionBridge';
import AngleArchitectGame from './games/class3/AngleArchitectGame';
import SymmetryShieldGame from './games/class3/SymmetryShieldGame';
import FactorFactoryGame from './games/class3/FactorFactoryGame';
import CargoCaptainGame from './games/class3/CargoCaptainGame';
import MathMarathonGame from './games/class3/MathMarathon';
import FractionFusionGame from './games/class3/FractionFusion';
import OperationMasterArena from './games/class3/OperationMasterArena';
import MeasureMoneyTown from './games/class3/MeasureMoneyTown';
import NumberAdventureGame from './games/class3/NumberAdventureGame';
import TimeShapeLogicGame from './games/class3/TimeShapeLogic';
import StoryPathAdventure from './games/class3/StoryPathAdventure';
import VocabularyBuilder from './games/class3/VocabularyBuilder';
import GrammarLogic from './games/class3/GrammarLogic';
import ThinkAndTell from './games/class3/ThinkAndTell';
import MoralMapper from './games/class3/MoralMapper';
import { RotateCcw } from 'lucide-react';

// Game data structure with class and subject information
interface GameData {
  id: GameType;
  title: string;
  subtitle: string;
  emoji: string;
  gradientFrom: string;
  gradientTo: string;
  concept: string;
  problem?: string;
  badge?: string;
  btnText?: string;
  subjects: SubjectType[];
  chapter?: string;
}

type GameType =
  | 'home'
  | 'rope-cutter'
  | 'liquid-lab'
  | 'fraction-bridge'
  | 'angle-architect'
  | 'symmetry-shield'
  | 'factor-factory'
  | 'cargo-captain'
  | 'math-marathon'
  | 'fraction-fusion'
  | 'number-adventure'
  | 'operation-master'
  | 'measure-money'
  | 'time-shape-logic'
  | 'story-path-adventure'
  | 'vocabulary-builder'
  | 'grammar-logic'
  | 'think-and-tell'
  | 'moral-mapper';

type SubjectType = 
  | 'english'
  | 'math'
  | 'evs'
  | 'science';

const subjectOptions: { id: SubjectType; label: string; emoji: string; color: string }[] = [
  { id: 'english', label: 'English', emoji: '📖', color: 'from-pink-400 to-rose-500' },
  { id: 'math', label: 'Math', emoji: '🔢', color: 'from-blue-400 to-indigo-500' },
  { id: 'evs', label: 'EVS', emoji: '🌍', color: 'from-green-400 to-emerald-500' },
  { id: 'science', label: 'Science', emoji: '🔬', color: 'from-purple-400 to-violet-500' },
];

// All games data - organized by chapter and subject
const allGames: GameData[] = [
  // ==================== ENGLISH GAMES ====================
  {
    id: 'story-path-adventure',
    title: 'Story Path Adventure',
    subtitle: 'Story Sequencing & Morals',
    emoji: '📖',
    gradientFrom: 'from-blue-400',
    gradientTo: 'to-indigo-500',
    concept: 'Story sequencing, moral understanding, cause & effect, prediction',
    problem: 'Arrange events, find morals, predict outcomes',
    badge: '🟢 Easy → 🏆 Master (4 levels)',
    btnText: '📖 Start Adventure →',
    subjects: ['english'],
    chapter: 'Stories',
  },
  {
    id: 'vocabulary-builder',
    title: 'Vocabulary Builder',
    subtitle: 'Word Detective',
    emoji: '🔍',
    gradientFrom: 'from-green-400',
    gradientTo: 'to-emerald-500',
    concept: 'Word meanings, synonyms, antonyms, context usage',
    problem: 'Match meanings, find opposites, fill in blanks',
    badge: '🟢 Easy → 🏆 Master (4 levels)',
    btnText: '🔍 Start Building →',
    subjects: ['english'],
    chapter: 'Vocabulary',
  },
  {
    id: 'grammar-logic',
    title: 'Grammar Logic',
    subtitle: 'Sentence Builder',
    emoji: '📝',
    gradientFrom: 'from-purple-400',
    gradientTo: 'to-violet-500',
    concept: 'Parts of speech, sentence structure, punctuation, clauses',
    problem: 'Identify parts, fix sentences, classify words',
    badge: '🟢 Easy → 🏆 Master (4 levels)',
    btnText: '📝 Start Building →',
    subjects: ['english'],
    chapter: 'Grammar',
  },
  {
    id: 'think-and-tell',
    title: 'Think & Tell',
    subtitle: 'Comprehension & Reasoning',
    emoji: '💭',
    gradientFrom: 'from-orange-400',
    gradientTo: 'to-amber-500',
    concept: 'Reading comprehension, inference, main idea, critical thinking',
    problem: 'Answer passage questions, infer meaning, analyze themes',
    badge: '🟢 Easy → 🏆 Master (4 levels)',
    btnText: '💭 Start Thinking →',
    subjects: ['english'],
    chapter: 'Comprehension',
  },
  {
    id: 'moral-mapper',
    title: 'Moral Mapper',
    subtitle: 'Story Logic Game',
    emoji: '💝',
    gradientFrom: 'from-pink-400',
    gradientTo: 'to-rose-500',
    concept: 'Values, ethics, kindness, honesty, courage, responsibility',
    problem: 'Choose right actions, identify values, solve dilemmas',
    badge: '🟢 Easy → 🏆 Master (4 levels)',
    btnText: '💝 Start Learning →',
    subjects: ['english'],
    chapter: 'Values & Life Skills',
  },

  // ==================== NUMBERS & OPERATIONS ====================
  {
    id: 'number-adventure',
    title: 'Number Adventure',
    subtitle: 'Numbers & Place Value',
    emoji: '🔢',
    gradientFrom: 'from-green-400',
    gradientTo: 'to-emerald-500',
    concept: 'Addition, Subtraction, Place Value, Ordering',
    problem: 'One-step, Two-step, Word problems, Ordering',
    badge: '🎲 Unique questions every time!',
    btnText: '🚀 Start Adventure',
    subjects: ['math'],
    chapter: 'Ch 1, 2, 3',
  },
  {
    id: 'operation-master',
    title: 'Operation Master',
    subtitle: 'Addition & Subtraction',
    emoji: '⚔️',
    gradientFrom: 'from-red-400',
    gradientTo: 'to-rose-500',
    concept: 'Addition, Subtraction, Word Problems, Mental Math',
    problem: 'Multi-step problems, missing terms, estimation',
    badge: '🎲 Mixed-topic challenges!',
    btnText: '⚔️ Enter Arena',
    subjects: ['math'],
    chapter: 'Ch 2, 4',
  },
  {
    id: 'factor-factory',
    title: 'The Factor Factory',
    subtitle: 'Rectangular Arrays',
    emoji: '🏭',
    gradientFrom: 'from-orange-400',
    gradientTo: 'to-amber-500',
    concept: 'Factors & Rectangular Arrays',
    badge: '🎲 10 different composite numbers!',
    btnText: 'Play Game →',
    subjects: ['math'],
    chapter: 'Ch 3',
  },
  {
    id: 'math-marathon',
    title: 'Math Marathon',
    subtitle: 'Mixed Operations',
    emoji: '🏃',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-indigo-600',
    concept: 'Multi-Chapter Operations (Ch 2, 3, 5, 6)',
    badge: '🏆 3 Levels: Easy → Medium → Hard',
    btnText: 'Start Race →',
    subjects: ['math'],
    chapter: 'Ch 2, 3, 5, 6',
  },

  // ==================== FRACTIONS ====================
  {
    id: 'fraction-bridge',
    title: 'The Fraction Bridge',
    subtitle: 'Ordering Fractions',
    emoji: '🌉',
    gradientFrom: 'from-cyan-400',
    gradientTo: 'to-blue-500',
    concept: 'Ordering & Comparison of Fractions',
    problem: 'Arrange fractions in descending order',
    badge: '🎲 Thousands of unique challenges!',
    btnText: 'Play Game →',
    subjects: ['math'],
    chapter: 'Ch 5',
  },
  {
    id: 'rope-cutter',
    title: 'The Rope Cutter',
    subtitle: 'Division of Mixed Fractions',
    emoji: '🪢',
    gradientFrom: 'from-yellow-400',
    gradientTo: 'to-orange-500',
    concept: 'Division of Mixed Fractions',
    problem: 'Cut rope into equal pieces (12-20m, 4-6 pieces)',
    badge: '🎲 Different rope length every play!',
    btnText: 'Play Game →',
    subjects: ['math'],
    chapter: 'Ch 6',
  },
  {
    id: 'liquid-lab',
    title: 'Liquid Lab',
    subtitle: 'Fraction Subtraction',
    emoji: '🧪',
    gradientFrom: 'from-purple-400',
    gradientTo: 'to-pink-500',
    concept: 'Fraction Subtraction with Unlike Denominators',
    problem: 'Pour target volume from a beaker',
    badge: '🎲 100+ unique fraction combinations!',
    btnText: 'Play Game →',
    subjects: ['math'],
    chapter: 'Ch 6',
  },
  {
    id: 'fraction-fusion',
    title: 'Fraction Fusion',
    subtitle: 'Complete Fractions',
    emoji: '⚛️',
    gradientFrom: 'from-cyan-500',
    gradientTo: 'to-teal-600',
    concept: 'Complete Fraction Operations (+, -, ×)',
    badge: '🏆 3 Levels: Like → Unlike → Mixed',
    btnText: 'Start Fusion →',
    subjects: ['math'],
    chapter: 'Ch 5, 6',
  },

  // ==================== GEOMETRY ====================
  {
    id: 'angle-architect',
    title: 'The Angle Architect',
    subtitle: 'Angles & Rotation',
    emoji: '🔧',
    gradientFrom: 'from-indigo-400',
    gradientTo: 'to-purple-500',
    concept: 'Angles as Turns & Classification',
    btnText: 'Play Game →',
    subjects: ['math'],
    chapter: 'Ch 4',
  },
  {
    id: 'symmetry-shield',
    title: 'The Symmetry Shield',
    subtitle: 'Reflection & Patterns',
    emoji: '🛡️',
    gradientFrom: 'from-teal-400',
    gradientTo: 'to-cyan-500',
    concept: 'Reflection Symmetry & Pattern Completion',
    btnText: 'Play Game →',
    subjects: ['math'],
    chapter: 'Ch 4',
  },
  {
    id: 'time-shape-logic',
    title: 'Time, Shape & Logic World',
    subtitle: 'Time, Shapes & Data',
    emoji: '🕐',
    gradientFrom: 'from-pink-400',
    gradientTo: 'to-rose-500',
    concept: 'Time (Clock & Calendar), 2D/3D Shapes, Data Handling (Pictograph)',
    problem: 'Time calculations, Shape properties, Reading pictographs',
    badge: '🧠 Reasoning & Observation Skills',
    btnText: '🌟 Start Game →',
    subjects: ['math'],
    chapter: 'Ch 10, 11, 12',
  },

  // ==================== MEASUREMENTS ====================
  {
    id: 'measure-money',
    title: 'Measure & Money Town',
    subtitle: 'Measurement & Money',
    emoji: '💰',
    gradientFrom: 'from-yellow-400',
    gradientTo: 'to-amber-500',
    concept: 'Units, Conversions, Money Calculations',
    problem: 'Unit conversions, coin change',
    badge: '🎲 Fun measurement challenges!',
    btnText: '💰 Shop & Measure',
    subjects: ['math'],
    chapter: 'Ch 7, 8',
  },
  {
    id: 'cargo-captain',
    title: 'The Cargo Captain',
    subtitle: 'Volume Calculation',
    emoji: '⛴️',
    gradientFrom: 'from-cyan-400',
    gradientTo: 'to-blue-500',
    concept: 'Volume Packing & 3D Estimation',
    btnText: 'Play Game →',
    subjects: ['math'],
    chapter: 'Ch 9',
  },
];

const GameSelector: React.FC = () => {
  const [currentGame, setCurrentGame] = useState<GameType>('home');
  const [selectedSubject, setSelectedSubject] = useState<SubjectType | 'all'>('all');

  // Filter games based on selected subject
  const filteredGames = allGames.filter((game) => {
    return selectedSubject === 'all' || game.subjects.includes(selectedSubject);
  });

  // Cartoon-style Game Card
  const CartoonGameCard: React.FC<{
    game: GameData;
  }> = ({ game }) => {
    const primarySubject = subjectOptions.find(s => s.id === game.subjects[0]);
    const subjectColor = primarySubject?.color || 'from-purple-400 to-violet-500';
    
    return (
      <div
        onClick={() => setCurrentGame(game.id)}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all transform cursor-pointer group"
      >
        {/* Cartoon Header with Character */}
        <div className={`bg-gradient-to-r ${game.gradientFrom} ${game.gradientTo} p-6 text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-5 -mb-5"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-5xl shadow-lg backdrop-blur-sm">
              {game.emoji}
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1 drop-shadow-lg">{game.title}</h2>
              <p className="text-white/90 font-medium">{game.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 bg-gradient-to-b from-white to-gray-50">
          {/* Chapter Badge */}
          {game.chapter && (
            <div className="mb-3">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-300">
                📖 {game.chapter}
              </span>
            </div>
          )}

          {/* Subject Badge */}
          <div className="mb-3 flex flex-wrap gap-2">
            {game.subjects.map((subj) => {
              const subjInfo = subjectOptions.find(s => s.id === subj);
              return subjInfo ? (
                <span key={subj} className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${subjInfo.color} text-white`}>
                  {subjInfo.emoji} {subjInfo.label}
                </span>
              ) : null;
            })}
          </div>

          {/* Concept */}
          <div className="mb-3 flex items-start gap-2">
            <span className="text-xl mt-0.5">📚</span>
            <div className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg flex-1">
              <p className="text-gray-800 font-medium text-sm">{game.concept}</p>
            </div>
          </div>

          {/* Problem */}
          {game.problem && (
            <div className="mb-3 flex items-start gap-2">
              <span className="text-xl mt-0.5">🎯</span>
              <div className="bg-amber-50 border-2 border-amber-200 px-3 py-1.5 rounded-lg flex-1">
                <p className="text-gray-700 text-sm font-medium">{game.problem}</p>
              </div>
            </div>
          )}

          {/* Badge */}
          {game.badge && (
            <div className="mb-4 flex items-center gap-2">
              <span className="text-lg">✨</span>
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 px-3 py-1.5 rounded-lg flex-1">
                <p className="text-amber-800 text-xs font-bold">{game.badge}</p>
              </div>
            </div>
          )}

          {/* Play Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentGame(game.id);
            }}
            className={`w-full bg-gradient-to-r ${game.gradientFrom} ${game.gradientTo} hover:opacity-90 text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
          >
            {game.btnText || '🎮 Play Now!'}
          </button>
        </div>
      </div>
    );
  };

  if (currentGame !== 'home') {
    return (
      <div>
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
        {currentGame === 'math-marathon' && <MathMarathonGame />}
        {currentGame === 'fraction-fusion' && <FractionFusionGame />}
        {currentGame === 'operation-master' && (
          <OperationMasterArena onExit={() => setCurrentGame('home')} />
        )}
        {currentGame === 'measure-money' && (
          <MeasureMoneyTown onExit={() => setCurrentGame('home')} />
        )}
        {currentGame === 'number-adventure' && (
          <NumberAdventureGame onExit={() => setCurrentGame('home')} />
        )}
        {currentGame === 'time-shape-logic' && <TimeShapeLogicGame />}
        {currentGame === 'story-path-adventure' && (
          <StoryPathAdventure onExit={() => setCurrentGame('home')} />
        )}
        {currentGame === 'vocabulary-builder' && (
          <VocabularyBuilder onExit={() => setCurrentGame('home')} />
        )}
        {currentGame === 'grammar-logic' && (
          <GrammarLogic onExit={() => setCurrentGame('home')} />
        )}
        {currentGame === 'think-and-tell' && (
          <ThinkAndTell onExit={() => setCurrentGame('home')} />
        )}
        {currentGame === 'moral-mapper' && (
          <MoralMapper onExit={() => setCurrentGame('home')} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">🎮 Game Arena</h1>
          <p className="text-lg md:text-xl text-gray-100">
            Class 3 • Learn Through Fun Games! ✨
          </p>
        </div>

        {/* Class Banner */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/20 backdrop-blur-sm px-8 py-3 rounded-full">
            <p className="text-white font-bold text-lg">📚 Class 3 • All Subjects</p>
          </div>
        </div>

        {/* Subject Filter */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-2 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedSubject('all')}
              className={`px-5 py-2 rounded-xl font-medium transition-all ${
                selectedSubject === 'all' 
                  ? 'bg-white text-purple-700 shadow-lg' 
                  : 'text-white hover:bg-white/20'
              }`}
            >
              📚 All Subjects
            </button>
            {subjectOptions.map((subject) => (
              <button
                key={subject.id}
                onClick={() => setSelectedSubject(subject.id)}
                className={`px-5 py-2 rounded-xl font-medium transition-all ${
                  selectedSubject === subject.id 
                    ? `bg-gradient-to-r ${subject.color} text-white shadow-lg` 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <span className="mr-1">{subject.emoji}</span>
                {subject.label}
              </button>
            ))}
          </div>
        </div>

        {/* Games Grid */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <CartoonGameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-3xl p-8 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No Games Found!</h2>
              <p className="text-gray-600 mb-4">
                There are no games for <span className="font-bold text-purple-600">{selectedSubject === 'all' ? 'All Subjects' : subjectOptions.find(s => s.id === selectedSubject)?.label}</span> yet.
              </p>
              <button
                onClick={() => setSelectedSubject('all')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg"
              >
                🔄 Show All Games
              </button>
            </div>
          </div>
        )}

        {/* Games Count */}
        {filteredGames.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-white/80 font-medium">
              Showing <span className="font-bold text-white">{filteredGames.length}</span> games
              {selectedSubject !== 'all' && (
                <> for <span className="font-bold">{subjectOptions.find(s => s.id === selectedSubject)?.label}</span></>
              )}
            </p>
          </div>
        )}

        {/* Subject Info */}
        <div className="mt-12 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">📚 Subjects Available</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
              <span className="text-4xl mb-2 block">📖</span>
              <p className="font-bold text-gray-800">English</p>
              <p className="text-sm text-gray-600">5 games</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <span className="text-4xl mb-2 block">🔢</span>
              <p className="font-bold text-gray-800">Math</p>
              <p className="text-sm text-gray-600">{allGames.filter(g => g.subjects.includes('math')).length} games</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <span className="text-4xl mb-2 block">🌍</span>
              <p className="font-bold text-gray-800">EVS</p>
              <p className="text-sm text-gray-600">Coming Soon</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
              <span className="text-4xl mb-2 block">🔬</span>
              <p className="font-bold text-gray-800">Science</p>
              <p className="text-sm text-gray-600">Coming Soon</p>
            </div>
          </div>
          <p className="text-center text-gray-500 mt-4 text-sm">
            💡 Filter by subject to see games in different categories.
          </p>
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">✨ Amazing Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <span className="text-4xl">🎮</span>
              <div>
                <p className="font-bold text-gray-800">Interactive Games</p>
                <p className="text-sm text-gray-600">Fun learning experiences</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
              <span className="text-4xl">🧠</span>
              <div>
                <p className="font-bold text-gray-800">Concept-Based</p>
                <p className="text-sm text-gray-600">Learn curriculum concepts</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <span className="text-4xl">⚡</span>
              <div>
                <p className="font-bold text-gray-800">Instant Feedback</p>
                <p className="text-sm text-gray-600">Hints & progress tracking</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
              <span className="text-4xl">🎲</span>
              <div>
                <p className="font-bold text-gray-800">Procedural Generation</p>
                <p className="text-sm text-gray-600">Unique questions every time!</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl">
              <span className="text-4xl">📊</span>
              <div>
                <p className="font-bold text-gray-800">Performance Tracking</p>
                <p className="text-sm text-gray-600">Detailed progress logs</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl">
              <span className="text-4xl">🏆</span>
              <div>
                <p className="font-bold text-gray-800">Difficulty Levels</p>
                <p className="text-sm text-gray-600">Easy to Master challenges</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-white">
          <p className="text-lg opacity-75">🚀 Built for Class 3 Learning</p>
          <p className="text-sm opacity-50 mt-2">Made with ❤️ for young learners</p>
        </div>
      </div>
    </div>
  );
};

export default GameSelector;

