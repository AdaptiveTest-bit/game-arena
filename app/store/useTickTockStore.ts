import { create } from 'zustand';

// ============================================
// TYPE DEFINITIONS
// ============================================

type QuestionType = 
  | 'set_clock' 
  | 'read_clock' 
  | 'daily_routine' 
  | 'sequence_events' 
  | 'days_order' 
  | 'days_before_after' 
  | 'duration' 
  | 'earlier_later';

type GamePhase = 'welcome' | 'difficulty_select' | 'playing' | 'feedback' | 'celebrating';

type Difficulty = 'easy' | 'medium' | 'hard';

interface Activity {
  emoji: string;
  text: string;
}

interface SequenceTemplate {
  theme: string;
  events: Activity[];
}

interface DurationPair {
  longer: Activity;
  shorter: Activity;
}

interface TimeOrderedActivity extends Activity {
  time: number;
}

interface Question {
  type: QuestionType;
  prompt: string;
  // For set_clock
  targetHour?: number;
  tolerance?: number;
  // For read_clock
  displayHour?: number;
  options?: string[];
  correctAnswer?: string;
  // For daily_routine
  activity?: Activity;
  dropZones?: string[];
  // For sequence_events
  theme?: string;
  shuffledEvents?: Activity[];
  correctOrder?: Activity[];
  // For days
  shuffledDays?: string[];
  correctDays?: string[];
  // For duration
  optionA?: Activity;
  optionB?: Activity;
  askForLonger?: boolean;
  // For earlier_later
  askForEarlier?: boolean;
}

interface TelemetryEntry {
  timestamp: number;
  round: number;
  questionType: QuestionType;
  questionData: any;
  userAnswer: any;
  isCorrect: boolean;
  timeSpent: number;
  attemptsOnQuestion: number;
}

interface TickTockState {
  // Session tracking
  gamePhase: GamePhase;
  difficulty: Difficulty;
  currentRound: number;
  totalRounds: number;
  score: number;
  correctAnswers: number;
  
  // Current question
  currentQuestion: Question | null;
  questionStartTime: number;
  attemptsOnQuestion: number;
  
  // Clock state (for set_clock)
  hourHandAngle: number;
  isDraggingHand: boolean;
  
  // Sequence/ordering state
  placedItems: (Activity | null)[];
  availableItems: Activity[];
  
  // Selected answer (for multiple choice)
  selectedOption: string | null;
  
  // Feedback
  isCorrect: boolean | null;
  showFeedback: boolean;
  feedbackMessage: string;
  
  // Telemetry
  telemetryLog: TelemetryEntry[];
  
  // Actions
  startGame: () => void;
  selectDifficulty: (difficulty: Difficulty) => void;
  generateQuestion: () => void;
  setHourHandAngle: (angle: number) => void;
  setIsDraggingHand: (isDragging: boolean) => void;
  selectOption: (option: string) => void;
  placeItemInSlot: (item: Activity, slotIndex: number) => void;
  removeItemFromSlot: (slotIndex: number) => void;
  submitAnswer: () => void;
  nextQuestion: () => void;
  skipQuestion: () => void;
  resetGame: () => void;
  getTelemetryLog: () => TelemetryEntry[];
}

// ============================================
// DATA CONSTANTS
// ============================================

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const DAILY_ACTIVITIES: Record<string, Activity[]> = {
  morning: [
    { emoji: '🛏️', text: 'Wake up from bed' },
    { emoji: '🪥', text: 'Brush your teeth' },
    { emoji: '🚌', text: 'Go to school' },
    { emoji: '🍳', text: 'Eat breakfast' },
    { emoji: '☀️', text: 'Sun rises' },
    { emoji: '📚', text: 'Morning assembly' },
  ],
  afternoon: [
    { emoji: '🍱', text: 'Eat lunch' },
    { emoji: '📖', text: 'Study in class' },
    { emoji: '☀️', text: 'Sun is high up' },
    { emoji: '🏫', text: 'School time' },
    { emoji: '✏️', text: 'Do classwork' },
  ],
  evening: [
    { emoji: '🏠', text: 'Come home from school' },
    { emoji: '🎮', text: 'Play with friends' },
    { emoji: '🌆', text: 'Sun sets' },
    { emoji: '📺', text: 'Watch TV' },
    { emoji: '🍪', text: 'Have a snack' },
  ],
  night: [
    { emoji: '🍽️', text: 'Eat dinner' },
    { emoji: '🌙', text: 'Moon comes out' },
    { emoji: '📖', text: 'Read a bedtime story' },
    { emoji: '😴', text: 'Go to sleep' },
    { emoji: '⭐', text: 'Stars twinkle' },
    { emoji: '🛁', text: 'Take a bath' },
  ],
};

const SEQUENCE_TEMPLATES: SequenceTemplate[] = [
  {
    theme: 'Birthday Party 🎂',
    events: [
      { emoji: '🎈', text: 'Invite friends' },
      { emoji: '🎂', text: 'Cut the cake' },
      { emoji: '🕯️', text: 'Blow candles' },
      { emoji: '🎁', text: 'Open gifts' },
    ],
  },
  {
    theme: 'Going to School 🏫',
    events: [
      { emoji: '⏰', text: 'Wake up' },
      { emoji: '🪥', text: 'Brush teeth' },
      { emoji: '🍳', text: 'Eat breakfast' },
      { emoji: '🚌', text: 'Catch the bus' },
    ],
  },
  {
    theme: 'Planting a Seed 🌱',
    events: [
      { emoji: '🕳️', text: 'Dig a hole' },
      { emoji: '🌰', text: 'Put the seed' },
      { emoji: '🚿', text: 'Water it' },
      { emoji: '🌱', text: 'Watch it grow' },
    ],
  },
  {
    theme: 'Making a Sandwich 🥪',
    events: [
      { emoji: '🍞', text: 'Get bread' },
      { emoji: '🧈', text: 'Spread butter' },
      { emoji: '🥬', text: 'Add veggies' },
      { emoji: '🥪', text: 'Close & eat' },
    ],
  },
  {
    theme: 'Taking a Bath 🛁',
    events: [
      { emoji: '🚿', text: 'Fill the tub' },
      { emoji: '🧼', text: 'Use soap' },
      { emoji: '💦', text: 'Rinse off' },
      { emoji: '🧴', text: 'Dry with towel' },
    ],
  },
  {
    theme: 'Reading a Book 📚',
    events: [
      { emoji: '📚', text: 'Pick a book' },
      { emoji: '📖', text: 'Open it' },
      { emoji: '👀', text: 'Read pages' },
      { emoji: '📕', text: 'Close the book' },
    ],
  },
  {
    theme: 'Getting Ready for Bed 🛏️',
    events: [
      { emoji: '🛁', text: 'Take a bath' },
      { emoji: '👕', text: 'Wear pajamas' },
      { emoji: '🪥', text: 'Brush teeth' },
      { emoji: '🛏️', text: 'Go to bed' },
    ],
  },
];

const DURATION_PAIRS: DurationPair[] = [
  { longer: { emoji: '🍳', text: 'Cooking dinner' }, shorter: { emoji: '🥛', text: 'Drinking milk' } },
  { longer: { emoji: '🎬', text: 'Watching a movie' }, shorter: { emoji: '📺', text: 'Watching an ad' } },
  { longer: { emoji: '🏫', text: 'A school day' }, shorter: { emoji: '⏰', text: 'One class period' } },
  { longer: { emoji: '✈️', text: 'Flying to another city' }, shorter: { emoji: '🚶', text: 'Walking to the shop' } },
  { longer: { emoji: '📖', text: 'Reading a storybook' }, shorter: { emoji: '📝', text: 'Writing your name' } },
  { longer: { emoji: '🛁', text: 'Taking a bath' }, shorter: { emoji: '🧼', text: 'Washing hands' } },
  { longer: { emoji: '😴', text: 'Sleeping at night' }, shorter: { emoji: '💤', text: 'A short nap' } },
  { longer: { emoji: '🎂', text: 'A birthday party' }, shorter: { emoji: '🍪', text: 'Eating a cookie' } },
  { longer: { emoji: '🏃', text: 'Running a race' }, shorter: { emoji: '👏', text: 'Clapping once' } },
  { longer: { emoji: '🧩', text: 'Solving a puzzle' }, shorter: { emoji: '🎲', text: 'Rolling a dice' } },
];

const TIME_ORDERED_ACTIVITIES: TimeOrderedActivity[] = [
  { time: 1, emoji: '⏰', text: 'Wake up' },
  { time: 2, emoji: '🪥', text: 'Brush teeth' },
  { time: 3, emoji: '🍳', text: 'Eat breakfast' },
  { time: 4, emoji: '🚌', text: 'Go to school' },
  { time: 5, emoji: '📚', text: 'Morning classes' },
  { time: 6, emoji: '🍱', text: 'Eat lunch' },
  { time: 7, emoji: '📖', text: 'Afternoon classes' },
  { time: 8, emoji: '🏠', text: 'Come home' },
  { time: 9, emoji: '🎮', text: 'Play time' },
  { time: 10, emoji: '🍽️', text: 'Eat dinner' },
  { time: 11, emoji: '📺', text: 'Watch TV' },
  { time: 12, emoji: '🌙', text: 'Go to sleep' },
];

const CORRECT_FEEDBACK = [
  "🎉 Perfect! Cuckoo is so proud!",
  "⭐ You're a Time Star!",
  "🌟 Amazing job!",
  "✨ Tick-Tock Terrific!",
  "🏆 Time Master!",
];

const WRONG_FEEDBACK = [
  "🤔 Not quite! Let's try the next one!",
  "💪 Good try! Keep going!",
  "🔄 Oops! Let's continue!",
];

// ============================================
// HELPER FUNCTIONS
// ============================================

const shuffle = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const randomChoice = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const generateDistractors = (correct: number, count: number, min: number, max: number): number[] => {
  const distractors: number[] = [];
  while (distractors.length < count) {
    const val = Math.floor(Math.random() * (max - min + 1)) + min;
    if (val !== correct && !distractors.includes(val)) {
      distractors.push(val);
    }
  }
  return distractors;
};

// ============================================
// QUESTION GENERATORS
// ============================================

const generateSetClockQuestion = (): Question => {
  const targetHour = Math.floor(Math.random() * 12) + 1;
  return {
    type: 'set_clock',
    targetHour,
    tolerance: 20,
    prompt: `Set the clock to show ${targetHour} o'clock!`,
  };
};

const generateReadClockQuestion = (): Question => {
  const correctHour = Math.floor(Math.random() * 12) + 1;
  const wrongOptions = generateDistractors(correctHour, 2, 1, 12);
  const options = shuffle([correctHour, ...wrongOptions]).map(h => `${h} o'clock`);
  
  return {
    type: 'read_clock',
    displayHour: correctHour,
    options,
    correctAnswer: `${correctHour} o'clock`,
    prompt: 'What time does this clock show?',
  };
};

const generateDailyRoutineQuestion = (): Question => {
  const timeOfDay = randomChoice(['morning', 'afternoon', 'evening', 'night']);
  const activity = randomChoice(DAILY_ACTIVITIES[timeOfDay]);
  
  return {
    type: 'daily_routine',
    activity,
    correctAnswer: timeOfDay,
    dropZones: ['morning', 'afternoon', 'evening', 'night'],
    prompt: 'When do we do this? Tap the right time!',
  };
};

const generateSequenceQuestion = (): Question => {
  const template = randomChoice(SEQUENCE_TEMPLATES);
  const shuffledEvents = shuffle([...template.events]);
  
  return {
    type: 'sequence_events',
    theme: template.theme,
    shuffledEvents,
    correctOrder: template.events,
    prompt: `Arrange in order: ${template.theme}`,
  };
};

const generateDaysOrderQuestion = (): Question => {
  // Pick 4 consecutive days starting from a random day
  const startIndex = Math.floor(Math.random() * 4); // 0-3 so we have room for 4 days
  const selectedDays = DAYS.slice(startIndex, startIndex + 4);
  const shuffledDays = shuffle([...selectedDays]);
  
  return {
    type: 'days_order',
    shuffledDays,
    correctDays: selectedDays,
    prompt: 'Arrange these days in order!',
  };
};

const generateDaysBeforeAfterQuestion = (): Question => {
  const dayIndex = Math.floor(Math.random() * 7);
  const targetDay = DAYS[dayIndex];
  const askAfter = Math.random() > 0.5;
  
  const correctIndex = askAfter 
    ? (dayIndex + 1) % 7 
    : (dayIndex - 1 + 7) % 7;
  const correctAnswer = DAYS[correctIndex];
  
  const wrongOptions = DAYS.filter(d => d !== correctAnswer && d !== targetDay)
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);
  
  return {
    type: 'days_before_after',
    prompt: `Which day comes ${askAfter ? 'AFTER' : 'BEFORE'} ${targetDay}?`,
    options: shuffle([correctAnswer, ...wrongOptions]),
    correctAnswer,
  };
};

const generateDurationQuestion = (): Question => {
  const pair = randomChoice(DURATION_PAIRS);
  const askForLonger = Math.random() > 0.5;
  const swapPositions = Math.random() > 0.5;
  
  const optionA = swapPositions ? pair.shorter : pair.longer;
  const optionB = swapPositions ? pair.longer : pair.shorter;
  
  const correctAnswer = askForLonger 
    ? (swapPositions ? 'B' : 'A')
    : (swapPositions ? 'A' : 'B');
  
  return {
    type: 'duration',
    prompt: askForLonger ? 'Which takes LONGER?' : 'Which takes SHORTER time?',
    optionA,
    optionB,
    correctAnswer,
    askForLonger,
  };
};

const generateEarlierLaterQuestion = (): Question => {
  // Pick two activities with different times
  const shuffledActivities = shuffle([...TIME_ORDERED_ACTIVITIES]);
  const [activity1, activity2] = shuffledActivities.slice(0, 2);
  
  const askForEarlier = Math.random() > 0.5;
  
  const correctAnswer = askForEarlier
    ? (activity1.time < activity2.time ? 'A' : 'B')
    : (activity1.time > activity2.time ? 'A' : 'B');
  
  return {
    type: 'earlier_later',
    prompt: askForEarlier ? 'Which happens EARLIER in the day?' : 'Which happens LATER in the day?',
    optionA: activity1,
    optionB: activity2,
    correctAnswer,
    askForEarlier,
  };
};

// ============================================
// STORE
// ============================================

export const useTickTockStore = create<TickTockState>((set, get) => ({
  // Initial state
  gamePhase: 'welcome',
  difficulty: 'easy',
  currentRound: 0,
  totalRounds: 20,
  score: 0,
  correctAnswers: 0,
  
  currentQuestion: null,
  questionStartTime: 0,
  attemptsOnQuestion: 0,
  
  hourHandAngle: 0,
  isDraggingHand: false,
  
  placedItems: [],
  availableItems: [],
  
  selectedOption: null,
  
  isCorrect: null,
  showFeedback: false,
  feedbackMessage: '',
  
  telemetryLog: [],
  
  // Actions
  startGame: () => {
    set({
      gamePhase: 'difficulty_select',
    });
  },
  
  selectDifficulty: (difficulty: Difficulty) => {
    set({
      difficulty,
      gamePhase: 'playing',
      currentRound: 0,
      score: 0,
      correctAnswers: 0,
      telemetryLog: [],
    });
    get().generateQuestion();
  },
  
  generateQuestion: () => {
    const { currentRound, totalRounds, difficulty } = get();
    
    if (currentRound >= totalRounds) {
      set({ gamePhase: 'celebrating' });
      return;
    }
    
    // Question types based on difficulty level
    // Easy: Simple clock reading and time of day
    // Medium: Days of week, sequences
    // Hard: Duration comparison, earlier/later, all types
    let questionTypes: QuestionType[];
    
    switch (difficulty) {
      case 'easy':
        questionTypes = [
          'set_clock',
          'read_clock',
          'daily_routine',
        ];
        break;
      case 'medium':
        questionTypes = [
          'set_clock',
          'read_clock',
          'daily_routine',
          'sequence_events',
          'days_order',
          'days_before_after',
        ];
        break;
      case 'hard':
        questionTypes = [
          'set_clock',
          'read_clock',
          'daily_routine',
          'sequence_events',
          'days_order',
          'days_before_after',
          'duration',
          'earlier_later',
        ];
        break;
    }
    
    const selectedType = randomChoice(questionTypes);
    
    let question: Question;
    switch (selectedType) {
      case 'set_clock':
        question = generateSetClockQuestion();
        break;
      case 'read_clock':
        question = generateReadClockQuestion();
        break;
      case 'daily_routine':
        question = generateDailyRoutineQuestion();
        break;
      case 'sequence_events':
        question = generateSequenceQuestion();
        break;
      case 'days_order':
        question = generateDaysOrderQuestion();
        break;
      case 'days_before_after':
        question = generateDaysBeforeAfterQuestion();
        break;
      case 'duration':
        question = generateDurationQuestion();
        break;
      case 'earlier_later':
        question = generateEarlierLaterQuestion();
        break;
      default:
        question = generateReadClockQuestion();
    }
    
    // Initialize state based on question type
    let placedItems: (Activity | null)[] = [];
    let availableItems: Activity[] = [];
    let hourHandAngle = 0;
    
    if (question.type === 'sequence_events' && question.shuffledEvents) {
      placedItems = new Array(question.shuffledEvents.length).fill(null);
      availableItems = [...question.shuffledEvents];
    } else if (question.type === 'days_order' && question.shuffledDays) {
      placedItems = new Array(question.shuffledDays.length).fill(null);
      availableItems = question.shuffledDays.map(day => ({ emoji: '📅', text: day }));
    } else if (question.type === 'set_clock') {
      // Start with random angle
      hourHandAngle = Math.floor(Math.random() * 360);
    }
    
    set({
      currentQuestion: question,
      currentRound: currentRound + 1,
      questionStartTime: Date.now(),
      attemptsOnQuestion: 0,
      hourHandAngle,
      placedItems,
      availableItems,
      selectedOption: null,
      isCorrect: null,
      showFeedback: false,
      gamePhase: 'playing',
    });
  },
  
  setHourHandAngle: (angle: number) => {
    set({ hourHandAngle: angle });
  },
  
  setIsDraggingHand: (isDragging: boolean) => {
    set({ isDraggingHand: isDragging });
  },
  
  selectOption: (option: string) => {
    set({ selectedOption: option });
  },
  
  placeItemInSlot: (item: Activity, slotIndex: number) => {
    const { placedItems, availableItems } = get();
    const newPlacedItems = [...placedItems];
    const newAvailableItems = availableItems.filter(
      a => !(a.emoji === item.emoji && a.text === item.text)
    );
    
    // If slot already has an item, put it back in available
    if (newPlacedItems[slotIndex] !== null) {
      newAvailableItems.push(newPlacedItems[slotIndex]!);
    }
    
    newPlacedItems[slotIndex] = item;
    
    set({
      placedItems: newPlacedItems,
      availableItems: newAvailableItems,
    });
  },
  
  removeItemFromSlot: (slotIndex: number) => {
    const { placedItems, availableItems } = get();
    const newPlacedItems = [...placedItems];
    const item = newPlacedItems[slotIndex];
    
    if (item) {
      newPlacedItems[slotIndex] = null;
      set({
        placedItems: newPlacedItems,
        availableItems: [...availableItems, item],
      });
    }
  },
  
  submitAnswer: () => {
    const { 
      currentQuestion, 
      hourHandAngle, 
      selectedOption, 
      placedItems,
      questionStartTime,
      attemptsOnQuestion,
      currentRound,
    } = get();
    
    if (!currentQuestion) return;
    
    let isCorrect = false;
    let userAnswer: any = null;
    
    switch (currentQuestion.type) {
      case 'set_clock':
        if (currentQuestion.targetHour !== undefined) {
          const targetAngle = (currentQuestion.targetHour % 12) * 30;
          // Normalize angles
          let diff = Math.abs(hourHandAngle - targetAngle);
          if (diff > 180) diff = 360 - diff;
          isCorrect = diff <= (currentQuestion.tolerance || 20);
          userAnswer = hourHandAngle;
        }
        break;
        
      case 'read_clock':
      case 'days_before_after':
        isCorrect = selectedOption === currentQuestion.correctAnswer;
        userAnswer = selectedOption;
        break;
        
      case 'daily_routine':
        isCorrect = selectedOption === currentQuestion.correctAnswer;
        userAnswer = selectedOption;
        break;
        
      case 'duration':
      case 'earlier_later':
        isCorrect = selectedOption === currentQuestion.correctAnswer;
        userAnswer = selectedOption;
        break;
        
      case 'sequence_events':
        if (currentQuestion.correctOrder) {
          const allFilled = placedItems.every(item => item !== null);
          if (allFilled) {
            isCorrect = placedItems.every((item, index) => 
              item?.text === currentQuestion.correctOrder![index].text
            );
          }
          userAnswer = placedItems.map(i => i?.text);
        }
        break;
        
      case 'days_order':
        if (currentQuestion.correctDays) {
          const allFilled = placedItems.every(item => item !== null);
          if (allFilled) {
            isCorrect = placedItems.every((item, index) => 
              item?.text === currentQuestion.correctDays![index]
            );
          }
          userAnswer = placedItems.map(i => i?.text);
        }
        break;
    }
    
    const feedbackMessage = isCorrect 
      ? randomChoice(CORRECT_FEEDBACK)
      : randomChoice(WRONG_FEEDBACK);
    
    // Log telemetry
    const telemetryEntry: TelemetryEntry = {
      timestamp: Date.now(),
      round: currentRound,
      questionType: currentQuestion.type,
      questionData: currentQuestion,
      userAnswer,
      isCorrect,
      timeSpent: Date.now() - questionStartTime,
      attemptsOnQuestion: attemptsOnQuestion + 1,
    };
    
    set(state => ({
      isCorrect,
      showFeedback: true,
      feedbackMessage,
      gamePhase: 'feedback',
      attemptsOnQuestion: attemptsOnQuestion + 1,
      score: isCorrect ? state.score + 5 : state.score,
      correctAnswers: isCorrect ? state.correctAnswers + 1 : state.correctAnswers,
      telemetryLog: [...state.telemetryLog, telemetryEntry],
    }));
  },
  
  nextQuestion: () => {
    const { currentRound, totalRounds } = get();
    
    if (currentRound >= totalRounds) {
      set({ gamePhase: 'celebrating' });
    } else {
      get().generateQuestion();
    }
  },
  
  skipQuestion: () => {
    const { currentRound, totalRounds, currentQuestion, questionStartTime } = get();
    
    // Log skipped question
    if (currentQuestion) {
      const telemetryEntry: TelemetryEntry = {
        timestamp: Date.now(),
        round: currentRound,
        questionType: currentQuestion.type,
        questionData: currentQuestion,
        userAnswer: 'SKIPPED',
        isCorrect: false,
        timeSpent: Date.now() - questionStartTime,
        attemptsOnQuestion: 0,
      };
      
      set(state => ({
        telemetryLog: [...state.telemetryLog, telemetryEntry],
      }));
    }
    
    if (currentRound >= totalRounds) {
      set({ gamePhase: 'celebrating' });
    } else {
      get().generateQuestion();
    }
  },
  
  resetGame: () => {
    set({
      gamePhase: 'welcome',
      difficulty: 'easy',
      currentRound: 0,
      score: 0,
      correctAnswers: 0,
      currentQuestion: null,
      hourHandAngle: 0,
      placedItems: [],
      availableItems: [],
      selectedOption: null,
      isCorrect: null,
      showFeedback: false,
      feedbackMessage: '',
      telemetryLog: [],
    });
  },
  
  getTelemetryLog: () => get().telemetryLog,
}));
