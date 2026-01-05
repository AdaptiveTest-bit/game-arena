import { create } from 'zustand';

// Question types for Math Marathon
export interface MathQuestion {
  id: number;
  question: string;
  options: number[];
  correctAnswer: number;
  chapter: 'multiplication' | 'division' | 'fractions' | 'factors';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuestionSet {
  level: number;
  name: string;
  questions: MathQuestion[];
}

// Generate procedural questions for each level
const generateLevel1Questions = (): MathQuestion[] => {
  // Level 1: Basic multiplication & division (Ch 2)
  const questions: MathQuestion[] = [];
  
  for (let i = 0; i < 5; i++) {
    const base = Math.floor(Math.random() * 9) + 2; // 2-10
    const multiplier = Math.floor(Math.random() * 8) + 2; // 2-10
    
    if (Math.random() > 0.5) {
      // Multiplication question
      const answer = base * multiplier;
      questions.push({
        id: i,
        question: `What is ${base} × ${multiplier}?`,
        options: generateOptions(answer, [base * (multiplier + 1), base * (multiplier - 1), base * multiplier + 1]),
        correctAnswer: answer,
        chapter: 'multiplication',
        difficulty: 'easy',
      });
    } else {
      // Division question
      const product = base * multiplier;
      questions.push({
        id: i,
        question: `What is ${product} ÷ ${base}?`,
        options: generateOptions(multiplier, [multiplier + 1, multiplier - 1, base]),
        correctAnswer: multiplier,
        chapter: 'division',
        difficulty: 'easy',
      });
    }
  }
  
  return questions;
};

const generateLevel2Questions = (): MathQuestion[] => {
  // Level 2: Word problems with mixed operations (Ch 2, 3, 5)
  const questions: MathQuestion[] = [];
  const scenarios = [
    { text: "books", count: 24, groups: 4 },
    { text: "candies", count: 36, groups: 6 },
    { text: "apples", count: 48, groups: 8 },
    { text: "stickers", count: 42, groups: 7 },
    { text: "pencils", count: 30, groups: 5 },
    { text: "erasers", count: 54, groups: 6 },
    { text: "marbles", count: 45, groups: 5 },
  ];
  
  for (let i = 0; i < 7; i++) {
    const scenario = scenarios[i % scenarios.length];
    
    if (Math.random() > 0.5) {
      // Factors question (Ch 3)
      const factor = Math.floor(Math.random() * 6) + 2;
      questions.push({
        id: i,
        question: `A teacher has ${scenario.count} ${scenario.text}. If she makes ${scenario.groups} equal groups, how many ${scenario.text} are in each group?`,
        options: generateOptions(scenario.count / scenario.groups, [scenario.count / (scenario.groups - 1), scenario.count / (scenario.groups + 1), factor]),
        correctAnswer: scenario.count / scenario.groups,
        chapter: 'factors',
        difficulty: 'medium',
      });
    } else {
      // Fraction question (Ch 5)
      const numerator = Math.floor(Math.random() * 3) + 1;
      const denominator = Math.floor(Math.random() * 3) + 4;
      const result = numerator / denominator;
      questions.push({
        id: i,
        question: `What is ${numerator}/${denominator} of ${scenario.count} ${scenario.text}?`,
        options: generateOptions(result, [result + 1, result - 1, Math.round(result)]),
        correctAnswer: result,
        chapter: 'fractions',
        difficulty: 'medium',
      });
    }
  }
  
  return questions;
};

const generateLevel3Questions = (): MathQuestion[] => {
  // Level 3: Multi-step problems (Ch 2, 3, 5, 6)
  const questions: MathQuestion[] = [];
  
  for (let i = 0; i < 10; i++) {
    const type = Math.floor(Math.random() * 3);
    
    if (type === 0) {
      // Multi-step fraction operation
      const n1 = Math.floor(Math.random() * 3) + 1;
      const d1 = Math.floor(Math.random() * 3) + 4;
      const n2 = Math.floor(Math.random() * 3) + 1;
      const d2 = Math.floor(Math.random() * 3) + 4;
      const lcm = getLCM(d1, d2);
      const result = (n1 * (lcm / d1)) + (n2 * (lcm / d2));
      
      questions.push({
        id: i,
        question: `Add these fractions: ${n1}/${d1} + ${n2}/${d2} = ?`,
        options: generateOptions(result / lcm, [result / (lcm + 1), (result + 1) / lcm, result / (lcm - 1)]),
        correctAnswer: result / lcm,
        chapter: 'fractions',
        difficulty: 'hard',
      });
    } else if (type === 1) {
      // Multi-step multiplication/division
      const a = Math.floor(Math.random() * 8) + 2;
      const b = Math.floor(Math.random() * 6) + 2;
      const c = Math.floor(Math.random() * 4) + 2;
      const answer = (a * b) / c;
      
      questions.push({
        id: i,
        question: `First multiply ${a} by ${b}, then divide by ${c}. What is the result?`,
        options: generateOptions(answer, [answer + 1, answer - 1, (a * b) + c]),
        correctAnswer: answer,
        chapter: 'multiplication',
        difficulty: 'hard',
      });
    } else {
      // Factors and multiples
      const num1 = Math.floor(Math.random() * 10) + 10;
      const num2 = Math.floor(Math.random() * 5) + 2;
      const answer = num1 * num2;
      
      questions.push({
        id: i,
        question: `Find the smallest number that has both ${num1} and ${num2} as factors.`,
        options: generateOptions(answer, [num1 + num2, num1 * num2 + 1, num1 * num2 - 1]),
        correctAnswer: answer,
        chapter: 'factors',
        difficulty: 'hard',
      });
    }
  }
  
  return questions;
};

// Helper function to generate options
const generateOptions = (correct: number, distractors: number[]): number[] => {
  const options = [correct];
  const uniqueDistractors = [...new Set(distractors.filter(d => d !== correct && d > 0))];
  
  for (const d of uniqueDistractors) {
    if (options.length < 4) {
      options.push(d);
    }
  }
  
  // Fill with random options if needed
  while (options.length < 4) {
    const random = Math.floor(Math.random() * 20) + 1;
    if (!options.includes(random)) {
      options.push(random);
    }
  }
  
  // Shuffle options
  return options.sort(() => Math.random() - 0.5);
};

// Helper function to find LCM
const getLCM = (a: number, b: number): number => {
  const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
  return (a * b) / gcd(a, b);
};

export interface MathMarathonState {
  // Game config
  currentLevel: number;
  totalLevels: number;
  
  // Question state
  currentQuestionIndex: number;
  questions: MathQuestion[];
  selectedAnswer: number | null;
  answeredQuestions: { questionId: number; isCorrect: boolean }[];
  
  // Game state
  gameStartTime: number;
  gameCompleted: boolean;
  levelCompleted: boolean;
  score: number;
  streak: number;
  
  // Actions
  startGame: (level?: number) => void;
  selectAnswer: (answer: number) => boolean;
  nextQuestion: () => void;
  resetGame: () => void;
  completeLevel: () => void;
  getTelemetryLog: () => any;
  getAccuracy: () => number;
}

export const useMathMarathonStore = create<MathMarathonState>((set, get) => {
  const generateQuestionsForLevel = (level: number): MathQuestion[] => {
    switch (level) {
      case 1:
        return generateLevel1Questions();
      case 2:
        return generateLevel2Questions();
      case 3:
        return generateLevel3Questions();
      default:
        return generateLevel1Questions();
    }
  };

  return {
    // Initial state
    currentLevel: 1,
    totalLevels: 3,
    
    currentQuestionIndex: 0,
    questions: generateQuestionsForLevel(1),
    selectedAnswer: null,
    answeredQuestions: [],
    
    gameStartTime: 0,
    gameCompleted: false,
    levelCompleted: false,
    score: 0,
    streak: 0,

    // Start the game
    startGame: (level = 1) => {
      set({
        currentLevel: level,
        currentQuestionIndex: 0,
        questions: generateQuestionsForLevel(level),
        selectedAnswer: null,
        answeredQuestions: [],
        gameStartTime: Date.now(),
        gameCompleted: false,
        levelCompleted: false,
        score: 0,
        streak: 0,
      });
    },

    // Select an answer
    selectAnswer: (answer: number) => {
      const state = get();
      const currentQuestion = state.questions[state.currentQuestionIndex];
      const isCorrect = answer === currentQuestion.correctAnswer;
      
      const newStreak = isCorrect ? state.streak + 1 : 0;
      const newScore = state.score + (isCorrect ? 10 + newStreak * 2 : 0);
      
      set({
        selectedAnswer: answer,
        answeredQuestions: [
          ...state.answeredQuestions,
          { questionId: currentQuestion.id, isCorrect },
        ],
        score: newScore,
        streak: newStreak,
      });
      
      return isCorrect;
    },

    // Move to next question
    nextQuestion: () => {
      const state = get();
      const nextIndex = state.currentQuestionIndex + 1;
      
      if (nextIndex >= state.questions.length) {
        set({ levelCompleted: true, gameCompleted: true });
      } else {
        set({
          currentQuestionIndex: nextIndex,
          selectedAnswer: null,
        });
      }
    },

    // Reset the game
    resetGame: () => {
      set({
        currentLevel: 1,
        currentQuestionIndex: 0,
        questions: generateQuestionsForLevel(1),
        selectedAnswer: null,
        answeredQuestions: [],
        gameStartTime: 0,
        gameCompleted: false,
        levelCompleted: false,
        score: 0,
        streak: 0,
      });
    },

    // Complete a level
    completeLevel: () => {
      set({ levelCompleted: true, gameCompleted: true });
    },

    // Get telemetry log
    getTelemetryLog: () => {
      const state = get();
      const timeTaken = Date.now() - state.gameStartTime;
      const correctAnswers = state.answeredQuestions.filter(q => q.isCorrect).length;
      
      return {
        student_id: 'test_user_1',
        game_id: 'math_marathon_01',
        concept_tag: 'mixed_operations_class5',
        level: state.currentLevel,
        performance: {
          is_correct: correctAnswers >= state.questions.length * 0.7,
          accuracy_score: correctAnswers / state.questions.length,
          time_taken_ms: timeTaken,
          score: state.score,
          correct_answers: correctAnswers,
          total_questions: state.questions.length,
        },
        interaction_trace: state.answeredQuestions.map((q, i) => ({
          action: 'answer',
          question_id: q.questionId,
          is_correct: q.isCorrect,
          timestamp: i * 10000, // Approximate 10 seconds per question
        })),
      };
    },

    // Calculate accuracy
    getAccuracy: () => {
      const state = get();
      if (state.answeredQuestions.length === 0) return 1;
      const correct = state.answeredQuestions.filter(q => q.isCorrect).length;
      return correct / state.answeredQuestions.length;
    },
  };
});

