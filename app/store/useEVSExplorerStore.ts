import { create } from 'zustand';

export type EVSGameType = 'my-life' | 'nature-quest' | 'food-home' | 'travel-culture' | 'mixed';
export type EVSDifficulty = 'easy' | 'medium' | 'hard' | 'adventure';

export interface EVSQuestion {
  id: string;
  question: string;
  questionHindi?: string;
  type: 'mcq' | 'fill_blank' | 'sequence' | 'match' | 'true_false' | 'classification';
  options?: string[];
  correctAnswer: string | string[];
  hint: string;
  explanation: string;
  chapter: string;
  topic: string;
  difficulty: EVSDifficulty;
  points: number;
  category: EVSGameType;
}

export interface EVSGameState {
  gameType: EVSGameType;
  currentLevel: number;
  questions: EVSQuestion[];
  currentQuestionIndex: number;
  currentQuestion: EVSQuestion | null;
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
  
  startGame: (gameType: EVSGameType, level: number) => void;
  selectAnswer: (answer: string) => boolean;
  useHint: () => void;
  nextQuestion: () => void;
  resetGame: () => void;
  retryLevel: () => void;
  getAccuracy: () => number;
  getTelemetryLog: () => Record<string, unknown>;
}

const questionsData: Record<EVSGameType, Record<EVSDifficulty, EVSQuestion[]>> = {
  'my-life': {
    easy: [
      { id: 'ml_e1_1', question: "Who is your mother's mother?", questionHindi: "आपकी माँ की माँ कौन है?", type: 'mcq', options: ["Grandmother", "Sister", "Aunt", "Cousin"], correctAnswer: "Grandmother", hint: 'Think about family generations', explanation: "Your mother's mother is your grandmother.", chapter: 'Family', topic: 'Family Members', difficulty: 'easy', points: 10, category: 'my-life' },
      { id: 'ml_e1_2', question: "What do we call children of our aunt?", questionHindi: "बुआ के बच्चों को क्या कहते हैं?", type: 'mcq', options: ["Cousins", "Brothers", "Sisters", "Twins"], correctAnswer: "Cousins", hint: 'They are related but not siblings', explanation: "Children of aunt and uncle are cousins.", chapter: 'Family', topic: 'Family Members', difficulty: 'easy', points: 10, category: 'my-life' },
      { id: 'ml_e1_3', question: "Who helps us when we are sick?", questionHindi: "बीमार होने पर कौन मदद करता है?", type: 'mcq', options: ["Teacher", "Doctor", "Farmer", "Driver"], correctAnswer: "Doctor", hint: 'Think about healthcare', explanation: "Doctors treat sick people.", chapter: 'Work', topic: 'Community Helpers', difficulty: 'easy', points: 10, category: 'my-life' },
      { id: 'ml_e1_4', question: "Who teaches us in school?", questionHindi: "स्कूल में कौन पढ़ाता है?", type: 'mcq', options: ["Doctor", "Farmer", "Teacher", "Pilot"], correctAnswer: "Teacher", hint: 'Think about learning', explanation: "Teachers help us learn.", chapter: 'Work', topic: 'Community Helpers', difficulty: 'easy', points: 10, category: 'my-life' },
      { id: 'ml_e1_5', question: "How do you feel when you get a gift?", questionHindi: "उपहार मिलने पर कैसा लगता है?", type: 'mcq', options: ["Sad", "Happy", "Angry", "Tired"], correctAnswer: "Happy", hint: 'Think about positive emotions', explanation: "Gifts make us happy.", chapter: 'Feelings', topic: 'Emotions', difficulty: 'easy', points: 10, category: 'my-life' },
    ],
    medium: [
      { id: 'ml_m1_1', question: "What is a JOINT FAMILY?", questionHindi: "संयुक्त परिवार क्या है?", type: 'mcq', options: ["Only parents and child", "Grandparents, parents, uncles living together", "A family near sea", "A family with pets"], correctAnswer: "Grandparents, parents, uncles living together", hint: 'Think about extended family', explanation: "Joint family has multiple generations.", chapter: 'Family', topic: 'Types of Families', difficulty: 'medium', points: 15, category: 'my-life' },
      { id: 'ml_m1_2', question: "What is a NUCLEAR FAMILY?", questionHindi: "नाभिकीय परिवार क्या है?", type: 'mcq', options: ["Parents and children only", "Only grandparents", "Very large family", "Family with animals"], correctAnswer: "Parents and children only", hint: 'Think about smaller family', explanation: "Nuclear family is parents and children.", chapter: 'Family', topic: 'Types of Families', difficulty: 'medium', points: 15, category: 'my-life' },
      { id: 'ml_m1_3', question: "What to do FIRST when waking up?", questionHindi: "सुबह उठकर सबसे पहले क्या करें?", type: 'mcq', options: ["Watch TV", "Brush teeth", "Sleep again", "Eat snacks"], correctAnswer: "Brush teeth", hint: 'Think about hygiene', explanation: "Brushing teeth is morning hygiene.", chapter: 'Daily Life', topic: 'Daily Routine', difficulty: 'medium', points: 12, category: 'my-life' },
      { id: 'ml_m1_4', question: "Friend is sad about lost toy. What to do?", questionHindi: "दोस्त का खिलौना खोया, क्या करें?", type: 'mcq', options: ["Laugh", "Ignore", "Comfort and share", "Say not important"], correctAnswer: "Comfort and share", hint: 'Be a good friend', explanation: "Kindness helps sad friends.", chapter: 'Feelings', topic: 'Empathy', difficulty: 'medium', points: 15, category: 'my-life' },
    ],
    hard: [
      { id: 'ml_h1_1', question: "If mother is sick, who can help?", questionHindi: "माँ बीमार तो कौन मदद करे?", type: 'mcq', options: ["Only father", "Family members can help", "Neighbors cannot", "No one"], correctAnswer: "Family members can help", hint: 'Think about family support', explanation: "Family supports each other.", chapter: 'Family', topic: 'What-if Scenarios', difficulty: 'hard', points: 20, category: 'my-life' },
      { id: 'ml_h1_2', question: "See bullying at school. What to do?", questionHindi: "बदमाशी दिखे तो क्या करें?", type: 'mcq', options: ["Join bullies", "Walk away", "Tell teacher", "Take photos"], correctAnswer: "Tell teacher", hint: 'Protect others', explanation: "Standing up against wrong is right.", chapter: 'School', topic: 'What-if Scenarios', difficulty: 'hard', points: 20, category: 'my-life' },
      { id: 'ml_h1_3', question: "Main difference JOINT vs NUCLEAR family?", questionHindi: "संयुक्त vs नाभिकीय अंतर?", type: 'mcq', options: ["Nuclear happier", "Joint has more members", "Nuclear bigger house", "Joint no love"], correctAnswer: "Joint has more members", hint: 'Think about family structure', explanation: "Joint has more generations.", chapter: 'Family', topic: 'Compare', difficulty: 'hard', points: 18, category: 'my-life' },
    ],
    adventure: [
      { id: 'ml_ma1', question: "Why share feelings with family?", questionHindi: "परिवार से भावनाएं क्यों साझा करें?", type: 'fill_blank', correctAnswer: "For support and love", hint: 'Think about emotional support', explanation: "Family support helps us feel better.", chapter: 'Feelings', topic: 'Emotional Intelligence', difficulty: 'adventure', points: 25, category: 'my-life' },
      { id: 'ml_ma2', question: "What are 3 qualities of a good friend?", questionHindi: "अच्छे दोस्त की 3 विशेषताएं?", type: 'fill_blank', correctAnswer: "Trustworthy, kind, helpful", hint: 'Think about friendship', explanation: "Good friends are honest and kind.", chapter: 'Friends', topic: 'Friendship', difficulty: 'adventure', points: 30, category: 'my-life' },
    ]
  },
  'nature-quest': {
    easy: [
      { id: 'n_e1_1', question: "What do plants need to make food?", questionHindi: "पौधों को भोजन के लिए क्या चाहिए?", type: 'mcq', options: ["Pizza", "Sunlight, air, water", "TV", "Candy"], correctAnswer: "Sunlight, air, water", hint: 'Think about photosynthesis', explanation: "Plants use sunlight, water, air.", chapter: 'Plants', topic: 'Plant Needs', difficulty: 'easy', points: 10, category: 'nature-quest' },
      { id: 'n_e1_2', question: "Which part absorbs water?", questionHindi: "कौन सा भाग पानी सोखता है?", type: 'mcq', options: ["Flowers", "Roots", "Leaves", "Stem"], correctAnswer: "Roots", hint: 'Think underground', explanation: "Roots absorb water from soil.", chapter: 'Plants', topic: 'Plant Parts', difficulty: 'easy', points: 10, category: 'nature-quest' },
      { id: 'n_e1_3', question: "Where does a cow live?", questionHindi: "गाय कहाँ रहती है?", type: 'mcq', options: ["Nest", "Byre", "Hive", "Cage"], correctAnswer: "Byre", hint: 'Think farm animals', explanation: "Cows live in a byre.", chapter: 'Animals', topic: 'Animal Homes', difficulty: 'easy', points: 10, category: 'nature-quest' },
      { id: 'n_e1_4', question: "Fresh water comes from?", questionHindi: "मीठा पानी कहाँ से आता है?", type: 'mcq', options: ["Oceans", "Rain", "Rivers", "Tap"], correctAnswer: "Rain", hint: 'Think water cycle', explanation: "Rain is fresh water source.", chapter: 'Water', topic: 'Water Sources', difficulty: 'easy', points: 10, category: 'nature-quest' },
    ],
    medium: [
      { id: 'n_m1_1', question: "Which is a LIVING thing?", questionHindi: "कौन सा जीवित है?", type: 'mcq', options: ["Rock", "Chair", "Flower", "Table"], correctAnswer: "Flower", hint: 'Can it grow?', explanation: "Flower grows and lives.", chapter: 'Living Things', topic: 'Classification', difficulty: 'medium', points: 12, category: 'nature-quest' },
      { id: 'n_m1_2', question: "Which is NON-LIVING?", questionHindi: "कौन सा निर्जीव है?", type: 'mcq', options: ["Dog", "Flower", "Water", "Cat"], correctAnswer: "Water", hint: 'Cannot breathe', explanation: "Water does not breathe.", chapter: 'Living Things', topic: 'Classification', difficulty: 'medium', points: 12, category: 'nature-quest' },
      { id: 'n_m1_3', question: "ROOTS do what?", questionHindi: "जड़ें क्या करती हैं?", type: 'mcq', options: ["Make food", "Absorb water", "Make seeds", "Carry food"], correctAnswer: "Absorb water", hint: 'Underground part', explanation: "Roots absorb and anchor.", chapter: 'Plants', topic: 'Plant Functions', difficulty: 'medium', points: 15, category: 'nature-quest' },
    ],
    hard: [
      { id: 'n_h1_1', question: "What if we waste water daily?", questionHindi: "रोजाना पानी बर्बाद हो तो?", type: 'mcq', options: ["More rain", "Less water for all", "Plants grow faster", "Rivers overflow"], correctAnswer: "Less water for all", hint: 'Think conservation', explanation: "Wasting water reduces supply.", chapter: 'Water', topic: 'Cause & Effect', difficulty: 'hard', points: 18, category: 'nature-quest' },
      { id: 'n_h1_2', question: "If all bees died, what happens?", questionHindi: "सभी मक्खियाँ मरें तो?", type: 'mcq', options: ["More flowers", "Plants no seeds, food problem", "More honey", "Birds eat worms"], correctAnswer: "Plants no seeds, food problem", hint: 'Think pollination', explanation: "Bees pollinate plants.", chapter: 'Web of Life', topic: 'Food Chain', difficulty: 'hard', points: 20, category: 'nature-quest' },
    ],
    adventure: [
      { id: 'n_ma1', question: "Design a 4-organism food chain", questionHindi: "4 जीवों की खाद्य श्रृंखला बनाओ", type: 'fill_blank', correctAnswer: "Sun → Grass → Rabbit → Eagle", hint: 'Energy flow', explanation: "Energy flows from sun.", chapter: 'Web of Life', topic: 'Food Chain', difficulty: 'adventure', points: 30, category: 'nature-quest' },
      { id: 'n_ma2', question: "3 ways to save water at home", questionHindi: "घर पर पानी बचाने के 3 तरीके", type: 'fill_blank', correctAnswer: "Turn off tap, short shower, reuse water", hint: 'Daily habits', explanation: "Small changes save water.", chapter: 'Water', topic: 'Conservation', difficulty: 'adventure', points: 30, category: 'nature-quest' },
    ]
  },
  'food-home': {
    easy: [
      { id: 'fh_e1_1', question: "Which food comes from a plant?", questionHindi: "कौन सा भोजन पौधे से आता है?", type: 'mcq', options: ["Chicken", "Apple", "Fish", "Egg"], correctAnswer: "Apple", hint: 'Think fruits', explanation: "Apples grow on trees.", chapter: 'Foods', topic: 'Food Sources', difficulty: 'easy', points: 10, category: 'food-home' },
      { id: 'fh_e1_2', question: "Which food comes FROM an animal?", questionHindi: "कौन सा भोजन जानवर से आता है?", type: 'mcq', options: ["Rice", "Milk", "Carrot", "Banana"], correctAnswer: "Milk", hint: 'Animal products', explanation: "Milk comes from cows.", chapter: 'Foods', topic: 'Food Sources', difficulty: 'easy', points: 10, category: 'food-home' },
      { id: 'fh_e1_3', question: "What builds houses in snowy areas?", questionHindi: "बर्फीले इलाकों में घर किससे?", type: 'mcq', options: ["Wood", "Ice blocks (Igloo)", "Straw", "Glass"], correctAnswer: "Ice blocks (Igloo)", hint: 'Arctic homes', explanation: "Igloos are made of ice.", chapter: 'Houses', topic: 'Types of Houses', difficulty: 'easy', points: 10, category: 'food-home' },
      { id: 'fh_e1_4', question: "What to wear when raining?", questionHindi: "बारिश में क्या पहनें?", type: 'mcq', options: ["Sunglasses", "Raincoat/umbrella", "Shorts", "Sandals"], correctAnswer: "Raincoat/umbrella", hint: 'Stay dry', explanation: "Rain gear keeps us dry.", chapter: 'Weather', topic: 'Clothing', difficulty: 'easy', points: 10, category: 'food-home' },
    ],
    medium: [
      { id: 'fh_m1_1', question: "Which food MORE for healthy body?", questionHindi: "स्वास्थ्य के लिए क्या खाएं?", type: 'mcq', options: ["Fruits, vegetables, grains", "Only sweets", "Fried food", "Chips"], correctAnswer: "Fruits, vegetables, grains", hint: 'Balanced diet', explanation: "Healthy foods give vitamins.", chapter: 'Foods', topic: 'Healthy Eating', difficulty: 'medium', points: 12, category: 'food-home' },
      { id: 'fh_m1_2', question: "Why eat salads in hot countries?", questionHindi: "गर्म देशों में सलाद क्यों?", type: 'mcq', options: ["Expensive", "Keeps body cool", "More salt", "Makes hotter"], correctAnswer: "Keeps body cool", hint: 'Body temperature', explanation: "Cold foods cool the body.", chapter: 'Foods', topic: 'Climate & Food', difficulty: 'medium', points: 15, category: 'food-home' },
      { id: 'fh_m1_3', question: "Why sloping roofs in rainy areas?", questionHindi: "बारिशी इलाकों में झुकी छतें?", type: 'mcq', options: ["Decoration", "Water slides off", "Collect water", "Block sun"], correctAnswer: "Water slides off", hint: 'Water flow', explanation: "Sloping roofs drain water.", chapter: 'Houses', topic: 'House Design', difficulty: 'medium', points: 15, category: 'food-home' },
    ],
    hard: [
      { id: 'fh_h1_1', question: "Why wooden houses in snowy areas?", questionHindi: "बर्फीले इलाकों में लकड़ी के घर?", type: 'mcq', options: ["Cheap", "Keeps warm", "Snow white", "Wood melts"], correctAnswer: "Keeps warm", hint: 'Insulation', explanation: "Wood insulates well.", chapter: 'Houses', topic: 'Climate', difficulty: 'hard', points: 18, category: 'food-home' },
    ],
    adventure: [
      { id: 'fh_ma1', question: "Plan a healthy day of meals", questionHindi: "एक दिन का स्वस्थ भोजन", type: 'fill_blank', correctAnswer: "Breakfast: fruits/milk, Lunch: rice/dal/veg, Dinner: chapati/soup", hint: 'Balanced nutrition', explanation: "All meals should be healthy.", chapter: 'Foods', topic: 'Meal Planning', difficulty: 'adventure', points: 30, category: 'food-home' },
    ]
  },
  'travel-culture': {
    easy: [
      { id: 't_e1_1', question: "Transport for long journey across countries?", questionHindi: "दूर देशों की यात्रा के लिए?", type: 'mcq', options: ["Bicycle", "Airplane", "Walking", "Bus"], correctAnswer: "Airplane", hint: 'Fast travel', explanation: "Airplanes are fastest.", chapter: 'Transport', topic: 'Types', difficulty: 'easy', points: 10, category: 'travel-culture' },
      { id: 't_e1_2', question: "Best for school nearby?", questionHindi: "पास के स्कूल के लिए?", type: 'mcq', options: ["Airplane", "Car", "Bus", "Walk/bicycle"], correctAnswer: "Walk/bicycle", hint: 'Short distance', explanation: "Walking is healthy.", chapter: 'Transport', topic: 'Types', difficulty: 'easy', points: 10, category: 'travel-culture' },
      { id: 't_e1_3', question: "How send letter far away?", questionHindi: "दूर पत्र कैसे भेजें?", type: 'mcq', options: ["Give directly", "Letterbox", "Shout", "Telepathy"], correctAnswer: "Letterbox", hint: 'Postal service', explanation: "Post office delivers.", chapter: 'Communication', topic: 'Letters', difficulty: 'easy', points: 10, category: 'travel-culture' },
      { id: 't_e1_4', question: "Talk to someone far away instantly?", questionHindi: "दूर से तुरंत बात?", type: 'mcq', options: ["Paper", "Phone", "Letter", "Telegram"], correctAnswer: "Phone", hint: 'Instant communication', explanation: "Phones connect instantly.", chapter: 'Communication', topic: 'Tools', difficulty: 'easy', points: 10, category: 'travel-culture' },
    ],
    medium: [
      { id: 't_m1_1', question: "Best transport for heavy goods?", questionHindi: "भारी सामान के लिए?", type: 'mcq', options: ["Trucks", "Trains/ships", "Airplanes", "Bicycles"], correctAnswer: "Trains/ships", hint: 'Carrying capacity', explanation: "Trains/ships carry more.", chapter: 'Transport', topic: 'Goods', difficulty: 'medium', points: 15, category: 'travel-culture' },
      { id: 't_m1_2', question: "5km to temple, which transport?", questionHindi: "5 किमी मंदिर के लिए?", type: 'mcq', options: ["Airplane", "Car", "Walk/bus", "Helicopter"], correctAnswer: "Walk/bus", hint: 'Practical distance', explanation: "Short distance = walk/bus.", chapter: 'Transport', topic: 'Distance', difficulty: 'medium', points: 12, category: 'travel-culture' },
    ],
    hard: [
      { id: 't_h1_1', question: "Before phones, send messages fast?", questionHindi: "फोन से पहले तेज़ संदेश?", type: 'mcq', options: ["Run fast", "Telegram", "Shout", "Birds"], correctAnswer: "Telegram", hint: 'Old communication', explanation: "Telegraph sent signals.", chapter: 'Communication', topic: 'History', difficulty: 'hard', points: 18, category: 'travel-culture' },
    ],
    adventure: [
      { id: 't_ma1', question: "Design an ideal transport system for your city", questionHindi: "शहर के लिए परिवहन योजना", type: 'fill_blank', correctAnswer: "Public transport, bike lanes, walking paths, disabled access", hint: 'Think about all people', explanation: "Good transport serves everyone.", chapter: 'Transport', topic: 'Planning', difficulty: 'adventure', points: 30, category: 'travel-culture' },
    ]
  },
  'mixed': {
    easy: [],
    medium: [],
    hard: [],
    adventure: []
  }
};

const getDifficulty = (level: number): EVSDifficulty => {
  switch (level) {
    case 1: return 'easy';
    case 2: return 'medium';
    case 3: return 'hard';
    case 4: return 'adventure';
    default: return 'easy';
  }
};

const generateQuestionSet = (gameType: EVSGameType, level: number): EVSQuestion[] => {
  const difficulty = getDifficulty(level);
  let allQuestions: EVSQuestion[] = [];
  
  if (gameType === 'mixed') {
    Object.values(questionsData).forEach(cat => {
      allQuestions = [...allQuestions, ...(cat[difficulty] || [])];
    });
  } else {
    allQuestions = [...(questionsData[gameType]?.[difficulty] || [])];
  }
  
  return allQuestions.sort(() => Math.random() - 0.5).slice(0, 15);
};

export const useEVSExplorerStore = create<EVSGameState>((set, get) => ({
  gameType: 'my-life',
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

  startGame: (gameType: EVSGameType, level: number) => {
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

