import type { GameState } from '../types/game';

export const initialGameState: GameState = {
  // New streamlined resources
  hope: 50,           // Starting with moderate hope
  health: 80,         // Good physical condition
  supplies: 25,       // Limited starting supplies
  knowledge: 10,      // Basic knowledge
  seeds: 3,           // A few precious seeds

  // Ecosystem state
  ecosystem: {
    soilHealth: 5,      // Very poor soil condition
    plantDiversity: 0,  // No plants yet
    weatherPattern: 'stable',
    seasonalCycle: 'spring',
    plantInstances: []
  },

  // NPCs - Elena, Marcus, Dr. Chen
  npcs: {
    elena: {
      id: 'elena',
      name: 'Elena',
      mood: 'worried',
      trustLevel: 30,
      personality: 'protective',
      dialogueMemory: [],
      currentConcerns: ['children_safety', 'food_shortage']
    },
    marcus: {
      id: 'marcus',
      name: 'Marcus',
      mood: 'neutral',
      trustLevel: 25,
      personality: 'pragmatic',
      dialogueMemory: [],
      currentConcerns: ['water_purifier', 'supplies']
    },
    chen: {
      id: 'chen',
      name: 'Dr. Chen',
      mood: 'hopeful',
      trustLevel: 40,
      personality: 'scientific',
      dialogueMemory: [],
      currentConcerns: ['soil_analysis', 'seed_preservation']
    }
  },

  relationships: {},
  choicesMade: [],
  daysSurvived: 0,
  selectedBackground: null,
  restorationProgress: 0,

  // Legacy fields for backward compatibility
  worldHealth: 5,
  humanPopulation: 847,
  playerHope: 50,
  playerHealth: 80,
  playerSanity: 70,
  resources: {
    food: 3,
    water: 2,
    energy: 4,
    knowledge: 1,
    seeds: 0
  },
  skills: {
    survival: 2,
    science: 1,
    leadership: 1,
    empathy: 2
  },
  storyProgress: 0,
  areasExplored: 1
};