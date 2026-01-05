'use client';

import { create } from 'zustand';

// ============ Types ============

export interface BeachItem {
  id: string;
  name: string;
  shape: 'round' | 'long';
  icon: string;
  position: { x: number; y: number };
  originalPosition: { x: number; y: number };
}

export interface LengthChallenge {
  objects: Array<{
    id: string;
    type: 'stick' | 'rope' | 'fish' | 'seaweed';
    length: number;
    color: string;
  }>;
  question: 'longer' | 'shorter';
  correctIndex: number;
}

export interface CountingChallenge {
  targetCount: number;
  availableItems: Array<{
    id: string;
    icon: string;
    position: { x: number; y: number };
  }>;
  itemType: 'shell' | 'starfish' | 'pebble' | 'coin';
  itemIcon: string;
}

export interface BalanceChallenge {
  leftCount: number;
  rightCount: number;
  question: 'more' | 'less' | 'equal';
  itemIcon: string;
  tiltAngle: number;
}

interface BeachSafariState {
  // Game Meta
  phase: 'sorting' | 'length' | 'counting' | 'balance';
  score: number;
  stars: number;
  streak: number;
  challengeIndex: number;
  totalChallenges: number;
  isPhaseCorrect: boolean;
  showPhaseComplete: boolean;
  gameComplete: boolean;
  
  // Phase 1: Shape Sorting
  sortingItems: BeachItem[];
  roundBin: BeachItem[];
  longBin: BeachItem[];
  sortingComplete: boolean;
  addToBin: (item: BeachItem, bin: 'round' | 'long') => boolean;
  
  // Phase 2: Length Comparison
  lengthChallenge: LengthChallenge | null;
  lengthAnswered: boolean;
  selectLengthAnswer: (index: number) => boolean;
  
  // Phase 3: Bucket Counting
  countingChallenge: CountingChallenge | null;
  bucketContents: string[];
  addToBucket: (itemId: string) => void;
  removeFromBucket: (itemId: string) => void;
  submitBucketCount: () => boolean;
  
  // Phase 4: Balance
  balanceChallenge: BalanceChallenge | null;
  balanceAnswered: boolean;
  selectBalanceAnswer: (answer: 'left' | 'right' | 'equal') => boolean;
  
  // Game Flow
  generateChallenge: () => void;
  advancePhase: () => void;
  nextChallenge: () => void;
  resetGame: () => void;
  dismissPhaseComplete: () => void;
  
  // Hints
  hintsRemaining: number;
  currentHint: string | null;
  useHint: () => string | null;
}

// ============ Item Data ============

const ROUND_ITEMS = [
  { icon: '🏐', name: 'Ball' },
  { icon: '🔵', name: 'Circle' },
  { icon: '🍊', name: 'Orange' },
  { icon: '🥥', name: 'Coconut' },
  { icon: '⚽', name: 'Football' },
  { icon: '🪙', name: 'Coin' },
  { icon: '🍩', name: 'Donut' },
  { icon: '🍪', name: 'Cookie' },
];

const LONG_ITEMS = [
  { icon: '🪵', name: 'Log' },
  { icon: '🥖', name: 'Bread' },
  { icon: '🥕', name: 'Carrot' },
  { icon: '🦴', name: 'Bone' },
  { icon: '✏️', name: 'Pencil' },
  { icon: '🍌', name: 'Banana' },
  { icon: '🥒', name: 'Cucumber' },
  { icon: '🌽', name: 'Corn' },
];

const COUNTING_ICONS = [
  { type: 'shell' as const, icon: '🐚' },
  { type: 'starfish' as const, icon: '⭐' },
  { type: 'pebble' as const, icon: '🪨' },
  { type: 'coin' as const, icon: '🪙' },
];

const OBJECT_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

// ============ Generators ============

const randomInt = (min: number, max: number) => 
  Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const generateSortingItems = (): BeachItem[] => {
  const count = randomInt(6, 8);
  const roundCount = Math.floor(count / 2) + randomInt(-1, 1);
  const longCount = count - roundCount;
  
  const items: BeachItem[] = [];
  
  // Select random round items
  const shuffledRound = shuffle(ROUND_ITEMS);
  for (let i = 0; i < Math.min(roundCount, shuffledRound.length); i++) {
    const x = randomInt(100, 700);
    const y = randomInt(150, 350);
    items.push({
      id: `round-${i}`,
      name: shuffledRound[i].name,
      shape: 'round',
      icon: shuffledRound[i].icon,
      position: { x, y },
      originalPosition: { x, y }
    });
  }
  
  // Select random long items
  const shuffledLong = shuffle(LONG_ITEMS);
  for (let i = 0; i < Math.min(longCount, shuffledLong.length); i++) {
    const x = randomInt(100, 700);
    const y = randomInt(150, 350);
    items.push({
      id: `long-${i}`,
      name: shuffledLong[i].name,
      shape: 'long',
      icon: shuffledLong[i].icon,
      position: { x, y },
      originalPosition: { x, y }
    });
  }
  
  return shuffle(items);
};

const generateLengthChallenge = (): LengthChallenge => {
  const types: ('stick' | 'rope' | 'fish' | 'seaweed')[] = ['stick', 'rope', 'fish', 'seaweed'];
  const type = types[randomInt(0, types.length - 1)];
  const color = OBJECT_COLORS[randomInt(0, OBJECT_COLORS.length - 1)];
  
  const baseLength = randomInt(80, 140);
  const diff = randomInt(40, 80);
  const question: 'longer' | 'shorter' = Math.random() > 0.5 ? 'longer' : 'shorter';
  
  const lengths = [baseLength, baseLength + diff];
  const shuffledLengths = shuffle([...lengths]);
  
  const correctIndex = question === 'longer' 
    ? shuffledLengths.indexOf(Math.max(...shuffledLengths))
    : shuffledLengths.indexOf(Math.min(...shuffledLengths));
  
  return {
    objects: shuffledLengths.map((length, idx) => ({
      id: `obj-${idx}`,
      type,
      length,
      color: idx === 0 ? color : OBJECT_COLORS[(OBJECT_COLORS.indexOf(color) + 2) % OBJECT_COLORS.length]
    })),
    question,
    correctIndex
  };
};

const generateCountingChallenge = (difficulty: 'easy' | 'medium'): CountingChallenge => {
  const ranges = {
    easy: { min: 3, max: 8 },
    medium: { min: 8, max: 15 }
  };
  
  const target = randomInt(ranges[difficulty].min, ranges[difficulty].max);
  const available = target + randomInt(3, 8);
  const iconData = COUNTING_ICONS[randomInt(0, COUNTING_ICONS.length - 1)];
  
  const items: CountingChallenge['availableItems'] = [];
  for (let i = 0; i < available; i++) {
    items.push({
      id: `item-${i}`,
      icon: iconData.icon,
      position: {
        x: randomInt(50, 550),
        y: randomInt(80, 280)
      }
    });
  }
  
  return {
    targetCount: target,
    availableItems: items,
    itemType: iconData.type,
    itemIcon: iconData.icon
  };
};

const generateBalanceChallenge = (): BalanceChallenge => {
  const icons = ['🐚', '⭐', '🪙', '🦀'];
  const icon = icons[randomInt(0, icons.length - 1)];
  
  // Generate different scenarios
  const scenario = randomInt(0, 2);
  let leftCount: number, rightCount: number, question: 'more' | 'less' | 'equal';
  
  if (scenario === 0) {
    // Left has more
    leftCount = randomInt(5, 10);
    rightCount = leftCount - randomInt(2, 4);
    question = 'more';
  } else if (scenario === 1) {
    // Right has more (left has less)
    rightCount = randomInt(5, 10);
    leftCount = rightCount - randomInt(2, 4);
    question = 'less';
  } else {
    // Equal
    leftCount = randomInt(3, 8);
    rightCount = leftCount;
    question = 'equal';
  }
  
  // Calculate tilt angle
  const diff = leftCount - rightCount;
  const tiltAngle = Math.max(-15, Math.min(15, diff * 3));
  
  return {
    leftCount,
    rightCount,
    question,
    itemIcon: icon,
    tiltAngle
  };
};

// ============ Store ============

export const useBeachSafariStore = create<BeachSafariState>((set, get) => ({
  phase: 'sorting',
  score: 0,
  stars: 0,
  streak: 0,
  challengeIndex: 0,
  totalChallenges: 3,
  isPhaseCorrect: false,
  showPhaseComplete: false,
  gameComplete: false,
  
  sortingItems: [],
  roundBin: [],
  longBin: [],
  sortingComplete: false,
  
  lengthChallenge: null,
  lengthAnswered: false,
  
  countingChallenge: null,
  bucketContents: [],
  
  balanceChallenge: null,
  balanceAnswered: false,
  
  hintsRemaining: 3,
  currentHint: null,
  
  addToBin: (item, bin) => {
    const isCorrect = (bin === 'round' && item.shape === 'round') ||
                      (bin === 'long' && item.shape === 'long');
    
    if (isCorrect) {
      const { sortingItems, roundBin, longBin, score, streak } = get();
      
      const newItems = sortingItems.filter(i => i.id !== item.id);
      const newRoundBin = bin === 'round' ? [...roundBin, item] : roundBin;
      const newLongBin = bin === 'long' ? [...longBin, item] : longBin;
      
      const allSorted = newItems.length === 0;
      
      set({
        sortingItems: newItems,
        roundBin: newRoundBin,
        longBin: newLongBin,
        score: score + 20,
        streak: streak + 1,
        sortingComplete: allSorted,
        isPhaseCorrect: allSorted,
        showPhaseComplete: allSorted
      });
    } else {
      set({ streak: 0 });
    }
    
    return isCorrect;
  },
  
  selectLengthAnswer: (index) => {
    const challenge = get().lengthChallenge;
    if (!challenge || get().lengthAnswered) return false;
    
    const isCorrect = index === challenge.correctIndex;
    
    set({
      lengthAnswered: true,
      score: get().score + (isCorrect ? 30 : 0),
      streak: isCorrect ? get().streak + 1 : 0,
      isPhaseCorrect: isCorrect
    });
    
    return isCorrect;
  },
  
  addToBucket: (itemId) => {
    const { bucketContents, countingChallenge } = get();
    if (!countingChallenge) return;
    
    if (!bucketContents.includes(itemId) && bucketContents.length < countingChallenge.availableItems.length) {
      set({ bucketContents: [...bucketContents, itemId] });
    }
  },
  
  removeFromBucket: (itemId) => {
    set({ bucketContents: get().bucketContents.filter(id => id !== itemId) });
  },
  
  submitBucketCount: () => {
    const { countingChallenge, bucketContents, score, streak } = get();
    if (!countingChallenge) return false;
    
    const isCorrect = bucketContents.length === countingChallenge.targetCount;
    
    set({
      score: score + (isCorrect ? 40 : 0),
      streak: isCorrect ? streak + 1 : 0,
      isPhaseCorrect: isCorrect,
      showPhaseComplete: isCorrect
    });
    
    return isCorrect;
  },
  
  selectBalanceAnswer: (answer) => {
    const challenge = get().balanceChallenge;
    if (!challenge || get().balanceAnswered) return false;
    
    let isCorrect = false;
    
    if (challenge.question === 'more') {
      isCorrect = (challenge.leftCount > challenge.rightCount && answer === 'left') ||
                  (challenge.rightCount > challenge.leftCount && answer === 'right');
    } else if (challenge.question === 'less') {
      isCorrect = (challenge.leftCount < challenge.rightCount && answer === 'left') ||
                  (challenge.rightCount < challenge.leftCount && answer === 'right');
    } else {
      isCorrect = answer === 'equal';
    }
    
    set({
      balanceAnswered: true,
      score: get().score + (isCorrect ? 35 : 0),
      streak: isCorrect ? get().streak + 1 : 0,
      isPhaseCorrect: isCorrect
    });
    
    return isCorrect;
  },
  
  generateChallenge: () => {
    const { phase, challengeIndex } = get();
    
    switch (phase) {
      case 'sorting':
        set({
          sortingItems: generateSortingItems(),
          roundBin: [],
          longBin: [],
          sortingComplete: false,
          isPhaseCorrect: false,
          currentHint: null
        });
        break;
      case 'length':
        set({
          lengthChallenge: generateLengthChallenge(),
          lengthAnswered: false,
          isPhaseCorrect: false,
          currentHint: null
        });
        break;
      case 'counting':
        const difficulty = challengeIndex < 2 ? 'easy' : 'medium';
        set({
          countingChallenge: generateCountingChallenge(difficulty),
          bucketContents: [],
          isPhaseCorrect: false,
          currentHint: null
        });
        break;
      case 'balance':
        set({
          balanceChallenge: generateBalanceChallenge(),
          balanceAnswered: false,
          isPhaseCorrect: false,
          currentHint: null
        });
        break;
    }
  },
  
  advancePhase: () => {
    const { phase } = get();
    
    if (phase === 'sorting') {
      set({ phase: 'length', challengeIndex: 0, isPhaseCorrect: false, showPhaseComplete: false });
      get().generateChallenge();
    } else if (phase === 'length') {
      set({ phase: 'counting', challengeIndex: 0, isPhaseCorrect: false, showPhaseComplete: false });
      get().generateChallenge();
    } else if (phase === 'counting') {
      set({ phase: 'balance', challengeIndex: 0, isPhaseCorrect: false, showPhaseComplete: false });
      get().generateChallenge();
    } else {
      set({ gameComplete: true, showPhaseComplete: false });
    }
  },
  
  nextChallenge: () => {
    const { challengeIndex, totalChallenges } = get();
    
    if (challengeIndex + 1 >= totalChallenges) {
      set({ showPhaseComplete: true });
    } else {
      set({ challengeIndex: challengeIndex + 1 });
      get().generateChallenge();
    }
  },
  
  resetGame: () => {
    set({
      phase: 'sorting',
      score: 0,
      stars: 0,
      streak: 0,
      challengeIndex: 0,
      isPhaseCorrect: false,
      showPhaseComplete: false,
      gameComplete: false,
      sortingItems: [],
      roundBin: [],
      longBin: [],
      sortingComplete: false,
      lengthChallenge: null,
      lengthAnswered: false,
      countingChallenge: null,
      bucketContents: [],
      balanceChallenge: null,
      balanceAnswered: false,
      hintsRemaining: 3,
      currentHint: null
    });
    get().generateChallenge();
  },
  
  dismissPhaseComplete: () => {
    set({ showPhaseComplete: false });
  },
  
  useHint: () => {
    const { hintsRemaining, phase, sortingItems, lengthChallenge, countingChallenge, balanceChallenge } = get();
    
    if (hintsRemaining <= 0) return null;
    
    let hint = '';
    
    switch (phase) {
      case 'sorting':
        if (sortingItems.length > 0) {
          const item = sortingItems[0];
          hint = `🦀 "${item.icon} ${item.name}" is ${item.shape === 'round' ? 'ROUND like a circle!' : 'LONG like a stick!'}`;
        }
        break;
      case 'length':
        if (lengthChallenge) {
          const longerIdx = lengthChallenge.objects[0].length > lengthChallenge.objects[1].length ? 0 : 1;
          hint = lengthChallenge.question === 'longer'
            ? `🦀 Look carefully! The ${longerIdx === 0 ? 'first' : 'second'} one is LONGER!`
            : `🦀 Look carefully! The ${longerIdx === 0 ? 'second' : 'first'} one is SHORTER!`;
        }
        break;
      case 'counting':
        if (countingChallenge) {
          hint = `🦀 Count slowly: 1, 2, 3... You need exactly ${countingChallenge.targetCount} items!`;
        }
        break;
      case 'balance':
        if (balanceChallenge) {
          const { leftCount, rightCount, question } = balanceChallenge;
          if (question === 'equal') {
            hint = `🦀 Count both sides! Are they the same?`;
          } else {
            hint = `🦀 Left has ${leftCount}, Right has ${rightCount}. Which side has ${question}?`;
          }
        }
        break;
    }
    
    set({ hintsRemaining: hintsRemaining - 1, currentHint: hint });
    return hint;
  }
}));
