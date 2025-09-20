import { memo, type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export const Card = memo<CardProps>(({
  children,
  className = '',
  onClick,
  selected = false
}) => {
  const classes = [
    'card',
    selected ? 'selected' : '',
    onClick ? 'cursor-pointer' : '',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick?.();
  };

  return (
    <div className={classes} onClick={onClick ? handleClick : undefined}>
      <div className="card__body">
        {children}
      </div>
    </div>
  );
});

Card.displayName = 'Card';