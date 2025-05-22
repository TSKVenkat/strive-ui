import React from 'react';
import styled, { keyframes } from 'styled-components';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerColor = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'current';

export interface SpinnerProps {
  /** The size of the spinner */
  size?: SpinnerSize;
  /** The color of the spinner */
  color?: SpinnerColor;
  /** The thickness of the spinner's stroke */
  thickness?: number;
  /** The speed of the spinner's animation */
  speed?: number;
  /** Whether to show the spinner with a label */
  withLabel?: boolean;
  /** The label to show with the spinner */
  label?: string;
  /** Additional CSS className */
  className?: string;
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

interface StyledSpinnerProps {
  $size: SpinnerSize;
  $color: SpinnerColor;
  $thickness: number;
  $speed: number;
}

const getSpinnerSize = (size: SpinnerSize): string => {
  switch (size) {
    case 'xs':
      return '16px';
    case 'sm':
      return '24px';
    case 'md':
      return '36px';
    case 'lg':
      return '48px';
    case 'xl':
      return '64px';
    default:
      return '36px';
  }
};

const getSpinnerColor = (color: SpinnerColor, theme: any): string => {
  if (color === 'current') return 'currentColor';
  
  switch (color) {
    case 'primary':
      return theme.colors.primary[600];
    case 'success':
      return theme.colors.success;
    case 'warning':
      return theme.colors.warning;
    case 'error':
      return theme.colors.error;
    case 'info':
      return theme.colors.info;
    case 'neutral':
      return theme.colors.neutral[600];
    default:
      return theme.colors.primary[600];
  }
};

const StyledSpinner = styled.div<StyledSpinnerProps>`
  display: inline-block;
  width: ${({ $size }) => getSpinnerSize($size)};
  height: ${({ $size }) => getSpinnerSize($size)};
  border: ${({ $thickness }) => $thickness}px solid rgba(0, 0, 0, 0.1);
  border-top-color: ${({ $color, theme }) => getSpinnerColor($color, theme)};
  border-radius: 50%;
  animation: ${spin} ${({ $speed }) => $speed}s linear infinite;
`;

const SpinnerContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SpinnerLabel = styled.div<{ $size: SpinnerSize }>`
  margin-top: ${({ theme, $size }) => {
    switch ($size) {
      case 'xs':
      case 'sm':
        return theme.spacing[1];
      default:
        return theme.spacing[2];
    }
  }};
  font-size: ${({ theme, $size }) => {
    switch ($size) {
      case 'xs':
        return theme.typography.fontSize.xs;
      case 'sm':
        return theme.typography.fontSize.sm;
      case 'lg':
      case 'xl':
        return theme.typography.fontSize.md;
      default:
        return theme.typography.fontSize.sm;
    }
  }};
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  thickness = 2,
  speed = 0.75,
  withLabel = false,
  label = 'Loading...',
  className,
}) => {
  return (
    <SpinnerContainer className={className}>
      <StyledSpinner
        $size={size}
        $color={color}
        $thickness={thickness}
        $speed={speed}
      />
      {withLabel && <SpinnerLabel $size={size}>{label}</SpinnerLabel>}
    </SpinnerContainer>
  );
};

Spinner.displayName = 'Spinner';
