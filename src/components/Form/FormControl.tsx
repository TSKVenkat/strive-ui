import React from 'react';
import styled from 'styled-components';
import { useFormContext } from './Form';

export interface FormControlProps {
  /**
   * The content of the form control (usually an input element)
   */
  children: React.ReactNode;
  /**
   * The label for the form control
   */
  label?: string;
  /**
   * Helper text to be displayed below the form control
   */
  helperText?: string;
  /**
   * Error message to be displayed (overrides helperText when present)
   */
  errorMessage?: string;
  /**
   * Whether the form control is required
   */
  isRequired?: boolean;
  /**
   * Whether the form control is disabled
   */
  isDisabled?: boolean;
  /**
   * Whether the form control has an error
   */
  isError?: boolean;
  /**
   * The name of the form control (used to match with form errors)
   */
  name?: string;
  /**
   * ID for the form control
   */
  id?: string;
}

const StyledFormControl = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledLabel = styled.label<{ isDisabled?: boolean; isError?: boolean; isRequired?: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme, isDisabled, isError }) => {
    if (isDisabled) return theme.colors.neutral[500];
    if (isError) return theme.colors.error;
    return theme.colors.neutral[800];
  }};
  
  ${({ isRequired, theme }) => isRequired && `
    &::after {
      content: " *";
      color: ${theme.colors.error};
    }
  `}
`;

const StyledHelperText = styled.div<{ isError?: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  margin-top: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme, isError }) => 
    isError ? theme.colors.error : theme.colors.neutral[600]
  };
`;

/**
 * FormControl component provides a consistent layout and styling for form elements
 * 
 * @example
 * ```jsx
 * <FormControl label="Email" helperText="Enter your email address" isRequired>
 *   <Input name="email" />
 * </FormControl>
 * ```
 */
export const FormControl: React.FC<FormControlProps> = ({
  children,
  label,
  helperText,
  errorMessage,
  isRequired = false,
  isDisabled = false,
  isError = false,
  name,
  id,
}) => {
  const formContext = useFormContext();
  const formError = name ? formContext.errors?.[name] : undefined;
  const displayError = errorMessage || formError;
  const hasError = isError || !!displayError;
  const controlId = id || name;
  
  // Clone the child element to pass necessary props
  const childElement = React.Children.only(children);
  const enhancedChild = React.cloneElement(childElement as React.ReactElement, {
    id: controlId,
    isDisabled,
    isError: hasError,
    'aria-invalid': hasError,
    'aria-describedby': helperText || displayError ? `${controlId}-helper` : undefined,
    ...(childElement as React.ReactElement).props,
  });

  return (
    <StyledFormControl>
      {label && (
        <StyledLabel 
          htmlFor={controlId}
          isDisabled={isDisabled}
          isError={hasError}
          isRequired={isRequired}
        >
          {label}
        </StyledLabel>
      )}
      {enhancedChild}
      {(displayError || helperText) && (
        <StyledHelperText 
          id={`${controlId}-helper`}
          isError={hasError}
        >
          {displayError || helperText}
        </StyledHelperText>
      )}
    </StyledFormControl>
  );
};
