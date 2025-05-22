import React, { forwardRef, InputHTMLAttributes, useRef, useEffect } from 'react';
import styled, { DefaultTheme } from 'styled-components';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label for the checkbox */
  label?: string;
  /** Whether the checkbox is checked */
  checked?: boolean;
  /** Whether the checkbox is in an indeterminate state */
  indeterminate?: boolean;
  /** Whether the checkbox is disabled */
  isDisabled?: boolean;
  /** Whether the checkbox has an error */
  isError?: boolean;
  /** Helper text to display below the checkbox */
  helperText?: string;
  /** Error message to be displayed when isError is true */
  errorText?: string;
  /** The size of the checkbox */
  size?: CheckboxSize;
}

interface CheckboxContainerProps {
  size?: CheckboxSize;
  isDisabled?: boolean;
}

const CheckboxContainer = styled.div<CheckboxContainerProps>`
  display: flex;
  align-items: center;
  position: relative;
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

interface StyledCheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  isDisabled?: boolean;
  isError?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const getCheckboxSize = (size?: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm':
      return '16px';
    case 'lg':
      return '24px';
    case 'md':
    default:
      return '20px';
  }
};

const StyledCheckbox = styled.div<StyledCheckboxProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ size }) => getCheckboxSize(size)};
  height: ${({ size }) => getCheckboxSize(size)};
  background: ${({ checked, indeterminate, theme, isError }) => {
    if (isError) return theme.colors.error;
    if (checked || indeterminate) return theme.colors.primary[600];
    return theme.colors.neutral[100];
  }};
  border: 2px solid ${({ checked, indeterminate, theme, isError }) => {
    if (isError) return theme.colors.error;
    if (checked || indeterminate) return theme.colors.primary[600];
    return theme.colors.neutral[400];
  }};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all 150ms;
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.6 : 1)};
  
  ${HiddenCheckbox}:focus + & {
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[200]};
  }
  
  ${HiddenCheckbox}:hover + & {
    border-color: ${({ checked, indeterminate, theme, isDisabled, isError }) => {
      if (isDisabled) return;
      if (isError) return theme.colors.error;
      if (checked || indeterminate) return theme.colors.primary[700];
      return theme.colors.primary[500];
    }};
  }
`;

const CheckIcon = styled.svg<{ size?: 'sm' | 'md' | 'lg' }>`
  fill: none;
  stroke: white;
  stroke-width: 2px;
  width: ${({ size }) => {
    switch (size) {
      case 'sm':
        return '10px';
      case 'lg':
        return '16px';
      case 'md':
      default:
        return '14px';
    }
  }};
  height: ${({ size }) => {
    switch (size) {
      case 'sm':
        return '10px';
      case 'lg':
        return '16px';
      case 'md':
      default:
        return '14px';
    }
  }};
`;

const IndeterminateIcon = styled.div<{ size?: 'sm' | 'md' | 'lg' }>`
  width: ${({ size }) => {
    switch (size) {
      case 'sm':
        return '8px';
      case 'lg':
        return '12px';
      case 'md':
      default:
        return '10px';
    }
  }};
  height: 2px;
  background-color: white;
`;

const Label = styled.label<{ isDisabled?: boolean; size?: 'sm' | 'md' | 'lg' }>`
  margin-left: 8px;
  font-size: ${({ size, theme }) => {
    switch (size) {
      case 'sm':
        return theme.typography.fontSize.xs;
      case 'lg':
        return theme.typography.fontSize.md;
      case 'md':
      default:
        return theme.typography.fontSize.sm;
    }
  }};
  color: ${({ isDisabled, theme }) =>
    isDisabled ? theme.colors.neutral[500] : theme.colors.neutral[800]};
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
`;

const HelperText = styled.div<{ isError: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  margin-top: ${({ theme }) => theme.spacing[1]};
  margin-left: ${({ theme }) => theme.spacing[6]};
  color: ${({ theme, isError }) => isError ? theme.colors.error : theme.colors.neutral[600]};
`;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ 
    label,
    checked = false,
    indeterminate = false,
    isDisabled = false,
    isError = false,
    helperText,
    errorText,
    size = 'md',
    onChange,
    ...props 
  }, ref) => {
    const displayHelperText = isError ? errorText : helperText;
    
    // Handle the indeterminate property which isn't a standard HTML attribute
    const inputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    // Create a ref callback function that handles both refs
    const setInputRef = (node: HTMLInputElement | null) => {
      // Store the node in our internal ref
      if (node) {
        // We need to use a function to set the current property
        // because it's readonly in the type definition
        Object.defineProperty(inputRef, 'current', {
          value: node,
          writable: true
        });
      }
      
      // Forward the ref
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        // Cast to mutable ref to avoid TypeScript error
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      }
    };

    return (
      <div>
        <CheckboxContainer isDisabled={isDisabled}>
          <HiddenCheckbox
            ref={setInputRef}
            checked={checked}
            disabled={isDisabled}
            onChange={onChange}
            {...props}
          />
          <StyledCheckbox
            checked={checked}
            indeterminate={indeterminate}
            isDisabled={isDisabled}
            isError={isError}
            size={size}
          >
            {checked && !indeterminate && <CheckIcon />}
            {indeterminate && <IndeterminateIcon />}
          </StyledCheckbox>
          {label && (
            <Label isDisabled={isDisabled} size={size}>
              {label}
            </Label>
          )}
        </CheckboxContainer>
        {displayHelperText && (
          <HelperText isError={isError}>{displayHelperText}</HelperText>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
