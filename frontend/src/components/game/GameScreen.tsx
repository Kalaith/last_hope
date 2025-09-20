import { memo, useState } from 'react';
import { Screen } from '../layout/Screen';
import { TabNavigation, type TabId } from '../ui/TabNavigation';
import { DashboardTab } from './DashboardTab';
import { WorldTab } from './WorldTab';
import { SettlementTab } from './SettlementTab';
import { ResearchTab } from './ResearchTab';
import { ConsequenceDisplay } from './ConsequenceDisplay';
import { useGameStore } from '../../stores/gameStore';
import { gameData } from '../../data';
import type { Choice } from '../../types/game';
import '../../styles/tabs.css';

interface GameScreenProps {
  visible: boolean;
}

export const GameScreen = memo<GameScreenProps>(({ visible }) => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  const {
    gameState,
    currentScene,
    makeChoice,
    generateProceduralScene,
    showingConsequences,
    lastConsequences,
    hideConsequences,
    getBaseStats
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

  // Calculate notifications for tabs
  const baseStats = getBaseStats();
  const notifications = {
    settlement: baseStats.maintenanceEvents.length > 0,
    research: !gameState.researchProgress?.currentResearch && gameState.knowledge >= 10
  };

  return (
    <Screen visible={visible}>
      <div className="game-interface">
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          notifications={notifications}
        />

        <div className="tab-content">
          {activeTab === 'dashboard' && (
            <DashboardTab
              gameState={gameState}
              storyData={currentStoryData}
              onMakeChoice={handleMakeChoice}
              canAffordChoice={canAffordChoice}
            />
          )}

          {activeTab === 'world' && (
            <WorldTab
              gameState={gameState}
              onZoneClick={handleZoneClick}
            />
          )}

          {activeTab === 'settlement' && (
            <SettlementTab gameState={gameState} />
          )}

          {activeTab === 'research' && (
            <ResearchTab gameState={gameState} />
          )}
        </div>
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