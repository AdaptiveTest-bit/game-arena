import { create } from 'zustand';

export interface FractionPlank {
  id: string;
  numerator: number;
  denominator: number;
  label: string;
}

export interface BridgeGameState {
  // Game config
  planks: FractionPlank[];
  correctOrder: FractionPlank[];

  // Game state
  currentOrder: string[];
  gameStartTime: number;
  gameCompleted: boolean;
  isSuccess: boolean;
  bridgeShaking: boolean;

  // Actions
  startGame: () => void;
  reorderPlanks: (newOrder: string[]) => void;
  validateBridge: () => boolean;
  setBridgeShaking: (shaking: boolean) => void;
  resetGame: () => void;
  getTelemetryLog: () => any;
}

// Helper to generate random fractions
const generateRandomFractions = (): FractionPlank[] => {
  const denominator = Math.random() > 0.5 ? 12 : (Math.random() > 0.5 ? 8 : 10);
  const numerators = new Set<number>();
  
  // Generate 5 unique numerators less than denominator
  while (numerators.size < 5) {
    const num = Math.floor(Math.random() * denominator) + 1;
    if (num < denominator) numerators.add(num);
  }
  
  const numArray = Array.from(numerators).sort(() => Math.random() - 0.5);
  
  return numArray.map((num, idx) => ({
    id: `plank-${idx + 1}`,
    numerator: num,
    denominator,
    label: `${num}/${denominator}`,
  }));
};

export const useFractionBridgeStore = create<BridgeGameState>((set, get) => {
  const initialPlanks = generateRandomFractions();
  const correctOrder = [...initialPlanks].sort((a, b) => (b.numerator / b.denominator) - (a.numerator / a.denominator));
  
  return {
  // Initial state
  planks: initialPlanks,
  correctOrder,
  currentOrder: [],
  gameStartTime: 0,
  gameCompleted: false,
  isSuccess: false,
  bridgeShaking: false,

  // Start the game
  startGame: () => {
    const newPlanks = generateRandomFractions();
    const newCorrectOrder = [...newPlanks].sort((a, b) => (b.numerator / b.denominator) - (a.numerator / a.denominator));
    
    set({
      planks: newPlanks,
      correctOrder: newCorrectOrder,
      gameStartTime: Date.now(),
      gameCompleted: false,
      isSuccess: false,
      currentOrder: [],
      bridgeShaking: false,
    });
  },

  // Update the order of planks
  reorderPlanks: (newOrder: string[]) => {
    set({ currentOrder: newOrder });
  },

  // Validate if the bridge order is correct
  validateBridge: () => {
    const state = get();
    const correctIds = state.correctOrder.map((p) => p.id);

    // Check if all planks are placed
    if (state.currentOrder.length !== correctIds.length) {
      return false;
    }

    // Check if order matches
    return state.currentOrder.every((id, idx) => id === correctIds[idx]);
  },

  // Set bridge shaking state
  setBridgeShaking: (shaking: boolean) => {
    set({ bridgeShaking: shaking });
  },

  // Reset the game
  resetGame: () => {
    set({
      currentOrder: [],
      gameStartTime: 0,
      gameCompleted: false,
      isSuccess: false,
      bridgeShaking: false,
    });
  },

  // Generate telemetry log
  getTelemetryLog: () => {
    const state = get();
    const timeTaken = Date.now() - state.gameStartTime;

    // Determine error type
    let errorType: 'ordering_error' | 'incomplete_bridge' | null = null;
    if (!state.isSuccess) {
      if (state.currentOrder.length < state.correctOrder.length) {
        errorType = 'incomplete_bridge';
      } else {
        errorType = 'ordering_error';
      }
    }

    // Calculate accuracy: how many planks are in correct position
    let correctPositions = 0;
    state.currentOrder.forEach((id, idx) => {
      if (id === state.correctOrder[idx].id) {
        correctPositions++;
      }
    });
    const accuracyScore =
      state.currentOrder.length > 0
        ? correctPositions / state.currentOrder.length
        : 0;

    return {
      student_id: 'test_user_1',
      game_id: 'fraction_bridge_01',
      concept_tag: 'fractions_ordering_comparison',
      performance: {
        is_correct: state.isSuccess,
        accuracy_score: accuracyScore,
        time_taken_ms: timeTaken,
        error_type: errorType,
        planks_placed: state.currentOrder.length,
        total_planks: state.correctOrder.length,
      },
      interaction_trace: [
        {
          action: 'bridge_validation',
          final_order: state.currentOrder,
          is_correct: state.isSuccess,
          correct_order: state.correctOrder.map((p) => p.id),
        },
      ],
    };
  },
  };
});
