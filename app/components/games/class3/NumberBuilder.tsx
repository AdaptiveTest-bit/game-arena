'use client';

import React, { useState, useEffect } from 'react';
import { useNumberBuilderStore } from '@/app/store/useNumberBuilderStore';
import { submitTelemetry } from '@/app/utils/gameUtils';
import { 
  RotateCcw, Trophy, ChevronRight, 
  Lightbulb, ArrowRight, Star, Hash
} from 'lucide-react';

const NumberBuilder: React.FC = () => {
  const {
    startGame, selectAnswer, nextQuestion, useHint,
    resetGame, retryLevel, gameCompleted, levelCompleted,
    passedLevel, currentLevel, currentQuestion, selectedAnswer,
    score, streak, bestStreak, showFeedback, answered,
    hintUsed, totalAnswered, correctAnswers, getTelemetryLog, getAccuracy,
  } = useNumberBuilderStore();

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

  const handleStartGame = (level: number) => {
    startGame(1, level);
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
      startGame(1, currentLevel + 1);
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

  useEffect(() => {
    if (gameCompleted && gameState === 'playing') {
      const telemetryLog = getTelemetryLog();
      submitTelemetry(telemetryLog);
      setGameState('completed');
    }
  }, [gameCompleted, gameState, getTelemetryLog]);

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-500 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">🔢</div>
            <h1 className="text-5xl font-bold text-white mb-4">Number Builder</h1>
            <p className="text-xl text-gray-100">Form Numbers & Understand Place Value! 📐</p>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">📖 What You'll Learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-100">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔢</span>
                <p>Form largest and smallest 3-digit numbers</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📊</span>
                <p>Write place value of digits</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📝</span>
                <p>Compare and order numbers</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔄</span>
                <p>Expand numbers</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 text-center">🎮 Choose Level</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { level: 1, icon: '🌟', color: 'green', desc: 'Basic number concepts' },
              { level: 2, icon: '📐', color: 'yellow', desc: 'Place value & ordering' },
              { level: 3, icon: '🏆', color: 'red', desc: 'Advanced problems' },
            ].map((level) => (
              <button
                key={level.level}
                onClick={() => handleStartGame(level.level)}
                className="bg-white rounded-xl shadow-2xl overflow-hidden hover:scale-105 transition-all text-left w-full"
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

  const progressPercent = (totalAnswered / 10) * 100;
  const isCorrect = currentQuestion && selectedAnswer && 
    selectedAnswer.toLowerCase().trim() === 
    (Array.isArray(currentQuestion.correctAnswer) 
      ? currentQuestion.correctAnswer[0].toLowerCase().trim()
      : currentQuestion.correctAnswer.toLowerCase().trim());

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setGameState('menu')}
            className="text-gray-600 hover:text-gray-800 mb-2 flex items-center gap-1"
          >
            ← Back to Menu
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            🔢 Number Builder
          </h1>
          <p className="text-lg text-gray-600">
            Level {currentLevel} | {getDifficultyLabel(currentLevel)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="text-gray-600">{totalAnswered} / 10</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-blue-400 to-purple-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">Pass requirement: ≥80% accuracy</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
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
                    hintUsed ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
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

          {currentQuestion && (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getDifficultyColor(currentLevel)} text-white`}>
                  <Star size={16} />
                  <span className="font-semibold">{currentQuestion.topic}</span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700">
                  <span className="font-semibold">{currentQuestion.points} pts</span>
                </div>
              </div>

              <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200 mb-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{currentQuestion.question}</h2>
                {hintUsed && !answered && (
                  <p className="text-yellow-700 mt-3 text-sm">💡 Hint: {currentQuestion.hint}</p>
                )}
              </div>

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
                          showCorrect ? 'bg-green-50 border-green-500' :
                          showWrong ? 'bg-red-50 border-red-500' :
                          isSelected ? 'bg-blue-50 border-blue-500' :
                          'bg-white border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          showCorrect ? 'bg-green-500 text-white' :
                          showWrong ? 'bg-red-500 text-white' :
                          isSelected ? 'bg-blue-500 text-white' :
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

              {currentQuestion.type === 'fill_blank' && (
                <div>
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
                    disabled={answered}
                    placeholder="Type your answer..."
                    className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    maxLength={100}
                  />
                  {!answered && (
                    <button
                      onClick={handleTextSubmit}
                      disabled={!textInput.trim()}
                      className="mt-3 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                      Submit Answer
                    </button>
                  )}
                </div>
              )}

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
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                  >
                    Next Question
                    <ArrowRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {gameState === 'completed' && (
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-500">
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
                  <h2 className="text-3xl font-bold text-orange-600">Keep Learning!</h2>
                </>
              )}
            </div>

            <div className={`p-4 rounded-lg mb-6 ${passedLevel ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
              <p className={`text-lg font-semibold ${passedLevel ? 'text-green-700' : 'text-orange-700'}`}>
                {passedLevel 
                  ? 'Excellent! You achieved ≥80% accuracy and qualify for the next level!' 
                  : `You scored ${(getAccuracy() * 100).toFixed(0)}% accuracy. You need ≥80% to pass. Keep trying!`}
              </p>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Accuracy</p>
                <p className="text-3xl font-bold text-green-600">{(getAccuracy() * 100).toFixed(0)}%</p>
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

            <div className="flex gap-4 flex-wrap">
              {passedLevel ? (
                currentLevel < 3 ? (
                  <button
                    onClick={handleContinue}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
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

export default NumberBuilder;

