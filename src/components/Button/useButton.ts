import { useCallback, useState, useRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success' | 'warning' | 'info';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface UseButtonProps {
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
  /**
   * Whether the button is in loading state
   */
  loading?: boolean;
  /**
   * Callback when the button is clicked
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  /**
   * Type of the button
   */
  type?: 'button' | 'submit' | 'reset';
  /**
   * URL for link buttons
   */
  href?: string;
  /**
   * Target for link buttons
   */
  target?: string;
  /**
   * Rel attribute for link buttons
   */
  rel?: string;
  /**
   * Aria-label for accessibility
   */
  ariaLabel?: string;
}

export interface UseButtonReturn {
  /**
   * Props to be spread on the button element
   */
  buttonProps: {
    disabled: boolean;
    'aria-disabled': boolean;
    type?: 'button' | 'submit' | 'reset';
    onClick: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
    onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
    onKeyUp: (event: React.KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
    onFocus: (event: React.FocusEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
    onBlur: (event: React.FocusEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
    onMouseEnter: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
    onMouseLeave: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
    onMouseDown: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
    onMouseUp: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
    role: string;
    tabIndex: number;
    'aria-label'?: string;
    href?: string;
    target?: string;
    rel?: string;
    ref: React.RefObject<HTMLButtonElement | HTMLAnchorElement>;
  };
  /**
   * Whether the button is currently pressed
   */
  isPressed: boolean;
  /**
   * Whether the button is currently focused
   */
  isFocused: boolean;
  /**
   * Whether the button is currently hovered
   */
  isHovered: boolean;
  /**
   * Whether the button is currently loading
   */
  isLoading: boolean;
  /**
   * Whether the button is disabled
   */
  isDisabled: boolean;
  /**
   * Ref to the button element
   */
  buttonRef: React.RefObject<HTMLButtonElement | HTMLAnchorElement>;
}

/**
 * Hook for creating accessible button components.
 * Provides all the necessary props and state for creating a button component.
 * 
 * @example
 * ```jsx
 * const MyButton = ({ onClick, disabled, children }) => {
 *   const { buttonProps, isPressed, isHovered, isLoading } = useButton({
 *     onClick,
 *     disabled
 *   });
 *   
 *   return (
 *     <button {...buttonProps} className={`my-button ${isPressed ? 'pressed' : ''}`}>
 *       {isLoading ? 'Loading...' : children}
 *     </button>
 *   );
 * };
 * ```
 */
export function useButton({
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  href,
  target,
  rel,
  ariaLabel,
}: UseButtonProps = {}): UseButtonReturn {
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  
  const isDisabled = disabled || loading;
  
  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (isDisabled) {
      event.preventDefault();
      return;
    }
    
    onClick?.(event);
  }, [isDisabled, onClick]);
  
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (isDisabled) return;
    
    if (event.key === ' ' || event.key === 'Enter') {
      setIsPressed(true);
      
      // For space key, prevent page scrolling
      if (event.key === ' ') {
        event.preventDefault();
      }
    }
  }, [isDisabled]);
  
  const handleKeyUp = useCallback((event: React.KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (isDisabled) return;
    
    if (event.key === ' ' || event.key === 'Enter') {
      setIsPressed(false);
      
      // Trigger click on keyup for space and enter
      if (buttonRef.current) {
        buttonRef.current.click();
      }
    }
  }, [isDisabled]);
  
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);
  
  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setIsPressed(false);
  }, []);
  
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setIsPressed(false);
  }, []);
  
  const handleMouseDown = useCallback(() => {
    if (!isDisabled) {
      setIsPressed(true);
    }
  }, [isDisabled]);
  
  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
  }, []);
  
  return {
    buttonProps: {
      disabled: isDisabled,
      'aria-disabled': isDisabled,
      type: href ? undefined : type,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      role: href ? 'link' : 'button',
      tabIndex: isDisabled ? -1 : 0,
      'aria-label': ariaLabel,
      href,
      target,
      rel,
      ref: buttonRef,
    },
    isPressed,
    isFocused,
    isHovered,
    isLoading: loading,
    isDisabled,
    buttonRef,
  };
}
