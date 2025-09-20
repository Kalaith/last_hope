import React from 'react';
import { BaseManagement } from './BaseManagement';
import type { GameState } from '../../types/game';
import '../../styles/ux-system.css';

interface SettlementTabProps {
  gameState: GameState;
}

export const SettlementTab: React.FC<SettlementTabProps> = ({
  gameState
}) => {
  const structures = gameState.baseStructures || [];
  const npcs = Object.keys(gameState.npcs || {});

  return (
    <div className="container">
      <h1 className="heading-primary">🏗️ Settlement Management</h1>

      <div className="grid grid-cols-2 gap-lg">
        {/* Settlement Overview */}
        <div className="card card-elevated">
          <h2 className="heading-secondary">
            <span>📊</span>
            Settlement Overview
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
                <span className="resource-icon">🏠</span>
                <span>Structures Built</span>
              </div>
              <span className="resource-value">{structures.length}</span>
            </div>
            <div className="resource-item">
              <div className="resource-label">
                <span className="resource-icon">👥</span>
                <span>Population</span>
              </div>
              <span className="resource-value">{npcs.length}</span>
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

        {/* Resource Storage */}
        <div className="card">
          <h2 className="heading-secondary">
            <span>📦</span>
            Resource Storage
          </h2>
          <div className="resource-group">
            <div className="resource-item">
              <div className="resource-label">
                <span className="resource-icon">📦</span>
                <span>Supplies</span>
              </div>
              <span className="resource-value">{Math.round(gameState.supplies)}</span>
            </div>
            <div className="resource-item">
              <div className="resource-label">
                <span className="resource-icon">🌱</span>
                <span>Seeds</span>
              </div>
              <span className="resource-value">{Math.round(gameState.seeds)}</span>
            </div>
            <div className="resource-item">
              <div className="resource-label">
                <span className="resource-icon">📚</span>
                <span>Knowledge</span>
              </div>
              <span className="resource-value">{Math.round(gameState.knowledge)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Base Management - Full Width */}
      <div className="card card-elevated" style={{ marginTop: 'var(--spacing-lg)' }}>
        <BaseManagement gameState={gameState} />
      </div>
    </div>
  );
};