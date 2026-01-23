import { create } from 'zustand';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface TransportTrackQuestion {
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
  category?: string;
}

export interface TransportTrackGameState {
  currentChapter: number;
  currentLevel: number;
  questions: TransportTrackQuestion[];
  currentQuestionIndex: number;
  currentQuestion: TransportTrackQuestion | null;
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

// Transport vehicles data
const vehiclesData = {
  land: ['Car', 'Bus', 'Train', 'Bicycle', 'Motorcycle', 'Truck', 'Auto-rickshaw', 'Tractor'],
  water: ['Ship', 'Boat', 'Submarine', 'Sailboat', 'Ferry', 'Yacht', 'Rowboat'],
  air: ['Airplane', 'Helicopter', 'Balloon', 'Rocket', 'Glider', 'Drone'],
};

// Question data for Chapter 6: Transport
const questionsData: Record<DifficultyLevel, TransportTrackQuestion[]> = {
  easy: [
    {
      id: 'trans_1_1',
      question: "Which vehicle travels on ROADS?",
      type: 'mcq',
      options: ["Ship", "Airplane", "Car", "Submarine"],
      correctAnswer: "Car",
      hint: 'Think about what you see on streets',
      explanation: 'Cars travel on roads and are used for personal transport.',
      topic: 'Land Transport',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'trans_1_2',
      question: "Which vehicle travels on WATER?",
      type: 'mcq',
      options: ["Train", "Bus", "Ship", "Bicycle"],
      correctAnswer: "Ship",
      hint: 'Think about what floats and sails on seas',
      explanation: 'Ships are large vehicles that travel on oceans and rivers.',
      topic: 'Water Transport',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'trans_1_3',
      question: "Which vehicle travels in the SKY?",
      type: 'mcq',
      options: ["Car", "Ship", "Airplane", "Train"],
      correctAnswer: "Airplane",
      hint: 'Think about what flies overhead',
      explanation: 'Airplanes fly in the sky and are the fastest way to travel far.',
      topic: 'Air Transport',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'trans_1_4',
      question: "Which is the FASTEST transport?",
      type: 'mcq',
      options: ["Bicycle", "Bus", "Airplane", "Car"],
      correctAnswer: "Airplane",
      hint: 'Think about what flies and covers long distances quickly',
      explanation: 'Airplanes are the fastest mode of transport.',
      topic: 'Speed Comparison',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'trans_1_5',
      question: "Which is the SLOWEST transport?",
      type: 'mcq',
      options: ["Airplane", "Car", "Bicycle", "Train"],
      correctAnswer: "Bicycle",
      hint: 'Think about what requires physical effort and moves slowly',
      explanation: 'Bicycles are human-powered and the slowest transport.',
      topic: 'Speed Comparison',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'trans_1_6',
      question: "Which vehicle do we use to cross rivers?",
      type: 'mcq',
      options: ["Bus", "Boat", "Bicycle", "Car"],
      correctAnswer: "Boat",
      hint: 'Think about what floats on water',
      explanation: 'Boats are used to cross rivers and travel on water.',
      topic: 'Water Transport',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'trans_1_7',
      question: "Which vehicle runs on RAILS?",
      type: 'mcq',
      options: ["Car", "Bus", "Train", "Truck"],
      correctAnswer: "Train",
      hint: 'Think about what moves on metal tracks',
      explanation: 'Trains run on railway tracks and carry many passengers.',
      topic: 'Land Transport',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'trans_1_8',
      question: "Sort these: Car, Ship, Airplane",
      type: 'classification',
      options: ["Land", "Water", "Air"],
      correctAnswer: ["Car", "Ship", "Airplane"],
      hint: 'Think about where each vehicle travels',
      explanation: 'Car is land, Ship is water, Airplane is air.',
      topic: 'Classification',
      difficulty: 'easy',
      points: 12,
    },
    {
      id: 'trans_1_9',
      question: "Which is a good transport for a large group of people?",
      type: 'mcq',
      options: ["Car", "Bicycle", "Bus", "Motorcycle"],
      correctAnswer: "Bus",
      hint: 'Think about what can carry many people',
      explanation: 'Buses can carry many passengers at once.',
      topic: 'Capacity',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'trans_1_10',
      question: "Which vehicle needs a PILOT?",
      type: 'mcq',
      options: ["Car", "Bus", "Airplane", "Train"],
      correctAnswer: "Airplane",
      hint: 'Think about what flies in the sky',
      explanation: 'Airplanes need pilots to fly them safely.',
      topic: 'Transport Operations',
      difficulty: 'easy',
      points: 10,
    },
  ],
  medium: [
    {
      id: 'trans_m1_1',
      question: "Which transport is BEST for long distances across countries?",
      type: 'mcq',
      options: ["Car", "Bicycle", "Airplane", "Bus"],
      correctAnswer: "Airplane",
      hint: 'Think about what can cross oceans quickly',
      explanation: 'Airplanes are best for international travel.',
      topic: 'Long Distance',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'trans_m1_2',
      question: "Which transport is CHEAPEST for many people?",
      type: 'mcq',
      options: ["Airplane", "Car", "Train", "Ship"],
      correctAnswer: "Train",
      hint: 'Think about what is affordable and carries many',
      explanation: 'Trains are economical for long-distance travel.',
      topic: 'Cost',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'trans_m1_3',
      question: "Sort into Land, Water, Air: Bicycle, Sailboat, Helicopter",
      type: 'classification',
      options: ["Land", "Water", "Air"],
      correctAnswer: ["Bicycle", "Sailboat", "Helicopter"],
      hint: 'Think about where each travels',
      explanation: 'Bicycle is land, Sailboat is water, Helicopter is air.',
      topic: 'Classification',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'trans_m1_4',
      question: "Which transport needs FUEL to run?",
      type: 'mcq',
      options: ["Bicycle", "Sailboat", "Car", "Walking"],
      correctAnswer: "Car",
      hint: 'Think about what needs gasoline or diesel',
      explanation: 'Cars and most vehicles need fuel to run.',
      topic: 'Energy',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'trans_m1_5',
      question: "Which is an ECO-FRIENDLY transport?",
      type: 'mcq',
      options: ["Car", "Bus", "Bicycle", "Airplane"],
      correctAnswer: "Bicycle",
      hint: 'Think about what does not pollute',
      explanation: 'Bicycles do not cause pollution and are eco-friendly.',
      topic: 'Environment',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'trans_m1_6',
      question: "Why do we need DIFFERENT types of transport?",
      type: 'mcq',
      options: ["Because all look the same", "Because different places need different vehicles", "Because cars are boring", "Because bicycles are slow"],
      correctAnswer: "Because different places need different vehicles",
      hint: 'Think about roads, water, and air',
      explanation: 'Different terrains need different transport modes.',
      topic: 'Purpose',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'trans_m1_7',
      question: "Which transport is used for DELIVERIES in cities?",
      type: 'mcq',
      options: ["Airplane", "Ship", "Truck", "Submarine"],
      correctAnswer: "Truck",
      hint: 'Think about what carries goods on roads',
      explanation: 'Trucks are used to deliver goods within cities.',
      topic: 'Goods Transport',
      difficulty: 'medium',
      points: 15,
    },
  ],
  hard: [
    {
      id: 'trans_h1_1',
      question: "Name 2 land, 2 water, and 2 air transport vehicles",
      type: 'fill_blank',
      correctAnswer: "Land: Car, Bus | Water: Ship, Boat | Air: Airplane, Helicopter",
      hint: 'Think about all the vehicles you know',
      explanation: 'Various vehicles serve different transport needs.',
      topic: 'All Categories',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'trans_h1_2',
      question: "Why is PUBLIC transport better than PRIVATE transport?",
      type: 'mcq',
      options: ["Because it is more expensive", "Because it reduces traffic and pollution", "Because it is slower", "Because it is harder to find"],
      correctAnswer: "Because it reduces traffic and pollution",
      hint: 'Think about many people using one vehicle',
      explanation: 'Public transport reduces congestion and environmental impact.',
      topic: 'Environment',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'trans_h1_3',
      question: "What are the 3 main types of transport based on medium?",
      type: 'fill_blank',
      correctAnswer: "Land, Water, Air",
      hint: 'Think about where vehicles travel',
      explanation: 'Transport is classified as land, water, and air.',
      topic: 'Classification',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'trans_h1_4',
      question: "How has transport changed over time?",
      type: 'fill_blank',
      correctAnswer: "From animals to engines, from slow to fast, from local to global",
      hint: 'Think about old vs modern vehicles',
      explanation: 'Transport evolved from animal carts to fast airplanes.',
      topic: 'History',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'trans_h1_5',
      question: "What should we consider when choosing transport?",
      type: 'fill_blank',
      correctAnswer: "Distance, cost, speed, environment, purpose",
      hint: 'Think about different travel needs',
      explanation: 'We choose transport based on distance, budget, and urgency.',
      topic: 'Decision Making',
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

const generateQuestionSet = (chapter: number, level: number): TransportTrackQuestion[] => {
  const difficulty = getDifficulty(level);
  const questions = [...(questionsData[difficulty] || [])];
  return questions.sort(() => Math.random() - 0.5).slice(0, 10);
};

export const useTransportTrackStore = create<TransportTrackGameState>((set, get) => ({
  currentChapter: 6,
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

