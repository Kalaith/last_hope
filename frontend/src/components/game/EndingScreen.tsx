import { memo } from 'react';
import { Screen } from '../layout/Screen';
import { Button } from '../ui/Button';
import { useGameStore } from '../../stores/gameStore';

interface EndingScreenProps {
  visible: boolean;
}

export const EndingScreen = memo<EndingScreenProps>(({ visible }) => {
  const {
    currentEnding,
    gameState,
    resetGame
  } = useGameStore();

  const handleRestart = () => {
    resetGame();
  };

  if (!currentEnding) {
    return null;
  }

  return (
    <Screen visible={visible}>
      <div className="ending-content">
        <h2>{currentEnding.name}</h2>
        <div className="ending-description">
          {currentEnding.description}
        </div>

        <div className="ending-stats">
          <h3>Your Journey</h3>
          <div className="final-stats">
            <div className="final-stat">
              <span className="final-stat-label">Days Survived</span>
              <span className="final-stat-value">{gameState.daysSurvived}</span>
            </div>
            <div className="final-stat">
              <span className="final-stat-label">Final Hope</span>
              <span className="final-stat-value">{gameState.playerHope}%</span>
            </div>
            <div className="final-stat">
              <span className="final-stat-label">World Health</span>
              <span className="final-stat-value">{Math.round(gameState.worldHealth)}%</span>
            </div>
            <div className="final-stat">
              <span className="final-stat-label">Restoration Progress</span>
              <span className="final-stat-value">{gameState.restorationProgress}</span>
            </div>
            <div className="final-stat">
              <span className="final-stat-label">Relationships</span>
              <span className="final-stat-value">{Object.keys(gameState.relationships).length}</span>
            </div>
          </div>
        </div>

        <div className="ending-choices">
          <h3>Key Decisions</h3>
          <div className="choice-history">
            {gameState.choicesMade.map((choice, index) => (
              <div key={index} className="choice-item">
                <span className="choice-number">Day {choice.day}:</span>
                <div className="choice-text">{choice.choice}</div>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleRestart}>
          Begin Again
        </Button>
      </div>
    </Screen>
  );
});

EndingScreen.displayName = 'EndingScreen';