import { create } from 'zustand';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface SafetySignalQuestion {
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

export interface SafetySignalGameState {
  currentChapter: number;
  currentLevel: number;
  questions: SafetySignalQuestion[];
  currentQuestionIndex: number;
  currentQuestion: SafetySignalQuestion | null;
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

// Traffic signs data
const trafficSigns = [
  { name: 'Stop', meaning: 'Stop the vehicle', color: 'Red octagon' },
  { name: 'No Entry', meaning: 'Do not enter', color: 'Red circle with white bar' },
  { name: 'Pedestrian Crossing', meaning: 'Cross the road here', color: 'Blue triangle' },
  { name: 'Speed Limit', meaning: 'Maximum speed allowed', color: 'White circle' },
  { name: 'School Zone', meaning: 'Slow down, school nearby', color: 'Yellow diamond' },
  { name: 'Hospital', meaning: 'Hospital ahead', color: 'Blue rectangle' },
  { name: 'Roundabout', meaning: 'Circular road ahead', color: 'Blue circle' },
  { name: 'Give Way', meaning: 'Yield to other vehicles', color: 'Inverted triangle' },
];

// Question data for Chapter 7: Road Safety
const questionsData: Record<DifficultyLevel, SafetySignalQuestion[]> = {
  easy: [
    {
      id: 'safety_1_1',
      question: "What does a RED traffic light mean?",
      type: 'mcq',
      options: ["Go fast", "Stop", "Slow down", "Turn around"],
      correctAnswer: "Stop",
      hint: 'Think about the color that means stop',
      explanation: 'Red light means STOP. Always wait for green.',
      topic: 'Traffic Signals',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'safety_1_2',
      question: "What does a GREEN traffic light mean?",
      type: 'mcq',
      options: ["Stop", "Go", "Slow down", "Park"],
      correctAnswer: "Go",
      hint: 'Think about the color that means go',
      explanation: 'Green light means GO. You can cross or drive.',
      topic: 'Traffic Signals',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'safety_1_3',
      question: "What does a YELLOW traffic light mean?",
      type: 'mcq',
      options: ["Stop if you can", "Go very fast", "Turn left", "Park here"],
      correctAnswer: "Stop if you can",
      hint: 'Think about the warning color',
      explanation: 'Yellow means prepare to stop. It is a warning.',
      topic: 'Traffic Signals',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'safety_1_4',
      question: "What does a ZEBRA CROSSING mean?",
      type: 'mcq',
      options: ["Car parking", "Pedestrian crossing", "Bus stop", "No entry"],
      correctAnswer: "Pedestrian crossing",
      hint: 'Think about striped paths for walking',
      explanation: 'Zebra crossing is where pedestrians should cross.',
      topic: 'Road Signs',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'safety_1_5',
      question: "What safety rule should you follow at school?",
      type: 'mcq',
      options: ["Run on road", "Cross anywhere", "Use zebra crossing", "Play on road"],
      correctAnswer: "Use zebra crossing",
      hint: 'Think about safe places to cross',
      explanation: 'Always use zebra crossing or underpass to cross roads.',
      topic: 'Safety Rules',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'safety_1_6',
      question: "Which side of the road should you walk on?",
      type: 'mcq',
      options: ["Middle", "Facing traffic", "Any side", "With eyes closed"],
      correctAnswer: "Facing traffic",
      hint: 'Think about seeing oncoming vehicles',
      explanation: 'Walk facing traffic so you can see coming vehicles.',
      topic: 'Pedestrian Safety',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'safety_1_7',
      question: "Should you cross the road while looking at your phone?",
      type: 'true_false',
      options: ["True", "False"],
      correctAnswer: "False",
      hint: 'Think about distractions while crossing',
      explanation: 'Never use phone while crossing. Stay alert!',
      topic: 'Safety Rules',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'safety_1_8',
      question: "What does a HELMET protect?",
      type: 'mcq',
      options: ["Knees", "Head", "Hands", "Feet"],
      correctAnswer: "Head",
      hint: 'Think about what needs protection on a bike',
      explanation: 'Helmets protect your head from injury.',
      topic: 'Safety Gear',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'safety_1_9',
      question: "What does a SEAT BELT protect?",
      type: 'mcq',
      options: ["Driver only", "All passengers", "Nobody", "Car only"],
      correctAnswer: "All passengers",
      hint: 'Think about safety in cars',
      explanation: 'Seat belts protect all passengers in the car.',
      topic: 'Safety Gear',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'safety_1_10',
      question: "What should you do before crossing a road?",
      type: 'mcq',
      options: ["Close eyes", "Look left, right, left", "Run fast", "Jump"],
      correctAnswer: "Look left, right, left",
      hint: 'Think about checking for vehicles',
      explanation: 'Always look both ways before crossing.',
      topic: 'Safety Rules',
      difficulty: 'easy',
      points: 10,
    },
  ],
  medium: [
    {
      id: 'safety_m1_1',
      question: "Match the sign: 🔴🔴 (Octagon shape)",
      type: 'mcq',
      options: ["Go", "Stop", "Yield", "Hospital"],
      correctAnswer: "Stop",
      hint: 'Think about the shape and color',
      explanation: 'Red octagon always means STOP.',
      topic: 'Traffic Signs',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'safety_m1_2',
      question: "Match the sign: 🔵📏 (Blue rectangle)",
      type: 'mcq',
      options: ["Stop", "Hospital", "School", "Speed limit"],
      correctAnswer: "Hospital",
      hint: 'Think about what blue rectangle indicates',
      explanation: 'Blue rectangle with H means hospital ahead.',
      topic: 'Traffic Signs',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'safety_m1_3',
      question: "Why are traffic rules important?",
      type: 'mcq',
      options: ["To make roads confusing", "To prevent accidents and save lives", "To slow down everyone", "To waste time"],
      correctAnswer: "To prevent accidents and save lives",
      hint: 'Think about road safety purpose',
      explanation: 'Traffic rules keep everyone safe on roads.',
      topic: 'Importance',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'safety_m1_4',
      question: "What does a YELLOW DIAMOND sign mean?",
      type: 'mcq',
      options: ["Stop immediately", "Warning or caution", "No entry", "Speed limit"],
      correctAnswer: "Warning or caution",
      hint: 'Think about warning signs',
      explanation: 'Yellow diamond signs warn of hazards ahead.',
      topic: 'Traffic Signs',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'safety_m1_5',
      question: "What safety rule should cyclists follow?",
      type: 'mcq',
      options: ["Ride on footpath", "Ride against traffic", "Use cycle lane, wear helmet", "Ride at night without lights"],
      correctAnswer: "Use cycle lane, wear helmet",
      hint: 'Think about cyclist safety',
      explanation: 'Cyclists should use cycle lanes and wear helmets.',
      topic: 'Safety Rules',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'safety_m1_6',
      question: "What is the purpose of a CROSSWALK?",
      type: 'mcq',
      options: ["Car parking", "Safe place for pedestrians", "Bus stop", "Taxi stand"],
      correctAnswer: "Safe place for pedestrians",
      hint: 'Think about pedestrian safety',
      explanation: 'Crosswalks provide safe paths for pedestrians.',
      topic: 'Road Safety',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'safety_m1_7',
      question: "What should passengers do in a car?",
      type: 'mcq',
      options: ["Stand while moving", "Sit with seatbelt", "Distract driver", "Open doors while moving"],
      correctAnswer: "Sit with seatbelt",
      hint: 'Think about passenger safety',
      explanation: 'Passengers must sit with seatbelts fastened.',
      topic: 'Safety Rules',
      difficulty: 'medium',
      points: 15,
    },
  ],
  hard: [
    {
      id: 'safety_h1_1',
      question: "Name 3 traffic signs and their meanings",
      type: 'fill_blank',
      correctAnswer: "Stop: Stop vehicle, No Entry: Do not enter, Hospital: Medical help ahead",
      hint: 'Think about common signs',
      explanation: 'Signs communicate important safety information.',
      topic: 'Traffic Signs',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'safety_h1_2',
      question: "What are 5 safety rules for pedestrians?",
      type: 'fill_blank',
      correctAnswer: "Use crosswalks, look both ways, face traffic, no phone, wear bright clothes",
      hint: 'Think about pedestrian safety rules',
      explanation: 'Pedestrians should follow multiple safety rules.',
      topic: 'Safety Rules',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'safety_h1_3',
      question: "Why should we never jaywalk?",
      type: 'mcq',
      options: ["Because it is fun", "Because it is illegal and dangerous", "Because cars will stop", "Because it saves time"],
      correctAnswer: "Because it is illegal and dangerous",
      hint: 'Think about crossing randomly',
      explanation: 'Jaywalking puts you at risk of accidents.',
      topic: 'Safety Rules',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'safety_h1_4',
      question: "How can we make our roads safer?",
      type: 'fill_blank',
      correctAnswer: "Follow rules, wear safety gear, stay alert, respect others, report violations",
      hint: 'Think about community safety',
      explanation: 'Everyone following rules makes roads safer.',
      topic: 'Community Safety',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'safety_h1_5',
      question: "What is the difference between active and passive safety?",
      type: 'fill_blank',
      correctAnswer: "Active: prevents accidents (brakes, lights) | Passive: reduces injury (seatbelts, airbags)",
      hint: 'Think about types of safety features',
      explanation: 'Active safety prevents incidents; passive reduces injury.',
      topic: 'Advanced Safety',
      difficulty: 'hard',
      points: 25,
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

const generateQuestionSet = (chapter: number, level: number): SafetySignalQuestion[] => {
  const difficulty = getDifficulty(level);
  const questions = [...(questionsData[difficulty] || [])];
  return questions.sort(() => Math.random() - 0.5).slice(0, 10);
};

export const useSafetySignalStore = create<SafetySignalGameState>((set, get) => ({
  currentChapter: 7,
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

