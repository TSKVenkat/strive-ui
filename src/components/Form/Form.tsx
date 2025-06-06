import React from 'react';
import styled from 'styled-components';
import Form from './FormHeadless';
import { FieldConfig, ValidationRule } from './hooks/useForm';

// Styled components for form elements
const StyledForm = styled.form<{ spacing?: 'sm' | 'md' | 'lg' }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  
  & > * + * {
    margin-top: ${({ spacing, theme }) => {
      switch (spacing) {
        case 'sm':
          return theme.spacing[2];
        case 'lg':
          return theme.spacing[6];
        case 'md':
        default:
          return theme.spacing[4];
      }
    }};
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[800]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const HelperText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.neutral[600]};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

const ErrorMessage = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.error.main};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

const StyledInput = styled.input`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  width: 100%;
  transition: all 0.2s ease-in-out;
  outline: none;
  color: ${({ theme }) => theme.colors.neutral[900]};
  background-color: ${({ theme }) => theme.colors.common.white};
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary.main};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[100]};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
    cursor: not-allowed;
  }
  
  &[aria-invalid="true"] {
    border-color: ${({ theme }) => theme.colors.error.main};
    
    &:focus {
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.error[100]};
    }
  }
`;

const StyledTextarea = styled.textarea`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  width: 100%;
  min-height: 100px;
  transition: all 0.2s ease-in-out;
  outline: none;
  color: ${({ theme }) => theme.colors.neutral[900]};
  background-color: ${({ theme }) => theme.colors.common.white};
  resize: vertical;
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary.main};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[100]};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
    cursor: not-allowed;
  }
  
  &[aria-invalid="true"] {
    border-color: ${({ theme }) => theme.colors.error.main};
    
    &:focus {
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.error[100]};
    }
  }
`;

const StyledSelect = styled.select`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  width: 100%;
  transition: all 0.2s ease-in-out;
  outline: none;
  color: ${({ theme }) => theme.colors.neutral[900]};
  background-color: ${({ theme }) => theme.colors.common.white};
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23718096' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 40px;
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary.main};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[100]};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
    cursor: not-allowed;
  }
  
  &[aria-invalid="true"] {
    border-color: ${({ theme }) => theme.colors.error.main};
    
    &:focus {
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.error[100]};
    }
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledCheckbox = styled.input`
  width: 16px;
  height: 16px;
  margin-right: ${({ theme }) => theme.spacing[2]};
  accent-color: ${({ theme }) => theme.colors.primary.main};
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CheckboxLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[800]};
  user-select: none;
`;

const SubmitButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: none;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background-color: ${({ theme }) => theme.colors.primary.main};
  color: ${({ theme }) => theme.colors.common.white};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[600]};
  }
  
  &:focus {
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary.light};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.neutral[300]};
    cursor: not-allowed;
  }
`;

// Form component props
export interface StyledFormProps extends React.ComponentProps<typeof Form.Root> {
  /**
   * Spacing between form elements
   */
  spacing?: 'sm' | 'md' | 'lg';
}

/**
 * Styled Form component that provides form functionality with styling
 * 
 * @example
 * ```jsx
 * <FormStyled onSubmit={handleSubmit}>
 *   <FormStyled.Input name="email" label="Email" validation={{ required: true }} />
 *   <FormStyled.SubmitButton>Submit</FormStyled.SubmitButton>
 * </FormStyled>
 * ```
 */
export const FormStyled = React.forwardRef<HTMLFormElement, StyledFormProps>(
  ({ spacing = 'md', children, ...props }, ref) => {
    return (
      <Form.Root ref={ref} {...props}>
        <StyledForm spacing={spacing}>
          {children}
        </StyledForm>
      </Form.Root>
    );
  }
);

FormStyled.displayName = 'FormStyled';

// Input component props
export interface InputProps extends Omit<React.ComponentProps<typeof Form.Input>, 'as'> {
  /**
   * Label for the input
   */
  label?: string;
  /**
   * Helper text for the input
   */
  helperText?: string;
}

/**
 * Styled Input component
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ name, validation, label, helperText, ...props }, ref) => {
    return (
      <FormGroup>
        {label && <Label htmlFor={`form-field-${name}`}>{label}</Label>}
        <Form.Input
          ref={ref}
          name={name}
          validation={validation}
          {...props}
          render={(inputProps) => <StyledInput {...inputProps} />}
        />
        {helperText && <HelperText>{helperText}</HelperText>}
        <Form.ErrorMessage name={name} render={(errorProps) => <ErrorMessage {...errorProps} />} />
      </FormGroup>
    );
  }
);

Input.displayName = 'FormStyled.Input';

// Textarea component props
export interface TextareaProps extends Omit<React.ComponentProps<typeof Form.Textarea>, 'as'> {
  /**
   * Label for the textarea
   */
  label?: string;
  /**
   * Helper text for the textarea
   */
  helperText?: string;
}

/**
 * Styled Textarea component
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ name, validation, label, helperText, ...props }, ref) => {
    return (
      <FormGroup>
        {label && <Label htmlFor={`form-field-${name}`}>{label}</Label>}
        <Form.Textarea
          ref={ref}
          name={name}
          validation={validation}
          {...props}
          render={(textareaProps) => <StyledTextarea {...textareaProps} />}
        />
        {helperText && <HelperText>{helperText}</HelperText>}
        <Form.ErrorMessage name={name} render={(errorProps) => <ErrorMessage {...errorProps} />} />
      </FormGroup>
    );
  }
);

Textarea.displayName = 'FormStyled.Textarea';

// Select component props
export interface SelectProps extends Omit<React.ComponentProps<typeof Form.Select>, 'as'> {
  /**
   * Label for the select
   */
  label?: string;
  /**
   * Helper text for the select
   */
  helperText?: string;
}

/**
 * Styled Select component
 */
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ name, validation, label, helperText, options, children, ...props }, ref) => {
    return (
      <FormGroup>
        {label && <Label htmlFor={`form-field-${name}`}>{label}</Label>}
        <Form.Select
          ref={ref}
          name={name}
          validation={validation}
          options={options}
          {...props}
          render={(selectProps) => <StyledSelect {...selectProps}>{children}</StyledSelect>}
        />
        {helperText && <HelperText>{helperText}</HelperText>}
        <Form.ErrorMessage name={name} render={(errorProps) => <ErrorMessage {...errorProps} />} />
      </FormGroup>
    );
  }
);

Select.displayName = 'FormStyled.Select';

// Checkbox component props
export interface CheckboxProps extends Omit<React.ComponentProps<typeof Form.Checkbox>, 'as'> {
  /**
   * Label for the checkbox
   */
  label?: string;
  /**
   * Helper text for the checkbox
   */
  helperText?: string;
}

/**
 * Styled Checkbox component
 */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ name, validation, label, helperText, ...props }, ref) => {
    return (
      <FormGroup>
        <CheckboxContainer>
          <Form.Checkbox
            ref={ref}
            name={name}
            validation={validation}
            id={`form-field-${name}`}
            {...props}
            render={(checkboxProps) => <StyledCheckbox {...checkboxProps} />}
          />
          {label && <CheckboxLabel htmlFor={`form-field-${name}`}>{label}</CheckboxLabel>}
        </CheckboxContainer>
        {helperText && <HelperText>{helperText}</HelperText>}
        <Form.ErrorMessage name={name} render={(errorProps) => <ErrorMessage {...errorProps} />} />
      </FormGroup>
    );
  }
);

Checkbox.displayName = 'FormStyled.Checkbox';

// Submit button component props
export interface SubmitButtonProps extends Omit<React.ComponentProps<typeof Form.SubmitButton>, 'as'> {}

/**
 * Styled Submit button component
 */
const StyledSubmitButton = React.forwardRef<HTMLButtonElement, SubmitButtonProps>(
  ({ children, loadingContent = 'Submitting...', ...props }, ref) => {
    return (
      <Form.SubmitButton
        ref={ref}
        loadingContent={loadingContent}
        {...props}
        render={(buttonProps) => <SubmitButton {...buttonProps}>{children}</SubmitButton>}
      />
    );
  }
);

StyledSubmitButton.displayName = 'FormStyled.SubmitButton';

// Define the FormStyled type with its subcomponents
type FormStyledComponent = typeof FormStyled & {
  Input: typeof Input;
  Textarea: typeof Textarea;
  Select: typeof Select;
  Checkbox: typeof Checkbox;
  SubmitButton: typeof StyledSubmitButton;
  ErrorMessage: typeof Form.ErrorMessage;
};

// Attach subcomponents to FormStyled
(FormStyled as FormStyledComponent).Input = Input;
(FormStyled as FormStyledComponent).Textarea = Textarea;
(FormStyled as FormStyledComponent).Select = Select;
(FormStyled as FormStyledComponent).Checkbox = Checkbox;
(FormStyled as FormStyledComponent).SubmitButton = StyledSubmitButton;
(FormStyled as FormStyledComponent).ErrorMessage = Form.ErrorMessage;

// Export types from the headless form
export type { FieldConfig, ValidationRule } from './hooks/useForm';

// Re-export the useFormContext hook for convenience
export { useFormContext } from './FormHeadless';

// Export the FormStyled component as the default export
export default FormStyled;

// Also export as named export for convenience
export { FormStyled as Form };
export type { StyledFormProps as FormProps };
