import { create } from 'zustand';

export type CSGameType = 'parts' | 'operations';
export type CSDifficulty = 'easy' | 'medium' | 'hard' | 'master';

export interface CSQuestion {
  id: string;
  question: string;
  type: 'match' | 'sequence' | 'fill_blank' | 'choose' | 'explain';
  options?: string[];
  matchPairs?: { left: string; right: string }[];
  correctAnswer: string | string[];
  hint: string;
  explanation: string;
  chapter: string;
  topic: string;
  difficulty: CSDifficulty;
  points: number;
  category: CSGameType;
}

export interface CSGameState {
  gameType: CSGameType;
  currentLevel: number;
  questions: CSQuestion[];
  currentQuestionIndex: number;
  currentQuestion: CSQuestion | null;
  selectedAnswer: string | null;
  answered: boolean;
  showFeedback: boolean;
  consecutiveCorrect: number;
  hintUsed: boolean;
  gameStarted: boolean;
  gameCompleted: boolean;
  levelCompleted: boolean;
  passedLevel: boolean;
  score: number;
  totalAnswered: number;
  correctAnswers: number;
  streak: number;
  bestStreak: number;
  
  startGame: (gameType: CSGameType, level: number) => void;
  selectAnswer: (answer: string) => boolean;
  useHint: () => void;
  nextQuestion: () => void;
  resetGame: () => void;
  retryLevel: () => void;
  getAccuracy: () => number;
  getTelemetryLog: () => Record<string, unknown>;
}

const questionsData: Record<CSGameType, Record<CSDifficulty, CSQuestion[]>> = {
  'parts': {
    easy: [
      {
        id: 'parts_e1_1',
        question: 'Match computer parts to their pictures:',
        type: 'match',
        matchPairs: [
          { left: 'Monitor', right: 'Displays what you see' },
          { left: 'Keyboard', right: 'Used for typing' },
          { left: 'Mouse', right: 'Used for clicking' },
          { left: 'CPU', right: 'Brain of computer' },
        ],
        correctAnswer: ['Monitor-Displays what you see', 'Keyboard-Used for typing', 'Mouse-Used for clicking', 'CPU-Brain of computer'],
        hint: 'Think about what each part does',
        explanation: 'Monitor shows display, Keyboard is for typing, Mouse is for clicking, CPU processes information.',
        chapter: 'Parts of Computer',
        topic: 'Computer Parts',
        difficulty: 'easy',
        points: 10,
        category: 'parts',
      },
      {
        id: 'parts_e1_2',
        question: 'Which part shows what you see on the computer?',
        type: 'choose',
        options: ['Monitor', 'Keyboard', 'Mouse', 'CPU'],
        correctAnswer: 'Monitor',
        hint: 'Think about displaying',
        explanation: 'Monitor displays what you see on the screen.',
        chapter: 'Parts of Computer',
        topic: 'Monitor',
        difficulty: 'easy',
        points: 10,
        category: 'parts',
      },
      {
        id: 'parts_e1_3',
        question: 'Which part is used for typing?',
        type: 'choose',
        options: ['Monitor', 'Keyboard', 'Mouse', 'Speaker'],
        correctAnswer: 'Keyboard',
        hint: 'Think about typing letters',
        explanation: 'Keyboard has keys that you press to type.',
        chapter: 'Parts of Computer',
        topic: 'Keyboard',
        difficulty: 'easy',
        points: 10,
        category: 'parts',
      },
      {
        id: 'parts_e1_4',
        question: 'Which part is called the brain of computer?',
        type: 'choose',
        options: ['Monitor', 'Keyboard', 'CPU', 'Mouse'],
        correctAnswer: 'CPU',
        hint: 'Think about processing',
        explanation: 'CPU (Central Processing Unit) processes all information like a brain.',
        chapter: 'Parts of Computer',
        topic: 'CPU',
        difficulty: 'easy',
        points: 10,
        category: 'parts',
      },
      {
        id: 'parts_e1_5',
        question: 'Match: Mouse → ?',
        type: 'match',
        matchPairs: [
          { left: 'Mouse', right: 'Used for clicking' },
          { left: 'Speaker', right: 'Produces sound' },
          { left: 'Printer', right: 'Prints on paper' },
        ],
        correctAnswer: ['Mouse-Used for clicking'],
        hint: 'Think about clicking',
        explanation: 'Mouse is used for clicking and moving cursor on screen.',
        chapter: 'Parts of Computer',
        topic: 'Mouse',
        difficulty: 'easy',
        points: 10,
        category: 'parts',
      },
    ],
    medium: [
      {
        id: 'parts_m1_1',
        question: 'Arrange these parts by importance: CPU, Monitor, Keyboard, Mouse',
        type: 'sequence',
        options: ['CPU', 'Monitor', 'Keyboard', 'Mouse'],
        correctAnswer: ['CPU', 'Monitor', 'Keyboard', 'Mouse'],
        hint: 'CPU is most important, then display, then input',
        explanation: 'CPU is most important, then Monitor to see, then Keyboard and Mouse for input.',
        chapter: 'Parts of Computer',
        topic: 'Parts Priority',
        difficulty: 'medium',
        points: 15,
        category: 'parts',
      },
      {
        id: 'parts_m1_2',
        question: 'Which two parts are used for INPUT?',
        type: 'choose',
        options: ['Keyboard and Mouse', 'Monitor and Speaker', 'CPU and Printer', 'Monitor and Keyboard'],
        correctAnswer: 'Keyboard and Mouse',
        hint: 'Input means putting information into computer',
        explanation: 'Keyboard and Mouse are input devices - you use them to give information to computer.',
        chapter: 'Parts of Computer',
        topic: 'Input Devices',
        difficulty: 'medium',
        points: 15,
        category: 'parts',
      },
      {
        id: 'parts_m1_3',
        question: 'What is the main difference between INPUT and OUTPUT devices?',
        type: 'explain',
        correctAnswer: 'Input devices send information to computer, output devices show information from computer',
        hint: 'Think about direction of information',
        explanation: 'Input devices (keyboard, mouse) send data TO computer, Output devices (monitor, printer) show data FROM computer.',
        chapter: 'Parts of Computer',
        topic: 'Input vs Output',
        difficulty: 'medium',
        points: 15,
        category: 'parts',
      },
    ],
    hard: [
      {
        id: 'parts_h1_1',
        question: 'Explain: Why is CPU called the brain of computer?',
        type: 'explain',
        correctAnswer: 'CPU processes all information and makes decisions like a brain does',
        hint: 'Think about processing and decision making',
        explanation: 'CPU processes all calculations and instructions, just like brain processes thoughts.',
        chapter: 'Parts of Computer',
        topic: 'CPU Function',
        difficulty: 'hard',
        points: 20,
        category: 'parts',
      },
      {
        id: 'parts_h1_2',
        question: 'What happens if you remove the CPU from a computer?',
        type: 'explain',
        correctAnswer: 'Computer cannot work without CPU - it needs CPU to process information',
        hint: 'Think about what CPU does',
        explanation: 'Without CPU, computer cannot process any information and will not work at all.',
        chapter: 'Parts of Computer',
        topic: 'CPU Importance',
        difficulty: 'hard',
        points: 20,
        category: 'parts',
      },
    ],
    master: [
      {
        id: 'parts_ma1',
        question: 'Design a simple computer system. List 4 essential parts and explain why each is needed.',
        type: 'explain',
        correctAnswer: '1. CPU - processes information 2. Monitor - shows output 3. Keyboard - inputs text 4. Mouse - inputs clicks. All are needed for basic operation.',
        hint: 'Think about minimum parts needed',
        explanation: 'Essential parts: CPU (processing), Monitor (output), Keyboard (text input), Mouse (click input). All work together for basic computer operation.',
        chapter: 'Parts of Computer',
        topic: 'System Design',
        difficulty: 'master',
        points: 25,
        category: 'parts',
      },
    ],
  },
  'operations': {
    easy: [
      {
        id: 'ops_e1_1',
        question: 'Match keyboard shortcuts to their actions:',
        type: 'match',
        matchPairs: [
          { left: 'Ctrl + C', right: 'Copy' },
          { left: 'Ctrl + V', right: 'Paste' },
          { left: 'Ctrl + Z', right: 'Undo' },
          { left: 'Ctrl + S', right: 'Save' },
        ],
        correctAnswer: ['Ctrl + C-Copy', 'Ctrl + V-Paste', 'Ctrl + Z-Undo', 'Ctrl + S-Save'],
        hint: 'C for Copy, V for paste (next to C), Z for undo, S for Save',
        explanation: 'Ctrl+C copies, Ctrl+V pastes, Ctrl+Z undoes, Ctrl+S saves your work.',
        chapter: 'Basic Operations',
        topic: 'Keyboard Shortcuts',
        difficulty: 'easy',
        points: 10,
        category: 'operations',
      },
      {
        id: 'ops_e1_2',
        question: 'Which shortcut is used to COPY?',
        type: 'choose',
        options: ['Ctrl + C', 'Ctrl + V', 'Ctrl + X', 'Ctrl + Z'],
        correctAnswer: 'Ctrl + C',
        hint: 'C for Copy',
        explanation: 'Ctrl + C is used to copy selected text or items.',
        chapter: 'Basic Operations',
        topic: 'Copy Shortcut',
        difficulty: 'easy',
        points: 10,
        category: 'operations',
      },
      {
        id: 'ops_e1_3',
        question: 'Which shortcut is used to PASTE?',
        type: 'choose',
        options: ['Ctrl + C', 'Ctrl + V', 'Ctrl + X', 'Ctrl + P'],
        correctAnswer: 'Ctrl + V',
        hint: 'V is next to C on keyboard',
        explanation: 'Ctrl + V is used to paste copied text or items.',
        chapter: 'Basic Operations',
        topic: 'Paste Shortcut',
        difficulty: 'easy',
        points: 10,
        category: 'operations',
      },
      {
        id: 'ops_e1_4',
        question: 'Which tool is used for DRAWING in Paint?',
        type: 'choose',
        options: ['Brush tool', 'Text tool', 'Eraser tool', 'Select tool'],
        correctAnswer: 'Brush tool',
        hint: 'Think about painting',
        explanation: 'Brush tool is used for drawing and painting in drawing programs.',
        chapter: 'Basic Operations',
        topic: 'Drawing Tools',
        difficulty: 'easy',
        points: 10,
        category: 'operations',
      },
      {
        id: 'ops_e1_5',
        question: 'Match drawing tools to their uses:',
        type: 'match',
        matchPairs: [
          { left: 'Brush', right: 'Draw pictures' },
          { left: 'Eraser', right: 'Remove mistakes' },
          { left: 'Fill Bucket', right: 'Fill color' },
          { left: 'Text', right: 'Add words' },
        ],
        correctAnswer: ['Brush-Draw pictures', 'Eraser-Remove mistakes', 'Fill Bucket-Fill color', 'Text-Add words'],
        hint: 'Think about what each tool does',
        explanation: 'Brush draws, Eraser removes, Fill Bucket fills areas with color, Text adds written words.',
        chapter: 'Basic Operations',
        topic: 'Drawing Tools',
        difficulty: 'easy',
        points: 10,
        category: 'operations',
      },
    ],
    medium: [
      {
        id: 'ops_m1_1',
        question: 'What is the correct typing position? Arrange: Home keys, Sit straight, Feet flat, Hands on keyboard',
        type: 'sequence',
        options: ['Sit straight', 'Feet flat', 'Hands on keyboard', 'Home keys'],
        correctAnswer: ['Sit straight', 'Feet flat', 'Hands on keyboard', 'Home keys'],
        hint: 'Start with posture, then hands position',
        explanation: 'Correct order: Sit straight, keep feet flat, place hands on keyboard, then position on home keys.',
        chapter: 'Basic Operations',
        topic: 'Typing Position',
        difficulty: 'medium',
        points: 15,
        category: 'operations',
      },
      {
        id: 'ops_m1_2',
        question: 'Which shortcut combination saves your work?',
        type: 'choose',
        options: ['Ctrl + S', 'Ctrl + O', 'Ctrl + N', 'Ctrl + P'],
        correctAnswer: 'Ctrl + S',
        hint: 'S for Save',
        explanation: 'Ctrl + S saves your current work in the file.',
        chapter: 'Basic Operations',
        topic: 'Save Shortcut',
        difficulty: 'medium',
        points: 15,
        category: 'operations',
      },
      {
        id: 'ops_m1_3',
        question: 'Explain: Why should you use keyboard shortcuts instead of mouse clicks?',
        type: 'explain',
        correctAnswer: 'Keyboard shortcuts are faster and more efficient than clicking with mouse',
        hint: 'Think about speed',
        explanation: 'Keyboard shortcuts are faster because you keep your hands on keyboard and don\'t need to move to mouse.',
        chapter: 'Basic Operations',
        topic: 'Shortcuts Benefit',
        difficulty: 'medium',
        points: 15,
        category: 'operations',
      },
    ],
    hard: [
      {
        id: 'ops_h1_1',
        question: 'What happens if you press Ctrl + Z multiple times?',
        type: 'explain',
        correctAnswer: 'Each time you press Ctrl + Z, it undoes one previous action',
        hint: 'Think about undo function',
        explanation: 'Ctrl + Z undoes actions one at a time in reverse order - each press undoes one more step.',
        chapter: 'Basic Operations',
        topic: 'Undo Function',
        difficulty: 'hard',
        points: 20,
        category: 'operations',
      },
      {
        id: 'ops_h1_2',
        question: 'Explain: When would you use the Eraser tool instead of Undo (Ctrl+Z)?',
        type: 'explain',
        correctAnswer: 'Use Eraser for small corrections, Use Undo when you want to remove entire recent actions',
        hint: 'Think about precision vs complete removal',
        explanation: 'Eraser lets you remove small parts precisely. Undo removes complete recent actions. Choose based on what needs fixing.',
        chapter: 'Basic Operations',
        topic: 'Tool Selection',
        difficulty: 'hard',
        points: 20,
        category: 'operations',
      },
    ],
    master: [
      {
        id: 'ops_ma1',
        question: 'Design a drawing project. List the steps: 1) Choose tool 2) ? 3) ? 4) Save',
        type: 'explain',
        correctAnswer: '1) Choose tool 2) Draw your picture 3) Add colors 4) Save with Ctrl+S',
        hint: 'Think about drawing process',
        explanation: 'Complete steps: Choose drawing tool, Draw your picture, Add colors with fill tool, Save your work with Ctrl+S.',
        chapter: 'Basic Operations',
        topic: 'Drawing Process',
        difficulty: 'master',
        points: 25,
        category: 'operations',
      },
    ],
  },
};

const getDifficulty = (level: number): CSDifficulty => {
  switch (level) {
    case 1: return 'easy';
    case 2: return 'medium';
    case 3: return 'hard';
    case 4: return 'master';
    default: return 'easy';
  }
};

const generateQuestionSet = (gameType: CSGameType, level: number): CSQuestion[] => {
  const difficulty = getDifficulty(level);
  const allQuestions = [...(questionsData[gameType]?.[difficulty] || [])];
  
  return allQuestions.sort(() => Math.random() - 0.5).slice(0, 15);
};

export const useComputerScienceStore = create<CSGameState>((set, get) => ({
  gameType: 'parts',
  currentLevel: 1,
  questions: [],
  currentQuestionIndex: 0,
  currentQuestion: null,
  selectedAnswer: null,
  answered: false,
  showFeedback: false,
  consecutiveCorrect: 0,
  hintUsed: false,
  gameStarted: false,
  gameCompleted: false,
  levelCompleted: false,
  passedLevel: false,
  score: 0,
  totalAnswered: 0,
  correctAnswers: 0,
  streak: 0,
  bestStreak: 0,

  startGame: (gameType: CSGameType, level: number) => {
    const questionSet = generateQuestionSet(gameType, level);
    const firstQuestion = questionSet[0];
    
    set({
      gameType,
      currentLevel: level,
      questions: questionSet,
      currentQuestionIndex: 0,
      currentQuestion: firstQuestion,
      selectedAnswer: null,
      answered: false,
      showFeedback: false,
      consecutiveCorrect: 0,
      hintUsed: false,
      gameStarted: true,
      gameCompleted: false,
      levelCompleted: false,
      passedLevel: false,
      score: 0,
      totalAnswered: 0,
      correctAnswers: 0,
      streak: 0,
      bestStreak: 0,
    });
  },

  selectAnswer: (answer: string) => {
    const state = get();
    if (state.answered || !state.currentQuestion) return false;
    
    const isCorrect = answer.toLowerCase().trim() === 
      (Array.isArray(state.currentQuestion.correctAnswer) 
        ? state.currentQuestion.correctAnswer[0].toLowerCase().trim()
        : state.currentQuestion.correctAnswer.toLowerCase().trim());
    
    const newStreak = isCorrect ? state.streak + 1 : 0;
    const bonusPoints = Math.min(newStreak * 3, 15);
    const questionPoints = state.currentQuestion.points + bonusPoints;
    
    set({
      selectedAnswer: answer,
      answered: true,
      showFeedback: true,
      totalAnswered: state.totalAnswered + 1,
      correctAnswers: isCorrect ? state.correctAnswers + 1 : state.correctAnswers,
      score: isCorrect ? state.score + questionPoints : state.score,
      streak: newStreak,
      bestStreak: Math.max(state.bestStreak, newStreak),
      consecutiveCorrect: isCorrect ? state.consecutiveCorrect + 1 : 0,
    });
    
    return isCorrect;
  },

  useHint: () => {
    const state = get();
    if (state.hintUsed || !state.currentQuestion || state.answered) return;
    
    set({
      hintUsed: true,
      score: Math.max(0, state.score - 5),
    });
  },

  nextQuestion: () => {
    const state = get();
    const nextIndex = state.currentQuestionIndex + 1;
    
    if (nextIndex >= state.questions.length) {
      const accuracy = state.totalAnswered > 0 ? state.correctAnswers / state.totalAnswered : 0;
      const passed = accuracy >= 0.8;
      set({
        gameCompleted: true,
        levelCompleted: true,
        passedLevel: passed,
      });
    } else {
      const nextQuestion = state.questions[nextIndex];
      set({
        currentQuestionIndex: nextIndex,
        currentQuestion: nextQuestion,
        selectedAnswer: null,
        answered: false,
        showFeedback: false,
        hintUsed: false,
      });
    }
  },

  resetGame: () => {
    set({
      gameStarted: false,
      gameCompleted: false,
      levelCompleted: false,
      passedLevel: false,
      currentLevel: 1,
      score: 0,
      currentQuestion: null,
      selectedAnswer: null,
      answered: false,
      showFeedback: false,
      totalAnswered: 0,
      correctAnswers: 0,
      questions: [],
      streak: 0,
      bestStreak: 0,
      consecutiveCorrect: 0,
      hintUsed: false,
    });
  },

  retryLevel: () => {
    const state = get();
    const questionSet = generateQuestionSet(state.gameType, state.currentLevel);
    const firstQuestion = questionSet[0];
    
    set({
      gameStarted: true,
      gameCompleted: false,
      levelCompleted: false,
      passedLevel: false,
      score: 0,
      currentQuestion: firstQuestion,
      questions: questionSet,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      answered: false,
      showFeedback: false,
      totalAnswered: 0,
      correctAnswers: 0,
      streak: 0,
      bestStreak: 0,
      consecutiveCorrect: 0,
      hintUsed: false,
    });
  },

  getAccuracy: () => {
    const state = get();
    if (state.totalAnswered === 0) return 1;
    return state.correctAnswers / state.totalAnswered;
  },

  getTelemetryLog: () => {
    const state = get();
    return {
      gameType: state.gameType,
      level: state.currentLevel,
      score: state.score,
      accuracy: state.getAccuracy(),
      totalQuestions: state.totalAnswered,
      passed: state.passedLevel,
      bestStreak: state.bestStreak,
      timestamp: new Date().toISOString(),
    };
  },
}));
