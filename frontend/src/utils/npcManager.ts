import type { NPCPersonality, GameState } from '../types/game';

// NPC personality templates
export const NPC_PERSONALITIES = {
  optimistic: {
    hopeThresholds: { high: 60, low: 30 },
    responses: {
      highHope: "Things are looking up! I can feel the change in the air.",
      lowHope: "Don't give up. I've seen darker days than this.",
      drought: "The rain will come again. It always does.",
      success: "See? I told you we could do this together!"
    },
    trustModifiers: { cooperation: 2, sharing: 3, optimism: 2 },
    concerns: ['morale', 'community_unity', 'long_term_hope']
  },
  pragmatic: {
    hopeThresholds: { high: 50, low: 20 },
    responses: {
      highHope: "Good progress, but we need to stay focused on practical matters.",
      lowHope: "We need to be realistic about our situation and make hard choices.",
      drought: "Water conservation is critical. We need rationing protocols.",
      success: "This is encouraging, but we can't get complacent."
    },
    trustModifiers: { planning: 3, efficiency: 2, realism: 2 },
    concerns: ['resource_management', 'efficiency', 'risk_assessment']
  },
  protective: {
    hopeThresholds: { high: 40, low: 25 },
    responses: {
      highHope: "The children are smiling again. That's what matters most.",
      lowHope: "We have to protect what's left. That's our duty.",
      drought: "The children need water first. Always.",
      success: "A safer future for the next generation - that's worth everything."
    },
    trustModifiers: { safety: 3, children: 4, sacrifice: 2 },
    concerns: ['children_safety', 'group_security', 'future_generations']
  },
  scientific: {
    hopeThresholds: { high: 70, low: 40 },
    responses: {
      highHope: "The data is encouraging. Soil pH is improving measurably.",
      lowHope: "The scientific method requires patience. Results take time.",
      drought: "Fascinating adaptation mechanisms. Some species thrive in arid conditions.",
      success: "Excellent! This validates our restoration hypothesis."
    },
    trustModifiers: { research: 3, methodology: 2, discovery: 3 },
    concerns: ['soil_analysis', 'plant_genetics', 'restoration_science']
  }
} as const;

export type PersonalityType = keyof typeof NPC_PERSONALITIES;

// Dialogue memory categories
type DialogueCategory = 'greeting' | 'concern' | 'success' | 'failure' | 'weather' | 'ecosystem' | 'personal';

export class NPCManager {
  /**
   * Update NPC mood based on current game state
   */
  static updateNPCMood(npc: NPCPersonality, gameState: GameState): NPCPersonality {
    const personality = NPC_PERSONALITIES[npc.personality];
    let newMood = npc.mood;

    // Mood based on hope levels and personality thresholds
    if (gameState.hope >= personality.hopeThresholds.high) {
      newMood = 'hopeful';
    } else if (gameState.hope <= personality.hopeThresholds.low) {
      newMood = 'desperate';
    } else if (gameState.hope <= personality.hopeThresholds.high && gameState.hope > personality.hopeThresholds.low) {
      // Check other factors for worried vs neutral
      const concernFactors = this.evaluateConcerns(npc, gameState);
      newMood = concernFactors > 2 ? 'worried' : 'neutral';
    }

    // Update concerns based on current situation
    const newConcerns = this.updateConcerns(npc, gameState);

    return {
      ...npc,
      mood: newMood,
      currentConcerns: newConcerns
    };
  }

  /**
   * Generate contextual dialogue based on NPC state and game conditions
   */
  static generateDialogue(npc: NPCPersonality, gameState: GameState, category: DialogueCategory): string {
    const personality = NPC_PERSONALITIES[npc.personality];
    const recentMemory = npc.dialogueMemory.slice(-3); // Last 3 interactions

    // Avoid repeating recent dialogue
    let dialogue = this.getBaseDialogue(npc, gameState, category, personality);

    // Add personality-specific variations
    dialogue = this.addPersonalityFlavor(dialogue, npc, gameState);

    // Remember this dialogue
    this.addToDialogueMemory(npc, category, dialogue);

    return dialogue;
  }

  private static getBaseDialogue(
    npc: NPCPersonality,
    gameState: GameState,
    category: DialogueCategory,
    personality: typeof NPC_PERSONALITIES[PersonalityType]
  ): string {
    switch (category) {
      case 'greeting':
        return this.getGreetingDialogue(npc, gameState, personality);
      case 'concern':
        return this.getConcernDialogue(npc, gameState);
      case 'ecosystem':
        return this.getEcosystemDialogue(npc, gameState, personality);
      case 'weather':
        return this.getWeatherDialogue(npc, gameState, personality);
      case 'success':
        return personality.responses.success;
      case 'failure':
        return this.getFailureDialogue(npc, gameState, personality);
      default:
        return this.getGenericDialogue(npc, gameState, personality);
    }
  }

  private static getGreetingDialogue(
    npc: NPCPersonality,
    gameState: GameState,
    personality: typeof NPC_PERSONALITIES[PersonalityType]
  ): string {
    const time = gameState.daysSurvived;
    const trust = npc.trustLevel;

    if (trust < 25) {
      return `${npc.name} nods cautiously. Trust must be earned here.`;
    } else if (trust > 75) {
      return `${npc.name} greets you warmly. Their trust in you is evident.`;
    } else {
      if (gameState.hope > personality.hopeThresholds.high) {
        return personality.responses.highHope;
      } else {
        return personality.responses.lowHope;
      }
    }
  }

  private static getConcernDialogue(npc: NPCPersonality, gameState: GameState): string {
    const primaryConcern = npc.currentConcerns[0];

    const concernDialogue: Record<string, string> = {
      children_safety: "The children ask me when the world will be green again. I don't know what to tell them.",
      food_shortage: "Our food stores are dwindling. We need to find more sources soon.",
      water_purifier: "The water purifier is showing signs of strain. If it fails...",
      supplies: "We're burning through our supplies faster than we can replenish them.",
      soil_analysis: "I've been studying the soil samples. The contamination patterns are... concerning.",
      seed_preservation: "These seeds may be our only chance. We must preserve their genetic integrity.",
      morale: "People are starting to lose hope. We need something to rally around.",
      community_unity: "Tensions are rising. We need to work together or we'll fall apart.",
      efficiency: "Our current methods are inefficient. We're wasting precious resources."
    };

    return concernDialogue[primaryConcern] || "Something's been troubling me lately.";
  }

  private static getEcosystemDialogue(
    npc: NPCPersonality,
    gameState: GameState,
    personality: typeof NPC_PERSONALITIES[PersonalityType]
  ): string {
    const soilHealth = gameState.ecosystem.soilHealth;
    const plantCount = gameState.ecosystem.plantInstances.length;

    if (npc.personality === 'scientific') {
      if (soilHealth > 50) {
        return "The soil chemistry is showing remarkable improvement. Microbial activity is increasing.";
      } else if (plantCount > 5) {
        return "These plant specimens are adapting faster than I anticipated. Natural selection at work.";
      } else {
        return "The contamination levels are still critical. We need more aggressive remediation.";
      }
    } else if (npc.personality === 'optimistic') {
      if (plantCount > 0) {
        return "Look at that green! Life finds a way, doesn't it?";
      } else {
        return "I know it looks barren now, but I can already imagine the forests that will grow here.";
      }
    } else if (npc.personality === 'pragmatic') {
      if (soilHealth < 30) {
        return "The ecosystem is still too unstable for reliable food production.";
      } else {
        return "Progress is measurable but slow. We need to be patient with the restoration process.";
      }
    } else {
      if (plantCount > 0) {
        return "The children are fascinated by the growing plants. It gives them hope for tomorrow.";
      } else {
        return "I worry about the world we're leaving for the next generation.";
      }
    }
  }

  private static getWeatherDialogue(
    npc: NPCPersonality,
    gameState: GameState,
    personality: typeof NPC_PERSONALITIES[PersonalityType]
  ): string {
    const weather = gameState.ecosystem.weatherPattern;

    switch (weather) {
      case 'drought':
        return personality.responses.drought;
      case 'storm':
        if (npc.personality === 'protective') {
          return "We need to secure the shelters. The children must be kept safe from the storm.";
        } else if (npc.personality === 'scientific') {
          return "Severe weather events like this are becoming more frequent. Climate instability is increasing.";
        } else {
          return "These storms are getting worse. We need better protection.";
        }
      case 'rain':
        return "Finally, some relief from the sky. Every drop is precious.";
      default:
        return "The weather has been stable lately. We should make the most of it.";
    }
  }

  private static getFailureDialogue(
    npc: NPCPersonality,
    gameState: GameState,
    personality: typeof NPC_PERSONALITIES[PersonalityType]
  ): string {
    if (npc.personality === 'optimistic') {
      return "Setbacks are just learning opportunities. We'll do better next time.";
    } else if (npc.personality === 'pragmatic') {
      return "We need to analyze what went wrong and adjust our approach.";
    } else if (npc.personality === 'protective') {
      return "We can't afford many more failures like this. People are depending on us.";
    } else {
      return "The data suggests we need to reconsider our methodology.";
    }
  }

  private static getGenericDialogue(
    npc: NPCPersonality,
    gameState: GameState,
    personality: typeof NPC_PERSONALITIES[PersonalityType]
  ): string {
    if (gameState.hope > personality.hopeThresholds.high) {
      return personality.responses.highHope;
    } else {
      return personality.responses.lowHope;
    }
  }

  private static addPersonalityFlavor(dialogue: string, npc: NPCPersonality, gameState: GameState): string {
    // Add personality-specific touches
    switch (npc.personality) {
      case 'scientific':
        if (Math.random() < 0.3) {
          dialogue += " The data supports this conclusion.";
        }
        break;
      case 'optimistic':
        if (Math.random() < 0.3) {
          dialogue += " Things will get better, you'll see.";
        }
        break;
      case 'protective':
        if (Math.random() < 0.3) {
          dialogue += " We have to think about the children.";
        }
        break;
      case 'pragmatic':
        if (Math.random() < 0.3) {
          dialogue += " We need to be realistic about this.";
        }
        break;
    }

    return dialogue;
  }

  private static addToDialogueMemory(npc: NPCPersonality, category: DialogueCategory, dialogue: string): void {
    const entry = `${category}:${dialogue.substring(0, 50)}`;
    npc.dialogueMemory.push(entry);

    // Keep only last 10 entries
    if (npc.dialogueMemory.length > 10) {
      npc.dialogueMemory.shift();
    }
  }

  /**
   * Update NPC trust based on player actions
   */
  static updateTrust(
    npc: NPCPersonality,
    action: string,
    gameState: GameState
  ): NPCPersonality {
    const personality = NPC_PERSONALITIES[npc.personality];
    let trustChange = 0;

    // Trust modifiers based on personality and action type
    const modifiers = personality.trustModifiers as Record<string, number>;
    if (action.includes('cooperat') && 'cooperation' in modifiers) {
      trustChange += modifiers.cooperation;
    }
    if (action.includes('shar') && 'sharing' in modifiers) {
      trustChange += modifiers.sharing;
    }
    if (action.includes('research') && 'research' in modifiers) {
      trustChange += modifiers.research;
    }
    if (action.includes('protect') && 'safety' in modifiers) {
      trustChange += modifiers.safety;
    }

    // General trust factors
    if (gameState.supplies > 50) {
      trustChange += 1; // Having good supplies increases trust
    }
    if (gameState.hope > 70) {
      trustChange += 1; // High hope is contagious
    }

    const newTrustLevel = Math.max(0, Math.min(100, npc.trustLevel + trustChange));

    return {
      ...npc,
      trustLevel: newTrustLevel
    };
  }

  /**
   * Evaluate concern factors for mood determination
   */
  private static evaluateConcerns(npc: NPCPersonality, gameState: GameState): number {
    let concernLevel = 0;

    // Check each current concern
    for (const concern of npc.currentConcerns) {
      switch (concern) {
        case 'food_shortage':
          if (gameState.supplies < 30) concernLevel++;
          break;
        case 'children_safety':
          if (gameState.health < 50) concernLevel++;
          break;
        case 'water_purifier':
          if (gameState.supplies < 20) concernLevel++;
          break;
        case 'soil_analysis':
          if (gameState.ecosystem.soilHealth < 25) concernLevel++;
          break;
        case 'morale':
          if (gameState.hope < 40) concernLevel++;
          break;
      }
    }

    return concernLevel;
  }

  /**
   * Update NPC concerns based on current game state
   */
  private static updateConcerns(npc: NPCPersonality, gameState: GameState): string[] {
    const newConcerns: string[] = [];

    // Personality-specific concern priorities
    switch (npc.personality) {
      case 'protective':
        if (gameState.health < 50) newConcerns.push('children_safety');
        if (gameState.supplies < 30) newConcerns.push('food_shortage');
        if (gameState.hope < 30) newConcerns.push('group_security');
        break;

      case 'pragmatic':
        if (gameState.supplies < 40) newConcerns.push('resource_management');
        if (gameState.ecosystem.soilHealth < 30) newConcerns.push('efficiency');
        if (gameState.knowledge < 20) newConcerns.push('planning');
        break;

      case 'scientific':
        if (gameState.ecosystem.soilHealth < 50) newConcerns.push('soil_analysis');
        if (gameState.seeds < 5) newConcerns.push('seed_preservation');
        if (gameState.knowledge < 30) newConcerns.push('research_progress');
        break;

      case 'optimistic':
        if (gameState.hope < 50) newConcerns.push('morale');
        if (Object.keys(gameState.relationships).length < 2) newConcerns.push('community_unity');
        if (gameState.restorationProgress < 20) newConcerns.push('long_term_hope');
        break;
    }

    // Ensure at least one concern
    if (newConcerns.length === 0) {
      newConcerns.push('general_wellbeing');
    }

    return newConcerns.slice(0, 3); // Limit to 3 concerns max
  }

  /**
   * Get NPC availability for interactions based on mood and trust
   */
  static getNPCAvailability(npc: NPCPersonality, gameState: GameState): {
    available: boolean;
    reason?: string;
    dialogue?: string;
  } {
    // NPCs with very low trust may refuse to interact
    if (npc.trustLevel < 10) {
      return {
        available: false,
        reason: 'Low trust',
        dialogue: `${npc.name} avoids eye contact and turns away. Their trust in you has been broken.`
      };
    }

    // Desperate NPCs may be difficult to talk to
    if (npc.mood === 'desperate' && gameState.hope < 15) {
      return {
        available: false,
        reason: 'Despair',
        dialogue: `${npc.name} stares into the distance, lost in despair. They're not ready to talk.`
      };
    }

    return { available: true };
  }

  /**
   * Update all NPCs based on current game state
   */
  static updateAllNPCs(npcs: Record<string, NPCPersonality>, gameState: GameState): Record<string, NPCPersonality> {
    const updatedNPCs: Record<string, NPCPersonality> = {};

    for (const [npcId, npc] of Object.entries(npcs)) {
      updatedNPCs[npcId] = this.updateNPCMood(npc, gameState);
    }

    return updatedNPCs;
  }
}