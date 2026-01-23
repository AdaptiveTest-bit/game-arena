'use client';

import React, { useState } from 'react';
import { useHindiGamesStore, HindiGameType } from '@/app/store/useHindiGamesStore';
import { submitTelemetry } from '@/app/utils/gameUtils';
import { 
  RotateCcw, Trophy, ChevronRight, 
  BookOpen, Lightbulb, ArrowRight, Star, Heart,
  Brain, MessageCircle, Target
} from 'lucide-react';

interface HindiGamesProps {
  initialGameType?: HindiGameType;
  initialLevel?: number;
  autoStart?: boolean;
}

const HindiGames: React.FC<HindiGamesProps> = ({
  initialGameType = 'story',
  initialLevel = 1,
  autoStart = false,
}) => {
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
  } = useHindiGamesStore();

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'completed'>(autoStart ? 'playing' : 'menu');
  const [selectedGameType, setSelectedGameType] = useState<HindiGameType>(initialGameType);
  const [textInput, setTextInput] = useState('');
  const [matchSelections, setMatchSelections] = useState<Record<string, string>>({});
  const [sequenceOrder, setSequenceOrder] = useState<string[]>([]);
  const [autoInitDone, setAutoInitDone] = useState(false);

  // Auto start when launched from GameSelector
  React.useEffect(() => {
    if (!autoStart || autoInitDone) return;
    setSelectedGameType(initialGameType);
    startGame(initialGameType, initialLevel);
    setGameState('playing');
    setTextInput('');
    setMatchSelections({});
    setSequenceOrder([]);
    setAutoInitDone(true);
  }, [autoStart, autoInitDone, initialGameType, initialLevel, startGame]);

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
      case 4: return 'from-orange-500 to-red-600';
      default: return 'from-green-400 to-emerald-500';
    }
  };

  const getGameTitle = (type: HindiGameType): string => {
    switch (type) {
      case 'story': return 'कहानी संसार';
      case 'vocabulary': return 'शब्द शक्ति';
      case 'grammar': return 'वाक्य निर्माता';
      case 'comprehension': return 'सोचो और बताओ';
      case 'moral': return 'मूल्य और जीवन';
    }
  };

  const getGameIcon = (type: HindiGameType) => {
    switch (type) {
      case 'story': return <BookOpen size={28} />;
      case 'vocabulary': return <Target size={28} />;
      case 'grammar': return <Brain size={28} />;
      case 'comprehension': return <MessageCircle size={28} />;
      case 'moral': return <Heart size={28} />;
    }
  };

  const handleStartGame = (gameType: HindiGameType, level: number) => {
    setSelectedGameType(gameType);
    startGame(gameType, level);
    setGameState('playing');
    setTextInput('');
    setMatchSelections({});
    setSequenceOrder([]);
  };

  const handleReset = () => {
    resetGame();
    setGameState('menu');
    setTextInput('');
    setMatchSelections({});
    setSequenceOrder([]);
  };

  const handleContinue = () => {
    if (currentLevel < 4) {
      startGame(selectedGameType, currentLevel + 1);
      setGameState('playing');
      setTextInput('');
      setMatchSelections({});
      setSequenceOrder([]);
    } else {
      handleReset();
    }
  };

  const handleRetry = () => {
    retryLevel();
    setGameState('playing');
    setTextInput('');
    setMatchSelections({});
    setSequenceOrder([]);
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

  const handleMatchClick = (left: string, right: string) => {
    if (answered) return;
    const newSelections = { ...matchSelections, [left]: right };
    setMatchSelections(newSelections);
    
    // Auto-submit when all pairs are matched
    if (currentQuestion?.matchPairs && 
        Object.keys(newSelections).length === currentQuestion.matchPairs.length) {
      const matchString = Object.entries(newSelections)
        .map(([l, r]) => `${l}-${r}`)
        .join(', ');
      selectAnswer(matchString);
    }
  };

  const handleSequenceClick = (item: string) => {
    if (answered) return;
    if (sequenceOrder.includes(item)) {
      setSequenceOrder(sequenceOrder.filter(i => i !== item));
    } else {
      setSequenceOrder([...sequenceOrder, item]);
    }
  };

  const handleSequenceSubmit = () => {
    if (answered || !currentQuestion) return;
    const sequenceString = sequenceOrder.join(', ');
    selectAnswer(sequenceString);
  };

  const handleArrangeClick = (item: string, index: number) => {
    if (answered) return;
    const newOrder = [...sequenceOrder];
    if (newOrder.includes(item)) {
      newOrder.splice(newOrder.indexOf(item), 1);
    } else {
      newOrder.push(item);
    }
    setSequenceOrder(newOrder);
  };

  const handleArrangeSubmit = () => {
    if (answered || !currentQuestion) return;
    const arrangeString = sequenceOrder.join(', ');
    selectAnswer(arrangeString);
  };

  // Submit telemetry on completion
  React.useEffect(() => {
    if (gameCompleted && gameState === 'playing') {
      const telemetryLog = getTelemetryLog();
      submitTelemetry(telemetryLog);
      setGameState('completed');
    }
  }, [gameCompleted, gameState, getTelemetryLog]);

  // Reset match and sequence when question changes
  React.useEffect(() => {
    if (currentQuestion) {
      setMatchSelections({});
      setSequenceOrder([]);
    }
  }, [currentQuestion]);

  // Menu Screen
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-pink-500 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">📚</div>
            <h1 className="text-5xl font-bold text-white mb-4">हिंदी संसार</h1>
            <p className="text-xl text-gray-100">
              कहानी, शब्द और व्याकरण सीखें! 🧠
            </p>
          </div>

          {/* Game Type Selection */}
          <h2 className="text-2xl font-bold text-white mb-6 text-center">🎮 अपना खेल चुनें</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              { type: 'story' as HindiGameType, icon: BookOpen, color: 'blue', desc: 'घटनाएँ क्रम में रखो और कहानी समझो' },
              { type: 'vocabulary' as HindiGameType, icon: Target, color: 'green', desc: 'शब्द अर्थ और प्रयोग सीखें' },
              { type: 'grammar' as HindiGameType, icon: Brain, color: 'purple', desc: 'संज्ञा, क्रिया और वाक्य सीखें' },
              { type: 'comprehension' as HindiGameType, icon: MessageCircle, color: 'orange', desc: 'कठिन पढ़ना और सोचना' },
              { type: 'moral' as HindiGameType, icon: Heart, color: 'pink', desc: 'मूल्य और जीवन सबक' },
            ].map((game) => (
              <button
                key={game.type}
                onClick={() => handleStartGame(game.type, 1)}
                className="bg-white rounded-xl shadow-2xl overflow-hidden hover:scale-105 transition-all text-left w-full"
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
                    <span>15 questions</span>
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">Pass: ≥80%</span>
                  </div>
                  <div className={`w-full bg-gradient-to-r from-${game.color}-500 to-${game.color}-600 hover:from-${game.color}-600 hover:to-${game.color}-700 text-white font-bold py-3 rounded-lg transition-colors text-center cursor-pointer`}>
                    शुरू करें →
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
                <h2 className="text-2xl font-bold mb-2">🏆 एडवेंचर मोड</h2>
                <p className="text-sm opacity-90">सभी कौशल मास्टर करें!</p>
                <p className="text-xs mt-2">सभी खेल प्रकारों का मिश्रण</p>
              </div>
            </button>
          </div>

          {/* Back Button */}
          <button
            onClick={handleReset}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} />
            मेनू पर वापस
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-red-100 p-8">
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
            <span className="text-gray-600">{totalAnswered} / 15</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-orange-400 to-red-500 h-4 rounded-full transition-all duration-500"
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
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700">
                  <span className="font-semibold">{currentQuestion.points} pts</span>
                </div>
              </div>

              {/* Question Text */}
              <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200 mb-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{currentQuestion.question}</h2>
                {currentQuestion.questionEnglish && (
                  <p className="text-lg text-gray-600 mt-2">{currentQuestion.questionEnglish}</p>
                )}
                {hintUsed && !answered && (
                  <p className="text-yellow-700 mt-3 text-sm">
                    💡 Hint: {currentQuestion.hint}
                  </p>
                )}
              </div>

              {/* Match Type */}
              {currentQuestion.type === 'match' && currentQuestion.matchPairs && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-bold mb-2">बाएँ</h3>
                      {currentQuestion.matchPairs.map((pair, idx) => (
                        <button
                          key={`left-${idx}`}
                          onClick={() => {
                            const selectedRight = matchSelections[pair.left];
                            if (!answered) {
                              if (selectedRight) {
                                const newSelections = { ...matchSelections };
                                delete newSelections[pair.left];
                                setMatchSelections(newSelections);
                              }
                            }
                          }}
                          disabled={answered}
                          className={`w-full p-3 mb-2 rounded-lg border-2 text-left ${
                            matchSelections[pair.left]
                              ? 'bg-orange-100 border-orange-500'
                              : 'bg-white border-gray-200 hover:border-orange-300'
                          }`}
                        >
                          {pair.left}
                        </button>
                      ))}
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">दाएँ</h3>
                      {currentQuestion.matchPairs.map((pair, idx) => (
                        <button
                          key={`right-${idx}`}
                          onClick={() => !answered && handleMatchClick(pair.left, pair.right)}
                          disabled={answered || Object.values(matchSelections).includes(pair.right)}
                          className={`w-full p-3 mb-2 rounded-lg border-2 text-left ${
                            Object.values(matchSelections).includes(pair.right)
                              ? 'bg-orange-100 border-orange-500'
                              : 'bg-white border-gray-200 hover:border-orange-300'
                          }`}
                        >
                          {pair.right}
                        </button>
                      ))}
                    </div>
                  </div>
                  {Object.keys(matchSelections).length === currentQuestion.matchPairs.length && !answered && (
                    <button
                      onClick={() => {
                        const matchString = Object.entries(matchSelections)
                          .map(([l, r]) => `${l}-${r}`)
                          .join(', ');
                        selectAnswer(matchString);
                      }}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                      Submit Match
                    </button>
                  )}
                </div>
              )}

              {/* Sequence Type */}
              {currentQuestion.type === 'sequence' && currentQuestion.sequence && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {currentQuestion.sequence.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSequenceClick(item)}
                        disabled={answered}
                        className={`w-full p-4 rounded-lg border-2 text-left ${
                          sequenceOrder.includes(item)
                            ? 'bg-orange-100 border-orange-500'
                            : 'bg-white border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <span className="mr-3 font-bold">{sequenceOrder.indexOf(item) + 1 || '?'}</span>
                        {item}
                      </button>
                    ))}
                  </div>
                  {sequenceOrder.length === currentQuestion.sequence.length && !answered && (
                    <button
                      onClick={handleSequenceSubmit}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                      Submit Sequence
                    </button>
                  )}
                </div>
              )}

              {/* Arrange Type */}
              {currentQuestion.type === 'arrange' && currentQuestion.options && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {currentQuestion.options.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleArrangeClick(item, idx)}
                        disabled={answered}
                        className={`w-full p-4 rounded-lg border-2 text-left ${
                          sequenceOrder.includes(item)
                            ? 'bg-orange-100 border-orange-500'
                            : 'bg-white border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <span className="mr-3 font-bold">{sequenceOrder.indexOf(item) + 1 || '?'}</span>
                        {item}
                      </button>
                    ))}
                  </div>
                  {sequenceOrder.length === currentQuestion.options.length && !answered && (
                    <button
                      onClick={handleArrangeSubmit}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                      Submit Arrangement
                    </button>
                  )}
                </div>
              )}

              {/* Choose Type */}
              {currentQuestion.type === 'choose' && currentQuestion.options && (
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
                                ? 'bg-orange-50 border-orange-500'
                                : 'bg-white border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          showCorrect ? 'bg-green-500 text-white' :
                          showWrong ? 'bg-red-500 text-white' :
                          isSelected ? 'bg-orange-500 text-white' :
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

              {/* Explain, Compare, Predict Types */}
              {(currentQuestion.type === 'explain' || currentQuestion.type === 'compare' || currentQuestion.type === 'predict' || currentQuestion.type === 'fill_blank') && (
                <div>
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    disabled={answered}
                    placeholder="अपना उत्तर लिखें..."
                    className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none min-h-[120px]"
                    maxLength={500}
                  />
                  {!answered && (
                    <button
                      onClick={handleTextSubmit}
                      disabled={!textInput.trim()}
                      className="mt-3 w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                      Submit Answer
                    </button>
                  )}
                  {answered && (
                    <div className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
                      <p className="font-semibold mb-2">
                        {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
                      </p>
                      <p className="text-sm text-gray-600">{currentQuestion.explanation}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Feedback Section */}
              {showFeedback && answered && (
                <div className="mt-6 space-y-4">
                  <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <h3 className={`font-bold mb-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {isCorrect ? '🎉 Correct!' : '📚 Learning Moment'}
                    </h3>
                    <p className="text-gray-700">{currentQuestion.explanation}</p>
                  </div>
                  <button
                    onClick={nextQuestion}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
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
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-orange-500">
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
                  ? 'Congratulations! You achieved ≥80% accuracy and qualified for the next level!' 
                  : `You scored ${(getAccuracy() * 100).toFixed(0)}% accuracy. You need ≥80% to pass. Do not give up!`}
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
                <p className="text-3xl font-bold text-purple-600">{correctAnswers}/15</p>
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

export default HindiGames;
