import { create } from 'zustand';

// Shape types found in cities
type ShapeType = 'circle' | 'square' | 'rectangle' | 'triangle' | 'semicircle' | 'pentagon' | 'hexagon';

// Building/object types for the city
type CityObjectType = 'building' | 'window' | 'door' | 'wheel' | 'sign' | 'clock' | 'roof' | 'tree' | 'car' | 'bus';

interface HiddenShape {
  id: string;
  shape: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  found: boolean;
  objectType: CityObjectType;
}

interface ShapeDetectorChallenge {
  scene: 'street' | 'park' | 'downtown' | 'neighborhood';
  targetShape: ShapeType;
  hiddenShapes: HiddenShape[];
  totalToFind: number;
  foundCount: number;
}

interface GroupItem {
  id: string;
  x: number;
  y: number;
  grouped: boolean;
  groupId: number | null;
}

interface GroupCounterChallenge {
  itemType: 'windows' | 'wheels' | 'trees' | 'people' | 'birds' | 'flowers';
  items: GroupItem[];
  groupSize: number;
  totalItems: number;
  correctGroups: number;
  correctRemainder: number;
  userGroups: number;
  userRemainder: number;
  answered: boolean;
}

interface PatternSlot {
  id: string;
  shape: ShapeType | null;
  isBlank: boolean;
  correctShape: ShapeType;
}

interface PatternBuilderChallenge {
  pattern: PatternSlot[];
  availableShapes: ShapeType[];
  selectedShape: ShapeType | null;
  completedSlots: number;
  totalBlankSlots: number;
}

interface BuildingBlock {
  id: string;
  shape: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  placed: boolean;
  color: string;
}

interface BuildingSlot {
  id: string;
  requiredShape: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  filled: boolean;
}

interface CityConstructorChallenge {
  buildingName: string;
  blocks: BuildingBlock[];
  slots: BuildingSlot[];
  placedBlocks: number;
  totalSlots: number;
}

type Phase = 'shape-detector' | 'group-counter' | 'pattern-builder' | 'city-constructor';

interface ShapeCityState {
  // Game state
  phase: Phase;
  score: number;
  totalScore: number;
  streak: number;
  level: number;
  showInstructions: boolean;
  showSuccess: boolean;
  showHint: boolean;
  hintMessage: string;
  hintsUsed: number;
  
  // Phase-specific challenges
  detectorChallenge: ShapeDetectorChallenge | null;
  counterChallenge: GroupCounterChallenge | null;
  patternChallenge: PatternBuilderChallenge | null;
  constructorChallenge: CityConstructorChallenge | null;
  
  // Actions
  setPhase: (phase: Phase) => void;
  initializePhase: (phase: Phase) => void;
  
  // Shape Detector actions
  findShape: (shapeId: string) => void;
  
  // Group Counter actions
  selectGroupSize: (groups: number, remainder: number) => void;
  
  // Pattern Builder actions
  selectPatternShape: (shape: ShapeType) => void;
  placePatternShape: (slotId: string) => void;
  
  // City Constructor actions
  selectBlock: (blockId: string) => void;
  placeBlock: (slotId: string) => void;
  
  // General actions
  showHintMessage: () => void;
  hideHint: () => void;
  nextChallenge: () => void;
  resetGame: () => void;
  dismissInstructions: () => void;
  dismissSuccess: () => void;
}

const SHAPES: ShapeType[] = ['circle', 'square', 'rectangle', 'triangle', 'semicircle', 'pentagon', 'hexagon'];

const SCENES: Array<'street' | 'park' | 'downtown' | 'neighborhood'> = ['street', 'park', 'downtown', 'neighborhood'];

const CITY_OBJECTS: CityObjectType[] = ['building', 'window', 'door', 'wheel', 'sign', 'clock', 'roof', 'tree', 'car', 'bus'];

const ITEM_TYPES: Array<'windows' | 'wheels' | 'trees' | 'people' | 'birds' | 'flowers'> = 
  ['windows', 'wheels', 'trees', 'people', 'birds', 'flowers'];

const BUILDING_NAMES = ['Town Hall', 'Library', 'School', 'Fire Station', 'Hospital', 'Museum'];

const SHAPE_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];

function generateDetectorChallenge(level: number): ShapeDetectorChallenge {
  const scene = SCENES[Math.floor(Math.random() * SCENES.length)];
  const targetShape = SHAPES[Math.floor(Math.random() * Math.min(3 + level, SHAPES.length))];
  const totalToFind = Math.min(3 + Math.floor(level / 2), 6);
  
  const hiddenShapes: HiddenShape[] = [];
  
  // Generate target shapes to find
  for (let i = 0; i < totalToFind; i++) {
    hiddenShapes.push({
      id: `target-${i}`,
      shape: targetShape,
      x: 80 + Math.random() * 400,
      y: 80 + Math.random() * 250,
      width: 40 + Math.random() * 30,
      height: 40 + Math.random() * 30,
      rotation: Math.random() * 360,
      found: false,
      objectType: CITY_OBJECTS[Math.floor(Math.random() * CITY_OBJECTS.length)]
    });
  }
  
  // Add some decoy shapes
  const decoyCount = 3 + level;
  for (let i = 0; i < decoyCount; i++) {
    let decoyShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    while (decoyShape === targetShape) {
      decoyShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    }
    hiddenShapes.push({
      id: `decoy-${i}`,
      shape: decoyShape,
      x: 80 + Math.random() * 400,
      y: 80 + Math.random() * 250,
      width: 40 + Math.random() * 30,
      height: 40 + Math.random() * 30,
      rotation: Math.random() * 360,
      found: false,
      objectType: CITY_OBJECTS[Math.floor(Math.random() * CITY_OBJECTS.length)]
    });
  }
  
  return {
    scene,
    targetShape,
    hiddenShapes,
    totalToFind,
    foundCount: 0
  };
}

function generateCounterChallenge(level: number): GroupCounterChallenge {
  const itemType = ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)];
  const groupSize = [2, 3, 4, 5, 10][Math.floor(Math.random() * Math.min(2 + level, 5))];
  const numGroups = 2 + Math.floor(Math.random() * 3);
  const remainder = Math.floor(Math.random() * groupSize);
  const totalItems = numGroups * groupSize + remainder;
  
  const items: GroupItem[] = [];
  for (let i = 0; i < totalItems; i++) {
    items.push({
      id: `item-${i}`,
      x: 50 + (i % 8) * 65,
      y: 120 + Math.floor(i / 8) * 70,
      grouped: false,
      groupId: null
    });
  }
  
  return {
    itemType,
    items,
    groupSize,
    totalItems,
    correctGroups: numGroups,
    correctRemainder: remainder,
    userGroups: 0,
    userRemainder: 0,
    answered: false
  };
}

function generatePatternChallenge(level: number): PatternBuilderChallenge {
  const patternLength = 8 + level * 2;
  const uniqueShapes = Math.min(2 + Math.floor(level / 2), 4);
  const patternBase: ShapeType[] = [];
  
  for (let i = 0; i < uniqueShapes; i++) {
    patternBase.push(SHAPES[i]);
  }
  
  const pattern: PatternSlot[] = [];
  const blankIndices = new Set<number>();
  const numBlanks = Math.min(2 + Math.floor(level / 2), 4);
  
  while (blankIndices.size < numBlanks) {
    blankIndices.add(Math.floor(Math.random() * patternLength));
  }
  
  for (let i = 0; i < patternLength; i++) {
    const correctShape = patternBase[i % patternBase.length];
    pattern.push({
      id: `slot-${i}`,
      shape: blankIndices.has(i) ? null : correctShape,
      isBlank: blankIndices.has(i),
      correctShape
    });
  }
  
  return {
    pattern,
    availableShapes: patternBase,
    selectedShape: null,
    completedSlots: 0,
    totalBlankSlots: numBlanks
  };
}

function generateConstructorChallenge(level: number): CityConstructorChallenge {
  const buildingName = BUILDING_NAMES[Math.floor(Math.random() * BUILDING_NAMES.length)];
  const numSlots = 4 + Math.min(level, 4);
  
  const slots: BuildingSlot[] = [];
  const blocks: BuildingBlock[] = [];
  
  // Create building slots in a structured layout
  const baseY = 300;
  const startX = 150;
  
  for (let i = 0; i < numSlots; i++) {
    const shape = SHAPES[Math.floor(Math.random() * Math.min(4 + level, SHAPES.length))];
    const row = Math.floor(i / 3);
    const col = i % 3;
    
    slots.push({
      id: `slot-${i}`,
      requiredShape: shape,
      x: startX + col * 100,
      y: baseY - row * 80,
      width: 70,
      height: 60,
      filled: false
    });
    
    // Create matching block
    blocks.push({
      id: `block-${i}`,
      shape,
      x: 50 + (i % 4) * 70,
      y: 380 + Math.floor(i / 4) * 70,
      width: 50,
      height: 50,
      placed: false,
      color: SHAPE_COLORS[i % SHAPE_COLORS.length]
    });
  }
  
  // Shuffle blocks
  for (let i = blocks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tempX = blocks[i].x;
    const tempY = blocks[i].y;
    blocks[i].x = blocks[j].x;
    blocks[i].y = blocks[j].y;
    blocks[j].x = tempX;
    blocks[j].y = tempY;
  }
  
  return {
    buildingName,
    blocks,
    slots,
    placedBlocks: 0,
    totalSlots: numSlots
  };
}

function getHintForPhase(phase: Phase, state: ShapeCityState): string {
  switch (phase) {
    case 'shape-detector':
      if (state.detectorChallenge) {
        const target = state.detectorChallenge.targetShape;
        const remaining = state.detectorChallenge.totalToFind - state.detectorChallenge.foundCount;
        return `Look for ${remaining} more ${target}s! They might be hiding in windows, wheels, or signs.`;
      }
      return 'Tap on shapes that match the target!';
    case 'group-counter':
      if (state.counterChallenge) {
        return `Try grouping the ${state.counterChallenge.itemType} in sets of ${state.counterChallenge.groupSize}. Count how many complete groups you can make!`;
      }
      return 'Count items by making equal groups!';
    case 'pattern-builder':
      return 'Look at the pattern carefully. What shape comes next? Select a shape, then tap the empty slot.';
    case 'city-constructor':
      return 'Match each block to its outline. Tap a block, then tap where it should go!';
    default:
      return 'Keep going! You\'re doing great!';
  }
}

export const useShapeCityStore = create<ShapeCityState>((set, get) => ({
  phase: 'shape-detector',
  score: 0,
  totalScore: 0,
  streak: 0,
  level: 1,
  showInstructions: true,
  showSuccess: false,
  showHint: false,
  hintMessage: '',
  hintsUsed: 0,
  
  // Initialize detector challenge immediately to avoid loading state
  detectorChallenge: generateDetectorChallenge(1),
  counterChallenge: null,
  patternChallenge: null,
  constructorChallenge: null,
  
  setPhase: (phase) => {
    set({ phase, showInstructions: true });
    get().initializePhase(phase);
  },
  
  initializePhase: (phase) => {
    const { level } = get();
    switch (phase) {
      case 'shape-detector':
        set({ detectorChallenge: generateDetectorChallenge(level) });
        break;
      case 'group-counter':
        set({ counterChallenge: generateCounterChallenge(level) });
        break;
      case 'pattern-builder':
        set({ patternChallenge: generatePatternChallenge(level) });
        break;
      case 'city-constructor':
        set({ constructorChallenge: generateConstructorChallenge(level) });
        break;
    }
  },
  
  findShape: (shapeId) => {
    const { detectorChallenge } = get();
    if (!detectorChallenge) return;
    
    const shape = detectorChallenge.hiddenShapes.find(s => s.id === shapeId);
    if (!shape || shape.found) return;
    
    const isTarget = shapeId.startsWith('target-');
    
    if (isTarget) {
      const updatedShapes = detectorChallenge.hiddenShapes.map(s =>
        s.id === shapeId ? { ...s, found: true } : s
      );
      const newFoundCount = detectorChallenge.foundCount + 1;
      
      set({
        detectorChallenge: {
          ...detectorChallenge,
          hiddenShapes: updatedShapes,
          foundCount: newFoundCount
        },
        score: get().score + 10,
        streak: get().streak + 1
      });
      
      if (newFoundCount >= detectorChallenge.totalToFind) {
        set({ showSuccess: true, totalScore: get().totalScore + get().score });
      }
    } else {
      // Wrong shape clicked
      set({ streak: 0 });
    }
  },
  
  selectGroupSize: (groups, remainder) => {
    const { counterChallenge } = get();
    if (!counterChallenge || counterChallenge.answered) return;
    
    const isCorrect = groups === counterChallenge.correctGroups && 
                      remainder === counterChallenge.correctRemainder;
    
    set({
      counterChallenge: {
        ...counterChallenge,
        userGroups: groups,
        userRemainder: remainder,
        answered: true
      }
    });
    
    if (isCorrect) {
      set({
        score: get().score + 20,
        streak: get().streak + 1,
        showSuccess: true,
        totalScore: get().totalScore + get().score + 20
      });
    } else {
      set({ streak: 0 });
    }
  },
  
  selectPatternShape: (shape) => {
    set(state => ({
      patternChallenge: state.patternChallenge 
        ? { ...state.patternChallenge, selectedShape: shape }
        : null
    }));
  },
  
  placePatternShape: (slotId) => {
    const { patternChallenge } = get();
    if (!patternChallenge || !patternChallenge.selectedShape) return;
    
    const slot = patternChallenge.pattern.find(s => s.id === slotId);
    if (!slot || !slot.isBlank || slot.shape !== null) return;
    
    const isCorrect = patternChallenge.selectedShape === slot.correctShape;
    
    if (isCorrect) {
      const updatedPattern = patternChallenge.pattern.map(s =>
        s.id === slotId ? { ...s, shape: patternChallenge.selectedShape } : s
      );
      const newCompleted = patternChallenge.completedSlots + 1;
      
      set({
        patternChallenge: {
          ...patternChallenge,
          pattern: updatedPattern,
          completedSlots: newCompleted,
          selectedShape: null
        },
        score: get().score + 15,
        streak: get().streak + 1
      });
      
      if (newCompleted >= patternChallenge.totalBlankSlots) {
        set({ showSuccess: true, totalScore: get().totalScore + get().score });
      }
    } else {
      set({ streak: 0 });
    }
  },
  
  selectBlock: (blockId) => {
    const { constructorChallenge } = get();
    if (!constructorChallenge) return;
    
    const block = constructorChallenge.blocks.find(b => b.id === blockId);
    if (!block || block.placed) return;
    
    // Mark this block as selected (we'll track via UI state)
    set({ constructorChallenge: { ...constructorChallenge } });
  },
  
  placeBlock: () => {
    // This is handled via UI interaction in the canvas component
  },
  
  showHintMessage: () => {
    const state = get();
    const hint = getHintForPhase(state.phase, state);
    set({ showHint: true, hintMessage: hint, hintsUsed: state.hintsUsed + 1 });
  },
  
  hideHint: () => set({ showHint: false }),
  
  nextChallenge: () => {
    const { phase, level } = get();
    const phases: Phase[] = ['shape-detector', 'group-counter', 'pattern-builder', 'city-constructor'];
    const currentIndex = phases.indexOf(phase);
    
    if (currentIndex < phases.length - 1) {
      const nextPhase = phases[currentIndex + 1];
      set({ phase: nextPhase, score: 0, showInstructions: true, showSuccess: false });
      get().initializePhase(nextPhase);
    } else {
      // Completed all phases, increase level and restart
      set({ 
        phase: 'shape-detector', 
        level: level + 1, 
        score: 0, 
        showInstructions: true,
        showSuccess: false
      });
      get().initializePhase('shape-detector');
    }
  },
  
  resetGame: () => {
    set({
      phase: 'shape-detector',
      score: 0,
      totalScore: 0,
      streak: 0,
      level: 1,
      showInstructions: true,
      showSuccess: false,
      showHint: false,
      hintMessage: '',
      hintsUsed: 0,
      detectorChallenge: generateDetectorChallenge(1),
      counterChallenge: null,
      patternChallenge: null,
      constructorChallenge: null
    });
  },
  
  dismissInstructions: () => set({ showInstructions: false }),
  dismissSuccess: () => set({ showSuccess: false })
}));
