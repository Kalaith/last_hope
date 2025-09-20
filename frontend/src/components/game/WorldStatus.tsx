import { memo } from 'react';
import { ProgressBar } from '../ui/ProgressBar';
import type { GameState } from '../../types/game';
import { useGameStore } from '../../stores/gameStore';

interface WorldStatusProps {
  gameState: GameState;
}

export const WorldStatus = memo<WorldStatusProps>(({ gameState }) => {
  const { daysSurvived } = useGameStore();
  const soilHealth = gameState.ecosystem?.soilHealth || 0;
  const plantCount = gameState.ecosystem?.plantInstances?.length || 0;

  return (
    <div className="world-status">
      <div className="world-info">
        <h2>Last Hope: Seeds of Tomorrow</h2>
        <div className="world-stats">
          <div className="stat">
            <span className="stat-label">Soil Health</span>
            <ProgressBar value={soilHealth} type="world" />
            <span>{Math.round(soilHealth)}%</span>
          </div>
          <div className="stat">
            <span className="stat-label">Plants Growing</span>
            <span>{plantCount}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Days Survived</span>
            <span>{daysSurvived}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Weather</span>
            <span className="weather-icon">
              {gameState.ecosystem?.weatherPattern === 'drought' ? '☀️' :
               gameState.ecosystem?.weatherPattern === 'storm' ? '⛈️' : '⛅'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

WorldStatus.displayName = 'WorldStatus';