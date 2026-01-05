import { create } from 'zustand';

// Types
interface CargoBox {
  id: string;
  weight: number;
  color: string;
  size: 'small' | 'medium' | 'large';
  loaded: boolean;
}

interface CargoChallenge {
  truckCapacity: number;
  boxes: CargoBox[];
  currentLoad: number;
  optimalLoad: number;
}

interface BalanceChallenge {
  targetWeight: number;
  availableWeights: number[];
  placedWeights: number[];
  minimumMoves: number;
}

interface BreakerChallenge {
  targetNumber: number;
  breakType: 'place-value' | 'two-parts' | 'multi-parts';
  fragments: number[];
  requiredParts: number;
  constraints?: {
    mustInclude?: number;
  };
}

interface Truck {
  id: string;
  capacity: number;
  color: string;
  currentLoad: number;
  packages: string[];
}

interface Package {
  id: string;
  weight: number;
  destination: string;
  color: string;
  assignedTruck: string | null;
}

interface DeliveryChallenge {
  trucks: Truck[];
  packages: Package[];
  optimalTruckCount: number;
}

type Phase = 'cargo-loader' | 'weight-balancer' | 'number-breaker' | 'delivery-planner';

interface WeightWarehouseState {
  phase: Phase;
  level: number;
  score: number;
  totalScore: number;
  streak: number;
  showInstructions: boolean;
  showSuccess: boolean;
  showHint: boolean;
  hintMessage: string;
  hintsUsed: number;
  
  cargoChallenge: CargoChallenge | null;
  balanceChallenge: BalanceChallenge | null;
  breakerChallenge: BreakerChallenge | null;
  deliveryChallenge: DeliveryChallenge | null;
  
  setPhase: (phase: Phase) => void;
  initializePhase: (phase: Phase) => void;
  
  // Cargo Loader
  loadBox: (boxId: string) => void;
  unloadBox: (boxId: string) => void;
  
  // Weight Balancer
  addWeight: (weight: number) => void;
  removeWeight: (index: number) => void;
  
  // Number Breaker
  submitFragment: (value: number) => void;
  resetFragments: () => void;
  
  // Delivery Planner
  assignPackage: (packageId: string, truckId: string) => void;
  unassignPackage: (packageId: string) => void;
  
  checkSolution: () => boolean;
  nextChallenge: () => void;
  showHintMessage: () => void;
  hideHint: () => void;
  resetGame: () => void;
  dismissInstructions: () => void;
  dismissSuccess: () => void;
}

// Helper functions
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const BOX_COLORS = ['#AED6F1', '#85C1E9', '#5DADE2', '#3498DB', '#2E86C1', '#1A5276'];
const TRUCK_COLORS = ['#E74C3C', '#3498DB', '#27AE60', '#F39C12'];
const DESTINATIONS = ['Market', 'School', 'Hospital', 'Factory', 'Store', 'Warehouse'];

function generateCargoChallenge(level: number): CargoChallenge {
  const capacity = randomInt(50 + level * 15, 80 + level * 25);
  const boxCount = randomInt(6, 8 + Math.floor(level / 2));
  
  const boxes: CargoBox[] = [];
  let totalOptimal = 0;
  
  // Generate boxes ensuring a good solution exists
  for (let i = 0; i < boxCount; i++) {
    const weight = randomInt(5 + level * 2, 15 + level * 5);
    const colorIndex = Math.min(Math.floor((weight / (20 + level * 5)) * BOX_COLORS.length), BOX_COLORS.length - 1);
    
    boxes.push({
      id: `box-${i}`,
      weight,
      color: BOX_COLORS[colorIndex],
      size: weight < 15 ? 'small' : weight < 30 ? 'medium' : 'large',
      loaded: false
    });
    
    if (totalOptimal + weight <= capacity) {
      totalOptimal += weight;
    }
  }
  
  return {
    truckCapacity: capacity,
    boxes,
    currentLoad: 0,
    optimalLoad: totalOptimal
  };
}

function greedyDecompose(target: number, denominations: number[]): number[] {
  const result: number[] = [];
  let remaining = target;
  const sorted = [...denominations].sort((a, b) => b - a);
  
  for (const denom of sorted) {
    while (remaining >= denom) {
      result.push(denom);
      remaining -= denom;
    }
  }
  
  return result;
}

function generateBalanceChallenge(level: number): BalanceChallenge {
  const target = randomInt(15 + level * 10, 30 + level * 15);
  const denominations = [1, 2, 5, 10, 20];
  
  if (level > 3) denominations.push(50);
  
  const solution = greedyDecompose(target, denominations);
  
  // Add some extra weights as decoys
  const extras: number[] = [];
  for (let i = 0; i < 3 + level; i++) {
    extras.push(denominations[randomInt(0, denominations.length - 1)]);
  }
  
  const allWeights = [...solution, ...extras].sort(() => Math.random() - 0.5);
  
  return {
    targetWeight: target,
    availableWeights: allWeights,
    placedWeights: [],
    minimumMoves: solution.length
  };
}

function generateBreakerChallenge(level: number): BreakerChallenge {
  const breakTypes: Array<'place-value' | 'two-parts' | 'multi-parts'> = ['place-value', 'two-parts', 'multi-parts'];
  const breakType = breakTypes[level % 3];
  
  let targetNumber: number;
  let requiredParts: number;
  
  switch (breakType) {
    case 'place-value':
      targetNumber = randomInt(100 + level * 50, 500 + level * 200);
      requiredParts = String(targetNumber).length;
      break;
    case 'two-parts':
      targetNumber = randomInt(50 + level * 30, 200 + level * 100);
      requiredParts = 2;
      break;
    case 'multi-parts':
      targetNumber = randomInt(100 + level * 50, 300 + level * 100);
      requiredParts = randomInt(3, 4);
      break;
  }
  
  return {
    targetNumber,
    breakType,
    fragments: [],
    requiredParts
  };
}

function generateDeliveryChallenge(level: number): DeliveryChallenge {
  const truckCount = Math.min(2 + Math.floor(level / 2), 4);
  
  const trucks: Truck[] = [];
  let totalCapacity = 0;
  
  for (let i = 0; i < truckCount; i++) {
    const capacity = randomInt(80 + level * 20, 150 + level * 30);
    trucks.push({
      id: `truck-${i}`,
      capacity,
      color: TRUCK_COLORS[i],
      currentLoad: 0,
      packages: []
    });
    totalCapacity += capacity;
  }
  
  // Generate packages that can fit (70% of total capacity)
  const packageCount = randomInt(6, 8 + level);
  const targetTotal = Math.floor(totalCapacity * 0.7);
  const avgWeight = Math.floor(targetTotal / packageCount);
  
  const packages: Package[] = [];
  for (let i = 0; i < packageCount; i++) {
    const weight = randomInt(Math.max(10, avgWeight - 20), avgWeight + 20);
    packages.push({
      id: `pkg-${i}`,
      weight,
      destination: DESTINATIONS[randomInt(0, DESTINATIONS.length - 1)],
      color: `hsl(${(i * 40) % 360}, 70%, 60%)`,
      assignedTruck: null
    });
  }
  
  return {
    trucks,
    packages,
    optimalTruckCount: truckCount
  };
}

function getHintForPhase(phase: Phase, state: WeightWarehouseState): string {
  switch (phase) {
    case 'cargo-loader':
      if (state.cargoChallenge) {
        const remaining = state.cargoChallenge.truckCapacity - state.cargoChallenge.currentLoad;
        const fittingBoxes = state.cargoChallenge.boxes.filter(b => !b.loaded && b.weight <= remaining);
        if (fittingBoxes.length > 0) {
          return `You have ${remaining}kg capacity left. The ${fittingBoxes[0].weight}kg box would fit!`;
        }
        return `No more boxes fit. You've loaded ${state.cargoChallenge.currentLoad}kg. Try clicking Done!`;
      }
      break;
    case 'weight-balancer':
      if (state.balanceChallenge) {
        const currentSum = state.balanceChallenge.placedWeights.reduce((a, b) => a + b, 0);
        const needed = state.balanceChallenge.targetWeight - currentSum;
        if (needed > 0) {
          return `You need ${needed}kg more to balance. Look for that weight!`;
        } else if (needed < 0) {
          return `Too heavy! Remove ${Math.abs(needed)}kg from the right side.`;
        }
        return `Perfect balance! Click Done to continue.`;
      }
      break;
    case 'number-breaker':
      if (state.breakerChallenge) {
        const { targetNumber, breakType, fragments } = state.breakerChallenge;
        const currentSum = fragments.reduce((a, b) => a + b, 0);
        if (breakType === 'place-value') {
          const digits = String(targetNumber).split('');
          return `Break ${targetNumber} by place value. The ${digits[0]} is in the ${['hundreds', 'thousands'][digits.length - 3] || 'tens'} place!`;
        }
        return `You need numbers that add up to ${targetNumber}. Current sum: ${currentSum}`;
      }
      break;
    case 'delivery-planner':
      if (state.deliveryChallenge) {
        const unassigned = state.deliveryChallenge.packages.filter(p => !p.assignedTruck);
        const overloaded = state.deliveryChallenge.trucks.filter(t => t.currentLoad > t.capacity);
        if (overloaded.length > 0) {
          return `The ${overloaded[0].color} truck is overloaded by ${overloaded[0].currentLoad - overloaded[0].capacity}kg!`;
        }
        if (unassigned.length > 0) {
          return `${unassigned.length} packages still need to be assigned to trucks.`;
        }
        return `All packages assigned! Click Done to deliver.`;
      }
      break;
  }
  return 'Keep going! You\'re doing great!';
}

export const useWeightWarehouseStore = create<WeightWarehouseState>((set, get) => ({
  phase: 'cargo-loader',
  level: 1,
  score: 0,
  totalScore: 0,
  streak: 0,
  showInstructions: true,
  showSuccess: false,
  showHint: false,
  hintMessage: '',
  hintsUsed: 0,
  
  cargoChallenge: generateCargoChallenge(1),
  balanceChallenge: null,
  breakerChallenge: null,
  deliveryChallenge: null,
  
  setPhase: (phase) => {
    set({ phase, showInstructions: true });
    get().initializePhase(phase);
  },
  
  initializePhase: (phase) => {
    const { level } = get();
    switch (phase) {
      case 'cargo-loader':
        set({ cargoChallenge: generateCargoChallenge(level) });
        break;
      case 'weight-balancer':
        set({ balanceChallenge: generateBalanceChallenge(level) });
        break;
      case 'number-breaker':
        set({ breakerChallenge: generateBreakerChallenge(level) });
        break;
      case 'delivery-planner':
        set({ deliveryChallenge: generateDeliveryChallenge(level) });
        break;
    }
  },
  
  loadBox: (boxId) => {
    const { cargoChallenge } = get();
    if (!cargoChallenge) return;
    
    const box = cargoChallenge.boxes.find(b => b.id === boxId);
    if (!box || box.loaded) return;
    
    const newLoad = cargoChallenge.currentLoad + box.weight;
    if (newLoad > cargoChallenge.truckCapacity) {
      // Overload - don't allow
      return;
    }
    
    set({
      cargoChallenge: {
        ...cargoChallenge,
        boxes: cargoChallenge.boxes.map(b => 
          b.id === boxId ? { ...b, loaded: true } : b
        ),
        currentLoad: newLoad
      },
      score: get().score + 10
    });
  },
  
  unloadBox: (boxId) => {
    const { cargoChallenge } = get();
    if (!cargoChallenge) return;
    
    const box = cargoChallenge.boxes.find(b => b.id === boxId);
    if (!box || !box.loaded) return;
    
    set({
      cargoChallenge: {
        ...cargoChallenge,
        boxes: cargoChallenge.boxes.map(b => 
          b.id === boxId ? { ...b, loaded: false } : b
        ),
        currentLoad: cargoChallenge.currentLoad - box.weight
      }
    });
  },
  
  addWeight: (weight) => {
    const { balanceChallenge } = get();
    if (!balanceChallenge) return;
    
    set({
      balanceChallenge: {
        ...balanceChallenge,
        placedWeights: [...balanceChallenge.placedWeights, weight]
      }
    });
  },
  
  removeWeight: (index) => {
    const { balanceChallenge } = get();
    if (!balanceChallenge) return;
    
    const newPlaced = [...balanceChallenge.placedWeights];
    newPlaced.splice(index, 1);
    
    set({
      balanceChallenge: {
        ...balanceChallenge,
        placedWeights: newPlaced
      }
    });
  },
  
  submitFragment: (value) => {
    const { breakerChallenge } = get();
    if (!breakerChallenge) return;
    
    const currentSum = breakerChallenge.fragments.reduce((a, b) => a + b, 0);
    if (currentSum + value > breakerChallenge.targetNumber) return;
    
    const newFragments = [...breakerChallenge.fragments, value];
    
    set({
      breakerChallenge: {
        ...breakerChallenge,
        fragments: newFragments
      }
    });
  },
  
  resetFragments: () => {
    const { breakerChallenge } = get();
    if (!breakerChallenge) return;
    
    set({
      breakerChallenge: {
        ...breakerChallenge,
        fragments: []
      }
    });
  },
  
  assignPackage: (packageId, truckId) => {
    const { deliveryChallenge } = get();
    if (!deliveryChallenge) return;
    
    const pkg = deliveryChallenge.packages.find(p => p.id === packageId);
    const truck = deliveryChallenge.trucks.find(t => t.id === truckId);
    if (!pkg || !truck) return;
    
    // Remove from previous truck if assigned
    let updatedTrucks = deliveryChallenge.trucks.map(t => {
      if (t.packages.includes(packageId)) {
        return {
          ...t,
          packages: t.packages.filter(p => p !== packageId),
          currentLoad: t.currentLoad - pkg.weight
        };
      }
      return t;
    });
    
    // Add to new truck
    updatedTrucks = updatedTrucks.map(t => {
      if (t.id === truckId) {
        return {
          ...t,
          packages: [...t.packages, packageId],
          currentLoad: t.currentLoad + pkg.weight
        };
      }
      return t;
    });
    
    set({
      deliveryChallenge: {
        ...deliveryChallenge,
        trucks: updatedTrucks,
        packages: deliveryChallenge.packages.map(p =>
          p.id === packageId ? { ...p, assignedTruck: truckId } : p
        )
      }
    });
  },
  
  unassignPackage: (packageId) => {
    const { deliveryChallenge } = get();
    if (!deliveryChallenge) return;
    
    const pkg = deliveryChallenge.packages.find(p => p.id === packageId);
    if (!pkg || !pkg.assignedTruck) return;
    
    set({
      deliveryChallenge: {
        ...deliveryChallenge,
        trucks: deliveryChallenge.trucks.map(t => {
          if (t.packages.includes(packageId)) {
            return {
              ...t,
              packages: t.packages.filter(p => p !== packageId),
              currentLoad: t.currentLoad - pkg.weight
            };
          }
          return t;
        }),
        packages: deliveryChallenge.packages.map(p =>
          p.id === packageId ? { ...p, assignedTruck: null } : p
        )
      }
    });
  },
  
  checkSolution: () => {
    const { phase, cargoChallenge, balanceChallenge, breakerChallenge, deliveryChallenge } = get();
    
    switch (phase) {
      case 'cargo-loader':
        if (!cargoChallenge) return false;
        return cargoChallenge.currentLoad > 0 && cargoChallenge.currentLoad <= cargoChallenge.truckCapacity;
      
      case 'weight-balancer':
        if (!balanceChallenge) return false;
        const sum = balanceChallenge.placedWeights.reduce((a, b) => a + b, 0);
        return sum === balanceChallenge.targetWeight;
      
      case 'number-breaker':
        if (!breakerChallenge) return false;
        const fragSum = breakerChallenge.fragments.reduce((a, b) => a + b, 0);
        return fragSum === breakerChallenge.targetNumber && 
               breakerChallenge.fragments.length >= 2;
      
      case 'delivery-planner':
        if (!deliveryChallenge) return false;
        const allAssigned = deliveryChallenge.packages.every(p => p.assignedTruck !== null);
        const noneOverloaded = deliveryChallenge.trucks.every(t => t.currentLoad <= t.capacity);
        return allAssigned && noneOverloaded;
      
      default:
        return false;
    }
  },
  
  nextChallenge: () => {
    const { phase, level, score } = get();
    const phases: Phase[] = ['cargo-loader', 'weight-balancer', 'number-breaker', 'delivery-planner'];
    const currentIndex = phases.indexOf(phase);
    
    const bonus = get().checkSolution() ? 25 : 0;
    
    if (currentIndex < phases.length - 1) {
      const nextPhase = phases[currentIndex + 1];
      set({ 
        phase: nextPhase, 
        score: 0, 
        totalScore: get().totalScore + score + bonus,
        showInstructions: true, 
        showSuccess: false,
        streak: get().streak + 1
      });
      get().initializePhase(nextPhase);
    } else {
      // Completed all phases
      set({ 
        phase: 'cargo-loader', 
        level: level + 1, 
        score: 0,
        totalScore: get().totalScore + score + bonus,
        showInstructions: true,
        showSuccess: false,
        streak: get().streak + 1
      });
      get().initializePhase('cargo-loader');
    }
  },
  
  showHintMessage: () => {
    const state = get();
    const hint = getHintForPhase(state.phase, state);
    set({ showHint: true, hintMessage: hint, hintsUsed: state.hintsUsed + 1 });
  },
  
  hideHint: () => set({ showHint: false }),
  
  resetGame: () => {
    set({
      phase: 'cargo-loader',
      level: 1,
      score: 0,
      totalScore: 0,
      streak: 0,
      showInstructions: true,
      showSuccess: false,
      showHint: false,
      hintMessage: '',
      hintsUsed: 0,
      cargoChallenge: generateCargoChallenge(1),
      balanceChallenge: null,
      breakerChallenge: null,
      deliveryChallenge: null
    });
  },
  
  dismissInstructions: () => set({ showInstructions: false }),
  dismissSuccess: () => set({ showSuccess: false })
}));
