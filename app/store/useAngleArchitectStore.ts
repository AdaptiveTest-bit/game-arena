import { create } from 'zustand';

export interface AngleState {
  currentAngle: number; // 0-360
  targetAngle: number; // 0-360
  isRotating: boolean;
  gameCompleted: boolean;
  celebrationStarted: boolean; // Track celebration phase
  gameStartTime: number;
  isDragging: boolean;
}

export interface AngleArchitectStore extends AngleState {
  // Constants
  tolerance: number; // ±5 degrees
  snapIncrement: number; // Snap to nearest 5°
  bridgeLength: number; // Length of the bridge arm (px)
  
  // Level management
  currentLevel: 'direct' | 'blind';
  showTarget: boolean;

  // Actions
  startGame: (level?: 'direct' | 'blind') => void;
  setCurrentAngle: (angle: number) => void;
  startDrag: () => void;
  stopDrag: () => void;
  startCelebration: () => void;
  resetGame: () => void;
  
  // Getters
  getAngleClassification: () => 'Acute' | 'Right' | 'Obtuse';
  getAngleClassificationColor: () => string;
  isWithinTolerance: () => boolean;
  getAccuracy: () => number;
  getTelemetryLog: () => any;
}

export const useAngleArchitectStore = create<AngleArchitectStore>((set, get) => ({
  // Initial state
  currentAngle: 0,
  targetAngle: 90, // Start with right angle
  isRotating: false,
  gameCompleted: false,
  celebrationStarted: false,
  gameStartTime: 0,
  isDragging: false,

  // Constants
  tolerance: 5, // ±5 degrees
  snapIncrement: 5, // Snap to nearest 5°
  bridgeLength: 180, // pixels

  // Level management
  currentLevel: 'direct',
  showTarget: true,

  // Start the game
  startGame: (level = 'direct') => {
    // Generate random target angle based on level
    let targetAngle: number;
    
    if (level === 'direct') {
      // Direct mode: Pick from common angles (45°, 90°, 135°, 180°)
      const targets = [45, 90, 135, 180];
      targetAngle = targets[Math.floor(Math.random() * targets.length)];
    } else {
      // Blind mode: Pick random angle between 30° and 330°
      targetAngle = Math.floor(Math.random() * 30 + 30) * Math.floor(Math.random() * 11); // Varied angles
      // Ensure it's a multiple of 5 for fairness
      targetAngle = Math.round(targetAngle / 5) * 5;
      targetAngle = Math.max(30, Math.min(330, targetAngle));
    }

    set({
      currentAngle: 0,
      targetAngle,
      isRotating: false,
      gameCompleted: false,
      celebrationStarted: false,
      gameStartTime: Date.now(),
      isDragging: false,
      currentLevel: level,
      showTarget: level === 'direct',
    });
  },

  // Set current angle (from drag)
  setCurrentAngle: (angle: number) => {
    // Snap to nearest increment
    const snapIncrement = get().snapIncrement;
    const snappedAngle = Math.round(angle / snapIncrement) * snapIncrement;
    
    // Normalize to 0-360
    const normalizedAngle = ((snappedAngle % 360) + 360) % 360;

    set({ currentAngle: normalizedAngle });

    // Check win condition
    if (get().isWithinTolerance()) {
      set({ gameCompleted: true, isRotating: false, isDragging: false });
    }
  },

  // Start dragging
  startDrag: () => {
    set({ isDragging: true, isRotating: true });
  },

  // Stop dragging
  stopDrag: () => {
    set({ isDragging: false });
    
    // Check if within tolerance on release
    const state = get();
    if (state.isWithinTolerance()) {
      set({ gameCompleted: true, isRotating: false });
    }
  },

  // Start celebration (called after 2 second delay)
  startCelebration: () => {
    set({ celebrationStarted: true });
  },

  // Reset the game
  resetGame: () => {
    set({
      currentAngle: 0,
      isRotating: false,
      gameCompleted: false,
      isDragging: false,
    });
  },

  // Classify angle type
  getAngleClassification: () => {
    const angle = get().currentAngle;
    if (angle < 90) return 'Acute';
    if (angle === 90) return 'Right';
    if (angle > 90 && angle < 180) return 'Obtuse';
    if (angle === 180) return 'Obtuse'; // Straight angle (180°)
    return 'Acute'; // Reflex angles wrap back
  },

  // Get color for angle classification
  getAngleClassificationColor: () => {
    const classification = get().getAngleClassification();
    if (classification === 'Acute') return '#3B82F6'; // Blue
    if (classification === 'Right') return '#10B981'; // Green
    return '#F97316'; // Orange
  },

  // Check if within tolerance
  isWithinTolerance: () => {
    const state = get();
    const diff = Math.min(
      Math.abs(state.currentAngle - state.targetAngle),
      360 - Math.abs(state.currentAngle - state.targetAngle)
    );
    return diff <= state.tolerance;
  },

  // Get accuracy score (0.0 to 1.0)
  getAccuracy: () => {
    const state = get();
    const diff = Math.min(
      Math.abs(state.currentAngle - state.targetAngle),
      360 - Math.abs(state.currentAngle - state.targetAngle)
    );
    const accuracy = Math.max(0, 1.0 - diff / (state.tolerance * 2));
    return parseFloat(accuracy.toFixed(2));
  },

  // Generate telemetry log
  getTelemetryLog: () => {
    const state = get();
    const timeTaken = Date.now() - state.gameStartTime;
    const accuracy = state.getAccuracy();
    const isCorrect = state.isWithinTolerance();
    
    const targetClassification = 
      state.targetAngle < 90 ? 'Acute' :
      state.targetAngle === 90 ? 'Right' :
      state.targetAngle > 90 && state.targetAngle < 180 ? 'Obtuse' :
      'Obtuse';

    return {
      student_id: 'test_user_1',
      game_id: 'angle_architect_01',
      concept_tag: 'angles_and_rotation',
      level: state.currentLevel,
      performance: {
        is_correct: isCorrect,
        accuracy_score: accuracy,
        time_taken_ms: timeTaken,
        target_angle: state.targetAngle,
        actual_angle: state.currentAngle,
        target_classification: targetClassification,
        current_classification: state.getAngleClassification(),
        error_degrees: Math.min(
          Math.abs(state.currentAngle - state.targetAngle),
          360 - Math.abs(state.currentAngle - state.targetAngle)
        ),
      },
      interaction_trace: [
        {
          action: 'rotation_complete',
          final_angle: state.currentAngle,
          target_angle: state.targetAngle,
          tolerance_met: isCorrect,
        },
      ],
    };
  },
}));
