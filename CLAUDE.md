# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

Last Hope: Seeds of Tomorrow is a post-apocalyptic narrative survival game built with React 19 and TypeScript. The game recently underwent a major UX redesign (Version 2.0) transitioning from a cluttered interface to a professional tabbed design following Nielsen's usability heuristics.

## Development Commands

### Frontend Development (All commands run from `frontend/` directory)

```bash
# Development
npm run dev          # Start development server (usually localhost:5173-5176)
npm run build        # Production build with TypeScript compilation
npm run preview      # Preview production build

# Code Quality
npm run lint         # ESLint check
npm run lint:fix     # Auto-fix ESLint issues
npm run type-check   # TypeScript compilation check (no emit)
npm run format       # Format code with Prettier
npm run format:check # Check code formatting

# Testing
npm run test         # Vitest in watch mode
npm run test:run     # Run tests once
npm run test:coverage # Run tests with coverage report
npm run test:ui      # Launch Vitest UI

# CI Pipeline
npm run ci           # Full CI: lint + type-check + format + test + build
npm run ci:quick     # Quick CI: lint + type-check + format (no tests/build)
```

## High-Level Architecture

### Game State Management
- **Zustand Store**: Central game state with persistence (`src/stores/gameStore.ts`)
- **Game Managers**: Modular systems for different game aspects (`src/utils/`)
  - `baseBuildingManager.ts` - Structure construction and maintenance
  - `researchSystem.ts` - Technology progression
  - `resourceManager.ts` - Resource tracking and validation
  - `ecosystemSimulator.ts` - Plant growth and soil health
  - `npcManager.ts` - Character relationships and trust
  - `systemEventManager.ts` - Dynamic events and consequences
  - `metaProgression.ts` - Achievement system and run history

### UI Architecture (Version 2.0 - Professional UX Design)
- **Tabbed Interface**: Four main tabs for organized content
  - `DashboardTab` - Main game view with critical status and story
  - `WorldTab` - Exploration map and ecosystem monitoring
  - `SettlementTab` - Base management and resource storage
  - `ResearchTab` - Technology tree and scientific progress
- **Screen Management**: `GameScreen` coordinates tab switching and state
- **Design System**: Three CSS layers with specific purposes:
  - `ux-system.css` - Modern professional design system (current)
  - `tabs.css` - Tab navigation and layout system
  - `terminal.css` - Original post-apocalyptic terminal theme

### Game Flow Architecture
1. **Character Creation** → **Main Game Loop** → **Ending Conditions**
2. **Story Progression**: Scene-based narrative with procedural generation fallback
3. **Resource System**: Hope, Health, Supplies, Knowledge, Seeds with color-coded indicators
4. **Choice Consequences**: Immediate + delayed effects through cascading system

### Data Architecture
- **Story Content**: Organized in `src/data/scenes/` by thematic categories
- **Game Configuration**: Constants in `src/constants/gameConstants.ts`
- **Type Definitions**: Comprehensive TypeScript types in `src/types/`
- **Character Backgrounds**: Scientist, Survivor, Community Leader archetypes

## Key Development Patterns

### Component Architecture
- **Functional Components**: All React components use hooks pattern
- **Memoization**: `React.memo` for performance-critical renders
- **Props Interfaces**: Strict TypeScript interfaces for all component props
- **CSS Imports**: Each tab component imports `ux-system.css` for consistency

### State Management Patterns
- **Actions Pattern**: Game state mutations through store actions
- **Manager Pattern**: Business logic isolated in utility managers
- **Persistence**: Automatic localStorage via Zustand middleware
- **Type Safety**: All state operations fully typed

### UX Design Principles Applied
- **Status Visibility**: Color-coded alerts and real-time progress bars
- **Information Hierarchy**: Card-based layouts with semantic grouping
- **Recognition over Recall**: Visual status indicators eliminate memory load
- **Consistency**: Unified spacing, typography, and color semantics
- **Error Prevention**: Clear feedback for critical resource states

## Critical Technical Notes

### TypeScript Export/Import Standards
- **Classes for Runtime**: Use `class` for exports that need runtime access
- **Type-only Imports**: Use `import type` for type definitions
- **Interface vs Class**: Interfaces are compile-time only, stripped by Vite

### Environment Variables
- **No Fallbacks**: Environment variables should fail fast if missing
- **Frontend**: Use `import.meta.env.VITE_*` pattern
- **Backend**: Use `process.env.*` pattern

### Game State Complexity
- **Multiple Systems**: Game state involves 8+ interconnected managers
- **Save Compatibility**: Changes to state structure affect save games
- **Resource Validation**: All resource changes go through validation layers

## Build System Notes

### Vite Configuration
- **React Plugin**: Supports JSX/TSX with hot module replacement
- **Tailwind Integration**: CSS processing with Tailwind 4.x
- **TypeScript**: Strict compilation with comprehensive type checking

### Deployment Considerations
- **Build Output**: `frontend/dist/` contains production build
- **Asset Optimization**: Vite handles code splitting and optimization
- **CSS Bundle**: All stylesheets combined into single optimized file

## Game-Specific Architecture Notes

### Tabbed Interface Implementation
- **TabNavigation Component**: Manages tab state and notifications
- **Tab Components**: Each tab is self-contained with own imports
- **State Persistence**: Active tab state maintained during gameplay
- **Notification System**: Tabs show indicators for attention-needed states

### Game Manager Interactions
- **Daily Cycle**: ResourceManager → EcosystemSimulator → NPCManager → BaseBuildingManager
- **Event Cascade**: SystemEventManager → CascadingConsequenceManager → ScarcityManager
- **Research Flow**: researchSystem → MetaProgressionManager → gameStore

### Story Engine
- **Scene Resolution**: gameData lookup → procedural generation fallback
- **Choice Processing**: Validation → consequence application → state updates
- **Narrative Branching**: Background + previous choices influence available scenes

## Testing Strategy

### Test Organization
- **Unit Tests**: Individual component and utility function testing
- **Integration Tests**: Game manager interactions and state flows
- **Type Tests**: TypeScript compilation serves as type testing

### Coverage Areas
- **Game Logic**: Resource calculations and state transitions
- **UI Components**: Tab navigation and user interactions
- **Manager Systems**: Business logic in utility managers
- **Save/Load**: State persistence and restoration