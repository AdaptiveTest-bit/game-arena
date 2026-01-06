
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useTimeShapeLogicStore, TopicType, DifficultyType } from '@/app/store/useTimeShapeLogicStore';
import { submitTelemetry } from '@/app/utils/gameUtils';
import TimeShapeLogicCanvas from './TimeShapeLogicCanvas';
import { RotateCcw, CheckCircle, Trophy, ChevronRight, Clock, Shapes, BarChart, Lightbulb, ArrowRight } from 'lucide-react';

const TimeShapeLogicGame: React.FC = () => {
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
    consecutiveCorrect,
    showFeedback,
    answered,
    hintUsed,
    totalAnswered,
    correctAnswers,
    getTelemetryLog,
    getAccuracy,
  } = useTimeShapeLogicStore();

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'completed'>('menu');
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize game on mount
  useEffect(() => {
    if (gameState === 'menu') {
      startGame(1);
    }
  }, [gameState, startGame]);

  // Handle answer selection
  const handleAnswerSelect = useCallback((answerIndex: number) => {
    if (answered) return;
    selectAnswer(answerIndex);
    // Start countdown for next question (3 seconds)
    setCountdown(3);
  }, [answered, selectAnswer]);

  // Auto-advance countdown timer - handles decrementing countdown
  useEffect(() => {
    if (answered && showFeedback && countdown !== null && countdown > 0) {
      countdownRef.current = setTimeout(() => {
        setCountdown(prev => (prev !== null && prev > 1) ? prev - 1 : null);
      }, 1000);
    }

    return () => {
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
      }
    };
  }, [answered, showFeedback, countdown]);

  // Handle auto-advance when countdown reaches null
  useEffect(() => {
    if (countdown === null && answered && showFeedback) {
      nextQuestion();
    }
  }, [countdown, answered, showFeedback, nextQuestion]);

  // Handle next question manually
  const handleNextQuestion = useCallback(() => {
    if (countdownRef.current) {
      clearTimeout(countdownRef.current);
    }
    setCountdown(null);
    nextQuestion();
  }, [nextQuestion]);

  // Clear countdown when game is reset
  useEffect(() => {
    if (gameState === 'menu' && countdownRef.current) {
      clearTimeout(countdownRef.current);
      setCountdown(null);
    }
  }, [gameState]);

  // Handle hint
  const handleUseHint = useCallback(() => {
    if (!answered && !hintUsed && currentQuestion) {
      useHint();
    }
  }, [answered, hintUsed, currentQuestion, useHint]);

  // Submit telemetry on completion
  useEffect(() => {
    if (gameCompleted && gameState === 'playing') {
      const telemetryLog = getTelemetryLog();
      submitTelemetry(telemetryLog);
      setGameState('completed');
    }
  }, [gameCompleted, gameState, getTelemetryLog]);

  const handleStartLevel = (level: number) => {
    startGame(level);
    setGameState('playing');
  };

  const handleReset = () => {
    resetGame();
    setGameState('menu');
  };

  const handleContinue = () => {
    if (currentLevel < 4) {
      startGame(currentLevel + 1);
      setGameState('playing');
    } else {
      handleReset();
    }
  };

  const handleRetry = () => {
    retryLevel();
    setGameState('playing');
  };

  const progressPercent = (totalAnswered / 20) * 100;

  // Get topic icon
  const getTopicIcon = (topic: TopicType) => {
    switch (topic) {
      case 'time': return <Clock size={24} />;
      case 'shapes': return <Shapes size={24} />;
      case 'logic': return <BarChart size={24} />;
    }
  };

  const getTopicColor = (topic: TopicType) => {
    switch (topic) {
      case 'time': return 'from-blue-400 to-blue-600';
      case 'shapes': return 'from-purple-400 to-purple-600';
      case 'logic': return 'from-green-400 to-green-600';
    }
  };

  const getDifficultyColor = (difficulty: DifficultyType) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-orange-500';
      case 'master': return 'bg-red-500';
    }
  };

  const getDifficultyLabel = (difficulty: DifficultyType) => {
    switch (difficulty) {
      case 'easy': return '🟢 Easy';
      case 'medium': return '🟡 Medium';
      case 'hard': return '🔴 Hard';
      case 'master': return '🔵 Master';
    }
  };

  // Level selection menu
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-600 via-rose-600 to-orange-500 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-8xl mb-4">🕐</div>
            <h1 className="text-5xl font-bold text-white mb-4">Time, Shape & Logic World</h1>
            <p className="text-xl text-gray-100">
              Master Time, Shapes, and Data! 🧠
            </p>
          </div>

          {/* Topics Covered */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">📚 Syllabus Coverage</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                <div className="text-4xl mb-2">⏰</div>
                <h3 className="font-bold text-blue-800">Time</h3>
                <p className="text-sm text-blue-600">Clock reading, AM/PM, Duration, Calendar</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
                <div className="text-4xl mb-2">📐</div>
                <h3 className="font-bold text-purple-800">Shapes</h3>
                <p className="text-sm text-purple-600">2D/3D shapes, Faces, Edges, Vertices</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
                <div className="text-4xl mb-2">📊</div>
                <h3 className="font-bold text-green-800">Logic & Data</h3>
                <p className="text-sm text-green-600">Pictographs, Tables, Patterns</p>
              </div>
            </div>
          </div>

          {/* Level Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Level 1 */}
            <div 
              className="bg-white rounded-xl shadow-2xl overflow-hidden hover:scale-105 transition-transform cursor-pointer"
              onClick={() => handleStartLevel(1)}
            >
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-6 text-white">
                <div className="text-5xl mb-3">🌟</div>
                <h2 className="text-2xl font-bold">Level 1</h2>
                <p className="text-sm opacity-90">Easy</p>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Recognize & identify basics
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <span>20 questions</span>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">Pass: ≥90%</span>
                </div>
                <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors">
                  Start →</button>
              </div>
            </div>

            {/* Level 2 */}
            <div 
              className="bg-white rounded-xl shadow-2xl overflow-hidden hover:scale-105 transition-transform cursor-pointer"
              onClick={() => handleStartLevel(2)}
            >
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-white">
                <div className="text-5xl mb-3">🔥</div>
                <h2 className="text-2xl font-bold">Level 2</h2>
                <p className="text-sm opacity-90">Medium</p>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Apply concepts
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <span>20 questions</span>
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs">Pass: ≥90%</span>
                </div>
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors">
                  Start →</button>
              </div>
            </div>

            {/* Level 3 */}
            <div 
              className="bg-white rounded-xl shadow-2xl overflow-hidden hover:scale-105 transition-transform cursor-pointer"
              onClick={() => handleStartLevel(3)}
            >
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
                <div className="text-5xl mb-3">💪</div>
                <h2 className="text-2xl font-bold">Level 3</h2>
                <p className="text-sm opacity-90">Hard</p>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Multi-step reasoning
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <span>20 questions</span>
                  <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs">Pass: ≥90%</span>
                </div>
                <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-colors">
                  Start →</button>
              </div>
            </div>

            {/* Level 4 */}
            <div 
              className="bg-white rounded-xl shadow-2xl overflow-hidden hover:scale-105 transition-transform cursor-pointer"
              onClick={() => handleStartLevel(4)}
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                <div className="text-5xl mb-3">🏆</div>
                <h2 className="text-2xl font-bold">Level 4</h2>
                <p className="text-sm opacity-90">Master</p>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Real-life problem solving
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <span>20 questions</span>
                  <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">Pass: ≥90%</span>
                </div>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors">
                  Start →</button>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={handleReset}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} />
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-orange-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🕐 Time, Shape & Logic World</h1>
          <p className="text-lg text-gray-600">Level {currentLevel}: Test your knowledge!</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="text-gray-600">{totalAnswered} / 20</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-pink-400 to-rose-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">Pass requirement: ≥90% accuracy</p>
        </div>

        {/* Game Canvas Area */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {/* Stats Display */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-6">
              {/* Score */}
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 rounded-full p-4">
                  <span className="text-2xl font-bold text-yellow-600">{score}</span>
                </div>
                <p className="text-gray-700">
                  <span className="font-semibold">Score</span>
                </p>
              </div>

              {/* Streak */}
              <div className="flex items-center gap-3 border-l border-gray-300 pl-6">
                <div className={`rounded-full p-4 ${consecutiveCorrect > 2 ? 'bg-orange-100' : 'bg-gray-100'}`}>
                  <span className="text-2xl font-bold" style={{ color: consecutiveCorrect > 2 ? '#F39C12' : '#6B7280' }}>
                    🔥 {consecutiveCorrect}
                  </span>
                </div>
                <p className="text-gray-700">
                  <span className="font-semibold">Streak</span>
                </p>
              </div>
            </div>

            {/* Hint Button */}
            {!answered && currentQuestion && (
              <button
                onClick={handleUseHint}
                disabled={hintUsed}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                  hintUsed 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
                }`}
              >
                <Lightbulb size={20} />
                {hintUsed ? 'Used' : 'Hint (-20 pts)'}
              </button>
            )}

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <RotateCcw size={20} />
              Quit
            </button>
          </div>

          {/* Question Info */}
          {currentQuestion && (
            <div className="flex flex-wrap gap-4 mb-4">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getTopicColor(currentQuestion.topic)} text-white`}>
                {getTopicIcon(currentQuestion.topic)}
                <span className="font-semibold capitalize">{currentQuestion.topic}</span>
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getDifficultyColor(currentQuestion.difficulty)} text-white`}>
                <span>{getDifficultyLabel(currentQuestion.difficulty)}</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700">
                <span className="font-semibold">Skill: {currentQuestion.skill}</span>
              </div>
            </div>
          )}

          {/* Canvas */}
          <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
            <TimeShapeLogicCanvas 
              width={1000} 
              height={420} 
              onAnswerSelect={handleAnswerSelect}
              level={currentLevel}
            />
          </div>

          {/* Feedback Section */}
          {showFeedback && currentQuestion && (
            <div className={`mt-6 p-4 rounded-lg border ${
              selectedAnswer === currentQuestion.correctAnswer 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                {selectedAnswer === currentQuestion.correctAnswer ? (
                  <CheckCircle className="text-green-600" size={24} />
                ) : (
                  <div className="text-red-600 text-xl">❌</div>
                )}
                <span className={`font-bold ${selectedAnswer === currentQuestion.correctAnswer ? 'text-green-700' : 'text-red-700'}`}>
                  {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              <p className="text-gray-700 mb-2">
                <strong>Explanation:</strong> {currentQuestion.explanation}
              </p>
              {hintUsed && (
                <p className="text-yellow-700 text-sm">
                  💡 Hint was used for this question
                </p>
              )}
              
              {/* Next Question Button with Countdown */}
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  Next Question
                  <ArrowRight size={20} />
                </button>
                
                {countdown !== null && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="relative">
                      <svg className="w-10 h-10 transform -rotate-90">
                        <circle
                          cx="20"
                          cy="20"
                          r="16"
                          stroke="#e5e7eb"
                          strokeWidth="3"
                          fill="none"
                        />
                        <circle
                          cx="20"
                          cy="20"
                          r="16"
                          stroke="#ec4899"
                          strokeWidth="3"
                          fill="none"
                          strokeDasharray="100"
                          strokeDashoffset={100 - (countdown / 3) * 100}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-700">
                        {countdown}
                      </span>
                    </div>
                    <span className="text-sm">Auto-advance</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 p-4 bg-pink-50 rounded-lg border border-pink-200">
            <p className="text-sm text-pink-800">
              <strong>How to Play:</strong> Click on the correct answer! Build your streak for bonus points. 
              Use hints if stuck (costs 20 points).
            </p>
          </div>
        </div>

        {/* Completion Screen */}
        {gameState === 'completed' && (
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-pink-500">
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
                    Keep Practicing!
                  </h2>
                </>
              )}
            </div>

            {/* Pass/Fail Message */}
            <div className={`p-4 rounded-lg mb-6 ${passedLevel ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
              <p className={`text-lg font-semibold ${passedLevel ? 'text-green-700' : 'text-orange-700'}`}>
                {passedLevel 
                  ? 'Congratulations! You achieved ≥90% accuracy and qualified for the next level!' 
                  : `You scored ${(getAccuracy() * 100).toFixed(0)}% accuracy. You need ≥90% to pass. Don't give up!`}
              </p>
            </div>

            {/* Stats Display */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Accuracy</p>
                <p className="text-3xl font-bold text-green-600">
                  {(getAccuracy() * 100).toFixed(0)}%
                </p>
                <div className={`text-xs mt-1 ${getAccuracy() >= 0.9 ? 'text-green-600' : 'text-red-500'}`}>
                  {getAccuracy() >= 0.9 ? '✓ Passed' : '✗ Needs 90%'}
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Score</p>
                <p className="text-3xl font-bold text-yellow-600">{score}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Best Streak</p>
                <p className="text-3xl font-bold text-blue-600">{consecutiveCorrect}</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Correct/Total</p>
                <p className="text-3xl font-bold text-purple-600">{correctAnswers}/20</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {passedLevel ? (
                // Show Next Level button if passed
                currentLevel < 4 ? (
                  <button
                    onClick={handleContinue}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
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
                // Show Retry button if failed
                <button
                  onClick={handleRetry}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  🔄 Retry This Level
                </button>
              )}
              
              {/* Back to Menu button - always visible */}
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

export default TimeShapeLogicGame;


