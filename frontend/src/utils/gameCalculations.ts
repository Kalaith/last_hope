import type { GameState, Resources } from '../types/game';

export interface OfflineEarningsResult {
  resources: Partial<Resources>;
  experience: number;
  totalValue: number;
  timeOffline: number;
}

export const calculateOfflineEarnings = (
  timeOffline: number,
  gameState: GameState
): OfflineEarningsResult => {
  const hoursOffline = timeOffline / (1000 * 60 * 60);
  const maxOfflineHours = 24; // Cap at 24 hours
  const effectiveHours = Math.min(hoursOffline, maxOfflineHours);

  // Base earnings rate depends on game progress
  const baseRate = gameState.restorationProgress + 1;
  const hopeMultiplier = gameState.playerHope / 100;
  const effectiveRate = baseRate * hopeMultiplier;

  const offlineEarnings: OfflineEarningsResult = {
    resources: {
      food: Math.floor(effectiveRate * effectiveHours * 0.5),
      water: Math.floor(effectiveRate * effectiveHours * 0.3),
      energy: Math.floor(effectiveRate * effectiveHours * 0.2),
      knowledge: Math.floor(effectiveRate * effectiveHours * 0.1),
      seeds: gameState.restorationProgress > 2 ? Math.floor(effectiveHours * 0.1) : 0
    },
    experience: Math.floor(effectiveHours * 10),
    totalValue: 0,
    timeOffline
  };

  // Calculate total value
  offlineEarnings.totalValue = Object.values(offlineEarnings.resources).reduce((sum, val) => sum + val, 0);

  return offlineEarnings;
};

export const calculateLevelRequirement = (level: number): number => {
  const baseXP = 100;
  const multiplier = 1.5;
  return Math.floor(baseXP * Math.pow(multiplier, level - 1));
};

export const checkRequirements = (
  requirements: Record<string, number>,
  gameState: GameState
): boolean => {
  for (const [key, value] of Object.entries(requirements)) {
    if (gameState.resources[key as keyof Resources] < value) {
      return false;
    }
  }
  return true;
};

export const formatTime = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

export const calculateRestorationEfficiency = (gameState: GameState): number => {
  const baseEfficiency = 1;
  const scienceBonus = gameState.skills.science * 0.2;
  const knowledgeBonus = gameState.resources.knowledge * 0.1;
  const hopeBonus = gameState.playerHope / 100;

  return baseEfficiency + scienceBonus + knowledgeBonus + hopeBonus;
};