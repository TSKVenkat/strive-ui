import React, { useState, useRef, useEffect, cloneElement, ReactElement } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { createPortal } from 'react-dom';
import { useThemeContext } from '../../styles/ThemeProvider';
import { transitions } from '../../animations';

export type TooltipPlacement = 
  | 'top' 
  | 'top-start' 
  | 'top-end' 
  | 'right' 
  | 'right-start' 
  | 'right-end' 
  | 'bottom' 
  | 'bottom-start' 
  | 'bottom-end' 
  | 'left' 
  | 'left-start' 
  | 'left-end';

export type TooltipTrigger = 'hover' | 'click' | 'focus' | 'manual';

export type TooltipSize = 'sm' | 'md' | 'lg';

export type TooltipVariant = 'light' | 'dark' | 'colored';

export interface TooltipProps {
  /**
   * The content to display in the tooltip
   */
  content: React.ReactNode;
  
  /**
   * The element that triggers the tooltip
   */
  children: ReactElement;
  
  /**
   * The placement of the tooltip relative to the trigger element
   * @default 'top'
   */
  placement?: TooltipPlacement;
  
  /**
   * The event that triggers the tooltip
   * @default 'hover'
   */
  trigger?: TooltipTrigger | TooltipTrigger[];
  
  /**
   * Whether the tooltip is open (controlled mode)
   */
  isOpen?: boolean;
  
  /**
   * Default open state (uncontrolled mode)
   * @default false
   */
  defaultOpen?: boolean;
  
  /**
   * Callback when the tooltip opens
   */
  onOpen?: () => void;
  
  /**
   * Callback when the tooltip closes
   */
  onClose?: () => void;
  
  /**
   * Delay before showing the tooltip (in ms)
   * @default 200
   */
  openDelay?: number;
  
  /**
   * Delay before hiding the tooltip (in ms)
   * @default 0
   */
  closeDelay?: number;
  
  /**
   * Whether to show an arrow pointing to the trigger element
   * @default true
   */
  hasArrow?: boolean;
  
  /**
   * Whether the tooltip should follow the cursor
   * @default false
   */
  followCursor?: boolean;
  
  /**
   * Offset from the trigger element (in px)
   * @default 8
   */
  offset?: number;
  
  /**
   * The size of the tooltip
   * @default 'md'
   */
  size?: TooltipSize;
  
  /**
   * The variant of the tooltip
   * @default 'dark'
   */
  variant?: TooltipVariant;
  
  /**
   * Maximum width of the tooltip (in px)
   * @default 320
   */
  maxWidth?: number | string;
  
  /**
   * Whether the tooltip should be interactive (can be hovered/clicked)
   * @default false
   */
  interactive?: boolean;
  
  /**
   * Custom z-index for the tooltip
   */
  zIndex?: number;
  
  /**
   * Custom class name for the tooltip
   */
  className?: string;
  
  /**
   * ID for the tooltip
   */
  id?: string;
  
  /**
   * Whether to disable the tooltip
   * @default false
   */
  isDisabled?: boolean;
  
  /**
   * Animation duration in ms
   * @default 200
   */
  animationDuration?: number;
  
  /**
   * Custom animation for the tooltip
   */
  animation?: 'fade' | 'scale' | 'shift' | 'none';
}

interface TooltipPosition {
  top: number;
  left: number;
}

interface ArrowPosition {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const getAnimationByPlacement = (placement: TooltipPlacement) => {
  const placementToAnimation: Record<TooltipPlacement, ReturnType<typeof keyframes>> = {
    'top': keyframes`
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    `,
    'top-start': keyframes`
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    `,
    'top-end': keyframes`
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    `,
    'bottom': keyframes`
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    `,
    'bottom-start': keyframes`
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    `,
    'bottom-end': keyframes`
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    `,
    'left': keyframes`
      from { opacity: 0; transform: translateX(10px); }
      to { opacity: 1; transform: translateX(0); }
    `,
    'left-start': keyframes`
      from { opacity: 0; transform: translateX(10px); }
      to { opacity: 1; transform: translateX(0); }
    `,
    'left-end': keyframes`
      from { opacity: 0; transform: translateX(10px); }
      to { opacity: 1; transform: translateX(0); }
    `,
    'right': keyframes`
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    `,
    'right-start': keyframes`
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    `,
    'right-end': keyframes`
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    `,
  };
  
  return placementToAnimation[placement];
};

// Styled components
const TooltipContainer = styled.div<{
  $position: TooltipPosition;
  $placement: TooltipPlacement;
  $animation: 'fade' | 'scale' | 'shift' | 'none';
  $animationDuration: number;
  $zIndex?: number;
  $maxWidth: number | string;
  $variant: TooltipVariant;
  $size: TooltipSize;
  $interactive: boolean;
}>`
  position: fixed;
  top: ${props => props.$position.top}px;
  left: ${props => props.$position.left}px;
  z-index: ${props => props.$zIndex || props.theme.zIndex[50]};
  max-width: ${props => typeof props.$maxWidth === 'number' ? `${props.$maxWidth}px` : props.$maxWidth};
  pointer-events: ${props => props.$interactive ? 'auto' : 'none'};
  
  ${props => {
    // Animation based on selected type
    if (props.$animation === 'none') return '';
    
    if (props.$animation === 'fade') {
      return css`
        animation: ${fadeIn} ${props.$animationDuration}ms ${props.theme.animation.easing.easeOut} forwards;
      `;
    }
    
    if (props.$animation === 'scale') {
      return css`
        animation: ${scaleIn} ${props.$animationDuration}ms ${props.theme.animation.easing.easeOut} forwards;
      `;
    }
    
    if (props.$animation === 'shift') {
      return css`
        animation: ${getAnimationByPlacement(props.$placement)} ${props.$animationDuration}ms ${props.theme.animation.easing.easeOut} forwards;
      `;
    }
    
    return '';
  }}
`;

const TooltipContent = styled.div<{
  $variant: TooltipVariant;
  $size: TooltipSize;
  $hasArrow: boolean;
  $placement: TooltipPlacement;
}>`
  padding: ${props => {
    switch (props.$size) {
      case 'sm': return '0.25rem 0.5rem';
      case 'lg': return '0.75rem 1rem';
      default: return '0.5rem 0.75rem';
    }
  }};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => {
    switch (props.$size) {
      case 'sm': return props.theme.typography.fontSize.xs;
      case 'lg': return props.theme.typography.fontSize.md;
      default: return props.theme.typography.fontSize.sm;
    }
  }};
  line-height: 1.5;
  
  ${props => {
    switch (props.$variant) {
      case 'light':
        return css`
          background-color: ${props.theme.colors.background.paper};
          color: ${props.theme.colors.text.primary};
          box-shadow: ${props.theme.shadows.md};
          border: 1px solid ${props.theme.colors.neutral[300]};
        `;
      case 'colored':
        return css`
          background-color: ${props.theme.colors.primary[600]};
          color: #ffffff;
          box-shadow: ${props.theme.shadows.md};
        `;
      case 'dark':
      default:
        return css`
          background-color: ${props.theme.colors.neutral[800]};
          color: #ffffff;
          box-shadow: ${props.theme.shadows.md};
        `;
    }
  }}
  
  ${props => props.$hasArrow && css`
    margin: ${
      props.$placement.startsWith('top') ? '0 0 8px 0' :
      props.$placement.startsWith('bottom') ? '8px 0 0 0' :
      props.$placement.startsWith('left') ? '0 8px 0 0' :
      '0 0 0 8px'
    };
  `}
`;

const Arrow = styled.div<{
  $position: ArrowPosition;
  $variant: TooltipVariant;
  $placement: TooltipPlacement;
}>`
  position: absolute;
  width: 8px;
  height: 8px;
  transform: rotate(45deg);
  
  ${props => {
    if (props.$placement.startsWith('top')) {
      return css`
        bottom: -4px;
        left: ${props.$position.left}px;
      `;
    }
    if (props.$placement.startsWith('bottom')) {
      return css`
        top: -4px;
        left: ${props.$position.left}px;
      `;
    }
    if (props.$placement.startsWith('left')) {
      return css`
        right: -4px;
        top: ${props.$position.top}px;
      `;
    }
    if (props.$placement.startsWith('right')) {
      return css`
        left: -4px;
        top: ${props.$position.top}px;
      `;
    }
    return '';
  }}
  
  ${props => {
    switch (props.$variant) {
      case 'light':
        return css`
          background-color: ${props.theme.colors.background.paper};
          border: 1px solid ${props.theme.colors.neutral[300]};
          border-top: ${props.$placement.startsWith('bottom') ? '1px solid' : 'none'};
          border-left: ${props.$placement.startsWith('right') ? '1px solid' : 'none'};
          border-right: ${props.$placement.startsWith('left') ? 'none' : '1px solid'};
          border-bottom: ${props.$placement.startsWith('top') ? 'none' : '1px solid'};
          border-color: ${props.theme.colors.neutral[300]};
        `;
      case 'colored':
        return css`
          background-color: ${props.theme.colors.primary[600]};
        `;
      case 'dark':
      default:
        return css`
          background-color: ${props.theme.colors.neutral[800]};
        `;
    }
  }}
`;

/**
 * Tooltip component for displaying additional information when hovering over an element
 * 
 * @example
 * ```jsx
 * <Tooltip content="This is a tooltip">
 *   <Button>Hover me</Button>
 * </Tooltip>
 * ```
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  trigger = 'hover',
  isOpen: controlledIsOpen,
  defaultOpen = false,
  onOpen,
  onClose,
  openDelay = 200,
  closeDelay = 0,
  hasArrow = true,
  followCursor = false,
  offset = 8,
  size = 'md',
  variant = 'dark',
  maxWidth = 320,
  interactive = false,
  zIndex,
  className,
  id,
  isDisabled = false,
  animationDuration = 200,
  animation = 'shift',
}) => {
  // Get theme context
  const { theme } = useThemeContext();
  
  // State for tooltip visibility
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [position, setPosition] = useState<TooltipPosition>({ top: 0, left: 0 });
  const [arrowPosition, setArrowPosition] = useState<ArrowPosition>({});
  
  // Refs
  const triggerRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const openTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Normalize trigger to array
  const triggers = Array.isArray(trigger) ? trigger : [trigger];
  
  // Use controlled or uncontrolled state
  const isVisible = controlledIsOpen !== undefined ? controlledIsOpen : isOpen;
  
  // Calculate tooltip position
  const calculatePosition = (event?: MouseEvent) => {
    if (!triggerRef.current) return;
    
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipWidth = tooltipRef.current?.offsetWidth || 200;
    const tooltipHeight = tooltipRef.current?.offsetHeight || 40;
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    
    let top = 0;
    let left = 0;
    
    // If followCursor is true and we have an event, position relative to cursor
    if (followCursor && event) {
      const cursorOffset = 15; // Offset from cursor
      
      if (placement.startsWith('top')) {
        top = event.clientY - tooltipHeight - cursorOffset;
        left = event.clientX - tooltipWidth / 2;
      } else if (placement.startsWith('bottom')) {
        top = event.clientY + cursorOffset;
        left = event.clientX - tooltipWidth / 2;
      } else if (placement.startsWith('left')) {
        top = event.clientY - tooltipHeight / 2;
        left = event.clientX - tooltipWidth - cursorOffset;
      } else if (placement.startsWith('right')) {
        top = event.clientY - tooltipHeight / 2;
        left = event.clientX + cursorOffset;
      }
    } else {
      // Position relative to trigger element
      if (placement.startsWith('top')) {
        top = triggerRect.top - tooltipHeight - offset;
        
        if (placement === 'top') {
          left = triggerRect.left + (triggerRect.width - tooltipWidth) / 2;
        } else if (placement === 'top-start') {
          left = triggerRect.left;
        } else if (placement === 'top-end') {
          left = triggerRect.right - tooltipWidth;
        }
      } else if (placement.startsWith('bottom')) {
        top = triggerRect.bottom + offset;
        
        if (placement === 'bottom') {
          left = triggerRect.left + (triggerRect.width - tooltipWidth) / 2;
        } else if (placement === 'bottom-start') {
          left = triggerRect.left;
        } else if (placement === 'bottom-end') {
          left = triggerRect.right - tooltipWidth;
        }
      } else if (placement.startsWith('left')) {
        left = triggerRect.left - tooltipWidth - offset;
        
        if (placement === 'left') {
          top = triggerRect.top + (triggerRect.height - tooltipHeight) / 2;
        } else if (placement === 'left-start') {
          top = triggerRect.top;
        } else if (placement === 'left-end') {
          top = triggerRect.bottom - tooltipHeight;
        }
      } else if (placement.startsWith('right')) {
        left = triggerRect.right + offset;
        
        if (placement === 'right') {
          top = triggerRect.top + (triggerRect.height - tooltipHeight) / 2;
        } else if (placement === 'right-start') {
          top = triggerRect.top;
        } else if (placement === 'right-end') {
          top = triggerRect.bottom - tooltipHeight;
        }
      }
    }
    
    // Calculate arrow position
    const newArrowPosition: ArrowPosition = {};
    
    if (placement.startsWith('top')) {
      newArrowPosition.left = tooltipWidth / 2 - 4;
    } else if (placement.startsWith('bottom')) {
      newArrowPosition.left = tooltipWidth / 2 - 4;
    } else if (placement.startsWith('left')) {
      newArrowPosition.top = tooltipHeight / 2 - 4;
    } else if (placement.startsWith('right')) {
      newArrowPosition.top = tooltipHeight / 2 - 4;
    }
    
    // Boundary detection and adjustment
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Adjust horizontal position if tooltip goes outside viewport
    if (left < 0) {
      left = 0;
    } else if (left + tooltipWidth > viewportWidth) {
      left = viewportWidth - tooltipWidth;
    }
    
    // Adjust vertical position if tooltip goes outside viewport
    if (top < 0) {
      top = 0;
    } else if (top + tooltipHeight > viewportHeight) {
      top = viewportHeight - tooltipHeight;
    }
    
    setPosition({ top, left });
    setArrowPosition(newArrowPosition);
  };
  
  // Handle opening the tooltip
  const handleOpen = (event?: MouseEvent) => {
    if (isDisabled) return;
    
    // Clear any existing timeouts
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
    }
    
    openTimeoutRef.current = setTimeout(() => {
      if (controlledIsOpen === undefined) {
        setIsOpen(true);
      }
      
      calculatePosition(event);
      onOpen?.();
    }, openDelay);
  };
  
  // Handle closing the tooltip
  const handleClose = () => {
    if (isDisabled) return;
    
    // Clear any existing timeouts
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
    
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    
    closeTimeoutRef.current = setTimeout(() => {
      if (controlledIsOpen === undefined) {
        setIsOpen(false);
      }
      
      onClose?.();
    }, closeDelay);
  };
  
  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isVisible &&
        interactive &&
        tooltipRef.current &&
        triggerRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, interactive]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (isVisible) {
        calculatePosition();
      }
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [isVisible]);
  
  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (openTimeoutRef.current) {
        clearTimeout(openTimeoutRef.current);
      }
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);
  
  // Create event props based on trigger type
  const triggerProps: Record<string, any> = {};
  
  if (triggers.includes('hover')) {
    triggerProps.onMouseEnter = handleOpen;
    triggerProps.onMouseLeave = handleClose;
  }
  
  if (triggers.includes('focus')) {
    triggerProps.onFocus = handleOpen;
    triggerProps.onBlur = handleClose;
  }
  
  if (triggers.includes('click')) {
    triggerProps.onClick = (e: React.MouseEvent) => {
      e.preventDefault();
      if (isVisible) {
        handleClose();
      } else {
        handleOpen();
      }
    };
  }
  
  // Handle mouse move for followCursor
  useEffect(() => {
    if (followCursor && isVisible) {
      const handleMouseMove = (event: MouseEvent) => {
        calculatePosition(event);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [followCursor, isVisible]);
  
  // Clone the child element to add event handlers and ref
  const triggerElement = cloneElement(children, {
    ...triggerProps,
    ref: (node: HTMLElement) => {
      // Store the node in our ref
      triggerRef.current = node;
    },
    'aria-describedby': isVisible ? id : undefined,
  });
  
  // Create portal for tooltip
  const tooltipPortal = isVisible && createPortal(
    <TooltipContainer
      ref={tooltipRef}
      $position={position}
      $placement={placement}
      $animation={animation}
      $animationDuration={animationDuration}
      $zIndex={zIndex}
      $maxWidth={maxWidth}
      $variant={variant}
      $size={size}
      $interactive={interactive}
      className={className}
      id={id}
      role="tooltip"
      aria-hidden={!isVisible}
    >
      {hasArrow && (
        <Arrow
          $position={arrowPosition}
          $variant={variant}
          $placement={placement}
        />
      )}
      <TooltipContent
        $variant={variant}
        $size={size}
        $hasArrow={hasArrow}
        $placement={placement}
      >
        {content}
      </TooltipContent>
    </TooltipContainer>,
    document.body
  );
  
  return (
    <>
      {triggerElement}
      {tooltipPortal}
    </>
  );
};
