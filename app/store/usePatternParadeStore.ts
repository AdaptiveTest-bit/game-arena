import { create } from 'zustand';
import {
  GameMode,
  DifficultyLevel,
  PatternItem,
  TrainCar,
  RoundConfig,
  generateRoundConfig,
  validateAnswer,
  getHint,
  validateCreatedPattern,
} from '../utils/patternUtils';

// ============== INTERFACES ==============

export interface AttemptLog {
  timestamp: number;
  round: number;
  action: 'select' | 'drag' | 'drop' | 'submit' | 'rule-select' | 'growth-select';
  itemId?: string;
  fromPosition?: number;
  toPosition?: number;
  selectedValue?: string | number;
  isCorrect: boolean;
}

export interface PatternParadeState {
  // Game Configuration
  currentMode: GameMode;
  difficulty: DifficultyLevel;
  roundConfig: RoundConfig | null;
  
  // Progress Tracking
  currentRound: number;
  totalRounds: number;
  score: number;
  streak: number;
  maxStreak: number;
  
  // Round State
  selectedRule: string | null;
  selectedGrowthCount: number | null;
  isRoundComplete: boolean;
  isCorrect: boolean;
  showFeedback: boolean;
  feedbackMessage: string;
  hasAttempted: boolean; // Track if user has attempted current round
  wrongAttempts: number; // Track number of wrong attempts for retry logic
  
  // Session Tracking
  gameStartTime: number;
  roundStartTime: number;
  attempts: AttemptLog[];
  roundsCorrect: number;
  
  // Celebration State
  showCelebration: boolean;
  celebrationType: 'correct' | 'streak' | 'complete' | null;

  // ============== ACTIONS ==============
  
  // Game Flow
  startGame: (mode: GameMode, difficulty: DifficultyLevel) => void;
  generateRound: () => void;
  submitAnswer: () => void;
  nextRound: () => void;
  skipRound: () => void; // Skip to next round after wrong answer
  tryAgain: () => void; // Clear wrong answer and try again
  resetGame: () => void;
  
  // Player Actions
  placeItem: (item: PatternItem, carIndex: number) => void;
  removeItem: (carIndex: number) => void;
  selectPatternRule: (ruleId: string) => void;
  selectGrowthAnswer: (count: number) => void;
  
  // Utilities
  getHintText: () => string;
  getTelemetryLog: () => object;
  hideFeedback: () => void;
  hideCelebration: () => void;
}

// ============== STORE ==============

export const usePatternParadeStore = create<PatternParadeState>((set, get) => ({
  // Initial State
  currentMode: 'spot-pattern',
  difficulty: 'easy',
  roundConfig: null,
  
  currentRound: 1,
  totalRounds: 5,
  score: 0,
  streak: 0,
  maxStreak: 0,
  
  selectedRule: null,
  selectedGrowthCount: null,
  isRoundComplete: false,
  isCorrect: false,
  showFeedback: false,
  feedbackMessage: '',
  hasAttempted: false,
  wrongAttempts: 0,
  
  gameStartTime: 0,
  roundStartTime: 0,
  attempts: [],
  roundsCorrect: 0,
  
  showCelebration: false,
  celebrationType: null,

  // ============== GAME FLOW ACTIONS ==============

  startGame: (mode: GameMode, difficulty: DifficultyLevel) => {
    set({
      currentMode: mode,
      difficulty,
      currentRound: 1,
      score: 0,
      streak: 0,
      maxStreak: 0,
      roundsCorrect: 0,
      gameStartTime: Date.now(),
      attempts: [],
      isRoundComplete: false,
      showFeedback: false,
      showCelebration: false,
    });
    get().generateRound();
  },

  generateRound: () => {
    const { currentMode, difficulty } = get();
    const roundConfig = generateRoundConfig(currentMode, difficulty);
    
    set({
      roundConfig,
      roundStartTime: Date.now(),
      isRoundComplete: false,
      isCorrect: false,
      showFeedback: false,
      hasAttempted: false,
      wrongAttempts: 0,
      selectedRule: null,
      selectedGrowthCount: null,
    });
  },

  submitAnswer: () => {
    const state = get();
    const { roundConfig, selectedRule, selectedGrowthCount, currentRound, streak } = state;
    
    if (!roundConfig) return;
    
    // Validate based on mode
    const result = validateAnswer(
      roundConfig,
      [],
      selectedRule ?? undefined,
      selectedGrowthCount ?? undefined
    );
    
    const newStreak = result.isCorrect ? streak + 1 : 0;
    const newMaxStreak = Math.max(state.maxStreak, newStreak);
    const scoreAdd = result.isCorrect ? (10 + (newStreak > 1 ? newStreak * 2 : 0)) : 0;
    
    // Log attempt
    const attempt: AttemptLog = {
      timestamp: Date.now(),
      round: currentRound,
      action: 'submit',
      selectedValue: selectedRule || selectedGrowthCount || undefined,
      isCorrect: result.isCorrect,
    };
    
    set({
      isRoundComplete: result.isCorrect,
      isCorrect: result.isCorrect,
      showFeedback: true,
      feedbackMessage: result.message,
      hasAttempted: true,
      streak: newStreak,
      maxStreak: newMaxStreak,
      score: state.score + scoreAdd,
      roundsCorrect: result.isCorrect ? state.roundsCorrect + 1 : state.roundsCorrect,
      attempts: [...state.attempts, attempt],
      showCelebration: result.isCorrect,
      celebrationType: newStreak >= 3 ? 'streak' : result.isCorrect ? 'correct' : null,
    });
  },

  nextRound: () => {
    const { currentRound, totalRounds } = get();
    
    if (currentRound >= totalRounds) {
      set({ showCelebration: true, celebrationType: 'complete' });
      return;
    }
    
    set({ currentRound: currentRound + 1, showFeedback: false, hasAttempted: false });
    get().generateRound();
  },

  skipRound: () => {
    // Skip to next round after wrong answer
    const { currentRound, totalRounds } = get();
    
    if (currentRound >= totalRounds) {
      set({ showCelebration: true, celebrationType: 'complete' });
      return;
    }
    
    set({ currentRound: currentRound + 1, showFeedback: false, hasAttempted: false, wrongAttempts: 0 });
    get().generateRound();
  },

  tryAgain: () => {
    // Clear wrong placements and allow retry
    const { roundConfig } = get();
    if (!roundConfig) return;
    
    // Reset train cars - clear all items from unlocked slots (those are the ones student can edit)
    const trainCars = roundConfig.trainCars.map(car => {
      if (!car.isLocked) {
        // This is an editable slot - clear it and mark as empty again
        return { ...car, item: null, isEmpty: true };
      }
      return car;
    });
    
    set({
      roundConfig: { ...roundConfig, trainCars },
      showFeedback: false,
      isCorrect: false,
      feedbackMessage: '',
    });
  },

  resetGame: () => {
    set({
      roundConfig: null,
      currentRound: 1,
      score: 0,
      streak: 0,
      maxStreak: 0,
      roundsCorrect: 0,
      isRoundComplete: false,
      isCorrect: false,
      showFeedback: false,
      showCelebration: false,
      hasAttempted: false,
      wrongAttempts: 0,
      attempts: [],
      selectedRule: null,
      selectedGrowthCount: null,
    });
  },

  // ============== PLAYER ACTIONS ==============

  placeItem: (item: PatternItem, carIndex: number) => {
    const { roundConfig, currentRound } = get();
    if (!roundConfig) return;
    
    const trainCars = [...roundConfig.trainCars];
    const targetCar = trainCars[carIndex];
    
    if (!targetCar || targetCar.isLocked) return;
    
    // Place item in car
    trainCars[carIndex] = {
      ...targetCar,
      item,
      isEmpty: false,
    };
    
    // Log attempt
    const attempt: AttemptLog = {
      timestamp: Date.now(),
      round: currentRound,
      action: 'drop',
      itemId: item.id,
      toPosition: carIndex,
      isCorrect: true, // Will validate on submit
    };
    
    set({
      roundConfig: { ...roundConfig, trainCars },
      attempts: [...get().attempts, attempt],
    });
    
    // Auto-validate for build-pattern mode after all cars filled
    if (roundConfig.mode === 'build-pattern') {
      const allFilled = trainCars.every(c => c.item !== null);
      if (allFilled) {
        const result = validateCreatedPattern(trainCars.map(c => c.item));
        if (result.isValid) {
          const state = get();
          const newStreak = state.streak + 1;
          set({
            isRoundComplete: true,
            isCorrect: true,
            showFeedback: true,
            feedbackMessage: result.message,
            hasAttempted: true,
            wrongAttempts: 0,
            streak: newStreak,
            maxStreak: Math.max(state.maxStreak, newStreak),
            score: state.score + 10 + newStreak * 2,
            roundsCorrect: state.roundsCorrect + 1,
            showCelebration: true,
            celebrationType: 'correct',
          });
        } else {
          // Not a valid pattern yet - allow retry (build-pattern is more creative, allow more tries)
          const state = get();
          const newWrongAttempts = state.wrongAttempts + 1;
          const maxRetries = 3; // Allow 3 tries for build mode
          
          set({
            isRoundComplete: false,
            isCorrect: false,
            showFeedback: true,
            wrongAttempts: newWrongAttempts,
            hasAttempted: newWrongAttempts >= maxRetries,
            feedbackMessage: newWrongAttempts >= maxRetries 
              ? `${result.message} Click "Skip to Next" to continue.`
              : `${result.message} (Attempt ${newWrongAttempts}/${maxRetries})`,
            streak: 0,
          });
        }
      }
    }
    
    // Auto-validate for what-next, find-missing, mirror-match modes
    if (['what-next', 'find-missing', 'mirror-match'].includes(roundConfig.mode)) {
      const emptyOrMissingCars = trainCars.filter(c => c.isEmpty || c.isMissing);
      const allFilled = emptyOrMissingCars.every(c => c.item !== null);
      
      if (allFilled) {
        // Check if correct
        const correctAnswer = roundConfig.correctAnswer as PatternItem[];
        const missingCars = roundConfig.trainCars.filter(c => c.isEmpty || c.isMissing);
        let allCorrect = true;
        
        for (let i = 0; i < missingCars.length; i++) {
          const carIdx = missingCars[i].position;
          const placedItem = trainCars[carIdx].item;
          if (!placedItem || placedItem.id !== correctAnswer[i]?.id) {
            allCorrect = false;
            break;
          }
        }
        
        if (allCorrect) {
          const state = get();
          const newStreak = state.streak + 1;
          set({
            isRoundComplete: true,
            isCorrect: true,
            showFeedback: true,
            feedbackMessage: '🎉 Perfect! You completed the pattern!',
            hasAttempted: true,
            wrongAttempts: 0,
            streak: newStreak,
            maxStreak: Math.max(state.maxStreak, newStreak),
            score: state.score + 10 + newStreak * 2,
            roundsCorrect: state.roundsCorrect + 1,
            showCelebration: true,
            celebrationType: newStreak >= 3 ? 'streak' : 'correct',
          });
        } else {
          // Wrong answer - increment attempts and allow retry
          const state = get();
          const newWrongAttempts = state.wrongAttempts + 1;
          const maxRetries = 2; // Allow 2 tries before forcing skip
          
          set({
            isRoundComplete: false,
            isCorrect: false,
            showFeedback: true,
            wrongAttempts: newWrongAttempts,
            hasAttempted: newWrongAttempts >= maxRetries, // Only lock after max retries
            feedbackMessage: newWrongAttempts >= maxRetries 
              ? '❌ Not quite right! Click "Skip to Next" to continue.'
              : `❌ Not quite right! Try again! (Attempt ${newWrongAttempts}/${maxRetries})`,
            streak: 0,
          });
        }
      }
    }
  },

  removeItem: (carIndex: number) => {
    const { roundConfig, isRoundComplete } = get();
    if (!roundConfig || isRoundComplete) return;
    
    const trainCars = [...roundConfig.trainCars];
    const targetCar = trainCars[carIndex];
    
    if (!targetCar || targetCar.isLocked) return;
    
    trainCars[carIndex] = {
      ...targetCar,
      item: null,
      isEmpty: true,
    };
    
    // Clear feedback when removing item to allow retry
    set({
      roundConfig: { ...roundConfig, trainCars },
      showFeedback: false,
      feedbackMessage: '',
    });
  },

  selectPatternRule: (ruleId: string) => {
    set({ selectedRule: ruleId });
  },

  selectGrowthAnswer: (count: number) => {
    set({ selectedGrowthCount: count });
  },

  // ============== UTILITIES ==============

  getHintText: () => {
    const { roundConfig } = get();
    if (!roundConfig) return 'Look for a repeating pattern!';
    return getHint(roundConfig);
  },

  hideFeedback: () => {
    set({ showFeedback: false });
  },

  hideCelebration: () => {
    set({ showCelebration: false, celebrationType: null });
  },

  getTelemetryLog: () => {
    const state = get();
    return {
      student_id: 'anonymous_session',
      game_id: 'pattern_parade_01',
      session_id: `sess_${state.gameStartTime}`,
      chapter: 'cbse_class1_ch7_patterns',
      concept_tags: [
        'patterns_repeating',
        'patterns_extension',
        'patterns_missing',
        'patterns_creation',
        'patterns_growing',
        'patterns_symmetry',
      ],
      session_summary: {
        mode: state.currentMode,
        difficulty: state.difficulty,
        total_rounds: state.totalRounds,
        rounds_correct: state.roundsCorrect,
        overall_accuracy: state.roundsCorrect / state.totalRounds,
        total_time_ms: Date.now() - state.gameStartTime,
        max_streak: state.maxStreak,
        final_score: state.score,
      },
      interaction_trace: state.attempts,
    };
  },
}));
