'use client';

import { create } from 'zustand';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type Difficulty = 'easy' | 'medium' | 'hard';

export type ActivityType =
  | 'count-objects'      // Count objects in collection
  | 'sort-objects'       // Tap all items of a color/type
  | 'compare-groups'     // Which group has more/less
  | 'read-tally'         // Read tally marks
  | 'read-pictograph';   // Read simple pictograph

export type GamePhase = 'welcome' | 'difficulty' | 'playing' | 'celebration';

// Item in display area
export interface DisplayItem {
  id: string;
  emoji: string;
  color: string;
  type: string;
  x: number;
  y: number;
  selected?: boolean;
}

// Pictograph row
export interface PictographRow {
  category: string;
  emoji: string;
  count: number;
}

// Count objects question
export interface CountObjectsQuestion {
  type: 'count-objects';
  instruction: string;
  targetEmoji: string;
  targetName: string;
  displayItems: DisplayItem[];
  correctCount: number;
  options: number[];
}

// Sort/tap objects question
export interface SortObjectsQuestion {
  type: 'sort-objects';
  instruction: string;
  targetColor: string;
  displayItems: DisplayItem[];
  correctIds: string[];
}

// Compare groups question
export interface CompareGroupsQuestion {
  type: 'compare-groups';
  instruction: string;
  questionType: 'more' | 'less';
  group1: { emoji: string; name: string; count: number };
  group2: { emoji: string; name: string; count: number };
  correctAnswer: 'group1' | 'group2';
}

// Read tally question
export interface ReadTallyQuestion {
  type: 'read-tally';
  instruction: string;
  tallyCount: number;
  options: number[];
}

// Read pictograph question
export interface ReadPictographQuestion {
  type: 'read-pictograph';
  instruction: string;
  title: string;
  data: PictographRow[];
  targetCategory: string;
  correctCount: number;
  options: number[];
}

export type Question =
  | CountObjectsQuestion
  | SortObjectsQuestion
  | CompareGroupsQuestion
  | ReadTallyQuestion
  | ReadPictographQuestion;

// Telemetry
export interface RoundTelemetry {
  roundNumber: number;
  activityType: ActivityType;
  question: string;
  correctAnswer: string | number | string[];
  playerAnswer: string | number | string[];
  isCorrect: boolean;
  wrongAttempts: number;
  pointsEarned: number;
  timeSpentMs: number;
  timestamp: string;
}

// ─────────────────────────────────────────────────────────────
// OBJECT POOLS
// ─────────────────────────────────────────────────────────────

const countableObjects = [
  { emoji: '🍎', name: 'apples', color: 'red' },
  { emoji: '🍌', name: 'bananas', color: 'yellow' },
  { emoji: '🍊', name: 'oranges', color: 'orange' },
  { emoji: '🍇', name: 'grapes', color: 'purple' },
  { emoji: '🐟', name: 'fish', color: 'blue' },
  { emoji: '🦋', name: 'butterflies', color: 'blue' },
  { emoji: '⭐', name: 'stars', color: 'yellow' },
  { emoji: '🌸', name: 'flowers', color: 'pink' },
  { emoji: '🐦', name: 'birds', color: 'brown' },
  { emoji: '🎈', name: 'balloons', color: 'red' },
];

const colorItems: Record<string, { emoji: string; name: string }[]> = {
  red: [
    { emoji: '🍎', name: 'apple' },
    { emoji: '🍓', name: 'strawberry' },
    { emoji: '🌹', name: 'rose' },
    { emoji: '❤️', name: 'heart' },
    { emoji: '🎈', name: 'balloon' },
  ],
  yellow: [
    { emoji: '🍌', name: 'banana' },
    { emoji: '⭐', name: 'star' },
    { emoji: '🌻', name: 'sunflower' },
    { emoji: '🍋', name: 'lemon' },
    { emoji: '🌽', name: 'corn' },
  ],
  blue: [
    { emoji: '🐟', name: 'fish' },
    { emoji: '🦋', name: 'butterfly' },
    { emoji: '💙', name: 'blue heart' },
    { emoji: '🫐', name: 'blueberry' },
    { emoji: '🐳', name: 'whale' },
  ],
  green: [
    { emoji: '🥒', name: 'cucumber' },
    { emoji: '🥦', name: 'broccoli' },
    { emoji: '🐸', name: 'frog' },
    { emoji: '🌿', name: 'leaf' },
    { emoji: '🥬', name: 'lettuce' },
  ],
  orange: [
    { emoji: '🍊', name: 'orange' },
    { emoji: '🥕', name: 'carrot' },
    { emoji: '🧡', name: 'orange heart' },
    { emoji: '🎃', name: 'pumpkin' },
    { emoji: '🏀', name: 'basketball' },
  ],
};

const pictographThemes = [
  {
    title: 'Favorite Fruits',
    categories: [
      { name: 'Apples', emoji: '🍎' },
      { name: 'Bananas', emoji: '🍌' },
      { name: 'Oranges', emoji: '🍊' },
    ],
  },
  {
    title: 'Pets We Love',
    categories: [
      { name: 'Dogs', emoji: '🐕' },
      { name: 'Cats', emoji: '🐱' },
      { name: 'Fish', emoji: '🐟' },
    ],
  },
  {
    title: 'Favorite Toys',
    categories: [
      { name: 'Balls', emoji: '⚽' },
      { name: 'Cars', emoji: '🚗' },
      { name: 'Dolls', emoji: '🧸' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// DIFFICULTY CONFIG
// ─────────────────────────────────────────────────────────────

const difficultyConfig: Record<Difficulty, { types: ActivityType[]; rounds: number; maxCount: number }> = {
  easy: {
    types: ['count-objects', 'sort-objects', 'compare-groups'],
    rounds: 10,
    maxCount: 5,
  },
  medium: {
    types: ['count-objects', 'sort-objects', 'compare-groups', 'read-tally', 'read-pictograph'],
    rounds: 12,
    maxCount: 7,
  },
  hard: {
    types: ['count-objects', 'sort-objects', 'compare-groups', 'read-tally', 'read-pictograph'],
    rounds: 15,
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

function generateDistractors(correct: number, count: number, max: number): number[] {
  const options = new Set<number>();
  options.add(correct);
  while (options.size < count) {
    const d = Math.max(1, correct + Math.floor(Math.random() * 5) - 2);
    if (d <= max && d > 0) options.add(d);
  }
  return shuffleArray([...options]);
}

// ─────────────────────────────────────────────────────────────
// QUESTION GENERATORS
// ─────────────────────────────────────────────────────────────

function generateCountObjectsQuestion(maxCount: number): CountObjectsQuestion {
  const targetObj = countableObjects[Math.floor(Math.random() * countableObjects.length)];
  const count = Math.floor(Math.random() * (maxCount - 2)) + 3; // 3 to maxCount
  
  // Create display items - mix of target and distractors
  const displayItems: DisplayItem[] = [];
  
  // Add target items
  for (let i = 0; i < count; i++) {
    displayItems.push({
      id: `target-${i}`,
      emoji: targetObj.emoji,
      color: targetObj.color,
      type: 'target',
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 15,
    });
  }
  
  // Add some distractor items (different emoji)
  const distractors = countableObjects.filter(o => o.emoji !== targetObj.emoji);
  const numDistractors = Math.floor(Math.random() * 3) + 2;
  for (let i = 0; i < numDistractors; i++) {
    const distractor = distractors[Math.floor(Math.random() * distractors.length)];
    displayItems.push({
      id: `distractor-${i}`,
      emoji: distractor.emoji,
      color: distractor.color,
      type: 'distractor',
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 15,
    });
  }
  
  const instructions = [
    `How many ${targetObj.emoji} ${targetObj.name}?`,
    `Count the ${targetObj.emoji}!`,
    `Find all ${targetObj.emoji} and count!`,
  ];
  
  return {
    type: 'count-objects',
    instruction: instructions[Math.floor(Math.random() * instructions.length)],
    targetEmoji: targetObj.emoji,
    targetName: targetObj.name,
    displayItems: shuffleArray(displayItems),
    correctCount: count,
    options: generateDistractors(count, 4, maxCount + 2),
  };
}

function generateSortObjectsQuestion(): SortObjectsQuestion {
  const colors = ['red', 'yellow', 'blue', 'green', 'orange'];
  const targetColor = colors[Math.floor(Math.random() * colors.length)];
  const otherColors = colors.filter(c => c !== targetColor);
  
  const displayItems: DisplayItem[] = [];
  const correctIds: string[] = [];
  
  // Add 3-4 target color items
  const targetItems = pickRandom(colorItems[targetColor], Math.floor(Math.random() * 2) + 3);
  targetItems.forEach((item, i) => {
    const id = `${targetColor}-${i}`;
    displayItems.push({
      id,
      emoji: item.emoji,
      color: targetColor,
      type: 'target',
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 15,
    });
    correctIds.push(id);
  });
  
  // Add distractor items from other colors
  otherColors.slice(0, 2).forEach((color, colorIdx) => {
    const items = pickRandom(colorItems[color], 2);
    items.forEach((item, i) => {
      displayItems.push({
        id: `${color}-${colorIdx}-${i}`,
        emoji: item.emoji,
        color,
        type: 'distractor',
        x: Math.random() * 80 + 10,
        y: Math.random() * 70 + 15,
      });
    });
  });
  
  const colorEmojis: Record<string, string> = {
    red: '🔴',
    yellow: '🟡',
    blue: '🔵',
    green: '🟢',
    orange: '🟠',
  };
  
  return {
    type: 'sort-objects',
    instruction: `Tap all ${colorEmojis[targetColor]} ${targetColor.toUpperCase()} items!`,
    targetColor,
    displayItems: shuffleArray(displayItems),
    correctIds,
  };
}

function generateCompareGroupsQuestion(maxCount: number): CompareGroupsQuestion {
  const objects = pickRandom(countableObjects, 2);
  
  let count1 = Math.floor(Math.random() * (maxCount - 2)) + 2;
  let count2 = Math.floor(Math.random() * (maxCount - 2)) + 2;
  
  // Ensure they're different
  while (count1 === count2) {
    count2 = Math.floor(Math.random() * (maxCount - 2)) + 2;
  }
  
  const questionType = Math.random() > 0.5 ? 'more' : 'less';
  const correctAnswer = questionType === 'more' 
    ? (count1 > count2 ? 'group1' : 'group2')
    : (count1 < count2 ? 'group1' : 'group2');
  
  const instructions = questionType === 'more'
    ? [`Which has MORE?`, `Tap the BIGGER group!`, `Which group is BIGGER?`]
    : [`Which has LESS?`, `Tap the SMALLER group!`, `Which group is SMALLER?`];
  
  return {
    type: 'compare-groups',
    instruction: instructions[Math.floor(Math.random() * instructions.length)],
    questionType,
    group1: { emoji: objects[0].emoji, name: objects[0].name, count: count1 },
    group2: { emoji: objects[1].emoji, name: objects[1].name, count: count2 },
    correctAnswer,
  };
}

function generateReadTallyQuestion(maxCount: number): ReadTallyQuestion {
  const tallyCount = Math.floor(Math.random() * (maxCount - 2)) + 3;
  
  return {
    type: 'read-tally',
    instruction: 'How many tally marks?',
    tallyCount,
    options: generateDistractors(tallyCount, 4, maxCount + 2),
  };
}

function generateReadPictographQuestion(maxCount: number): ReadPictographQuestion {
  const theme = pictographThemes[Math.floor(Math.random() * pictographThemes.length)];
  
  const data: PictographRow[] = theme.categories.map(cat => ({
    category: cat.name,
    emoji: cat.emoji,
    count: Math.floor(Math.random() * Math.min(5, maxCount - 1)) + 1,
  }));
  
  const targetIdx = Math.floor(Math.random() * data.length);
  const targetCategory = data[targetIdx].category;
  const correctCount = data[targetIdx].count;
  
  return {
    type: 'read-pictograph',
    instruction: `How many ${data[targetIdx].emoji} ${targetCategory}?`,
    title: theme.title,
    data,
    targetCategory,
    correctCount,
    options: generateDistractors(correctCount, 4, Math.max(6, maxCount)),
  };
}

function generateQuestion(type: ActivityType, maxCount: number): Question {
  switch (type) {
    case 'count-objects':
      return generateCountObjectsQuestion(maxCount);
    case 'sort-objects':
      return generateSortObjectsQuestion();
    case 'compare-groups':
      return generateCompareGroupsQuestion(maxCount);
    case 'read-tally':
      return generateReadTallyQuestion(maxCount);
    case 'read-pictograph':
      return generateReadPictographQuestion(maxCount);
    default:
      return generateCountObjectsQuestion(maxCount);
  }
}

// ─────────────────────────────────────────────────────────────
// STORE INTERFACE
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
  currentPoints: number; // Points available for this question (starts at 10)
  wrongAttempts: number;
  selectedItems: string[]; // For sort questions
  isShowingFeedback: boolean;
  feedbackType: 'correct' | 'wrong' | null;
  roundStartTime: number;
  
  // Telemetry
  telemetry: RoundTelemetry[];
  
  // Actions
  setPhase: (phase: GamePhase) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  startGame: () => void;
  nextRound: () => void;
  tapAnswer: (answer: number | string) => void; // For count/tally/pictograph
  tapGroup: (group: 'group1' | 'group2') => void; // For compare questions
  tapItem: (itemId: string) => void; // For sort questions
  checkSortComplete: () => void; // Check if all items tapped
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
  currentPoints: 10,
  wrongAttempts: 0,
  selectedItems: [],
  isShowingFeedback: false,
  feedbackType: null,
  roundStartTime: Date.now(),
  
  telemetry: [],
  
  // Actions
  setPhase: (phase) => set({ phase }),
  
  setDifficulty: (difficulty) => {
    const config = difficultyConfig[difficulty];
    set({ 
      difficulty, 
      totalRounds: config.rounds,
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
      currentPoints: 10,
      wrongAttempts: 0,
      selectedItems: [],
      isShowingFeedback: false,
      feedbackType: null,
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
      currentPoints: 10,
      wrongAttempts: 0,
      selectedItems: [],
      isShowingFeedback: false,
      feedbackType: null,
      roundStartTime: Date.now(),
    });
  },
  
  tapAnswer: (answer) => {
    const { currentQuestion, currentPoints, wrongAttempts, score, streak, round, roundStartTime, telemetry } = get();
    if (!currentQuestion || get().isShowingFeedback) return;
    
    let isCorrect = false;
    let correctAnswer: number = 0;
    
    if (currentQuestion.type === 'count-objects') {
      correctAnswer = currentQuestion.correctCount;
      isCorrect = answer === correctAnswer;
    } else if (currentQuestion.type === 'read-tally') {
      correctAnswer = currentQuestion.tallyCount;
      isCorrect = answer === correctAnswer;
    } else if (currentQuestion.type === 'read-pictograph') {
      correctAnswer = currentQuestion.correctCount;
      isCorrect = answer === correctAnswer;
    }
    
    const timeSpent = Date.now() - roundStartTime;
    
    if (isCorrect) {
      const pointsEarned = currentPoints;
      const newStreak = streak + 1;
      const bonusPoints = newStreak >= 3 ? 5 : 0;
      
      const roundTelemetry: RoundTelemetry = {
        roundNumber: round,
        activityType: currentQuestion.type,
        question: currentQuestion.instruction,
        correctAnswer,
        playerAnswer: answer,
        isCorrect: true,
        wrongAttempts,
        pointsEarned: pointsEarned + bonusPoints,
        timeSpentMs: timeSpent,
        timestamp: new Date().toISOString(),
      };
      
      set({
        isShowingFeedback: true,
        feedbackType: 'correct',
        score: score + pointsEarned + bonusPoints,
        streak: newStreak,
        telemetry: [...telemetry, roundTelemetry],
      });
      
      // Auto advance after delay
      setTimeout(() => {
        get().nextRound();
      }, 1500);
    } else {
      const newPoints = Math.max(1, currentPoints - 3);
      set({
        isShowingFeedback: true,
        feedbackType: 'wrong',
        currentPoints: newPoints,
        wrongAttempts: wrongAttempts + 1,
        streak: 0,
      });
      
      // Hide feedback after short delay
      setTimeout(() => {
        set({ isShowingFeedback: false, feedbackType: null });
      }, 800);
    }
  },
  
  tapGroup: (group) => {
    const { currentQuestion, currentPoints, wrongAttempts, score, streak, round, roundStartTime, telemetry } = get();
    if (!currentQuestion || currentQuestion.type !== 'compare-groups' || get().isShowingFeedback) return;
    
    const isCorrect = group === currentQuestion.correctAnswer;
    const timeSpent = Date.now() - roundStartTime;
    
    if (isCorrect) {
      const pointsEarned = currentPoints;
      const newStreak = streak + 1;
      const bonusPoints = newStreak >= 3 ? 5 : 0;
      
      const roundTelemetry: RoundTelemetry = {
        roundNumber: round,
        activityType: currentQuestion.type,
        question: currentQuestion.instruction,
        correctAnswer: currentQuestion.correctAnswer,
        playerAnswer: group,
        isCorrect: true,
        wrongAttempts,
        pointsEarned: pointsEarned + bonusPoints,
        timeSpentMs: timeSpent,
        timestamp: new Date().toISOString(),
      };
      
      set({
        isShowingFeedback: true,
        feedbackType: 'correct',
        score: score + pointsEarned + bonusPoints,
        streak: newStreak,
        telemetry: [...telemetry, roundTelemetry],
      });
      
      setTimeout(() => {
        get().nextRound();
      }, 1500);
    } else {
      const newPoints = Math.max(1, currentPoints - 3);
      set({
        isShowingFeedback: true,
        feedbackType: 'wrong',
        currentPoints: newPoints,
        wrongAttempts: wrongAttempts + 1,
        streak: 0,
      });
      
      setTimeout(() => {
        set({ isShowingFeedback: false, feedbackType: null });
      }, 800);
    }
  },
  
  tapItem: (itemId) => {
    const { currentQuestion, selectedItems, currentPoints, wrongAttempts, streak } = get();
    if (!currentQuestion || currentQuestion.type !== 'sort-objects' || get().isShowingFeedback) return;
    
    // Check if item is already selected
    if (selectedItems.includes(itemId)) return;
    
    // Check if it's a correct item
    const isCorrectItem = currentQuestion.correctIds.includes(itemId);
    
    if (isCorrectItem) {
      const newSelected = [...selectedItems, itemId];
      set({ selectedItems: newSelected });
      
      // Check if all correct items are selected
      if (newSelected.length === currentQuestion.correctIds.length) {
        get().checkSortComplete();
      }
    } else {
      // Wrong tap
      const newPoints = Math.max(1, currentPoints - 3);
      set({
        isShowingFeedback: true,
        feedbackType: 'wrong',
        currentPoints: newPoints,
        wrongAttempts: wrongAttempts + 1,
        streak: 0,
      });
      
      setTimeout(() => {
        set({ isShowingFeedback: false, feedbackType: null });
      }, 800);
    }
  },
  
  checkSortComplete: () => {
    const { currentQuestion, selectedItems, currentPoints, wrongAttempts, score, streak, round, roundStartTime, telemetry } = get();
    if (!currentQuestion || currentQuestion.type !== 'sort-objects') return;
    
    const allCorrect = currentQuestion.correctIds.every(id => selectedItems.includes(id));
    
    if (allCorrect) {
      const pointsEarned = currentPoints;
      const newStreak = streak + 1;
      const bonusPoints = newStreak >= 3 ? 5 : 0;
      const timeSpent = Date.now() - roundStartTime;
      
      const roundTelemetry: RoundTelemetry = {
        roundNumber: round,
        activityType: currentQuestion.type,
        question: currentQuestion.instruction,
        correctAnswer: currentQuestion.correctIds,
        playerAnswer: selectedItems,
        isCorrect: true,
        wrongAttempts,
        pointsEarned: pointsEarned + bonusPoints,
        timeSpentMs: timeSpent,
        timestamp: new Date().toISOString(),
      };
      
      set({
        isShowingFeedback: true,
        feedbackType: 'correct',
        score: score + pointsEarned + bonusPoints,
        streak: newStreak,
        telemetry: [...telemetry, roundTelemetry],
      });
      
      setTimeout(() => {
        get().nextRound();
      }, 1500);
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
    currentPoints: 10,
    wrongAttempts: 0,
    selectedItems: [],
    isShowingFeedback: false,
    feedbackType: null,
    telemetry: [],
  }),
}));
