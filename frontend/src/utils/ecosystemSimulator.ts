import type { EcosystemState, PlantInstance, GameState } from '../types/game';

// Plant species definitions
export const PLANT_SPECIES = {
  hardy_grass: {
    name: 'Hardy Grass',
    soilRequirement: 0,
    growthRate: 3,
    soilImprovement: 1,
    seedYield: 2,
    description: 'Tough grass that can grow in the worst conditions'
  },
  pioneer_herb: {
    name: 'Pioneer Herb',
    soilRequirement: 10,
    growthRate: 2,
    soilImprovement: 2,
    seedYield: 1,
    description: 'First to colonize damaged soil'
  },
  nitrogen_fixer: {
    name: 'Nitrogen-Fixing Legume',
    soilRequirement: 30,
    growthRate: 1.5,
    soilImprovement: 5,
    seedYield: 3,
    description: 'Dramatically improves soil chemistry'
  },
  desert_bloom: {
    name: 'Desert Resurrection Plant',
    soilRequirement: 5,
    growthRate: 1,
    soilImprovement: 2,
    seedYield: 1,
    description: 'Survives extreme drought conditions'
  },
  forest_sapling: {
    name: 'Forest Sapling',
    soilRequirement: 50,
    growthRate: 0.5,
    soilImprovement: 8,
    seedYield: 5,
    description: 'Young tree that will grow into a mighty oak'
  }
} as const;

export type PlantSpeciesId = keyof typeof PLANT_SPECIES;

// Weather impact on plant growth and survival
const WEATHER_MODIFIERS = {
  drought: {
    growthRate: 0.3,
    survivalRate: 0.7,
    description: 'Scorching heat withers plants'
  },
  rain: {
    growthRate: 1.5,
    survivalRate: 1.0,
    description: 'Life-giving rain nourishes growth'
  },
  stable: {
    growthRate: 1.0,
    survivalRate: 0.95,
    description: 'Mild conditions support steady growth'
  },
  storm: {
    growthRate: 0.8,
    survivalRate: 0.6,
    description: 'Violent storms damage fragile plants'
  }
} as const;

// Seasonal effects
const SEASONAL_MODIFIERS = {
  spring: {
    growthBonus: 1.3,
    plantingBonus: true,
    description: 'New life emerges from winter sleep'
  },
  summer: {
    growthBonus: 1.1,
    plantingBonus: false,
    description: 'Growing season at its peak'
  },
  autumn: {
    growthBonus: 0.8,
    plantingBonus: false,
    description: 'Plants prepare for winter dormancy'
  },
  winter: {
    growthBonus: 0.4,
    plantingBonus: false,
    description: 'Harsh cold slows all growth'
  }
} as const;

export class EcosystemSimulator {
  /**
   * Simulate ecosystem growth over time
   */
  static simulateGrowth(ecosystem: EcosystemState, timeElapsed: number): EcosystemState {
    const updated = { ...ecosystem };

    // Update each plant instance
    updated.plantInstances = ecosystem.plantInstances.map(plant =>
      this.updatePlantGrowth(plant, ecosystem, timeElapsed)
    ).filter(plant => plant.health > 0); // Remove dead plants

    // Update soil health based on plant contributions
    updated.soilHealth = this.calculateSoilImprovement(updated.plantInstances, ecosystem.soilHealth);

    // Update plant diversity
    updated.plantDiversity = this.calculatePlantDiversity(updated.plantInstances);

    // Progress seasonal cycle
    updated.seasonalCycle = this.progressSeason(ecosystem.seasonalCycle, timeElapsed);

    // Random weather changes
    updated.weatherPattern = this.updateWeather(ecosystem.weatherPattern, timeElapsed);

    return updated;
  }

  /**
   * Plant a new seed in the ecosystem
   */
  static plantSeed(
    ecosystem: EcosystemState,
    species: PlantSpeciesId,
    gameState: GameState
  ): { success: boolean; message: string; newPlant?: PlantInstance } {
    const plantType = PLANT_SPECIES[species];

    // Check soil requirements
    if (ecosystem.soilHealth < plantType.soilRequirement) {
      return {
        success: false,
        message: `${plantType.name} requires soil health of at least ${plantType.soilRequirement}%. Current: ${ecosystem.soilHealth.toFixed(1)}%`
      };
    }

    // Check if player has enough knowledge for advanced species
    if (plantType.soilRequirement > 20 && gameState.knowledge < 25) {
      return {
        success: false,
        message: `Planting ${plantType.name} requires more botanical knowledge`
      };
    }

    // Create new plant instance
    const newPlant: PlantInstance = {
      id: `plant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      species,
      health: 100,
      maturity: 0,
      soilContribution: plantType.soilImprovement,
      seedYield: plantType.seedYield
    };

    return {
      success: true,
      message: `Successfully planted ${plantType.name}`,
      newPlant
    };
  }

  /**
   * Update individual plant growth
   */
  private static updatePlantGrowth(
    plant: PlantInstance,
    ecosystem: EcosystemState,
    timeElapsed: number
  ): PlantInstance {
    const species = PLANT_SPECIES[plant.species as PlantSpeciesId];
    const weather = WEATHER_MODIFIERS[ecosystem.weatherPattern];
    const season = SEASONAL_MODIFIERS[ecosystem.seasonalCycle];

    // Base growth rate
    let growthRate = species.growthRate;

    // Apply weather modifier
    growthRate *= weather.growthRate;

    // Apply seasonal modifier
    growthRate *= season.growthBonus;

    // Soil health affects growth (plants struggle in poor soil)
    const soilModifier = Math.max(0.3, ecosystem.soilHealth / 100);
    growthRate *= soilModifier;

    // Update maturity
    const newMaturity = Math.min(100, plant.maturity + growthRate * timeElapsed);

    // Health changes based on conditions
    let healthChange = 0;

    // Weather survival check
    if (Math.random() > weather.survivalRate) {
      healthChange -= 10 * timeElapsed; // Weather damage
    }

    // Plants in very poor soil lose health over time
    if (ecosystem.soilHealth < 10) {
      healthChange -= 2 * timeElapsed;
    }

    // Mature plants are more resilient
    if (plant.maturity > 50) {
      healthChange += 1 * timeElapsed; // Mature plants self-sustain better
    }

    const newHealth = Math.max(0, Math.min(100, plant.health + healthChange));

    return {
      ...plant,
      maturity: newMaturity,
      health: newHealth
    };
  }

  /**
   * Calculate soil improvement from plant contributions
   */
  private static calculateSoilImprovement(plants: PlantInstance[], currentSoil: number): number {
    if (plants.length === 0) {
      // Soil degrades naturally without plants
      return Math.max(0, currentSoil - 0.1);
    }

    let totalImprovement = 0;
    let maturePlants = 0;

    for (const plant of plants) {
      if (plant.health > 50 && plant.maturity > 30) {
        // Only healthy, somewhat mature plants contribute significantly
        const contribution = plant.soilContribution * (plant.maturity / 100) * (plant.health / 100);
        totalImprovement += contribution;
        maturePlants++;
      }
    }

    // Diminishing returns - soil improvement slows as soil gets better
    const improvementRate = Math.max(0.1, 1 - (currentSoil / 100));
    const actualImprovement = totalImprovement * improvementRate * 0.1; // Scale down for balance

    return Math.min(100, currentSoil + actualImprovement);
  }

  /**
   * Calculate plant diversity score
   */
  private static calculatePlantDiversity(plants: PlantInstance[]): number {
    if (plants.length === 0) return 0;

    const speciesCount = new Set(plants.map(p => p.species)).size;
    const totalPlants = plants.length;

    // Diversity bonus for having multiple species
    const speciesBonus = Math.min(5, speciesCount) * 10;

    // Scale by total plant count
    const populationScore = Math.min(50, totalPlants * 2);

    return Math.min(100, speciesBonus + populationScore);
  }

  /**
   * Progress seasonal cycle
   */
  private static progressSeason(
    currentSeason: EcosystemState['seasonalCycle'],
    timeElapsed: number
  ): EcosystemState['seasonalCycle'] {
    // For now, simple random season changes
    // In a full implementation, this would be time-based
    if (Math.random() < 0.05 * timeElapsed) {
      const seasons: EcosystemState['seasonalCycle'][] = ['spring', 'summer', 'autumn', 'winter'];
      const currentIndex = seasons.indexOf(currentSeason);
      return seasons[(currentIndex + 1) % seasons.length];
    }
    return currentSeason;
  }

  /**
   * Update weather patterns
   */
  private static updateWeather(
    currentWeather: EcosystemState['weatherPattern'],
    timeElapsed: number
  ): EcosystemState['weatherPattern'] {
    // Weather changes more frequently than seasons
    if (Math.random() < 0.1 * timeElapsed) {
      const patterns: EcosystemState['weatherPattern'][] = ['stable', 'rain', 'drought', 'storm'];

      // Weighted random selection
      const weights = {
        stable: 0.4,
        rain: 0.3,
        drought: 0.2,
        storm: 0.1
      };

      const random = Math.random();
      let cumulative = 0;

      for (const [pattern, weight] of Object.entries(weights)) {
        cumulative += weight;
        if (random < cumulative) {
          return pattern as EcosystemState['weatherPattern'];
        }
      }
    }
    return currentWeather;
  }

  /**
   * Harvest mature plants for seeds
   */
  static harvestSeeds(plants: PlantInstance[]): { seedsGained: number; plantsHarvested: PlantInstance[] } {
    const maturePlants = plants.filter(p => p.maturity >= 80 && p.health > 50);
    let totalSeeds = 0;

    for (const plant of maturePlants) {
      const species = PLANT_SPECIES[plant.species as PlantSpeciesId];
      totalSeeds += species.seedYield;
    }

    return {
      seedsGained: totalSeeds,
      plantsHarvested: maturePlants
    };
  }

  /**
   * Get ecosystem description for UI
   */
  static getEcosystemDescription(ecosystem: EcosystemState): string {
    const soilDesc = ecosystem.soilHealth < 20 ? 'poisoned and barren' :
                     ecosystem.soilHealth < 50 ? 'damaged but recovering' :
                     ecosystem.soilHealth < 80 ? 'healthy and fertile' : 'thriving with life';

    const plantCount = ecosystem.plantInstances.length;
    const plantDesc = plantCount === 0 ? 'No plants have taken root' :
                      plantCount < 5 ? 'A few hardy plants struggle to survive' :
                      plantCount < 15 ? 'Small patches of green emerge from the wasteland' :
                      'A growing ecosystem flourishes';

    const weather = WEATHER_MODIFIERS[ecosystem.weatherPattern];

    return `The soil is ${soilDesc}. ${plantDesc}. ${weather.description}.`;
  }

  /**
   * Get visual representation of ecosystem state
   */
  static getEcosystemVisual(ecosystem: EcosystemState): string {
    const soilHealth = ecosystem.soilHealth;
    const plantCount = ecosystem.plantInstances.length;

    if (soilHealth < 10 && plantCount === 0) {
      return '☠️ 💀 ☠️'; // Dead wasteland
    } else if (soilHealth < 30 && plantCount < 3) {
      return '⚫ ⚫ 🌱'; // Mostly barren with tiny sprouts
    } else if (soilHealth < 50 && plantCount < 10) {
      return '🌱 🌿 🌱'; // Early recovery
    } else if (soilHealth < 70 && plantCount < 20) {
      return '🌿 🪴 🌿'; // Growing ecosystem
    } else {
      return '🌳 🌲 🌳'; // Thriving forest
    }
  }
}