import type { GameState, SystemTriggeredEvent, Choice } from '../types/game';

export interface EventTrigger {
  soilHealth?: { min?: number; max?: number };
  npcMood?: 'hopeful' | 'neutral' | 'worried' | 'desperate';
  weatherPattern?: 'drought' | 'rain' | 'stable' | 'storm';
  supplies?: { below?: number; above?: number };
  trustLevel?: { character: string; below: number };
  knowledge?: { min?: number; max?: number };
  hope?: { below?: number; above?: number };
  health?: { below?: number; above?: number };
  seeds?: { below?: number; above?: number };
  baseStructures?: { count: number; type?: string };
  daysSurvived?: { min?: number };
}

export interface SystemEvent {
  id: string;
  title: string;
  text: string;
  choices: Choice[];
  triggers: EventTrigger;
  priority: number; // Higher number = higher priority
  cooldown?: number; // Days before this event can trigger again
  onceOnly?: boolean; // Event can only trigger once per playthrough
}

class SystemEventManager {
  private lastTriggeredEvents: Map<string, number> = new Map();
  private triggeredOnceEvents: Set<string> = new Set();

  private events: SystemEvent[] = [
    // Drought Crisis Event
    {
      id: 'severe_drought',
      title: 'The Withering',
      text: "Three weeks without rain. Your carefully tended plants are dying despite your best efforts. Elena approaches with worry etched on her face: 'We need to make a hard choice. Do we use our emergency water reserves on the plants, or save them for drinking?'",
      priority: 8,
      cooldown: 14, // 2 weeks before it can happen again
      triggers: {
        weatherPattern: 'drought',
        supplies: { below: 25 }
      },
      choices: [
        {
          text: "Save the plants - they're our future",
          consequences: { supplies: -8, hope: 3, soilHealth: 15 },
          relationships: { elena: 5, chen: 10 }
        },
        {
          text: "People come first. Let the plants die",
          consequences: { health: 8, hope: -12, soilHealth: -15 },
          relationships: { elena: -8, chen: -15 }
        },
        {
          text: "Try to find a middle ground solution",
          consequences: { supplies: -4, hope: -2, soilHealth: 5, knowledge: 2 },
          requirements: { knowledge: 15 }
        }
      ]
    },

    // Contamination Discovery Event
    {
      id: 'soil_contamination',
      title: 'Hidden Poison',
      text: "Dr. Chen's latest soil tests reveal disturbing news. 'The contamination runs deeper than we thought,' she says, holding up a vial of dark earth. 'This sector is beyond saving with our current methods. We need to decide: abandon this area or try experimental decontamination?'",
      priority: 7,
      onceOnly: true,
      triggers: {
        soilHealth: { max: 15 },
        knowledge: { min: 25 }
      },
      choices: [
        {
          text: "Abandon the contaminated sector",
          consequences: { hope: -5, supplies: -3, knowledge: 3 }
        },
        {
          text: "Attempt experimental decontamination",
          consequences: { supplies: -10, knowledge: 8, soilHealth: 20 },
          requirements: { supplies: 15, knowledge: 30 }
        },
        {
          text: "Study the contamination for future reference",
          consequences: { knowledge: 12, hope: -2 },
          requirements: { knowledge: 20 }
        }
      ]
    },

    // NPC Trust Crisis
    {
      id: 'marcus_confrontation',
      title: 'Breaking Point',
      text: "Marcus blocks your path, his usual stoic demeanor cracked with frustration. 'I've been watching you make choices that put everyone at risk,' he says. 'Some of us are starting to wonder if you're the right person to lead us.' The others watch tensely.",
      priority: 6,
      cooldown: 21, // 3 weeks cooldown
      triggers: {
        trustLevel: { character: 'marcus', below: 20 },
        hope: { below: 40 }
      },
      choices: [
        {
          text: "Challenge his authority directly",
          consequences: { hope: 5 },
          relationships: { marcus: -15, elena: -5 }
        },
        {
          text: "Acknowledge his concerns and discuss solutions",
          consequences: { hope: 2, knowledge: 3 },
          relationships: { marcus: 8, elena: 3 }
        },
        {
          text: "Step back and let him take the lead for a while",
          consequences: { hope: -8, health: 5 },
          relationships: { marcus: 12, elena: -3 }
        }
      ]
    },

    // Resource Abundance Event
    {
      id: 'supply_windfall',
      title: 'Unexpected Fortune',
      text: "Elena returns from scouting with amazing news: 'I found an intact supply cache! Medical supplies, preserved food, even some equipment. But it's in contested territory - we might not be the only ones who know about it.'",
      priority: 4,
      cooldown: 30,
      triggers: {
        supplies: { below: 30 },
        health: { below: 60 }
      },
      choices: [
        {
          text: "Rush to claim it immediately",
          consequences: { supplies: 25, health: -5, hope: 8 }
        },
        {
          text: "Scout carefully and plan the approach",
          consequences: { supplies: 20, knowledge: 5, hope: 5 },
          requirements: { knowledge: 10 }
        },
        {
          text: "Leave it - too risky",
          consequences: { hope: -5, health: 2 },
          relationships: { elena: -5 }
        }
      ]
    },

    // Base Building Success Event
    {
      id: 'construction_milestone',
      title: 'Growing Settlement',
      text: "Your settlement has grown considerably. Dr. Chen surveys the structures with satisfaction: 'We're becoming more than just survivors - we're builders of the future.' But with growth comes new challenges and responsibilities.",
      priority: 3,
      onceOnly: true,
      triggers: {
        baseStructures: { count: 3 },
        hope: { above: 60 }
      },
      choices: [
        {
          text: "Focus on expanding production capabilities",
          consequences: { supplies: 5, knowledge: 3, hope: 5 }
        },
        {
          text: "Prioritize defensive measures",
          consequences: { health: 8, hope: -2, supplies: -3 }
        },
        {
          text: "Balance growth with sustainability",
          consequences: { hope: 8, soilHealth: 5, knowledge: 5 },
          requirements: { knowledge: 25 }
        }
      ]
    },

    // Weather Storm Event
    {
      id: 'storm_damage',
      title: 'Nature\'s Fury',
      text: "A massive storm tears through your settlement. Wind and rain pummel your structures while you huddle for safety. When morning comes, you survey the damage - some buildings are hurt, but the storm also brought much-needed water to parched soil.",
      priority: 5,
      cooldown: 20,
      triggers: {
        weatherPattern: 'storm'
      },
      choices: [
        {
          text: "Focus on immediate repairs",
          consequences: { supplies: -5, hope: 3 }
        },
        {
          text: "Harvest the storm water first",
          consequences: { supplies: 8, soilHealth: 10, hope: 5 }
        },
        {
          text: "Organize everyone to work together",
          consequences: { hope: 8, supplies: 2 },
          relationships: { elena: 5, marcus: 5, chen: 5 }
        }
      ]
    }
  ];

  /**
   * Check if any system events should trigger based on current game state
   */
  checkForTriggeredEvents(gameState: GameState): SystemEvent | null {
    const currentDay = gameState.daysSurvived;

    // Sort events by priority (highest first)
    const sortedEvents = [...this.events].sort((a, b) => b.priority - a.priority);

    for (const event of sortedEvents) {
      // Skip if this is a once-only event that already triggered
      if (event.onceOnly && this.triggeredOnceEvents.has(event.id)) {
        continue;
      }

      // Skip if this event is on cooldown
      if (event.cooldown) {
        const lastTriggered = this.lastTriggeredEvents.get(event.id);
        if (lastTriggered && (currentDay - lastTriggered) < event.cooldown) {
          continue;
        }
      }

      // Check if all triggers are met
      if (this.checkTriggers(event.triggers, gameState)) {
        // Mark event as triggered
        this.lastTriggeredEvents.set(event.id, currentDay);
        if (event.onceOnly) {
          this.triggeredOnceEvents.add(event.id);
        }

        return event;
      }
    }

    return null;
  }

  /**
   * Check if the current game state matches the event triggers
   */
  private checkTriggers(triggers: EventTrigger, gameState: GameState): boolean {
    // Check soil health
    if (triggers.soilHealth) {
      const soilHealth = gameState.ecosystem?.soilHealth || 0;
      if (triggers.soilHealth.min !== undefined && soilHealth < triggers.soilHealth.min) return false;
      if (triggers.soilHealth.max !== undefined && soilHealth > triggers.soilHealth.max) return false;
    }

    // Check NPC mood
    if (triggers.npcMood) {
      // For now, check if any NPC has the specified mood
      const hasMatchingMood = Object.values(gameState.npcs || {}).some(npc =>
        npc.mood === triggers.npcMood
      );
      if (!hasMatchingMood) return false;
    }

    // Check weather pattern
    if (triggers.weatherPattern && gameState.ecosystem?.weatherPattern !== triggers.weatherPattern) {
      return false;
    }

    // Check supplies
    if (triggers.supplies) {
      if (triggers.supplies.below !== undefined && gameState.supplies >= triggers.supplies.below) return false;
      if (triggers.supplies.above !== undefined && gameState.supplies <= triggers.supplies.above) return false;
    }

    // Check trust level for specific character
    if (triggers.trustLevel) {
      const character = gameState.npcs?.[triggers.trustLevel.character];
      if (!character || character.trustLevel >= triggers.trustLevel.below) return false;
    }

    // Check knowledge
    if (triggers.knowledge) {
      if (triggers.knowledge.min !== undefined && gameState.knowledge < triggers.knowledge.min) return false;
      if (triggers.knowledge.max !== undefined && gameState.knowledge > triggers.knowledge.max) return false;
    }

    // Check hope
    if (triggers.hope) {
      if (triggers.hope.below !== undefined && gameState.hope >= triggers.hope.below) return false;
      if (triggers.hope.above !== undefined && gameState.hope <= triggers.hope.above) return false;
    }

    // Check health
    if (triggers.health) {
      if (triggers.health.below !== undefined && gameState.health >= triggers.health.below) return false;
      if (triggers.health.above !== undefined && gameState.health <= triggers.health.above) return false;
    }

    // Check seeds
    if (triggers.seeds) {
      if (triggers.seeds.below !== undefined && gameState.seeds >= triggers.seeds.below) return false;
      if (triggers.seeds.above !== undefined && gameState.seeds <= triggers.seeds.above) return false;
    }

    // Check base structures
    if (triggers.baseStructures) {
      const structureCount = gameState.baseStructures?.length || 0;
      if (structureCount < triggers.baseStructures.count) return false;

      if (triggers.baseStructures.type) {
        const hasType = gameState.baseStructures?.some(structure =>
          structure.type === triggers.baseStructures.type
        );
        if (!hasType) return false;
      }
    }

    // Check days survived
    if (triggers.daysSurvived) {
      if (triggers.daysSurvived.min !== undefined && gameState.daysSurvived < triggers.daysSurvived.min) {
        return false;
      }
    }

    return true;
  }

  /**
   * Reset event tracking (for new game)
   */
  reset(): void {
    this.lastTriggeredEvents.clear();
    this.triggeredOnceEvents.clear();
  }

  /**
   * Get all available events (for debugging/testing)
   */
  getAllEvents(): SystemEvent[] {
    return [...this.events];
  }

  /**
   * Manually trigger a specific event (for testing)
   */
  triggerEvent(eventId: string): SystemEvent | null {
    return this.events.find(event => event.id === eventId) || null;
  }
}

export const systemEventManager = new SystemEventManager();