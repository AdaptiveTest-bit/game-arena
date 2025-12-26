import { create } from 'zustand';

export interface FactorPair {
  width: number;
  height: number;
  area: number;
}

export interface FactorFactoryState {
  targetNumber: number;
  foundFactors: FactorPair[];
  currentSelection: {
    width: number | null;
    height: number | null;
    isValid: boolean;
  };
  gameStartTime: number;
  gameCompleted: boolean;
  gameState: 'menu' | 'playing' | 'celebrating';
  levelAttempts: number;
  strictMode: boolean; // If true: 3x4 and 4x3 are different. If false: they're the same
  celebrationStarted: boolean;
  isCorrect: boolean;
}

export interface FactorFactoryStore extends FactorFactoryState {
  // Actions
  startGame: (targetNumber?: number, strictMode?: boolean) => void;
  setCurrentSelection: (width: number, height: number) => void;
  clearSelection: () => void;
  submitRectangle: () => boolean; // Returns true if valid and new
  resetGame: () => void;
  validateFactor: (width: number, height: number) => boolean;
  getAllFactorPairs: (num: number) => FactorPair[];
  isGameWon: () => boolean;
  getAccuracy: () => number;
  startCelebration: () => void;
  getTelemetryLog: () => any;
}
// Composite numbers with manageable factor counts
const COMPOSITE_NUMBERS = [12, 18, 20, 24, 28, 30, 36, 40, 42, 48];

// Helper to generate random composite number
const generateRandomComposite = (): number => {
  return COMPOSITE_NUMBERS[Math.floor(Math.random() * COMPOSITE_NUMBERS.length)];
};

export const useFactorFactoryStore = create<FactorFactoryStore>((set, get) => {
  const initialTarget = generateRandomComposite();
  
  return {
  // Initial state
  targetNumber: initialTarget,
  foundFactors: [],
  currentSelection: {
    width: null,
    height: null,
    isValid: false,
  },
  gameStartTime: 0,
  gameCompleted: false,
  gameState: 'menu',
  levelAttempts: 0,
  strictMode: false,
  celebrationStarted: false,
  isCorrect: false,

  // Get all factor pairs for a number
  getAllFactorPairs: (num: number): FactorPair[] => {
    const pairs: FactorPair[] = [];
    for (let i = 1; i <= Math.sqrt(num); i++) {
      if (num % i === 0) {
        const divisor = num / i;
        pairs.push({ width: i, height: divisor, area: num });
        if (i !== divisor) {
          pairs.push({ width: divisor, height: i, area: num });
        }
      }
    }
    // Sort by width for better UX
    return pairs.sort((a, b) => a.width - b.width);
  },

  // Validate a factor pair
  validateFactor: (width: number, height: number): boolean => {
    const state = get();
    return width * height === state.targetNumber && width > 0 && height > 0;
  },

  // Start the game
  startGame: (targetNumber?: number, strictMode = false) => {
    const target = targetNumber || generateRandomComposite();
    const allPairs = get().getAllFactorPairs(target);
    set({
      targetNumber: target,
      strictMode,
      foundFactors: [],
      gameStartTime: Date.now(),
      gameCompleted: false,
      gameState: 'playing',
      levelAttempts: 0,
      currentSelection: { width: null, height: null, isValid: false },
      celebrationStarted: false,
      isCorrect: false,
    });
  },

  // Set current selection
  setCurrentSelection: (width: number, height: number) => {
    const state = get();
    const isValid = state.validateFactor(width, height);

    set({
      currentSelection: {
        width,
        height,
        isValid,
      },
    });
  },

  // Clear selection
  clearSelection: () => {
    set({
      currentSelection: {
        width: null,
        height: null,
        isValid: false,
      },
    });
  },

  // Submit rectangle
  submitRectangle: (): boolean => {
    const state = get();
    const { width, height, isValid } = state.currentSelection;

    if (!isValid || width === null || height === null) {
      // Invalid selection
      set({ levelAttempts: state.levelAttempts + 1 });
      return false;
    }

    // Check if already found (considering strictMode)
    const alreadyFound = state.foundFactors.some((f) => {
      if (state.strictMode) {
        // Strict mode: 3x4 and 4x3 are different
        return f.width === width && f.height === height;
      } else {
        // Normal mode: 3x4 and 4x3 are the same
        return (
          (f.width === width && f.height === height) ||
          (f.width === height && f.height === width)
        );
      }
    });

    if (alreadyFound) {
      set({ levelAttempts: state.levelAttempts + 1 });
      return false; // Already found
    }

    // New factor pair found!
    const newFactor: FactorPair = {
      width,
      height,
      area: state.targetNumber,
    };

    const updatedFactors = [...state.foundFactors, newFactor];
    const won = get().isGameWon();

    set({
      foundFactors: updatedFactors,
      levelAttempts: state.levelAttempts + 1,
      gameCompleted: won,
      isCorrect: won,
    });

    return true; // Success
  },

  // Check if game is won
  isGameWon: (): boolean => {
    const state = get();
    const allPairs = state.getAllFactorPairs(state.targetNumber);

    if (state.strictMode) {
      // Strict mode: must find all ordered pairs
      return state.foundFactors.length === allPairs.length;
    } else {
      // Normal mode: must find all unique factor pairs (regardless of order)
      const uniquePairs = new Set<string>();
      allPairs.forEach((p) => {
        const key = [Math.min(p.width, p.height), Math.max(p.width, p.height)].join(',');
        uniquePairs.add(key);
      });
      const foundPairs = new Set<string>();
      state.foundFactors.forEach((p) => {
        const key = [Math.min(p.width, p.height), Math.max(p.width, p.height)].join(',');
        foundPairs.add(key);
      });
      return foundPairs.size === uniquePairs.size;
    }
  },

  // Reset game
  resetGame: () => {
    set({
      foundFactors: [],
      gameCompleted: false,
      levelAttempts: 0,
      currentSelection: { width: null, height: null, isValid: false },
    });
  },

  // Get accuracy score
  getAccuracy: (): number => {
    const state = get();
    const allPairs = state.getAllFactorPairs(state.targetNumber);

    if (state.strictMode) {
      return state.foundFactors.length / allPairs.length;
    } else {
      const uniquePairs = new Set<string>();
      allPairs.forEach((p) => {
        const key = [Math.min(p.width, p.height), Math.max(p.width, p.height)].join(',');
        uniquePairs.add(key);
      });
      const foundPairs = new Set<string>();
      state.foundFactors.forEach((p) => {
        const key = [Math.min(p.width, p.height), Math.max(p.width, p.height)].join(',');
        foundPairs.add(key);
      });
      return foundPairs.size / uniquePairs.size;
    }
  },

  // Start celebration
  startCelebration: () => {
    set({ celebrationStarted: true, gameState: 'celebrating' });
  },

  // Generate telemetry log
  getTelemetryLog: () => {
    const state = get();
    const timeTaken = Date.now() - state.gameStartTime;
    const accuracy = state.getAccuracy();
    const allPairs = state.getAllFactorPairs(state.targetNumber);

    return {
      student_id: 'test_user_1',
      game_id: 'factor_factory_01',
      concept_tag: 'factors_rectangular_arrays',
      performance: {
        is_correct: state.isCorrect,
        accuracy_score: accuracy,
        time_taken_ms: timeTaken,
        target_number: state.targetNumber,
        factors_found: state.foundFactors.length,
        total_factor_pairs: allPairs.length,
        attempts: state.levelAttempts,
        strict_mode: state.strictMode,
      },
      interaction_trace: [
        {
          action: 'factory_completion',
          rectangles_found: state.foundFactors.map((f) => `${f.width}x${f.height}`),
          total_attempts: state.levelAttempts,
          is_prime: allPairs.length === 2, // Only 1xN pairs
        },
      ],
    };
  },
  };
});
