import React, { createContext, useContext, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  useFormWizard, 
  UseFormWizardReturn, 
  FormWizardStep, 
  FormWizardDirection, 
  FormWizardVariant, 
  FormWizardSize, 
  FormWizardTransition,
  UseFormWizardOptions
} from './useFormWizard';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

// Context for the FormWizard
interface FormWizardContextValue extends UseFormWizardReturn {
  variant: FormWizardVariant;
  size: FormWizardSize;
  direction: FormWizardDirection;
  transition: FormWizardTransition;
}

const FormWizardContext = createContext<FormWizardContextValue | null>(null);

// Hook to use FormWizard context
export function useFormWizardContext() {
  const context = useContext(FormWizardContext);
  if (!context) {
    throw new Error('useFormWizardContext must be used within a FormWizardHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends UseFormWizardOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
  /**
   * Variant of the stepper
   */
  variant?: FormWizardVariant;
  /**
   * Size of the stepper
   */
  size?: FormWizardSize;
  /**
   * Transition effect between steps
   */
  transition?: FormWizardTransition;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Custom styles
   */
  style?: React.CSSProperties;
}

// Root component
const Root: React.FC<RootProps> = ({
  children,
  variant = 'default',
  size = 'md',
  transition = 'fade',
  className,
  style,
  ...options
}) => {
  const formWizard = useFormWizard(options);
  
  return (
    <FormWizardContext.Provider 
      value={{
        ...formWizard,
        variant,
        size,
        direction: options.direction || 'horizontal',
        transition,
      }}
    >
      <div className={className} style={style}>
        {children}
      </div>
    </FormWizardContext.Provider>
  );
};

// Stepper component props
export type StepperProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Custom class name
     */
    className?: string;
    /**
     * Custom styles
     */
    style?: React.CSSProperties;
    /**
     * Whether to show the connector between steps
     */
    showConnector?: boolean;
    /**
     * Whether to show the step numbers
     */
    showNumbers?: boolean;
    /**
     * Whether to show the step icons
     */
    showIcons?: boolean;
    /**
     * Whether to show the step titles
     */
    showTitles?: boolean;
    /**
     * Whether to show the step subtitles
     */
    showSubtitles?: boolean;
    /**
     * Whether to show the step status (completed, error)
     */
    showStatus?: boolean;
    /**
     * Whether steps are clickable
     */
    clickable?: boolean;
  }
>;

// Stepper component
const Stepper = forwardRef((props: any, ref: any) => {
  const {
    as,
    className,
    style,
    showConnector = true,
    showNumbers = true,
    showIcons = true,
    showTitles = true,
    showSubtitles = false,
    showStatus = true,
    clickable = true,
    ...restProps
  } = props;
  const Component = as || 'div';
  const { steps, activeStep, direction, goToStep } = useFormWizardContext();
  const linear = (useFormWizardContext() as any).linear || false;
    
    // Handle step click
    const handleStepClick = async (index: number) => {
      if (!clickable) return;
      
      // In linear mode, we can only go to completed steps or the next available step
      if (linear && index > activeStep) {
        // Check if all previous steps are completed
        for (let i = 0; i < index; i++) {
          if (!steps[i].completed && !steps[i].optional) {
            return;
          }
        }
      }
      
      await goToStep(index);
    };
    
    return (
      <Component
        ref={ref}
        className={className}
        style={{
          display: 'flex',
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
          ...style,
        }}
        {...restProps}
      >
        {steps.map((step, index) => (
          <div
            key={step.id}
            style={{
              display: 'flex',
              flexDirection: direction === 'horizontal' ? 'column' : 'row',
              alignItems: 'center',
              flex: direction === 'horizontal' ? 1 : undefined,
              cursor: clickable ? 'pointer' : 'default',
              opacity: step.optional ? 0.7 : 1,
            }}
            onClick={() => handleStepClick(index)}
            role="button"
            tabIndex={clickable ? 0 : undefined}
            aria-current={index === activeStep ? 'step' : undefined}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {/* Step indicator (number or icon) */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 
                    index === activeStep ? 'var(--primary-color, #1976d2)' : 
                    step.completed ? 'var(--success-color, #4caf50)' : 
                    step.hasError ? 'var(--error-color, #f44336)' : 
                    'var(--neutral-color, #e0e0e0)',
                  color: 
                    (index === activeStep || step.completed || step.hasError) ? 
                    'var(--on-primary-color, white)' : 
                    'var(--on-neutral-color, #757575)',
                  transition: 'all 0.3s ease',
                }}
              >
                {showIcons && step.icon ? (
                  step.icon
                ) : showNumbers ? (
                  index + 1
                ) : null}
              </div>
              
              {/* Connector */}
              {showConnector && index < steps.length - 1 && (
                <div
                  style={{
                    height: direction === 'horizontal' ? 1 : 16,
                    width: direction === 'horizontal' ? '100%' : 1,
                    backgroundColor: 'var(--neutral-color, #e0e0e0)',
                    position: direction === 'horizontal' ? 'absolute' : 'static',
                    top: direction === 'horizontal' ? '50%' : undefined,
                    left: direction === 'horizontal' ? 'calc(50% + 16px)' : '50%',
                    right: direction === 'horizontal' ? 'calc(50% - 16px)' : undefined,
                    transform: direction === 'horizontal' ? 'translateY(-50%)' : undefined,
                    zIndex: -1,
                  }}
                />
              )}
            </div>
            
            {/* Step content */}
            {(showTitles || showSubtitles) && (
              <div
                style={{
                  marginTop: direction === 'horizontal' ? 8 : 0,
                  marginLeft: direction === 'horizontal' ? 0 : 8,
                  textAlign: direction === 'horizontal' ? 'center' : 'left',
                }}
              >
                {showTitles && (
                  <div
                    style={{
                      fontWeight: index === activeStep ? 'bold' : 'normal',
                      color: 
                        index === activeStep ? 'var(--primary-color, #1976d2)' : 
                        step.hasError ? 'var(--error-color, #f44336)' : 
                        'inherit',
                    }}
                  >
                    {step.title}
                    {step.optional && ' (Optional)'}
                  </div>
                )}
                
                {showSubtitles && step.subtitle && (
                  <div
                    style={{
                      fontSize: 'smaller',
                      color: 'var(--text-secondary-color, #757575)',
                    }}
                  >
                    {step.subtitle}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </Component>
    );
  }
) as any;

// Step container props
export type StepContainerProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Custom class name
     */
    className?: string;
    /**
     * Custom styles
     */
    style?: React.CSSProperties;
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Step container component  
const StepContainer = forwardRef((props: any, ref: any) => {
  const { as, className, style, children, ...restProps } = props;
  const Component = as || 'div';
  const { activeStep, transition } = useFormWizardContext();
  
  // Get animation variants based on the transition type
  const getVariants = () => {
    switch (transition) {
      case 'fade':
        return {
          enter: { opacity: 1, transition: { duration: 0.3 } },
          exit: { opacity: 0, transition: { duration: 0.3 } },
        };
      case 'slide':
        return {
          enter: { x: 0, opacity: 1, transition: { duration: 0.3 } },
          exit: { x: '-100%', opacity: 0, transition: { duration: 0.3 } },
        };
      case 'scale':
        return {
          enter: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
          exit: { scale: 0.95, opacity: 0, transition: { duration: 0.3 } },
        };
      default:
        return {};
    }
  };
  
  return (
    <Component
      ref={ref}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        ...style,
      }}
      {...restProps}
    >
      {children}
    </Component>
  );
  }) as any;

Stepper.displayName = 'FormWizardHeadless.Stepper';

// Step props
export interface StepProps {
  /**
   * Step index
   */
  index: number;
  /**
   * Children of the component
   */
  children: React.ReactNode;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Custom styles
   */
  style?: React.CSSProperties;
}

// Step component
const Step: React.FC<StepProps> = ({
  index,
  children,
  className,
  style,
}) => {
  const { activeStep, getStepStatus } = useFormWizardContext();
  
  if (index !== activeStep) {
    return null;
  }
  
  return (
    <div
      className={className}
      style={style}
      data-step-index={index}
      data-step-status={getStepStatus(index)}
    >
      {children}
    </div>
  );
};

// Navigation props
export type NavigationProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Custom class name
     */
    className?: string;
    /**
     * Custom styles
     */
    style?: React.CSSProperties;
    /**
     * Text for the back button
     */
    backText?: string;
    /**
     * Text for the next button
     */
    nextText?: string;
    /**
     * Text for the finish button (last step)
     */
    finishText?: string;
    /**
     * Whether to show the back button
     */
    showBackButton?: boolean;
    /**
     * Whether to show the next button
     */
    showNextButton?: boolean;
    /**
     * Custom render function for the back button
     */
    renderBackButton?: (props: { onClick: () => void; disabled: boolean }) => React.ReactNode;
    /**
     * Custom render function for the next button
     */
    renderNextButton?: (props: { onClick: () => Promise<boolean>; disabled: boolean; isLastStep: boolean }) => React.ReactNode;
  }
>;

// Navigation component
const Navigation = forwardRef((props: any, ref: any) => {
  const {
    as,
    className,
    style,
    backText = 'Back',
    nextText = 'Next',
    finishText = 'Finish',
    showBackButton = true,
    showNextButton = true,
    renderBackButton,
    renderNextButton,
    ...restProps
  } = props;
  const Component = as || 'div';
  const {
    activeStep,
    canGoToPreviousStep,
    canGoToNextStep,
    goToPreviousStep,
    goToNextStep,
    isLastStep,
  } = useFormWizardContext();
  const allowBackNavigation = (useFormWizardContext() as any).allowBackNavigation !== false;
  
  const handleNext = async () => {
    const success = await goToNextStep();
    return success;
  };
  
  return (
    <Component
      ref={ref}
      className={className}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        ...style,
      }}
      {...restProps}
    >
      {showBackButton && (
        <div>
          {renderBackButton ? (
            renderBackButton({
              onClick: goToPreviousStep,
              disabled: !allowBackNavigation || !canGoToPreviousStep,
            })
          ) : (
            <button
              type="button"
              onClick={goToPreviousStep}
              disabled={!allowBackNavigation || !canGoToPreviousStep}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                cursor: (!allowBackNavigation || !canGoToPreviousStep) ? 'not-allowed' : 'pointer',
                opacity: (!allowBackNavigation || !canGoToPreviousStep) ? 0.5 : 1,
              }}
            >
              {backText}
            </button>
          )}
        </div>
      )}
      
      {showNextButton && (
        <div>
          {renderNextButton ? (
            renderNextButton({
              onClick: handleNext,
              disabled: !canGoToNextStep,
              isLastStep,
            })
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canGoToNextStep}
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: '#1976d2',
                color: 'white',
                cursor: !canGoToNextStep ? 'not-allowed' : 'pointer',
                opacity: !canGoToNextStep ? 0.5 : 1,
              }}
            >
              {isLastStep ? finishText : nextText}
            </button>
          )}
        </div>
      )}
    </Component>
  );
}) as any;

// Progress props
export type ProgressProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Custom class name
     */
    className?: string;
    /**
     * Custom styles
     */
    style?: React.CSSProperties;
    /**
     * Whether to show the percentage
     */
    showPercentage?: boolean;
    /**
     * Whether to show the step count
     */
    showStepCount?: boolean;
  }
>;

// Progress component
const Progress = forwardRef((props: any, ref: any) => {
  const {
    as,
    className,
    style,
    showPercentage = true,
    showStepCount = true,
    ...restProps
  } = props;
  const Component = as || 'div';
  const { steps, activeStep } = useFormWizardContext();
  
  const totalSteps = steps.length;
  const progress = totalSteps > 0 ? ((activeStep + 1) / totalSteps) * 100 : 0;
  
  return (
    <Component
      ref={ref}
      className={className}
      style={{
        width: '100%',
        ...style,
      }}
      {...restProps}
    >
      <div
        style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#e0e0e0',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: '#1976d2',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      
      {(showPercentage || showStepCount) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '0.5rem',
            fontSize: '0.875rem',
            color: '#757575',
          }}
        >
          {showStepCount && (
            <span>
              Step {activeStep + 1} of {totalSteps}
            </span>
          )}
          
          {showPercentage && (
            <span>
              {Math.round(progress)}%
            </span>
          )}
        </div>
      )}
    </Component>
  );
}) as any;

// Summary props
export type SummaryProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Custom class name
     */
    className?: string;
    /**
     * Custom styles
     */
    style?: React.CSSProperties;
    /**
     * Whether to show step titles
     */
    showTitles?: boolean;
    /**
     * Whether to show step status
     */
    showStatus?: boolean;
    /**
     * Custom render function for each step
     */
    renderStep?: (step: FormWizardStep, index: number, isActive: boolean) => React.ReactNode;
  }
>;

// Summary component
const Summary = forwardRef((props: any, ref: any) => {
  const {
    as,
    className,
    style,
    showTitles = true,
    showStatus = true,
    renderStep,
    ...restProps
  } = props;
  const Component = as || 'div';
  const { steps, activeStep, getStepStatus } = useFormWizardContext();
  
  return (
    <Component
      ref={ref}
      className={className}
      style={style}
      {...restProps}
    >
      {steps.map((step, index) => {
        const isActive = index === activeStep;
        const status = getStepStatus(index);
        
        if (renderStep) {
          return renderStep(step, index, isActive);
        }
        
        return (
          <div
            key={step.id}
            style={{
              padding: '1rem',
              marginBottom: '0.5rem',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              backgroundColor: isActive ? '#f5f5f5' : 'transparent',
            }}
          >
            {showTitles && (
              <div
                style={{
                  fontWeight: isActive ? 'bold' : 'normal',
                  marginBottom: '0.5rem',
                }}
              >
                {step.title}
                {step.optional && ' (Optional)'}
              </div>
            )}
            
            {showStatus && (
              <div
                style={{
                  fontSize: '0.875rem',
                  color: 
                    status === 'completed' ? '#4caf50' : 
                    status === 'error' ? '#f44336' : 
                    status === 'active' ? '#1976d2' : 
                    '#757575',
                  textTransform: 'capitalize',
                }}
              >
                Status: {status}
              </div>
            )}
            
            {step.subtitle && (
              <div
                style={{
                  fontSize: '0.875rem',
                  color: '#757575',
                  marginTop: '0.25rem',
                }}
              >
                {step.subtitle}
              </div>
            )}
          </div>
        );
      })}
    </Component>
  );
}) as any;

// Export all components
export const FormWizardHeadless = {
  Root,
  Stepper,
  StepContainer,
  Step,
  Navigation,
  Progress,
  Summary,
};

export default FormWizardHeadless;
