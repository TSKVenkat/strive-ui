import React, { createContext, useContext } from 'react';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';
import useForm, { FormConfig, FieldProps, ValidationRule } from './hooks/useForm';

// Context to share form state and methods
interface FormContextValue {
  register: (name: string, validation?: ValidationRule) => FieldProps;
  setValue: (name: string, value: any, shouldValidate?: boolean) => void;
  getValue: (name: string) => any;
  getValues: () => Record<string, any>;
  setError: (name: string, error: string | null) => void;
  getError: (name: string) => string | null;
  errors: Record<string, string | null>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
  isSubmitSuccessful: boolean;
}

const FormContext = createContext<FormContextValue | undefined>(undefined);

// Hook to access form context
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

// Form component props
export interface FormHeadlessProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /**
   * Form configuration
   */
  config?: FormConfig;
  /**
   * Callback when form is submitted and validation passes
   */
  onSubmit: (values: Record<string, any>) => void | Promise<void>;
  /**
   * Callback when form submission fails
   */
  onError?: (errors: Record<string, string | null>) => void;
  /**
   * Whether to prevent default form submission
   */
  preventDefault?: boolean;
}

/**
 * Headless Form component that provides form functionality without styling
 */
export const FormHeadless = React.forwardRef<HTMLFormElement, FormHeadlessProps>(
  ({ config, onSubmit, onError, preventDefault = true, children, ...props }, ref) => {
    const form = useForm(config);
    
    const handleSubmit = form.handleSubmit((values) => {
      return onSubmit(values);
    });
    
    const contextValue: FormContextValue = {
      register: (name, validation) => form.register(name, { validation }),
      setValue: form.setValue,
      getValue: form.getValue,
      getValues: form.getValues,
      setError: form.setError,
      getError: form.getError,
      errors: form.errors,
      isValid: form.isValid,
      isDirty: form.isDirty,
      isSubmitting: form.isSubmitting,
      isSubmitted: form.isSubmitted,
      isSubmitSuccessful: form.isSubmitSuccessful,
    };
    
    return (
      <FormContext.Provider value={contextValue}>
        <form
          ref={ref}
          onSubmit={(e) => {
            if (preventDefault) {
              e.preventDefault();
            }
            handleSubmit(e);
            
            if (!form.isValid && onError) {
              onError(form.errors);
            }
          }}
          noValidate
          {...props}
        >
          {children}
        </form>
      </FormContext.Provider>
    );
  }
);

FormHeadless.displayName = 'FormHeadless';

// Input component props
export interface InputHeadlessProps extends Omit<PolymorphicComponentPropsWithRef<'input'>, 'as' | 'render'> {
  /**
   * Name of the input field
   */
  name: string;
  /**
   * Validation rules for the input
   */
  validation?: ValidationRule;
  /**
   * Label for the input
   */
  label?: string;
  /**
   * Helper text for the input
   */
  helperText?: string;
  /**
   * Whether to show the error message
   */
  showError?: boolean;
  /**
   * Render prop for custom rendering
   */
  render?: (props: React.InputHTMLAttributes<HTMLInputElement>) => React.ReactElement;
}

/**
 * Headless Input component that connects to the form context
 */
export const InputHeadless = React.forwardRef<HTMLInputElement, InputHeadlessProps>(
  ({ name, validation, label, helperText, showError = true, render, ...props }, ref) => {
    const { register, errors } = useFormContext();
    const error = errors[name];
    
    const { onChange, onBlur, value, required, id, ...fieldProps } = register(name, validation);
    
    const inputProps = {
      ref,
      id: id || `form-field-${name}`,
      name,
      onChange,
      onBlur,
      value: value ?? '',
      required,
      'aria-invalid': !!error,
      'aria-describedby': error ? `${name}-error` : undefined,
      ...fieldProps,
      ...props
    };
    
    if (render) {
      return render(inputProps);
    }
    
    return <input {...inputProps} />;
  }
);

InputHeadless.displayName = 'InputHeadless';

// Checkbox component props
export interface CheckboxHeadlessProps extends Omit<PolymorphicComponentPropsWithRef<'input'>, 'as' | 'render'> {
  /**
   * Name of the checkbox field
   */
  name: string;
  /**
   * Validation rules for the checkbox
   */
  validation?: ValidationRule;
  /**
   * Label for the checkbox
   */
  label?: string;
  /**
   * Helper text for the checkbox
   */
  helperText?: string;
  /**
   * Whether to show the error message
   */
  showError?: boolean;
  /**
   * Render prop for custom rendering
   */
  render?: (props: React.InputHTMLAttributes<HTMLInputElement>) => React.ReactElement;
}

/**
 * Headless Checkbox component that connects to the form context
 */
export const CheckboxHeadless = React.forwardRef<HTMLInputElement, CheckboxHeadlessProps>(
  ({ name, validation, label, helperText, showError = true, render, ...props }, ref) => {
    const { register, errors } = useFormContext();
    const error = errors[name];
    
    const { onChange, onBlur, checked, required, id, ...fieldProps } = register(name, validation);
    
    const checkboxProps = {
      ref,
      id: id || `form-field-${name}`,
      name,
      type: 'checkbox',
      onChange,
      onBlur,
      checked: checked || false,
      required,
      'aria-invalid': !!error,
      'aria-describedby': error ? `${name}-error` : undefined,
      ...fieldProps,
      ...props
    };
    
    if (render) {
      return render(checkboxProps);
    }
    
    return <input {...checkboxProps} />;
  }
);

CheckboxHeadless.displayName = 'CheckboxHeadless';

// Select component props
export interface SelectHeadlessProps extends Omit<PolymorphicComponentPropsWithRef<'select'>, 'as' | 'render'> {
  /**
   * Name of the select field
   */
  name: string;
  /**
   * Validation rules for the select
   */
  validation?: ValidationRule;
  /**
   * Label for the select
   */
  label?: string;
  /**
   * Helper text for the select
   */
  helperText?: string;
  /**
   * Whether to show the error message
   */
  showError?: boolean;
  /**
   * Options for the select
   */
  options?: Array<{ value: string; label: string }>;
  /**
   * Render prop for custom rendering
   */
  render?: (props: React.SelectHTMLAttributes<HTMLSelectElement> & { children?: React.ReactNode }) => React.ReactElement;
}

/**
 * Headless Select component that connects to the form context
 */
export const SelectHeadless = React.forwardRef<HTMLSelectElement, SelectHeadlessProps>(
  ({ name, validation, label, helperText, showError = true, options, children, render, ...props }, ref) => {
    const { register, errors } = useFormContext();
    const error = errors[name];
    
    const { onChange, onBlur, value, required, id, ...fieldProps } = register(name, validation);
    
    const selectOptions = options
      ? options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))
      : children;
    
    const selectProps = {
      ref,
      id: id || `form-field-${name}`,
      name,
      onChange,
      onBlur,
      value: value ?? '',
      required,
      'aria-invalid': !!error,
      'aria-describedby': error ? `${name}-error` : undefined,
      ...fieldProps,
      ...props,
      children: selectOptions
    };
    
    if (render) {
      return render(selectProps);
    }
    
    return <select {...selectProps} />;
  }
);

SelectHeadless.displayName = 'SelectHeadless';

// Textarea component props
export interface TextareaHeadlessProps extends Omit<PolymorphicComponentPropsWithRef<'textarea'>, 'as' | 'render'> {
  /**
   * Name of the textarea field
   */
  name: string;
  /**
   * Validation rules for the textarea
   */
  validation?: ValidationRule;
  /**
   * Label for the textarea
   */
  label?: string;
  /**
   * Helper text for the textarea
   */
  helperText?: string;
  /**
   * Whether to show the error message
   */
  showError?: boolean;
  /**
   * Render prop for custom rendering
   */
  render?: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => React.ReactElement;
}

/**
 * Headless Textarea component that connects to the form context
 */
export const TextareaHeadless = React.forwardRef<HTMLTextAreaElement, TextareaHeadlessProps>(
  ({ name, validation, label, helperText, showError = true, render, ...props }, ref) => {
    const { register, errors } = useFormContext();
    const error = errors[name];
    
    const { onChange, onBlur, value, required, id, ...fieldProps } = register(name, validation);
    
    const textareaProps = {
      ref,
      id: id || `form-field-${name}`,
      name,
      onChange,
      onBlur,
      value: value ?? '',
      required,
      'aria-invalid': !!error,
      'aria-describedby': error ? `${name}-error` : undefined,
      ...fieldProps,
      ...props
    };
    
    if (render) {
      return render(textareaProps);
    }
    
    return <textarea {...textareaProps} />;
  }
);

TextareaHeadless.displayName = 'TextareaHeadless';

// Error message component props
export interface FormErrorMessageProps extends Omit<PolymorphicComponentPropsWithRef<'div'>, 'as' | 'render'> {
  /**
   * Name of the field to show error for
   */
  name: string;
  /**
   * Render prop for custom rendering
   */
  render?: (props: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => React.ReactElement;
}

/**
 * Component to display form field error messages
 */
export const FormErrorMessage = React.forwardRef<HTMLDivElement, FormErrorMessageProps>(
  ({ name, render, ...props }, ref) => {
    const { errors } = useFormContext();
    const error = errors[name];
    
    if (!error) return null;
    
    const errorProps = {
      ref,
      id: `${name}-error`,
      role: 'alert',
      ...props,
      children: error
    };
    
    if (render) {
      return render(errorProps);
    }
    
    return <div {...errorProps} />;
  }
);

FormErrorMessage.displayName = 'FormErrorMessage';

// Submit button component props
export interface SubmitButtonProps extends Omit<PolymorphicComponentPropsWithRef<'button'>, 'as' | 'render'> {
  /**
   * Whether to disable the button when the form is invalid
   */
  disableOnInvalid?: boolean;
  /**
   * Whether to disable the button when the form is submitting
   */
  disableOnSubmitting?: boolean;
  /**
   * Loading state content
   */
  loadingContent?: React.ReactNode;
  /**
   * Render prop for custom rendering
   */
  render?: (props: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => React.ReactElement;
}

/**
 * Submit button component that connects to the form context
 */
export const SubmitButton = React.forwardRef<HTMLButtonElement, SubmitButtonProps>(
  (
    { 
      disableOnInvalid = false, 
      disableOnSubmitting = true, 
      loadingContent, 
      children, 
      disabled,
      render,
      ...props 
    }, 
    ref
  ) => {
    const { isValid, isSubmitting } = useFormContext();
    
    const isDisabled = 
      disabled || 
      (disableOnInvalid && !isValid) || 
      (disableOnSubmitting && isSubmitting);
    
    const buttonContent = isSubmitting && loadingContent ? loadingContent : children;
    
    const buttonProps = {
      ref,
      type: 'submit' as const,
      disabled: isDisabled,
      'aria-disabled': isDisabled,
      ...props,
      children: buttonContent
    };
    
    if (render) {
      return render(buttonProps);
    }
    
    return <button {...buttonProps} />;
  }
);

SubmitButton.displayName = 'SubmitButton';

// Reset button component props
export interface ResetButtonProps extends Omit<PolymorphicComponentPropsWithRef<'button'>, 'as' | 'render'> {
  /**
   * Whether to disable the button when the form is submitting
   */
  disableOnSubmitting?: boolean;
  /**
   * Render prop for custom rendering
   */
  render?: (props: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => React.ReactElement;
}

/**
 * Reset button component that connects to the form context
 */
export const ResetButton = React.forwardRef<HTMLButtonElement, ResetButtonProps>(
  ({ disableOnSubmitting = true, children, disabled, render, ...props }, ref) => {
    const { isSubmitting } = useFormContext();
    
    const isDisabled = disabled || (disableOnSubmitting && isSubmitting);
    
    const buttonProps = {
      ref,
      type: 'reset' as const,
      disabled: isDisabled,
      'aria-disabled': isDisabled,
      ...props,
      children
    };
    
    if (render) {
      return render(buttonProps);
    }
    
    return <button {...buttonProps} />;
  }
);

ResetButton.displayName = 'ResetButton';

// Form component with all its subcomponents
const Form = {
  Root: FormHeadless,
  Input: InputHeadless,
  Checkbox: CheckboxHeadless,
  Select: SelectHeadless,
  Textarea: TextareaHeadless,
  ErrorMessage: FormErrorMessage,
  SubmitButton,
  ResetButton,
  useFormContext,
};

export default Form;
