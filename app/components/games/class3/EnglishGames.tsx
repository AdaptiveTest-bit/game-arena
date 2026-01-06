'use client';

import React, { useState } from 'react';
import { useEnglishGamesStore, GameType } from '@/app/store/useEnglishGamesStore';
import { submitTelemetry } from '@/app/utils/gameUtils';
import { 
  RotateCcw, Trophy, ChevronRight, 
  BookOpen, Lightbulb, ArrowRight, Star, Heart,
  Brain, MessageCircle, Target
} from 'lucide-react';

const EnglishGames: React.FC = () => {
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
  } = useEnglishGamesStore();

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'completed'>('menu');
  const [selectedGameType, setSelectedGameType] = useState<GameType>('story');
  const [textInput, setTextInput] = useState('');

  const getDifficultyLabel = (level: number): string => {
    switch (level) {
      case 1: return '🟢 Easy';
      case 2: return '🟡 Medium';
      case 3: return '🔴 Hard';
      case 4: return '🏆 Master';
      default: return '🟢 Easy';
    }
  };

  const getDifficultyColor = (level: number): string => {
    switch (level) {
      case 1: return 'from-green-400 to-emerald-500';
      case 2: return 'from-yellow-400 to-orange-500';
      case 3: return 'from-orange-500 to-red-500';
      case 4: return 'from-blue-500 to-purple-600';
      default: return 'from-green-400 to-emerald-500';
    }
  };

  const getGameTitle = (type: GameType): string => {
    switch (type) {
      case 'story': return 'Story Explorer';
      case 'vocabulary': return 'Word Detective';
      case 'grammar': return 'Grammar Builder';
      case 'comprehension': return 'Think & Tell';
      case 'moral': return 'Moral Mapper';
    }
  };

  const getGameIcon = (type: GameType) => {
    switch (type) {
      case 'story': return <BookOpen size={28} />;
      case 'vocabulary': return <Target size={28} />;
      case 'grammar': return <Brain size={28} />;
      case 'comprehension': return <MessageCircle size={28} />;
      case 'moral': return <Heart size={28} />;
    }
  };

  const handleStartGame = (gameType: GameType, level: number) => {
    setSelectedGameType(gameType);
    startGame(gameType, level);
    setGameState('playing');
    setTextInput('');
  };

  const handleReset = () => {
    resetGame();
    setGameState('menu');
    setTextInput('');
  };

  const handleContinue = () => {
    if (currentLevel < 4) {
      startGame(selectedGameType, currentLevel + 1);
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
  React.useEffect(() => {
    if (gameCompleted && gameState === 'playing') {
      const telemetryLog = getTelemetryLog();
      submitTelemetry(telemetryLog);
      setGameState('completed');
    }
  }, [gameCompleted, gameState, getTelemetryLog]);

  // Menu Screen
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">📚</div>
            <h1 className="text-5xl font-bold text-white mb-4">English World</h1>
            <p className="text-xl text-gray-100">
              Master Stories, Words & Grammar! 🧠
            </p>
          </div>

          {/* Game Type Selection */}
          <h2 className="text-2xl font-bold text-white mb-6 text-center">🎮 Choose Your Game</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              { type: 'story' as GameType, icon: BookOpen, color: 'blue', desc: 'Sequence events & understand stories' },
              { type: 'vocabulary' as GameType, icon: Target, color: 'green', desc: 'Learn word meanings & usage' },
              { type: 'grammar' as GameType, icon: Brain, color: 'purple', desc: 'Master nouns, verbs & sentences' },
              { type: 'comprehension' as GameType, icon: MessageCircle, color: 'orange', desc: 'Hard reading & thinking questions' },
              { type: 'moral' as GameType, icon: Heart, color: 'pink', desc: 'Values & life lessons' },
            ].map((game) => (
              <button
                key={game.type}
                onClick={() => handleStartGame(game.type, 1)}
                className={`bg-white rounded-xl shadow-2xl overflow-hidden hover:scale-105 transition-all text-left w-full`}
              >
                <div className={`bg-gradient-to-r from-${game.color}-400 to-${game.color}-500 p-6 text-white`}>
                  <div className="flex items-center gap-3 mb-2">
                    <game.icon size={32} />
                    <h2 className="text-2xl font-bold">{getGameTitle(game.type)}</h2>
                  </div>
                  <p className="text-sm opacity-90">Level 1: Easy</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{game.desc}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <span>20 questions</span>
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">Pass: ≥90%</span>
                  </div>
                  <div className={`w-full bg-gradient-to-r from-${game.color}-500 to-${game.color}-600 hover:from-${game.color}-600 hover:to-${game.color}-700 text-white font-bold py-3 rounded-lg transition-colors text-center cursor-pointer`}>
                    Start →
                  </div>
                </div>
              </button>
            ))}

            {/* Adventure Mode */}
            <button
              onClick={() => handleStartGame('story', 4)}
              className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-xl shadow-2xl overflow-hidden hover:scale-105 transition-all"
            >
              <div className="p-6 text-white text-center">
                <div className="flex justify-center mb-2">
                  <Trophy size={48} className="text-yellow-300" />
                </div>
                <h2 className="text-2xl font-bold mb-2">🏆 Adventure Mode</h2>
                <p className="text-sm opacity-90">Master all skills!</p>
                <p className="text-xs mt-2">Mix of all game types</p>
              </div>
            </button>
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
  const progressPercent = (totalAnswered / 20) * 100;
  const isCorrect = currentQuestion && selectedAnswer && 
    selectedAnswer.toLowerCase().trim() === 
    (Array.isArray(currentQuestion.correctAnswer) 
      ? currentQuestion.correctAnswer[0].toLowerCase().trim()
      : currentQuestion.correctAnswer.toLowerCase().trim());

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            {getGameIcon(selectedGameType)} {getGameTitle(selectedGameType)}
          </h1>
          <p className="text-lg text-gray-600">
            Level {currentLevel} | {getDifficultyLabel(currentLevel)}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="text-gray-600">{totalAnswered} / 20</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-indigo-400 to-purple-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">Pass requirement: ≥90% accuracy</p>
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
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${consecutiveCorrect > 2 ? 'bg-orange-50' : 'bg-gray-50'}`}>
                <span className="text-2xl font-bold" style={{ color: consecutiveCorrect > 2 ? '#F39C12' : '#6B7280' }}>
                  🔥 {consecutiveCorrect}
                </span>
                <span className="text-gray-600">Streak</span>
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
                  {hintUsed ? 'Used' : 'Hint (-10 pts)'}
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
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700">
                  <span className="font-semibold">{currentQuestion.points} pts</span>
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
                                ? 'bg-indigo-50 border-indigo-500'
                                : 'bg-white border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          showCorrect ? 'bg-green-500 text-white' :
                          showWrong ? 'bg-red-500 text-white' :
                          isSelected ? 'bg-indigo-500 text-white' :
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
              {(currentQuestion.type === 'fill_blank' || currentQuestion.type === 'true_false') && (
                <div>
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
                    disabled={answered}
                    placeholder="Type your answer..."
                    className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                    maxLength={100}
                  />
                  {!answered && (
                    <button
                      onClick={handleTextSubmit}
                      disabled={!textInput.trim()}
                      className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-lg transition-colors"
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

              {/* Next Button */}
              {showFeedback && (
                <button
                  onClick={nextQuestion}
                  className="mt-6 w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  Next Question
                  <ArrowRight size={20} />
                </button>
              )}
            </>
          )}
        </div>

        {/* Completion Screen */}
        {gameState === 'completed' && (
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-indigo-500">
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
                  : `You scored ${(getAccuracy() * 100).toFixed(0)}% accuracy. You need ≥90% to pass. Do not give up!`}
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
                <p className="text-3xl font-bold text-blue-600">{consecutiveCorrect}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Correct/Total</p>
                <p className="text-3xl font-bold text-purple-600">{correctAnswers}/20</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 flex-wrap">
              {passedLevel ? (
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
                <button
                  onClick={handleRetry}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  🔄 Retry This Level
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

export default EnglishGames;

