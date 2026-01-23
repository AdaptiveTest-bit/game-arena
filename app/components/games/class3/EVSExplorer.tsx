'use client';

import React, { useState } from 'react';
import { useEVSExplorerStore, EVSGameType } from '@/app/store/useEVSExplorerStore';
import { submitTelemetry } from '@/app/utils/gameUtils';
import { 
  RotateCcw, Trophy, ChevronRight, 
  Users, TreeDeciduous, Home, Globe, Mountain,
  Lightbulb, ArrowRight, Star, Heart
} from 'lucide-react';

type EVSCategoryType = 'my-life' | 'nature-quest' | 'food-home' | 'travel-culture';

interface EVSCategory {
  id: EVSCategoryType;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  description: string;
  topics: string[];
}

const evsCategories: EVSCategory[] = [
  {
    id: 'my-life',
    title: 'My Life Explorer',
    subtitle: 'Family & Daily Life',
    emoji: '👨‍👩‍👧‍👦',
    color: 'pink',
    gradientFrom: 'from-pink-400',
    gradientTo: 'to-rose-500',
    description: 'Learn about family, friends, feelings & daily life',
    topics: ['Family Members', 'Daily Routine', 'Feelings', 'Community Helpers'],
  },
  {
    id: 'nature-quest',
    title: 'Nature Quest',
    subtitle: 'Plants & Animals',
    emoji: '🌿',
    color: 'green',
    gradientFrom: 'from-green-400',
    gradientTo: 'to-emerald-500',
    description: 'Discover plants, animals & the environment',
    topics: ['Plants', 'Animals', 'Water Cycle', 'Food Chains'],
  },
  {
    id: 'food-home',
    title: 'Food & Home World',
    subtitle: 'Food & Shelter',
    emoji: '🏠',
    color: 'orange',
    gradientFrom: 'from-orange-400',
    gradientTo: 'to-amber-500',
    description: 'Learn about food, homes & weather',
    topics: ['Food Sources', 'Types of Houses', 'Weather', 'Clothing'],
  },
  {
    id: 'travel-culture',
    title: 'Travel & Culture',
    subtitle: 'Transport & Communication',
    emoji: '✈️',
    color: 'blue',
    gradientFrom: 'from-blue-400',
    gradientTo: 'to-indigo-500',
    description: 'Explore transport & communication',
    topics: ['Transport Types', 'Communication', 'Directions', 'Places'],
  },
];

const EVSExplorer: React.FC = () => {
  const {
    startGame,
    selectAnswer,
    nextQuestion,
    useHint,
    resetGame,
    retryLevel,
    gameCompleted,
    passedLevel,
    currentLevel,
    currentQuestion,
    selectedAnswer,
    score,
    streak,
    bestStreak,
    showFeedback,
    answered,
    hintUsed,
    totalAnswered,
    correctAnswers,
    getTelemetryLog,
    getAccuracy,
  } = useEVSExplorerStore();

  const [view, setView] = useState<'categories' | 'playing' | 'completed'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<EVSCategoryType>('my-life');
  const [textInput, setTextInput] = useState('');

  const getDifficultyLabel = (level: number): string => {
    switch (level) {
      case 1: return '🟢 Easy';
      case 2: return '🟡 Medium';
      case 3: return '🔴 Hard';
      case 4: return '🏆 Adventure';
      default: return '🟢 Easy';
    }
  };

  const getDifficultyColor = (level: number): string => {
    switch (level) {
      case 1: return 'from-green-400 to-emerald-500';
      case 2: return 'from-yellow-400 to-orange-500';
      case 3: return 'from-orange-500 to-red-500';
      case 4: return 'from-purple-500 to-pink-500';
      default: return 'from-green-400 to-emerald-500';
    }
  };

  const handleStartCategory = (categoryId: EVSCategoryType, level: number) => {
    setSelectedCategory(categoryId);
    startGame(categoryId as EVSGameType, level);
    setView('playing');
    setTextInput('');
  };

  const handleReset = () => {
    resetGame();
    setView('categories');
    setTextInput('');
  };

  const handleContinue = () => {
    if (currentLevel < 4) {
      startGame(selectedCategory as EVSGameType, currentLevel + 1);
      setView('playing');
      setTextInput('');
    } else {
      handleReset();
    }
  };

  const handleRetry = () => {
    retryLevel();
    setView('playing');
    setTextInput('');
  };

  const handleOptionClick = (option: string) => {
    if (answered) return;
    selectAnswer(option);
  };

  const handleTextSubmit = () => {
    if (textInput.trim() && !answered) {
      selectAnswer(textInput.trim());
    }
  };

  React.useEffect(() => {
    if (gameCompleted && view === 'playing') {
      const telemetryLog = getTelemetryLog();
      submitTelemetry(telemetryLog);
      setView('completed');
    }
  }, [gameCompleted, view, getTelemetryLog]);

  // Categories Menu
  if (view === 'categories') {
    const category = evsCategories.find(c => c.id === selectedCategory);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-500 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">🌍</div>
            <h1 className="text-5xl font-bold text-white mb-4">EVS World</h1>
            <p className="text-xl text-gray-100">
              Discover My World & Nature! 🌿
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {evsCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleStartCategory(cat.id, 1)}
                className="bg-white rounded-xl shadow-2xl overflow-hidden hover:scale-105 transition-all text-left w-full"
              >
                <div className={`bg-gradient-to-r ${cat.gradientFrom} ${cat.gradientTo} p-6 text-white`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">{cat.emoji}</span>
                    <h2 className="text-xl font-bold">{cat.title}</h2>
                  </div>
                  <p className="text-sm opacity-90">{cat.subtitle}</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-3">{cat.description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {cat.topics.map((topic) => (
                      <span key={topic} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {topic}
                      </span>
                    ))}
                  </div>
                  <div className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold py-3 rounded-lg text-center">
                    🟢 Level 1: Easy
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Adventure Mode */}
          <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-xl shadow-2xl overflow-hidden mb-8">
            <div className="p-8 text-white text-center">
              <div className="flex justify-center mb-4">
                <Mountain size={64} className="text-yellow-300" />
              </div>
              <h2 className="text-3xl font-bold mb-2">🏆 Grand EVS Adventure</h2>
              <p className="text-lg opacity-90 mb-4">Questions from ALL EVS topics!</p>
              <p className="text-sm opacity-75 mb-4">Test everything you learned across all categories</p>
              <button
                onClick={() => handleStartCategory('my-life', 4)}
                className="bg-white text-purple-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors"
              >
                🚀 Start Adventure (Level 4)
              </button>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={handleReset}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} />
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  // Playing Screen
  const progressPercent = (totalAnswered / 15) * 100;
  const isCorrect = currentQuestion && selectedAnswer && 
    selectedAnswer.toLowerCase().trim() === 
    (Array.isArray(currentQuestion.correctAnswer) 
      ? currentQuestion.correctAnswer[0].toLowerCase().trim()
      : currentQuestion.correctAnswer.toLowerCase().trim());

  const category = evsCategories.find(c => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-emerald-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => setView('categories')}
            className="text-gray-600 hover:text-gray-800 mb-2 flex items-center gap-1"
          >
            ← Back to Categories
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span className="text-2xl">{category?.emoji}</span>
            {category?.title}
          </h1>
          <p className="text-lg text-gray-600">
            Level {currentLevel} | {getDifficultyLabel(currentLevel)}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="text-gray-600">{totalAnswered} / 15</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-teal-400 to-emerald-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">Pass requirement: ≥80% accuracy</p>
        </div>

        {/* Game Content */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {/* Stats */}
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg">
                <span className="text-2xl font-bold text-yellow-600">{score}</span>
                <span className="text-gray-600">Score</span>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${streak > 2 ? 'bg-orange-50' : 'bg-gray-50'}`}>
                <span className="text-2xl font-bold" style={{ color: streak > 2 ? '#F39C12' : '#6B7280' }}>
                  🔥 {streak}
                </span>
                <span className="text-gray-600">Streak</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-xl font-bold text-blue-600">🏆 {bestStreak}</span>
                <span className="text-gray-600">Best</span>
              </div>
            </div>
            <div className="flex gap-2">
              {!answered && currentQuestion && (
                <button
                  onClick={useHint}
                  disabled={hintUsed}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    hintUsed 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
                  }`}
                >
                  <Lightbulb size={20} />
                  {hintUsed ? 'Used' : 'Hint (-5 pts)'}
                </button>
              )}
              <button
                onClick={handleReset}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <RotateCcw size={18} />
                Quit
              </button>
            </div>
          </div>

          {/* Question */}
          {currentQuestion && (
            <>
              {/* Question Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getDifficultyColor(currentLevel)} text-white`}>
                  <Star size={16} />
                  <span className="font-semibold">{currentQuestion.chapter}</span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700">
                  <span className="font-semibold">{currentQuestion.points} pts</span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700">
                  <span className="font-semibold">{currentQuestion.topic}</span>
                </div>
              </div>

              {/* Question Text */}
              <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200 mb-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{currentQuestion.question}</h2>
                {currentQuestion.questionHindi && (
                  <p className="text-lg text-gray-600 mt-2">{currentQuestion.questionHindi}</p>
                )}
                {hintUsed && !answered && (
                  <p className="text-yellow-700 mt-3 text-sm">
                    💡 Hint: {currentQuestion.hint}
                  </p>
                )}
              </div>

              {/* Options */}
              {currentQuestion.type === 'mcq' && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedAnswer === option;
                    const isOptionCorrect = option === currentQuestion.correctAnswer;
                    const showCorrect = answered && isOptionCorrect;
                    const showWrong = answered && isSelected && !isOptionCorrect;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(option)}
                        disabled={answered}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                          showCorrect 
                            ? 'bg-green-50 border-green-500' 
                            : showWrong 
                              ? 'bg-red-50 border-red-500'
                              : isSelected 
                                ? 'bg-teal-50 border-teal-500'
                                : 'bg-white border-gray-200 hover:border-teal-300'
                        }`}
                      >
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          showCorrect ? 'bg-green-500 text-white' :
                          showWrong ? 'bg-red-500 text-white' :
                          isSelected ? 'bg-teal-500 text-white' :
                          'bg-gray-200 text-gray-700'
                        }`}>
                          {showCorrect ? '✓' : showWrong ? '✗' : String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1">{option}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Fill in the blank */}
              {(currentQuestion.type === 'fill_blank' || currentQuestion.type === 'true_false' || currentQuestion.type === 'sequence') && (
                <div>
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
                    disabled={answered}
                    placeholder="Type your answer..."
                    className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
                    maxLength={100}
                  />
                  {!answered && (
                    <button
                      onClick={handleTextSubmit}
                      disabled={!textInput.trim()}
                      className="mt-3 w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                      Submit Answer
                    </button>
                  )}
                  {answered && (
                    <div className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
                      <p className="font-semibold mb-2">
                        {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
                      </p>
                      <p>Answer: {Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer[0] : currentQuestion.correctAnswer}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Feedback Section */}
              {showFeedback && (
                <div className="mt-6 space-y-4">
                  <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <h3 className={`font-bold mb-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {isCorrect ? '🎉 Correct!' : '📚 Learning Moment'}
                    </h3>
                    <p className="text-gray-700">{currentQuestion.explanation}</p>
                  </div>
                  <button
                    onClick={nextQuestion}
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                  >
                    Next Question
                    <ArrowRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Completion Screen */}
        {view === 'completed' && (
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-teal-500">
            {/* Pass/Fail Header */}
            <div className="flex items-center gap-4 mb-6">
              {passedLevel ? (
                <>
                  <Trophy size={48} className="text-yellow-500" />
                  <h2 className="text-3xl font-bold text-green-600">
                    🎉 Level {currentLevel} Complete!
                  </h2>
                </>
              ) : (
                <>
                  <div className="text-5xl">💪</div>
                  <h2 className="text-3xl font-bold text-orange-600">
                    Keep Learning!
                  </h2>
                </>
              )}
            </div>

            {/* Pass/Fail Message */}
            <div className={`p-4 rounded-lg mb-6 ${passedLevel ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
              <p className={`text-lg font-semibold ${passedLevel ? 'text-green-700' : 'text-orange-700'}`}>
                {passedLevel 
                  ? 'Excellent! You achieved ≥80% accuracy and qualify for the next level!' 
                  : `You scored ${(getAccuracy() * 100).toFixed(0)}% accuracy. You need ≥80% to pass. Keep trying!`}
              </p>
            </div>

            {/* Stats Display */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Accuracy</p>
                <p className="text-3xl font-bold text-green-600">
                  {(getAccuracy() * 100).toFixed(0)}%
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Score</p>
                <p className="text-3xl font-bold text-yellow-600">{score}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Best Streak</p>
                <p className="text-3xl font-bold text-blue-600">{bestStreak}</p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Correct/Total</p>
                <p className="text-3xl font-bold text-teal-600">{correctAnswers}/15</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 flex-wrap">
              {passedLevel ? (
                currentLevel < 4 ? (
                  <button
                    onClick={handleContinue}
                    className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    Next Level <ChevronRight size={20} />
                  </button>
                ) : (
                  <button
                    onClick={handleReset}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition-colors"
                  >
                    Complete All Levels! 🎉
                  </button>
                )
              ) : (
                <button
                  onClick={handleRetry}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  🔄 Try Again
                </button>
              )}
              
              <button
                onClick={handleReset}
                className={`${passedLevel && currentLevel < 4 ? 'flex-1' : 'w-full'} bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors`}
              >
                Back to Menu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EVSExplorer;

