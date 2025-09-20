import { memo } from 'react';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';
import type { Choice } from '../../types/game';

interface StoryAreaProps {
  title: string;
  text: string;
  choices: Choice[];
  onMakeChoice: (choice: Choice) => void;
  canAffordChoice: (choice: Choice) => boolean;
}

export const StoryArea = memo<StoryAreaProps>(({
  title,
  text,
  choices,
  onMakeChoice,
  canAffordChoice
}) => {
  const formatRequirements = (requirements: Record<string, number>) => {
    return Object.entries(requirements)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  };

  const getChoiceTooltip = (choice: Choice, canAfford: boolean) => {
    const consequences = choice.consequences || {};
    const relationships = choice.relationships || {};
    const requirements = choice.requirements || {};

    return (
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--color-terminal-amber)' }}>
          Choice Consequences & Requirements
        </div>

        {Object.keys(requirements).length > 0 && (
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontWeight: 'bold', color: canAfford ? 'var(--color-terminal-green)' : 'var(--color-terminal-red)', marginBottom: '4px' }}>
              Requirements:
            </div>
            <div style={{ fontSize: '0.9em', whiteSpace: 'pre-line' }}>
              {Object.entries(requirements).map(([key, value]) =>
                `• ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`
              ).join('\n')}
            </div>
            {!canAfford && (
              <div style={{ color: 'var(--color-terminal-red)', fontSize: '0.85em', marginTop: '4px' }}>
                ⚠️ Cannot afford this choice
              </div>
            )}
          </div>
        )}

        {Object.keys(consequences).length > 0 && (
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontWeight: 'bold', color: 'var(--color-terminal-amber)', marginBottom: '4px' }}>
              Resource Changes:
            </div>
            <div style={{ fontSize: '0.9em', whiteSpace: 'pre-line' }}>
              {Object.entries(consequences).map(([key, value]) => {
                const sign = value > 0 ? '+' : '';
                const color = value > 0 ? 'var(--color-terminal-green)' : 'var(--color-terminal-red)';
                return `• ${key.charAt(0).toUpperCase() + key.slice(1)}: ${sign}${value}`;
              }).join('\n')}
            </div>
          </div>
        )}

        {Object.keys(relationships).length > 0 && (
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontWeight: 'bold', color: 'var(--color-irradiated-400)', marginBottom: '4px' }}>
              Relationship Changes:
            </div>
            <div style={{ fontSize: '0.9em', whiteSpace: 'pre-line' }}>
              {Object.entries(relationships).map(([npc, value]) => {
                const sign = value > 0 ? '+' : '';
                const color = value > 0 ? 'var(--color-terminal-green)' : 'var(--color-terminal-red)';
                return `• ${npc.charAt(0).toUpperCase() + npc.slice(1)}: ${sign}${value} trust`;
              }).join('\n')}
            </div>
          </div>
        )}

        {Object.keys(consequences).length === 0 && Object.keys(relationships).length === 0 && Object.keys(requirements).length === 0 && (
          <div style={{ fontSize: '0.9em', color: 'var(--color-ash-400)' }}>
            This choice has narrative consequences that will be revealed as the story progresses.
          </div>
        )}

        <div style={{ fontSize: '0.8em', color: 'var(--color-ash-500)', marginTop: '8px', paddingTop: '4px', borderTop: '1px solid var(--color-ash-600)' }}>
          💡 Hover over choices to see their potential impact before deciding
        </div>
      </div>
    );
  };

  const handleChoiceClick = (choice: Choice) => {
    onMakeChoice(choice);
  };

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
          maxWidth="300px"
        >
          <h3 id="sceneTitle" style={{ cursor: 'help' }}>{title} ℹ️</h3>
        </Tooltip>
        <div className="story-text">
          {text}
        </div>
      </div>

      <div className="choices-container">
        <div className="choices">
          {choices.map((choice, index) => {
            const canAfford = canAffordChoice(choice);
            const isDisabled = !canAfford;

            return (
              <Tooltip
                key={index}
                content={getChoiceTooltip(choice, canAfford)}
                position="top"
                className="tooltip-resource"
                maxWidth="350px"
                delay={200}
              >
                <button
                  className={`choice-btn ${!canAfford ? 'critical-choice' : ''}`}
                  disabled={isDisabled}
                  onClick={() => handleChoiceClick(choice)}
                  style={{
                    width: '100%',
                    cursor: isDisabled ? 'not-allowed' : 'pointer'
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
      </div>
    </div>
  );
});

StoryArea.displayName = 'StoryArea';