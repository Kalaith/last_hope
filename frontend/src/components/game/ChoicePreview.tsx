import { memo } from 'react';
import type { Choice, GameState } from '../../types/game';

interface ChoicePreviewProps {
  choice: Choice;
  currentState: GameState;
  canAfford: boolean;
}

interface ResourceProjection {
  resource: string;
  current: number;
  projected: number;
  change: number;
  status: 'safe' | 'warning' | 'critical';
}

export const ChoicePreview = memo<ChoicePreviewProps>(({ choice, currentState, canAfford }) => {
  const calculateProjections = (): ResourceProjection[] => {
    const projections: ResourceProjection[] = [];

    // Project resource changes
    if (choice.consequences) {
      Object.entries(choice.consequences).forEach(([resource, change]) => {
        let current = 0;
        let maxValue = 100;

        // Get current values
        switch (resource) {
          case 'hope':
            current = currentState.hope;
            break;
          case 'health':
            current = currentState.health;
            break;
          case 'supplies':
            current = currentState.supplies;
            break;
          case 'knowledge':
            current = currentState.knowledge;
            break;
          case 'seeds':
            current = currentState.seeds;
            maxValue = 50;
            break;
          case 'soilHealth':
            current = currentState.ecosystem?.soilHealth || 0;
            break;
          default:
            return; // Skip unknown resources
        }

        const projected = Math.max(0, Math.min(maxValue, current + change));
        const status = getProjectedStatus(resource, projected, maxValue);

        projections.push({
          resource,
          current,
          projected,
          change,
          status
        });
      });
    }

    return projections.sort((a, b) => Math.abs(b.change) - Math.abs(a.change)); // Sort by impact magnitude
  };

  const getProjectedStatus = (resource: string, value: number, maxValue: number): 'safe' | 'warning' | 'critical' => {
    const percentage = (value / maxValue) * 100;

    // Critical thresholds
    if (resource === 'hope' && value <= 20) return 'critical';
    if (resource === 'health' && value <= 30) return 'critical';
    if (resource === 'supplies' && value <= 10) return 'critical';
    if (resource === 'seeds' && value <= 0) return 'critical';

    // Warning thresholds
    if (percentage <= 25) return 'warning';
    if (percentage <= 40 && (resource === 'hope' || resource === 'health')) return 'warning';

    return 'safe';
  };

  const getResourceIcon = (resource: string): string => {
    switch (resource) {
      case 'hope': return '🌟';
      case 'health': return '❤️';
      case 'supplies': return '📦';
      case 'knowledge': return '📚';
      case 'seeds': return '🌱';
      case 'soilHealth': return '🌍';
      default: return '📊';
    }
  };

  const getResourceColor = (status: 'safe' | 'warning' | 'critical'): string => {
    switch (status) {
      case 'critical': return 'var(--color-terminal-red)';
      case 'warning': return 'var(--color-terminal-amber)';
      case 'safe': return 'var(--color-terminal-green)';
    }
  };

  const getChangeColor = (change: number): string => {
    if (change > 0) return 'var(--color-terminal-green)';
    if (change < 0) return 'var(--color-terminal-red)';
    return 'var(--color-ash-400)';
  };

  const projections = calculateProjections();
  const relationshipChanges = choice.relationships || {};

  // Calculate risk assessment
  const criticalProjections = projections.filter(p => p.status === 'critical');
  const warningProjections = projections.filter(p => p.status === 'warning');

  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (criticalProjections.length > 0) riskLevel = 'high';
  else if (warningProjections.length > 0) riskLevel = 'medium';

  return (
    <div className="choice-preview">
      <div className="preview-header">
        <div className="preview-title">
          <span className="preview-icon">🔮</span>
          <span>Projected Outcome</span>
        </div>
        <div className={`risk-indicator risk-${riskLevel}`}>
          Risk: {riskLevel.toUpperCase()}
        </div>
      </div>

      {!canAfford && (
        <div className="preview-blocked">
          <span className="blocked-icon">🚫</span>
          <span>Insufficient Resources</span>
        </div>
      )}

      {/* Resource Projections */}
      {projections.length > 0 && (
        <div className="resource-projections">
          <div className="projections-title">Resource Changes:</div>
          {projections.map((projection, index) => (
            <div key={index} className="projection-item">
              <div className="projection-resource">
                <span className="resource-icon">{getResourceIcon(projection.resource)}</span>
                <span className="resource-name">
                  {projection.resource.charAt(0).toUpperCase() + projection.resource.slice(1)}
                </span>
              </div>
              <div className="projection-change">
                <span className="current-value">{projection.current}</span>
                <span className="change-arrow">→</span>
                <span
                  className="projected-value"
                  style={{ color: getResourceColor(projection.status) }}
                >
                  {projection.projected}
                </span>
                <span
                  className="change-amount"
                  style={{ color: getChangeColor(projection.change) }}
                >
                  ({projection.change > 0 ? '+' : ''}{projection.change})
                </span>
              </div>
              {projection.status !== 'safe' && (
                <div className={`status-warning status-${projection.status}`}>
                  {projection.status === 'critical' ? '⚠️ CRITICAL!' : '⚠ Low'}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Relationship Changes */}
      {Object.keys(relationshipChanges).length > 0 && (
        <div className="relationship-projections">
          <div className="projections-title">Relationship Changes:</div>
          {Object.entries(relationshipChanges).map(([npc, change], index) => (
            <div key={index} className="relationship-item">
              <span className="npc-name">
                {npc.charAt(0).toUpperCase() + npc.slice(1)}
              </span>
              <span
                className="trust-change"
                style={{ color: getChangeColor(change) }}
              >
                {change > 0 ? '👥 +' : '💔 '}{Math.abs(change)} trust
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Strategic Assessment */}
      <div className="strategic-assessment">
        {riskLevel === 'high' && (
          <div className="assessment-warning">
            <span className="warning-icon">⚠️</span>
            <span>This choice may put you in a dangerous situation!</span>
          </div>
        )}
        {riskLevel === 'medium' && (
          <div className="assessment-caution">
            <span className="caution-icon">⚡</span>
            <span>Proceed with caution - monitor your resources closely.</span>
          </div>
        )}
        {riskLevel === 'low' && projections.some(p => p.change > 0) && (
          <div className="assessment-positive">
            <span className="positive-icon">✅</span>
            <span>This choice looks beneficial for your situation.</span>
          </div>
        )}
      </div>

      <div className="preview-footer">
        <div className="preview-tip">
          💡 Consider how this fits your long-term strategy
        </div>
      </div>
    </div>
  );
});

ChoicePreview.displayName = 'ChoicePreview';