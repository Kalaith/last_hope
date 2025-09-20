import type { SystemTriggeredEvent, GameState } from '../types/game';
import { RESOURCE_THRESHOLDS } from './resourceManager';

// System-triggered narrative events that respond to game state
export const SYSTEM_EVENTS: SystemTriggeredEvent[] = [
  {
    id: 'severe_drought',
    triggers: {
      weatherPattern: 'drought',
      supplies: { below: 20 }
    },
    storyContent: {
      title: "The Withering",
      text: "Three weeks without rain. Your carefully tended plants are dying despite your best efforts. Elena approaches with worry etched on her face: 'We need to make a hard choice. Do we use our emergency water reserves on the plants, or save them for drinking?'",
      choices: [
        {
          text: "Save the plants - they're our future.",
          consequences: { supplies: -10, hope: 5, soilHealth: 10 },
          relationships: { elena: 5, chen: 10 },
          nextScene: "plantsSaved"
        },
        {
          text: "People come first. Let the plants die.",
          consequences: { health: 10, hope: -15, soilHealth: -20 },
          relationships: { elena: -10, marcus: 5 },
          nextScene: "plantsLost"
        },
        {
          text: "Search for underground water sources.",
          consequences: { supplies: 5, hope: -5, knowledge: 2 },
          requirements: { knowledge: 15 },
          nextScene: "waterSearch"
        }
      ]
    }
  },

  {
    id: 'plant_disease_outbreak',
    triggers: {
      soilHealth: { min: 20, max: 60 }
    },
    storyContent: {
      title: "The Blight Returns",
      text: "Dr. Chen rushes to you with alarming news: 'The plants are showing signs of infection - yellowing leaves, stunted growth. It's a variant of the original Blight. We need to act fast before it spreads to everything we've worked for.'",
      choices: [
        {
          text: "Quarantine infected plants immediately.",
          consequences: { soilHealth: -5, knowledge: 3, hope: -10 },
          relationships: { chen: 15 },
          nextScene: "quarantineProtocol"
        },
        {
          text: "Try to treat the disease with available resources.",
          consequences: { supplies: -5, soilHealth: 5, hope: 5 },
          requirements: { knowledge: 20 },
          nextScene: "treatmentAttempt"
        },
        {
          text: "Accept the loss and start over with resistant species.",
          consequences: { soilHealth: -15, hope: -20, knowledge: 5, seeds: 2 },
          nextScene: "resistantSpecies"
        }
      ]
    }
  },

  {
    id: 'npc_trust_crisis',
    triggers: {
      trustLevel: { character: 'elena', below: 15 }
    },
    storyContent: {
      title: "Breaking Point",
      text: "Elena confronts you publicly in front of the group: 'I've watched you make decision after decision that puts us all at risk. The children are hungry, people are sick, and you keep chasing impossible dreams. Maybe it's time for new leadership.'",
      choices: [
        {
          text: "Address her concerns openly and honestly.",
          consequences: { hope: -5, supplies: 5 },
          relationships: { elena: 10, marcus: 5 },
          nextScene: "honestDiscussion"
        },
        {
          text: "Stand firm in your decisions and leadership.",
          consequences: { hope: 10, supplies: -5 },
          relationships: { elena: -5, chen: 5 },
          nextScene: "leadershipChallenge"
        },
        {
          text: "Offer to step down if that's what people want.",
          consequences: { hope: -15, health: -10 },
          relationships: { elena: 5 },
          nextScene: "leadershipQuestion"
        }
      ]
    }
  },

  {
    id: 'supply_shortage_crisis',
    triggers: {
      supplies: { below: 10 }
    },
    storyContent: {
      title: "Empty Shelves",
      text: "Marcus stares at the nearly empty supply cache: 'This is it. Maybe two days of food left, if we ration severely. We need to make some hard choices about priorities - do we search for supplies, attempt to trade with distant groups, or...' He trails off, not wanting to voice the darker alternatives.",
      choices: [
        {
          text: "Organize a desperate scavenging expedition.",
          consequences: { supplies: 8, health: -10, hope: -5 },
          relationships: { marcus: 10 },
          nextScene: "desperateScavenging"
        },
        {
          text: "Send envoys to negotiate with other survivor groups.",
          consequences: { supplies: 3, seeds: -1, hope: 5 },
          requirements: { knowledge: 10 },
          relationships: { elena: 5, chen: -5 },
          nextScene: "negotiationMission"
        },
        {
          text: "Focus all efforts on accelerating plant growth.",
          consequences: { supplies: -3, soilHealth: 10, hope: 15 },
          requirements: { seeds: 2 },
          relationships: { chen: 15 },
          nextScene: "growthAcceleration"
        }
      ]
    }
  },

  {
    id: 'first_successful_harvest',
    triggers: {
      soilHealth: { min: 40 }
    },
    storyContent: {
      title: "The First Fruits",
      text: "A cry of joy echoes across the settlement as Dr. Chen calls everyone to see the miracle: your first mature plants are ready for harvest. Small green pods hang heavy with seeds, and edible roots can be carefully extracted. Elena's children run between the plants, laughing for the first time in months.",
      choices: [
        {
          text: "Celebrate with a feast using the harvest.",
          consequences: { supplies: 15, hope: 25, health: 10 },
          relationships: { elena: 15, marcus: 10, chen: 10 },
          nextScene: "harvestCelebration"
        },
        {
          text: "Carefully preserve most for future planting.",
          consequences: { seeds: 8, supplies: 5, knowledge: 3 },
          relationships: { chen: 20 },
          nextScene: "seedPreservation"
        },
        {
          text: "Share the harvest with neighboring survivor groups.",
          consequences: { supplies: 5, hope: 15, knowledge: 2 },
          relationships: { elena: 20 },
          nextScene: "harvestSharing"
        }
      ]
    }
  },

  {
    id: 'stranger_arrival',
    triggers: {
      soilHealth: { min: 30 }
    },
    storyContent: {
      title: "New Arrivals",
      text: "A small group of haggard survivors appears at your settlement, drawn by reports of 'the impossible - green things growing in dead soil.' Their leader, a weathered woman named Sarah, speaks: 'We've walked for weeks to see if the rumors are true. Some say you're performing miracles here.'",
      choices: [
        {
          text: "Welcome them and share your knowledge freely.",
          consequences: { supplies: -8, hope: 20, knowledge: 5 },
          relationships: { elena: 10 },
          nextScene: "welcomeStrangers"
        },
        {
          text: "Accept them but keep restoration techniques secret.",
          consequences: { supplies: -5, hope: 5, health: -5 },
          relationships: { chen: -10 },
          nextScene: "cautiousAcceptance"
        },
        {
          text: "Direct them to establish their own settlement nearby.",
          consequences: { supplies: 0, hope: 10, knowledge: 2 },
          nextScene: "neighboringSettlement"
        }
      ]
    }
  },

  {
    id: 'knowledge_breakthrough',
    triggers: {
      knowledge: { min: 50 }
    },
    storyContent: {
      title: "Scientific Breakthrough",
      text: "Dr. Chen bursts into your quarters with unprecedented excitement: 'I've cracked it! The soil composition patterns, the optimal planting sequences, the symbiotic relationships - I understand how to accelerate the restoration process by 300%. But it will require precise coordination and significant resource investment.'",
      choices: [
        {
          text: "Implement the breakthrough immediately.",
          consequences: { seeds: -5, supplies: -10, soilHealth: 40, hope: 30 },
          relationships: { chen: 25 },
          nextScene: "rapidRestoration"
        },
        {
          text: "Test the theory on a small scale first.",
          consequences: { seeds: -2, supplies: -3, soilHealth: 15, knowledge: 5 },
          relationships: { chen: 10, marcus: 10 },
          nextScene: "scientificTesting"
        },
        {
          text: "Document everything before proceeding.",
          consequences: { knowledge: 10, hope: 5, soilHealth: 5 },
          relationships: { chen: 15 },
          nextScene: "documentationProject"
        }
      ]
    }
  },

  {
    id: 'storm_damage',
    triggers: {
      weatherPattern: 'storm'
    },
    storyContent: {
      title: "After the Storm",
      text: "The violent storm has passed, leaving destruction in its wake. Your growing plants are battered, some uprooted entirely. Marcus surveys the damage: 'The structures held, but we've lost weeks of growth. Some of the more delicate species might not recover.'",
      choices: [
        {
          text: "Focus on saving what can be salvaged.",
          consequences: { soilHealth: -10, hope: -5, knowledge: 2 },
          relationships: { marcus: 10 },
          nextScene: "salvageOperation"
        },
        {
          text: "Use this as an opportunity to replant with hardier species.",
          consequences: { seeds: -3, soilHealth: 5, hope: 10 },
          requirements: { seeds: 3 },
          relationships: { chen: 15 },
          nextScene: "hardierReplanting"
        },
        {
          text: "Build better protection before replanting.",
          consequences: { supplies: -5, soilHealth: -5, hope: 5 },
          nextScene: "stormProtection"
        }
      ]
    }
  }
];

export class SystemEventManager {
  /**
   * Check if any system events should trigger based on current game state
   */
  static checkForTriggeredEvents(gameState: GameState): SystemTriggeredEvent | null {
    // Randomly select from applicable events to avoid predictability
    const applicableEvents = SYSTEM_EVENTS.filter(event =>
      this.eventShouldTrigger(event, gameState)
    );

    if (applicableEvents.length === 0) {
      return null;
    }

    // Weighted selection - crisis events more likely when conditions are bad
    const weights = applicableEvents.map(event => {
      if (event.id.includes('crisis') || event.id.includes('shortage')) {
        return 2; // Crisis events have higher weight
      }
      if (event.id.includes('breakthrough') || event.id.includes('harvest')) {
        return 1.5; // Positive events have moderate weight
      }
      return 1; // Normal weight
    });

    const selectedIndex = this.weightedRandomSelect(weights);
    return applicableEvents[selectedIndex];
  }

  /**
   * Check if a specific event should trigger
   */
  private static eventShouldTrigger(event: SystemTriggeredEvent, gameState: GameState): boolean {
    const triggers = event.triggers;

    // Weather pattern trigger
    if (triggers.weatherPattern && gameState.ecosystem.weatherPattern !== triggers.weatherPattern) {
      return false;
    }

    // Soil health range trigger
    if (triggers.soilHealth) {
      const soilHealth = gameState.ecosystem.soilHealth;
      if (triggers.soilHealth.min !== undefined && soilHealth < triggers.soilHealth.min) {
        return false;
      }
      if (triggers.soilHealth.max !== undefined && soilHealth > triggers.soilHealth.max) {
        return false;
      }
    }

    // NPC mood trigger
    if (triggers.npcMood) {
      const hasNPCWithMood = Object.values(gameState.npcs).some(npc => npc.mood === triggers.npcMood);
      if (!hasNPCWithMood) {
        return false;
      }
    }

    // Supply threshold trigger
    if (triggers.supplies) {
      if (triggers.supplies.below !== undefined && gameState.supplies >= triggers.supplies.below) {
        return false;
      }
    }

    // Trust level trigger
    if (triggers.trustLevel) {
      const { character, below } = triggers.trustLevel;
      const npc = gameState.npcs[character];
      if (!npc || npc.trustLevel >= below) {
        return false;
      }
    }

    // Knowledge threshold trigger
    if (triggers.knowledge) {
      if (triggers.knowledge.min !== undefined && gameState.knowledge < triggers.knowledge.min) {
        return false;
      }
    }

    return true;
  }

  /**
   * Weighted random selection
   */
  private static weightedRandomSelect(weights: number[]): number {
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < weights.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return i;
      }
    }

    return weights.length - 1; // Fallback
  }

  /**
   * Get event probability based on game state severity
   */
  static getEventProbability(gameState: GameState): number {
    let baseProbability = 0.15; // 15% base chance per choice

    // Increase probability during crisis conditions
    if (gameState.hope < RESOURCE_THRESHOLDS.HOPE_CRITICAL) {
      baseProbability += 0.1;
    }

    if (gameState.supplies < RESOURCE_THRESHOLDS.SUPPLIES_CRITICAL) {
      baseProbability += 0.1;
    }

    if (gameState.health < RESOURCE_THRESHOLDS.HEALTH_CRITICAL) {
      baseProbability += 0.1;
    }

    // Increase probability during extreme weather
    if (gameState.ecosystem.weatherPattern === 'drought' || gameState.ecosystem.weatherPattern === 'storm') {
      baseProbability += 0.05;
    }

    // Increase probability when ecosystem is in transition zones
    const soilHealth = gameState.ecosystem.soilHealth;
    if ((soilHealth > 20 && soilHealth < 40) || (soilHealth > 60 && soilHealth < 80)) {
      baseProbability += 0.05;
    }

    return Math.min(0.4, baseProbability); // Cap at 40%
  }

  /**
   * Create follow-up scenes for system events
   */
  static createFollowUpScene(eventId: string, choiceIndex: number): string {
    // Generate scene IDs based on event and choice
    return `${eventId}_choice_${choiceIndex}_followup`;
  }

  /**
   * Get event rarity for UI feedback
   */
  static getEventRarity(eventId: string): 'common' | 'uncommon' | 'rare' | 'critical' {
    if (eventId.includes('crisis') || eventId.includes('shortage')) {
      return 'critical';
    }
    if (eventId.includes('breakthrough') || eventId.includes('harvest')) {
      return 'rare';
    }
    if (eventId.includes('arrival') || eventId.includes('disease')) {
      return 'uncommon';
    }
    return 'common';
  }
}