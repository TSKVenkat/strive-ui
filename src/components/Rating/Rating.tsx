import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

export interface RatingProps {
  /** The rating value (0-5) */
  value: number;
  /** Callback fired when the rating changes */
  onChange?: (value: number) => void;
  /** The maximum rating value */
  max?: number;
  /** Whether the rating is read-only */
  readOnly?: boolean;
  /** Whether the rating is disabled */
  disabled?: boolean;
  /** Size of the rating icons */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to allow half-star ratings */
  allowHalf?: boolean;
  /** Whether to show the rating value */
  showValue?: boolean;
  /** Custom icon for filled state */
  filledIcon?: React.ReactNode;
  /** Custom icon for empty state */
  emptyIcon?: React.ReactNode;
  /** Custom icon for half-filled state */
  halfFilledIcon?: React.ReactNode;
  /** Color of the filled icons */
  filledColor?: string;
  /** Color of the empty icons */
  emptyColor?: string;
  /** Additional className for the container */
  className?: string;
  /** Optional style overrides for the container */
  style?: React.CSSProperties;
  /** Aria label for the rating component */
  ariaLabel?: string;
}

const getSizeStyles = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm':
      return {
        fontSize: '16px',
        gap: '2px',
      };
    case 'md':
      return {
        fontSize: '24px',
        gap: '4px',
      };
    case 'lg':
      return {
        fontSize: '32px',
        gap: '6px',
      };
    default:
      return {
        fontSize: '24px',
        gap: '4px',
      };
  }
};

const Container = styled.div<{
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  ${({ size }) => getSizeStyles(size)};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

const StarContainer = styled.div<{
  readOnly?: boolean;
  disabled?: boolean;
}>`
  display: inline-flex;
  cursor: ${({ readOnly, disabled }) => 
    readOnly || disabled ? 'default' : 'pointer'};
  position: relative;
`;

const StarIcon = styled(motion.div)<{
  filled?: boolean;
  halfFilled?: boolean;
  filledColor?: string;
  emptyColor?: string;
}>`
  color: ${({ filled, halfFilled, filledColor, emptyColor, theme }) => 
    filled || halfFilled
      ? filledColor || theme.colors.warning
      : emptyColor || theme.colors.neutral[300]};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 1em;
    height: 1em;
    fill: currentColor;
  }
`;

const HalfStarContainer = styled.div`
  position: relative;
  display: inline-flex;
`;

const HalfStar = styled.div<{
  filled?: boolean;
  filledColor?: string;
  emptyColor?: string;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  overflow: hidden;
  color: ${({ filled, filledColor, theme }) => 
    filled
      ? filledColor || theme.colors.warning
      : 'transparent'};
  
  svg {
    width: 1em;
    height: 1em;
    fill: currentColor;
    transform: translateX(0);
  }
`;

const RatingValue = styled.span<{
  size: 'sm' | 'md' | 'lg';
}>`
  margin-left: 8px;
  font-size: ${({ size }) => 
    size === 'sm' ? '14px' : size === 'md' ? '16px' : '18px'};
  color: ${({ theme }) => theme.colors.neutral[700]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const FilledStar = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const EmptyStar = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
  </svg>
);

const HalfFilledStar = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
  </svg>
);

export const Rating = ({
  value,
  onChange,
  max = 5,
  readOnly = false,
  disabled = false,
  size = 'md',
  allowHalf = false,
  showValue = false,
  filledIcon,
  emptyIcon,
  halfFilledIcon,
  filledColor,
  emptyColor,
  className,
  style,
  ariaLabel = 'Rating',
}: RatingProps) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (readOnly || disabled) return;
    
    if (allowHalf) {
      const { left, width } = event.currentTarget.getBoundingClientRect();
      const percent = (event.clientX - left) / width;
      
      if (percent <= 0.5) {
        setHoverValue(index + 0.5);
      } else {
        setHoverValue(index + 1);
      }
    } else {
      setHoverValue(index + 1);
    }
  };
  
  const handleMouseLeave = () => {
    if (readOnly || disabled) return;
    setHoverValue(null);
  };
  
  const handleClick = (newValue: number) => {
    if (readOnly || disabled) return;
    if (onChange) {
      onChange(newValue);
    }
  };
  
  const renderStar = (index: number) => {
    const displayValue = hoverValue !== null ? hoverValue : value;
    const filled = index < Math.floor(displayValue);
    const halfFilled = allowHalf && !filled && index < displayValue;
    
    if (allowHalf && halfFilled) {
      return (
        <HalfStarContainer>
          {emptyIcon || <EmptyStar />}
          <HalfStar filled filledColor={filledColor}>
            {halfFilledIcon || filledIcon || <FilledStar />}
          </HalfStar>
        </HalfStarContainer>
      );
    }
    
    return filled
      ? filledIcon || <FilledStar />
      : emptyIcon || <EmptyStar />;
  };
  
  return (
    <Container 
      size={size} 
      disabled={disabled}
      className={className}
      style={style}
      role="radiogroup"
      aria-label={ariaLabel}
    >
      {Array.from({ length: max }).map((_, index) => (
        <StarContainer
          key={index}
          readOnly={readOnly}
          disabled={disabled}
          onMouseMove={(e) => handleMouseMove(e, index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(allowHalf && hoverValue ? hoverValue : index + 1)}
          role="radio"
          aria-checked={index < value}
          aria-label={`${index + 1} star${index !== 0 ? 's' : ''}`}
          tabIndex={readOnly || disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleClick(index + 1);
            }
          }}
        >
          <StarIcon
            filled={index < Math.floor(hoverValue !== null ? hoverValue : value)}
            halfFilled={
              allowHalf && 
              !(index < Math.floor(hoverValue !== null ? hoverValue : value)) && 
              index < (hoverValue !== null ? hoverValue : value)
            }
            filledColor={filledColor}
            emptyColor={emptyColor}
            whileHover={{ scale: readOnly || disabled ? 1 : 1.1 }}
            whileTap={{ scale: readOnly || disabled ? 1 : 0.9 }}
          >
            {renderStar(index)}
          </StarIcon>
        </StarContainer>
      ))}
      
      {showValue && (
        <RatingValue size={size}>
          {hoverValue !== null ? hoverValue : value}
        </RatingValue>
      )}
    </Container>
  );
};

Rating.displayName = 'Rating';
