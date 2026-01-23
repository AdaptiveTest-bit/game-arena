import { create } from 'zustand';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface CleanGreenQuestion {
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

export interface CleanGreenGameState {
  currentChapter: number;
  currentLevel: number;
  questions: CleanGreenQuestion[];
  currentQuestionIndex: number;
  currentQuestion: CleanGreenQuestion | null;
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

// Environment data
const cleanHabits = [
  'Not littering', 'Using dustbin', 'Planting trees', 'Saving water',
  'Using public transport', 'Recycling waste', 'Saving electricity', 'Not burning garbage'
];

const dirtyHabits = [
  'Littering everywhere', 'Throwing plastic in water', 'Deforestation',
  'Wasting water', 'Using private cars alone', 'Burning leaves', 'Spitting'
];

// Question data for Chapter 8: Our Environment
const questionsData: Record<DifficultyLevel, CleanGreenQuestion[]> = {
  easy: [
    {
      id: 'env_1_1',
      question: "Which is a CLEAN habit?",
      type: 'mcq',
      options: ["Throwing trash on road", "Using dustbin", "Spitting everywhere", "Wasting water"],
      correctAnswer: "Using dustbin",
      hint: 'Think about proper waste disposal',
      explanation: 'Using dustbin keeps our environment clean.',
      topic: 'Clean Habits',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'env_1_2',
      question: "Which is a DIRTY habit?",
      type: 'mcq',
      options: ["Planting trees", "Littering", "Recycling", "Saving water"],
      correctAnswer: "Littering",
      hint: 'Think about what pollutes the environment',
      explanation: 'Littering makes our environment dirty.',
      topic: 'Dirty Habits',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'env_1_3',
      question: "How can we protect nature?",
      type: 'mcq',
      options: ["Cut all trees", "Plant more trees", "Burn leaves", "Waste water"],
      correctAnswer: "Plant more trees",
      hint: 'Think about helping the environment',
      explanation: 'Planting trees helps nature and provides oxygen.',
      topic: 'Protecting Nature',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'env_1_4',
      question: "What should we do with plastic bottles?",
      type: 'mcq',
      options: ["Throw in river", "Recycle or reuse", "Burn them", "Leave on road"],
      correctAnswer: "Recycle or reuse",
      hint: 'Think about plastic waste',
      explanation: 'Plastic should be recycled or reused, not littered.',
      topic: 'Waste Management',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'env_1_5',
      question: "What should we do with dry leaves?",
      type: 'mcq',
      options: ["Burn them", "Make compost", "Throw in water", "Leave on road"],
      correctAnswer: "Make compost",
      hint: 'Think about organic waste',
      explanation: 'Dry leaves can be converted to compost.',
      topic: 'Waste Management',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'env_1_6',
      question: "Why should we save water?",
      type: 'mcq',
      options: ["Because it is unlimited", "Because it is precious and limited", "Because nobody uses it", "Because we have too much"],
      correctAnswer: "Because it is precious and limited",
      hint: 'Think about water scarcity',
      explanation: 'Water is precious and we must save it.',
      topic: 'Conservation',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'env_1_7',
      question: "Which transport is better for environment?",
      type: 'mcq',
      options: ["Car with one person", "Bus with many people", "Both same", "Motorcycle"],
      correctAnswer: "Bus with many people",
      hint: 'Think about pollution',
      explanation: 'Public transport reduces pollution per person.',
      topic: 'Environment',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'env_1_8',
      question: "Name TWO ways to protect nature",
      type: 'fill_blank',
      correctAnswer: "Plant trees, don't litter, save water, recycle",
      hint: 'Think about helping the environment',
      explanation: 'Planting trees and not littering protect nature.',
      topic: 'Protection',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'env_1_9',
      question: "What happens if we cut all trees?",
      type: 'mcq',
      options: ["More oxygen", "More rain", "Floods, no oxygen, climate change", "Nothing happens"],
      correctAnswer: "Floods, no oxygen, climate change",
      hint: 'Think about importance of trees',
      explanation: 'Trees prevent floods and provide oxygen.',
      topic: 'Environment',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'env_1_10',
      question: "Should we throw garbage in water bodies?",
      type: 'true_false',
      options: ["True", "False"],
      correctAnswer: "False",
      hint: 'Think about water pollution',
      explanation: 'Garbage in water harms aquatic life.',
      topic: 'Pollution',
      difficulty: 'easy',
      points: 10,
    },
  ],
  medium: [
    {
      id: 'env_m1_1',
      question: "What is the 3R principle?",
      type: 'mcq',
      options: ["Reduce, Reuse, Recycle", "Run, Run, Run", "Read, Write, Repeat", "Reduce, Rest, Recover"],
      correctAnswer: "Reduce, Reuse, Recycle",
      hint: 'Think about waste management',
      explanation: '3R helps manage waste sustainably.',
      topic: 'Waste Management',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'env_m1_2',
      question: "How does PLANTING TREES help the environment?",
      type: 'mcq',
      options: ["Provides oxygen, reduces pollution, prevents soil erosion", "Makes more space for buildings", "Increases heat", "Reduces rain"],
      correctAnswer: "Provides oxygen, reduces pollution, prevents soil erosion",
      hint: 'Think about tree benefits',
      explanation: 'Trees provide many environmental benefits.',
      topic: 'Environment',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'env_m1_3',
      question: "What is AIR POLLUTION caused by?",
      type: 'mcq',
      options: ["Clean air", "Trees and plants", "Vehicle smoke, factory waste, burning", "Recycling"],
      correctAnswer: "Vehicle smoke, factory waste, burning",
      hint: 'Think about polluted air sources',
      explanation: 'Smoke and waste pollute our air.',
      topic: 'Pollution',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'env_m1_4',
      question: "How can we reduce electricity use?",
      type: 'mcq',
      options: ["Leave lights on", "Switch off unused lights, use LED bulbs", "Use AC all day", "Keep devices on"],
      correctAnswer: "Switch off unused lights, use LED bulbs",
      hint: 'Think about energy saving',
      explanation: 'Switching off unused appliances saves energy.',
      topic: 'Conservation',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'env_m1_5',
      question: "What is COMPOSTING?",
      type: 'mcq',
      options: ["Burning waste", "Converting organic waste to fertilizer", "Throwing garbage", "Recycling plastic"],
      correctAnswer: "Converting organic waste to fertilizer",
      hint: 'Think about organic waste',
      explanation: 'Composting turns waste into useful fertilizer.',
      topic: 'Waste Management',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'env_m1_6',
      question: "Why should we AVOID SINGLE-USE PLASTIC?",
      type: 'mcq',
      options: ["Because it is cheap", "Because it does not decompose and harms environment", "Because it is colorful", "Because everyone uses it"],
      correctAnswer: "Because it does not decompose and harms environment",
      hint: 'Think about plastic waste',
      explanation: 'Single-use plastic causes long-term pollution.',
      topic: 'Pollution',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'env_m1_7',
      question: "What is GLOBAL WARMING?",
      type: 'mcq',
      options: ["Cooling of earth", "Warming of earth due to greenhouse gases", "No change", "Winter season"],
      correctAnswer: "Warming of earth due to greenhouse gases",
      hint: 'Think about climate change',
      explanation: 'Greenhouse gases trap heat and warm the earth.',
      topic: 'Climate',
      difficulty: 'medium',
      points: 15,
    },
  ],
  hard: [
    {
      id: 'env_h1_1',
      question: "Name 5 clean habits and 5 dirty habits",
      type: 'fill_blank',
      correctAnswer: "Clean: Use dustbin, plant trees, recycle, save water, use public transport. Dirty: Litter, waste water, burn garbage, use plastic, cut trees",
      hint: 'Think about environmental habits',
      explanation: 'Clean habits protect environment; dirty habits harm it.',
      topic: 'Habits',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'env_h1_2',
      question: "How does CLIMATE CHANGE affect us?",
      type: 'fill_blank',
      correctAnswer: "Rising sea levels, extreme weather, crop failure, health problems, habitat loss",
      hint: 'Think about climate effects',
      explanation: 'Climate change causes many environmental problems.',
      topic: 'Climate',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'env_h1_3',
      question: "What is the water cycle and why is it important?",
      type: 'fill_blank',
      correctAnswer: "Evaporation, condensation, precipitation - provides fresh water to earth",
      hint: 'Think about water movement',
      explanation: 'Water cycle continuously renews our water supply.',
      topic: 'Environment',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'env_h1_4',
      question: "How can students help protect the environment?",
      type: 'fill_blank',
      correctAnswer: "Plant trees, avoid plastic, save resources, spread awareness, participate in cleanups",
      hint: 'Think about student role',
      explanation: 'Students can make a big environmental impact.',
      topic: 'Action',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'env_h1_5',
      question: "What is BIODIVERSITY and why does it matter?",
      type: 'mcq',
      options: ["Variety of life forms - important for ecosystem balance", "Only animals", "Only plants", "One type of species"],
      correctAnswer: "Variety of life forms - important for ecosystem balance",
      hint: 'Think about different species',
      explanation: 'Biodiversity keeps ecosystems healthy.',
      topic: 'Ecology',
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

const generateQuestionSet = (chapter: number, level: number): CleanGreenQuestion[] => {
  const difficulty = getDifficulty(level);
  const questions = [...(questionsData[difficulty] || [])];
  return questions.sort(() => Math.random() - 0.5).slice(0, 10);
};

export const useCleanGreenStore = create<CleanGreenGameState>((set, get) => ({
  currentChapter: 8,
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

