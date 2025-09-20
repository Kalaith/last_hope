import type { GameState } from '../types/game';

export interface ResearchNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  knowledgeRequired: number;
  prerequisites: string[]; // Other research IDs required
  category: 'agriculture' | 'ecology' | 'construction' | 'survival' | 'social';
  benefits: {
    unlocks?: string[]; // Choice IDs, plant types, construction options
    boosts?: { [key: string]: number }; // Resource generation bonuses
    abilities?: string[]; // Special abilities gained
  };
  researchTime?: number; // Days required to research (optional)
  isUnlocked: boolean;
  isResearched: boolean;
}

export interface ResearchProgress {
  currentResearch: string | null; // Currently researching node ID
  daysInProgress: number;
  completedResearch: string[];
  availableResearch: string[];
}

class ResearchSystemManager {
  private researchTree: ResearchNode[] = [
    // Agriculture Branch
    {
      id: 'soil_chemistry_basics',
      name: 'Soil Chemistry Fundamentals',
      description: 'Understanding pH levels, nutrient cycles, and basic soil composition for better plant growth.',
      icon: '🧪',
      knowledgeRequired: 15,
      prerequisites: [],
      category: 'agriculture',
      benefits: {
        boosts: { soilHealth: 1.2 }, // 20% faster soil improvement
        unlocks: ['soil_testing_choice', 'ph_adjustment_choice']
      },
      isUnlocked: false,
      isResearched: false
    },

    {
      id: 'plant_breeding_techniques',
      name: 'Plant Breeding & Selection',
      description: 'Advanced techniques for selecting and breeding plants with improved yields and disease resistance.',
      icon: '🌱',
      knowledgeRequired: 25,
      prerequisites: ['soil_chemistry_basics'],
      category: 'agriculture',
      benefits: {
        boosts: { seedYield: 1.3 }, // 30% more seeds from harvests
        unlocks: ['selective_breeding_choice', 'hardy_varieties_plant']
      },
      isUnlocked: false,
      isResearched: false
    },

    {
      id: 'permaculture_design',
      name: 'Permaculture Systems',
      description: 'Sustainable design principles that create self-maintaining agricultural ecosystems.',
      icon: '♻️',
      knowledgeRequired: 40,
      prerequisites: ['plant_breeding_techniques', 'water_conservation'],
      category: 'agriculture',
      benefits: {
        boosts: { dailySupplies: 1.4, soilHealth: 1.3 },
        unlocks: ['companion_planting_choice', 'food_forest_construction']
      },
      isUnlocked: false,
      isResearched: false
    },

    // Ecology Branch
    {
      id: 'ecosystem_dynamics',
      name: 'Ecosystem Relationships',
      description: 'Study of how different species interact and support each other in healthy ecosystems.',
      icon: '🔗',
      knowledgeRequired: 20,
      prerequisites: [],
      category: 'ecology',
      benefits: {
        boosts: { plantDiversity: 1.25 },
        unlocks: ['species_introduction_choice', 'symbiotic_planting']
      },
      isUnlocked: false,
      isResearched: false
    },

    {
      id: 'mycorrhizal_networks',
      name: 'Fungal Root Networks',
      description: 'Understanding how fungi create underground networks that help plants share nutrients.',
      icon: '🍄',
      knowledgeRequired: 35,
      prerequisites: ['ecosystem_dynamics', 'soil_chemistry_basics'],
      category: 'ecology',
      benefits: {
        boosts: { plantHealth: 1.3, soilRestoration: 1.5 },
        unlocks: ['fungal_inoculation_choice', 'mycelial_remediation']
      },
      isUnlocked: false,
      isResearched: false
    },

    {
      id: 'pollinator_restoration',
      name: 'Pollinator Ecosystem',
      description: 'Strategies for attracting and supporting bees, butterflies, and other crucial pollinators.',
      icon: '🦋',
      knowledgeRequired: 30,
      prerequisites: ['ecosystem_dynamics'],
      category: 'ecology',
      benefits: {
        boosts: { seedProduction: 1.4, plantReproduction: 1.6 },
        unlocks: ['pollinator_gardens', 'native_flower_meadows']
      },
      isUnlocked: false,
      isResearched: false
    },

    // Construction Branch
    {
      id: 'sustainable_construction',
      name: 'Green Building Techniques',
      description: 'Eco-friendly construction methods using natural and recycled materials.',
      icon: '🏗️',
      knowledgeRequired: 18,
      prerequisites: [],
      category: 'construction',
      benefits: {
        boosts: { constructionEfficiency: 1.2 },
        unlocks: ['earth_bag_construction', 'solar_greenhouse_upgrade']
      },
      isUnlocked: false,
      isResearched: false
    },

    {
      id: 'water_conservation',
      name: 'Water Management Systems',
      description: 'Advanced techniques for collecting, storing, and efficiently using water resources.',
      icon: '💧',
      knowledgeRequired: 22,
      prerequisites: ['sustainable_construction'],
      category: 'construction',
      benefits: {
        boosts: { waterEfficiency: 1.4 },
        unlocks: ['rainwater_harvesting', 'greywater_recycling', 'water_purifier_v2']
      },
      isUnlocked: false,
      isResearched: false
    },

    {
      id: 'renewable_energy',
      name: 'Alternative Energy Systems',
      description: 'Solar, wind, and biomass energy solutions for sustainable power generation.',
      icon: '⚡',
      knowledgeRequired: 28,
      prerequisites: ['sustainable_construction'],
      category: 'construction',
      benefits: {
        boosts: { energyGeneration: 1.5 },
        unlocks: ['wind_turbine_construction', 'biogas_digester', 'solar_panel_v2']
      },
      isUnlocked: false,
      isResearched: false
    },

    // Survival Branch
    {
      id: 'medicinal_plants',
      name: 'Natural Medicine',
      description: 'Identifying and cultivating plants with healing properties for community health.',
      icon: '🌿',
      knowledgeRequired: 16,
      prerequisites: [],
      category: 'survival',
      benefits: {
        boosts: { healthRecovery: 1.3 },
        unlocks: ['herbal_remedies_choice', 'medicine_garden']
      },
      isUnlocked: false,
      isResearched: false
    },

    {
      id: 'food_preservation',
      name: 'Food Storage & Preservation',
      description: 'Traditional and modern techniques for extending food shelf life without refrigeration.',
      icon: '🥫',
      knowledgeRequired: 20,
      prerequisites: ['medicinal_plants'],
      category: 'survival',
      benefits: {
        boosts: { foodSpoilage: 0.7 }, // 30% less food loss
        unlocks: ['smoking_techniques', 'fermentation_choice', 'root_cellar']
      },
      isUnlocked: false,
      isResearched: false
    },

    // Social Branch
    {
      id: 'community_organizing',
      name: 'Group Leadership & Cooperation',
      description: 'Strategies for building trust, resolving conflicts, and organizing collaborative efforts.',
      icon: '🤝',
      knowledgeRequired: 12,
      prerequisites: [],
      category: 'social',
      benefits: {
        boosts: { trustGain: 1.3, conflictResolution: 1.5 },
        unlocks: ['consensus_building_choice', 'conflict_mediation_choice']
      },
      isUnlocked: false,
      isResearched: false
    },

    {
      id: 'knowledge_sharing',
      name: 'Teaching & Documentation',
      description: 'Methods for effectively sharing knowledge and training others in essential skills.',
      icon: '📚',
      knowledgeRequired: 24,
      prerequisites: ['community_organizing'],
      category: 'social',
      benefits: {
        boosts: { knowledgeGeneration: 1.2, skillTransfer: 1.4 },
        unlocks: ['teaching_workshops', 'skill_documentation', 'apprenticeship_system']
      },
      isUnlocked: false,
      isResearched: false
    },

    // Advanced Integrative Research
    {
      id: 'regenerative_agriculture',
      name: 'Regenerative Ecosystem Design',
      description: 'Advanced integration of all restoration knowledge into self-sustaining systems.',
      icon: '🌍',
      knowledgeRequired: 60,
      prerequisites: ['permaculture_design', 'mycorrhizal_networks', 'water_conservation'],
      category: 'agriculture',
      benefits: {
        boosts: { ecosystemRegeneration: 2.0, soilHealth: 1.8 },
        unlocks: ['ecosystem_restoration_mastery', 'climate_adaptation_techniques']
      },
      isUnlocked: false,
      isResearched: false
    }
  ];

  /**
   * Initialize research progress for a new game
   */
  initializeResearchProgress(): ResearchProgress {
    return {
      currentResearch: null,
      daysInProgress: 0,
      completedResearch: [],
      availableResearch: this.getAvailableResearch([])
    };
  }

  /**
   * Get research nodes that can currently be unlocked
   */
  getAvailableResearch(completedResearch: string[]): string[] {
    return this.researchTree
      .filter(node => {
        // Not already researched
        if (completedResearch.includes(node.id)) return false;

        // All prerequisites met
        return node.prerequisites.every(prereq => completedResearch.includes(prereq));
      })
      .map(node => node.id);
  }

  /**
   * Check if a research node can be started
   */
  canStartResearch(nodeId: string, gameState: GameState, completedResearch: string[]): boolean {
    const node = this.researchTree.find(n => n.id === nodeId);
    if (!node) return false;

    // Check knowledge requirement
    if (gameState.knowledge < node.knowledgeRequired) return false;

    // Check prerequisites
    if (!node.prerequisites.every(prereq => completedResearch.includes(prereq))) return false;

    // Check if already researched
    if (completedResearch.includes(nodeId)) return false;

    return true;
  }

  /**
   * Start researching a node
   */
  startResearch(nodeId: string, gameState: GameState, researchProgress: ResearchProgress): ResearchProgress {
    if (!this.canStartResearch(nodeId, gameState, researchProgress.completedResearch)) {
      return researchProgress;
    }

    return {
      ...researchProgress,
      currentResearch: nodeId,
      daysInProgress: 0
    };
  }

  /**
   * Process daily research progress
   */
  processResearchProgress(researchProgress: ResearchProgress, gameState: GameState): {
    progress: ResearchProgress;
    completedResearch: string | null;
  } {
    if (!researchProgress.currentResearch) {
      return { progress: researchProgress, completedResearch: null };
    }

    const node = this.researchTree.find(n => n.id === researchProgress.currentResearch);
    if (!node) {
      return { progress: researchProgress, completedResearch: null };
    }

    const newProgress = {
      ...researchProgress,
      daysInProgress: researchProgress.daysInProgress + 1
    };

    // Check if research is complete
    const researchTime = node.researchTime || Math.ceil(node.knowledgeRequired / 3); // Default: ~1/3 knowledge in days
    const isComplete = newProgress.daysInProgress >= researchTime;

    if (isComplete) {
      const updatedProgress = {
        ...newProgress,
        currentResearch: null,
        daysInProgress: 0,
        completedResearch: [...newProgress.completedResearch, node.id],
        availableResearch: this.getAvailableResearch([...newProgress.completedResearch, node.id])
      };

      return {
        progress: updatedProgress,
        completedResearch: node.id
      };
    }

    return { progress: newProgress, completedResearch: null };
  }

  /**
   * Get research tree for UI display
   */
  getResearchTree(): ResearchNode[] {
    return [...this.researchTree];
  }

  /**
   * Get research node by ID
   */
  getResearchNode(nodeId: string): ResearchNode | null {
    return this.researchTree.find(node => node.id === nodeId) || null;
  }

  /**
   * Get research benefits that apply to current game state
   */
  getActiveBoosts(completedResearch: string[]): Record<string, number> {
    const boosts: Record<string, number> = {};

    completedResearch.forEach(researchId => {
      const node = this.researchTree.find(n => n.id === researchId);
      if (node?.benefits.boosts) {
        Object.entries(node.benefits.boosts).forEach(([key, value]) => {
          boosts[key] = (boosts[key] || 1) * value;
        });
      }
    });

    return boosts;
  }

  /**
   * Get unlocked content from completed research
   */
  getUnlockedContent(completedResearch: string[]): {
    choices: string[];
    constructions: string[];
    abilities: string[];
  } {
    const unlocked = {
      choices: [] as string[],
      constructions: [] as string[],
      abilities: [] as string[]
    };

    completedResearch.forEach(researchId => {
      const node = this.researchTree.find(n => n.id === researchId);
      if (node?.benefits.unlocks) {
        node.benefits.unlocks.forEach(unlock => {
          if (unlock.includes('choice')) {
            unlocked.choices.push(unlock);
          } else if (unlock.includes('construction') || unlock.includes('building')) {
            unlocked.constructions.push(unlock);
          } else {
            unlocked.abilities.push(unlock);
          }
        });
      }
      if (node?.benefits.abilities) {
        unlocked.abilities.push(...node.benefits.abilities);
      }
    });

    return unlocked;
  }

  /**
   * Check if a specific unlock is available
   */
  hasUnlock(unlockId: string, completedResearch: string[]): boolean {
    return completedResearch.some(researchId => {
      const node = this.researchTree.find(n => n.id === researchId);
      return node?.benefits.unlocks?.includes(unlockId) || node?.benefits.abilities?.includes(unlockId);
    });
  }

  /**
   * Get research recommendations based on current game state
   */
  getResearchRecommendations(gameState: GameState, researchProgress: ResearchProgress): string[] {
    const available = researchProgress.availableResearch;
    const recommendations: { id: string; priority: number }[] = [];

    available.forEach(nodeId => {
      const node = this.researchTree.find(n => n.id === nodeId);
      if (!node || !this.canStartResearch(nodeId, gameState, researchProgress.completedResearch)) return;

      let priority = 0;

      // Prioritize based on current needs
      if (gameState.health < 50 && node.category === 'survival') priority += 3;
      if (gameState.supplies < 30 && node.category === 'agriculture') priority += 3;
      if (gameState.ecosystem.soilHealth < 30 && node.category === 'ecology') priority += 2;
      if ((gameState.baseStructures?.length || 0) > 2 && node.category === 'construction') priority += 2;

      // Prioritize based on trust issues
      const lowTrust = Object.values(gameState.npcs || {}).some(npc => npc.trustLevel < 40);
      if (lowTrust && node.category === 'social') priority += 3;

      // Lower priority for high knowledge requirements relative to current knowledge
      if (node.knowledgeRequired > gameState.knowledge * 1.5) priority -= 2;

      recommendations.push({ id: nodeId, priority });
    });

    return recommendations
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3)
      .map(r => r.id);
  }
}

export const researchSystem = new ResearchSystemManager();