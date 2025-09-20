import { memo, type ReactNode } from 'react';

interface ScreenProps {
  children: ReactNode;
  visible?: boolean;
  className?: string;
}

export const Screen = memo<ScreenProps>(({
  children,
  visible = true,
  className = ''
}) => {
  const classes = [
    'screen',
    !visible ? 'hidden' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
});

Screen.displayName = 'Screen';