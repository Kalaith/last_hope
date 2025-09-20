import React from 'react';
import { StoryArea } from './StoryArea';
import type { GameState, Choice } from '../../types/game';
import '../../styles/ux-system.css';

interface DashboardTabProps {
  gameState: GameState;
  storyData: {
    title: string;
    text: string;
    choices: Choice[];
  } | null;
  onMakeChoice: (choice: Choice) => void;
  canAffordChoice: (choice: Choice) => boolean;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  gameState,
  storyData,
  onMakeChoice,
  canAffordChoice
}) => {
  // Helper functions for status calculation
  const getResourceStatus = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage <= 20) return 'critical';
    if (percentage <= 40) return 'warning';
    return 'healthy';
  };

  const getCriticalAlerts = () => {
    const alerts = [];
    if (gameState.hope <= 20) alerts.push({ type: 'critical', message: 'Hope critically low - immediate action needed!' });
    if (gameState.health <= 30) alerts.push({ type: 'critical', message: 'Health critical - rest or medical attention required!' });
    if (gameState.supplies <= 10) alerts.push({ type: 'warning', message: 'Supplies running low - scavenge or trade soon.' });
    return alerts;
  };

  const alerts = getCriticalAlerts();

  return (
    <div className="container">
      <h1 className="heading-primary">Last Hope: Seeds of Tomorrow</h1>

      {/* Critical Alerts - Highest Priority */}
      {alerts.map((alert, index) => (
        <div key={index} className={`alert alert-${alert.type}`}>
          <span>⚠️</span>
          <span>{alert.message}</span>
        </div>
      ))}

      <div className="grid grid-cols-3 gap-lg">
        {/* Primary Resources - Most Important */}
        <div className="card card-elevated">
          <h2 className="heading-secondary">
            <span>💚</span>
            Vital Resources
          </h2>
          <div className="resource-group">
            <div className={`resource-item ${getResourceStatus(gameState.hope, 100)}`}>
              <div className="resource-label">
                <span className="resource-icon">✨</span>
                <span>Hope</span>
              </div>
              <div className="flex items-center gap-sm">
                <span className="resource-value">{Math.round(gameState.hope)}</span>
                <div className="resource-bar">
                  <div
                    className="resource-bar-fill"
                    style={{
                      width: `${gameState.hope}%`,
                      backgroundColor: getResourceStatus(gameState.hope, 100) === 'critical' ?
                        'var(--status-critical)' :
                        getResourceStatus(gameState.hope, 100) === 'warning' ?
                        'var(--status-warning)' : 'var(--status-success)'
                    }}
                  />
                </div>
              </div>
            </div>

            <div className={`resource-item ${getResourceStatus(gameState.health, 100)}`}>
              <div className="resource-label">
                <span className="resource-icon">❤️</span>
                <span>Health</span>
              </div>
              <div className="flex items-center gap-sm">
                <span className="resource-value">{Math.round(gameState.health)}</span>
                <div className="resource-bar">
                  <div
                    className="resource-bar-fill"
                    style={{
                      width: `${gameState.health}%`,
                      backgroundColor: getResourceStatus(gameState.health, 100) === 'critical' ?
                        'var(--status-critical)' :
                        getResourceStatus(gameState.health, 100) === 'warning' ?
                        'var(--status-warning)' : 'var(--status-success)'
                    }}
                  />
                </div>
              </div>
            </div>

            <div className={`resource-item ${getResourceStatus(gameState.supplies, 100)}`}>
              <div className="resource-label">
                <span className="resource-icon">📦</span>
                <span>Supplies</span>
              </div>
              <div className="flex items-center gap-sm">
                <span className="resource-value">{Math.round(gameState.supplies)}</span>
                <div className="resource-bar">
                  <div
                    className="resource-bar-fill"
                    style={{
                      width: `${Math.min(gameState.supplies, 100)}%`,
                      backgroundColor: getResourceStatus(gameState.supplies, 100) === 'critical' ?
                        'var(--status-critical)' :
                        getResourceStatus(gameState.supplies, 100) === 'warning' ?
                        'var(--status-warning)' : 'var(--status-success)'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Resources */}
        <div className="card">
          <h2 className="heading-secondary">
            <span>🧠</span>
            Knowledge & Growth
          </h2>
          <div className="resource-group">
            <div className="resource-item healthy">
              <div className="resource-label">
                <span className="resource-icon">📚</span>
                <span>Knowledge</span>
              </div>
              <span className="resource-value">{Math.round(gameState.knowledge)}</span>
            </div>
            <div className="resource-item healthy">
              <div className="resource-label">
                <span className="resource-icon">🌱</span>
                <span>Seeds</span>
              </div>
              <span className="resource-value">{Math.round(gameState.seeds)}</span>
            </div>
          </div>
        </div>

        {/* Quick Status Overview */}
        <div className="card">
          <h2 className="heading-secondary">
            <span>📊</span>
            Settlement Status
          </h2>
          <div className="resource-group">
            <div className="resource-item">
              <div className="resource-label">
                <span className="resource-icon">📅</span>
                <span>Days Survived</span>
              </div>
              <span className="resource-value">{gameState.daysSurvived}</span>
            </div>
            <div className="resource-item">
              <div className="resource-label">
                <span className="resource-icon">🏗️</span>
                <span>Structures</span>
              </div>
              <span className="resource-value">{gameState.baseStructures?.length || 0}</span>
            </div>
            <div className="resource-item">
              <div className="resource-label">
                <span className="resource-icon">🌿</span>
                <span>Soil Health</span>
              </div>
              <span className="resource-value">{Math.round(gameState.ecosystem?.soilHealth || 0)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Story Content - Primary Action Area */}
      <div className="card card-elevated" style={{ marginTop: 'var(--spacing-lg)' }}>
        {storyData && (
          <StoryArea
            title={storyData.title}
            text={storyData.text}
            choices={storyData.choices}
            onMakeChoice={onMakeChoice}
            canAffordChoice={canAffordChoice}
            gameState={gameState}
          />
        )}
      </div>
    </div>
  );
};