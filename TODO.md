# Class 3 Games Implementation Plan - Complete

## Overview
Implement 10 EVS games and 10 Math games for Class 3, following the existing game architecture patterns.

## ✅ ALREADY IMPLEMENTED
- EVS Chapter 1: Life Sort Challenge (store + component)
- EVS Chapter 2: Plant Explorer (store + component)
- EVS Chapter 3: Animal Kingdom Game (store + component)
- EVS Chapter 4: Family Circle (store exists, component exists)

## 📋 GAMES TO CREATE

### EVS GAMES (Chapters 5-10) - 6 Games

#### Chapter 5: People Who Help Us
- [ ] Create store: `useHelperMatchStore.ts`
- [ ] Create component: `HelperMatch.tsx`
- [ ] Match helpers with tools and work, answer why helpers are important

#### Chapter 6: Transport
- [ ] Create store: `useTransportTrackStore.ts`
- [ ] Create component: `TransportTrack.tsx`
- [ ] Sort vehicles into land/water/air, choose fastest/slowest

#### Chapter 7: Road Safety
- [ ] Create store: `useSafetySignalStore.ts`
- [ ] Create component: `SafetySignal.tsx`
- [ ] Match traffic signs with meanings, answer safety rules

#### Chapter 8: Our Environment
- [ ] Create store: `useCleanGreenStore.ts`
- [ ] Create component: `CleanGreenMission.tsx`
- [ ] Choose clean vs dirty habits, name ways to protect nature

#### Chapter 9: Weather & Seasons
- [ ] Create store: `useSeasonWheelStore.ts`
- [ ] Create component: `SeasonWheel.tsx`
- [ ] Match seasons with clothes, food, and activities

#### Chapter 10: Water
- [ ] Create store: `useWaterSaverStore.ts`
- [ ] Create component: `WaterSaverGame.tsx`
- [ ] Identify uses of water, tick good and bad water habits

---

### MATH GAMES (Chapters 1-10) - 10 Games

#### Chapter 1: Numbers up to 1000
- [ ] Create store: `useNumberBuilderStore.ts`
- [ ] Create component: `NumberBuilder.tsx`
- [ ] Form largest/smallest 3-digit numbers, write place value

#### Chapter 2: Addition
- [ ] Create store: `useAddWinStore.ts`
- [ ] Create component: `AddAndWin.tsx`
- [ ] Solve addition sums using pictures and numbers

#### Chapter 3: Subtraction
- [ ] Create store: `useTakeAwayTrailStore.ts`
- [ ] Create component: `TakeAwayTrail.tsx`
- [ ] Subtract objects and numbers, check answers

#### Chapter 4: Multiplication
- [ ] Create store: `useGroupItStore.ts`
- [ ] Create component: `GroupIt.tsx`
- [ ] Make equal groups and write multiplication facts

#### Chapter 5: Division
- [ ] Create store: `useShareFairlyStore.ts`
- [ ] Create component: `ShareFairly.tsx`
- [ ] Divide items equally and find remainder if any

#### Chapter 6: Measurement
- [ ] Create store: `useMeasureMasterStore.ts`
- [ ] Create component: `MeasureMaster.tsx`
- [ ] Choose correct unit for length, weight, capacity

#### Chapter 7: Time
- [ ] Create store: `useClockRaceStore.ts`
- [ ] Create component: `ClockRace.tsx`
- [ ] Read clock time and match with activities

#### Chapter 8: Money
- [ ] Create store: `useMiniShopStore.ts`
- [ ] Create component: `MiniShop.tsx`
- [ ] Buy items, add cost, find balance

#### Chapter 9: Shapes
- [ ] Create store: `useShapeSpotterStore.ts`
- [ ] Create component: `ShapeSpotter.tsx`
- [ ] Identify shapes in classroom objects

#### Chapter 10: Patterns
- [ ] Create store: `usePatternPathStore.ts`
- [ ] Create component: `PatternPath.tsx`
- [ ] Complete number and shape patterns

---

## 🔧 GameSelector Integration
- [ ] Import all new game components
- [ ] Add all new games to the game selection menu
- [ ] Add proper navigation between games

---

## 📁 Store Pattern (follow existing pattern)
```typescript
interface GameState {
  currentChapter: number;
  currentLevel: number;
  questions: Question[];
  currentQuestionIndex: number;
  currentQuestion: Question | null;
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
```

## 🎮 Component Pattern
- Category/Chapter selection menu
- Question display with options
- Progress bar
- Feedback on answers
- Completion screen with stats
- Retry/continue options

## 📝 Question Types
- MCQ (Multiple choice)
- Fill in the blank
- Classification
- Matching
- True/False
- Sequence/Ordering

## 🎯 Difficulty Levels
- Level 1: Easy (10 questions)
- Level 2: Medium (10 questions)
- Level 3: Hard (10 questions)

## Total Files to Create: 36
- 16 Store files (useXXXStore.ts)
- 16 Component files (XXX.tsx)
- 1 Updated GameSelector.tsx
- 1 Updated TODO.md

