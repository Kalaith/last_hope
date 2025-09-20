import React from 'react';
import { ResearchTree } from './ResearchTree';
import { ProgressSection } from './ProgressSection';
import type { GameState } from '../../types/game';
import '../../styles/ux-system.css';

interface ResearchTabProps {
  gameState: GameState;
}

export const ResearchTab: React.FC<ResearchTabProps> = ({
  gameState
}) => {
  const researchProgress = gameState.researchProgress;
  const completedCount = researchProgress?.completedResearch?.length || 0;
  const currentResearch = researchProgress?.currentResearch;
  const daysInProgress = researchProgress?.daysInProgress || 0;

  return (
    <div className="container">
      <h1 className="heading-primary">🔬 Research & Development</h1>

      <div className="grid grid-cols-3 gap-lg">
        {/* Research Resources */}
        <div className="card card-elevated">
          <h2 className="heading-secondary">
            <span>📚</span>
            Research Resources
          </h2>
          <div className="resource-group">
            <div className="resource-item healthy">
              <div className="resource-label">
                <span className="resource-icon">🧠</span>
                <span>Available Knowledge</span>
              </div>
              <span className="resource-value">{Math.round(gameState.knowledge)}</span>
            </div>
            <div className="resource-item">
              <div className="resource-label">
                <span className="resource-icon">⚡</span>
                <span>Research Speed</span>
              </div>
              <span className="resource-value">Normal</span>
            </div>
            <div className="resource-item">
              <div className="resource-label">
                <span className="resource-icon">🔬</span>
                <span>Lab Efficiency</span>
              </div>
              <span className="resource-value">85%</span>
            </div>
          </div>
        </div>

        {/* Current Research */}
        <div className="card">
          <h2 className="heading-secondary">
            <span>🔍</span>
            Current Research
          </h2>
          <div className="resource-group">
            {currentResearch ? (
              <>
                <div className="resource-item warning">
                  <div className="resource-label">
                    <span className="resource-icon">🔬</span>
                    <span>Active Project</span>
                  </div>
                  <span className="resource-value">In Progress</span>
                </div>
                <div className="resource-item">
                  <div className="resource-label">
                    <span className="resource-icon">📝</span>
                    <span>Project Name</span>
                  </div>
                  <span className="resource-value" style={{ fontSize: 'var(--text-sm)' }}>
                    {currentResearch}
                  </span>
                </div>
                <div className="resource-item">
                  <div className="resource-label">
                    <span className="resource-icon">⏱️</span>
                    <span>Days Progress</span>
                  </div>
                  <span className="resource-value">{daysInProgress}</span>
                </div>
              </>
            ) : (
              <div className="resource-item">
                <div className="resource-label">
                  <span className="resource-icon">💤</span>
                  <span>Research Status</span>
                </div>
                <span className="resource-value">Idle</span>
              </div>
            )}
          </div>
        </div>

        {/* Research Progress */}
        <div className="card">
          <h2 className="heading-secondary">
            <span>🏆</span>
            Research Progress
          </h2>
          <div className="resource-group">
            <div className="resource-item success">
              <div className="resource-label">
                <span className="resource-icon">✅</span>
                <span>Completed</span>
              </div>
              <span className="resource-value">{completedCount}</span>
            </div>
            <div className="resource-item">
              <div className="resource-label">
                <span className="resource-icon">🔓</span>
                <span>Available</span>
              </div>
              <span className="resource-value">{researchProgress?.availableResearch?.length || 0}</span>
            </div>
            <div className="resource-item">
              <div className="resource-label">
                <span className="resource-icon">📈</span>
                <span>Efficiency</span>
              </div>
              <span className="resource-value">Good</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-lg" style={{ marginTop: 'var(--spacing-lg)' }}>
        {/* Research Tree */}
        <div className="card card-elevated">
          <ResearchTree gameState={gameState} />
        </div>

        {/* Progress & Achievements */}
        <div className="card">
          <ProgressSection gameState={gameState} />
        </div>
      </div>
    </div>
  );
};