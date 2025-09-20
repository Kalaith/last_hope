import type { StoryScene } from '../../types/game';

export const researchScenes: Record<string, StoryScene> = {
  researchPartnership: {
    id: "researchPartnership",
    title: "The Science of Hope",
    text: "Working with Dr. Chen, you make a breakthrough. The Blight isn't just environmental damage - it's a cascading failure of soil microorganisms. But in areas where certain pre-Blight plants survived, the soil shows signs of recovery. Chen's eyes light up with the first excitement you've seen from anyone in months. 'We need to map these survivor zones,' she says. 'And we need more seeds - specific varieties that can rebuild the soil ecosystem.' It's ambitious, maybe impossible, but it's a plan.",
    choices: [
      {
        text: "Organize an expedition to map and collect samples from survivor zones.",
        consequences: { knowledge: 3, energy: -3, restorationProgress: 3, humanPopulation: -5 },
        nextScene: "surveyExpedition"
      },
      {
        text: "Focus on developing the seeds you have into a breeding program.",
        consequences: { seeds: 2, knowledge: 2, restorationProgress: 2 },
        nextScene: "seedProgram"
      },
      {
        text: "Try to contact other communities to share the research.",
        consequences: { hope: 20, knowledge: 1, humanPopulation: 10 },
        nextScene: "shareResearch"
      }
    ]
  }
};