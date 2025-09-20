import { memo } from 'react';
import type { PlantInstance } from '../../types/game';
import { PLANT_SPECIES } from '../../utils/ecosystemSimulator';

interface PlantGrowthDisplayProps {
  plants: PlantInstance[];
  className?: string;
}

export const PlantGrowthDisplay = memo<PlantGrowthDisplayProps>(({ plants, className = '' }) => {
  const getGrowthStage = (maturity: number): string => {
    if (maturity < 20) return '🌰'; // Seed
    if (maturity < 40) return '🌱'; // Sprout
    if (maturity < 60) return '🪴'; // Young plant
    if (maturity < 80) return '🌿'; // Mature plant
    return '🌳'; // Full grown
  };

  const getHealthColor = (health: number): string => {
    if (health > 70) return 'var(--color-terminal-green)';
    if (health > 40) return 'var(--color-terminal-amber)';
    return 'var(--color-terminal-red)';
  };

  const getSpeciesName = (speciesId: string): string => {
    const species = PLANT_SPECIES[speciesId as keyof typeof PLANT_SPECIES];
    return species?.name || speciesId;
  };

  const groupedPlants = plants.reduce((groups, plant) => {
    const species = plant.species;
    if (!groups[species]) {
      groups[species] = [];
    }
    groups[species].push(plant);
    return groups;
  }, {} as Record<string, PlantInstance[]>);

  if (plants.length === 0) {
    return (
      <div className={`plant-display empty ${className}`}>
        <div className="empty-state">
          <span className="empty-icon">🏜️</span>
          <p>No plants have been cultivated yet</p>
          <p className="empty-hint">Plant some seeds to begin ecosystem restoration</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`plant-display ${className}`}>
      <div className="plant-header">
        <h3>Growing Plants ({plants.length})</h3>
        <div className="growth-legend">
          <span>🌰 Seed</span>
          <span>🌱 Sprout</span>
          <span>🪴 Young</span>
          <span>🌿 Mature</span>
          <span>🌳 Full</span>
        </div>
      </div>

      <div className="plant-groups">
        {Object.entries(groupedPlants).map(([species, speciesPlants]) => (
          <div key={species} className="plant-group">
            <div className="species-header">
              <h4>{getSpeciesName(species)}</h4>
              <span className="plant-count">×{speciesPlants.length}</span>
            </div>

            <div className="plant-instances">
              {speciesPlants.map((plant) => (
                <div
                  key={plant.id}
                  className="plant-instance"
                  title={`${getSpeciesName(plant.species)}\nHealth: ${plant.health.toFixed(1)}%\nMaturity: ${plant.maturity.toFixed(1)}%`}
                >
                  <span
                    className="plant-icon"
                    style={{ color: getHealthColor(plant.health) }}
                  >
                    {getGrowthStage(plant.maturity)}
                  </span>
                  <div className="plant-stats">
                    <div className="stat-bar health">
                      <div className="stat-label">Health</div>
                      <div className="stat-progress">
                        <div
                          className="stat-fill"
                          style={{
                            width: `${plant.health}%`,
                            backgroundColor: getHealthColor(plant.health)
                          }}
                        />
                      </div>
                      <div className="stat-value">{plant.health.toFixed(0)}%</div>
                    </div>
                    <div className="stat-bar maturity">
                      <div className="stat-label">Growth</div>
                      <div className="stat-progress">
                        <div
                          className="stat-fill"
                          style={{
                            width: `${plant.maturity}%`,
                            backgroundColor: 'var(--color-terminal-green)'
                          }}
                        />
                      </div>
                      <div className="stat-value">{plant.maturity.toFixed(0)}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="ecosystem-summary">
        <div className="summary-stat">
          <span className="label">Healthy Plants:</span>
          <span className="value">
            {plants.filter(p => p.health > 70).length} / {plants.length}
          </span>
        </div>
        <div className="summary-stat">
          <span className="label">Mature Plants:</span>
          <span className="value">
            {plants.filter(p => p.maturity > 80).length} / {plants.length}
          </span>
        </div>
        <div className="summary-stat">
          <span className="label">Species Diversity:</span>
          <span className="value">{Object.keys(groupedPlants).length}</span>
        </div>
      </div>
    </div>
  );
});

PlantGrowthDisplay.displayName = 'PlantGrowthDisplay';