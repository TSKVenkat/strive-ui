import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled, { css, keyframes } from 'styled-components';
import { useThemeContext } from '../../styles/ThemeProvider';
import { Icon } from '../Icon';
import { transitions } from '../../animations';

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface DrawerProps {
  /**
   * Whether the drawer is open
   */
  isOpen: boolean;
  
  /**
   * Callback when the drawer is closed
   */
  onClose: () => void;
  
  /**
   * The placement of the drawer
   * @default 'right'
   */
  placement?: DrawerPlacement;
  
  /**
   * The size of the drawer
   * @default 'md'
   */
  size?: DrawerSize;
  
  /**
   * The title of the drawer
   */
  title?: React.ReactNode;
  
  /**
   * The content of the drawer
   */
  children: React.ReactNode;
  
  /**
   * Whether to show a close button
   * @default true
   */
  hasCloseButton?: boolean;
  
  /**
   * Whether to close the drawer when clicking outside
   * @default true
   */
  closeOnOutsideClick?: boolean;
  
  /**
   * Whether to close the drawer when pressing escape
   * @default true
   */
  closeOnEsc?: boolean;
  
  /**
   * Whether to show a backdrop
   * @default true
   */
  hasBackdrop?: boolean;
  
  /**
   * The z-index of the drawer
   * @default 1000
   */
  zIndex?: number;
  
  /**
   * Whether the drawer has a border
   * @default false
   */
  hasBorder?: boolean;
  
  /**
   * Whether the drawer is elevated
   * @default true
   */
  elevated?: boolean;
  
  /**
   * The elevation level
   * @default 'lg'
   */
  elevation?: 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Whether the drawer is rounded
   * @default false
   */
  rounded?: boolean;
  
  /**
   * The border radius
   * @default 'md'
   */
  radius?: 'sm' | 'md' | 'lg';
  
  /**
   * Custom header content
   */
  header?: React.ReactNode;
  
  /**
   * Custom footer content
   */
  footer?: React.ReactNode;
  
  /**
   * Whether the drawer is fullscreen on mobile
   * @default false
   */
  fullScreenOnMobile?: boolean;
  
  /**
   * The breakpoint for mobile view
   * @default 768
   */
  mobileBreakpoint?: number;
  
  /**
   * Whether to trap focus within the drawer
   * @default true
   */
  trapFocus?: boolean;
  
  /**
   * Whether to lock scroll when the drawer is open
   * @default true
   */
  lockScroll?: boolean;
  
  /**
   * Animation duration in ms
   * @default 300
   */
  animationDuration?: number;
  
  /**
   * Custom class name for the drawer
   */
  className?: string;
  
  /**
   * Custom ID for the drawer
   */
  id?: string;
  
  /**
   * Whether the drawer is nested inside another drawer
   * @default false
   */
  isNested?: boolean;
  
  /**
   * Whether to render the drawer in a portal
   * @default true
   */
  usePortal?: boolean;
  
  /**
   * Custom styles for the drawer
   */
  style?: React.CSSProperties;
  
  /**
   * Whether the drawer is resizable
   * @default false
   */
  resizable?: boolean;
  
  /**
   * The minimum width/height of the drawer when resizable
   * @default 200
   */
  minSize?: number;
  
  /**
   * The maximum width/height of the drawer when resizable
   * @default 600
   */
  maxSize?: number;
  
  /**
   * Whether to show a backdrop blur effect
   * @default false
   */
  blurBackdrop?: boolean;
  
  /**
   * Whether to show a header
   * @default true
   */
  showHeader?: boolean;
  
  /**
   * Whether the drawer is scrollable
   * @default true
   */
  scrollable?: boolean;
  
  /**
   * Custom close button icon
   */
  closeIcon?: React.ReactNode;
  
  /**
   * Custom close button aria-label
   * @default 'Close drawer'
   */
  closeButtonAriaLabel?: string;
  
  /**
   * Whether to block scroll outside the drawer
   * @default true
   */
  blockScroll?: boolean;
  
  /**
   * Custom backdrop click handler
   */
  onBackdropClick?: () => void;
}

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const slideInLeft = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

const slideOutLeft = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
`;

const slideInRight = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const slideOutRight = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
`;

const slideInTop = keyframes`
  from { transform: translateY(-100%); }
  to { transform: translateY(0); }
`;

const slideOutTop = keyframes`
  from { transform: translateY(0); }
  to { transform: translateY(-100%); }
`;

const slideInBottom = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

const slideOutBottom = keyframes`
  from { transform: translateY(0); }
  to { transform: translateY(100%); }
`;

// Styled components
const DrawerBackdrop = styled.div<{
  $isOpen: boolean;
  $animationDuration: number;
  $zIndex: number;
  $blur: boolean;
}>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${props => props.$zIndex};
  animation: ${props => props.$isOpen ? fadeIn : fadeOut} ${props => props.$animationDuration}ms ${transitions.ease.ease} forwards;
  
  ${props => props.$blur && css`
    backdrop-filter: blur(4px);
  `}
`;

const DrawerContainer = styled.div<{
  $placement: DrawerPlacement;
  $size: DrawerSize;
  $isOpen: boolean;
  $animationDuration: number;
  $zIndex: number;
  $hasBorder: boolean;
  $elevated: boolean;
  $elevation: 'sm' | 'md' | 'lg' | 'xl';
  $rounded: boolean;
  $radius: 'sm' | 'md' | 'lg';
  $fullScreenOnMobile: boolean;
  $mobileBreakpoint: number;
  $isNested: boolean;
  $resizable: boolean;
}>`
  position: fixed;
  z-index: ${props => props.$zIndex + 1};
  background-color: ${props => props.theme.colors.background.paper};
  display: flex;
  flex-direction: column;
  
  ${props => {
    // Size styles
    const getSizeValue = (size: DrawerSize, placement: DrawerPlacement) => {
      const isHorizontal = placement === 'left' || placement === 'right';
      const sizeMap = {
        xs: isHorizontal ? '20%' : '20vh',
        sm: isHorizontal ? '30%' : '30vh',
        md: isHorizontal ? '40%' : '40vh',
        lg: isHorizontal ? '60%' : '60vh',
        xl: isHorizontal ? '80%' : '80vh',
        full: isHorizontal ? '100%' : '100vh',
      };
      
      return sizeMap[size];
    };
    
    // Placement styles
    const getPlacementStyles = () => {
      switch (props.$placement) {
        case 'left':
          return css`
            top: 0;
            left: 0;
            bottom: 0;
            width: ${getSizeValue(props.$size, 'left')};
            animation: ${props.$isOpen ? slideInLeft : slideOutLeft} ${props.$animationDuration}ms ${transitions.ease.ease} forwards;
          `;
        case 'right':
          return css`
            top: 0;
            right: 0;
            bottom: 0;
            width: ${getSizeValue(props.$size, 'right')};
            animation: ${props.$isOpen ? slideInRight : slideOutRight} ${props.$animationDuration}ms ${transitions.ease.ease} forwards;
          `;
        case 'top':
          return css`
            top: 0;
            left: 0;
            right: 0;
            height: ${getSizeValue(props.$size, 'top')};
            animation: ${props.$isOpen ? slideInTop : slideOutTop} ${props.$animationDuration}ms ${transitions.ease.ease} forwards;
          `;
        case 'bottom':
          return css`
            bottom: 0;
            left: 0;
            right: 0;
            height: ${getSizeValue(props.$size, 'bottom')};
            animation: ${props.$isOpen ? slideInBottom : slideOutBottom} ${props.$animationDuration}ms ${transitions.ease.ease} forwards;
          `;
        default:
          return '';
      }
    };
    
    return getPlacementStyles();
  }}
  
  ${props => props.$hasBorder && css`
    border: 1px solid ${props.theme.colors.neutral[200]};
  `}
  
  ${props => {
    // Elevation styles
    if (!props.$elevated) return '';
    
    const elevationMap = {
      sm: props.theme.shadows.sm,
      md: props.theme.shadows.md,
      lg: props.theme.shadows.lg,
      xl: props.theme.shadows.xl,
    };
    
    return css`
      box-shadow: ${elevationMap[props.$elevation]};
    `;
  }}
  
  ${props => {
    // Border radius styles
    if (!props.$rounded) return '';
    
    const radiusMap = {
      sm: props.theme.borderRadius.sm,
      md: props.theme.borderRadius.md,
      lg: props.theme.borderRadius.lg,
    };
    
    const radius = radiusMap[props.$radius];
    
    switch (props.$placement) {
      case 'left':
        return css`
          border-top-right-radius: ${radius};
          border-bottom-right-radius: ${radius};
        `;
      case 'right':
        return css`
          border-top-left-radius: ${radius};
          border-bottom-left-radius: ${radius};
        `;
      case 'top':
        return css`
          border-bottom-left-radius: ${radius};
          border-bottom-right-radius: ${radius};
        `;
      case 'bottom':
        return css`
          border-top-left-radius: ${radius};
          border-top-right-radius: ${radius};
        `;
      default:
        return '';
    }
  }}
  
  ${props => props.$fullScreenOnMobile && css`
    @media (max-width: ${props.$mobileBreakpoint}px) {
      width: 100%;
      height: 100%;
      border-radius: 0;
    }
  `}
  
  ${props => props.$isNested && css`
    position: absolute;
  `}
  
  ${props => props.$resizable && css`
    resize: ${props.$placement === 'left' ? 'horizontal' : 
             props.$placement === 'right' ? 'horizontal' :
             props.$placement === 'top' ? 'vertical' : 'vertical'};
    overflow: auto;
  `}
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.neutral[200]};
`;

const DrawerTitle = styled.div`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: ${props => props.theme.colors.text.secondary};
  border-radius: ${props => props.theme.borderRadius.full};
  transition: background-color 0.2s, color 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.neutral[100]};
    color: ${props => props.theme.colors.text.primary};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary[200]};
  }
`;

const DrawerContent = styled.div<{
  $scrollable: boolean;
}>`
  flex: 1;
  padding: 1rem;
  ${props => props.$scrollable && css`
    overflow-y: auto;
  `}
`;

const DrawerFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid ${props => props.theme.colors.neutral[200]};
`;

const ResizeHandle = styled.div<{
  $placement: DrawerPlacement;
}>`
  position: absolute;
  background-color: transparent;
  
  ${props => {
    switch (props.$placement) {
      case 'left':
        return css`
          top: 0;
          right: 0;
          width: 5px;
          height: 100%;
          cursor: ew-resize;
        `;
      case 'right':
        return css`
          top: 0;
          left: 0;
          width: 5px;
          height: 100%;
          cursor: ew-resize;
        `;
      case 'top':
        return css`
          bottom: 0;
          left: 0;
          height: 5px;
          width: 100%;
          cursor: ns-resize;
        `;
      case 'bottom':
        return css`
          top: 0;
          left: 0;
          height: 5px;
          width: 100%;
          cursor: ns-resize;
        `;
      default:
        return '';
    }
  }}
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[200]};
  }
`;

/**
 * Drawer component for displaying content that slides in from the edge of the screen
 * 
 * @example
 * ```jsx
 * <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Drawer Title">
 *   Drawer content
 * </Drawer>
 * ```
 */
export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  placement = 'right',
  size = 'md',
  title,
  children,
  hasCloseButton = true,
  closeOnOutsideClick = true,
  closeOnEsc = true,
  hasBackdrop = true,
  zIndex = 1000,
  hasBorder = false,
  elevated = true,
  elevation = 'lg',
  rounded = false,
  radius = 'md',
  header,
  footer,
  fullScreenOnMobile = false,
  mobileBreakpoint = 768,
  trapFocus = true,
  lockScroll = true,
  animationDuration = 300,
  className,
  id,
  isNested = false,
  usePortal = true,
  style,
  resizable = false,
  minSize = 200,
  maxSize = 600,
  blurBackdrop = false,
  showHeader = true,
  scrollable = true,
  closeIcon,
  closeButtonAriaLabel = 'Close drawer',
  blockScroll = true,
  onBackdropClick,
}) => {
  const { theme } = useThemeContext();
  const [isMounted, setIsMounted] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const startResizeRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  
  // Handle mounting/unmounting
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
    } else {
      const timer = setTimeout(() => {
        setIsMounted(false);
      }, animationDuration);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, animationDuration]);
  
  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeOnEsc, onClose]);
  
  // Handle scroll locking
  useEffect(() => {
    if (!blockScroll) return;
    
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      if (isOpen) {
        document.body.style.overflow = originalStyle;
      }
    };
  }, [isOpen, blockScroll]);
  
  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      if (onBackdropClick) {
        onBackdropClick();
      } else {
        onClose();
      }
    }
  };
  
  // Handle resizing
  const handleResizeStart = (e: React.MouseEvent) => {
    if (!resizable || !drawerRef.current) return;
    
    e.preventDefault();
    
    const rect = drawerRef.current.getBoundingClientRect();
    startResizeRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: rect.width,
      height: rect.height,
    };
    
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };
  
  const handleResizeMove = (e: MouseEvent) => {
    if (!resizable || !drawerRef.current || !startResizeRef.current) return;
    
    const { x, y, width, height } = startResizeRef.current;
    
    if (placement === 'left' || placement === 'right') {
      const newWidth = placement === 'left'
        ? width + (e.clientX - x)
        : width - (e.clientX - x);
      
      if (newWidth >= minSize && newWidth <= maxSize) {
        drawerRef.current.style.width = `${newWidth}px`;
      }
    } else {
      const newHeight = placement === 'top'
        ? height + (e.clientY - y)
        : height - (e.clientY - y);
      
      if (newHeight >= minSize && newHeight <= maxSize) {
        drawerRef.current.style.height = `${newHeight}px`;
      }
    }
  };
  
  const handleResizeEnd = () => {
    startResizeRef.current = null;
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  };
  
  // Don't render anything if not mounted
  if (!isMounted && !isOpen) {
    return null;
  }
  
  const drawerContent = (
    <>
      {hasBackdrop && (
        <DrawerBackdrop
          $isOpen={isOpen}
          $animationDuration={animationDuration}
          $zIndex={zIndex}
          $blur={blurBackdrop}
          onClick={handleBackdropClick}
          data-testid="drawer-backdrop"
        />
      )}
      
      <DrawerContainer
          ref={drawerRef}
          $placement={placement}
          $size={size}
          $isOpen={isOpen}
          $animationDuration={animationDuration}
          $zIndex={zIndex}
          $hasBorder={hasBorder}
          $elevated={elevated}
          $elevation={elevation}
          $rounded={rounded}
          $radius={radius}
          $fullScreenOnMobile={fullScreenOnMobile}
          $mobileBreakpoint={mobileBreakpoint}
          $isNested={isNested}
          $resizable={resizable}
          className={className}
          id={id}
          style={style}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'drawer-title' : undefined}
          data-testid="drawer"
        >
          {showHeader && (header || title) && (
            <DrawerHeader data-testid="drawer-header">
              {header || (
                <>
                  <DrawerTitle id="drawer-title">{title}</DrawerTitle>
                  {hasCloseButton && (
                    <CloseButton
                      onClick={onClose}
                      aria-label={closeButtonAriaLabel}
                      data-testid="drawer-close-button"
                    >
                      {closeIcon || <Icon name="X" />}
                    </CloseButton>
                  )}
                </>
              )}
            </DrawerHeader>
          )}
          
          <DrawerContent $scrollable={scrollable} data-testid="drawer-content">
            {children}
          </DrawerContent>
          
          {footer && (
            <DrawerFooter data-testid="drawer-footer">
              {footer}
            </DrawerFooter>
          )}
          
          {resizable && (
            <ResizeHandle
              $placement={placement}
              onMouseDown={handleResizeStart}
              data-testid="drawer-resize-handle"
            />
          )}
        </DrawerContainer>
    </>
  );
  
  return usePortal
    ? createPortal(drawerContent, document.body)
    : drawerContent;
};
