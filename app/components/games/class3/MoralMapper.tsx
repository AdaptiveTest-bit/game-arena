'use client';

import React, { useState } from 'react';
import { RotateCcw, Trophy, ChevronRight, ArrowRight, Star, Heart } from 'lucide-react';

type QuestionType = 'value_match' | 'scenario' | 'choice' | '排序' | 'analysis';

interface MoralQuestion {
  id: string;
  scenario: string;
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

interface MoralMapperProps {
  onExit?: () => void;
}

const moralData: Record<Difficulty, MoralQuestion[]> = {
  easy: [
    {
      id: 'kind_1',
      scenario: "Your friend fell down and hurt their knee at school.",
      question: "What would be the KIND thing to do?",
      type: 'choice',
      options: ["Laugh at them", "Help them up and ask if they're okay", "Ignore them and keep playing", "Tell them it's their fault"],
      correctAnswer: "Help them up and ask if they're okay",
      hint: "Think about what would make your friend feel better",
      explanation: "Helping someone in need shows kindness and compassion.",
      topic: "Kindness",
      points: 10,
    },
    {
      id: 'hon_1',
      scenario: "You broke a vase at home by accident.",
      question: "What is the HONEST thing to do?",
      type: 'choice',
      options: ["Hide the pieces and say you didn't do it", "Tell your parents what happened and apologize", "Blame it on your brother or sister", "Run away from home"],
      correctAnswer: "Tell your parents what happened and apologize",
      hint: "Honesty means telling the truth even when it's hard",
      explanation: "Owning up to mistakes shows responsibility and builds trust.",
      topic: "Honesty",
      points: 10,
    },
    {
      id: 'cour_1',
      scenario: "Some kids are being mean to a new student at school.",
      question: "What would take the MOST COURAGE?",
      type: 'choice',
      options: ["Do nothing and walk away", "Join in with the other kids", "Tell a teacher about it", "Stand up for the new student even if they laugh at you"],
      correctAnswer: "Stand up for the new student even if they laugh at you",
      hint: "Courage means doing the right thing even when it's scary",
      explanation: "Standing up for others shows real courage.",
      topic: "Courage",
      points: 12,
    },
    {
      id: 'resp_1',
      scenario: "Your teacher gave you homework to complete.",
      question: "What is the RESPONSIBLE thing to do?",
      type: 'choice',
      options: ["Throw it in the trash", "Do it quickly without trying", "Do your best work and submit on time", "Copy from a friend"],
      correctAnswer: "Do your best work and submit on time",
      hint: "Responsibility means completing your tasks properly",
      explanation: "Completing tasks well shows you're responsible.",
      topic: "Responsibility",
      points: 10,
    },
    {
      id: 'resp_2',
      scenario: "Your mom asked you to clean your room.",
      question: "What shows RESPONSIBILITY?",
      type: 'choice',
      options: ["Say you'll do it later and forget", "Clean it quickly without care", "Clean it thoroughly and neatly", "Tell her to clean it herself"],
      correctAnswer: "Clean it thoroughly and neatly",
      hint: "Responsibility means doing the job well",
      explanation: "Taking pride in your work shows responsibility.",
      topic: "Responsibility",
      points: 10,
    },
    {
      id: 'grat_1',
      scenario: "Your grandmother made your favorite food for you.",
      question: "What shows GRATITUDE?",
      type: 'choice',
      options: ["Eat it without saying anything", "Complain that you wanted something else", "Say thank you and enjoy the meal", "Throw it away because you're not hungry"],
      correctAnswer: "Say thank you and enjoy the meal",
      hint: "Gratitude means showing you're thankful",
      explanation: "Expressing thanks shows you appreciate others' efforts.",
      topic: "Gratitude",
      points: 10,
    },
  ],
  medium: [
    {
      id: 'kind_2',
      scenario: "Your classmate is struggling with math and the teacher is busy.",
      question: "What is the BEST way to show KINDNESS?",
      type: 'choice',
      options: ["Ignore them - it's not your problem", "Laugh and say math is easy", "Offer to help them understand after class", "Tell everyone they're bad at math"],
      correctAnswer: "Offer to help them understand after class",
      hint: "Kindness means helping others when they need it",
      explanation: "Helping peers shows empathy and kindness.",
      topic: "Kindness",
      points: 12,
    },
    {
      id: 'fair_1',
      scenario: "Your team is picking players for a game. Your best friend isn't good at sports.",
      question: "What is the FAIR thing to do?",
      type: 'choice',
      options: ["Only pick good players so you can win", "Pick your friend anyway because they're your friend", "Pick them for your team and encourage them", "Make fun of their skills"],
      correctAnswer: "Pick them for your team and encourage them",
      hint: "Fairness means giving everyone a chance",
      explanation: "Including and encouraging others is fair and kind.",
      topic: "Fairness",
      points: 12,
    },
    {
      id: 'coop_1',
      scenario: "Your class is doing a group project but one person is doing all the work.",
      question: "What is the COOPERATIVE thing to do?",
      type: 'choice',
      options: ["Let them do everything - less work for you", "Do your share of the work and help others", "Complain that the project is unfair", "Refuse to participate"],
      correctAnswer: "Do your share of the work and help others",
      hint: "Cooperation means contributing to the group",
      explanation: "Working together fairly benefits everyone.",
      topic: "Cooperation",
      points: 12,
    },
    {
      id: 'resp_3',
      scenario: "You promised to feed your neighbor's cat while they're on vacation.",
      question: "What shows RESPONSIBILITY?",
      type: 'choice',
      options: ["Forget about it and let the cat go hungry", "Feed the cat every day as promised", "Tell them you changed your mind", "Feed it only on the first day"],
      correctAnswer: "Feed the cat every day as promised",
      hint: "Responsibility means keeping your promises",
      explanation: "Following through on commitments shows responsibility.",
      topic: "Responsibility",
      points: 12,
    },
    {
      id: 'comp_1',
      scenario: "A new student joins your class and looks lonely.",
      question: "What shows COMPASSION?",
      type: 'choice',
      options: ["Leave them alone - they'll make friends eventually", "Introduce yourself and show them around", "Stick with your existing friends only", "Ignore them because they're new"],
      correctAnswer: "Introduce yourself and show them around",
      hint: "Compassion means caring about others' feelings",
      explanation: "Welcoming newcomers shows compassion and empathy.",
      topic: "Compassion",
      points: 15,
    },
    {
      id: 'value_1',
      scenario: "You see someone drop their books in the hallway.",
      question: "Which value does helping them show?",
      type: 'value_match',
      options: ["Kindness", "Courage", "Honesty", "Wealth"],
      correctAnswer: "Kindness",
      hint: "Think about what kindness means",
      explanation: "Helping others is an act of kindness.",
      topic: "Value Recognition",
      points: 10,
    },
  ],
  hard: [
    {
      id: 'scen_1',
      scenario: "Your best friend tells you a secret but then asks you not to tell anyone. Another friend really wants to know the secret.",
      question: "What should you do?",
      type: 'scenario',
      options: ["Tell the secret because friends share everything", "Keep the promise and respect your friend's privacy", "Tell only a little bit of the secret", "Make up a false secret"],
      correctAnswer: "Keep the promise and respect your friend's privacy",
      hint: "Being trustworthy means keeping promises even when it's hard",
      explanation: "Keeping confidences shows you're trustworthy and respectful.",
      topic: "Trust & Loyalty",
      points: 18,
    },
    {
      id: 'scen_2',
      scenario: "You see someone being bullied online. The bully is popular and you don't want to get in trouble.",
      question: "What is the RIGHT thing to do?",
      type: 'scenario',
      options: ["Join in so you don't get bullied too", "Do nothing - it's not your business", "Stand up for the person being bullied, even if it's scary", "Watch but don't participate"],
      correctAnswer: "Stand up for the person being bullied, even if it's scary",
      hint: "Courage means doing what's right despite fear",
      explanation: "Speaking against bullying shows courage and compassion.",
      topic: "Courage & Kindness",
      points: 20,
    },
    {
      id: 'ethic_1',
      scenario: "You found a wallet with money on the playground. No one is looking.",
      question: "What is the MOST ETHICAL choice?",
      type: 'scenario',
      options: ["Keep the money - finders keepers", "Take the money but put the wallet back", "Turn it in to the teacher or office", "Leave it there and walk away"],
      correctAnswer: "Turn it in to the teacher or office",
      hint: "Honesty means doing the right thing even when no one is watching",
      explanation: "Returning lost items shows integrity and honesty.",
      topic: "Honesty & Integrity",
      points: 18,
    },
    {
      id: 'prior_1',
      scenario: "You promised to help your friend with a project, but your favorite TV show is on. Both are happening at the same time.",
      question: "What shows GOOD PRIORITIES?",
      type: 'scenario',
      options: ["Watch TV - shows come back every week", "Help your friend and record the show", "Do neither - take a nap instead", "Help for 5 minutes then watch TV"],
      correctAnswer: "Help your friend and record the show",
      hint: "Good priorities mean keeping commitments",
      explanation: "Keeping promises shows you're reliable and responsible.",
      topic: "Priorities & Commitment",
      points: 15,
    },
    {
      id: 'dilemma_1',
      scenario: "Everyone in your group is choosing to cheat on a test. If you don't cheat, you'll fail the group grade. If you do cheat, you'll feel guilty.",
      question: "What should you do and WHY?",
      type: 'scenario',
      options: ["Cheat to pass - everyone else is doing it", "Don't cheat and accept the grade", "Cheat but feel bad about it", "Tell the teacher about the cheating"],
      correctAnswer: "Don't cheat and accept the grade",
      hint: "Integrity means doing what's right even when it's hard",
      explanation: "Your integrity matters more than a grade. Being honest is always the right choice.",
      topic: "Integrity",
      points: 25,
    },
  ],
  master: [
    {
      id: 'deep_1',
      scenario: "You worked really hard on a project and got an A. Your friend worked less and got a B. The teacher asks you to help your friend improve. But your friend says they don't need help.",
      question: "What is the BEST response?",
      type: 'scenario',
      options: ["Say 'fine, I tried' and walk away", "Respect their choice but let them know you're there if needed", "Force them to accept your help", "Tell the teacher they refused help"],
      correctAnswer: "Respect their choice but let them know you're there if needed",
      hint: "True kindness respects others' autonomy while showing support",
      explanation: "Respecting choices while offering ongoing support shows maturity and care.",
      topic: "Respect & Support",
      points: 22,
    },
    {
      id: 'deep_2',
      scenario: "You see someone being treated unfairly, but standing up for them might make YOU unpopular.",
      question: "What does TRUE COURAGE look like here?",
      type: 'scenario',
      options: ["Don't risk your popularity - stay quiet", "Stand up anyway and accept the consequences", "Only stand up if others will support you", "Find a way to help without being noticed"],
      correctAnswer: "Stand up anyway and accept the consequences",
      hint: "Courage isn't about being fearless - it's about doing right despite fear",
      explanation: "True courage means standing for what's right even when it costs you something.",
      topic: "Courage & Integrity",
      points: 25,
    },
    {
      id: 'deep_3',
      scenario: "Your community is facing a problem (like pollution or waste). You could help organize a solution, but it will take time away from your personal interests.",
      question: "What shows SOCIAL RESPONSIBILITY?",
      type: 'scenario',
      options: ["It's not your problem - let the adults handle it", "Complain about the problem but don't act", "Help organize a solution even with the time sacrifice", "Move somewhere else"],
      correctAnswer: "Help organize a solution even with the time sacrifice",
      hint: "Social responsibility means contributing to your community",
      explanation: "Taking action for community good shows civic responsibility.",
      topic: "Social Responsibility",
      points: 28,
    },
    {
      id: 'deep_4',
      scenario: "You have two good friends who don't like each other. They both want you to choose sides. You're in the middle and it makes you uncomfortable.",
      question: "What is the MOST MATURE response?",
      type: 'scenario',
      options: ["Choose one friend and drop the other", "Stay friends with both without taking sides", "Avoid both friends to escape the drama", "Make them become friends against their will"],
      correctAnswer: "Stay friends with both without taking sides",
      hint: "Maturity means handling complex relationships with grace",
      explanation: "Maintaining relationships while respecting boundaries shows emotional maturity.",
      topic: "Relationship Management",
      points: 25,
    },
    {
      id: 'deep_5',
      scenario: "You made a mistake that hurt someone. You've apologized, but they still haven't forgiven you. It's been weeks.",
      question: "What's the BEST way to handle this?",
      type: 'scenario',
      options: ["Get angry and demand forgiveness", "Give them space and time - forgiveness takes time", "Pretend nothing happened", "Blame them for being too sensitive"],
      correctAnswer: "Give them space and time - forgiveness takes time",
      hint: "True remorse means respecting the other person's healing process",
      explanation: "Giving space shows respect and genuine remorse. People heal at different rates.",
      topic: "Forgiveness & Growth",
      points: 25,
    },
  ]
};

const generateQuestions = (difficulty: Difficulty): MoralQuestion[] => {
  return [...moralData[difficulty]].sort(() => Math.random() - 0.5);
};

const MoralMapper: React.FC<MoralMapperProps> = ({ onExit }) => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [level, setLevel] = useState(1);
  const [questions, setQuestions] = useState<MoralQuestion[]>([]);
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
      <div className="min-h-screen bg-gradient-to-br from-pink-600 via-rose-600 to-red-600 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Heart size={64} className="mx-auto mb-4 text-white" />
            <h1 className="text-4xl font-bold text-white mb-2">Moral Mapper</h1>
            <p className="text-gray-200">Story Logic & Values Challenge!</p>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 text-center">🎮 Select Level</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((lvl) => (
              <button
                key={lvl}
                onClick={() => startGame(lvl)}
                className="bg-white rounded-xl shadow-2xl p-6 hover:scale-105 transition-all"
              >
                <div className="text-3xl font-bold text-pink-600 mb-2">{getDifficultyLabel(lvl)}</div>
                <div className="text-gray-600 text-sm">
                  {lvl === 1 && "Basic values, simple scenarios"}
                  {lvl === 2 && "Real situations, multiple values"}
                  {lvl === 3 && "Ethical dilemmas, complex choices"}
                  {lvl === 4 && "Deep analysis, life situations"}
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
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-rose-100 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Moral Mapper</h1>
              <p className="text-gray-600">Level {level}: {getDifficultyLabel(level)}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-pink-600">{score}</p>
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
                className="bg-gradient-to-r from-pink-500 to-rose-500 h-3 rounded-full transition-all"
                style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
            <div className="bg-rose-50 rounded-lg p-4 mb-4 border-l-4 border-rose-500">
              <h3 className="font-bold text-rose-800 mb-1">📖 Scenario:</h3>
              <p className="text-gray-700">{currentQ.scenario}</p>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Star size={16} className="text-yellow-500" />
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                {currentQ.topic}
              </span>
              <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-semibold">
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
                          : 'bg-white border-gray-200 hover:border-pink-300'
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
                    ? '✅ Excellent moral judgment!'
                    : '❌ Think again about the values involved'}
                </p>
                <p className="text-sm text-gray-700">{currentQ.explanation}</p>
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-semibold">Think about:</span> {currentQ.hint}
                </p>
              </div>
            )}
          </div>

          {showFeedback && (
            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {currentQIndex + 1 < questions.length ? 'Next Scenario' : 'See Results'}
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
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-pink-100 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            {passed ? (
              <>
                <Trophy size={64} className="mx-auto mb-4 text-yellow-500" />
                <h2 className="text-3xl font-bold text-pink-600 mb-4">🎉 Level {level} Complete!</h2>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">💪</div>
                <h2 className="text-3xl font-bold text-pink-600 mb-4">Keep Learning Values!</h2>
              </>
            )}

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className={`text-lg font-semibold mb-2 ${passed ? 'text-green-700' : 'text-pink-700'}`}>
                {passed 
                  ? `Excellent moral reasoning! ${accuracy}% accuracy!` 
                  : `You got ${accuracy}% accuracy. Keep thinking about values!`}
              </p>
              
              <div className="grid-cols-3 gap-4 mt-4 grid">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-gray-600 text-sm">Score</p>
                  <p className="text-2xl font-bold text-pink-600">{score}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-gray-600 text-sm">Accuracy</p>
                  <p className="text-2xl font-bold text-pink-600">{accuracy}%</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-gray-600 text-sm">Correct</p>
                  <p className="text-2xl font-bold text-pink-600">{correctAnswers}/{totalAnswered}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 flex-wrap">
              {passed && level < 4 ? (
                <button
                  onClick={() => startGame(level + 1)}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  Next Level <ChevronRight size={20} />
                </button>
              ) : !passed && (
                <button
                  onClick={() => startGame(level)}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
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

export default MoralMapper;

