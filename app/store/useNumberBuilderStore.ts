import { create } from 'zustand';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface NumberBuilderQuestion {
  id: string;
  question: string;
  type: 'mcq' | 'fill_blank' | 'matching' | 'true_false';
  options?: string[];
  correctAnswer: string | string[];
  hint: string;
  explanation: string;
  topic: string;
  difficulty: DifficultyLevel;
  points: number;
  category?: string;
}

export interface NumberBuilderGameState {
  currentChapter: number;
  currentLevel: number;
  questions: NumberBuilderQuestion[];
  currentQuestionIndex: number;
  currentQuestion: NumberBuilderQuestion | null;
  selectedAnswer: string | null;
  answered: boolean;
  showFeedback: boolean;
  streak: number;
  bestStreak: number;
  hintUsed: boolean;
  gameStarted: boolean;
  gameCompleted: boolean;
  levelCompleted: boolean;
  passedLevel: boolean;
  score: number;
  totalAnswered: number;
  correctAnswers: number;
  
  startGame: (chapter: number, level: number) => void;
  selectAnswer: (answer: string) => boolean;
  useHint: () => void;
  nextQuestion: () => void;
  resetGame: () => void;
  retryLevel: () => void;
  getAccuracy: () => number;
  getTelemetryLog: () => Record<string, unknown>;
}

// Helper functions for number operations
const generateRandomDigit = () => Math.floor(Math.random() * 10);
const generateThreeDigitNumber = () => 
  100 + generateRandomDigit() * 100 + generateRandomDigit() * 10 + generateRandomDigit();

// Question data for Chapter 1: Numbers up to 1000
const questionsData: Record<DifficultyLevel, NumberBuilderQuestion[]> = {
  easy: [
    {
      id: 'num_1_1',
      question: "What is the largest 3-digit number?",
      type: 'mcq',
      options: ["999", "100", "500", "1000"],
      correctAnswer: "999",
      hint: 'Think about the highest number with 3 digits',
      explanation: '999 is the largest 3-digit number.',
      topic: 'Number Range',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'num_1_2',
      question: "What is the smallest 3-digit number?",
      type: 'mcq',
      options: ["999", "100", "500", "001"],
      correctAnswer: "100",
      hint: 'Think about the lowest number with 3 digits',
      explanation: '100 is the smallest 3-digit number.',
      topic: 'Number Range',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'num_1_3',
      question: "In 456, what is the place value of 5?",
      type: 'mcq',
      options: ["5", "50", "500", "56"],
      correctAnswer: "50",
      hint: 'Think about tens place',
      explanation: '5 is in tens place, so value is 50.',
      topic: 'Place Value',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'num_1_4',
      question: "In 789, what is the place value of 7?",
      type: 'mcq',
      options: ["7", "70", "700", "87"],
      correctAnswer: "700",
      hint: 'Think about hundreds place',
      explanation: '7 is in hundreds place, so value is 700.',
      topic: 'Place Value',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'num_1_5',
      question: "Form the largest number using 3, 7, 2",
      type: 'mcq',
      options: ["237", "327", "732", "723"],
      correctAnswer: "732",
      hint: 'Put biggest digit first',
      explanation: '732 has 7 (hundreds), 3 (tens), 2 (units).',
      topic: 'Number Formation',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'num_1_6',
      question: "Form the smallest number using 5, 1, 9",
      type: 'mcq',
      options: ["159", "519", "915", "951"],
      correctAnswer: "159",
      hint: 'Put smallest digit first (but not 0)',
      explanation: '159 has 1 (hundreds), 5 (tens), 9 (units).',
      topic: 'Number Formation',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'num_1_7',
      question: "What comes after 199?",
      type: 'mcq',
      options: ["200", "198", "300", "100"],
      correctAnswer: "200",
      hint: 'Think about counting',
      explanation: '199 + 1 = 200.',
      topic: 'Sequencing',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'num_1_8',
      question: "What comes before 500?",
      type: 'mcq',
      options: ["499", "501", "400", "600"],
      correctAnswer: "499",
      hint: 'Think about counting backwards',
      explanation: '500 - 1 = 499.',
      topic: 'Sequencing',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'num_1_9',
      question: "How many hundreds in 600?",
      type: 'mcq',
      options: ["3", "4", "6", "5"],
      correctAnswer: "6",
      hint: 'Think about 100 + 100 + 100...',
      explanation: '600 ÷ 100 = 6.',
      topic: 'Place Value',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'num_1_10',
      question: "Write 500 + 40 + 8 as a number",
      type: 'mcq',
      options: ["548", "504", "580", "458"],
      correctAnswer: "548",
      hint: 'Add the values together',
      explanation: '500 + 40 + 8 = 548.',
      topic: 'Number Formation',
      difficulty: 'easy',
      points: 10,
    },
  ],
  medium: [
    {
      id: 'num_m1_1',
      question: "Form the largest number using 4, 0, 8",
      type: 'mcq',
      options: ["048", "408", "804", "840"],
      correctAnswer: "840",
      hint: 'Put biggest digit first, 0 cannot be first',
      explanation: '840 is the largest with 8 hundreds.',
      topic: 'Number Formation',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'num_m1_2',
      question: "In 628, what is the place value of 6?",
      type: 'mcq',
      options: ["6", "60", "600", "62"],
      correctAnswer: "600",
      hint: 'Think about hundreds place',
      explanation: '6 is in hundreds place, value is 600.',
      topic: 'Place Value',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'num_m1_3',
      question: "What is 100 more than 345?",
      type: 'mcq',
      options: ["445", "245", "355", "335"],
      correctAnswer: "445",
      hint: 'Add 100 to the hundreds place',
      explanation: '345 + 100 = 445.',
      topic: 'Addition',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'num_m1_4',
      question: "What is 10 less than 520?",
      type: 'mcq',
      options: ["510", "530", "421", "500"],
      correctAnswer: "510",
      hint: 'Subtract 10 from the tens place',
      explanation: '520 - 10 = 510.',
      topic: 'Subtraction',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'num_m1_5',
      question: "Arrange in ascending order: 234, 432, 324, 423",
      type: 'fill_blank',
      correctAnswer: "234, 324, 423, 432",
      hint: 'Think about smallest to largest',
      explanation: '234 < 324 < 423 < 432.',
      topic: 'Ordering',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'num_m1_6',
      question: "Arrange in descending order: 567, 675, 576, 765",
      type: 'fill_blank',
      correctAnswer: "765, 675, 576, 567",
      hint: 'Think about largest to smallest',
      explanation: '765 > 675 > 576 > 567.',
      topic: 'Ordering',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'num_m1_7',
      question: "What is the value of 5 in 752?",
      type: 'mcq',
      options: ["5", "50", "500", "52"],
      correctAnswer: "50",
      hint: 'Look at the position of 5',
      explanation: '5 is in tens place, value is 50.',
      topic: 'Place Value',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'num_m1_8',
      question: "Is 245 greater than 254?",
      type: 'true_false',
      options: ["True", "False"],
      correctAnswer: "False",
      hint: 'Compare hundreds, then tens',
      explanation: '245 < 254 because 4 < 5 in tens place.',
      topic: 'Comparison',
      difficulty: 'medium',
      points: 15,
    },
  ],
  hard: [
    {
      id: 'num_h1_1',
      question: "Write place value of each digit in 482",
      type: 'fill_blank',
      correctAnswer: "4 hundreds = 400, 8 tens = 80, 2 ones = 2",
      hint: 'Think about each digit position',
      explanation: '4 is hundreds, 8 is tens, 2 is ones.',
      topic: 'Place Value',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'num_h1_2',
      question: "Form 2 largest and 2 smallest numbers from 3, 9, 1",
      type: 'fill_blank',
      correctAnswer: "Largest: 931, 913. Smallest: 139, 193",
      hint: 'Think about digit arrangements',
      explanation: '931 and 913 are largest; 139 and 193 are smallest.',
      topic: 'Number Formation',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'num_h1_3',
      question: "What is 200 + 300 + 40 + 5?",
      type: 'mcq',
      options: ["534", "545", "543", "535"],
      correctAnswer: "545",
      hint: 'Add all values together',
      explanation: '200 + 300 = 500, + 40 = 540, + 5 = 545.',
      topic: 'Addition',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'num_h1_4',
      question: "What number is 100 less than 800?",
      type: 'mcq',
      options: ["700", "900", "799", "801"],
      correctAnswer: "700",
      hint: 'Subtract 100 from 800',
      explanation: '800 - 100 = 700.',
      topic: 'Subtraction',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'num_h1_5',
      question: "Compare: 456 ___ 465. Fill with >, <, or =",
      type: 'mcq',
      options: [">", "<", "=", "None"],
      correctAnswer: "<",
      hint: 'Compare hundreds, then tens',
      explanation: '456 < 465 because 5 < 6 in tens place.',
      topic: 'Comparison',
      difficulty: 'hard',
      points: 20,
    },
  ],
};

const getDifficulty = (level: number): DifficultyLevel => {
  switch (level) {
    case 1: return 'easy';
    case 2: return 'medium';
    case 3: return 'hard';
    default: return 'easy';
  }
};

const generateQuestionSet = (chapter: number, level: number): NumberBuilderQuestion[] => {
  const difficulty = getDifficulty(level);
  const questions = [...(questionsData[difficulty] || [])];
  return questions.sort(() => Math.random() - 0.5).slice(0, 10);
};

export const useNumberBuilderStore = create<NumberBuilderGameState>((set, get) => ({
  currentChapter: 1,
  currentLevel: 1,
  questions: [],
  currentQuestionIndex: 0,
  currentQuestion: null,
  selectedAnswer: null,
  answered: false,
  showFeedback: false,
  streak: 0,
  bestStreak: 0,
  hintUsed: false,
  gameStarted: false,
  gameCompleted: false,
  levelCompleted: false,
  passedLevel: false,
  score: 0,
  totalAnswered: 0,
  correctAnswers: 0,

  startGame: (chapter: number, level: number) => {
    const questionSet = generateQuestionSet(chapter, level);
    const firstQuestion = questionSet[0];
    
    set({
      currentChapter: chapter,
      currentLevel: level,
      questions: questionSet,
      currentQuestionIndex: 0,
      currentQuestion: firstQuestion,
      selectedAnswer: null,
      answered: false,
      showFeedback: false,
      streak: 0,
      bestStreak: 0,
      hintUsed: false,
      gameStarted: true,
      gameCompleted: false,
      levelCompleted: false,
      passedLevel: false,
      score: 0,
      totalAnswered: 0,
      correctAnswers: 0,
    });
  },

  selectAnswer: (answer: string) => {
    const state = get();
    if (state.answered || !state.currentQuestion) return false;
    
    const isCorrect = answer.toLowerCase().trim() === 
      (Array.isArray(state.currentQuestion.correctAnswer) 
        ? state.currentQuestion.correctAnswer[0].toLowerCase().trim()
        : state.currentQuestion.correctAnswer.toLowerCase().trim());
    
    const newStreak = isCorrect ? state.streak + 1 : 0;
    const bonusPoints = Math.min(newStreak * 2, 10);
    const questionPoints = state.currentQuestion.points + bonusPoints;
    
    set({
      selectedAnswer: answer,
      answered: true,
      showFeedback: true,
      totalAnswered: state.totalAnswered + 1,
      correctAnswers: isCorrect ? state.correctAnswers + 1 : state.correctAnswers,
      score: isCorrect ? state.score + questionPoints : state.score,
      streak: newStreak,
      bestStreak: Math.max(state.bestStreak, newStreak),
    });
    
    return isCorrect;
  },

  useHint: () => {
    const state = get();
    if (state.hintUsed || !state.currentQuestion || state.answered) return;
    
    set({
      hintUsed: true,
      score: Math.max(0, state.score - 5),
    });
  },

  nextQuestion: () => {
    const state = get();
    const nextIndex = state.currentQuestionIndex + 1;
    
    if (nextIndex >= state.questions.length) {
      const accuracy = state.totalAnswered > 0 ? state.correctAnswers / state.totalAnswered : 0;
      const passed = accuracy >= 0.8;
      set({
        gameCompleted: true,
        levelCompleted: true,
        passedLevel: passed,
      });
    } else {
      const nextQuestion = state.questions[nextIndex];
      set({
        currentQuestionIndex: nextIndex,
        currentQuestion: nextQuestion,
        selectedAnswer: null,
        answered: false,
        showFeedback: false,
        hintUsed: false,
      });
    }
  },

  resetGame: () => {
    set({
      gameStarted: false,
      gameCompleted: false,
      levelCompleted: false,
      passedLevel: false,
      currentLevel: 1,
      score: 0,
      currentQuestion: null,
      selectedAnswer: null,
      answered: false,
      showFeedback: false,
      totalAnswered: 0,
      correctAnswers: 0,
      questions: [],
      streak: 0,
      bestStreak: 0,
      hintUsed: false,
    });
  },

  retryLevel: () => {
    const state = get();
    const questionSet = generateQuestionSet(state.currentChapter, state.currentLevel);
    const firstQuestion = questionSet[0];
    
    set({
      gameStarted: true,
      gameCompleted: false,
      levelCompleted: false,
      passedLevel: false,
      score: 0,
      currentQuestion: firstQuestion,
      questions: questionSet,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      answered: false,
      showFeedback: false,
      totalAnswered: 0,
      correctAnswers: 0,
      streak: 0,
      hintUsed: false,
    });
  },

  getAccuracy: () => {
    const state = get();
    if (state.totalAnswered === 0) return 1;
    return state.correctAnswers / state.totalAnswered;
  },

  getTelemetryLog: () => {
    const state = get();
    return {
      chapter: state.currentChapter,
      level: state.currentLevel,
      score: state.score,
      accuracy: state.getAccuracy(),
      totalQuestions: state.totalAnswered,
      passed: state.passedLevel,
      bestStreak: state.bestStreak,
      timestamp: new Date().toISOString(),
    };
  },
}));

