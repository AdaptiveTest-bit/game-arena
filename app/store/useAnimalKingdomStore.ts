import { create } from 'zustand';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type AnimalCategory = 'wild' | 'pet' | 'farm';

export interface AnimalKingdomQuestion {
  id: string;
  question: string;
  type: 'mcq' | 'fill_blank' | 'match' | 'classification';
  options?: string[];
  correctAnswer: string | string[];
  hint: string;
  explanation: string;
  topic: string;
  difficulty: DifficultyLevel;
  points: number;
  category?: AnimalCategory;
}

export interface AnimalKingdomGameState {
  currentChapter: number;
  currentLevel: number;
  questions: AnimalKingdomQuestion[];
  currentQuestionIndex: number;
  currentQuestion: AnimalKingdomQuestion | null;
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

// Animal data
const animalsData = {
  wild: ['Lion', 'Tiger', 'Elephant', 'Monkey', 'Snake', 'Deer', 'Zebra', 'Giraffe', 'Bear', 'Wolf'],
  pet: ['Dog', 'Cat', 'Fish', 'Parrot', 'Rabbit', 'Hamster', 'Guinea pig', 'Turtle', 'Canary', 'Lovebird'],
  farm: ['Cow', 'Buffalo', 'Goat', 'Sheep', 'Horse', 'Pig', 'Chicken', 'Duck', 'Donkey', 'Rabbit'],
};

// Animal homes
const animalHomes = {
  'Lion': 'Den',
  'Tiger': 'Den',
  'Elephant': 'Forest',
  'Monkey': 'Trees',
  'Snake': 'Hole',
  'Deer': 'Forest',
  'Dog': 'House',
  'Cat': 'House',
  'Fish': 'Pond/Water',
  'Parrot': 'Nest',
  'Cow': 'Byre',
  'Buffalo': 'Byre',
  'Chicken': 'Coop',
  'Horse': 'Stable',
  'Rabbit': 'Burrow/Hutch',
};

// Animal food
const animalFood = {
  'Lion': 'Meat',
  'Tiger': 'Meat',
  'Elephant': 'Leaves',
  'Monkey': 'Fruits',
  'Snake': 'Small animals',
  'Deer': 'Grass',
  'Dog': 'Mixed/Food',
  'Cat': 'Fish/Meat',
  'Fish': 'Small organisms',
  'Parrot': 'Seeds/Fruits',
  'Cow': 'Grass',
  'Horse': 'Grass/Grains',
  'Chicken': 'Grains/Seeds',
  'Rabbit': 'Carrots/Grass',
};

// Question data for Chapter 3: Animals Around Us
const questionsData: Record<DifficultyLevel, AnimalKingdomQuestion[]> = {
  easy: [
    {
      id: 'animal_1_1',
      question: "Which is a WILD animal?",
      type: 'mcq',
      options: ["Dog", "Lion", "Cat", "Rabbit"],
      correctAnswer: "Lion",
      hint: 'Think about animals that live in forests',
      explanation: 'Lions live in forests and hunt for food - they are wild animals.',
      topic: 'Wild Animals',
      difficulty: 'easy',
      points: 10,
      category: 'wild',
    },
    {
      id: 'animal_1_2',
      question: "Which is a PET animal?",
      type: 'mcq',
      options: ["Tiger", "Elephant", "Dog", "Lion"],
      correctAnswer: "Dog",
      hint: 'Think about animals kept at home',
      explanation: 'Dogs live with families as companions - they are pets.',
      topic: 'Pet Animals',
      difficulty: 'easy',
      points: 10,
      category: 'pet',
    },
    {
      id: 'animal_1_3',
      question: "Which is a FARM animal?",
      type: 'mcq',
      options: ["Monkey", "Cow", "Tiger", "Snake"],
      correctAnswer: "Cow",
      hint: 'Think about animals that give us milk',
      explanation: 'Cows live on farms and give us milk - they are farm animals.',
      topic: 'Farm Animals',
      difficulty: 'easy',
      points: 10,
      category: 'farm',
    },
    {
      id: 'animal_1_4',
      question: "Where does a BIRD usually live?",
      type: 'mcq',
      options: ["Water", "Nest", "Den", "Burrow"],
      correctAnswer: "Nest",
      hint: 'Think about where birds build homes',
      explanation: 'Birds build nests in trees to live and lay eggs.',
      topic: 'Animal Homes',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'animal_1_5',
      question: "What do COWS eat?",
      type: 'mcq',
      options: ["Meat", "Fish", "Grass", "Fruits"],
      correctAnswer: "Grass",
      hint: 'Think about what cows graze on',
      explanation: 'Cows eat grass and are called herbivores.',
      topic: 'Animal Food',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'animal_1_6',
      question: "Which animal says 'Woof Woof'?",
      type: 'mcq',
      options: ["Cat", "Dog", "Cow", "Horse"],
      correctAnswer: "Dog",
      hint: 'Think about pet sounds',
      explanation: 'Dogs bark and say woof woof.',
      topic: 'Animal Sounds',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'animal_1_7',
      question: "Match: Dog → ?",
      type: 'mcq',
      options: ["House", "Den", "Nest", "Pond"],
      correctAnswer: "House",
      hint: 'Where does a pet dog live?',
      explanation: 'Pet dogs usually live in houses with their families.',
      topic: 'Animal Homes',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'animal_1_8',
      question: "Which is a FARM bird?",
      type: 'mcq',
      options: ["Eagle", "Parrot", "Chicken", "Peacock"],
      correctAnswer: "Chicken",
      hint: 'Think about birds that give us eggs',
      explanation: 'Chickens live on farms and give us eggs.',
      topic: 'Farm Animals',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'animal_1_9',
      question: "What does a CAT eat?",
      type: 'mcq',
      options: ["Only grass", "Fish and meat", "Leaves", "Seeds"],
      correctAnswer: "Fish and meat",
      hint: 'Think about what cats hunt',
      explanation: 'Cats are carnivores and eat fish, meat, and special cat food.',
      topic: 'Animal Food',
      difficulty: 'easy',
      points: 10,
    },
    {
      id: 'animal_1_10',
      question: "Where does a FISH live?",
      type: 'mcq',
      options: ["Trees", "Water", "Den", "Burrow"],
      correctAnswer: "Water",
      hint: 'Think about where fish swim',
      explanation: 'Fish live and breathe in water.',
      topic: 'Animal Homes',
      difficulty: 'easy',
      points: 10,
    },
  ],
  medium: [
    {
      id: 'animal_m1_1',
      question: "Classify these animals: Lion, Dog, Cow, Tiger, Cat, Horse",
      type: 'classification',
      options: ["Wild", "Pet", "Farm"],
      correctAnswer: ["Lion", "Tiger", "Dog", "Cat", "Cow", "Horse"],
      hint: 'Think about where each animal lives',
      explanation: 'Wild: Lion, Tiger | Pet: Dog, Cat | Farm: Cow, Horse',
      topic: 'Animal Classification',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'animal_m1_2',
      question: "Match the columns:\n1. Lion\na. Coop\n2. Chicken\nb. Den\n3. Horse\nc. Stable\n4. Rabbit\nd. Hutch",
      type: 'match',
      correctAnswer: ["1-b", "2-a", "3-c", "4-d"],
      hint: 'Think about where each animal lives',
      explanation: 'Lions live in dens, chickens in coops, horses in stables, rabbits in hutches.',
      topic: 'Animal Homes',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'animal_m1_3',
      question: "What do you call animals that eat ONLY plants?",
      type: 'mcq',
      options: ["Carnivores", "Herbivores", "Omnivores", "Insectivores"],
      correctAnswer: "Herbivores",
      hint: 'Think about plant-eaters',
      explanation: 'Animals that eat only plants are called herbivores (like cows, deer).',
      topic: 'Animal Types',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'animal_m1_4',
      question: "What do you call animals that eat BOTH plants and meat?",
      type: 'mcq',
      options: ["Carnivores", "Herbivores", "Omnivores", "Frugivores"],
      correctAnswer: "Omnivores",
      hint: 'Think about animals that eat everything',
      explanation: 'Animals that eat both plants and meat are called omnivores (like bears, pigs).',
      topic: 'Animal Types',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'animal_m1_5',
      question: "Match the food:\n1. Lion → ?\n2. Parrot → ?\n3. Cow → ?\n4. Fish → ?",
      type: 'match',
      correctAnswer: ["Meat", "Seeds/Fruits", "Grass", "Small organisms"],
      hint: 'Think about what each animal eats',
      explanation: 'Lions eat meat, parrots eat seeds/fruits, cows eat grass, fish eat small organisms.',
      topic: 'Animal Food',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'animal_m1_6',
      question: "Name one difference between wild and pet animals",
      type: 'fill_blank',
      correctAnswer: "Wild animals live in forests, pets live with humans",
      hint: 'Think about their living places',
      explanation: 'Wild animals live in forests/nature, while pets live with humans.',
      topic: 'Comparison',
      difficulty: 'medium',
      points: 15,
    },
    {
      id: 'animal_m1_7',
      question: "What is a baby cat called?",
      type: 'mcq',
      options: ["Puppy", "Kitten", "Calf", "Foal"],
      correctAnswer: "Kitten",
      hint: 'Think about baby animal names',
      explanation: 'A baby cat is called a kitten.',
      topic: 'Baby Animals',
      difficulty: 'medium',
      points: 15,
    },
  ],
  hard: [
    {
      id: 'animal_h1_1',
      question: "Explain the food chain: Grass → ? → Lion",
      type: 'fill_blank',
      correctAnswer: "Deer / Herbivore",
      hint: 'What eats grass and is eaten by lions?',
      explanation: 'In the food chain: Grass → Deer → Lion. The deer (herbivore) eats grass and is prey for the lion.',
      topic: 'Food Chain',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'animal_h1_2',
      question: "How do wild animals differ from farm animals in 3 ways?",
      type: 'fill_blank',
      correctAnswer: "Wild: free, hunt, forest | Farm: fenced, fed by humans, on farm",
      hint: 'Think about freedom, food source, and home',
      explanation: 'Wild animals are free, hunt for food, live in forests. Farm animals are fenced, fed by humans, live on farms.',
      topic: 'Comparison',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'animal_h1_3',
      question: "What is camouflage? Give an example",
      type: 'fill_blank',
      correctAnswer: "Blending with surroundings. Example: Tiger stripes in grass",
      hint: 'Think about how animals hide',
      explanation: 'Camouflage is when animals blend with their surroundings to hide, like a tiger\'s stripes in grass.',
      topic: 'Adaptation',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'animal_h1_4',
      question: "Why do animals hibernate in winter?",
      type: 'mcq',
      options: ["Because they are lazy", "To save energy when food is scarce", "To play in snow", "To grow faster"],
      correctAnswer: "To save energy when food is scarce",
      hint: 'Think about what happens in winter',
      explanation: 'Animals hibernate to save energy when food is hard to find in winter.',
      topic: 'Adaptation',
      difficulty: 'hard',
      points: 20,
    },
    {
      id: 'animal_h1_5',
      question: "Create a food chain with 4 organisms starting from the sun",
      type: 'fill_blank',
      correctAnswer: "Sun → Grass → Grasshopper → Frog → Snake → Eagle",
      hint: 'Think about energy flow from sun to producers to consumers',
      explanation: 'Energy flows from sun to plants, then to insects, then to frogs, then to snakes, then to eagles.',
      topic: 'Food Chain',
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

const generateQuestionSet = (chapter: number, level: number): AnimalKingdomQuestion[] => {
  const difficulty = getDifficulty(level);
  const questions = [...(questionsData[difficulty] || [])];
  return questions.sort(() => Math.random() - 0.5).slice(0, 10);
};

export const useAnimalKingdomStore = create<AnimalKingdomGameState>((set, get) => ({
  currentChapter: 3,
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

