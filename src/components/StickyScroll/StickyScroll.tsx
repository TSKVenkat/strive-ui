import React, { useRef, useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';

export interface StickyScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Offset from the top of the viewport when sticky
   */
  topOffset?: number;
  /**
   * Z-index for the sticky element
   */
  zIndex?: number;
  /**
   * Whether to add a shadow when sticky
   */
  showShadow?: boolean;
  /**
   * Whether to add a border when sticky
   */
  showBorder?: boolean;
  /**
   * Whether to animate the transition to sticky
   */
  animate?: boolean;
  /**
   * Animation duration in milliseconds
   */
  animationDuration?: number;
  /**
   * Background color when sticky
   */
  stickyBackground?: string;
  /**
   * Width of the sticky element (defaults to 100%)
   */
  stickyWidth?: string;
  /**
   * Whether to disable stickiness
   */
  disabled?: boolean;
  /**
   * Callback when sticky state changes
   */
  onStickyChange?: (isSticky: boolean) => void;
  /**
   * Custom styles for the container
   */
  containerStyle?: React.CSSProperties;
  /**
   * Custom styles for the sticky element
   */
  stickyStyle?: React.CSSProperties;
  /**
   * Children elements
   */
  children: React.ReactNode;
}

interface StickyContainerProps {
  $isSticky: boolean;
  $zIndex: number;
  $showShadow: boolean;
  $showBorder: boolean;
  $animate: boolean;
  $animationDuration: number;
  $stickyBackground: string;
  $stickyWidth: string;
  $topOffset: number;
}

const Container = styled.div`
  width: 100%;
  position: relative;
`;

const StickyContainer = styled.div<StickyContainerProps>`
  position: ${props => props.$isSticky ? 'fixed' : 'relative'};
  top: ${props => props.$isSticky ? `${props.$topOffset}px` : '0'};
  left: 0;
  width: ${props => props.$isSticky ? props.$stickyWidth : '100%'};
  z-index: ${props => props.$isSticky ? props.$zIndex : 'auto'};
  background-color: ${props => props.$isSticky ? props.$stickyBackground : 'transparent'};
  box-shadow: ${props => props.$isSticky && props.$showShadow ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'};
  border-bottom: ${props => props.$isSticky && props.$showBorder ? '1px solid rgba(0, 0, 0, 0.1)' : 'none'};
  transition: ${props => props.$animate ? `all ${props.$animationDuration}ms ease` : 'none'};
`;

const Placeholder = styled.div<{ $height: number; $isSticky: boolean }>`
  height: ${props => props.$isSticky ? `${props.$height}px` : '0'};
  display: ${props => props.$isSticky ? 'block' : 'none'};
`;

/**
 * StickyScroll component for creating elements that stick to the top of the viewport when scrolled
 */
export const StickyScroll: React.FC<StickyScrollProps> = ({
  topOffset = 0,
  zIndex = 100,
  showShadow = true,
  showBorder = true,
  animate = true,
  animationDuration = 200,
  stickyBackground = 'white',
  stickyWidth = '100%',
  disabled = false,
  onStickyChange,
  containerStyle,
  stickyStyle,
  children,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [height, setHeight] = useState(0);

  // Calculate the height of the sticky element
  const calculateHeight = useCallback(() => {
    if (stickyRef.current) {
      setHeight(stickyRef.current.offsetHeight);
    }
  }, []);

  // Check if the element should be sticky
  const checkSticky = useCallback(() => {
    if (disabled || !containerRef.current) return;

    const containerTop = containerRef.current.getBoundingClientRect().top;
    const shouldBeSticky = containerTop <= topOffset;

    if (shouldBeSticky !== isSticky) {
      setIsSticky(shouldBeSticky);
      if (onStickyChange) {
        onStickyChange(shouldBeSticky);
      }
    }
  }, [disabled, isSticky, onStickyChange, topOffset]);

  // Initialize height and add scroll event listener
  useEffect(() => {
    calculateHeight();
    checkSticky();

    window.addEventListener('scroll', checkSticky);
    window.addEventListener('resize', calculateHeight);
    
    return () => {
      window.removeEventListener('scroll', checkSticky);
      window.removeEventListener('resize', calculateHeight);
    };
  }, [calculateHeight, checkSticky]);

  // Recalculate when children change
  useEffect(() => {
    calculateHeight();
  }, [children, calculateHeight]);

  return (
    <Container ref={containerRef} style={containerStyle} {...props}>
      <StickyContainer
        ref={stickyRef}
        $isSticky={isSticky}
        $zIndex={zIndex}
        $showShadow={showShadow}
        $showBorder={showBorder}
        $animate={animate}
        $animationDuration={animationDuration}
        $stickyBackground={stickyBackground}
        $stickyWidth={stickyWidth}
        $topOffset={topOffset}
        style={stickyStyle}
      >
        {children}
      </StickyContainer>
      <Placeholder $height={height} $isSticky={isSticky} />
    </Container>
  );
};

export default StickyScroll;
