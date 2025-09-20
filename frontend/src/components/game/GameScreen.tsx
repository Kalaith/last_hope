import { memo } from 'react';
import { Screen } from '../layout/Screen';
import { WorldStatus } from './WorldStatus';
import { CharacterStats } from './CharacterStats';
import { BaseManagement } from './BaseManagement';
import { ResearchTree } from './ResearchTree';
import { StoryArea } from './StoryArea';
import { ProgressSection } from './ProgressSection';
import { WorldMap } from './WorldMap';
import { PlantGrowthDisplay } from './PlantGrowthDisplay';
import { ConsequenceDisplay } from './ConsequenceDisplay';
import { useGameStore } from '../../stores/gameStore';
import { gameData } from '../../data';
import type { Choice } from '../../types/game';

interface GameScreenProps {
  visible: boolean;
}

export const GameScreen = memo<GameScreenProps>(({ visible }) => {
  const {
    gameState,
    currentScene,
    makeChoice,
    generateProceduralScene,
    showingConsequences,
    lastConsequences,
    hideConsequences
  } = useGameStore();

  // Get current scene data
  const sceneData = gameData.storyScenes[currentScene];

  // If no scene data exists, generate procedural content
  const proceduralScene = sceneData ? null : generateProceduralScene();

  const currentStoryData = sceneData || proceduralScene;

  const canAffordChoice = (choice: Choice): boolean => {
    if (!choice.requirements) return true;

    for (const [resource, required] of Object.entries(choice.requirements)) {
      // Check streamlined resources
      if (resource === 'hope' && gameState.hope < required) return false;
      if (resource === 'health' && gameState.health < required) return false;
      if (resource === 'supplies' && gameState.supplies < required) return false;
      if (resource === 'knowledge' && gameState.knowledge < required) return false;
      if (resource === 'seeds' && gameState.seeds < required) return false;

      // Check ecosystem requirements
      if (resource === 'soilHealth' && gameState.ecosystem?.soilHealth < required) return false;
    }
    return true;
  };

  const handleMakeChoice = (choice: Choice) => {
    makeChoice(choice);
  };

  const handleZoneClick = (zoneId: string, zoneName: string, zoneState: string) => {
    // Generate zone interaction based on state
    const zoneChoice: Choice = {
      text: `Interact with ${zoneName}`,
      consequences: getZoneRewards(zoneState),
      requirements: getZoneRequirements(zoneState)
    };

    makeChoice(zoneChoice);
  };

  const getZoneRewards = (zoneState: string): Record<string, number> => {
    switch (zoneState) {
      case 'sprouting':
        return { supplies: 3, knowledge: 1, hope: 2 };
      case 'growing':
        return { supplies: 6, seeds: 1, hope: 5 };
      case 'thriving':
        return { supplies: 10, seeds: 2, hope: 10, soilHealth: 5 };
      default:
        return {};
    }
  };

  const getZoneRequirements = (zoneState: string): Record<string, number> => {
    switch (zoneState) {
      case 'sprouting':
        return { health: 5 };
      case 'growing':
        return { health: 10, knowledge: 10 };
      case 'thriving':
        return { health: 15, knowledge: 20 };
      default:
        return {};
    }
  };

  if (!currentStoryData) {
    return (
      <Screen visible={visible}>
        <div className="story-area">
          <div className="story-content">
            <h3>Loading...</h3>
            <div className="story-text">
              Preparing your next chapter...
            </div>
          </div>
        </div>
      </Screen>
    );
  }

  return (
    <Screen visible={visible}>
      <div className="game-interface">
        <WorldStatus gameState={gameState} />

        <CharacterStats gameState={gameState} />

        <BaseManagement gameState={gameState} />

        <ResearchTree gameState={gameState} />

        {/* New visual world representation */}
        <WorldMap gameState={gameState} onZoneClick={handleZoneClick} />

        <StoryArea
          title={currentStoryData.title}
          text={currentStoryData.text}
          choices={currentStoryData.choices}
          onMakeChoice={handleMakeChoice}
          canAffordChoice={canAffordChoice}
          gameState={gameState}
        />

        {/* Plant growth visualization */}
        <PlantGrowthDisplay plants={gameState.ecosystem?.plantInstances || []} />

        <ProgressSection gameState={gameState} />
      </div>

      {/* Consequence Display Overlay */}
      {showingConsequences && (
        <ConsequenceDisplay
          consequences={lastConsequences.consequences}
          relationships={lastConsequences.relationships}
          onComplete={hideConsequences}
        />
      )}
    </Screen>
  );
});

GameScreen.displayName = 'GameScreen';