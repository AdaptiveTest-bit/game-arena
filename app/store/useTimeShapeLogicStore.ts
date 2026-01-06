
import { create } from 'zustand';

export type TopicType = 'time' | 'shapes' | 'logic';
export type DifficultyType = 'easy' | 'medium' | 'hard' | 'master';

export interface QuestionTemplate {
  topic: TopicType;
  skill: string;
  difficulty: DifficultyType;
  question: string;
  options: (number | string)[];
  correctAnswer: number;
  explanation: string;
  hint: string;
}

interface TimeShapeLogicState {
  // Session tracking
  askedQuestions: Set<string>;
  currentDifficulty: DifficultyType;
  consecutiveCorrect: number;
  hintUsed: boolean;
  
  // Game state
  gameStarted: boolean;
  gameCompleted: boolean;
  levelCompleted: boolean;
  passedLevel: boolean;
  currentLevel: number;
  score: number;
  
  // Current question
  currentQuestion: QuestionTemplate | null;
  selectedAnswer: number | null;
  answered: boolean;
  showFeedback: boolean;
  
  // Stats
  totalAnswered: number;
  correctAnswers: number;
  
  // Actions
  startGame: (level: number) => void;
  generateQuestion: () => QuestionTemplate;
  selectAnswer: (answer: number) => boolean;
  useHint: () => void;
  nextQuestion: () => void;
  resetGame: () => void;
  retryLevel: () => void;
  getTelemetryLog: () => Record<string, unknown>[];
  getAccuracy: () => number;
}

// Utility to generate unique question hash
const generateQuestionHash = (q: QuestionTemplate): string => {
  return `${q.topic}-${q.difficulty}-${q.question.substring(0, 30)}`;
};

// ==================== TIME QUESTIONS ====================

const generateTimeEasy = (): QuestionTemplate => {
  const types = ['hour', 'half_hour', 'am_pm'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  if (type === 'hour') {
    const hour = Math.floor(Math.random() * 12) + 1;
    const correctTime = hour;
    const options = [correctTime];
    while (options.length < 4) {
      const wrong = Math.floor(Math.random() * 12) + 1;
      if (!options.includes(wrong)) options.push(wrong);
    }
    
    return {
      topic: 'time',
      skill: 'Read hour time',
      difficulty: 'easy',
      question: `What time is shown on the clock? (hour hand at ${hour})`,
      options: options.sort(() => Math.random() - 0.5),
      correctAnswer: options.indexOf(correctTime),
      explanation: `When the minute hand is at 12 and hour hand is at ${hour}, the time is ${hour}:00`,
      hint: 'Look at where the hour hand is pointing',
    };
  }
  
  if (type === 'half_hour') {
    const hour = Math.floor(Math.random() * 12) + 1;
    const times = [`${hour}:30`, `${hour}:00`, `${hour + 1}:30`, `${hour}:15`];
    
    return {
      topic: 'time',
      skill: 'Read half-hour time',
      difficulty: 'easy',
      question: `What time is shown? (hour hand between ${hour} and ${hour + 1}, minute hand at 6)`,
      options: times.sort(() => Math.random() - 0.5),
      correctAnswer: times.indexOf(`${hour}:30`),
      explanation: `When minute hand is at 6 (halfway), it's half past the hour. Time is ${hour}:30`,
      hint: 'Minute hand at 6 means 30 minutes past the hour',
    };
  }
  
  // AM/PM
  const scenarios = [
    { time: '7:00', period: 'AM', context: 'Wake up time' },
    { time: '12:00', period: 'PM', context: 'Lunch time' },
    { time: '3:00', period: 'PM', context: 'Afternoon play' },
    { time: '9:00', period: 'PM', context: 'Bedtime' },
  ];
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  
  return {
    topic: 'time',
    skill: 'Identify AM/PM',
    difficulty: 'easy',
    question: `At ${scenario.time}, it is ${scenario.context}. Choose AM or PM.`,
    options: ['AM', 'PM'],
    correctAnswer: scenario.period === 'AM' ? 0 : 1,
    explanation: `${scenario.context} happens in the ${scenario.period === 'AM' ? 'morning (AM)' : 'afternoon/evening (PM)'}`,
    hint: 'AM is morning (midnight to noon), PM is afternoon/evening',
  };
};

const generateTimeMedium = (): QuestionTemplate => {
  const startHour = Math.floor(Math.random() * 8) + 8;
  const startMinute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
  const duration = [15, 20, 30, 45, 60][Math.floor(Math.random() * 5)];
  
  const formatTime = (h: number, m: number) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h > 12 ? h - 12 : h;
    return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
  };
  
  const totalStartMinutes = startHour * 60 + startMinute;
  const totalEndMinutes = totalStartMinutes + duration;
  const endHour = Math.floor(totalEndMinutes / 60);
  const endMinute = totalEndMinutes % 60;
  
  const correctTime = formatTime(endHour, endMinute);
  const wrongOptions = [
    formatTime(endHour, (endMinute + 15) % 60),
    formatTime(endHour + 1, endMinute),
    formatTime(endHour, (endMinute + 30) % 60),
  ];
  
  return {
    topic: 'time',
    skill: 'Calculate end time',
    difficulty: 'medium',
    question: `School starts at ${formatTime(startHour, startMinute)}. Class lasts ${duration} minutes. What time does it end?`,
    options: [correctTime, ...wrongOptions].slice(0, 4),
    correctAnswer: 0,
    explanation: `Add ${duration} minutes to ${formatTime(startHour, startMinute)} = ${correctTime}`,
    hint: `Add ${duration} minutes to the start time`,
  };
};

const generateTimeHard = (): QuestionTemplate => {
  const startHour = Math.floor(Math.random() * 4) + 2;
  const startMinute = [10, 20, 25, 40][Math.floor(Math.random() * 4)];
  const duration1 = [30, 45, 60][Math.floor(Math.random() * 3)];
  const duration2 = [15, 20, 30][Math.floor(Math.random() * 3)];
  
  const formatTime = (h: number, m: number) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h > 12 ? h - 12 : h;
    return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
  };
  
  const startTotal = startHour * 60 + startMinute;
  const endTotal = startTotal + duration1 + duration2;
  
  const endTime = formatTime(Math.floor(endTotal / 60), endTotal % 60);
  const durationMinutes = duration1 + duration2;
  
  const options = [
    `${durationMinutes} minutes`,
    `${durationMinutes - 15} minutes`,
    `${durationMinutes + 15} minutes`,
    `${durationMinutes + 30} minutes`,
  ] as (number | string)[];
  
  return {
    topic: 'time',
    skill: 'Multi-event duration',
    difficulty: 'hard',
    question: `A movie starts at ${formatTime(startHour, startMinute)}. First part: ${duration1} min. Break: ${duration2} min. Second part finishes at ${endTime}. How long is the movie?`,
    options: options,
    correctAnswer: 0,
    explanation: `Total time = ${duration1} min + ${duration2} min = ${durationMinutes} minutes`,
    hint: 'Add both parts of the movie together',
  };
};

const generateTimeMaster = (): QuestionTemplate => {
  const wakeHour = Math.floor(Math.random() * 3) + 6;
  const activities = [
    { name: 'Breakfast', duration: 20 },
    { name: 'School commute', duration: 30 },
    { name: 'Assembly', duration: 15 },
    { name: 'First class', duration: 45 },
    { name: 'Break', duration: 15 },
  ];
  
  const selected = activities.slice(0, 3);
  const totalDuration = selected.reduce((sum, a) => sum + a.duration, 0);
  
  const formatTime = (h: number, m: number) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h > 12 ? h - 12 : h;
    return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
  };
  
  const endTotal = wakeHour * 60 + totalDuration;
  const options = [
    formatTime(Math.floor(endTotal / 60), endTotal % 60),
    formatTime(Math.floor((endTotal + 15) / 60), (endTotal + 15) % 60),
    formatTime(Math.floor((endTotal - 15) / 60), (endTotal - 15) % 60),
    formatTime(Math.floor((endTotal + 30) / 60), (endTotal + 30) % 60),
  ];
  
  const activityList = selected.map(a => `${a.name}: ${a.duration} min`).join(', ');
  
  return {
    topic: 'time',
    skill: 'Daily routine timeline',
    difficulty: 'master',
    question: `Morning routine: ${activityList}. If you wake up at ${formatTime(wakeHour, 0)}, at what time do you finish?`,
    options: options,
    correctAnswer: 0,
    explanation: `Add all durations: ${selected.map(a => a.duration).join(' + ')} = ${totalDuration} min. ${formatTime(wakeHour, 0)} + ${totalDuration} min = ${options[0]}`,
    hint: 'Add all the activity durations together',
  };
};

// ==================== SHAPES QUESTIONS ====================

const generateShapesEasy = (): QuestionTemplate => {
  const shapes2D = [
    { name: 'square', options: ['square', 'rectangle', 'triangle', 'circle'], correct: 0 },
    { name: 'rectangle', options: ['rectangle', 'circle', 'square', 'triangle'], correct: 0 },
    { name: 'triangle', options: ['triangle', 'square', 'circle', 'rectangle'], correct: 0 },
    { name: 'circle', options: ['circle', 'triangle', 'rectangle', 'square'], correct: 0 },
  ];
  const shape = shapes2D[Math.floor(Math.random() * shapes2D.length)];
  
  const descriptions = {
    square: '4 equal sides, 4 corners',
    rectangle: '4 sides, opposite sides equal',
    triangle: '3 sides, 3 corners',
    circle: 'Round, no corners',
  };
  
  return {
    topic: 'shapes',
    skill: 'Identify 2D shape',
    difficulty: 'easy',
    question: `Which shape has ${descriptions[shape.name as keyof typeof descriptions]}?`,
    options: shape.options,
    correctAnswer: shape.correct,
    explanation: `${shape.name} has ${descriptions[shape.name as keyof typeof descriptions]}`,
    hint: 'Count the sides and corners',
  };
};

const generateShapesMedium = (): QuestionTemplate => {
  const shapes3D = [
    { name: 'cube', faces: 6, edges: 12, vertices: 8, objects: ['dice', 'sugar cube', 'box'] },
    { name: 'cuboid', faces: 6, edges: 12, vertices: 8, objects: ['book', 'brick', 'box'] },
    { name: 'cone', faces: 2, edges: 1, vertices: 1, objects: ['ice cream', 'birthday hat', 'traffic cone'] },
    { name: 'cylinder', faces: 3, edges: 2, vertices: 0, objects: ['can', 'pipe', 'battery'] },
    { name: 'sphere', faces: 1, edges: 0, vertices: 0, objects: ['ball', 'globe', 'orange'] },
  ];
  
  const shape = shapes3D[Math.floor(Math.random() * shapes3D.length)];
  const attrs = ['faces', 'edges', 'vertices'];
  const attr = attrs[Math.floor(Math.random() * attrs.length)];
  
  const correctVal = shape.faces === 6 ? 6 : shape.faces === 2 ? 2 : shape.faces === 3 ? 3 : shape.faces === 1 ? 1 : 0;
  const options: (number | string)[] = [correctVal];
  while (options.length < 4) {
    const wrong = Math.floor(Math.random() * 12);
    if (!options.includes(wrong)) options.push(wrong);
  }
  
  return {
    topic: 'shapes',
    skill: `Count ${attr}`,
    difficulty: 'medium',
    question: `A ${shape.name} (like a ${shape.objects[0]}) has how many ${attr}?`,
    options: options.sort(() => Math.random() - 0.5),
    correctAnswer: options.indexOf(correctVal),
    explanation: `A ${shape.name} has ${correctVal} ${attr}`,
    hint: `Think about a ${shape.name} and count its ${attr}`,
  };
};

const generateShapesHard = (): QuestionTemplate => {
  const shapes = [
    { name: 'cube', faces: 6, edges: 12, vertices: 8 },
    { name: 'cuboid', faces: 6, edges: 12, vertices: 8 },
    { name: 'cone', faces: 2, edges: 1, vertices: 1 },
    { name: 'cylinder', faces: 3, edges: 2, vertices: 0 },
    { name: 'sphere', faces: 1, edges: 0, vertices: 0 },
  ];
  
  const target = shapes[Math.floor(Math.random() * shapes.length)];
  const attrs = ['faces', 'edges', 'vertices'];
  const attr = attrs[Math.floor(Math.random() * attrs.length)];
  
  const options = [target.name];
  const others = shapes.filter(s => s.name !== target.name && s[attr as keyof typeof s] !== target[attr as keyof typeof target]);
  others.slice(0, 3).forEach(s => options.push(s.name));
  
  return {
    topic: 'shapes',
    skill: 'Identify from properties',
    difficulty: 'hard',
    question: `Which shape has exactly ${target[attr as keyof typeof target]} ${attr}?`,
    options: options,
    correctAnswer: 0,
    explanation: `${target.name} has ${target[attr as keyof typeof target]} ${attr}`,
    hint: `Compare the ${attr} of different shapes`,
  };
};

const generateShapesMaster = (): QuestionTemplate => {
  const shapes = ['square', 'rectangle'];
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  
  if (shape === 'square') {
    const side = Math.floor(Math.random() * 5) + 2;
    return {
      topic: 'shapes',
      skill: 'Calculate perimeter',
      difficulty: 'master',
      question: `A square has side ${side} cm. What is the distance around it (perimeter)?`,
      options: [side * 4, side * side, side + 4, side * 2] as (number | string)[],
      correctAnswer: 0,
      explanation: `Perimeter = 4 × side = 4 × ${side} = ${side * 4} cm`,
      hint: 'Add all 4 equal sides together',
    };
  }
  
  const length = Math.floor(Math.random() * 5) + 5;
  const breadth = Math.floor(Math.random() * 3) + 2;
  return {
    topic: 'shapes',
    skill: 'Calculate perimeter',
    difficulty: 'master',
    question: `A rectangle has length ${length} cm and breadth ${breadth} cm. What is its perimeter?`,
    options: [2 * (length + breadth), length * breadth, length + breadth, 2 * length * breadth] as (number | string)[],
    correctAnswer: 0,
    explanation: `Perimeter = 2 × (length + breadth) = 2 × (${length} + ${breadth}) = ${2 * (length + breadth)} cm`,
    hint: 'Perimeter = 2 × (length + breadth)',
  };
};

// ==================== LOGIC/DATA QUESTIONS ====================

const generateLogicEasy = (): QuestionTemplate => {
  if (Math.random() > 0.5) {
    const symbols = ['★', '●', '■', '▲'];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const count = Math.floor(Math.random() * 5) + 1;
    
    return {
      topic: 'logic',
      skill: 'Count pictograph',
      difficulty: 'easy',
      question: `Pictograph: ${symbol} = 1 item. How many ${symbol} are there?`,
      options: [count, count + 1, count - 1, count + 2].filter(n => n > 0),
      correctAnswer: 0,
      explanation: `Count the ${symbol} symbols: ${count}`,
      hint: 'Count each symbol one by one',
    };
  }
  
  const patterns = [
    { seq: [2, 4, 6, 8], next: 10, desc: 'counting by 2s' },
    { seq: [1, 3, 5, 7], next: 9, desc: 'odd numbers' },
    { seq: [5, 10, 15, 20], next: 25, desc: 'counting by 5s' },
  ];
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  
  return {
    topic: 'logic',
    skill: 'Complete pattern',
    difficulty: 'easy',
    question: `Complete the pattern (${pattern.desc}): ${pattern.seq.join(', ')}, ?`,
    options: [pattern.next, pattern.next + 2, pattern.next - 2, pattern.next + 1],
    correctAnswer: 0,
    explanation: `The pattern increases by ${pattern.seq[1] - pattern.seq[0]}, so next is ${pattern.next}`,
    hint: 'Look at how the numbers change',
  };
};

const generateLogicMedium = (): QuestionTemplate => {
  const symbols = ['🟦', '🟢', '⭐'];
  const values = [2, 5, 10];
  const idx = Math.floor(Math.random() * symbols.length);
  const symbol = symbols[idx];
  const value = values[idx];
  
  const count = Math.floor(Math.random() * 5) + 2;
  const result = count * value;
  
  const options = [result, result + value, result - value, result + 1];
  
  return {
    topic: 'logic',
    skill: 'Read pictograph',
    difficulty: 'medium',
    question: `Pictograph: ${symbol} = ${value} items. If there are ${count} symbols, how many items?`,
    options: options,
    correctAnswer: 0,
    explanation: `${count} symbols × ${value} items = ${result} items`,
    hint: 'Multiply number of symbols by value per symbol',
  };
};

const generateLogicHard = (): QuestionTemplate => {
  const s1Idx = Math.floor(Math.random() * 3);
  const s2Idx = Math.floor(Math.random() * 3);
  const s1 = ['🟦', '🟢', '⭐'][s1Idx];
  const s2 = ['🟦', '🟢', '⭐'][s2Idx];
  const v1 = [2, 5, 10][s1Idx];
  const v2 = [2, 5, 10][s2Idx];
  
  const q1 = Math.floor(Math.random() * 4) + 1;
  const q2 = Math.floor(Math.random() * 3) + 1;
  const result = q1 * v1 + q2 * v2;
  
  const options = [result, result + 1, result - 1, result + 2];
  
  return {
    topic: 'logic',
    skill: 'Multi-step data',
    difficulty: 'hard',
    question: `${s1} = ${v1} points, ${s2} = ${v2} points. Score: ${q1} ${s1} + ${q2} ${s2} = ?`,
    options: options,
    correctAnswer: 0,
    explanation: `(${q1} × ${v1}) + (${q2} × ${v2}) = ${result}`,
    hint: 'Calculate each type separately, then add',
  };
};

const generateLogicMaster = (): QuestionTemplate => {
  const items = [
    { name: 'Red balls', count: 5 },
    { name: 'Blue balls', count: 7 },
    { name: 'Green balls', count: 8 },
  ];
  
  if (Math.random() > 0.5) {
    const evens = items.filter(i => i.count % 2 === 0);
    const total = evens.reduce((sum, i) => sum + i.count, 0);
    const options = [total, total + 1, total - 1, total + 2];
    const names = items.map(i => `${i.name} (${i.count})`).join(', ');
    
    return {
      topic: 'logic',
      skill: 'Even/odd reasoning',
      difficulty: 'master',
      question: `Items: ${names}. Which have EVEN count? Sum of even-count items = ?`,
      options: options,
      correctAnswer: 0,
      explanation: `${evens.map(i => i.count).join(' + ')} = ${total}`,
      hint: 'First identify which counts are even numbers',
    };
  }
  
  const odds = items.filter(i => i.count % 2 === 1);
  const total = odds.reduce((sum, i) => sum + i.count, 0);
  const options = [total, total + 1, total - 1, total + 2];
  const names = items.map(i => `${i.name} (${i.count})`).join(', ');
  
  return {
    topic: 'logic',
    skill: 'Even/odd reasoning',
    difficulty: 'master',
    question: `Items: ${names}. Which have ODD count? Sum of odd-count items = ?`,
    options: options,
    correctAnswer: 0,
    explanation: `${odds.map(i => i.count).join(' + ')} = ${total}`,
    hint: 'First identify which counts are odd numbers',
  };
};

// ==================== MAIN GENERATOR ====================

const generateQuestion = (difficulty: DifficultyType, topic?: TopicType): QuestionTemplate => {
  const topics: TopicType[] = ['time', 'shapes', 'logic'];
  const selectedTopic = topic || topics[Math.floor(Math.random() * topics.length)];
  
  switch (selectedTopic) {
    case 'time':
      switch (difficulty) {
        case 'easy': return generateTimeEasy();
        case 'medium': return generateTimeMedium();
        case 'hard': return generateTimeHard();
        case 'master': return generateTimeMaster();
      }
    case 'shapes':
      switch (difficulty) {
        case 'easy': return generateShapesEasy();
        case 'medium': return generateShapesMedium();
        case 'hard': return generateShapesHard();
        case 'master': return generateShapesMaster();
      }
    case 'logic':
      switch (difficulty) {
        case 'easy': return generateLogicEasy();
        case 'medium': return generateLogicMedium();
        case 'hard': return generateLogicHard();
        case 'master': return generateLogicMaster();
      }
  }
};

const getLevelDifficulty = (level: number): DifficultyType => {
  switch (level) {
    case 1: return 'easy';
    case 2: return 'medium';
    case 3: return 'hard';
    case 4: return 'master';
    default: return 'easy';
  }
};

const getQuestionCount = (level: number): number => {
  switch (level) {
    case 1: return 8;
    case 2: return 10;
    case 3: return 12;
    case 4: return 15;
    default: return 8;
  }
};

export const useTimeShapeLogicStore = create<TimeShapeLogicState>((set, get) => ({
  // Initial state
  askedQuestions: new Set(),
  currentDifficulty: 'easy',
  consecutiveCorrect: 0,
  hintUsed: false,
  
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
  
  startGame: (level: number) => {
    const difficulty = getLevelDifficulty(level);
    
    set({
      gameStarted: true,
      gameCompleted: false,
      levelCompleted: false,
      passedLevel: false,
      currentLevel: level,
      score: 0,
      askedQuestions: new Set(),
      currentDifficulty: difficulty,
      consecutiveCorrect: 0,
      hintUsed: false,
      totalAnswered: 0,
      correctAnswers: 0,
    });
    
    const question = generateQuestion(difficulty);
    const hash = generateQuestionHash(question);
    set({ currentQuestion: question, askedQuestions: new Set([hash]) });
  },
  
  generateQuestion: () => {
    const { askedQuestions, currentDifficulty } = get();
    let question: QuestionTemplate;
    let attempts = 0;
    
    do {
      question = generateQuestion(currentDifficulty);
      attempts++;
    } while (askedQuestions.has(generateQuestionHash(question)) && attempts < 20);
    
    return question;
  },
  
  selectAnswer: (answer: number) => {
    const state = get();
    if (state.answered || !state.currentQuestion) return false;
    
    const isCorrect = answer === state.currentQuestion.correctAnswer;
    
    set({
      selectedAnswer: answer,
      answered: true,
      showFeedback: true,
      totalAnswered: state.totalAnswered + 1,
      correctAnswers: isCorrect ? state.correctAnswers + 1 : state.correctAnswers,
      score: isCorrect 
        ? state.score + (100 + state.consecutiveCorrect * 20) 
        : state.score + 10,
      consecutiveCorrect: isCorrect ? state.consecutiveCorrect + 1 : 0,
    });
    
    return isCorrect;
  },
  
  useHint: () => {
    const state = get();
    if (state.hintUsed || !state.currentQuestion) return;
    set({ hintUsed: true, score: Math.max(0, state.score - 20) });
  },
  
  nextQuestion: () => {
    const state = get();
    const questionCount = 20; // Fixed at 20 questions per level
    
    if (state.totalAnswered >= questionCount) {
      // Check if passed (≥90% accuracy)
      const accuracy = state.totalAnswered > 0 ? state.correctAnswers / state.totalAnswered : 0;
      const passed = accuracy >= 0.9;
      set({ gameCompleted: true, levelCompleted: true, passedLevel: passed });
      return;
    }
    
    let newDifficulty = state.currentDifficulty;
    if (state.consecutiveCorrect >= 3) {
      const difficulties: DifficultyType[] = ['easy', 'medium', 'hard', 'master'];
      const currentIndex = difficulties.indexOf(state.currentDifficulty);
      if (currentIndex < difficulties.length - 1) {
        newDifficulty = difficulties[currentIndex + 1];
      }
    }
    
    const question = generateQuestion(newDifficulty);
    const hash = generateQuestionHash(question);
    const updatedQuestions = new Set(state.askedQuestions);
    updatedQuestions.add(hash);
    
    set({
      currentQuestion: question,
      askedQuestions: updatedQuestions,
      selectedAnswer: null,
      answered: false,
      showFeedback: false,
      hintUsed: false,
      currentDifficulty: newDifficulty,
    });
  },
  
  retryLevel: () => {
    const state = get();
    const difficulty = getLevelDifficulty(state.currentLevel);
    
    // Reset everything for retry (new game state but same level)
    set({
      gameStarted: true,
      gameCompleted: false,
      levelCompleted: false,
      passedLevel: false,
      currentLevel: state.currentLevel,
      score: 0,
      askedQuestions: new Set(),
      currentDifficulty: difficulty,
      consecutiveCorrect: 0,
      hintUsed: false,
      totalAnswered: 0,
      correctAnswers: 0,
    });
    
    const question = generateQuestion(difficulty);
    const hash = generateQuestionHash(question);
    set({ currentQuestion: question, askedQuestions: new Set([hash]) });
  },
  
  resetGame: () => {
    set({
      gameStarted: false,
      gameCompleted: false,
      levelCompleted: false,
      currentLevel: 1,
      score: 0,
      currentQuestion: null,
      selectedAnswer: null,
      answered: false,
      showFeedback: false,
      totalAnswered: 0,
      correctAnswers: 0,
      askedQuestions: new Set(),
      currentDifficulty: 'easy',
      consecutiveCorrect: 0,
      hintUsed: false,
    });
  },
  
  getTelemetryLog: () => {
    const state = get();
    return [{
      game: 'TimeShapeLogic',
      level: state.currentLevel,
      score: state.score,
      accuracy: state.totalAnswered > 0 ? state.correctAnswers / state.totalAnswered : 0,
      totalQuestions: state.totalAnswered,
      timestamp: new Date().toISOString(),
    }];
  },
  
  getAccuracy: () => {
    const state = get();
    if (state.totalAnswered === 0) return 0;
    return state.correctAnswers / state.totalAnswered;
  },
}));

