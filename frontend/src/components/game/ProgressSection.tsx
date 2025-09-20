import { memo } from 'react';
import { ProgressBar } from '../ui/ProgressBar';
import { Tooltip } from '../ui/Tooltip';
import type { GameState } from '../../types/game';

interface ProgressSectionProps {
  gameState: GameState;
}

export const ProgressSection = memo<ProgressSectionProps>(({ gameState }) => {
  const { ecosystem, npcs } = gameState;

  const soilHealth = ecosystem?.soilHealth || 0;
  const plantDiversity = ecosystem?.plantDiversity || 0;

  return (
    <div className="progress-section">
      <div className="restoration-progress">
        <Tooltip
          content={
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--color-terminal-amber)' }}>
                Ecosystem Restoration Metrics
              </div>
              <div style={{ fontSize: '0.9em', whiteSpace: 'pre-line' }}>
                Track your progress in healing the wasteland.

                Soil Health: Core restoration metric that affects all other aspects
                Plant Diversity: Number of different species - crucial for ecosystem stability
              </div>
            </div>
          }
          position="bottom"
          className="tooltip-npc"
        >
          <h4 style={{ cursor: 'help' }}>Ecosystem Restoration ℹ️</h4>
        </Tooltip>
        <div className="ecosystem-metrics">
          <Tooltip
            content={
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: 'var(--color-terminal-amber)' }}>
                  Soil Health: {Math.round(soilHealth)}%
                </div>
                <div style={{ fontSize: '0.9em', whiteSpace: 'pre-line' }}>
                  The foundation of all restoration efforts.

                  • 0-25%: Dead soil, nothing can grow
                  • 26-50%: Basic plants can survive
                  • 51-75%: Diverse vegetation possible
                  • 76-100%: Thriving ecosystem

                  Improved by: Planting seeds, successful restoration choices
                  Decreased by: Failed experiments, environmental disasters
                </div>
              </div>
            }
            position="left"
            className="tooltip-world"
            maxWidth="280px"
          >
            <div className="metric" style={{ cursor: 'help' }}>
              <span className="metric-label">Soil Health</span>
              <ProgressBar value={soilHealth} type="restoration" />
              <span>{Math.round(soilHealth)}%</span>
            </div>
          </Tooltip>
          <Tooltip
            content={
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: 'var(--color-terminal-amber)' }}>
                  Plant Diversity: {plantDiversity} species
                </div>
                <div style={{ fontSize: '0.9em', whiteSpace: 'pre-line' }}>
                  Biodiversity is key to ecosystem resilience.

                  Each species contributes unique benefits:
                  • Soil improvement
                  • Pest resistance
                  • Nutrient cycling
                  • Habitat for wildlife

                  More species = more stable ecosystem
                </div>
              </div>
            }
            position="left"
            className="tooltip-world"
            maxWidth="280px"
          >
            <div className="metric" style={{ cursor: 'help' }}>
              <span className="metric-label">Plant Diversity</span>
              <span className="diversity-count">{plantDiversity} species</span>
            </div>
          </Tooltip>
        </div>
      </div>
      <div className="community-status">
        <Tooltip
          content={
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--color-terminal-amber)' }}>
                Community Trust & Relationships
              </div>
              <div style={{ fontSize: '0.9em', whiteSpace: 'pre-line' }}>
                Your relationships with the survivors in your community.

                Trust affects:
                • Available dialogue options
                • Support during crises
                • Resource sharing
                • Victory conditions

                Mood indicates their current emotional state and likelihood to help.
              </div>
            </div>
          }
          position="bottom"
          className="tooltip-npc"
        >
          <h4 style={{ cursor: 'help' }}>Community Trust ℹ️</h4>
        </Tooltip>
        <div className="relationships">
          {Object.entries(npcs || {}).map(([npcId, npc]) => {
            if (!npc) return null;

            const getNPCTooltip = () => {
              const personalities = {
                elena: "Elena - The Optimist: Believes in hope and community cooperation. Values sharing and positive outcomes.",
                marcus: "Marcus - The Pragmatist: Focuses on practical solutions and efficient resource management.",
                chen: "Chen - The Scientist: Driven by research and discovery. Values methodical approaches to problems."
              };

              const trustLevel = npc.trustLevel || 0;
              const trustStatus = trustLevel >= 70 ? 'Strong ally' :
                                trustLevel >= 40 ? 'Trusted friend' :
                                trustLevel >= 20 ? 'Cautious acquaintance' : 'Distrustful stranger';

              return (
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px', color: 'var(--color-terminal-amber)' }}>
                    {personalities[npcId as keyof typeof personalities] || `${npcId.charAt(0).toUpperCase() + npcId.slice(1)}`}
                  </div>
                  <div style={{ fontSize: '0.9em', marginBottom: '4px' }}>
                    Trust Level: {Math.round(trustLevel)}% - {trustStatus}
                  </div>
                  <div style={{ fontSize: '0.9em', marginBottom: '4px' }}>
                    Current Mood: {npc.mood || 'neutral'}
                  </div>
                  <div style={{ fontSize: '0.8em', color: 'var(--color-ash-400)' }}>
                    High trust unlocks better dialogue options and support during critical moments.
                  </div>
                </div>
              );
            };

            return (
              <Tooltip
                key={npcId}
                content={getNPCTooltip()}
                position="left"
                className="tooltip-npc"
                maxWidth="280px"
              >
                <div className="relationship" style={{ cursor: 'help' }}>
                  <span className="relationship-name">
                    {npcId.charAt(0).toUpperCase() + npcId.slice(1)}
                  </span>
                  <div className="trust-info">
                    <ProgressBar
                      value={npc.trustLevel || 0}
                      type="trust"
                      className={(npc.trustLevel || 0) < 30 ? 'low-trust' : ''}
                    />
                    <span className="trust-level">{Math.round(npc.trustLevel || 0)}%</span>
                  </div>
                  <span className={`mood-indicator ${npc.mood || 'neutral'}`}>
                    {npc.mood === 'hopeful' ? '😊' :
                     npc.mood === 'neutral' ? '😐' :
                     npc.mood === 'worried' ? '😟' : '😰'}
                  </span>
                </div>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </div>
  );
});

ProgressSection.displayName = 'ProgressSection';