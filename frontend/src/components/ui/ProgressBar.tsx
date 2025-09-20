import { memo } from 'react';

interface ProgressBarProps {
  value: number;
  maxValue?: number;
  className?: string;
  barClassName?: string;
  type?: 'default' | 'hope' | 'health' | 'sanity' | 'restoration' | 'world' | 'supplies' | 'knowledge' | 'seeds' | 'trust';
}

export const ProgressBar = memo<ProgressBarProps>(({
  value,
  maxValue = 100,
  className = '',
  barClassName = '',
  type = 'default'
}) => {
  const percentage = Math.max(0, Math.min(100, (value / maxValue) * 100));

  const typeClasses = {
    default: 'progress-fill',
    hope: 'hope-bar progress-fill',
    health: 'health-bar progress-fill',
    sanity: 'sanity-bar progress-fill',
    restoration: 'restoration-bar progress-fill',
    world: 'progress-fill',
    supplies: 'supplies-bar progress-fill',
    knowledge: 'knowledge-bar progress-fill',
    seeds: 'seeds-bar progress-fill',
    trust: 'trust-bar progress-fill'
  };

  return (
    <div className={`progress-bar ${className}`}>
      <div
        className={`${typeClasses[type]} ${barClassName}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';