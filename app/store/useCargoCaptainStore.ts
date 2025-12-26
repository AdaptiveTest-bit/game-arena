import { create } from 'zustand';

export interface CargoCaptainState {
  // Level dimensions
  containerLength: number; // L
  containerBreadth: number; // B
  containerHeight: number; // H
  targetVolume: number; // L × B × H

  // Game state
  gameState: 'menu' | 'estimating' | 'packing' | 'celebrating';
  gameStartTime: number;
  gameCompleted: boolean;
  celebrationStarted: boolean;

  // Estimation mode
  volumeGuess: number | null;
  guessCorrect: boolean;
  captainsBadgeEarned: boolean;

  // Packing mode
  currentLayer: number; // 0-indexed layer (0 to H-1)
  layersCellsPackaged: boolean[][]; // [layer][cellIndex]
  allLayersCompleted: boolean;

  // UI state
  layerAttempts: number;
  totalAttempts: number;
  showHint: boolean;
}

export interface CargoCaptainStore extends CargoCaptainState {
  // Level generation
  generateLevel: () => void;
  getTargetVolume: () => number;
  getCellsInLayer: () => number;

  // Estimation
  setVolumeGuess: (guess: number) => void;
  submitGuess: () => boolean; // Returns true if correct

  // Packing
  toggleCellInLayer: (cellIndex: number) => void;
  completeLayer: () => boolean; // Returns true if layer is full
  replicateLayer: () => void; // Auto-fill remaining layers
  advanceToNextLayer: () => void;
  resetCurrentLayer: () => void;

  // Celebration
  startCelebration: () => void;
  resetGame: () => void;

  // Utilities
  getAccuracy: () => number;
  getTelemetryLog: () => any;
}

export const useCargoCaptainStore = create<CargoCaptainStore>((set, get) => ({
  // Initial state
  containerLength: 3,
  containerBreadth: 2,
  containerHeight: 2,
  targetVolume: 12,

  gameState: 'menu',
  gameStartTime: 0,
  gameCompleted: false,
  celebrationStarted: false,

  volumeGuess: null,
  guessCorrect: false,
  captainsBadgeEarned: false,

  currentLayer: 0,
  layersCellsPackaged: [],
  allLayersCompleted: false,

  layerAttempts: 0,
  totalAttempts: 0,
  showHint: false,

  // Generate random level
  generateLevel: () => {
    const L = Math.floor(Math.random() * 4) + 3; // 3-6
    const B = Math.floor(Math.random() * 3) + 2; // 2-4
    const H = Math.floor(Math.random() * 4) + 2; // 2-5

    const targetVol = L * B * H;
    const cellsPerLayer = L * B;

    // Initialize layers grid (all empty initially)
    const layersCells: boolean[][] = [];
    for (let layer = 0; layer < H; layer++) {
      layersCells.push(new Array(cellsPerLayer).fill(false));
    }

    set({
      containerLength: L,
      containerBreadth: B,
      containerHeight: H,
      targetVolume: targetVol,
      currentLayer: 0,
      layersCellsPackaged: layersCells,
      gameStartTime: Date.now(),
      gameState: 'estimating',
      volumeGuess: null,
      guessCorrect: false,
      captainsBadgeEarned: false,
      layerAttempts: 0,
      totalAttempts: 0,
      allLayersCompleted: false,
      showHint: false,
    });
  },

  // Get target volume
  getTargetVolume: (): number => {
    const state = get();
    return state.containerLength * state.containerBreadth * state.containerHeight;
  },

  // Get cells in one layer
  getCellsInLayer: (): number => {
    const state = get();
    return state.containerLength * state.containerBreadth;
  },

  // Set volume guess
  setVolumeGuess: (guess: number) => {
    set({ volumeGuess: guess });
  },

  // Submit guess
  submitGuess: (): boolean => {
    const state = get();
    if (state.volumeGuess === null) return false;

    const isCorrect = state.volumeGuess === state.targetVolume;
    set({
      guessCorrect: isCorrect,
      captainsBadgeEarned: isCorrect,
      totalAttempts: state.totalAttempts + 1,
      gameState: 'packing',
    });

    return isCorrect;
  },

  // Toggle cell in current layer
  toggleCellInLayer: (cellIndex: number) => {
    const state = get();
    const newLayers = state.layersCellsPackaged.map((layer) => [...layer]);
    newLayers[state.currentLayer][cellIndex] = !newLayers[state.currentLayer][cellIndex];
    set({
      layersCellsPackaged: newLayers,
      totalAttempts: state.totalAttempts + 1,
    });
  },

  // Check if current layer is complete
  completeLayer: (): boolean => {
    const state = get();
    const currentLayerCells = state.layersCellsPackaged[state.currentLayer];
    const cellsInLayer = get().getCellsInLayer();
    const filledCells = currentLayerCells.filter((c) => c).length;

    if (filledCells === cellsInLayer) {
      set({ layerAttempts: 0 }); // Reset for next layer
      return true;
    }

    set({ layerAttempts: state.layerAttempts + 1 });
    return false;
  },

  // Replicate current layer to all remaining layers
  replicateLayer: () => {
    const state = get();
    const newLayers = state.layersCellsPackaged.map((layer) => [...layer]);
    const currentLayerPattern = newLayers[state.currentLayer];

    // Copy pattern to all remaining layers
    for (let i = state.currentLayer + 1; i < state.containerHeight; i++) {
      newLayers[i] = [...currentLayerPattern];
    }

    set({
      layersCellsPackaged: newLayers,
      allLayersCompleted: true,
      gameCompleted: true,
      totalAttempts: state.totalAttempts + 1,
    });
  },

  // Advance to next layer
  advanceToNextLayer: () => {
    const state = get();
    if (state.currentLayer < state.containerHeight - 1) {
      set({
        currentLayer: state.currentLayer + 1,
        layerAttempts: 0,
      });
    } else {
      // Last layer completed
      set({
        allLayersCompleted: true,
        gameCompleted: true,
      });
    }
  },

  // Reset current layer
  resetCurrentLayer: () => {
    const state = get();
    const newLayers = state.layersCellsPackaged.map((layer) => [...layer]);
    const cellsInLayer = get().getCellsInLayer();
    newLayers[state.currentLayer] = new Array(cellsInLayer).fill(false);

    set({
      layersCellsPackaged: newLayers,
      layerAttempts: 0,
    });
  },

  // Start celebration
  startCelebration: () => {
    set({ celebrationStarted: true, gameState: 'celebrating' });
  },

  // Reset game
  resetGame: () => {
    get().generateLevel();
  },

  // Calculate accuracy
  getAccuracy: (): number => {
    const state = get();
    if (state.gameState === 'estimating') return 0;

    const totalCells = state.targetVolume;
    let filledCells = 0;

    state.layersCellsPackaged.forEach((layer) => {
      filledCells += layer.filter((c) => c).length;
    });

    return Math.min(1.0, filledCells / totalCells);
  },

  // Generate telemetry
  getTelemetryLog: () => {
    const state = get();
    const timeTaken = Date.now() - state.gameStartTime;
    const accuracy = get().getAccuracy();

    return {
      student_id: 'test_user_1',
      game_id: 'cargo_captain_01',
      concept_tag: 'volume_packing_estimation',
      performance: {
        is_correct: state.gameCompleted && state.allLayersCompleted,
        accuracy_score: accuracy,
        time_taken_ms: timeTaken,
        container_dimensions: `${state.containerLength}×${state.containerBreadth}×${state.containerHeight}`,
        target_volume: state.targetVolume,
        guess_made: state.volumeGuess,
        guess_correct: state.guessCorrect,
        captains_badge: state.captainsBadgeEarned,
        layers_completed: state.allLayersCompleted ? state.containerHeight : state.currentLayer,
        total_attempts: state.totalAttempts,
      },
      interaction_trace: [
        {
          action: 'cargo_packing_complete',
          dimensions_l_b_h: [state.containerLength, state.containerBreadth, state.containerHeight],
          volume_calculated: state.targetVolume,
          all_layers_packed: state.allLayersCompleted,
          badge_earned: state.captainsBadgeEarned,
        },
      ],
    };
  },
}));
