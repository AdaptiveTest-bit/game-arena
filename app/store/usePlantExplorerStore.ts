import { create } from 'zustand';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface PlantExplorerQuestion {
  id: string;
  question: string;
  type: 'mcq' | 'fill_blank' | 'match' | 'classification';
  options?: string[];
  correctAnswer: string | string[];
  hint: string;
  explanation: string;
  topic: string;
  difficulty: DifficultyLevel;
  points: number;
}

export interface PlantExplorerGameState {
  currentChapter: number;
  currentLevel: number;
  questions: PlantExplorerQuestion[];
  currentQuestionIndex: number;
  currentQuestion: PlantExplorerQuestion | null;
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

// Plant types data
const plantTypes = [
  { type: 'tree', description: 'Tall plant with woody stem', examples: ['Mango', 'Peepal', ' Banyan'] },
  { type: 'shrub', description: 'Small plant with many branches', examples: ['Rose', 'Hibiscus', 'Lemon'] },
  { type: 'herb', description: 'Small plant with soft stem', examples: ['Mint', 'Coriander', 'Basil'] },
  { type: 'climber', description: 'Plant that climbs support', examples: ['Grape vine', 'Money plant', 'Bean'] },
  { type: 'creeper', description: 'Plant that spreads on ground', examples: ['Pumpkin', 'Watermelon', 'Strawberry'] },
];

// Plant uses data
const plantUses = {
  food: ['Rice', 'Wheat', 'Fruits', 'Vegetables', 'Pulses'],
  medicine: ['Tulsi', 'Aloe vera', 'Neem', 'Ginger', 'Turmeric'],
  wood: ['Teak', 'Sal', 'Deodar', 'Rosewood', 'Oak'],
  shade: ['Banyan', 'Peepal', 'Neem', 'Mango', 'Jackfruit'],
  ornamental: ['Rose', 'Lotus', 'Marigold', 'Jasmine', 'Lily'],
};

// Question data for Chapter 2: Plants Around Us
const questionsData: Record<DifficultyLevel, PlantExplorerQuestion[]> = {
  easy: [
    {
      id: 'plant_1_1',
      question: "Which is a TREE?",
      type: 'mcq',
      options: ["Rose plant", "Mango tree", "Mint", "Grass"],
      correctAnswer: "Mango tree",
      hint: 'Think about tall plants with woody trunks',
      explanation: 'A mango tree is a tall plant with a woody trunk - it is a tree.',
      topic: 'Plant Types',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'plant_1_2',
      question: "Which is a HERB?",
      type: 'mcq',
      options: ["Coconut palm", "Rose bush", "Coriander plant", "Banyan tree"],
      correctAnswer: "Coriander plant",
      hint: 'Small plants with soft stems are herbs',
      explanation: 'Coriander is a small plant with a soft stem - it is a herb.',
      topic: 'Plant Types',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'plant_1_3',
      question: "Which plant gives us food?",
      type: 'mcq',
      options: ["Rose", "Mango tree", "Neem", "Marigold"],
      correctAnswer: "Mango tree",
      hint: 'What fruits do we eat?',
      explanation: 'Mango tree gives us the delicious mango fruit we eat.',
      topic: 'Plant Uses',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'plant_1_4',
      question: "Which is a SHRUB?",
      type: 'mcq',
      options: ["Wheat plant", "Rose bush", "Bamboo", "Coconut tree"],
      correctAnswer: "Rose bush",
      hint: 'Think about plants with many branches from the base',
      explanation: 'A rose bush is a small plant with many branches - it is a shrub.',
      topic: 'Plant Types',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'plant_1_5',
      question: "Match the plant with its use: Neem",
      type: 'mcq',
      options: ["For food", "For medicine", "For wood", "For flowers"],
      correctAnswer: "For medicine",
      hint: 'What is neem commonly used for?',
      explanation: 'Neem is used for medicine - it has healing properties.',
      topic: 'Plant Uses',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'plant_1_6',
      question: "Which is a CLIMBER plant?",
      type: 'mcq',
      options: ["Pumpkin", "Grape vine", "Coconut tree", "Rose bush"],
      correctAnswer: "Grape vine",
      hint: 'Plants that climb up supports are climbers',
      explanation: 'Grape vine climbs up trellises and walls - it is a climber.',
      topic: 'Plant Types',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'plant_1_7',
      question: "Which plant is used for making furniture?",
      type: 'mcq',
      options: ["Rose", "Basil", "Teak tree", "Tulsi"],
      correctAnswer: "Teak tree",
      hint: 'Think about strong wood for furniture',
      explanation: 'Teak tree provides strong wood used for making furniture.',
      topic: 'Plant Uses',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'plant_1_8',
      question: "Which is a CREEPER?",
      type: 'mcq',
      options: ["Mango tree", "Pumpkin", "Rose bush", "Neem tree"],
      correctAnswer: "Pumpkin",
      hint: 'Plants that spread on the ground are creepers',
      explanation: 'Pumpkin spreads along the ground - it is a creeper.',
      topic: 'Plant Types',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'plant_1_9',
      question: "Tulsi is mainly used for?",
      type: 'mcq',
      options: ["Making furniture", "Medicinal purposes", "Building houses", "Making clothes"],
      correctAnswer: "Medicinal purposes",
      hint: 'What do we use tulsi tea for?',
      explanation: 'Tulsi is used for medicine and as an immunity booster.',
      topic: 'Plant Uses',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'plant_1_10',
      question: "Plants give us _______ to breathe.",
      type: 'fill_blank',
      correctAnswer: "oxygen",
      hint: 'What gas do plants release?',
      explanation: 'Plants release oxygen which we breathe in.',
      topic: 'Plant Importance',
      difficulty: 'easy',
      points: 10,
    },
  ],
  medium: [
    {
      id: 'plant_m1_1',
      question: "Classify: Mango, Rose, Wheat, Pumpkin",
      type: 'classification',
      options: ["Tree", "Shrub", "Herb", "Creeper"],
      correctAnswer: ["Mango", "Rose", "Wheat", "Pumpkin"],
      hint: 'Think about the height and stem type of each plant',
      explanation: 'Mango is a tree, Rose is a shrub, Wheat is a herb, Pumpkin is a creeper.',
      topic: 'Plant Classification',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'plant_m1_2',
      question: "Match the columns:\n1. Rose\na. Food\n2. Tulsi\nb. Medicine\n3. Mango\nc. Ornamental\n4. Wheat\nd. Shade",
      type: 'match',
      correctAnswer: ["1-c", "2-b", "3-a", "4-a"],
      hint: 'Think about the main use of each plant',
      explanation: 'Rose is ornamental, Tulsi is for medicine, Mango gives food, Wheat is for food.',
      topic: 'Plant Uses',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'plant_m1_3',
      question: "Why do plants need roots?",
      type: 'mcq',
      options: ["To make flowers", "To absorb water and hold the plant", "To attract bees", "To catch insects"],
      correctAnswer: "To absorb water and hold the plant",
      hint: 'What do roots do underground?',
      explanation: 'Roots absorb water and minerals from soil and hold the plant firmly.',
      topic: 'Plant Parts',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'plant_m1_4',
      question: "Which part of the plant makes food?",
      type: 'mcq',
      options: ["Roots", "Stem", "Leaves", "Flowers"],
      correctAnswer: "Leaves",
      hint: 'Where is chlorophyll found?',
      explanation: 'Leaves contain chlorophyll and make food through photosynthesis.',
      topic: 'Plant Functions',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'plant_m1_5',
      question: "Plants need which things to make food?",
      type: 'mcq',
      options: ["Sunlight, water, air", "Soil, rocks, sand", "Plastic, metal, glass", "TV, phone, computer"],
      correctAnswer: "Sunlight, water, air",
      hint: 'What is photosynthesis?',
      explanation: 'Plants need sunlight, water, and air to make food through photosynthesis.',
      topic: 'Photosynthesis',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'plant_m1_6',
      question: "Name one plant that gives us medicine",
      type: 'fill_blank',
      correctAnswer: "Tulsi / Aloe vera / Neem / Ginger",
      hint: 'Think about medicinal plants you know',
      explanation: 'Many plants like Tulsi, Aloe vera, and Neem have medicinal properties.',
      topic: 'Plant Uses',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'plant_m1_7',
      question: "What is the difference between a climber and a creeper?",
      type: 'fill_blank',
      correctAnswer: "Climbers go up, creepers spread on ground",
      hint: 'Think about how they grow',
      explanation: 'Climbers grow upwards on supports, while creepers spread along the ground.',
      topic: 'Plant Types',
      difficulty: 'medium',
      points: 15,
    },
  ],
  hard: [
    {
      id: 'plant_h1_1',
      question: "Explain photosynthesis in simple terms",
      type: 'fill_blank',
      correctAnswer: "Plants use sunlight, water, air to make food and release oxygen",
      hint: 'Remember the formula: sunlight + water + CO2 = food + oxygen',
      explanation: 'Photosynthesis is how plants make food using sunlight, water, and air, releasing oxygen.',
      topic: 'Photosynthesis',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'plant_h1_2',
      question: "How do plants help the environment? (Give 3 ways)",
      type: 'fill_blank',
      correctAnswer: "Give oxygen, prevent soil erosion, provide habitat, absorb CO2",
      hint: 'Think about what plants do for nature',
      explanation: 'Plants give oxygen, prevent soil erosion, provide shelter for animals, and absorb carbon dioxide.',
      topic: 'Environmental Importance',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'plant_h1_3',
      question: "What would happen if there were no plants on Earth?",
      type: 'mcq',
      options: ["Nothing would change", "Animals would have more food", "No oxygen for animals, food chain would break", "It would rain more"],
      correctAnswer: "No oxygen for animals, food chain would break",
      hint: 'Think about the food chain and oxygen',
      explanation: 'Without plants, there would be no oxygen, no food, and the entire ecosystem would collapse.',
      topic: 'Importance of Plants',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'plant_h1_4',
      question: "Compare trees and herbs - give 3 differences",
      type: 'fill_blank',
      correctAnswer: "Trees: tall, woody stem, long life | Herbs: short, soft stem, short life",
      hint: 'Think about height, stem, and lifespan',
      explanation: 'Trees are tall with woody stems and live long. Herbs are short with soft stems and live briefly.',
      topic: 'Comparison',
      difficulty: 'hard',
      points: 25,
    },
    {
      id: 'plant_h1_5',
      question: "Design a garden with 5 different types of plants and explain why",
      type: 'fill_blank',
      correctAnswer: "Include trees for shade, shrubs for boundaries, herbs for cooking, climbers for walls, creepers for ground cover",
      hint: 'Think about different plant uses',
      explanation: 'A good garden has variety - trees for shade, shrubs for boundaries, herbs for use, climbers and creepers for decoration.',
      topic: 'Application',
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

const generateQuestionSet = (chapter: number, level: number): PlantExplorerQuestion[] => {
  const difficulty = getDifficulty(level);
  const questions = [...(questionsData[difficulty] || [])];
  return questions.sort(() => Math.random() - 0.5).slice(0, 10);
};

export const usePlantExplorerStore = create<PlantExplorerGameState>((set, get) => ({
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

