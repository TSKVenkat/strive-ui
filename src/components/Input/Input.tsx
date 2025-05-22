import React, { forwardRef, InputHTMLAttributes } from 'react';
import styled, { css, DefaultTheme } from 'styled-components';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'outlined' | 'filled' | 'flushed';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** The size of the input */
  size?: InputSize;
  /** The variant of the input */
  variant?: InputVariant;
  /** Whether the input is in an error state */
  isError?: boolean;
  /** Whether the input is disabled */
  isDisabled?: boolean;
  /** Whether the input spans the full width of its container */
  fullWidth?: boolean;
  /** Label for the input */
  label?: string;
  /** Helper text to be displayed below the input */
  helperText?: string;
  /** Error message to be displayed when isError is true */
  errorText?: string;
}

const getSizeStyles = (size: InputSize) => {
  switch (size) {
    case 'sm':
      return css`
        font-size: ${({ theme }: { theme: any }) => theme.typography.fontSize.xs};
        padding: ${({ theme }: { theme: any }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
        height: 32px;
      `;
    case 'md':
      return css`
        font-size: ${({ theme }: { theme: any }) => theme.typography.fontSize.sm};
        padding: ${({ theme }: { theme: any }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
        height: 40px;
      `;
    case 'lg':
      return css`
        font-size: ${({ theme }: { theme: any }) => theme.typography.fontSize.md};
        padding: ${({ theme }: { theme: any }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
        height: 48px;
      `;
    default:
      return '';
  }
};

const getVariantStyles = (variant: InputVariant, isError: boolean) => {
  const errorColor = ({ theme }: { theme: any }) => theme.colors.error;
  const borderColor = ({ theme }: { theme: any }) => isError ? errorColor({ theme }) : theme.colors.neutral[400];
  const focusBorderColor = ({ theme }: { theme: any }) => isError ? errorColor({ theme }) : theme.colors.primary[500];
  
  switch (variant) {
    case 'outlined':
      return css`
        border: 1px solid ${borderColor};
        background-color: transparent;
        
        &:focus {
          border-color: ${focusBorderColor};
          box-shadow: 0 0 0 1px ${focusBorderColor};
        }
      `;
    case 'filled':
      return css`
        border: 1px solid transparent;
        background-color: ${({ theme }: { theme: any }) => theme.colors.neutral[200]};
        
        &:focus {
          background-color: ${({ theme }: { theme: any }) => theme.colors.neutral[100]};
          border-color: ${focusBorderColor};
        }
      `;
    case 'flushed':
      return css`
        border: none;
        border-bottom: 1px solid ${borderColor};
        border-radius: 0;
        padding-left: 0;
        padding-right: 0;
        background-color: transparent;
        
        &:focus {
          border-bottom: 2px solid ${focusBorderColor};
        }
      `;
    default:
      return '';
  }
};

const InputWrapper = styled.div<{ fullWidth?: boolean }>`
  display: inline-flex;
  flex-direction: column;
  width: ${({ fullWidth }: { fullWidth?: boolean }) => (fullWidth ? '100%' : 'auto')};
`;

const StyledLabel = styled.label`
  font-size: ${({ theme }: { theme: any }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }: { theme: any }) => theme.typography.fontWeight.medium};
  margin-bottom: ${({ theme }: { theme: any }) => theme.spacing[1]};
  color: ${({ theme }: { theme: any }) => theme.colors.neutral[700]};
`;

const StyledInput = styled.input<{
  $size: InputSize;
  $variant: InputVariant;
  $isError: boolean;
  $fullWidth: boolean;
}>`
  display: block;
  width: ${({ $fullWidth }: { $fullWidth: boolean }) => ($fullWidth ? '100%' : 'auto')};
  border-radius: ${({ theme, $variant }: { theme: any; $variant: InputVariant }) => $variant === 'flushed' ? '0' : theme.borderRadius.md};
  outline: none;
  transition: all ${({ theme }: { theme: any }) => theme.animation.duration.fast} ${({ theme }: { theme: any }) => theme.animation.easing.easeInOut};
  
  ${({ $size }: { $size: InputSize }) => getSizeStyles($size)};
  ${({ $variant, $isError }: { $variant: InputVariant; $isError: boolean }) => getVariantStyles($variant, $isError)};
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: ${({ theme }: { theme: any }) => theme.colors.neutral[500]};
  }
`;

const HelperText = styled.div<{ isError: boolean }>`
  font-size: ${({ theme }: { theme: any }) => theme.typography.fontSize.xs};
  margin-top: ${({ theme }: { theme: any }) => theme.spacing[1]};
  color: ${({ theme, isError }: { theme: any; isError: boolean }) => isError ? theme.colors.error : theme.colors.neutral[600]};
`;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      variant = 'outlined',
      isError = false,
      isDisabled = false,
      fullWidth = false,
      label,
      helperText,
      errorText,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
    const displayHelperText = isError ? errorText : helperText;

    return (
      <InputWrapper fullWidth={fullWidth}>
        {label && <StyledLabel htmlFor={inputId}>{label}</StyledLabel>}
        <StyledInput
          ref={ref}
          id={inputId}
          $size={size}
          $variant={variant}
          $isError={isError}
          $fullWidth={fullWidth}
          disabled={isDisabled}
          {...props}
        />
        {displayHelperText && (
          <HelperText isError={isError}>{displayHelperText}</HelperText>
        )}
      </InputWrapper>
    );
  }
);

Input.displayName = 'Input';
