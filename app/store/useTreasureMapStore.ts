'use client';

import { create } from 'zustand';

export interface Coordinate {
  x: number;
  y: number;
}

export interface Waypoint {
  coord: Coordinate;
  label: string;
  icon: string;
}

export interface PlottingChallenge {
  targetCoordinates: Coordinate[];
  labels: string[];
  icons: string[];
  playerPlacements: (Coordinate | null)[];
  currentPlotIndex: number;
}

export interface PathChallenge {
  startPoint: Coordinate;
  endPoint: Coordinate;
  waypoints: Waypoint[];
  obstacles: Coordinate[];
  playerPath: Coordinate[];
  optimalPathLength: number;
}

export interface DistanceChallenge {
  pointA: Coordinate;
  pointB: Coordinate;
  labelA: string;
  labelB: string;
  correctDistance: number;
  playerAnswer: string;
  questionType: 'manhattan' | 'horizontal' | 'vertical';
}

interface TreasureMapState {
  // Game Meta
  phase: 'plotting' | 'pathfinding' | 'distance';
  score: number;
  streak: number;
  challengeIndex: number;
  totalChallenges: number;
  isPhaseCorrect: boolean;
  showPhaseComplete: boolean;
  gameComplete: boolean;
  gridSize: number;
  
  // Phase 1: Coordinate Plotting
  plottingChallenge: PlottingChallenge | null;
  plotCoordinate: (coord: Coordinate) => boolean;
  validatePlotting: () => boolean;
  
  // Phase 2: Path Navigation
  pathChallenge: PathChallenge | null;
  addToPath: (coord: Coordinate) => void;
  removeLastFromPath: () => void;
  clearPath: () => void;
  validatePath: () => boolean;
  
  // Phase 3: Distance Calculation
  distanceChallenge: DistanceChallenge | null;
  setDistanceAnswer: (answer: string) => void;
  appendToDistanceAnswer: (digit: string) => void;
  clearDistanceAnswer: () => void;
  validateDistance: () => boolean;
  
  // Game Flow
  generateChallenge: () => void;
  advancePhase: () => void;
  nextChallenge: () => void;
  resetGame: () => void;
  dismissPhaseComplete: () => void;
  
  // Hints
  hintsRemaining: number;
  currentHint: string | null;
  useHint: () => string | null;
}

// Generate random coordinate within grid
const randomCoord = (max: number, exclude: Coordinate[] = []): Coordinate => {
  let coord: Coordinate;
  let attempts = 0;
  do {
    coord = {
      x: Math.floor(Math.random() * max) + 1,
      y: Math.floor(Math.random() * max) + 1
    };
    attempts++;
  } while (
    attempts < 100 &&
    exclude.some(e => e.x === coord.x && e.y === coord.y)
  );
  return coord;
};

// Calculate Manhattan distance
const manhattanDistance = (a: Coordinate, b: Coordinate): number => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

// Check if two coordinates are adjacent (including diagonals for path)
const areAdjacent = (a: Coordinate, b: Coordinate): boolean => {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  return dx <= 1 && dy <= 1 && !(dx === 0 && dy === 0);
};

// Check if coordinate is in obstacle list
const isObstacle = (coord: Coordinate, obstacles: Coordinate[]): boolean => {
  return obstacles.some(o => o.x === coord.x && o.y === coord.y);
};

// Generate plotting challenge
const generatePlottingChallenge = (gridSize: number): PlottingChallenge => {
  const numPoints = Math.floor(Math.random() * 2) + 4; // 4-5 points
  const coordinates: Coordinate[] = [];
  const icons = ['🏠', '🌴', '⛰️', '🏰', '💎', '🗿', '⚓', '🎪'];
  const labels = ['Home Base', 'Palm Grove', 'Rocky Peak', 'Ancient Castle', 'Diamond Cave', 'Stone Monument', 'Harbor', 'Camp'];
  
  for (let i = 0; i < numPoints; i++) {
    coordinates.push(randomCoord(gridSize, coordinates));
  }
  
  const selectedIcons = icons.slice(0, numPoints);
  const selectedLabels = labels.slice(0, numPoints);
  
  return {
    targetCoordinates: coordinates,
    labels: selectedLabels,
    icons: selectedIcons,
    playerPlacements: new Array(numPoints).fill(null),
    currentPlotIndex: 0
  };
};

// Generate path challenge
const generatePathChallenge = (gridSize: number): PathChallenge => {
  const obstacles: Coordinate[] = [];
  const numObstacles = Math.floor(Math.random() * 8) + 6; // 6-13 obstacles
  
  // Generate start and end points
  const startPoint = randomCoord(gridSize);
  const endPoint = randomCoord(gridSize, [startPoint]);
  
  // Ensure min distance
  while (manhattanDistance(startPoint, endPoint) < 5) {
    endPoint.x = Math.floor(Math.random() * gridSize) + 1;
    endPoint.y = Math.floor(Math.random() * gridSize) + 1;
  }
  
  // Generate obstacles (not on start/end)
  for (let i = 0; i < numObstacles; i++) {
    const obs = randomCoord(gridSize, [startPoint, endPoint, ...obstacles]);
    obstacles.push(obs);
  }
  
  // Generate 1-2 waypoints that must be visited
  const numWaypoints = Math.floor(Math.random() * 2) + 1;
  const waypoints: Waypoint[] = [];
  const waypointIcons = ['🔑', '📦', '🗝️'];
  const waypointLabels = ['Golden Key', 'Supply Crate', 'Secret Key'];
  
  for (let i = 0; i < numWaypoints; i++) {
    const coord = randomCoord(gridSize, [startPoint, endPoint, ...obstacles, ...waypoints.map(w => w.coord)]);
    waypoints.push({
      coord,
      label: waypointLabels[i],
      icon: waypointIcons[i]
    });
  }
  
  // Calculate approximate optimal path length
  let optimalLength = manhattanDistance(startPoint, waypoints[0]?.coord || endPoint);
  for (let i = 0; i < waypoints.length - 1; i++) {
    optimalLength += manhattanDistance(waypoints[i].coord, waypoints[i + 1].coord);
  }
  if (waypoints.length > 0) {
    optimalLength += manhattanDistance(waypoints[waypoints.length - 1].coord, endPoint);
  }
  
  return {
    startPoint,
    endPoint,
    waypoints,
    obstacles,
    playerPath: [startPoint],
    optimalPathLength: optimalLength + 3 // Allow some flexibility
  };
};

// Generate distance challenge
const generateDistanceChallenge = (gridSize: number): DistanceChallenge => {
  const types: ('manhattan' | 'horizontal' | 'vertical')[] = ['manhattan', 'horizontal', 'vertical'];
  const questionType = types[Math.floor(Math.random() * types.length)];
  
  let pointA = randomCoord(gridSize);
  let pointB = randomCoord(gridSize, [pointA]);
  
  // Ensure minimum distance for meaningful questions
  while (manhattanDistance(pointA, pointB) < 4) {
    pointB = randomCoord(gridSize, [pointA]);
  }
  
  // For specific question types, adjust points
  if (questionType === 'horizontal') {
    pointB.y = pointA.y; // Same row
    while (Math.abs(pointB.x - pointA.x) < 3) {
      pointB.x = Math.floor(Math.random() * gridSize) + 1;
    }
  } else if (questionType === 'vertical') {
    pointB.x = pointA.x; // Same column
    while (Math.abs(pointB.y - pointA.y) < 3) {
      pointB.y = Math.floor(Math.random() * gridSize) + 1;
    }
  }
  
  let correctDistance: number;
  switch (questionType) {
    case 'horizontal':
      correctDistance = Math.abs(pointB.x - pointA.x);
      break;
    case 'vertical':
      correctDistance = Math.abs(pointB.y - pointA.y);
      break;
    case 'manhattan':
      correctDistance = manhattanDistance(pointA, pointB);
      break;
  }
  
  const landmarkPairs = [
    ['🏠 Home', '💎 Diamond Mine'],
    ['⚓ Harbor', '🏰 Castle'],
    ['🌴 Oasis', '⛰️ Mountain'],
    ['🗿 Monument', '🎪 Camp'],
  ];
  const pair = landmarkPairs[Math.floor(Math.random() * landmarkPairs.length)];
  
  return {
    pointA,
    pointB,
    labelA: pair[0],
    labelB: pair[1],
    correctDistance,
    playerAnswer: '',
    questionType
  };
};

export const useTreasureMapStore = create<TreasureMapState>((set, get) => ({
  phase: 'plotting',
  score: 0,
  streak: 0,
  challengeIndex: 0,
  totalChallenges: 3,
  isPhaseCorrect: false,
  showPhaseComplete: false,
  gameComplete: false,
  gridSize: 10, // 10x10 grid for hard level
  
  plottingChallenge: null,
  pathChallenge: null,
  distanceChallenge: null,
  
  hintsRemaining: 3,
  currentHint: null,
  
  generateChallenge: () => {
    const { phase, gridSize } = get();
    
    switch (phase) {
      case 'plotting':
        set({ 
          plottingChallenge: generatePlottingChallenge(gridSize),
          isPhaseCorrect: false,
          currentHint: null
        });
        break;
      case 'pathfinding':
        set({ 
          pathChallenge: generatePathChallenge(gridSize),
          isPhaseCorrect: false,
          currentHint: null
        });
        break;
      case 'distance':
        set({ 
          distanceChallenge: generateDistanceChallenge(gridSize),
          isPhaseCorrect: false,
          currentHint: null
        });
        break;
    }
  },
  
  plotCoordinate: (coord) => {
    const challenge = get().plottingChallenge;
    if (!challenge) return false;
    
    const currentIndex = challenge.currentPlotIndex;
    if (currentIndex >= challenge.targetCoordinates.length) return false;
    
    const target = challenge.targetCoordinates[currentIndex];
    const isCorrect = coord.x === target.x && coord.y === target.y;
    
    if (isCorrect) {
      const newPlacements = [...challenge.playerPlacements];
      newPlacements[currentIndex] = coord;
      
      const allPlaced = currentIndex + 1 >= challenge.targetCoordinates.length;
      
      set({ 
        plottingChallenge: { 
          ...challenge, 
          playerPlacements: newPlacements,
          currentPlotIndex: currentIndex + 1
        },
        isPhaseCorrect: allPlaced,
        score: get().score + 50,
        streak: get().streak + 1
      });
    } else {
      set({ streak: 0 });
    }
    
    return isCorrect;
  },
  
  validatePlotting: () => {
    const challenge = get().plottingChallenge;
    if (!challenge) return false;
    
    const allCorrect = challenge.playerPlacements.every((p, i) => {
      if (!p) return false;
      const target = challenge.targetCoordinates[i];
      return p.x === target.x && p.y === target.y;
    });
    
    if (allCorrect) {
      set({ isPhaseCorrect: true });
    }
    
    return allCorrect;
  },
  
  addToPath: (coord) => {
    const challenge = get().pathChallenge;
    if (!challenge || get().isPhaseCorrect) return;
    
    const path = challenge.playerPath;
    const lastPoint = path[path.length - 1];
    
    // Check if adjacent to last point
    if (!areAdjacent(lastPoint, coord)) return;
    
    // Check if not an obstacle
    if (isObstacle(coord, challenge.obstacles)) return;
    
    // Check if not already in path (no backtracking except last point)
    if (path.some(p => p.x === coord.x && p.y === coord.y)) return;
    
    // Check bounds
    const gridSize = get().gridSize;
    if (coord.x < 1 || coord.x > gridSize || coord.y < 1 || coord.y > gridSize) return;
    
    set({
      pathChallenge: {
        ...challenge,
        playerPath: [...path, coord]
      }
    });
  },
  
  removeLastFromPath: () => {
    const challenge = get().pathChallenge;
    if (!challenge || challenge.playerPath.length <= 1) return;
    
    set({
      pathChallenge: {
        ...challenge,
        playerPath: challenge.playerPath.slice(0, -1)
      }
    });
  },
  
  clearPath: () => {
    const challenge = get().pathChallenge;
    if (!challenge) return;
    
    set({
      pathChallenge: {
        ...challenge,
        playerPath: [challenge.startPoint]
      }
    });
  },
  
  validatePath: () => {
    const challenge = get().pathChallenge;
    if (!challenge) return false;
    
    const path = challenge.playerPath;
    const lastPoint = path[path.length - 1];
    
    // Check if reached end
    const reachedEnd = lastPoint.x === challenge.endPoint.x && lastPoint.y === challenge.endPoint.y;
    
    // Check if visited all waypoints
    const visitedWaypoints = challenge.waypoints.every(wp =>
      path.some(p => p.x === wp.coord.x && p.y === wp.coord.y)
    );
    
    // Check path length is reasonable
    const reasonablePath = path.length <= challenge.optimalPathLength + 5;
    
    const isValid = reachedEnd && visitedWaypoints && reasonablePath;
    
    if (isValid) {
      const bonus = Math.max(0, (challenge.optimalPathLength - path.length + 5) * 20);
      set({
        isPhaseCorrect: true,
        score: get().score + 150 + bonus,
        streak: get().streak + 1
      });
    } else {
      set({ streak: 0 });
    }
    
    return isValid;
  },
  
  setDistanceAnswer: (answer) => {
    const challenge = get().distanceChallenge;
    if (!challenge) return;
    set({ distanceChallenge: { ...challenge, playerAnswer: answer } });
  },
  
  appendToDistanceAnswer: (digit) => {
    const challenge = get().distanceChallenge;
    if (!challenge || challenge.playerAnswer.length >= 3) return;
    set({ distanceChallenge: { ...challenge, playerAnswer: challenge.playerAnswer + digit } });
  },
  
  clearDistanceAnswer: () => {
    const challenge = get().distanceChallenge;
    if (!challenge) return;
    set({ distanceChallenge: { ...challenge, playerAnswer: '' } });
  },
  
  validateDistance: () => {
    const challenge = get().distanceChallenge;
    if (!challenge) return false;
    
    const playerNum = parseInt(challenge.playerAnswer, 10);
    const isCorrect = playerNum === challenge.correctDistance;
    
    if (isCorrect) {
      set({
        isPhaseCorrect: true,
        score: get().score + 100,
        streak: get().streak + 1
      });
    } else {
      set({ streak: 0 });
    }
    
    return isCorrect;
  },
  
  advancePhase: () => {
    const { phase } = get();
    
    if (phase === 'plotting') {
      set({ 
        phase: 'pathfinding', 
        challengeIndex: 0,
        isPhaseCorrect: false,
        showPhaseComplete: false
      });
      get().generateChallenge();
    } else if (phase === 'pathfinding') {
      set({ 
        phase: 'distance', 
        challengeIndex: 0,
        isPhaseCorrect: false,
        showPhaseComplete: false
      });
      get().generateChallenge();
    } else {
      set({ gameComplete: true, showPhaseComplete: false });
    }
  },
  
  nextChallenge: () => {
    const { challengeIndex, totalChallenges } = get();
    
    if (challengeIndex + 1 >= totalChallenges) {
      set({ showPhaseComplete: true });
    } else {
      set({ challengeIndex: challengeIndex + 1, isPhaseCorrect: false });
      get().generateChallenge();
    }
  },
  
  dismissPhaseComplete: () => {
    set({ showPhaseComplete: false });
    get().advancePhase();
  },
  
  resetGame: () => {
    set({
      phase: 'plotting',
      score: 0,
      streak: 0,
      challengeIndex: 0,
      isPhaseCorrect: false,
      showPhaseComplete: false,
      gameComplete: false,
      plottingChallenge: null,
      pathChallenge: null,
      distanceChallenge: null,
      hintsRemaining: 3,
      currentHint: null
    });
    get().generateChallenge();
  },
  
  useHint: () => {
    const { hintsRemaining, phase, plottingChallenge, pathChallenge, distanceChallenge } = get();
    
    if (hintsRemaining <= 0) return null;
    
    let hint = '';
    
    switch (phase) {
      case 'plotting':
        if (plottingChallenge) {
          const currentIdx = plottingChallenge.currentPlotIndex;
          if (currentIdx < plottingChallenge.targetCoordinates.length) {
            const target = plottingChallenge.targetCoordinates[currentIdx];
            hint = `Look for column ${target.x} and row ${target.y}. The x-coordinate tells you how far right, the y-coordinate tells you how far up!`;
          }
        }
        break;
      
      case 'pathfinding':
        if (pathChallenge) {
          const unvisited = pathChallenge.waypoints.find(wp =>
            !pathChallenge.playerPath.some(p => p.x === wp.coord.x && p.y === wp.coord.y)
          );
          if (unvisited) {
            hint = `You need to collect the ${unvisited.label} at (${unvisited.coord.x}, ${unvisited.coord.y})! Navigate there first.`;
          } else {
            hint = `Head towards the treasure at (${pathChallenge.endPoint.x}, ${pathChallenge.endPoint.y})!`;
          }
        }
        break;
      
      case 'distance':
        if (distanceChallenge) {
          const { questionType, pointA, pointB } = distanceChallenge;
          if (questionType === 'horizontal') {
            hint = `For horizontal distance, count the squares from x=${pointA.x} to x=${pointB.x}. Subtract the smaller from the larger!`;
          } else if (questionType === 'vertical') {
            hint = `For vertical distance, count the squares from y=${pointA.y} to y=${pointB.y}. Subtract the smaller from the larger!`;
          } else {
            hint = `Total distance = horizontal steps + vertical steps. Count from (${pointA.x}, ${pointA.y}) to (${pointB.x}, ${pointB.y}).`;
          }
        }
        break;
    }
    
    set({ hintsRemaining: hintsRemaining - 1, currentHint: hint });
    return hint;
  }
}));
