import type { GameData } from '../types/game';
import { initialGameState } from './initialGameState';
import { characterBackgrounds } from './characterBackgrounds';
import { storyScenes } from './scenes';
import { endingConditions } from './endingConditions';

export const gameData: GameData = {
  gameState: initialGameState,
  characterBackgrounds,
  storyScenes,
  endingConditions
};

// Re-export individual modules for direct access if needed
export { initialGameState } from './initialGameState';
export { characterBackgrounds } from './characterBackgrounds';
export { storyScenes } from './scenes';
export { endingConditions } from './endingConditions';