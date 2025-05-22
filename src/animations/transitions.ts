/**
 * Animation transitions for StriveUI components
 * These transitions can be used with or without framer-motion
 */
import { MotionTransition } from './motion';

// Base transitions
export const transitions = {
  // Smooth, gentle transitions
  ease: {
    type: 'tween',
    ease: [0.25, 0.1, 0.25, 1.0], // cubic-bezier
    duration: 0.3,
  },
  
  // Snappy, responsive transitions
  snappy: {
    type: 'tween',
    ease: [0.4, 0.0, 0.2, 1], // Material Design standard easing
    duration: 0.2,
  },
  
  // Bouncy, playful transitions
  bouncy: {
    type: 'spring',
    stiffness: 300,
    damping: 20,
    mass: 1,
  },
  
  // Elastic, stretchy transitions
  elastic: {
    type: 'spring',
    stiffness: 400,
    damping: 15,
    mass: 1.5,
  },
  
  // Gentle, slow transitions
  gentle: {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.6,
  },
  
  // Quick, immediate transitions
  quick: {
    type: 'tween',
    ease: 'easeOut',
    duration: 0.15,
  },
  
  // Delayed transitions
  delayed: {
    type: 'tween',
    ease: 'easeOut',
    duration: 0.3,
    delay: 0.2,
  },
  
  // Staggered transitions for lists
  staggered: {
    type: 'tween',
    ease: 'easeOut',
    duration: 0.3,
    staggerChildren: 0.05,
  },
  
  // Staggered from end
  staggeredReverse: {
    type: 'tween',
    ease: 'easeOut',
    duration: 0.3,
    staggerChildren: 0.05,
    staggerDirection: -1,
  },
  
  // Long, dramatic transitions
  dramatic: {
    type: 'tween',
    ease: [0.6, 0.01, 0.05, 0.95], // dramatic ease
    duration: 1.0,
  },
  
  // Micro-interactions
  micro: {
    type: 'tween',
    ease: 'easeOut',
    duration: 0.1,
  },
} as const;

// Specialized transitions for specific use cases
export const specialTransitions = {
  // For modals and dialogs
  modal: {
    enter: {
      ...transitions.snappy,
      duration: 0.25,
    },
    exit: {
      ...transitions.snappy,
      duration: 0.2,
    },
  },
  
  // For tooltips and popovers
  tooltip: {
    enter: {
      ...transitions.quick,
      duration: 0.15,
    },
    exit: {
      ...transitions.quick,
      duration: 0.1,
    },
  },
  
  // For page transitions
  page: {
    enter: {
      ...transitions.ease,
      duration: 0.4,
    },
    exit: {
      ...transitions.ease,
      duration: 0.3,
    },
  },
  
  // For accordions and expandable sections
  expand: {
    enter: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
    },
    exit: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
    },
  },
  
  // For hover effects
  hover: {
    ...transitions.micro,
    duration: 0.15,
  },
  
  // For loading states
  loading: {
    loop: {
      type: 'tween',
      ease: 'linear',
      duration: 1.5,
      repeat: Infinity,
    },
    pulse: {
      type: 'spring',
      stiffness: 300,
      damping: 10,
      repeat: Infinity,
      repeatType: 'reverse',
      duration: 1,
    },
  },
  
  // For scroll-triggered animations
  scroll: {
    ...transitions.ease,
    duration: 0.5,
  },
} as const;

// Helper function to create custom transitions
export const createTransition = (
  options: Partial<MotionTransition>
): MotionTransition => {
  return {
    ...transitions.ease, // Default base
    ...options,
  };
};

// Helper to combine transitions
export const combineTransitions = (
  base: keyof typeof transitions | MotionTransition,
  overrides: Partial<MotionTransition>
): MotionTransition => {
  const baseTransition = typeof base === 'string' ? transitions[base] : base;
  return {
    ...baseTransition,
    ...overrides,
  };
};
