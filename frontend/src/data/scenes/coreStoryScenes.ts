import type { StoryScene } from '../../types/game';

export const coreStoryScenes: Record<string, StoryScene> = {
  opening: {
    id: "opening",
    title: "The Last Dawn",
    text: "You wake to the familiar orange haze filtering through cracked glass. Another day in what's left of the world. The Blight took everything - the forests, the crops, the rivers, and most of humanity. Scientists say the soil won't support life for another century. But in your backpack, you carry something they said was impossible: a handful of seeds that might still grow. The question isn't whether you can survive another day. It's whether there's any point in trying to save a dying world.",
    choices: [
      {
        text: "Search for other survivors. Hope is stronger together.",
        consequences: { hope: 10, energy: -1 },
        nextScene: "findSurvivors"
      },
      {
        text: "Focus on finding resources. Survival comes first.",
        consequences: { food: 1, hope: -5 },
        nextScene: "scavengeAlone"
      },
      {
        text: "Plant a seed here. Someone should witness if anything grows.",
        consequences: { seeds: -1, hope: 15, knowledge: 1, restorationProgress: 1 },
        nextScene: "firstPlanting",
        requirements: { seeds: 1 }
      }
    ]
  },

  findSurvivors: {
    id: "findSurvivors",
    title: "Voices in the Wasteland",
    text: "Following distant smoke, you discover a small camp. Three survivors huddle around a dying fire: Elena, a former teacher protecting two young children; Marcus, a mechanic who's kept their water purifier running; and Dr. Chen, a botanist who's been documenting the Blight. They eye you warily - trust is dangerous when resources are scarce. Elena steps forward: 'We have room for one more, but everyone contributes. What can you offer?'",
    choices: [
      {
        text: "Share your seeds and knowledge of restoration.",
        consequences: { seeds: -1, hope: 20, knowledge: 1 },
        relationships: { elena: 10, chen: 15 },
        nextScene: "joinCommunity"
      },
      {
        text: "Offer your survival skills and resources.",
        consequences: { food: -1, water: -1, hope: 5 },
        relationships: { marcus: 10, elena: 5 },
        nextScene: "joinCommunity"
      },
      {
        text: "Suggest they come with you to find a better location.",
        consequences: { hope: 5, energy: -2, leadership: 1 },
        nextScene: "leadGroup"
      }
    ]
  },

  scavengeAlone: {
    id: "scavengeAlone",
    title: "The Solitary Path",
    text: "You spend days picking through the ruins of civilization. In a collapsed pharmacy, you find medical supplies. In a buried greenhouse, you discover a cache of preserved seeds. But the silence is deafening, and you realize you haven't heard another human voice in weeks. The loneliness gnaws at you, but you're alive. As you camp in an abandoned school, you find a child's drawing on the wall: a stick figure family under a bright yellow sun.",
    choices: [
      {
        text: "Leave a message for other survivors and continue searching.",
        consequences: { hope: 5, energy: -1, knowledge: 1 },
        nextScene: "messageFinder"
      },
      {
        text: "Set up a permanent base here and wait for others to find you.",
        consequences: { energy: 2, food: 1, hope: -10 },
        nextScene: "waitingBase"
      },
      {
        text: "Try to plant the seeds you've found in the school garden.",
        consequences: { seeds: -2, hope: 10, restorationProgress: 2 },
        nextScene: "schoolGarden",
        requirements: { seeds: 2 }
      }
    ]
  },

  finalChoice: {
    id: "finalChoice",
    title: "The Last Seed",
    text: "After months of research and heartbreak, you've made an impossible discovery. A genetically modified seed from before the Blight - designed to restore soil ecosystems but never tested. It could heal the world, but using it requires all your remaining resources and the cooperation of every surviving community. Many will refuse. Some will die trying. But if it works... 'This is it,' Dr. Chen whispers, holding the seed. 'The choice that defines what's left of humanity.'",
    choices: [
      {
        text: "Use all resources to plant the seed and call for global cooperation.",
        consequences: { food: -5, water: -5, energy: -5, hope: -20, worldHealth: 30, restorationProgress: 10 },
        nextScene: "ending"
      },
      {
        text: "Keep the seed safe and build slowly with what you know works.",
        consequences: { hope: 10, restorationProgress: 3, humanPopulation: 10 },
        nextScene: "ending"
      },
      {
        text: "Give the seed to the children and let them decide the future.",
        consequences: { hope: 25, knowledge: -2, worldHealth: 10 },
        nextScene: "ending"
      }
    ]
  }
};