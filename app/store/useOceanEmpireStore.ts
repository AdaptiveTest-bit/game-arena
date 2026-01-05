'use client';

import { create } from 'zustand';

// Indian number formatting utility
export const formatIndian = (num: number): string => {
  const str = num.toString();
  if (str.length <= 3) return str;
  
  let result = str.slice(-3);
  let remaining = str.slice(0, -3);
  
  while (remaining.length > 0) {
    const chunk = remaining.slice(-2);
    result = chunk + ',' + result;
    remaining = remaining.slice(0, -2);
  }
  
  return result;
};

// Number to words (Indian system)
export const numberToWords = (num: number): string => {
  if (num === 0) return 'Zero';
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const twoDigits = (n: number): string => {
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
  };
  
  const threeDigits = (n: number): string => {
    if (n < 100) return twoDigits(n);
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + twoDigits(n % 100) : '');
  };
  
  let result = '';
  
  // Crores (10,000,000)
  if (num >= 10000000) {
    result += twoDigits(Math.floor(num / 10000000)) + ' Crore ';
    num %= 10000000;
  }
  
  // Lakhs (100,000)
  if (num >= 100000) {
    result += twoDigits(Math.floor(num / 100000)) + ' Lakh ';
    num %= 100000;
  }
  
  // Thousands
  if (num >= 1000) {
    result += twoDigits(Math.floor(num / 1000)) + ' Thousand ';
    num %= 1000;
  }
  
  // Hundreds
  if (num > 0) {
    result += threeDigits(num);
  }
  
  return result.trim();
};

interface PlaceValueChallenge {
  targetNumber: number;
  targetNumberWords: string;
  digits: number[];
  placeValues: string[];
  playerPlacements: (number | null)[];
  availableDigits: number[];
}

interface MentalMathChallenge {
  type: 'addition' | 'subtraction' | 'estimation' | 'comparison';
  numbers: number[];
  operation: string;
  correctAnswer: number | number[];
  strategy: string;
  context: string;
  playerAnswer: string;
  playerOrder: number[];
}

interface ComparisonZone {
  name: string;
  population: number;
  icon: string;
}

interface ComparisonChallenge {
  zones: ComparisonZone[];
  correctOrder: ComparisonZone[];
  playerOrder: (string | null)[];
}

interface OceanEmpireState {
  // Game Meta
  phase: 'placeValue' | 'mentalMath' | 'comparison';
  score: number;
  streak: number;
  challengeIndex: number;
  totalChallenges: number;
  isPhaseCorrect: boolean;
  showPhaseComplete: boolean;
  gameComplete: boolean;
  
  // Phase 1: Place Value
  placeValueChallenge: PlaceValueChallenge | null;
  placeDigit: (slotIndex: number, digit: number) => void;
  removeDigit: (slotIndex: number) => void;
  validatePlaceValue: () => boolean;
  
  // Phase 2: Mental Math
  mentalMathChallenge: MentalMathChallenge | null;
  setPlayerAnswer: (answer: string) => void;
  appendToAnswer: (digit: string) => void;
  clearAnswer: () => void;
  backspaceAnswer: () => void;
  setPlayerOrder: (order: number[]) => void;
  validateMentalMath: () => boolean;
  
  // Phase 3: Comparison
  comparisonChallenge: ComparisonChallenge | null;
  placeZone: (slotIndex: number, zoneName: string) => void;
  removeZone: (slotIndex: number) => void;
  validateComparison: () => boolean;
  
  // Game Flow
  generateChallenge: () => void;
  advancePhase: () => void;
  nextChallenge: () => void;
  resetGame: () => void;
  dismissPhaseComplete: () => void;
  
  // Hints
  hintsRemaining: number;
  currentHint: string | null;
  useHint: () => string | null;
}

// Challenge generation functions
const generatePlaceValueChallenge = (): PlaceValueChallenge => {
  // Hard: 7-8 digit numbers
  const numDigits = Math.random() > 0.5 ? 8 : 7;
  const digits: number[] = [];
  
  // First digit must be 1-9
  digits.push(Math.floor(Math.random() * 9) + 1);
  
  // Remaining digits can be 0-9
  for (let i = 1; i < numDigits; i++) {
    digits.push(Math.floor(Math.random() * 10));
  }
  
  const targetNumber = parseInt(digits.join(''), 10);
  
  const placeValues8 = ['Crores', 'Ten Lakhs', 'Lakhs', 'Ten Thousands', 'Thousands', 'Hundreds', 'Tens', 'Units'];
  const placeValues7 = ['Ten Lakhs', 'Lakhs', 'Ten Thousands', 'Thousands', 'Hundreds', 'Tens', 'Units'];
  
  // Shuffle available digits for the bin
  const availableDigits = [...digits].sort(() => Math.random() - 0.5);
  
  return {
    targetNumber,
    targetNumberWords: numberToWords(targetNumber),
    digits,
    placeValues: numDigits === 8 ? placeValues8 : placeValues7,
    playerPlacements: new Array(numDigits).fill(null),
    availableDigits
  };
};

const generateMentalMathChallenge = (): MentalMathChallenge => {
  const types: ('addition' | 'subtraction' | 'comparison')[] = ['addition', 'subtraction', 'comparison'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  const contexts = {
    addition: [
      'Zone A and Zone B fish populations are merging!',
      'Two research stations are combining their fish counts.',
      'Morning and evening fish migration totals need to be added.'
    ],
    subtraction: [
      'Some fish migrated away from the zone.',
      'Predators reduced the fish population.',
      'Fish were relocated to a new habitat.'
    ],
    comparison: [
      'Order these ocean zones by population.',
      'Rank the fishing areas from smallest to largest.',
      'Sort the marine reserves by fish count.'
    ]
  };
  
  switch (type) {
    case 'addition': {
      // Generate two 6-7 digit numbers
      const num1 = Math.floor(Math.random() * 9000000) + 1000000; // 1M to 10M
      const num2 = Math.floor(Math.random() * 9000000) + 1000000;
      const sum = num1 + num2;
      
      return {
        type: 'addition',
        numbers: [num1, num2],
        operation: '+',
        correctAnswer: sum,
        strategy: `Round ${formatIndian(num1)} to ${formatIndian(Math.round(num1 / 100000) * 100000)} and ${formatIndian(num2)} to ${formatIndian(Math.round(num2 / 100000) * 100000)}. Add the rounded numbers, then adjust.`,
        context: contexts.addition[Math.floor(Math.random() * contexts.addition.length)],
        playerAnswer: '',
        playerOrder: []
      };
    }
    
    case 'subtraction': {
      // Ensure no negative results
      const larger = Math.floor(Math.random() * 90000000) + 10000000; // 10M to 100M
      const smaller = Math.floor(Math.random() * (larger / 2)) + 1000000;
      
      return {
        type: 'subtraction',
        numbers: [larger, smaller],
        operation: '-',
        correctAnswer: larger - smaller,
        strategy: `Break down: ${formatIndian(larger)} - ${formatIndian(smaller)}. Subtract place by place from left to right.`,
        context: contexts.subtraction[Math.floor(Math.random() * contexts.subtraction.length)],
        playerAnswer: '',
        playerOrder: []
      };
    }
    
    case 'comparison': {
      // Generate 4 numbers to order
      const nums = Array.from({ length: 4 }, () => 
        Math.floor(Math.random() * 90000000) + 10000000
      );
      
      // Make some numbers tricky (similar but different)
      if (Math.random() > 0.5) {
        const base = nums[0];
        nums[1] = base + Math.floor(Math.random() * 10000) - 5000;
      }
      
      return {
        type: 'comparison',
        numbers: nums,
        operation: 'order',
        correctAnswer: [...nums].sort((a, b) => a - b),
        strategy: 'Compare digit by digit from left (crores first, then lakhs, then thousands...).',
        context: contexts.comparison[Math.floor(Math.random() * contexts.comparison.length)],
        playerAnswer: '',
        playerOrder: []
      };
    }
  }
};

const generateComparisonChallenge = (): ComparisonChallenge => {
  const icons = ['🦈', '🐠', '🐋', '🐡', '🦑'];
  const names = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E'];
  
  const zones: ComparisonZone[] = [];
  
  // Generate 5 distinct populations with some tricky comparisons
  const baseNumber = Math.floor(Math.random() * 5 + 3) * 10000000; // 30M to 80M
  
  for (let i = 0; i < 5; i++) {
    let population: number;
    
    if (i < 2) {
      // Similar numbers differing in lower places
      population = baseNumber + Math.floor(Math.random() * 999999);
    } else {
      // Different ranges
      population = Math.floor(Math.random() * 90000000) + 10000000;
    }
    
    zones.push({
      name: names[i],
      population,
      icon: icons[i]
    });
  }
  
  // Ensure all are unique
  const seen = new Set<number>();
  zones.forEach(zone => {
    while (seen.has(zone.population)) {
      zone.population += Math.floor(Math.random() * 1000) + 1;
    }
    seen.add(zone.population);
  });
  
  return {
    zones: [...zones].sort(() => Math.random() - 0.5),
    correctOrder: [...zones].sort((a, b) => a.population - b.population),
    playerOrder: new Array(5).fill(null)
  };
};

export const useOceanEmpireStore = create<OceanEmpireState>((set, get) => ({
  phase: 'placeValue',
  score: 0,
  streak: 0,
  challengeIndex: 0,
  totalChallenges: 3,
  isPhaseCorrect: false,
  showPhaseComplete: false,
  gameComplete: false,
  
  placeValueChallenge: null,
  mentalMathChallenge: null,
  comparisonChallenge: null,
  
  hintsRemaining: 3,
  currentHint: null,
  
  generateChallenge: () => {
    const { phase } = get();
    
    switch (phase) {
      case 'placeValue':
        set({ 
          placeValueChallenge: generatePlaceValueChallenge(),
          isPhaseCorrect: false,
          currentHint: null
        });
        break;
      case 'mentalMath':
        set({ 
          mentalMathChallenge: generateMentalMathChallenge(),
          isPhaseCorrect: false,
          currentHint: null
        });
        break;
      case 'comparison':
        set({ 
          comparisonChallenge: generateComparisonChallenge(),
          isPhaseCorrect: false,
          currentHint: null
        });
        break;
    }
  },
  
  placeDigit: (slotIndex, digit) => {
    const challenge = get().placeValueChallenge;
    if (!challenge) return;
    
    const newPlacements = [...challenge.playerPlacements];
    const newAvailable = [...challenge.availableDigits];
    
    // Find and remove digit from available
    const digitIndex = newAvailable.indexOf(digit);
    if (digitIndex === -1) return;
    
    // If slot already has a digit, return it to available
    if (newPlacements[slotIndex] !== null) {
      newAvailable.push(newPlacements[slotIndex]!);
    }
    
    newPlacements[slotIndex] = digit;
    newAvailable.splice(digitIndex, 1);
    
    set({ 
      placeValueChallenge: { 
        ...challenge, 
        playerPlacements: newPlacements,
        availableDigits: newAvailable
      } 
    });
  },
  
  removeDigit: (slotIndex) => {
    const challenge = get().placeValueChallenge;
    if (!challenge) return;
    
    const digit = challenge.playerPlacements[slotIndex];
    if (digit === null) return;
    
    const newPlacements = [...challenge.playerPlacements];
    const newAvailable = [...challenge.availableDigits];
    
    newPlacements[slotIndex] = null;
    newAvailable.push(digit);
    
    set({ 
      placeValueChallenge: { 
        ...challenge, 
        playerPlacements: newPlacements,
        availableDigits: newAvailable
      } 
    });
  },
  
  validatePlaceValue: () => {
    const challenge = get().placeValueChallenge;
    if (!challenge) return false;
    
    const isCorrect = challenge.playerPlacements.every(
      (digit, idx) => digit === challenge.digits[idx]
    );
    
    if (isCorrect) {
      const bonus = 100 * (get().streak + 1);
      set(state => ({ 
        score: state.score + bonus,
        streak: state.streak + 1,
        isPhaseCorrect: true
      }));
    } else {
      set({ streak: 0 });
    }
    
    return isCorrect;
  },
  
  setPlayerAnswer: (answer) => {
    const challenge = get().mentalMathChallenge;
    if (!challenge) return;
    set({ mentalMathChallenge: { ...challenge, playerAnswer: answer } });
  },
  
  appendToAnswer: (digit) => {
    const challenge = get().mentalMathChallenge;
    if (!challenge || challenge.playerAnswer.length >= 12) return;
    set({ mentalMathChallenge: { ...challenge, playerAnswer: challenge.playerAnswer + digit } });
  },
  
  clearAnswer: () => {
    const challenge = get().mentalMathChallenge;
    if (!challenge) return;
    set({ mentalMathChallenge: { ...challenge, playerAnswer: '' } });
  },
  
  backspaceAnswer: () => {
    const challenge = get().mentalMathChallenge;
    if (!challenge) return;
    set({ mentalMathChallenge: { ...challenge, playerAnswer: challenge.playerAnswer.slice(0, -1) } });
  },
  
  setPlayerOrder: (order) => {
    const challenge = get().mentalMathChallenge;
    if (!challenge) return;
    set({ mentalMathChallenge: { ...challenge, playerOrder: order } });
  },
  
  validateMentalMath: () => {
    const challenge = get().mentalMathChallenge;
    if (!challenge) return false;
    
    let isCorrect = false;
    
    if (challenge.type === 'comparison') {
      const correctOrder = challenge.correctAnswer as number[];
      isCorrect = challenge.playerOrder.every((num, idx) => num === correctOrder[idx]);
    } else {
      const playerNum = parseInt(challenge.playerAnswer.replace(/,/g, ''), 10);
      const correctNum = challenge.correctAnswer as number;
      isCorrect = playerNum === correctNum;
    }
    
    if (isCorrect) {
      const bonus = 150 * (get().streak + 1);
      set(state => ({ 
        score: state.score + bonus,
        streak: state.streak + 1,
        isPhaseCorrect: true
      }));
    } else {
      set({ streak: 0 });
    }
    
    return isCorrect;
  },
  
  placeZone: (slotIndex, zoneName) => {
    const challenge = get().comparisonChallenge;
    if (!challenge) return;
    
    const newOrder = [...challenge.playerOrder];
    
    // Remove zone from any existing slot
    const existingIndex = newOrder.indexOf(zoneName);
    if (existingIndex !== -1) {
      newOrder[existingIndex] = null;
    }
    
    newOrder[slotIndex] = zoneName;
    
    set({ comparisonChallenge: { ...challenge, playerOrder: newOrder } });
  },
  
  removeZone: (slotIndex) => {
    const challenge = get().comparisonChallenge;
    if (!challenge) return;
    
    const newOrder = [...challenge.playerOrder];
    newOrder[slotIndex] = null;
    
    set({ comparisonChallenge: { ...challenge, playerOrder: newOrder } });
  },
  
  validateComparison: () => {
    const challenge = get().comparisonChallenge;
    if (!challenge) return false;
    
    const isCorrect = challenge.playerOrder.every(
      (name, idx) => name === challenge.correctOrder[idx].name
    );
    
    if (isCorrect) {
      const bonus = 200 * (get().streak + 1);
      set(state => ({ 
        score: state.score + bonus,
        streak: state.streak + 1,
        isPhaseCorrect: true
      }));
    } else {
      set({ streak: 0 });
    }
    
    return isCorrect;
  },
  
  advancePhase: () => {
    const { phase } = get();
    
    if (phase === 'placeValue') {
      set({ 
        phase: 'mentalMath', 
        challengeIndex: 0,
        isPhaseCorrect: false,
        showPhaseComplete: false
      });
      get().generateChallenge();
    } else if (phase === 'mentalMath') {
      set({ 
        phase: 'comparison', 
        challengeIndex: 0,
        isPhaseCorrect: false,
        showPhaseComplete: false
      });
      get().generateChallenge();
    } else {
      set({ gameComplete: true, showPhaseComplete: false });
    }
  },
  
  nextChallenge: () => {
    const { challengeIndex, totalChallenges } = get();
    
    if (challengeIndex + 1 >= totalChallenges) {
      set({ showPhaseComplete: true });
    } else {
      set({ challengeIndex: challengeIndex + 1, isPhaseCorrect: false });
      get().generateChallenge();
    }
  },
  
  dismissPhaseComplete: () => {
    set({ showPhaseComplete: false });
    get().advancePhase();
  },
  
  resetGame: () => {
    set({
      phase: 'placeValue',
      score: 0,
      streak: 0,
      challengeIndex: 0,
      isPhaseCorrect: false,
      showPhaseComplete: false,
      gameComplete: false,
      placeValueChallenge: null,
      mentalMathChallenge: null,
      comparisonChallenge: null,
      hintsRemaining: 3,
      currentHint: null
    });
    get().generateChallenge();
  },
  
  useHint: () => {
    const { hintsRemaining, phase, placeValueChallenge, mentalMathChallenge, comparisonChallenge } = get();
    
    if (hintsRemaining <= 0) return null;
    
    let hint = '';
    
    switch (phase) {
      case 'placeValue':
        if (placeValueChallenge) {
          const emptySlots = placeValueChallenge.playerPlacements
            .map((p, i) => p === null ? i : -1)
            .filter(i => i !== -1);
          
          if (emptySlots.length > 0) {
            const hintSlot = emptySlots[0];
            const correctDigit = placeValueChallenge.digits[hintSlot];
            hint = `The ${placeValueChallenge.placeValues[hintSlot]} place should have the digit ${correctDigit}.`;
          }
        }
        break;
      
      case 'mentalMath':
        if (mentalMathChallenge) {
          hint = mentalMathChallenge.strategy;
        }
        break;
      
      case 'comparison':
        if (comparisonChallenge) {
          const smallest = comparisonChallenge.correctOrder[0];
          hint = `The smallest population is ${smallest.name} with ${formatIndian(smallest.population)} fish.`;
        }
        break;
    }
    
    set({ hintsRemaining: hintsRemaining - 1, currentHint: hint });
    return hint;
  }
}));
