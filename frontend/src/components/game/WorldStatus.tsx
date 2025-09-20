import { memo } from 'react';
import { ProgressBar } from '../ui/ProgressBar';
import type { GameState } from '../../types/game';
import { useGameStore } from '../../stores/gameStore';

interface WorldStatusProps {
  gameState: GameState;
}

export const WorldStatus = memo<WorldStatusProps>(({ gameState }) => {
  const { daysSurvived, resetGame } = useGameStore();
  const soilHealth = gameState.ecosystem?.soilHealth || 0;
  const plantCount = gameState.ecosystem?.plantInstances?.length || 0;

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the game? All progress will be lost.')) {
      resetGame();
    }
  };

  return (
    <div className="world-status">
      <div className="world-info">
        <div className="world-header">
          <h2>Last Hope: Seeds of Tomorrow</h2>
          <button
            onClick={handleReset}
            className="reset-button"
            title="Reset game to initial state"
          >
            🔄 Reset
          </button>
        </div>
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