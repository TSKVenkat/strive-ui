/**
 * Advanced motion utilities for StriveUI components
 * This file provides animation primitives that can be used with or without framer-motion
 */

// These types and utilities allow us to build animations that work with or without framer-motion
// When framer-motion is available, these will be enhanced with its capabilities

export type MotionVariant = {
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  exit?: Record<string, any>;
  hover?: Record<string, any>;
  tap?: Record<string, any>;
  focus?: Record<string, any>;
  drag?: Record<string, any>;
};

export type MotionTransition = {
  type?: 'tween' | 'spring' | 'inertia';
  duration?: number;
  delay?: number;
  staggerChildren?: number;
  staggerDirection?: 1 | -1;
  when?: 'beforeChildren' | 'afterChildren';
  ease?: string | number[] | readonly number[];
  damping?: number;
  mass?: number;
  stiffness?: number;
  velocity?: number;
};

export type MotionProps = {
  initial?: string | Record<string, any>;
  animate?: string | Record<string, any>;
  exit?: string | Record<string, any>;
  transition?: MotionTransition;
  variants?: Record<string, MotionVariant>;
  whileHover?: string | Record<string, any>;
  whileTap?: string | Record<string, any>;
  whileFocus?: string | Record<string, any>;
  whileDrag?: string | Record<string, any>;
  layoutId?: string;
  layout?: boolean | 'position' | 'size';
  drag?: boolean | 'x' | 'y';
  dragConstraints?: { top?: number; right?: number; bottom?: number; left?: number } | React.RefObject<Element>;
  dragElastic?: number | boolean;
  dragMomentum?: boolean;
};

// CSS keyframes for use with styled-components when framer-motion is not available
export const keyframes = {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  fadeOut: `
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `,
  slideInUp: `
    @keyframes slideInUp {
      from { 
        transform: translateY(20px);
        opacity: 0;
      }
      to { 
        transform: translateY(0);
        opacity: 1;
      }
    }
  `,
  slideInDown: `
    @keyframes slideInDown {
      from { 
        transform: translateY(-20px);
        opacity: 0;
      }
      to { 
        transform: translateY(0);
        opacity: 1;
      }
    }
  `,
  slideInLeft: `
    @keyframes slideInLeft {
      from { 
        transform: translateX(-20px);
        opacity: 0;
      }
      to { 
        transform: translateX(0);
        opacity: 1;
      }
    }
  `,
  slideInRight: `
    @keyframes slideInRight {
      from { 
        transform: translateX(20px);
        opacity: 0;
      }
      to { 
        transform: translateX(0);
        opacity: 1;
      }
    }
  `,
  zoomIn: `
    @keyframes zoomIn {
      from { 
        transform: scale(0.95);
        opacity: 0;
      }
      to { 
        transform: scale(1);
        opacity: 1;
      }
    }
  `,
  zoomOut: `
    @keyframes zoomOut {
      from { 
        transform: scale(1);
        opacity: 1;
      }
      to { 
        transform: scale(0.95);
        opacity: 0;
      }
    }
  `,
  pulse: `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `,
  spin: `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,
  bounce: `
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `,
  shimmer: `
    @keyframes shimmer {
      0% {
        background-position: -1000px 0;
      }
      100% {
        background-position: 1000px 0;
      }
    }
  `,
};

// Animation presets for use with styled-components
export const animations = {
  fadeIn: `animation: fadeIn 0.3s ease forwards;`,
  fadeOut: `animation: fadeOut 0.3s ease forwards;`,
  slideInUp: `animation: slideInUp 0.4s ease forwards;`,
  slideInDown: `animation: slideInDown 0.4s ease forwards;`,
  slideInLeft: `animation: slideInLeft 0.4s ease forwards;`,
  slideInRight: `animation: slideInRight 0.4s ease forwards;`,
  zoomIn: `animation: zoomIn 0.3s ease forwards;`,
  zoomOut: `animation: zoomOut 0.3s ease forwards;`,
  pulse: `animation: pulse 1.5s ease-in-out infinite;`,
  spin: `animation: spin 1s linear infinite;`,
  bounce: `animation: bounce 1s ease infinite;`,
  shimmer: `
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%);
    background-size: 1000px 100%;
    animation: shimmer 2s infinite linear;
  `,
};

// Helper to combine keyframes and animation
export const createAnimation = (animationName: keyof typeof animations) => {
  return `
    ${keyframes[animationName]}
    ${animations[animationName]}
  `;
};
