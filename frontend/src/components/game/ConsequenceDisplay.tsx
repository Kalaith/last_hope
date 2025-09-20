import { memo, useEffect, useState } from 'react';
import type { Consequences } from '../../types/game';

interface ConsequenceDisplayProps {
  consequences: Consequences | null;
  relationships: Record<string, number> | null;
  onComplete: () => void;
}

interface ConsequenceAnimation {
  id: string;
  type: 'resource' | 'relationship';
  label: string;
  value: number;
  startTime: number;
}

export const ConsequenceDisplay = memo<ConsequenceDisplayProps>(({
  consequences,
  relationships,
  onComplete
}) => {
  const [animations, setAnimations] = useState<ConsequenceAnimation[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!consequences && !relationships) return;

    const newAnimations: ConsequenceAnimation[] = [];
    const startTime = Date.now();

    // Add resource consequences
    if (consequences) {
      Object.entries(consequences).forEach(([key, value], index) => {
        if (value !== 0) {
          newAnimations.push({
            id: `resource-${key}`,
            type: 'resource',
            label: key.charAt(0).toUpperCase() + key.slice(1),
            value,
            startTime: startTime + (index * 200)
          });
        }
      });
    }

    // Add relationship consequences
    if (relationships) {
      Object.entries(relationships).forEach(([npc, value], index) => {
        if (value !== 0) {
          newAnimations.push({
            id: `relationship-${npc}`,
            type: 'relationship',
            label: `${npc.charAt(0).toUpperCase() + npc.slice(1)} Trust`,
            value,
            startTime: startTime + ((consequences ? Object.keys(consequences).length : 0) + index) * 200
          });
        }
      });
    }

    if (newAnimations.length > 0) {
      setAnimations(newAnimations);
      setIsVisible(true);

      // Hide after all animations complete
      const totalDuration = newAnimations.length * 200 + 2000;
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(onComplete, 500); // Allow fade out
      }, totalDuration);
    } else {
      onComplete();
    }
  }, [consequences, relationships, onComplete]);

  if (!isVisible || animations.length === 0) {
    return null;
  }

  return (
    <div className="consequence-display">
      <div className="consequence-title">
        <span>⚡ Choice Consequences</span>
      </div>
      <div className="consequence-list">
        {animations.map((animation) => (
          <ConsequenceItem
            key={animation.id}
            animation={animation}
          />
        ))}
      </div>
    </div>
  );
});

interface ConsequenceItemProps {
  animation: ConsequenceAnimation;
}

const ConsequenceItem = memo<ConsequenceItemProps>(({ animation }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const delay = Math.max(0, animation.startTime - Date.now());
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [animation.startTime]);

  const getIcon = () => {
    if (animation.type === 'relationship') {
      return animation.value > 0 ? '👥' : '💔';
    }

    switch (animation.label.toLowerCase()) {
      case 'hope': return animation.value > 0 ? '🌟' : '😞';
      case 'health': return animation.value > 0 ? '❤️' : '🩸';
      case 'supplies': return animation.value > 0 ? '📦' : '🍽️';
      case 'knowledge': return animation.value > 0 ? '📚' : '❓';
      case 'seeds': return animation.value > 0 ? '🌱' : '🥀';
      case 'soilhealth': return animation.value > 0 ? '🌍' : '☠️';
      default: return animation.value > 0 ? '📈' : '📉';
    }
  };

  const getValueColor = () => {
    return animation.value > 0 ? 'var(--color-terminal-green)' : 'var(--color-terminal-red)';
  };

  return (
    <div
      className={`consequence-item ${isVisible ? 'visible' : ''} ${animation.value > 0 ? 'positive' : 'negative'}`}
    >
      <span className="consequence-icon">{getIcon()}</span>
      <span className="consequence-label">{animation.label}</span>
      <span
        className="consequence-value"
        style={{ color: getValueColor() }}
      >
        {animation.value > 0 ? '+' : ''}{animation.value}
      </span>
    </div>
  );
});

ConsequenceDisplay.displayName = 'ConsequenceDisplay';
ConsequenceItem.displayName = 'ConsequenceItem';