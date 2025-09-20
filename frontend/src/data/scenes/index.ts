import type { StoryScene } from '../../types/game';
import { coreStoryScenes } from './coreStoryScenes';
import { plantingScenes } from './plantingScenes';
import { communityScenes } from './communityScenes';
import { researchScenes } from './researchScenes';

// Combine all story scenes into a single object
export const storyScenes: Record<string, StoryScene> = {
  ...coreStoryScenes,
  ...plantingScenes,
  ...communityScenes,
  ...researchScenes
};