import { memo } from 'react';
import { Tooltip } from '../ui/Tooltip';
import type { GameState } from '../../types/game';

interface WorldMapProps {
  gameState: GameState;
  className?: string;
}

interface MapZone {
  id: string;
  symbol: string;
  name: string;
  description: string;
  state: 'dead' | 'sprouting' | 'growing' | 'thriving';
}

export const WorldMap = memo<WorldMapProps>(({ gameState, className = '' }) => {
  const getMapZones = (): MapZone[] => {
    const soilHealth = gameState.ecosystem?.soilHealth || 0;
    const plantCount = gameState.ecosystem?.plantInstances?.length || 0;

    // Generate 9 zones in a 3x3 grid representing different areas
    const zones: MapZone[] = [];

    // Center zone - main camp/restoration area - use soilHealth as progress indicator
    const centerState = soilHealth > 75 ? 'thriving' :
                       soilHealth > 50 ? 'growing' :
                       soilHealth > 25 ? 'sprouting' : 'dead';
    zones.push({
      id: 'center',
      symbol: getZoneSymbol(centerState),
      name: 'Base Camp',
      description: 'Your main settlement and restoration center',
      state: centerState
    });

    // Surrounding zones based on expansion progress
    for (let i = 0; i < 8; i++) {
      const zoneProgress = Math.max(0, soilHealth - (i * 10));
      const zoneState = zoneProgress > 60 ? 'thriving' :
                       zoneProgress > 30 ? 'growing' :
                       zoneProgress > 10 ? 'sprouting' : 'dead';

      zones.push({
        id: `zone_${i}`,
        symbol: getZoneSymbol(zoneState),
        name: `Sector ${i + 1}`,
        description: getZoneDescription(zoneState),
        state: zoneState
      });
    }

    return zones;
  };

  const getZoneSymbol = (state: MapZone['state']): string => {
    switch (state) {
      case 'dead': return '☠';
      case 'sprouting': return '⠂';
      case 'growing': return '♦';
      case 'thriving': return '◉';
    }
  };

  const getZoneDescription = (state: MapZone['state']): string => {
    switch (state) {
      case 'dead': return 'Barren wasteland with poisoned soil';
      case 'sprouting': return 'First signs of life breaking through';
      case 'growing': return 'Visible vegetation taking hold';
      case 'thriving': return 'Lush growth and returning wildlife';
    }
  };

  const getZoneColor = (state: MapZone['state']): string => {
    switch (state) {
      case 'dead': return 'var(--color-rust-dark)';
      case 'sprouting': return 'var(--color-terminal-amber)';
      case 'growing': return 'var(--color-terminal-green)';
      case 'thriving': return '#9acd32';
    }
  };

  const getZoneTooltip = (zone: MapZone, isCenter: boolean, gameState: GameState) => {
    const soilHealth = gameState.ecosystem?.soilHealth || 0;
    const plantCount = gameState.ecosystem?.plantInstances?.length || 0;

    const stateInfo = {
      dead: {
        title: 'Dead Zone',
        description: 'Barren wasteland with heavily contaminated soil',
        details: '• No vegetation can survive\n• Soil pH is toxic\n• Radiation levels dangerous\n• Requires extensive restoration'
      },
      sprouting: {
        title: 'Early Recovery',
        description: 'First signs of life breaking through the poisoned earth',
        details: '• Hardy plants beginning to take root\n• Soil chemistry slowly improving\n• Small patches of green visible\n• Promising but fragile progress'
      },
      growing: {
        title: 'Active Growth',
        description: 'Visible vegetation establishing across the area',
        details: '• Multiple plant species thriving\n• Soil health significantly improved\n• Wildlife beginning to return\n• Sustainable growth patterns'
      },
      thriving: {
        title: 'Restored Ecosystem',
        description: 'Lush growth and returning wildlife - nature reclaiming the land',
        details: '• Diverse plant communities\n• Healthy soil microbiome\n• Wildlife corridors established\n• Self-sustaining ecosystem'
      }
    };

    const info = stateInfo[zone.state];

    return (
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--color-terminal-amber)' }}>
          {zone.name} - {info.title}
        </div>
        <div style={{ marginBottom: '8px', fontSize: '0.9em' }}>
          {info.description}
        </div>
        <div style={{ marginBottom: '8px', fontSize: '0.9em', whiteSpace: 'pre-line' }}>
          {info.details}
        </div>
        {isCenter && (
          <div style={{ fontSize: '0.85em', color: 'var(--color-irradiated-400)', marginBottom: '4px' }}>
            🏠 Your main base and restoration headquarters
          </div>
        )}
        <div style={{ fontSize: '0.8em', color: 'var(--color-ash-400)' }}>
          Overall Soil Health: {soilHealth.toFixed(1)}% | Plants: {plantCount}
        </div>
      </div>
    );
  };

  const zones = getMapZones();

  return (
    <div className={`world-map ${className}`}>
      <div className="map-header">
        <Tooltip
          content={
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--color-terminal-amber)' }}>
                Ecosystem Restoration Progress
              </div>
              <div style={{ fontSize: '0.9em', whiteSpace: 'pre-line' }}>
                This map shows your progress restoring the wasteland around your base camp.

                Each zone represents a different area of the ecosystem. As soil health improves, vegetation spreads outward from your central restoration efforts.

                Click on zones to see detailed information about their current state and what's needed for further restoration.
              </div>
            </div>
          }
          position="bottom"
          className="tooltip-world"
        >
          <h3 style={{ cursor: 'help' }}>Restoration Zone Map ℹ️</h3>
        </Tooltip>
        <div className="map-legend">
          <div className="legend-item">
            <span style={{ color: 'var(--color-rust-dark)' }}>☠</span>
            <span>Dead</span>
          </div>
          <div className="legend-item">
            <span style={{ color: 'var(--color-terminal-amber)' }}>⠂</span>
            <span>Sprouting</span>
          </div>
          <div className="legend-item">
            <span style={{ color: 'var(--color-terminal-green)' }}>♦</span>
            <span>Growing</span>
          </div>
          <div className="legend-item">
            <span style={{ color: '#9acd32' }}>◉</span>
            <span>Thriving</span>
          </div>
        </div>
      </div>

      <div className="map-grid">
        {zones.map((zone, index) => {
          const isCenter = index === 0;
          return (
            <Tooltip
              key={zone.id}
              content={getZoneTooltip(zone, isCenter, gameState)}
              position="top"
              className="tooltip-world"
              maxWidth="300px"
            >
              <div
                className={`map-zone ${zone.state} ${isCenter ? 'center-zone' : ''}`}
                style={{ color: getZoneColor(zone.state), cursor: 'help' }}
              >
                {zone.symbol}
              </div>
            </Tooltip>
          );
        })}
      </div>

      <div className="map-status">
        <Tooltip
          content="Soil Health measures the overall restoration progress. Higher values unlock new zones and support more diverse plant life."
          position="top"
          className="tooltip-world"
        >
          <div className="status-item" style={{ cursor: 'help' }}>
            <span className="label">Soil Health:</span>
            <span className="value">{(gameState.ecosystem?.soilHealth || 0).toFixed(1)}%</span>
          </div>
        </Tooltip>
        <Tooltip
          content="Plant Species shows biodiversity. Each species contributes differently to ecosystem stability and soil improvement."
          position="top"
          className="tooltip-world"
        >
          <div className="status-item" style={{ cursor: 'help' }}>
            <span className="label">Plant Species:</span>
            <span className="value">{gameState.ecosystem?.plantDiversity || 0}</span>
          </div>
        </Tooltip>
        <Tooltip
          content="Plant Count tracks individual plants currently growing. Each plant improves soil health and may produce seeds."
          position="top"
          className="tooltip-world"
        >
          <div className="status-item" style={{ cursor: 'help' }}>
            <span className="label">Plant Count:</span>
            <span className="value">{gameState.ecosystem?.plantInstances?.length || 0}</span>
          </div>
        </Tooltip>
      </div>
    </div>
  );
});

WorldMap.displayName = 'WorldMap';