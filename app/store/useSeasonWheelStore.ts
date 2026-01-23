import { create } from 'zustand';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface SeasonWheelQuestion {
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
}

export interface SeasonWheelGameState {
  currentChapter: number;
  currentLevel: number;
  questions: SeasonWheelQuestion[];
  currentQuestionIndex: number;
  currentQuestion: SeasonWheelQuestion | null;
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

// Seasons data
const seasonsData = {
  summer: {
    months: ['March', 'April', 'May', 'June'],
    clothes: ['Cotton clothes', 'Sunglasses', 'Sun hat', 'Shorts'],
    food: ['Ice cream', 'Cold drinks', 'Watermelon', 'Mangoes'],
    activities: ['Swimming', 'Going to beach', 'Fan/AC', 'Cold baths'],
  },
  monsoon: {
    months: ['June', 'July', 'August', 'September'],
    clothes: ['Raincoat', 'Umbrella', 'Flip flops', 'Quick dry'],
    food: ['Pakoras', 'Tea', 'Corn', 'Fried snacks'],
    activities: ['Splashing in rain', 'Indoor games', 'Reading', 'Watching clouds'],
  },
  winter: {
    months: ['October', 'November', 'December', 'January', 'February'],
    clothes: ['Woolen clothes', 'Sweaters', 'Jackets', 'Scarves', 'Gloves'],
    food: ['Hot soup', 'Tea/Coffee', 'Parathas', 'Ginger honey'],
    activities: ['Sunbathing', 'Warm baths', 'Playing in sun', 'Cozy blankets'],
  },
  spring: {
    months: ['February', 'March'],
    clothes: ['Light woolens', 'Kurtas', 'Flowers'],
    food: ['Fruits', 'Salads', 'Honey'],
    activities: ['Flower watching', 'Flying kites', 'Picnics'],
  },
};

// Question data for Chapter 9: Weather & Seasons
const questionsData: Record<DifficultyLevel, SeasonWheelQuestion[]> = {
  easy: [
    {
      id: 'season_1_1',
      question: "Which season comes AFTER SUMMER?",
      type: 'mcq',
      options: ["Winter", "Monsoon", "Spring", "Autumn"],
      correctAnswer: "Monsoon",
      hint: 'Think about rainy season',
      explanation: 'Monsoon comes after summer with rain.',
      topic: 'Season Order',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'season_1_2',
      question: "What do we wear in SUMMER?",
      type: 'mcq',
      options: ["Woolen sweater", "Cotton clothes", "Heavy jacket", "Gloves"],
      correctAnswer: "Cotton clothes",
      hint: 'Think about light and cool clothes',
      explanation: 'Cotton clothes are light and keep us cool.',
      topic: 'Summer Clothes',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'season_1_3',
      question: "What do we wear in WINTER?",
      type: 'mcq',
      options: ["Shorts", "Cotton shirt", "Woolen sweater", "Sandals"],
      correctAnswer: "Woolen sweater",
      hint: 'Think about warm clothes',
      explanation: 'Woolen clothes keep us warm in winter.',
      topic: 'Winter Clothes',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'season_1_4',
      question: "When do we use UMBRELLA?",
      type: 'mcq',
      options: ["In summer", "In monsoon", "In winter", "In spring"],
      correctAnswer: "In monsoon",
      hint: 'Think about rain protection',
      explanation: 'Umbrellas protect us from rain during monsoon.',
      topic: 'Monsoon',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'season_1_5',
      question: "Which fruit is available in SUMMER?",
      type: 'mcq',
      options: ["Mango", "Apple", "Orange", "Guava"],
      correctAnswer: "Mango",
      hint: 'Think about summer fruits',
      explanation: 'Mangoes are the king of summer fruits.',
      topic: 'Summer Food',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'season_1_6',
      question: "What do children love to do in MONSOON?",
      type: 'mcq',
      options: ["Swim in rain", "Play in snow", "Sunbathe", "Fly kites"],
      correctAnswer: "Swim in rain",
      hint: 'Think about rainy day activities',
      explanation: 'Children love splashing in rain puddles.',
      topic: 'Monsoon Activities',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'season_1_7',
      question: "Match: Summer - ?",
      type: 'mcq',
      options: ["Ice cream", "Hot soup", "Raincoat", "Snow"],
      correctAnswer: "Ice cream",
      hint: 'Think about summer treats',
      explanation: 'Ice cream is a popular summer treat.',
      topic: 'Matching',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'season_1_8',
      question: "Match: Winter - ?",
      type: 'mcq',
      options: ["Ice cream", "Hot soup", "Umbrella", "Fan"],
      correctAnswer: "Hot soup",
      hint: 'Think about winter warmth',
      explanation: 'Hot soup warms us in winter.',
      topic: 'Matching',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'season_1_9',
      question: "Which season has the HOTTEST weather?",
      type: 'mcq',
      options: ["Winter", "Spring", "Summer", "Monsoon"],
      correctAnswer: "Summer",
      hint: 'Think about temperature',
      explanation: 'Summer has the highest temperatures.',
      topic: 'Temperature',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'season_1_10',
      question: "Which season has the COLDEST weather?",
      type: 'mcq',
      options: ["Summer", "Monsoon", "Winter", "Spring"],
      correctAnswer: "Winter",
      hint: 'Think about coldest season',
      explanation: 'Winter has the lowest temperatures.',
      topic: 'Temperature',
      difficulty: 'easy',
      points: 10,
    },
  ],
  medium: [
    {
      id: 'season_m1_1',
      question: "Match seasons with clothes:\nSummer - Cotton, Winter - ?",
      type: 'mcq',
      options: ["Raincoat", "Woolen", "Silk", "Linen"],
      correctAnswer: "Woolen",
      hint: 'Think about winter clothing',
      explanation: 'Winter requires woolen warm clothes.',
      topic: 'Matching',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'season_m1_2',
      question: "Match seasons with food:\nSummer - Ice cream, Monsoon - ?",
      type: 'mcq',
      options: ["Hot chocolate", "Pakoras", "Salad", "Cold drinks"],
      correctAnswer: "Pakoras",
      hint: 'Think about monsoon snacks',
      explanation: 'Pakoras are perfect for rainy days.',
      topic: 'Matching',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'season_m1_3',
      question: "Match seasons with activities:\nSummer - Swimming, Winter - ?",
      type: 'mcq',
      options: ["Sunbathing", "Splashing in rain", "Flying kites", "Skiing"],
      correctAnswer: "Sunbathing",
      hint: 'Think about winter activities',
      explanation: 'Winter sunbathing warms us up.',
      topic: 'Matching',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'season_m1_4',
      question: "Which months are in SUMMER?",
      type: 'mcq',
      options: ["December-January", "March-May", "July-August", "September-October"],
      correctAnswer: "March-May",
      hint: 'Think about summer months',
      explanation: 'March, April, May are summer months.',
      topic: 'Months',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'season_m1_5',
      question: "Which months are in WINTER?",
      type: 'mcq',
      options: ["June-July", "March-April", "November-January", "August-September"],
      correctAnswer: "November-January",
      hint: 'Think about cold months',
      explanation: 'November to January are winter months.',
      topic: 'Months',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'season_m1_6',
      question: "What should we eat in SUMMER to stay cool?",
      type: 'mcq',
      options: ["Spicy food", "Hot soup", "Water-rich fruits and salads", "Fried foods"],
      correctAnswer: "Water-rich fruits and salads",
      hint: 'Think about cooling foods',
      explanation: 'Water-rich foods help us stay hydrated.',
      topic: 'Summer Health',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'season_m1_7',
      question: "What should we eat in WINTER to stay warm?",
      type: 'mcq',
      options: ["Ice cream", "Cold drinks", "Hot nutritious food", "Salads"],
      correctAnswer: "Hot nutritious food",
      hint: 'Think about warming foods',
      explanation: 'Hot food keeps us warm in winter.',
      topic: 'Winter Health',
      difficulty: 'medium',
      points: 15,
    },
  ],
  hard: [
    {
      id: 'season_h1_1',
      question: "Name the seasons and their characteristics",
      type: 'fill_blank',
      correctAnswer: "Summer: Hot, cotton clothes, ice cream. Monsoon: Rainy, raincoat, pakoras. Winter: Cold, woolen, hot soup",
      hint: 'Think about all seasons',
      explanation: 'Each season has unique characteristics.',
      topic: 'All Seasons',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'season_h1_2',
      question: "How does weather affect our daily life?",
      type: 'fill_blank',
      correctAnswer: "Clothes, food, activities, mood, health, travel all depend on weather",
      hint: 'Think about daily impact',
      explanation: 'Weather influences many aspects of life.',
      topic: 'Impact',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'season_h1_3',
      question: "What precautions should we take in different seasons?",
      type: 'fill_blank',
      correctAnswer: "Summer: Hydrate, shade. Monsoon: Umbrella, avoid flooded areas. Winter: Warm clothes, avoid cold drinks",
      hint: 'Think about seasonal safety',
      explanation: 'Each season requires specific precautions.',
      topic: 'Precautions',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'season_h1_4',
      question: "Why do seasons change on Earth?",
      type: 'mcq',
      options: ["Because moon moves", "Because Earth tilts on axis and orbits sun", "Because sun gets tired", "Because of pollution"],
      correctAnswer: "Because Earth tilts on axis and orbits sun",
      hint: 'Think about Earth\'s movement',
      explanation: 'Earth\'s tilt causes seasonal changes.',
      topic: 'Science',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'season_h1_5',
      question: "How do animals adapt to different seasons?",
      type: 'fill_blank',
      correctAnswer: "Migration, hibernation, changing fur, storing food, changing behavior",
      hint: 'Think about animal adaptations',
      explanation: 'Animals have various adaptation strategies.',
      topic: 'Adaptation',
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

const generateQuestionSet = (chapter: number, level: number): SeasonWheelQuestion[] => {
  const difficulty = getDifficulty(level);
  const questions = [...(questionsData[difficulty] || [])];
  return questions.sort(() => Math.random() - 0.5).slice(0, 10);
};

export const useSeasonWheelStore = create<SeasonWheelGameState>((set, get) => ({
  currentChapter: 9,
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

