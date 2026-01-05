import { create } from 'zustand';

// Types
export type ChallengeType =
  | 'count-objects'
  | 'match-number'
  | 'number-sequence'
  | 'missing-number'
  | 'before-after'
  | 'compare-quantities'
  | 'tap-the-number'
  | 'make-the-number';

export type JungleObject =
  | 'monkey' | 'elephant' | 'lion' | 'giraffe' | 'zebra'
  | 'parrot' | 'butterfly' | 'frog' | 'turtle' | 'fish'
  | 'banana' | 'apple' | 'mango' | 'coconut' | 'flower';

export interface DisplayObject {
  id: string;
  type: JungleObject;
  x: number;
  y: number;
  size: number;
  rotation: number;
  isSelected?: boolean;
}

export interface NumberOption {
  id: string;
  value: number;
  label: string;
  x?: number;
  y?: number;
}

export interface Challenge {
  id: string;
  type: ChallengeType;
  level: 1 | 2 | 3 | 4 | 5;
  title: string;
  instruction: string;
  data: {
    targetNumber?: number;
    displayObjects?: DisplayObject[];
    numberSequence?: (number | null)[];
    compareGroups?: {
      groupA: DisplayObject[];
      groupB: DisplayObject[];
    };
    correctAnswer: number | number[] | string;
    askMore?: boolean;
    askBefore?: boolean;
    ascending?: boolean;
  };
  options: NumberOption[];
  correctOptionId: string | string[];
}

interface NumberJungleState {
  // Game State
  gameState: 'menu' | 'playing' | 'paused' | 'celebrating';
  level: 1 | 2 | 3 | 4 | 5;

  // Progress
  score: number;
  stars: number;
  streak: number;
  challengesCompleted: number;
  totalChallengesPerLevel: number;

  // Current Challenge
  currentChallenge: Challenge | null;
  selectedOption: string | null;
  selectedObjects: string[];
  orderedSequence: number[]; // For drag-drop sequence ordering
  showFeedback: boolean;
  isCorrect: boolean;

  // Actions
  startGame: (level: 1 | 2 | 3 | 4 | 5) => void;
  generateChallenge: () => void;
  selectOption: (optionId: string) => void;
  toggleObjectSelection: (objectId: string) => void;
  reorderSequence: (fromIndex: number, toIndex: number) => void;
  submitAnswer: () => boolean;
  nextChallenge: () => void;
  resetGame: () => void;
}

// Constants
const JUNGLE_ANIMALS: JungleObject[] = ['monkey', 'elephant', 'lion', 'giraffe', 'parrot', 'butterfly', 'frog', 'turtle'];
const JUNGLE_FRUITS: JungleObject[] = ['banana', 'apple', 'mango', 'coconut', 'flower'];

// Number words helper function
function getNumberWord(n: number): string {
  const ones = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if (n < 20) return ones[n];
  if (n < 100) {
    const t = Math.floor(n / 10);
    const o = n % 10;
    return o === 0 ? tens[t] : `${tens[t]}-${ones[o]}`;
  }
  return 'One Hundred';
}

export const JUNGLE_EMOJIS: Record<JungleObject, string> = {
  monkey: '🐒',
  elephant: '🐘',
  lion: '🦁',
  giraffe: '🦒',
  zebra: '🦓',
  parrot: '🦜',
  butterfly: '🦋',
  frog: '🐸',
  turtle: '🐢',
  fish: '🐟',
  banana: '🍌',
  apple: '🍎',
  mango: '🥭',
  coconut: '🥥',
  flower: '🌺',
};

// Helper functions
function generateRandomPositions(
  count: number,
  bounds: { minX: number; maxX: number; minY: number; maxY: number },
  minDistance: number = 55
): Array<{ x: number; y: number }> {
  const positions: Array<{ x: number; y: number }> = [];
  let attempts = 0;

  while (positions.length < count && attempts < 500) {
    const x = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
    const y = bounds.minY + Math.random() * (bounds.maxY - bounds.minY);

    const tooClose = positions.some((p) => Math.hypot(p.x - x, p.y - y) < minDistance);
    if (!tooClose) positions.push({ x, y });
    attempts++;
  }

  return positions;
}

function generateDistractors(correct: number, min: number, max: number, count: number): number[] {
  const distractors: number[] = [];
  const candidates = [correct - 2, correct - 1, correct + 1, correct + 2].filter(
    (n) => n >= min && n <= max && n !== correct
  );

  while (distractors.length < count && candidates.length > 0) {
    const idx = Math.floor(Math.random() * candidates.length);
    distractors.push(candidates.splice(idx, 1)[0]);
  }

  while (distractors.length < count) {
    const rand = min + Math.floor(Math.random() * (max - min + 1));
    if (rand !== correct && !distractors.includes(rand)) {
      distractors.push(rand);
    }
  }

  return distractors;
}

export const useNumberJungleStore = create<NumberJungleState>((set, get) => ({
  // Initial State
  gameState: 'menu',
  level: 1,
  score: 0,
  stars: 0,
  streak: 0,
  challengesCompleted: 0,
  totalChallengesPerLevel: 20,
  currentChallenge: null,
  selectedOption: null,
  selectedObjects: [],
  orderedSequence: [],
  showFeedback: false,
  isCorrect: false,

  startGame: (level: 1 | 2 | 3 | 4 | 5) => {
    set({
      gameState: 'playing',
      level,
      score: 0,
      stars: 0,
      streak: 0,
      challengesCompleted: 0,
      currentChallenge: null,
      selectedOption: null,
      selectedObjects: [],
      orderedSequence: [],
      showFeedback: false,
    });
    get().generateChallenge();
  },

  generateChallenge: () => {
    const { level } = get();
    let challenge: Challenge;

    // Number ranges for each level: 1-10, 1-20, 1-50, 1-100, 1-100 (advanced)
    const numberRange =
      level === 1 ? { min: 1, max: 10 } :
      level === 2 ? { min: 1, max: 20 } :
      level === 3 ? { min: 1, max: 50 } :
      level === 4 ? { min: 1, max: 100 } :
      { min: 1, max: 100 };

    // Max objects to display (for counting challenges)
    const maxDisplayObjects = level <= 2 ? 10 : 15;

    // Challenge types based on level
    const level1Types: ChallengeType[] = ['count-objects', 'tap-the-number', 'match-number', 'missing-number', 'before-after'];
    const level2Types: ChallengeType[] = ['count-objects', 'tap-the-number', 'match-number', 'missing-number', 'before-after', 'compare-quantities'];
    const level3Types: ChallengeType[] = ['tap-the-number', 'missing-number', 'before-after', 'compare-quantities', 'number-sequence'];
    const level4Types: ChallengeType[] = ['tap-the-number', 'missing-number', 'before-after', 'number-sequence'];
    const level5Types: ChallengeType[] = ['tap-the-number', 'missing-number', 'before-after', 'number-sequence'];

    const types = level === 1 ? level1Types : level === 2 ? level2Types : level === 3 ? level3Types : level === 4 ? level4Types : level5Types;
    const type = types[Math.floor(Math.random() * types.length)];

    switch (type) {
      case 'count-objects': {
        // For counting, limit to maxDisplayObjects
        const targetNumber = numberRange.min + Math.floor(Math.random() * Math.min(maxDisplayObjects, numberRange.max - numberRange.min + 1));
        const objectTypes = [...JUNGLE_ANIMALS, ...JUNGLE_FRUITS];
        const objectType = objectTypes[Math.floor(Math.random() * objectTypes.length)];

        const positions = generateRandomPositions(targetNumber, {
          minX: 50,
          maxX: 350,
          minY: 60,
          maxY: 220,
        }, 35);

        const displayObjects: DisplayObject[] = positions.map((pos, idx) => ({
          id: `obj-${idx}`,
          type: objectType,
          x: pos.x,
          y: pos.y,
          size: 45 + Math.random() * 10,
          rotation: (Math.random() - 0.5) * 20,
        }));

        const wrongNums = generateDistractors(targetNumber, numberRange.min, numberRange.max, 3);
        const allNums = [targetNumber, ...wrongNums].sort(() => Math.random() - 0.5);

        const options: NumberOption[] = allNums.map((num, idx) => ({
          id: `opt-${idx}`,
          value: num,
          label: num.toString(),
        }));

        challenge = {
          id: `count-${Date.now()}-${Math.random()}`,
          type: 'count-objects',
          level,
          title: '🔢 Count the Animals!',
          instruction: `How many ${objectType.toUpperCase()}S do you see?`,
          data: {
            targetNumber,
            displayObjects,
            correctAnswer: targetNumber,
          },
          options,
          correctOptionId: options.find((o) => o.value === targetNumber)?.id || '',
        };
        break;
      }

      case 'tap-the-number': {
        const targetNumber = numberRange.min + Math.floor(Math.random() * (numberRange.max - numberRange.min + 1));
        const showWord = level > 1 && Math.random() > 0.6;

        const wrongNums = generateDistractors(targetNumber, numberRange.min, numberRange.max, 3);
        const allNums = [targetNumber, ...wrongNums].sort(() => Math.random() - 0.5);

        const options: NumberOption[] = allNums.map((num, idx) => ({
          id: `opt-${idx}`,
          value: num,
          label: num.toString(),
        }));

        challenge = {
          id: `tap-${Date.now()}-${Math.random()}`,
          type: 'tap-the-number',
          level,
          title: '👆 Tap the Number!',
          instruction: showWord
            ? `Find the number "${getNumberWord(targetNumber)}"`
            : `Find the number ${targetNumber}`,
          data: {
            targetNumber,
            correctAnswer: targetNumber,
          },
          options,
          correctOptionId: options.find((o) => o.value === targetNumber)?.id || '',
        };
        break;
      }

      case 'match-number': {
        // For matching, limit to maxDisplayObjects
        const targetNumber = numberRange.min + Math.floor(Math.random() * Math.min(maxDisplayObjects, numberRange.max - numberRange.min + 1));
        const objectType = JUNGLE_ANIMALS[Math.floor(Math.random() * JUNGLE_ANIMALS.length)];

        const positions = generateRandomPositions(targetNumber, {
          minX: 50,
          maxX: 350,
          minY: 60,
          maxY: 200,
        }, 35);

        const displayObjects: DisplayObject[] = positions.map((pos, idx) => ({
          id: `obj-${idx}`,
          type: objectType,
          x: pos.x,
          y: pos.y,
          size: 40,
          rotation: (Math.random() - 0.5) * 15,
        }));

        const wrongNums = generateDistractors(targetNumber, numberRange.min, numberRange.max, 3);
        const allNums = [targetNumber, ...wrongNums].sort(() => Math.random() - 0.5);

        const options: NumberOption[] = allNums.map((num, idx) => ({
          id: `opt-${idx}`,
          value: num,
          label: level >= 3 ? getNumberWord(num) : num.toString(),
        }));

        challenge = {
          id: `match-${Date.now()}-${Math.random()}`,
          type: 'match-number',
          level,
          title: '🔗 Match the Number!',
          instruction: `Count the ${objectType.toUpperCase()}S and pick the matching number!`,
          data: {
            targetNumber,
            displayObjects,
            correctAnswer: targetNumber,
          },
          options,
          correctOptionId: options.find((o) => o.value === targetNumber)?.id || '',
        };
        break;
      }

      case 'missing-number': {
        const sequenceLength = level === 1 ? 4 : level === 2 ? 5 : 6;
        const maxStart = numberRange.max - sequenceLength + 1;
        const startNum = 1 + Math.floor(Math.random() * Math.max(1, maxStart - 1));
        const sequence = Array.from({ length: sequenceLength }, (_, i) => startNum + i);

        const missingIndex = 1 + Math.floor(Math.random() * (sequenceLength - 2));
        const missingNumber = sequence[missingIndex];
        const displaySequence = sequence.map((n, i) => (i === missingIndex ? null : n));

        const wrongNums = generateDistractors(missingNumber, numberRange.min, numberRange.max, 3);
        const allNums = [missingNumber, ...wrongNums].sort(() => Math.random() - 0.5);

        const options: NumberOption[] = allNums.map((num, idx) => ({
          id: `opt-${idx}`,
          value: num,
          label: num.toString(),
        }));

        challenge = {
          id: `missing-${Date.now()}-${Math.random()}`,
          type: 'missing-number',
          level,
          title: '❓ Find the Missing Number!',
          instruction: 'Which number is hiding?',
          data: {
            numberSequence: displaySequence,
            correctAnswer: missingNumber,
          },
          options,
          correctOptionId: options.find((o) => o.value === missingNumber)?.id || '',
        };
        break;
      }

      case 'before-after': {
        const targetNumber = numberRange.min + 1 + Math.floor(Math.random() * (numberRange.max - numberRange.min - 1));
        const askBefore = Math.random() > 0.5;
        const correctAnswer = askBefore ? targetNumber - 1 : targetNumber + 1;

        const wrongNums = generateDistractors(correctAnswer, numberRange.min, numberRange.max, 3);
        const allNums = [correctAnswer, ...wrongNums].sort(() => Math.random() - 0.5);

        const options: NumberOption[] = allNums.map((num, idx) => ({
          id: `opt-${idx}`,
          value: num,
          label: num.toString(),
        }));

        challenge = {
          id: `before-after-${Date.now()}-${Math.random()}`,
          type: 'before-after',
          level,
          title: askBefore ? '⬅️ What Comes Before?' : '➡️ What Comes After?',
          instruction: `What number comes ${askBefore ? 'BEFORE' : 'AFTER'} ${targetNumber}?`,
          data: {
            targetNumber,
            correctAnswer,
            askBefore,
          },
          options,
          correctOptionId: options.find((o) => o.value === correctAnswer)?.id || '',
        };
        break;
      }

      case 'compare-quantities': {
        let countA = numberRange.min + Math.floor(Math.random() * (numberRange.max - numberRange.min));
        let countB = numberRange.min + Math.floor(Math.random() * (numberRange.max - numberRange.min));
        while (countB === countA) {
          countB = numberRange.min + Math.floor(Math.random() * (numberRange.max - numberRange.min));
        }

        const objectTypeA = JUNGLE_ANIMALS[Math.floor(Math.random() * JUNGLE_ANIMALS.length)];
        const objectTypeB = JUNGLE_FRUITS[Math.floor(Math.random() * JUNGLE_FRUITS.length)];

        const groupA = generateRandomPositions(countA, { minX: 30, maxX: 180, minY: 80, maxY: 200 }, 40).map(
          (pos, idx) => ({ id: `a-${idx}`, type: objectTypeA, ...pos, size: 35, rotation: 0 })
        );

        const groupB = generateRandomPositions(countB, { minX: 220, maxX: 370, minY: 80, maxY: 200 }, 40).map(
          (pos, idx) => ({ id: `b-${idx}`, type: objectTypeB, ...pos, size: 35, rotation: 0 })
        );

        const askMore = Math.random() > 0.5;
        const correctAnswer = askMore ? (countA > countB ? 'A' : 'B') : countA < countB ? 'A' : 'B';

        const options: NumberOption[] = [
          { id: 'opt-A', value: countA, label: `Group A` },
          { id: 'opt-B', value: countB, label: `Group B` },
        ];

        challenge = {
          id: `compare-${Date.now()}-${Math.random()}`,
          type: 'compare-quantities',
          level,
          title: askMore ? '📈 Which Has MORE?' : '📉 Which Has LESS?',
          instruction: `Which group has ${askMore ? 'MORE' : 'LESS'}?`,
          data: {
            compareGroups: { groupA, groupB },
            correctAnswer,
            askMore,
          },
          options,
          correctOptionId: `opt-${correctAnswer}`,
        };
        break;
      }

      case 'number-sequence': {
        const ascending = Math.random() > 0.5;
        const seqLength = level === 1 ? 4 : level === 2 ? 5 : 5;
        const startNum = 1 + Math.floor(Math.random() * Math.max(1, numberRange.max - seqLength));

        const correctSequence = Array.from({ length: seqLength }, (_, i) => startNum + i);
        if (!ascending) correctSequence.reverse();

        // Shuffle for user to arrange (ensure it's not already in correct order)
        let shuffledNums = [...correctSequence].sort(() => Math.random() - 0.5);
        // Keep shuffling if accidentally in correct order
        while (shuffledNums.every((n, i) => n === correctSequence[i])) {
          shuffledNums = [...correctSequence].sort(() => Math.random() - 0.5);
        }

        const options: NumberOption[] = shuffledNums.map((num, idx) => ({
          id: `opt-${idx}`,
          value: num,
          label: num.toString(),
        }));

        challenge = {
          id: `sequence-${Date.now()}-${Math.random()}`,
          type: 'number-sequence',
          level,
          title: ascending ? '🔼 Smallest to Biggest!' : '🔽 Biggest to Smallest!',
          instruction: `Drag to arrange: ${ascending ? 'SMALLEST → BIGGEST' : 'BIGGEST → SMALLEST'}`,
          data: {
            numberSequence: correctSequence,
            correctAnswer: correctSequence,
            ascending,
          },
          options,
          correctOptionId: correctSequence.map((n) => options.find((o) => o.value === n)?.id || ''),
        };
        // Set the shuffled sequence for drag-drop
        set({ orderedSequence: shuffledNums });
        break;
      }

      case 'make-the-number': {
        const targetNumber = numberRange.min + Math.floor(Math.random() * (numberRange.max - numberRange.min + 1));
        const objectType = JUNGLE_FRUITS[Math.floor(Math.random() * JUNGLE_FRUITS.length)];

        const availableCount = targetNumber + 2 + Math.floor(Math.random() * 3);
        const positions = generateRandomPositions(availableCount, {
          minX: 50,
          maxX: 350,
          minY: 150,
          maxY: 280,
        });

        const displayObjects: DisplayObject[] = positions.map((pos, idx) => ({
          id: `obj-${idx}`,
          type: objectType,
          x: pos.x,
          y: pos.y,
          size: 40,
          rotation: 0,
          isSelected: false,
        }));

        challenge = {
          id: `make-${Date.now()}-${Math.random()}`,
          type: 'make-the-number',
          level,
          title: '🎯 Make the Number!',
          instruction: `Tap on ${targetNumber} ${objectType.toUpperCase()}S!`,
          data: {
            targetNumber,
            displayObjects,
            correctAnswer: targetNumber,
          },
          options: [],
          correctOptionId: '',
        };
        break;
      }

      default: {
        // Fallback
        return get().generateChallenge();
      }
    }

    // For non-sequence challenges, reset orderedSequence
    if (challenge.type !== 'number-sequence') {
      set({ currentChallenge: challenge, selectedOption: null, selectedObjects: [], orderedSequence: [], showFeedback: false });
    } else {
      set({ currentChallenge: challenge, selectedOption: null, selectedObjects: [], showFeedback: false });
    }
  },

  selectOption: (optionId: string) => {
    if (!get().showFeedback) {
      set({ selectedOption: optionId });
    }
  },

  toggleObjectSelection: (objectId: string) => {
    if (get().showFeedback) return;

    const { selectedObjects, currentChallenge } = get();
    const targetNumber = currentChallenge?.data.targetNumber || 0;

    if (selectedObjects.includes(objectId)) {
      set({ selectedObjects: selectedObjects.filter((id) => id !== objectId) });
    } else if (selectedObjects.length < targetNumber + 2) {
      set({ selectedObjects: [...selectedObjects, objectId] });
    }
  },

  reorderSequence: (fromIndex: number, toIndex: number) => {
    if (get().showFeedback) return;
    
    const { orderedSequence } = get();
    if (fromIndex < 0 || fromIndex >= orderedSequence.length) return;
    if (toIndex < 0 || toIndex >= orderedSequence.length) return;
    
    const newSequence = [...orderedSequence];
    const [removed] = newSequence.splice(fromIndex, 1);
    newSequence.splice(toIndex, 0, removed);
    set({ orderedSequence: newSequence });
  },

  submitAnswer: () => {
    const { currentChallenge, selectedOption, selectedObjects, orderedSequence } = get();
    if (!currentChallenge) return false;

    let isCorrect = false;

    if (currentChallenge.type === 'make-the-number') {
      isCorrect = selectedObjects.length === currentChallenge.data.targetNumber;
    } else if (currentChallenge.type === 'number-sequence') {
      // Check if ordered sequence matches correct answer
      const correctSequence = currentChallenge.data.correctAnswer as number[];
      isCorrect = orderedSequence.length === correctSequence.length &&
        orderedSequence.every((num, idx) => num === correctSequence[idx]);
    } else if (selectedOption) {
      isCorrect = selectedOption === currentChallenge.correctOptionId;
    }

    if (isCorrect) {
      // Score is based on 100 total (5 points per correct answer for 20 questions)
      const points = 5;
      set((state) => ({
        score: Math.min(100, state.score + points),
        stars: state.stars + 1,
        streak: state.streak + 1,
        isCorrect: true,
        showFeedback: true,
      }));
    } else {
      set({ isCorrect: false, showFeedback: true, streak: 0 });
    }

    return isCorrect;
  },

  nextChallenge: () => {
    const { challengesCompleted, totalChallengesPerLevel } = get();
    const newCompleted = challengesCompleted + 1;

    if (newCompleted >= totalChallengesPerLevel) {
      set({ gameState: 'celebrating' });
    } else {
      set({ challengesCompleted: newCompleted });
      get().generateChallenge();
    }
  },

  resetGame: () => {
    set({
      gameState: 'menu',
      level: 1,
      score: 0,
      stars: 0,
      streak: 0,
      currentChallenge: null,
      challengesCompleted: 0,
      selectedOption: null,
      selectedObjects: [],
      orderedSequence: [],
      showFeedback: false,
    });
  },
}));
