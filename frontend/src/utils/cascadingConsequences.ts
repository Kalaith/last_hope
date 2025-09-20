import type { GameState, Choice } from '../types/game';

export interface DelayedConsequence {
  id: string;
  triggerDay: number;
  title: string;
  description: string;
  consequences: Record<string, number>;
  relationships?: Record<string, number>;
  followUpEvents?: string[];
}

export interface ConsequenceChain {
  choiceId: string;
  immediate: Record<string, number>;
  delayed: DelayedConsequence[];
  conditions: ConditionalConsequence[];
}

export interface ConditionalConsequence {
  id: string;
  condition: (gameState: GameState) => boolean;
  consequence: DelayedConsequence;
  hasTriggered: boolean;
}

// Define consequence chains for major decisions
export const CONSEQUENCE_CHAINS: Record<string, ConsequenceChain> = {
  'prioritize_food_over_restoration': {
    choiceId: 'prioritize_food_over_restoration',
    immediate: { supplies: 15, hope: -5 },
    delayed: [
      {
        id: 'food_shortage_aftermath',
        triggerDay: 7,
        title: 'Short-Term Thinking',
        description: 'Your focus on immediate survival has consequences. Elena confronts you: "We ate well for a week, but now what? We have no sustainable plan."',
        consequences: { hope: -15, trust: -10 },
        relationships: { elena: -15, marcus: -5 },
        followUpEvents: ['community_meeting_crisis']
      }
    ],
    conditions: [
      {
        id: 'starvation_spiral',
        condition: (state) => state.supplies < 10,
        consequence: {
          id: 'desperation_sets_in',
          triggerDay: 14,
          title: 'Desperation',
          description: 'People are desperate. Marcus suggests raiding other settlements. The group looks to you for guidance.',
          consequences: { hope: -25 },
          relationships: { marcus: 10, elena: -20, chen: -15 }
        },
        hasTriggered: false
      }
    ]
  },

  'share_seeds_with_strangers': {
    choiceId: 'share_seeds_with_strangers',
    immediate: { seeds: -2, hope: 10 },
    delayed: [
      {
        id: 'seed_sharing_network',
        triggerDay: 21,
        title: 'The Network Grows',
        description: 'The group you helped has established contact with other settlements. They return with valuable information about clean water sources and offer to trade rare seeds.',
        consequences: { seeds: 3, knowledge: 15, supplies: 10 },
        relationships: { elena: 10, chen: 15 },
        followUpEvents: ['trading_network_established']
      }
    ],
    conditions: [
      {
        id: 'reputation_spreads',
        condition: (state) => Object.values(state.npcs).every(npc => npc.trustLevel > 60),
        consequence: {
          id: 'hope_beacon',
          triggerDay: 30,
          title: 'Beacon of Hope',
          description: 'Word has spread about your settlement. More survivors arrive seeking guidance. Your reputation precedes you.',
          consequences: { hope: 30, knowledge: 10 },
          relationships: { elena: 20, marcus: 15, chen: 20 }
        },
        hasTriggered: false
      }
    ]
  },

  'plant_aggressive_restoration': {
    choiceId: 'plant_aggressive_restoration',
    immediate: { seeds: -3, supplies: -10, hope: 15 },
    delayed: [
      {
        id: 'restoration_breakthrough',
        triggerDay: 10,
        title: 'Restoration Breakthrough',
        description: 'Dr. Chen is amazed by the results: "The aggressive planting has triggered a cascade effect. The soil microbiome is recovering faster than we projected!"',
        consequences: { soilHealth: 25, seeds: 2 },
        relationships: { chen: 25 },
        followUpEvents: ['research_breakthrough']
      }
    ],
    conditions: [
      {
        id: 'ecosystem_tipping_point',
        condition: (state) => state.ecosystem.soilHealth > 40,
        consequence: {
          id: 'wildlife_returns',
          triggerDay: 35,
          title: 'Wildlife Returns',
          description: 'Something extraordinary happens - you spot the first birds in years. Small insects buzz around the growing plants. The ecosystem is truly awakening.',
          consequences: { hope: 40, soilHealth: 15, seeds: 5 },
          relationships: { elena: 15, marcus: 10, chen: 30 }
        },
        hasTriggered: false
      }
    ]
  }
};

export class CascadingConsequenceManager {
  private static delayedConsequences: DelayedConsequence[] = [];
  private static conditionalWatchers: ConditionalConsequence[] = [];

  /**
   * Register a choice for consequence tracking
   */
  static registerChoice(choiceText: string, choice: Choice, gameState: GameState): void {
    // Find matching consequence chain
    const chain = this.findConsequenceChain(choiceText, choice);

    if (chain) {
      // Schedule delayed consequences
      chain.delayed.forEach(delayed => {
        const triggeredConsequence: DelayedConsequence = {
          ...delayed,
          triggerDay: gameState.daysSurvived + delayed.triggerDay
        };
        this.delayedConsequences.push(triggeredConsequence);
      });

      // Set up conditional watchers
      chain.conditions.forEach(condition => {
        this.conditionalWatchers.push({ ...condition });
      });
    }
  }

  /**
   * Check for triggered consequences on day progression
   */
  static checkTriggeredConsequences(gameState: GameState): DelayedConsequence[] {
    const triggered: DelayedConsequence[] = [];
    const currentDay = gameState.daysSurvived;

    // Check delayed consequences
    this.delayedConsequences = this.delayedConsequences.filter(consequence => {
      if (consequence.triggerDay <= currentDay) {
        triggered.push(consequence);
        return false; // Remove from pending list
      }
      return true;
    });

    // Check conditional consequences
    this.conditionalWatchers.forEach(watcher => {
      if (!watcher.hasTriggered && watcher.condition(gameState)) {
        const triggeredConsequence: DelayedConsequence = {
          ...watcher.consequence,
          triggerDay: currentDay
        };
        triggered.push(triggeredConsequence);
        watcher.hasTriggered = true;
      }
    });

    return triggered;
  }

  /**
   * Find consequence chain for a choice
   */
  private static findConsequenceChain(choiceText: string, choice: Choice): ConsequenceChain | null {
    // Match by key phrases in choice text
    const lowerChoice = choiceText.toLowerCase();

    if (lowerChoice.includes('food') && lowerChoice.includes('survival')) {
      return CONSEQUENCE_CHAINS['prioritize_food_over_restoration'];
    }

    if (lowerChoice.includes('share') && lowerChoice.includes('seed')) {
      return CONSEQUENCE_CHAINS['share_seeds_with_strangers'];
    }

    if (lowerChoice.includes('plant') && (lowerChoice.includes('aggressive') || lowerChoice.includes('all'))) {
      return CONSEQUENCE_CHAINS['plant_aggressive_restoration'];
    }

    return null;
  }

  /**
   * Get pending consequences for UI display
   */
  static getPendingConsequences(): DelayedConsequence[] {
    return [...this.delayedConsequences];
  }

  /**
   * Clear all pending consequences (for game reset)
   */
  static clearAll(): void {
    this.delayedConsequences = [];
    this.conditionalWatchers = [];
  }

  /**
   * Create story event from triggered consequence
   */
  static createStoryEvent(consequence: DelayedConsequence): {
    title: string;
    text: string;
    choices: Choice[];
  } {
    return {
      title: consequence.title,
      text: consequence.description,
      choices: [
        {
          text: "Accept the consequences and adapt.",
          consequences: consequence.consequences,
          relationships: consequence.relationships
        },
        {
          text: "Try to mitigate the effects.",
          consequences: this.mitigateConsequences(consequence.consequences),
          relationships: consequence.relationships ?
            Object.fromEntries(
              Object.entries(consequence.relationships).map(([npc, value]) => [npc, Math.ceil(value * 0.5)])
            ) : undefined
        }
      ]
    };
  }

  /**
   * Create mitigated version of consequences
   */
  private static mitigateConsequences(consequences: Record<string, number>): Record<string, number> {
    const mitigated: Record<string, number> = {};

    Object.entries(consequences).forEach(([key, value]) => {
      // Reduce negative consequences by 50%, keep positive ones
      if (value < 0) {
        mitigated[key] = Math.ceil(value * 0.5);
      } else {
        mitigated[key] = value;
      }
    });

    return mitigated;
  }
}