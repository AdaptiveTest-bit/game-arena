# 🎮 Quick Start Guide: Creating a New Game

## Overview

This guide shows you how to create a new educational game in the Game Arena platform in **5 simple steps**.

## Template Structure

Every game follows this pattern:

```
Store (Zustand)        ─────┐
                             ├─→ Canvas (Konva)
Component (React)      ─────┤
                             └─→ Telemetry (JSON)
```

## Step 1: Define Your Game Concept

Before coding, define:

- **Name**: e.g., "Fraction Pizza"
- **CBSE Concept**: e.g., "Fractions - Addition with Like Denominators"
- **Word Problem**: e.g., "If you eat 2/8 of pizza and your friend eats 3/8, how much is left?"
- **Mechanics**: What can the player do? (click, drag, hold, etc.)
- **Win Condition**: What counts as success?
- **Tolerance**: How much error is acceptable?

## Step 2: Create the Zustand Store

**File**: `app/store/useFractionPizzaStore.ts`

```typescript
import { create } from 'zustand';

export interface PizzaGameState {
  totalSlices: number;
  slicesEaten: number;
  gameStartTime: number;
  gameCompleted: boolean;

  // Actions
  startGame: () => void;
  eatSlice: (sliceIndex: number) => void;
  resetGame: () => void;
  getTelemetryLog: () => any;
}

export const useFractionPizzaStore = create<PizzaGameState>((set, get) => ({
  // Initial State
  totalSlices: 8,
  slicesEaten: 0,
  gameStartTime: 0,
  gameCompleted: false,

  // Game Logic
  startGame: () => {
    set({
      gameStartTime: Date.now(),
      slicesEaten: 0,
      gameCompleted: false,
    });
  },

  eatSlice: (sliceIndex: number) => {
    const state = get();
    if (state.slicesEaten < state.totalSlices) {
      const newSlicesEaten = state.slicesEaten + 1;
      
      // Check win condition (e.g., ate exactly 5 slices out of 8)
      const isWin = newSlicesEaten === 5;
      
      set({
        slicesEaten: newSlicesEaten,
        gameCompleted: isWin,
      });
    }
  },

  resetGame: () => {
    set({
      slicesEaten: 0,
      gameStartTime: 0,
      gameCompleted: false,
    });
  },

  getTelemetryLog: () => {
    const state = get();
    return {
      student_id: 'test_user_1',
      game_id: 'fraction_pizza_01',
      concept_tag: 'fractions_addition_like_denominators',
      performance: {
        is_correct: state.gameCompleted,
        accuracy_score: state.slicesEaten === 5 ? 1.0 : state.slicesEaten / 5,
        time_taken_ms: Date.now() - state.gameStartTime,
      },
      interaction_trace: [
        {
          action: 'slices_eaten',
          count: state.slicesEaten,
        },
      ],
    };
  },
}));
```

**Key Patterns**:
- Use `set()` to update state
- Use `get()` to read current state
- Always return immutable updates
- Telemetry should have: `game_id`, `concept_tag`, `performance`, `interaction_trace`

## Step 3: Create the Konva Canvas Component

**File**: `app/components/games/FractionPizzaCanvas.tsx`

```typescript
'use client';

import React from 'react';
import { Stage, Layer, Wedge, Text } from 'react-konva';
import { useFractionPizzaStore } from '@/app/store/useFractionPizzaStore';

interface FractionPizzaCanvasProps {
  width: number;
  height: number;
  onSliceClick: (sliceIndex: number) => void;
}

const FractionPizzaCanvas: React.FC<FractionPizzaCanvasProps> = ({
  width,
  height,
  onSliceClick,
}) => {
  const { totalSlices, slicesEaten } = useFractionPizzaStore();

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 120;
  const sliceAngle = 360 / totalSlices;

  return (
    <Stage width={width} height={height}>
      <Layer>
        {/* Background */}
        <Wedge x={0} y={0} width={width} height={height} fill="#f5f5f5" />

        {/* Pizza slices */}
        {Array.from({ length: totalSlices }).map((_, i) => (
          <React.Fragment key={i}>
            {/* Wedge (slice) */}
            <Wedge
              x={centerX}
              y={centerY}
              radius={radius}
              angle={sliceAngle}
              rotation={sliceAngle * i}
              fill={i < slicesEaten ? '#8B4513' : '#FFA500'}
              stroke="#333"
              strokeWidth={2}
              opacity={i < slicesEaten ? 0.5 : 1}
              onClick={() => onSliceClick(i)}
              onMouseEnter={(e) => {
                e.target.setAttr('opacity', 0.8);
              }}
              onMouseLeave={(e) => {
                e.target.setAttr('opacity', i < slicesEaten ? 0.5 : 1);
              }}
              cursor="pointer"
            />

            {/* Slice label */}
            {i === 0 && (
              <Text
                x={centerX - 15}
                y={centerY - radius + 20}
                text={`1/${totalSlices}`}
                fontSize={12}
                fill="#333"
              />
            )}
          </React.Fragment>
        ))}

        {/* Center circle (for visual effect) */}
        <Wedge
          x={centerX}
          y={centerY}
          radius={20}
          angle={360}
          rotation={0}
          fill="#fff"
          stroke="#333"
          strokeWidth={2}
        />

        {/* Counter */}
        <Text
          x={20}
          y={20}
          text={`Slices Eaten: ${slicesEaten}/${totalSlices}`}
          fontSize={16}
          fontStyle="bold"
          fill="#333"
        />
      </Layer>
    </Stage>
  );
};

export default FractionPizzaCanvas;
```

**Canvas Tips**:
- Use absolute positioning (x, y coordinates)
- Interactive elements need `onClick` and cursor feedback
- Group related elements with `<g>` or Fragment
- Text labels should be positioned near visual elements
- Use `opacity` changes for hover feedback

## Step 4: Create the Main Game Component

**File**: `app/components/games/FractionPizza.tsx`

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { useFractionPizzaStore } from '@/app/store/useFractionPizzaStore';
import { submitTelemetry } from '@/app/utils/gameUtils';
import FractionPizzaCanvas from './FractionPizzaCanvas';
import { RotateCcw, CheckCircle } from 'lucide-react';

const FractionPizzaGame: React.FC = () => {
  const {
    startGame,
    eatSlice,
    resetGame,
    gameCompleted,
    slicesEaten,
    totalSlices,
    getTelemetryLog,
  } = useFractionPizzaStore();

  const [gameState, setGameState] = useState<'ready' | 'playing' | 'completed'>('ready');

  // Initialize game
  useEffect(() => {
    if (gameState === 'ready') {
      startGame();
      setGameState('playing');
    }
  }, [gameState, startGame]);

  // Check for win condition
  useEffect(() => {
    if (gameCompleted) {
      setGameState('completed');
      const telemetryLog = getTelemetryLog();
      submitTelemetry(telemetryLog);
    }
  }, [gameCompleted, getTelemetryLog]);

  const handleSliceClick = (sliceIndex: number) => {
    eatSlice(sliceIndex);
  };

  const handleReset = () => {
    resetGame();
    setGameState('ready');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🍕 Fraction Pizza</h1>
          <p className="text-lg text-gray-600">Learn fraction addition by eating pizza!</p>
        </div>

        {/* Mission Brief */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4 border-orange-400">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">📋 Mission Brief</h2>
          <p className="text-gray-700 text-lg">
            The pizza is divided into <strong>{totalSlices} equal slices</strong>.
          </p>
          <p className="text-gray-600 mt-2">
            You eat 2/8 and your friend eats 3/8. Together you've eaten 5/8 of the pizza!
          </p>
          <p className="text-orange-600 font-semibold mt-3">
            💡 Click exactly 5 slices to complete the challenge.
          </p>
        </div>

        {/* Game Area */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {/* Counter */}
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 rounded-full p-4">
                <span className="text-3xl font-bold text-orange-600">{slicesEaten}</span>
                <p className="text-xs text-orange-600 font-semibold">/ {totalSlices}</p>
              </div>
              <p className="text-gray-700">
                <span className="font-semibold">Slices Eaten</span>
              </p>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <RotateCcw size={20} />
              Reset
            </button>
          </div>

          {/* Canvas */}
          <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
            <FractionPizzaCanvas
              width={500}
              height={500}
              onSliceClick={handleSliceClick}
            />
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-800">
              <strong>How to Play:</strong> Click on the pizza slices (shown in orange).
              Eaten slices turn brown. Click 5 slices to win!
            </p>
          </div>
        </div>

        {/* Completion Card */}
        {gameState === 'completed' && (
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-green-500">
            <div className="flex items-center gap-4 mb-6">
              <CheckCircle size={48} className="text-green-500" />
              <h2 className="text-3xl font-bold text-gray-800">🎉 Mission Complete!</h2>
            </div>

            <p className="text-gray-700 mb-6 text-center">
              Excellent! You've learned that 2/8 + 3/8 = 5/8. Great work!
            </p>

            <button
              onClick={handleReset}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FractionPizzaGame;
```

**Component Structure**:
- Import store, utils, canvas, and icons
- Use `useState` for game flow (ready → playing → completed)
- `useEffect` for initialization and win condition
- Render: Header + Mission Brief + Canvas + Instructions + Status
- Show completion card when `gameCompleted` is true

## Step 5: Register in GameSelector

**File**: `app/components/GameSelector.tsx`

Add to imports:
```typescript
import FractionPizzaGame from './games/FractionPizza';
```

Add to game routing:
```typescript
{currentGame === 'fraction-pizza' && <FractionPizzaGame />}
```

Add game card (in the grid):
```typescript
<div
  onClick={() => setCurrentGame('fraction-pizza')}
  className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all transform cursor-pointer"
>
  <div className="bg-gradient-to-r from-orange-400 to-yellow-500 p-8 text-white">
    <div className="text-6xl mb-4">🍕</div>
    <h2 className="text-2xl font-bold mb-2">Fraction Pizza</h2>
    <p className="text-sm opacity-90">Learn Fraction Addition</p>
  </div>

  <div className="p-6">
    <div className="mb-4">
      <h3 className="font-semibold text-gray-800 mb-2">📚 Concept:</h3>
      <p className="text-gray-600 text-sm">Fractions - Addition with Like Denominators</p>
    </div>

    <div className="mb-4">
      <h3 className="font-semibold text-gray-800 mb-2">🎯 Problem:</h3>
      <p className="text-gray-600 text-sm">
        "If you eat 2/8 of pizza and friend eats 3/8, how much eaten?"
      </p>
    </div>

    <div className="mb-6">
      <h3 className="font-semibold text-gray-800 mb-2">💡 Task:</h3>
      <p className="text-gray-600 text-sm">
        Click exactly 5 slices out of 8 to show 2/8 + 3/8 = 5/8.
      </p>
    </div>

    <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition-colors">
      Play Game →
    </button>
  </div>
</div>
```

## 🧪 Testing Your Game

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Navigate to game**: Open menu → Click "Fraction Pizza"

3. **Test gameplay**:
   - Click slices → Check counter updates
   - Click 5 slices → Check completion card appears
   - Click Reset → Check state resets

4. **Check telemetry**:
   - Open DevTools Console (F12)
   - Complete game
   - Look for: `📊 TELEMETRY LOG SUBMITTED:`
   - Verify JSON structure is correct

5. **Test errors**:
   - Click beyond expected actions
   - Check for console errors
   - Verify graceful failure handling

## 📋 Checklist Before Publishing

- [ ] Store handles all game states (ready, playing, completed)
- [ ] Canvas renders correctly at all states
- [ ] All click/interaction handlers work
- [ ] Telemetry captures meaningful data
- [ ] UI is responsive (works on mobile?)
- [ ] Instructions are clear
- [ ] Reset button works
- [ ] No console errors
- [ ] Build passes: `npm run build`

## 🎓 Common Patterns

### Pattern 1: Click-Based Game
```typescript
// Store
clicker: (targetId: number) => void

// Canvas
<Circle onClick={() => onClicker(id)} />

// Component
const handleClick = (id) => clicker(id);
<Canvas onElementClick={handleClick} />
```

### Pattern 2: Drag-Based Game
```typescript
// Canvas
<Rect
  draggable
  onDragEnd={(e) => onDrag(e.target.x(), e.target.y())}
/>
```

### Pattern 3: Timed Game
```typescript
// Store
time: number;
decreaseTime: () => void;

// Component
useEffect(() => {
  const timer = setInterval(() => decreaseTime(), 1000);
  return () => clearInterval(timer);
}, [decreaseTime]);
```

## 🚀 Next Steps

1. Create 2-3 simple games to understand the pattern
2. Read `ARCHITECTURE.md` for deeper understanding
3. Explore Konva docs for advanced canvas features
4. Experiment with different game mechanics
5. Add backend telemetry integration

---

**Happy Game Development! 🎮✨**
