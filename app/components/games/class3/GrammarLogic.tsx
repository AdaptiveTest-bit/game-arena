'use client';

import React, { useState } from 'react';
import { RotateCcw, Trophy, ChevronRight, ArrowRight, Star, Brain } from 'lucide-react';

interface GrammarQuestion {
  id: string;
  question: string;
  questionHindi?: string;
  type: 'identify' | 'fill_blank' | 'correct' | 'classify' | 'build';
  options?: string[];
  correctAnswer: string;
  hint: string;
  explanation: string;
  topic: string;
  points: number;
}

type Difficulty = 'easy' | 'medium' | 'hard' | 'master';
type GameState = 'menu' | 'playing' | 'completed';

interface GrammarLogicProps {
  onExit?: () => void;
}

const grammarData: Record<Difficulty, GrammarQuestion[]> = {
  easy: [
    { id: 'noun_1', type: 'identify', question: "Which is a NOUN (person, place, thing)?", options: ["jump", "school", "quickly", "blue"], correctAnswer: "school", hint: "A noun is something you can see or touch", explanation: "School is a place, so it's a noun.", topic: "Nouns", points: 10 },
    { id: 'verb_1', type: 'identify', question: "Which is a VERB (action word)?", options: ["table", "run", "happy", "red"], correctAnswer: "run", hint: "A verb shows an action - what someone does", explanation: "Run is an action, so it's a verb.", topic: "Verbs", points: 10 },
    { id: 'adj_1', type: 'identify', question: "Which is an ADJECTIVE (describes something)?", options: ["fast", "cat", "walk", "sleep"], correctAnswer: "fast", hint: "An adjective tells us more about a noun", explanation: "Fast describes something, so it's an adjective.", topic: "Adjectives", points: 10 },
    { id: 'sent_1', type: 'build', question: "Which is a COMPLETE sentence?", options: ["The cat", "The cat runs", "In the garden", "And playing"], correctAnswer: "The cat runs", hint: "A sentence needs a subject and an action", explanation: "The cat runs has a subject (cat) and verb (runs).", topic: "Sentences", points: 10 },
    { id: 'cap_1', type: 'identify', question: "Which sentence has CORRECT capitalization?", options: ["i go to school.", "I go to school.", "i go to School.", "I go to school"], correctAnswer: "I go to school.", hint: "Start with capital, use proper nouns", explanation: "Sentences start with capital letters.", topic: "Capitalization", points: 10 },
    { id: 'punct_1', type: 'identify', question: "Which has CORRECT punctuation?", options: ["What is your name", "What is your name!", "What is your name?", "What is your name."], correctAnswer: "What is your name?", hint: "Questions end with ?", explanation: "Questions should end with a question mark.", topic: "Punctuation", points: 10 },
    { id: 'plural_1', type: 'identify', question: "Which is the PLURAL form?", options: ["cat", "cats", "go", "running"], correctAnswer: "cats", hint: "Plural means more than one", explanation: "Cats means more than one cat.", topic: "Plurals", points: 10 },
    { id: 'pron_1', type: 'identify', question: "Which is a PRONOUN?", options: ["Apple", "She", "Green", "Jumps"], correctAnswer: "She", hint: "A pronoun replaces a noun", explanation: "She replaces a person's name.", topic: "Pronouns", points: 10 },
  ],
  medium: [
    { id: 'verb_2', type: 'identify', question: "Which word is a VERB?", options: ["beautiful", "friendship", "to eat", "red"], correctAnswer: "to eat", hint: "Verbs can be actions like eating", explanation: "To eat is an action (infinitive verb).", topic: "Verbs", points: 12 },
    { id: 'noun_2', type: 'identify', question: "Which is a ABSTRACT NOUN (feeling/idea)?", options: ["chair", "happiness", "tree", "house"], correctAnswer: "happiness", hint: "Abstract nouns are things you can't touch", explanation: "Happiness is a feeling you can't touch.", topic: "Abstract Nouns", points: 12 },
    { id: 'prep_1', type: 'identify', question: "Which is a PREPOSITION?", options: ["quickly", "under", "jump", "blue"], correctAnswer: "under", hint: "Prepositions show position or direction", explanation: "Under shows position.", topic: "Prepositions", points: 12 },
    { id: 'conj_1', type: 'identify', question: "Which is a CONJUNCTION?", options: ["The", "and", "cat", "runs"], correctAnswer: "and", hint: "Conjunctions join words or sentences", explanation: "And joins words together.", topic: "Conjunctions", points: 12 },
    { id: 'art_1', type: 'identify', question: "Which is an ARTICLE?", options: ["quickly", "the", "cat", "runs"], correctAnswer: "the", hint: "Articles are 'a', 'an', 'the'", explanation: "The is a definite article.", topic: "Articles", points: 12 },
    { id: 'fix_1', type: 'correct', question: "Fix: She go to school daily -> Correct sentence:", options: ["She goes to school daily.", "She going to school daily.", "She gone to school daily.", "She daily to school goes."], correctAnswer: "She goes to school daily.", hint: "Subject-verb agreement needed", explanation: "She goes (singular verb agreement).", topic: "Subject-Verb Agreement", points: 15 },
    { id: 'tense_1', type: 'identify', question: "Which sentence is in PAST tense?", options: ["I eat breakfast", "I ate breakfast", "I will eat breakfast", "I eating breakfast"], correctAnswer: "I ate breakfast", hint: "Past tense describes completed actions", explanation: "Ate is past tense of eat.", topic: "Tenses", points: 12 },
    { id: 'subj_1', type: 'identify', question: "Find the SUBJECT: 'The big dog barked loudly'", options: ["big dog", "The big dog", "barked loudly", "loudly"], correctAnswer: "The big dog", hint: "The subject is who/what does the action", explanation: "The big dog does the barking.", topic: "Subject", points: 12 },
  ],
  hard: [
    { id: 'conj_2', type: 'classify', question: "Choose correct conjunction: 'I wanted to play _____ it was raining'", options: ["but", "because", "although", "both A and B"], correctAnswer: "both A and B", hint: "Both 'but' and 'although' could work", explanation: "Both but and although are correct here.", topic: "Conjunctions", points: 15 },
    { id: 'pred_1', type: 'identify', question: "Find the PREDICATE: 'My friendly neighbor adopted a stray puppy'", options: ["My friendly neighbor", "adopted a stray puppy", "a stray puppy", "friendly neighbor adopted"], correctAnswer: "adopted a stray puppy", hint: "Predicate tells what the subject does", explanation: "Adopted a stray puppy tells what neighbor did.", topic: "Predicate", points: 15 },
    { id: 'clause_1', type: 'identify', question: "Which is an INDEPENDENT clause?", options: ["when the bell rang", "because she was tired", "I went home", "although it was late"], correctAnswer: "I went home", hint: "Independent clause can stand alone", explanation: "I went home makes complete sense alone.", topic: "Clauses", points: 15 },
    { id: 'phrase_1', type: 'identify', question: "Identify the PREPOSITIONAL PHRASE:", options: ["quickly ran", "the cat in the hat", "jumped over", "very happy"], correctAnswer: "the cat in the hat", hint: "Prepositional phrase starts with preposition", explanation: "In the hat starts with preposition 'in'.", topic: "Phrases", points: 15 },
    { id: 'voice_1', type: 'correct', question: "Change to ACTIVE voice: 'The cake was eaten by the boy'", options: ["The boy ate the cake", "The cake was eating", "The boy was eaten", "Ate the cake by the boy"], correctAnswer: "The boy ate the cake", hint: "Active voice has subject doing action", explanation: "Boy (subject) does the action (ate).", topic: "Active/Passive Voice", points: 18 },
    { id: 'obj_1', type: 'identify', question: "Find the DIRECT OBJECT: 'She gave her friend a gift'", options: ["She", "gave", "her friend", "a gift"], correctAnswer: "a gift", hint: "Direct object receives the action", explanation: "Gift is what was given.", topic: "Objects", points: 15 },
    { id: 'inter_1', type: 'identify', question: "Which is an INTERJECTION?", options: ["quickly", "Wow", "the", "blue"], correctAnswer: "Wow", hint: "Interjections express strong emotion", explanation: "Wow expresses surprise!", topic: "Interjections", points: 12 },
    { id: 'typesent_1', type: 'identify', question: "What type of sentence is: 'Close the door, please!'", options: ["Declarative", "Interrogative", "Imperative", "Exclamatory"], correctAnswer: "Imperative", hint: "Imperative gives a command or request", explanation: "It's a command/request.", topic: "Sentence Types", points: 15 },
  ],
  master: [
    { id: 'complex_1', type: 'identify', question: "Identify the main clause: 'Although it rained, we went to the park because we had tickets'", options: ["Although it rained", "we went to the park", "because we had tickets", "we went to the park because we had tickets"], correctAnswer: "we went to the park because we had tickets", hint: "Main clause can stand alone", explanation: "This clause can stand independently.", topic: "Complex Sentences", points: 20 },
    { id: 'participial_1', type: 'identify', question: "Find the PARTICIPIAL PHRASE: 'Walking home, I found a wallet on the road'", options: ["Walking home", "I found a wallet", "on the road", "I found a wallet on the road"], correctAnswer: "Walking home", hint: "Participial phrase has -ing verb form", explanation: "Walking home modifies 'I'.", topic: "Participial Phrases", points: 20 },
    { id: 'gerund_1', type: 'classify', question: "Which contains a GERUND functioning as OBJECT?", options: ["Running is fun", "The running water", "I like running", "Both A and C"], correctAnswer: "Both A and C", hint: "Gerund is verb + ing used as noun", explanation: "Running is a noun in both cases.", topic: "Gerunds", points: 20 },
    { id: 'inf_1', type: 'identify', question: "Identify the INFINITIVE: 'To succeed, you must work hard'", options: ["To succeed", "you must work", "work hard", "must work hard"], correctAnswer: "To succeed", hint: "Infinitive is 'to' + verb", explanation: "To succeed is an infinitive.", topic: "Infinitives", points: 18 },
    { id: 'appositive_1', type: 'identify', question: "Find the APPOSITIVE: 'My brother, a doctor, works at City Hospital'", options: ["My brother", "a doctor", "works at City Hospital", "My brother works"], correctAnswer: "a doctor", hint: "Appositive renames the noun before it", explanation: "A doctor renames 'brother'.", topic: "Appositives", points: 20 },
    { id: 'absolute_1', type: 'identify', question: "Identify the ABSOLUTE phrase: 'The sun having set, we went home'", options: ["The sun", "having set", "The sun having set", "we went home"], correctAnswer: "The sun having set", hint: "Absolute phrase modifies entire sentence", explanation: "Absolute phrase can't be separated.", topic: "Absolute Phrases", points: 22 },
    { id: 'parallel_1', type: 'correct', question: "Fix parallelism: 'She likes reading, to swim, and dancing'", options: ["She likes reading, swimming, and dancing", "She likes to read, swim, and dancing", "She likes reading, swimming, and to dance", "Reading, swimming, and dancing she likes"], correctAnswer: "She likes reading, swimming, and dancing", hint: "All items should be same grammatical form", explanation: "All gerunds (reading, swimming, dancing).", topic: "Parallel Structure", points: 25 },
    { id: 'dangling_1', type: 'correct', question: "Fix: 'Walking down the street, the building caught fire'", options: ["Walking down the street, I saw the building catch fire", "The building caught fire while walking", "Walking down the street, the fire started", "I was walking down the street, the building caught fire"], correctAnswer: "Walking down the street, I saw the building catch fire", hint: "Subject must follow introductory phrase", explanation: "The subject 'I' follows the phrase.", topic: "Dangling Modifiers", points: 25 },
  ]
};

const GrammarLogic: React.FC<GrammarLogicProps> = ({ onExit }) => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [level, setLevel] = useState(1);
  const [questions, setQuestions] = useState<GrammarQuestion[]>([]);
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
    const allQuestions = [...grammarData[diff]].sort(() => Math.random() - 0.5);
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
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Brain size={64} className="mx-auto mb-4 text-white" />
            <h1 className="text-4xl font-bold text-white mb-2">Grammar Logic</h1>
            <p className="text-gray-200">Master sentence building & grammar rules!</p>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 text-center">🎮 Select Level</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((lvl) => (
              <button
                key={lvl}
                onClick={() => startGame(lvl)}
                className="bg-white rounded-xl shadow-2xl p-6 hover:scale-105 transition-all"
              >
                <div className="text-3xl font-bold text-purple-600 mb-2">{getDifficultyLabel(lvl)}</div>
                <div className="text-gray-600 text-sm">
                  {lvl === 1 && "Basic parts of speech, sentences"}
                  {lvl === 2 && "Abstract nouns, clauses, tenses"}
                  {lvl === 3 && "Complex sentences, voice, objects"}
                  {lvl === 4 && "Master grammar analysis"}
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
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-violet-100 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Grammar Logic</h1>
              <p className="text-gray-600">Level {level}: {getDifficultyLabel(level)}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-600">{score}</p>
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
                className="bg-gradient-to-r from-purple-500 to-violet-500 h-3 rounded-full transition-all"
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
              <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-semibold">
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
                          : 'bg-white border-gray-200 hover:border-purple-300'
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
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-semibold">Hint:</span> {currentQ.hint}
                </p>
              </div>
            )}
          </div>

          {showFeedback && (
            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2"
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
      <div className="min-h-screen bg-gradient-to-b from-violet-50 to-purple-100 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            {passed ? (
              <>
                <Trophy size={64} className="mx-auto mb-4 text-yellow-500" />
                <h2 className="text-3xl font-bold text-purple-600 mb-4">🎉 Level {level} Complete!</h2>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">💪</div>
                <h2 className="text-3xl font-bold text-orange-600 mb-4">Keep Practicing!</h2>
              </>
            )}

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className={`text-lg font-semibold mb-2 ${passed ? 'text-purple-700' : 'text-orange-700'}`}>
                {passed 
                  ? `Excellent! ${accuracy}% grammar accuracy!` 
                  : `You got ${accuracy}% accuracy. Keep learning grammar!`}
              </p>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-gray-600 text-sm">Score</p>
                  <p className="text-2xl font-bold text-purple-600">{score}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-gray-600 text-sm">Accuracy</p>
                  <p className="text-2xl font-bold text-purple-600">{accuracy}%</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-gray-600 text-sm">Correct</p>
                  <p className="text-2xl font-bold text-purple-600">{correctAnswers}/{totalAnswered}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 flex-wrap">
              {passed && level < 4 ? (
                <button
                  onClick={() => startGame(level + 1)}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
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

export default GrammarLogic;

