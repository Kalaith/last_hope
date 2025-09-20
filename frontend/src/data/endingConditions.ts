import type { EndingCondition } from '../types/game';

export const endingConditions: EndingCondition[] = [
  {
    id: "extinction",
    name: "The Last Light Dies",
    description: "Hope faded completely. The last humans died alone in the wasteland. Yet even in darkness, the seeds you planted might yet grow for no one to see.",
    requirements: { hope: 0 }
  },
  {
    id: "survival",
    name: "Embers in the Dark",
    description: "A small community survives, preserving the memory of what was lost. It's not the rebirth you hoped for, but it's not the end. The children learn, grow, and carry forward the dream of green things growing.",
    requirements: { hope: 30, relationships: 2 }
  },
  {
    id: "restoration",
    name: "Seeds of Tomorrow",
    description: "Against all odds, life returns to the wasteland. The long work of healing begins. It will take generations, but green shoots push through poisoned soil, and hope takes root alongside them.",
    requirements: { hope: 70, worldHealth: 20, restorationProgress: 5 }
  },
  {
    id: "rebirth",
    name: "The World Reborn",
    description: "Through sacrifice, hope, and impossible determination, you've given Earth a second chance. Forests will grow again. Rivers will run clean. The children laugh as they plant gardens in soil that blooms with life.",
    requirements: { hope: 90, worldHealth: 40, restorationProgress: 8, knowledge: 6 }
  }
];