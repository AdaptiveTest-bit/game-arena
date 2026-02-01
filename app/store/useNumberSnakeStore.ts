import { create } from 'zustand';

export type GameType = 
  | 'counting-up'      // Type 1: Count 1,2,3... (increasing)
  | 'counting-down'    // Type 2: Count 100,99,98... (decreasing)
  | 'skip-counting-2'  // Type 3: Skip count by 2s
  | 'skip-counting-5'  // Type 4: Skip count by 5s
  | 'skip-counting-10'; // Type 5: Skip count by 10s

interface Position {
  x: number;
  y: number;
}

interface SnakeSegment extends Position {
  number?: number;
}

interface NumberItem extends Position {
  value: number;
  collected: boolean;
}

interface NumberSnakeState {
  // Game state
  gameStarted: boolean;
  gameOver: boolean;
  gamePaused: boolean;
  gameWon: boolean;
  
  // Current game type
  currentType: GameType;
  currentTypeIndex: number;
  
  // Snake state
  snake: SnakeSegment[];
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  nextDirection: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  
  // Numbers on screen
  numbers: NumberItem[];
  
  // Current question
  currentQuestion: string;
  expectedNumber: number;
  startNumber: number;
  endNumber: number;
  
  // Score and progress
  score: number;
  level: number;
  collectedNumbers: number[];
  questionsCompleted: number;
  
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
  checkCollision: () => boolean;
  eatNumber: (number: number) => boolean;
  generateNumbers: () => void;
  nextQuestion: () => void;
  switchGameType: (type: GameType) => void;
  nextGameType: () => void;
}

const GAME_TYPES: GameType[] = [
  'counting-up',
  'counting-down',
  'skip-counting-2',
  'skip-counting-5',
  'skip-counting-10'
];

const getQuestionForType = (type: GameType, start: number, end: number): string => {
  switch (type) {
    case 'counting-up':
      return `🔢 Count UP from ${start} to ${end}! Eat numbers in INCREASING order.`;
    case 'counting-down':
      return `🔢 Count DOWN from ${start} to ${end}! Eat numbers in DECREASING order.`;
    case 'skip-counting-2':
      return `🔢 Skip count by 2s from ${start}! Eat: ${start}, ${start + 2}, ${start + 4}...`;
    case 'skip-counting-5':
      return `🔢 Skip count by 5s from ${start}! Eat: ${start}, ${start + 5}, ${start + 10}...`;
    case 'skip-counting-10':
      return `🔢 Skip count by 10s from ${start}! Eat: ${start}, ${start + 10}, ${start + 20}...`;
    default:
      return `Count from ${start} to ${end}`;
  }
};

const getNextExpectedNumber = (type: GameType, current: number, isFirst: boolean, start: number): number => {
  if (isFirst) return start;
  
  switch (type) {
    case 'counting-up':
      return current + 1;
    case 'counting-down':
      return current - 1;
    case 'skip-counting-2':
      return current + 2;
    case 'skip-counting-5':
      return current + 5;
    case 'skip-counting-10':
      return current + 10;
    default:
      return current + 1;
  }
};

const getNumbersForType = (type: GameType, level: number): { start: number; end: number; numbers: number[] } => {
  let start: number, end: number, numbers: number[] = [];
  
  switch (type) {
    case 'counting-up': {
      // Level determines the range: Level 1: 1-10, Level 2: 11-20, etc.
      start = (level - 1) * 10 + 1;
      end = Math.min(level * 10, 100);
      for (let i = start; i <= end; i++) {
        numbers.push(i);
      }
      break;
    }
    case 'counting-down': {
      // Reverse counting
      end = Math.max(101 - level * 10, 1);
      start = Math.min(100 - (level - 1) * 10, 100);
      for (let i = start; i >= end; i--) {
        numbers.push(i);
      }
      break;
    }
    case 'skip-counting-2': {
      start = (level - 1) * 10 + 2;
      if (start % 2 !== 0) start++;
      for (let i = 0; i < 10 && start + i * 2 <= 100; i++) {
        numbers.push(start + i * 2);
      }
      end = numbers[numbers.length - 1];
      break;
    }
    case 'skip-counting-5': {
      start = ((level - 1) * 25 + 5);
      if (start % 5 !== 0) start = Math.ceil(start / 5) * 5;
      for (let i = 0; i < 8 && start + i * 5 <= 100; i++) {
        numbers.push(start + i * 5);
      }
      end = numbers[numbers.length - 1];
      break;
    }
    case 'skip-counting-10': {
      start = 10;
      for (let i = 0; i < 10; i++) {
        numbers.push(10 + i * 10);
        if (10 + i * 10 >= 100) break;
      }
      end = numbers[numbers.length - 1];
      break;
    }
    default:
      start = 1;
      end = 10;
      for (let i = 1; i <= 10; i++) numbers.push(i);
  }
  
  return { start, end, numbers };
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const useNumberSnakeStore = create<NumberSnakeState>((set, get) => ({
  // Initial state
  gameStarted: false,
  gameOver: false,
  gamePaused: false,
  gameWon: false,
  
  currentType: 'counting-up',
  currentTypeIndex: 0,
  
  snake: [{ x: 10, y: 10 }],
  direction: 'RIGHT',
  nextDirection: 'RIGHT',
  
  numbers: [],
  
  currentQuestion: '',
  expectedNumber: 1,
  startNumber: 1,
  endNumber: 10,
  
  score: 0,
  level: 1,
  collectedNumbers: [],
  questionsCompleted: 0,
  
  gridSize: 20,
  cellSize: 30,
  
  startGame: () => {
    const state = get();
    const { start, end, numbers } = getNumbersForType(state.currentType, state.level);
    
    set({
      gameStarted: true,
      gameOver: false,
      gamePaused: false,
      gameWon: false,
      snake: [{ x: 10, y: 10 }],
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      collectedNumbers: [],
      expectedNumber: numbers[0],
      startNumber: start,
      endNumber: end,
      currentQuestion: getQuestionForType(state.currentType, start, end),
    });
    
    get().generateNumbers();
  },
  
  resetGame: () => {
    set({
      gameStarted: false,
      gameOver: false,
      gamePaused: false,
      gameWon: false,
      snake: [{ x: 10, y: 10 }],
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      numbers: [],
      currentQuestion: '',
      expectedNumber: 1,
      startNumber: 1,
      endNumber: 10,
      score: 0,
      level: 1,
      collectedNumbers: [],
      questionsCompleted: 0,
      currentTypeIndex: 0,
      currentType: 'counting-up',
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
    if (state.gameOver || state.gamePaused || state.gameWon) return;
    
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
    
    // Check if eating a number
    const numberAtPosition = state.numbers.find(
      n => n.x === head.x && n.y === head.y && !n.collected
    );
    
    if (numberAtPosition) {
      const isCorrect = get().eatNumber(numberAtPosition.value);
      if (isCorrect) {
        // Grow snake
        const newSnake = [{ ...head, number: numberAtPosition.value }, ...state.snake];
        set({ snake: newSnake });
      } else {
        // Wrong number - game over
        set({ gameOver: true });
        return;
      }
    } else {
      // Normal move - don't grow
      const newSnake = [head, ...state.snake.slice(0, -1)];
      set({ snake: newSnake });
    }
  },
  
  checkCollision: () => {
    const state = get();
    const head = state.snake[0];
    
    // Wall collision
    if (head.x < 0 || head.x >= state.gridSize || head.y < 0 || head.y >= state.gridSize) {
      return true;
    }
    
    // Self collision
    for (let i = 1; i < state.snake.length; i++) {
      if (head.x === state.snake[i].x && head.y === state.snake[i].y) {
        return true;
      }
    }
    
    return false;
  },
  
  eatNumber: (number) => {
    const state = get();
    
    if (number === state.expectedNumber) {
      const newCollected = [...state.collectedNumbers, number];
      const newScore = state.score + 10;
      
      // Mark number as collected
      const newNumbers = state.numbers.map(n => 
        n.value === number ? { ...n, collected: true } : n
      );
      
      // Check if all numbers collected
      const allCollected = newNumbers.every(n => n.collected);
      
      if (allCollected) {
        // Level complete!
        set({
          numbers: newNumbers,
          collectedNumbers: newCollected,
          score: newScore + 50, // Bonus for completing level
          questionsCompleted: state.questionsCompleted + 1,
        });
        
        // Move to next question/level
        setTimeout(() => get().nextQuestion(), 500);
        return true;
      }
      
      // Calculate next expected number
      const nextExpected = getNextExpectedNumber(
        state.currentType, 
        number, 
        false, 
        state.startNumber
      );
      
      set({
        numbers: newNumbers,
        collectedNumbers: newCollected,
        expectedNumber: nextExpected,
        score: newScore,
      });
      
      return true;
    }
    
    return false;
  },
  
  generateNumbers: () => {
    const state = get();
    const { numbers: numberValues } = getNumbersForType(state.currentType, state.level);
    
    // Create positions for numbers, avoiding snake position
    const positions: Position[] = [];
    const usedPositions = new Set<string>();
    
    // Mark snake positions as used
    state.snake.forEach(seg => {
      usedPositions.add(`${seg.x},${seg.y}`);
    });
    
    // Generate random positions for numbers
    const shuffledNumbers = shuffleArray(numberValues);
    
    for (const value of shuffledNumbers) {
      let attempts = 0;
      let placed = false;
      
      while (!placed && attempts < 100) {
        const x = Math.floor(Math.random() * state.gridSize);
        const y = Math.floor(Math.random() * state.gridSize);
        const key = `${x},${y}`;
        
        if (!usedPositions.has(key)) {
          usedPositions.add(key);
          positions.push({ x, y });
          placed = true;
        }
        attempts++;
      }
    }
    
    const numbers: NumberItem[] = shuffledNumbers.map((value, index) => ({
      x: positions[index]?.x ?? Math.floor(Math.random() * state.gridSize),
      y: positions[index]?.y ?? Math.floor(Math.random() * state.gridSize),
      value,
      collected: false,
    }));
    
    set({ numbers });
  },
  
  nextQuestion: () => {
    const state = get();
    const newLevel = state.level + 1;
    
    // Check if we should move to next game type
    if (newLevel > 10) {
      // Move to next type
      get().nextGameType();
      return;
    }
    
    const { start, end, numbers } = getNumbersForType(state.currentType, newLevel);
    
    set({
      level: newLevel,
      snake: [{ x: 10, y: 10 }],
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      collectedNumbers: [],
      expectedNumber: numbers[0],
      startNumber: start,
      endNumber: end,
      currentQuestion: getQuestionForType(state.currentType, start, end),
    });
    
    get().generateNumbers();
  },
  
  switchGameType: (type) => {
    const index = GAME_TYPES.indexOf(type);
    set({
      currentType: type,
      currentTypeIndex: index,
      level: 1,
      score: 0,
      questionsCompleted: 0,
    });
  },
  
  nextGameType: () => {
    const state = get();
    const nextIndex = (state.currentTypeIndex + 1) % GAME_TYPES.length;
    
    if (nextIndex === 0 && state.currentTypeIndex === GAME_TYPES.length - 1) {
      // Completed all types!
      set({ gameWon: true, gameStarted: false });
      return;
    }
    
    const nextType = GAME_TYPES[nextIndex];
    set({
      currentType: nextType,
      currentTypeIndex: nextIndex,
      level: 1,
    });
    
    get().startGame();
  },
}));
