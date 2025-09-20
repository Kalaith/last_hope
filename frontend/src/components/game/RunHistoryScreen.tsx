import { memo, useState } from 'react';
import { Screen } from '../layout/Screen';
import type { RunHistory } from '../../utils/metaProgression';

interface RunHistoryScreenProps {
  visible: boolean;
  runHistory: RunHistory[];
  onBack: () => void;
}

export const RunHistoryScreen = memo<RunHistoryScreenProps>(({
  visible,
  runHistory,
  onBack
}) => {
  const [selectedRun, setSelectedRun] = useState<RunHistory | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'days' | 'outcome'>('date');

  const formatEndCondition = (condition: RunHistory['endCondition']): string => {
    switch (condition) {
      case 'victory': return 'Restoration Complete';
      case 'hope_lost': return 'Lost Hope';
      case 'starvation': return 'Starvation';
      case 'ecosystem_collapse': return 'Ecosystem Collapse';
      default: return 'Unknown';
    }
  };

  const getOutcomeIcon = (condition: RunHistory['endCondition']): string => {
    switch (condition) {
      case 'victory': return '🏆';
      case 'hope_lost': return '💔';
      case 'starvation': return '🍂';
      case 'ecosystem_collapse': return '☠️';
      default: return '❓';
    }
  };

  const getOutcomeClass = (condition: RunHistory['endCondition']): string => {
    switch (condition) {
      case 'victory': return 'outcome-victory';
      case 'hope_lost': return 'outcome-hope-lost';
      case 'starvation': return 'outcome-starvation';
      case 'ecosystem_collapse': return 'outcome-collapse';
      default: return 'outcome-unknown';
    }
  };

  const sortedRuns = [...runHistory].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return b.endDate - a.endDate;
      case 'days':
        return b.daysSurvived - a.daysSurvived;
      case 'outcome': {
        const outcomeOrder = { victory: 0, hope_lost: 1, starvation: 2, ecosystem_collapse: 3 };
        return outcomeOrder[a.endCondition] - outcomeOrder[b.endCondition];
      }
      default:
        return 0;
    }
  });

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString();
  };

  const calculateRunScore = (run: RunHistory): number => {
    let score = run.daysSurvived * 10;
    if (run.endCondition === 'victory') score += 500;
    score += run.finalEcosystem.soilHealth * 2;
    score += run.finalEcosystem.plantDiversity * 20;
    score += Object.values(run.highestTrustLevels).reduce((sum, trust) => sum + trust, 0);
    return score;
  };

  if (runHistory.length === 0) {
    return (
      <Screen visible={visible}>
        <div className="run-history-screen empty">
          <div className="empty-state">
            <span className="empty-icon">📜</span>
            <h3>No History Yet</h3>
            <p>Complete your first run to see it recorded here.</p>
            <button className="action-btn tertiary" onClick={onBack}>
              ← Back
            </button>
          </div>
        </div>
      </Screen>
    );
  }

  return (
    <Screen visible={visible}>
      <div className="run-history-screen">
        <div className="screen-header">
          <h2>📜 Run History</h2>
          <div className="history-controls">
            <div className="sort-controls">
              <label>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="sort-select"
              >
                <option value="date">Date</option>
                <option value="days">Days Survived</option>
                <option value="outcome">Outcome</option>
              </select>
            </div>
            <div className="history-stats">
              <span>Total Runs: {runHistory.length}</span>
              <span>Victories: {runHistory.filter(r => r.endCondition === 'victory').length}</span>
            </div>
          </div>
        </div>

        <div className="history-content">
          {!selectedRun ? (
            /* Run List View */
            <div className="run-list">
              {sortedRuns.map((run, index) => (
                <div
                  key={run.id}
                  className={`run-item ${getOutcomeClass(run.endCondition)}`}
                  onClick={() => setSelectedRun(run)}
                >
                  <div className="run-header">
                    <span className="run-icon">{getOutcomeIcon(run.endCondition)}</span>
                    <span className="run-number">Run #{runHistory.length - index}</span>
                    <span className="run-date">{formatDate(run.endDate)}</span>
                  </div>

                  <div className="run-summary">
                    <div className="summary-item">
                      <span className="label">Outcome:</span>
                      <span className="value">{formatEndCondition(run.endCondition)}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Days:</span>
                      <span className="value">{run.daysSurvived}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Soil Health:</span>
                      <span className="value">{run.finalEcosystem.soilHealth}%</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Score:</span>
                      <span className="value">{calculateRunScore(run).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="run-preview">
                    <div className="preview-resources">
                      Hope: {run.finalResources.hope} |
                      Health: {run.finalResources.health} |
                      Supplies: {run.finalResources.supplies}
                    </div>
                    <div className="preview-ecosystem">
                      Plants: {run.finalEcosystem.totalPlants} |
                      Diversity: {run.finalEcosystem.plantDiversity} |
                      Seeds Found: {run.seedsDiscovered.length}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Detailed Run View */
            <div className="run-details">
              <div className="details-header">
                <button
                  className="back-btn"
                  onClick={() => setSelectedRun(null)}
                >
                  ← Back to List
                </button>
                <div className="run-title">
                  <span className="run-icon">{getOutcomeIcon(selectedRun.endCondition)}</span>
                  <span>Run Details - {formatDate(selectedRun.endDate)}</span>
                </div>
              </div>

              <div className="details-content">
                <div className="details-section">
                  <h3>📊 Final Statistics</h3>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="label">Outcome:</span>
                      <span className={`value ${getOutcomeClass(selectedRun.endCondition)}`}>
                        {formatEndCondition(selectedRun.endCondition)}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="label">Days Survived:</span>
                      <span className="value">{selectedRun.daysSurvived}</span>
                    </div>
                    <div className="stat-item">
                      <span className="label">Choices Made:</span>
                      <span className="value">{selectedRun.totalChoicesMade}</span>
                    </div>
                    <div className="stat-item">
                      <span className="label">Final Score:</span>
                      <span className="value">{calculateRunScore(selectedRun).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="details-section">
                  <h3>📦 Final Resources</h3>
                  <div className="resource-bars">
                    {Object.entries(selectedRun.finalResources).map(([resource, value]) => (
                      <div key={resource} className="resource-bar">
                        <div className="resource-label">{resource}:</div>
                        <div className="resource-progress">
                          <div
                            className="resource-fill"
                            style={{ width: `${Math.min(100, (value / 100) * 100)}%` }}
                          />
                        </div>
                        <div className="resource-value">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="details-section">
                  <h3>🌱 Ecosystem Status</h3>
                  <div className="ecosystem-stats">
                    <div className="eco-stat">
                      <span className="label">Soil Health:</span>
                      <span className="value">{selectedRun.finalEcosystem.soilHealth}%</span>
                    </div>
                    <div className="eco-stat">
                      <span className="label">Plant Diversity:</span>
                      <span className="value">{selectedRun.finalEcosystem.plantDiversity} species</span>
                    </div>
                    <div className="eco-stat">
                      <span className="label">Total Plants:</span>
                      <span className="value">{selectedRun.finalEcosystem.totalPlants}</span>
                    </div>
                    <div className="eco-stat">
                      <span className="label">Max Soil Achieved:</span>
                      <span className="value">{selectedRun.maxSoilHealth}%</span>
                    </div>
                  </div>
                </div>

                <div className="details-section">
                  <h3>🤝 NPC Relationships</h3>
                  <div className="trust-levels">
                    {Object.entries(selectedRun.highestTrustLevels).map(([npcId, trust]) => (
                      <div key={npcId} className="trust-item">
                        <span className="npc-name">{npcId.charAt(0).toUpperCase() + npcId.slice(1)}:</span>
                        <div className="trust-bar">
                          <div
                            className="trust-fill"
                            style={{ width: `${trust}%` }}
                          />
                        </div>
                        <span className="trust-value">{trust}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedRun.seedsDiscovered.length > 0 && (
                  <div className="details-section">
                    <h3>🌰 Seeds Discovered</h3>
                    <div className="seeds-list">
                      {selectedRun.seedsDiscovered.map((seed) => (
                        <span key={seed} className="seed-item">{seed}</span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedRun.achievementsUnlocked.length > 0 && (
                  <div className="details-section">
                    <h3>🏅 Achievements Unlocked</h3>
                    <div className="achievements-list">
                      {selectedRun.achievementsUnlocked.map((achievementId) => (
                        <span key={achievementId} className="achievement-item">{achievementId}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="action-section">
          <button className="action-btn tertiary" onClick={onBack}>
            ← Back to Menu
          </button>
        </div>
      </div>
    </Screen>
  );
});

RunHistoryScreen.displayName = 'RunHistoryScreen';