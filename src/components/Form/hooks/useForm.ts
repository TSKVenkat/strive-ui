import { useState, useCallback, useRef, useEffect } from 'react';

export type ValidationRule<T = any> = {
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Custom validation function
   */
  validate?: (value: T, formValues: Record<string, any>) => boolean | string;
  /**
   * Minimum length for string values
   */
  minLength?: number;
  /**
   * Maximum length for string values
   */
  maxLength?: number;
  /**
   * Pattern for string values
   */
  pattern?: RegExp;
  /**
   * Minimum value for number values
   */
  min?: number;
  /**
   * Maximum value for number values
   */
  max?: number;
  /**
   * Custom error message
   */
  message?: string;
};

export type FieldConfig<T = any> = {
  /**
   * Default value for the field
   */
  defaultValue?: T;
  /**
   * Validation rules for the field
   */
  validation?: ValidationRule<T>;
  /**
   * Whether to validate on change
   */
  validateOnChange?: boolean;
  /**
   * Whether to validate on blur
   */
  validateOnBlur?: boolean;
  /**
   * Transform function to apply before validation
   */
  transform?: (value: any) => T;
  /**
   * Dependencies that trigger validation
   */
  dependencies?: string[];
};

export type FormConfig = {
  /**
   * Initial values for the form
   */
  defaultValues?: Record<string, any>;
  /**
   * Mode for validation
   */
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'all';
  /**
   * Whether to validate all fields on submit
   */
  validateOnSubmit?: boolean;
  /**
   * Whether to reset the form after submit
   */
  resetOnSubmit?: boolean;
};

export type FieldState<T = any> = {
  /**
   * Current value of the field
   */
  value: T;
  /**
   * Whether the field has been touched
   */
  touched: boolean;
  /**
   * Whether the field is dirty (value has changed)
   */
  dirty: boolean;
  /**
   * Error message for the field
   */
  error: string | null;
  /**
   * Whether the field is currently being validated
   */
  validating: boolean;
  /**
   * Whether the field is valid
   */
  valid: boolean;
};

export type FormState = {
  /**
   * Whether the form is submitting
   */
  isSubmitting: boolean;
  /**
   * Whether the form is valid
   */
  isValid: boolean;
  /**
   * Whether the form is dirty (any value has changed)
   */
  isDirty: boolean;
  /**
   * Whether the form has been submitted
   */
  isSubmitted: boolean;
  /**
   * Whether the form submission was successful
   */
  isSubmitSuccessful: boolean;
  /**
   * Submission count
   */
  submitCount: number;
};

export type FieldProps = {
  /**
   * Name of the field
   */
  name: string;
  /**
   * onChange handler
   */
  onChange: (e: React.ChangeEvent<any>) => void;
  /**
   * onBlur handler
   */
  onBlur: (e: React.FocusEvent<any>) => void;
  /**
   * Value of the field
   */
  value: any;
  /**
   * Checked state for checkboxes
   */
  checked?: boolean;
  /**
   * Error message for the field
   */
  error: string | null;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Whether the field is disabled
   */
  disabled?: boolean;
  /**
   * ID for the field
   */
  id: string;
};

/**
 * A hook for creating headless forms with validation
 */
export function useForm<TFormValues extends Record<string, any> = Record<string, any>>(
  config: FormConfig = {}
) {
  const {
    defaultValues = {},
    mode = 'onSubmit',
    validateOnSubmit = true,
    resetOnSubmit = false,
  } = config;

  // Form state
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isValid: true,
    isDirty: false,
    isSubmitted: false,
    isSubmitSuccessful: false,
    submitCount: 0,
  });

  // Field configurations
  const fieldConfigsRef = useRef<Record<string, FieldConfig>>({});

  // Field states
  const [fieldStates, setFieldStates] = useState<Record<string, FieldState>>({});

  // Field refs
  const fieldRefs = useRef<Record<string, React.RefObject<any>>>({});

  // Initialize form with default values
  useEffect(() => {
    const initialFieldStates: Record<string, FieldState> = {};
    
    Object.keys(defaultValues).forEach((name) => {
      initialFieldStates[name] = {
        value: defaultValues[name],
        touched: false,
        dirty: false,
        error: null,
        validating: false,
        valid: true,
      };
    });
    
    setFieldStates(initialFieldStates);
  }, []);

  /**
   * Validates a single field
   */
  const validateField = useCallback(
    (name: string, value: any): string | null => {
      const fieldConfig = fieldConfigsRef.current[name];
      if (!fieldConfig || !fieldConfig.validation) return null;
      
      const validation = fieldConfig.validation;
      const formValues = getValues();
      
      // Required validation
      if (validation.required && (value === undefined || value === null || value === '')) {
        return validation.message || 'This field is required';
      }
      
      // String validations
      if (typeof value === 'string') {
        if (validation.minLength !== undefined && value.length < validation.minLength) {
          return validation.message || `Minimum length is ${validation.minLength}`;
        }
        
        if (validation.maxLength !== undefined && value.length > validation.maxLength) {
          return validation.message || `Maximum length is ${validation.maxLength}`;
        }
        
        if (validation.pattern && !validation.pattern.test(value)) {
          return validation.message || 'Invalid format';
        }
      }
      
      // Number validations
      if (typeof value === 'number') {
        if (validation.min !== undefined && value < validation.min) {
          return validation.message || `Minimum value is ${validation.min}`;
        }
        
        if (validation.max !== undefined && value > validation.max) {
          return validation.message || `Maximum value is ${validation.max}`;
        }
      }
      
      // Custom validation
      if (validation.validate) {
        const result = validation.validate(value, formValues);
        if (result === false) {
          return validation.message || 'Invalid value';
        } else if (typeof result === 'string') {
          return result;
        }
      }
      
      return null;
    },
    []
  );

  /**
   * Validates all fields
   */
  const validateAllFields = useCallback((): boolean => {
    const fieldNames = Object.keys(fieldStates);
    let isValid = true;
    const newFieldStates = { ...fieldStates };
    
    fieldNames.forEach((name) => {
      const value = fieldStates[name]?.value;
      const error = validateField(name, value);
      
      if (error) {
        isValid = false;
        newFieldStates[name] = {
          ...newFieldStates[name],
          error,
          valid: false,
        };
      } else {
        newFieldStates[name] = {
          ...newFieldStates[name],
          error: null,
          valid: true,
        };
      }
    });
    
    setFieldStates(newFieldStates);
    return isValid;
  }, [fieldStates, validateField]);

  /**
   * Registers a field with the form
   */
  const register = useCallback(
    (name: string, config: FieldConfig = {}): FieldProps => {
      // Store field config
      fieldConfigsRef.current[name] = config;
      
      // Create ref if it doesn't exist
      if (!fieldRefs.current[name]) {
        fieldRefs.current[name] = { current: null };
      }
      
      // Initialize field state if it doesn't exist
      if (!fieldStates[name]) {
        const defaultValue = config.defaultValue !== undefined 
          ? config.defaultValue 
          : defaultValues[name] !== undefined 
            ? defaultValues[name] 
            : '';
            
        setFieldStates((prev) => ({
          ...prev,
          [name]: {
            value: defaultValue,
            touched: false,
            dirty: false,
            error: null,
            validating: false,
            valid: true,
          },
        }));
      }
      
      const handleChange = (e: React.ChangeEvent<any>) => {
        const target = e.target;
        let value: any;
        
        // Handle different input types
        if (target.type === 'checkbox') {
          value = target.checked;
        } else if (target.type === 'file') {
          value = target.files;
        } else {
          value = target.value;
        }
        
        // Apply transform if provided
        if (config.transform) {
          value = config.transform(value);
        }
        
        // Update field state
        setFieldStates((prev) => {
          const prevValue = prev[name]?.value;
          const isDirty = value !== prevValue;
          
          return {
            ...prev,
            [name]: {
              ...prev[name],
              value,
              dirty: isDirty || (prev[name]?.dirty || false),
              touched: true,
            },
          };
        });
        
        // Validate on change if needed
        if (
          (config.validateOnChange || mode === 'onChange' || mode === 'all') &&
          fieldConfigsRef.current[name]?.validation
        ) {
          const error = validateField(name, value);
          
          setFieldStates((prev) => ({
            ...prev,
            [name]: {
              ...prev[name],
              error,
              valid: !error,
            },
          }));
        }
        
        // Validate dependencies
        if (config.dependencies && config.dependencies.length > 0) {
          config.dependencies.forEach((dependentField) => {
            if (fieldStates[dependentField]) {
              const dependentValue = fieldStates[dependentField].value;
              const error = validateField(dependentField, dependentValue);
              
              setFieldStates((prev) => ({
                ...prev,
                [dependentField]: {
                  ...prev[dependentField],
                  error,
                  valid: !error,
                },
              }));
            }
          });
        }
        
        // Update form state
        setFormState((prev) => ({
          ...prev,
          isDirty: true,
        }));
      };
      
      const handleBlur = (e: React.FocusEvent<any>) => {
        // Mark field as touched
        setFieldStates((prev) => ({
          ...prev,
          [name]: {
            ...prev[name],
            touched: true,
          },
        }));
        
        // Validate on blur if needed
        if (
          (config.validateOnBlur || mode === 'onBlur' || mode === 'all') &&
          fieldConfigsRef.current[name]?.validation
        ) {
          const value = fieldStates[name]?.value;
          const error = validateField(name, value);
          
          setFieldStates((prev) => ({
            ...prev,
            [name]: {
              ...prev[name],
              error,
              valid: !error,
            },
  /**
   * Sets a field's value programmatically
   */
  const setValue = useCallback(
    (name: string, value: any, shouldValidate = false) => {
      // Apply transform if provided
      const config = fieldConfigsRef.current[name];
      if (config?.transform) {
        value = config.transform(value);
      }
      
      // Update field state
      setFieldStates((prev) => {
        const prevValue = prev[name]?.value;
        const isDirty = value !== prevValue;
        
        return {
          ...prev,
          [name]: {
            ...prev[name],
            value,
            dirty: isDirty || (prev[name]?.dirty || false),
          },
        };
      });
      
      // Validate if needed
      if (shouldValidate && fieldConfigsRef.current[name]?.validation) {
        const error = validateField(name, value);
        
        setFieldStates((prev) => ({
          ...prev,
          [name]: {
            ...prev[name],
            error,
            valid: !error,
          },
        }));
      }
      
      // Update form state
      setFormState((prev) => ({
        ...prev,
        isDirty: true,
      }));
    },
    [validateField]
  );

  /**
   * Gets a field's value
   */
  const getValue = useCallback(
    (name: string) => {
      return fieldStates[name]?.value;
    },
    [fieldStates]
  );

  /**
   * Gets all form values
   */
  const getValues = useCallback(
    (): TFormValues => {
      const values: Record<string, any> = {};
      
      Object.keys(fieldStates).forEach((name) => {
        values[name] = fieldStates[name].value;
      });
      
      return values as TFormValues;
    },
    [fieldStates]
  );

  /**
   * Sets an error for a field
   */
  const setError = useCallback(
    (name: string, error: string | null) => {
      setFieldStates((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          error,
          valid: !error,
        },
      }));
    },
    []
  );

  /**
   * Gets a field's error
   */
  const getError = useCallback(
    (name: string) => {
      return fieldStates[name]?.error;
    },
    [fieldStates]
  );

  /**
   * Resets the form to its initial state
   */
  const reset = useCallback(
        
        // Update form state
        setFormState((prev) => ({
          ...prev,
          isSubmitting: true,
          isSubmitted: true,
          submitCount: prev.submitCount + 1,
        }));
        
        // Validate all fields if needed
        let isValid = true;
        if (validateOnSubmit) {
          isValid = validateAllFields();
        }
        
        // Update form state with validation result
        setFormState((prev) => ({
          ...prev,
          isValid,
        }));
        
        // If valid, call onSubmit
        if (isValid) {
          try {
            const values = getValues();
            await onSubmit(values);
            
            // Update form state
            setFormState((prev) => ({
              ...prev,
              isSubmitting: false,
              isSubmitSuccessful: true,
            }));
            
            // Reset form if needed
            if (resetOnSubmit) {
              reset();
            }
          } catch (error) {
            // Update form state
            setFormState((prev) => ({
              ...prev,
              isSubmitting: false,
              isSubmitSuccessful: false,
            }));
          }
        } else {
          // Update form state
          setFormState((prev) => ({
            ...prev,
            isSubmitting: false,
            isSubmitSuccessful: false,
          }));
          
          // Focus first invalid field
          const firstInvalidField = Object.keys(fieldStates).find(
            (name) => fieldStates[name].error
          );
          
          if (firstInvalidField && fieldRefs.current[firstInvalidField]?.current) {
            fieldRefs.current[firstInvalidField].current.focus();
          }
        }
      };
    },
    [fieldStates, getValues, reset, validateAllFields]
  );

  /**
   * Checks if the form is valid
   */
  const isValid = useCallback(
    (): boolean => {
      return Object.keys(fieldStates).every((name) => !fieldStates[name].error);
    },
    [fieldStates]
  );

  /**
   * Watches for changes to specific fields
   */
  const watch = useCallback(
    (fieldNames?: string | string[]) => {
      if (!fieldNames) {
        return getValues();
      }
      
      if (typeof fieldNames === 'string') {
        return getValue(fieldNames);
      }
      
      const result: Record<string, any> = {};
      fieldNames.forEach((name) => {
        result[name] = getValue(name);
      });
      
      return result;
    },
    [getValues, getValue]
  );

  /**
   * Triggers validation for specific fields
   */
  const trigger = useCallback(
    (fieldNames?: string | string[]): boolean => {
      if (!fieldNames) {
        return validateAllFields();
      }
      
      if (typeof fieldNames === 'string') {
        const value = getValue(fieldNames);
        const error = validateField(fieldNames, value);
        
        setFieldStates((prev) => ({
          ...prev,
          [fieldNames]: {
            ...prev[fieldNames],
            error,
            valid: !error,
          },
        }));
        
        return !error;
      }
      
      let isValid = true;
      const newFieldStates = { ...fieldStates };
      
      fieldNames.forEach((name) => {
        const value = getValue(name);
        const error = validateField(name, value);
        
        if (error) {
          isValid = false;
        }
        
        newFieldStates[name] = {
          ...newFieldStates[name],
          error,
          valid: !error,
        };
      });
      
      setFieldStates(newFieldStates);
      return isValid;
    },
    [fieldStates, getValue, validateField, validateAllFields]
  );

  return {
    register,
    handleSubmit,
    setValue,
    getValue,
    getValues,
    setError,
    getError,
    reset,
    watch,
    trigger,
    formState,
    isValid: isValid(),
    isDirty: formState.isDirty,
    isSubmitting: formState.isSubmitting,
    isSubmitted: formState.isSubmitted,
    isSubmitSuccessful: formState.isSubmitSuccessful,
    submitCount: formState.submitCount,
    errors: Object.keys(fieldStates).reduce((acc, name) => {
      if (fieldStates[name].error) {
        acc[name] = fieldStates[name].error;
      }
      return acc;
    }, {} as Record<string, string | null>),
  };
}

export default useForm;
