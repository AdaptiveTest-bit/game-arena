// Pattern Parade - Pattern Generation & Validation Utilities
// CBSE Class 1 Mathematics - Chapter 7: Patterns

// ============== TYPE DEFINITIONS ==============

export type PatternType = 'AB' | 'ABC' | 'AAB' | 'ABB' | 'AABB';
export type GameMode = 
  | 'spot-pattern'      // Mode 1: Identification
  | 'what-next'         // Mode 2: Extension
  | 'find-missing'      // Mode 3: Gap filling
  | 'build-pattern'     // Mode 4: Creation
  | 'growing-garden'    // Mode 5: Growing patterns
  | 'mirror-match';     // Mode 6: Symmetry

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface PatternItem {
  id: string;
  emoji: string;
  color: string;
  category: 'shape' | 'animal' | 'fruit' | 'object';
}

export interface TrainCar {
  id: string;
  position: number;
  item: PatternItem | null;
  isEmpty: boolean;
  isMissing: boolean;
  isLocked: boolean;
}

export interface RoundConfig {
  mode: GameMode;
  difficulty: DifficultyLevel;
  patternType: PatternType;
  patternUnit: PatternItem[];
  fullPattern: PatternItem[];
  trainCars: TrainCar[];
  options: PatternItem[];
  correctAnswer: PatternItem[] | number | string;
  gapIndex?: number;
  growthRule?: 'add1' | 'add2';
  growthSequence?: number[];
  ruleOptions?: { id: string; label: string; isCorrect: boolean }[];
}

// ============== ITEM SETS ==============

export const ITEM_SETS: Record<string, PatternItem[]> = {
  shapes: [
    { id: 'red-circle', emoji: '🔴', color: '#EF4444', category: 'shape' },
    { id: 'blue-square', emoji: '🔵', color: '#3B82F6', category: 'shape' },
    { id: 'yellow-star', emoji: '⭐', color: '#FBBF24', category: 'shape' },
    { id: 'green-circle', emoji: '🟢', color: '#22C55E', category: 'shape' },
  ],
  animals: [
    { id: 'cat', emoji: '🐱', color: '#F97316', category: 'animal' },
    { id: 'dog', emoji: '🐶', color: '#A16207', category: 'animal' },
    { id: 'rabbit', emoji: '🐰', color: '#EC4899', category: 'animal' },
    { id: 'bird', emoji: '🐦', color: '#06B6D4', category: 'animal' },
  ],
  fruits: [
    { id: 'apple', emoji: '🍎', color: '#DC2626', category: 'fruit' },
    { id: 'orange', emoji: '🍊', color: '#EA580C', category: 'fruit' },
    { id: 'banana', emoji: '🍌', color: '#FACC15', category: 'fruit' },
    { id: 'grape', emoji: '🍇', color: '#7C3AED', category: 'fruit' },
  ],
  objects: [
    { id: 'heart', emoji: '❤️', color: '#E11D48', category: 'object' },
    { id: 'moon', emoji: '🌙', color: '#FDE047', category: 'object' },
    { id: 'flower', emoji: '🌸', color: '#F472B6', category: 'object' },
    { id: 'leaf', emoji: '🍃', color: '#22C55E', category: 'object' },
  ],
};

// ============== PATTERN TEMPLATES ==============

export const PATTERN_TEMPLATES: Record<PatternType, number[]> = {
  'AB':   [0, 1],
  'ABC':  [0, 1, 2],
  'AAB':  [0, 0, 1],
  'ABB':  [0, 1, 1],
  'AABB': [0, 0, 1, 1],
};

export const PATTERN_LABELS: Record<PatternType, string> = {
  'AB':   'A-B Pattern (2 items repeat)',
  'ABC':  'A-B-C Pattern (3 items repeat)',
  'AAB':  'A-A-B Pattern (2 same, then different)',
  'ABB':  'A-B-B Pattern (1 different, then 2 same)',
  'AABB': 'A-A-B-B Pattern (2 and 2 repeat)',
};

// ============== UTILITY FUNCTIONS ==============

export function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function repeatPattern<T>(unit: T[], times: number): T[] {
  const result: T[] = [];
  for (let i = 0; i < times; i++) {
    result.push(...unit);
  }
  return result;
}

// ============== PATTERN TYPE DETECTION ==============

export function detectPatternType(unit: PatternItem[]): PatternType {
  if (unit.length === 2) {
    if (unit[0].id === unit[1].id) return 'AB'; // Shouldn't happen
    return 'AB';
  }
  if (unit.length === 3) {
    if (unit[0].id === unit[1].id && unit[1].id !== unit[2].id) return 'AAB';
    if (unit[0].id !== unit[1].id && unit[1].id === unit[2].id) return 'ABB';
    return 'ABC';
  }
  if (unit.length === 4) {
    if (unit[0].id === unit[1].id && unit[2].id === unit[3].id && unit[0].id !== unit[2].id) {
      return 'AABB';
    }
  }
  return 'AB';
}

// ============== DIFFICULTY SETTINGS ==============

function selectPatternType(difficulty: DifficultyLevel): PatternType {
  const typesByDifficulty: Record<DifficultyLevel, PatternType[]> = {
    easy: ['AB'],
    medium: ['AB', 'ABC', 'AAB'],
    hard: ['AB', 'ABC', 'AAB', 'ABB', 'AABB'],
  };
  return randomChoice(typesByDifficulty[difficulty]);
}

function getRepeatCount(difficulty: DifficultyLevel): number {
  return difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
}

// ============== GENERATOR FUNCTIONS ==============

export function generateRoundConfig(
  mode: GameMode,
  difficulty: DifficultyLevel
): RoundConfig {
  switch (mode) {
    case 'spot-pattern':
      return generateSpotPatternRound(difficulty);
    case 'what-next':
      return generateWhatNextRound(difficulty);
    case 'find-missing':
      return generateFindMissingRound(difficulty);
    case 'build-pattern':
      return generateBuildPatternRound(difficulty);
    case 'growing-garden':
      return generateGrowingGardenRound(difficulty);
    case 'mirror-match':
      return generateMirrorMatchRound(difficulty);
    default:
      return generateSpotPatternRound(difficulty);
  }
}

function generateBasePattern(difficulty: DifficultyLevel): {
  patternType: PatternType;
  patternUnit: PatternItem[];
  fullPattern: PatternItem[];
  items: PatternItem[];
} {
  const patternType = selectPatternType(difficulty);
  const itemSetKey = randomChoice(Object.keys(ITEM_SETS));
  const items = ITEM_SETS[itemSetKey];
  
  const template = PATTERN_TEMPLATES[patternType];
  const selectedItems = shuffleArray([...items]).slice(0, 3);
  const patternUnit = template.map(idx => selectedItems[idx % selectedItems.length]);
  
  const repeatCount = getRepeatCount(difficulty);
  const fullPattern = repeatPattern(patternUnit, repeatCount);
  
  return { patternType, patternUnit, fullPattern, items };
}

function generateSpotPatternRound(difficulty: DifficultyLevel): RoundConfig {
  const { patternType, patternUnit, fullPattern, items } = generateBasePattern(difficulty);
  
  // Generate rule options
  const allTypes: PatternType[] = ['AB', 'ABC', 'AAB', 'ABB', 'AABB'];
  const wrongTypes = shuffleArray(allTypes.filter(t => t !== patternType)).slice(0, 2);
  
  const ruleOptions = shuffleArray([
    { id: patternType, label: PATTERN_LABELS[patternType], isCorrect: true },
    ...wrongTypes.map(t => ({ id: t, label: PATTERN_LABELS[t], isCorrect: false })),
  ]);
  
  const trainCars: TrainCar[] = fullPattern.map((item, idx) => ({
    id: `car-${idx}`,
    position: idx,
    item,
    isEmpty: false,
    isMissing: false,
    isLocked: true,
  }));
  
  return {
    mode: 'spot-pattern',
    difficulty,
    patternType,
    patternUnit,
    fullPattern,
    trainCars,
    options: [],
    correctAnswer: patternType,
    ruleOptions,
  };
}

function generateWhatNextRound(difficulty: DifficultyLevel): RoundConfig {
  const { patternType, patternUnit, fullPattern, items } = generateBasePattern(difficulty);
  
  const visibleCount = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 5 : 6;
  const missingCount = difficulty === 'easy' ? 1 : 2;
  
  const extendedPattern = repeatPattern(patternUnit, Math.ceil((visibleCount + missingCount) / patternUnit.length) + 1);
  const neededPattern = extendedPattern.slice(0, visibleCount + missingCount);
  
  const trainCars: TrainCar[] = neededPattern.map((item, idx) => ({
    id: `car-${idx}`,
    position: idx,
    item: idx < visibleCount ? item : null,
    isEmpty: idx >= visibleCount,
    isMissing: false,
    isLocked: idx < visibleCount,
  }));
  
  const correctAnswers = neededPattern.slice(visibleCount);
  const distractors = shuffleArray(items.filter(i => !correctAnswers.some(c => c.id === i.id))).slice(0, 2);
  
  return {
    mode: 'what-next',
    difficulty,
    patternType,
    patternUnit,
    fullPattern: neededPattern,
    trainCars,
    options: shuffleArray([...correctAnswers, ...distractors]),
    correctAnswer: correctAnswers,
  };
}

function generateFindMissingRound(difficulty: DifficultyLevel): RoundConfig {
  const { patternType, patternUnit, fullPattern, items } = generateBasePattern(difficulty);
  
  // Gap in middle (never first or last)
  const gapIndex = randomBetween(2, fullPattern.length - 2);
  
  const trainCars: TrainCar[] = fullPattern.map((item, idx) => ({
    id: `car-${idx}`,
    position: idx,
    item: idx === gapIndex ? null : item,
    isEmpty: idx === gapIndex,
    isMissing: idx === gapIndex,
    isLocked: idx !== gapIndex,
  }));
  
  const correctAnswer = [fullPattern[gapIndex]];
  const distractors = shuffleArray(items.filter(i => i.id !== correctAnswer[0].id)).slice(0, 3);
  
  return {
    mode: 'find-missing',
    difficulty,
    patternType,
    patternUnit,
    fullPattern,
    trainCars,
    options: shuffleArray([...correctAnswer, ...distractors]),
    correctAnswer,
    gapIndex,
  };
}

function generateBuildPatternRound(difficulty: DifficultyLevel): RoundConfig {
  const itemSetKey = randomChoice(Object.keys(ITEM_SETS));
  const items = shuffleArray([...ITEM_SETS[itemSetKey]]).slice(0, difficulty === 'easy' ? 2 : 3);
  
  const carCount = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
  
  const trainCars: TrainCar[] = Array(carCount).fill(null).map((_, idx) => ({
    id: `car-${idx}`,
    position: idx,
    item: null,
    isEmpty: true,
    isMissing: false,
    isLocked: false,
  }));
  
  return {
    mode: 'build-pattern',
    difficulty,
    patternType: 'AB',
    patternUnit: [],
    fullPattern: [],
    trainCars,
    options: items,
    correctAnswer: [],
  };
}

function generateGrowingGardenRound(difficulty: DifficultyLevel): RoundConfig {
  // Generate dynamic sequences with random starting points
  let rule: 'add1' | 'add2';
  let start: number;
  let sequence: number[];
  
  if (difficulty === 'easy') {
    rule = 'add1';
    start = randomBetween(1, 5); // Random start 1-5
    sequence = [start, start + 1, start + 2, start + 3, start + 4];
  } else if (difficulty === 'medium') {
    rule = 'add1';
    start = randomBetween(2, 7); // Random start 2-7
    sequence = [start, start + 1, start + 2, start + 3, start + 4];
  } else {
    rule = 'add2';
    start = randomBetween(1, 4) * 2; // Even start: 2, 4, 6, or 8
    sequence = [start, start + 2, start + 4, start + 6, start + 8];
  }
  
  const visibleCount = 3;
  const correctNext = sequence[visibleCount];
  
  // Generate options with nearby wrong numbers
  const options = shuffleArray([
    correctNext,
    Math.max(1, correctNext - 1),
    correctNext + 1,
    correctNext + 2,
  ]).map(n => ({
    id: `count-${n}`,
    emoji: String(n),
    color: '#22C55E',
    category: 'object' as const,
  }));
  
  return {
    mode: 'growing-garden',
    difficulty,
    patternType: 'AB',
    patternUnit: [],
    fullPattern: [],
    trainCars: [],
    options,
    correctAnswer: correctNext,
    growthRule: rule,
    growthSequence: sequence.slice(0, visibleCount + 1),
  };
}

function generateMirrorMatchRound(difficulty: DifficultyLevel): RoundConfig {
  const itemSetKey = randomChoice(Object.keys(ITEM_SETS));
  const items = shuffleArray([...ITEM_SETS[itemSetKey]]);
  
  const leftSideLength = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
  const leftSide = items.slice(0, leftSideLength);
  const rightSide = [...leftSide].reverse();
  
  // Hide some items on right side
  const missingCount = difficulty === 'easy' ? 1 : 2;
  const possibleMissingIndices = [...Array(rightSide.length).keys()];
  const missingIndices = shuffleArray(possibleMissingIndices).slice(0, missingCount);
  
  const fullPattern = [...leftSide, ...rightSide];
  
  const trainCars: TrainCar[] = fullPattern.map((item, idx) => {
    const isRightSide = idx >= leftSideLength;
    const rightIdx = idx - leftSideLength;
    const isMissing = isRightSide && missingIndices.includes(rightIdx);
    
    return {
      id: `car-${idx}`,
      position: idx,
      item: isMissing ? null : item,
      isEmpty: isMissing,
      isMissing,
      isLocked: !isMissing,
    };
  });
  
  const correctItems = missingIndices.map(i => rightSide[i]);
  const distractors = shuffleArray(items.filter(i => !correctItems.some(c => c.id === i.id))).slice(0, 2);
  
  return {
    mode: 'mirror-match',
    difficulty,
    patternType: 'AB',
    patternUnit: leftSide,
    fullPattern,
    trainCars,
    options: shuffleArray([...correctItems, ...distractors]),
    correctAnswer: correctItems,
  };
}

// ============== VALIDATION ==============

export function validateCreatedPattern(sequence: (PatternItem | null)[]): {
  isValid: boolean;
  patternType: PatternType | null;
  message: string;
} {
  // Filter out nulls and check minimum length
  const items = sequence.filter((item): item is PatternItem => item !== null);
  
  if (items.length < 4) {
    return { isValid: false, patternType: null, message: 'Place at least 4 items!' };
  }
  
  // Check if all positions are filled
  if (items.length !== sequence.length) {
    return { isValid: false, patternType: null, message: 'Fill all the train cars!' };
  }
  
  // Check for valid repeating pattern (unit length 1-4)
  for (let unitLen = 2; unitLen <= 4; unitLen++) {
    if (items.length < unitLen * 2) continue;
    
    const unit = items.slice(0, unitLen);
    let isValid = true;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].id !== unit[i % unitLen].id) {
        isValid = false;
        break;
      }
    }
    
    if (isValid) {
      const patternType = detectPatternType(unit);
      return { 
        isValid: true, 
        patternType, 
        message: `Great! You made a ${PATTERN_LABELS[patternType]}!` 
      };
    }
  }
  
  return { 
    isValid: false, 
    patternType: null, 
    message: 'Not a repeating pattern. Try again!' 
  };
}

export function validateAnswer(
  roundConfig: RoundConfig,
  playerAnswer: PatternItem[],
  selectedRule?: string,
  selectedGrowthCount?: number
): { isCorrect: boolean; message: string } {
  const { mode, correctAnswer, trainCars } = roundConfig;
  
  switch (mode) {
    case 'spot-pattern': {
      const isCorrect = selectedRule === correctAnswer;
      return {
        isCorrect,
        message: isCorrect 
          ? '🎉 Correct! You found the pattern!' 
          : '🤔 Not quite. Look at how the items repeat!',
      };
    }
    
    case 'what-next':
    case 'find-missing':
    case 'mirror-match': {
      const expected = correctAnswer as PatternItem[];
      const filledCars = trainCars.filter(c => c.isEmpty || c.isMissing);
      const playerItems = filledCars.map(c => playerAnswer.find(p => p.id === c.item?.id) || c.item);
      
      // Check filled positions
      let allCorrect = true;
      for (let i = 0; i < filledCars.length; i++) {
        const car = trainCars.find(c => c.id === filledCars[i].id);
        if (!car?.item || car.item.id !== expected[i]?.id) {
          allCorrect = false;
          break;
        }
      }
      
      return {
        isCorrect: allCorrect,
        message: allCorrect 
          ? '🎉 Perfect! You completed the pattern!' 
          : '🤔 Check your answer and try again!',
      };
    }
    
    case 'build-pattern': {
      const items = trainCars.map(c => c.item);
      const result = validateCreatedPattern(items);
      return {
        isCorrect: result.isValid,
        message: result.message,
      };
    }
    
    case 'growing-garden': {
      const expected = correctAnswer as number;
      const isCorrect = selectedGrowthCount === expected;
      return {
        isCorrect,
        message: isCorrect 
          ? '🎉 Correct! You found the growing pattern!' 
          : `🤔 Not quite. Count carefully: ${roundConfig.growthSequence?.slice(0, 3).join(', ')}, ...?`,
      };
    }
    
    default:
      return { isCorrect: false, message: 'Unknown mode' };
  }
}

// ============== HINTS ==============

export function getHint(roundConfig: RoundConfig): string {
  const { mode, patternType, patternUnit, growthSequence } = roundConfig;
  
  switch (mode) {
    case 'spot-pattern':
      return `Look at how many items repeat. Is it 2 items (like A-B) or 3 items (like A-B-C)?`;
    
    case 'what-next':
      return `The pattern repeats! Look at the first few items: ${patternUnit.map(i => i.emoji).join(' ')}`;
    
    case 'find-missing':
      return `Find the pattern unit and figure out what goes in the empty spot.`;
    
    case 'build-pattern':
      return `Pick 2 or 3 items and repeat them. Like: 🔴🔵🔴🔵 or 🍎🍊🍌🍎🍊🍌`;
    
    case 'growing-garden':
      return `Count the flowers in each pot: ${growthSequence?.slice(0, 3).join(', ')}. What's the pattern?`;
    
    case 'mirror-match':
      return `The right side should mirror the left side. Like looking in a mirror!`;
    
    default:
      return 'Look for a repeating pattern!';
  }
}
