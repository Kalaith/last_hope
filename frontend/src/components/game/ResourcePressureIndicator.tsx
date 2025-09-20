import { memo } from 'react';
import { Tooltip } from '../ui/Tooltip';
import { ScarcityManager } from '../../utils/scarcityManager';
import type { GameState } from '../../types/game';

interface ResourcePressureIndicatorProps {
  gameState: GameState;
}

export const ResourcePressureIndicator = memo<ResourcePressureIndicatorProps>(({ gameState }) => {
  const pressures = ScarcityManager.calculateResourcePressures(gameState);
  const activeEvents = ScarcityManager.getActiveEvents();
  const warnings = ScarcityManager.getCriticalWarnings(gameState);

  const getPressureColor = (pressure: number): string => {
    if (pressure >= 80) return 'var(--color-terminal-red)';
    if (pressure >= 60) return 'var(--color-terminal-amber)';
    if (pressure >= 30) return 'var(--color-dirty-400)';
    return 'var(--color-terminal-green)';
  };

  const getPressureIcon = (pressure: number): string => {
    if (pressure >= 80) return '🚨';
    if (pressure >= 60) return '⚠️';
    if (pressure >= 30) return '⚡';
    return '✅';
  };

  const getTrendIcon = (trend: 'improving' | 'stable' | 'worsening'): string => {
    switch (trend) {
      case 'improving': return '📈';
      case 'worsening': return '📉';
      default: return '➡️';
    }
  };

  // Only show if there are pressures or active events
  const shouldShow = pressures.some(p => p.pressure > 20) || activeEvents.length > 0 || warnings.length > 0;

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="resource-pressure-indicator">
      <div className="pressure-header">
        <Tooltip
          content={
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--color-terminal-amber)' }}>
                Resource Pressure System
              </div>
              <div style={{ fontSize: '0.9em', whiteSpace: 'pre-line' }}>
                Tracks resource scarcity and triggers dynamic events.

                • Higher pressure = more scarcity events
                • Active events drain resources daily
                • Critical warnings show immediate threats
                • Trends indicate if situation is improving

                Manage resources carefully to prevent crises!
              </div>
            </div>
          }
          position="bottom"
          className="tooltip-resource"
          maxWidth="300px"
        >
          <h4 style={{ cursor: 'help' }}>Resource Pressure ℹ️</h4>
        </Tooltip>
      </div>

      {/* Critical Warnings */}
      {warnings.length > 0 && (
        <div className="critical-warnings">
          {warnings.map((warning, index) => (
            <div key={index} className="warning-item critical">
              🚨 {warning}
            </div>
          ))}
        </div>
      )}

      {/* Active Scarcity Events */}
      {activeEvents.length > 0 && (
        <div className="active-events">
          <div className="events-title">Active Crises:</div>
          {activeEvents.map((event, index) => (
            <Tooltip
              key={index}
              content={
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--color-terminal-red)' }}>
                    {event.title}
                  </div>
                  <div style={{ marginBottom: '8px', fontSize: '0.9em' }}>
                    {event.description}
                  </div>
                  <div style={{ fontSize: '0.85em', color: 'var(--color-ash-400)' }}>
                    • Daily drain: -{event.effects.dailyDrain} {event.resource}
                    <br />
                    • Severity: {event.severity}
                  </div>
                </div>
              }
              position="top"
              className="tooltip-resource"
              maxWidth="300px"
            >
              <div className="event-item" style={{ cursor: 'help' }}>
                <span className="event-icon">⚡</span>
                <span className="event-name">{event.title}</span>
                <span className="event-severity" style={{ color: getPressureColor(90) }}>
                  {event.severity}
                </span>
              </div>
            </Tooltip>
          ))}
        </div>
      )}

      {/* Resource Pressure Levels */}
      <div className="pressure-levels">
        {pressures
          .filter(pressure => pressure.pressure > 15)
          .slice(0, 3) // Show top 3 pressures
          .map((pressure, index) => (
            <Tooltip
              key={index}
              content={
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px', color: getPressureColor(pressure.pressure) }}>
                    {pressure.resource.charAt(0).toUpperCase() + pressure.resource.slice(1)} Pressure
                  </div>
                  <div style={{ fontSize: '0.9em', marginBottom: '8px' }}>
                    Pressure Level: {pressure.pressure.toFixed(0)}%
                    <br />
                    Trend: {pressure.trend} {getTrendIcon(pressure.trend)}
                    {pressure.timeToDepletion && (
                      <>
                        <br />
                        Time to Depletion: {pressure.timeToDepletion} days
                      </>
                    )}
                  </div>
                  <div style={{ fontSize: '0.85em', color: 'var(--color-ash-400)' }}>
                    High pressure increases chance of scarcity events affecting this resource.
                  </div>
                </div>
              }
              position="top"
              className="tooltip-resource"
              maxWidth="280px"
            >
              <div className="pressure-item" style={{ cursor: 'help' }}>
                <span className="pressure-icon">{getPressureIcon(pressure.pressure)}</span>
                <span className="pressure-name">
                  {pressure.resource.charAt(0).toUpperCase() + pressure.resource.slice(1)}
                </span>
                <div className="pressure-bar">
                  <div
                    className="pressure-bar-fill"
                    style={{
                      width: `${Math.min(100, pressure.pressure)}%`,
                      backgroundColor: getPressureColor(pressure.pressure)
                    }}
                  />
                </div>
                <span className="pressure-trend">{getTrendIcon(pressure.trend)}</span>
              </div>
            </Tooltip>
          ))}
      </div>
    </div>
  );
});

ResourcePressureIndicator.displayName = 'ResourcePressureIndicator';