# 📚 Quick Reference - Game Arena Development

## 🚀 Quick Start (30 seconds)

```bash
npm install
npm run dev
# Open http://localhost:3001
```

## 🎮 Games at a Glance

| Game | Concept | Input | Store | Files |
|------|---------|-------|-------|-------|
| 🪢 Rope Cutter | Mixed Fractions Division | Click on rope | `useGameStore` | 3 |
| 🧪 Liquid Lab | Fraction Subtraction | Hold to pour | `useLiquidGameStore` | 3 |
| 🌉 Fraction Bridge | Fraction Ordering | Drag & drop | `useFractionBridgeStore` | 4 |
| 🎨 Angle Architect | Angles & Rotation | Drag handle | `useAngleArchitectStore` | 3 |

## 📁 File Location Cheat Sheet

### Stores (Game Logic)
```
app/store/
├── useGameStore.ts              # Rope Cutter logic
├── useLiquidGameStore.ts        # Liquid Lab logic
├── useFractionBridgeStore.ts    # Fraction Bridge logic
└── useAngleArchitectStore.ts    # Angle Architect logic
```

### Components (UI & Canvas)
```
app/components/games/
├── RopeCutter.tsx               # Rope Cutter main
├── RopeCutterCanvas.tsx         # Rope Cutter canvas
├── LiquidLab.tsx                # Liquid Lab main
├── LiquidLabCanvas.tsx          # Liquid Lab canvas
├── FractionBridge.tsx           # Bridge main
├── BridgeZone.tsx               # Bridge drop zone
├── Plank.tsx                    # Bridge plank item
├── AngleArchitectGame.tsx       # Angle Architect main
└── AngleArchitectCanvas.tsx     # Angle Architect canvas
```

### Utilities
```
app/utils/gameUtils.ts           # Shared helpers & telemetry
app/components/GameSelector.tsx  # Game menu/router
```

## 🔧 Common Code Patterns

### Access Store in Component
```typescript
const { state, action } = useGameStore();
```

### Render Canvas with Konva
```typescript
<Stage width={1000} height={250}>
  <Layer>
    <Rect x={50} y={100} width={900} height={20} fill="brown" />
  </Layer>
</Stage>
```

### Drag & Drop Setup
```typescript
<DndContext onDragEnd={handleDragEnd}>
  <SortableContext items={ids} strategy={horizontalListSortingStrategy}>
    {items.map(item => <Plank id={item.id} />)}
  </SortableContext>
</DndContext>
```

### Game Flow Control
```typescript
useEffect(() => {
  if (gameState === 'ready') {
    startGame();
    setGameState('playing');
  }
}, [gameState, startGame]);
```

### Telemetry Submission
```typescript
const telemetryLog = getTelemetryLog();
submitTelemetry(telemetryLog);
// Check browser console for JSON output
```

## 📊 Telemetry Structure

Every game returns:
```json
{
  "student_id": "test_user_1",
  "game_id": "game_name_01",
  "concept_tag": "concept_name",
  "performance": {
    "is_correct": boolean,
    "accuracy_score": 0.0-1.0,
    "time_taken_ms": number,
    "error_type": string | null
  },
  "interaction_trace": [
    { "action": "action_name", ... }
  ]
}
```

## 🧪 Testing Commands

```bash
npm run dev         # Start dev server
npm run build       # Build & check for errors
npm run lint        # Check code quality
```

## 📱 Common Props

### Canvas Components
```typescript
interface CanvasProps {
  width: number;
  height: number;
  onAction?: (data: any) => void;
}
```

### Game Components
```typescript
// All game components use:
// - useGameStore hooks
// - submitTelemetry for logging
// - useState for game flow
// - Canvas components for rendering
```

## 🎨 Color Palette

- **Rope Cutter**: Orange/Yellow (#D2691E rope)
- **Liquid Lab**: Purple/Pink (#8B5CF6 liquid)
- **Fraction Bridge**: Cyan/Blue (#06B6D4 background)

## ✅ Validation Patterns

### Rope Cutter (Precision)
```typescript
Math.abs(location - expected) <= tolerance
```

### Liquid Lab (Range)
```typescript
targetLiters >= (targetVolume - tolerance) &&
targetLiters <= (targetVolume + tolerance)
```

### Fraction Bridge (Order)
```typescript
currentOrder.every((id, idx) => id === correctOrder[idx].id)
```

## 🐛 Debugging Tips

1. **Check console for telemetry**: Game completion logs JSON
2. **DevTools Konva layer**: Inspect canvas elements
3. **React DevTools**: Check store state with hooks tab
4. **Network tab**: Monitor if telemetry calls are sent (mock for now)

## 📦 Dependencies Overview

| Package | Purpose | Usage |
|---------|---------|-------|
| zustand | State management | Game logic stores |
| react-konva | Canvas rendering | Visual components |
| @dnd-kit | Drag & drop | Fraction Bridge |
| framer-motion | Animations | Bridge shake effect |
| lucide-react | Icons | UI elements |
| tailwind | Styling | Layout & colors |

## 🚀 Performance Notes

- Zustand stores: ~1KB each
- Canvas renders at 60fps with Konva
- dnd-kit handles 5+ items smoothly
- Total bundle: ~150KB gzipped

## 💡 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Konva instance warning" | Normal in dev, harmless |
| Canvas not updating | Check store is connected via hook |
| Drag not working | Ensure DndContext wraps items |
| Button styling breaks | Check Tailwind classes applied |

## 📖 File Templates

### New Store Template
```typescript
export const useNewGameStore = create<GameState>((set, get) => ({
  // State
  // Actions
  // Telemetry
}));
```

### New Canvas Template
```typescript
'use client';
import { Stage, Layer } from 'react-konva';
import { useNewGameStore } from '@/app/store/useNewGameStore';

const NewGameCanvas: React.FC = () => {
  const { state } = useNewGameStore();
  
  return (
    <Stage width={800} height={400}>
      <Layer>{/* Content */}</Layer>
    </Stage>
  );
};
export default NewGameCanvas;
```

### New Component Template
```typescript
'use client';
import { useState, useEffect } from 'react';
import { useNewGameStore } from '@/app/store/useNewGameStore';
import { submitTelemetry } from '@/app/utils/gameUtils';
import NewGameCanvas from './NewGameCanvas';

const NewGame: React.FC = () => {
  const { startGame, getTelemetryLog } = useNewGameStore();
  const [gameState, setGameState] = useState('ready');

  useEffect(() => {
    if (gameState === 'ready') {
      startGame();
      setGameState('playing');
    }
  }, [gameState, startGame]);

  return (
    <div>
      {/* UI */}
      <NewGameCanvas />
    </div>
  );
};
export default NewGame;
```

## 🎯 Quick Wins for New Developers

1. **Add a game**: Copy template files, follow naming convention
2. **Modify tolerance**: Change `tolerance` in store
3. **Change colors**: Update Tailwind classes in components
4. **Add sound**: Import web audio, play on events
5. **Change target value**: Modify store constant

## 📞 Support Resources

- TypeScript docs: https://www.typescriptlang.org
- React docs: https://react.dev
- Zustand docs: https://github.com/pmndrs/zustand
- Konva docs: https://konvajs.org
- dnd-kit docs: https://docs.dndkit.com
- Tailwind docs: https://tailwindcss.com

---

**Happy Coding! 🚀**

*Last updated: Dec 26, 2025*
