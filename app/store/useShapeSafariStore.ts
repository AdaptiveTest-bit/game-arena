import { create } from 'zustand';

// Types
export type ShapeType = 'circle' | 'square' | 'rectangle' | 'triangle';
export type Shape3DType = 'cube' | 'sphere' | 'cone' | 'cylinder' | 'cuboid';
export type LineType = 'straight' | 'curved' | 'slanting';
export type PositionType = 'inside' | 'outside' | 'above' | 'below' | 'left' | 'right';

export type ChallengeType =
  | 'identify-2d'
  | 'identify-3d'
  | 'match-shape'
  | 'find-line'
  | 'position'
  | 'pattern-complete'
  | 'shape-in-object'
  | 'odd-one-out'
  | 'count-shapes'
  | 'big-small';

export interface DisplayShape {
  id: string;
  shape: ShapeType | Shape3DType;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  isOdd?: boolean;
}

export interface ChallengeOption {
  id: string;
  shape?: ShapeType | Shape3DType | string;
  label: string;
  color: string;
}

export interface Challenge {
  id: string;
  type: ChallengeType;
  level: 1 | 2 | 3;
  title: string;
  instruction: string;
  data: {
    targetShape?: ShapeType | Shape3DType;
    targetLine?: LineType;
    targetPosition?: PositionType;
    targetSize?: 'big' | 'small';
    displayShapes?: DisplayShape[];
    pattern?: Array<{ shape: ShapeType; color: string }>;
    missingIndex?: number;
    nextShape?: ShapeType;
    object?: string;
    correctShape?: ShapeType | Shape3DType;
    count?: number;
    oddShape?: ShapeType;
  };
  correctAnswer: string | number;
  options: ChallengeOption[];
  correctOptionId: string;
}

interface ShapeSafariState {
  // Game State
  gameState: 'menu' | 'playing' | 'paused' | 'celebrating';
  level: 1 | 2 | 3;

  // Progress
  score: number;
  stars: number;
  streak: number;
  challengesCompleted: number;
  totalChallengesPerLevel: number;

  // Current Challenge
  currentChallenge: Challenge | null;
  selectedOption: string | null;
  showFeedback: boolean;
  isCorrect: boolean;

  // Actions
  startGame: (level: 1 | 2 | 3) => void;
  generateChallenge: () => void;
  selectOption: (optionId: string) => void;
  submitAnswer: () => boolean;
  nextChallenge: () => void;
  resetGame: () => void;
  startCelebration: () => void;
}

// Constants
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFB347', '#87CEEB'];
const SHAPES_2D: ShapeType[] = ['circle', 'square', 'rectangle', 'triangle'];
const SHAPES_3D: Shape3DType[] = ['cube', 'sphere', 'cone', 'cylinder', 'cuboid'];

// Real-world objects mapped to shapes
const SHAPE_OBJECTS: Record<string, string[]> = {
  circle: ['Pizza', 'Clock', 'Wheel', 'Coin', 'Sun', 'Ball'],
  square: ['Window', 'Tile', 'Napkin', 'Chessboard', 'Photo Frame'],
  rectangle: ['Door', 'Book', 'Table', 'TV Screen', 'Bed', 'Brick'],
  triangle: ['Sandwich', 'Pizza Slice', 'Roof', 'Traffic Sign', 'Tent'],
  cube: ['Dice', 'Ice Cube', 'Gift Box', 'Sugar Cube', 'Rubik\'s Cube'],
  sphere: ['Ball', 'Globe', 'Orange', 'Marble', 'Bubble'],
  cone: ['Ice Cream Cone', 'Party Hat', 'Traffic Cone', 'Funnel'],
  cylinder: ['Can', 'Pipe', 'Glass', 'Drum', 'Candle', 'Log'],
  cuboid: ['Book', 'Brick', 'Box', 'Refrigerator', 'Eraser'],
};

// Helper functions
const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

const generateRandomPositions = (
  count: number,
  bounds: { minX: number; maxX: number; minY: number; maxY: number; minDistance: number }
): Array<{ x: number; y: number }> => {
  const positions: Array<{ x: number; y: number }> = [];
  let attempts = 0;

  while (positions.length < count && attempts < 1000) {
    const x = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
    const y = bounds.minY + Math.random() * (bounds.maxY - bounds.minY);

    const tooClose = positions.some(
      (p) => Math.hypot(p.x - x, p.y - y) < bounds.minDistance
    );

    if (!tooClose) {
      positions.push({ x, y });
    }
    attempts++;
  }

  return positions;
};

export const useShapeSafariStore = create<ShapeSafariState>((set, get) => ({
  // Initial State
  gameState: 'menu',
  level: 1,
  score: 0,
  stars: 0,
  streak: 0,
  challengesCompleted: 0,
  totalChallengesPerLevel: 20,
  currentChallenge: null,
  selectedOption: null,
  showFeedback: false,
  isCorrect: false,

  startGame: (level: 1 | 2 | 3) => {
    set({
      gameState: 'playing',
      level,
      score: 0,
      stars: 0,
      streak: 0,
      challengesCompleted: 0,
      currentChallenge: null,
      selectedOption: null,
      showFeedback: false,
    });
    get().generateChallenge();
  },

  generateChallenge: () => {
    const { level } = get();
    let challenge: Challenge;

    // Challenge types based on level - RANDOMIZED every time
    const level1Types: ChallengeType[] = ['identify-2d', 'match-shape', 'big-small', 'odd-one-out'];
    const level2Types: ChallengeType[] = ['identify-3d', 'shape-in-object', 'pattern-complete', 'find-line', 'position'];
    const level3Types: ChallengeType[] = ['count-shapes', 'pattern-complete', 'position', 'identify-3d', 'shape-in-object'];

    const types = level === 1 ? level1Types : level === 2 ? level2Types : level3Types;
    // RANDOM selection - ensures different questions every time
    const type = types[Math.floor(Math.random() * types.length)];

    // Shuffle shapes to ensure variety
    const shapes2D = ([...SHAPES_2D] as ShapeType[]).sort(() => Math.random() - 0.5);
    const shapes3D = ([...SHAPES_3D] as Shape3DType[]).sort(() => Math.random() - 0.5);

    switch (type) {
      case 'identify-2d': {
        const targetShape = shapes2D[Math.floor(Math.random() * shapes2D.length)];
        const shuffledShapes = [...shapes2D].sort(() => Math.random() - 0.5);
        const positions = generateRandomPositions(4, {
          minX: 80,
          maxX: 320,
          minY: 80,
          maxY: 280,
          minDistance: 100,
        });

        const displayShapes: DisplayShape[] = shuffledShapes.map((shape, idx) => ({
          id: `shape-${idx}`,
          shape,
          x: positions[idx]?.x || 100 + idx * 80,
          y: positions[idx]?.y || 150,
          size: 60 + Math.random() * 20,
          color: getRandomColor(),
          rotation: (Math.random() - 0.5) * 30,
        }));

        const options: ChallengeOption[] = shuffledShapes.map((shape, idx) => ({
          id: `opt-${idx}`,
          label: shape.charAt(0).toUpperCase() + shape.slice(1),
          shape,
          color: getRandomColor(),
        })).sort(() => Math.random() - 0.5);

        challenge = {
          id: `2d-${Date.now()}-${Math.random()}`,
          type: 'identify-2d',
          level,
          title: '🔺 Find the Shape!',
          instruction: `Tap on the ${targetShape.toUpperCase()}!`,
          data: { targetShape, displayShapes },
          correctAnswer: targetShape,
          options,
          correctOptionId: options.find((o) => o.shape === targetShape)?.id || '',
        };
        break;
      }

      case 'identify-3d': {
        const targetShape = shapes3D[Math.floor(Math.random() * shapes3D.length)];
        const shuffledShapes = [...shapes3D].slice(0, 4).sort(() => Math.random() - 0.5);
        
        // Ensure target is included
        if (!shuffledShapes.includes(targetShape)) {
          shuffledShapes[0] = targetShape;
        }

        const options: ChallengeOption[] = shuffledShapes.map((shape, idx) => ({
          id: `opt-${idx}`,
          label: shape.charAt(0).toUpperCase() + shape.slice(1),
          shape,
          color: getRandomColor(),
        }));

        const shuffledOptions = options.sort(() => Math.random() - 0.5);

        challenge = {
          id: `3d-${Date.now()}-${Math.random()}`,
          type: 'identify-3d',
          level,
          title: '🧊 Find the 3D Shape!',
          instruction: `Which one is a ${targetShape.toUpperCase()}?`,
          data: { targetShape },
          correctAnswer: targetShape,
          options: shuffledOptions,
          correctOptionId: shuffledOptions.find((o) => o.shape === targetShape)?.id || '',
        };
        break;
      }

      case 'match-shape': {
        const targetShape = shapes2D[Math.floor(Math.random() * shapes2D.length)];
        const objects = SHAPE_OBJECTS[targetShape] || ['Object'];
        const correctObject = objects[Math.floor(Math.random() * objects.length)];

        // Get wrong objects from other shapes
        const wrongObjects: string[] = [];
        for (const shape of shapes2D) {
          if (shape !== targetShape && SHAPE_OBJECTS[shape]) {
            const shapeObjects = SHAPE_OBJECTS[shape];
            wrongObjects.push(shapeObjects[Math.floor(Math.random() * shapeObjects.length)]);
          }
        }

        const allOptions = [correctObject, ...wrongObjects.slice(0, 3)];
        const options: ChallengeOption[] = allOptions.map((obj, idx) => ({
          id: `opt-${idx}`,
          label: obj,
          color: getRandomColor(),
        })).sort(() => Math.random() - 0.5);

        challenge = {
          id: `match-${Date.now()}-${Math.random()}`,
          type: 'match-shape',
          level,
          title: '🏠 Match the Shape!',
          instruction: `Which object looks like a ${targetShape.toUpperCase()}?`,
          data: { targetShape, correctShape: targetShape },
          correctAnswer: correctObject,
          options,
          correctOptionId: options.find((o) => o.label === correctObject)?.id || '',
        };
        break;
      }

      case 'find-line': {
        const lines: LineType[] = ['straight', 'curved', 'slanting'];
        const targetLine = lines[Math.floor(Math.random() * lines.length)];

        const options: ChallengeOption[] = lines.map((line, idx) => ({
          id: `opt-${idx}`,
          label: line.charAt(0).toUpperCase() + line.slice(1) + ' Line',
          shape: line,
          color: getRandomColor(),
        })).sort(() => Math.random() - 0.5);

        challenge = {
          id: `line-${Date.now()}-${Math.random()}`,
          type: 'find-line',
          level,
          title: '📏 Find the Line!',
          instruction: `Tap on the ${targetLine.toUpperCase()} LINE`,
          data: { targetLine },
          correctAnswer: targetLine,
          options,
          correctOptionId: options.find((o) => o.shape === targetLine)?.id || '',
        };
        break;
      }

      case 'position': {
        const positions: PositionType[] = ['inside', 'outside', 'above', 'below', 'left', 'right'];
        const shuffledPositions = [...positions].sort(() => Math.random() - 0.5);
        const targetPosition = shuffledPositions[0];

        const selectedPositions = [targetPosition, ...shuffledPositions.filter((p) => p !== targetPosition).slice(0, 3)];

        const options: ChallengeOption[] = selectedPositions.map((pos, idx) => ({
          id: `opt-${idx}`,
          label: pos.charAt(0).toUpperCase() + pos.slice(1),
          shape: pos,
          color: getRandomColor(),
        })).sort(() => Math.random() - 0.5);

        challenge = {
          id: `pos-${Date.now()}-${Math.random()}`,
          type: 'position',
          level,
          title: '🧭 Where is it?',
          instruction: `The ⭐ star is _____ the box. Find the answer!`,
          data: { targetPosition },
          correctAnswer: targetPosition,
          options,
          correctOptionId: options.find((o) => o.shape === targetPosition)?.id || '',
        };
        break;
      }

      case 'odd-one-out': {
        const mainShape = shapes2D[Math.floor(Math.random() * shapes2D.length)];
        const oddShape = shapes2D.filter((s) => s !== mainShape)[Math.floor(Math.random() * 3)];

        const displayShapes: DisplayShape[] = [
          { id: 's1', shape: mainShape, x: 100, y: 150, size: 60, color: getRandomColor(), rotation: 0, isOdd: false },
          { id: 's2', shape: mainShape, x: 200, y: 150, size: 60, color: getRandomColor(), rotation: 0, isOdd: false },
          { id: 's3', shape: mainShape, x: 300, y: 150, size: 60, color: getRandomColor(), rotation: 0, isOdd: false },
          { id: 's4', shape: oddShape, x: 150, y: 250, size: 60, color: getRandomColor(), rotation: 0, isOdd: true },
        ].sort(() => Math.random() - 0.5);

        const options: ChallengeOption[] = displayShapes.map((s, idx) => ({
          id: `opt-${idx}`,
          label: `Shape ${idx + 1}`,
          shape: s.shape,
          color: s.color,
        }));

        const oddIndex = displayShapes.findIndex((s) => s.isOdd);

        challenge = {
          id: `odd-${Date.now()}-${Math.random()}`,
          type: 'odd-one-out',
          level,
          title: '🧠 Find the Different One!',
          instruction: 'Which shape is DIFFERENT from the others?',
          data: { displayShapes, oddShape },
          correctAnswer: oddShape,
          options,
          correctOptionId: options[oddIndex]?.id || '',
        };
        break;
      }

      case 'pattern-complete': {
        const patternShapes = shapes2D.slice(0, level === 1 ? 2 : 3);

        const patternTypes =
          level === 1
            ? [
                [patternShapes[0], patternShapes[1], patternShapes[0], patternShapes[1]],
                [patternShapes[1], patternShapes[0], patternShapes[1], patternShapes[0]],
              ]
            : level === 2
            ? [
                [patternShapes[0], patternShapes[1], patternShapes[2], patternShapes[0], patternShapes[1], patternShapes[2]],
                [patternShapes[2], patternShapes[1], patternShapes[0], patternShapes[2], patternShapes[1], patternShapes[0]],
                [patternShapes[0], patternShapes[0], patternShapes[1], patternShapes[0], patternShapes[0], patternShapes[1]],
              ]
            : [
                [patternShapes[0], patternShapes[0], patternShapes[1], patternShapes[0], patternShapes[0], patternShapes[1]],
                [patternShapes[1], patternShapes[0], patternShapes[0], patternShapes[1], patternShapes[0], patternShapes[0]],
                [patternShapes[0], patternShapes[1], patternShapes[1], patternShapes[0], patternShapes[1], patternShapes[1]],
              ];

        const pattern = patternTypes[Math.floor(Math.random() * patternTypes.length)];
        const patternLength = level === 1 ? 2 : 3;
        const nextShape = pattern[pattern.length % patternLength];

        const options: ChallengeOption[] = shapes2D.map((shape, idx) => ({
          id: `opt-${idx}`,
          label: shape.charAt(0).toUpperCase() + shape.slice(1),
          shape,
          color: getRandomColor(),
        })).sort(() => Math.random() - 0.5);

        challenge = {
          id: `pattern-${Date.now()}-${Math.random()}`,
          type: 'pattern-complete',
          level,
          title: '🎨 Complete the Pattern!',
          instruction: 'What comes NEXT?',
          data: {
            pattern: pattern.map((s) => ({ shape: s, color: getRandomColor() })),
            nextShape,
          },
          correctAnswer: nextShape,
          options,
          correctOptionId: options.find((o) => o.shape === nextShape)?.id || '',
        };
        break;
      }

      case 'shape-in-object': {
        const allShapes = [...shapes2D, ...shapes3D];
        const shapeKey = allShapes[Math.floor(Math.random() * allShapes.length)];
        const objects = SHAPE_OBJECTS[shapeKey] || ['Object'];
        const object = objects[Math.floor(Math.random() * objects.length)];

        const optionShapes = [...shapes2D.slice(0, 2), ...shapes3D.slice(0, 2)];
        const options: ChallengeOption[] = optionShapes.map((shape, idx) => ({
          id: `opt-${idx}`,
          label: shape.charAt(0).toUpperCase() + shape.slice(1),
          shape,
          color: getRandomColor(),
        }));

        // Ensure correct shape is in options
        if (!options.find((o) => o.shape === shapeKey)) {
          options[0] = {
            id: 'opt-0',
            label: shapeKey.charAt(0).toUpperCase() + shapeKey.slice(1),
            shape: shapeKey,
            color: getRandomColor(),
          };
        }

        const shuffledOptions = options.sort(() => Math.random() - 0.5);

        challenge = {
          id: `object-${Date.now()}-${Math.random()}`,
          type: 'shape-in-object',
          level,
          title: '🏠 What Shape is This?',
          instruction: `What shape is a ${object}?`,
          data: { object, correctShape: shapeKey },
          correctAnswer: shapeKey,
          options: shuffledOptions,
          correctOptionId: shuffledOptions.find((o) => o.shape === shapeKey)?.id || '',
        };
        break;
      }

      case 'big-small': {
        const shape = shapes2D[Math.floor(Math.random() * shapes2D.length)];
        const isBigQuestion = Math.random() > 0.5;

        const options: ChallengeOption[] = [
          { id: 'opt-0', label: 'Big Shape', shape: 'big', color: getRandomColor() },
          { id: 'opt-1', label: 'Small Shape', shape: 'small', color: getRandomColor() },
        ];

        challenge = {
          id: `size-${Date.now()}-${Math.random()}`,
          type: 'big-small',
          level,
          title: '📏 Big or Small?',
          instruction: `Tap on the ${isBigQuestion ? 'BIG' : 'SMALL'} ${shape.toUpperCase()}`,
          data: { targetShape: shape, targetSize: isBigQuestion ? 'big' : 'small' },
          correctAnswer: isBigQuestion ? 'big' : 'small',
          options,
          correctOptionId: isBigQuestion ? 'opt-0' : 'opt-1',
        };
        break;
      }

      case 'count-shapes': {
        const shape = shapes2D[Math.floor(Math.random() * shapes2D.length)];
        const countRanges = level === 1 ? [2, 3, 4] : level === 2 ? [3, 4, 5] : [4, 5, 6, 7];
        const count = countRanges[Math.floor(Math.random() * countRanges.length)];

        const positions = generateRandomPositions(count, {
          minX: 60,
          maxX: 340,
          minY: 80,
          maxY: 280,
          minDistance: 60,
        });

        const displayShapes: DisplayShape[] = positions.map((pos, idx) => ({
          id: `shape-${idx}`,
          shape,
          x: pos.x,
          y: pos.y,
          size: 45 + Math.random() * 15,
          color: getRandomColor(),
          rotation: (Math.random() - 0.5) * 40,
        }));

        const options: ChallengeOption[] = [count - 1, count, count + 1, count + 2]
          .filter((n) => n > 0)
          .map((n, idx) => ({
            id: `opt-${idx}`,
            label: `${n}`,
            shape: n.toString(),
            color: getRandomColor(),
          }))
          .sort(() => Math.random() - 0.5);

        challenge = {
          id: `count-${Date.now()}-${Math.random()}`,
          type: 'count-shapes',
          level,
          title: '🔢 Count the Shapes!',
          instruction: `How many ${shape.toUpperCase()}S are there?`,
          data: { targetShape: shape, count, displayShapes },
          correctAnswer: count,
          options,
          correctOptionId: options.find((o) => o.label === count.toString())?.id || '',
        };
        break;
      }

      default: {
        // Fallback to identify-2d
        const fallbackShape = shapes2D[0];
        const fallbackOptions: ChallengeOption[] = shapes2D.map((shape, idx) => ({
          id: `opt-${idx}`,
          label: shape.charAt(0).toUpperCase() + shape.slice(1),
          shape,
          color: getRandomColor(),
        }));

        challenge = {
          id: `fallback-${Date.now()}`,
          type: 'identify-2d',
          level,
          title: '🔺 Find the Shape!',
          instruction: `Tap on the ${fallbackShape.toUpperCase()}`,
          data: { targetShape: fallbackShape },
          correctAnswer: fallbackShape,
          options: fallbackOptions,
          correctOptionId: fallbackOptions[0].id,
        };
      }
    }

    set({ currentChallenge: challenge, selectedOption: null, showFeedback: false });
  },

  selectOption: (optionId: string) => {
    if (!get().showFeedback) {
      set({ selectedOption: optionId });
    }
  },

  submitAnswer: () => {
    const { currentChallenge, selectedOption } = get();
    if (!currentChallenge || !selectedOption) return false;

    const isCorrect = selectedOption === currentChallenge.correctOptionId;

    if (isCorrect) {
      // Score is based on 100 total (5 points per correct answer for 20 questions)
      const points = 5;
      set((state) => ({
        score: Math.min(100, state.score + points),
        stars: state.stars + 1,
        streak: state.streak + 1,
        isCorrect: true,
        showFeedback: true,
      }));
    } else {
      set({ isCorrect: false, showFeedback: true, streak: 0 });
    }

    return isCorrect;
  },

  nextChallenge: () => {
    const { challengesCompleted, totalChallengesPerLevel } = get();
    const newCompleted = challengesCompleted + 1;

    if (newCompleted >= totalChallengesPerLevel) {
      set({ gameState: 'celebrating' });
    } else {
      set({ challengesCompleted: newCompleted });
      get().generateChallenge();
    }
  },

  resetGame: () => {
    set({
      gameState: 'menu',
      level: 1,
      score: 0,
      stars: 0,
      streak: 0,
      currentChallenge: null,
      challengesCompleted: 0,
      selectedOption: null,
      showFeedback: false,
    });
  },

  startCelebration: () => {
    set({ gameState: 'celebrating' });
  },
}));
