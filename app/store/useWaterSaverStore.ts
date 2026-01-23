import { create } from 'zustand';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface WaterSaverQuestion {
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

export interface WaterSaverGameState {
  currentChapter: number;
  currentLevel: number;
  questions: WaterSaverQuestion[];
  currentQuestionIndex: number;
  currentQuestion: WaterSaverQuestion | null;
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

// Water uses data
const waterUses = [
  'Drinking', 'Cooking', 'Bathing', 'Washing clothes', 'Watering plants',
  'Cleaning house', 'Swimming', 'Industrial use', 'Agriculture', 'Fire fighting'
];

const goodWaterHabits = [
  'Closing tap while brushing', 'Taking short showers', 'Reusing water for plants',
  'Fixing leaky taps', 'Using bucket instead of hose', 'Collecting rainwater'
];

const badWaterHabits = [
  'Leaving tap running', 'Long baths', 'Wasting water', 'Not fixing leaks',
  'Overwatering plants', 'Throwing garbage in water'
];

// Question data for Chapter 10: Water
const questionsData: Record<DifficultyLevel, WaterSaverQuestion[]> = {
  easy: [
    {
      id: 'water_1_1',
      question: "What do we use water for at home?",
      type: 'mcq',
      options: ["Only drinking", "Drinking, bathing, washing", "Only washing", "Nothing"],
      correctAnswer: "Drinking, bathing, washing",
      hint: 'Think about daily water uses',
      explanation: 'Water is used for many purposes at home.',
      topic: 'Water Uses',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'water_1_2',
      question: "Which is a GOOD water habit?",
      type: 'mcq',
      options: ["Leaving tap running", "Closing tap while brushing", "Wasting water", "Long baths"],
      correctAnswer: "Closing tap while brushing",
      hint: 'Think about water conservation',
      explanation: 'Closing the tap saves water while brushing.',
      topic: 'Good Habits',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'water_1_3',
      question: "Which is a BAD water habit?",
      type: 'mcq',
      options: ["Taking short shower", "Fixing leaks", "Leaving tap running", "Reusing water"],
      correctAnswer: "Leaving tap running",
      hint: 'Think about water waste',
      explanation: 'Leaving taps running wastes precious water.',
      topic: 'Bad Habits',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'water_1_4',
      question: "How much of Earth is covered with water?",
      type: 'mcq',
      options: ["10%", "30%", "71%", "90%"],
      correctAnswer: "71%",
      hint: 'Think about water bodies on Earth',
      explanation: 'About 71% of Earth is covered with water.',
      topic: 'Earth Water',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'water_1_5',
      question: "Is all water on Earth usable?",
      type: 'true_false',
      options: ["True", "False"],
      correctAnswer: "False",
      hint: 'Think about saltwater vs freshwater',
      explanation: 'Most water is salty ocean water, not usable.',
      topic: 'Water Types',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'water_1_6',
      question: "Which is a use of water?",
      type: 'mcq',
      options: ["Only drinking", "Only bathing", "Drinking, cooking, washing, farming", "Only washing"],
      correctAnswer: "Drinking, cooking, washing, farming",
      hint: 'Think about all water uses',
      explanation: 'Water has many essential uses.',
      topic: 'Water Uses',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'water_1_7',
      question: "What happens if we waste water?",
      type: 'mcq',
      options: ["Nothing", "More water comes", "Water shortage, plants die, animals suffer", "Rain increases"],
      correctAnswer: "Water shortage, plants die, animals suffer",
      hint: 'Think about consequences of waste',
      explanation: 'Wasting water causes shortage and harm.',
      topic: 'Consequences',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'water_1_8',
      question: "How can we save water at home?",
      type: 'mcq',
      options: ["Leave taps running", "Take short baths", "Fix leaky taps", "Use more water"],
      correctAnswer: "Fix leaky taps",
      hint: 'Think about water conservation',
      explanation: 'Fixing leaks prevents water waste.',
      topic: 'Saving Water',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'water_1_9',
      question: "Why should we save water?",
      type: 'mcq',
      options: ["Because it is unlimited", "Because it is precious and life-saving", "Because it is free", "Because nobody uses it"],
      correctAnswer: "Because it is precious and life-saving",
      hint: 'Think about water importance',
      explanation: 'Water is essential for all life.',
      topic: 'Importance',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'water_1_10',
      question: "Tick the GOOD water habit: Using bucket for car wash",
      type: 'true_false',
      options: ["True", "False"],
      correctAnswer: "True",
      hint: 'Think about bucket vs hose',
      explanation: 'Buckets use less water than running hoses.',
      topic: 'Good Habits',
      difficulty: 'easy',
      points: 10,
    },
  ],
  medium: [
    {
      id: 'water_m1_1',
      question: "What are 3 uses of water?",
      type: 'fill_blank',
      correctAnswer: "Drinking, bathing, washing, cooking, farming, industry",
      hint: 'Think about water applications',
      explanation: 'Water is used for many essential purposes.',
      topic: 'Uses',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'water_m1_2',
      question: "What are 3 good water habits?",
      type: 'fill_blank',
      correctAnswer: "Close tap, fix leaks, short shower, reuse water, bucket not hose",
      hint: 'Think about conservation',
      explanation: 'Good habits help conserve water.',
      topic: 'Good Habits',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'water_m1_3',
      question: "What are 3 bad water habits?",
      type: 'fill_blank',
      correctAnswer: "Long baths, running taps, wasting water, not fixing leaks",
      hint: 'Think about waste',
      explanation: 'Bad habits waste precious water.',
      topic: 'Bad Habits',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'water_m1_4',
      question: "Why is FRESHWATER important?",
      type: 'mcq',
      options: ["Because it is salty", "Because it is limited and essential for life", "Because it is expensive", "Because nobody needs it"],
      correctAnswer: "Because it is limited and essential for life",
      hint: 'Think about freshwater scarcity',
      explanation: 'Freshwater is rare and vital for survival.',
      topic: 'Importance',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'water_m1_5',
      question: "What is WATER POLLUTION?",
      type: 'mcq',
      options: ["Clean water", "Making water clean", "Contaminating water with waste", "Rain water"],
      correctAnswer: "Contaminating water with waste",
      hint: 'Think about dirty water',
      explanation: 'Pollution makes water harmful to use.',
      topic: 'Pollution',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'water_m1_6',
      question: "How can we keep water clean?",
      type: 'mcq',
      options: ["Throw garbage in water", "Use water for cleaning", "Not throw waste, not overuse chemicals", "Pollute more"],
      correctAnswer: "Not throw waste, not overuse chemicals",
      hint: 'Think about water cleanliness',
      explanation: 'Keeping water clean requires proper waste disposal.',
      topic: 'Clean Water',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'water_m1_7',
      question: "What is WATER CYCLE?",
      type: 'mcq',
      options: ["Water flowing down hill", "Evaporation, condensation, precipitation", "Water turning to stone", "Water disappearing"],
      correctAnswer: "Evaporation, condensation, precipitation",
      hint: 'Think about water movement',
      explanation: 'Water cycle continuously recycles water.',
      topic: 'Science',
      difficulty: 'medium',
      points: 15,
    },
  ],
  hard: [
    {
      id: 'water_h1_1',
      question: "Explain the water cycle in simple terms",
      type: 'fill_blank',
      correctAnswer: "Sun heats water (evaporation), forms clouds (condensation), falls as rain (precipitation), flows back to sea",
      hint: 'Think about water movement stages',
      explanation: 'Water continuously moves through different stages.',
      topic: 'Water Cycle',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'water_h1_2',
      question: "How does water pollution affect us?",
      type: 'fill_blank',
      correctAnswer: "Diseases, kills aquatic life, makes water unusable, harms agriculture, economic loss",
      hint: 'Think about pollution impact',
      explanation: 'Water pollution has many harmful effects.',
      topic: 'Pollution Impact',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'water_h1_3',
      question: "What are different sources of water?",
      type: 'fill_blank',
      correctAnswer: "Oceans, rivers, lakes, groundwater, rain, glaciers, springs",
      hint: 'Think about water sources',
      explanation: 'Water comes from many natural sources.',
      topic: 'Sources',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'water_h1_4',
      question: "How can communities save water together?",
      type: 'fill_blank',
      correctAnswer: "Rainwater harvesting, fixing public leaks, awareness campaigns, efficient irrigation, reusing greywater",
      hint: 'Think about community actions',
      explanation: 'Community efforts can save more water.',
      topic: 'Community',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'water_h1_5',
      question: "Why is water called the elixir of life?",
      type: 'mcq',
      options: ["Because it is blue", "Because all living things need it to survive", "Because it is expensive", "Because it is found everywhere"],
      correctAnswer: "Because all living things need it to survive",
      hint: 'Think about life dependence on water',
      explanation: 'Water is essential for all life forms.',
      topic: 'Importance',
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

const generateQuestionSet = (chapter: number, level: number): WaterSaverQuestion[] => {
  const difficulty = getDifficulty(level);
  const questions = [...(questionsData[difficulty] || [])];
  return questions.sort(() => Math.random() - 0.5).slice(0, 10);
};

export const useWaterSaverStore = create<WaterSaverGameState>((set, get) => ({
  currentChapter: 10,
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

