import { create } from 'zustand';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface FamilyCircleQuestion {
  id: string;
  question: string;
  type: 'mcq' | 'fill_blank' | 'sequence' | 'classification';
  options?: string[];
  correctAnswer: string | string[];
  hint: string;
  explanation: string;
  topic: string;
  difficulty: DifficultyLevel;
  points: number;
}

export interface FamilyCircleGameState {
  currentChapter: number;
  currentLevel: number;
  questions: FamilyCircleQuestion[];
  currentQuestionIndex: number;
  currentQuestion: FamilyCircleQuestion | null;
  selectedAnswer: string | null;
  answered: boolean;
  showFeedback: boolean;
  streak: number;
  bestStreak: number;
  hintUsed: boolean;
  gameStarted: boolean;
  gameCompleted: boolean;
  levelCompleted: boolean;
  passedLevel: boolean;
  score: number;
  totalAnswered: number;
  correctAnswers: number;
  
  startGame: (chapter: number, level: number) => void;
  selectAnswer: (answer: string) => boolean;
  useHint: () => void;
  nextQuestion: () => void;
  resetGame: () => void;
  retryLevel: () => void;
  getAccuracy: () => number;
  getTelemetryLog: () => Record<string, unknown>;
}

// Family members data
const familyMembers = [
  { name: 'Great-grandmother', generation: 4, role: 'Eldest female ancestor' },
  { name: 'Great-grandfather', generation: 4, role: 'Eldest male ancestor' },
  { name: 'Grandmother', generation: 3, role: 'Mother of parent' },
  { name: 'Grandfather', generation: 3, role: 'Father of parent' },
  { name: 'Mother', generation: 2, role: 'Female parent' },
  { name: 'Father', generation: 2, role: 'Male parent' },
  { name: 'Aunt', generation: 2, role: 'Sister of parent' },
  { name: 'Uncle', generation: 2, role: 'Brother of parent' },
  { name: 'Sister', generation: 1, role: 'Female sibling' },
  { name: 'Brother', generation: 1, role: 'Male sibling' },
  { name: 'Cousin', generation: 1, role: 'Child of aunt/uncle' },
  { name: 'Me', generation: 0, role: 'The child' },
];

// Question data for Chapter 4: Our Family
const questionsData: Record<DifficultyLevel, FamilyCircleQuestion[]> = {
  easy: [
    {
      id: 'fam_1_1',
      question: "Who is your mother's mother?",
      type: 'mcq',
      options: ["Grandmother", "Sister", "Aunt", "Cousin"],
      correctAnswer: "Grandmother",
      hint: 'Think about your mother\'s parents',
      explanation: 'Your mother\'s mother is your grandmother.',
      topic: 'Family Members',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'fam_1_2',
      question: "Who is your father's father?",
      type: 'mcq',
      options: ["Uncle", "Grandfather", "Brother", "Cousin"],
      correctAnswer: "Grandfather",
      hint: 'Think about your father\'s parents',
      explanation: 'Your father\'s father is your grandfather.',
      topic: 'Family Members',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'fam_1_3',
      question: "Who are your parents' children?",
      type: 'mcq',
      options: ["Grandparents", "Aunt and Uncle", "You and your siblings", "Cousins"],
      correctAnswer: "You and your siblings",
      hint: 'Think about who lives in your house with you',
      explanation: 'You and your brothers/sisters are your parents\' children.',
      topic: 'Family Relations',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'fam_1_4',
      question: "What do CHILDREN do for the family?",
      type: 'mcq',
      options: ["Earn money", "Study, help at home, show love", "Cook food", "Pay bills"],
      correctAnswer: "Study, help at home, show love",
      hint: 'Think about what kids do at home',
      explanation: 'Children study, help with small tasks, and bring joy to the family.',
      topic: 'Roles',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'fam_1_5',
      question: "What do PARENTS do for the family?",
      type: 'mcq',
      options: ["Sleep all day", "Earn money, love and care for children, teach values", "Play games", "Watch TV"],
      correctAnswer: "Earn money, love and care for children, teach values",
      hint: 'Think about how parents take care of you',
      explanation: 'Parents work, provide love, care, and teach right from wrong.',
      topic: 'Roles',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'fam_1_6',
      question: "Who is your aunt's child?",
      type: 'mcq',
      options: ["Grandmother", "Sister", "Cousin", "Brother"],
      correctAnswer: "Cousin",
      hint: 'Your aunt is your parent\'s sister',
      explanation: 'Children of your aunt/uncle are your cousins.',
      topic: 'Family Relations',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'fam_1_7',
      question: "Arrange from OLDEST to YOUNGEST: Grandfather, Me, Mother, Baby cousin",
      type: 'sequence',
      correctAnswer: ["Grandfather", "Mother", "Baby cousin", "Me"],
      hint: 'Think about generations',
      explanation: 'Grandfather is oldest, then Mother, then Baby cousin, then Me.',
      topic: 'Age Order',
      difficulty: 'easy',
      points: 12,
    },
    {
      id: 'fam_1_8',
      question: "What do GRANDPARENTS do?",
      type: 'mcq',
      options: ["Go to school", "Share wisdom, give love, tell stories", "Work in offices", "Play video games"],
      correctAnswer: "Share wisdom, give love, tell stories",
      hint: 'Think about what grandparents share',
      explanation: 'Grandparents share life experiences, love, and family stories.',
      topic: 'Roles',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'fam_1_9',
      question: "Who is your uncle?",
      type: 'mcq',
      options: ["Your mother's brother", "Your father's brother", "Either could be true", "Your pet's name"],
      correctAnswer: "Either could be true",
      hint: 'Think about who can be an uncle',
      explanation: 'Uncle can be either your mother\'s brother or your father\'s brother.',
      topic: 'Family Members',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'fam_1_10',
      question: "Children should _____ their elders.",
      type: 'fill_blank',
      correctAnswer: "respect",
      hint: 'Think about good behavior towards older people',
      explanation: 'Children should always respect their elders.',
      topic: 'Values',
      difficulty: 'easy',
      points: 10,
    },
  ],
  medium: [
    {
      id: 'fam_m1_1',
      question: "What is a JOINT FAMILY?",
      type: 'mcq',
      options: ["Only parents and child", "Grandparents, parents, uncles, aunts living together", "A family near the sea", "A family with only one pet"],
      correctAnswer: "Grandparents, parents, uncles, aunts living together",
      hint: 'Think about extended family living together',
      explanation: 'A joint family has multiple generations living together.',
      topic: 'Types of Families',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'fam_m1_2',
      question: "What is a NUCLEAR FAMILY?",
      type: 'mcq',
      options: ["Parents and children only", "Very large family", "Family with many pets", "Family living in a nuclear power plant"],
      correctAnswer: "Parents and children only",
      hint: 'Think about a small family unit',
      explanation: 'A nuclear family consists of parents and their children only.',
      topic: 'Types of Families',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'fam_m1_3',
      question: "Arrange from youngest to oldest:\nGrandfather, Father, Me, Brother",
      type: 'sequence',
      correctAnswer: ["Me", "Brother", "Father", "Grandfather"],
      hint: 'Think about family generations',
      explanation: 'You and your brother are youngest, then Father, then Grandfather is oldest.',
      topic: 'Age Order',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'fam_m1_4',
      question: "Name one role of each: Mother, Father, Grandmother",
      type: 'fill_blank',
      correctAnswer: "Mother: care/love | Father: protection/money | Grandmother: wisdom/stories",
      hint: 'Think about what each family member does',
      explanation: 'Mothers provide care, fathers provide protection, grandmothers share wisdom.',
      topic: 'Roles',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'fam_m1_5',
      question: "What are COUSINS?",
      type: 'mcq',
      options: ["Children of your parents", "Children of your aunt and uncle", "Children of your grandparents", "Your brothers and sisters"],
      correctAnswer: "Children of your aunt and uncle",
      hint: 'Think about extended family',
      explanation: 'Cousins are children of your aunt and uncle.',
      topic: 'Family Relations',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'fam_m1_6',
      question: "What are 3 qualities of a happy family?",
      type: 'fill_blank',
      correctAnswer: "Love, respect, communication, sharing, helping each other",
      hint: 'Think about what makes family bonds strong',
      explanation: 'Happy families share love, respect, communicate, and help each other.',
      topic: 'Family Values',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'fam_m1_7',
      question: "What should you do if you see family members fighting?",
      type: 'mcq',
      options: ["Join the fight", "Stay quiet", "Try to calm them or get help from elders", "Run away"],
      correctAnswer: "Try to calm them or get help from elders",
      hint: 'Think about solving problems peacefully',
      explanation: 'Stay calm and seek help from a trusted elder to resolve conflicts.',
      topic: 'Problem Solving',
      difficulty: 'medium',
      points: 15,
    },
  ],
  hard: [
    {
      id: 'fam_h1_1',
      question: "Compare joint family and nuclear family - give 3 differences",
      type: 'fill_blank',
      correctAnswer: "Joint: more members, shared resources | Nuclear: fewer, independent",
      hint: 'Think about size, independence, and shared resources',
      explanation: 'Joint families have many members and shared resources. Nuclear families are smaller and more independent.',
      topic: 'Comparison',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'fam_h1_2',
      question: "Draw your family tree with at least 6 family members",
      type: 'fill_blank',
      correctAnswer: "Draw shows 3 generations with correct relationships",
      hint: 'Think about grandparents, parents, and yourself',
      explanation: 'A family tree shows relationships across generations.',
      topic: 'Family Tree',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'fam_h1_3',
      question: "What are the responsibilities of children towards their family?",
      type: 'fill_blank',
      correctAnswer: "Study, help at home, respect elders, share work, be honest",
      hint: 'Think about duties at home',
      explanation: 'Children should study well, help with chores, respect elders, and be honest.',
      topic: 'Responsibilities',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'fam_h1_4',
      question: "How has the concept of family changed over time?",
      type: 'mcq',
      options: ["No change at all", "More joint families now", "From joint to more nuclear families", "Children now live alone"],
      correctAnswer: "From joint to more nuclear families",
      hint: 'Think about modern family trends',
      explanation: 'Modern times show a shift from joint families to more nuclear families.',
      topic: 'Family Changes',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'fam_h1_5',
      question: "What are the 5 main roles in a traditional family?",
      type: 'fill_blank',
      correctAnswer: "Provider, protector, nurturer, educator, caretaker",
      hint: 'Think about different functions in a family',
      explanation: 'Family members have roles: provider (earns money), protector, nurturer, educator, caretaker.',
      topic: 'Family Roles',
      difficulty: 'hard',
      points: 25,
    },
  ],
};

const getDifficulty = (level: number): DifficultyLevel => {
  switch (level) {
    case 1: return 'easy';
    case 2: return 'medium';
    case 3: return 'hard';
    default: return 'easy';
  }
};

const generateQuestionSet = (chapter: number, level: number): FamilyCircleQuestion[] => {
  const difficulty = getDifficulty(level);
  const questions = [...(questionsData[difficulty] || [])];
  return questions.sort(() => Math.random() - 0.5).slice(0, 10);
};

export const useFamilyCircleStore = create<FamilyCircleGameState>((set, get) => ({
  currentChapter: 4,
  currentLevel: 1,
  questions: [],
  currentQuestionIndex: 0,
  currentQuestion: null,
  selectedAnswer: null,
  answered: false,
  showFeedback: false,
  streak: 0,
  bestStreak: 0,
  hintUsed: false,
  gameStarted: false,
  gameCompleted: false,
  levelCompleted: false,
  passedLevel: false,
  score: 0,
  totalAnswered: 0,
  correctAnswers: 0,

  startGame: (chapter: number, level: number) => {
    const questionSet = generateQuestionSet(chapter, level);
    const firstQuestion = questionSet[0];
    
    set({
      currentChapter: chapter,
      currentLevel: level,
      questions: questionSet,
      currentQuestionIndex: 0,
      currentQuestion: firstQuestion,
      selectedAnswer: null,
      answered: false,
      showFeedback: false,
      streak: 0,
      bestStreak: 0,
      hintUsed: false,
      gameStarted: true,
      gameCompleted: false,
      levelCompleted: false,
      passedLevel: false,
      score: 0,
      totalAnswered: 0,
      correctAnswers: 0,
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
    const bonusPoints = Math.min(newStreak * 2, 10);
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
      hintUsed: false,
    });
  },

  retryLevel: () => {
    const state = get();
    const questionSet = generateQuestionSet(state.currentChapter, state.currentLevel);
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
      chapter: state.currentChapter,
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

