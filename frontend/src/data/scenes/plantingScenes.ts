import type { StoryScene } from '../../types/game';

export const plantingScenes: Record<string, StoryScene> = {
  firstPlanting: {
    id: "firstPlanting",
    title: "A Leap of Faith",
    text: "With trembling hands, you dig into the gray, lifeless soil. The earth feels cold and dead, but you plant the seed anyway. You water it with precious drops from your canteen and whisper a prayer to whatever gods might listen. Nothing happens for days. Then, impossibly, a tiny green shoot pushes through the poisoned ground. It's small, fragile, but it's alive. For the first time in months, you smile. Maybe, just maybe, there's still hope.",
    choices: [
      {
        text: "Guard the plant and tend to it carefully.",
        consequences: { hope: 10, energy: -2, restorationProgress: 2 },
        nextScene: "guardPlant"
      },
      {
        text: "Mark the location and search for more suitable soil.",
        consequences: { knowledge: 2, energy: -1 },
        nextScene: "findBetterSoil"
      },
      {
        text: "Share the news - others need to see this miracle.",
        consequences: { hope: 5, energy: -1 },
        nextScene: "shareDiscovery"
      }
    ]
  },

  guardPlant: {
    id: "guardPlant",
    title: "The Guardian",
    text: "You establish a small camp near the growing plant, becoming its silent guardian. Every day, you tend to it with precious water, clear away debris, and protect it from the harsh winds. The plant responds to your care, growing stronger and taller. New leaves unfurl, and you swear you can see the soil around it becoming healthier. Other small shoots begin to appear nearby. You're witnessing the first steps of ecological recovery, and you're making it happen one plant at a time.",
    choices: [
      {
        text: "Expand your garden with more seeds.",
        consequences: { seeds: -2, hope: 25, restorationProgress: 4 },
        nextScene: "expandGarden",
        requirements: { seeds: 2 }
      },
      {
        text: "Study the plant's effect on the surrounding soil.",
        consequences: { knowledge: 3, science: 1, hope: 10 },
        nextScene: "soilResearch"
      },
      {
        text: "Venture out to find others while the plant is stable.",
        consequences: { energy: -2, hope: 5 },
        nextScene: "findSurvivors"
      }
    ]
  },

  findBetterSoil: {
    id: "findBetterSoil",
    title: "The Search for Life",
    text: "You carefully mark the location of the miracle plant with stones arranged in a pattern only you would recognize. Armed with new knowledge about what soil can still support life, you begin a methodical search of the surrounding wasteland. Days pass as you test soil samples, looking for the telltale signs of microbial activity. In a sheltered valley, you find patches of earth that feel different - less poisoned, more hopeful. Your scientific approach is paying off.",
    choices: [
      {
        text: "Begin systematic cultivation in the promising areas.",
        consequences: { seeds: -1, hope: 15, knowledge: 2, restorationProgress: 3 },
        nextScene: "systematicCultivation",
        requirements: { seeds: 1 }
      },
      {
        text: "Return to check on your original plant first.",
        consequences: { energy: -1, hope: 5 },
        nextScene: "guardPlant"
      },
      {
        text: "Search for others to share this discovery with.",
        consequences: { energy: -2, hope: 10 },
        nextScene: "findSurvivors"
      }
    ]
  },

  expandGarden: {
    id: "expandGarden",
    title: "The Growing Green",
    text: "Your small miracle has become something larger. Row by row, you expand your garden, each new plant a victory against the dying world. The soil around your original plant has noticeably improved, and you're learning to read the subtle signs of ecological recovery. Birds - actual living birds - have begun to visit your garden. The sight of a small sparrow landing on one of your plants brings tears to your eyes. Life is winning, one small victory at a time.",
    choices: [
      {
        text: "Establish this as a permanent restoration center.",
        consequences: { hope: 35, restorationProgress: 5, worldHealth: 5 },
        nextScene: "restorationCenter"
      },
      {
        text: "Begin seed collection and distribution operations.",
        consequences: { seeds: 3, hope: 25, knowledge: 2 },
        nextScene: "seedDistribution"
      },
      {
        text: "Research how to replicate this success elsewhere.",
        consequences: { knowledge: 3, science: 2, hope: 20 },
        nextScene: "researchPartnership"
      }
    ]
  },

  systematicCultivation: {
    id: "systematicCultivation",
    title: "Seeds of Science",
    text: "With methodical precision, you begin the work of restoration. Each seed is planted with careful consideration of soil conditions, drainage, and protection from the elements. You establish multiple test plots, documenting growth rates and soil improvement. Your scientific background proves invaluable as you develop techniques that maximize survival rates. Within weeks, you have a small experimental farm producing results that would have been impossible with random planting.",
    choices: [
      {
        text: "Expand operations and seek more survivors to help.",
        consequences: { hope: 20, knowledge: 2, humanPopulation: 8 },
        nextScene: "findSurvivors"
      },
      {
        text: "Focus on perfecting your techniques before scaling up.",
        consequences: { knowledge: 3, science: 2, restorationProgress: 2 },
        nextScene: "researchPartnership"
      },
      {
        text: "Document everything and establish a permanent research station.",
        consequences: { knowledge: 4, hope: 15, restorationProgress: 3 },
        nextScene: "researchStation"
      }
    ]
  },

  soilResearch: {
    id: "soilResearch",
    title: "Understanding Recovery",
    text: "Through careful observation and rudimentary testing, you begin to understand the mechanisms of soil recovery. The plants aren't just growing - they're actively healing the earth around them. Root networks are rebuilding beneficial bacterial colonies. Organic matter is increasing. pH levels are slowly normalizing. You document everything in a growing notebook, creating what may be humanity's first guide to post-apocalyptic restoration ecology.",
    choices: [
      {
        text: "Apply your research to expand cultivation rapidly.",
        consequences: { knowledge: 2, restorationProgress: 4, hope: 25 },
        nextScene: "expandGarden"
      },
      {
        text: "Seek out other educated survivors to collaborate with.",
        consequences: { knowledge: 3, science: 1, hope: 15 },
        nextScene: "researchPartnership"
      },
      {
        text: "Focus on creating seeds optimized for rapid soil recovery.",
        consequences: { seeds: 2, knowledge: 4, restorationProgress: 3 },
        nextScene: "seedEngineering"
      }
    ]
  }
};