import { memo, useState } from 'react';
import { Card } from '../ui/Card';
import type { CharacterBackground } from '../../types/game';

interface BackgroundCardProps {
  background: CharacterBackground;
  isSelected: boolean;
  onSelect: (backgroundId: string) => void;
}

const statDescriptions = {
  hope: "Your mental resilience and optimism. Affects morale and story outcomes. Low hope leads to despair.",
  science: "Knowledge of restoration and environmental science. Helps with plant research and world healing.",
  leadership: "Ability to inspire and guide others. Improves relationship building and group decisions.",
  empathy: "Understanding of human emotions. Strengthens bonds with other survivors and NPCs.",
  survival: "Practical skills for staying alive. Affects resource gathering and danger navigation.",
  seeds: "Precious genetic material that might restore the world. The key to humanity's future."
};

export const BackgroundCard = memo<BackgroundCardProps>(({
  background,
  isSelected,
  onSelect
}) => {
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);

  const handleSelect = () => {
    onSelect(background.id);
  };

  const StatPreview = ({
    label,
    value,
    statKey
  }: {
    label: string;
    value: number;
    statKey: string;
  }) => (
    <div
      className="stat-preview"
      onMouseEnter={() => setHoveredStat(statKey)}
      onMouseLeave={() => setHoveredStat(null)}
    >
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      {hoveredStat === statKey && (
        <div className="stat-tooltip">
          {statDescriptions[statKey as keyof typeof statDescriptions]}
        </div>
      )}
    </div>
  );

  return (
    <Card
      className="background-card"
      onClick={handleSelect}
      selected={isSelected}
    >
      <h3>{background.name}</h3>
      <p className="description">{background.description}</p>
      <div className="starting-stats">
        <h4 className="stats-header">Starting Stats</h4>
        <div className="stats-grid">
          <StatPreview
            label="Hope"
            value={background.startingStats.hope}
            statKey="hope"
          />
          <StatPreview
            label="Science"
            value={background.startingStats.science}
            statKey="science"
          />
          <StatPreview
            label="Leadership"
            value={background.startingStats.leadership}
            statKey="leadership"
          />
          <StatPreview
            label="Empathy"
            value={background.startingStats.empathy}
            statKey="empathy"
          />
          <StatPreview
            label="Survival"
            value={background.startingStats.survival}
            statKey="survival"
          />
          <StatPreview
            label="Seeds"
            value={background.startingResources.seeds}
            statKey="seeds"
          />
        </div>
      </div>
    </Card>
  );
});

BackgroundCard.displayName = 'BackgroundCard';