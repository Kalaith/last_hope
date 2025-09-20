// Structure type definitions for Last Hope

export type StructureType =
  | 'greenhouse'
  | 'water_purifier'
  | 'research_lab'
  | 'solar_panel'
  | 'workshop'
  | 'storage_facility';

export interface BaseStructure {
  id: string;
  type: StructureType;
  level: number; // 1-3
  condition: number; // 0-100 (maintenance state)
  efficiency: number; // 0-100 (operational effectiveness)
  daysBuilt: number; // Age of structure
  isActive: boolean;
  lastMaintenance: number;
}

export interface ConstructionProject {
  structureType: StructureType;
  targetLevel: number;
  daysRemaining: number;
  totalDays: number;
  resourcesSpent: Record<string, number>;
  workersAssigned: string[]; // NPC IDs
  canCancel: boolean;
}

export interface StructureLevel {
  level: number;
  name: string;
  description: string;
  buildCost: {
    supplies: number;
    knowledge: number;
    seeds?: number;
    health?: number; // Labor cost
  };
  buildTime: number; // Days to construct
  dailyProduction?: {
    supplies?: number;
    knowledge?: number;
    seeds?: number;
    hope?: number;
    soilHealth?: number;
  };
  dailyMaintenance: {
    supplies?: number;
    knowledge?: number;
  };
  specialEffects?: string[];
  capacity?: number; // Storage or processing capacity
}

export interface StructureBlueprint {
  type: StructureType;
  name: string;
  description: string;
  icon: string;
  levels: StructureLevel[];
  category: 'production' | 'research' | 'utility';
  unlockRequirements: {
    knowledge?: number;
    restorationProgress?: number;
    prerequisiteStructures?: StructureType[];
  };
}