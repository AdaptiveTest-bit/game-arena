import { create } from 'zustand';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface AddAndWinQuestion {
  id: string;
  question: string;
  type: 'mcq' | 'fill_blank' | 'picture' | 'true_false';
  options?: string[];
  correctAnswer: string | string[];
  hint: string;
  explanation: string;
  topic: string;
  difficulty: DifficultyLevel;
  points: number;
}

export interface AddAndWinGameState {
  currentChapter: number;
  currentLevel: number;
  questions: AddAndWinQuestion[];
  currentQuestionIndex: number;
  currentQuestion: AddAndWinQuestion | null;
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

// Question data for Chapter 2: Addition
const questionsData: Record<DifficultyLevel, AddAndWinQuestion[]> = {
  easy: [
    {
      id: 'add_1_1',
      question: "What is 5 + 3?",
      type: 'mcq',
      options: ["6", "7", "8", "9"],
      correctAnswer: "8",
      hint: 'Count forward from 5',
      explanation: '5 + 3 = 8.',
      topic: 'Basic Addition',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'add_1_2',
      question: "What is 10 + 7?",
      type: 'mcq',
      options: ["15", "16", "17", "18"],
      correctAnswer: "17",
      hint: 'Add 7 to 10',
      explanation: '10 + 7 = 17.',
      topic: 'Basic Addition',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'add_1_3',
      question: "What is 25 + 14?",
      type: 'mcq',
      options: ["38", "39", "40", "41"],
      correctAnswer: "39",
      hint: 'Add tens first, then ones',
      explanation: '25 + 14 = 39.',
      topic: '2-Digit Addition',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'add_1_4',
      question: "What is 50 + 30?",
      type: 'mcq',
      options: ["70", "80", "90", "100"],
      correctAnswer: "80",
      hint: 'Add the tens',
      explanation: '50 + 30 = 80.',
      topic: 'Tens Addition',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'add_1_5',
      question: "What is 100 + 200?",
      type: 'mcq',
      options: ["200", "300", "400", "500"],
      correctAnswer: "300",
      hint: 'Add the hundreds',
      explanation: '100 + 200 = 300.',
      topic: 'Hundreds Addition',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'add_1_6',
      question: "Apple + Apple = 2 Apples. So 5 Apples + 3 Apples = ?",
      type: 'mcq',
      options: ["7 Apples", "8 Apples", "9 Apples", "6 Apples"],
      correctAnswer: "8 Apples",
      hint: 'Add the numbers',
      explanation: '5 + 3 = 8, so 8 Apples.',
      topic: 'Picture Addition',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'add_1_7',
      question: "What is 12 + 15?",
      type: 'mcq',
      options: ["25", "26", "27", "28"],
      correctAnswer: "27",
      hint: 'Add tens: 10+10=20, then ones: 2+5=7',
      explanation: '12 + 15 = 27.',
      topic: '2-Digit Addition',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'add_1_8',
      question: "What is 300 + 400?",
      type: 'mcq',
      options: ["600", "700", "800", "900"],
      correctAnswer: "700",
      hint: 'Add the hundreds',
      explanation: '300 + 400 = 700.',
      topic: 'Hundreds Addition',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'add_1_9',
      question: "What is 45 + 32?",
      type: 'mcq',
      options: ["75", "76", "77", "78"],
      correctAnswer: "77",
      hint: '40+30=70, 5+2=7',
      explanation: '45 + 32 = 77.',
      topic: '2-Digit Addition',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'add_1_10',
      question: "What is 6 + 6?",
      type: 'mcq',
      options: ["10", "11", "12", "13"],
      correctAnswer: "12",
      hint: 'Double the number',
      explanation: '6 + 6 = 12.',
      topic: 'Basic Addition',
      difficulty: 'easy',
      points: 10,
    },
  ],
  medium: [
    {
      id: 'add_m1_1',
      question: "What is 156 + 243?",
      type: 'mcq',
      options: ["399", "400", "401", "398"],
      correctAnswer: "399",
      hint: 'Add hundreds, tens, and ones separately',
      explanation: '156 + 243 = 399.',
      topic: '3-Digit Addition',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'add_m1_2',
      question: "What is 234 + 567?",
      type: 'mcq',
      options: ["800", "801", "802", "799"],
      correctAnswer: "801",
      hint: 'Add carefully',
      explanation: '234 + 567 = 801.',
      topic: '3-Digit Addition',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'add_m1_3',
      question: "What is 450 + 350?",
      type: 'mcq',
      options: ["700", "800", "900", "750"],
      correctAnswer: "800",
      hint: 'Add the numbers',
      explanation: '450 + 350 = 800.',
      topic: '3-Digit Addition',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'add_m1_4',
      question: "Solve: 123 + 45 = ?",
      type: 'mcq',
      options: ["166", "167", "168", "169"],
      correctAnswer: "168",
      hint: 'Add 45 to 123',
      explanation: '123 + 45 = 168.',
      topic: 'Mixed Addition',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'add_m1_5',
      question: "What is 500 + 125 + 75?",
      type: 'mcq',
      options: ["700", "725", "750", "700"],
      correctAnswer: "700",
      hint: 'Add 125 and 75 first',
      explanation: '125 + 75 = 200, + 500 = 700.',
      topic: 'Multiple Addition',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'add_m1_6',
      question: "What is 345 + 199?",
      type: 'mcq',
      options: ["543", "544", "545", "546"],
      correctAnswer: "544",
      hint: 'Add 200 and subtract 1',
      explanation: '345 + 200 = 545, - 1 = 544.',
      topic: 'Mental Math',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'add_m1_7',
      question: "There are 25 boys and 28 girls. How many students?",
      type: 'mcq',
      options: ["50", "52", "53", "54"],
      correctAnswer: "53",
      hint: 'Add boys and girls',
      explanation: '25 + 28 = 53 students.',
      topic: 'Word Problems',
      difficulty: 'medium',
      points: 15,
    },
  ],
  hard: [
    {
      id: 'add_h1_1',
      question: "What is 456 + 378 + 124?",
      type: 'mcq',
      options: ["957", "958", "959", "956"],
      correctAnswer: "958",
      hint: 'Add step by step',
      explanation: '456 + 378 = 834, + 124 = 958.',
      topic: 'Multiple Addition',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'add_h1_2',
      question: "What is 999 + 1?",
      type: 'mcq',
      options: ["1000", "1001", "999", "100"],
      correctAnswer: "1000",
      hint: 'Think about the next number',
      explanation: '999 + 1 = 1000.',
      topic: 'Carrying Over',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'add_h1_3',
      question: "What is 234 + 678?",
      type: 'mcq',
      options: ["912", "913", "914", "911"],
      correctAnswer: "912",
      hint: 'Add carefully with carrying',
      explanation: '234 + 678 = 912.',
      topic: '3-Digit Addition',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'add_h1_4',
      question: "A shop has 145 apples, 200 oranges, and 155 bananas. Total fruits?",
      type: 'mcq',
      options: ["500", "498", "499", "501"],
      correctAnswer: "500",
      hint: 'Add all fruits',
      explanation: '145 + 200 + 155 = 500.',
      topic: 'Word Problems',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'add_h1_5',
      question: "What is 567 + 433?",
      type: 'mcq',
      options: ["1000", "1001", "999", "1002"],
      correctAnswer: "1000",
      hint: 'Add and carry over',
      explanation: '567 + 433 = 1000.',
      topic: 'Carrying Over',
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

const generateQuestionSet = (chapter: number, level: number): AddAndWinQuestion[] => {
  const difficulty = getDifficulty(level);
  const questions = [...(questionsData[difficulty] || [])];
  return questions.sort(() => Math.random() - 0.5).slice(0, 10);
};

export const useAddWinStore = create<AddAndWinGameState>((set, get) => ({
  currentChapter: 2,
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

