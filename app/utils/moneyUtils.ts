// Coin Kingdom - Money Utilities
// CBSE Class 1 Mathematics - Chapter 7: Money

// ============== TYPE DEFINITIONS ==============

export type CurrencyType = 
  | 'coin_1' | 'coin_2' | 'coin_5' | 'coin_10'
  | 'note_10' | 'note_20' | 'note_50';

export type GameMode = 
  | 'coin-collector'    // Mode 1: Currency Recognition
  | 'piggy-bank-sort'   // Mode 2: Value Understanding
  | 'money-counter'     // Mode 3: Counting Money
  | 'exact-change'      // Mode 4: Making Amounts
  | 'money-balance'     // Mode 5: Comparing Amounts
  | 'shop-and-pay';     // Mode 6: Simple Transactions

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Currency {
  id: string;
  type: CurrencyType;
  value: number;
  emoji: string;
  color: string;
  isNote: boolean;
  label: string;
}

export interface ShopItem {
  id: string;
  name: string;
  emoji: string;
  price: number;
  category: 'toy' | 'fruit' | 'stationery' | 'food';
}

export interface PlacedCurrency extends Currency {
  x: number;
  y: number;
}

// ============== CURRENCY CONFIGURATION ==============

export const CURRENCY_CONFIG: Record<CurrencyType, Omit<Currency, 'id'>> = {
  coin_1:  { type: 'coin_1',  value: 1,  emoji: '🪙', color: '#C0C0C0', isNote: false, label: '₹1' },
  coin_2:  { type: 'coin_2',  value: 2,  emoji: '🪙', color: '#CD853F', isNote: false, label: '₹2' },
  coin_5:  { type: 'coin_5',  value: 5,  emoji: '🪙', color: '#CD7F32', isNote: false, label: '₹5' },
  coin_10: { type: 'coin_10', value: 10, emoji: '🪙', color: '#FFD700', isNote: false, label: '₹10' },
  note_10: { type: 'note_10', value: 10, emoji: '💵', color: '#FF8C00', isNote: true, label: '₹10' },
  note_20: { type: 'note_20', value: 20, emoji: '💵', color: '#228B22', isNote: true, label: '₹20' },
  note_50: { type: 'note_50', value: 50, emoji: '💵', color: '#4169E1', isNote: true, label: '₹50' },
};

// ============== SHOP ITEMS ==============

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'pencil', name: 'Pencil', emoji: '✏️', price: 5, category: 'stationery' },
  { id: 'eraser', name: 'Eraser', emoji: '🧽', price: 3, category: 'stationery' },
  { id: 'apple', name: 'Apple', emoji: '🍎', price: 10, category: 'fruit' },
  { id: 'banana', name: 'Banana', emoji: '🍌', price: 6, category: 'fruit' },
  { id: 'ball', name: 'Ball', emoji: '⚽', price: 20, category: 'toy' },
  { id: 'candy', name: 'Candy', emoji: '🍬', price: 2, category: 'food' },
  { id: 'notebook', name: 'Notebook', emoji: '📓', price: 15, category: 'stationery' },
  { id: 'orange', name: 'Orange', emoji: '🍊', price: 8, category: 'fruit' },
  { id: 'toy_car', name: 'Toy Car', emoji: '🚗', price: 25, category: 'toy' },
  { id: 'juice', name: 'Juice', emoji: '🧃', price: 12, category: 'food' },
  { id: 'ruler', name: 'Ruler', emoji: '📏', price: 7, category: 'stationery' },
  { id: 'grapes', name: 'Grapes', emoji: '🍇', price: 15, category: 'fruit' },
  { id: 'cookie', name: 'Cookie', emoji: '🍪', price: 4, category: 'food' },
  { id: 'doll', name: 'Doll', emoji: '🪆', price: 30, category: 'toy' },
  { id: 'crayon', name: 'Crayon', emoji: '🖍️', price: 8, category: 'stationery' },
];

// ============== UTILITY FUNCTIONS ==============

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getCurrencyValue(type: CurrencyType): number {
  return CURRENCY_CONFIG[type].value;
}

export function createCurrency(type: CurrencyType): Currency {
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...CURRENCY_CONFIG[type]
  };
}

export function calculateTotal(currencies: Currency[]): number {
  return currencies.reduce((sum, c) => sum + c.value, 0);
}

export function getAvailableCurrencies(difficulty: DifficultyLevel): CurrencyType[] {
  switch (difficulty) {
    case 'easy': return ['coin_1', 'coin_2', 'coin_5'];
    case 'medium': return ['coin_1', 'coin_2', 'coin_5', 'coin_10'];
    case 'hard': return ['coin_1', 'coin_2', 'coin_5', 'coin_10', 'note_10', 'note_20', 'note_50'];
  }
}

export function generateCoinSetForTotal(target: number, difficulty: DifficultyLevel): Currency[] {
  const availableTypes = getAvailableCurrencies(difficulty);
  const result: Currency[] = [];
  let remaining = target;
  
  // Sort by value descending, but add some randomness
  const sortedTypes = shuffleArray([...availableTypes])
    .sort((a, b) => getCurrencyValue(b) - getCurrencyValue(a));
  
  for (const type of sortedTypes) {
    const value = getCurrencyValue(type);
    while (remaining >= value && (result.length < 12 || remaining === value)) {
      if (Math.random() > 0.3 || remaining === value) {
        result.push(createCurrency(type));
        remaining -= value;
      } else {
        break;
      }
    }
  }
  
  // Fill remaining with smallest coins
  while (remaining > 0) {
    const validTypes = availableTypes.filter(t => getCurrencyValue(t) <= remaining);
    if (validTypes.length === 0) break;
    
    const smallestType = validTypes.sort((a, b) => getCurrencyValue(a) - getCurrencyValue(b))[0];
    result.push(createCurrency(smallestType));
    remaining -= getCurrencyValue(smallestType);
  }
  
  return shuffleArray(result);
}

export function generateRandomCoinSet(difficulty: DifficultyLevel, maxValue: number): Currency[] {
  const availableTypes = getAvailableCurrencies(difficulty);
  const result: Currency[] = [];
  let total = 0;
  const maxCoins = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 12;
  
  while (total < maxValue && result.length < maxCoins) {
    const type = randomChoice(availableTypes);
    const value = getCurrencyValue(type);
    if (total + value <= maxValue) {
      result.push(createCurrency(type));
      total += value;
    } else if (result.length >= 3) {
      break;
    }
  }
  
  return shuffleArray(result);
}

// ============== ROUND CONFIGURATION TYPES ==============

export interface CoinCollectorRoundConfig {
  mode: 'coin-collector';
  targetCurrency: Currency;
  conveyorItems: Currency[];
  timeLimit: number;
}

export interface PiggyBankRoundConfig {
  mode: 'piggy-bank-sort';
  piggyBankValues: number[];
  currenciesToSort: Currency[];
  currentCurrency: Currency | null;
  sortedCount: number;
}

export interface MoneyCounterRoundConfig {
  mode: 'money-counter';
  coins: Currency[];
  totalValue: number;
  options: number[];
  countedCoins: string[];
}

export interface ExactChangeRoundConfig {
  mode: 'exact-change';
  targetAmount: number;
  availableCoins: Currency[];
  placedCoins: Currency[];
  currentTotal: number;
}

export interface MoneyBalanceRoundConfig {
  mode: 'money-balance';
  leftSide: Currency[];
  rightSide: Currency[];
  leftTotal: number;
  rightTotal: number;
  correctAnswer: 'left' | 'right' | 'equal';
}

export interface ShopRoundConfig {
  mode: 'shop-and-pay';
  shopItems: ShopItem[];
  targetItem: ShopItem;
  availableMoney: Currency[];
  paidCoins: Currency[];
  currentPaid: number;
}

export type RoundConfig = 
  | CoinCollectorRoundConfig 
  | PiggyBankRoundConfig 
  | MoneyCounterRoundConfig
  | ExactChangeRoundConfig
  | MoneyBalanceRoundConfig
  | ShopRoundConfig;

// ============== ROUND GENERATION FUNCTIONS ==============

export function generateCoinCollectorRound(difficulty: DifficultyLevel): CoinCollectorRoundConfig {
  const availableTypes = getAvailableCurrencies(difficulty);
  const targetType = randomChoice(availableTypes);
  const targetCurrency = createCurrency(targetType);
  
  // Generate conveyor items with target and distractors
  const itemCount = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 7 : 10;
  const conveyorItems: Currency[] = [targetCurrency];
  
  // Add distractors
  const distractorTypes = availableTypes.filter(t => t !== targetType);
  for (let i = 1; i < itemCount; i++) {
    const type = randomChoice(distractorTypes);
    conveyorItems.push(createCurrency(type));
  }
  
  return {
    mode: 'coin-collector',
    targetCurrency,
    conveyorItems: shuffleArray(conveyorItems),
    timeLimit: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 7 : 5,
  };
}

export function generatePiggyBankRound(difficulty: DifficultyLevel): PiggyBankRoundConfig {
  const piggyBankValues = difficulty === 'easy' 
    ? [1, 2, 5] 
    : difficulty === 'medium' 
      ? [1, 2, 5, 10]
      : [5, 10, 20, 50];
  
  const itemCount = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 8 : 10;
  const currenciesToSort: Currency[] = [];
  
  for (let i = 0; i < itemCount; i++) {
    const value = randomChoice(piggyBankValues);
    const type = Object.keys(CURRENCY_CONFIG).find(
      k => CURRENCY_CONFIG[k as CurrencyType].value === value
    ) as CurrencyType;
    
    if (type) {
      currenciesToSort.push(createCurrency(type));
    }
  }
  
  return {
    mode: 'piggy-bank-sort',
    piggyBankValues,
    currenciesToSort: shuffleArray(currenciesToSort),
    currentCurrency: null,
    sortedCount: 0,
  };
}

export function generateMoneyCounterRound(difficulty: DifficultyLevel): MoneyCounterRoundConfig {
  const maxValue = difficulty === 'easy' ? 15 : difficulty === 'medium' ? 30 : 50;
  const coins = generateRandomCoinSet(difficulty, maxValue);
  const totalValue = calculateTotal(coins);
  
  // Generate wrong options
  const wrongOptions: number[] = [];
  const offsets = [-3, -2, -1, 1, 2, 3, 5, -5];
  
  for (const offset of shuffleArray(offsets)) {
    const wrongValue = totalValue + offset;
    if (wrongValue > 0 && wrongValue !== totalValue && !wrongOptions.includes(wrongValue)) {
      wrongOptions.push(wrongValue);
      if (wrongOptions.length >= 3) break;
    }
  }
  
  return {
    mode: 'money-counter',
    coins,
    totalValue,
    options: shuffleArray([totalValue, ...wrongOptions]),
    countedCoins: [],
  };
}

export function generateExactChangeRound(difficulty: DifficultyLevel): ExactChangeRoundConfig {
  const ranges = {
    easy: { min: 5, max: 12 },
    medium: { min: 10, max: 25 },
    hard: { min: 20, max: 50 },
  };
  
  const range = ranges[difficulty];
  const targetAmount = randomBetween(range.min, range.max);
  
  // Provide enough coins to make the amount multiple ways
  const availableTypes = getAvailableCurrencies(difficulty);
  const availableCoins: Currency[] = [];
  
  for (const type of availableTypes) {
    const value = getCurrencyValue(type);
    const count = Math.min(5, Math.ceil(targetAmount / value) + 2);
    for (let i = 0; i < count; i++) {
      availableCoins.push(createCurrency(type));
    }
  }
  
  return {
    mode: 'exact-change',
    targetAmount,
    availableCoins: shuffleArray(availableCoins),
    placedCoins: [],
    currentTotal: 0,
  };
}

export function generateMoneyBalanceRound(difficulty: DifficultyLevel): MoneyBalanceRoundConfig {
  const maxValue = difficulty === 'easy' ? 15 : difficulty === 'medium' ? 25 : 40;
  
  // Generate left side
  const leftSide = generateRandomCoinSet(difficulty, maxValue);
  const leftTotal = calculateTotal(leftSide);
  
  // Decide relationship
  const relationship = randomChoice(['more', 'less', 'equal'] as const);
  let rightTotal: number;
  
  if (relationship === 'equal') {
    rightTotal = leftTotal;
  } else if (relationship === 'more') {
    rightTotal = leftTotal + randomBetween(2, 8);
  } else {
    rightTotal = Math.max(1, leftTotal - randomBetween(2, 8));
  }
  
  const rightSide = generateCoinSetForTotal(rightTotal, difficulty);
  const actualRightTotal = calculateTotal(rightSide);
  
  return {
    mode: 'money-balance',
    leftSide,
    rightSide,
    leftTotal,
    rightTotal: actualRightTotal,
    correctAnswer: leftTotal > actualRightTotal ? 'left' : leftTotal < actualRightTotal ? 'right' : 'equal',
  };
}

export function generateShopRound(difficulty: DifficultyLevel): ShopRoundConfig {
  const priceRange = {
    easy: { min: 2, max: 10 },
    medium: { min: 5, max: 20 },
    hard: { min: 10, max: 30 },
  };
  
  const range = priceRange[difficulty];
  const eligibleItems = SHOP_ITEMS.filter(i => i.price >= range.min && i.price <= range.max);
  const shopItems = shuffleArray(eligibleItems).slice(0, 5);
  const targetItem = randomChoice(shopItems);
  
  // Give exact money to pay
  const availableMoney = generateCoinSetForTotal(targetItem.price + randomBetween(0, 5), difficulty);
  
  return {
    mode: 'shop-and-pay',
    shopItems,
    targetItem,
    availableMoney,
    paidCoins: [],
    currentPaid: 0,
  };
}

export function generateRoundConfig(mode: GameMode, difficulty: DifficultyLevel): RoundConfig {
  switch (mode) {
    case 'coin-collector': return generateCoinCollectorRound(difficulty);
    case 'piggy-bank-sort': return generatePiggyBankRound(difficulty);
    case 'money-counter': return generateMoneyCounterRound(difficulty);
    case 'exact-change': return generateExactChangeRound(difficulty);
    case 'money-balance': return generateMoneyBalanceRound(difficulty);
    case 'shop-and-pay': return generateShopRound(difficulty);
  }
}

// ============== VALIDATION FUNCTIONS ==============

export function validateCoinCollector(selected: Currency, target: Currency): boolean {
  return selected.type === target.type;
}

export function validatePiggyBankSort(currency: Currency, piggyValue: number): boolean {
  return currency.value === piggyValue;
}

export function validateMoneyCounter(selectedAnswer: number, actualTotal: number): boolean {
  return selectedAnswer === actualTotal;
}

export function validateExactChange(placedCurrencies: Currency[], targetAmount: number): {
  isExact: boolean;
  currentTotal: number;
  isOver: boolean;
} {
  const total = calculateTotal(placedCurrencies);
  return {
    isExact: total === targetAmount,
    currentTotal: total,
    isOver: total > targetAmount
  };
}

export function validateMoneyBalance(answer: 'left' | 'right' | 'equal', leftTotal: number, rightTotal: number): boolean {
  const correct = leftTotal > rightTotal ? 'left' : leftTotal < rightTotal ? 'right' : 'equal';
  return answer === correct;
}

export function validateShopPayment(paidCurrencies: Currency[], itemPrice: number): {
  isExact: boolean;
  paidAmount: number;
  isOver: boolean;
} {
  const paid = calculateTotal(paidCurrencies);
  return {
    isExact: paid === itemPrice,
    paidAmount: paid,
    isOver: paid > itemPrice
  };
}

// ============== HINT FUNCTIONS ==============

export function getHint(mode: GameMode, roundConfig: RoundConfig, difficulty: DifficultyLevel): string {
  switch (mode) {
    case 'coin-collector': {
      const config = roundConfig as CoinCollectorRoundConfig;
      const isNote = config.targetCurrency.isNote;
      return `Look for the ${isNote ? 'paper note' : 'round coin'} that says ${config.targetCurrency.label}`;
    }
    case 'piggy-bank-sort': {
      return `Check the number on the coin - it shows how many rupees it is worth!`;
    }
    case 'money-counter': {
      const config = roundConfig as MoneyCounterRoundConfig;
      if (config.coins.length > 0) {
        const firstCoin = config.coins[0];
        return `Start counting! Each ${firstCoin.label} coin is worth ₹${firstCoin.value}`;
      }
      return `Tap each coin to count it!`;
    }
    case 'exact-change': {
      const config = roundConfig as ExactChangeRoundConfig;
      const remaining = config.targetAmount - config.currentTotal;
      if (remaining > 0) {
        return `You need ₹${remaining} more to make ₹${config.targetAmount}`;
      } else if (remaining < 0) {
        return `Too much! Remove ₹${-remaining} to get exactly ₹${config.targetAmount}`;
      }
      return `Perfect! You have exactly ₹${config.targetAmount}`;
    }
    case 'money-balance': {
      return `Count the money on each side of the balance, then pick which side has more!`;
    }
    case 'shop-and-pay': {
      const config = roundConfig as ShopRoundConfig;
      const remaining = config.targetItem.price - config.currentPaid;
      if (remaining > 0) {
        return `The ${config.targetItem.name} costs ₹${config.targetItem.price}. You need ₹${remaining} more!`;
      }
      return `You've paid enough for the ${config.targetItem.name}!`;
    }
  }
}
