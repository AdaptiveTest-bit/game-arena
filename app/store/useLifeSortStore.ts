import { create } from 'zustand';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface LifeSortQuestion {
  id: string;
  question: string;
  type: 'mcq' | 'fill_blank' | 'classification' | 'true_false';
  options?: string[];
  correctAnswer: string | string[];
  hint: string;
  explanation: string;
  topic: string;
  difficulty: DifficultyLevel;
  points: number;
}

export interface LifeSortGameState {
  currentChapter: number;
  currentLevel: number;
  questions: LifeSortQuestion[];
  currentQuestionIndex: number;
  currentQuestion: LifeSortQuestion | null;
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

// Question data for Chapter 1: Living and Non-Living Things
const questionsData: Record<DifficultyLevel, LifeSortQuestion[]> = {
  easy: [
    {
      id: 'life_1_1',
      question: "Which of these is a LIVING thing?",
      type: 'mcq',
      options: ["Rock", "Dog", "Table", "Chair"],
      correctAnswer: "Dog",
      hint: 'Can it breathe, eat, and grow?',
      explanation: 'Dogs are living - they breathe, eat, grow, and move.',
      topic: 'Living Things',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'life_1_2',
      question: "Which of these is a NON-LIVING thing?",
      type: 'mcq',
      options: ["Cat", "Tree", "Water", "Fish"],
      correctAnswer: "Water",
      hint: 'Can it breathe or grow on its own?',
      explanation: 'Water is non-living. It does not breathe or grow.',
      topic: 'Non-Living Things',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'life_1_3',
      question: "How do living things grow?",
      type: 'mcq',
      options: ["By eating food", "By sleeping", "By watching TV", "By sitting still"],
      correctAnswer: "By eating food",
      hint: 'What do you do to grow big and strong?',
      explanation: 'Living things grow by eating food and getting proper care.',
      topic: 'Growth',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'life_1_4',
      question: "Which non-living thing do you use daily?",
      type: 'mcq',
      options: ["Dog", "Pen", "Cat", "Plant"],
      correctAnswer: "Pen",
      hint: 'Think about things you write with',
      explanation: 'A pen is a non-living thing we use every day for writing.',
      topic: 'Daily Use',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'life_1_5',
      question: "Which is TRUE about living things?",
      type: 'mcq',
      options: ["They do not move", "They do not need food", "They can grow and change", "They are always the same"],
      correctAnswer: "They can grow and change",
      hint: 'What happens to babies as they grow up?',
      explanation: 'Living things grow, change, and develop over time.',
      topic: 'Characteristics',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'life_1_6',
      question: "Is a TREE a living thing?",
      type: 'true_false',
      options: ["True", "False"],
      correctAnswer: "True",
      hint: 'Do trees grow and need water?',
      explanation: 'Trees are living - they grow, need water, and can reproduce.',
      topic: 'Living Things',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'life_1_7',
      question: "Sort these: Cat, Table, Sun, Butterfly",
      type: 'classification',
      options: ["Living", "Non-Living"],
      correctAnswer: ["Cat", "Butterfly", "Table", "Sun"],
      hint: 'Think about what can breathe and grow',
      explanation: 'Cat and Butterfly are living. Table and Sun are non-living.',
      topic: 'Classification',
      difficulty: 'easy',
      points: 12,
    },
    {
      id: 'life_1_8',
      question: "Which is a NON-LIVING thing found in nature?",
      type: 'mcq',
      options: ["Bird", "Stone", "Dog", "Butterfly"],
      correctAnswer: "Stone",
      hint: 'Think about things that cannot move on their own',
      explanation: 'Stones are non-living things found in nature.',
      topic: 'Nature',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'life_1_9',
      question: "Do plants need sunlight to grow?",
      type: 'true_false',
      options: ["True", "False"],
      correctAnswer: "True",
      hint: 'Where do plants usually grow best?',
      explanation: 'Plants need sunlight to make food and grow properly.',
      topic: 'Plant Needs',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'life_1_10',
      question: "Which is NOT a characteristic of living things?",
      type: 'mcq',
      options: ["Breathing", "Growing", "Moving", "Being made of plastic"],
      correctAnswer: "Being made of plastic",
      hint: 'Can a plastic toy breathe or eat?',
      explanation: 'Living things are made of cells, not plastic.',
      topic: 'Characteristics',
      difficulty: 'easy',
      points: 10,
    },
  ],
  medium: [
    {
      id: 'life_m1_1',
      question: "What are 3 things ALL living things need?",
      type: 'mcq',
      options: ["Food, water, air", "TV, phone, computer", "Chair, table, bed", "Car, bus, bike"],
      correctAnswer: "Food, water, air",
      hint: 'What do you need to stay alive?',
      explanation: 'All living things need food, water, and air to survive.',
      topic: 'Basic Needs',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'life_m1_2',
      question: "Why is a FAN a non-living thing even though it moves?",
      type: 'mcq',
      options: ["Because it is made of metal", "Because it cannot move by itself", "Because it needs electricity to move", "Because it is big"],
      correctAnswer: "Because it needs electricity to move",
      hint: 'Can the fan decide to move on its own?',
      explanation: 'The fan moves only when given electricity - it cannot move by itself.',
      topic: 'Movement',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'life_m1_3',
      question: "Sort into Living and Non-Living: Chair, Cow, Mobile phone, Grass",
      type: 'classification',
      options: ["Living", "Non-Living"],
      correctAnswer: ["Cow", "Grass", "Chair", "Mobile phone"],
      hint: 'Think about what can grow and breathe',
      explanation: 'Cow and Grass are living. Chair and Mobile are non-living.',
      topic: 'Classification',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'life_m1_4',
      question: "Which living thing can make its own food?",
      type: 'mcq',
      options: ["Dog", "Cat", "Plant", "Fish"],
      correctAnswer: "Plant",
      hint: 'What has green leaves and uses sunlight?',
      explanation: 'Plants make their own food using sunlight, water, and air.',
      topic: 'Food Making',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'life_m1_5',
      question: "How do living things reproduce (have babies)?",
      type: 'mcq',
      options: ["By getting electricity", "By eating more food", "By various methods like seeds, eggs, giving birth", "By sleeping"],
      correctAnswer: "By various methods like seeds, eggs, giving birth",
      hint: 'Think about how different animals and plants have young ones',
      explanation: 'Living things reproduce in different ways - plants by seeds, animals by eggs or birth.',
      topic: 'Reproduction',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'life_m1_6',
      question: "Is fire a living thing?",
      type: 'true_false',
      options: ["True", "False"],
      correctAnswer: "False",
      hint: 'Can fire breathe, eat, or grow on its own?',
      explanation: 'Fire is not living. It needs fuel to burn and cannot reproduce.',
      topic: 'Misconception',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'life_m1_7',
      question: "Name one way you can tell a rock is non-living",
      type: 'fill_blank',
      correctAnswer: "It does not grow or breathe",
      hint: 'What can living things do that rocks cannot?',
      explanation: 'Rocks do not grow, breathe, or need food to survive.',
      topic: 'Observation',
      difficulty: 'medium',
      points: 15,
    },
  ],
  hard: [
    {
      id: 'life_h1_1',
      question: "Explain the difference between living and non-living things with 2 examples each",
      type: 'fill_blank',
      correctAnswer: "Living: dog, plant | Non-Living: table, water",
      hint: 'Think about breathing, growing, and moving abilities',
      explanation: 'Living things breathe, grow, move, and need food. Non-living things do not.',
      topic: 'Comparison',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'life_h1_2',
      question: "Why do scientists say viruses are on the border between living and non-living?",
      type: 'mcq',
      options: ["Because they are very small", "Because they can only reproduce inside other living cells", "Because they are made of metal", "Because they never move"],
      correctAnswer: "Because they can only reproduce inside other living cells",
      hint: 'Think about what viruses need to multiply',
      explanation: 'Viruses can only reproduce when inside a living organism.',
      topic: 'Advanced Concept',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'life_h1_3',
      question: "If a plant is kept in a dark room without water, what will happen?",
      type: 'mcq',
      options: ["It will grow faster", "It will die because it cannot make food", "It will change color", "It will become a non-living thing"],
      correctAnswer: "It will die because it cannot make food",
      hint: 'What do plants need to survive?',
      explanation: 'Without light and water, plants cannot make food and will die.',
      topic: 'Conditions for Life',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'life_h1_4',
      question: "What are the 7 characteristics of living things? (Name at least 5)",
      type: 'fill_blank',
      correctAnswer: "Movement, respiration, sensitivity, growth, reproduction, excretion, nutrition",
      hint: 'Think about MRS GREN mnemonic',
      explanation: 'Living things show: Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, Nutrition.',
      topic: 'Characteristics',
      difficulty: 'hard',
      points: 25,
    },
    {
      id: 'life_h1_5',
      question: "A car moves and needs fuel (like food). Is it living? Why or why not?",
      type: 'fill_blank',
      correctAnswer: "No, because it cannot reproduce or grow on its own",
      hint: 'What are the essential characteristics of life?',
      explanation: 'Cars cannot reproduce, grow, or respond to environment on their own.',
      topic: 'Critical Thinking',
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

const generateQuestionSet = (chapter: number, level: number): LifeSortQuestion[] => {
  const difficulty = getDifficulty(level);
  const questions = [...(questionsData[difficulty] || [])];
  return questions.sort(() => Math.random() - 0.5).slice(0, 10);
};

export const useLifeSortStore = create<LifeSortGameState>((set, get) => ({
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

