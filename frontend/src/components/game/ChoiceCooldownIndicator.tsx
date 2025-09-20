import { memo, useEffect, useState } from 'react';

interface ChoiceCooldownIndicatorProps {
  lastChoiceTime: number;
  cooldownDuration: number;
  onCooldownComplete?: () => void;
}

export const ChoiceCooldownIndicator = memo<ChoiceCooldownIndicatorProps>(({
  lastChoiceTime,
  cooldownDuration,
  onCooldownComplete
}) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (cooldownDuration === 0 || lastChoiceTime === 0) {
      setIsActive(false);
      return;
    }

    const updateTimer = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - lastChoiceTime;
      const remaining = Math.max(0, cooldownDuration - elapsed);

      if (remaining > 0) {
        setTimeRemaining(remaining);
        setIsActive(true);
      } else {
        setTimeRemaining(0);
        setIsActive(false);
        onCooldownComplete?.();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 50);

    return () => clearInterval(interval);
  }, [lastChoiceTime, cooldownDuration, onCooldownComplete]);

  if (!isActive || timeRemaining <= 0) {
    return null;
  }

  const progress = ((cooldownDuration - timeRemaining) / cooldownDuration) * 100;
  const seconds = (timeRemaining / 1000).toFixed(1);

  return (
    <div className="choice-cooldown-indicator">
      <div className="cooldown-content">
        <div className="cooldown-icon">⏳</div>
        <div className="cooldown-text">
          <div className="cooldown-title">Processing Choice...</div>
          <div className="cooldown-time">{seconds}s remaining</div>
        </div>
      </div>
      <div className="cooldown-progress">
        <div
          className="cooldown-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="cooldown-description">
        Your decisions have weight. Take time to consider the consequences.
      </div>
    </div>
  );
});

ChoiceCooldownIndicator.displayName = 'ChoiceCooldownIndicator';