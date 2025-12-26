import { create } from 'zustand';

export interface GridCell {
  row: number;
  col: number;
  isActive: boolean;
}

export interface SymmetryState {
  // Grid dimensions
  gridSize: number; // 10x10
  
  // Grid data: flat array of 100 cells (10x10)
  leftSide: boolean[]; // Columns 0-4 (read-only pattern)
  rightSide: boolean[]; // Columns 5-9 (user editable)
  
  gameStartTime: number;
  gameCompleted: boolean;
  isCorrect: boolean;
  shieldLocked: boolean; // Animation state
  levelAttempts: number;
}

export interface SymmetryShieldStore extends SymmetryState {
  // Constants
  gridWidth: number;
  gridHeight: number;
  cellSize: number;
  symmetryAxis: number; // Column 4.5 (center)

  // Actions
  startGame: () => void;
  toggleCell: (row: number, col: number) => void;
  resetGrid: () => void;
  validateSymmetry: () => boolean;
  activateShield: () => void;
  
  // Getters
  getLeftCell: (row: number, col: number) => boolean;
  getRightCell: (row: number, col: number) => boolean;
  getGridAsArray: () => boolean[][];
  getAccuracy: () => number;
  getTelemetryLog: () => any;
}

export const useSymmetryShieldStore = create<SymmetryShieldStore>((set, get) => ({
  // Initial state
  gridSize: 10,
  leftSide: Array(50).fill(false),
  rightSide: Array(50).fill(false),
  gameStartTime: 0,
  gameCompleted: false,
  isCorrect: false,
  shieldLocked: false,
  levelAttempts: 0,

  // Constants
  gridWidth: 10,
  gridHeight: 10,
  cellSize: 40,
  symmetryAxis: 4.5,

  // Start the game
  startGame: () => {
    const state = get();
    
    // Generate random left-side pattern (50% chance each cell is ON)
    const newLeftSide = Array(50)
      .fill(0)
      .map(() => Math.random() > 0.5);

    set({
      leftSide: newLeftSide,
      rightSide: Array(50).fill(false), // Reset right side to empty
      gameStartTime: Date.now(),
      gameCompleted: false,
      isCorrect: false,
      shieldLocked: false,
      levelAttempts: 0,
    });
  },

  // Toggle a cell on the right side
  toggleCell: (row: number, col: number) => {
    // Only allow editing on right side (columns 5-9)
    if (col < 5 || col > 9) {
      console.warn('Cannot edit left side (read-only)');
      return;
    }

    const state = get();
    const cellIndex = row * 5 + (col - 5); // Index within rightSide array
    const newRightSide = [...state.rightSide];
    newRightSide[cellIndex] = !newRightSide[cellIndex];

    set({ rightSide: newRightSide });
  },

  // Reset right side to empty
  resetGrid: () => {
    set({
      rightSide: Array(50).fill(false),
      shieldLocked: false,
    });
  },

  // Validate if right side mirrors left side
  validateSymmetry: () => {
    const state = get();
    
    // Check each cell on right side
    for (let row = 0; row < 10; row++) {
      for (let col = 5; col < 10; col++) {
        // Index in rightSide array (0-49)
        const rightIndex = row * 5 + (col - 5);
        
        // Mirror position on left side
        // If right col is 5, it mirrors left col 4
        // If right col is 6, it mirrors left col 3
        // If right col is 7, it mirrors left col 2
        // If right col is 8, it mirrors left col 1
        // If right col is 9, it mirrors left col 0
        const mirrorCol = 9 - col; // 0-4
        const leftIndex = row * 5 + mirrorCol;

        // Compare
        if (state.rightSide[rightIndex] !== state.leftSide[leftIndex]) {
          return false;
        }
      }
    }
    
    return true;
  },

  // Activate shield (validate and lock)
  activateShield: () => {
    const state = get();
    const isValid = state.validateSymmetry();

    set({
      gameCompleted: true,
      isCorrect: isValid,
      shieldLocked: isValid,
      levelAttempts: state.levelAttempts + 1,
    });
  },

  // Get left side cell state
  getLeftCell: (row: number, col: number) => {
    const state = get();
    if (col < 0 || col > 4) return false;
    const index = row * 5 + col;
    return state.leftSide[index] || false;
  },

  // Get right side cell state
  getRightCell: (row: number, col: number) => {
    const state = get();
    if (col < 5 || col > 9) return false;
    const index = row * 5 + (col - 5);
    return state.rightSide[index] || false;
  },

  // Convert grid to 2D array for easier visualization
  getGridAsArray: () => {
    const state = get();
    const grid: boolean[][] = [];

    for (let row = 0; row < 10; row++) {
      const gridRow: boolean[] = [];
      
      // Left side (columns 0-4)
      for (let col = 0; col < 5; col++) {
        const index = row * 5 + col;
        gridRow.push(state.leftSide[index] || false);
      }
      
      // Right side (columns 5-9)
      for (let col = 0; col < 5; col++) {
        gridRow.push(state.rightSide[row * 5 + col] || false);
      }
      
      grid.push(gridRow);
    }

    return grid;
  },

  // Calculate accuracy (how many right-side cells match their mirror)
  getAccuracy: () => {
    const state = get();
    let matchCount = 0;
    let totalCells = 0;

    for (let row = 0; row < 10; row++) {
      for (let col = 5; col < 10; col++) {
        totalCells++;
        const rightIndex = row * 5 + (col - 5);
        const mirrorCol = 9 - col;
        const leftIndex = row * 5 + mirrorCol;

        if (state.rightSide[rightIndex] === state.leftSide[leftIndex]) {
          matchCount++;
        }
      }
    }

    return totalCells > 0 ? matchCount / totalCells : 0;
  },

  // Generate telemetry log
  getTelemetryLog: () => {
    const state = get();
    const timeTaken = Date.now() - state.gameStartTime;
    const accuracy = state.getAccuracy();

    return {
      student_id: 'test_user_1',
      game_id: 'symmetry_shield_01',
      concept_tag: 'reflection_symmetry',
      performance: {
        is_correct: state.isCorrect,
        accuracy_score: accuracy,
        time_taken_ms: timeTaken,
        level_attempts: state.levelAttempts,
        grid_complexity: Math.round(state.leftSide.filter(Boolean).length / 50 * 100),
      },
      interaction_trace: [
        {
          action: 'shield_activation',
          is_symmetric: state.isCorrect,
          accuracy_percentage: Math.round(accuracy * 100),
          cells_activated: state.rightSide.filter(Boolean).length,
        },
      ],
    };
  },
}));
