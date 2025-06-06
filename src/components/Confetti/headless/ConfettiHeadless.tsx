import React, { createContext, useContext, forwardRef } from 'react';
import { 
  useConfetti, 
  UseConfettiReturn, 
  ConfettiOptions,
  ConfettiParticle
} from './useConfetti';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

// Context for the Confetti component
interface ConfettiContextValue extends UseConfettiReturn {}

const ConfettiContext = createContext<ConfettiContextValue | null>(null);

// Hook to use Confetti context
export function useConfettiContext() {
  const context = useContext(ConfettiContext);
  if (!context) {
    throw new Error('useConfettiContext must be used within a ConfettiHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends ConfettiOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const confettiProps = useConfetti(options);
    
    return (
      <ConfettiContext.Provider value={confettiProps}>
        <div ref={ref}>
          {children}
        </div>
      </ConfettiContext.Provider>
    );
  }
);

Root.displayName = 'ConfettiHeadless.Root';

// Container component props
export type ContainerProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Container component
const Container = forwardRef<any, any>(
  ({ as, children, ...props }, ref) => {
    const Component = as || 'div';
    
    return (
      <Component
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'ConfettiHeadless.Container';

// Canvas component props
export type CanvasProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Canvas component
const Canvas = forwardRef<any, any>(
  ({ as, children, ...props }, ref) => {
    const Component = as || 'canvas';
    
    return (
      <Component
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Canvas.displayName = 'ConfettiHeadless.Canvas';

// Particle component props
export type ParticleProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
    /**
     * Particle data
     */
    particle: ConfettiParticle;
  }
>;

// Particle component
const Particle = forwardRef<any, any>(
  ({ as, children, particle, ...props }, ref) => {
    const Component = as || 'div';
    
    // Get shape styles
    const getShapeStyles = () => {
      switch (particle.shape) {
        case 'square':
          return {
            width: `${particle.width}px`,
            height: `${particle.width}px`,
          };
        case 'rectangle':
          return {
            width: `${particle.width}px`,
            height: `${particle.height}px`,
          };
        case 'circle':
          return {
            width: `${particle.width}px`,
            height: `${particle.width}px`,
            borderRadius: '50%',
          };
        case 'triangle':
          return {
            width: 0,
            height: 0,
            borderLeft: `${particle.width / 2}px solid transparent`,
            borderRight: `${particle.width / 2}px solid transparent`,
            borderBottom: `${particle.height}px solid ${particle.color}`,
            backgroundColor: 'transparent',
          };
        default:
          return {
            width: `${particle.width}px`,
            height: `${particle.height}px`,
          };
      }
    };
    
    return (
      <Component
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Particle.displayName = 'ConfettiHeadless.Particle';

// Particles component props
export type ParticlesProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Particles component
const Particles = forwardRef<any, any>(
  ({ as, children, ...props }, ref) => {
    const Component = as || 'div';
    
    return (
      <Component
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Particles.displayName = 'ConfettiHeadless.Particles';

// Trigger component props
export type TriggerProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Trigger component
const Trigger = forwardRef<any, any>(
  ({ as, children, ...props }, ref) => {
    const Component = as || 'button';
    const { start } = useConfettiContext();
    
    return (
      <Component
        ref={ref}
        onClick={start}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Trigger.displayName = 'ConfettiHeadless.Trigger';

// Export all components
export const ConfettiHeadless = {
  Root,
  Container,
  Canvas,
  Particle,
  Particles,
  Trigger,
  useConfettiContext,
};

export default ConfettiHeadless;
