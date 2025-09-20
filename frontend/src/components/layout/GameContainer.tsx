import { memo, type ReactNode } from 'react';

interface GameContainerProps {
  children: ReactNode;
}

export const GameContainer = memo<GameContainerProps>(({ children }) => {
  return (
    <div id="gameContainer" className="game-container">
      {children}
    </div>
  );
});

GameContainer.displayName = 'GameContainer';