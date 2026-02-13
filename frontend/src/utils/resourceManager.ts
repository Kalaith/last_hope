import type { GameState, CoreResources } from '../types/game';
import { ScarcityManager } from './scarcityManager';
import {
  resourceCriticalThresholds,
  resourceWarningThresholds,
  dailyConsumptionRates
} from '../constants/gameConstants';

// Re-export for backward compatibility
export const resourceThresholds = resourceCriticalThresholds;
export const dailyConsumption = {
  supplies: dailyConsumptionRates.SUPPLIES_BASE,
  health: dailyConsumptionRates.HEALTH_NATURAL_LOSS,
  hope: dailyConsumptionRates.HOPE_NATURAL_DECAY
} as const;

export interface ResourceCheckResult {
  type: 'critical' | 'warning' | 'normal';
  message?: string;
  consequences?: string[];
}

export class ResourceManager {
  /**
   * Check resource levels and return warnings/consequences
   */
  static checkResourceStatus(gameState: GameState): Record<keyof CoreResources, ResourceCheckResult> {
    return {
      hope: this.checkHope(gameState.hope),
      health: this.checkHealth(gameState.health),
      supplies: this.checkSupplies(gameState.supplies),
      knowledge: this.checkKnowledge(gameState.knowledge),
      seeds: this.checkSeeds(gameState.seeds)
    };
  }

  private static checkHope(hope: number): ResourceCheckResult {
    if (hope <= resourceThresholds.HOPE_GAME_OVER) {
      return {
        type: 'critical',
        message: 'All hope is lost. The weight of despair crushes your spirit.',
        consequences: ['Game Over']
      };
    }
    if (hope <= resourceThresholds.HOPE_CRITICAL) {
      return {
        type: 'critical',
        message: 'Your hope is nearly extinguished. NPCs are losing faith in you.',
        consequences: ['NPCs become hostile', 'Refuse cooperation', 'Bad dialogue options only']
      };
    }
    if (hope <= resourceWarningThresholds.HOPE_LOW) {
      return {
        type: 'warning',
        message: 'Hope is running low. You struggle to maintain optimism.',
        consequences: ['Reduced NPC trust gains', 'Pessimistic dialogue options']
      };
    }
    return { type: 'normal' };
  }

  private static checkHealth(health: number): ResourceCheckResult {
    if (health <= resourceThresholds.HEALTH_CRITICAL) {
      return {
        type: 'critical',
        message: 'Your body is failing. Every action feels like a monumental effort.',
        consequences: ['Reduced action success rates', 'Slower plant growth', 'Illness events']
      };
    }
    if (health <= resourceWarningThresholds.HEALTH_LOW) {
      return {
        type: 'warning',
        message: 'You feel weak and tired. The harsh environment is taking its toll.',
        consequences: ['Slightly reduced efficiency', 'Increased rest requirements']
      };
    }
    return { type: 'normal' };
  }

  private static checkSupplies(supplies: number): ResourceCheckResult {
    if (supplies <= resourceThresholds.SUPPLIES_CRITICAL) {
      return {
        type: 'critical',
        message: 'Supplies are nearly exhausted. Starvation and dehydration threaten everyone.',
        consequences: ['Daily health loss', 'NPCs consider leaving', 'Desperate choices emerge']
      };
    }
    if (supplies <= 25) {
      return {
        type: 'warning',
        message: 'Supplies are running low. Rationing has become necessary.',
        consequences: ['Increased tension with NPCs', 'More frequent supply choices']
      };
    }
    return { type: 'normal' };
  }

  private static checkKnowledge(knowledge: number): ResourceCheckResult {
    if (knowledge < resourceThresholds.KNOWLEDGE_MIN) {
      return {
        type: 'critical',
        message: 'Your understanding of restoration techniques is severely limited.',
        consequences: ['Locked out of advanced plant species', 'No science dialogue', 'Suboptimal choices']
      };
    }
    if (knowledge < 15) {
      return {
        type: 'warning',
        message: 'Your knowledge of restoration is basic. Learning would help.',
        consequences: ['Limited dialogue options', 'Reduced choice effectiveness']
      };
    }
    return { type: 'normal' };
  }

  private static checkSeeds(seeds: number): ResourceCheckResult {
    if (seeds <= resourceThresholds.SEEDS_DEPLETED) {
      return {
        type: 'critical',
        message: 'No seeds remain. The future of restoration hangs in the balance.',
        consequences: ['Cannot plant new species', 'Restoration progress halts', 'Hopelessness spiral']
      };
    }
    if (seeds <= 2) {
      return {
        type: 'warning',
        message: 'Only a few precious seeds remain. Use them wisely.',
        consequences: ['Limited planting options', 'High stakes decisions']
      };
    }
    return { type: 'normal' };
  }

  /**
   * Apply daily resource consumption
   */
  static applyDailyConsumption(gameState: GameState): Partial<GameState> {
    // Check for scarcity events first
    ScarcityManager.checkScarcityEvents(gameState);

    // Apply scarcity effects
    const scarcityEffects = ScarcityManager.processDailyEffects();

    const newSupplies = Math.max(0, gameState.supplies - dailyConsumption.supplies + (scarcityEffects.supplies || 0));
    let newHealth = gameState.health + (scarcityEffects.health || 0);
    let newHope = gameState.hope + (scarcityEffects.hope || 0);
    const newSeeds = gameState.seeds + (scarcityEffects.seeds || 0);
    const newKnowledge = gameState.knowledge + (scarcityEffects.knowledge || 0);

    // Health loss from low supplies
    if (newSupplies <= resourceThresholds.SUPPLIES_CRITICAL) {
      newHealth = Math.max(0, newHealth - 5); // Accelerated health loss from starvation
    } else {
      newHealth = Math.max(0, newHealth - dailyConsumption.health);
    }

    // Hope decay from harsh conditions
    newHope = Math.max(0, newHope - dailyConsumption.hope);

    // Ecosystem affects hope and health
    if (gameState.ecosystem.soilHealth > 50) {
      newHope = Math.min(100, newHope + 2); // Seeing progress boosts hope
    }

    // Clamp all values to valid ranges
    return {
      supplies: Math.max(0, Math.min(100, newSupplies)),
      health: Math.max(0, Math.min(100, newHealth)),
      hope: Math.max(0, Math.min(100, newHope)),
      seeds: Math.max(0, Math.min(50, newSeeds)),
      knowledge: Math.max(0, Math.min(100, newKnowledge))
    };
  }

  /**
   * Check if choice requirements are met
   */
  static canAffordChoice(gameState: GameState, requirements?: Partial<CoreResources>): boolean {
    if (!requirements) return true;

    for (const [resource, required] of Object.entries(requirements)) {
      const current = gameState[resource as keyof CoreResources];
      if (current < required) {
        return false;
      }
    }
    return true;
  }

  /**
   * Apply choice consequences to game state
   */
  static applyConsequences(
    gameState: GameState,
    consequences: Record<string, number>
  ): Partial<GameState> {
    const updates: Partial<GameState> = {};

    for (const [key, value] of Object.entries(consequences)) {
      if (key === 'hope') {
        updates.hope = Math.max(0, Math.min(100, gameState.hope + value));
      } else if (key === 'health') {
        updates.health = Math.max(0, Math.min(100, gameState.health + value));
      } else if (key === 'supplies') {
        updates.supplies = Math.max(0, Math.min(100, gameState.supplies + value));
      } else if (key === 'knowledge') {
        updates.knowledge = Math.max(0, Math.min(100, gameState.knowledge + value));
      } else if (key === 'seeds') {
        updates.seeds = Math.max(0, Math.min(50, gameState.seeds + value));
      } else if (key === 'soilHealth') {
        updates.ecosystem = {
          ...gameState.ecosystem,
          soilHealth: Math.max(0, Math.min(100, gameState.ecosystem.soilHealth + value))
        };
      } else if (key === 'restorationProgress') {
        updates.restorationProgress = Math.max(0, gameState.restorationProgress + value);
      }
    }

    return updates;
  }

  /**
   * Get resource display color based on level
   */
  static getResourceColor(resource: keyof CoreResources, value: number): string {
    const thresholds = {
      hope: { critical: resourceThresholds.HOPE_CRITICAL, warning: 40 },
      health: { critical: resourceThresholds.HEALTH_CRITICAL, warning: 50 },
      supplies: { critical: resourceThresholds.SUPPLIES_CRITICAL, warning: 25 },
      knowledge: { critical: resourceThresholds.KNOWLEDGE_MIN, warning: 15 },
      seeds: { critical: resourceThresholds.SEEDS_DEPLETED, warning: 2 }
    };

    const threshold = thresholds[resource];

    if (value <= threshold.critical) {
      return 'var(--color-terminal-red)';
    } else if (value <= threshold.warning) {
      return 'var(--color-terminal-amber)';
    } else {
      return 'var(--color-terminal-green)';
    }
  }

  /**
   * Simulate daily resource changes and consequences
   */
  static simulateDay(gameState: GameState): {
    resourceUpdates: Partial<GameState>;
    ecosystemUpdates: Partial<GameState['ecosystem']>;
    npcUpdates: Partial<GameState['npcs']>;
  } {
    const resourceUpdates = this.applyDailyConsumption(gameState);
    const ecosystemUpdates: Partial<GameState['ecosystem']> = {};
    const npcUpdates: Partial<GameState['npcs']> = {};

    // Weather effects on resources
    if (gameState.ecosystem?.weatherPattern === 'drought') {
      resourceUpdates.hope = Math.max(0, (resourceUpdates.hope || gameState.hope) - 1);
    } else if (gameState.ecosystem?.weatherPattern === 'storm') {
      resourceUpdates.supplies = Math.max(0, (resourceUpdates.supplies || gameState.supplies) - 2);
    }

    return {
      resourceUpdates,
      ecosystemUpdates,
      npcUpdates
    };
  }
}
