import type { GameState } from '../types/game';

export interface ScarcityEvent {
  id: string;
  resource: string;
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  title: string;
  description: string;
  duration: number;
  effects: {
    dailyDrain: number;
    maxCapacity?: number;
    choiceModifiers?: Record<string, number>;
  };
  triggerConditions: (gameState: GameState) => boolean;
}

export interface ResourcePressure {
  resource: string;
  pressure: number; // 0-100, higher = more scarce
  trend: 'improving' | 'stable' | 'worsening';
  timeToDepletion?: number; // days until critical
}

// Define scarcity events that can trigger
export const SCARCITY_EVENTS: ScarcityEvent[] = [
  {
    id: 'water_purifier_failure',
    resource: 'supplies',
    severity: 'severe',
    title: 'Water Purifier Malfunction',
    description: 'The water purification system is failing. Without clean water, supplies are being consumed faster to compensate.',
    duration: 5,
    effects: {
      dailyDrain: 8,
      choiceModifiers: {
        'water_related': 15 // Water-related choices cost more
      }
    },
    triggerConditions: (state) => state.supplies < 30 && Math.random() < 0.3
  },

  {
    id: 'harsh_winter',
    resource: 'supplies',
    severity: 'moderate',
    title: 'Harsh Winter Conditions',
    description: 'An unexpected cold snap increases energy needs. People need more food and warmth to survive.',
    duration: 10,
    effects: {
      dailyDrain: 4,
      choiceModifiers: {
        'outdoor': 10 // Outdoor activities cost more
      }
    },
    triggerConditions: (state) => state.ecosystem.seasonalCycle === 'winter' && Math.random() < 0.4
  },

  {
    id: 'seed_contamination',
    resource: 'seeds',
    severity: 'critical',
    title: 'Seed Contamination Crisis',
    description: 'Some of your precious seeds have been contaminated by residual toxins. Dr. Chen works frantically to save what he can.',
    duration: 3,
    effects: {
      dailyDrain: 1,
      maxCapacity: Math.floor(50 * 0.7) // Reduce max seeds by 30%
    },
    triggerConditions: (state) => state.seeds > 10 && state.ecosystem.soilHealth < 20 && Math.random() < 0.25
  },

  {
    id: 'knowledge_loss',
    resource: 'knowledge',
    severity: 'moderate',
    title: 'Critical Information Lost',
    description: 'A damaged storage device contained important research data. Dr. Chen looks devastated as months of work vanish.',
    duration: 7,
    effects: {
      dailyDrain: 2,
      choiceModifiers: {
        'research': 20 // Research choices require more knowledge
      }
    },
    triggerConditions: (state) => state.knowledge > 30 && Math.random() < 0.2
  },

  {
    id: 'morale_collapse',
    resource: 'hope',
    severity: 'severe',
    title: 'Community Morale Crisis',
    description: 'Despair spreads through the settlement. People question whether restoration is possible. Some talk of abandoning the mission.',
    duration: 8,
    effects: {
      dailyDrain: 5,
      choiceModifiers: {
        'risky': 15 // Risky choices cost more hope
      }
    },
    triggerConditions: (state) => state.hope < 25 && Object.values(state.npcs).some(npc => npc.mood === 'desperate')
  }
];

export class ScarcityManager {
  private static activeEvents: Map<string, { event: ScarcityEvent; daysRemaining: number }> = new Map();
  private static lastPressureCheck: number = 0;

  /**
   * Calculate resource pressures
   */
  static calculateResourcePressures(gameState: GameState): ResourcePressure[] {
    const pressures: ResourcePressure[] = [];

    // Hope pressure
    const hopePressure = Math.max(0, 100 - gameState.hope * 2); // High pressure when hope is low
    pressures.push({
      resource: 'hope',
      pressure: hopePressure,
      trend: this.calculateTrend('hope', gameState),
      timeToDepletion: gameState.hope <= 10 ? Math.ceil(gameState.hope / 2) : undefined
    });

    // Supplies pressure - consider daily consumption
    const dailyConsumption = this.calculateDailyConsumption('supplies', gameState);
    const suppliesPressure = Math.min(100, (100 - gameState.supplies) + (dailyConsumption * 10));
    pressures.push({
      resource: 'supplies',
      pressure: suppliesPressure,
      trend: this.calculateTrend('supplies', gameState),
      timeToDepletion: dailyConsumption > 0 ? Math.ceil(gameState.supplies / dailyConsumption) : undefined
    });

    // Seeds pressure - critical resource
    const seedsPressure = gameState.seeds < 5 ? 80 : Math.max(0, (10 - gameState.seeds) * 10);
    pressures.push({
      resource: 'seeds',
      pressure: seedsPressure,
      trend: this.calculateTrend('seeds', gameState),
      timeToDepletion: gameState.seeds <= 2 ? gameState.seeds : undefined
    });

    // Health pressure
    const healthPressure = Math.max(0, 100 - gameState.health * 1.5);
    pressures.push({
      resource: 'health',
      pressure: healthPressure,
      trend: this.calculateTrend('health', gameState),
      timeToDepletion: gameState.health <= 15 ? Math.ceil(gameState.health / 3) : undefined
    });

    return pressures.sort((a, b) => b.pressure - a.pressure);
  }

  /**
   * Check for and trigger scarcity events
   */
  static checkScarcityEvents(gameState: GameState): ScarcityEvent[] {
    const triggeredEvents: ScarcityEvent[] = [];

    // Don't trigger too many events at once
    if (this.activeEvents.size >= 2) {
      return [];
    }

    // Check each potential event
    SCARCITY_EVENTS.forEach(event => {
      // Don't trigger if already active
      if (this.activeEvents.has(event.id)) {
        return;
      }

      // Check trigger conditions
      if (event.triggerConditions(gameState)) {
        this.activateEvent(event);
        triggeredEvents.push(event);
      }
    });

    return triggeredEvents;
  }

  /**
   * Process daily effects of active scarcity events
   */
  static processDailyEffects(gameState: GameState): { [key: string]: number } {
    const effects: { [key: string]: number } = {};

    this.activeEvents.forEach((activeEvent, eventId) => {
      const event = activeEvent.event;

      // Apply daily drain
      if (event.effects.dailyDrain > 0) {
        const currentValue = effects[event.resource] || 0;
        effects[event.resource] = currentValue - event.effects.dailyDrain;
      }

      // Decrease duration
      activeEvent.daysRemaining--;

      // Remove if expired
      if (activeEvent.daysRemaining <= 0) {
        this.activeEvents.delete(eventId);
      }
    });

    return effects;
  }

  /**
   * Get choice cost modifiers from active events
   */
  static getChoiceCostModifiers(): { [key: string]: number } {
    const modifiers: { [key: string]: number } = {};

    this.activeEvents.forEach(activeEvent => {
      const event = activeEvent.event;
      if (event.effects.choiceModifiers) {
        Object.entries(event.effects.choiceModifiers).forEach(([key, value]) => {
          modifiers[key] = (modifiers[key] || 0) + value;
        });
      }
    });

    return modifiers;
  }

  /**
   * Check if a choice should have increased costs
   */
  static getModifiedChoiceCosts(choiceText: string, originalCosts: Record<string, number>): Record<string, number> {
    const modifiers = this.getChoiceCostModifiers();
    const modifiedCosts = { ...originalCosts };

    // Apply modifiers based on choice content
    const lowerChoice = choiceText.toLowerCase();

    Object.entries(modifiers).forEach(([modifier, increase]) => {
      let applies = false;

      switch (modifier) {
        case 'water_related':
          applies = lowerChoice.includes('water') || lowerChoice.includes('drink') || lowerChoice.includes('clean');
          break;
        case 'outdoor':
          applies = lowerChoice.includes('outside') || lowerChoice.includes('explore') || lowerChoice.includes('scavenge');
          break;
        case 'research':
          applies = lowerChoice.includes('research') || lowerChoice.includes('study') || lowerChoice.includes('experiment');
          break;
        case 'risky':
          applies = lowerChoice.includes('risk') || lowerChoice.includes('dangerous') || lowerChoice.includes('attempt');
          break;
      }

      if (applies) {
        Object.keys(modifiedCosts).forEach(resource => {
          if (modifiedCosts[resource] > 0) {
            modifiedCosts[resource] = Math.ceil(modifiedCosts[resource] * (1 + increase / 100));
          }
        });
      }
    });

    return modifiedCosts;
  }

  /**
   * Get active scarcity events
   */
  static getActiveEvents(): ScarcityEvent[] {
    return Array.from(this.activeEvents.values()).map(active => active.event);
  }

  /**
   * Get critical resource warnings
   */
  static getCriticalWarnings(gameState: GameState): string[] {
    const warnings: string[] = [];
    const pressures = this.calculateResourcePressures(gameState);

    pressures.forEach(pressure => {
      if (pressure.pressure >= 80) {
        if (pressure.timeToDepletion !== undefined) {
          warnings.push(`${pressure.resource.toUpperCase()} CRITICAL: ${pressure.timeToDepletion} days remaining`);
        } else {
          warnings.push(`${pressure.resource.toUpperCase()} at critical levels`);
        }
      } else if (pressure.pressure >= 60) {
        warnings.push(`${pressure.resource.charAt(0).toUpperCase() + pressure.resource.slice(1)} running low`);
      }
    });

    return warnings;
  }

  /**
   * Private helper methods
   */
  private static activateEvent(event: ScarcityEvent): void {
    this.activeEvents.set(event.id, {
      event,
      daysRemaining: event.duration
    });
  }

  private static calculateTrend(resource: string, gameState: GameState): 'improving' | 'stable' | 'worsening' {
    // Simple trend calculation - in a full implementation, this would track historical data
    const currentValue = (gameState as any)[resource] || 0;

    if (currentValue < 25) return 'worsening';
    if (currentValue > 60) return 'improving';
    return 'stable';
  }

  private static calculateDailyConsumption(resource: string, gameState: GameState): number {
    // Base consumption rates
    const baseCosts: { [key: string]: number } = {
      supplies: 3,
      hope: 1,
      health: 0.5,
      seeds: 0
    };

    let consumption = baseCosts[resource] || 0;

    // Modify based on active events
    this.activeEvents.forEach(activeEvent => {
      if (activeEvent.event.resource === resource) {
        consumption += activeEvent.event.effects.dailyDrain;
      }
    });

    return consumption;
  }

  /**
   * Clear all active events (for game reset)
   */
  static clearAll(): void {
    this.activeEvents.clear();
    this.lastPressureCheck = 0;
  }
}