import { memo, useState } from 'react';
import { Tooltip } from '../ui/Tooltip';
import { useGameStore } from '../../stores/gameStore';
import { researchSystem, type ResearchNode } from '../../utils/researchSystem';
import type { GameState } from '../../types/game';
import { RESEARCH_CONSTANTS, UI_CONSTANTS } from '../../constants/gameConstants';

interface ResearchTreeProps {
  gameState: GameState;
}

export const ResearchTree = memo<ResearchTreeProps>(({ gameState }) => {
  const { startResearch, researchProgress, getResearchBoosts } = useGameStore();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'agriculture' | 'ecology' | 'construction' | 'survival' | 'social'>('all');
  const [showResearchTree, setShowResearchTree] = useState(false);

  const researchTree = researchSystem.getResearchTree();
  const activeBoosts = researchProgress ? researchSystem.getActiveBoosts(researchProgress.completedResearch) : {};
  const recommendations = researchProgress ? researchSystem.getResearchRecommendations(gameState, researchProgress) : [];

  const filteredResearch = researchTree.filter(node =>
    selectedCategory === 'all' || node.category === selectedCategory
  );

  const canStartResearch = (node: ResearchNode): boolean => {
    if (!researchProgress) return false;
    return researchSystem.canStartResearch(node.id, gameState, researchProgress.completedResearch);
  };

  const isResearched = (nodeId: string): boolean => {
    return researchProgress?.completedResearch.includes(nodeId) || false;
  };

  const isCurrentlyResearching = (nodeId: string): boolean => {
    return researchProgress?.currentResearch === nodeId;
  };

  const getResearchProgress = (nodeId: string): number => {
    if (!isCurrentlyResearching(nodeId) || !researchProgress) return 0;
    const node = researchTree.find(n => n.id === nodeId);
    if (!node) return 0;
    const researchTime = node.researchTime ||
      Math.ceil(node.knowledgeRequired / RESEARCH_CONSTANTS.DEFAULT_RESEARCH_TIME_DIVISOR);
    return (researchProgress.daysInProgress / researchTime) * 100;
  };

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'agriculture': return '🌾';
      case 'ecology': return '🌿';
      case 'construction': return '🏗️';
      case 'survival': return '🛡️';
      case 'social': return '🤝';
      default: return '🔬';
    }
  };

  const handleStartResearch = (nodeId: string) => {
    if (researchProgress && canStartResearch(researchTree.find(n => n.id === nodeId)!)) {
      startResearch(nodeId);
    }
  };

  return (
    <div className="research-tree">
      <div className="research-header">
        <Tooltip
          content={
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--color-terminal-amber)' }}>
                Research & Development
              </div>
              <div style={{ fontSize: '0.9em', whiteSpace: 'pre-line' }}>
                Spend knowledge to unlock new technologies, construction options, and advanced choices.

                Research takes time but provides permanent benefits:
                • Improved resource generation
                • Access to advanced choices
                • New construction options
                • Enhanced abilities

                Focus research based on your current challenges and long-term goals.
              </div>
            </div>
          }
          position="bottom"
          className="tooltip-resource"
          maxWidth={`${UI_CONSTANTS.TOOLTIP_MAX_WIDTH_PX}px`}
        >
          <h4 style={{ cursor: 'help' }}>Research Laboratory ℹ️</h4>
        </Tooltip>
        <button
          className="research-toggle"
          onClick={() => setShowResearchTree(!showResearchTree)}
        >
          {showResearchTree ? '✖️ Close' : '🔬 Research'}
        </button>
      </div>

      {/* Active Research Status */}
      {researchProgress?.currentResearch && (
        <div className="current-research">
          <div className="research-status">
            <span className="research-icon">⚗️</span>
            <div className="research-details">
              <div className="research-name">
                Currently Researching: {researchTree.find(n => n.id === researchProgress.currentResearch)?.name}
              </div>
              <div className="research-progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${getResearchProgress(researchProgress.currentResearch)}%`,
                    background: 'var(--color-terminal-amber)'
                  }}
                />
              </div>
              <span className="progress-text">
                {Math.round(getResearchProgress(researchProgress.currentResearch))}% complete
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Research Recommendations */}
      {recommendations.length > 0 && !researchProgress?.currentResearch && (
        <div className="research-recommendations">
          <div className="recommendations-title">💡 Recommended Research:</div>
          <div className="recommendation-list">
            {recommendations.slice(0, 2).map(nodeId => {
              const node = researchTree.find(n => n.id === nodeId);
              if (!node) return null;

              return (
                <button
                  key={nodeId}
                  className="recommendation-item"
                  onClick={() => handleStartResearch(nodeId)}
                  disabled={!canStartResearch(node)}
                >
                  <span className="rec-icon">{node.icon}</span>
                  <span className="rec-name">{node.name}</span>
                  <span className="rec-cost">{node.knowledgeRequired} knowledge</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Research Boosts */}
      {Object.keys(activeBoosts).length > 0 && (
        <div className="research-boosts">
          <div className="boosts-title">Active Research Benefits:</div>
          <div className="boost-list">
            {Object.entries(activeBoosts).slice(0, 3).map(([boost, value]) => (
              <div key={boost} className="boost-item">
                <span className="boost-icon">📈</span>
                <span className="boost-name">{boost.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                <span className="boost-value">
                  {value > 1 ? `+${Math.round((value - 1) * 100)}%` : `-${Math.round((1 - value) * 100)}%`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Research Tree Display */}
      {showResearchTree && (
        <div className="research-menu">
          <div className="research-menu-header">
            <div className="category-filters">
              {['all', 'agriculture', 'ecology', 'construction', 'survival', 'social'].map(category => (
                <button
                  key={category}
                  className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category as any)}
                >
                  {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="research-grid">
            {filteredResearch.map((node) => {
              const researched = isResearched(node.id);
              const canStart = canStartResearch(node);
              const currentlyResearching = isCurrentlyResearching(node.id);
              const progress = getResearchProgress(node.id);

              return (
                <Tooltip
                  key={node.id}
                  content={
                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--color-terminal-amber)' }}>
                        {node.name}
                      </div>
                      <div style={{ marginBottom: '8px', fontSize: '0.9em' }}>
                        {node.description}
                      </div>

                      <div style={{ marginBottom: '8px' }}>
                        <div style={{ fontWeight: 'bold', color: 'var(--color-terminal-amber)', marginBottom: '4px' }}>
                          Requirements:
                        </div>
                        <div style={{ fontSize: '0.9em', color: gameState.knowledge >= node.knowledgeRequired ? 'var(--color-terminal-green)' : 'var(--color-terminal-red)' }}>
                          • Knowledge: {node.knowledgeRequired} (Have: {gameState.knowledge})
                        </div>
                        {node.prerequisites.length > 0 && (
                          <div style={{ fontSize: '0.9em' }}>
                            • Prerequisites: {node.prerequisites.map(prereq => {
                              const prereqNode = researchTree.find(n => n.id === prereq);
                              const hasPrereq = isResearched(prereq);
                              return (
                                <span
                                  key={prereq}
                                  style={{ color: hasPrereq ? 'var(--color-terminal-green)' : 'var(--color-terminal-red)' }}
                                >
                                  {prereqNode?.name || prereq}
                                </span>
                              );
                            }).reduce((prev, curr, i) => [prev, i > 0 ? ', ' : '', curr].filter(x => x))}
                          </div>
                        )}
                      </div>

                      {node.benefits.boosts && Object.keys(node.benefits.boosts).length > 0 && (
                        <div style={{ marginBottom: '8px' }}>
                          <div style={{ fontWeight: 'bold', color: 'var(--color-terminal-green)', marginBottom: '4px' }}>
                            Benefits:
                          </div>
                          {Object.entries(node.benefits.boosts).map(([boost, value]) => (
                            <div key={boost} style={{ color: 'var(--color-terminal-green)', fontSize: '0.9em' }}>
                              • {boost.replace(/([A-Z])/g, ' $1').toLowerCase()}: {value > 1 ? `+${Math.round((value - 1) * 100)}%` : `-${Math.round((1 - value) * 100)}%`}
                            </div>
                          ))}
                        </div>
                      )}

                      {node.benefits.unlocks && node.benefits.unlocks.length > 0 && (
                        <div style={{ marginBottom: '8px' }}>
                          <div style={{ fontWeight: 'bold', color: 'var(--color-irradiated-400)', marginBottom: '4px' }}>
                            Unlocks:
                          </div>
                          {node.benefits.unlocks.map((unlock, i) => (
                            <div key={i} style={{ color: 'var(--color-irradiated-400)', fontSize: '0.9em' }}>
                              • {unlock.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </div>
                          ))}
                        </div>
                      )}

                      <div style={{ fontSize: '0.8em', color: 'var(--color-ash-500)' }}>
                        Research Time: {node.researchTime || Math.ceil(node.knowledgeRequired / 3)} days
                      </div>
                    </div>
                  }
                  position="top"
                  className="tooltip-resource"
                  maxWidth={`${UI_CONSTANTS.TOOLTIP_MAX_WIDTH_PX + 50}px`}
                >
                  <button
                    className={`research-node ${researched ? 'researched' : canStart ? 'available' : 'locked'} ${currentlyResearching ? 'researching' : ''}`}
                    disabled={!canStart || researched || currentlyResearching}
                    onClick={() => handleStartResearch(node.id)}
                  >
                    <div className="node-header">
                      <span className="node-icon">{node.icon}</span>
                      <span className="node-category">{getCategoryIcon(node.category)}</span>
                    </div>
                    <div className="node-name">{node.name}</div>
                    <div className="node-cost">{node.knowledgeRequired} knowledge</div>

                    {currentlyResearching && (
                      <div className="research-progress">
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${progress}%`,
                              background: 'var(--color-terminal-amber)'
                            }}
                          />
                        </div>
                        <span>{Math.round(progress)}%</span>
                      </div>
                    )}

                    {researched && (
                      <div className="completion-badge">✅ Complete</div>
                    )}
                  </button>
                </Tooltip>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});

ResearchTree.displayName = 'ResearchTree';