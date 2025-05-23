import React, { useState, useRef, useEffect } from 'react';
import { motion, useSpring, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

// Types
export interface SpringConfig {
  /**
   * Spring stiffness
   */
  stiffness?: number;
  /**
   * Spring damping
   */
  damping?: number;
  /**
   * Spring mass
   */
  mass?: number;
  /**
   * Spring velocity
   */
  velocity?: number;
  /**
   * Whether the spring should bounce
   */
  bounce?: number;
  /**
   * Spring restSpeed
   */
  restSpeed?: number;
  /**
   * Spring restDelta
   */
  restDelta?: number;
}

export interface PhysicsAnimationProps {
  /**
   * Whether the animation is active
   */
  active?: boolean;
  /**
   * Animation type
   */
  type?: 'spring' | 'inertia' | 'decay' | 'gravity' | 'bounce';
  /**
   * Spring configuration
   */
  springConfig?: SpringConfig;
  /**
   * Initial position
   */
  initialPosition?: number;
  /**
   * Target position
   */
  targetPosition?: number;
  /**
   * Animation axis
   */
  axis?: 'x' | 'y' | 'rotate' | 'scale';
  /**
   * Animation duration (for non-spring animations)
   */
  duration?: number;
  /**
   * Whether to apply the animation to opacity
   */
  withOpacity?: boolean;
  /**
   * Custom transform function
   */
  transformOutput?: (value: number) => number | string;
  /**
   * Custom style object
   */
  style?: React.CSSProperties;
  /**
   * Animation delay
   */
  delay?: number;
  /**
   * Whether to repeat the animation
   */
  repeat?: boolean | number;
  /**
   * Whether to alternate direction on repeat
   */
  repeatType?: 'loop' | 'reverse' | 'mirror';
  /**
   * Callback when animation completes
   */
  onComplete?: () => void;
  /**
   * Callback when animation starts
   */
  onStart?: () => void;
  /**
   * Whether to animate on mount
   */
  animateOnMount?: boolean;
  /**
   * Children elements
   */
  children: React.ReactNode;
}

/**
 * PhysicsAnimation component provides realistic physics-based animations
 * using spring physics for natural movement.
 */
export const PhysicsAnimation: React.FC<PhysicsAnimationProps> = ({
  active = true,
  type = 'spring',
  springConfig = {
    stiffness: 100,
    damping: 10,
    mass: 1,
    velocity: 0,
    bounce: 0,
    restSpeed: 0.01,
    restDelta: 0.01
  },
  initialPosition = 0,
  targetPosition = 100,
  axis = 'y',
  duration = 0.5,
  withOpacity = false,
  transformOutput,
  style,
  delay = 0,
  repeat = false,
  repeatType = 'loop',
  onComplete,
  onStart,
  animateOnMount = true,
  children
}) => {
  const [hasAnimated, setHasAnimated] = useState(!animateOnMount);
  const motionValue = useMotionValue(initialPosition);
  
  // Configure spring based on type
  const springOptions = (() => {
    switch (type) {
      case 'spring':
        return {
          type: 'spring',
          stiffness: springConfig.stiffness,
          damping: springConfig.damping,
          mass: springConfig.mass,
          velocity: springConfig.velocity,
          restSpeed: springConfig.restSpeed,
          restDelta: springConfig.restDelta
        };
      case 'inertia':
        return {
          type: 'inertia',
          velocity: springConfig.velocity || 100,
          power: 0.8,
          timeConstant: 750,
          modifyTarget: (target: number) => target
        };
      case 'decay':
        return {
          type: 'decay',
          velocity: springConfig.velocity || 100,
          power: 0.8,
          timeConstant: 400,
          restDelta: 0.5,
          modifyTarget: (target: number) => target
        };
      case 'gravity':
        return {
          type: 'spring',
          stiffness: 300,
          damping: 10,
          mass: 2,
          velocity: 200,
          restSpeed: 0.5,
          restDelta: 1
        };
      case 'bounce':
        return {
          type: 'spring',
          stiffness: 300,
          damping: 10,
          mass: 1,
          velocity: 0,
          bounce: 0.5,
          restSpeed: 0.5,
          restDelta: 1
        };
      default:
        return {
          type: 'spring',
          stiffness: springConfig.stiffness,
          damping: springConfig.damping
        };
    }
  })();
  
  // Transform the motion value based on the axis
  const transformedValue = useTransform(
    motionValue,
    (value) => transformOutput ? transformOutput(value) : value
  );
  
  // Create animation variants
  const variants = {
    initial: {
      [axis]: initialPosition,
      opacity: withOpacity ? 0 : 1
    },
    animate: {
      [axis]: targetPosition,
      opacity: withOpacity ? 1 : 1,
      transition: {
        ...springOptions,
        delay,
        repeat: typeof repeat === 'boolean' ? (repeat ? Infinity : 0) : repeat,
        repeatType
      }
    }
  };
  
  // Handle animation completion
  const handleComplete = () => {
    setHasAnimated(true);
    if (onComplete) {
      onComplete();
    }
  };
  
  // Handle animation start
  const handleStart = () => {
    if (onStart) {
      onStart();
    }
  };
  
  return (
    <motion.div
      initial="initial"
      animate={active ? "animate" : "initial"}
      variants={variants}
      style={{ 
        ...style,
        [axis]: transformedValue
      }}
      onAnimationComplete={handleComplete}
      onAnimationStart={handleStart}
    >
      {children}
    </motion.div>
  );
};

// Preset configurations
export const PhysicsPresets = {
  Gentle: {
    stiffness: 100,
    damping: 20,
    mass: 1
  },
  Bouncy: {
    stiffness: 400,
    damping: 10,
    mass: 1,
    bounce: 0.5
  },
  Slow: {
    stiffness: 50,
    damping: 15,
    mass: 2
  },
  Fast: {
    stiffness: 300,
    damping: 20,
    mass: 0.5
  },
  Elastic: {
    stiffness: 300,
    damping: 5,
    mass: 1
  },
  Wobbly: {
    stiffness: 180,
    damping: 12,
    mass: 1.5
  },
  Stiff: {
    stiffness: 500,
    damping: 50,
    mass: 1
  },
  Molasses: {
    stiffness: 20,
    damping: 40,
    mass: 3
  }
};

// Draggable component with physics
export interface DraggableProps {
  /**
   * Spring configuration
   */
  springConfig?: SpringConfig;
  /**
   * Drag constraints
   */
  constraints?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  /**
   * Whether to enable drag momentum
   */
  momentum?: boolean;
  /**
   * Drag axis
   */
  dragAxis?: 'x' | 'y' | 'both';
  /**
   * Whether to snap to a grid
   */
  snapToGrid?: boolean;
  /**
   * Grid size for snapping
   */
  gridSize?: number;
  /**
   * Callback when drag starts
   */
  onDragStart?: () => void;
  /**
   * Callback during drag
   */
  onDrag?: (info: any) => void;
  /**
   * Callback when drag ends
   */
  onDragEnd?: (info: any) => void;
  /**
   * Custom style object
   */
  style?: React.CSSProperties;
  /**
   * Children elements
   */
  children: React.ReactNode;
}

const DraggableContainer = styled(motion.div)`
  touch-action: none;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;

/**
 * Draggable component with realistic physics for natural drag interactions.
 */
export const Draggable: React.FC<DraggableProps> = ({
  springConfig = PhysicsPresets.Gentle,
  constraints,
  momentum = true,
  dragAxis = 'both',
  snapToGrid = false,
  gridSize = 20,
  onDragStart,
  onDrag,
  onDragEnd,
  style,
  children
}) => {
  // Set up drag constraints
  const dragConstraints = constraints || false;
  
  // Configure drag options
  const dragOptions = {
    drag: dragAxis === 'both' ? true : { [dragAxis]: true },
    dragConstraints,
    dragElastic: 0.1,
    dragMomentum: momentum,
    dragTransition: momentum ? {
      power: 0.2,
      timeConstant: 200,
      modifyTarget: snapToGrid
        ? (target: number) => Math.round(target / gridSize) * gridSize
        : undefined
    } : false,
    onDragStart,
    onDrag,
    onDragEnd
  };
  
  return (
    <DraggableContainer
      style={style}
      whileTap={{ cursor: 'grabbing' }}
      {...dragOptions}
    >
      {children}
    </DraggableContainer>
  );
};

// Swipe component with physics
export interface SwipeProps {
  /**
   * Direction of swipe
   */
  direction?: 'horizontal' | 'vertical' | 'both';
  /**
   * Threshold to trigger swipe (0-1)
   */
  threshold?: number;
  /**
   * Velocity threshold to trigger swipe
   */
  velocityThreshold?: number;
  /**
   * Spring configuration
   */
  springConfig?: SpringConfig;
  /**
   * Callback when swipe is triggered
   */
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void;
  /**
   * Whether to disable swipe
   */
  disabled?: boolean;
  /**
   * Custom style object
   */
  style?: React.CSSProperties;
  /**
   * Children elements
   */
  children: React.ReactNode;
}

/**
 * Swipe component with physics-based animations for natural swipe interactions.
 */
export const Swipe: React.FC<SwipeProps> = ({
  direction = 'horizontal',
  threshold = 0.5,
  velocityThreshold = 500,
  springConfig = PhysicsPresets.Gentle,
  onSwipe,
  disabled = false,
  style,
  children
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Handle swipe end
  const handleDragEnd = (e: any, info: any) => {
    const horizontalSwipe = direction === 'horizontal' || direction === 'both';
    const verticalSwipe = direction === 'vertical' || direction === 'both';
    
    if (horizontalSwipe) {
      const swipeThreshold = threshold * 200; // Assuming container width of 200px
      
      if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
        if (onSwipe) onSwipe('right');
      } else if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
        if (onSwipe) onSwipe('left');
      }
    }
    
    if (verticalSwipe) {
      const swipeThreshold = threshold * 200; // Assuming container height of 200px
      
      if (info.offset.y > swipeThreshold || info.velocity.y > velocityThreshold) {
        if (onSwipe) onSwipe('down');
      } else if (info.offset.y < -swipeThreshold || info.velocity.y < -velocityThreshold) {
        if (onSwipe) onSwipe('up');
      }
    }
  };
  
  return (
    <motion.div
      style={{
        ...style,
        x,
        y
      }}
      drag={disabled ? false : (direction === 'both' ? true : direction)}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.8}
      dragTransition={{
        power: springConfig.mass || 1,
        timeConstant: 200,
      }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
};

// Parallax component with physics
export interface ParallaxProps {
  /**
   * Parallax strength (0-1)
   */
  strength?: number;
  /**
   * Direction of parallax
   */
  direction?: 'horizontal' | 'vertical' | 'both';
  /**
   * Whether to invert the direction
   */
  inverted?: boolean;
  /**
   * Spring configuration
   */
  springConfig?: SpringConfig;
  /**
   * Custom style object
   */
  style?: React.CSSProperties;
  /**
   * Children elements
   */
  children: React.ReactNode;
}

/**
 * Parallax component with physics-based animations for smooth parallax effects.
 */
export const Parallax: React.FC<ParallaxProps> = ({
  strength = 0.1,
  direction = 'both',
  inverted = false,
  springConfig = {
    stiffness: 50,
    damping: 30,
    mass: 1
  },
  style,
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Calculate parallax effect
  useEffect(() => {
    if (!containerRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      const offsetX = mouseX - centerX;
      const offsetY = mouseY - centerY;
      
      const factor = inverted ? -1 : 1;
      
      if (direction === 'horizontal' || direction === 'both') {
        x.set(offsetX * strength * factor);
      }
      
      if (direction === 'vertical' || direction === 'both') {
        y.set(offsetY * strength * factor);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [strength, direction, inverted]);
  
  // Spring configuration
  const springX = useSpring(x, {
    stiffness: springConfig.stiffness,
    damping: springConfig.damping,
    mass: springConfig.mass
  });
  
  const springY = useSpring(y, {
    stiffness: springConfig.stiffness,
    damping: springConfig.damping,
    mass: springConfig.mass
  });
  
  return (
    <motion.div
      ref={containerRef}
      style={{
        ...style,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <motion.div
        style={{
          x: springX,
          y: springY,
          width: '100%',
          height: '100%'
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

// Flip animation with physics
export interface FlipProps {
  /**
   * Whether the flip is active
   */
  isFlipped?: boolean;
  /**
   * Flip direction
   */
  direction?: 'horizontal' | 'vertical';
  /**
   * Spring configuration
   */
  springConfig?: SpringConfig;
  /**
   * Front side content
   */
  front: React.ReactNode;
  /**
   * Back side content
   */
  back: React.ReactNode;
  /**
   * Custom style object
   */
  style?: React.CSSProperties;
  /**
   * Callback when flip animation completes
   */
  onFlipComplete?: () => void;
}

const FlipContainer = styled.div`
  perspective: 1200px;
  width: 100%;
  height: 100%;
`;

const FlipInner = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
`;

const FlipSide = styled(motion.div)<{ $side: 'front' | 'back' }>`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transform: ${({ $side }) => $side === 'back' ? 'rotateY(180deg)' : 'rotateY(0)'};
`;

/**
 * Flip component with physics-based animations for realistic card flipping effects.
 */
export const Flip: React.FC<FlipProps> = ({
  isFlipped = false,
  direction = 'horizontal',
  springConfig = {
    stiffness: 150,
    damping: 20,
    mass: 1
  },
  front,
  back,
  style,
  onFlipComplete
}) => {
  // Determine rotation axis
  const rotationAxis = direction === 'horizontal' ? 'rotateY' : 'rotateX';
  
  // Animation variants
  const variants = {
    front: {
      [rotationAxis]: '0deg',
      transition: {
        type: 'spring',
        stiffness: springConfig.stiffness,
        damping: springConfig.damping,
        mass: springConfig.mass
      }
    },
    back: {
      [rotationAxis]: '180deg',
      transition: {
        type: 'spring',
        stiffness: springConfig.stiffness,
        damping: springConfig.damping,
        mass: springConfig.mass
      }
    }
  };
  
  return (
    <FlipContainer style={style}>
      <FlipInner
        initial="front"
        animate={isFlipped ? 'back' : 'front'}
        variants={variants}
        onAnimationComplete={() => {
          if (onFlipComplete) {
            onFlipComplete();
          }
        }}
      >
        <FlipSide $side="front">
          {front}
        </FlipSide>
        <FlipSide $side="back">
          {back}
        </FlipSide>
      </FlipInner>
    </FlipContainer>
  );
};

// Shake animation with physics
export interface ShakeProps {
  /**
   * Whether the shake is active
   */
  active?: boolean;
  /**
   * Shake intensity
   */
  intensity?: number;
  /**
   * Shake count
   */
  count?: number;
  /**
   * Spring configuration
   */
  springConfig?: SpringConfig;
  /**
   * Custom style object
   */
  style?: React.CSSProperties;
  /**
   * Callback when shake animation completes
   */
  onComplete?: () => void;
  /**
   * Children elements
   */
  children: React.ReactNode;
}

/**
 * Shake component with physics-based animations for realistic shaking effects.
 */
export const Shake: React.FC<ShakeProps> = ({
  active = false,
  intensity = 10,
  count = 5,
  springConfig = {
    stiffness: 300,
    damping: 10,
    mass: 0.5
  },
  style,
  onComplete,
  children
}) => {
  // Generate shake keyframes
  const generateShakeValues = () => {
    const values = [];
    for (let i = 0; i < count * 2; i++) {
      values.push(i % 2 === 0 ? intensity : -intensity);
    }
    values.push(0);
    return values;
  };
  
  // Animation variants
  const variants = {
    idle: {
      x: 0
    },
    shake: {
      x: generateShakeValues(),
      transition: {
        duration: 0.5,
        ease: [0.36, 0.07, 0.19, 0.97],
        type: 'spring',
        stiffness: springConfig.stiffness,
        damping: springConfig.damping,
        mass: springConfig.mass
      }
    }
  };
  
  return (
    <motion.div
      style={style}
      variants={variants}
      initial="idle"
      animate={active ? 'shake' : 'idle'}
      onAnimationComplete={() => {
        if (active && onComplete) {
          onComplete();
        }
      }}
    >
      {children}
    </motion.div>
  );
};

// Export all components
export default {
  PhysicsAnimation,
  PhysicsPresets,
  Draggable,
  Swipe,
  Parallax,
  Flip,
  Shake
};
