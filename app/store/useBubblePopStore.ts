'use client';

import { create } from 'zustand';

// ============================================
// TYPES
// ============================================

export type Difficulty = 'easy' | 'medium' | 'hard';
export type GamePhase = 'menu' | 'thinking' | 'playing' | 'checking' | 'success' | 'wrong_answer' | 'wrong_pops' | 'celebrating';

export interface Bubble {
  id: string;
  x: number;
  y: number;
  baseY: number;
  radius: number;
  color: string;
  isPopped: boolean;
}

interface ActionLog {
  type: 'pop' | 'undo' | 'hint' | 'submit' | 'answer';
  timestamp: number;
  bubbleId?: string;
  value?: number;
}

interface BubblePopState {
  // Game phase
  gamePhase: GamePhase;
  difficulty: Difficulty;
  
  // Level data
  currentLevel: number;
  startingBubbles: number;
  targetRemaining: number;
  bubblesToPop: number;
  
  // Student's answer (thinking phase)
  studentAnswer: number | null;
  answerOptions: number[];
  
  // Bubble state
  bubbles: Bubble[];
  poppedCount: number;
  remainingCount: number;
  
  // Undo stack (unlimited - can undo all pops)
  undoStack: string[];
  
  // 100-Point Scorecard System (20 rounds × 5 points = 100 max)
  totalRoundsPerSession: number;
  roundsCompleted: number;
  correctRounds: number;
  
  // Scoring
  score: number;
  hintsUsed: number;
  wrongAttempts: number;
  levelStartTime: number;
  
  // Telemetry
  actionLog: ActionLog[];
  celebrationStarted: boolean;
  
  // Actions
  startGame: (difficulty?: Difficulty) => void;
  generateLevel: () => void;
  submitAnswer: (answer: number) => void;
  popBubble: (bubbleId: string) => void;
  undoPop: () => void;
  checkPops: () => void;
  useHint: () => void;
  nextLevel: () => void;
  skipToNext: () => void;
  resetGame: () => void;
  retryThinking: () => void;
  retryPopping: () => void;
  setCelebrationStarted: () => void;
  getTelemetryLog: () => object;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

const BUBBLE_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF6B81',
];

function getDifficultyParams(difficulty: Difficulty) {
  switch (difficulty) {
    case 'easy':
      return { minStart: 10, maxStart: 20, minPop: 2, maxPop: 7 };
    case 'medium':
      return { minStart: 20, maxStart: 40, minPop: 5, maxPop: 12 };
    case 'hard':
      return { minStart: 40, maxStart: 60, minPop: 10, maxPop: 20 };
  }
}

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateBubbles(count: number, canvasWidth: number = 700, canvasHeight: number = 400): Bubble[] {
  const bubbles: Bubble[] = [];
  const padding = 50;
  const minRadius = 28;
  const maxRadius = 38;
  
  // Grid-based placement with some randomness
  const cols = Math.ceil(Math.sqrt(count * 1.5));
  const rows = Math.ceil(count / cols);
  const cellWidth = (canvasWidth - padding * 2) / cols;
  const cellHeight = (canvasHeight - padding * 2) / rows;
  
  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    
    const baseX = padding + col * cellWidth + cellWidth / 2;
    const baseY = padding + row * cellHeight + cellHeight / 2;
    
    // Add randomness to position
    const x = baseX + (Math.random() - 0.5) * cellWidth * 0.5;
    const y = baseY + (Math.random() - 0.5) * cellHeight * 0.5;
    
    bubbles.push({
      id: `bubble-${i}-${Date.now()}`,
      x: Math.max(padding, Math.min(canvasWidth - padding, x)),
      y: Math.max(padding, Math.min(canvasHeight - padding, y)),
      baseY: y,
      radius: randomInRange(minRadius, maxRadius),
      color: BUBBLE_COLORS[i % BUBBLE_COLORS.length],
      isPopped: false,
    });
  }
  
  // Shuffle colors for variety
  bubbles.forEach((bubble) => {
    bubble.color = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
  });
  
  return bubbles;
}

// ============================================
// STORE
// ============================================

export const useBubblePopStore = create<BubblePopState>((set, get) => ({
  // Initial state
  gamePhase: 'menu',
  difficulty: 'easy',
  currentLevel: 1,
  startingBubbles: 0,
  targetRemaining: 0,
  bubblesToPop: 0,
  studentAnswer: null,
  answerOptions: [],
  bubbles: [],
  poppedCount: 0,
  remainingCount: 0,
  undoStack: [],
  totalRoundsPerSession: 20,
  roundsCompleted: 0,
  correctRounds: 0,
  score: 0,
  hintsUsed: 0,
  wrongAttempts: 0,
  levelStartTime: 0,
  actionLog: [],
  celebrationStarted: false,

  startGame: (difficulty = 'easy') => {
    set({
      difficulty,
      currentLevel: 1,
      score: 0,
      roundsCompleted: 0,
      correctRounds: 0,
      actionLog: [],
      celebrationStarted: false,
    });
    get().generateLevel();
  },

  generateLevel: () => {
    const { difficulty, currentLevel } = get();
    const params = getDifficultyParams(difficulty);
    
    // Scale difficulty slightly with level
    const levelBonus = Math.min(currentLevel - 1, 5);
    const startingBubbles = randomInRange(
      params.minStart + levelBonus,
      params.maxStart + levelBonus
    );
    const bubblesToPop = randomInRange(params.minPop, params.maxPop + Math.floor(levelBonus / 2));
    const targetRemaining = startingBubbles - bubblesToPop;
    
    const bubbles = generateBubbles(startingBubbles);
    
    // Generate answer options (correct answer + 3 distractors)
    const correctAnswer = bubblesToPop;
    const options = new Set<number>([correctAnswer]);
    
    // Add nearby wrong answers
    while (options.size < 4) {
      const offset = randomInRange(-3, 3);
      const wrongAnswer = correctAnswer + offset;
      if (wrongAnswer > 0 && wrongAnswer !== correctAnswer && wrongAnswer < startingBubbles) {
        options.add(wrongAnswer);
      }
    }
    
    // Shuffle options
    const answerOptions = Array.from(options).sort(() => Math.random() - 0.5);
    
    set({
      startingBubbles,
      targetRemaining,
      bubblesToPop,
      answerOptions,
      studentAnswer: null,
      bubbles,
      poppedCount: 0,
      remainingCount: startingBubbles,
      undoStack: [],
      hintsUsed: 0,
      wrongAttempts: 0,
      levelStartTime: Date.now(),
      gamePhase: 'thinking', // Start in thinking phase!
    });
  },

  submitAnswer: (answer: number) => {
    const { bubblesToPop, actionLog } = get();
    
    // Log the answer
    const newActionLog = [
      ...actionLog,
      { type: 'answer' as const, timestamp: Date.now(), value: answer },
    ];
    
    set({ 
      studentAnswer: answer,
      actionLog: newActionLog,
    });
    
    // Check if answer is correct
    if (answer === bubblesToPop) {
      // Correct! Move to popping phase
      set({ gamePhase: 'playing' });
    } else {
      // Wrong answer
      set({ 
        gamePhase: 'wrong_answer',
        wrongAttempts: get().wrongAttempts + 1,
      });
    }
  },

  popBubble: (bubbleId: string) => {
    const { bubbles, undoStack, actionLog, gamePhase } = get();
    
    // Only allow popping in playing phase
    if (gamePhase !== 'playing') return;
    
    const bubble = bubbles.find((b) => b.id === bubbleId);
    if (!bubble || bubble.isPopped) return;
    
    // Log action
    const newActionLog = [
      ...actionLog,
      { type: 'pop' as const, timestamp: Date.now(), bubbleId },
    ];
    
    // Update undo stack (unlimited - can undo all pops)
    const newUndoStack = [...undoStack, bubbleId];
    
    // Mark bubble as popped
    const newBubbles = bubbles.map((b) =>
      b.id === bubbleId ? { ...b, isPopped: true } : b
    );
    
    const newPoppedCount = get().poppedCount + 1;
    const newRemainingCount = get().remainingCount - 1;
    
    set({
      bubbles: newBubbles,
      poppedCount: newPoppedCount,
      remainingCount: newRemainingCount,
      undoStack: newUndoStack,
      actionLog: newActionLog,
    });
  },

  undoPop: () => {
    const { undoStack, bubbles, actionLog, gamePhase } = get();
    
    if (undoStack.length === 0) return;
    if (gamePhase !== 'playing') return;
    
    const lastPoppedId = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);
    
    // Restore bubble
    const newBubbles = bubbles.map((b) =>
      b.id === lastPoppedId ? { ...b, isPopped: false } : b
    );
    
    // Log action
    const newActionLog = [
      ...actionLog,
      { type: 'undo' as const, timestamp: Date.now(), bubbleId: lastPoppedId },
    ];
    
    set({
      bubbles: newBubbles,
      poppedCount: get().poppedCount - 1,
      remainingCount: get().remainingCount + 1,
      undoStack: newUndoStack,
      actionLog: newActionLog,
    });
  },

  checkPops: () => {
    const { poppedCount, studentAnswer, bubblesToPop, actionLog } = get();
    
    // Log submission
    const newActionLog = [
      ...actionLog,
      { type: 'submit' as const, timestamp: Date.now() },
    ];
    
    set({ actionLog: newActionLog });
    
    // Check if popped count matches their answer AND is correct
    if (poppedCount === studentAnswer && poppedCount === bubblesToPop) {
      set({ gamePhase: 'success' });
    } else {
      set({ 
        gamePhase: 'wrong_pops',
        wrongAttempts: get().wrongAttempts + 1,
      });
    }
  },

  useHint: () => {
    const { actionLog } = get();
    set({
      hintsUsed: get().hintsUsed + 1,
      actionLog: [...actionLog, { type: 'hint' as const, timestamp: Date.now() }],
    });
  },

  nextLevel: () => {
    const { correctRounds, roundsCompleted, totalRoundsPerSession, currentLevel } = get();
    
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
        celebrationStarted: false,
      });
      get().generateLevel();
    }
  },

  retryThinking: () => {
    // Go back to thinking phase with same level
    set({
      gamePhase: 'thinking',
      studentAnswer: null,
    });
  },

  retryPopping: () => {
    // Reset bubbles but keep the same level parameters
    const { startingBubbles } = get();
    const bubbles = generateBubbles(startingBubbles);
    
    set({
      gamePhase: 'playing',
      bubbles,
      poppedCount: 0,
      remainingCount: startingBubbles,
      undoStack: [],
    });
  },

  skipToNext: () => {
    // Skip to next question without earning points (for when student gets it wrong)
    const { roundsCompleted, totalRoundsPerSession, currentLevel } = get();
    const newRoundsCompleted = roundsCompleted + 1;
    
    // Check if session complete (20 rounds)
    if (newRoundsCompleted >= totalRoundsPerSession) {
      set({
        roundsCompleted: newRoundsCompleted,
        gamePhase: 'celebrating',
        celebrationStarted: true,
      });
    } else {
      set({
        currentLevel: currentLevel + 1,
        roundsCompleted: newRoundsCompleted,
        wrongAttempts: 0,
        hintsUsed: 0,
        celebrationStarted: false,
      });
      get().generateLevel();
    }
  },

  resetGame: () => {
    set({
      gamePhase: 'menu',
      difficulty: 'easy',
      currentLevel: 1,
      startingBubbles: 0,
      targetRemaining: 0,
      bubblesToPop: 0,
      studentAnswer: null,
      answerOptions: [],
      bubbles: [],
      poppedCount: 0,
      remainingCount: 0,
      undoStack: [],
      roundsCompleted: 0,
      correctRounds: 0,
      score: 0,
      hintsUsed: 0,
      wrongAttempts: 0,
      levelStartTime: 0,
      actionLog: [],
      celebrationStarted: false,
    });
  },

  setCelebrationStarted: () => {
    set({ celebrationStarted: true });
  },

  getTelemetryLog: () => {
    const state = get();
    return {
      sessionId: `session-${Date.now()}`,
      lessonId: 'subtraction-1-100',
      difficulty: state.difficulty,
      levelNumber: state.currentLevel,
      startingBubbles: state.startingBubbles,
      targetRemaining: state.targetRemaining,
      correctAnswer: state.bubblesToPop,
      studentAnswer: state.studentAnswer,
      totalPops: state.poppedCount,
      undosUsed: state.undoStack.length,
      hintsUsed: state.hintsUsed,
      wrongAttempts: state.wrongAttempts,
      timeToComplete: Date.now() - state.levelStartTime,
      wasSuccessful: state.gamePhase === 'success',
      actions: state.actionLog,
    };
  },
}));
