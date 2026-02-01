import { create } from 'zustand';

interface Position {
  x: number;
  y: number;
}

interface SnakeSegment extends Position {
  value?: number;
}

interface AnswerItem extends Position {
  value: number;
  isCorrect: boolean;
  collected: boolean;
}

interface AdditionQuestion {
  num1: number;
  num2: number;
  answer: number;
  questionText: string;
}

interface AdditionSnakeState {
  // Game state
  gameStarted: boolean;
  gameOver: boolean;
  gamePaused: boolean;
  
  // Snake state
  snake: SnakeSegment[];
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  nextDirection: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  
  // Current question
  currentQuestion: AdditionQuestion | null;
  
  // Answer options on screen
  answers: AnswerItem[];
  
  // Score and stats
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  streak: number;
  bestStreak: number;
  
  // Difficulty
  difficulty: 'easy' | 'medium' | 'hard';
  maxNumber: number;
  
  // Grid settings
  gridSize: number;
  cellSize: number;
  
  // Actions
  startGame: () => void;
  resetGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  setDirection: (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
  moveSnake: () => void;
  generateQuestion: () => void;
  generateAnswers: () => void;
  setDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

const generateAdditionQuestion = (maxNum: number): AdditionQuestion => {
  // Generate two random numbers that add up to at most maxNum
  const num1 = Math.floor(Math.random() * (maxNum / 2)) + 1;
  const maxNum2 = Math.min(maxNum - num1, maxNum / 2);
  const num2 = Math.floor(Math.random() * maxNum2) + 1;
  const answer = num1 + num2;
  
  return {
    num1,
    num2,
    answer,
    questionText: `${num1} + ${num2} = ?`,
  };
};

const generateWrongAnswers = (correctAnswer: number, count: number, maxNum: number): number[] => {
  const wrongAnswers: Set<number> = new Set();
  
  // Generate wrong answers close to the correct answer for better learning
  const variations = [-3, -2, -1, 1, 2, 3, -5, 5, -10, 10];
  
  while (wrongAnswers.size < count) {
    let wrong: number;
    
    // 70% chance to use a close variation, 30% random
    if (Math.random() < 0.7 && variations.length > 0) {
      const variation = variations[Math.floor(Math.random() * variations.length)];
      wrong = correctAnswer + variation;
    } else {
      wrong = Math.floor(Math.random() * maxNum) + 2;
    }
    
    // Ensure wrong answer is valid (positive, different from correct, not already used)
    if (wrong > 0 && wrong !== correctAnswer && wrong <= maxNum + 10 && !wrongAnswers.has(wrong)) {
      wrongAnswers.add(wrong);
    }
  }
  
  return Array.from(wrongAnswers);
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const useAdditionSnakeStore = create<AdditionSnakeState>((set, get) => ({
  // Initial state
  gameStarted: false,
  gameOver: false,
  gamePaused: false,
  
  snake: [{ x: 10, y: 10 }],
  direction: 'RIGHT',
  nextDirection: 'RIGHT',
  
  currentQuestion: null,
  answers: [],
  
  score: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  streak: 0,
  bestStreak: 0,
  
  difficulty: 'easy',
  maxNumber: 20, // For easy: 1-20, medium: 1-50, hard: 1-100
  
  gridSize: 20,
  cellSize: 30,
  
  startGame: () => {
    set({
      gameStarted: true,
      gameOver: false,
      gamePaused: false,
      snake: [{ x: 10, y: 10 }],
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      streak: 0,
    });
    
    get().generateQuestion();
  },
  
  resetGame: () => {
    set({
      gameStarted: false,
      gameOver: false,
      gamePaused: false,
      snake: [{ x: 10, y: 10 }],
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      currentQuestion: null,
      answers: [],
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      streak: 0,
    });
  },
  
  pauseGame: () => set({ gamePaused: true }),
  resumeGame: () => set({ gamePaused: false }),
  
  setDirection: (direction) => {
    const currentDir = get().direction;
    // Prevent 180-degree turns
    if (
      (direction === 'UP' && currentDir !== 'DOWN') ||
      (direction === 'DOWN' && currentDir !== 'UP') ||
      (direction === 'LEFT' && currentDir !== 'RIGHT') ||
      (direction === 'RIGHT' && currentDir !== 'LEFT')
    ) {
      set({ nextDirection: direction });
    }
  },
  
  moveSnake: () => {
    const state = get();
    if (state.gameOver || state.gamePaused) return;
    
    const direction = state.nextDirection;
    set({ direction });
    
    const head = { ...state.snake[0] };
    
    switch (direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
    }
    
    // Check wall collision
    if (head.x < 0 || head.x >= state.gridSize || head.y < 0 || head.y >= state.gridSize) {
      set({ gameOver: true });
      return;
    }
    
    // Check self collision
    for (const segment of state.snake) {
      if (head.x === segment.x && head.y === segment.y) {
        set({ gameOver: true });
        return;
      }
    }
    
    // Check if eating an answer
    const answerAtPosition = state.answers.find(
      a => a.x === head.x && a.y === head.y && !a.collected
    );
    
    if (answerAtPosition) {
      if (answerAtPosition.isCorrect) {
        // Correct answer!
        const newStreak = state.streak + 1;
        const newBestStreak = Math.max(newStreak, state.bestStreak);
        const bonusPoints = newStreak >= 5 ? 20 : newStreak >= 3 ? 10 : 0;
        
        // Grow snake
        const newSnake = [{ ...head, value: answerAtPosition.value }, ...state.snake];
        
        set({
          snake: newSnake,
          score: state.score + 10 + bonusPoints,
          correctAnswers: state.correctAnswers + 1,
          streak: newStreak,
          bestStreak: newBestStreak,
        });
        
        // Generate new question
        setTimeout(() => get().generateQuestion(), 300);
      } else {
        // Wrong answer - reduce snake size!
        const newAnswers = state.answers.map(a =>
          a.x === answerAtPosition.x && a.y === answerAtPosition.y
            ? { ...a, collected: true }
            : a
        );
        
        // Check if snake size is 1 - game over
        if (state.snake.length <= 1) {
          set({ 
            gameOver: true,
            wrongAnswers: state.wrongAnswers + 1,
            streak: 0,
            answers: newAnswers,
          });
          return;
        }
        
        // Shrink the snake by removing the tail
        const newSnake = [head, ...state.snake.slice(0, -2)]; // Remove last segment
        
        set({
          snake: newSnake,
          wrongAnswers: state.wrongAnswers + 1,
          streak: 0,
          answers: newAnswers,
          score: Math.max(0, state.score - 5), // Lose some points
        });
        
        // If all wrong answers eaten and no correct left, game over
        const remainingAnswers = newAnswers.filter(a => !a.collected);
        if (remainingAnswers.length === 0) {
          set({ gameOver: true });
        }
      }
    } else {
      // Normal move - don't grow
      const newSnake = [head, ...state.snake.slice(0, -1)];
      set({ snake: newSnake });
    }
  },
  
  generateQuestion: () => {
    const state = get();
    const question = generateAdditionQuestion(state.maxNumber);
    
    set({ currentQuestion: question });
    get().generateAnswers();
  },
  
  generateAnswers: () => {
    const state = get();
    if (!state.currentQuestion) return;
    
    const correctAnswer = state.currentQuestion.answer;
    const wrongAnswerValues = generateWrongAnswers(correctAnswer, 4, state.maxNumber);
    
    // Combine correct and wrong answers
    const allAnswerValues = shuffleArray([correctAnswer, ...wrongAnswerValues]);
    
    // Generate positions avoiding snake
    const usedPositions = new Set<string>();
    
    // Mark snake positions as used
    state.snake.forEach(seg => {
      usedPositions.add(`${seg.x},${seg.y}`);
      // Also avoid positions adjacent to snake head
      const head = state.snake[0];
      for (let dx = -2; dx <= 2; dx++) {
        for (let dy = -2; dy <= 2; dy++) {
          usedPositions.add(`${head.x + dx},${head.y + dy}`);
        }
      }
    });
    
    const answers: AnswerItem[] = [];
    
    for (const value of allAnswerValues) {
      let attempts = 0;
      let placed = false;
      
      while (!placed && attempts < 100) {
        const x = Math.floor(Math.random() * (state.gridSize - 2)) + 1;
        const y = Math.floor(Math.random() * (state.gridSize - 2)) + 1;
        const key = `${x},${y}`;
        
        if (!usedPositions.has(key)) {
          usedPositions.add(key);
          answers.push({
            x,
            y,
            value,
            isCorrect: value === correctAnswer,
            collected: false,
          });
          placed = true;
        }
        attempts++;
      }
      
      if (!placed) {
        // Fallback position
        answers.push({
          x: Math.floor(Math.random() * state.gridSize),
          y: Math.floor(Math.random() * state.gridSize),
          value,
          isCorrect: value === correctAnswer,
          collected: false,
        });
      }
    }
    
    set({ answers });
  },
  
  setDifficulty: (difficulty) => {
    let maxNumber: number;
    switch (difficulty) {
      case 'easy':
        maxNumber = 20;
        break;
      case 'medium':
        maxNumber = 50;
        break;
      case 'hard':
        maxNumber = 100;
        break;
      default:
        maxNumber = 20;
    }
    
    set({ difficulty, maxNumber });
  },
}));
