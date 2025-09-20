import { memo } from 'react';
import { ProgressBar } from '../ui/ProgressBar';
import { Tooltip } from '../ui/Tooltip';
import { ResourcePressureIndicator } from './ResourcePressureIndicator';
import type { GameState } from '../../types/game';
import { RESOURCE_THRESHOLDS } from '../../utils/resourceManager';

interface CharacterStatsProps {
  gameState: GameState;
}

const getResourceTooltip = (resource: string, value: number, status: string) => {
  const baseDescriptions = {
    hope: {
      description: "Mental resilience and will to continue living",
      mechanics: "• Game ends if hope reaches 0\n• Affects NPC trust and dialogue options\n• Influences choice success rates",
      thresholds: `Critical: ≤${RESOURCE_THRESHOLDS.HOPE_CRITICAL} | Low: ≤40`
    },
    health: {
      description: "Physical condition and energy levels",
      mechanics: "• Affects action success rates\n• Required for physical activities\n• Decreases from poor supplies",
      thresholds: `Critical: ≤${RESOURCE_THRESHOLDS.HEALTH_CRITICAL} | Low: ≤50`
    },
    supplies: {
      description: "Combined food and water resources",
      mechanics: "• Consumed daily for survival\n• Affects health recovery\n• Required for some actions",
      thresholds: `Critical: ≤${RESOURCE_THRESHOLDS.SUPPLIES_CRITICAL} | Low: ≤25`
    },
    knowledge: {
      description: "Understanding gained through experience",
      mechanics: "• Unlocks advanced choices\n• Improves research options\n• Enhances plant cultivation",
      thresholds: "No critical thresholds - higher is always better"
    },
    seeds: {
      description: "Precious genetic material for restoration",
      mechanics: "• Essential for ecosystem restoration\n• Can be planted or used for research\n• Victory requires maintaining seed supply",
      thresholds: "Maximum: 50 | Depleted: 0 (serious setback)"
    }
  };

  const info = baseDescriptions[resource as keyof typeof baseDescriptions];
  if (!info) return "Resource information";

  return (
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--color-terminal-amber)' }}>
        {info.description}
      </div>
      <div style={{ marginBottom: '8px', fontSize: '0.9em', whiteSpace: 'pre-line' }}>
        {info.mechanics}
      </div>
      <div style={{ fontSize: '0.8em', color: 'var(--color-ash-400)', marginBottom: '4px' }}>
        {info.thresholds}
      </div>
      <div style={{ fontSize: '0.9em', fontWeight: 'bold' }}>
        Current: {value}/{resource === 'seeds' ? '50' : '100'}
        {status === 'critical' && (
          <span style={{ color: 'var(--color-terminal-red)', marginLeft: '8px' }}>
            ⚠️ CRITICAL!
          </span>
        )}
        {status === 'low' && (
          <span style={{ color: 'var(--color-dirty-400)', marginLeft: '8px' }}>
            ⚠ LOW
          </span>
        )}
      </div>
    </div>
  );
};

export const CharacterStats = memo<CharacterStatsProps>(({ gameState }) => {
  const { hope, health, supplies, knowledge, seeds } = gameState;

  // Add fallback values to prevent NaN
  const safeHope = typeof hope === 'number' ? hope : 50;
  const safeHealth = typeof health === 'number' ? health : 80;
  const safeSupplies = typeof supplies === 'number' ? supplies : 25;
  const safeKnowledge = typeof knowledge === 'number' ? knowledge : 10;
  const safeSeeds = typeof seeds === 'number' ? seeds : 3;

  const getResourceStatus = (resource: string, value: number): 'critical' | 'low' | 'normal' => {
    switch (resource) {
      case 'hope':
        if (value <= RESOURCE_THRESHOLDS.HOPE_CRITICAL) return 'critical';
        if (value <= 40) return 'low';
        return 'normal';
      case 'health':
        if (value <= RESOURCE_THRESHOLDS.HEALTH_CRITICAL) return 'critical';
        if (value <= 50) return 'low';
        return 'normal';
      case 'supplies':
        if (value <= RESOURCE_THRESHOLDS.SUPPLIES_CRITICAL) return 'critical';
        if (value <= 25) return 'low';
        return 'normal';
      default:
        return 'normal';
    }
  };

  const ResourceStat = ({
    label,
    value,
    statKey,
    isSeeds = false
  }: {
    label: string;
    value: number;
    statKey: string;
    isSeeds?: boolean;
  }) => {
    const status = getResourceStatus(statKey, value);
    const maxValue = isSeeds ? 50 : 100;

    return (
      <Tooltip
        content={getResourceTooltip(statKey, value, status)}
        position="right"
        className="tooltip-resource"
        maxWidth="400px"
      >
        <div className={`resource ${isSeeds ? 'seeds' : ''} ${status}`}>
          <span className="resource-name">{label}</span>
          <div className="progress-container">
            <ProgressBar
              value={value}
              type={statKey as 'hope' | 'health' | 'supplies' | 'knowledge' | 'seeds'}
              className={status === 'critical' ? 'critical' : status === 'low' ? 'low' : ''}
            />
          </div>
          <span className="resource-value">{value}/{maxValue}</span>
        </div>
      </Tooltip>
    );
  };

  return (
    <div className="character-panel">
      <Tooltip
        content={
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--color-terminal-amber)' }}>
              Core Survival Resources
            </div>
            <div style={{ fontSize: '0.9em', whiteSpace: 'pre-line' }}>
              These five resources determine your survival and success in the wasteland.

              Monitor them carefully - some have critical thresholds that can end your journey.

              Hover over each resource for detailed mechanics and current status.
            </div>
          </div>
        }
        position="bottom"
        className="tooltip-resource"
      >
        <h3 style={{ cursor: 'help' }}>Core Resources ℹ️</h3>
      </Tooltip>
      <div className="stats-grid">
        <div className="vital-stats">
          <ResourceStat
            label="Hope"
            value={safeHope}
            statKey="hope"
          />
          <ResourceStat
            label="Health"
            value={safeHealth}
            statKey="health"
          />
        </div>
        <div className="material-stats">
          <ResourceStat
            label="Supplies"
            value={safeSupplies}
            statKey="supplies"
          />
          <ResourceStat
            label="Knowledge"
            value={safeKnowledge}
            statKey="knowledge"
          />
          <ResourceStat
            label="Seeds"
            value={safeSeeds}
            statKey="seeds"
            isSeeds={true}
          />
        </div>
      </div>

      {/* Resource Pressure Indicator */}
      <ResourcePressureIndicator gameState={gameState} />
    </div>
  );
});

CharacterStats.displayName = 'CharacterStats';