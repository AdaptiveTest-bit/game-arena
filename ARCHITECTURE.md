# Game Arena - Architecture & Implementation Guide

## 🏗️ System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser/Client                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐     ┌──────────────┐                      │
│  │ GameSelector │────▶│ RopeCutter   │                      │
│  │   (Menu)     │     │    Game      │                      │
│  └──────────────┘     └──────────────┘                      │
│        │                     │                               │
│        │                     ├─▶ RopeCutterCanvas (Konva)   │
│        │                     ├─▶ useGameStore (Zustand)     │
│        │                     └─▶ gameUtils (Telemetry)      │
│        │                                                      │
│        └─────────────▶ ┌──────────────┐                      │
│                        │ LiquidLab    │                      │
│                        │    Game      │                      │
│                        └──────────────┘                      │
│                              │                               │
│                              ├─▶ LiquidLabCanvas (Konva)    │
│                              ├─▶ useLiquidGameStore (Zustand)
│                              └─▶ gameUtils (Telemetry)      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
         │
         │ (Mock Submission)
         ▼
    console.log()
    📊 Telemetry JSON
```

### Component Hierarchy

```
app/
├── page.tsx (Home)
│   └── GameSelector
│       ├── RopeCutterGame (when selected)
│       │   ├── RopeCutterCanvas (Konva Stage)
│       │   │   ├── Layer
│       │   │   │   ├── Rope (Rect)
│       │   │   │   ├── Ruler (Lines + Text)
│       │   │   │   ├── Cuts (Lines + Circles)
│       │   │   │   └── Cursor (Scissors)
│       │   │   └── useGameStore (State)
│       │   └── UI Controls (Reset, Counter, etc.)
│       │
│       └── LiquidLabGame (when selected)
│           ├── LiquidLabCanvas (Konva Stage)
│           │   ├── Layer
│           │   │   ├── Beaker (Rect + Marks)
│           │   │   ├── Liquid (Animated Rect)
│           │   │   ├── TestTube (Rect + Marks)
│           │   │   └── Goal Line (Dashed Line)
│           │   └── useLiquidGameStore (State)
│           └── UI Controls (Pour Button, etc.)
```

## 🧩 Component Details

### 1. GameSelector (`app/components/GameSelector.tsx`)

**Purpose**: Main menu for selecting games
**State**: `currentGame` (home | rope-cutter | liquid-lab)
**Render Path**:
- `home` → Display game cards grid
- Other → Display selected game + back button

**Key Features**:
- Card-based UI with hover animations
- Each card shows concept, problem statement, and CTA
- Back button with consistent styling

### 2. RopeCutter Game (`app/components/games/RopeCutter.tsx`)

**Purpose**: Main game component for rope cutting
**Dependencies**:
- `useGameStore` (Zustand)
- `RopeCutterCanvas` (Konva)
- `gameUtils` (telemetry)

**State Management**:
```typescript
const {
  startGame,        // Initialize game
  makeCut,          // Record a cut attempt
  resetGame,        // Clear all cuts
  gameCompleted,    // Win condition
  correctCuts,      // Count of valid cuts
  requiredCuts,     // Goal (5 cuts)
  cuts,             // Array of all cuts
  getTelemetryLog   // Generate final report
} = useGameStore();
```

**Game Flow**:
1. Component mounts → `gameState = 'ready'`
2. First `useEffect` → Calls `startGame()`, sets `gameState = 'playing'`
3. User clicks canvas → `handleCut()` → `makeCut(location)`
4. Zustand store validates cut → Updates `correctCuts`
5. If `correctCuts === requiredCuts` → `gameState = 'completed'`
6. Submit telemetry → `console.log(getTelemetryLog())`

**UI Sections**:
- **Header**: Title + subtitle
- **Mission Brief**: Word problem card
- **Status Bar**: Correct cuts counter + Total cuts + Reset button
- **Canvas Area**: RopeCutterCanvas component
- **Instructions**: How to play
- **Completion Card**: Shows when game is won (accuracy %, try again button)
- **Hint Card**: Appears after 3+ incorrect cuts

### 3. RopeCutterCanvas (`app/components/games/RopeCutterCanvas.tsx`)

**Purpose**: Render interactive rope and cutting interface
**Props**:
- `width: number` (1000px)
- `height: number` (250px)
- `onCut: (location: number) => boolean`

**Canvas Layout**:
```
y=0   ┌─────────────────────────────────────────┐
      │ Background (light gray)                  │
y=80  │   ┌─────── ROPE (brown) ───────┐        │
      │   │ x=50 → x=950 (900px width) │        │
y=100 │   └─────────────────────────────┘        │
      │                                          │
y=150 │ ┌─────── RULER (tick marks) ───────┐   │
      │ └─────────────────────────────────┘   │
y=250 └─────────────────────────────────────────┘
```

**Constants**:
- `GRID_START_X = 50` (left edge of rope)
- `GRID_END_X = 950` (right edge of rope)
- `GRID_TOTAL_LENGTH = 15` (meters)
- `pixelsPerMeter = (950 - 50) / 15 ≈ 60` pixels/meter

**Coordinate Conversion**:
```typescript
// Pixel → Meters
meterPosition = (cursorX - GRID_START_X) / pixelsPerMeter

// Meters → Pixel
pixelX = GRID_START_X + meterPosition * pixelsPerMeter
```

**Rendered Elements**:
1. **Rope**: Brown gradient Rect
2. **Ruler**: 15 vertical tick marks + labels (0m, 1m, ..., 15m)
3. **Expected Cuts**: Faint dashed lines at 2.5, 5.0, 7.5, 10.0, 12.5m
4. **Actual Cuts**: Green (valid) or red (invalid) vertical lines
5. **Cursor**: Scissors emoji + crosshair on mousemove
6. **Fray Effect**: Red semi-transparent box on wrong cut (500ms animation)

### 4. useGameStore (`app/store/useGameStore.ts`)

**Zustand Store Pattern**:
```typescript
export const useGameStore = create<GameState>((set, get) => ({
  // Initial State
  cuts: [],
  gameCompleted: false,
  correctCuts: 0,

  // Actions
  startGame: () => set({ /* reset state */ }),
  makeCut: (location) => {
    const state = get();
    const isValid = state.isCorrectCut(location);
    const newCuts = [...state.cuts, { location, isValid, timestamp }];
    set({ cuts: newCuts, correctCuts: newCuts.filter(c => c.isValid).length });
    return isValid;
  },
  
  // Queries
  isCorrectCut: (location) => {
    return EXPECTED_POSITIONS.some(
      pos => Math.abs(location - pos) <= TOLERANCE
    );
  },
  
  // Telemetry
  getTelemetryLog: () => ({ /* structured JSON */ })
}));
```

**Key Methods**:
- `startGame()` - Reset state, record start time
- `makeCut(location)` - Validate & record cut
- `isCorrectCut(location)` - Check if within tolerance of expected position
- `resetGame()` - Clear all cuts
- `getTelemetryLog()` - Generate final report

### 5. LiquidLab Game (`app/components/games/LiquidLab.tsx`)

**Similar structure to RopeCutter but with:**

**State Management**:
```typescript
const {
  startPouring,       // Begin pour animation
  stopPouring,        // End pour, check win
  updateLiquidLevels, // Progress animation
  sourceLiters,       // Current beaker level
  targetLiters,       // Current test tube level
  targetVolume,       // Goal (1/3 L)
  isWinConditionMet, // Check if ±0.05L
} = useLiquidGameStore();
```

**Animation Loop**:
```typescript
useEffect(() => {
  const animate = () => {
    if (isPouring) {
      const deltaTime = now - lastTime;
      updateLiquidLevels(deltaTime);
    }
    requestAnimationFrame(animate);
  };
}, [isPouring, updateLiquidLevels]);
```

**Physics Simulation**:
- Flow rate: 0.1 L/s
- Liquid transferred per frame: `0.1 * (deltaTime / 1000)`
- Source volume decreases, target volume increases equally

### 6. LiquidLabCanvas (`app/components/games/LiquidLabCanvas.tsx`)

**Canvas Layout**:
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   BEAKER              [Arrow]          TEST TUBE        │
│  ┌──────┐                              ┌──────┐        │
│  │ Liq. │ ←──────── POURING ────────→ │ Liq. │        │
│  │ 5/6L │                              │ 1/3L │        │
│  │      │    6 Marks (1/6 each)   3 Marks (1/3 each) │
│  └──────┘                              └──────┘        │
│                                              ↑          │
│                                          GOAL LINE      │
│                                          (1/3 = 2/6)   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Container Dimensions**:
```typescript
SOURCE: x=100, y=80, width=120, height=200
TARGET: x=550, y=100, width=80, height=180
```

**Graduation Calculation**:
```typescript
// Source (sixths)
for i = 1 to 6:
  y = SOURCE_Y + SOURCE_HEIGHT - i * (SOURCE_HEIGHT / 6)
  mark at (x, y) labeled "i/6"

// Target (thirds)
for i = 1 to 3:
  y = TARGET_Y + TARGET_HEIGHT - i * (TARGET_HEIGHT / 3)
  mark at (x, y) labeled "i/3"
```

**Liquid Height Calculation**:
```typescript
sourceHeight = (sourceLiters / sourceCapacity) * SOURCE_HEIGHT
sourceLiquidY = SOURCE_Y + SOURCE_HEIGHT - sourceHeight

// Rect rendered from sourceLiquidY with height=sourceHeight
```

## 📊 Telemetry Structure

### Rope Cutter Telemetry

```json
{
  "student_id": "test_user_1",
  "game_id": "rope_cutter_01",
  "concept_tag": "mixed_fraction_division",
  "performance": {
    "is_correct": true,
    "accuracy_score": 0.95,
    "time_taken_ms": 45000,
    "error_type": null
  },
  "interaction_trace": [
    {
      "action": "cut",
      "location": 2.5,
      "timestamp": 1200,
      "is_valid": true
    },
    {
      "action": "cut",
      "location": 5.02,
      "timestamp": 2400,
      "is_valid": true
    },
    {
      "action": "cut",
      "location": 7.5,
      "timestamp": 3600,
      "is_valid": true
    }
  ]
}
```

### Liquid Lab Telemetry

```json
{
  "student_id": "test_user_1",
  "game_id": "liquid_lab_01",
  "concept_tag": "fraction_subtraction_unlike_denominators",
  "performance": {
    "is_correct": true,
    "accuracy_score": 0.98,
    "time_taken_ms": 23000,
    "target_volume": "0.3333",
    "actual_volume": 0.3355,
    "error": "0.0022"
  },
  "interaction_trace": [
    {
      "action": "pour",
      "duration_ms": 23000,
      "source_final": 0.5,
      "target_final": 0.3355
    }
  ]
}
```

### Error Type Classification

**Rope Cutter**:
- `null` - All cuts within tolerance
- `precision_error` - Cuts close to target but outside ±0.2m
  - Example: Cut at 2.35m when target is 2.5m
  - Indicates: Student understands concept, needs fine-tuning
- `conceptual_error` - Cuts appear random (not near any expected position)
  - Example: Cuts at 1.2m, 4.8m, 8.1m (no pattern)
  - Indicates: Student doesn't understand division/fractions

**Liquid Lab**:
- Similar logic applied to final volume vs. target

## 🔄 Data Flow Example: Cutting the Rope

### User Action Sequence

1. **User clicks canvas at pixel position 210**
   ```
   Click Event → handleCanvasClick()
   ```

2. **Convert pixel to meters**
   ```typescript
   meterPosition = (210 - 50) / 60 = 160 / 60 ≈ 2.67 meters
   ```

3. **Call Zustand action**
   ```typescript
   onCut(2.67) → makeCut(2.67)
   ```

4. **Zustand validates cut**
   ```typescript
   isCorrectCut(2.67):
     Check if |2.67 - 2.5| ≤ 0.2 → |0.17| ≤ 0.2 → TRUE ✓
   ```

5. **Store cut record**
   ```typescript
   newCut = {
     location: 2.67,
     timestamp: 1200,
     isValid: true
   }
   cuts = [...cuts, newCut]
   correctCuts = 1
   ```

6. **Return to component**
   ```typescript
   isValid = true
   ```

7. **Component renders update**
   ```typescript
   // Canvas re-renders with new cut
   // Shows GREEN vertical line at pixel 210
   // Counter updates: "1 / 5"
   ```

8. **Check win condition** (if correctCuts === 5)
   ```typescript
   gameCompleted = true
   setGameState('completed')
   getTelemetryLog() → console.log(JSON.stringify(...))
   ```

## 🎯 Design Patterns Used

### 1. Custom Hooks (Zustand)
- **Why**: Encapsulate game logic, make it reusable
- **Pattern**: Store = reducer + state machine
- **Benefit**: Can test logic without UI

### 2. Separation of Concerns
- **Store**: Pure game logic (no UI)
- **Canvas**: Rendering only (reads from store)
- **Component**: Orchestration + UI (controls flow)

### 3. Controlled Components
- Canvas click → Component handler → Zustand update
- Not: Canvas directly modifies global state

### 4. Immutable Updates
```typescript
// ✗ Avoid
cuts.push(newCut);

// ✓ Correct
const newCuts = [...cuts, newCut];
set({ cuts: newCuts });
```

### 5. Declarative Rendering
```typescript
// Render based on state
{gameState === 'completed' && <CompletionCard />}
{isPouring && <PouringStatus />}
```

## 🚀 Adding a New Game: Step-by-Step

### Step 1: Create Store (`app/store/useFractionPizzaStore.ts`)

```typescript
import { create } from 'zustand';

export const useFractionPizzaStore = create((set, get) => ({
  // State
  slicesEaten: 0,
  totalSlices: 8,
  gameCompleted: false,

  // Actions
  eatSlice: () => {
    const { slicesEaten, totalSlices } = get();
    if (slicesEaten < totalSlices) {
      set({ slicesEaten: slicesEaten + 1 });
    }
  },

  getTelemetryLog: () => ({
    student_id: 'test_user_1',
    game_id: 'fraction_pizza_01',
    concept_tag: 'fractions',
    performance: {
      is_correct: true,
      accuracy_score: 1.0,
    },
  }),
}));
```

### Step 2: Create Canvas (`app/components/games/FractionPizzaCanvas.tsx`)

```typescript
'use client';

import { Stage, Layer, Wedge } from 'react-konva';
import { useFractionPizzaStore } from '@/app/store/useFractionPizzaStore';

export default function FractionPizzaCanvas({ width, height, onSliceClick }) {
  const { slicesEaten, totalSlices } = useFractionPizzaStore();

  return (
    <Stage width={width} height={height}>
      <Layer>
        {/* Pizza slices */}
        {Array.from({ length: totalSlices }).map((_, i) => (
          <Wedge
            key={i}
            x={width / 2}
            y={height / 2}
            radius={100}
            angle={360 / totalSlices}
            rotation={(360 / totalSlices) * i}
            fill={i < slicesEaten ? '#666' : '#FF9800'}
            stroke="#333"
            strokeWidth={2}
            onClick={() => onSliceClick(i)}
          />
        ))}
      </Layer>
    </Stage>
  );
}
```

### Step 3: Create Component (`app/components/games/FractionPizza.tsx`)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useFractionPizzaStore } from '@/app/store/useFractionPizzaStore';
import FractionPizzaCanvas from './FractionPizzaCanvas';
import { submitTelemetry } from '@/app/utils/gameUtils';

export default function FractionPizzaGame() {
  const { eatSlice, gameCompleted, getTelemetryLog } = useFractionPizzaStore();
  const [gameState, setGameState] = useState('playing');

  useEffect(() => {
    if (gameCompleted) {
      setGameState('completed');
      submitTelemetry(getTelemetryLog());
    }
  }, [gameCompleted, getTelemetryLog]);

  return (
    <div>
      <h1>🍕 Fraction Pizza</h1>
      <FractionPizzaCanvas width={400} height={400} onSliceClick={eatSlice} />
      {gameState === 'completed' && <div>You won!</div>}
    </div>
  );
}
```

### Step 4: Register in GameSelector

```typescript
{currentGame === 'fraction-pizza' && <FractionPizzaGame />}

// Add card:
<div onClick={() => setCurrentGame('fraction-pizza')}>
  <h2>🍕 Fraction Pizza</h2>
  <p>Learn addition with like denominators</p>
  <button>Play Game →</button>
</div>
```

## 📚 Key Takeaways

1. **Every game needs**: Store + Canvas + Component
2. **State flows**: Component → Zustand → Canvas renders
3. **Telemetry captures**: Every action with timestamp
4. **Error types help**: Distinguish precision vs. conceptual mistakes
5. **Konva is powerful**: Handles complex canvas interactions smoothly
6. **React-spring makes**: Animations feel natural and responsive

---

**Next: Deploy to production or integrate with a real analytics backend!** 🚀
