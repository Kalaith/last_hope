// Game constants for Last Hope
// Centralized location for all magic numbers and configuration values

// ================================
// RESEARCH SYSTEM CONSTANTS
// ================================
export const RESEARCH_CONSTANTS = {
  DEFAULT_RESEARCH_TIME_DIVISOR: 3, // Research time = knowledge required / 3
  KNOWLEDGE_TO_DAYS_RATIO: 1/3,
  MIN_KNOWLEDGE_FOR_RESEARCH: 5,
  MAX_CONCURRENT_RESEARCH: 1
} as const;

// ================================
// RESOURCE THRESHOLDS
// ================================
export const RESOURCE_WARNING_THRESHOLDS = {
  HOPE_LOW: 40,
  HOPE_VERY_LOW: 25,
  HEALTH_LOW: 50,
  HEALTH_VERY_LOW: 35,
  SUPPLIES_LOW: 25,
  SUPPLIES_VERY_LOW: 15,
  KNOWLEDGE_LOW: 10,
  SEEDS_LOW: 2
} as const;

export const RESOURCE_CRITICAL_THRESHOLDS = {
  HOPE_CRITICAL: 20,
  HOPE_GAME_OVER: 0,
  HEALTH_CRITICAL: 30,
  SUPPLIES_CRITICAL: 10,
  KNOWLEDGE_MIN: 5,
  SEEDS_DEPLETED: 0
} as const;

export const RESOURCE_MAXIMUMS = {
  HOPE_MAX: 100,
  HEALTH_MAX: 100,
  SUPPLIES_MAX: 100,
  KNOWLEDGE_MAX: 100,
  SEEDS_MAX: 50
} as const;

// ================================
// DAILY CONSUMPTION RATES
// ================================
export const DAILY_CONSUMPTION_RATES = {
  SUPPLIES_BASE: 2, // Base daily consumption
  HEALTH_NATURAL_LOSS: 1, // Natural health loss in harsh environment
  HOPE_NATURAL_DECAY: 1, // Natural hope decay from harsh conditions
  STRUCTURE_CONDITION_DECAY: 0.5 // Daily condition loss for structures
} as const;

// ================================
// CHOICE SYSTEM CONSTANTS
// ================================
export const CHOICE_CONSTANTS = {
  COOLDOWN_DURATION_MS: 3000, // 3 seconds between choices
  MIN_CHOICE_DELAY_MS: 1000, // Minimum time before showing next choice
  CONSEQUENCE_DISPLAY_DURATION_MS: 2500, // How long to show consequences
  MAX_CHOICES_PER_SCENE: 4
} as const;

// ================================
// BASE BUILDING CONSTANTS
// ================================
export const BASE_BUILDING_CONSTANTS = {
  MAX_STRUCTURES_PER_TYPE: 3,
  MIN_CONDITION_FOR_OPERATION: 25, // Below this, structure doesn't function
  MAINTENANCE_WARNING_THRESHOLD: 50, // Show maintenance warning
  EFFICIENCY_CONDITION_RATIO: 0.8, // Efficiency = condition * 0.8
  CONSTRUCTION_WORKER_LIMIT: 2, // Max NPCs working on one project
  STRUCTURE_LEVEL_MAX: 3
} as const;

// ================================
// NPC SYSTEM CONSTANTS
// ================================
export const NPC_CONSTANTS = {
  TRUST_MIN: 0,
  TRUST_MAX: 100,
  TRUST_CHANGE_MAJOR: 15, // Large trust changes
  TRUST_CHANGE_MODERATE: 8, // Moderate trust changes
  TRUST_CHANGE_MINOR: 3, // Small trust changes
  MOOD_CHANGE_THRESHOLD: 10, // Trust change needed to affect mood
  DIALOGUE_MEMORY_LIMIT: 10, // Max remembered conversations
  RELATIONSHIP_DECAY_RATE: 0.1 // Daily relationship decay
} as const;

// ================================
// UI/UX CONSTANTS
// ================================
export const UI_CONSTANTS = {
  TOOLTIP_MAX_WIDTH_PX: 350,
  TOOLTIP_DELAY_MS: 500,
  ANIMATION_DURATION_MS: 300,
  ANIMATION_DURATION_SLOW_MS: 500,
  NOTIFICATION_DURATION_MS: 4000,
  PROGRESS_BAR_HEIGHT_PX: 6,
  MODAL_Z_INDEX: 1000
} as const;

// ================================
// ECOSYSTEM SIMULATION CONSTANTS
// ================================
export const ECOSYSTEM_CONSTANTS = {
  SOIL_HEALTH_MIN: 0,
  SOIL_HEALTH_MAX: 100,
  PLANT_DIVERSITY_MIN: 0,
  PLANT_DIVERSITY_MAX: 100,
  PLANT_GROWTH_BASE_RATE: 1, // Daily growth points
  PLANT_MATURITY_THRESHOLD: 80, // When plants become harvestable
  POLLINATOR_BONUS_MULTIPLIER: 1.5, // Bonus from pollinator research
  WEATHER_CHANGE_PROBABILITY: 0.1 // 10% chance per day
} as const;

// ================================
// META PROGRESSION CONSTANTS
// ================================
export const META_PROGRESSION_CONSTANTS = {
  MIN_DAYS_FOR_ACHIEVEMENT: 7, // Minimum run length for achievements
  ACHIEVEMENT_UNLOCK_THRESHOLD: 5, // Achievements needed for New Game+
  SEED_UNLOCK_COST: 100, // Knowledge cost to unlock new seed type
  BACKGROUND_UNLOCK_DAYS: 30, // Days survived to unlock new backgrounds
  GLOBAL_RESTORATION_POINTS_PER_RUN: 10
} as const;

// ================================
// GAME LOOP CONSTANTS
// ================================
export const GAME_LOOP_CONSTANTS = {
  FRAME_RATE_TARGET: 60,
  SIMULATION_TICK_MS: 1000, // How often to run daily simulation
  AUTO_SAVE_INTERVAL_MS: 30000, // Auto-save every 30 seconds
  MAX_FRAME_SKIP: 5, // Skip frames if performance is poor
  PERFORMANCE_WARNING_FPS: 30
} as const;

// ================================
// SYSTEM EVENT CONSTANTS
// ================================
export const SYSTEM_EVENT_CONSTANTS = {
  BASE_EVENT_PROBABILITY: 0.15, // 15% base chance per choice
  CRISIS_EVENT_PROBABILITY_BOOST: 0.1, // Additional chance during crisis
  EVENT_COOLDOWN_DAYS: 3, // Minimum days between same event type
  MAX_EVENTS_PER_DAY: 1,
  SEVERITY_THRESHOLD_MODERATE: 40, // Resource level for moderate events
  SEVERITY_THRESHOLD_CRITICAL: 20 // Resource level for critical events
} as const;

// ================================
// CALCULATION HELPERS
// ================================
export const CALCULATION_CONSTANTS = {
  PERCENTAGE_MULTIPLIER: 100,
  ROUNDING_PRECISION: 2, // Decimal places for display
  EPSILON: 0.001, // For floating point comparisons
  RANDOM_VARIANCE_FACTOR: 0.1 // ±10% variance for calculations
} as const;

// ================================
// TYPE-SAFE CONSTANT COLLECTIONS
// ================================
export const ALL_CONSTANTS = {
  RESEARCH: RESEARCH_CONSTANTS,
  RESOURCE_WARNINGS: RESOURCE_WARNING_THRESHOLDS,
  RESOURCE_CRITICAL: RESOURCE_CRITICAL_THRESHOLDS,
  RESOURCE_MAX: RESOURCE_MAXIMUMS,
  CONSUMPTION: DAILY_CONSUMPTION_RATES,
  CHOICES: CHOICE_CONSTANTS,
  BASE_BUILDING: BASE_BUILDING_CONSTANTS,
  NPC: NPC_CONSTANTS,
  UI: UI_CONSTANTS,
  ECOSYSTEM: ECOSYSTEM_CONSTANTS,
  META: META_PROGRESSION_CONSTANTS,
  GAME_LOOP: GAME_LOOP_CONSTANTS,
  EVENTS: SYSTEM_EVENT_CONSTANTS,
  CALCULATIONS: CALCULATION_CONSTANTS
} as const;

