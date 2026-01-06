'use client';

import React, { useState } from 'react';
import { RotateCcw, Trophy, ChevronRight, ArrowRight, Star, MessageCircle } from 'lucide-react';

type QuestionType = 'main_idea' | 'detail' | 'inference' | 'vocab_context' | 'sequence' | 'reasoning';

interface ComprehensionQuestion {
  id: string;
  passage: string;
  question: string;
  questionHindi?: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string;
  hint: string;
  explanation: string;
  topic: string;
  points: number;
}

type Difficulty = 'easy' | 'medium' | 'hard' | 'master';
type GameState = 'menu' | 'playing' | 'completed';

interface ThinkAndTellProps {
  onExit?: () => void;
}

const passages: Record<Difficulty, Array<{title: string; text: string; questions: Array<{type: QuestionType; q: string; options?: string[]; answer: string; hint: string; explanation: string; topic: string; points: number}>}>> = {
  easy: [
    {
      title: "The Helpful Squirrel",
      text: "It was autumn. Squirrel was busy collecting acorns. He gathered many acorns and stored them in a hollow tree. Winter came. The snow covered everything. Squirrel was warm in his tree. He had enough food to last all winter. The other animals were hungry because they did not prepare.",
      questions: [
        { type: 'main_idea', q: "What is this story mainly about?", options: ["How squirrels sleep", "Why we need food", "Being prepared for winter", "How snow falls"], answer: "Being prepared for winter", hint: "Think about what the squirrel did", explanation: "The story shows the importance of preparing for winter.", topic: "Main Idea", points: 10 },
        { type: 'detail', q: "Where did Squirrel store his acorns?", options: ["In a hole in the ground", "In a hollow tree", "Under a rock", "In a basket"], answer: "In a hollow tree", hint: "Look for where he stored them", explanation: "The story says he stored them in a hollow tree.", topic: "Details", points: 8 },
        { type: 'inference', q: "Why were the other animals hungry?", options: ["They didn't like acorns", "They didn't prepare food", "It was too cold", "They were sleeping"], answer: "They didn't prepare food", hint: "Think about what the other animals did differently", explanation: "The story says others were hungry because they did not prepare.", topic: "Inference", points: 12 },
        { type: 'vocab_context', q: "What does 'gathered' mean in 'He gathered many acorns'?", options: ["Threw away", "Collected together", "Ate quickly", "Planted them"], answer: "Collected together", hint: "Think about what collecting acorns means", explanation: "Gathered means to bring things together.", topic: "Vocabulary in Context", points: 10 },
      ]
    },
    {
      title: "The Brave Little Bird",
      text: "A little bird lived in a big cage. She had food and water every day. But she wanted to fly in the sky. One day, the cage door was left open. The bird was scared. She had never been outside. Then she remembered the sky she saw through the window. She took a deep breath and flew out. She was free!",
      questions: [
        { type: 'sequence', q: "What happened FIRST in the story?", options: ["The bird flew away", "The cage door was left open", "The bird lived in a cage", "The bird was scared"], answer: "The bird lived in a cage", hint: "Think about what happened first", explanation: "First we learn about the bird in the cage.", topic: "Sequence", points: 8 },
        { type: 'main_idea', q: "What is the main message of this story?", options: ["Birds should live in cages", "Being brave helps us be free", "Doors should be closed", "Windows are important"], answer: "Being brave helps us be free", hint: "Think about what the bird learned", explanation: "The bird was brave and gained freedom.", topic: "Main Idea", points: 10 },
        { type: 'inference', q: "How did the bird feel when she first saw the open door?", options: ["Happy and excited", "Scared and nervous", "Hungry and tired", "Sleepy and lazy"], answer: "Scared and nervous", hint: "Look for words describing her feelings", explanation: "The story says she was scared.", topic: "Inference", points: 12 },
      ]
    }
  ],
  medium: [
    {
      title: "The Clever Farmer",
      text: "A farmer had three sons who always argued. He gave each son a bamboo stick and said, 'Break this.' They broke it easily. Then he gave each a bundle of sticks tied together. None of them could break the bundle. The father said, 'Like these sticks, you are strong when you are united. When you fight, you are weak.' The sons understood and stopped arguing.",
      questions: [
        { type: 'main_idea', q: "What is the MAIN MESSAGE of this story?", options: ["Bamboo is strong", "Farmers are smart", "Unity gives strength", "Sticks are useful"], answer: "Unity gives strength", hint: "What did the father want to teach?", explanation: "The father taught that unity makes us stronger.", topic: "Main Idea", points: 12 },
        { type: 'reasoning', q: "Why did the father give them sticks to break?", options: ["Because he was angry", "To teach them a lesson about unity", "To play a game", "To make them work"], answer: "To teach them a lesson about unity", hint: "Think about what he wanted them to learn", explanation: "The father used sticks to demonstrate his message.", topic: "Author's Purpose", points: 15 },
        { type: 'inference', q: "What would likely happen if the sons continued arguing?", options: ["They would become richer", "They would become weaker as a family", "They would break more sticks", "They would have more bamboo"], answer: "They would become weaker as a family", hint: "Apply the story's lesson", explanation: "Division makes people weaker.", topic: "Prediction/Inference", points: 15 },
        { type: 'vocab_context', q: "What does 'united' mean in 'you are strong when you are united'?", options: ["Living in the same house", "Working together and supporting each other", "Having the same clothes", "Walking in a line"], answer: "Working together and supporting each other", hint: "Think about what makes people strong together", explanation: "United means working together as one.", topic: "Vocabulary", points: 12 },
      ]
    },
    {
      title: "The Floating Island",
      text: "Long ago, people on a small island were cutting down all their trees. A wise old woman warned them, 'Stop cutting! The trees hold the soil. Without trees, the rain will wash away the earth.' But no one listened. Soon, heavy rains came. The soil washed away. Parts of the island floated away on the water. Only then did people understand.",
      questions: [
        { type: 'detail', q: "What did the wise woman warn the people about?", options: ["Not to plant trees", "To cut down all trees", "The rain and soil connection", "To build boats"], answer: "The rain and soil connection", hint: "What connection did she explain?", explanation: "She explained trees hold soil and prevent erosion.", topic: "Details", points: 10 },
        { type: 'reasoning', q: "What was the EFFECT of cutting down all the trees?", options: ["The island became more beautiful", "The soil washed away and parts floated", "The people became richer", "The rain stopped"], answer: "The soil washed away and parts floated", hint: "What happened as a result?", explanation: "Without trees, erosion occurred.", topic: "Cause & Effect", points: 15 },
        { type: 'reasoning', q: "What could the people have done differently to avoid this?", options: ["Cut trees faster", "Ignore warnings", "Plant more trees and protect forests", "Move to another country"], answer: "Plant more trees and protect forests", hint: "What solution would prevent erosion?", explanation: "Protecting trees prevents soil erosion.", topic: "Problem Solving", points: 18 },
        { type: 'inference', q: "What does this story teach us about nature?", options: ["Nature is not important", "Nature works in cycles we must understand", "Rain is always bad", "Islands can float"], answer: "Nature works in cycles we must understand", hint: "What lesson does nature teach?", explanation: "Understanding nature's balance is crucial.", topic: "Theme", points: 15 },
      ]
    }
  ],
  hard: [
    {
      title: "The Mysterious Map",
      text: "An old explorer found a strange map in a dusty library. The map showed a path through a dangerous jungle to a lost city of gold. Many had tried to find this city and never returned. The explorer studied the map for months. He learned to read the ancient symbols. He packed supplies carefully and hired a small team. Some said he was brave, others said he was foolish.",
      questions: [
        { type: 'inference', q: "Based on the story, what can we infer about previous explorers?", options: ["They were all successful", "They probably failed or died", "They found the city easily", "They never tried"], answer: "They probably failed or died", hint: "The story says many never returned", explanation: "Not returning suggests failure or death.", topic: "Inference", points: 15 },
        { type: 'reasoning', q: "Why did the explorer study the map for months before going?", options: ["He was lazy", "To understand the symbols and plan carefully", "He was scared of the dark", "He lost his supplies"], answer: "To understand the symbols and plan carefully", hint: "What did studying accomplish?", explanation: "Preparation increases chances of success.", topic: "Reasoning", points: 18 },
        { type: 'reasoning', q: "Was the explorer BRAVE or FOOLISH? Give reasoning.", options: ["Brave - he prepared carefully", "Foolish - many died", "Both - courage without preparation is dangerous", "Neither - he never went"], answer: "Both - courage without preparation is dangerous", hint: "Consider both perspectives", explanation: "Courage plus preparation = wisdom.", topic: "Critical Thinking", points: 22 },
        { type: 'vocab_context', q: "What does 'ancient' mean in 'ancient symbols'?", options: ["Very old symbols from long ago", "New symbols from today", "Broken symbols", "Colorful symbols"], answer: "Very old symbols from long ago", hint: "Think about the context of an old map", explanation: "Ancient means from very long ago.", topic: "Vocabulary", points: 10 },
      ]
    },
    {
      title: "The Unexpected Gift",
      text: "A poor woodcutter found a magic lamp. When he rubbed it, a genie appeared and offered three wishes. The woodcutter was happy. His wife said, 'Wish for a big house!' His son said, 'Wish for gold!' The woodcutter thought long and hard. Finally, he wished for 'wisdom.' His wife and son were disappointed. But the genie smiled and said, 'Wisdom is the greatest gift. With it, you will gain everything else.'",
      questions: [
        { type: 'main_idea', q: "What is the central theme of this story?", options: ["Magic lamps are real", "Money is more important than wisdom", "Wisdom is more valuable than material things", "Genies always trick people"], answer: "Wisdom is more valuable than material things", hint: "What is the story teaching?", explanation: "The story shows wisdom's superior value.", topic: "Theme", points: 15 },
        { type: 'inference', q: "Why did the wife and son first want a house and gold?", options: ["They were poor and needed basics", "They didn't trust the genie", "They were greedy", "They didn't believe in magic"], answer: "They were poor and needed basics", hint: "Consider their situation", explanation: "Poverty often makes people focus on material needs.", topic: "Inference", points: 15 },
        { type: 'reasoning', q: "Why might the woodcutter's choice of 'wisdom' actually lead to getting everything?", options: ["The genie was forced to give more", "Wisdom helps make good decisions that bring success", "It was a trick", "Wisdom creates gold"], answer: "Wisdom helps make good decisions that bring success", hint: "What does wisdom enable?", explanation: "Wisdom leads to better life choices.", topic: "Reasoning", points: 20 },
        { type: 'reasoning', q: "If you had three wishes, what would you choose and WHY?", options: ["Material wealth", "Knowledge/skills", "Wisdom", "All of the above work differently"], answer: "All of the above work differently", hint: "Consider different perspectives", explanation: "Each choice has different implications.", topic: "Personal Response", points: 25 },
      ]
    }
  ],
  master: [
    {
      title: "The Impossible Choice",
      text: "A train was heading toward five people on the track. The train could not stop. You were standing near a lever that could switch the train to another track. But there was one person on that track. You had only seconds to decide. Some said switch and save five at the cost of one. Others said don't switch because actively causing death is worse than letting it happen. The debate continued for years.",
      questions: [
        { type: 'reasoning', q: "What is the main ethical dilemma here?", options: ["Saving time vs wasting time", "Active harm vs allowing natural outcome", "Train safety rules", "Who should pay for damages"], answer: "Active harm vs allowing natural outcome", hint: "What are the two choices?", explanation: "The dilemma is between action and inaction.", topic: "Ethical Reasoning", points: 25 },
        { type: 'reasoning', q: "What is one argument FOR switching the lever?", options: ["Trains are fun to watch", "Saving more lives is better, even with cost", "One person deserves to die", "The lever doesn't work"], answer: "Saving more lives is better, even with cost", hint: "Consider utilitarianism", explanation: "Maximizing overall good (5 > 1).", topic: "Arguments", points: 22 },
        { type: 'reasoning', q: "What is one argument AGAINST switching?", options: ["Switching makes you responsible for the death", "One person is more valuable", "Trains should never switch", "It's not your problem"], answer: "Switching makes you responsible for the death", hint: "Consider deontology", explanation: "Taking action creates responsibility.", topic: "Counter Arguments", points: 22 },
        { type: 'reasoning', q: "Is there a 'right' answer? Why or why not?", options: ["Yes - always save more lives", "No - ethics is about reasoning, not answers", "Yes - never take action", "The situation is unrealistic"], answer: "No - ethics is about reasoning, not answers", hint: "Consider the nature of ethical dilemmas", explanation: "Some dilemmas test reasoning, not yield answers.", topic: "Critical Analysis", points: 30 },
      ]
    },
    {
      title: "The Last Tree",
      text: "In a world where all trees had been cut down, a child found one small seed. Scientists said, 'Plant it! It could save us!' Politicians said, 'Study it first to understand.' Business leaders said, 'Sell it to the highest bidder - it could be worth millions.' The child stood holding the seed, looking at the barren landscape. 'If I plant it,' she thought, 'it might grow and help everyone. But if I give it to any of them, they might destroy it for their own purposes.'",
      questions: [
        { type: 'inference', q: "What can we infer about the world this child lives in?", options: ["A lush green paradise", "A barren, ecologically damaged world", "A normal world with many trees", "A fictional fantasy land"], answer: "A barren, ecologically damaged world", hint: "What does 'all trees had been cut down' suggest?", explanation: "The world has suffered environmental collapse.", topic: "Inference", points: 18 },
        { type: 'reasoning', q: "What likely CAUSED the world to lose all its trees?", options: ["Natural disaster", "Human actions (cutting, development)", "Disease", "Climate change"], answer: "Human actions (cutting, development)", hint: "What do business leaders suggest?", explanation: "Human greed led to deforestation.", topic: "Cause & Effect", points: 20 },
        { type: 'reasoning', q: "Why might the scientists be right to plant immediately?", options: ["The seed might die if not planted fast", "Time is critical for the environment", "Waiting could mean losing the last chance", "Scientists always know best"], answer: "Waiting could mean losing the last chance", hint: "Consider urgency", explanation: "The last seed needs immediate action.", topic: "Perspective Analysis", points: 22 },
        { type: 'reasoning', q: "What would YOU do with the seed, and what does it reveal about values?", options: ["Plant it yourself - direct action", "Give to scientists - knowledge", "Sell it - market economy", "Destroy it - equal distribution"], answer: "Any with reasoning", hint: "Consider all stakeholders", explanation: "Your choice reveals your values.", topic: "Personal Ethics", points: 30 },
      ]
    }
  ]
};

const generateQuestions = (difficulty: Difficulty): ComprehensionQuestion[] => {
  const questions: ComprehensionQuestion[] = [];
  const passageSet = passages[difficulty];
  
  passageSet.forEach((passage, pIdx) => {
    passage.questions.forEach((q, qIdx) => {
      questions.push({
        id: `${difficulty}_${pIdx}_${qIdx}`,
        passage: passage.title,
        question: q.q,
        type: q.type,
        options: q.options,
        correctAnswer: q.answer,
        hint: q.hint,
        explanation: q.explanation,
        topic: q.topic,
        points: q.points,
      });
    });
  });

  return questions.sort(() => Math.random() - 0.5).slice(0, 8);
};

const ThinkAndTell: React.FC<ThinkAndTellProps> = ({ onExit }) => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [level, setLevel] = useState(1);
  const [questions, setQuestions] = useState<ComprehensionQuestion[]>([]);
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
  const passed = totalAnswered > 0 && (correctAnswers / totalAnswered) >= 0.75;

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-600 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <MessageCircle size={64} className="mx-auto mb-4 text-white" />
            <h1 className="text-4xl font-bold text-white mb-2">Think & Tell</h1>
            <p className="text-gray-200">Comprehension & Reasoning Challenge!</p>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 text-center">🎮 Select Level</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((lvl) => (
              <button
                key={lvl}
                onClick={() => startGame(lvl)}
                className="bg-white rounded-xl shadow-2xl p-6 hover:scale-105 transition-all"
              >
                <div className="text-3xl font-bold text-orange-600 mb-2">{getDifficultyLabel(lvl)}</div>
                <div className="text-gray-600 text-sm">
                  {lvl === 1 && "Simple stories, basic questions"}
                  {lvl === 2 && "Longer passages, inference"}
                  {lvl === 3 && "Complex stories, critical thinking"}
                  {lvl === 4 && "Ethical dilemmas, deep analysis"}
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
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-100 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Think & Tell</h1>
              <p className="text-gray-600">Level {level}: {getDifficultyLabel(level)}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-orange-600">{score}</p>
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
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full transition-all"
                style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
            <div className="bg-amber-50 rounded-lg p-4 mb-4 border-l-4 border-amber-500">
              <h3 className="font-bold text-amber-800 mb-1">📖 {currentQ.passage}</h3>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Star size={16} className="text-yellow-500" />
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                {currentQ.topic}
              </span>
              <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold">
                {currentQ.points} pts
              </span>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">{currentQ.question}</h2>

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
                          : 'bg-white border-gray-200 hover:border-orange-300'
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
              className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2"
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
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            {passed ? (
              <>
                <Trophy size={64} className="mx-auto mb-4 text-yellow-500" />
                <h2 className="text-3xl font-bold text-orange-600 mb-4">🎉 Level {level} Complete!</h2>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">💪</div>
                <h2 className="text-3xl font-bold text-orange-600 mb-4">Keep Thinking!</h2>
              </>
            )}

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className={`text-lg font-semibold mb-2 ${passed ? 'text-green-700' : 'text-orange-700'}`}>
                {passed 
                  ? `Excellent reasoning! ${accuracy}% comprehension!` 
                  : `You got ${accuracy}% accuracy. Keep practicing reading!`}
              </p>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-gray-600 text-sm">Score</p>
                  <p className="text-2xl font-bold text-orange-600">{score}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-gray-600 text-sm">Accuracy</p>
                  <p className="text-2xl font-bold text-orange-600">{accuracy}%</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-gray-600 text-sm">Correct</p>
                  <p className="text-2xl font-bold text-orange-600">{correctAnswers}/{totalAnswered}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 flex-wrap">
              {passed && level < 4 ? (
                <button
                  onClick={() => startGame(level + 1)}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
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

export default ThinkAndTell;

