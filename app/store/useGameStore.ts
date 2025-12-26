import { create } from 'zustand';

export interface CutLocation {
  location: number;
  timestamp: number;
  isValid: boolean;
}

export interface GameConfig {
  totalLength: number;
  targetPieceSize: number;
  requiredCuts: number;
  expectedCutPositions: number[];
}

export interface GameState {
  // Game config
  totalLength: number;
  targetPieceSize: number;
  tolerance: number; // 0.2m
  requiredCuts: number;
  expectedCutPositions: number[];

  // Game state
  cuts: CutLocation[];
  gameStartTime: number;
  gameCompleted: boolean;
  correctCuts: number;

  // Actions
  startGame: () => void;
  makeCut: (location: number) => boolean;
  resetGame: () => void;
  completeGame: () => void;
  getExpectedCutPositions: () => number[];
  isCorrectCut: (location: number) => boolean;
  getTelemetryLog: () => any;
}

// Helper function to generate random game config
const generateRandomConfig = (): GameConfig => {
  const totalLength = Math.floor(Math.random() * 8) + 12; // 12-20 meters
  const numPieces = Math.floor(Math.random() * 3) + 4; // 4-6 pieces
  const targetPieceSize = totalLength / numPieces;
  const requiredCuts = numPieces - 1;
  
  // Generate cut positions
  const expectedCutPositions: number[] = [];
  for (let i = 1; i < numPieces; i++) {
    expectedCutPositions.push(targetPieceSize * i);
  }
  
  return { totalLength, targetPieceSize, requiredCuts, expectedCutPositions };
};

export const useGameStore = create<GameState>((set, get) => {
  const initialConfig = generateRandomConfig();
  
  return {
  // Initial state
  totalLength: initialConfig.totalLength,
  targetPieceSize: initialConfig.targetPieceSize,
  tolerance: 0.2,
  requiredCuts: initialConfig.requiredCuts,
  expectedCutPositions: initialConfig.expectedCutPositions,

  cuts: [],
  gameStartTime: 0,
  gameCompleted: false,
  correctCuts: 0,

  // Start the game
  startGame: () => {
    const state = get();
    set({
      gameStartTime: Date.now(),
      gameCompleted: false,
      cuts: [],
      correctCuts: 0,
    });
  },

  // Make a cut at a specific location
  makeCut: (location: number) => {
    const state = get();

    // Validate cut is within rope bounds
    if (location < 0 || location > state.totalLength) {
      return false;
    }

    // Prevent duplicate cuts at same location
    const isDuplicate = state.cuts.some(
      (cut) => Math.abs(cut.location - location) < 0.1
    );
    if (isDuplicate) {
      return false;
    }

    // Check if cut is valid (within tolerance of an expected position)
    const isValid = state.isCorrectCut(location);

    const newCut: CutLocation = {
      location,
      timestamp: Date.now() - state.gameStartTime,
      isValid,
    };

    const newCuts = [...state.cuts, newCut];
    const newCorrectCuts = isValid ? state.correctCuts + 1 : state.correctCuts;

    set({
      cuts: newCuts,
      correctCuts: newCorrectCuts,
      gameCompleted: newCorrectCuts === state.requiredCuts,
    });

    return isValid;
  },

  // Check if a cut location is correct
  isCorrectCut: (location: number) => {
    const state = get();
    return state.expectedCutPositions.some(
      (expected: number) => Math.abs(location - expected) <= state.tolerance
    );
  },

  // Get expected cut positions
  getExpectedCutPositions: () => {
    const state = get();
    return state.expectedCutPositions;
  },

  // Reset the game
  resetGame: () => {
    set({
      cuts: [],
      gameStartTime: 0,
      gameCompleted: false,
      correctCuts: 0,
    });
  },

  // Complete the game
  completeGame: () => {
    set({ gameCompleted: true });
  },

  // Generate telemetry log
  getTelemetryLog: () => {
    const state = get();
    const timeTaken = Date.now() - state.gameStartTime;

    // Determine error type
    let errorType: 'precision_error' | 'conceptual_error' | null = null;
    if (state.correctCuts < state.requiredCuts) {
      // Check if cuts are random (conceptual) or near targets (precision)
      const hasCloseAttempts = state.cuts.some((cut) => {
        return !cut.isValid && state.expectedCutPositions.some(
          (expected: number) => Math.abs(cut.location - expected) <= 0.5
        );
      });
      errorType = hasCloseAttempts ? 'precision_error' : 'conceptual_error';
    }

    // Calculate accuracy score (0.0 to 1.0)
    const accuracyScore = state.requiredCuts > 0 
      ? state.correctCuts / state.requiredCuts 
      : 0;

    return {
      student_id: 'test_user_1',
      game_id: 'rope_cutter_01',
      concept_tag: 'mixed_fraction_division',
      performance: {
        is_correct: state.gameCompleted,
        accuracy_score: accuracyScore,
        time_taken_ms: timeTaken,
        error_type: errorType,
      },
      interaction_trace: state.cuts.map((cut) => ({
        action: 'cut',
        location: parseFloat(cut.location.toFixed(2)),
        timestamp: cut.timestamp,
        is_valid: cut.isValid,
      })),
    };
  },
  };
});
