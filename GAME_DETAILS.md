# 🎮 Game Arena - Complete Game Documentation

## Overview

Game Arena is a multi-game EdTech platform for CBSE Class 5 Math. Each game teaches one core concept through interactive, gamified experiences with detailed telemetry for educators.

---

## Game 1: 🪢 The Rope Cutter

### Concept
**Division of Mixed Fractions** - Understanding how many equal pieces result from dividing a whole by a fractional amount.

### Word Problem (CBSE)
> "A rope 15m long is cut into pieces of 2 1/2 m each. How many pieces?"

### Mathematical Concept
- **Division**: 15 ÷ 2.5 = 6 pieces
- **Cuts needed**: 5 (to create 6 pieces)
- **Student insight**: "To get 6 pieces from a rope, I need to make 5 cuts"

### Gameplay
1. **Visual**: Horizontal brown rope (15m) with ruler markings
2. **Interaction**: Click on rope at positions to make cuts
3. **Target**: 5 precise cuts at 2.5m intervals
4. **Tolerance**: ±0.2m (0.2m error margin)
5. **Feedback**: Green = correct cut, Red = incorrect cut

### Cut Positions (Descending order)
- Expected: 2.5m, 5.0m, 7.5m, 10.0m, 12.5m
- Visual cues: Faint dashed lines at each position

### Technical Implementation
- **Store**: `useGameStore` (Zustand)
- **Canvas**: `RopeCutterCanvas` (react-konva)
- **Component**: `RopeCutter.tsx`
- **Key files**: 3 files total

### Telemetry Output
```json
{
  "game_id": "rope_cutter_01",
  "concept_tag": "mixed_fraction_division",
  "performance": {
    "is_correct": true/false,
    "accuracy_score": 0.0-1.0,
    "time_taken_ms": number,
    "error_type": "precision_error" | "conceptual_error" | null
  },
  "interaction_trace": [
    {
      "action": "cut",
      "location": number,
      "timestamp": number,
      "is_valid": true/false
    }
  ]
}
```

### Win Condition
- All 5 cuts must be valid (within ±0.2m tolerance)
- Game automatically completes when 5th correct cut is made

### Educational Value
- **Bloom's Level**: Application (using division formula to solve)
- **Skill**: Estimation, precision, understanding division

---

## Game 2: 🧪 Liquid Lab

### Concept
**Subtraction of Fractions with Unlike Denominators** - Understanding equivalent fractions through volume measurement.

### Word Problem (CBSE)
> "The main beaker contains 5/6 Liters of chemical. Pour out exactly 1/3 Liter into the test tube."

### Mathematical Concept
- **Equivalent Fractions**: 1/3 L = 2/6 L
- **Subtraction**: 5/6 - 1/3 = 5/6 - 2/6 = 3/6 = 1/2 L remaining
- **Student insight**: "To measure 1/3L, I look for where 2 marks would be on the sixths ruler"

### Gameplay
1. **Visual**: Two containers (beaker + test tube) with graduated markings
2. **Interaction**: Hold button to pour liquid smoothly
3. **Challenge**: Release button when liquid reaches 1/3L mark
4. **Tolerance**: ±0.05L (50ml error margin)
5. **Physics**: Smooth animation at 0.1 L/s flow rate

### Container Markings
- **Beaker**: 6 marks (sixths: 1/6, 2/6, 3/6, 4/4, 5/6, 6/6)
- **Test Tube**: 3 marks (thirds: 1/3, 2/3, 3/3)
- **Goal**: Green dashed line at 1/3L (= 2/6L)

### Technical Implementation
- **Store**: `useLiquidGameStore` (Zustand)
- **Canvas**: `LiquidLabCanvas` (react-konva)
- **Component**: `LiquidLab.tsx`
- **Animation**: requestAnimationFrame with delta-time calculation
- **Key files**: 3 files total

### Telemetry Output
```json
{
  "game_id": "liquid_lab_01",
  "concept_tag": "fraction_subtraction_unlike_denominators",
  "performance": {
    "is_correct": true/false,
    "accuracy_score": 0.0-1.0,
    "time_taken_ms": number,
    "target_volume": "0.3333",
    "actual_volume": number,
    "error": number
  },
  "interaction_trace": [
    {
      "action": "pour",
      "duration_ms": number,
      "source_final": number,
      "target_final": number
    }
  ]
}
```

### Win Condition
- Pour between (1/3 - 0.05)L and (1/3 + 0.05)L
- Game automatically completes when button is released

### Educational Value
- **Bloom's Level**: Analysis (understanding why 1/3 = 2/6)
- **Skill**: Fine motor control, fraction equivalence, visual estimation

---

## Game 3: 🌉 The Fraction Bridge

### Concept
**Ordering & Comparison of Fractions** - Understanding which fractions are larger/smaller with same denominator.

### Word Problem (CBSE)
> "Arrange the following fractions in descending order to rebuild the bridge: 7/12, 5/12, 9/12, 1/12, 2/12."

### Mathematical Concept
- **Same Denominator Rule**: When denominators are equal, larger numerator = larger fraction
- **Descending Order**: 9/12 > 7/12 > 5/12 > 2/12 > 1/12
- **Student insight**: "With same denominator, I just compare the top numbers"

### Gameplay
1. **Visual**: Chasm/river with broken bridge, 5 draggable wooden planks
2. **Interaction**: Drag planks from pool into bridge zone
3. **Challenge**: Arrange in descending order (largest left → smallest right)
4. **Validation**: Click "Cross Bridge" button
5. **Feedback**: Success animation or bridge shake + collapse

### Plank Information
- **Planks**: 5 planks labeled 7/12, 5/12, 9/12, 1/12, 2/12
- **Correct Order**: 9/12 → 7/12 → 5/12 → 2/12 → 1/12
- **Visual**: Brown gradient with wood texture, grip handle

### Technical Implementation
- **Store**: `useFractionBridgeStore` (Zustand)
- **Drag & Drop**: @dnd-kit (library)
- **Components**: 
  - `FractionBridge.tsx` (main game)
  - `BridgeZone.tsx` (drop zone with DndContext)
  - `Plank.tsx` (draggable plank item)
- **Animations**: framer-motion for shake effect
- **Key files**: 4 files total

### Telemetry Output
```json
{
  "game_id": "fraction_bridge_01",
  "concept_tag": "fractions_ordering_comparison",
  "performance": {
    "is_correct": true/false,
    "accuracy_score": 0.0-1.0,
    "time_taken_ms": number,
    "error_type": "ordering_error" | "incomplete_bridge" | null,
    "planks_placed": number,
    "total_planks": number
  },
  "interaction_trace": [
    {
      "action": "bridge_validation",
      "final_order": [string],
      "is_correct": boolean,
      "correct_order": [string]
    }
  ]
}
```

### Win Condition
- All 5 planks must be placed in bridge zone
- Order must be strictly descending (9/12 → 7/12 → 5/12 → 2/12 → 1/12)
- User clicks "Cross Bridge" button to validate

### Educational Value
- **Bloom's Level**: Application (comparing and ordering fractions)
- **Skill**: Fraction comparison, ordering logic, drag-and-drop interaction

---

## Technology Stack

### Core
- **Next.js 14** (App Router)
- **React 19** (Latest hooks)
- **TypeScript** (Full type safety)

### State Management
- **Zustand** - Lightweight, efficient state store
- One store per game (independent of other games)

### Graphics & Animation
- **react-konva** - React wrapper for HTML5 Canvas
- **konva** - 2D rendering library
- **@react-spring/web** - Spring-based animations
- **framer-motion** - Keyframe animations (shake effect)

### Interaction
- **@dnd-kit/core** - Headless drag-and-drop library
- **@dnd-kit/sortable** - Sortable behavior
- **@dnd-kit/utilities** - Helper functions

### Styling
- **Tailwind CSS** - Utility-first CSS
- **lucide-react** - Icon library

---

## Architecture Overview

### Folder Structure
```
app/
├── components/
│   ├── GameSelector.tsx          # Menu/router
│   └── games/
│       ├── RopeCutter.tsx        # Game 1 - Main
│       ├── RopeCutterCanvas.tsx  # Game 1 - Canvas
│       ├── LiquidLab.tsx         # Game 2 - Main
│       ├── LiquidLabCanvas.tsx   # Game 2 - Canvas
│       ├── FractionBridge.tsx    # Game 3 - Main
│       ├── BridgeZone.tsx        # Game 3 - Drop Zone
│       └── Plank.tsx             # Game 3 - Plank Component
│
├── store/
│   ├── useGameStore.ts           # Game 1 - Store
│   ├── useLiquidGameStore.ts     # Game 2 - Store
│   └── useFractionBridgeStore.ts # Game 3 - Store
│
├── utils/
│   └── gameUtils.ts              # Shared (telemetry, helpers)
│
├── page.tsx                      # Home page
└── layout.tsx                    # Root layout
```

### Data Flow Pattern
```
User Interaction
    ↓
Component Handler
    ↓
Zustand Store (validate, update state)
    ↓
Component re-renders
    ↓
Canvas/UI reflects new state
    ↓
(On completion) Generate Telemetry
    ↓
submitTelemetry(log) → console.log()
```

---

## Telemetry & Assessment

### Stealth Assessment Principles
1. **No visible test** - Games feel like play
2. **Every action logged** - Timestamp, location, validity
3. **Error classification** - Precision vs. conceptual
4. **Complete trace** - Full interaction history captured

### Error Type Classification
- **`null`** - Student solved correctly
- **`precision_error`** - Close to correct but slightly off
  - Example: Cut at 2.35m instead of 2.5m
  - Indicates: Understands concept, needs fine-tuning
- **`conceptual_error`** - Incorrect or random attempts
  - Example: Cuts scattered throughout rope
  - Indicates: Doesn't understand concept yet
- **`ordering_error`** (Bridge only) - Wrong order
- **`incomplete_bridge`** (Bridge only) - Not all planks placed

### Sample Telemetry Analysis
```json
{
  "student_id": "test_user_1",
  "game_id": "rope_cutter_01",
  "concept_tag": "mixed_fraction_division",
  "performance": {
    "is_correct": false,
    "accuracy_score": 0.6,
    "time_taken_ms": 120000,
    "error_type": "precision_error"
  }
}

Interpretation:
→ Student understands division concept
→ Cut 3 out of 5 correctly
→ Errors were close but not precise (e.g., 2.4m instead of 2.5m)
→ Recommendation: Practice fine-grained estimation
```

---

## Running the Project

### Development
```bash
npm install         # Install dependencies
npm run dev         # Start dev server on port 3001
```

### Production Build
```bash
npm run build       # Build optimized version
npm start           # Start production server
```

### Access Points
- **Menu**: http://localhost:3001
- **Game 1**: Click "The Rope Cutter" → Load game
- **Game 2**: Click "Liquid Lab" → Load game
- **Game 3**: Click "The Fraction Bridge" → Load game

---

## Testing Checklist

### Rope Cutter
- [ ] Cuts snap to 2.5m marks (±0.2m tolerance)
- [ ] Wrong cuts show red flash animation
- [ ] Counter increments on correct cuts
- [ ] Game completes after 5 correct cuts
- [ ] Telemetry includes all cuts with timestamps
- [ ] Reset button clears all cuts and restarts

### Liquid Lab
- [ ] Liquid pours smoothly when button held
- [ ] Beaker shows 6 graduation marks
- [ ] Test tube shows 3 graduation marks
- [ ] Goal line appears at 1/3L
- [ ] Game completes when within ±0.05L
- [ ] Accuracy feedback displays during pour
- [ ] Telemetry captures pour duration and volumes

### Fraction Bridge
- [ ] Planks are draggable with visual feedback
- [ ] Planks can be reordered in drop zone
- [ ] "Cross Bridge" button disabled until all planks placed
- [ ] Correct order → Avatar crosses safely
- [ ] Incorrect order → Bridge shakes and resets
- [ ] Telemetry logs final order and correctness
- [ ] Reset button clears all planks

---

## Browser Support
- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Known Issues
- Konva warning about multiple instances (harmless)
- Touch drag-and-drop may need optimization on mobile

---

## Future Enhancements

### Planned Games
1. **Fraction Pizza** - Addition with like denominators
2. **Decimal Maze** - Place value and decimal understanding
3. **Ratio Builder** - Comparative fractions

### Features to Add
- Difficulty levels (Easy/Medium/Hard)
- Leaderboard tracking
- Multiplayer modes
- Backend telemetry integration
- Educator analytics dashboard
- Sound effects and background music
- Mobile-optimized drag-and-drop

### Infrastructure
- Real analytics database (PostgreSQL/MongoDB)
- Session management for students
- Teacher dashboard to view progress
- Export reports in CSV/PDF

---

## Development Guidelines

### Adding a New Game

1. **Create Zustand store** (`app/store/useNewGameStore.ts`)
   - Define game state interface
   - Initialize default values
   - Implement actions (start, validate, reset, telemetry)

2. **Create canvas component** (`app/components/games/NewGameCanvas.tsx`)
   - Use react-konva for rendering
   - Connect to store via hooks
   - Make interactive with event handlers

3. **Create main component** (`app/components/games/NewGame.tsx`)
   - Render UI controls, canvas, feedback
   - Manage game flow (ready → playing → completed)
   - Call submitTelemetry on completion

4. **Register in GameSelector** (`app/components/GameSelector.tsx`)
   - Import new game component
   - Add to GameType union
   - Add routing logic
   - Create game card in menu

5. **Test thoroughly**
   - Play through all win/fail scenarios
   - Check browser console for telemetry
   - Verify no errors in DevTools

---

## Deployment

### Vercel (Recommended)
```bash
# Connect GitHub repo to Vercel
# Auto-deploys on push to main branch
```

---

## Game 4: 🎨 The Angle Architect

### Concept
**Angles as Turns & Angle Classification** - Understanding angles through rotational movement and classifying angles by type (Acute, Right, Obtuse).

### Word Problem (CBSE)
> "You are a bridge builder in a futuristic city. Rotate the bridge to the correct angle to connect the floating platforms so citizens can cross."

### Mathematical Concepts
- **Angles as Turns**: Quarter turn = 90°, Half turn = 180°, Full turn = 360°
- **Angle Classification**:
  - **Acute**: 0° < angle < 90° (Blue)
  - **Right**: angle = 90° (Green)
  - **Obtuse**: 90° < angle < 180° (Orange)
- **Visual Estimation**: Estimating angles without a protractor
- **Precision**: Rotating to within ±5° tolerance

### Gameplay

#### Level 1: Direct Mode (Visible Target)
1. **Visual**: Rotating bridge with visible target platform
2. **Interaction**: Drag the golden handle to rotate the bridge
3. **Target**: Rotate to specific angle (45°, 90°, 135°, or 180°)
4. **Tolerance**: ±5° accuracy required
5. **Feedback**: Color-coded angle display (Acute/Right/Obtuse)

#### Level 2: Blind Mode (Hidden Target)
1. **Challenge**: Target angle not visible
2. **Interaction**: Same drag mechanic
3. **Difficulty**: Requires angle intuition and estimation
4. **Feedback**: Still shows current angle and classification

### Visual Elements

#### Canvas Components (Konva)
- **Pivot (Center Hub)**: Dark gray circle with blue center
- **Bridge Arm**: Blue rectangular beam extending from center (turns green on success)
- **Handle**: Golden circle at the tip of the bridge (draggable)
- **Target Platform**: Green circle with border (visible in Direct mode only)
- **Dashed Rotation Path**: Shows the path the handle traces
- **Dynamic Arc**: Colored wedge from 0° to current angle (color matches classification)
- **Angle Labels**: Real-time display of degrees and angle type
- **Grid Lines**: Faint lines on bridge for visual reference

#### UI Elements
- **Mission Brief**: Narrative context and learning goals
- **Level Selection**: Direct vs. Blind mode buttons
- **Info Cards**: Current angle, target angle, accuracy percentage
- **Performance Summary**: Final score and classification
- **Learning Panel**: Explanation of angle types with examples

### Technical Implementation

#### Store: `useAngleArchitectStore.ts`
```typescript
State:
- currentAngle: number (0-360°)
- targetAngle: number (0-360°)
- isRotating: boolean
- isDragging: boolean
- gameCompleted: boolean
- currentLevel: 'direct' | 'blind'
- showTarget: boolean

Actions:
- startGame(level): Initialize with random target
- setCurrentAngle(angle): Update angle with snapping
- startDrag() / stopDrag(): Handle drag lifecycle
- resetGame(): Reset all state

Getters:
- getAngleClassification(): Returns 'Acute' | 'Right' | 'Obtuse'
- getAngleClassificationColor(): Returns color code
- isWithinTolerance(): Check if angle matches target
- getAccuracy(): Returns 0.0-1.0 score
```

#### Canvas: `AngleArchitectCanvas.tsx`
```typescript
Props:
- width: number (800px)
- height: number (500px)
- onDragStart: () => void
- onDragEnd: () => void
- onRotate: (angle: number) => void

Features:
- Mouse-based rotation calculation using Math.atan2()
- Automatic angle snapping to nearest 5°
- Real-time canvas updates
- Visual guides (arcs, lines, target zone)
```

#### Component: `AngleArchitectGame.tsx`
```typescript
States:
- 'menu': Level selection
- 'playing': Active gameplay
- 'completed': Results and feedback

Flow:
1. User selects Direct or Blind mode
2. Game initializes with random target
3. User drags bridge handle to rotate
4. Angle updates in real-time with snapping
5. On release, check if within tolerance
6. If correct → Show success, unlock next level
7. If incorrect → Show accuracy and allow retry
```

### Telemetry Output

```json
{
  "student_id": "test_user_1",
  "game_id": "angle_architect_01",
  "concept_tag": "angles_and_rotation",
  "level": "direct" | "blind",
  "performance": {
    "is_correct": true/false,
    "accuracy_score": 0.0-1.0,
    "time_taken_ms": number,
    "target_angle": 90,
    "actual_angle": 88,
    "target_classification": "Right",
    "current_classification": "Acute",
    "error_degrees": 2
  },
  "interaction_trace": [
    {
      "action": "rotation_complete",
      "final_angle": 88,
      "target_angle": 90,
      "tolerance_met": true
    }
  ]
}
```

### Learning Objectives (Bloom's)

| Level | Objective | Bloom's |
|-------|-----------|---------|
| Level 1 | Identify and rotate to specific angles with visual reference | Application |
| Level 2 | Estimate angles without visual aid based on mental model | Application |
| All | Classify angles by type (Acute/Right/Obtuse) | Knowledge |
| All | Understand angles as rotational turns | Understanding |

### Error Classification

- **Precision Error** (Within ±5°): "The angle was close but not precise enough. Try adjusting."
- **Conceptual Error** (>±10°): "The angle is quite far from the target. Remember: 90° is a right angle (quarter turn)."
- **Success** (<±5°): "Perfect! Your bridge is aligned. Citizens are crossing safely!"

### Performance Metrics

| Metric | Formula | Interpretation |
|--------|---------|-----------------|
| **Accuracy** | `1.0 - (error / tolerance)` | 100% = exact, 0% = max error |
| **Speed** | `time_taken_ms` | Faster is better (with accuracy) |
| **Classification** | Correct type match | Did student classify the angle correctly? |

### Difficulty Progression

**Current Implementation**:
- Direct Mode: Easy (visible target)
- Blind Mode: Hard (no target)

**Future Enhancement Ideas**:
1. **Progressive Difficulty**: Start at 90°, then move to 45°, 135°, etc.
2. **Time Pressure**: Complete within 30 seconds
3. **Precision Challenges**: ±2° tolerance for "perfect" score
4. **Multi-Angle**: Rotate through multiple angles in sequence
5. **Fraction Integration**: Target angles like 22.5° (1/4 of 90°)

### Dependencies

```json
{
  "react-konva": "^18.8.0",
  "konva": "^9.2.0",
  "@react-spring/web": "^9.7.0",
  "zustand": "^4.4.0",
  "lucide-react": "^0.263.0",
  "tailwindcss": "^3.3.0"
}
```

### Files & Structure

```
Components:
├── AngleArchitectGame.tsx      (300 lines, main component)
├── AngleArchitectCanvas.tsx    (350 lines, Konva canvas)
└── Store:
    └── useAngleArchitectStore.ts (180 lines)

Total: ~830 lines of code
Complexity: Medium
```

### Testing Checklist

- [ ] **Rotation Mechanics**
  - [ ] Handle drags smoothly
  - [ ] Angle snaps to nearest 5°
  - [ ] Angle display updates in real-time
  
- [ ] **Level 1 (Direct)**
  - [ ] Target platform visible
  - [ ] Game completes when within ±5°
  - [ ] Bridge turns green on success
  
- [ ] **Level 2 (Blind)**
  - [ ] Target platform hidden
  - [ ] User can still estimate angle
  - [ ] Accuracy feedback provided
  
- [ ] **Telemetry**
  - [ ] JSON logs to console on completion
  - [ ] Error classification works
  - [ ] Accuracy score calculated correctly

### Browser Compatibility

- ✅ Chrome/Edge (100%+)
- ✅ Firefox (90%+)
- ✅ Safari (14%+)
- ⚠️ Mobile (Touch support, not optimized)

---

```
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
CMD ["npm", "start"]
```

---

## Support & Documentation

- **Architecture Deep Dive**: See `ARCHITECTURE.md`
- **Template for New Games**: See `GAME_TEMPLATE.md`
- **README**: Quick start & overview

---

**Last Updated**: December 26, 2025
**Version**: 1.0.0 (Vertical Slice Prototype)

---

**Questions?** Review the architecture docs or check console telemetry output when games complete! 🎮📚
