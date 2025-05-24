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
const Stepper = forwardRef(
  <C extends React.ElementType = 'div'>(
    {
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
      ...props
    }: StepperProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { steps, activeStep, direction, goToStep, linear } = useFormWizardContext();
    
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
        {...props}
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
);

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
  }
>;

// Step container component
const StepContainer = forwardRef(
  <C extends React.ElementType = 'div'>(
    {
      as,
      className,
      style,
      children,
      ...props
    }: StepContainerProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { activeStep, transition } = useFormWizardContext();
    
    // Get animation variants based on the transition type
    const getVariants = () => {
      switch (transition) {
        case 'fade':
          return {
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
            exit: { opacity: 0 },
          };
        case 'slide':
          return {
            hidden: { x: 50, opacity: 0 },
            visible: { x: 0, opacity: 1 },
            exit: { x: -50, opacity: 0 },
          };
        default:
          return {
            hidden: {},
            visible: {},
            exit: {},
          };
      }
    };
    
    return (
      <Component
        ref={ref}
        className={className}
        style={{
          position: 'relative',
          overflow: 'hidden',
          ...style,
        }}
        {...props}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={transition !== 'none' ? 'hidden' : undefined}
            animate={transition !== 'none' ? 'visible' : undefined}
            exit={transition !== 'none' ? 'exit' : undefined}
            variants={getVariants()}
            transition={{ duration: 0.3 }}
            style={{ width: '100%' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </Component>
    );
  }
);

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
  const { activeStep } = useFormWizardContext();
  
  // Only render the active step
  if (index !== activeStep) {
    return null;
  }
  
  return (
    <div className={className} style={style}>
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
const Navigation = forwardRef(
  <C extends React.ElementType = 'div'>(
    {
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
      ...props
    }: NavigationProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { 
      prevStep, 
      nextStep, 
      isFirstStep, 
      isLastStep, 
      allowBackNavigation 
    } = useFormWizardContext();
    
    return (
      <Component
        ref={ref}
        className={className}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 16,
          ...style,
        }}
        {...props}
      >
        {showBackButton && (
          renderBackButton ? (
            renderBackButton({
              onClick: prevStep,
              disabled: isFirstStep || !allowBackNavigation,
            })
          ) : (
            <button
              type="button"
              onClick={prevStep}
              disabled={isFirstStep || !allowBackNavigation}
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: '1px solid var(--neutral-color, #e0e0e0)',
                borderRadius: 4,
                cursor: isFirstStep || !allowBackNavigation ? 'not-allowed' : 'pointer',
                opacity: isFirstStep || !allowBackNavigation ? 0.5 : 1,
              }}
            >
              {backText}
            </button>
          )
        )}
        
        {showNextButton && (
          renderNextButton ? (
            renderNextButton({
              onClick: nextStep,
              disabled: false,
              isLastStep,
            })
          ) : (
            <button
              type="button"
              onClick={nextStep}
              style={{
                padding: '8px 16px',
                backgroundColor: 'var(--primary-color, #1976d2)',
                color: 'var(--on-primary-color, white)',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              {isLastStep ? finishText : nextText}
            </button>
          )
        )}
      </Component>
    );
  }
);

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
const Progress = forwardRef(
  <C extends React.ElementType = 'div'>(
    {
      as,
      className,
      style,
      showPercentage = true,
      showStepCount = true,
      ...props
    }: ProgressProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { progress, activeStep, steps } = useFormWizardContext();
    
    return (
      <Component
        ref={ref}
        className={className}
        style={{
          marginBottom: 16,
          ...style,
        }}
        {...props}
      >
        {/* Progress bar */}
        <div
          style={{
            width: '100%',
            height: 8,
            backgroundColor: 'var(--neutral-color, #e0e0e0)',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: 'var(--primary-color, #1976d2)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        
        {/* Progress info */}
        {(showPercentage || showStepCount) && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 4,
              fontSize: 'smaller',
              color: 'var(--text-secondary-color, #757575)',
            }}
          >
            {showPercentage && <div>{progress}% completed</div>}
            {showStepCount && <div>Step {activeStep + 1} of {steps.length}</div>}
          </div>
        )}
      </Component>
    );
  }
);

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
const Summary = forwardRef(
  <C extends React.ElementType = 'div'>(
    {
      as,
      className,
      style,
      showTitles = true,
      showStatus = true,
      renderStep,
      ...props
    }: SummaryProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { steps, activeStep } = useFormWizardContext();
    
    return (
      <Component
        ref={ref}
        className={className}
        style={{
          marginBottom: 16,
          ...style,
        }}
        {...props}
      >
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
          }}
        >
          {steps.map((step, index) => (
            <li
              key={step.id}
              style={{
                padding: 8,
                marginBottom: 4,
                borderLeft: `3px solid ${
                  index === activeStep ? 'var(--primary-color, #1976d2)' : 
                  step.completed ? 'var(--success-color, #4caf50)' : 
                  step.hasError ? 'var(--error-color, #f44336)' : 
                  'var(--neutral-color, #e0e0e0)'
                }`,
                backgroundColor: index === activeStep ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
              }}
            >
              {renderStep ? (
                renderStep(step, index, index === activeStep)
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  {showTitles && (
                    <div>
                      <strong>{step.title}</strong>
                      {step.subtitle && (
                        <div style={{ fontSize: 'smaller', color: 'var(--text-secondary-color, #757575)' }}>
                          {step.subtitle}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {showStatus && (
                    <div>
                      {step.completed && !step.hasError && '✓'}
                      {step.hasError && '✗'}
                      {!step.completed && !step.hasError && '○'}
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </Component>
    );
  }
);

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
