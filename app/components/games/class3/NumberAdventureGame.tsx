'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { generateQuestion, Question, Difficulty } from '@/app/utils/class3/numberAdventureGenerator';

const difficultySequence: Difficulty[] = ['easy', 'easy', 'medium', 'medium', 'hard', 'master'];

const NumberAdventureGame: React.FC<{ onExit?: () => void }> = ({ onExit }) => {
  const [usedHashes] = useState<Set<string>>(new Set());
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    // pre-generate a short session of questions with increasing difficulty
    const qs: Question[] = [];
    for (let i = 0; i < difficultySequence.length; i++) {
      const q = generateQuestion(usedHashes, difficultySequence[i]);
      qs.push(q);
    }
    setQuestions(qs);
  }, [usedHashes]);

  const current = questions[index];

  const handleChoose = (opt: string) => {
    if (!current || showAnswer) return;
    setSelected(opt);
    setShowAnswer(true);
    if (opt === current.answer) setScore((s) => s + 1);
  };

  const handleNext = () => {
    setShowAnswer(false);
    setSelected(null);
    if (index + 1 < questions.length) setIndex((i) => i + 1);
  };

  const handleRestart = () => {
    usedHashes.clear();
    const qs: Question[] = [];
    for (let i = 0; i < difficultySequence.length; i++) qs.push(generateQuestion(usedHashes, difficultySequence[i]));
    setQuestions(qs);
    setIndex(0);
    setScore(0);
    setSelected(null);
    setShowAnswer(false);
  };

  if (!current) return <div className="p-8">Loading...</div>;

  const isLast = index === questions.length - 1;
  const showResult = showAnswer && isLast;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-2">Number Adventure (Class 3)</h1>
        <p className="text-sm text-gray-600 mb-4">Topic: {current.topic} • Skill: {current.skill} • Difficulty: {current.difficulty}</p>

        <div className="p-6 bg-gray-50 rounded-lg mb-4">
          <div className="text-xl font-semibold mb-3">{current.prompt}</div>
          <div className="grid grid-cols-1 gap-3 mt-4">
            {current.options.map((opt, i) => {
              const correct = showAnswer && opt === current.answer;
              const incorrect = showAnswer && selected === opt && opt !== current.answer;
              return (
                <button
                  key={`${opt}-${i}`}
                  onClick={() => handleChoose(opt)}
                  className={`w-full text-left px-4 py-4 rounded-lg text-lg font-medium transition-colors ${
                    correct ? 'bg-green-500 text-white' : incorrect ? 'bg-red-400 text-white' : 'bg-white border'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm">Question: {index + 1} / {questions.length}</p>
            <p className="text-sm">Score: {score}</p>
          </div>

          <div className="flex items-center gap-3">
            {!showAnswer && (
              <button onClick={() => { setShowAnswer(true); setSelected(null); }} className="px-4 py-2 bg-yellow-500 text-white rounded">Answer</button>
            )}

            {showAnswer && !showResult && (
              <button onClick={handleNext} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>
            )}

            {showResult && (
              <>
                <button onClick={handleRestart} className="px-4 py-2 bg-green-600 text-white rounded">Restart</button>
                <button onClick={() => (onExit ? onExit() : window.history.back())} className="px-4 py-2 bg-gray-500 text-white rounded">Exit</button>
              </>
            )}
          </div>
        </div>

        {showAnswer && !showResult && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p className="font-semibold">Explanation:</p>
            <p className="text-sm text-gray-700">Correct answer: {current.answer}. Keep practicing similar problems to improve!</p>
          </div>
        )}

        {showResult && (
          <div className="mt-6 p-6 bg-green-50 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-2">Session Complete!</h2>
            <p className="text-lg mb-4">Your score: <span className="font-semibold">{score}</span> / {questions.length}</p>
            <p className="text-sm text-gray-700 mb-6">Would you like to try again or return to the menu?</p>
            <div className="flex justify-center gap-4">
              <button onClick={handleRestart} className="px-6 py-2 bg-green-600 text-white rounded">Restart</button>
              <button onClick={() => (onExit ? onExit() : window.history.back())} className="px-6 py-2 bg-gray-500 text-white rounded">Exit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NumberAdventureGame;
