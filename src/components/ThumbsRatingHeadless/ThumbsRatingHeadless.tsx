import React, { forwardRef, useState, useCallback } from 'react';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

/**
 * Props for the ThumbsRatingHeadless component
 */
export type ThumbsRatingHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Default value (uncontrolled) */
    defaultValue?: 'up' | 'down' | null;
    /** Controlled value */
    value?: 'up' | 'down' | null;
    /** Callback when value changes */
    onChange?: (value: 'up' | 'down' | null) => void;
    /** Whether to allow clearing the rating by clicking the same value */
    allowClear?: boolean;
    /** Whether the rating is disabled */
    disabled?: boolean;
    /** Whether the rating is read-only */
    readOnly?: boolean;
    /** Whether the rating is required */
    required?: boolean;
    /** ID for the rating element */
    id?: string;
    /** Name attribute for the rating */
    name?: string;
    /** Label for the thumbs up button */
    upLabel?: string;
    /** Label for the thumbs down button */
    downLabel?: string;
    /** Size of the thumbs */
    size?: 'sm' | 'md' | 'lg' | number;
    /** Color of the active thumbs */
    activeColor?: string;
    /** Color of the inactive thumbs */
    inactiveColor?: string;
    /** Children to render inside the component */
    children?: React.ReactNode;
    /** Custom class name for the container */
    className?: string;
    /** Custom styles for the container */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the ThumbsUpButton component
 */
export type ThumbsUpButtonProps<C extends React.ElementType = 'button'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the button */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the ThumbsDownButton component
 */
export type ThumbsDownButtonProps<C extends React.ElementType = 'button'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the button */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * A headless Thumbs Rating component that provides functionality for thumbs up/down ratings.
 */
export const ThumbsRatingHeadless = forwardRef(function ThumbsRatingHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    defaultValue = null as any,
    value: controlledValue,
    onChange,
    allowClear = true as any,
    disabled = false as any,
    readOnly = false as any,
    required = false as any,
    id,
    name,
    upLabel = 'Thumbs up' as any,
    downLabel = 'Thumbs down' as any,
    size = 'md' as any,
    activeColor = 'currentColor' as any,
    inactiveColor = 'currentColor' as any,
    ...props 
  }: Omit<ThumbsRatingHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  // State for uncontrolled component
  const [internalValue, setInternalValue] = useState<'up' | 'down' | null>(defaultValue);
  
  // Use controlled or uncontrolled value
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  
  // Convert size to pixels
  const sizeInPx = typeof size === 'number' 
    ? size 
    : size === 'sm' 
      ? 16 
      : size === 'md' 
        ? 24 
        : 32;
  
  // Handle value change
  const handleChange = useCallback((newValue: 'up' | 'down' | null) => {
    // If the same value is clicked and allowClear is true, clear the rating
    if (allowClear && newValue === value) {
      newValue = null;
    }
    
    // Update internal state for uncontrolled component
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    
    // Call onChange callback
    if (onChange) {
      onChange(newValue);
    }
  }, [value, allowClear, controlledValue, onChange]);
  
  // Handle thumbs up click
  const handleThumbsUp = useCallback(() => {
    if (!disabled && !readOnly) {
      handleChange('up');
    }
  }, [disabled, readOnly, handleChange]);
  
  // Handle thumbs down click
  const handleThumbsDown = useCallback(() => {
    if (!disabled && !readOnly) {
      handleChange('down');
    }
  }, [disabled, readOnly, handleChange]);
  
  // SVG paths for thumbs
  const thumbsUpPath = "M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z";
  const thumbsDownPath = "M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z";
  
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      role="radiogroup"
      aria-disabled={disabled ? true : undefined}
      aria-readonly={readOnly ? true : undefined}
      aria-required={required ? true : undefined}
      data-disabled={disabled ? '' : undefined}
      data-readonly={readOnly ? '' : undefined}
      {...props}
    >
      {children || (
        <div style={{ display: 'flex', gap: '16px' }}>
          <ThumbsUpButton
            onClick={handleThumbsUp}
            aria-label={upLabel}
            aria-pressed={value === 'up'}
            disabled={disabled}
            style={{
              cursor: disabled || readOnly ? 'default' : 'pointer',
              opacity: disabled ? 0.5 : 1,
            }}
          >
            <svg 
              width={sizeInPx} 
              height={sizeInPx} 
              viewBox="0 0 24 24"
              fill={value === 'up' ? activeColor : inactiveColor}
              style={{ 
                transform: 'scale(1, 1)',
              }}
            >
              <path d={thumbsUpPath} />
            </svg>
          </ThumbsUpButton>
          
          <ThumbsDownButton
            onClick={handleThumbsDown}
            aria-label={downLabel}
            aria-pressed={value === 'down'}
            disabled={disabled}
            style={{
              cursor: disabled || readOnly ? 'default' : 'pointer',
              opacity: disabled ? 0.5 : 1,
            }}
          >
            <svg 
              width={sizeInPx} 
              height={sizeInPx} 
              viewBox="0 0 24 24"
              fill={value === 'down' ? activeColor : inactiveColor}
              style={{ 
                transform: 'scale(1, 1)',
              }}
            >
              <path d={thumbsDownPath} />
            </svg>
          </ThumbsDownButton>
          
          <input
            type="hidden"
            id={id}
            name={name}
            value={value || ''}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
          />
        </div>
      )}
    </ElementType>
  );
}) as <C extends React.ElementType = 'div'>(
  props: ThumbsRatingHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

/**
 * The thumbs up button component.
 */
export const ThumbsUpButton = forwardRef(function ThumbsUpButton<C extends React.ElementType = 'button'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<ThumbsUpButtonProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  // Use the 'as' prop or default to 'button'
  const ElementType: React.ElementType = as || 'button';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        ...style,
      }}
      type="button"
      {...props}
    >
      {children}
    </ElementType>
  );
}) as <C extends React.ElementType = 'button'>(
  props: ThumbsUpButtonProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

/**
 * The thumbs down button component.
 */
export const ThumbsDownButton = forwardRef(function ThumbsDownButton<C extends React.ElementType = 'button'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<ThumbsDownButtonProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  // Use the 'as' prop or default to 'button'
  const ElementType: React.ElementType = as || 'button';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        ...style,
      }}
      type="button"
      {...props}
    >
      {children}
    </ElementType>
  );
}) as <C extends React.ElementType = 'button'>(
  props: ThumbsDownButtonProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

// Add displayNames for better debugging
(ThumbsRatingHeadless as any).displayName = 'ThumbsRatingHeadless';
(ThumbsUpButton as any).displayName = 'ThumbsUpButton';
(ThumbsDownButton as any).displayName = 'ThumbsDownButton';

// Create a compound component
export const ThumbsRating = Object.assign(ThumbsRatingHeadless, {
  ThumbsUp: ThumbsUpButton,
  ThumbsDown: ThumbsDownButton,
});

export default ThumbsRating;
