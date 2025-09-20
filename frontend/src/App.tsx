import { useEffect } from 'react';
import { GameContainer } from './components/layout/GameContainer';
import { CharacterCreationScreen } from './components/game/CharacterCreationScreen';
import { GameScreen } from './components/game/GameScreen';
import { EndingScreen } from './components/game/EndingScreen';
import { useGameStore } from './stores/gameStore';
import './styles/terminal.css';

const App: React.FC = () => {
  const { currentScreen } = useGameStore();

  useEffect(() => {
    document.title = "Last Hope: Seeds of Tomorrow";
  }, []);

  return (
    <GameContainer>
      <CharacterCreationScreen visible={currentScreen === 'characterCreation'} />
      <GameScreen visible={currentScreen === 'game'} />
      <EndingScreen visible={currentScreen === 'ending'} />
    </GameContainer>
  );
};

export default App;