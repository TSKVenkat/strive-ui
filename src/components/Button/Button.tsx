import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import styled, { css } from 'styled-components';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The button variant that determines the button's style */
  variant?: ButtonVariant;
  /** The size of the button */
  size?: ButtonSize;
  /** Whether the button takes up the full width of its container */
  fullWidth?: boolean;
  /** Whether the button is in a loading state */
  isLoading?: boolean;
  /** The content of the button */
  children: React.ReactNode;
}

const getVariantStyles = (variant: ButtonVariant) => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: ${({ theme }) => theme.colors.primary[600]};
        color: ${({ theme }) => theme.colors.neutral[100]};
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.primary[700]};
        }
        &:active:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.primary[800]};
        }
      `;
    case 'secondary':
      return css`
        background-color: ${({ theme }) => theme.colors.neutral[200]};
        color: ${({ theme }) => theme.colors.neutral[800]};
        border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.neutral[300]};
        }
        &:active:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.neutral[400]};
        }
      `;
    case 'tertiary':
      return css`
        background-color: transparent;
        color: ${({ theme }) => theme.colors.primary[600]};
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.primary[100]};
        }
        &:active:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.primary[200]};
        }
      `;
    case 'danger':
      return css`
        background-color: ${({ theme }) => theme.colors.error};
        color: ${({ theme }) => theme.colors.neutral[100]};
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => `${theme.colors.error}dd`}; /* Slightly darker with opacity */
        }
        &:active:not(:disabled) {
          background-color: ${({ theme }) => `${theme.colors.error}bb`}; /* Even darker with opacity */
        }
      `;
    default:
      return '';
  }
};

const getSizeStyles = (size: ButtonSize) => {
  switch (size) {
    case 'sm':
      return css`
        font-size: ${({ theme }) => theme.typography.fontSize.xs};
        padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
      `;
    case 'md':
      return css`
        font-size: ${({ theme }) => theme.typography.fontSize.sm};
        padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
      `;
    case 'lg':
      return css`
        font-size: ${({ theme }) => theme.typography.fontSize.md};
        padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
      `;
    default:
      return '';
  }
};

const StyledButton = styled.button<Omit<ButtonProps, 'children'>>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeInOut};
  border: none;
  outline: none;
  white-space: nowrap;
  
  ${({ variant = 'primary' }) => getVariantStyles(variant)};
  ${({ size = 'md' }) => getSizeStyles(size)};
  ${({ fullWidth }) => fullWidth && css`width: 100%;`};
  
  &:focus-visible {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[300]};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  ${({ isLoading }) =>
    isLoading &&
    css`
      position: relative;
      color: transparent;
      
      &::after {
        content: "";
        position: absolute;
        width: 1em;
        height: 1em;
        border-radius: 50%;
        border: 2px solid currentColor;
        border-right-color: transparent;
        animation: spin 0.75s linear infinite;
      }
      
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `}
`;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', fullWidth = false, isLoading = false, ...props }, ref) => {
    return (
      <StyledButton
        ref={ref}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        isLoading={isLoading}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {children}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';
