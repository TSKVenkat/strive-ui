import { useState, useCallback, useEffect, useRef } from 'react';

export interface TourStep {
  /**
   * Unique identifier for the step
   */
  id: string;
  /**
   * Target element selector or ref
   */
  target: string | React.RefObject<HTMLElement>;
  /**
   * Title of the step
   */
  title?: string;
  /**
   * Content of the step
   */
  content: React.ReactNode;
  /**
   * Placement of the tooltip
   */
  placement?: 'top' | 'right' | 'bottom' | 'left' | 'auto';
  /**
   * Whether to highlight the target element
   */
  highlight?: boolean;
  /**
   * Whether to disable interaction with elements outside the target
   */
  disableInteraction?: boolean;
  /**
   * Whether to scroll to the target element
   */
  scrollToTarget?: boolean;
  /**
   * Offset from the target element
   */
  offset?: number;
  /**
   * Custom class name for the step
   */
  className?: string;
  /**
   * Custom styles for the step
   */
  style?: React.CSSProperties;
  /**
   * Callback before the step is shown
   */
  beforeStep?: () => Promise<boolean> | boolean;
  /**
   * Callback after the step is shown
   */
  afterStep?: () => void;
}

export interface TourOptions {
  /**
   * Steps of the tour
   */
  steps: TourStep[];
  /**
   * Whether the tour is enabled
   */
  enabled?: boolean;
  /**
   * Initial step index
   */
  initialStepIndex?: number;
  /**
   * Whether to close the tour when clicking outside
   */
  closeOnClickOutside?: boolean;
  /**
   * Whether to close the tour when pressing escape
   */
  closeOnEscape?: boolean;
  /**
   * Whether to show step indicators
   */
  showStepIndicators?: boolean;
  /**
   * Whether to show step numbers
   */
  showStepNumbers?: boolean;
  /**
   * Whether to show navigation buttons
   */
  showNavigation?: boolean;
  /**
   * Whether to show the close button
   */
  showCloseButton?: boolean;
  /**
   * Whether to show the skip button
   */
  showSkipButton?: boolean;
  /**
   * Whether to mask the rest of the page
   */
  showMask?: boolean;
  /**
   * Whether to update the URL hash
   */
  updateUrlHash?: boolean;
  /**
   * Callback when the tour starts
   */
  onStart?: () => void;
  /**
   * Callback when the tour ends
   */
  onEnd?: (completed: boolean) => void;
  /**
   * Callback when a step changes
   */
  onStepChange?: (currentStep: TourStep, nextStep: TourStep) => void;
  /**
   * Callback when a step is shown
   */
  onStepShow?: (step: TourStep) => void;
  /**
   * Callback when the tour is skipped
   */
  onSkip?: () => void;
  /**
   * Text for the next button
   */
  nextButtonText?: string;
  /**
   * Text for the back button
   */
  backButtonText?: string;
  /**
   * Text for the skip button
   */
  skipButtonText?: string;
  /**
   * Text for the close button
   */
  closeButtonText?: string;
  /**
   * Text for the last step button
   */
  lastStepButtonText?: string;
  /**
   * Z-index for the tour elements
   */
  zIndex?: number;
}

export interface UseTourGuideReturn {
  /**
   * Current step index
   */
  currentStepIndex: number;
  /**
   * Current step
   */
  currentStep: TourStep | null;
  /**
   * Whether the tour is active
   */
  isActive: boolean;
  /**
   * Whether the tour is completed
   */
  isCompleted: boolean;
  /**
   * Total number of steps
   */
  totalSteps: number;
  /**
   * Whether to show the mask
   */
  showMask: boolean;
  /**
   * Whether to show step numbers
   */
  showStepNumbers: boolean;
  /**
   * Start the tour
   */
  start: (stepIndex?: number) => void;
  /**
   * End the tour
   */
  end: (completed?: boolean) => void;
  /**
   * Go to the next step
   */
  next: () => void;
  /**
   * Go to the previous step
   */
  prev: () => void;
  /**
   * Go to a specific step
   */
  goTo: (stepIndex: number) => void;
  /**
   * Skip the tour
   */
  skip: () => void;
  /**
   * Get props for the tour container
   */
  getTourProps: () => {
    'aria-live': 'assertive' | 'polite' | 'off';
    role: string;
  };
  /**
   * Get props for a step
   */
  getStepProps: (stepId: string) => {
    'data-tour-step': string;
    'aria-hidden': boolean;
  };
  /**
   * Get props for the mask
   */
  getMaskProps: () => {
    style: React.CSSProperties;
    onClick?: () => void;
  };
  /**
   * Get props for the tooltip
   */
  getTooltipProps: () => {
    style: React.CSSProperties;
    role: string;
    'aria-modal': boolean;
  };
  /**
   * Get props for the target element
   */
  getTargetProps: (stepId: string) => {
    'data-tour-target': string;
    tabIndex: number;
    'aria-describedby': string;
  };
  /**
   * Get the position of the current target element
   */
  getCurrentTargetPosition: () => DOMRect | null;
}

/**
 * Hook for creating a tour guide
 */
export function useTourGuide(options: TourOptions): UseTourGuideReturn {
  const {
    steps,
    enabled = true,
    initialStepIndex = 0,
    closeOnClickOutside = true,
    closeOnEscape = true,
    showStepIndicators = true,
    showStepNumbers = true,
    showNavigation = true,
    showCloseButton = true,
    showSkipButton = true,
    showMask = true,
    updateUrlHash = false,
    onStart,
    onEnd,
    onStepChange,
    onStepShow,
    onSkip,
    nextButtonText = 'Next',
    backButtonText = 'Back',
    skipButtonText = 'Skip',
    closeButtonText = 'Close',
    lastStepButtonText = 'Finish',
    zIndex = 1000,
  } = options;

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  
  const currentStep = currentStepIndex >= 0 && currentStepIndex < steps.length 
    ? steps[currentStepIndex] 
    : null;
  
  const totalSteps = steps.length;
  const targetRef = useRef<HTMLElement | null>(null);

  // Get the target element for the current step
  const getTargetElement = useCallback((step: TourStep | null): HTMLElement | null => {
    if (!step) return null;
    
    if (typeof step.target === 'string') {
      return document.querySelector(step.target) as HTMLElement;
    } else if (step.target && step.target.current) {
      return step.target.current;
    }
    
    return null;
  }, []);

  // Scroll to the target element
  const scrollToTarget = useCallback((element: HTMLElement | null) => {
    if (!element) return;
    
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, []);

  // Start the tour
  const start = useCallback((stepIndex = initialStepIndex) => {
    if (!enabled || steps.length === 0) return;
    
    setCurrentStepIndex(stepIndex);
    setIsActive(true);
    setIsCompleted(false);
    onStart?.();
  }, [enabled, steps, initialStepIndex, onStart]);

  // End the tour
  const end = useCallback((completed = false) => {
    setIsActive(false);
    setCurrentStepIndex(-1);
    setIsCompleted(completed);
    onEnd?.(completed);
  }, [onEnd]);

  // Skip the tour
  const skip = useCallback(() => {
    setIsActive(false);
    setCurrentStepIndex(-1);
    onSkip?.();
  }, [onSkip]);

  // Go to the next step
  const next = useCallback(async () => {
    if (!isActive || currentStepIndex >= totalSteps - 1) {
      end(true);
      return;
    }
    
    const nextStepIndex = currentStepIndex + 1;
    const nextStep = steps[nextStepIndex];
    
    // Check if there's a beforeStep function
    if (nextStep.beforeStep) {
      const shouldProceed = await nextStep.beforeStep();
      if (!shouldProceed) return;
    }
    
    if (currentStep && nextStep) {
      onStepChange?.(currentStep, nextStep);
    }
    
    setCurrentStepIndex(nextStepIndex);
    onStepShow?.(nextStep);
    nextStep.afterStep?.();
  }, [isActive, currentStepIndex, totalSteps, steps, currentStep, onStepChange, onStepShow, end]);

  // Go to the previous step
  const prev = useCallback(() => {
    if (!isActive || currentStepIndex <= 0) return;
    
    const prevStepIndex = currentStepIndex - 1;
    const prevStep = steps[prevStepIndex];
    
    if (currentStep && prevStep) {
      onStepChange?.(currentStep, prevStep);
    }
    
    setCurrentStepIndex(prevStepIndex);
    onStepShow?.(prevStep);
    prevStep.afterStep?.();
  }, [isActive, currentStepIndex, steps, currentStep, onStepChange, onStepShow]);

  // Go to a specific step
  const goTo = useCallback(async (stepIndex: number) => {
    if (!isActive || stepIndex < 0 || stepIndex >= totalSteps) return;
    
    const targetStep = steps[stepIndex];
    
    // Check if there's a beforeStep function
    if (targetStep.beforeStep) {
      const shouldProceed = await targetStep.beforeStep();
      if (!shouldProceed) return;
    }
    
    if (currentStep && targetStep) {
      onStepChange?.(currentStep, targetStep);
    }
    
    setCurrentStepIndex(stepIndex);
    onStepShow?.(targetStep);
    targetStep.afterStep?.();
  }, [isActive, totalSteps, steps, currentStep, onStepChange, onStepShow]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive) return;
      
      switch (e.key) {
        case 'Escape':
          if (closeOnEscape) {
            end(false);
          }
          break;
        case 'ArrowRight':
          next();
          break;
        case 'ArrowLeft':
          prev();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, closeOnEscape, next, prev, end]);

  // Update URL hash if enabled
  useEffect(() => {
    if (!isActive || !updateUrlHash || currentStepIndex < 0) return;
    
    const step = steps[currentStepIndex];
    if (step) {
      window.location.hash = `tour-${step.id}`;
    }
    
    return () => {
      if (updateUrlHash) {
        window.location.hash = '';
      }
    };
  }, [isActive, updateUrlHash, currentStepIndex, steps]);

  // Update target ref and scroll if needed
  useEffect(() => {
    if (!isActive || !currentStep) return;
    
    const target = getTargetElement(currentStep);
    targetRef.current = target;
    
    if (target && currentStep.scrollToTarget) {
      scrollToTarget(target);
    }
  }, [isActive, currentStep, getTargetElement, scrollToTarget]);

  // Get the position of the current target element
  const getCurrentTargetPosition = useCallback((): DOMRect | null => {
    const target = targetRef.current;
    if (!target) return null;
    
    return target.getBoundingClientRect();
  }, []);

  // Get props for the tour container
  const getTourProps = useCallback(() => {
    return {
      'aria-live': 'assertive' as const,
      role: 'dialog',
    };
  }, []);

  // Get props for a step
  const getStepProps = useCallback((stepId: string) => {
    const isCurrentStep = currentStep && currentStep.id === stepId;
    
    return {
      'data-tour-step': stepId,
      'aria-hidden': !isCurrentStep,
    };
  }, [currentStep]);

  // Get props for the mask
  const getMaskProps = useCallback(() => {
    return {
      style: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: zIndex,
        pointerEvents: 'auto' as const,
      },
      onClick: closeOnClickOutside ? () => end(false) : undefined,
    };
  }, [closeOnClickOutside, end, zIndex]);

  // Get props for the tooltip
  const getTooltipProps = useCallback(() => {
    return {
      style: {
        position: 'absolute' as const,
        zIndex: zIndex + 1,
      },
      role: 'tooltip',
      'aria-modal': true,
    };
  }, [zIndex]);

  // Get props for the target element
  const getTargetProps = useCallback((stepId: string) => {
    return {
      'data-tour-target': stepId,
      tabIndex: 0,
      'aria-describedby': `tour-tooltip-${stepId}`,
    };
  }, []);

  return {
    currentStepIndex,
    currentStep,
    isActive,
    isCompleted,
    totalSteps,
    showMask,
    showStepNumbers,
    start,
    end,
    next,
    prev,
    goTo,
    skip,
    getTourProps,
    getStepProps,
    getMaskProps,
    getTooltipProps,
    getTargetProps,
    getCurrentTargetPosition,
  };
}

export default useTourGuide;
