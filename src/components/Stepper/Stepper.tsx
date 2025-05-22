import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

export interface StepperProps {
  /** Current active step (0-indexed) */
  activeStep: number;
  /** Array of step labels */
  steps: string[];
  /** Orientation of the stepper */
  orientation?: 'horizontal' | 'vertical';
  /** Whether to alternate the step label positions (horizontal orientation only) */
  alternateLabels?: boolean;
  /** Whether to show step numbers */
  showStepNumbers?: boolean;
  /** Whether steps are clickable */
  clickable?: boolean;
  /** Callback fired when a step is clicked */
  onStepClick?: (step: number) => void;
  /** Custom component to render for completed steps */
  completedIcon?: React.ReactNode;
  /** Custom component to render for the active step */
  activeIcon?: React.ReactNode;
}

interface StepProps {
  label: string;
  index: number;
  active: boolean;
  completed: boolean;
  last: boolean;
  orientation: 'horizontal' | 'vertical';
  alternateLabels: boolean;
  showStepNumber: boolean;
  clickable: boolean;
  onStepClick?: (step: number) => void;
  completedIcon?: React.ReactNode;
  activeIcon?: React.ReactNode;
}

const StepperContainer = styled.div<{
  orientation: 'horizontal' | 'vertical';
}>`
  display: flex;
  flex-direction: ${({ orientation }) => (orientation === 'horizontal' ? 'row' : 'column')};
  width: 100%;
  ${({ orientation }) => orientation === 'horizontal' && 'justify-content: space-between;'}
`;

const StepContainer = styled.div<{
  orientation: 'horizontal' | 'vertical';
  alternateLabels: boolean;
  clickable: boolean;
  index: number;
}>`
  display: flex;
  flex-direction: ${({ orientation, alternateLabels, index }) =>
    orientation === 'vertical'
      ? 'row'
      : alternateLabels
      ? index % 2 === 0
        ? 'column'
        : 'column-reverse'
      : 'column'};
  align-items: center;
  flex: ${({ orientation }) => (orientation === 'horizontal' ? '1' : 'none')};
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};
  position: relative;
  
  ${({ orientation }) =>
    orientation === 'vertical' &&
    `
    margin-bottom: 24px;
    &:last-child {
      margin-bottom: 0;
    }
  `}
`;

const StepIconContainer = styled.div<{
  active: boolean;
  completed: boolean;
}>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, active, completed }) =>
    active
      ? theme.colors.primary[600]
      : completed
      ? theme.colors.success
      : theme.colors.neutral[300]};
  color: ${({ theme }) => theme.colors.neutral[100]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: all ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeInOut};
  z-index: 1;
`;

const StepLabel = styled.div<{
  active: boolean;
  completed: boolean;
  orientation: 'horizontal' | 'vertical';
}>`
  margin: ${({ orientation }) => (orientation === 'horizontal' ? '8px 0 0' : '0 0 0 16px')};
  color: ${({ theme, active, completed }) =>
    active
      ? theme.colors.primary[600]
      : completed
      ? theme.colors.success
      : theme.colors.neutral[600]};
  font-weight: ${({ theme, active }) =>
    active ? theme.typography.fontWeight.medium : theme.typography.fontWeight.regular};
  text-align: ${({ orientation }) => (orientation === 'horizontal' ? 'center' : 'left')};
  transition: all ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeInOut};
`;

const StepConnector = styled.div<{
  orientation: 'horizontal' | 'vertical';
  completed: boolean;
}>`
  flex: 1;
  height: ${({ orientation }) => (orientation === 'horizontal' ? '1px' : 'auto')};
  width: ${({ orientation }) => (orientation === 'horizontal' ? 'auto' : '1px')};
  background-color: ${({ theme, completed }) =>
    completed ? theme.colors.success : theme.colors.neutral[300]};
  
  ${({ orientation }) =>
    orientation === 'horizontal'
      ? `
      margin: 0 -8px;
      position: relative;
      top: 16px;
      z-index: 0;
    `
      : `
      position: absolute;
      left: 16px;
      top: 32px;
      bottom: -24px;
    `}
`;

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="currentColor" />
  </svg>
);

const Step: React.FC<StepProps> = ({
  label,
  index,
  active,
  completed,
  last,
  orientation,
  alternateLabels,
  showStepNumber,
  clickable,
  onStepClick,
  completedIcon,
  activeIcon,
}) => {
  const handleClick = () => {
    if (clickable && onStepClick) {
      onStepClick(index);
    }
  };

  return (
    <StepContainer
      orientation={orientation}
      alternateLabels={alternateLabels}
      clickable={clickable}
      index={index}
      onClick={handleClick}
      role={clickable ? 'button' : undefined}
      aria-current={active ? 'step' : undefined}
    >
      <StepIconContainer active={active} completed={completed}>
        {completed ? (
          completedIcon || <CheckIcon />
        ) : active ? (
          activeIcon || (showStepNumber ? index + 1 : '')
        ) : (
          showStepNumber ? index + 1 : ''
        )}
      </StepIconContainer>
      
      <StepLabel active={active} completed={completed} orientation={orientation}>
        {label}
      </StepLabel>
      
      {!last && (
        <StepConnector orientation={orientation} completed={completed} />
      )}
    </StepContainer>
  );
};

export const Stepper = ({
  activeStep,
  steps,
  orientation = 'horizontal',
  alternateLabels = false,
  showStepNumbers = true,
  clickable = false,
  onStepClick,
  completedIcon,
  activeIcon,
}: StepperProps) => {
  return (
    <StepperContainer orientation={orientation} role="navigation" aria-label="Progress">
      {steps.map((label, index) => (
        <Step
          key={index}
          label={label}
          index={index}
          active={index === activeStep}
          completed={index < activeStep}
          last={index === steps.length - 1}
          orientation={orientation}
          alternateLabels={alternateLabels && orientation === 'horizontal'}
          showStepNumber={showStepNumbers}
          clickable={clickable}
          onStepClick={onStepClick}
          completedIcon={completedIcon}
          activeIcon={activeIcon}
        />
      ))}
    </StepperContainer>
  );
};

Stepper.displayName = 'Stepper';
