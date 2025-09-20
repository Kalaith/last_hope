import { memo, useState } from 'react';
import { Tooltip } from '../ui/Tooltip';
import { useGameStore } from '../../stores/gameStore';
import type { GameState } from '../../types/game';

interface BaseManagementProps {
  gameState: GameState;
}

export const BaseManagement = memo<BaseManagementProps>(({ gameState }) => {
  const { getAvailableStructures, getBaseStats, startConstruction } = useGameStore();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'production' | 'research' | 'utility'>('all');
  const [showBuildMenu, setShowBuildMenu] = useState(false);

  const availableStructures = getAvailableStructures();
  const baseStats = getBaseStats();

  const filteredStructures = availableStructures.filter(item =>
    selectedCategory === 'all' || item.blueprint.category === selectedCategory
  );

  const handleBuildStructure = (structureType: string, level: number) => {
    const success = startConstruction(structureType, level);
    if (success) {
      setShowBuildMenu(false);
    }
  };

  const getResourceColor = (resource: string, cost: number): string => {
    const current = (gameState as any)[resource] || 0;
    return current >= cost ? 'var(--color-terminal-green)' : 'var(--color-terminal-red)';
  };

  const getStructureStatusColor = (condition: number): string => {
    if (condition >= 80) return 'var(--color-terminal-green)';
    if (condition >= 50) return 'var(--color-terminal-amber)';
    return 'var(--color-terminal-red)';
  };

  return (
    <div className="base-management">
      <div className="base-header">
        <Tooltip
          content={
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--color-terminal-amber)' }}>
                Base Management System
              </div>
              <div style={{ fontSize: '0.9em', whiteSpace: 'pre-line' }}>
                Build and manage structures to improve your settlement's capabilities.

                • Production buildings generate daily resources
                • Research facilities advance your knowledge
                • Utility structures provide efficiency bonuses
                • All structures require maintenance over time

                Plan your base layout strategically for maximum benefit!
              </div>
            </div>
          }
          position="bottom"
          className="tooltip-resource"
          maxWidth="350px"
        >
          <h4 style={{ cursor: 'help' }}>Settlement Management ℹ️</h4>
        </Tooltip>
        <button
          className="build-menu-toggle"
          onClick={() => setShowBuildMenu(!showBuildMenu)}
        >
          {showBuildMenu ? '✖️ Cancel' : '🏗️ Build'}
        </button>
      </div>

      {/* Base Statistics */}
      <div className="base-stats">
        <div className="stat-group">
          <div className="stat-item">
            <span className="stat-icon">🏠</span>
            <span className="stat-label">Structures</span>
            <span className="stat-value">{baseStats.totalStructures}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⚙️</span>
            <span className="stat-label">Condition</span>
            <span
              className="stat-value"
              style={{ color: getStructureStatusColor(baseStats.averageCondition) }}
            >
              {Math.round(baseStats.averageCondition)}%
            </span>
          </div>
        </div>

        {/* Daily Production Overview */}
        {Object.keys(baseStats.dailyProduction).length > 0 && (
          <div className="production-overview">
            <div className="production-title">Daily Production:</div>
            <div className="production-items">
              {Object.entries(baseStats.dailyProduction).map(([resource, amount]) => (
                <div key={resource} className="production-item">
                  <span className="resource-icon">
                    {resource === 'supplies' ? '📦' :
                     resource === 'knowledge' ? '📚' :
                     resource === 'seeds' ? '🌱' :
                     resource === 'hope' ? '🌟' :
                     resource === 'soilHealth' ? '🌍' : '📊'}
                  </span>
                  <span className="production-amount">+{amount.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Existing Structures */}
      {gameState.baseStructures && gameState.baseStructures.length > 0 && (
        <div className="existing-structures">
          <div className="structures-title">Active Structures:</div>
          {gameState.baseStructures.map((structure: any, index: number) => (
            <div key={index} className="structure-item">
              <div className="structure-info">
                <span className="structure-icon">
                  {structure.type === 'greenhouse' ? '🏢' :
                   structure.type === 'water_purifier' ? '💧' :
                   structure.type === 'research_lab' ? '🔬' :
                   structure.type === 'solar_panel' ? '☀️' :
                   structure.type === 'workshop' ? '🔧' :
                   structure.type === 'storage_facility' ? '📦' : '🏗️'}
                </span>
                <div className="structure-details">
                  <div className="structure-name">
                    {structure.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} L{structure.level}
                  </div>
                  <div className="structure-status">
                    <span style={{ color: getStructureStatusColor(structure.condition) }}>
                      {Math.round(structure.condition)}% condition
                    </span>
                    <span> • {Math.round(structure.efficiency)}% efficiency</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Construction Projects */}
      {gameState.constructionProjects && gameState.constructionProjects.length > 0 && (
        <div className="construction-projects">
          <div className="projects-title">Under Construction:</div>
          {gameState.constructionProjects.map((project: any, index: number) => (
            <div key={index} className="construction-item">
              <div className="construction-info">
                <span className="construction-icon">🚧</span>
                <div className="construction-details">
                  <div className="construction-name">
                    {project.structureType.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} L{project.targetLevel}
                  </div>
                  <div className="construction-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${((project.totalDays - project.daysRemaining) / project.totalDays) * 100}%`,
                          background: 'var(--color-terminal-amber)'
                        }}
                      />
                    </div>
                    <span className="progress-text">{project.daysRemaining} days remaining</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Build Menu */}
      {showBuildMenu && (
        <div className="build-menu">
          <div className="build-menu-header">
            <div className="category-filters">
              {['all', 'production', 'research', 'utility'].map(category => (
                <button
                  key={category}
                  className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category as any)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="build-options">
            {filteredStructures.map((item, index) => (
              <div key={index} className="structure-blueprint">
                <div className="blueprint-header">
                  <span className="blueprint-icon">{item.blueprint.icon}</span>
                  <div className="blueprint-info">
                    <div className="blueprint-name">{item.blueprint.name}</div>
                    <div className="blueprint-description">{item.blueprint.description}</div>
                  </div>
                </div>

                <div className="blueprint-levels">
                  {item.availableLevels.map(level => {
                    const levelData = item.blueprint.levels[level - 1];
                    const canAfford = Object.entries(levelData.buildCost).every(([resource, cost]) => {
                      return (gameState as any)[resource] >= cost;
                    });

                    return (
                      <Tooltip
                        key={level}
                        content={
                          <div>
                            <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--color-terminal-amber)' }}>
                              {levelData.name}
                            </div>
                            <div style={{ marginBottom: '8px', fontSize: '0.9em' }}>
                              {levelData.description}
                            </div>

                            <div style={{ marginBottom: '8px' }}>
                              <div style={{ fontWeight: 'bold', color: 'var(--color-terminal-amber)', marginBottom: '4px' }}>
                                Build Cost:
                              </div>
                              {Object.entries(levelData.buildCost).map(([resource, cost]) => (
                                <div key={resource} style={{
                                  color: getResourceColor(resource, cost),
                                  fontSize: '0.9em'
                                }}>
                                  • {resource.charAt(0).toUpperCase() + resource.slice(1)}: {cost}
                                </div>
                              ))}
                            </div>

                            {levelData.dailyProduction && Object.keys(levelData.dailyProduction).length > 0 && (
                              <div style={{ marginBottom: '8px' }}>
                                <div style={{ fontWeight: 'bold', color: 'var(--color-terminal-green)', marginBottom: '4px' }}>
                                  Daily Production:
                                </div>
                                {Object.entries(levelData.dailyProduction).map(([resource, amount]) => (
                                  <div key={resource} style={{ color: 'var(--color-terminal-green)', fontSize: '0.9em' }}>
                                    • +{amount} {resource.charAt(0).toUpperCase() + resource.slice(1)}
                                  </div>
                                ))}
                              </div>
                            )}

                            {levelData.specialEffects && (
                              <div style={{ marginBottom: '8px' }}>
                                <div style={{ fontWeight: 'bold', color: 'var(--color-irradiated-400)', marginBottom: '4px' }}>
                                  Special Effects:
                                </div>
                                {levelData.specialEffects.map((effect, i) => (
                                  <div key={i} style={{ color: 'var(--color-irradiated-400)', fontSize: '0.9em' }}>
                                    • {effect}
                                  </div>
                                ))}
                              </div>
                            )}

                            <div style={{ fontSize: '0.8em', color: 'var(--color-ash-500)' }}>
                              Build Time: {levelData.buildTime} days
                            </div>
                          </div>
                        }
                        position="top"
                        className="tooltip-resource"
                        maxWidth="350px"
                      >
                        <button
                          className={`level-option ${canAfford ? 'affordable' : 'unaffordable'}`}
                          disabled={!canAfford}
                          onClick={() => handleBuildStructure(item.blueprint.type, level)}
                        >
                          <div className="level-header">
                            <span className="level-name">Level {level}</span>
                            <span className="build-time">{levelData.buildTime}d</span>
                          </div>
                          <div className="level-cost">
                            {Object.entries(levelData.buildCost).slice(0, 2).map(([resource, cost]) => (
                              <span
                                key={resource}
                                className="cost-item"
                                style={{ color: getResourceColor(resource, cost) }}
                              >
                                {cost} {resource}
                              </span>
                            ))}
                          </div>
                        </button>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

BaseManagement.displayName = 'BaseManagement';