// Type-safe utilities for Last Hope

import type { GameState } from '../types/game';

// Type-safe resource accessor for GameState
export function getResourceValue(gameState: GameState, resource: string): number {
  switch (resource) {
    case 'hope':
      return gameState.hope;
    case 'health':
      return gameState.health;
    case 'supplies':
      return gameState.supplies;
    case 'knowledge':
      return gameState.knowledge;
    case 'seeds':
      return gameState.seeds;
    case 'soilHealth':
      return gameState.ecosystem?.soilHealth || 0;
    default:
      console.warn(`Unknown resource: ${resource}`);
      return 0;
  }
}

// Type-safe resource setter for GameState updates
export function createResourceUpdate(resource: string, value: number): Partial<GameState> {
  const clampedValue = Math.max(0, value); // Ensure non-negative values

  switch (resource) {
    case 'hope':
      return { hope: Math.min(100, clampedValue) };
    case 'health':
      return { health: Math.min(100, clampedValue) };
    case 'supplies':
      return { supplies: Math.min(100, clampedValue) };
    case 'knowledge':
      return { knowledge: Math.min(100, clampedValue) };
    case 'seeds':
      return { seeds: Math.min(50, clampedValue) };
    default:
      console.warn(`Cannot update unknown resource: ${resource}`);
      return {};
  }
}

// Check if a string is a valid resource key
export function isValidResource(resource: string): resource is keyof Pick<GameState, 'hope' | 'health' | 'supplies' | 'knowledge' | 'seeds'> {
  return ['hope', 'health', 'supplies', 'knowledge', 'seeds'].includes(resource);
}

// Type guard for checking if property exists on object
export function hasProperty<T extends Record<string, unknown>>(
  obj: T,
  key: string
): key is keyof T {
  return key in obj;
}

// Safely apply resource changes to GameState
export function applyResourceChanges(
  gameState: GameState,
  changes: Record<string, number>
): Partial<GameState> {
  const updates: Partial<GameState> = {};

  for (const [resource, change] of Object.entries(changes)) {
    if (isValidResource(resource)) {
      const currentValue = getResourceValue(gameState, resource);
      const newValue = currentValue + change;
      const resourceUpdate = createResourceUpdate(resource, newValue);
      Object.assign(updates, resourceUpdate);
    }
  }

  return updates;
}