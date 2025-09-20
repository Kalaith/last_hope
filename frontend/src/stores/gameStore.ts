import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GameState,
  GameScreen,
  CharacterBackground,
  Choice,
  EndingCondition,
  SystemTriggeredEvent
} from '../types/game';
import { gameData } from '../data';
import { initialGameState } from '../data/initialGameState';
import { ResourceManager, RESOURCE_THRESHOLDS } from '../utils/resourceManager';
import { EcosystemSimulator } from '../utils/ecosystemSimulator';
import { NPCManager } from '../utils/npcManager';
import { SystemEventManager } from '../utils/systemEvents';
import { MetaProgressionManager, type MetaProgressState, type RunHistory, META_ACHIEVEMENTS } from '../utils/metaProgression';
import { CascadingConsequenceManager } from '../utils/cascadingConsequences';
import { ScarcityManager } from '../utils/scarcityManager';
import { BaseBuildingManager } from '../utils/baseBuildingManager';
import { researchSystem } from '../utils/researchSystem';

interface GameStore {
  // State
  currentScreen: GameScreen;
  currentScene: string;
  gameState: GameState;
  selectedBackground: CharacterBackground | null;
  currentEnding: EndingCondition | null;
  metaState: MetaProgressState;
  runHistory: RunHistory[];
  daysSurvived: number;
  totalChoicesMade: number;
  showingConsequences: boolean;
  lastConsequences: { consequences: Record<string, number> | null; relationships: Record<string, number> | null };

  // Actions
  setScreen: (screen: GameScreen) => void;
  selectBackground: (backgroundId: string) => void;
  startGame: (withNewGamePlusBonuses?: boolean) => void;
  makeChoice: (choice: Choice) => void;
  applyConsequences: (consequences: Record<string, number>) => void;
  applyRelationshipChanges: (relationships: Record<string, number>) => void;
  updateGameState: (updates: Partial<GameState>) => void;
  checkEndingConditions: () => EndingCondition | null;
  setCurrentScene: (sceneId: string) => void;
  resetGame: () => void;
  generateProceduralScene: () => { title: string; text: string; choices: Choice[] };
  simulateDay: () => void;
  checkForSystemEvents: () => SystemTriggeredEvent | null;
  completeRun: (endCondition: RunHistory['endCondition']) => void;
  showConsequences: (consequences: Record<string, number> | null, relationships: Record<string, number> | null) => void;
  hideConsequences: () => void;
  startConstruction: (structureType: string, level: number) => boolean;
  getAvailableStructures: () => any[];
  getBaseStats: () => any;

  // Research system
  startResearch: (nodeId: string) => boolean;
  getResearchBoosts: () => Record<string, number>;
  researchProgress: { currentResearch: string | null; daysInProgress: number; completedResearch: string[]; availableResearch: string[] } | null;
}

const getInitialMetaState = (): MetaProgressState => ({
  totalRuns: 0,
  bestRun: null,
  achievements: META_ACHIEVEMENTS.map(achievement => ({ ...achievement, unlocked: false })),
  unlockedSeeds: [],
  totalDaysSurvived: 0,
  totalKnowledgeGained: 0,
  newGamePlusBonuses: {
    startingResources: {},
    unlockedChoices: [],
    npcStartingTrust: { elena: 0, marcus: 0, chen: 0 }
  }
});

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentScreen: 'characterCreation',
      currentScene: 'opening',
      gameState: { ...initialGameState },
      selectedBackground: null,
      currentEnding: null,
      metaState: getInitialMetaState(),
      runHistory: [],
      daysSurvived: 0,
      totalChoicesMade: 0,
      showingConsequences: false,
      lastConsequences: { consequences: null, relationships: null },
      researchProgress: researchSystem.initializeResearchProgress(),

      // Actions
      setScreen: (screen) => set({ currentScreen: screen }),

      selectBackground: (backgroundId) => {
        const background = gameData.characterBackgrounds.find(b => b.id === backgroundId);
        set({ selectedBackground: background || null });
      },

      startGame: (withNewGamePlusBonuses = false) => {
        const { selectedBackground, metaState } = get();
        if (!selectedBackground) return;

        // Start with base initial state
        let newGameState = { ...initialGameState };

        // Apply background modifications if any
        if (selectedBackground.startingStats) {
          newGameState = {
            ...newGameState,
            hope: Math.min(100, newGameState.hope + (selectedBackground.startingStats.hope || 0)),
            knowledge: Math.min(100, newGameState.knowledge + (selectedBackground.startingStats.knowledge || 0))
          };
        }

        // Apply New Game Plus bonuses if requested
        if (withNewGamePlusBonuses) {
          const bonuses = MetaProgressionManager.getNewGamePlusBonuses(metaState);
          newGameState = {
            ...newGameState,
            ...bonuses,
            // Apply NPC trust bonuses
            npcs: {
              ...newGameState.npcs,
              elena: {
                ...newGameState.npcs.elena,
                trustLevel: Math.min(100, newGameState.npcs.elena.trustLevel + metaState.newGamePlusBonuses.npcStartingTrust.elena)
              },
              marcus: {
                ...newGameState.npcs.marcus,
                trustLevel: Math.min(100, newGameState.npcs.marcus.trustLevel + metaState.newGamePlusBonuses.npcStartingTrust.marcus)
              },
              chen: {
                ...newGameState.npcs.chen,
                trustLevel: Math.min(100, newGameState.npcs.chen.trustLevel + metaState.newGamePlusBonuses.npcStartingTrust.chen)
              }
            }
          };
        }

        set({
          gameState: newGameState,
          currentScreen: 'game',
          currentScene: 'opening',
          daysSurvived: 0,
          totalChoicesMade: 0
        });
      },

      makeChoice: (choice) => {
        const state = get();
        const currentTime = Date.now();

        // Check if choice is on cooldown
        if (state.gameState.lastChoiceTime > 0 &&
            state.gameState.choiceCooldown > 0 &&
            currentTime < state.gameState.lastChoiceTime + state.gameState.choiceCooldown) {
          return; // Choice blocked by cooldown
        }

        // Set choice cooldown based on consequence severity
        const consequenceCount = Object.keys(choice.consequences || {}).length + Object.keys(choice.relationships || {}).length;
        const cooldownDuration = Math.max(1000, consequenceCount * 800); // 800ms per consequence, minimum 1s

        // Update choice timing
        get().updateGameState({
          lastChoiceTime: currentTime,
          choiceCooldown: cooldownDuration
        });

        // Register choice for cascading consequences
        CascadingConsequenceManager.registerChoice(choice.text, choice, state.gameState);

        // Show consequences animation before applying changes
        get().showConsequences(choice.consequences || null, choice.relationships || null);

        // Wait for consequence animation to complete before continuing
        setTimeout(() => {
          // Increment choice counter
          const newChoiceCount = state.totalChoicesMade + 1;
          set({ totalChoicesMade: newChoiceCount });

          // Apply consequences
          if (choice.consequences) {
            get().applyConsequences(choice.consequences);
          }

          // Apply relationship changes
          if (choice.relationships) {
            get().applyRelationshipChanges(choice.relationships);
          }

        // Simulate a day passing
        get().simulateDay();

        // Check for system events
        const systemEvent = get().checkForSystemEvents();
        if (systemEvent && Math.random() < SystemEventManager.getEventProbability(get().gameState)) {
          // Use system event as next content
          // For now, just continue with regular flow but this could be expanded
        }

        // Check for ending conditions
        const ending = get().checkEndingConditions();
        if (ending) {
          get().completeRun(ending.id as RunHistory['endCondition']);
          set({ currentEnding: ending, currentScreen: 'ending' });
          return;
        }

          // Move to next scene
          if (choice.nextScene && choice.nextScene !== 'ending') {
            if (gameData.storyScenes[choice.nextScene]) {
              set({ currentScene: choice.nextScene });
            } else {
              // Generate procedural content
              get().generateProceduralScene();
              // For procedural scenes, we stay on current scene but update content dynamically
            }
          } else if (choice.nextScene === 'ending' || state.daysSurvived >= 50) {
            const finalEnding = get().checkEndingConditions();
            const endCondition = finalEnding?.id as RunHistory['endCondition'] || 'hope_lost';
            get().completeRun(endCondition);
            set({
              currentEnding: finalEnding || gameData.endingConditions[1],
              currentScreen: 'ending'
            });
          }
        }, 100); // Small delay to show consequences first
      },

      applyConsequences: (consequences) => {
        const currentState = get().gameState;
        const updates: Partial<GameState> = {};

        // Apply resource changes using new streamlined system
        for (const [key, value] of Object.entries(consequences)) {
          if (key === 'hope') {
            updates.hope = Math.max(0, Math.min(100, currentState.hope + value));
          } else if (key === 'health') {
            updates.health = Math.max(0, Math.min(100, currentState.health + value));
          } else if (key === 'supplies') {
            updates.supplies = Math.max(0, Math.min(100, currentState.supplies + value));
          } else if (key === 'knowledge') {
            updates.knowledge = Math.max(0, Math.min(100, currentState.knowledge + value));
          } else if (key === 'seeds') {
            updates.seeds = Math.max(0, Math.min(50, currentState.seeds + value));
          } else if (key === 'soilHealth') {
            updates.ecosystem = {
              ...currentState.ecosystem,
              soilHealth: Math.max(0, Math.min(100, currentState.ecosystem.soilHealth + value))
            };
          }
        }

        if (Object.keys(updates).length > 0) {
          get().updateGameState(updates);
        }
      },

      applyRelationshipChanges: (relationships) => {
        const currentState = get().gameState;
        const updatedNPCs = { ...currentState.npcs };

        for (const [character, change] of Object.entries(relationships)) {
          if (updatedNPCs[character]) {
            updatedNPCs[character] = {
              ...updatedNPCs[character],
              trustLevel: Math.max(0, Math.min(100, updatedNPCs[character].trustLevel + change))
            };
          }
        }

        get().updateGameState({ npcs: updatedNPCs });
      },

      updateGameState: (updates) => {
        set((state) => ({
          gameState: { ...state.gameState, ...updates }
        }));
      },

      checkEndingConditions: () => {
        const currentState = get().gameState;

        // Check critical failure conditions using new resource system
        if (currentState.hope <= RESOURCE_THRESHOLDS.HOPE_GAME_OVER) {
          return {
            id: 'hope_lost',
            name: 'Hope Lost',
            description: 'You lost all hope in the wasteland.',
            requirements: {}
          };
        }

        if (currentState.health <= 0) {
          return {
            id: 'starvation',
            name: 'Death in the Waste',
            description: 'You succumbed to the harsh conditions.',
            requirements: {}
          };
        }

        if (currentState.ecosystem.soilHealth <= 0 && get().daysSurvived > 20) {
          return {
            id: 'ecosystem_collapse',
            name: 'Ecological Collapse',
            description: 'The ecosystem could not be saved.',
            requirements: {}
          };
        }

        // Check victory condition
        if (currentState.ecosystem.soilHealth >= 80 &&
            currentState.ecosystem.plantDiversity >= 5 &&
            Object.values(currentState.npcs).every(npc => npc.trustLevel >= 70)) {
          return {
            id: 'victory',
            name: 'New Eden',
            description: 'You have restored hope to the wasteland.',
            requirements: {}
          };
        }

        return null;
      },

      setCurrentScene: (sceneId) => set({ currentScene: sceneId }),

      resetGame: () => {
        // Clear cascading consequences, scarcity events, and base building
        CascadingConsequenceManager.clearAll();
        ScarcityManager.clearAll();
        BaseBuildingManager.clearAll();

        set({
          currentScreen: 'characterCreation',
          currentScene: 'opening',
          gameState: { ...initialGameState },
          selectedBackground: null,
          currentEnding: null,
          daysSurvived: 0,
          totalChoicesMade: 0,
          showingConsequences: false,
          lastConsequences: { consequences: null, relationships: null }
        });
      },

      simulateDay: () => {
        const currentState = get().gameState;
        const newDaysSurvived = get().daysSurvived + 1;

        // Apply daily resource consumption and ecosystem simulation
        const { resourceUpdates, ecosystemUpdates, npcUpdates } = ResourceManager.simulateDay(currentState);

        // Update ecosystem
        const updatedEcosystem = EcosystemSimulator.simulateGrowth(
          { ...currentState.ecosystem, ...ecosystemUpdates },
          1 // 1 day elapsed
        );

        // Process base building operations
        const baseBuildingResults = BaseBuildingManager.processDailyOperations(currentState);

        // Apply base building resource changes
        const finalResourceUpdates = { ...resourceUpdates };
        Object.entries(baseBuildingResults.resourceChanges).forEach(([resource, change]) => {
          if (finalResourceUpdates[resource as keyof typeof finalResourceUpdates] !== undefined) {
            (finalResourceUpdates as any)[resource] = ((finalResourceUpdates as any)[resource] || 0) + change;
          }
        });

        // Update NPCs
        const updatedNPCs = NPCManager.updateAllNPCs(currentState.npcs, currentState);

        // Create updated game state
        const newGameState = {
          ...currentState,
          ...finalResourceUpdates,
          ecosystem: updatedEcosystem,
          npcs: updatedNPCs,
          daysSurvived: newDaysSurvived,
          baseStructures: BaseBuildingManager.getStructures(),
          constructionProjects: BaseBuildingManager.getConstructionProjects()
        };

        // Process research progress
        const currentResearchProgress = get().researchProgress;
        let newResearchProgress = currentResearchProgress;
        if (currentResearchProgress) {
          const { progress, completedResearch } = researchSystem.processResearchProgress(currentResearchProgress, newGameState);
          newResearchProgress = progress;

          // If research was completed, show a notification or consequence
          if (completedResearch) {
            const node = researchSystem.getResearchNode(completedResearch);
            if (node) {
              // Could add a research completion notification here
              console.log(`Research completed: ${node.name}`);
            }
          }
        }

        // Check for cascading consequences
        const triggeredConsequences = CascadingConsequenceManager.checkTriggeredConsequences(newGameState);

        set({
          daysSurvived: newDaysSurvived,
          gameState: newGameState,
          researchProgress: newResearchProgress
        });

        // If consequences triggered, create a story event
        if (triggeredConsequences.length > 0) {
          const consequence = triggeredConsequences[0]; // Handle first one
          const storyEvent = CascadingConsequenceManager.createStoryEvent(consequence);

          // Set a delayed story scene for the consequence
          setTimeout(() => {
            // Create a temporary scene ID for this consequence
            const tempScene = {
              id: `cascading_${consequence.id}`,
              ...storyEvent
            };

            // Add to story scenes temporarily
            gameData.storyScenes[tempScene.id] = tempScene;

            // Navigate to consequence scene
            set({ currentScene: tempScene.id });
          }, 500);
        }
      },

      checkForSystemEvents: () => {
        return SystemEventManager.checkForTriggeredEvents(get().gameState);
      },

      completeRun: (endCondition) => {
        const { gameState, metaState, runHistory, daysSurvived, totalChoicesMade } = get();

        // Create run record
        const runRecord = MetaProgressionManager.completeRun(
          gameState,
          endCondition,
          metaState,
          daysSurvived,
          totalChoicesMade
        );

        // Check for new achievements
        MetaProgressionManager.checkAchievements(
          gameState,
          [...runHistory, runRecord],
          metaState
        );

        // Update meta state and run history
        set({
          runHistory: [...runHistory, runRecord],
          metaState: { ...metaState }
        });
      },

      generateProceduralScene: () => {
        const currentState = get().gameState;

        const scenes = [
          {
            title: "A Moment of Reflection",
            text: `Day ${get().daysSurvived} in this wasteland. You've seen ${currentState.ecosystem.soilHealth > 20 ? 'hope take root in the poisoned soil' : 'nothing but death and decay'}. ${currentState.hope > 50 ? 'Despite everything, you still believe things can get better.' : 'You wonder if struggling is worth it anymore.'}`,
            choices: [
              {
                text: "Continue the fight for tomorrow.",
                consequences: { hope: 10, health: -5 }
              },
              {
                text: "Rest and gather strength.",
                consequences: { health: 10, hope: -5 }
              },
              {
                text: "Focus on ecosystem restoration.",
                consequences: { hope: 5, soilHealth: 5, supplies: -5 },
                requirements: { seeds: 1 }
              }
            ] as Choice[]
          },
          {
            title: "The Weight of Survival",
            text: `Resources are running low. The constant struggle for basic necessities weighs heavily on your mind. ${Object.values(currentState.npcs).some(npc => npc.trustLevel > 50) ? "At least you're not alone in this fight." : 'The loneliness is almost unbearable.'} Every decision could mean the difference between life and death.`,
            choices: [
              {
                text: "Ration carefully and search for supplies.",
                consequences: { supplies: 5, health: -5 }
              },
              {
                text: "Take risks to find better resources.",
                consequences: { supplies: 10, health: -10, hope: -5 }
              },
              {
                text: "Focus on building community trust.",
                consequences: { hope: 10, supplies: -5 },
                relationships: { elena: 5, marcus: 5, chen: 5 }
              }
            ] as Choice[]
          }
        ];

        return scenes[Math.floor(Math.random() * scenes.length)];
      },

      showConsequences: (consequences, relationships) => {
        set({
          showingConsequences: true,
          lastConsequences: { consequences, relationships }
        });
      },

      hideConsequences: () => {
        set({
          showingConsequences: false,
          lastConsequences: { consequences: null, relationships: null }
        });
      },

      startConstruction: (structureType: string, level: number) => {
        const state = get();
        const success = BaseBuildingManager.startConstruction(structureType as any, level, state.gameState);

        if (success) {
          // Deduct resources immediately when construction starts
          const blueprint = BaseBuildingManager.getAvailableStructures(state.gameState)
            .find(s => s.blueprint.type === structureType)?.blueprint;

          if (blueprint) {
            const levelData = blueprint.levels[level - 1];
            const resourceUpdates: any = {};

            Object.entries(levelData.buildCost).forEach(([resource, cost]) => {
              resourceUpdates[resource] = Math.max(0, (state.gameState as any)[resource] - cost);
            });

            set({
              gameState: {
                ...state.gameState,
                ...resourceUpdates,
                constructionProjects: BaseBuildingManager.getConstructionProjects()
              }
            });
          }
        }

        return success;
      },

      getAvailableStructures: () => {
        const state = get();
        return BaseBuildingManager.getAvailableStructures(state.gameState);
      },

      getBaseStats: () => {
        return BaseBuildingManager.getBaseStats();
      },

      // Research system methods
      startResearch: (nodeId: string) => {
        const state = get();
        if (!state.researchProgress) return false;

        const canStart = researchSystem.canStartResearch(nodeId, state.gameState, state.researchProgress.completedResearch);
        if (!canStart) return false;

        const newProgress = researchSystem.startResearch(nodeId, state.gameState, state.researchProgress);
        set({ researchProgress: newProgress });
        return true;
      },

      getResearchBoosts: () => {
        const state = get();
        if (!state.researchProgress) return {};
        return researchSystem.getActiveBoosts(state.researchProgress.completedResearch);
      }
    }),
    {
      name: 'last-hope-game-storage',
      version: 2, // Increment version to force migration
      migrate: (persistedState: any, version: number) => {
        // If we have an old version, merge with new initial state
        if (version < 2) {
          console.log('Migrating game state from version', version, 'to 2');
          return {
            ...persistedState,
            gameState: {
              ...initialGameState,
              ...(persistedState?.gameState || {}),
              // Ensure core resources are present
              hope: persistedState?.gameState?.hope ?? initialGameState.hope,
              health: persistedState?.gameState?.health ?? initialGameState.health,
              supplies: persistedState?.gameState?.supplies ?? initialGameState.supplies,
              knowledge: persistedState?.gameState?.knowledge ?? initialGameState.knowledge,
              seeds: persistedState?.gameState?.seeds ?? initialGameState.seeds,
            }
          };
        }
        return persistedState;
      },
      partialize: (state) => ({
        gameState: state.gameState,
        currentScene: state.currentScene,
        currentScreen: state.currentScreen,
        metaState: state.metaState,
        runHistory: state.runHistory,
        daysSurvived: state.daysSurvived,
        totalChoicesMade: state.totalChoicesMade,
        researchProgress: state.researchProgress
      })
    }
  )
);