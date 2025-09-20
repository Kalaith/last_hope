// Game type definitions for Last Hope

export interface GameState {
  // Core streamlined resources (5 total)
  hope: number;          // 0-100: Morale checks, affects NPC trust, game over at 0
  health: number;        // 0-100: Affects action success rates, energy recovery
  supplies: number;      // 0-100: Combined food/water, daily consumption required
  knowledge: number;     // 0-100: Unlocks better choices, plant varieties, NPC dialogue
  seeds: number;         // 0-50: Long-term win condition, precious resource

  // Ecosystem state
  ecosystem: EcosystemState;

  // NPCs and relationships
  npcs: Record<string, NPCPersonality>;
  relationships: Record<string, number>;

  // Meta progression
  choicesMade: ChoiceMade[];
  daysSurvived: number;
  selectedBackground: string | null;
  restorationProgress: number;
  lastChoiceTime: number;
  choiceCooldown: number;

  // Base building
  baseStructures: any[];
  constructionProjects: any[];
  baseLevel: number;

  // Research system
  researchProgress?: {
    currentResearch: string | null;
    daysInProgress: number;
    completedResearch: string[];
    availableResearch: string[];
  };

  // Legacy fields (to be gradually removed)
  worldHealth: number;
  humanPopulation: number;
  playerHope: number;
  playerHealth: number;
  playerSanity: number;
  resources: Resources;
  skills: Skills;
  storyProgress: number;
  areasExplored: number;
}

// Legacy resource interface - being phased out
export interface Resources {
  food: number;
  water: number;
  energy: number;
  knowledge: number;
  seeds: number;
}

// New streamlined resource system
export interface CoreResources {
  hope: number;        // 0-100: Morale checks, affects NPC trust, game over at 0
  health: number;      // 0-100: Affects action success rates, energy recovery
  supplies: number;    // 0-100: Combined food/water, daily consumption required
  knowledge: number;   // 0-100: Unlocks better choices, plant varieties, NPC dialogue
  seeds: number;       // 0-50: Long-term win condition, precious resource
}

export interface Skills {
  survival: number;
  science: number;
  leadership: number;
  empathy: number;
}

export interface CharacterBackground {
  id: string;
  name: string;
  description: string;
  startingStats: {
    science: number;
    knowledge: number;
    survival: number;
    leadership: number;
    empathy: number;
    hope: number;
  };
  startingResources: Resources;
}

export interface StoryScene {
  id: string;
  title: string;
  text: string;
  choices: Choice[];
}

export interface Choice {
  text: string;
  consequences?: Consequences;
  relationships?: Record<string, number>;
  nextScene?: string;
  requirements?: Partial<CoreResources>;
  // Legacy support
  legacyRequirements?: Partial<Resources>;
}

export interface Consequences {
  [key: string]: number;
}

export interface ChoiceMade {
  scene: string;
  choice: string;
  day: number;
}

export interface EndingCondition {
  id: string;
  name: string;
  description: string;
  requirements: {
    [key: string]: number;
  };
}

export interface GameData {
  gameState: GameState;
  characterBackgrounds: CharacterBackground[];
  storyScenes: Record<string, StoryScene>;
  endingConditions: EndingCondition[];
}

export type GameScreen = 'characterCreation' | 'game' | 'ending';

// New ecosystem simulation types
export interface EcosystemState {
  soilHealth: number;        // 0-100: Core metric affecting all growth
  plantDiversity: number;    // 0-100: Variety of species planted
  weatherPattern: 'drought' | 'rain' | 'stable' | 'storm';
  seasonalCycle: 'spring' | 'summer' | 'autumn' | 'winter';
  plantInstances: PlantInstance[];
}

export interface PlantInstance {
  id: string;
  species: string;
  health: number;           // 0-100: Current plant condition
  maturity: number;         // 0-100: Growth progress
  soilContribution: number; // How much this plant improves soil
  seedYield: number;        // Seeds produced when mature
}

// Living NPC system
export interface NPCPersonality {
  id: string;
  name: string;
  mood: 'hopeful' | 'neutral' | 'worried' | 'desperate';
  trustLevel: number;       // 0-100: Relationship with player
  personality: 'optimistic' | 'pragmatic' | 'protective' | 'scientific';
  dialogueMemory: string[]; // Remembers past conversations
  currentConcerns: string[]; // What they're worried about now
}

// System-triggered events
export interface SystemTriggeredEvent {
  id: string;
  triggers: {
    soilHealth?: { min?: number; max?: number };
    npcMood?: 'hopeful' | 'worried' | 'desperate';
    weatherPattern?: 'drought' | 'storm';
    supplies?: { below: number };
    trustLevel?: { character: string; below: number };
    knowledge?: { min?: number };
  };
  storyContent: {
    title: string;
    text: string;
    choices: Choice[];
  };
}

// Meta progression system
export interface MetaProgression {
  unlockedSeeds: SeedType[];        // New species unlocked across runs
  unlockedBackgrounds: string[];    // Character backstories unlocked
  loreFragments: LoreEntry[];       // World history pieces discovered
  achievements: Achievement[];       // Milestone rewards
  globalRestoration: number;        // Cross-run world healing progress
}

export interface SeedType {
  id: string;
  name: string;
  description: string;
  soilRequirement: number;          // Min soil health needed
  growthRate: number;               // How fast it matures
  soilImprovement: number;          // How much it heals the earth
  unlockCondition: string;          // How to discover this seed
}

export interface LoreEntry {
  id: string;
  title: string;
  content: string;
  category: 'preApocalypse' | 'blight' | 'survivors' | 'restoration';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockCondition: string;
  reward: {
    type: 'seed' | 'background' | 'lore' | 'ability';
    id: string;
  };
}