// questionGenerators removed — kept small exports to avoid breaking imports during cleanup
export type GameKey = 'story-builder' | 'toy-tycoon' | 'shape-explorer' | 'hundred-architect' | 'time-planner';

export function generateQuestions(_game: GameKey, _count = 12): string[] {
  return [];
}

export const allGameKeys: GameKey[] = ['story-builder', 'toy-tycoon', 'shape-explorer', 'hundred-architect', 'time-planner'];
