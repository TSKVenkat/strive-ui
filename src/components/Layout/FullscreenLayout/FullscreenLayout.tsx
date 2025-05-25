import React, { forwardRef, useState, useEffect, useCallback } from 'react';

export type FullscreenTrigger = 'manual' | 'hover' | 'click' | 'doubleClick';
export type FullscreenExitMethod = 'button' | 'escape' | 'both';

export interface FullscreenLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content to render in the fullscreen layout
   */
  children: React.ReactNode;
  
  /**
   * Whether the component is in fullscreen mode
   * @default false
   */
  fullscreen?: boolean;
  
  /**
   * The method to trigger fullscreen mode
   * @default 'manual'
   */
  trigger?: FullscreenTrigger;
  
  /**
   * The method to exit fullscreen mode
   * @default 'both'
   */
  exitMethod?: FullscreenExitMethod;
  
  /**
   * Whether to show the exit button
   * @default true
   */
  showExitButton?: boolean;
  
  /**
   * The position of the exit button
   * @default 'top-right'
   */
  exitButtonPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  
  /**
   * Custom icon for the exit button
   */
  exitButtonIcon?: React.ReactNode;
  
  /**
   * The background color in fullscreen mode
   * @default '#ffffff'
   */
  backgroundColor?: string;
  
  /**
   * The z-index in fullscreen mode
   * @default 9999
   */
  zIndex?: number;
  
  /**
   * Whether to lock scroll when in fullscreen mode
   * @default true
   */
  lockScroll?: boolean;
  
  /**
   * Whether to add a transition effect
   * @default true
   */
  transition?: boolean;
  
  /**
   * The transition duration in milliseconds
   * @default 300
   */
  transitionDuration?: number;
  
  /**
   * Callback when entering fullscreen mode
   */
  onEnterFullscreen?: () => void;
  
  /**
   * Callback when exiting fullscreen mode
   */
  onExitFullscreen?: () => void;
  
  /**
   * The component used for the root node
   * @default 'div'
   */
  as?: React.ElementType;
  
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * FullscreenLayout component for displaying content in fullscreen mode
 */
export const FullscreenLayout = forwardRef<HTMLDivElement, FullscreenLayoutProps>(
  (
    {
      children,
      fullscreen: externalFullscreen,
      trigger = 'manual',
      exitMethod = 'both',
      showExitButton = true,
      exitButtonPosition = 'top-right',
      exitButtonIcon,
      backgroundColor = '#ffffff',
      zIndex = 9999,
      lockScroll = true,
      transition = true,
      transitionDuration = 300,
      onEnterFullscreen,
      onExitFullscreen,
      as: Component = 'div',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    // Use internal state if component is uncontrolled
    const [internalFullscreen, setInternalFullscreen] = useState(false);
    
    // Determine if component is controlled or uncontrolled
    const isControlled = externalFullscreen !== undefined;
    const isFullscreen = isControlled ? externalFullscreen : internalFullscreen;
    
    // Handle entering fullscreen mode
    const enterFullscreen = useCallback(() => {
      if (!isControlled) {
        setInternalFullscreen(true);
      }
      
      if (onEnterFullscreen) {
        onEnterFullscreen();
      }
      
      // Lock scroll if needed
      if (lockScroll) {
        document.body.style.overflow = 'hidden';
      }
    }, [isControlled, onEnterFullscreen, lockScroll]);
    
    // Handle exiting fullscreen mode
    const exitFullscreen = useCallback(() => {
      if (!isControlled) {
        setInternalFullscreen(false);
      }
      
      if (onExitFullscreen) {
        onExitFullscreen();
      }
      
      // Unlock scroll
      if (lockScroll) {
        document.body.style.overflow = '';
      }
    }, [isControlled, onExitFullscreen, lockScroll]);
    
    // Handle escape key press
    useEffect(() => {
      if (!isFullscreen || exitMethod === 'button') return;
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          exitFullscreen();
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [isFullscreen, exitMethod, exitFullscreen]);
    
    // Clean up when component unmounts
    useEffect(() => {
      return () => {
        if (lockScroll && isFullscreen) {
          document.body.style.overflow = '';
        }
      };
    }, [lockScroll, isFullscreen]);
    
    // Handle trigger events
    const handleTrigger = (event: React.MouseEvent<HTMLDivElement>) => {
      if (isFullscreen) return;
      
      if (
        (trigger === 'click' && event.type === 'click') ||
        (trigger === 'doubleClick' && event.type === 'dblclick')
      ) {
        enterFullscreen();
      }
    };
    
    // Handle mouse events for hover trigger
    const handleMouseEnter = () => {
      if (trigger === 'hover' && !isFullscreen) {
        enterFullscreen();
      }
    };
    
    const handleMouseLeave = () => {
      if (trigger === 'hover' && isFullscreen) {
        exitFullscreen();
      }
    };
    
    // Build the container style
    const containerStyle: React.CSSProperties = {
      position: isFullscreen ? 'fixed' : 'relative',
      top: isFullscreen ? 0 : undefined,
      left: isFullscreen ? 0 : undefined,
      right: isFullscreen ? 0 : undefined,
      bottom: isFullscreen ? 0 : undefined,
      width: isFullscreen ? '100%' : undefined,
      height: isFullscreen ? '100%' : undefined,
      backgroundColor: isFullscreen ? backgroundColor : undefined,
      zIndex: isFullscreen ? zIndex : undefined,
      overflow: isFullscreen ? 'auto' : undefined,
      ...(transition && {
        transition: `all ${transitionDuration}ms ease`,
      }),
      ...style,
    };
    
    // Build the exit button style
    const exitButtonStyle: React.CSSProperties = {
      position: 'absolute',
      ...(exitButtonPosition === 'top-right' && { top: '1rem', right: '1rem' }),
      ...(exitButtonPosition === 'top-left' && { top: '1rem', left: '1rem' }),
      ...(exitButtonPosition === 'bottom-right' && { bottom: '1rem', right: '1rem' }),
      ...(exitButtonPosition === 'bottom-left' && { bottom: '1rem', left: '1rem' }),
      padding: '0.5rem',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '2.5rem',
      height: '2.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      zIndex: zIndex + 1,
      transition: 'background-color 0.2s ease',
    };
    
    // Default exit button icon
    const defaultExitIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    );
    
    return (
      <Component
        ref={ref}
        className={`strive-fullscreen-layout ${isFullscreen ? 'fullscreen' : ''} ${className}`}
        style={containerStyle}
        onClick={handleTrigger}
        onDoubleClick={handleTrigger}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...rest}
      >
        {children}
        
        {isFullscreen && showExitButton && (
          <button
            className="strive-fullscreen-exit-button"
            style={exitButtonStyle}
            onClick={exitFullscreen}
            aria-label="Exit fullscreen"
          >
            {exitButtonIcon || defaultExitIcon}
          </button>
        )}
      </Component>
    );
  }
);

FullscreenLayout.displayName = 'FullscreenLayout';
