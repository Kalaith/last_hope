import type { CharacterBackground } from '../types/game';

export const characterBackgrounds: CharacterBackground[] = [
  {
    id: "scientist",
    name: "Former Environmental Scientist",
    description: "You worked on climate restoration before the collapse. You understand the science but struggle with people.",
    startingStats: {
      science: 3,
      knowledge: 2,
      survival: 1,
      leadership: 1,
      empathy: 1,
      hope: 60
    },
    startingResources: {
      food: 2,
      water: 3,
      energy: 3,
      knowledge: 1,
      seeds: 2
    }
  },
  {
    id: "survivor",
    name: "Wasteland Survivor",
    description: "You've lived through the worst of it. Tough and practical, but hope is a luxury you can't afford.",
    startingStats: {
      survival: 4,
      science: 1,
      leadership: 2,
      empathy: 1,
      knowledge: 1,
      hope: 30
    },
    startingResources: {
      food: 5,
      water: 4,
      energy: 5,
      knowledge: 1,
      seeds: 0
    }
  },
  {
    id: "leader",
    name: "Community Organizer",
    description: "You brought people together before and after the collapse. Leadership comes naturally, but resources are scarce.",
    startingStats: {
      leadership: 3,
      empathy: 3,
      survival: 2,
      science: 1,
      knowledge: 1,
      hope: 70
    },
    startingResources: {
      food: 4,
      water: 3,
      energy: 2,
      knowledge: 1,
      seeds: 1
    }
  }
];