'use client';

import { create } from 'zustand';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type Difficulty = 'easy' | 'medium' | 'hard';

export type ActivityType =
  | 'count-objects'      // Count objects in collection
  | 'sort-objects'       // Sort by color/type/size
  | 'make-tally'         // Create tally marks
  | 'read-tally'         // Read tally marks
  | 'read-pictograph'    // Read pictograph data
  | 'compare-data'       // Compare two quantities
  | 'data-question'      // Answer questions from data
  | 'build-pictograph';  // Build a pictograph

export type GamePhase = 'welcome' | 'difficulty' | 'playing' | 'feedback' | 'celebration';

// Sortable object with attributes
export interface SortableObject {
  id: string;
  emoji: string;
  name: string;
  color: string;
  type: string;
  size: 'small' | 'medium' | 'big';
}

// Pictograph row
export interface PictographRow {
  category: string;
  emoji: string;
  count: number;
}

// Question types
export interface CountObjectsQuestion {
  type: 'count-objects';
  instruction: string;
  objectEmoji: string;
  objectName: string;
  count: number;
  options: number[];
  correctAnswer: number;
}

export interface SortObjectsQuestion {
  type: 'sort-objects';
  instruction: string;
  sortBy: 'color' | 'type';
  targetAttribute: string;
  objects: SortableObject[];
  correctObjectIds: string[];
}

export interface MakeTallyQuestion {
  type: 'make-tally';
  instruction: string;
  targetNumber: number;
  objectEmoji: string;
  objectName: string;
}

export interface ReadTallyQuestion {
  type: 'read-tally';
  instruction: string;
  tallyCount: number;
  options: number[];
  correctAnswer: number;
}

export interface ReadPictographQuestion {
  type: 'read-pictograph';
  instruction: string;
  questionType: 'most' | 'least' | 'count';
  title: string;
  data: PictographRow[];
  correctAnswer: string;
  options: string[];
  targetCategory?: string;
}

export interface CompareDataQuestion {
  type: 'compare-data';
  instruction: string;
  item1: { name: string; emoji: string; count: number };
  item2: { name: string; emoji: string; count: number };
  questionType: 'more' | 'less';
  correctAnswer: string;
  options: string[];
}

export interface DataQuestionQuestion {
  type: 'data-question';
  instruction: string;
  scenario: string;
  data: PictographRow[];
  targetCategory: string;
  options: number[];
  correctAnswer: number;
}

export interface BuildPictographQuestion {
  type: 'build-pictograph';
  instruction: string;
  category: string;
  emoji: string;
  targetCount: number;
}

export type Question =
  | CountObjectsQuestion
  | SortObjectsQuestion
  | MakeTallyQuestion
  | ReadTallyQuestion
  | ReadPictographQuestion
  | CompareDataQuestion
  | DataQuestionQuestion
  | BuildPictographQuestion;

// Telemetry
export interface RoundTelemetry {
  roundNumber: number;
  activityType: ActivityType;
  question: string;
  correctAnswer: string | number | string[];
  playerAnswer: string | number | string[];
  isCorrect: boolean;
  attempts: number;
  timeSpentMs: number;
  timestamp: string;
}

// ─────────────────────────────────────────────────────────────
// OBJECT POOLS
// ─────────────────────────────────────────────────────────────

// Objects for counting
const countableObjects = [
  { emoji: '🍎', name: 'apples' },
  { emoji: '⭐', name: 'stars' },
  { emoji: '🐟', name: 'fish' },
  { emoji: '🌸', name: 'flowers' },
  { emoji: '🦋', name: 'butterflies' },
  { emoji: '🍪', name: 'cookies' },
  { emoji: '🎈', name: 'balloons' },
  { emoji: '🚗', name: 'cars' },
  { emoji: '🐦', name: 'birds' },
  { emoji: '🍌', name: 'bananas' },
];

// Sortable objects with attributes
const sortableObjects: SortableObject[] = [
  // Fruits
  { id: 'apple', emoji: '🍎', name: 'Apple', color: 'red', type: 'fruit', size: 'medium' },
  { id: 'orange', emoji: '🍊', name: 'Orange', color: 'orange', type: 'fruit', size: 'medium' },
  { id: 'banana', emoji: '🍌', name: 'Banana', color: 'yellow', type: 'fruit', size: 'medium' },
  { id: 'grapes', emoji: '🍇', name: 'Grapes', color: 'purple', type: 'fruit', size: 'small' },
  { id: 'watermelon', emoji: '🍉', name: 'Watermelon', color: 'green', type: 'fruit', size: 'big' },
  { id: 'strawberry', emoji: '🍓', name: 'Strawberry', color: 'red', type: 'fruit', size: 'small' },
  
  // Vegetables
  { id: 'carrot', emoji: '🥕', name: 'Carrot', color: 'orange', type: 'vegetable', size: 'medium' },
  { id: 'cucumber', emoji: '🥒', name: 'Cucumber', color: 'green', type: 'vegetable', size: 'medium' },
  { id: 'tomato', emoji: '🍅', name: 'Tomato', color: 'red', type: 'vegetable', size: 'medium' },
  { id: 'corn', emoji: '🌽', name: 'Corn', color: 'yellow', type: 'vegetable', size: 'medium' },
  
  // Animals
  { id: 'dog', emoji: '🐕', name: 'Dog', color: 'brown', type: 'animal', size: 'medium' },
  { id: 'cat', emoji: '🐈', name: 'Cat', color: 'orange', type: 'animal', size: 'small' },
  { id: 'elephant', emoji: '🐘', name: 'Elephant', color: 'gray', type: 'animal', size: 'big' },
  { id: 'mouse', emoji: '🐁', name: 'Mouse', color: 'gray', type: 'animal', size: 'small' },
  
  // Shapes
  { id: 'red-circle', emoji: '🔴', name: 'Red Circle', color: 'red', type: 'shape', size: 'medium' },
  { id: 'yellow-circle', emoji: '🟡', name: 'Yellow Circle', color: 'yellow', type: 'shape', size: 'medium' },
  { id: 'green-circle', emoji: '🟢', name: 'Green Circle', color: 'green', type: 'shape', size: 'medium' },
  { id: 'blue-circle', emoji: '🔵', name: 'Blue Circle', color: 'blue', type: 'shape', size: 'medium' },
];

// Pictograph themes
const pictographThemes = [
  {
    title: 'Favorite Fruits',
    categories: [
      { name: 'Apples', emoji: '🍎' },
      { name: 'Bananas', emoji: '🍌' },
      { name: 'Oranges', emoji: '🍊' },
      { name: 'Grapes', emoji: '🍇' },
    ],
  },
  {
    title: 'Pets We Have',
    categories: [
      { name: 'Dogs', emoji: '🐕' },
      { name: 'Cats', emoji: '🐈' },
      { name: 'Fish', emoji: '🐟' },
      { name: 'Birds', emoji: '🐦' },
    ],
  },
  {
    title: 'Favorite Colors',
    categories: [
      { name: 'Red', emoji: '❤️' },
      { name: 'Blue', emoji: '💙' },
      { name: 'Green', emoji: '💚' },
      { name: 'Yellow', emoji: '💛' },
    ],
  },
  {
    title: 'Toys We Like',
    categories: [
      { name: 'Balls', emoji: '⚽' },
      { name: 'Cars', emoji: '🚗' },
      { name: 'Dolls', emoji: '🪆' },
      { name: 'Blocks', emoji: '🧱' },
    ],
  },
  {
    title: 'Animals at the Zoo',
    categories: [
      { name: 'Lions', emoji: '🦁' },
      { name: 'Elephants', emoji: '🐘' },
      { name: 'Monkeys', emoji: '🐒' },
      { name: 'Giraffes', emoji: '🦒' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// DIFFICULTY CONFIG
// ─────────────────────────────────────────────────────────────

const difficultyConfig: Record<Difficulty, { types: ActivityType[]; rounds: number; maxCount: number }> = {
  easy: {
    types: ['count-objects', 'sort-objects', 'make-tally', 'read-tally'],
    rounds: 10,
    maxCount: 5,
  },
  medium: {
    types: ['count-objects', 'sort-objects', 'make-tally', 'read-tally', 'read-pictograph', 'compare-data'],
    rounds: 15,
    maxCount: 8,
  },
  hard: {
    types: ['count-objects', 'sort-objects', 'make-tally', 'read-tally', 'read-pictograph', 'compare-data', 'data-question', 'build-pictograph'],
    rounds: 20,
    maxCount: 10,
  },
};

// ─────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function pickRandom<T>(array: T[], count: number): T[] {
  return shuffleArray(array).slice(0, count);
}

// ─────────────────────────────────────────────────────────────
// QUESTION GENERATORS
// ─────────────────────────────────────────────────────────────

function generateCountObjectsQuestion(maxCount: number): CountObjectsQuestion {
  const obj = countableObjects[Math.floor(Math.random() * countableObjects.length)];
  const count = Math.floor(Math.random() * (maxCount - 2)) + 3; // 3 to maxCount
  
  const distractors = new Set<number>();
  distractors.add(count);
  while (distractors.size < 4) {
    const d = count + Math.floor(Math.random() * 5) - 2;
    if (d > 0 && d <= 12) distractors.add(d);
  }
  
  const instructions = [
    `Count the ${obj.name}!`,
    `How many ${obj.name} are there?`,
    `Find all the ${obj.name} and count!`,
  ];
  
  return {
    type: 'count-objects',
    instruction: instructions[Math.floor(Math.random() * instructions.length)],
    objectEmoji: obj.emoji,
    objectName: obj.name,
    count,
    options: shuffleArray([...distractors]),
    correctAnswer: count,
  };
}

function generateSortObjectsQuestion(): SortObjectsQuestion {
  // Pick sort type
  const sortTypes: Array<{ by: 'color' | 'type'; values: string[] }> = [
    { by: 'color', values: ['red', 'yellow', 'green', 'orange'] },
    { by: 'type', values: ['fruit', 'vegetable', 'animal'] },
  ];
  
  const sortType = sortTypes[Math.floor(Math.random() * sortTypes.length)];
  const targetValue = sortType.values[Math.floor(Math.random() * sortType.values.length)];
  
  // Get matching and non-matching objects
  const matching = sortableObjects.filter(o => o[sortType.by] === targetValue);
  const nonMatching = sortableObjects.filter(o => o[sortType.by] !== targetValue);
  
  // Pick 2-3 matching and 3-4 non-matching
  const pickedMatching = pickRandom(matching, Math.min(3, matching.length));
  const pickedNonMatching = pickRandom(nonMatching, 4);
  
  const allObjects = shuffleArray([...pickedMatching, ...pickedNonMatching]);
  
  const colorInstructions = [
    `Drag all the ${targetValue.toUpperCase()} things to the basket!`,
    `Find all ${targetValue.toUpperCase()} items!`,
    `Put the ${targetValue.toUpperCase()} ones in the basket!`,
  ];
  
  const typeInstructions = [
    `Drag all the ${targetValue.toUpperCase()}S to the basket!`,
    `Find all the ${targetValue.toUpperCase()}S!`,
    `Put only ${targetValue.toUpperCase()}S in the basket!`,
  ];
  
  const instructions = sortType.by === 'color' ? colorInstructions : typeInstructions;
  
  return {
    type: 'sort-objects',
    instruction: instructions[Math.floor(Math.random() * instructions.length)],
    sortBy: sortType.by,
    targetAttribute: targetValue,
    objects: allObjects,
    correctObjectIds: pickedMatching.map(o => o.id),
  };
}

function generateMakeTallyQuestion(maxCount: number): MakeTallyQuestion {
  const obj = countableObjects[Math.floor(Math.random() * countableObjects.length)];
  const targetNumber = Math.floor(Math.random() * (maxCount - 1)) + 2; // 2 to maxCount
  
  const instructions = [
    `Make tally marks for ${targetNumber}!`,
    `Show ${targetNumber} using tally marks!`,
    `Draw tally marks for ${targetNumber} ${obj.name}!`,
  ];
  
  return {
    type: 'make-tally',
    instruction: instructions[Math.floor(Math.random() * instructions.length)],
    targetNumber,
    objectEmoji: obj.emoji,
    objectName: obj.name,
  };
}

function generateReadTallyQuestion(maxCount: number): ReadTallyQuestion {
  const tallyCount = Math.floor(Math.random() * (maxCount - 1)) + 2; // 2 to maxCount
  
  const distractors = new Set<number>();
  distractors.add(tallyCount);
  while (distractors.size < 4) {
    const d = tallyCount + Math.floor(Math.random() * 5) - 2;
    if (d > 0 && d <= 12) distractors.add(d);
  }
  
  const instructions = [
    'How many does this tally show?',
    'Count the tally marks!',
    'What number is this?',
  ];
  
  return {
    type: 'read-tally',
    instruction: instructions[Math.floor(Math.random() * instructions.length)],
    tallyCount,
    options: shuffleArray([...distractors]),
    correctAnswer: tallyCount,
  };
}

function generateReadPictographQuestion(): ReadPictographQuestion {
  const theme = pictographThemes[Math.floor(Math.random() * pictographThemes.length)];
  
  // Generate random counts for each category (1-6)
  const data: PictographRow[] = theme.categories.map(cat => ({
    category: cat.name,
    emoji: cat.emoji,
    count: Math.floor(Math.random() * 5) + 1, // 1-5
  }));
  
  // Ensure at least one clear max/min
  const maxIdx = Math.floor(Math.random() * data.length);
  data[maxIdx].count = 6;
  
  let minIdx = Math.floor(Math.random() * data.length);
  while (minIdx === maxIdx) minIdx = Math.floor(Math.random() * data.length);
  data[minIdx].count = 1;
  
  // Question type
  const questionTypes: Array<'most' | 'least' | 'count'> = ['most', 'least', 'count'];
  const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
  
  let instruction: string;
  let correctAnswer: string;
  let options: string[];
  let targetCategory: string | undefined;
  
  if (questionType === 'most') {
    instruction = `Which has the MOST in "${theme.title}"?`;
    correctAnswer = data[maxIdx].category;
    options = shuffleArray(data.map(d => d.category));
  } else if (questionType === 'least') {
    instruction = `Which has the LEAST in "${theme.title}"?`;
    correctAnswer = data[minIdx].category;
    options = shuffleArray(data.map(d => d.category));
  } else {
    // count type
    const targetIdx = Math.floor(Math.random() * data.length);
    targetCategory = data[targetIdx].category;
    instruction = `How many ${data[targetIdx].emoji} ${targetCategory}?`;
    correctAnswer = data[targetIdx].count.toString();
    const countOptions = new Set<string>();
    countOptions.add(correctAnswer);
    while (countOptions.size < 4) {
      const d = parseInt(correctAnswer) + Math.floor(Math.random() * 5) - 2;
      if (d > 0 && d <= 8) countOptions.add(d.toString());
    }
    options = shuffleArray([...countOptions]);
  }
  
  return {
    type: 'read-pictograph',
    instruction,
    questionType,
    title: theme.title,
    data,
    correctAnswer,
    options,
    targetCategory,
  };
}

function generateCompareDataQuestion(): CompareDataQuestion {
  const objects = pickRandom(countableObjects, 2);
  const count1 = Math.floor(Math.random() * 5) + 2; // 2-6
  let count2 = Math.floor(Math.random() * 5) + 2;
  while (count2 === count1) count2 = Math.floor(Math.random() * 5) + 2;
  
  const item1 = { name: objects[0].name, emoji: objects[0].emoji, count: count1 };
  const item2 = { name: objects[1].name, emoji: objects[1].emoji, count: count2 };
  
  const isMore = Math.random() > 0.5;
  
  const moreInstructions = [
    `Which group has MORE?`,
    `Are there more ${item1.name} or ${item2.name}?`,
    `Which has a BIGGER number?`,
  ];
  
  const lessInstructions = [
    `Which group has LESS?`,
    `Which has FEWER?`,
    `Which has a SMALLER number?`,
  ];
  
  const instruction = isMore 
    ? moreInstructions[Math.floor(Math.random() * moreInstructions.length)]
    : lessInstructions[Math.floor(Math.random() * lessInstructions.length)];
  
  const correctAnswer = isMore
    ? (count1 > count2 ? item1.name : item2.name)
    : (count1 < count2 ? item1.name : item2.name);
  
  return {
    type: 'compare-data',
    instruction,
    item1,
    item2,
    questionType: isMore ? 'more' : 'less',
    correctAnswer,
    options: shuffleArray([item1.name, item2.name]),
  };
}

function generateDataQuestionQuestion(): DataQuestionQuestion {
  const theme = pictographThemes[Math.floor(Math.random() * pictographThemes.length)];
  
  const data: PictographRow[] = theme.categories.slice(0, 3).map(cat => ({
    category: cat.name,
    emoji: cat.emoji,
    count: Math.floor(Math.random() * 4) + 2, // 2-5
  }));
  
  const targetIdx = Math.floor(Math.random() * data.length);
  const targetCategory = data[targetIdx].category;
  const correctAnswer = data[targetIdx].count;
  
  const scenario = `In a class survey about "${theme.title}": ${data.map(d => `${d.count} chose ${d.category}`).join(', ')}.`;
  
  const distractors = new Set<number>();
  distractors.add(correctAnswer);
  while (distractors.size < 4) {
    const d = correctAnswer + Math.floor(Math.random() * 5) - 2;
    if (d > 0 && d <= 8) distractors.add(d);
  }
  
  return {
    type: 'data-question',
    instruction: `How many chose ${targetCategory}?`,
    scenario,
    data,
    targetCategory,
    options: shuffleArray([...distractors]),
    correctAnswer,
  };
}

function generateBuildPictographQuestion(): BuildPictographQuestion {
  const obj = countableObjects[Math.floor(Math.random() * countableObjects.length)];
  const targetCount = Math.floor(Math.random() * 4) + 2; // 2-5
  
  const instructions = [
    `Add ${targetCount} ${obj.emoji} to the chart!`,
    `Show ${targetCount} ${obj.name} in the pictograph!`,
    `Build: ${targetCount} ${obj.name}!`,
  ];
  
  return {
    type: 'build-pictograph',
    instruction: instructions[Math.floor(Math.random() * instructions.length)],
    category: obj.name,
    emoji: obj.emoji,
    targetCount,
  };
}

function generateQuestion(type: ActivityType, maxCount: number): Question {
  switch (type) {
    case 'count-objects':
      return generateCountObjectsQuestion(maxCount);
    case 'sort-objects':
      return generateSortObjectsQuestion();
    case 'make-tally':
      return generateMakeTallyQuestion(maxCount);
    case 'read-tally':
      return generateReadTallyQuestion(maxCount);
    case 'read-pictograph':
      return generateReadPictographQuestion();
    case 'compare-data':
      return generateCompareDataQuestion();
    case 'data-question':
      return generateDataQuestionQuestion();
    case 'build-pictograph':
      return generateBuildPictographQuestion();
    default:
      return generateCountObjectsQuestion(maxCount);
  }
}

// ─────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────

interface DataDetectiveState {
  // Game state
  phase: GamePhase;
  difficulty: Difficulty;
  round: number;
  totalRounds: number;
  score: number;
  streak: number;
  
  // Current question
  currentQuestion: Question | null;
  selectedAnswer: string | number | null;
  selectedObjects: string[]; // For sorting
  tallyCount: number; // For make-tally
  pictographBuilt: number; // For build-pictograph
  isCorrect: boolean | null;
  attempts: number;
  roundStartTime: number;
  
  // Telemetry
  telemetry: RoundTelemetry[];
  
  // Actions
  setPhase: (phase: GamePhase) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  startGame: () => void;
  nextRound: () => void;
  selectAnswer: (answer: string | number) => void;
  toggleObjectSelection: (objectId: string) => void;
  addTallyMark: () => void;
  removeTallyMark: () => void;
  addToPictograph: () => void;
  removeFromPictograph: () => void;
  submitAnswer: () => void;
  reset: () => void;
}

export const useDataDetectiveStore = create<DataDetectiveState>((set, get) => ({
  // Initial state
  phase: 'welcome',
  difficulty: 'easy',
  round: 0,
  totalRounds: 10,
  score: 0,
  streak: 0,
  
  currentQuestion: null,
  selectedAnswer: null,
  selectedObjects: [],
  tallyCount: 0,
  pictographBuilt: 0,
  isCorrect: null,
  attempts: 0,
  roundStartTime: Date.now(),
  
  telemetry: [],
  
  // Actions
  setPhase: (phase) => set({ phase }),
  
  setDifficulty: (difficulty) => {
    const config = difficultyConfig[difficulty];
    set({ 
      difficulty, 
      totalRounds: config.rounds,
      phase: 'playing',
    });
    get().startGame();
  },
  
  startGame: () => {
    const { difficulty } = get();
    const config = difficultyConfig[difficulty];
    const type = config.types[Math.floor(Math.random() * config.types.length)];
    const question = generateQuestion(type, config.maxCount);
    
    set({
      round: 1,
      score: 0,
      streak: 0,
      currentQuestion: question,
      selectedAnswer: null,
      selectedObjects: [],
      tallyCount: 0,
      pictographBuilt: 0,
      isCorrect: null,
      attempts: 0,
      roundStartTime: Date.now(),
      telemetry: [],
      phase: 'playing',
    });
  },
  
  nextRound: () => {
    const { round, totalRounds, difficulty } = get();
    
    if (round >= totalRounds) {
      set({ phase: 'celebration' });
      return;
    }
    
    const config = difficultyConfig[difficulty];
    const type = config.types[Math.floor(Math.random() * config.types.length)];
    const question = generateQuestion(type, config.maxCount);
    
    set({
      round: round + 1,
      currentQuestion: question,
      selectedAnswer: null,
      selectedObjects: [],
      tallyCount: 0,
      pictographBuilt: 0,
      isCorrect: null,
      attempts: 0,
      roundStartTime: Date.now(),
      phase: 'playing',
    });
  },
  
  selectAnswer: (answer) => set({ selectedAnswer: answer }),
  
  toggleObjectSelection: (objectId) => {
    const { selectedObjects } = get();
    if (selectedObjects.includes(objectId)) {
      set({ selectedObjects: selectedObjects.filter(id => id !== objectId) });
    } else {
      set({ selectedObjects: [...selectedObjects, objectId] });
    }
  },
  
  addTallyMark: () => {
    const { tallyCount } = get();
    if (tallyCount < 12) {
      set({ tallyCount: tallyCount + 1 });
    }
  },
  
  removeTallyMark: () => {
    const { tallyCount } = get();
    if (tallyCount > 0) {
      set({ tallyCount: tallyCount - 1 });
    }
  },
  
  addToPictograph: () => {
    const { pictographBuilt } = get();
    if (pictographBuilt < 10) {
      set({ pictographBuilt: pictographBuilt + 1 });
    }
  },
  
  removeFromPictograph: () => {
    const { pictographBuilt } = get();
    if (pictographBuilt > 0) {
      set({ pictographBuilt: pictographBuilt - 1 });
    }
  },
  
  submitAnswer: () => {
    const { 
      currentQuestion, 
      selectedAnswer, 
      selectedObjects,
      tallyCount,
      pictographBuilt,
      round, 
      score, 
      streak, 
      attempts,
      roundStartTime,
      telemetry,
    } = get();
    
    if (!currentQuestion) return;
    
    let isCorrect = false;
    let playerAnswer: string | number | string[] = '';
    let correctAnswer: string | number | string[] = '';
    
    switch (currentQuestion.type) {
      case 'count-objects':
      case 'read-tally':
      case 'data-question':
        isCorrect = selectedAnswer === currentQuestion.correctAnswer;
        playerAnswer = selectedAnswer ?? '';
        correctAnswer = currentQuestion.correctAnswer;
        break;
        
      case 'sort-objects':
        const sortedCorrectly = 
          selectedObjects.length === currentQuestion.correctObjectIds.length &&
          selectedObjects.every(id => currentQuestion.correctObjectIds.includes(id));
        isCorrect = sortedCorrectly;
        playerAnswer = selectedObjects;
        correctAnswer = currentQuestion.correctObjectIds;
        break;
        
      case 'make-tally':
        isCorrect = tallyCount === currentQuestion.targetNumber;
        playerAnswer = tallyCount;
        correctAnswer = currentQuestion.targetNumber;
        break;
        
      case 'read-pictograph':
      case 'compare-data':
        isCorrect = selectedAnswer === currentQuestion.correctAnswer;
        playerAnswer = selectedAnswer ?? '';
        correctAnswer = currentQuestion.correctAnswer;
        break;
        
      case 'build-pictograph':
        isCorrect = pictographBuilt === currentQuestion.targetCount;
        playerAnswer = pictographBuilt;
        correctAnswer = currentQuestion.targetCount;
        break;
    }
    
    const timeSpent = Date.now() - roundStartTime;
    const newAttempts = attempts + 1;
    
    // Log telemetry
    const roundTelemetry: RoundTelemetry = {
      roundNumber: round,
      activityType: currentQuestion.type,
      question: currentQuestion.instruction,
      correctAnswer,
      playerAnswer,
      isCorrect,
      attempts: newAttempts,
      timeSpentMs: timeSpent,
      timestamp: new Date().toISOString(),
    };
    
    console.log('📊 Round Telemetry:', roundTelemetry);
    
    if (isCorrect) {
      const bonusPoints = streak >= 2 ? 5 : 0;
      set({
        isCorrect: true,
        score: score + 10 + bonusPoints,
        streak: streak + 1,
        attempts: newAttempts,
        telemetry: [...telemetry, roundTelemetry],
        phase: 'feedback',
      });
    } else {
      if (newAttempts >= 2) {
        set({
          isCorrect: false,
          streak: 0,
          attempts: newAttempts,
          telemetry: [...telemetry, roundTelemetry],
          phase: 'feedback',
        });
      } else {
        set({ attempts: newAttempts });
      }
    }
  },
  
  reset: () => set({
    phase: 'welcome',
    difficulty: 'easy',
    round: 0,
    totalRounds: 10,
    score: 0,
    streak: 0,
    currentQuestion: null,
    selectedAnswer: null,
    selectedObjects: [],
    tallyCount: 0,
    pictographBuilt: 0,
    isCorrect: null,
    attempts: 0,
    telemetry: [],
  }),
}));
