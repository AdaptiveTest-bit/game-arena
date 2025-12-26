import { create } from 'zustand';

// Predefined fractions for procedural generation
const AVAILABLE_FRACTIONS = [
  { num: 5, den: 6, label: '5/6' },
  { num: 3, den: 4, label: '3/4' },
  { num: 7, den: 8, label: '7/8' },
  { num: 4, den: 5, label: '4/5' },
  { num: 5, den: 7, label: '5/7' },
  { num: 3, den: 5, label: '3/5' },
  { num: 7, den: 9, label: '7/9' },
  { num: 2, den: 3, label: '2/3' },
];

// Helper to generate random mission
const generateRandomMission = () => {
  // Pick a source fraction
  const sourceFrac = AVAILABLE_FRACTIONS[Math.floor(Math.random() * AVAILABLE_FRACTIONS.length)];
  const sourceLiters = sourceFrac.num / sourceFrac.den;
  
  // Pick a target that's less than source (create subtraction problem)
  const targetFrac = AVAILABLE_FRACTIONS[Math.floor(Math.random() * (AVAILABLE_FRACTIONS.length - 1))];
  let targetLiters = targetFrac.num / targetFrac.den;
  
  // Ensure target is less than source
  while (targetLiters >= sourceLiters) {
    const alt = AVAILABLE_FRACTIONS[Math.floor(Math.random() * AVAILABLE_FRACTIONS.length)];
    targetLiters = alt.num / alt.den;
  }
  
  return {
    sourceLiters,
    targetVolume: targetLiters,
    sourceLabel: sourceFrac.label,
    targetLabel: targetFrac.label,
  };
};

export interface LiquidState {
  sourceLiters: number;
  targetLiters: number;
  isPouring: boolean;
  startTime: number | null;
  gameStartTime: number;
  gameCompleted: boolean;
}

export interface LiquidGameStore extends LiquidState {
  // Constants
  sourceCapacity: number;
  targetCapacity: number;
  flowRate: number;
  targetVolume: number;
  tolerance: number;
  sourceLabel: string;
  targetLabel: string;

  // Actions
  startGame: () => void;
  startPouring: () => void;
  stopPouring: () => void;
  updateLiquidLevels: (deltaTime: number) => void;
  resetGame: () => void;
  getAccuracy: () => number;
  isWinConditionMet: () => boolean;
  getTelemetryLog: () => any;
}

const initialMission = generateRandomMission();

export const useLiquidGameStore = create<LiquidGameStore>((set, get) => ({
  // Initial state
  sourceLiters: initialMission.sourceLiters,
  targetLiters: 0,
  isPouring: false,
  startTime: null,
  gameStartTime: 0,
  gameCompleted: false,

  // Constants
  sourceCapacity: 1.0,
  targetCapacity: 0.5,
  flowRate: 0.1,
  targetVolume: initialMission.targetVolume,
  tolerance: 0.05,
  sourceLabel: initialMission.sourceLabel,
  targetLabel: initialMission.targetLabel,

  // Start the game
  startGame: () => {
    const mission = generateRandomMission();
    set({
      gameStartTime: Date.now(),
      gameCompleted: false,
      sourceLiters: mission.sourceLiters,
      targetLiters: 0,
      isPouring: false,
      startTime: null,
      targetVolume: mission.targetVolume,
      sourceLabel: mission.sourceLabel,
      targetLabel: mission.targetLabel,
    });
  },

  // Start pouring
  startPouring: () => {
    const state = get();
    if (!state.isPouring && state.sourceLiters > 0 && state.targetLiters < state.targetCapacity) {
      set({
        isPouring: true,
        startTime: Date.now(),
      });
    }
  },

  // Stop pouring
  stopPouring: () => {
    const state = get();
    if (state.isPouring) {
      set({
        isPouring: false,
        startTime: null,
      });

      // Check win condition
      if (state.isWinConditionMet()) {
        set({ gameCompleted: true });
      }
    }
  },

  // Update liquid levels based on elapsed time
  updateLiquidLevels: (deltaTime: number) => {
    const state = get();

    if (!state.isPouring || state.sourceLiters <= 0) {
      set({ isPouring: false });
      return;
    }

    // Calculate amount to transfer
    const transferAmount = state.flowRate * (deltaTime / 1000); // deltaTime in ms

    // Calculate new levels
    let newSourceLiters = Math.max(0, state.sourceLiters - transferAmount);
    let newTargetLiters = Math.min(
      state.targetCapacity,
      state.targetLiters + transferAmount
    );

    // Ensure conservation
    const actualTransfer = state.sourceLiters - newSourceLiters;
    newTargetLiters = state.targetLiters + actualTransfer;

    set({
      sourceLiters: parseFloat(newSourceLiters.toFixed(4)),
      targetLiters: parseFloat(newTargetLiters.toFixed(4)),
    });
  },

  // Reset the game
  resetGame: () => {
    set({
      sourceLiters: 5 / 6,
      targetLiters: 0,
      isPouring: false,
      startTime: null,
      gameStartTime: 0,
      gameCompleted: false,
    });
  },

  // Check if win condition is met
  isWinConditionMet: () => {
    const state = get();
    const { targetVolume, tolerance, targetLiters } = state;
    return Math.abs(targetLiters - targetVolume) <= tolerance;
  },

  // Get accuracy score
  getAccuracy: () => {
    const state = get();
    const { targetVolume, targetLiters, tolerance } = state;
    const error = Math.abs(targetLiters - targetVolume);
    return Math.max(0, 1.0 - error / tolerance);
  },

  // Generate telemetry log
  getTelemetryLog: () => {
    const state = get();
    const timeTaken = Date.now() - state.gameStartTime;
    const accuracy = state.getAccuracy();
    const isCorrect = state.isWinConditionMet();

    return {
      student_id: 'test_user_1',
      game_id: 'liquid_lab_01',
      concept_tag: 'fraction_subtraction_unlike_denominators',
      performance: {
        is_correct: isCorrect,
        accuracy_score: accuracy,
        time_taken_ms: timeTaken,
        target_volume: (state.targetVolume).toFixed(4),
        actual_volume: state.targetLiters.toFixed(4),
        error: Math.abs(state.targetLiters - state.targetVolume).toFixed(4),
      },
      interaction_trace: [
        {
          action: 'pour',
          duration_ms: timeTaken,
          source_final: state.sourceLiters.toFixed(4),
          target_final: state.targetLiters.toFixed(4),
        },
      ],
    };
  },
}));
