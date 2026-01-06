import { create } from 'zustand';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface Balloon {
  id: string;
  value: number;
  color: string;
  x: number;
  y: number;
  isAttached: boolean;
}

export type Difficulty = 'easy' | 'medium' | 'hard';
export type GamePhase = 'menu' | 'playing' | 'floating' | 'success' | 'celebrating';

export interface BalloonBlastoffState {
  // Game State
  currentLevel: number;
  score: number;
  gamePhase: GamePhase;
  
  // Level Data
  targetSum: number;
  currentSum: number;
  availableBalloons: Balloon[];
  attachedBalloons: Balloon[];
  
  // Difficulty & Progression
  difficulty: Difficulty;
  
  // 100-Point Scorecard System (20 rounds × 5 points = 100 max)
  totalRoundsPerSession: number;
  roundsCompleted: number;
  correctRounds: number;
  
  // Celebration
  celebrationStarted: boolean;
  
  // Telemetry
  levelStartTime: number;
  totalAttempts: number;
  correctAttempts: number;
}

export interface BalloonBlastoffStore extends BalloonBlastoffState {
  // Actions
  startGame: (difficulty?: Difficulty) => void;
  generateLevel: () => void;
  attachBalloon: (balloonId: string) => void;
  detachBalloon: (balloonId: string) => void;
  checkSum: () => boolean;
  nextLevel: () => void;
  resetGame: () => void;
  setGamePhase: (phase: GamePhase) => void;
  startCelebration: () => void;
  getTelemetryLog: () => object;
}

// ============================================
// CONSTANTS
// ============================================

const BALLOON_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Sky Blue
  '#96CEB4', // Mint
  '#FFEAA7', // Yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Aqua
  '#F7DC6F', // Gold
  '#BB8FCE', // Lavender
  '#85C1E9', // Light Blue
];

// ============================================
// PROCEDURAL GENERATION HELPERS
// ============================================

const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

const getRandomColor = (): string => {
  return BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
};

/**
 * Generates a partition of a number into N parts
 * Each part is at least 1
 */
const generatePartition = (sum: number, parts: number): number[] => {
  if (parts === 1) return [sum];
  if (parts === 2) {
    const a = randomInt(1, sum - 1);
    return [a, sum - a];
  }
  
  // For 3+ parts, use recursive approach
  const maxFirst = Math.floor(sum / 2);
  const first = randomInt(1, Math.max(1, maxFirst));
  const remaining = sum - first;
  
  if (remaining < parts - 1) {
    // Not enough remaining, try again with different split
    return generatePartition(sum, parts);
  }
  
  return [first, ...generatePartition(remaining, parts - 1)];
};

/**
 * Generates distractor numbers that don't easily complete the sum
 */
const generateDistractors = (
  target: number,
  count: number,
  solutions: number[]
): number[] => {
  const distractors: number[] = [];
  const maxValue = Math.min(target + 10, 50); // Keep distractors reasonable
  
  let attempts = 0;
  while (distractors.length < count && attempts < 100) {
    attempts++;
    const val = randomInt(1, maxValue);
    
    // Avoid duplicates and solution values
    if (!solutions.includes(val) && !distractors.includes(val)) {
      distractors.push(val);
    }
  }
  
  // Fill remaining with random values if needed
  while (distractors.length < count) {
    distractors.push(randomInt(1, maxValue));
  }
  
  return distractors;
};

/**
 * Get difficulty parameters based on level (for progressive mode)
 */
const getDifficultyForLevel = (level: number): {
  difficulty: Difficulty;
  sumRange: { min: number; max: number };
  solutionCount: number;
  distractorCount: number;
} => {
  if (level <= 3) {
    return {
      difficulty: 'easy',
      sumRange: { min: 5, max: 15 },
      solutionCount: 2,
      distractorCount: 2,
    };
  } else if (level <= 5) {
    return {
      difficulty: 'easy',
      sumRange: { min: 10, max: 20 },
      solutionCount: 2,
      distractorCount: 3,
    };
  } else if (level <= 8) {
    return {
      difficulty: 'medium',
      sumRange: { min: 15, max: 35 },
      solutionCount: randomInt(2, 3),
      distractorCount: 3,
    };
  } else if (level <= 10) {
    return {
      difficulty: 'medium',
      sumRange: { min: 25, max: 50 },
      solutionCount: randomInt(2, 3),
      distractorCount: 4,
    };
  } else if (level <= 15) {
    return {
      difficulty: 'hard',
      sumRange: { min: 40, max: 70 },
      solutionCount: randomInt(3, 4),
      distractorCount: 4,
    };
  } else {
    return {
      difficulty: 'hard',
      sumRange: { min: 60, max: 100 },
      solutionCount: randomInt(3, 4),
      distractorCount: 5,
    };
  }
};

/**
 * Get difficulty parameters based on selected difficulty
 */
const getDifficultyParams = (difficulty: Difficulty): {
  sumRange: { min: number; max: number };
  solutionCount: number;
  distractorCount: number;
} => {
  switch (difficulty) {
    case 'easy':
      return {
        sumRange: { min: 5, max: 20 },
        solutionCount: 2,
        distractorCount: 2,
      };
    case 'medium':
      return {
        sumRange: { min: 15, max: 50 },
        solutionCount: randomInt(2, 3),
        distractorCount: 3,
      };
    case 'hard':
      return {
        sumRange: { min: 40, max: 100 },
        solutionCount: randomInt(3, 4),
        distractorCount: 4,
      };
  }
};

/**
 * Generate level data with procedural generation (legacy, for reference)
 */
const generateLevelData = (level: number): {
  targetSum: number;
  balloons: Balloon[];
  difficulty: Difficulty;
} => {
  const params = getDifficultyForLevel(level);
  
  // Generate target sum
  const targetSum = randomInt(params.sumRange.min, params.sumRange.max);
  
  // Generate solution partition
  const solutionValues = generatePartition(targetSum, params.solutionCount);
  
  // Generate distractors
  const distractorValues = generateDistractors(
    targetSum,
    params.distractorCount,
    solutionValues
  );
  
  // Combine and create balloon objects
  const allValues = [...solutionValues, ...distractorValues];
  const shuffledValues = shuffle(allValues);
  
  // Position balloons in vendor area (bottom of screen)
  const balloons: Balloon[] = shuffledValues.map((value, index) => {
    const col = index % 5;
    const row = Math.floor(index / 5);
    
    return {
      id: generateId(),
      value,
      color: getRandomColor(),
      x: 100 + col * 120,
      y: 450 + row * 100,
      isAttached: false,
    };
  });
  
  return {
    targetSum,
    balloons,
    difficulty: params.difficulty,
  };
};

// ============================================
// ZUSTAND STORE
// ============================================

export const useBalloonBlastoffStore = create<BalloonBlastoffStore>((set, get) => ({
  // Initial State
  currentLevel: 1,
  score: 0,
  gamePhase: 'menu',
  targetSum: 0,
  currentSum: 0,
  availableBalloons: [],
  attachedBalloons: [],
  difficulty: 'easy',
  totalRoundsPerSession: 20,
  roundsCompleted: 0,
  correctRounds: 0,
  celebrationStarted: false,
  levelStartTime: 0,
  totalAttempts: 0,
  correctAttempts: 0,

  // Actions
  startGame: (difficulty: Difficulty = 'easy') => {
    set({
      currentLevel: 1,
      score: 0,
      gamePhase: 'playing',
      celebrationStarted: false,
      totalAttempts: 0,
      correctAttempts: 0,
      difficulty: difficulty,
      roundsCompleted: 0,
      correctRounds: 0,
    });
    get().generateLevel();
  },

  generateLevel: () => {
    const { currentLevel, difficulty } = get();
    
    // Use selected difficulty params instead of level-based
    const params = getDifficultyParams(difficulty);
    
    // Generate target sum
    const targetSum = randomInt(params.sumRange.min, params.sumRange.max);
    
    // Generate solution partition
    const solutionValues = generatePartition(targetSum, params.solutionCount);
    
    // Generate distractors
    const distractorValues = generateDistractors(
      targetSum,
      params.distractorCount,
      solutionValues
    );
    
    // Combine and create balloon objects
    const allValues = [...solutionValues, ...distractorValues];
    const shuffledValues = shuffle(allValues);
    
    // Position balloons in vendor area
    const balloons: Balloon[] = shuffledValues.map((value, index) => {
      const col = index % 5;
      const row = Math.floor(index / 5);
      
      return {
        id: generateId(),
        value,
        color: getRandomColor(),
        x: 100 + col * 120,
        y: 450 + row * 100,
        isAttached: false,
      };
    });
    
    set({
      targetSum,
      availableBalloons: balloons,
      attachedBalloons: [],
      currentSum: 0,
      levelStartTime: Date.now(),
      gamePhase: 'playing',
    });
  },

  attachBalloon: (balloonId: string) => {
    const { availableBalloons, attachedBalloons, currentSum, gamePhase } = get();
    
    if (gamePhase !== 'playing') return;
    
    const balloon = availableBalloons.find((b) => b.id === balloonId);
    if (!balloon || balloon.isAttached) return;
    
    // Update balloon position for attached state
    const attachedCount = attachedBalloons.length;
    const attachedBalloon: Balloon = {
      ...balloon,
      isAttached: true,
      x: 350 + (attachedCount % 3) * 80,
      y: 180 - Math.floor(attachedCount / 3) * 90,
    };
    
    set({
      availableBalloons: availableBalloons.filter((b) => b.id !== balloonId),
      attachedBalloons: [...attachedBalloons, attachedBalloon],
      currentSum: currentSum + balloon.value,
      totalAttempts: get().totalAttempts + 1,
    });
    
    // Check if sum is correct
    setTimeout(() => get().checkSum(), 100);
  },

  detachBalloon: (balloonId: string) => {
    const { availableBalloons, attachedBalloons, currentSum, gamePhase } = get();
    
    if (gamePhase !== 'playing') return;
    
    const balloon = attachedBalloons.find((b) => b.id === balloonId);
    if (!balloon) return;
    
    // Return balloon to vendor area
    const vendorCount = availableBalloons.length;
    const detachedBalloon: Balloon = {
      ...balloon,
      isAttached: false,
      x: 100 + (vendorCount % 5) * 120,
      y: 450 + Math.floor(vendorCount / 5) * 100,
    };
    
    set({
      attachedBalloons: attachedBalloons.filter((b) => b.id !== balloonId),
      availableBalloons: [...availableBalloons, detachedBalloon],
      currentSum: currentSum - balloon.value,
    });
    
    // Check if sum is now correct after removal
    setTimeout(() => get().checkSum(), 100);
  },

  checkSum: (): boolean => {
    const { currentSum, targetSum, gamePhase } = get();
    
    if (gamePhase !== 'playing') return false;
    
    if (currentSum === targetSum) {
      set({ 
        gamePhase: 'floating',
        correctAttempts: get().correctAttempts + 1,
      });
      
      // Trigger success after floating animation
      setTimeout(() => {
        set({ gamePhase: 'success' });
      }, 2500);
      
      return true;
    }
    
    return false;
  },

  nextLevel: () => {
    const { currentLevel, correctRounds, roundsCompleted, totalRoundsPerSession } = get();
    
    // 100-Point Scorecard: 5 points per correct round (20 rounds = 100 max)
    const newCorrectRounds = correctRounds + 1;
    const newRoundsCompleted = roundsCompleted + 1;
    const newScore = Math.min(100, newCorrectRounds * 5);
    
    // Check if session complete (20 rounds)
    if (newRoundsCompleted >= totalRoundsPerSession) {
      set({
        correctRounds: newCorrectRounds,
        roundsCompleted: newRoundsCompleted,
        score: newScore,
        gamePhase: 'celebrating',
        celebrationStarted: true,
      });
    } else {
      set({
        currentLevel: currentLevel + 1,
        correctRounds: newCorrectRounds,
        roundsCompleted: newRoundsCompleted,
        score: newScore,
        gamePhase: 'playing',
      });
      get().generateLevel();
    }
  },

  resetGame: () => {
    set({
      currentLevel: 1,
      score: 0,
      gamePhase: 'menu',
      targetSum: 0,
      currentSum: 0,
      availableBalloons: [],
      attachedBalloons: [],
      difficulty: 'easy',
      roundsCompleted: 0,
      correctRounds: 0,
      celebrationStarted: false,
      levelStartTime: 0,
      totalAttempts: 0,
      correctAttempts: 0,
    });
  },

  setGamePhase: (phase: GamePhase) => {
    set({ gamePhase: phase });
  },

  startCelebration: () => {
    set({ 
      gamePhase: 'celebrating',
      celebrationStarted: true,
    });
  },

  getTelemetryLog: () => {
    const state = get();
    return {
      gameId: 'balloon-blastoff',
      level: state.currentLevel,
      score: state.score,
      difficulty: state.difficulty,
      targetSum: state.targetSum,
      balloonsUsed: state.attachedBalloons.length,
      totalAttempts: state.totalAttempts,
      correctAttempts: state.correctAttempts,
      accuracy: state.totalAttempts > 0 
        ? (state.correctAttempts / state.totalAttempts * 100).toFixed(1) 
        : 0,
      timeTaken: Date.now() - state.levelStartTime,
      timestamp: new Date().toISOString(),
    };
  },
}));
