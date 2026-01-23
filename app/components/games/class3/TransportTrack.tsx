'use client';

import React, { useState, useEffect } from 'react';
import { useTransportTrackStore } from '@/app/store/useTransportTrackStore';
import { submitTelemetry } from '@/app/utils/gameUtils';
import { 
  RotateCcw, Trophy, ChevronRight, 
  Lightbulb, ArrowRight, Star, Car,
  Ship, Plane, Anchor
} from 'lucide-react';

const TransportTrack: React.FC = () => {
  const {
    startGame,
    selectAnswer,
    nextQuestion,
    useHint,
    resetGame,
    retryLevel,
    gameCompleted,
    levelCompleted,
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
  } = useTransportTrackStore();

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'completed'>('menu');
  const [textInput, setTextInput] = useState('');

  const getDifficultyLabel = (level: number): string => {
    switch (level) {
      case 1: return '🟢 Easy';
      case 2: return '🟡 Medium';
      case 3: return '🔴 Hard';
      default: return '🟢 Easy';
    }
  };

  const getDifficultyColor = (level: number): string => {
    switch (level) {
      case 1: return 'from-green-400 to-emerald-500';
      case 2: return 'from-yellow-400 to-orange-500';
      case 3: return 'from-orange-500 to-red-500';
      default: return 'from-green-400 to-emerald-500';
    }
  };

  const getVehicleEmoji = (vehicle: string) => {
    const lower = vehicle.toLowerCase();
    if (lower.includes('car') || lower.includes('bus') || lower.includes('truck')) return '🚗';
    if (lower.includes('bicycle') || lower.includes('bike')) return '🚲';
    if (lower.includes('train') || lower.includes('rail')) return '🚂';
    if (lower.includes('ship') || lower.includes('boat') || lower.includes('ferry')) return '🚢';
    if (lower.includes('airplane') || lower.includes('plane')) return '✈️';
    if (lower.includes('helicopter')) return '🚁';
    if (lower.includes('submarine')) return '⚓';
    if (lower.includes('tractor')) return '🚜';
    if (lower.includes('auto')) return '🛺';
    return '🚗';
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'land': return <Car size={20} />;
      case 'water': return <Ship size={20} />;
      case 'air': return <Plane size={20} />;
      default: return <Anchor size={20} />;
    }
  };

  const handleStartGame = (level: number) => {
    startGame(6, level);
    setGameState('playing');
    setTextInput('');
  };

  const handleReset = () => {
    resetGame();
    setGameState('menu');
    setTextInput('');
  };

  const handleContinue = () => {
    if (currentLevel < 3) {
      startGame(6, currentLevel + 1);
      setGameState('playing');
      setTextInput('');
    } else {
      handleReset();
    }
  };

  const handleRetry = () => {
    retryLevel();
    setGameState('playing');
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

  // Submit telemetry on completion
  useEffect(() => {
    if (gameCompleted && gameState === 'playing') {
      const telemetryLog = getTelemetryLog();
      submitTelemetry(telemetryLog);
      setGameState('completed');
    }
  }, [gameCompleted, gameState, getTelemetryLog]);

  // Menu Screen
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">🚗</div>
            <h1 className="text-5xl font-bold text-white mb-4">Transport Track</h1>
            <p className="text-xl text-gray-100">
              Sort Vehicles & Compare Speed! 🚦
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">📖 What You'll Learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-100">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🚗</span>
                <p>Identify Land vehicles: Car, Bus, Train, Bicycle</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🚢</span>
                <p>Identify Water vehicles: Ship, Boat, Submarine</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✈️</span>
                <p>Identify Air vehicles: Airplane, Helicopter</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚡</span>
                <p>Compare fastest and slowest transport</p>
              </div>
            </div>
          </div>

          {/* Level Selection */}
          <h2 className="text-2xl font-bold text-white mb-6 text-center">🎮 Choose Level</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { level: 1, icon: '🚲', color: 'green', desc: 'Basic vehicle types' },
              { level: 2, icon: '🚦', color: 'yellow', desc: 'Classification & comparison' },
              { level: 3, icon: '🏆', color: 'red', desc: 'Advanced concepts' },
            ].map((level) => (
              <button
                key={level.level}
                onClick={() => handleStartGame(level.level)}
                className={`bg-white rounded-xl shadow-2xl overflow-hidden hover:scale-105 transition-all text-left w-full`}
              >
                <div className={`bg-gradient-to-r from-${level.color}-400 to-${level.color}-500 p-6 text-white`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">{level.icon}</span>
                    <h2 className="text-2xl font-bold">Level {level.level}</h2>
                  </div>
                  <p className="text-sm opacity-90">{level.desc}</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">10 questions to complete</p>
                  <p className="text-sm text-gray-500 mb-4">Pass: ≥80% accuracy</p>
                  <div className={`w-full bg-gradient-to-r from-${level.color}-500 to-${level.color}-600 text-white font-bold py-3 rounded-lg text-center`}>
                    Start →
                  </div>
                </div>
              </button>
            ))}
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
  const progressPercent = (totalAnswered / 10) * 100;
  const isCorrect = currentQuestion && selectedAnswer && 
    selectedAnswer.toLowerCase().trim() === 
    (Array.isArray(currentQuestion.correctAnswer) 
      ? currentQuestion.correctAnswer[0].toLowerCase().trim()
      : currentQuestion.correctAnswer.toLowerCase().trim());

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => setGameState('menu')}
            className="text-gray-600 hover:text-gray-800 mb-2 flex items-center gap-1"
          >
            ← Back to Menu
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            🚗 Transport Track
          </h1>
          <p className="text-lg text-gray-600">
            Level {currentLevel} | {getDifficultyLabel(currentLevel)}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="text-gray-600">{totalAnswered} / 10</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-purple-400 to-blue-500 h-4 rounded-full transition-all duration-500"
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
                  <span className="font-semibold">{currentQuestion.topic}</span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700">
                  <span className="font-semibold">{currentQuestion.points} pts</span>
                </div>
              </div>

              {/* Question Text */}
              <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200 mb-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{currentQuestion.question}</h2>
                {hintUsed && !answered && (
                  <p className="text-yellow-700 mt-3 text-sm">
                    💡 Hint: {currentQuestion.hint}
                  </p>
                )}
              </div>

              {/* MCQ Options */}
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
                                ? 'bg-purple-50 border-purple-500'
                                : 'bg-white border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <span className="text-2xl">{getVehicleEmoji(option)}</span>
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          showCorrect ? 'bg-green-500 text-white' :
                          showWrong ? 'bg-red-500 text-white' :
                          isSelected ? 'bg-purple-500 text-white' :
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
              {currentQuestion.type === 'fill_blank' && (
                <div>
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
                    disabled={answered}
                    placeholder="Type your answer..."
                    className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    maxLength={100}
                  />
                  {!answered && (
                    <button
                      onClick={handleTextSubmit}
                      disabled={!textInput.trim()}
                      className="mt-3 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                      Submit Answer
                    </button>
                  )}
                </div>
              )}

              {/* Classification */}
              {currentQuestion.type === 'classification' && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {['Land', 'Water', 'Air'].map((category) => (
                    <button
                      key={category}
                      onClick={() => handleOptionClick(category)}
                      disabled={answered}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedAnswer === category
                          ? 'bg-purple-50 border-purple-500'
                          : 'bg-white border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <span className="text-2xl block text-center mb-2">
                        {category === 'Land' ? '🚗' : category === 'Water' ? '🚢' : '✈️'}
                      </span>
                      <span className="font-semibold text-center block">{category}</span>
                    </button>
                  ))}
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
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
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
        {gameState === 'completed' && (
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-purple-500">
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
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Correct/Total</p>
                <p className="text-3xl font-bold text-purple-600">{correctAnswers}/10</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 flex-wrap">
              {passedLevel ? (
                currentLevel < 3 ? (
                  <button
                    onClick={handleContinue}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
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
                className={`${passedLevel && currentLevel < 3 ? 'flex-1' : 'w-full'} bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors`}
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

export default TransportTrack;

