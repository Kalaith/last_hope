import { memo } from 'react';
import { Screen } from '../layout/Screen';
import type { MetaProgressState, RunHistory, MetaAchievement } from '../../utils/metaProgression';
import { MetaProgressionManager, META_ACHIEVEMENTS } from '../../utils/metaProgression';

interface NewGamePlusScreenProps {
  visible: boolean;
  metaState: MetaProgressState;
  onStartNewRun: (withBonuses: boolean) => void;
  onViewRunHistory: () => void;
  onBack: () => void;
}

export const NewGamePlusScreen = memo<NewGamePlusScreenProps>(({
  visible,
  metaState,
  onStartNewRun,
  onViewRunHistory,
  onBack
}) => {
  const prestigeScore = MetaProgressionManager.calculatePrestigeScore(metaState);
  const completionPercentage = MetaProgressionManager.getCompletionPercentage(metaState);
  const newGameBonuses = MetaProgressionManager.getNewGamePlusBonuses(metaState);
  const unlockedAchievements = metaState.achievements.filter(a => a.unlocked);

  const getRarityIcon = (rarity: MetaAchievement['rarity']): string => {
    switch (rarity) {
      case 'common': return '●';
      case 'rare': return '◆';
      case 'legendary': return '★';
      default: return '○';
    }
  };

  const getRarityClass = (rarity: MetaAchievement['rarity']): string => {
    switch (rarity) {
      case 'common': return 'rarity-common';
      case 'rare': return 'rarity-rare';
      case 'legendary': return 'rarity-legendary';
      default: return '';
    }
  };

  const formatEndCondition = (condition: RunHistory['endCondition']): string => {
    switch (condition) {
      case 'victory': return 'Restoration Complete';
      case 'hope_lost': return 'Lost Hope';
      case 'starvation': return 'Starvation';
      case 'ecosystem_collapse': return 'Ecosystem Collapse';
      default: return 'Unknown';
    }
  };

  const hasMeaningfulProgress = metaState.totalRuns > 0;

  return (
    <Screen visible={visible}>
      <div className="newgame-plus-screen">
        <div className="screen-header">
          <h2>⚗️ New Game Plus</h2>
          <div className="progress-summary">
            <div className="prestige-score">
              <span className="label">Prestige Score:</span>
              <span className="value">{prestigeScore.toLocaleString()}</span>
            </div>
            <div className="completion-bar">
              <div className="completion-label">Overall Progress: {completionPercentage}%</div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="meta-content">
          {/* Run Statistics */}
          <div className="stats-section">
            <h3>📊 Legacy Statistics</h3>
            <div className="stat-grid">
              <div className="stat-item">
                <span className="stat-label">Total Runs:</span>
                <span className="stat-value">{metaState.totalRuns}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Days Survived:</span>
                <span className="stat-value">{metaState.totalDaysSurvived}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Knowledge Gained:</span>
                <span className="stat-value">{metaState.totalKnowledgeGained}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Seeds Unlocked:</span>
                <span className="stat-value">{metaState.unlockedSeeds.length}</span>
              </div>
            </div>

            {metaState.bestRun && (
              <div className="best-run">
                <h4>🏆 Best Run</h4>
                <div className="run-details">
                  <span className="run-outcome">{formatEndCondition(metaState.bestRun.endCondition)}</span>
                  <span className="run-days">{metaState.bestRun.daysSurvived} days</span>
                  <span className="run-soil">Soil: {metaState.bestRun.finalEcosystem.soilHealth}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Achievements */}
          <div className="achievements-section">
            <h3>🏅 Achievements ({unlockedAchievements.length}/{META_ACHIEVEMENTS.length})</h3>
            <div className="achievements-grid">
              {META_ACHIEVEMENTS.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'} ${getRarityClass(achievement.rarity)}`}
                >
                  <div className="achievement-header">
                    <span className="achievement-icon">{achievement.icon}</span>
                    <span className="achievement-rarity">{getRarityIcon(achievement.rarity)}</span>
                  </div>
                  <div className="achievement-content">
                    <h4 className="achievement-name">{achievement.name}</h4>
                    <p className="achievement-description">{achievement.description}</p>
                    {achievement.unlocked && (
                      <div className="achievement-reward">
                        <span className="reward-icon">🎁</span>
                        <span className="reward-text">{achievement.reward.description}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New Game Plus Bonuses */}
          {hasMeaningfulProgress && (
            <div className="bonuses-section">
              <h3>✨ New Game Plus Bonuses</h3>
              <div className="bonuses-grid">
                {Object.entries(newGameBonuses).map(([resource, value]) => (
                  <div key={resource} className="bonus-item">
                    <span className="bonus-resource">{resource}:</span>
                    <span className="bonus-value">+{typeof value === 'number' ? value : '?'}</span>
                  </div>
                ))}
                {metaState.unlockedSeeds.length > 0 && (
                  <div className="bonus-item special">
                    <span className="bonus-resource">Unlocked Seeds:</span>
                    <span className="bonus-value">{metaState.unlockedSeeds.join(', ')}</span>
                  </div>
                )}
                {metaState.newGamePlusBonuses.unlockedChoices.length > 0 && (
                  <div className="bonus-item special">
                    <span className="bonus-resource">Special Abilities:</span>
                    <span className="bonus-value">{metaState.newGamePlusBonuses.unlockedChoices.length} unlocked</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="action-section">
          <div className="action-buttons">
            <button
              className="action-btn primary"
              onClick={() => onStartNewRun(false)}
            >
              🌱 Fresh Start
            </button>

            {hasMeaningfulProgress && (
              <button
                className="action-btn enhanced"
                onClick={() => onStartNewRun(true)}
              >
                ✨ New Game Plus
              </button>
            )}

            <button
              className="action-btn secondary"
              onClick={onViewRunHistory}
              disabled={metaState.totalRuns === 0}
            >
              📜 View History
            </button>

            <button
              className="action-btn tertiary"
              onClick={onBack}
            >
              ← Back
            </button>
          </div>

          {!hasMeaningfulProgress && (
            <div className="first-time-notice">
              <p>Complete your first run to unlock New Game Plus features!</p>
            </div>
          )}
        </div>
      </div>
    </Screen>
  );
});

NewGamePlusScreen.displayName = 'NewGamePlusScreen';