import type { StoryScene } from '../../types/game';

export const communityScenes: Record<string, StoryScene> = {
  joinCommunity: {
    id: "joinCommunity",
    title: "Among the Living",
    text: "The small community welcomes you with cautious warmth. Elena teaches the children with precious salvaged books. Marcus keeps the machines running with ingenuity and scrap metal. Dr. Chen shows you her notes - detailed observations of how the Blight spreads and, more importantly, where it seems to weaken. 'We've lost so much,' Chen says, 'but knowledge survives if we preserve it.' That night, sharing a meager meal by the fire, you feel something you'd almost forgotten: belonging.",
    choices: [
      {
        text: "Focus on helping with the children's education.",
        consequences: { hope: 15, empathy: 1 },
        relationships: { elena: 10 },
        nextScene: "teachChildren"
      },
      {
        text: "Work with Marcus to improve their water purification system.",
        consequences: { knowledge: 1, survival: 1, water: 2 },
        relationships: { marcus: 15 },
        nextScene: "improveWater"
      },
      {
        text: "Collaborate with Dr. Chen on restoration research.",
        consequences: { knowledge: 2, science: 1, restorationProgress: 1 },
        relationships: { chen: 20 },
        nextScene: "researchPartnership"
      }
    ]
  },

  leadGroup: {
    id: "leadGroup",
    title: "The Weight of Leadership",
    text: "Convincing the group to follow you proves harder than expected. Elena worries about the children's safety. Marcus questions your knowledge of safe routes. But Dr. Chen supports the idea - she's found references to an old research facility that might have survived intact. After heated discussion, they agree to a short expedition. As you lead them into the wasteland, you feel the weight of their lives in your hands.",
    choices: [
      {
        text: "Take the safest route, even if it's longer.",
        consequences: { hope: 10, energy: -3 },
        relationships: { elena: 15 },
        nextScene: "safeJourney"
      },
      {
        text: "Risk the direct path to save resources.",
        consequences: { energy: -1, hope: -5 },
        relationships: { marcus: 10 },
        nextScene: "riskyPath"
      },
      {
        text: "Let the group vote on which path to take.",
        consequences: { leadership: 1, hope: 5 },
        relationships: { elena: 5, marcus: 5, chen: 5 },
        nextScene: "democraticChoice"
      }
    ]
  },

  shareDiscovery: {
    id: "shareDiscovery",
    title: "Spreading Hope",
    text: "You can't keep this miracle to yourself. Using precious energy, you trek across the wasteland, leaving markers and messages for other survivors. At an old radio tower, you manage to jury-rig a weak broadcast signal. Your voice crackles across the airwaves: 'This is a message of hope. Life can grow again. I have proof.' You don't know if anyone hears you, but three days later, you spot smoke signals in the distance. Other survivors are responding to your call.",
    choices: [
      {
        text: "Guide the survivors to your miracle plant.",
        consequences: { hope: 20, energy: -2, humanPopulation: 5 },
        nextScene: "joinCommunity"
      },
      {
        text: "Meet them halfway and share your knowledge.",
        consequences: { hope: 10, knowledge: 1, leadership: 1 },
        relationships: { elena: 5, marcus: 5 },
        nextScene: "teachSurvivors"
      },
      {
        text: "Stay hidden but continue broadcasting hope.",
        consequences: { hope: 15, energy: -1, humanPopulation: 3 },
        nextScene: "radioBeacon"
      }
    ]
  },

  teachSurvivors: {
    id: "teachSurvivors",
    title: "The Teacher",
    text: "Meeting the small group of survivors at a halfway point, you share not just the location of your growing plant, but the knowledge of how to nurture life from dead soil. Elena, a former teacher, takes notes as you explain soil testing. Marcus, a practical man, asks about water conservation. Together, you establish a network of small growing sites, each tended by survivors who now carry the same hope you've discovered. Knowledge, you realize, may be more valuable than the seeds themselves.",
    choices: [
      {
        text: "Establish a formal teaching settlement.",
        consequences: { hope: 25, knowledge: 2, leadership: 2, humanPopulation: 10 },
        relationships: { elena: 15, marcus: 10 },
        nextScene: "teachingSettlement"
      },
      {
        text: "Continue traveling to spread knowledge to more groups.",
        consequences: { hope: 15, energy: -3, humanPopulation: 15 },
        nextScene: "wanderingTeacher"
      },
      {
        text: "Focus on creating a comprehensive survival and restoration guide.",
        consequences: { knowledge: 4, hope: 10, restorationProgress: 2 },
        nextScene: "survivalGuide"
      }
    ]
  },

  radioBeacon: {
    id: "radioBeacon",
    title: "Voice in the Darkness",
    text: "Your radio broadcasts become a beacon of hope across the wasteland. Every few days, you share updates on plant growth, practical survival tips, and most importantly, proof that life can return. Survivors begin using your frequency to communicate with each other, creating an invisible network of hope spanning hundreds of miles. You may not see them, but you know your voice is keeping people alive and fighting for tomorrow.",
    choices: [
      {
        text: "Coordinate a gathering of all radio listeners.",
        consequences: { hope: 30, leadership: 2, humanPopulation: 20 },
        nextScene: "radioGathering"
      },
      {
        text: "Continue broadcasting while building your own garden.",
        consequences: { hope: 20, knowledge: 2, restorationProgress: 3 },
        nextScene: "expandGarden"
      },
      {
        text: "Use the radio to coordinate resource sharing between groups.",
        consequences: { hope: 15, leadership: 1, humanPopulation: 10 },
        relationships: { elena: 10, marcus: 10 },
        nextScene: "resourceNetwork"
      }
    ]
  }
};