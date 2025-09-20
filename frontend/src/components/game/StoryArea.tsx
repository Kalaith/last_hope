import { memo } from 'react';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';
import { ChoiceCooldownIndicator } from './ChoiceCooldownIndicator';
import { ChoicePreview } from './ChoicePreview';
import type { Choice, GameState } from '../../types/game';
import { UI_CONSTANTS } from '../../constants/gameConstants';

interface StoryAreaProps {
  title: string;
  text: string;
  choices: Choice[];
  onMakeChoice: (choice: Choice) => void;
  canAffordChoice: (choice: Choice) => boolean;
  gameState: GameState;
}

export const StoryArea = memo<StoryAreaProps>(({
  title,
  text,
  choices,
  onMakeChoice,
  canAffordChoice,
  gameState
}) => {
  const formatRequirements = (requirements: Record<string, number>) => {
    return Object.entries(requirements)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  };

  const getChoiceTooltip = (choice: Choice, canAfford: boolean) => {
    // Use the new ChoicePreview component instead
    return null; // This will be replaced by the ChoicePreview component
  };

  const handleChoiceClick = (choice: Choice) => {
    onMakeChoice(choice);
  };

  const currentTime = Date.now();
  const isOnCooldown = gameState.lastChoiceTime > 0 &&
                      gameState.choiceCooldown > 0 &&
                      currentTime < gameState.lastChoiceTime + gameState.choiceCooldown;

  return (
    <div className="story-area">
      <div className="story-content">
        <Tooltip
          content={
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--color-terminal-amber)' }}>
                How to Play Last Hope
              </div>
              <div style={{ fontSize: '0.9em', whiteSpace: 'pre-line' }}>
                Read the story and make choices that affect your survival.

                • Monitor your resources carefully
                • Build relationships with NPCs
                • Restore the ecosystem gradually
                • Every choice has consequences

                Hover over choices to see their potential impact before deciding.
              </div>
            </div>
          }
          position="bottom"
          className="tooltip-resource"
          maxWidth={`${UI_CONSTANTS.TOOLTIP_MAX_WIDTH_PX - 50}px`}
        >
          <h3 id="sceneTitle" style={{ cursor: 'help' }}>{title} ℹ️</h3>
        </Tooltip>
        <div className="story-text">
          {text}
        </div>
      </div>

      <div className="choices-container" style={{ position: 'relative' }}>
        <div className="choices">
          {choices.map((choice, index) => {
            const canAfford = canAffordChoice(choice);
            const isDisabled = !canAfford || isOnCooldown;

            return (
              <Tooltip
                key={index}
                content={
                  <ChoicePreview
                    choice={choice}
                    currentState={gameState}
                    canAfford={canAfford}
                  />
                }
                position="top"
                className="tooltip-choice-preview"
                maxWidth="500px"
                delay={300}
              >
                <button
                  className={`choice-btn ${!canAfford ? 'critical-choice' : ''} ${isOnCooldown ? 'cooldown-disabled' : ''}`}
                  disabled={isDisabled}
                  onClick={() => handleChoiceClick(choice)}
                  style={{
                    width: '100%',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    opacity: isOnCooldown ? 0.5 : 1
                  }}
                >
                  {choice.text}
                  {choice.requirements && !canAfford && (
                    <div className="choice-requirements">
                      Requires: {formatRequirements(choice.requirements)}
                    </div>
                  )}
                </button>
              </Tooltip>
            );
          })}
        </div>

        {/* Cooldown Overlay */}
        {isOnCooldown && (
          <ChoiceCooldownIndicator
            lastChoiceTime={gameState.lastChoiceTime}
            cooldownDuration={gameState.choiceCooldown}
            onCooldownComplete={() => {
              // Force a re-render to update the cooldown state
              // The cooldown logic will automatically detect expiration
            }}
          />
        )}
      </div>
    </div>
  );
});

StoryArea.displayName = 'StoryArea';