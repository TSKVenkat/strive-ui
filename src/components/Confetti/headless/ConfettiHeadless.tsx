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
const Container = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ContainerProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getContainerProps } = useConfettiContext();
    
    const containerProps = getContainerProps();
    
    return (
      <Component 
        {...containerProps} 
        {...props} 
        ref={ref}
        style={{
          position: 'relative',
          ...props.style,
        }}
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
const Canvas = forwardRef(
  <C extends React.ElementType = 'canvas'>(
    { as, children, ...props }: CanvasProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'canvas';
    const { getCanvasProps, active } = useConfettiContext();
    
    if (!active) {
      return null;
    }
    
    const canvasProps = getCanvasProps();
    
    return (
      <Component 
        {...canvasProps} 
        {...props}
        style={{
          ...canvasProps.style,
          ...props.style,
        }}
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
const Particle = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, particle, ...props }: ParticleProps<C>,
    ref: PolymorphicRef<C>
  ) => {
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
        {...props} 
        ref={ref}
        style={{
          position: 'absolute',
          backgroundColor: particle.shape !== 'triangle' ? particle.color : undefined,
          opacity: particle.opacity,
          transform: `translate(${particle.x}px, ${particle.y}px) rotate(${particle.rotation}deg)`,
          ...getShapeStyles(),
          ...props.style,
        }}
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
const Particles = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ParticlesProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { particles, active } = useConfettiContext();
    
    if (!active) {
      return null;
    }
    
    return (
      <Component 
        {...props} 
        ref={ref}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9999,
          ...props.style,
        }}
      >
        {particles.map((particle, index) => (
          <Particle key={index} particle={particle} />
        ))}
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
const Trigger = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: TriggerProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { start } = useConfettiContext();
    
    return (
      <Component 
        onClick={start}
        {...props} 
        ref={ref}
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
