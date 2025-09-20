import type { GameState } from '../types/game';

export interface MetaAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockCondition: (gameState: GameState, runHistory: RunHistory[]) => boolean;
  reward: {
    type: 'seed_unlock' | 'resource_bonus' | 'npc_favor' | 'knowledge_boost' | 'special_ability';
    value: string | number;
    description: string;
  };
  rarity: 'common' | 'rare' | 'legendary';
  unlocked: boolean;
}

export interface RunHistory {
  id: string;
  endDate: number;
  daysSurvived: number;
  finalResources: {
    hope: number;
    health: number;
    supplies: number;
    knowledge: number;
    seeds: number;
  };
  finalEcosystem: {
    soilHealth: number;
    plantDiversity: number;
    totalPlants: number;
  };
  endCondition: 'victory' | 'hope_lost' | 'starvation' | 'ecosystem_collapse';
  achievementsUnlocked: string[];
  highestTrustLevels: Record<string, number>;
  seedsDiscovered: string[];
  maxSoilHealth: number;
  totalChoicesMade: number;
}

export interface MetaProgressState {
  totalRuns: number;
  bestRun: RunHistory | null;
  achievements: MetaAchievement[];
  unlockedSeeds: string[];
  totalDaysSurvived: number;
  totalKnowledgeGained: number;
  newGamePlusBonuses: {
    startingResources: Record<string, number>;
    unlockedChoices: string[];
    npcStartingTrust: Record<string, number>;
  };
}

export const META_ACHIEVEMENTS: MetaAchievement[] = [
  {
    id: 'first_victory',
    name: 'Green Thumb',
    description: 'Complete your first successful restoration run',
    icon: '🌱',
    unlockCondition: (_, runHistory) => runHistory.some(run => run.endCondition === 'victory'),
    reward: {
      type: 'seed_unlock',
      value: 'resilient_clover',
      description: 'Unlocks Resilient Clover seeds for future runs'
    },
    rarity: 'common',
    unlocked: false
  },
  {
    id: 'master_gardener',
    name: 'Master Gardener',
    description: 'Reach 80+ soil health in a single run',
    icon: '🌳',
    unlockCondition: (gameState) => gameState.ecosystem.soilHealth >= 80,
    reward: {
      type: 'resource_bonus',
      value: 5,
      description: '+5 starting knowledge in future runs'
    },
    rarity: 'rare',
    unlocked: false
  },
  {
    id: 'trusted_leader',
    name: 'Trusted Leader',
    description: 'Achieve maximum trust with all NPCs',
    icon: '🤝',
    unlockCondition: (gameState) =>
      Object.values(gameState.npcs).every(npc => npc.trustLevel >= 90),
    reward: {
      type: 'npc_favor',
      value: 15,
      description: 'Start future runs with +15 trust with all NPCs'
    },
    rarity: 'rare',
    unlocked: false
  },
  {
    id: 'survivor',
    name: 'Against All Odds',
    description: 'Survive 100 days in the wasteland',
    icon: '⏳',
    unlockCondition: (_, runHistory) => runHistory.some(run => run.daysSurvived >= 100),
    reward: {
      type: 'resource_bonus',
      value: 10,
      description: '+10 starting health and supplies in future runs'
    },
    rarity: 'legendary',
    unlocked: false
  },
  {
    id: 'diversity_champion',
    name: 'Biodiversity Champion',
    description: 'Cultivate 8+ different plant species in one run',
    icon: '🌿',
    unlockCondition: (gameState) => gameState.ecosystem.plantDiversity >= 8,
    reward: {
      type: 'seed_unlock',
      value: 'paradise_flower',
      description: 'Unlocks Paradise Flower - the ultimate restoration plant'
    },
    rarity: 'legendary',
    unlocked: false
  },
  {
    id: 'knowledge_seeker',
    name: 'Scholar of the Waste',
    description: 'Accumulate 500+ total knowledge across all runs',
    icon: '📚',
    unlockCondition: (_, runHistory) =>
      runHistory.reduce((total, run) => total + run.finalResources.knowledge, 0) >= 500,
    reward: {
      type: 'special_ability',
      value: 'advanced_choices',
      description: 'Unlocks advanced dialogue options and scientific choices'
    },
    rarity: 'rare',
    unlocked: false
  },
  {
    id: 'hope_bringer',
    name: 'Beacon of Hope',
    description: 'Maintain 80+ hope for an entire run',
    icon: '✨',
    unlockCondition: (_, runHistory) =>
      runHistory.some(run => run.endCondition === 'victory' && run.finalResources.hope >= 80),
    reward: {
      type: 'resource_bonus',
      value: 20,
      description: '+20 starting hope in future runs'
    },
    rarity: 'rare',
    unlocked: false
  },
  {
    id: 'tragic_hero',
    name: 'Tragic Hero',
    description: 'Lose hope after achieving significant progress',
    icon: '💔',
    unlockCondition: (_, runHistory) =>
      runHistory.some(run =>
        run.endCondition === 'hope_lost' &&
        run.maxSoilHealth >= 40 &&
        run.daysSurvived >= 30
      ),
    reward: {
      type: 'knowledge_boost',
      value: 'resilience_understanding',
      description: 'Gain deeper understanding of hope mechanics and warning signs'
    },
    rarity: 'common',
    unlocked: false
  }
];

export class MetaProgressionManager {
  /**
   * Check for newly unlocked achievements based on current game state
   */
  static checkAchievements(
    gameState: GameState,
    runHistory: RunHistory[],
    metaState: MetaProgressState
  ): MetaAchievement[] {
    const newlyUnlocked: MetaAchievement[] = [];

    for (const achievement of metaState.achievements) {
      if (!achievement.unlocked && achievement.unlockCondition(gameState, runHistory)) {
        achievement.unlocked = true;
        newlyUnlocked.push(achievement);

        // Apply achievement reward
        this.applyAchievementReward(achievement, metaState);
      }
    }

    return newlyUnlocked;
  }

  /**
   * Apply the reward from an unlocked achievement
   */
  private static applyAchievementReward(achievement: MetaAchievement, metaState: MetaProgressState): void {
    const { reward } = achievement;

    switch (reward.type) {
      case 'seed_unlock':
        if (!metaState.unlockedSeeds.includes(reward.value as string)) {
          metaState.unlockedSeeds.push(reward.value as string);
        }
        break;

      case 'resource_bonus': {
        const bonusValue = reward.value as number;
        if (achievement.id === 'master_gardener') {
          metaState.newGamePlusBonuses.startingResources.knowledge += bonusValue;
        } else if (achievement.id === 'survivor') {
          metaState.newGamePlusBonuses.startingResources.health += bonusValue;
          metaState.newGamePlusBonuses.startingResources.supplies += bonusValue;
        } else if (achievement.id === 'hope_bringer') {
          metaState.newGamePlusBonuses.startingResources.hope += bonusValue;
        }
        break;
      }

      case 'npc_favor':
        const trustBonus = reward.value as number;
        metaState.newGamePlusBonuses.npcStartingTrust.elena += trustBonus;
        metaState.newGamePlusBonuses.npcStartingTrust.marcus += trustBonus;
        metaState.newGamePlusBonuses.npcStartingTrust.chen += trustBonus;
        break;

      case 'special_ability':
        if (!metaState.newGamePlusBonuses.unlockedChoices.includes(reward.value as string)) {
          metaState.newGamePlusBonuses.unlockedChoices.push(reward.value as string);
        }
        break;

      case 'knowledge_boost':
        // Special knowledge unlocks are tracked in unlocked choices
        if (!metaState.newGamePlusBonuses.unlockedChoices.includes(reward.value as string)) {
          metaState.newGamePlusBonuses.unlockedChoices.push(reward.value as string);
        }
        break;
    }
  }

  /**
   * Complete a run and add it to history
   */
  static completeRun(
    gameState: GameState,
    endCondition: RunHistory['endCondition'],
    metaState: MetaProgressState,
    daysSurvived: number,
    totalChoicesMade: number
  ): RunHistory {
    const runRecord: RunHistory = {
      id: `run_${Date.now()}`,
      endDate: Date.now(),
      daysSurvived,
      finalResources: { ...gameState },
      finalEcosystem: {
        soilHealth: gameState.ecosystem.soilHealth,
        plantDiversity: gameState.ecosystem.plantDiversity,
        totalPlants: gameState.ecosystem.plantInstances.length
      },
      endCondition,
      achievementsUnlocked: [],
      highestTrustLevels: Object.fromEntries(
        Object.entries(gameState.npcs).map(([id, npc]) => [id, npc.trustLevel])
      ),
      seedsDiscovered: Array.from(new Set(
        gameState.ecosystem.plantInstances.map(plant => plant.species)
      )),
      maxSoilHealth: gameState.ecosystem.soilHealth,
      totalChoicesMade
    };

    // Update meta progression stats
    metaState.totalRuns++;
    metaState.totalDaysSurvived += daysSurvived;
    metaState.totalKnowledgeGained += gameState.knowledge;

    // Update best run if applicable
    if (!metaState.bestRun || this.isRunBetter(runRecord, metaState.bestRun)) {
      metaState.bestRun = runRecord;
    }

    return runRecord;
  }

  /**
   * Determine if one run is better than another
   */
  private static isRunBetter(newRun: RunHistory, currentBest: RunHistory): boolean {
    // Victory beats non-victory
    if (newRun.endCondition === 'victory' && currentBest.endCondition !== 'victory') {
      return true;
    }
    if (newRun.endCondition !== 'victory' && currentBest.endCondition === 'victory') {
      return false;
    }

    // If both are victories or both are failures, compare by days survived
    if (newRun.daysSurvived !== currentBest.daysSurvived) {
      return newRun.daysSurvived > currentBest.daysSurvived;
    }

    // If days are equal, compare by final soil health
    return newRun.finalEcosystem.soilHealth > currentBest.finalEcosystem.soilHealth;
  }

  /**
   * Get starting bonuses for a new game plus run
   */
  static getNewGamePlusBonuses(metaState: MetaProgressState): Partial<GameState> {
    const bonuses = metaState.newGamePlusBonuses;

    return {
      hope: Math.min(100, 50 + (bonuses.startingResources.hope || 0)),
      health: Math.min(100, 80 + (bonuses.startingResources.health || 0)),
      supplies: Math.min(100, 25 + (bonuses.startingResources.supplies || 0)),
      knowledge: Math.min(100, 10 + (bonuses.startingResources.knowledge || 0)),
      seeds: Math.min(50, 3 + (bonuses.startingResources.seeds || 0))
    };
  }

  /**
   * Check if a choice should be available based on meta progression
   */
  static isChoiceUnlocked(choiceId: string, metaState: MetaProgressState): boolean {
    return metaState.newGamePlusBonuses.unlockedChoices.includes(choiceId);
  }

  /**
   * Get available plant species including unlocked ones
   */
  static getAvailableSeeds(metaState: MetaProgressState): string[] {
    const baseSeeds = ['hardy_grass', 'scrub_herb', 'thorn_bush'];
    return [...baseSeeds, ...metaState.unlockedSeeds];
  }

  /**
   * Calculate prestige score for display
   */
  static calculatePrestigeScore(metaState: MetaProgressState): number {
    let score = 0;

    score += metaState.totalRuns * 10;
    score += metaState.totalDaysSurvived;
    score += metaState.achievements.filter(a => a.unlocked).length * 50;
    score += metaState.achievements.filter(a => a.unlocked && a.rarity === 'rare').length * 100;
    score += metaState.achievements.filter(a => a.unlocked && a.rarity === 'legendary').length * 500;

    if (metaState.bestRun?.endCondition === 'victory') {
      score += 1000;
    }

    return score;
  }

  /**
   * Get completion percentage for overall progress
   */
  static getCompletionPercentage(metaState: MetaProgressState): number {
    const totalAchievements = META_ACHIEVEMENTS.length;
    const unlockedAchievements = metaState.achievements.filter(a => a.unlocked).length;
    return Math.floor((unlockedAchievements / totalAchievements) * 100);
  }
}