import { useState, useCallback, useEffect, useRef } from 'react';

export type FormWizardStep = {
  /**
   * Unique identifier for the step
   */
  id: string;
  /**
   * Title of the step
   */
  title: string;
  /**
   * Optional subtitle or description
   */
  subtitle?: string;
  /**
   * Optional icon for the step
   */
  icon?: React.ReactNode;
  /**
   * Whether the step is optional
   */
  optional?: boolean;
  /**
   * Whether the step is completed
   */
  completed?: boolean;
  /**
   * Whether the step has validation errors
   */
  hasError?: boolean;
  /**
   * Custom validation function
   */
  validate?: () => boolean | Promise<boolean>;
  /**
   * Custom data associated with the step
   */
  data?: Record<string, any>;
};

export type FormWizardDirection = 'horizontal' | 'vertical';
export type FormWizardVariant = 'default' | 'numbered' | 'dots' | 'progress';
export type FormWizardSize = 'sm' | 'md' | 'lg';
export type FormWizardTransition = 'fade' | 'slide' | 'scale' | 'none';

export interface UseFormWizardOptions {
  /**
   * Initial steps configuration
   */
  steps: FormWizardStep[];
  /**
   * Initial active step index
   */
  initialStep?: number;
  /**
   * Whether to allow going back
   */
  allowBackNavigation?: boolean;
  /**
   * Whether to allow skipping optional steps
   */
  allowSkipOptional?: boolean;
  /**
   * Whether to validate the current step before proceeding
   */
  validateOnNext?: boolean;
  /**
   * Whether to show a linear progress (can't jump to future steps)
   */
  linear?: boolean;
  /**
   * Direction of the stepper
   */
  direction?: FormWizardDirection;
  /**
   * Callback when a step changes
   */
  onStepChange?: (newStepIndex: number, prevStepIndex: number) => void;
  /**
   * Callback when the wizard is completed
   */
  onComplete?: (formData: Record<string, any>) => void;
  /**
   * Callback when a step is validated
   */
  onStepValidation?: (stepIndex: number, isValid: boolean) => void;
}

export interface UseFormWizardReturn {
  /**
   * Current steps configuration
   */
  steps: FormWizardStep[];
  /**
   * Current active step index
   */
  activeStep: number;
  /**
   * Current active step data
   */
  activeStepData: FormWizardStep;
  /**
   * Whether the wizard is on the first step
   */
  isFirstStep: boolean;
  /**
   * Whether the wizard is on the last step
   */
  isLastStep: boolean;
  /**
   * Whether the wizard is completed
   */
  isCompleted: boolean;
  /**
   * Progress percentage (0-100)
   */
  progress: number;
  /**
   * Go to the next step
   */
  nextStep: () => Promise<boolean>;
  /**
   * Go to the previous step
   */
  prevStep: () => void;
  /**
   * Go to a specific step by index
   */
  goToStep: (stepIndex: number) => Promise<boolean>;
  /**
   * Reset the wizard to the initial state
   */
  reset: () => void;
  /**
   * Set a step as completed
   */
  completeStep: (stepIndex: number, isCompleted?: boolean) => void;
  /**
   * Set a step as having an error
   */
  setStepError: (stepIndex: number, hasError?: boolean) => void;
  /**
   * Update step data
   */
  updateStepData: (stepIndex: number, data: Record<string, any>) => void;
  /**
   * Get all form data combined
   */
  getFormData: () => Record<string, any>;
  /**
   * Complete the wizard
   */
  complete: () => void;
  /**
   * Validate the current step
   */
  validateCurrentStep: () => Promise<boolean>;
  /**
   * Set the steps configuration
   */
  setSteps: (steps: FormWizardStep[]) => void;
  /**
   * Get the status of a specific step
   */
  getStepStatus: (stepIndex: number) => 'pending' | 'current' | 'completed' | 'error';
  /**
   * Check if we can go to the previous step
   */
  canGoToPreviousStep: boolean;
  /**
   * Check if we can go to the next step
   */
  canGoToNextStep: boolean;
  /**
   * Go to the previous step (alias for prevStep)
   */
  goToPreviousStep: () => void;
  /**
   * Go to the next step (alias for nextStep)
   */
  goToNextStep: () => Promise<boolean>;
}

/**
 * Hook for creating multi-step form wizards with validation, navigation, and state management.
 * 
 * @example
 * ```jsx
 * const {
 *   steps,
 *   activeStep,
 *   nextStep,
 *   prevStep,
 *   isFirstStep,
 *   isLastStep,
 *   progress
 * } = useFormWizard({
 *   steps: [
 *     { id: 'step1', title: 'Personal Info' },
 *     { id: 'step2', title: 'Address', optional: true },
 *     { id: 'step3', title: 'Review' }
 *   ],
 *   validateOnNext: true
 * });
 * ```
 */
export function useFormWizard({
  steps: initialSteps,
  initialStep = 0,
  allowBackNavigation = true,
  allowSkipOptional = true,
  validateOnNext = true,
  linear = true,
  direction = 'horizontal',
  onStepChange,
  onComplete,
  onStepValidation,
}: UseFormWizardOptions): UseFormWizardReturn {
  const [steps, setSteps] = useState<FormWizardStep[]>(initialSteps);
  const [activeStep, setActiveStep] = useState(initialStep);
  const [isCompleted, setIsCompleted] = useState(false);
  const formDataRef = useRef<Record<string, any>>({});
  
  // Calculate progress
  const progress = Math.round(((activeStep + 1) / steps.length) * 100);
  
  // Determine if we're on the first or last step
  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === steps.length - 1;
  
  // Get the current step data
  const activeStepData = steps[activeStep];
  
  // Validate the current step
  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    const currentStep = steps[activeStep];
    
    if (currentStep.validate) {
      try {
        const isValid = await currentStep.validate();
        
        // Update step error state
        setSteps(prev => 
          prev.map((step, index) => 
            index === activeStep ? { ...step, hasError: !isValid } : step
          )
        );
        
        // Call validation callback
        if (onStepValidation) {
          onStepValidation(activeStep, isValid);
        }
        
        return isValid;
      } catch (error) {
        console.error('Step validation error:', error);
        
        // Update step error state
        setSteps(prev => 
          prev.map((step, index) => 
            index === activeStep ? { ...step, hasError: true } : step
          )
        );
        
        // Call validation callback
        if (onStepValidation) {
          onStepValidation(activeStep, false);
        }
        
        return false;
      }
    }
    
    // If no validation function, consider it valid
    return true;
  }, [activeStep, steps, onStepValidation]);
  
  // Go to the next step
  const nextStep = useCallback(async (): Promise<boolean> => {
    // Validate current step if required
    if (validateOnNext) {
      const isValid = await validateCurrentStep();
      if (!isValid) {
        return false;
      }
    }
    
    // Mark current step as completed
    setSteps(prev => 
      prev.map((step, index) => 
        index === activeStep ? { ...step, completed: true } : step
      )
    );
    
    // If this is the last step, complete the wizard
    if (isLastStep) {
      complete();
      return true;
    }
    
    // Find the next non-optional step if we're skipping optional steps
    let nextStepIndex = activeStep + 1;
    if (allowSkipOptional) {
      while (
        nextStepIndex < steps.length - 1 && 
        steps[nextStepIndex].optional && 
        !steps[nextStepIndex].completed
      ) {
        nextStepIndex++;
      }
    }
    
    // Update active step
    const prevStep = activeStep;
    setActiveStep(nextStepIndex);
    
    // Call step change callback
    if (onStepChange) {
      onStepChange(nextStepIndex, prevStep);
    }
    
    return true;
  }, [
    activeStep,
    isLastStep,
    validateOnNext,
    validateCurrentStep,
    steps,
    allowSkipOptional,
    onStepChange,
  ]);
  
  // Go to the previous step
  const prevStep = useCallback(() => {
    if (!allowBackNavigation || isFirstStep) {
      return;
    }
    
    // Find the previous non-optional step if we're skipping optional steps
    let prevStepIndex = activeStep - 1;
    if (allowSkipOptional) {
      while (
        prevStepIndex > 0 && 
        steps[prevStepIndex].optional && 
        !steps[prevStepIndex].completed
      ) {
        prevStepIndex--;
      }
    }
    
    // Update active step
    const prevActiveStep = activeStep;
    setActiveStep(prevStepIndex);
    
    // Call step change callback
    if (onStepChange) {
      onStepChange(prevStepIndex, prevActiveStep);
    }
  }, [activeStep, isFirstStep, allowBackNavigation, steps, allowSkipOptional, onStepChange]);
  
  // Go to a specific step
  const goToStep = useCallback(async (stepIndex: number): Promise<boolean> => {
    // Validate current step if required and moving forward
    if (validateOnNext && stepIndex > activeStep) {
      const isValid = await validateCurrentStep();
      if (!isValid) {
        return false;
      }
    }
    
    // Check if we can navigate to the requested step
    if (stepIndex < 0 || stepIndex >= steps.length) {
      return false;
    }
    
    // In linear mode, we can only go to completed steps or the next available step
    if (linear && stepIndex > activeStep) {
      // Check if all previous steps are completed
      for (let i = 0; i < stepIndex; i++) {
        if (!steps[i].completed && !steps[i].optional) {
          return false;
        }
      }
    }
    
    // Update active step
    const prevStep = activeStep;
    setActiveStep(stepIndex);
    
    // Call step change callback
    if (onStepChange) {
      onStepChange(stepIndex, prevStep);
    }
    
    return true;
  }, [activeStep, linear, steps, validateOnNext, validateCurrentStep, onStepChange]);
  
  // Reset the wizard
  const reset = useCallback(() => {
    setActiveStep(initialStep);
    setIsCompleted(false);
    setSteps(initialSteps);
    formDataRef.current = {};
  }, [initialStep, initialSteps]);
  
  // Set a step as completed
  const completeStep = useCallback((stepIndex: number, isCompleted = true) => {
    if (stepIndex < 0 || stepIndex >= steps.length) {
      return;
    }
    
    setSteps(prev => 
      prev.map((step, index) => 
        index === stepIndex ? { ...step, completed: isCompleted } : step
      )
    );
  }, [steps]);
  
  // Set a step as having an error
  const setStepError = useCallback((stepIndex: number, hasError = true) => {
    if (stepIndex < 0 || stepIndex >= steps.length) {
      return;
    }
    
    setSteps(prev => 
      prev.map((step, index) => 
        index === stepIndex ? { ...step, hasError } : step
      )
    );
  }, [steps]);
  
  // Update step data
  const updateStepData = useCallback((stepIndex: number, data: Record<string, any>) => {
    if (stepIndex < 0 || stepIndex >= steps.length) {
      return;
    }
    
    // Update step data in state
    setSteps(prev => 
      prev.map((step, index) => 
        index === stepIndex ? { ...step, data: { ...step.data, ...data } } : step
      )
    );
    
    // Update form data reference
    const stepId = steps[stepIndex].id;
    formDataRef.current[stepId] = { ...formDataRef.current[stepId], ...data };
  }, [steps]);
  
  // Get all form data combined
  const getFormData = useCallback(() => {
    return formDataRef.current;
  }, []);
  
  // Complete the wizard
  const complete = useCallback(() => {
    setIsCompleted(true);
    
    // Mark all steps as completed
    setSteps(prev => 
      prev.map(step => ({ ...step, completed: true }))
    );
    
    // Call completion callback
    if (onComplete) {
      onComplete(formDataRef.current);
    }
  }, [onComplete]);
  
  // Effect to update form data when step data changes
  useEffect(() => {
    steps.forEach(step => {
      if (step.data) {
        formDataRef.current[step.id] = step.data;
      }
    });
  }, [steps]);
  
  return {
    steps,
    activeStep,
    activeStepData,
    isFirstStep,
    isLastStep,
    isCompleted,
    progress,
    nextStep,
    prevStep,
    goToStep,
    reset,
    completeStep,
    setStepError,
    updateStepData,
    getFormData,
    complete,
    validateCurrentStep,
    setSteps,
    getStepStatus: (stepIndex: number) => {
      if (stepIndex < 0 || stepIndex >= steps.length) {
        return 'error';
      }
      if (stepIndex === activeStep) {
        return 'current';
      }
      if (steps[stepIndex].completed) {
        return 'completed';
      }
      return 'pending';
    },
    canGoToPreviousStep: !isFirstStep,
    canGoToNextStep: !isLastStep,
    goToPreviousStep: prevStep,
    goToNextStep: nextStep,
  };
}
