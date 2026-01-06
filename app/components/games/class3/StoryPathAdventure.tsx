'use client';

import React, { useState } from 'react';
import { Trophy, ChevronRight, ArrowRight, Star, BookOpen } from 'lucide-react';

interface StoryQuestion {
  id: string;
  question: string;
  questionHindi?: string;
  type: 'sequence' | 'mcq';
  options: string[];
  correctAnswer: string;
  hint: string;
  explanation: string;
  topic: string;
  points: number;
}

type Difficulty = 'easy' | 'medium' | 'hard' | 'master';
type GameState = 'menu' | 'playing' | 'completed';

interface StoryPathAdventureProps {
  onExit?: () => void;
}

const stories = {
  easy: [
    {
      title: "The Enormous Turnip",
      events: [
        "Grandpa planted a turnip seed",
        "The turnip grew very big",
        "Grandpa tried to pull it",
        "Grandma joined to help",
        "Together they pulled it out"
      ],
      moral: "Teamwork makes the dream work",
      wrongSequences: [
        ["The turnip grew very big", "Grandpa planted a turnip seed", "Together they pulled it out", "Grandma joined to help"],
        ["Grandma joined to help", "Together they pulled it out", "The turnip grew very big", "Grandpa tried to pull it"],
        ["Grandpa tried to pull it", "Together they pulled it out", "Grandpa planted a turnip seed", "The turnip grew very big"],
      ]
    },
    {
      title: "The Little Red Hen",
      events: [
        "Hen found wheat grains",
        "She asked for help planting",
        "No one helped",
        "Hen planted alone",
        "Hen baked bread alone"
      ],
      moral: "Hard work pays off",
      wrongSequences: [
        ["Hen baked bread alone", "Hen found wheat grains", "No one helped", "She asked for help planting"],
        ["No one helped", "Hen baked bread alone", "Hen found wheat grains", "She asked for help planting"],
        ["She asked for help planting", "No one helped", "Hen planted alone", "Hen found wheat grains"],
      ]
    }
  ],
  medium: [
    {
      title: "The Crow and the Water Pot",
      events: [
        "Crow was thirsty",
        "Found a pot with low water",
        "Could not reach water",
        "Dropped pebbles in pot",
        "Water rose up",
        "Crow drank the water"
      ],
      moral: "Necessity is the mother of invention",
      wrongSequences: [
        ["Could not reach water", "Dropped pebbles in pot", "Water rose up", "Crow was thirsty", "Found a pot with low water", "Crow drank the water"],
        ["Crow drank the water", "Found a pot with low water", "Crow was thirsty", "Could not reach water", "Water rose up", "Dropped pebbles in pot"],
        ["Dropped pebbles in pot", "Could not reach water", "Water rose up", "Found a pot with low water", "Crow drank the water", "Crow was thirsty"],
      ]
    },
    {
      title: "The Lion and the Mouse",
      events: [
        "Lion caught Mouse",
        "Mouse begged for mercy",
        "Lion freed Mouse",
        "Later, Lion was trapped in net",
        "Mouse gnawed the net",
        "Lion escaped"
      ],
      moral: "Small friends can be big helpers",
      wrongSequences: [
        ["Lion escaped", "Mouse gnawed the net", "Later, Lion was trapped in net", "Lion freed Mouse", "Lion caught Mouse", "Mouse begged for mercy"],
        ["Mouse begged for mercy", "Lion freed Mouse", "Lion escaped", "Lion caught Mouse", "Mouse gnawed the net", "Later, Lion was trapped in net"],
        ["Later, Lion was trapped in net", "Mouse gnawed the net", "Lion freed Mouse", "Mouse begged for mercy", "Lion caught Mouse", "Lion escaped"],
      ]
    }
  ],
  hard: [
    {
      title: "The Fox and the Grapes",
      events: [
        "Fox saw high grapes",
        "Fox jumped but could not reach",
        "Fox tried again but failed",
        "Fox walked away saying grapes were sour",
        "We want what we cannot have"
      ],
      moral: "It's easy to despise what you cannot have",
      wrongSequences: [
        ["Fox tried again but failed", "Fox saw high grapes", "We want what we cannot have", "Fox jumped but could not reach", "Fox walked away saying grapes were sour"],
        ["Fox walked away saying grapes were sour", "Fox jumped but could not reach", "We want what we cannot have", "Fox tried again but failed", "Fox saw high grapes"],
        ["We want what we cannot have", "Fox walked away saying grapes were sour", "Fox tried again but failed", "Fox saw high grapes", "Fox jumped but could not reach"],
      ]
    },
    {
      title: "The Ant and the Grasshopper",
      events: [
        "Summer came",
        "Ants stored food",
        "Grasshopper played and sang",
        "Winter came",
        "Ants had food, Grasshopper starved",
        "Grasshopper learned his lesson"
      ],
      moral: "Work today for a better tomorrow",
      wrongSequences: [
        ["Winter came", "Summer came", "Grasshopper played and sang", "Ants stored food", "Ants had food, Grasshopper starved", "Grasshopper learned his lesson"],
        ["Ants had food, Grasshopper starved", "Ants stored food", "Winter came", "Grasshopper played and sang", "Grasshopper learned his lesson", "Summer came"],
        ["Grasshopper played and sang", "Ants had food, Grasshopper starved", "Summer came", "Winter came", "Grasshopper learned his lesson", "Ants stored food"],
      ]
    }
  ],
  master: [
    {
      title: "The Boy Who Cried Wolf",
      events: [
        "Boy was bored watching sheep",
        "He cried 'Wolf!' for fun",
        "Villagers came running",
        "There was no wolf",
        "Boy laughed at them",
        "Later, real wolf came",
        "Boy cried for help",
        "No one came to help"
      ],
      moral: "Liars are not believed even when they speak the truth",
      wrongSequences: [
        ["Boy cried for help", "Later, real wolf came", "No one came to help", "He cried 'Wolf!' for fun", "Boy was bored watching sheep", "Villagers came running", "There was no wolf", "Boy laughed at them"],
        ["There was no wolf", "No one came to help", "Boy was bored watching sheep", "Boy laughed at them", "He cried 'Wolf!' for fun", "Villagers came running", "Later, real wolf came", "Boy cried for help"],
        ["Villagers came running", "Boy was bored watching sheep", "Boy cried for help", "He cried 'Wolf!' for fun", "There was no wolf", "No one came to help", "Boy laughed at them", "Later, real wolf came"],
      ]
    },
    {
      title: "The Goose That Laid Golden Eggs",
      events: [
        "Farmer had a special goose",
        "Goose laid one golden egg daily",
        "Farmer wanted all gold at once",
        "Farmer killed the goose",
        "No golden eggs inside",
        "Farmer lost his treasure"
      ],
      moral: "Greed destroys the source of good",
      wrongSequences: [
        ["Farmer killed the goose", "No golden eggs inside", "Farmer wanted all gold at once", "Farmer lost his treasure", "Farmer had a special goose", "Goose laid one golden egg daily"],
        ["Goose laid one golden egg daily", "Farmer killed the goose", "Farmer lost his treasure", "No golden eggs inside", "Farmer wanted all gold at once", "Farmer had a special goose"],
        ["Farmer lost his treasure", "Goose laid one golden egg daily", "Farmer wanted all gold at once", "No golden eggs inside", "Farmer had a special goose", "Farmer killed the goose"],
      ]
    }
  ]
};

// Generate all letter permutations for correct answer
const getAllPermutations = (arr: string[]): string[][] => {
  if (arr.length <= 2) return [arr, [...arr].reverse()];
  const result: string[][] = [];
  const used = new Set<number>();
  
  const permute = (current: string[]) => {
    if (current.length === arr.length) {
      result.push([...current]);
      return;
    }
    for (let i = 0; i < arr.length; i++) {
      if (!used.has(i)) {
        used.add(i);
        current.push(arr[i]);
        permute(current);
        current.pop();
        used.delete(i);
      }
    }
  };
  permute([]);
  return result;
};

const generateQuestions = (difficulty: Difficulty): StoryQuestion[] => {
  const storySet = stories[difficulty];
  const questions: StoryQuestion[] = [];
  
  storySet.forEach((story, sIdx) => {
    // Story Sequencing Question - Multiple Choice Format
    const correctOrder = story.events;
    const allPermutations = getAllPermutations([...correctOrder]);
    const correctSeqStr = allPermutations[0].join(' → ');
    
    // Create options with correct sequence and wrong sequences
    const options = [
      correctSeqStr,
      story.wrongSequences[0].join(' → '),
      story.wrongSequences[1].join(' → '),
      story.wrongSequences[2].join(' → ')
    ].sort(() => Math.random() - 0.5);

    questions.push({
      id: `seq_${difficulty}_${sIdx}`,
      question: `Arrange these events from "${story.title}" in correct order. What is the correct sequence?`,
      questionHindi: `"${story.title}" में इन घटनाओं का सही क्रम क्या है?`,
      type: 'sequence',
      options: options,
      correctAnswer: correctSeqStr,
      hint: 'Think about what happened first, second, third...',
      explanation: `The correct order is: ${correctOrder.join(' → ')}. ${story.moral}`,
      topic: 'Story Sequencing',
      points: 15 + (difficulty === 'master' ? 10 : 0),
    });

    // Moral Understanding - Multiple Choice
    const moralOptions = [
      story.moral,
      "Always work alone",
      "Never help others", 
      "Give up when things are hard"
    ].sort(() => Math.random() - 0.5);

    questions.push({
      id: `moral_${difficulty}_${sIdx}`,
      question: `What is the main message (moral) of "${story.title}"?`,
      questionHindi: `"${story.title}" का मुख्य संदेश क्या है?`,
      type: 'mcq',
      options: moralOptions,
      correctAnswer: story.moral,
      hint: 'Think about what the story teaches us about life',
      explanation: `The story teaches: ${story.moral}`,
      topic: 'Moral Understanding',
      points: 10 + (difficulty === 'master' ? 5 : 0),
    });

    // Cause and Effect - Multiple Choice
    questions.push({
      id: `cause_${difficulty}_${sIdx}`,
      question: `WHY did the events happen in "${story.title}"? What was the main cause?`,
      questionHindi: `"${story.title}" में मुख्य कारण क्या था?`,
      type: 'mcq',
      options: [
        "Because of the characters' choices",
        "Because it was raining",
        "Because the moon was full",
        "Randomly happened"
      ],
      correctAnswer: "Because of the characters' choices",
      hint: 'Think about what drove the story forward',
      explanation: 'Stories are shaped by what characters do and decide.',
      topic: 'Cause & Effect',
      points: 12 + (difficulty === 'master' ? 8 : 0),
    });

    if (difficulty !== 'easy') {
      // Prediction - Multiple Choice
      questions.push({
        id: `pred_${difficulty}_${sIdx}`,
        question: `What would happen if in "${story.title}" the MAIN character had made a DIFFERENT choice?`,
        questionHindi: `अगर मुख्य पात्र ने अलग चुनाव किया होता तो क्या होता?`,
        type: 'mcq',
        options: [
          "The story would have changed completely",
          "Nothing would have changed",
          "The story would have ended faster",
          "All characters would have disappeared"
        ],
        correctAnswer: "The story would have changed completely",
        hint: 'Think about what was most important in the story',
        explanation: 'Every choice changes the outcome of a story.',
        topic: 'Prediction & Reasoning',
        points: 20 + (difficulty === 'master' ? 10 : 0),
      });
    }

    if (difficulty === 'hard' || difficulty === 'master') {
      // Character Analysis - Multiple Choice with Reasoning
      questions.push({
        id: `char_${difficulty}_${sIdx}`,
        question: `In "${story.title}", was the MAIN character's final outcome FAIR? What do you think?`,
        questionHindi: `क्या "${story.title}" में मुख्य पात्र का अंत справедлива था?`,
        type: 'mcq',
        options: [
          "Yes - their actions led to natural consequences",
          "No - they didn't deserve what happened",
          "Partially fair - but something was missing",
          "It doesn't matter - it's just a story"
        ],
        correctAnswer: "Yes - their actions led to natural consequences",
        hint: 'Think about whether actions matched consequences',
        explanation: `In "${story.title}", ${story.moral}`,
        topic: 'Character Analysis',
        points: 25 + (difficulty === 'master' ? 10 : 0),
      });
    }
  });

  return questions.sort(() => Math.random() - 0.5);
};

const StoryPathAdventure: React.FC<StoryPathAdventureProps> = ({ onExit }) => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [level, setLevel] = useState(1);
  const [questions, setQuestions] = useState<StoryQuestion[]>([]);
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
    setQuestions(allQuestions.slice(0, 8));
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
    const isCorrect = answer.trim() === currentQ.correctAnswer.trim();
    
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
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <BookOpen size={64} className="mx-auto mb-4 text-white" />
            <h1 className="text-4xl font-bold text-white mb-2">Story Path Adventure</h1>
            <p className="text-gray-200">Master story sequencing, morals & reasoning!</p>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 text-center">🎮 Select Level</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((lvl) => (
              <button
                key={lvl}
                onClick={() => startGame(lvl)}
                className="bg-white rounded-xl shadow-2xl p-6 hover:scale-105 transition-all"
              >
                <div className="text-3xl font-bold text-indigo-600 mb-2">{getDifficultyLabel(lvl)}</div>
                <div className="text-gray-600 text-sm">
                  {lvl === 1 && "Simple stories, basic sequencing"}
                  {lvl === 2 && "More events, cause & effect"}
                  {lvl === 3 && "Complex stories, predictions"}
                  {lvl === 4 && "Master level, deep analysis"}
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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Story Path Adventure</h1>
              <p className="text-gray-600">Level {level}: {getDifficultyLabel(level)}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-indigo-600">{score}</p>
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
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all"
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
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                {currentQ.points} pts
              </span>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">{currentQ.question}</h2>
            {currentQ.questionHindi && (
              <p className="text-lg text-gray-600 mb-4">{currentQ.questionHindi}</p>
            )}

            {/* Options - All questions now have MCQ options */}
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
                        : 'bg-white border-gray-200 hover:border-indigo-300'
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

            {/* Feedback */}
            {showFeedback && (
              <div className={`mt-6 p-4 rounded-lg ${
                selectedAnswer?.trim() === currentQ.correctAnswer.trim()
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              } border`}>
                <p className="font-semibold mb-1">
                  {selectedAnswer?.trim() === currentQ.correctAnswer.trim()
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
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2"
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
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-100 p-6">
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
                  ? `Great job! You got ${accuracy}% accuracy!` 
                  : `You got ${accuracy}% accuracy. Keep trying!`}
              </p>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-gray-600 text-sm">Score</p>
                  <p className="text-2xl font-bold text-indigo-600">{score}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-gray-600 text-sm">Accuracy</p>
                  <p className="text-2xl font-bold text-indigo-600">{accuracy}%</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-gray-600 text-sm">Correct</p>
                  <p className="text-2xl font-bold text-indigo-600">{correctAnswers}/{totalAnswered}</p>
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

export default StoryPathAdventure;

