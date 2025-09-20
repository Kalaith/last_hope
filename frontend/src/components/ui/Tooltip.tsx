import { memo, useState, useRef, useCallback, type ReactNode } from 'react';

interface TooltipProps {
  content: string | ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
  maxWidth?: string;
  disabled?: boolean;
}

export const Tooltip = memo<TooltipProps>(({
  content,
  children,
  position = 'top',
  delay = 300,
  className = '',
  maxWidth = '350px',
  disabled = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const wrapperRef = useRef<HTMLDivElement>(null);

  const calculatePosition = useCallback(() => {
    if (!wrapperRef.current) return {};

    const rect = wrapperRef.current.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    const spacing = 12; // Space between tooltip and element
    let style: React.CSSProperties = {};

    switch (position) {
      case 'top':
        style = {
          left: rect.left + scrollX + rect.width / 2,
          top: rect.top + scrollY - spacing,
          transform: 'translateX(-50%) translateY(-100%)'
        };
        break;
      case 'bottom':
        style = {
          left: rect.left + scrollX + rect.width / 2,
          top: rect.bottom + scrollY + spacing,
          transform: 'translateX(-50%)'
        };
        break;
      case 'left':
        style = {
          left: rect.left + scrollX - spacing,
          top: rect.top + scrollY + rect.height / 2,
          transform: 'translateX(-100%) translateY(-50%)'
        };
        break;
      case 'right':
        style = {
          left: rect.right + scrollX + spacing,
          top: rect.top + scrollY + rect.height / 2,
          transform: 'translateY(-50%)'
        };
        break;
    }

    // Ensure tooltip stays within viewport
    const maxWidthNum = parseInt(maxWidth.replace('px', ''));
    if (style.left && (style.left as number) + maxWidthNum > window.innerWidth) {
      style.left = window.innerWidth - maxWidthNum - 20;
      style.transform = 'translateY(-50%)';
    }

    return style;
  }, [position, maxWidth]);

  const showTooltip = () => {
    if (disabled) return;

    const id = window.setTimeout(() => {
      setTooltipStyle(calculatePosition());
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'tooltip-top';
      case 'bottom':
        return 'tooltip-bottom';
      case 'left':
        return 'tooltip-left';
      case 'right':
        return 'tooltip-right';
      default:
        return 'tooltip-top';
    }
  };

  return (
    <>
      <div
        ref={wrapperRef}
        className={`tooltip-wrapper ${className}`}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`tooltip-content ${getPositionClasses()}`}
          style={{
            ...tooltipStyle,
            maxWidth,
            zIndex: 9999
          }}
          role="tooltip"
        >
          <div className="tooltip-inner">
            {content}
          </div>
          <div className="tooltip-arrow" />
        </div>
      )}
    </>
  );
});

Tooltip.displayName = 'Tooltip';