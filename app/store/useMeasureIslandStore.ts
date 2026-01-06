'use client';

import { create } from 'zustand';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type Difficulty = 'easy' | 'medium' | 'hard';

export type ActivityType =
  | 'compare-length'      // Which is longer/shorter?
  | 'compare-height'      // Which is taller/shorter?
  | 'compare-weight'      // Which is heavier/lighter?
  | 'compare-capacity'    // Which holds more/less?
  | 'measure-length'      // Measure using non-standard units
  | 'order-length'        // Order objects by length
  | 'order-weight'        // Order objects by weight
  | 'order-capacity';     // Order objects by capacity

export type GamePhase = 'welcome' | 'difficulty' | 'playing' | 'feedback' | 'celebration';

// Objects that can be measured/compared
export interface MeasurableObject {
  id: string;
  name: string;
  emoji: string;
  value: number; // The actual measurement value (hidden from player)
  displayValue?: number; // For non-standard measurement display
  unit?: string;
}

// Question structure
export interface Question {
  type: ActivityType;
  instruction: string;
  objects: MeasurableObject[];
  correctAnswer: string | string[]; // ID or array of IDs in order
  unit?: string; // e.g., "handspans", "cubes", "cups"
  comparison?: 'longer' | 'shorter' | 'taller' | 'heavier' | 'lighter' | 'more' | 'less';
}

// Telemetry for each round
export interface RoundTelemetry {
  roundNumber: number;
  activityType: ActivityType;
  question: string;
  correctAnswer: string | string[];
  playerAnswer: string | string[];
  isCorrect: boolean;
  attempts: number;
  timeSpentMs: number;
  timestamp: string;
}

// ─────────────────────────────────────────────────────────────
// OBJECT POOLS WITH REALISTIC VALUES
// Objects have FIXED realistic values so children use real-world knowledge
// ─────────────────────────────────────────────────────────────

// Length objects - value represents relative length (1=very short to 10=very long)
const lengthObjects: MeasurableObject[] = [
  { id: 'ant', name: 'Ant', emoji: '🐜', value: 1 },
  { id: 'eraser', name: 'Eraser', emoji: '🧽', value: 2 },
  { id: 'pencil', name: 'Pencil', emoji: '✏️', value: 3 },
  { id: 'banana', name: 'Banana', emoji: '🍌', value: 4 },
  { id: 'ruler', name: 'Ruler', emoji: '📏', value: 5 },
  { id: 'umbrella', name: 'Umbrella', emoji: '☂️', value: 6 },
  { id: 'bat', name: 'Cricket Bat', emoji: '🏏', value: 7 },
  { id: 'rope', name: 'Rope', emoji: '🪢', value: 8 },
  { id: 'snake', name: 'Snake', emoji: '🐍', value: 9 },
  { id: 'train', name: 'Train', emoji: '🚂', value: 10 },
];

// Height objects - value represents relative height (1=very short to 10=very tall)
const heightObjects: MeasurableObject[] = [
  { id: 'ant', name: 'Ant', emoji: '🐜', value: 1 },
  { id: 'cat', name: 'Cat', emoji: '🐈', value: 2 },
  { id: 'dog', name: 'Dog', emoji: '🐕', value: 3 },
  { id: 'child', name: 'Child', emoji: '👧', value: 4 },
  { id: 'adult', name: 'Adult', emoji: '🧑', value: 5 },
  { id: 'elephant', name: 'Elephant', emoji: '🐘', value: 6 },
  { id: 'giraffe', name: 'Giraffe', emoji: '🦒', value: 7 },
  { id: 'tree', name: 'Tree', emoji: '🌳', value: 8 },
  { id: 'house', name: 'House', emoji: '🏠', value: 9 },
  { id: 'building', name: 'Building', emoji: '🏢', value: 10 },
];

// Weight objects - value represents relative weight (1=very light to 10=very heavy)
const weightObjects: MeasurableObject[] = [
  { id: 'feather', name: 'Feather', emoji: '🪶', value: 1 },
  { id: 'balloon', name: 'Balloon', emoji: '🎈', value: 2 },
  { id: 'apple', name: 'Apple', emoji: '🍎', value: 3 },
  { id: 'ball', name: 'Ball', emoji: '⚽', value: 4 },
  { id: 'book', name: 'Book', emoji: '📚', value: 5 },
  { id: 'emptybag', name: 'Empty Bag', emoji: '🎒', value: 6 },
  { id: 'watermelon', name: 'Watermelon', emoji: '🍉', value: 7 },
  { id: 'pumpkin', name: 'Pumpkin', emoji: '🎃', value: 8 },
  { id: 'stone', name: 'Stone', emoji: '🪨', value: 9 },
  { id: 'elephant', name: 'Elephant', emoji: '🐘', value: 10 },
];

// Capacity objects - value represents relative capacity (1=holds least to 10=holds most)
const capacityObjects: MeasurableObject[] = [
  { id: 'spoon', name: 'Spoon', emoji: '🥄', value: 1 },
  { id: 'cup', name: 'Cup', emoji: '☕', value: 2 },
  { id: 'glass', name: 'Glass', emoji: '🥛', value: 3 },
  { id: 'bowl', name: 'Bowl', emoji: '🥣', value: 4 },
  { id: 'bottle', name: 'Bottle', emoji: '🍼', value: 5 },
  { id: 'jug', name: 'Jug', emoji: '🫗', value: 6 },
  { id: 'pot', name: 'Pot', emoji: '🍲', value: 7 },
  { id: 'bucket', name: 'Bucket', emoji: '🪣', value: 8 },
  { id: 'barrel', name: 'Barrel', emoji: '🛢️', value: 9 },
  { id: 'bathtub', name: 'Bathtub', emoji: '🛁', value: 10 },
];

const nonStandardUnits = {
  length: ['handspans', 'footsteps', 'pencils', 'cubes'],
  capacity: ['cups', 'spoons', 'mugs', 'glasses'],
};

// ─────────────────────────────────────────────────────────────
// DIFFICULTY CONFIG
// ─────────────────────────────────────────────────────────────

const difficultyConfig: Record<Difficulty, { types: ActivityType[]; rounds: number }> = {
  easy: {
    types: ['compare-length', 'compare-height', 'compare-weight'],
    rounds: 10,
  },
  medium: {
    types: ['compare-length', 'compare-height', 'compare-weight', 'compare-capacity', 'measure-length'],
    rounds: 15,
  },
  hard: {
    types: ['compare-length', 'compare-height', 'compare-weight', 'compare-capacity', 'measure-length', 'order-length', 'order-weight', 'order-capacity'],
    rounds: 20,
  },
};

// ─────────────────────────────────────────────────────────────
// QUESTION GENERATOR
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

function generateQuestion(type: ActivityType): Question {
  switch (type) {
    case 'compare-length': {
      // Pick 2 objects with DIFFERENT values (ensure they're not equal)
      const shuffled = shuffleArray(lengthObjects);
      const picked: MeasurableObject[] = [];
      for (const obj of shuffled) {
        if (picked.length === 0 || picked[0].value !== obj.value) {
          picked.push(obj);
        }
        if (picked.length === 2) break;
      }
      const isLonger = Math.random() > 0.5;
      // Use the object's REAL fixed value
      const correctId = isLonger 
        ? (picked[0].value > picked[1].value ? picked[0].id : picked[1].id)
        : (picked[0].value < picked[1].value ? picked[0].id : picked[1].id);
      // Child-friendly instructions
      const longerPhrases = ['Which one is LONGER?', 'Tap the LONGER one!', 'Find the LONG one!'];
      const shorterPhrases = ['Which one is SHORTER?', 'Tap the SHORT one!', 'Find the SHORTER one!'];
      const instruction = isLonger 
        ? longerPhrases[Math.floor(Math.random() * longerPhrases.length)]
        : shorterPhrases[Math.floor(Math.random() * shorterPhrases.length)];
      return {
        type,
        instruction,
        objects: shuffleArray(picked),
        correctAnswer: correctId,
        comparison: isLonger ? 'longer' : 'shorter',
      };
    }

    case 'compare-height': {
      // Pick 2 objects with DIFFERENT values
      const shuffled = shuffleArray(heightObjects);
      const picked: MeasurableObject[] = [];
      for (const obj of shuffled) {
        if (picked.length === 0 || picked[0].value !== obj.value) {
          picked.push(obj);
        }
        if (picked.length === 2) break;
      }
      const isTaller = Math.random() > 0.5;
      // Use the object's REAL fixed value
      const correctId = isTaller
        ? (picked[0].value > picked[1].value ? picked[0].id : picked[1].id)
        : (picked[0].value < picked[1].value ? picked[0].id : picked[1].id);
      // Child-friendly instructions
      const tallerPhrases = ['Which one is TALLER?', 'Tap the TALL one!', 'Find the TALLER one!'];
      const shorterPhrases = ['Which one is SHORTER?', 'Tap the SHORT one!', 'Find the SHORTER one!'];
      const instruction = isTaller
        ? tallerPhrases[Math.floor(Math.random() * tallerPhrases.length)]
        : shorterPhrases[Math.floor(Math.random() * shorterPhrases.length)];
      return {
        type,
        instruction,
        objects: shuffleArray(picked),
        correctAnswer: correctId,
        comparison: isTaller ? 'taller' : 'shorter',
      };
    }

    case 'compare-weight': {
      // Pick 2 objects with DIFFERENT values
      const shuffled = shuffleArray(weightObjects);
      const picked: MeasurableObject[] = [];
      for (const obj of shuffled) {
        if (picked.length === 0 || picked[0].value !== obj.value) {
          picked.push(obj);
        }
        if (picked.length === 2) break;
      }
      const isHeavier = Math.random() > 0.5;
      // Use the object's REAL fixed value
      const correctId = isHeavier
        ? (picked[0].value > picked[1].value ? picked[0].id : picked[1].id)
        : (picked[0].value < picked[1].value ? picked[0].id : picked[1].id);
      // Child-friendly instructions
      const heavierPhrases = ['Which one is HEAVIER?', 'Tap the HEAVY one!', 'Find what weighs MORE!'];
      const lighterPhrases = ['Which one is LIGHTER?', 'Tap the LIGHT one!', 'Find what weighs LESS!'];
      const instruction = isHeavier
        ? heavierPhrases[Math.floor(Math.random() * heavierPhrases.length)]
        : lighterPhrases[Math.floor(Math.random() * lighterPhrases.length)];
      return {
        type,
        instruction,
        objects: shuffleArray(picked),
        correctAnswer: correctId,
        comparison: isHeavier ? 'heavier' : 'lighter',
      };
    }

    case 'compare-capacity': {
      // Pick 2 objects with DIFFERENT values
      const shuffled = shuffleArray(capacityObjects);
      const picked: MeasurableObject[] = [];
      for (const obj of shuffled) {
        if (picked.length === 0 || picked[0].value !== obj.value) {
          picked.push(obj);
        }
        if (picked.length === 2) break;
      }
      const isMore = Math.random() > 0.5;
      // Use the object's REAL fixed value
      const correctId = isMore
        ? (picked[0].value > picked[1].value ? picked[0].id : picked[1].id)
        : (picked[0].value < picked[1].value ? picked[0].id : picked[1].id);
      // Child-friendly instructions
      const morePhrases = ['Which can hold MORE?', 'Tap the BIGGER one!', 'Which fills up MORE water?'];
      const lessPhrases = ['Which can hold LESS?', 'Tap the SMALLER one!', 'Which fills up LESS water?'];
      const instruction = isMore
        ? morePhrases[Math.floor(Math.random() * morePhrases.length)]
        : lessPhrases[Math.floor(Math.random() * lessPhrases.length)];
      return {
        type,
        instruction,
        objects: shuffleArray(picked),
        correctAnswer: correctId,
        comparison: isMore ? 'more' : 'less',
      };
    }

    case 'measure-length': {
      const picked = pickRandom(lengthObjects, 1)[0];
      const unit = nonStandardUnits.length[Math.floor(Math.random() * nonStandardUnits.length.length)];
      const measureValue = Math.floor(Math.random() * 6) + 2; // 2-7 units
      const objects: MeasurableObject[] = [
        { ...picked, value: measureValue, displayValue: measureValue, unit },
      ];
      // Child-friendly instructions
      const phrases = [
        `Count the ${unit}! How long is the ${picked.name}?`,
        `Use ${unit} to measure the ${picked.name}!`,
        `How many ${unit} is the ${picked.name}?`
      ];
      const instruction = phrases[Math.floor(Math.random() * phrases.length)];
      return {
        type,
        instruction,
        objects,
        correctAnswer: measureValue.toString(),
        unit,
      };
    }

    case 'order-length': {
      // Pick 3 objects with DIFFERENT values for ordering
      const shuffled = shuffleArray(lengthObjects);
      const picked: MeasurableObject[] = [];
      const usedValues = new Set<number>();
      for (const obj of shuffled) {
        if (!usedValues.has(obj.value)) {
          picked.push(obj);
          usedValues.add(obj.value);
        }
        if (picked.length === 3) break;
      }
      // Sort by actual fixed value (descending = longest first)
      const sortedIds = [...picked].sort((a, b) => b.value - a.value).map(o => o.id);
      // Child-friendly instructions
      const phrases = [
        'Put in order: LONGEST first!',
        'Arrange from LONG to SHORT!',
        'Order: LONGEST → SHORTEST'
      ];
      const instruction = phrases[Math.floor(Math.random() * phrases.length)];
      return {
        type,
        instruction,
        objects: shuffleArray(picked),
        correctAnswer: sortedIds,
      };
    }

    case 'order-weight': {
      // Pick 3 objects with DIFFERENT values for ordering
      const shuffled = shuffleArray(weightObjects);
      const picked: MeasurableObject[] = [];
      const usedValues = new Set<number>();
      for (const obj of shuffled) {
        if (!usedValues.has(obj.value)) {
          picked.push(obj);
          usedValues.add(obj.value);
        }
        if (picked.length === 3) break;
      }
      // Sort by actual fixed value (descending = heaviest first)
      const sortedIds = [...picked].sort((a, b) => b.value - a.value).map(o => o.id);
      // Child-friendly instructions
      const phrases = [
        'Put in order: HEAVIEST first!',
        'Arrange from HEAVY to LIGHT!',
        'Order: HEAVIEST → LIGHTEST'
      ];
      const instruction = phrases[Math.floor(Math.random() * phrases.length)];
      return {
        type,
        instruction,
        objects: shuffleArray(picked),
        correctAnswer: sortedIds,
      };
    }

    case 'order-capacity': {
      // Pick 3 objects with DIFFERENT values for ordering
      const shuffled = shuffleArray(capacityObjects);
      const picked: MeasurableObject[] = [];
      const usedValues = new Set<number>();
      for (const obj of shuffled) {
        if (!usedValues.has(obj.value)) {
          picked.push(obj);
          usedValues.add(obj.value);
        }
        if (picked.length === 3) break;
      }
      // Sort by actual fixed value (descending = holds most first)
      const sortedIds = [...picked].sort((a, b) => b.value - a.value).map(o => o.id);
      // Child-friendly instructions
      const phrases = [
        'Put in order: BIGGEST first!',
        'Arrange from BIG to SMALL!',
        'Order: HOLDS MORE → HOLDS LESS'
      ];
      const instruction = phrases[Math.floor(Math.random() * phrases.length)];
      return {
        type,
        instruction,
        objects: shuffleArray(picked),
        correctAnswer: sortedIds,
      };
    }

    default:
      return generateQuestion('compare-length');
  }
}

// ─────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────

interface MeasureIslandState {
  // Game state
  phase: GamePhase;
  difficulty: Difficulty;
  round: number;
  totalRounds: number;
  score: number;
  streak: number;
  
  // Current question
  currentQuestion: Question | null;
  selectedAnswer: string | null;
  orderedAnswers: string[]; // For ordering questions
  isCorrect: boolean | null;
  attempts: number;
  roundStartTime: number;
  
  // Seesaw state (for compare questions)
  seesawTilt: number; // -1 = left down, 0 = balanced, 1 = right down
  showSeesawResult: boolean;
  
  // Measurement state
  measurementCount: number;
  
  // Telemetry
  telemetry: RoundTelemetry[];
  
  // Actions
  setPhase: (phase: GamePhase) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  startGame: () => void;
  nextRound: () => void;
  selectAnswer: (answerId: string) => void;
  addToOrder: (answerId: string) => void;
  removeFromOrder: (answerId: string) => void;
  submitAnswer: () => void;
  incrementMeasurement: () => void;
  decrementMeasurement: () => void;
  submitMeasurement: () => void;
  proceedAfterFeedback: () => void;
  resetGame: () => void;
}

export const useMeasureIslandStore = create<MeasureIslandState>((set, get) => ({
  // Initial state
  phase: 'welcome',
  difficulty: 'easy',
  round: 0,
  totalRounds: 10,
  score: 0,
  streak: 0,
  
  currentQuestion: null,
  selectedAnswer: null,
  orderedAnswers: [],
  isCorrect: null,
  attempts: 0,
  roundStartTime: Date.now(),
  
  seesawTilt: 0,
  showSeesawResult: false,
  
  measurementCount: 1,
  
  telemetry: [],
  
  // Actions
  setPhase: (phase) => set({ phase }),
  
  setDifficulty: (difficulty) => set({ 
    difficulty,
    totalRounds: difficultyConfig[difficulty].rounds,
  }),
  
  startGame: () => {
    const { difficulty } = get();
    const config = difficultyConfig[difficulty];
    const firstType = config.types[Math.floor(Math.random() * config.types.length)];
    const question = generateQuestion(firstType);
    
    set({
      phase: 'playing',
      round: 1,
      totalRounds: config.rounds,
      score: 0,
      streak: 0,
      currentQuestion: question,
      selectedAnswer: null,
      orderedAnswers: [],
      isCorrect: null,
      attempts: 0,
      roundStartTime: Date.now(),
      seesawTilt: 0,
      showSeesawResult: false,
      measurementCount: 1,
      telemetry: [],
    });
    
    console.log('[MeasureIsland] Game started', { difficulty, question });
  },
  
  nextRound: () => {
    const { round, totalRounds, difficulty } = get();
    
    if (round >= totalRounds) {
      set({ phase: 'celebration' });
      console.log('[MeasureIsland] Game complete!', { telemetry: get().telemetry });
      return;
    }
    
    const config = difficultyConfig[difficulty];
    const nextType = config.types[Math.floor(Math.random() * config.types.length)];
    const question = generateQuestion(nextType);
    
    set({
      round: round + 1,
      currentQuestion: question,
      selectedAnswer: null,
      orderedAnswers: [],
      isCorrect: null,
      attempts: 0,
      roundStartTime: Date.now(),
      seesawTilt: 0,
      showSeesawResult: false,
      measurementCount: 1,
      phase: 'playing',
    });
  },
  
  selectAnswer: (answerId) => {
    const { currentQuestion } = get();
    if (!currentQuestion) return;
    
    // For compare questions, show seesaw animation
    if (currentQuestion.type.startsWith('compare')) {
      const selected = currentQuestion.objects.find(o => o.id === answerId);
      const other = currentQuestion.objects.find(o => o.id !== answerId);
      
      if (selected && other) {
        // Tilt based on which is heavier/larger
        const tilt = selected.value > other.value ? -1 : 1;
        set({ 
          selectedAnswer: answerId,
          seesawTilt: tilt,
          showSeesawResult: true,
        });
      }
    } else {
      set({ selectedAnswer: answerId });
    }
  },
  
  addToOrder: (answerId) => {
    const { orderedAnswers } = get();
    if (!orderedAnswers.includes(answerId)) {
      set({ orderedAnswers: [...orderedAnswers, answerId] });
    }
  },
  
  removeFromOrder: (answerId) => {
    const { orderedAnswers } = get();
    set({ orderedAnswers: orderedAnswers.filter(id => id !== answerId) });
  },
  
  submitAnswer: () => {
    const { currentQuestion, selectedAnswer, orderedAnswers, attempts, roundStartTime, round, score, streak } = get();
    if (!currentQuestion) return;
    
    let playerAnswer: string | string[];
    let isCorrect = false;
    
    if (currentQuestion.type.startsWith('order')) {
      playerAnswer = orderedAnswers;
      const correctOrder = currentQuestion.correctAnswer as string[];
      isCorrect = orderedAnswers.length === correctOrder.length &&
        orderedAnswers.every((id, i) => id === correctOrder[i]);
    } else {
      playerAnswer = selectedAnswer || '';
      isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    }
    
    const newAttempts = attempts + 1;
    const timeSpent = Date.now() - roundStartTime;
    
    // Log telemetry
    const telemetryEntry: RoundTelemetry = {
      roundNumber: round,
      activityType: currentQuestion.type,
      question: currentQuestion.instruction,
      correctAnswer: currentQuestion.correctAnswer,
      playerAnswer,
      isCorrect,
      attempts: newAttempts,
      timeSpentMs: timeSpent,
      timestamp: new Date().toISOString(),
    };
    
    console.log('[MeasureIsland] Round result', telemetryEntry);
    
    set({
      isCorrect,
      attempts: newAttempts,
      phase: 'feedback',
      score: isCorrect ? score + (newAttempts === 1 ? 10 : 5) : score,
      streak: isCorrect ? streak + 1 : 0,
      telemetry: [...get().telemetry, telemetryEntry],
    });
  },
  
  incrementMeasurement: () => {
    const { measurementCount } = get();
    if (measurementCount < 10) {
      set({ measurementCount: measurementCount + 1 });
    }
  },
  
  decrementMeasurement: () => {
    const { measurementCount } = get();
    if (measurementCount > 1) {
      set({ measurementCount: measurementCount - 1 });
    }
  },
  
  submitMeasurement: () => {
    const { currentQuestion, measurementCount, attempts, roundStartTime, round, score, streak } = get();
    if (!currentQuestion) return;
    
    const isCorrect = measurementCount.toString() === currentQuestion.correctAnswer;
    const newAttempts = attempts + 1;
    const timeSpent = Date.now() - roundStartTime;
    
    const telemetryEntry: RoundTelemetry = {
      roundNumber: round,
      activityType: currentQuestion.type,
      question: currentQuestion.instruction,
      correctAnswer: currentQuestion.correctAnswer,
      playerAnswer: measurementCount.toString(),
      isCorrect,
      attempts: newAttempts,
      timeSpentMs: timeSpent,
      timestamp: new Date().toISOString(),
    };
    
    console.log('[MeasureIsland] Measurement result', telemetryEntry);
    
    set({
      isCorrect,
      attempts: newAttempts,
      phase: 'feedback',
      score: isCorrect ? score + (newAttempts === 1 ? 10 : 5) : score,
      streak: isCorrect ? streak + 1 : 0,
      telemetry: [...get().telemetry, telemetryEntry],
    });
  },
  
  proceedAfterFeedback: () => {
    get().nextRound();
  },
  
  resetGame: () => {
    set({
      phase: 'welcome',
      difficulty: 'easy',
      round: 0,
      totalRounds: 10,
      score: 0,
      streak: 0,
      currentQuestion: null,
      selectedAnswer: null,
      orderedAnswers: [],
      isCorrect: null,
      attempts: 0,
      seesawTilt: 0,
      showSeesawResult: false,
      measurementCount: 1,
      telemetry: [],
    });
  },
}));
