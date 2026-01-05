import { create } from 'zustand';

// Types
type PatternType = 'arithmetic-add' | 'arithmetic-sub' | 'geometric-mul';
type Operation = '+' | '-' | '×';

interface PatternRule {
  type: PatternType;
  operation: Operation;
  operand: number;
  startValue: number;
}

interface PatternDetectiveGameState {
  // Phase Management
  phase: 'discovery' | 'builder' | 'creator' | 'completed';
  currentRound: number;
  totalRounds: number;

  // Pattern Data (Discovery Phase)
  patternRule: PatternRule;
  sequence: number[];
  visibleIndices: number[];
  hiddenIndices: number[];
  playerAnswers: Record<number, number | null>;

  // Builder Phase
  builderRule: { operation: Operation; operand: number };
  builderStartNumber: number;
  builderSequence: number[];
  builderTargetLength: number;

  // Creator Phase
  creatorOperation: Operation | null;
  creatorOperand: number | null;
  creatorStartNumber: number | null;
  creatorSequence: number[];

  // Validation
  isPhaseCorrect: boolean;
  attemptsRemaining: number;
  hintsUsed: number;
  currentHint: string | null;

  // Telemetry
  gameStartTime: number;
  phaseTimes: Record<string, number>;
  score: number;

  // Actions
  generateChallenge: () => void;
  generateBuilderChallenge: () => void;
  setPlayerAnswer: (index: number, value: number) => void;
  removePlayerAnswer: (index: number) => void;
  validateDiscovery: () => boolean;
  addToBuilderSequence: (value: number) => boolean;
  clearBuilderSequence: () => void;
  setCreatorParams: (op: Operation, operand: number, start: number) => void;
  generateCreatorSequence: () => void;
  validateCreatorParams: () => boolean;
  useHint: () => string | null;
  advancePhase: () => void;
  resetGame: () => void;
}

// Helper function for random integers
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const usePatternDetectiveStore = create<PatternDetectiveGameState>((set, get) => ({
  // Initial state
  phase: 'discovery',
  currentRound: 1,
  totalRounds: 3,

  patternRule: { type: 'arithmetic-add', operation: '+', operand: 2, startValue: 1 },
  sequence: [],
  visibleIndices: [],
  hiddenIndices: [],
  playerAnswers: {},

  builderRule: { operation: '+', operand: 5 },
  builderStartNumber: 1,
  builderSequence: [],
  builderTargetLength: 6,

  creatorOperation: null,
  creatorOperand: null,
  creatorStartNumber: null,
  creatorSequence: [],

  isPhaseCorrect: false,
  attemptsRemaining: 3,
  hintsUsed: 0,
  currentHint: null,

  gameStartTime: 0,
  phaseTimes: {},
  score: 0,

  // Generate a discovery challenge
  generateChallenge: () => {
    const patternTypes: PatternType[] = ['arithmetic-add', 'arithmetic-sub', 'geometric-mul'];
    const selectedType = patternTypes[Math.floor(Math.random() * patternTypes.length)];

    let operation: Operation;
    let operand: number;
    let startValue: number;

    switch (selectedType) {
      case 'arithmetic-add':
        operation = '+';
        operand = randomInt(2, 12);
        startValue = randomInt(1, 20);
        break;
      case 'arithmetic-sub':
        operation = '-';
        operand = randomInt(2, 8);
        startValue = randomInt(50, 100);
        break;
      case 'geometric-mul':
        operation = '×';
        operand = randomInt(2, 4);
        startValue = randomInt(1, 5);
        break;
      default:
        operation = '+';
        operand = 3;
        startValue = 5;
    }

    // Generate sequence
    const sequenceLength = randomInt(6, 8);
    const sequence: number[] = [startValue];

    for (let i = 1; i < sequenceLength; i++) {
      const prev = sequence[i - 1];
      switch (operation) {
        case '+':
          sequence.push(prev + operand);
          break;
        case '-':
          sequence.push(prev - operand);
          break;
        case '×':
          sequence.push(prev * operand);
          break;
      }
    }

    // Determine hidden indices (never hide first 2)
    const numHidden = randomInt(2, 3);
    const hiddenIndices: number[] = [];
    const availableIndices = Array.from({ length: sequenceLength - 2 }, (_, i) => i + 2);

    for (let i = 0; i < numHidden && availableIndices.length > 0; i++) {
      const randIdx = Math.floor(Math.random() * availableIndices.length);
      hiddenIndices.push(availableIndices.splice(randIdx, 1)[0]);
    }

    const visibleIndices = sequence.map((_, i) => i).filter((i) => !hiddenIndices.includes(i));

    set({
      patternRule: { type: selectedType, operation, operand, startValue },
      sequence,
      visibleIndices,
      hiddenIndices: hiddenIndices.sort((a, b) => a - b),
      playerAnswers: {},
      isPhaseCorrect: false,
      hintsUsed: 0,
      currentHint: null,
      attemptsRemaining: 3,
      gameStartTime: Date.now(),
    });
  },

  // Generate a builder challenge
  generateBuilderChallenge: () => {
    const operations: Operation[] = ['+', '-', '×'];
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let operand: number;
    let startNumber: number;

    switch (operation) {
      case '+':
        operand = randomInt(3, 15);
        startNumber = randomInt(1, 30);
        break;
      case '-':
        operand = randomInt(3, 10);
        startNumber = randomInt(60, 100);
        break;
      case '×':
        operand = randomInt(2, 4);
        startNumber = randomInt(2, 6);
        break;
      default:
        operand = 5;
        startNumber = 10;
    }

    set({
      builderRule: { operation, operand },
      builderStartNumber: startNumber,
      builderSequence: [],
      builderTargetLength: 6,
      isPhaseCorrect: false,
      hintsUsed: 0,
      currentHint: null,
    });
  },

  // Set player answer for a hidden index
  setPlayerAnswer: (index: number, value: number) => {
    set((state) => ({
      playerAnswers: { ...state.playerAnswers, [index]: value },
    }));
  },

  // Remove player answer
  removePlayerAnswer: (index: number) => {
    set((state) => {
      const newAnswers = { ...state.playerAnswers };
      delete newAnswers[index];
      return { playerAnswers: newAnswers };
    });
  },

  // Validate discovery phase
  validateDiscovery: () => {
    const state = get();
    let allCorrect = true;

    state.hiddenIndices.forEach((index) => {
      const playerAnswer = state.playerAnswers[index];
      const correctAnswer = state.sequence[index];

      if (playerAnswer !== correctAnswer) {
        allCorrect = false;
      }
    });

    if (allCorrect) {
      set((prev) => ({
        isPhaseCorrect: true,
        score: prev.score + (100 - prev.hintsUsed * 20),
      }));
    } else {
      set((prev) => ({
        attemptsRemaining: prev.attemptsRemaining - 1,
      }));
    }

    return allCorrect;
  },

  // Add number to builder sequence
  addToBuilderSequence: (value: number) => {
    const state = get();
    const expectedIndex = state.builderSequence.length;

    let expected: number;

    if (expectedIndex === 0) {
      expected = state.builderStartNumber;
    } else {
      const prev = state.builderSequence[expectedIndex - 1];
      switch (state.builderRule.operation) {
        case '+':
          expected = prev + state.builderRule.operand;
          break;
        case '-':
          expected = prev - state.builderRule.operand;
          break;
        case '×':
          expected = prev * state.builderRule.operand;
          break;
        default:
          expected = prev;
      }
    }

    if (value === expected) {
      const newSequence = [...state.builderSequence, value];
      const isComplete = newSequence.length >= state.builderTargetLength;

      set((prev) => ({
        builderSequence: newSequence,
        isPhaseCorrect: isComplete,
        score: isComplete ? prev.score + (100 - prev.hintsUsed * 20) : prev.score,
      }));
      return true;
    }

    return false;
  },

  // Clear builder sequence
  clearBuilderSequence: () => {
    set({ builderSequence: [] });
  },

  // Set creator parameters
  setCreatorParams: (op: Operation, operand: number, start: number) => {
    set({
      creatorOperation: op,
      creatorOperand: operand,
      creatorStartNumber: start,
      creatorSequence: [],
    });
  },

  // Generate creator sequence
  generateCreatorSequence: () => {
    const state = get();

    if (!state.validateCreatorParams()) {
      return;
    }

    const sequence: number[] = [state.creatorStartNumber!];

    for (let i = 1; i < 6; i++) {
      const prev = sequence[i - 1];
      switch (state.creatorOperation) {
        case '+':
          sequence.push(prev + state.creatorOperand!);
          break;
        case '-':
          sequence.push(prev - state.creatorOperand!);
          break;
        case '×':
          sequence.push(prev * state.creatorOperand!);
          break;
      }
    }

    set((prev) => ({
      creatorSequence: sequence,
      isPhaseCorrect: true,
      score: prev.score + 50,
    }));
  },

  // Validate creator parameters
  validateCreatorParams: () => {
    const state = get();

    if (state.creatorStartNumber === null || state.creatorStartNumber < 1) return false;
    if (state.creatorOperand === null || state.creatorOperand < 2 || state.creatorOperand > 15) return false;
    if (state.creatorOperation === null) return false;

    // Prevent negatives for subtraction
    if (state.creatorOperation === '-') {
      const finalValue = state.creatorStartNumber - 5 * state.creatorOperand;
      if (finalValue < 0) return false;
    }

    // Prevent overflow for multiplication
    if (state.creatorOperation === '×') {
      const finalValue = state.creatorStartNumber * Math.pow(state.creatorOperand, 5);
      if (finalValue > 100000) return false;
    }

    return true;
  },

  // Use hint
  useHint: () => {
    const state = get();

    if (state.hintsUsed >= 3) return null;

    const hints = [
      `Look at the difference between consecutive numbers.`,
      `The pattern uses the "${state.patternRule.operation}" operation.`,
      `Each number changes by ${state.patternRule.operand}.`,
    ];

    const hint = hints[state.hintsUsed];
    set({ hintsUsed: state.hintsUsed + 1, currentHint: hint });

    return hint;
  },

  // Advance to next phase
  advancePhase: () => {
    const state = get();
    const phaseSequence: Array<'discovery' | 'builder' | 'creator' | 'completed'> = [
      'discovery',
      'builder',
      'creator',
      'completed',
    ];

    const currentIndex = phaseSequence.indexOf(state.phase);
    const nextPhase = phaseSequence[Math.min(currentIndex + 1, phaseSequence.length - 1)];

    const newPhaseTimes = {
      ...state.phaseTimes,
      [state.phase]: Date.now() - state.gameStartTime,
    };

    set({
      phase: nextPhase,
      phaseTimes: newPhaseTimes,
      isPhaseCorrect: false,
      currentHint: null,
    });

    // Generate challenge for next phase
    if (nextPhase === 'builder') {
      get().generateBuilderChallenge();
    }
  },

  // Reset game
  resetGame: () => {
    set({
      phase: 'discovery',
      currentRound: 1,
      sequence: [],
      visibleIndices: [],
      hiddenIndices: [],
      playerAnswers: {},
      builderSequence: [],
      creatorSequence: [],
      creatorOperation: null,
      creatorOperand: null,
      creatorStartNumber: null,
      isPhaseCorrect: false,
      attemptsRemaining: 3,
      hintsUsed: 0,
      currentHint: null,
      gameStartTime: 0,
      phaseTimes: {},
      score: 0,
    });
  },
}));
