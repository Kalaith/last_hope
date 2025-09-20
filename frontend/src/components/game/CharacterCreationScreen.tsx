import { memo } from 'react';
import { Screen } from '../layout/Screen';
import { Button } from '../ui/Button';
import { BackgroundCard } from './BackgroundCard';
import { useGameStore } from '../../stores/gameStore';
import { gameData } from '../../data';

interface CharacterCreationScreenProps {
  visible: boolean;
}

export const CharacterCreationScreen = memo<CharacterCreationScreenProps>(({ visible }) => {
  const {
    selectedBackground,
    selectBackground,
    startGame
  } = useGameStore();

  const handleBackgroundSelect = (backgroundId: string) => {
    selectBackground(backgroundId);
  };

  const handleStartGame = () => {
    startGame();
  };

  return (
    <Screen visible={visible}>
      <div className="title-section">
        <h1>Last Hope: Seeds of Tomorrow</h1>
        <p className="subtitle">
          The world is dying. Humanity faces extinction. But perhaps... there's still a chance.
        </p>
      </div>

      <div className="character-selection">
        <h2>Choose Your Background</h2>
        <div className="background-options">
          {gameData.characterBackgrounds.map((background) => (
            <BackgroundCard
              key={background.id}
              background={background}
              isSelected={selectedBackground?.id === background.id}
              onSelect={handleBackgroundSelect}
            />
          ))}
        </div>
        <Button
          onClick={handleStartGame}
          disabled={!selectedBackground}
          fullWidth={false}
          className="mt-8"
        >
          Begin Your Journey
        </Button>
      </div>
    </Screen>
  );
});

CharacterCreationScreen.displayName = 'CharacterCreationScreen';