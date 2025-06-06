import React, { createContext, useContext, forwardRef } from 'react';
import { useTourGuide, UseTourGuideReturn, TourStep, TourOptions } from './useTourGuide';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../types/polymorphic';

// Context for the TourGuide component
interface TourGuideContextValue extends UseTourGuideReturn {}

const TourGuideContext = createContext<TourGuideContextValue | null>(null);

// Hook to use TourGuide context
export function useTourGuideContext() {
  const context = useContext(TourGuideContext);
  if (!context) {
    throw new Error('useTourGuideContext must be used within a TourGuideHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends TourOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const tourGuideProps = useTourGuide(options);
    
    if (!tourGuideProps.isActive) {
      return null;
    }
    
    return (
      <TourGuideContext.Provider value={tourGuideProps}>
        <div {...tourGuideProps.getTourProps()} ref={ref}>
          {children}
        </div>
      </TourGuideContext.Provider>
    );
  }
);

Root.displayName = 'TourGuideHeadless.Root';

// Mask component props
export type MaskProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Mask component
const Mask = forwardRef<
  HTMLDivElement,
  MaskProps<React.ElementType>
>(({ as, children, ...props }, ref) => {
    const Component = as || 'div';
    const { getMaskProps, showMask } = useTourGuideContext();
    
    if (!showMask) {
      return null;
    }
    
    return (
      <Component {...getMaskProps()} {...props} ref={ref}>
        {children}
      </Component>
    );
  }
);

Mask.displayName = 'TourGuideHeadless.Mask';

// Tooltip component props
export type TooltipProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      currentStep: TourStep | null;
      currentStepIndex: number;
      totalSteps: number;
      isFirstStep: boolean;
      isLastStep: boolean;
    }) => React.ReactNode);
  }
>;

// Tooltip component
const Tooltip = forwardRef<
  HTMLDivElement,
  TooltipProps<React.ElementType>
>(({ as, children, ...props }, ref) => {
    const Component = as || 'div';
    const { 
      getTooltipProps, 
      currentStep, 
      currentStepIndex, 
      totalSteps,
      getCurrentTargetPosition
    } = useTourGuideContext();
    
    if (!currentStep) {
      return null;
    }
    
    const targetPosition = getCurrentTargetPosition();
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === totalSteps - 1;
    
    // Calculate position based on placement
    let tooltipStyle: React.CSSProperties = {};
    
    if (targetPosition) {
      const { top, left, width, height } = targetPosition;
      const offset = currentStep.offset || 10;
      
      switch (currentStep.placement) {
        case 'top':
          tooltipStyle = {
            bottom: window.innerHeight - top + offset,
            left: left + width / 2,
            transform: 'translateX(-50%)',
          };
          break;
        case 'right':
          tooltipStyle = {
            left: left + width + offset,
            top: top + height / 2,
            transform: 'translateY(-50%)',
          };
          break;
        case 'bottom':
          tooltipStyle = {
            top: top + height + offset,
            left: left + width / 2,
            transform: 'translateX(-50%)',
          };
          break;
        case 'left':
          tooltipStyle = {
            right: window.innerWidth - left + offset,
            top: top + height / 2,
            transform: 'translateY(-50%)',
          };
          break;
        default:
          // Auto placement
          tooltipStyle = {
            top: top + height + offset,
            left: left + width / 2,
            transform: 'translateX(-50%)',
          };
      }
    }
    
    return (
      <Component 
        {...getTooltipProps()} 
        style={{ ...getTooltipProps().style, ...tooltipStyle }}
        {...props} 
        ref={ref}
      >
        {typeof children === 'function' 
          ? children({ currentStep, currentStepIndex, totalSteps, isFirstStep, isLastStep }) 
          : children}
      </Component>
    );
  }
);

Tooltip.displayName = 'TourGuideHeadless.Tooltip';

// Highlight component props
export interface HighlightProps {
  /**
   * Children of the component
   */
  children?: React.ReactNode;
}

// Highlight component
const Highlight = forwardRef<HTMLDivElement, HighlightProps>(
  ({ children }, ref) => {
    const { currentStep, getCurrentTargetPosition } = useTourGuideContext();
    
    if (!currentStep || !currentStep.highlight) {
      return null;
    }
    
    const targetPosition = getCurrentTargetPosition();
    
    if (!targetPosition) {
      return null;
    }
    
    const { top, left, width, height } = targetPosition;
    
    return (
      <div
        ref={ref}
        style={{
          position: 'absolute',
          top,
          left,
          width,
          height,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
          borderRadius: '4px',
          zIndex: 1001,
          pointerEvents: 'none',
        }}
      >
        {children}
      </div>
    );
  }
);

Highlight.displayName = 'TourGuideHeadless.Highlight';

// Controls component props
export type ControlsProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      currentStepIndex: number;
      totalSteps: number;
      isFirstStep: boolean;
      isLastStep: boolean;
      next: () => void;
      prev: () => void;
      skip: () => void;
      end: () => void;
    }) => React.ReactNode);
  }
>;

// Controls component
const Controls = forwardRef<
  HTMLDivElement,
  ControlsProps<React.ElementType>
>(({ as, children, ...props }, ref) => {
    const Component = as || 'div';
    const { 
      currentStepIndex, 
      totalSteps, 
      next, 
      prev, 
      skip, 
      end 
    } = useTourGuideContext();
    
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === totalSteps - 1;
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ currentStepIndex, totalSteps, isFirstStep, isLastStep, next, prev, skip, end }) 
          : children}
      </Component>
    );
  }
);

Controls.displayName = 'TourGuideHeadless.Controls';

// Progress component props
export type ProgressProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode | ((props: {
      currentStepIndex: number;
      totalSteps: number;
      progress: number;
    }) => React.ReactNode);
  }
>;

// Progress component
const Progress = forwardRef<
  HTMLDivElement,
  ProgressProps<React.ElementType>
>(({ as, children, ...props }, ref) => {
    const Component = as || 'div';
    const { currentStepIndex, totalSteps } = useTourGuideContext();
    
    const progress = totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0;
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ currentStepIndex, totalSteps, progress }) 
          : children}
      </Component>
    );
  }
);

Progress.displayName = 'TourGuideHeadless.Progress';

// Badge component props
export type BadgeProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode | ((props: {
      currentStepIndex: number;
      totalSteps: number;
    }) => React.ReactNode);
  }
>;

// Badge component
const Badge = forwardRef<
  HTMLDivElement,
  BadgeProps<React.ElementType>
>(({ as, children, ...props }, ref) => {
    const Component = as || 'div';
    const { currentStepIndex, totalSteps, showStepNumbers } = useTourGuideContext();
    
    if (!showStepNumbers) {
      return null;
    }
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ currentStepIndex, totalSteps }) 
          : children || `${currentStepIndex + 1}/${totalSteps}`}
      </Component>
    );
  }
);

Badge.displayName = 'TourGuideHeadless.Badge';

// Export all components
export const TourGuideHeadless = {
  Root,
  Mask,
  Tooltip,
  Highlight,
  Controls,
  Progress,
  Badge,
  useTourGuideContext,
};

export default TourGuideHeadless;
