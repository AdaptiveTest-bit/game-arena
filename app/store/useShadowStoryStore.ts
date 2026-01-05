import { create } from 'zustand';

type ShapeType = 'circle' | 'square' | 'triangle' | 'rectangle';
type Phase = 'shadow-spotter' | 'bundle-builder' | 'place-value' | 'village-counter';

interface Shadow {
  id: string;
  shape: ShapeType;
  x: number;
  y: number;
  rotation: number;
  revealed: boolean;
  sorted: boolean;
}

interface SpotterChallenge {
  shadows: Shadow[];
  buckets: Record<ShapeType, string[]>;
  timeRemaining: number;
}

interface BundleShape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  inZone: boolean;
  bundled: boolean;
}

interface BundleChallenge {
  totalShapes: number;
  shapes: BundleShape[];
  bundleZoneCount: number;
  completedBundles: number;
  leftoverOnes: number;
}

interface PlaceValueChallenge {
  targetNumber: number;
  placedTens: number;
  placedOnes: number;
  availableTens: number;
  availableOnes: number;
  attempts: number;
  isCorrect: boolean;
}

interface House {
  id: string;
  bundles: number;
  revealed: boolean;
  x: number;
  y: number;
}

interface VillageChallenge {
  houses: House[];
  countSequence: number[];
  currentIndex: number;
  totalTarget: number;
  playerSequence: number[];
  errors: number;
}

interface ShadowStoryState {
  // Game Progress
  phase: Phase;
  level: number;
  score: number;
  stars: number;
  gameComplete: boolean;
  showPhaseComplete: boolean;
  showGameComplete: boolean;
  
  // Phase Challenges
  spotterChallenge: SpotterChallenge | null;
  bundleChallenge: BundleChallenge | null;
  placeValueChallenge: PlaceValueChallenge | null;
  villageChallenge: VillageChallenge | null;
  
  // Actions
  initializePhase: (phase: Phase) => void;
  revealShadow: (id: string) => void;
  sortShape: (id: string, bucket: ShapeType) => boolean;
  moveShapeToZone: (id: string) => void;
  removeShapeFromZone: (id: string) => void;
  createBundle: () => boolean;
  placeTens: (delta: number) => void;
  placeOnes: (delta: number) => void;
  submitPlaceValue: () => boolean;
  revealHouse: (id: string) => void;
  selectNextCount: (value: number) => boolean;
  nextPhase: () => void;
  nextLevel: () => void;
  resetGame: () => void;
  completePhase: () => void;
}

const SHAPE_TYPES: ShapeType[] = ['circle', 'square', 'triangle', 'rectangle'];

// Procedural Generation Functions
function generateSpotterChallenge(level: number): SpotterChallenge {
  const shadowCount = 5 + level; // 6, 7, 8 for levels 1-3
  
  const shadows: Shadow[] = Array.from({ length: shadowCount }, (_, i) => ({
    id: `shadow-${i}`,
    shape: SHAPE_TYPES[Math.floor(Math.random() * 4)],
    x: 80 + Math.random() * 440,
    y: 100 + Math.random() * 200,
    rotation: level > 1 ? Math.random() * 45 - 22.5 : 0,
    revealed: false,
    sorted: false,
  }));
  
  return {
    shadows,
    buckets: { circle: [], square: [], triangle: [], rectangle: [] },
    timeRemaining: 60 + level * 10,
  };
}

function generateBundleChallenge(level: number): BundleChallenge {
  const minShapes = 23 + (level - 1) * 8;
  const maxShapes = 35 + (level - 1) * 8;
  const totalShapes = minShapes + Math.floor(Math.random() * (maxShapes - minShapes + 1));
  
  const shapes: BundleShape[] = Array.from({ length: totalShapes }, (_, i) => ({
    id: `gem-${i}`,
    type: SHAPE_TYPES[Math.floor(Math.random() * 4)],
    x: 50 + Math.random() * 500,
    y: 50 + Math.random() * 180,
    inZone: false,
    bundled: false,
  }));
  
  return {
    totalShapes,
    shapes,
    bundleZoneCount: 0,
    completedBundles: 0,
    leftoverOnes: 0,
  };
}

function generatePlaceValueChallenge(level: number): PlaceValueChallenge {
  const minNum = 11 + (level - 1) * 10;
  const maxNum = 39 + (level - 1) * 30;
  
  let target = minNum + Math.floor(Math.random() * (maxNum - minNum + 1));
  if (target % 10 === 0) target += Math.floor(Math.random() * 9) + 1;
  
  return {
    targetNumber: target,
    placedTens: 0,
    placedOnes: 0,
    availableTens: 9,
    availableOnes: 9,
    attempts: 0,
    isCorrect: false,
  };
}

function generateVillageChallenge(level: number): VillageChallenge {
  const houseCount = 3 + level;
  const houses: House[] = Array.from({ length: houseCount }, (_, i) => ({
    id: `house-${i}`,
    bundles: 1 + Math.floor(Math.random() * 3),
    revealed: false,
    x: 50 + i * (500 / houseCount),
    y: 180 + (i % 2) * 50,
  }));
  
  const totalTarget = houses.reduce((sum, h) => sum + h.bundles * 10, 0);
  const countSequence: number[] = [];
  let runningTotal = 0;
  for (const house of houses) {
    runningTotal += house.bundles * 10;
    countSequence.push(runningTotal);
  }
  
  return { houses, countSequence, currentIndex: 0, totalTarget, playerSequence: [], errors: 0 };
}

export const useShadowStoryStore = create<ShadowStoryState>((set, get) => ({
  // Initial State
  phase: 'shadow-spotter',
  level: 1,
  score: 0,
  stars: 0,
  gameComplete: false,
  showPhaseComplete: false,
  showGameComplete: false,
  
  spotterChallenge: generateSpotterChallenge(1),
  bundleChallenge: null,
  placeValueChallenge: null,
  villageChallenge: null,
  
  // Actions
  initializePhase: (phase: Phase) => {
    const level = get().level;
    set({
      phase,
      showPhaseComplete: false,
      spotterChallenge: phase === 'shadow-spotter' ? generateSpotterChallenge(level) : get().spotterChallenge,
      bundleChallenge: phase === 'bundle-builder' ? generateBundleChallenge(level) : get().bundleChallenge,
      placeValueChallenge: phase === 'place-value' ? generatePlaceValueChallenge(level) : get().placeValueChallenge,
      villageChallenge: phase === 'village-counter' ? generateVillageChallenge(level) : get().villageChallenge,
    });
  },
  
  revealShadow: (id: string) => {
    const challenge = get().spotterChallenge;
    if (!challenge) return;
    
    set({
      spotterChallenge: {
        ...challenge,
        shadows: challenge.shadows.map(s =>
          s.id === id ? { ...s, revealed: true } : s
        ),
      },
    });
  },
  
  sortShape: (id: string, bucket: ShapeType) => {
    const challenge = get().spotterChallenge;
    if (!challenge) return false;
    
    const shadow = challenge.shadows.find(s => s.id === id);
    if (!shadow || !shadow.revealed || shadow.sorted) return false;
    
    const isCorrect = shadow.shape === bucket;
    
    if (isCorrect) {
      set({
        score: get().score + 10,
        spotterChallenge: {
          ...challenge,
          shadows: challenge.shadows.map(s =>
            s.id === id ? { ...s, sorted: true } : s
          ),
          buckets: {
            ...challenge.buckets,
            [bucket]: [...challenge.buckets[bucket], id],
          },
        },
      });
    }
    
    // Check if all shapes sorted
    const updatedChallenge = get().spotterChallenge;
    if (updatedChallenge && updatedChallenge.shadows.every(s => s.sorted)) {
      set({ showPhaseComplete: true, stars: get().stars + 1 });
    }
    
    return isCorrect;
  },
  
  moveShapeToZone: (id: string) => {
    const challenge = get().bundleChallenge;
    if (!challenge) return;
    
    const shape = challenge.shapes.find(s => s.id === id);
    if (!shape || shape.inZone || shape.bundled) return;
    
    set({
      bundleChallenge: {
        ...challenge,
        shapes: challenge.shapes.map(s =>
          s.id === id ? { ...s, inZone: true } : s
        ),
        bundleZoneCount: challenge.bundleZoneCount + 1,
      },
    });
  },
  
  removeShapeFromZone: (id: string) => {
    const challenge = get().bundleChallenge;
    if (!challenge) return;
    
    const shape = challenge.shapes.find(s => s.id === id);
    if (!shape || !shape.inZone || shape.bundled) return;
    
    set({
      bundleChallenge: {
        ...challenge,
        shapes: challenge.shapes.map(s =>
          s.id === id ? { ...s, inZone: false } : s
        ),
        bundleZoneCount: challenge.bundleZoneCount - 1,
      },
    });
  },
  
  createBundle: () => {
    const challenge = get().bundleChallenge;
    if (!challenge || challenge.bundleZoneCount < 10) return false;
    
    // Bundle exactly 10 shapes
    let bundled = 0;
    const newShapes = challenge.shapes.map(s => {
      if (s.inZone && !s.bundled && bundled < 10) {
        bundled++;
        return { ...s, bundled: true, inZone: false };
      }
      return s;
    });
    
    const newBundles = challenge.completedBundles + 1;
    const remainingInZone = challenge.bundleZoneCount - 10;
    
    set({
      score: get().score + 50,
      bundleChallenge: {
        ...challenge,
        shapes: newShapes,
        bundleZoneCount: remainingInZone,
        completedBundles: newBundles,
      },
    });
    
    // Check if all shapes are either bundled or remaining as ones
    const updated = get().bundleChallenge;
    if (updated) {
      const unbundled = updated.shapes.filter(s => !s.bundled);
      if (unbundled.length < 10) {
        set({
          bundleChallenge: { ...updated, leftoverOnes: unbundled.length },
          showPhaseComplete: true,
          stars: get().stars + 1,
        });
      }
    }
    
    return true;
  },
  
  placeTens: (delta: number) => {
    const challenge = get().placeValueChallenge;
    if (!challenge) return;
    
    const newPlaced = Math.max(0, Math.min(9, challenge.placedTens + delta));
    set({
      placeValueChallenge: {
        ...challenge,
        placedTens: newPlaced,
      },
    });
  },
  
  placeOnes: (delta: number) => {
    const challenge = get().placeValueChallenge;
    if (!challenge) return;
    
    const newPlaced = Math.max(0, Math.min(9, challenge.placedOnes + delta));
    set({
      placeValueChallenge: {
        ...challenge,
        placedOnes: newPlaced,
      },
    });
  },
  
  submitPlaceValue: () => {
    const challenge = get().placeValueChallenge;
    if (!challenge) return false;
    
    const playerAnswer = challenge.placedTens * 10 + challenge.placedOnes;
    const isCorrect = playerAnswer === challenge.targetNumber;
    
    set({
      placeValueChallenge: {
        ...challenge,
        attempts: challenge.attempts + 1,
        isCorrect,
      },
    });
    
    if (isCorrect) {
      set({
        score: get().score + 100,
        showPhaseComplete: true,
        stars: get().stars + 1,
      });
    }
    
    return isCorrect;
  },
  
  revealHouse: (id: string) => {
    const challenge = get().villageChallenge;
    if (!challenge) return;
    
    set({
      villageChallenge: {
        ...challenge,
        houses: challenge.houses.map(h =>
          h.id === id ? { ...h, revealed: true } : h
        ),
      },
    });
  },
  
  selectNextCount: (value: number) => {
    const challenge = get().villageChallenge;
    if (!challenge) return false;
    
    const expectedValue = challenge.countSequence[challenge.currentIndex];
    const isCorrect = value === expectedValue;
    
    if (isCorrect) {
      const newIndex = challenge.currentIndex + 1;
      set({
        score: get().score + 20,
        villageChallenge: {
          ...challenge,
          currentIndex: newIndex,
          playerSequence: [...challenge.playerSequence, value],
        },
      });
      
      // Check if completed
      if (newIndex >= challenge.countSequence.length) {
        set({ showPhaseComplete: true, stars: get().stars + 1 });
      }
    } else {
      set({
        villageChallenge: {
          ...challenge,
          errors: challenge.errors + 1,
        },
      });
    }
    
    return isCorrect;
  },
  
  nextPhase: () => {
    const currentPhase = get().phase;
    const phases: Phase[] = ['shadow-spotter', 'bundle-builder', 'place-value', 'village-counter'];
    const currentIndex = phases.indexOf(currentPhase);
    
    if (currentIndex < phases.length - 1) {
      const nextPhase = phases[currentIndex + 1];
      get().initializePhase(nextPhase);
    } else {
      set({ showGameComplete: true, gameComplete: true });
    }
  },
  
  nextLevel: () => {
    const newLevel = Math.min(get().level + 1, 3);
    set({ level: newLevel });
    get().initializePhase(get().phase);
  },
  
  completePhase: () => {
    set({ showPhaseComplete: true });
  },
  
  resetGame: () => {
    set({
      phase: 'shadow-spotter',
      level: 1,
      score: 0,
      stars: 0,
      gameComplete: false,
      showPhaseComplete: false,
      showGameComplete: false,
      spotterChallenge: generateSpotterChallenge(1),
      bundleChallenge: null,
      placeValueChallenge: null,
      villageChallenge: null,
    });
  },
}));
