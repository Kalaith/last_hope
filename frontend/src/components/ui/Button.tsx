import { memo, forwardRef, type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'base' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(({
    variant = 'primary',
    size = 'base',
    fullWidth = false,
    className = '',
    children,
    ...props
  }, ref) => {
    const baseClass = 'btn';
    const variantClasses = {
      primary: 'btn--primary',
      secondary: 'btn--secondary',
      outline: 'btn--outline'
    };
    const sizeClasses = {
      sm: 'btn--sm',
      base: '',
      lg: 'btn--lg'
    };

    const classes = [
      baseClass,
      variantClasses[variant],
      sizeClasses[size],
      fullWidth ? 'btn--full-width' : '',
      className
    ].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        className={classes}
        {...props}
      >
        {children}
      </button>
    );
  })
);

Button.displayName = 'Button';