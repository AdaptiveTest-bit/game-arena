import { create } from 'zustand';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface HelperMatchQuestion {
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

export interface HelperMatchGameState {
  currentChapter: number;
  currentLevel: number;
  questions: HelperMatchQuestion[];
  currentQuestionIndex: number;
  currentQuestion: HelperMatchQuestion | null;
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

// Helpers data
const helpersData = [
  { name: 'Doctor', tools: ['Stethoscope', 'Medicine'], work: 'Treat sick people' },
  { name: 'Teacher', tools: ['Books', 'Chalk'], work: 'Teach students' },
  { name: 'Police', tools: ['Whistle', 'Lathi'], work: 'Maintain law and order' },
  { name: 'Firefighter', tools: ['Water pipe', 'Ladder'], work: 'Put out fires' },
  { name: 'Farmer', tools: ['Plough', 'Sickle'], work: 'Grow crops' },
  { name: 'Nurse', tools: ['Syringe', 'Bandage'], work: 'Help doctors, care for patients' },
  { name: 'Driver', tools: ['Steering wheel', 'Horn'], work: 'Drive vehicles' },
  { name: 'Postman', tools: ['Bag', 'Letters'], work: 'Deliver letters and parcels' },
  { name: 'Baker', tools: ['Oven', 'Rolling pin'], work: 'Bake bread and cakes' },
  { name: 'Barber', tools: ['Scissors', 'Comb'], work: 'Cut hair' },
];

// Question data for Chapter 5: People Who Help Us
const questionsData: Record<DifficultyLevel, HelperMatchQuestion[]> = {
  easy: [
    {
      id: 'help_1_1',
      question: "Who keeps us healthy?",
      type: 'mcq',
      options: ["Teacher", "Doctor", "Postman", "Driver"],
      correctAnswer: "Doctor",
      hint: 'Think about who you visit when you are sick',
      explanation: 'Doctors keep us healthy by checking us and giving medicine.',
      topic: 'Health Helpers',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'help_1_2',
      question: "Who teaches us in school?",
      type: 'mcq',
      options: ["Doctor", "Farmer", "Teacher", "Police"],
      correctAnswer: "Teacher",
      hint: 'Think about who helps you learn new things',
      explanation: 'Teachers help us learn reading, writing, and math.',
      topic: 'Education Helpers',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'help_1_3',
      question: "Who delivers letters to our home?",
      type: 'mcq',
      options: ["Baker", "Postman", "Driver", "Nurse"],
      correctAnswer: "Postman",
      hint: 'Think about who brings letters and parcels',
      explanation: 'Postmen deliver letters, parcels, and bills.',
      topic: 'Communication Helpers',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'help_1_4',
      question: "Match the helper with their tool: Doctor",
      type: 'mcq',
      options: ["Plough", "Stethoscope", "Books", "Bag"],
      correctAnswer: "Stethoscope",
      hint: 'Think about what doctors use to check heart',
      explanation: 'Doctors use stethoscopes to listen to heart and lungs.',
      topic: 'Matching',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'help_1_5',
      question: "Why are helpers important?",
      type: 'mcq',
      options: ["They make money", "They help society function smoothly", "They are famous", "They work less"],
      correctAnswer: "They help society function smoothly",
      hint: 'Think about what would happen without helpers',
      explanation: 'Helpers make our lives easier and keep society running.',
      topic: 'Importance',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'help_1_6',
      question: "Who helps put out fires?",
      type: 'mcq',
      options: ["Firefighter", "Police", "Doctor", "Teacher"],
      correctAnswer: "Firefighter",
      hint: 'Think about who comes when there is fire',
      explanation: 'Firefighters rescue people and put out fires.',
      topic: 'Safety Helpers',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'help_1_7',
      question: "Who grows food for us?",
      type: 'mcq',
      options: ["Baker", "Farmer", "Postman", "Barber"],
      correctAnswer: "Farmer",
      hint: 'Think about who works in fields',
      explanation: 'Farmers grow crops like rice, wheat, and vegetables.',
      topic: 'Food Helpers',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'help_1_8',
      question: "Who maintains law and order?",
      type: 'mcq',
      options: ["Teacher", "Nurse", "Police", "Driver"],
      correctAnswer: "Police",
      hint: 'Think about who protects us and catches thieves',
      explanation: 'Police keep us safe and maintain law and order.',
      topic: 'Safety Helpers',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'help_1_9',
      question: "Who helps doctors in hospitals?",
      type: 'mcq',
      options: ["Teacher", "Nurse", "Farmer", "Postman"],
      correctAnswer: "Nurse",
      hint: 'Think about who gives you medicine in hospital',
      explanation: 'Nurses help doctors and take care of patients.',
      topic: 'Health Helpers',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'help_1_10',
      question: "Who bakes bread and cakes?",
      type: 'mcq',
      options: ["Baker", "Barber", "Police", "Driver"],
      correctAnswer: "Baker",
      hint: 'Think about who makes the bread you eat',
      explanation: 'Bakers make bread, cakes, biscuits, and pastries.',
      topic: 'Food Helpers',
      difficulty: 'easy',
      points: 10,
    },
  ],
  medium: [
    {
      id: 'help_m1_1',
      question: "Match: Doctor - ?",
      type: 'mcq',
      options: ["Stethoscope", "Plough", "Whistle", "Oven"],
      correctAnswer: "Stethoscope",
      hint: 'Think about doctor tools',
      explanation: 'Doctors use stethoscopes to check patients.',
      topic: 'Tools Matching',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'help_m1_2',
      question: "Match: Farmer - ?",
      type: 'mcq',
      options: ["Stethoscope", "Plough", "Whistle", "Oven"],
      correctAnswer: "Plough",
      hint: 'Think about farming tools',
      explanation: 'Farmers use ploughs to prepare soil for crops.',
      topic: 'Tools Matching',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'help_m1_3',
      question: "Match: Police - ?",
      type: 'mcq',
      options: ["Stethoscope", "Plough", "Whistle", "Oven"],
      correctAnswer: "Whistle",
      hint: 'Think about police tools',
      explanation: 'Police use whistles to signal and control crowds.',
      topic: 'Tools Matching',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'help_m1_4',
      question: "Match: Baker - ?",
      type: 'mcq',
      options: ["Stethoscope", "Plough", "Whistle", "Oven"],
      correctAnswer: "Oven",
      hint: 'Think about baking tools',
      explanation: 'Bakers use ovens to bake bread and cakes.',
      topic: 'Tools Matching',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'help_m1_5',
      question: "What work does a TEACHER do?",
      type: 'mcq',
      options: ["Grow crops", "Teach students", "Deliver letters", "Treat patients"],
      correctAnswer: "Teach students",
      hint: 'Think about what teachers do in school',
      explanation: 'Teachers educate students and help them learn.',
      topic: 'Work Matching',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'help_m1_6',
      question: "What work does a FIREFIGHTER do?",
      type: 'mcq',
      options: ["Put out fires", "Grow crops", "Deliver letters", "Cut hair"],
      correctAnswer: "Put out fires",
      hint: 'Think about fire emergencies',
      explanation: 'Firefighters rescue people and put out fires.',
      topic: 'Work Matching',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'help_m1_7',
      question: "We should _____ all helpers.",
      type: 'fill_blank',
      correctAnswer: "respect",
      hint: 'Think about good behavior towards helpers',
      explanation: 'We should respect all helpers for their hard work.',
      topic: 'Values',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'help_m1_8',
      question: "Who helps us reach our destination?",
      type: 'mcq',
      options: ["Doctor", "Driver", "Postman", "Baker"],
      correctAnswer: "Driver",
      hint: 'Think about who drives buses, cars, etc.',
      explanation: 'Drivers help us travel by driving vehicles.',
      topic: 'Transport Helpers',
      difficulty: 'medium',
      points: 15,
    },
  ],
  hard: [
    {
      id: 'help_h1_1',
      question: "Name 3 helpers and one tool each",
      type: 'fill_blank',
      correctAnswer: "Doctor: Stethoscope, Teacher: Books, Police: Whistle",
      hint: 'Think about different helpers and their tools',
      explanation: 'Doctors use stethoscopes, teachers use books, police use whistles.',
      topic: 'Tools & Helpers',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'help_h1_2',
      question: "Why is a NURSE important in a hospital?",
      type: 'mcq',
      options: ["Because they earn more", "Because they help doctors and care for patients 24/7", "Because they wear white", "Because they work only at night"],
      correctAnswer: "Because they help doctors and care for patients 24/7",
      hint: 'Think about hospital care',
      explanation: 'Nurses provide round-the-clock care to patients.',
      topic: 'Importance',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'help_h1_3',
      question: "What are 4 ways we can thank helpers?",
      type: 'fill_blank',
      correctAnswer: "Say thank you, respect them, follow their advice, appreciate their work",
      hint: 'Think about how to show gratitude',
      explanation: 'We can thank helpers by respecting them and following rules.',
      topic: 'Gratitude',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'help_h1_4',
      question: "How do helpers make our community better?",
      type: 'fill_blank',
      correctAnswer: "By providing essential services, keeping us safe, teaching us, and maintaining health",
      hint: 'Think about community services',
      explanation: 'Helpers provide essential services that keep communities running.',
      topic: 'Community',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'help_h1_5',
      question: "Name the helper: Uses plough, grows crops, feeds nation",
      type: 'mcq',
      options: ["Doctor", "Farmer", "Teacher", "Police"],
      correctAnswer: "Farmer",
      hint: 'Think about food production',
      explanation: 'Farmers grow crops and feed the nation.',
      topic: 'Identification',
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

const generateQuestionSet = (chapter: number, level: number): HelperMatchQuestion[] => {
  const difficulty = getDifficulty(level);
  const questions = [...(questionsData[difficulty] || [])];
  return questions.sort(() => Math.random() - 0.5).slice(0, 10);
};

export const useHelperMatchStore = create<HelperMatchGameState>((set, get) => ({
  currentChapter: 5,
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

