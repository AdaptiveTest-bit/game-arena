// Coin Kingdom - Zustand Store
// CBSE Class 1 Mathematics - Chapter 7: Money

import { create } from 'zustand';
import {
  GameMode,
  DifficultyLevel,
  RoundConfig,
  Currency,
  generateRoundConfig,
  calculateTotal,
  validateCoinCollector,
  validatePiggyBankSort,
  validateMoneyCounter,
  validateExactChange,
  validateMoneyBalance,
  validateShopPayment,
  getHint,
  CoinCollectorRoundConfig,
  PiggyBankRoundConfig,
  MoneyCounterRoundConfig,
  ExactChangeRoundConfig,
  MoneyBalanceRoundConfig,
  ShopRoundConfig,
} from '@/app/utils/moneyUtils';

// ============== STATE INTERFACE ==============

interface CoinKingdomState {
  // Game Configuration
  currentMode: GameMode | null;
  difficulty: DifficultyLevel;
  
  // Round State
  roundConfig: RoundConfig | null;
  currentRound: number;
  totalRounds: number;
  
  // Scoring
  score: number;
  streak: number;
  maxStreak: number;
  roundsCorrect: number;
  
  // Feedback
  showFeedback: boolean;
  isCorrect: boolean;
  feedbackMessage: string;
  isRoundComplete: boolean;
  
  // Celebration
  showCelebration: boolean;
  celebrationType: 'correct' | 'streak' | 'complete' | null;
  
  // Session Tracking
  gameStartTime: number;
  roundStartTime: number;

  // ============== ACTIONS ==============
  
  // Game Flow
  startGame: (mode: GameMode, difficulty: DifficultyLevel) => void;
  generateRound: () => void;
  nextRound: () => void;
  tryAgain: () => void;
  skipRound: () => void;
  resetGame: () => void;
  
  // Mode-specific Actions
  selectCurrency: (currency: Currency) => void;
  sortToPiggyBank: (currency: Currency, piggyValue: number) => void;
  countCoin: (coinId: string) => void;
  selectCounterAnswer: (answer: number) => void;
  placeExactChangeCoin: (currency: Currency) => void;
  removeExactChangeCoin: (currencyId: string) => void;
  selectBalanceAnswer: (answer: 'left' | 'right' | 'equal') => void;
  payForItem: (currency: Currency) => void;
  removePayment: (currencyId: string) => void;
  
  // Utilities
  getHintText: () => string;
  hideFeedback: () => void;
  hideCelebration: () => void;
}

// ============== STORE ==============

export const useCoinKingdomStore = create<CoinKingdomState>((set, get) => ({
  // Initial State
  currentMode: null,
  difficulty: 'easy',
  
  roundConfig: null,
  currentRound: 1,
  totalRounds: 5,
  
  score: 0,
  streak: 0,
  maxStreak: 0,
  roundsCorrect: 0,
  
  showFeedback: false,
  isCorrect: false,
  feedbackMessage: '',
  isRoundComplete: false,
  
  showCelebration: false,
  celebrationType: null,
  
  gameStartTime: 0,
  roundStartTime: 0,

  // ============== GAME FLOW ACTIONS ==============

  startGame: (mode: GameMode, difficulty: DifficultyLevel) => {
    set({
      currentMode: mode,
      difficulty,
      currentRound: 1,
      score: 0,
      streak: 0,
      maxStreak: 0,
      roundsCorrect: 0,
      showFeedback: false,
      isRoundComplete: false,
      showCelebration: false,
      gameStartTime: Date.now(),
    });
    get().generateRound();
  },

  generateRound: () => {
    const { currentMode, difficulty } = get();
    if (!currentMode) return;
    
    const roundConfig = generateRoundConfig(currentMode, difficulty);
    
    set({
      roundConfig,
      roundStartTime: Date.now(),
      isRoundComplete: false,
      isCorrect: false,
      showFeedback: false,
    });
  },

  nextRound: () => {
    const { currentRound, totalRounds } = get();
    
    if (currentRound >= totalRounds) {
      set({ showCelebration: true, celebrationType: 'complete' });
      return;
    }
    
    set({ currentRound: currentRound + 1, showFeedback: false, isRoundComplete: false });
    get().generateRound();
  },

  tryAgain: () => {
    const { currentMode, roundConfig } = get();
    if (!roundConfig) return;
    
    // Reset round-specific state based on mode
    if (currentMode === 'exact-change') {
      set({
        roundConfig: {
          ...roundConfig,
          placedCoins: [],
          currentTotal: 0,
        } as ExactChangeRoundConfig,
        showFeedback: false,
        isCorrect: false,
      });
    } else if (currentMode === 'shop-and-pay') {
      set({
        roundConfig: {
          ...roundConfig,
          paidCoins: [],
          currentPaid: 0,
        } as ShopRoundConfig,
        showFeedback: false,
        isCorrect: false,
      });
    } else if (currentMode === 'money-counter') {
      set({
        roundConfig: {
          ...roundConfig,
          countedCoins: [],
        } as MoneyCounterRoundConfig,
        showFeedback: false,
        isCorrect: false,
      });
    } else {
      set({
        showFeedback: false,
        isCorrect: false,
      });
    }
  },

  skipRound: () => {
    const { currentRound, totalRounds } = get();
    
    if (currentRound >= totalRounds) {
      set({ showCelebration: true, celebrationType: 'complete' });
      return;
    }
    
    set({ currentRound: currentRound + 1, showFeedback: false, isRoundComplete: false });
    get().generateRound();
  },

  resetGame: () => {
    set({
      currentMode: null,
      roundConfig: null,
      currentRound: 1,
      score: 0,
      streak: 0,
      maxStreak: 0,
      roundsCorrect: 0,
      isRoundComplete: false,
      isCorrect: false,
      showFeedback: false,
      showCelebration: false,
    });
  },

  // ============== MODE-SPECIFIC ACTIONS ==============

  selectCurrency: (currency: Currency) => {
    const { roundConfig, streak } = get();
    if (!roundConfig || roundConfig.mode !== 'coin-collector') return;
    
    const config = roundConfig as CoinCollectorRoundConfig;
    const isCorrect = validateCoinCollector(currency, config.targetCurrency);
    
    if (isCorrect) {
      const newStreak = streak + 1;
      set({
        isRoundComplete: true,
        isCorrect: true,
        showFeedback: true,
        feedbackMessage: `🎉 Correct! That's the ${config.targetCurrency.label} ${config.targetCurrency.isNote ? 'note' : 'coin'}!`,
        streak: newStreak,
        maxStreak: Math.max(get().maxStreak, newStreak),
        score: get().score + 10 + newStreak * 2,
        roundsCorrect: get().roundsCorrect + 1,
        showCelebration: true,
        celebrationType: newStreak >= 3 ? 'streak' : 'correct',
      });
    } else {
      set({
        isCorrect: false,
        showFeedback: true,
        feedbackMessage: `❌ That's ${currency.label}. Look for ${config.targetCurrency.label}!`,
        streak: 0,
      });
    }
  },

  sortToPiggyBank: (currency: Currency, piggyValue: number) => {
    const { roundConfig, streak } = get();
    if (!roundConfig || roundConfig.mode !== 'piggy-bank-sort') return;
    
    const config = roundConfig as PiggyBankRoundConfig;
    const isCorrect = validatePiggyBankSort(currency, piggyValue);
    
    if (isCorrect) {
      const newSortedCount = config.sortedCount + 1;
      const remaining = config.currenciesToSort.filter(c => c.id !== currency.id);
      
      if (remaining.length === 0) {
        // All sorted - round complete
        const newStreak = streak + 1;
        set({
          roundConfig: {
            ...config,
            currenciesToSort: remaining,
            currentCurrency: null,
            sortedCount: newSortedCount,
          },
          isRoundComplete: true,
          isCorrect: true,
          showFeedback: true,
          feedbackMessage: `🎉 Amazing! You sorted all ${newSortedCount} coins correctly!`,
          streak: newStreak,
          maxStreak: Math.max(get().maxStreak, newStreak),
          score: get().score + 15 + newStreak * 2,
          roundsCorrect: get().roundsCorrect + 1,
          showCelebration: true,
          celebrationType: newStreak >= 3 ? 'streak' : 'correct',
        });
      } else {
        // Continue sorting
        set({
          roundConfig: {
            ...config,
            currenciesToSort: remaining,
            currentCurrency: remaining[0],
            sortedCount: newSortedCount,
          },
          score: get().score + 2,
        });
      }
    } else {
      set({
        isCorrect: false,
        showFeedback: true,
        feedbackMessage: `❌ That coin is worth ${currency.label}, not ₹${piggyValue}!`,
        streak: 0,
      });
    }
  },

  countCoin: (coinId: string) => {
    const { roundConfig } = get();
    if (!roundConfig || roundConfig.mode !== 'money-counter') return;
    
    const config = roundConfig as MoneyCounterRoundConfig;
    if (config.countedCoins.includes(coinId)) return;
    
    set({
      roundConfig: {
        ...config,
        countedCoins: [...config.countedCoins, coinId],
      },
    });
  },

  selectCounterAnswer: (answer: number) => {
    const { roundConfig, streak } = get();
    if (!roundConfig || roundConfig.mode !== 'money-counter') return;
    
    const config = roundConfig as MoneyCounterRoundConfig;
    const isCorrect = validateMoneyCounter(answer, config.totalValue);
    
    if (isCorrect) {
      const newStreak = streak + 1;
      set({
        isRoundComplete: true,
        isCorrect: true,
        showFeedback: true,
        feedbackMessage: `🎉 Perfect! The total is ₹${config.totalValue}!`,
        streak: newStreak,
        maxStreak: Math.max(get().maxStreak, newStreak),
        score: get().score + 10 + newStreak * 2,
        roundsCorrect: get().roundsCorrect + 1,
        showCelebration: true,
        celebrationType: newStreak >= 3 ? 'streak' : 'correct',
      });
    } else {
      set({
        isCorrect: false,
        showFeedback: true,
        feedbackMessage: `❌ Not quite! Count again carefully. The answer isn't ₹${answer}.`,
        streak: 0,
      });
    }
  },

  placeExactChangeCoin: (currency: Currency) => {
    const { roundConfig, streak } = get();
    if (!roundConfig || roundConfig.mode !== 'exact-change') return;
    
    const config = roundConfig as ExactChangeRoundConfig;
    const newPlacedCoins = [...config.placedCoins, currency];
    const newTotal = calculateTotal(newPlacedCoins);
    
    const validation = validateExactChange(newPlacedCoins, config.targetAmount);
    
    if (validation.isExact) {
      const newStreak = streak + 1;
      set({
        roundConfig: {
          ...config,
          placedCoins: newPlacedCoins,
          currentTotal: newTotal,
        },
        isRoundComplete: true,
        isCorrect: true,
        showFeedback: true,
        feedbackMessage: `🎉 Perfect! You made exactly ₹${config.targetAmount}!`,
        streak: newStreak,
        maxStreak: Math.max(get().maxStreak, newStreak),
        score: get().score + 10 + newStreak * 2,
        roundsCorrect: get().roundsCorrect + 1,
        showCelebration: true,
        celebrationType: newStreak >= 3 ? 'streak' : 'correct',
      });
    } else if (validation.isOver) {
      set({
        roundConfig: {
          ...config,
          placedCoins: newPlacedCoins,
          currentTotal: newTotal,
        },
        isCorrect: false,
        showFeedback: true,
        feedbackMessage: `❌ Too much! You have ₹${newTotal} but need ₹${config.targetAmount}. Remove some coins!`,
        streak: 0,
      });
    } else {
      set({
        roundConfig: {
          ...config,
          placedCoins: newPlacedCoins,
          currentTotal: newTotal,
        },
        showFeedback: false,
      });
    }
  },

  removeExactChangeCoin: (currencyId: string) => {
    const { roundConfig } = get();
    if (!roundConfig || roundConfig.mode !== 'exact-change') return;
    
    const config = roundConfig as ExactChangeRoundConfig;
    const newPlacedCoins = config.placedCoins.filter(c => c.id !== currencyId);
    const newTotal = calculateTotal(newPlacedCoins);
    
    set({
      roundConfig: {
        ...config,
        placedCoins: newPlacedCoins,
        currentTotal: newTotal,
      },
      showFeedback: false,
    });
  },

  selectBalanceAnswer: (answer: 'left' | 'right' | 'equal') => {
    const { roundConfig, streak } = get();
    if (!roundConfig || roundConfig.mode !== 'money-balance') return;
    
    const config = roundConfig as MoneyBalanceRoundConfig;
    const isCorrect = validateMoneyBalance(answer, config.leftTotal, config.rightTotal);
    
    if (isCorrect) {
      const newStreak = streak + 1;
      const answerText = answer === 'left' ? 'Left side' : answer === 'right' ? 'Right side' : 'Both sides are equal';
      set({
        isRoundComplete: true,
        isCorrect: true,
        showFeedback: true,
        feedbackMessage: `🎉 Correct! ${answerText}! (Left: ₹${config.leftTotal}, Right: ₹${config.rightTotal})`,
        streak: newStreak,
        maxStreak: Math.max(get().maxStreak, newStreak),
        score: get().score + 10 + newStreak * 2,
        roundsCorrect: get().roundsCorrect + 1,
        showCelebration: true,
        celebrationType: newStreak >= 3 ? 'streak' : 'correct',
      });
    } else {
      set({
        isCorrect: false,
        showFeedback: true,
        feedbackMessage: `❌ Not quite! Count the money on each side again.`,
        streak: 0,
      });
    }
  },

  payForItem: (currency: Currency) => {
    const { roundConfig, streak } = get();
    if (!roundConfig || roundConfig.mode !== 'shop-and-pay') return;
    
    const config = roundConfig as ShopRoundConfig;
    const newPaidCoins = [...config.paidCoins, currency];
    const newPaid = calculateTotal(newPaidCoins);
    
    const validation = validateShopPayment(newPaidCoins, config.targetItem.price);
    
    if (validation.isExact) {
      const newStreak = streak + 1;
      set({
        roundConfig: {
          ...config,
          paidCoins: newPaidCoins,
          currentPaid: newPaid,
        },
        isRoundComplete: true,
        isCorrect: true,
        showFeedback: true,
        feedbackMessage: `🎉 Perfect! You bought the ${config.targetItem.name} ${config.targetItem.emoji} for ₹${config.targetItem.price}!`,
        streak: newStreak,
        maxStreak: Math.max(get().maxStreak, newStreak),
        score: get().score + 10 + newStreak * 2,
        roundsCorrect: get().roundsCorrect + 1,
        showCelebration: true,
        celebrationType: newStreak >= 3 ? 'streak' : 'correct',
      });
    } else if (validation.isOver) {
      set({
        roundConfig: {
          ...config,
          paidCoins: newPaidCoins,
          currentPaid: newPaid,
        },
        isCorrect: false,
        showFeedback: true,
        feedbackMessage: `❌ Too much! The ${config.targetItem.name} costs ₹${config.targetItem.price}, but you paid ₹${newPaid}. Remove some!`,
        streak: 0,
      });
    } else {
      set({
        roundConfig: {
          ...config,
          paidCoins: newPaidCoins,
          currentPaid: newPaid,
        },
        showFeedback: false,
      });
    }
  },

  removePayment: (currencyId: string) => {
    const { roundConfig } = get();
    if (!roundConfig || roundConfig.mode !== 'shop-and-pay') return;
    
    const config = roundConfig as ShopRoundConfig;
    const newPaidCoins = config.paidCoins.filter(c => c.id !== currencyId);
    const newPaid = calculateTotal(newPaidCoins);
    
    set({
      roundConfig: {
        ...config,
        paidCoins: newPaidCoins,
        currentPaid: newPaid,
      },
      showFeedback: false,
    });
  },

  // ============== UTILITIES ==============

  getHintText: () => {
    const { currentMode, roundConfig, difficulty } = get();
    if (!currentMode || !roundConfig) return '';
    return getHint(currentMode, roundConfig, difficulty);
  },

  hideFeedback: () => {
    set({ showFeedback: false });
  },

  hideCelebration: () => {
    set({ showCelebration: false, celebrationType: null });
  },
}));
