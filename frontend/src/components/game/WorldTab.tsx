import React from 'react';
import { WorldMap } from './WorldMap';
import { PlantGrowthDisplay } from './PlantGrowthDisplay';
import type { GameState } from '../../types/game';
import '../../styles/ux-system.css';

interface WorldTabProps {
  gameState: GameState;
  onZoneClick: (zoneId: string, zoneName: string, zoneState: string) => void;
}

export const WorldTab: React.FC<WorldTabProps> = ({
  gameState,
  onZoneClick
}) => {
  const plants = gameState.ecosystem?.plantInstances || [];
  const soilHealth = gameState.ecosystem?.soilHealth || 0;
  const plantDiversity = gameState.ecosystem?.plantDiversity || 0;

  return (
    <div className="container">
      <h1 className="heading-primary">🌍 World Exploration</h1>

      <div className="grid grid-cols-3 gap-lg">
        {/* Ecosystem Health */}
        <div className="card card-elevated">
          <h2 className="heading-secondary">
            <span>🌿</span>
            Ecosystem Health
          </h2>
          <div className="resource-group">
            <div className={`resource-item ${soilHealth <= 20 ? 'critical' : soilHealth <= 40 ? 'warning' : 'healthy'}`}>
              <div className="resource-label">
                <span className="resource-icon">🌱</span>
                <span>Soil Health</span>
              </div>
              <div className="flex items-center gap-sm">
                <span className="resource-value">{Math.round(soilHealth)}%</span>
                <div className="resource-bar">
                  <div
                    className="resource-bar-fill"
                    style={{
                      width: `${soilHealth}%`,
                      backgroundColor: soilHealth <= 20 ? 'var(--status-critical)' :
                        soilHealth <= 40 ? 'var(--status-warning)' : 'var(--status-success)'
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="resource-item healthy">
              <div className="resource-label">
                <span className="resource-icon">🌺</span>
                <span>Plant Diversity</span>
              </div>
              <span className="resource-value">{Math.round(plantDiversity)}%</span>
            </div>
            <div className="resource-item">
              <div className="resource-label">
                <span className="resource-icon">🌿</span>
                <span>Active Plants</span>
              </div>
              <span className="resource-value">{plants.length}</span>
            </div>
          </div>
        </div>

        {/* Environmental Status */}
        <div className="card">
          <h2 className="heading-secondary">
            <span>☀️</span>
            Environmental Status
          </h2>
          <div className="resource-group">
            <div className="resource-item">
              <div className="resource-label">
                <span className="resource-icon">🌡️</span>
                <span>Climate</span>
              </div>
              <span className="resource-value">Stable</span>
            </div>
            <div className="resource-item">
              <div className="resource-label">
                <span className="resource-icon">☁️</span>
                <span>Weather</span>
              </div>
              <span className="resource-value">Clear</span>
            </div>
            <div className="resource-item">
              <div className="resource-label">
                <span className="resource-icon">💧</span>
                <span>Water Sources</span>
              </div>
              <span className="resource-value">Available</span>
            </div>
          </div>
        </div>

        {/* Exploration Progress */}
        <div className="card">
          <h2 className="heading-secondary">
            <span>🗺️</span>
            Exploration Progress
          </h2>
          <div className="resource-group">
            <div className="resource-item">
              <div className="resource-label">
                <span className="resource-icon">📍</span>
                <span>Zones Discovered</span>
              </div>
              <span className="resource-value">3/12</span>
            </div>
            <div className="resource-item">
              <div className="resource-label">
                <span className="resource-icon">⭐</span>
                <span>Points of Interest</span>
              </div>
              <span className="resource-value">5</span>
            </div>
            <div className="resource-item">
              <div className="resource-label">
                <span className="resource-icon">🚶</span>
                <span>Travel Range</span>
              </div>
              <span className="resource-value">2km</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-lg" style={{ marginTop: 'var(--spacing-lg)' }}>
        {/* Interactive Map */}
        <div className="card card-elevated">
          <h2 className="heading-secondary">
            <span>🗺️</span>
            Exploration Map
          </h2>
          <WorldMap gameState={gameState} onZoneClick={onZoneClick} />
        </div>

        {/* Plant Growth */}
        <div className="card">
          <h2 className="heading-secondary">
            <span>🌱</span>
            Plant Growth Monitor
          </h2>
          <PlantGrowthDisplay plants={plants} />
        </div>
      </div>
    </div>
  );
};