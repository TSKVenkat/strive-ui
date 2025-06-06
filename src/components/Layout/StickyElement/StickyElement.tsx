import React, { forwardRef, useState, useRef, useEffect } from 'react';

export type StickyPosition = 'top' | 'bottom';
export type StickyOffset = number | string;
export type StickyZIndex = number;

export interface StickyElementProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content to render in the sticky element
   */
  children: React.ReactNode;
  
  /**
   * Whether the element should be sticky
   * @default true
   */
  enabled?: boolean;
  
  /**
   * The position to stick to
   * @default 'top'
   */
  position?: StickyPosition;
  
  /**
   * The offset from the position
   * @default 0
   */
  offset?: StickyOffset;
  
  /**
   * The z-index of the sticky element
   * @default 100
   */
  zIndex?: StickyZIndex;
  
  /**
   * Whether to add a shadow when the element is sticky
   * @default false
   */
  stickyOnShadow?: boolean;
  
  /**
   * The shadow color
   * @default 'rgba(0, 0, 0, 0.1)'
   */
  shadowColor?: string;
  
  /**
   * Whether to add a border when the element is sticky
   * @default false
   */
  stickyOnBorder?: boolean;
  
  /**
   * The border color
   * @default '#e0e0e0'
   */
  borderColor?: string;
  
  /**
   * Whether to add a background color when the element is sticky
   * @default false
   */
  stickyOnBackground?: boolean;
  
  /**
   * The background color
   * @default '#ffffff'
   */
  backgroundColor?: string;
  
  /**
   * Whether to add a transition effect
   * @default true
   */
  transition?: boolean;
  
  /**
   * The transition duration in milliseconds
   * @default 200
   */
  transitionDuration?: number;
  
  /**
   * The container element to use as the boundary for the sticky behavior
   * If not provided, the viewport will be used
   */
  containerRef?: React.RefObject<HTMLElement>;
  
  /**
   * Callback when the element becomes sticky
   */
  onStick?: (isSticky: boolean) => void;
  
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
 * StickyElement component for creating elements that stick to a specific position when scrolling
 */
export const StickyElement = forwardRef<HTMLDivElement, StickyElementProps>(
  (
    {
      children,
      enabled = true,
      position = 'top',
      offset = 0,
      zIndex = 100,
      stickyOnShadow = false,
      shadowColor = 'rgba(0, 0, 0, 0.1)',
      stickyOnBorder = false,
      borderColor = '#e0e0e0',
      stickyOnBackground = false,
      backgroundColor = '#ffffff',
      transition = true,
      transitionDuration = 200,
      containerRef,
      onStick,
      as: Component = 'div',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    const [isSticky, setIsSticky] = useState(false);
    const [elementNode, setElementNode] = useState<HTMLDivElement | null>(null);
    const placeholderRef = useRef<HTMLDivElement>(null);
    
    // Convert offset to pixel value if it's a string
    const getOffsetValue = () => {
      if (typeof offset === 'number') {
        return `${offset}px`;
      }
      return offset;
    };
    
    useEffect(() => {
      if (!enabled || !elementNode || !placeholderRef.current) return;
      
      const element = elementNode;
      const placeholder = placeholderRef.current;
      const container = containerRef?.current;
      
      // Get the initial position of the element
      const elementRect = element.getBoundingClientRect();
      const placeholderRect = placeholder.getBoundingClientRect();
      
      // Set the placeholder height to match the element
      placeholder.style.height = `${elementRect.height}px`;
      placeholder.style.width = `${elementRect.width}px`;
      
      const handleScroll = () => {
        const containerTop = container 
          ? container.getBoundingClientRect().top 
          : 0;
        
        const containerBottom = container 
          ? container.getBoundingClientRect().bottom 
          : window.innerHeight;
        
        const placeholderRect = placeholder.getBoundingClientRect();
        
        if (position === 'top') {
          const offsetValue = typeof offset === 'number' ? offset : parseInt(offset, 10) || 0;
          const isNowSticky = placeholderRect.top <= containerTop + offsetValue;
          
          if (isNowSticky !== isSticky) {
            setIsSticky(isNowSticky);
            if (onStick) {
              onStick(isNowSticky);
            }
          }
        } else if (position === 'bottom') {
          const offsetValue = typeof offset === 'number' ? offset : parseInt(offset, 10) || 0;
          const isNowSticky = placeholderRect.bottom >= containerBottom - offsetValue;
          
          if (isNowSticky !== isSticky) {
            setIsSticky(isNowSticky);
            if (onStick) {
              onStick(isNowSticky);
            }
          }
        }
      };
      
      // Add scroll event listener
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleScroll, { passive: true });
      
      // Initial check
      handleScroll();
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      };
    }, [enabled, position, offset, containerRef, isSticky, onStick, elementNode]);
    
    // Build the sticky style
    const stickyStyle: React.CSSProperties = {
      position: isSticky ? 'fixed' : 'relative',
      [position]: isSticky ? getOffsetValue() : 'auto',
      zIndex: isSticky ? zIndex : 'auto',
      width: isSticky && placeholderRef.current ? `${placeholderRef.current.offsetWidth}px` : '100%',
      ...(isSticky && stickyOnShadow && {
        boxShadow: position === 'top' 
          ? `0 4px 6px -1px ${shadowColor}` 
          : `0 -4px 6px -1px ${shadowColor}`,
      }),
      ...(isSticky && stickyOnBorder && {
        borderBottom: position === 'top' ? `1px solid ${borderColor}` : 'none',
        borderTop: position === 'bottom' ? `1px solid ${borderColor}` : 'none',
      }),
      ...(isSticky && stickyOnBackground && {
        backgroundColor,
      }),
      ...(transition && {
        transition: `box-shadow ${transitionDuration}ms ease, border ${transitionDuration}ms ease, background-color ${transitionDuration}ms ease`,
      }),
      ...style,
    };
    
    return (
      <>
        <div ref={placeholderRef} style={{ display: isSticky ? 'block' : 'none' }} />
        <Component
          ref={(node) => {
            // Handle both the forwardRef and the local ref
            if (ref) {
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref && 'current' in ref) {
                (ref as React.MutableRefObject<any>).current = node;
              }
            }
            setElementNode(node);
          }}
          className={`strive-sticky-element ${isSticky ? 'sticky' : ''} ${className}`}
          style={stickyStyle}
          {...rest}
        >
          {children}
        </Component>
      </>
    );
  }
);

StickyElement.displayName = 'StickyElement';
