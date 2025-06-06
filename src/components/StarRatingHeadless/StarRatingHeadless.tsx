import React, { forwardRef } from 'react';
import { Rating, RatingHeadlessProps } from '../RatingHeadless/RatingHeadless';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

/**
 * Props for the StarRatingHeadless component
 */
export type StarRatingHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  Omit<RatingHeadlessProps<C>, 'as' | 'ref'> & {
    /** Size of the stars */
    size?: 'sm' | 'md' | 'lg' | number;
    /** Color of the active stars */
    activeColor?: string;
    /** Color of the inactive stars */
    inactiveColor?: string;
    /** Whether to show the rating value */
    showValue?: boolean;
    /** Format function for the rating value */
    formatValue?: (value: number) => React.ReactNode;
  }
>;

/**
 * A headless Star Rating component that provides all the functionality for star ratings without any styling.
 * This component extends the base Rating component with star-specific features.
 */
export const StarRatingHeadless = forwardRef(function StarRatingHeadless<C extends React.ElementType = 'div'>(
  props: Omit<StarRatingHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { 
    size = 'md', 
    activeColor = 'currentColor',
    inactiveColor = 'currentColor',
    showValue = false,
    formatValue,
    ...ratingProps 
  } = props;
  // Convert size to pixels
  const sizeInPx = typeof size === 'number' 
    ? size 
    : size === 'sm' 
      ? 16 
      : size === 'md' 
        ? 24 
        : 32;

  // Star SVG paths
  const starPath = "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";
  const starHalfPath = "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z M12 4.6l1.57 3.79 3.68 0.32-2.75 2.39 0.74 3.61L12 12.85";

  // Format the rating value
  const formattedValue = (value: number) => {
    if (formatValue) {
      return formatValue(value);
    }
    return ratingProps.allowHalf ? value.toFixed(1) : value;
  };


  
  return (
    <Rating
      {...(ratingProps as any)}
      ref={ref as any}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {ratingProps.label && (
          <Rating.Label style={{ marginRight: '8px' }}>
            {ratingProps.label}
          </Rating.Label>
        )}
        
        <Rating.Group style={{ display: 'flex', gap: '2px' }}>
          {Array.from({ length: ratingProps.max || 5 }, (_, i) => (
            <React.Fragment key={i + 1}>
              {ratingProps.allowHalf && (
                <Rating.Item
                  value={i + 0.5}
                  half
                  style={{ 
                    cursor: ratingProps.disabled || ratingProps.readOnly ? 'default' : 'pointer',
                    width: sizeInPx / 2,
                    height: sizeInPx,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  activeIcon={
                    <svg 
                      width={sizeInPx} 
                      height={sizeInPx} 
                      viewBox="0 0 24 24"
                      fill={activeColor}
                      style={{ 
                        position: 'absolute',
                        left: 0,
                        opacity: ratingProps.disabled ? 0.5 : 1,
                      }}
                    >
                      <path d={starHalfPath} />
                    </svg>
                  }
                  inactiveIcon={
                    <svg 
                      width={sizeInPx} 
                      height={sizeInPx} 
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={inactiveColor}
                      strokeWidth="1"
                      style={{ 
                        position: 'absolute',
                        left: 0,
                        opacity: ratingProps.disabled ? 0.5 : 1,
                      }}
                    >
                      <path d={starHalfPath} />
                    </svg>
                  }
                />
              )}
              
              <Rating.Item
                value={i + 1}
                style={{ 
                  cursor: ratingProps.disabled || ratingProps.readOnly ? 'default' : 'pointer',
                  width: ratingProps.allowHalf ? sizeInPx / 2 : sizeInPx,
                  height: sizeInPx,
                  position: 'relative',
                  overflow: 'hidden',
                }}
                activeIcon={
                  <svg 
                    width={sizeInPx} 
                    height={sizeInPx} 
                    viewBox="0 0 24 24"
                    fill={activeColor}
                    style={{ 
                      position: 'absolute',
                      right: 0,
                      opacity: ratingProps.disabled ? 0.5 : 1,
                    }}
                  >
                    <path d={starPath} />
                  </svg>
                }
                inactiveIcon={
                  <svg 
                    width={sizeInPx} 
                    height={sizeInPx} 
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={inactiveColor}
                    strokeWidth="1"
                    style={{ 
                      position: 'absolute',
                      right: 0,
                      opacity: ratingProps.disabled ? 0.5 : 1,
                    }}
                  >
                    <path d={starPath} />
                  </svg>
                }
              />
            </React.Fragment>
          ))}
        </Rating.Group>
        
        {showValue && (
          <span style={{ marginLeft: '8px' }}>
            {formattedValue(ratingProps.value !== undefined ? ratingProps.value : ratingProps.defaultValue || 0)}
          </span>
        )}
      </div>
      
      <Rating.Input />
    </Rating>
  );
}) as <C extends React.ElementType = 'div'>(
  props: StarRatingHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

// Add displayName for better debugging
(StarRatingHeadless as any).displayName = 'StarRatingHeadless';

export default StarRatingHeadless;
