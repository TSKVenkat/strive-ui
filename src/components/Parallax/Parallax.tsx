import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';

export interface ParallaxProps {
  /** The content to display with parallax effect */
  children: React.ReactNode;
  /** The speed of the parallax effect (negative values move in opposite direction) */
  speed?: number;
  /** The direction of the parallax effect */
  direction?: 'vertical' | 'horizontal';
  /** Whether to enable the parallax effect */
  enabled?: boolean;
  /** The z-index of the parallax container */
  zIndex?: number;
  /** Additional className for the container */
  className?: string;
  /** Whether to use the viewport as the scroll container */
  useViewport?: boolean;
  /** Easing function for the parallax effect */
  easing?: string;
  /** Optional style overrides for the container */
  style?: React.CSSProperties;
}

const ParallaxContainer = styled.div<{ zIndex?: number }>`
  position: relative;
  overflow: hidden;
  z-index: ${({ zIndex }) => zIndex || 'auto'};
  width: 100%;
`;

const ParallaxInner = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const Parallax = ({
  children,
  speed = 0.5,
  direction = 'vertical',
  enabled = true,
  zIndex,
  className,
  useViewport = true,
  easing = 'linear',
  style,
}: ParallaxProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerTop, setContainerTop] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  
  const { scrollY } = useScroll({
    target: useViewport ? undefined : containerRef,
  });
  
  // Calculate the range for the parallax effect
  useEffect(() => {
    if (!enabled || !containerRef.current) return;
    
    const updatePosition = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      setContainerTop(rect.top + window.scrollY);
      setWindowHeight(window.innerHeight);
    };
    
    updatePosition();
    window.addEventListener('resize', updatePosition);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, [enabled]);
  
  // Calculate the parallax transform values
  const startY = containerTop - windowHeight;
  const endY = containerTop + (containerRef.current?.offsetHeight || 0);
  
  const y = useTransform(
    scrollY,
    [startY, endY],
    direction === 'vertical' ? 
      [speed * -100, speed * 100] : 
      [0, 0],
    { ease: easing }
  );
  
  const x = useTransform(
    scrollY,
    [startY, endY],
    direction === 'horizontal' ? 
      [speed * -100, speed * 100] : 
      [0, 0],
    { ease: easing }
  );
  
  // If parallax is disabled, just render children
  if (!enabled) {
    return <div ref={containerRef} className={className} style={style}>{children}</div>;
  }
  
  return (
    <ParallaxContainer 
      ref={containerRef} 
      zIndex={zIndex} 
      className={className}
      style={style}
    >
      <ParallaxInner style={{ x, y }}>
        {children}
      </ParallaxInner>
    </ParallaxContainer>
  );
};

Parallax.displayName = 'Parallax';
