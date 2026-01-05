import { create } from 'zustand';

// Fraction operation types
export type FractionOperation = 'addition' | 'subtraction' | 'multiplication' | 'comparison';

export interface FractionChallenge {
  id: number;
  fraction1: { numerator: number; denominator: number };
  fraction2?: { numerator: number; denominator: number };
  operation: FractionOperation;
  question: string;
  correctAnswer: { numerator: number; denominator: number } | '>' | '<' | '=';
  difficulty: 'easy' | 'medium' | 'hard';
  chapter: 'ch5' | 'ch6';
}

// Generate procedural fraction challenges
const generateLevel1Challenges = (): FractionChallenge[] => {
  // Level 1: Addition & comparison of like fractions (Chapter 5)
  const challenges: FractionChallenge[] = [];
  
  for (let i = 0; i < 5; i++) {
    const denom = Math.floor(Math.random() * 5) + 3; // 3-7
    const num1 = Math.floor(Math.random() * (denom - 1)) + 1;
    const num2 = Math.floor(Math.random() * (denom - num1)) + 1;
    
    if (i < 3) {
      // Addition
      challenges.push({
        id: i,
        fraction1: { numerator: num1, denominator: denom },
        fraction2: { numerator: num2, denominator: denom },
        operation: 'addition',
        question: `What is ${num1}/${denom} + ${num2}/${denom}?`,
        correctAnswer: { numerator: num1 + num2, denominator: denom },
        difficulty: 'easy',
        chapter: 'ch5',
      });
    } else {
      // Comparison
      const num1Compare = Math.floor(Math.random() * denom) + 1;
      const num2Compare = Math.floor(Math.random() * denom) + 1;
      const result: '>' | '<' | '=' = num1Compare > num2Compare ? '>' : num1Compare < num2Compare ? '<' : '=';
      challenges.push({
        id: i,
        fraction1: { numerator: num1Compare, denominator: denom },
        fraction2: { numerator: num2Compare, denominator: denom },
        operation: 'comparison',
        question: `Compare: ${num1Compare}/${denom} ? ${num2Compare}/${denom}`,
        correctAnswer: result,
        difficulty: 'easy',
        chapter: 'ch5',
      });
    }
  }
  
  return challenges;
};

const generateLevel2Challenges = (): FractionChallenge[] => {
  // Level 2: Subtraction with unlike denominators (Chapter 6)
  const challenges: FractionChallenge[] = [];
  
  for (let i = 0; i < 7; i++) {
    const denom1 = Math.floor(Math.random() * 4) + 3; // 3-6
    const denom2 = Math.floor(Math.random() * 4) + 3; // 3-6
    const lcm = getLCM(denom1, denom2);
    
    const num1 = Math.floor(Math.random() * (lcm / 2)) + 1;
    const maxSubtract = Math.min(num1, Math.floor(lcm * 0.8));
    const subtractNum = Math.floor(Math.random() * maxSubtract) + 1;
    
    // Subtraction with unlike denominators
    const resultNum = num1 - subtractNum;
    
    challenges.push({
      id: i,
      fraction1: { numerator: num1, denominator: denom1 },
      fraction2: { numerator: subtractNum, denominator: lcm },
      operation: 'subtraction',
      question: `Subtract: ${num1}/${denom1} - ${subtractNum}/${lcm} = ?`,
      correctAnswer: { 
        numerator: resultNum, 
        denominator: lcm 
      },
      difficulty: 'medium',
      chapter: 'ch6',
    });
  }
  
  return challenges;
};

const generateLevel3Challenges = (): FractionChallenge[] => {
  // Level 3: Mixed operations with fractions (Ch 5 & 6)
  const challenges: FractionChallenge[] = [];
  
  const operations: FractionOperation[] = ['addition', 'subtraction', 'multiplication'];
  
  for (let i = 0; i < 10; i++) {
    const operation = operations[Math.floor(Math.random() * operations.length)];
    const denom1 = Math.floor(Math.random() * 5) + 2; // 2-6
    const denom2 = Math.floor(Math.random() * 5) + 2; // 2-6
    
    const num1 = Math.floor(Math.random() * (denom1 - 1)) + 1;
    const num2 = Math.floor(Math.random() * (denom1 - num1)) + 1;
    
    const lcm = getLCM(denom1, denom2);
    
    if (operation === 'addition') {
      const resultNum = (num1 * (lcm / denom1)) + (num2 * (lcm / denom2));
      challenges.push({
        id: i,
        fraction1: { numerator: num1, denominator: denom1 },
        fraction2: { numerator: num2, denominator: denom2 },
        operation: 'addition',
        question: `Add: ${num1}/${denom1} + ${num2}/${denom2} = ?`,
        correctAnswer: simplifyFraction(resultNum, lcm),
        difficulty: 'hard',
        chapter: 'ch5',
      });
    } else if (operation === 'subtraction') {
      const totalNum1 = num1 * (lcm / denom1);
      const num2Scaled = num2 * (lcm / denom2);
      if (totalNum1 > num2Scaled) {
        challenges.push({
          id: i,
          fraction1: { numerator: num1, denominator: denom1 },
          fraction2: { numerator: num2, denominator: denom2 },
          operation: 'subtraction',
          question: `Subtract: ${num1}/${denom1} - ${num2}/${denom2} = ?`,
          correctAnswer: simplifyFraction(totalNum1 - num2Scaled, lcm),
          difficulty: 'hard',
          chapter: 'ch6',
        });
      } else {
        // Fallback to addition if subtraction would be negative
        const resultNum = totalNum1 + num2Scaled;
        challenges.push({
          id: i,
          fraction1: { numerator: num1, denominator: denom1 },
          fraction2: { numerator: num2, denominator: denom2 },
          operation: 'addition',
          question: `Add: ${num1}/${denom1} + ${num2}/${denom2} = ?`,
          correctAnswer: simplifyFraction(resultNum, lcm),
          difficulty: 'hard',
          chapter: 'ch5',
        });
      }
    } else {
      // Multiplication
      const multNum1 = Math.floor(Math.random() * 4) + 1;
      const multNum2 = Math.floor(Math.random() * 4) + 1;
      const multDenom1 = Math.floor(Math.random() * 4) + 3;
      const multDenom2 = Math.floor(Math.random() * 4) + 3;
      
      challenges.push({
        id: i,
        fraction1: { numerator: multNum1, denominator: multDenom1 },
        fraction2: { numerator: multNum2, denominator: multDenom2 },
        operation: 'multiplication',
        question: `Multiply: ${multNum1}/${multDenom1} × ${multNum2}/${multDenom2} = ?`,
        correctAnswer: simplifyFraction(multNum1 * multNum2, multDenom1 * multDenom2),
        difficulty: 'hard',
        chapter: 'ch5',
      });
    }
  }
  
  return challenges;
};

// Helper functions
const getLCM = (a: number, b: number): number => {
  const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
  return (a * b) / gcd(a, b);
};

const simplifyFraction = (numerator: number, denominator: number): { numerator: number; denominator: number } => {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const common = gcd(numerator, denominator);
  return {
    numerator: numerator / common,
    denominator: denominator / common,
  };
};

export interface FractionFusionState {
  // Game config
  currentLevel: number;
  totalLevels: number;
  
  // Challenge state
  currentChallengeIndex: number;
  challenges: FractionChallenge[];
  selectedAnswer: string | null;
  answeredChallenges: { challengeId: number; isCorrect: boolean; answer: string }[];
  
  // Game state
  gameStartTime: number;
  gameCompleted: boolean;
  levelCompleted: boolean;
  score: number;
  
  // Actions
  startGame: (level?: number) => void;
  selectAnswer: (answer: string) => boolean;
  nextChallenge: () => void;
  resetGame: () => void;
  completeLevel: () => void;
  getTelemetryLog: () => any;
  getAccuracy: () => number;
}

export const useFractionFusionStore = create<FractionFusionState>((set, get) => {
  const generateChallengesForLevel = (level: number): FractionChallenge[] => {
    switch (level) {
      case 1:
        return generateLevel1Challenges();
      case 2:
        return generateLevel2Challenges();
      case 3:
        return generateLevel3Challenges();
      default:
        return generateLevel1Challenges();
    }
  };

  return {
    // Initial state
    currentLevel: 1,
    totalLevels: 3,
    
    currentChallengeIndex: 0,
    challenges: generateChallengesForLevel(1),
    selectedAnswer: null,
    answeredChallenges: [],
    
    gameStartTime: 0,
    gameCompleted: false,
    levelCompleted: false,
    score: 0,

    // Start the game
    startGame: (level = 1) => {
      set({
        currentLevel: level,
        currentChallengeIndex: 0,
        challenges: generateChallengesForLevel(level),
        selectedAnswer: null,
        answeredChallenges: [],
        gameStartTime: Date.now(),
        gameCompleted: false,
        levelCompleted: false,
        score: 0,
      });
    },

    // Select an answer
    selectAnswer: (answer: string) => {
      const state = get();
      const currentChallengeIndex = state.currentChallengeIndex;
      const currentChallenge = state.challenges[currentChallengeIndex];
      
      let isCorrect = false;
      const correct = currentChallenge.correctAnswer;
      
      if (currentChallenge.operation === 'comparison') {
        // Comparison answer is '>', '<', or '='
        isCorrect = answer === correct;
      } else {
        // Fraction answer - check if format is "numerator/denominator"
        if (answer.includes('/') && typeof correct === 'object') {
          const parts = answer.split('/');
          const ansNum = parseInt(parts[0]);
          const ansDenom = parseInt(parts[1]);
          isCorrect = ansNum === correct.numerator && ansDenom === correct.denominator;
        }
      }
      
      const newScore = state.score + (isCorrect ? 20 : 0);
      
      set({
        selectedAnswer: answer,
        answeredChallenges: [
          ...state.answeredChallenges,
          { challengeId: currentChallenge.id, isCorrect, answer },
        ],
        score: newScore,
      });
      
      return isCorrect;
    },

    // Move to next challenge
    nextChallenge: () => {
      const state = get();
      const nextIndex = state.currentChallengeIndex + 1;
      
      if (nextIndex >= state.challenges.length) {
        set({ levelCompleted: true, gameCompleted: true });
      } else {
        set({
          currentChallengeIndex: nextIndex,
          selectedAnswer: null,
        });
      }
    },

    // Reset the game
    resetGame: () => {
      set({
        currentLevel: 1,
        currentChallengeIndex: 0,
        challenges: generateChallengesForLevel(1),
        selectedAnswer: null,
        answeredChallenges: [],
        gameStartTime: 0,
        gameCompleted: false,
        levelCompleted: false,
        score: 0,
      });
    },

    // Complete a level
    completeLevel: () => {
      set({ levelCompleted: true, gameCompleted: true });
    },

    // Get telemetry log
    getTelemetryLog: () => {
      const state = get();
      const timeTaken = Date.now() - state.gameStartTime;
      const correctAnswers = state.answeredChallenges.filter(q => q.isCorrect).length;
      
      return {
        student_id: 'test_user_1',
        game_id: 'fraction_fusion_01',
        concept_tag: 'fractions_class5',
        level: state.currentLevel,
        performance: {
          is_correct: correctAnswers >= state.challenges.length * 0.7,
          accuracy_score: correctAnswers / state.challenges.length,
          time_taken_ms: timeTaken,
          score: state.score,
          correct_answers: correctAnswers,
          total_challenges: state.challenges.length,
        },
        interaction_trace: state.answeredChallenges.map((q, i) => ({
          action: 'answer',
          challenge_id: q.challengeId,
          answer: q.answer,
          is_correct: q.isCorrect,
          timestamp: i * 20000,
        })),
      };
    },

    // Calculate accuracy
    getAccuracy: () => {
      const state = get();
      if (state.answeredChallenges.length === 0) return 1;
      const correct = state.answeredChallenges.filter(q => q.isCorrect).length;
      return correct / state.answeredChallenges.length;
    },
  };
});

