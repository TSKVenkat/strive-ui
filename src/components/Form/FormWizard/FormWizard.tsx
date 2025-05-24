import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { FormWizardHeadless, RootProps as HeadlessRootProps } from './FormWizardHeadless';
import { FormWizardStep, FormWizardDirection, FormWizardVariant, FormWizardSize, FormWizardTransition } from './useFormWizard';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

// Styled components
const StyledRoot = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ theme }) => theme.colors.text.primary};
  width: 100%;
  
  @media (prefers-reduced-motion: reduce) {
    * {
      transition: none !important;
      animation: none !important;
    }
  }
`;

const StyledStepper = styled(FormWizardHeadless.Stepper)<{ 
  $variant: FormWizardVariant; 
  $size: FormWizardSize;
  $direction: FormWizardDirection;
}>`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return css`
          font-size: ${({ theme }) => theme.typography.fontSize.sm};
        `;
      case 'lg':
        return css`
          font-size: ${({ theme }) => theme.typography.fontSize.lg};
        `;
      default:
        return css`
          font-size: ${({ theme }) => theme.typography.fontSize.md};
        `;
    }
  }}
  
  ${({ $variant, $direction, theme }) => {
    if ($variant === 'numbered') {
      return css`
        .step-indicator {
          border-radius: 50%;
          background-color: ${theme.colors.neutral[200]};
          color: ${theme.colors.neutral[700]};
          font-weight: ${theme.typography.fontWeight.medium};
          
          &.active {
            background-color: ${theme.colors.primary[500]};
            color: ${theme.colors.common.white};
          }
          
          &.completed {
            background-color: ${theme.colors.success[500]};
            color: ${theme.colors.common.white};
          }
          
          &.error {
            background-color: ${theme.colors.error[500]};
            color: ${theme.colors.common.white};
          }
        }
        
        .connector {
          ${$direction === 'horizontal' 
            ? `height: 2px; background-color: ${theme.colors.neutral[200]};` 
            : `width: 2px; background-color: ${theme.colors.neutral[200]};`}
          
          &.active {
            background-color: ${theme.colors.primary[500]};
          }
        }
      `;
    }
    
    if ($variant === 'dots') {
      return css`
        .step-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: ${theme.colors.neutral[200]};
          
          &.active {
            background-color: ${theme.colors.primary[500]};
            transform: scale(1.2);
          }
          
          &.completed {
            background-color: ${theme.colors.success[500]};
          }
          
          &.error {
            background-color: ${theme.colors.error[500]};
          }
        }
        
        .connector {
          ${$direction === 'horizontal' 
            ? `height: 2px; background-color: ${theme.colors.neutral[200]};` 
            : `width: 2px; background-color: ${theme.colors.neutral[200]};`}
          
          &.active {
            background-color: ${theme.colors.primary[500]};
          }
        }
      `;
    }
    
    if ($variant === 'progress') {
      return css`
        position: relative;
        
        &::before {
          content: '';
          position: absolute;
          ${$direction === 'horizontal' 
            ? `top: 50%; left: 0; right: 0; height: 4px;` 
            : `left: 50%; top: 0; bottom: 0; width: 4px;`}
          background-color: ${theme.colors.neutral[200]};
          z-index: 0;
          ${$direction === 'horizontal' 
            ? `transform: translateY(-50%);` 
            : `transform: translateX(-50%);`}
        }
        
        &::after {
          content: '';
          position: absolute;
          ${$direction === 'horizontal' 
            ? `top: 50%; left: 0; height: 4px;` 
            : `left: 50%; top: 0; width: 4px;`}
          background-color: ${theme.colors.primary[500]};
          z-index: 0;
          ${$direction === 'horizontal' 
            ? `transform: translateY(-50%);` 
            : `transform: translateX(-50%);`}
          transition: all 0.3s ease;
        }
        
        .step-indicator {
          z-index: 1;
          background-color: ${theme.colors.common.white};
          border: 2px solid ${theme.colors.neutral[200]};
          
          &.active {
            border-color: ${theme.colors.primary[500]};
          }
          
          &.completed {
            border-color: ${theme.colors.success[500]};
            background-color: ${theme.colors.success[500]};
            color: ${theme.colors.common.white};
          }
          
          &.error {
            border-color: ${theme.colors.error[500]};
            background-color: ${theme.colors.error[500]};
            color: ${theme.colors.common.white};
          }
        }
      `;
    }
    
    // Default variant
    return css`
      .step-indicator {
        border-radius: 50%;
        border: 2px solid ${theme.colors.neutral[200]};
        background-color: ${theme.colors.common.white};
        color: ${theme.colors.neutral[700]};
        
        &.active {
          border-color: ${theme.colors.primary[500]};
          color: ${theme.colors.primary[500]};
        }
        
        &.completed {
          border-color: ${theme.colors.success[500]};
          background-color: ${theme.colors.success[500]};
          color: ${theme.colors.common.white};
        }
        
        &.error {
          border-color: ${theme.colors.error[500]};
          background-color: ${theme.colors.error[500]};
          color: ${theme.colors.common.white};
        }
      }
      
      .connector {
        ${$direction === 'horizontal' 
          ? `height: 2px; background-color: ${theme.colors.neutral[200]};` 
          : `width: 2px; background-color: ${theme.colors.neutral[200]};`}
        
        &.active {
          background-color: ${theme.colors.primary[500]};
        }
      }
    `;
  }}
`;

const StyledStepContainer = styled(FormWizardHeadless.StepContainer)`
  min-height: 200px;
  padding: ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.common.white};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const StyledNavigation = styled(FormWizardHeadless.Navigation)`
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const StyledBackButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[200]};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledNextButton = styled.button<{ $isLastStep?: boolean }>`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  background-color: ${({ theme, $isLastStep }) => 
    $isLastStep ? theme.colors.success[500] : theme.colors.primary[500]};
  color: ${({ theme }) => theme.colors.common.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: ${({ theme, $isLastStep }) => 
      $isLastStep ? theme.colors.success[600] : theme.colors.primary[600]};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme, $isLastStep }) => 
      $isLastStep ? theme.colors.success[200] : theme.colors.primary[200]};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledProgress = styled(FormWizardHeadless.Progress)`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  .progress-bar {
    height: 8px;
    background-color: ${({ theme }) => theme.colors.neutral[200]};
    border-radius: ${({ theme }) => theme.borderRadius.pill};
    overflow: hidden;
  }
  
  .progress-bar-fill {
    height: 100%;
    background-color: ${({ theme }) => theme.colors.primary[500]};
    transition: width 0.3s ease;
  }
  
  .progress-info {
    display: flex;
    justify-content: space-between;
    margin-top: ${({ theme }) => theme.spacing[1]};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const StyledSummary = styled(FormWizardHeadless.Summary)`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  .summary-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .summary-item {
    padding: ${({ theme }) => theme.spacing[2]};
    margin-bottom: ${({ theme }) => theme.spacing[1]};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    transition: all 0.2s ease;
    
    &.active {
      background-color: ${({ theme }) => theme.colors.primary[50]};
      border-left: 3px solid ${({ theme }) => theme.colors.primary[500]};
    }
    
    &.completed {
      border-left: 3px solid ${({ theme }) => theme.colors.success[500]};
    }
    
    &.error {
      border-left: 3px solid ${({ theme }) => theme.colors.error[500]};
    }
    
    &:not(.active):not(.completed):not(.error) {
      border-left: 3px solid ${({ theme }) => theme.colors.neutral[200]};
    }
  }
  
  .summary-item-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .summary-item-title {
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  }
  
  .summary-item-subtitle {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
  }
  
  .summary-item-status {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    
    &.completed {
      background-color: ${({ theme }) => theme.colors.success[500]};
      color: ${({ theme }) => theme.colors.common.white};
    }
    
    &.error {
      background-color: ${({ theme }) => theme.colors.error[500]};
      color: ${({ theme }) => theme.colors.common.white};
    }
    
    &:not(.completed):not(.error) {
      background-color: ${({ theme }) => theme.colors.neutral[200]};
      color: ${({ theme }) => theme.colors.neutral[700]};
    }
  }
`;

// FormWizard component props
export interface FormWizardProps extends Omit<HeadlessRootProps, 'children'> {
  /**
   * Children to render in each step
   */
  children: React.ReactNode | React.ReactNode[];
  /**
   * Whether to show the stepper
   */
  showStepper?: boolean;
  /**
   * Whether to show the progress bar
   */
  showProgress?: boolean;
  /**
   * Whether to show the summary
   */
  showSummary?: boolean;
  /**
   * Whether to show the navigation buttons
   */
  showNavigation?: boolean;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Custom styles
   */
  style?: React.CSSProperties;
}

/**
 * FormWizard component for creating multi-step forms with validation, navigation, and state management.
 * 
 * @example
 * ```jsx
 * import { FormWizard } from 'strive-ui';
 * 
 * function MyWizard() {
 *   const steps = [
 *     { id: 'personal', title: 'Personal Info' },
 *     { id: 'address', title: 'Address', optional: true },
 *     { id: 'review', title: 'Review' }
 *   ];
 *   
 *   return (
 *     <FormWizard
 *       steps={steps}
 *       validateOnNext
 *       onComplete={(data) => console.log('Form completed:', data)}
 *     >
 *       <div>Personal Info Form</div>
 *       <div>Address Form</div>
 *       <div>Review Form</div>
 *     </FormWizard>
 *   );
 * }
 * ```
 */
export const FormWizard = forwardRef<HTMLDivElement, FormWizardProps>(({
  children,
  showStepper = true,
  showProgress = true,
  showSummary = false,
  showNavigation = true,
  variant = 'default',
  size = 'md',
  direction = 'horizontal',
  transition = 'fade',
  className,
  style,
  ...options
}, ref) => {
  // Convert children to array
  const childrenArray = React.Children.toArray(children);
  
  // Ensure we have the same number of children as steps
  if (childrenArray.length !== options.steps.length) {
    console.warn(`FormWizard: Number of children (${childrenArray.length}) does not match number of steps (${options.steps.length})`);
  }
  
  return (
    <FormWizardHeadless.Root
      variant={variant}
      size={size}
      direction={direction}
      transition={transition}
      {...options}
    >
      <StyledRoot ref={ref} className={className} style={style}>
        {showStepper && (
          <StyledStepper
            $variant={variant}
            $size={size}
            $direction={direction}
            showConnector
            showNumbers={variant !== 'dots'}
            showIcons
            showTitles
            showSubtitles={size !== 'sm'}
            showStatus
            clickable={!options.linear}
          />
        )}
        
        {showProgress && (
          <StyledProgress
            showPercentage
            showStepCount
          />
        )}
        
        {showSummary && (
          <StyledSummary
            showTitles
            showStatus
            renderStep={(step, index, isActive) => (
              <div className={`summary-item-content ${isActive ? 'active' : ''}`}>
                <div>
                  <div className="summary-item-title">{step.title}</div>
                  {step.subtitle && (
                    <div className="summary-item-subtitle">{step.subtitle}</div>
                  )}
                </div>
                <div className={`summary-item-status ${step.completed ? 'completed' : ''} ${step.hasError ? 'error' : ''}`}>
                  {step.completed && !step.hasError ? '✓' : step.hasError ? '✗' : index + 1}
                </div>
              </div>
            )}
          />
        )}
        
        <StyledStepContainer>
          {childrenArray.map((child, index) => (
            <FormWizardHeadless.Step key={index} index={index}>
              {child}
            </FormWizardHeadless.Step>
          ))}
        </StyledStepContainer>
        
        {showNavigation && (
          <StyledNavigation
            showBackButton={options.allowBackNavigation !== false}
            showNextButton
            renderBackButton={({ onClick, disabled }) => (
              <StyledBackButton onClick={onClick} disabled={disabled}>
                Back
              </StyledBackButton>
            )}
            renderNextButton={({ onClick, disabled, isLastStep }) => (
              <StyledNextButton onClick={onClick} disabled={disabled} $isLastStep={isLastStep}>
                {isLastStep ? 'Finish' : 'Next'}
              </StyledNextButton>
            )}
          />
        )}
      </StyledRoot>
    </FormWizardHeadless.Root>
  );
});

FormWizard.displayName = 'FormWizard';

export default FormWizard;
