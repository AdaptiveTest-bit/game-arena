# 🎮 Game Arena - Gamified EdTech Platform

A vertical slice prototype for a CBSE Class 5 Math learning platform featuring interactive, game-based learning modules built with Next.js 14, React Konva, and advanced state management.

## 📋 Overview

Game Arena is an experimental platform that transforms abstract mathematical concepts into engaging, interactive gameplay experiences. Students learn through **stealth assessment**—detailed telemetry logging captures every interaction, providing educators with precise insights into conceptual understanding and procedural accuracy.

### Current Games

#### 1. 🪢 **The Rope Cutter** - Division of Mixed Fractions
- **Concept**: Mixed Fractions Division (2 1/2 m)
- **Word Problem**: "A rope 15m long is cut into pieces of 2½m each. How many pieces?"
- **Gameplay**: Click on the rope at correct positions to create cuts
- **Challenge**: Make exactly 5 precise cuts at 2.5m intervals with ±0.2m tolerance
- **Learning**: Students internalize that 15 ÷ 2.5 = 6 pieces (making 5 cuts)

#### 2. 🧪 **Liquid Lab** - Fraction Subtraction with Unlike Denominators
- **Concept**: Subtraction of Fractions (1/6 and 1/3)
- **Word Problem**: "Pour exactly 1/3 Liter from a beaker containing 5/6 Liters"
- **Gameplay**: Hold button to pour liquid; release at the exact level
- **Challenge**: Calculate that 1/3 = 2/6 and pour precisely within tolerance
- **Learning**: Students understand equivalent fractions through real-time feedback

#### 3. 🌉 **The Fraction Bridge** - Ordering & Comparison
- **Concept**: Ordering and Comparing Fractions
- **Word Problem**: "Arrange 5 fraction planks in descending order to build a bridge across a chasm"
- **Gameplay**: Drag and drop planks to reorder them
- **Challenge**: Place all 5 planks in correct descending order (9/12 → 7/12 → 5/12 → 2/12 → 1/12)
- **Learning**: Students visually understand fraction comparison and ordering

#### 4. 🎨 **The Angle Architect** - Angles & Rotation
- **Concept**: Angles as Turns, Angle Classification (Acute/Right/Obtuse)
- **Word Problem**: "You are a bridge builder. Rotate the bridge to the correct angle to connect floating platforms."
- **Gameplay**: Drag the bridge handle to rotate it to target angle
- **Challenge**: Rotate bridge to target angle with ±5° tolerance in Direct or Blind mode
- **Learning**: Students develop visual angle estimation and understand acute (<90°), right (=90°), obtuse (>90°) angles

## 🛠 Tech Stack

### Framework & Language
- **Next.js 14** (App Router)
- **TypeScript** - Full type safety
- **React 19** - Latest hooks and features

### State Management
- **Zustand** - Lightweight, performant global state
- Separate stores for each game (`useGameStore`, `useLiquidGameStore`, `useFractionBridgeStore`, `useAngleArchitectStore`)

### Graphics & Animations
- **react-konva** - HTML5 Canvas wrapper for React
- **konva** - High-performance 2D context library
- **@react-spring/web** - Smooth spring animations
- Responsive canvas rendering with pixel-perfect interactions

### UI & Icons
- **Tailwind CSS** - Utility-first styling
- **lucide-react** - Beautiful, consistent iconography

### Drag & Drop
- **@dnd-kit** - Modern, accessible drag-and-drop for Game 3
  - `@dnd-kit/core` - Core drag-and-drop engine
  - `@dnd-kit/sortable` - Sortable lists and reordering
  - `@dnd-kit/utilities` - Helper functions

### Animation Libraries
- **framer-motion** - Smooth keyframe animations and effects

## 📁 Project Structure

```
game-arena/
├── app/
│   ├── page.tsx                 # Main home page (game selector)
│   ├── layout.tsx               # Root layout with metadata
│   ├── globals.css              # Global Tailwind styles
│   ├── components/
│   │   ├── GameSelector.tsx     # Menu to select games
│   │   └── games/
│   │       ├── RopeCutter.tsx
│   │       ├── RopeCutterCanvas.tsx
│   │       ├── LiquidLab.tsx
│   │       ├── LiquidLabCanvas.tsx
│   │       ├── FractionBridge.tsx
│   │       ├── BridgeZone.tsx
│   │       ├── Plank.tsx
│   │       ├── AngleArchitectGame.tsx
│   │       └── AngleArchitectCanvas.tsx
│   ├── store/
│   │   ├── useGameStore.ts
│   │   ├── useLiquidGameStore.ts
│   │   ├── useFractionBridgeStore.ts
│   │   └── useAngleArchitectStore.ts
│   └── utils/
│       └── gameUtils.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3001
```

## 🎮 Game Architecture

### Zustand Stores
Each game has its own store managing state, config, and telemetry:

```typescript
export const useGameStore = create<GameState>((set, get) => ({
  // Config
  totalLength: 15,
  targetPieceSize: 2.5,
  tolerance: 0.2,
  
  // State
  cuts: [],
  gameCompleted: false,
  correctCuts: 0,
  
  // Actions
  makeCut: (location: number) => boolean,
  getTelemetryLog: () => TelemetryLog,
}));
```

### Canvas with react-konva
Interactive 2D rendering using Konva layers:

```typescript
<Stage width={1000} height={250}>
  <Layer>
    <Rect x={50} y={100} width={900} height={20} fill="#D2691E" />
    {/* Rope, cuts, ruler, etc. */}
  </Layer>
</Stage>
```

## 📊 Telemetry & Stealth Assessment

Games generate detailed JSON logs on completion:

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
    }
  ]
}
```

### Error Classification
- **`null`** - Correct solution
- **`precision_error`** - Close but outside tolerance (fine-motor issue)
- **`conceptual_error`** - Random/incorrect (concept misunderstanding)

## 💡 Adding New Games

1. Create store: `app/store/useNewGameStore.ts`
2. Create canvas: `app/components/games/NewGameCanvas.tsx`
3. Create component: `app/components/games/NewGame.tsx`
4. Register in `GameSelector.tsx`

## 🧪 Testing Checklist

### Rope Cutter
- [ ] Cuts snap to 2.5m marks (±0.2m)
- [ ] Wrong cuts trigger red flash
- [ ] Game completes after 5 correct cuts
- [ ] Telemetry logs all interactions

### Liquid Lab
- [ ] Liquid pours smoothly
- [ ] Beaker shows sixths (1/6 to 6/6)
- [ ] Test tube shows thirds (1/3 to 3/3)
- [ ] Game completes when within ±0.05L

### Fraction Bridge
- [ ] Planks are draggable from available pool
- [ ] Multiple planks can be dropped into bridge zone
- [ ] Planks can be reordered within bridge zone
- [ ] Game completes when planks in correct order
- [ ] Bridge shakes on incorrect order

### Angle Architect
- [ ] Bridge rotates smoothly when dragging handle
- [ ] Angle snaps to nearest 5°
- [ ] Current angle displays in real-time
- [ ] Target platform visible in Direct mode only
- [ ] Game completes within ±5° tolerance
- [ ] Accuracy score updates dynamically
- [ ] Both Direct and Blind level modes work

## 🎯 Design Principles

1. **Concept Clarity** - One core concept per game
2. **Progressive Difficulty** - Precision challenges increase engagement
3. **Immediate Feedback** - Visual indicators in real-time
4. **Stealth Assessment** - Every action logged with timestamp
5. **Engagement** - Smooth animations and satisfying interactions

## 📈 Educational Outcomes

### Rope Cutter
- Concept: Mixed fractions, division
- Bloom's Level: Application

### Liquid Lab
- Concept: Equivalent fractions, subtraction
- Bloom's Level: Analysis

### Fraction Bridge
- Concept: Fraction comparison and ordering
- Bloom's Level: Analysis

### Angle Architect
- Concept: Angles as turns, angle classification, visual estimation
- Bloom's Level: Application

## 🚀 Future Enhancements

- Difficulty levels (Easy/Medium/Hard)
- Multiplayer modes
- More games (Fraction Pizza, Decimal Maze, etc.)
- Backend telemetry integration
- Educator analytics dashboard
- Audio/SFX
- Mobile optimization

---

**Happy Learning! 🎮📚**
