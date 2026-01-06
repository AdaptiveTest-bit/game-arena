'use client';

import React, { useState } from 'react';
import { RotateCcw, Trophy, ChevronRight, ArrowRight, Star, Target } from 'lucide-react';

interface VocabQuestion {
  id: string;
  question: string;
  questionHindi?: string;
  type: 'meaning' | 'synonym' | 'antonym' | 'fill_blank' | 'context';
  options?: string[];
  correctAnswer: string;
  hint: string;
  explanation: string;
  topic: string;
  points: number;
}

type Difficulty = 'easy' | 'medium' | 'hard' | 'master';
type GameState = 'menu' | 'playing' | 'completed';

interface VocabularyBuilderProps {
  onExit?: () => void;
}

const vocabularyData = {
  easy: [
    { word: "big", meaning: "large in size", synonyms: ["huge", "large", "massive"], antonyms: ["small", "little"] },
    { word: "happy", meaning: "feeling joy", synonyms: ["joyful", "cheerful", "glad"], antonyms: ["sad", "unhappy"] },
    { word: "fast", meaning: "moving quickly", synonyms: ["quick", "rapid", "swift"], antonyms: ["slow", "sluggish"] },
    { word: "good", meaning: "positive quality", synonyms: ["nice", "great", "excellent"], antonyms: ["bad", "poor"] },
    { word: "beautiful", meaning: "pleasing to look at", synonyms: ["pretty", "lovely", "gorgeous"], antonyms: ["ugly", "plain"] },
    { word: "clean", meaning: "free from dirt", synonyms: ["tidy", "spotless", "pure"], antonyms: ["dirty", "messy"] },
    { word: "hard", meaning: "difficult to do", synonyms: ["tough", "challenging", "rough"], antonyms: ["easy", "simple"] },
    { word: "smart", meaning: "intelligent", synonyms: ["clever", "bright", "wise"], antonyms: ["stupid", "foolish"] },
  ],
  medium: [
    { word: "brave", meaning: "showing courage", synonyms: ["courageous", "bold", "fearless"], antonyms: ["afraid", "cowardly"] },
    { word: "generous", meaning: "willing to share", synonyms: ["kind", "giving", "charitable"], antonyms: ["selfish", "stingy"] },
    { word: "ancient", meaning: "very old", synonyms: ["old", "historic", "primitive"], antonyms: ["modern", "new"] },
    { word: "bright", meaning: "giving off light", synonyms: ["shining", "luminous", "radiant"], antonyms: ["dark", "dim"] },
    { word: "difficult", meaning: "hard to understand", synonyms: ["challenging", "complex", "tough"], antonyms: ["easy", "simple"] },
    { word: "enormous", meaning: "very, very large", synonyms: ["huge", "giant", "immense"], antonyms: ["tiny", "minute"] },
    { word: "famous", meaning: "well known", synonyms: ["renowned", "famed", "popular"], antonyms: ["unknown", "obscure"] },
    { word: "gentle", meaning: "soft and kind", synonyms: ["kind", "mild", "tender"], antonyms: ["rough", "harsh"] },
  ],
  hard: [
    { word: "curious", meaning: "eager to know", synonyms: ["inquisitive", "interested", "eager"], antonyms: ["indifferent", "apathetic"] },
    { word: "generous", meaning: "giving freely", synonyms: ["liberal", "big-hearted", "open-handed"], antonyms: ["mean", "stingy"] },
    { word: "patient", meaning: "able to wait calmly", synonyms: ["tolerant", "calm", "understanding"], antonyms: ["impatient", "restless"] },
    { word: "mysterious", meaning: "hard to understand", synonyms: ["strange", "puzzling", "secretive"], antonyms: ["obvious", "clear"] },
    { word: "successful", meaning: "achieving goals", synonyms: ["prosperous", "victorious", "triumphant"], antonyms: ["unsuccessful", "failed"] },
    { word: "responsible", meaning: "accountable for actions", synonyms: ["reliable", "trustworthy", "dependable"], antonyms: ["irresponsible", "unreliable"] },
    { word: "magnificent", meaning: "very beautiful", synonyms: ["splendid", "grand", "wonderful"], antonyms: ["ordinary", "plain"] },
    { word: "independent", meaning: "able to do things alone", synonyms: ["self-reliant", "free", "autonomous"], antonyms: ["dependent", "reliant"] },
  ],
  master: [
    { word: "persevere", meaning: "to keep trying despite difficulty", synonyms: ["persist", "continue", "endure"], antonyms: ["give up", "quit", "surrender"] },
    { word: "innovative", meaning: "introducing new ideas", synonyms: ["creative", "original", "inventive"], antonyms: ["traditional", "conventional"] },
    { word: "compassionate", meaning: "showing care for others", synonyms: ["kind", "merciful", "sympathetic"], antonyms: ["cruel", "heartless"] },
    { word: "resilient", meaning: "able to recover from problems", synonyms: ["tough", "strong", "adaptable"], antonyms: ["weak", "fragile"] },
    { word: "versatile", meaning: "able to do many things", synonyms: ["flexible", "multi-talented", "adaptable"], antonyms: ["limited", "single-skilled"] },
    { word: "eloquent", meaning: "fluent and persuasive speaking", synonyms: ["articulate", "expressive", "silver-tongued"], antonyms: ["inarticulate", "awkward"] },
    { word: "intuitive", meaning: "understanding without reasoning", synonyms: ["natural", "instinctive", "gut"], antonyms: ["logical", "reasoned"] },
    { word: "meticulous", meaning: "very careful with details", synonyms: ["precise", "thorough", "careful"], antonyms: ["careless", "sloppy"] },
  ]
};

const generateQuestions = (difficulty: Difficulty): VocabQuestion[] => {
  const words = vocabularyData[difficulty];
  const questions: VocabQuestion[] = [];
  
  words.forEach((item, idx) => {
    questions.push({
      id: `meaning_${difficulty}_${idx}`,
      question: `What does the word "${item.word}" mean?`,
      questionHindi: `"${item.word}" का क्या अर्थ है?`,
      type: 'meaning',
      options: [
        item.meaning,
        ...words.filter((_, i) => i !== idx).slice(0, 3).map(w => w.meaning)
      ].sort(() => Math.random() - 0.5),
      correctAnswer: item.meaning,
      hint: `Think about how "${item.word}" is used in sentences`,
      explanation: `"${item.word}" means ${item.meaning.toLowerCase()}.`,
      topic: 'Word Meaning',
      points: 10 + (difficulty === 'master' ? 5 : 0),
    });

    questions.push({
      id: `synonym_${difficulty}_${idx}`,
      question: `Which word is a SYNONYM (similar meaning) of "${item.word}"?`,
      questionHindi: `"${item.word}" का समानार्थी शब्द कौन सा है?`,
      type: 'synonym',
      options: [
        item.synonyms[0],
        ...words.filter((_, i) => i !== idx).flatMap(w => w.synonyms).slice(0, 3)
      ].sort(() => Math.random() - 0.5),
      correctAnswer: item.synonyms[0],
      hint: `Synonyms are words with similar meanings`,
      explanation: `"${item.synonyms[0]}" is a synonym of "${item.word}".`,
      topic: 'Synonyms',
      points: 12 + (difficulty === 'master' ? 3 : 0),
    });

    questions.push({
      id: `antonym_${difficulty}_${idx}`,
      question: `Which word is an ANTONYM (opposite meaning) of "${item.word}"?`,
      questionHindi: `"${item.word}" का विपरीतार्थी शब्द कौन सा है?`,
      type: 'antonym',
      options: [
        item.antonyms[0],
        ...words.filter((_, i) => i !== idx).flatMap(w => w.antonyms).slice(0, 3)
      ].sort(() => Math.random() - 0.5),
      correctAnswer: item.antonyms[0],
      hint: `Antonyms are words with opposite meanings`,
      explanation: `"${item.antonyms[0]}" is the opposite of "${item.word}".`,
      topic: 'Antonyms',
      points: 12 + (difficulty === 'master' ? 3 : 0),
    });

    if (difficulty !== 'easy') {
      const blanks = [
        { sentence: "The _______ sun lit up the sky.", answer: item.word },
        { sentence: "She felt _______ when she saw the surprise.", answer: item.word },
        { sentence: "The _______ warrior faced many dangers.", answer: item.word },
      ];
      const blank = blanks[idx % blanks.length];
      
      questions.push({
        id: `context_${difficulty}_${idx}`,
        question: `Fill in the blank: ${blank.sentence}`,
        questionHindi: `रिक्त स्थान भरें: ${blank.sentence}`,
        type: 'fill_blank',
        options: [
          item.word,
          ...words.filter((_, i) => i !== idx).slice(0, 3).map(w => w.word)
        ].sort(() => Math.random() - 0.5),
        correctAnswer: item.word,
        hint: 'Think about what word fits best in the sentence',
        explanation: `The word "${item.word}" fits because it means ${item.meaning.toLowerCase()}.`,
        topic: 'Context Usage',
        points: 15 + (difficulty === 'master' ? 5 : 0),
      });
    }
  });

  return questions.sort(() => Math.random() - 0.5).slice(0, 10);
};

const VocabularyBuilder: React.FC<VocabularyBuilderProps> = ({ onExit }) => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [level, setLevel] = useState(1);
  const [questions, setQuestions] = useState<VocabQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const getDifficulty = (lvl: number): Difficulty => {
    switch (lvl) {
      case 1: return 'easy';
      case 2: return 'medium';
      case 3: return 'hard';
      case 4: return 'master';
      default: return 'easy';
    }
  };

  const getDifficultyLabel = (lvl: number): string => {
    switch (lvl) {
      case 1: return '🟢 Easy';
      case 2: return '🟡 Medium';
      case 3: return '🔴 Hard';
      case 4: return '🏆 Master';
      default: return '🟢 Easy';
    }
  };

  const startGame = (lvl: number) => {
    const diff = getDifficulty(lvl);
    const allQuestions = generateQuestions(diff);
    setQuestions(allQuestions);
    setLevel(lvl);
    setCurrentQIndex(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setShowFeedback(false);
    setScore(0);
    setTotalAnswered(0);
    setCorrectAnswers(0);
    setGameState('playing');
  };

  const handleAnswer = (answer: string) => {
    if (answered) return;
    
    const currentQ = questions[currentQIndex];
    const isCorrect = answer.toLowerCase().trim() === currentQ.correctAnswer.toLowerCase().trim();
    
    setSelectedAnswer(answer);
    setAnswered(true);
    setShowFeedback(true);
    setTotalAnswered(prev => prev + 1);
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setScore(prev => prev + currentQ.points);
    }
  };

  const handleNext = () => {
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setAnswered(false);
      setShowFeedback(false);
    } else {
      setGameState('completed');
    }
  };

  const handleExit = () => {
    if (onExit) onExit();
  };

  const currentQ = questions[currentQIndex];
  const passed = totalAnswered > 0 && (correctAnswers / totalAnswered) >= 0.8;

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Target size={64} className="mx-auto mb-4 text-white" />
            <h1 className="text-4xl font-bold text-white mb-2">Vocabulary Builder</h1>
            <p className="text-gray-200">Master words, synonyms & antonyms!</p>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 text-center">🎮 Select Level</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((lvl) => (
              <button
                key={lvl}
                onClick={() => startGame(lvl)}
                className="bg-white rounded-xl shadow-2xl p-6 hover:scale-105 transition-all"
              >
                <div className="text-3xl font-bold text-green-600 mb-2">{getDifficultyLabel(lvl)}</div>
                <div className="text-gray-600 text-sm">
                  {lvl === 1 && "Basic words, simple meanings"}
                  {lvl === 2 && "More complex vocabulary"}
                  {lvl === 3 && "Advanced words, context usage"}
                  {lvl === 4 && "Master vocabulary skills"}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleExit}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            ← Back to Menu
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'playing' && currentQ) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Vocabulary Builder</h1>
              <p className="text-gray-600">Level {level}: {getDifficultyLabel(level)}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">{score}</p>
              <p className="text-sm text-gray-500">Score</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQIndex + 1} / {questions.length}</span>
              <span>Accuracy: {totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 100}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all"
                style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Star size={16} className="text-yellow-500" />
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                {currentQ.topic}
              </span>
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                {currentQ.points} pts
              </span>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">{currentQ.question}</h2>
            {currentQ.questionHindi && (
              <p className="text-lg text-gray-600 mb-4">{currentQ.questionHindi}</p>
            )}

            {currentQ.options && (
              <div className="space-y-3 mt-4">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(opt)}
                    disabled={answered}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      answered && opt === currentQ.correctAnswer
                        ? 'bg-green-50 border-green-500'
                        : answered && opt === selectedAnswer && opt !== currentQ.correctAnswer
                          ? 'bg-red-50 border-red-500'
                          : 'bg-white border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <span className={`inline-block w-8 h-8 rounded-full text-center font-bold mr-3 ${
                      answered && opt === currentQ.correctAnswer
                        ? 'bg-green-500 text-white'
                        : answered && opt === selectedAnswer && opt !== currentQ.correctAnswer
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {showFeedback && (
              <div className={`mt-6 p-4 rounded-lg ${
                selectedAnswer?.toLowerCase().trim() === currentQ.correctAnswer.toLowerCase().trim()
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              } border`}>
                <p className="font-semibold mb-1">
                  {selectedAnswer?.toLowerCase().trim() === currentQ.correctAnswer.toLowerCase().trim()
                    ? '✅ Correct!'
                    : '❌ Incorrect'}
                </p>
                <p className="text-sm text-gray-700">{currentQ.explanation}</p>
              </div>
            )}
          </div>

          {showFeedback && (
            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {currentQIndex + 1 < questions.length ? 'Next Question' : 'See Results'}
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'completed') {
    const accuracy = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;

    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-green-100 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            {passed ? (
              <>
                <Trophy size={64} className="mx-auto mb-4 text-yellow-500" />
                <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Level {level} Complete!</h2>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">💪</div>
                <h2 className="text-3xl font-bold text-orange-600 mb-4">Keep Practicing!</h2>
              </>
            )}

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className={`text-lg font-semibold mb-2 ${passed ? 'text-green-700' : 'text-orange-700'}`}>
                {passed 
                  ? `Excellent! ${accuracy}% accuracy!` 
                  : `You got ${accuracy}% accuracy. Keep building vocabulary!`}
              </p>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-gray-600 text-sm">Score</p>
                  <p className="text-2xl font-bold text-green-600">{score}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-gray-600 text-sm">Accuracy</p>
                  <p className="text-2xl font-bold text-green-600">{accuracy}%</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-gray-600 text-sm">Correct</p>
                  <p className="text-2xl font-bold text-green-600">{correctAnswers}/{totalAnswered}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 flex-wrap">
              {passed && level < 4 ? (
                <button
                  onClick={() => startGame(level + 1)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  Next Level <ChevronRight size={20} />
                </button>
              ) : !passed && (
                <button
                  onClick={() => startGame(level)}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  🔄 Retry Level {level}
                </button>
              )}
              
              <button
                onClick={handleExit}
                className={`${passed && level < 4 ? 'flex-1' : 'w-full'} bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors`}
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default VocabularyBuilder;

