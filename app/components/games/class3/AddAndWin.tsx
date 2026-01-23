'use client';

import React, { useState, useEffect } from 'react';
import { useAddWinStore } from '@/app/store/useAddWinStore';
import { RotateCcw, Trophy, ChevronRight, Lightbulb, ArrowRight, Star } from 'lucide-react';

const AddAndWin: React.FC = () => {
  const store = useAddWinStore();
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'completed'>('menu');
  const [textInput, setTextInput] = useState('');

  const getDifficultyLabel = (level: number) => {
    switch (level) {
      case 1: return '🟢 Easy';
      case 2: return '🟡 Medium';
      case 3: return '🔴 Hard';
      default: return '🟢 Easy';
    }
  };

  const handleStartGame = (level: number) => {
    store.startGame(2, level);
    setGameState('playing');
    setTextInput('');
  };

  const handleReset = () => {
    store.resetGame();
    setGameState('menu');
    setTextInput('');
  };

  useEffect(() => {
    if (store.gameCompleted && gameState === 'playing') {
      setGameState('completed');
    }
  }, [store.gameCompleted, gameState]);

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-600 to-teal-500 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">➕</div>
            <h1 className="text-5xl font-bold text-white mb-4">Add & Win</h1>
            <p className="text-xl text-gray-100">Solve Addition Problems! 🎯</p>
          </div>
          <h2 className="text-2xl font-bold text-white mb-6 text-center">🎮 Choose Level</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((level) => (
              <button key={level} onClick={() => handleStartGame(level)}
                className="bg-white rounded-xl shadow-2xl overflow-hidden hover:scale-105 transition-all text-left">
                <div className={`bg-gradient-to-r from-green-${level}-400 to-emerald-${level}-500 p-6 text-white`}>
                  <h2 className="text-2xl font-bold">Level {level}</h2>
                  <p className="text-sm opacity-90">{level === 1 ? 'Basic addition' : level === 2 ? '2-3 digit addition' : 'Complex addition'}</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">10 questions | Pass: ≥80%</p>
                </div>
              </button>
            ))}
          </div>
          <button onClick={handleReset} className="w-full mt-8 bg-white/20 text-white py-3 rounded-lg">Back to Menu</button>
        </div>
      </div>
    );
  }

  const progressPercent = (store.totalAnswered / 10) * 100;
  const isCorrect = store.currentQuestion && store.selectedAnswer && 
    (typeof store.currentQuestion.correctAnswer === 'string' 
      ? store.selectedAnswer.toLowerCase().trim() === store.currentQuestion.correctAnswer.toLowerCase().trim()
      : store.selectedAnswer.toLowerCase().trim() === store.currentQuestion.correctAnswer[0].toLowerCase().trim());

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => setGameState('menu')} className="text-gray-600 mb-4">← Back</button>
        <h1 className="text-3xl font-bold mb-4">➕ Add & Win</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span>Progress</span>
            <span>{store.totalAnswered} / 10</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-4 rounded-full" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex gap-4 mb-4">
            <div className="bg-yellow-50 px-4 py-2 rounded-lg">
              <span className="text-2xl font-bold text-yellow-600">{store.score}</span>
              <span className="text-gray-600 ml-2">Score</span>
            </div>
            <div className="bg-orange-50 px-4 py-2 rounded-lg">
              <span className="text-2xl font-bold">🔥 {store.streak}</span>
              <span className="text-gray-600 ml-2">Streak</span>
            </div>
          </div>

          {store.currentQuestion && (
            <>
              <div className="bg-gray-50 rounded-lg p-6 mb-4">
                <h2 className="text-xl font-bold text-gray-800">{store.currentQuestion.question}</h2>
              </div>

              {store.currentQuestion.type === 'mcq' && store.currentQuestion.options && (
                <div className="space-y-3">
                  {store.currentQuestion.options.map((option, idx) => (
                    <button key={idx} onClick={() => store.selectedAnswer === option ? null : store.selectAnswer(option)}
                      disabled={store.answered}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        store.answered && option === store.currentQuestion.correctAnswer ? 'bg-green-50 border-green-500' :
                        store.answered && store.selectedAnswer === option ? 'bg-red-50 border-red-500' :
                        'bg-white border-gray-200 hover:border-green-300'
                      }`}>
                      <span className="w-8 h-8 rounded-full bg-gray-200 inline-flex items-center justify-center mr-3 font-bold">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {store.showFeedback && (
                <div className="mt-6">
                  <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                    <h3 className={`font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {isCorrect ? '🎉 Correct!' : '📚 Learning Moment'}
                    </h3>
                    <p className="text-gray-700">{store.currentQuestion.explanation}</p>
                  </div>
                  <button onClick={store.nextQuestion}
                    className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 rounded-lg">
                    Next Question <ArrowRight className="inline ml-2" size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddAndWin;

