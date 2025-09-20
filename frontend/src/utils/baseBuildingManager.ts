import type { GameState } from '../types/game';
import type {
  BaseStructure,
  ConstructionProject,
  StructureType,
  StructureBlueprint,
  StructureLevel
} from '../types/structures';
import { getResourceValue } from './typeHelpers';

// Define all available structures
export const STRUCTURE_BLUEPRINTS: Record<StructureType, StructureBlueprint> = {
  greenhouse: {
    type: 'greenhouse',
    name: 'Greenhouse',
    description: 'Controlled environment for growing plants and developing seeds',
    icon: '🏢',
    category: 'production',
    unlockRequirements: {
      knowledge: 15,
      restorationProgress: 10
    },
    levels: [
      {
        level: 1,
        name: 'Basic Greenhouse',
        description: 'Simple protected growing space with basic climate control',
        buildCost: { supplies: 25, knowledge: 10, health: 15 },
        buildTime: 3,
        dailyProduction: { seeds: 1, hope: 2 },
        dailyMaintenance: { supplies: 1 },
        specialEffects: ['Protects plants from harsh weather', 'Faster seed development']
      },
      {
        level: 2,
        name: 'Advanced Greenhouse',
        description: 'Automated systems with soil nutrient cycling and pest control',
        buildCost: { supplies: 45, knowledge: 25, health: 20 },
        buildTime: 5,
        dailyProduction: { seeds: 2, hope: 4, soilHealth: 1 },
        dailyMaintenance: { supplies: 2, knowledge: 1 },
        specialEffects: ['Automated watering', 'Disease resistance research', '50% faster plant growth']
      },
      {
        level: 3,
        name: 'Bio-Research Greenhouse',
        description: 'Cutting-edge facility for genetic preservation and enhancement',
        buildCost: { supplies: 80, knowledge: 50, seeds: 5, health: 30 },
        buildTime: 8,
        dailyProduction: { seeds: 4, knowledge: 2, hope: 6, soilHealth: 2 },
        dailyMaintenance: { supplies: 3, knowledge: 2 },
        specialEffects: ['Genetic preservation vault', 'New species development', 'Ecosystem modeling']
      }
    ]
  },

  water_purifier: {
    type: 'water_purifier',
    name: 'Water Purification System',
    description: 'Converts contaminated water into clean, usable resources',
    icon: '💧',
    category: 'production',
    unlockRequirements: {
      knowledge: 10
    },
    levels: [
      {
        level: 1,
        name: 'Basic Filter System',
        description: 'Simple filtration and boiling setup for basic water purification',
        buildCost: { supplies: 20, knowledge: 5, health: 10 },
        buildTime: 2,
        dailyProduction: { supplies: 3, health: 1 },
        dailyMaintenance: { supplies: 1 },
        specialEffects: ['Reduces water-borne illness', 'Stable water supply']
      },
      {
        level: 2,
        name: 'Chemical Treatment Plant',
        description: 'Advanced filtration with chemical neutralization of toxins',
        buildCost: { supplies: 40, knowledge: 20, health: 15 },
        buildTime: 4,
        dailyProduction: { supplies: 6, health: 3, hope: 1 },
        dailyMaintenance: { supplies: 2, knowledge: 1 },
        specialEffects: ['Removes radiation', 'Medical-grade water', 'Irrigation support']
      },
      {
        level: 3,
        name: 'Atmospheric Water Generator',
        description: 'Extracts pure water directly from the atmosphere using solar power',
        buildCost: { supplies: 70, knowledge: 40, health: 25 },
        buildTime: 6,
        dailyProduction: { supplies: 10, health: 5, hope: 3, soilHealth: 1 },
        dailyMaintenance: { knowledge: 1 },
        specialEffects: ['Self-sustaining', 'Atmospheric cleaning', 'Unlimited water source']
      }
    ]
  },

  research_lab: {
    type: 'research_lab',
    name: 'Research Laboratory',
    description: 'Scientific facility for advancing restoration knowledge and techniques',
    icon: '🔬',
    category: 'research',
    unlockRequirements: {
      knowledge: 25,
      restorationProgress: 15
    },
    levels: [
      {
        level: 1,
        name: 'Field Research Station',
        description: 'Basic equipment for soil analysis and plant studies',
        buildCost: { supplies: 30, knowledge: 15, health: 12 },
        buildTime: 3,
        dailyProduction: { knowledge: 3, hope: 1 },
        dailyMaintenance: { supplies: 1 },
        specialEffects: ['Soil composition analysis', 'Plant health monitoring', 'Weather prediction']
      },
      {
        level: 2,
        name: 'Environmental Lab',
        description: 'Comprehensive facility for ecosystem analysis and experimentation',
        buildCost: { supplies: 55, knowledge: 35, health: 20 },
        buildTime: 5,
        dailyProduction: { knowledge: 5, soilHealth: 1, hope: 2 },
        dailyMaintenance: { supplies: 2, knowledge: 1 },
        specialEffects: ['Genetic sequencing', 'Pollution remediation research', 'Climate modeling']
      },
      {
        level: 3,
        name: 'Restoration Research Institute',
        description: 'Advanced facility capable of breakthrough ecological discoveries',
        buildCost: { supplies: 90, knowledge: 60, seeds: 3, health: 35 },
        buildTime: 8,
        dailyProduction: { knowledge: 8, soilHealth: 3, hope: 5, seeds: 1 },
        dailyMaintenance: { supplies: 3, knowledge: 2 },
        specialEffects: ['Ecosystem simulation', 'Species resurrection', 'Environmental engineering']
      }
    ]
  },

  solar_panel: {
    type: 'solar_panel',
    name: 'Solar Power Array',
    description: 'Renewable energy system that powers other structures more efficiently',
    icon: '☀️',
    category: 'utility',
    unlockRequirements: {
      knowledge: 20
    },
    levels: [
      {
        level: 1,
        name: 'Basic Solar Panels',
        description: 'Simple photovoltaic cells that reduce power requirements',
        buildCost: { supplies: 35, knowledge: 12, health: 10 },
        buildTime: 2,
        dailyProduction: { hope: 2 },
        dailyMaintenance: { supplies: 0 },
        specialEffects: ['Reduces maintenance costs for all structures by 25%', 'Clean energy']
      },
      {
        level: 2,
        name: 'Efficient Solar Array',
        description: 'High-efficiency panels with battery storage for consistent power',
        buildCost: { supplies: 60, knowledge: 25, health: 15 },
        buildTime: 4,
        dailyProduction: { hope: 4, supplies: 1 },
        dailyMaintenance: { supplies: 0 },
        specialEffects: ['Reduces maintenance costs by 50%', 'Powers water purification', 'Energy surplus']
      },
      {
        level: 3,
        name: 'Smart Energy Grid',
        description: 'Automated power management system with advanced storage',
        buildCost: { supplies: 100, knowledge: 45, health: 25 },
        buildTime: 6,
        dailyProduction: { hope: 6, supplies: 3, knowledge: 1 },
        dailyMaintenance: { supplies: 0 },
        specialEffects: ['Eliminates maintenance costs', 'Boosts all production by 25%', 'Grid stability']
      }
    ]
  },

  workshop: {
    type: 'workshop',
    name: 'Workshop',
    description: 'Crafting and repair facility for tools, equipment, and infrastructure',
    icon: '🔧',
    category: 'utility',
    unlockRequirements: {
      knowledge: 8
    },
    levels: [
      {
        level: 1,
        name: 'Basic Workshop',
        description: 'Simple tools and workbench for essential repairs and crafting',
        buildCost: { supplies: 15, knowledge: 5, health: 8 },
        buildTime: 2,
        dailyProduction: { supplies: 2 },
        dailyMaintenance: { supplies: 1 },
        specialEffects: ['Structure maintenance', 'Tool crafting', 'Equipment repair']
      },
      {
        level: 2,
        name: 'Engineering Workshop',
        description: 'Advanced tools and machinery for complex construction projects',
        buildCost: { supplies: 40, knowledge: 18, health: 15 },
        buildTime: 4,
        dailyProduction: { supplies: 4, knowledge: 1 },
        dailyMaintenance: { supplies: 1 },
        specialEffects: ['Faster construction', 'Advanced materials', 'Precision instruments']
      },
      {
        level: 3,
        name: 'Fabrication Facility',
        description: 'Automated manufacturing system for sophisticated equipment',
        buildCost: { supplies: 75, knowledge: 35, health: 25 },
        buildTime: 6,
        dailyProduction: { supplies: 7, knowledge: 2, hope: 2 },
        dailyMaintenance: { supplies: 2, knowledge: 1 },
        specialEffects: ['Automated production', 'Quality improvements', 'Innovation research']
      }
    ]
  },

  storage_facility: {
    type: 'storage_facility',
    name: 'Storage Facility',
    description: 'Secure storage for resources, seeds, and equipment',
    icon: '📦',
    category: 'utility',
    unlockRequirements: {
      knowledge: 5
    },
    levels: [
      {
        level: 1,
        name: 'Basic Storage',
        description: 'Simple warehouse with climate control for resource preservation',
        buildCost: { supplies: 10, knowledge: 3, health: 5 },
        buildTime: 1,
        dailyProduction: {},
        dailyMaintenance: {},
        capacity: 50,
        specialEffects: ['Increases resource caps by 50%', 'Prevents spoilage', 'Organized inventory']
      },
      {
        level: 2,
        name: 'Climate-Controlled Vault',
        description: 'Advanced storage with environmental controls and security',
        buildCost: { supplies: 25, knowledge: 12, health: 10 },
        buildTime: 3,
        dailyProduction: { hope: 1 },
        dailyMaintenance: { supplies: 1 },
        capacity: 100,
        specialEffects: ['Increases resource caps by 100%', 'Seed preservation', 'Reduces waste']
      },
      {
        level: 3,
        name: 'Automated Distribution Center',
        description: 'Smart storage system with automated logistics and preservation',
        buildCost: { supplies: 50, knowledge: 25, health: 18 },
        buildTime: 5,
        dailyProduction: { hope: 3, supplies: 1 },
        dailyMaintenance: { supplies: 1, knowledge: 1 },
        capacity: 200,
        specialEffects: ['Increases all resource caps by 150%', 'Automated distribution', 'Resource optimization']
      }
    ]
  }
};

export class BaseBuildingManager {
  private static structures: BaseStructure[] = [];
  private static constructionProjects: ConstructionProject[] = [];

  /**
   * Get all constructed structures
   */
  static getStructures(): BaseStructure[] {
    return [...this.structures];
  }

  /**
   * Get active construction projects
   */
  static getConstructionProjects(): ConstructionProject[] {
    return [...this.constructionProjects];
  }

  /**
   * Check if a structure type can be built
   */
  static canBuildStructure(type: StructureType, level: number, gameState: GameState): {
    canBuild: boolean;
    reason?: string;
    requirements?: any;
  } {
    const blueprint = STRUCTURE_BLUEPRINTS[type];
    const structureLevel = blueprint.levels[level - 1];

    // Check unlock requirements
    if (blueprint.unlockRequirements.knowledge && gameState.knowledge < blueprint.unlockRequirements.knowledge) {
      return {
        canBuild: false,
        reason: `Requires ${blueprint.unlockRequirements.knowledge} Knowledge`,
        requirements: blueprint.unlockRequirements
      };
    }

    if (blueprint.unlockRequirements.restorationProgress && gameState.restorationProgress < blueprint.unlockRequirements.restorationProgress) {
      return {
        canBuild: false,
        reason: `Requires ${blueprint.unlockRequirements.restorationProgress}% Restoration Progress`,
        requirements: blueprint.unlockRequirements
      };
    }

    // Check prerequisite structures
    if (blueprint.unlockRequirements.prerequisiteStructures) {
      for (const prereq of blueprint.unlockRequirements.prerequisiteStructures) {
        if (!this.hasStructure(prereq)) {
          return {
            canBuild: false,
            reason: `Requires ${STRUCTURE_BLUEPRINTS[prereq].name}`,
            requirements: blueprint.unlockRequirements
          };
        }
      }
    }

    // Check if we already have this structure at this level or higher
    const existing = this.structures.find(s => s.type === type);
    if (existing && existing.level >= level) {
      return {
        canBuild: false,
        reason: `Already have ${blueprint.name} Level ${existing.level}`,
        requirements: blueprint.unlockRequirements
      };
    }

    // Check build costs
    const buildCost = structureLevel.buildCost;
    for (const [resource, cost] of Object.entries(buildCost)) {
      const current = getResourceValue(gameState, resource);
      if (current < cost) {
        return {
          canBuild: false,
          reason: `Insufficient ${resource}: need ${cost}, have ${current}`,
          requirements: buildCost
        };
      }
    }

    return { canBuild: true };
  }

  /**
   * Start construction of a structure
   */
  static startConstruction(type: StructureType, level: number, gameState: GameState): boolean {
    const canBuild = this.canBuildStructure(type, level, gameState);
    if (!canBuild.canBuild) {
      return false;
    }

    const blueprint = STRUCTURE_BLUEPRINTS[type];
    const structureLevel = blueprint.levels[level - 1];

    // Create construction project
    const project: ConstructionProject = {
      structureType: type,
      targetLevel: level,
      daysRemaining: structureLevel.buildTime,
      totalDays: structureLevel.buildTime,
      resourcesSpent: structureLevel.buildCost,
      workersAssigned: [], // Could add NPC assignment later
      canCancel: true
    };

    this.constructionProjects.push(project);
    return true;
  }

  /**
   * Process daily construction and maintenance
   */
  static processDailyOperations(gameState: GameState): {
    resourceChanges: Record<string, number>;
    completedProjects: ConstructionProject[];
    maintenanceEvents: string[];
  } {
    const resourceChanges: Record<string, number> = {};
    const completedProjects: ConstructionProject[] = [];
    const maintenanceEvents: string[] = [];

    // Process construction projects
    this.constructionProjects = this.constructionProjects.filter(project => {
      project.daysRemaining--;

      if (project.daysRemaining <= 0) {
        // Construction complete
        this.completeConstruction(project);
        completedProjects.push(project);
        return false;
      }
      return true;
    });

    // Process structure production and maintenance
    const solarEfficiency = this.getSolarEfficiency();
    const workshopBonus = this.getWorkshopBonus();

    this.structures.forEach(structure => {
      if (!structure.isActive) return;

      const blueprint = STRUCTURE_BLUEPRINTS[structure.type];
      const level = blueprint.levels[structure.level - 1];

      // Apply production bonuses
      if (level.dailyProduction) {
        Object.entries(level.dailyProduction).forEach(([resource, amount]) => {
          const bonus = workshopBonus && (resource === 'supplies' || resource === 'knowledge') ? 1.25 : 1;
          resourceChanges[resource] = (resourceChanges[resource] || 0) + (amount * structure.efficiency / 100 * bonus);
        });
      }

      // Apply maintenance costs (reduced by solar efficiency)
      if (level.dailyMaintenance) {
        Object.entries(level.dailyMaintenance).forEach(([resource, cost]) => {
          const reducedCost = cost * (1 - solarEfficiency);
          resourceChanges[resource] = (resourceChanges[resource] || 0) - reducedCost;
        });
      }

      // Natural degradation
      structure.condition = Math.max(20, structure.condition - 0.5); // Minimum 20% condition
      structure.efficiency = Math.min(100, structure.condition + 10); // Efficiency slightly higher than condition
      structure.daysBuilt++;

      // Maintenance warnings
      if (structure.condition < 40) {
        maintenanceEvents.push(`${blueprint.name} Level ${structure.level} needs maintenance (${Math.round(structure.condition)}% condition)`);
      }
    });

    return { resourceChanges, completedProjects, maintenanceEvents };
  }

  /**
   * Complete a construction project
   */
  private static completeConstruction(project: ConstructionProject): void {
    const existing = this.structures.find(s => s.type === project.structureType);

    if (existing) {
      // Upgrade existing structure
      existing.level = project.targetLevel;
      existing.condition = 100;
      existing.efficiency = 100;
      existing.lastMaintenance = 0;
    } else {
      // Build new structure
      const newStructure: BaseStructure = {
        id: `${project.structureType}_${Date.now()}`,
        type: project.structureType,
        level: project.targetLevel,
        condition: 100,
        efficiency: 100,
        daysBuilt: 0,
        isActive: true,
        lastMaintenance: 0
      };
      this.structures.push(newStructure);
    }
  }

  /**
   * Get available structures for construction
   */
  static getAvailableStructures(gameState: GameState): Array<{
    blueprint: StructureBlueprint;
    availableLevels: number[];
  }> {
    return Object.values(STRUCTURE_BLUEPRINTS).map(blueprint => {
      const availableLevels: number[] = [];

      for (let level = 1; level <= blueprint.levels.length; level++) {
        const canBuild = this.canBuildStructure(blueprint.type, level, gameState);
        if (canBuild.canBuild || level === 1) { // Always show level 1 for reference
          availableLevels.push(level);
        }
      }

      return { blueprint, availableLevels };
    }).filter(item => item.availableLevels.length > 0);
  }

  /**
   * Helper methods
   */
  private static hasStructure(type: StructureType): boolean {
    return this.structures.some(s => s.type === type);
  }

  private static getSolarEfficiency(): number {
    const solarPanel = this.structures.find(s => s.type === 'solar_panel');
    if (!solarPanel) return 0;

    switch (solarPanel.level) {
      case 1: return 0.25;
      case 2: return 0.50;
      case 3: return 1.00;
      default: return 0;
    }
  }

  private static getWorkshopBonus(): boolean {
    const workshop = this.structures.find(s => s.type === 'workshop');
    return workshop && workshop.level >= 3;
  }

  /**
   * Perform maintenance on a structure
   */
  static performMaintenance(structureId: string, gameState: GameState): { success: boolean; cost: Record<string, number> } {
    const structure = this.structures.find(s => s.id === structureId);
    if (!structure) return { success: false, cost: {} };

    const blueprint = STRUCTURE_BLUEPRINTS[structure.type];
    const level = blueprint.levels[structure.level - 1];
    const maintenanceCost = level.dailyMaintenance;

    // Check if we can afford maintenance (costs 3x daily maintenance)
    const totalCost: Record<string, number> = {};
    Object.entries(maintenanceCost).forEach(([resource, cost]) => {
      totalCost[resource] = cost * 3;
    });

    for (const [resource, cost] of Object.entries(totalCost)) {
      if (getResourceValue(gameState, resource) < cost) {
        return { success: false, cost: totalCost };
      }
    }

    // Perform maintenance
    structure.condition = Math.min(100, structure.condition + 30);
    structure.efficiency = Math.min(100, structure.condition + 10);
    structure.lastMaintenance = 0;

    return { success: true, cost: totalCost };
  }

  /**
   * Get base statistics
   */
  static getBaseStats(): {
    totalStructures: number;
    averageCondition: number;
    dailyProduction: Record<string, number>;
    dailyMaintenance: Record<string, number>;
    constructionProgress: number;
  } {
    const dailyProduction: Record<string, number> = {};
    const dailyMaintenance: Record<string, number> = {};

    this.structures.forEach(structure => {
      const blueprint = STRUCTURE_BLUEPRINTS[structure.type];
      const level = blueprint.levels[structure.level - 1];

      if (level.dailyProduction) {
        Object.entries(level.dailyProduction).forEach(([resource, amount]) => {
          dailyProduction[resource] = (dailyProduction[resource] || 0) + amount;
        });
      }

      if (level.dailyMaintenance) {
        Object.entries(level.dailyMaintenance).forEach(([resource, cost]) => {
          dailyMaintenance[resource] = (dailyMaintenance[resource] || 0) + cost;
        });
      }
    });

    const averageCondition = this.structures.length > 0
      ? this.structures.reduce((sum, s) => sum + s.condition, 0) / this.structures.length
      : 100;

    const constructionProgress = this.constructionProjects.length > 0
      ? this.constructionProjects.reduce((sum, p) => sum + ((p.totalDays - p.daysRemaining) / p.totalDays), 0) / this.constructionProjects.length * 100
      : 0;

    return {
      totalStructures: this.structures.length,
      averageCondition,
      dailyProduction,
      dailyMaintenance,
      constructionProgress
    };
  }

  /**
   * Clear all structures (for game reset)
   */
  static clearAll(): void {
    this.structures = [];
    this.constructionProjects = [];
  }
}