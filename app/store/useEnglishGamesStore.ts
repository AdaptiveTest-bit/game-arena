import { create } from 'zustand';

export type GameType = 'story' | 'vocabulary' | 'grammar' | 'comprehension' | 'moral';
export type DifficultyType = 'easy' | 'medium' | 'hard' | 'master';

export interface EnglishQuestion {
  id: string;
  question: string;
  questionHindi?: string;
  type: 'mcq' | 'fill_blank' | 'sequence' | 'match' | 'true_false';
  options?: string[];
  correctAnswer: string | string[];
  hint: string;
  explanation: string;
  chapter: string;
  topic: string;
  difficulty: DifficultyType;
  points: number;
}

export interface EnglishGameState {
  gameType: GameType;
  currentLevel: number;
  currentChapter: number;
  questions: EnglishQuestion[];
  currentQuestionIndex: number;
  currentQuestion: EnglishQuestion | null;
  selectedAnswer: string | null;
  answered: boolean;
  showFeedback: boolean;
  askedQuestions: Set<string>;
  consecutiveCorrect: number;
  hintUsed: boolean;
  gameStarted: boolean;
  gameCompleted: boolean;
  levelCompleted: boolean;
  passedLevel: boolean;
  score: number;
  totalAnswered: number;
  correctAnswers: number;
  
  startGame: (gameType: GameType, level: number, chapter?: number) => void;
  selectAnswer: (answer: string) => boolean;
  useHint: () => void;
  nextQuestion: () => void;
  resetGame: () => void;
  retryLevel: () => void;
  getAccuracy: () => number;
  getTelemetryLog: () => Record<string, unknown>;
}

const class3Stories: Record<string, {
  title: string;
  characters: string[];
  moral: string;
  events?: { order: number; event: string }[];
  facts?: string[];
  vocabulary: { word: string; meaning: string; type: string }[];
}> = {
  chapter1: {
    title: "The Enormous Turnip",
    characters: ["grandpa", "grandma", "girl", "boy", "dog", "cat", "mouse"],
    moral: "Teamwork makes the dream work",
    events: [
      { order: 1, event: "Grandpa planted a turnip seed" },
      { order: 2, event: "The turnip grew enormous" },
      { order: 3, event: "Grandpa tried to pull it out" },
      { order: 4, event: "Grandma joined to help" },
      { order: 5, event: "Girl and boy joined" },
      { order: 6, event: "Dog, cat, and mouse joined" },
      { order: 7, event: "Together they pulled the turnip!" },
    ],
    vocabulary: [
      { word: "enormous", meaning: "very big", type: "adjective" },
      { word: "pull", meaning: "to hold and move something towards you", type: "verb" },
      { word: "together", meaning: "with someone else", type: "adverb" },
      { word: "tried", meaning: "made an effort to do something", type: "verb" },
    ],
  },
  chapter2: {
    title: "The Ship of the Desert",
    characters: ["camel", "desert", "oasis", "traveler"],
    moral: "Adapt to your surroundings",
    facts: [
      "Camels are called ships of the desert",
      "They can live without water for many days",
      "Camels have humps that store fat",
      "They have wide feet for walking on sand",
    ],
    vocabulary: [
      { word: "desert", meaning: "a dry area with little rain", type: "noun" },
      { word: "oasis", meaning: "a water source in a desert", type: "noun" },
      { word: "survive", meaning: "to continue living", type: "verb" },
      { word: "adapt", meaning: "to change according to conditions", type: "verb" },
    ],
  },
  chapter3: {
    title: "The Little Red Hen",
    characters: ["hen", "chicks", "farm animals"],
    moral: "Those who work deserve to enjoy",
    events: [
      { order: 1, event: "Little Red Hen found grains of wheat" },
      { order: 2, event: "She asked who would plant the wheat" },
      { order: 3, event: "No one volunteered" },
      { order: 4, event: "Hen planted the wheat herself" },
      { order: 5, event: "She asked who would cut the wheat" },
      { order: 6, event: "No one volunteered" },
      { order: 7, event: "Hen cut the wheat herself" },
      { order: 8, event: "She baked bread and ate it all!" },
    ],
    vocabulary: [
      { word: "grain", meaning: "a small hard seed", type: "noun" },
      { word: "harvest", meaning: "to gather crops", type: "verb" },
      { word: "bake", meaning: "to cook in an oven", type: "verb" },
      { word: "deserve", meaning: "to have earned something", type: "verb" },
    ],
  },
  chapter4: {
    title: "The Crow and the Water Pot",
    characters: ["crow", "village"],
    moral: "Necessity is the mother of invention",
    events: [
      { order: 1, event: "A crow was very thirsty" },
      { order: 2, event: "He found a water pot" },
      { order: 3, event: "The water was low in the pot" },
      { order: 4, event: "Crow could not reach the water" },
      { order: 5, event: "He had an idea" },
      { order: 6, event: "He dropped pebbles in the pot" },
      { order: 7, event: "Water rose up" },
      { order: 8, event: "Crow drank the water!" },
    ],
    vocabulary: [
      { word: "thirsty", meaning: "needing to drink", type: "adjective" },
      { word: "pebbles", meaning: "small stones", type: "noun" },
      { word: "invent", meaning: "to create something new", type: "verb" },
      { word: "solution", meaning: "answer to a problem", type: "noun" },
    ],
  },
};

const generateStoryQuestions = (difficulty: DifficultyType, chapter: number): EnglishQuestion[] => {
  const chapterKey = `chapter${chapter}` as keyof typeof class3Stories;
  const story = class3Stories[chapterKey] || class3Stories.chapter1;
  const events = story.events || [];
  
  const questions: EnglishQuestion[] = [];
  
  questions.push({
    id: `story_seq_${chapter}_1`,
    question: `Put these events from "${story.title}" in the correct order:`,
    questionHindi: `${story.title} की इन घटनाओं को सही क्रम में लगाएं:`,
    type: 'sequence',
    correctAnswer: events.map((e: { order: number; event: string }) => e.event),
    hint: 'Think about what happened first, then next...',
    explanation: `The correct order shows how the story progresses from beginning to end.`,
    chapter: `Chapter ${chapter}`,
    topic: 'Story Sequencing',
    difficulty,
    points: 10,
  });
  
  questions.push({
    id: `story_main_${chapter}_1`,
    question: `What is the MAIN MESSAGE of "${story.title}"?`,
    questionHindi: `"${story.title}" का मुख्य संदेश क्या है?`,
    type: 'mcq',
    options: [
      story.moral,
      "Always work alone",
      "Do not help others",
      "Give up when it is hard",
    ],
    correctAnswer: story.moral,
    hint: 'Think about what the story teaches us',
    explanation: `The story teaches us that ${story.moral.toLowerCase()}.`,
    chapter: `Chapter ${chapter}`,
    topic: 'Main Idea',
    difficulty,
    points: 10,
  });
  
  questions.push({
    id: `story_char_${chapter}_1`,
    question: `Who is the MAIN CHARACTER in "${story.title}"?`,
    questionHindi: `"${story.title}" में मुख्य पात्र कौन है?`,
    type: 'mcq',
    options: story.characters.slice(0, 4),
    correctAnswer: story.characters[0],
    hint: 'Think about who the story is mainly about',
    explanation: `${story.characters[0]} is the main character in this story.`,
    chapter: `Chapter ${chapter}`,
    topic: 'Characters',
    difficulty,
    points: 10,
  });
  
  return questions;
};

const generateVocabularyQuestions = (difficulty: DifficultyType, chapter: number): EnglishQuestion[] => {
  const chapterKey = `chapter${chapter}` as keyof typeof class3Stories;
  const story = class3Stories[chapterKey] || class3Stories.chapter1;
  const vocab = story.vocabulary;
  
  const questions: EnglishQuestion[] = [];
  
  vocab.slice(0, 4).forEach((item: { word: string; meaning: string; type: string }, idx: number) => {
    const wrongOptions = ["very small", "to run fast", "a type of food"];
    
    questions.push({
      id: `vocab_mean_${chapter}_${idx}`,
      question: `What does the word "${item.word}" mean?`,
      questionHindi: `"${item.word}" शब्द का क्या अर्थ है?`,
      type: 'mcq',
      options: [item.meaning, ...wrongOptions],
      correctAnswer: item.meaning,
      hint: `Think about how "${item.word}" is used in sentences`,
      explanation: `"${item.word}" means ${item.meaning.toLowerCase()}.`,
      chapter: `Chapter ${chapter}`,
      topic: 'Vocabulary',
      difficulty,
      points: 10,
    });
  });
  
  if (difficulty !== 'easy') {
    questions.push({
      id: `vocab_fill_${chapter}_1`,
      question: `Fill in the blank: The sun is very _______ in the sky.`,
      questionHindi: `रिक्त स्थान भरें: आकाश में सूरज बहुत _______ है।`,
      type: 'fill_blank',
      correctAnswer: "bright",
      hint: 'Think about what the sun looks like',
      explanation: 'The sun is bright - it gives light.',
      chapter: `Chapter ${chapter}`,
      topic: 'Vocabulary Usage',
      difficulty,
      points: 15,
    });
  }
  
  return questions;
};

const generateGrammarQuestions = (difficulty: DifficultyType, chapter: number): EnglishQuestion[] => {
  const questions: EnglishQuestion[] = [];
  
  questions.push({
    id: `grammar_noun_${chapter}_1`,
    question: "Which word is a NOUN (a person, place, or thing)?",
    questionHindi: "कौन सा शब्द संज्ञा (noun) है?",
    type: 'mcq',
    options: ["quickly", "school", "running", "blue"],
    correctAnswer: "school",
    hint: 'A noun is a person, place, or thing you can touch or see',
    explanation: '"school" is a place, so it is a noun.',
    chapter: `Chapter ${chapter}`,
    topic: 'Nouns',
    difficulty,
    points: 10,
  });
  
  questions.push({
    id: `grammar_verb_${chapter}_1`,
    question: "Which word is a VERB (an action word)?",
    questionHindi: "कौन सा शब्द क्रिया (verb) है?",
    type: 'mcq',
    options: ["beautiful", "jump", "red", "table"],
    correctAnswer: "jump",
    hint: 'A verb shows an action - something you do',
    explanation: '"jump" is an action, so it is a verb.',
    chapter: `Chapter ${chapter}`,
    topic: 'Verbs',
    difficulty,
    points: 10,
  });
  
  questions.push({
    id: `grammar_adj_${chapter}_1`,
    question: "Which word is an ADJECTIVE (describes a noun)?",
    questionHindi: "कौन सा शब्द विशेषण (adjective) है?",
    type: 'mcq',
    options: ["run", "table", "happy", "quickly"],
    correctAnswer: "happy",
    hint: 'An adjective tells us more about a noun',
    explanation: '"happy" describes a feeling, so it is an adjective.',
    chapter: `Chapter ${chapter}`,
    topic: 'Adjectives',
    difficulty,
    points: 10,
  });
  
  if (difficulty !== 'easy') {
    questions.push({
      id: `grammar_sent_${chapter}_1`,
      question: "Arrange: cat / is / The / cute -> Make a correct sentence",
      questionHindi: "सही वाक्य बनाएं: cat / is / The / cute",
      type: 'fill_blank',
      correctAnswer: "The cat is cute",
      hint: 'Start with capital letter, then subject, then verb',
      explanation: 'Correct sentence: "The cat is cute"',
      chapter: `Chapter ${chapter}`,
      topic: 'Sentence Building',
      difficulty,
      points: 15,
    });
  }
  
  return questions;
};

const generateComprehensionQuestions = (difficulty: DifficultyType, chapter: number): EnglishQuestion[] => {
  const chapterKey = `chapter${chapter}` as keyof typeof class3Stories;
  const story = class3Stories[chapterKey] || class3Stories.chapter1;
  
  const questions: EnglishQuestion[] = [];
  
  questions.push({
    id: `comp_why_${chapter}_1`,
    question: `WHY did the characters in "${story.title}" work together?`,
    questionHindi: `"${story.title}" में पात्रों ने एक साथ क्यों काम किया?`,
    type: 'mcq',
    options: [
      "Because they were friends",
      "Because they could accomplish more together",
      "Because they had no choice",
      "Because they wanted to be famous",
    ],
    correctAnswer: "Because they could accomplish more together",
    hint: 'Think about what happened when they worked together',
    explanation: 'When they worked together, they could do something they could not do alone.',
    chapter: `Chapter ${chapter}`,
    topic: 'Comprehension - Cause & Effect',
    difficulty,
    points: 15,
  });
  
  if (difficulty !== 'easy') {
    questions.push({
      id: `comp_infer_${chapter}_1`,
      question: `What would have happened if they did NOT work together in "${story.title}"?`,
      questionHindi: `अगर "${story.title}" में पात्रों ने एक साथ काम नहीं किया होता?`,
      type: 'fill_blank',
      correctAnswer: "They would not have succeeded",
      hint: 'Think about why teamwork was important',
      explanation: 'Without teamwork, they would not have been able to achieve their goal.',
      chapter: `Chapter ${chapter}`,
      topic: 'Inference',
      difficulty,
      points: 20,
    });
  }
  
  if (difficulty === 'hard' || difficulty === 'master') {
    questions.push({
      id: `comp_think_${chapter}_1`,
      question: `Can you think of another way to solve the problem in "${story.title}"?`,
      questionHindi: `क्या आप "${story.title}" में समस्या का कोई और हल सोच सकते हैं?`,
      type: 'fill_blank',
      correctAnswer: "creative answer",
      hint: 'Think creatively! There are many ways to solve problems.',
      explanation: 'There are always multiple solutions to a problem!',
      chapter: `Chapter ${chapter}`,
      topic: 'Critical Thinking',
      difficulty,
      points: 25,
    });
  }
  
  return questions;
};

const generateMoralQuestions = (difficulty: DifficultyType, chapter: number): EnglishQuestion[] => {
  const chapterKey = `chapter${chapter}` as keyof typeof class3Stories;
  const story = class3Stories[chapterKey] || class3Stories.chapter1;
  
  const questions: EnglishQuestion[] = [];
  
  questions.push({
    id: `moral_choice_${chapter}_1`,
    question: `If your friend is struggling with homework, what should you do? (From "${story.title}")`,
    questionHindi: `अगर दोस्त को होमवर्क में परेशानी है तो क्या करें?`,
    type: 'mcq',
    options: [
      "Help them understand",
      "Ignore them",
      "Copy their answers",
      "Make fun of them",
    ],
    correctAnswer: "Help them understand",
    hint: 'Think about what good friends do',
    explanation: 'Good friends help each other learn and grow together.',
    chapter: `Chapter ${chapter}`,
    topic: 'Values - Friendship',
    difficulty,
    points: 10,
  });
  
  questions.push({
    id: `moral_why_${chapter}_1`,
    question: `Why is it important to be kind and helpful like "${story.title}"?`,
    questionHindi: `दयालु होना क्यों महत्वपूर्ण है?`,
    type: 'mcq',
    options: [
      "It makes everyone happier and builds a better world",
      "So people will give you money",
      "Because you have to",
      "So you can be famous",
    ],
    correctAnswer: "It makes everyone happier and builds a better world",
    hint: 'Think about how kindness helps everyone',
    explanation: 'Kindness creates a positive environment where everyone can succeed.',
    chapter: `Chapter ${chapter}`,
    topic: 'Values - Kindness',
    difficulty,
    points: 15,
  });
  
  if (difficulty !== 'easy') {
    questions.push({
      id: `moral_apply_${chapter}_1`,
      question: `Tell about a time when you helped someone. How did it make you feel?`,
      questionHindi: `जब आपने किसी की मदद की, आपको कैसा लगा?`,
      type: 'fill_blank',
      correctAnswer: "helping others feels good",
      hint: 'Think about times when you shared or helped',
      explanation: 'Helping others usually makes us feel happy and proud!',
      chapter: `Chapter ${chapter}`,
      topic: 'Values Application',
      difficulty,
      points: 20,
    });
  }
  
  return questions;
};

const generateQuestions = (gameType: GameType, difficulty: DifficultyType, chapter: number): EnglishQuestion[] => {
  switch (gameType) {
    case 'story':
      return generateStoryQuestions(difficulty, chapter);
    case 'vocabulary':
      return generateVocabularyQuestions(difficulty, chapter);
    case 'grammar':
      return generateGrammarQuestions(difficulty, chapter);
    case 'comprehension':
      return generateComprehensionQuestions(difficulty, chapter);
    case 'moral':
      return generateMoralQuestions(difficulty, chapter);
    default:
      return generateStoryQuestions(difficulty, chapter);
  }
};

const getDifficulty = (level: number): DifficultyType => {
  switch (level) {
    case 1: return 'easy';
    case 2: return 'medium';
    case 3: return 'hard';
    case 4: return 'master';
    default: return 'easy';
  }
};

export const useEnglishGamesStore = create<EnglishGameState>((set, get) => {
  const generateQuestionSet = (gameType: GameType, level: number, chapter: number): EnglishQuestion[] => {
    const difficulty = getDifficulty(level);
    let questions: EnglishQuestion[] = [];
    
    const baseQuestions = generateQuestions(gameType, difficulty, chapter);
    const vocabQuestions = generateVocabularyQuestions(difficulty, (chapter % 4) + 1);
    const grammarQuestions = generateGrammarQuestions(difficulty, (chapter % 4) + 1);
    
    questions = [...baseQuestions];
    
    if (gameType !== 'vocabulary') {
      questions.push(...vocabQuestions.slice(0, 3));
    }
    
    if (gameType !== 'grammar') {
      questions.push(...grammarQuestions.slice(0, 3));
    }
    
    return questions.sort(() => Math.random() - 0.5).slice(0, 20);
  };

  return {
    gameType: 'story',
    currentLevel: 1,
    currentChapter: 1,
    questions: [],
    currentQuestionIndex: 0,
    currentQuestion: null,
    selectedAnswer: null,
    answered: false,
    showFeedback: false,
    askedQuestions: new Set(),
    consecutiveCorrect: 0,
    hintUsed: false,
    gameStarted: false,
    gameCompleted: false,
    levelCompleted: false,
    passedLevel: false,
    score: 0,
    totalAnswered: 0,
    correctAnswers: 0,

    startGame: (gameType: GameType, level: number, chapter = 1) => {
      const difficulty = getDifficulty(level);
      const questionSet = generateQuestionSet(gameType, level, chapter);
      const firstQuestion = questionSet[0];
      
      set({
        gameType,
        currentLevel: level,
        currentChapter: chapter,
        questions: questionSet,
        currentQuestionIndex: 0,
        currentQuestion: firstQuestion,
        selectedAnswer: null,
        answered: false,
        showFeedback: false,
        askedQuestions: new Set([firstQuestion.id]),
        consecutiveCorrect: 0,
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
      
      const newConsecutive = isCorrect ? state.consecutiveCorrect + 1 : 0;
      const bonusPoints = Math.min(newConsecutive * 5, 25);
      const questionPoints = state.currentQuestion.points + bonusPoints;
      
      set({
        selectedAnswer: answer,
        answered: true,
        showFeedback: true,
        totalAnswered: state.totalAnswered + 1,
        correctAnswers: isCorrect ? state.correctAnswers + 1 : state.correctAnswers,
        score: isCorrect ? state.score + questionPoints : state.score + 2,
        consecutiveCorrect: newConsecutive,
      });
      
      return isCorrect;
    },

    useHint: () => {
      const state = get();
      if (state.hintUsed || !state.currentQuestion || state.answered) return;
      
      set({
        hintUsed: true,
        score: Math.max(0, state.score - 10),
      });
    },

    nextQuestion: () => {
      const state = get();
      const nextIndex = state.currentQuestionIndex + 1;
      
      if (nextIndex >= state.questions.length) {
        const accuracy = state.totalAnswered > 0 ? state.correctAnswers / state.totalAnswered : 0;
        const passed = accuracy >= 0.9;
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
          askedQuestions: new Set([...state.askedQuestions, nextQuestion.id]),
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
        askedQuestions: new Set(),
        consecutiveCorrect: 0,
        hintUsed: false,
      });
    },

    retryLevel: () => {
      const state = get();
      const questionSet = generateQuestionSet(state.gameType, state.currentLevel, state.currentChapter);
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
        askedQuestions: new Set([firstQuestion.id]),
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
        chapter: state.currentChapter,
        score: state.score,
        accuracy: state.getAccuracy(),
        totalQuestions: state.totalAnswered,
        passed: state.passedLevel,
        timestamp: new Date().toISOString(),
      };
    },
  };
});

