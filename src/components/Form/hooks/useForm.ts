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
   * Transform function to apply to the value
   */
  transform?: (value: any) => T;
};

export type FieldState<T = any> = {
  /**
   * Current value of the field
   */
  value: T;
  /**
   * Whether the field has been touched (focused and blurred)
   */
  touched: boolean;
  /**
   * Whether the field has been modified
   */
  dirty: boolean;
  /**
   * Whether the field is currently being validated
   */
  validating: boolean;
  /**
   * Whether the field is valid
   */
  valid: boolean;
  /**
   * Error message if the field is invalid
   */
  error: string | null;
};

export type FormState = {
  /**
   * Whether the form has been modified
   */
  isDirty: boolean;
  /**
   * Whether the form is valid
   */
  isValid: boolean;
  /**
   * Whether the form is currently being submitted
   */
  isSubmitting: boolean;
  /**
   * Whether the form has been submitted
   */
  isSubmitted: boolean;
  /**
   * Whether the form submission was successful
   */
  isSubmitSuccessful: boolean;
  /**
   * Number of times the form has been submitted
   */
  submitCount: number;
};

export interface UseFormOptions<TFormValues extends Record<string, any> = Record<string, any>> {
  /**
   * Initial values for the form
   */
  defaultValues?: Partial<TFormValues>;
  /**
   * Field configurations
   */
  fields?: Record<string, FieldConfig>;
  /**
   * Whether to validate on change
   */
  validateOnChange?: boolean;
  /**
   * Whether to validate on blur
   */
  validateOnBlur?: boolean;
  /**
   * Whether to validate on submit
   */
  validateOnSubmit?: boolean;
  /**
   * Callback when the form is submitted
   */
  onSubmit?: (values: TFormValues) => Promise<void> | void;
  /**
   * Callback when the form submission is successful
   */
  onSubmitSuccess?: (values: TFormValues) => void;
  /**
   * Callback when the form submission fails
   */
  onSubmitError?: (error: any) => void;
}

export interface UseFormReturn<TFormValues extends Record<string, any> = Record<string, any>> {
  /**
   * Current form state
   */
  formState: FormState;
  /**
   * Current field states
   */
  fieldStates: Record<string, FieldState>;
  /**
   * Register a field
   */
  register: (name: string, config?: FieldConfig) => {
    name: string;
    value: any;
    onChange: (e: React.ChangeEvent<any>) => void;
    onBlur: (e: React.FocusEvent<any>) => void;
  };
  /**
   * Handle form submission
   */
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  /**
   * Set a field's value programmatically
   */
  setValue: (name: string, value: any, shouldValidate?: boolean) => void;
  /**
   * Get a field's value
   */
  getValue: (name: string) => any;
  /**
   * Get all form values
   */
  getValues: () => TFormValues;
  /**
   * Set an error for a field
   */
  setError: (name: string, error: string | null) => void;
  /**
   * Get a field's error
   */
  getError: (name: string) => string | null;
  /**
   * Reset the form to its initial state
   */
  reset: () => void;
  /**
   * Validate all fields
   */
  validateAllFields: () => boolean;
  /**
   * Validate a specific field
   */
  validateField: (name: string, value?: any) => string | null;
}

/**
 * A hook for managing form state and validation
 */
export function useForm<TFormValues extends Record<string, any> = Record<string, any>>(
  options: UseFormOptions<TFormValues> = {}
): UseFormReturn<TFormValues> {
  const {
    defaultValues = {} as Partial<TFormValues>,
    fields = {},
    validateOnChange = false,
    validateOnBlur = true,
    validateOnSubmit = true,
    onSubmit,
    onSubmitSuccess,
    onSubmitError,
  } = options;

  // Store field configurations in a ref to avoid re-renders
  const fieldConfigsRef = useRef<Record<string, FieldConfig>>(fields);

  // Form state
  const [formState, setFormState] = useState<FormState>({
    isDirty: false,
    isValid: true,
    isSubmitting: false,
    isSubmitted: false,
    isSubmitSuccessful: false,
    submitCount: 0,
  });

  // Field states
  const [fieldStates, setFieldStates] = useState<Record<string, FieldState>>(() => {
    const initialFieldStates: Record<string, FieldState> = {};

    // Initialize field states from default values and field configs
    Object.keys(fieldConfigsRef.current).forEach((name) => {
      const config = fieldConfigsRef.current[name];
      const defaultValue = config?.defaultValue ?? defaultValues[name as keyof TFormValues] ?? '';

      initialFieldStates[name] = {
        value: defaultValue,
        touched: false,
        dirty: false,
        validating: false,
        valid: true,
        error: null,
      };
    });

    // Add any fields from defaultValues that aren't in the field configs
    Object.keys(defaultValues).forEach((name) => {
      if (!initialFieldStates[name]) {
        initialFieldStates[name] = {
          value: defaultValues[name as keyof TFormValues],
          touched: false,
          dirty: false,
          validating: false,
          valid: true,
          error: null,
        };
      }
    });

    return initialFieldStates;
  });

  // Update field configs when they change
  useEffect(() => {
    fieldConfigsRef.current = fields;
  }, [fields]);

  /**
   * Validate a field
   */
  const validateField = useCallback(
    (name: string, value?: any): string | null => {
      const config = fieldConfigsRef.current[name];
      
      if (!config?.validation) {
        return null;
      }

      const validation = config.validation;
      const fieldValue = value !== undefined ? value : fieldStates[name]?.value;
      const formValues = getValues();

      // Required validation
      if (validation.required && (fieldValue === '' || fieldValue === null || fieldValue === undefined)) {
        return validation.message || 'This field is required';
      }

      // String validations
      if (typeof fieldValue === 'string') {
        // Min length validation
        if (validation.minLength !== undefined && fieldValue.length < validation.minLength) {
          return validation.message || `Minimum length is ${validation.minLength}`;
        }

        // Max length validation
        if (validation.maxLength !== undefined && fieldValue.length > validation.maxLength) {
          return validation.message || `Maximum length is ${validation.maxLength}`;
        }

        // Pattern validation
        if (validation.pattern && !validation.pattern.test(fieldValue)) {
          return validation.message || 'Invalid format';
        }
      }

      // Number validations
      if (typeof fieldValue === 'number') {
        // Min validation
        if (validation.min !== undefined && fieldValue < validation.min) {
          return validation.message || `Minimum value is ${validation.min}`;
        }

        // Max validation
        if (validation.max !== undefined && fieldValue > validation.max) {
          return validation.message || `Maximum value is ${validation.max}`;
        }
      }

      // Custom validation
      if (validation.validate) {
        const result = validation.validate(fieldValue, formValues);
        
        if (typeof result === 'string') {
          return result;
        }
        
        if (result === false) {
          return validation.message || 'Invalid value';
        }
      }

      return null;
    },
    [fieldStates]
  );

  /**
   * Validate all fields
   */
  const validateAllFields = useCallback((): boolean => {
    let isValid = true;
    const newFieldStates = { ...fieldStates };

    Object.keys(fieldStates).forEach((name) => {
      const error = validateField(name);
      
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
  }, [fieldStates, validateField]);

  /**
   * Register a field
   */
  const register = useCallback(
    (name: string, config?: FieldConfig) => {
      // Update field config if provided
      if (config) {
        fieldConfigsRef.current[name] = {
          ...fieldConfigsRef.current[name],
          ...config,
        };
      }

      // Initialize field state if it doesn't exist
      if (!fieldStates[name]) {
        const defaultValue = config?.defaultValue ?? defaultValues[name as keyof TFormValues] ?? '';
        
        setFieldStates((prev) => ({
          ...prev,
          [name]: {
            value: defaultValue,
            touched: false,
            dirty: false,
            validating: false,
            valid: true,
            error: null,
          },
        }));
      }

      return {
        name,
        value: fieldStates[name]?.value ?? '',
        onChange: (e: React.ChangeEvent<any>) => {
          const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
          setValue(name, value, (config?.validateOnChange ?? validateOnChange));
        },
        onBlur: (e: React.FocusEvent<any>) => {
          // Mark as touched
          setFieldStates((prev) => ({
            ...prev,
            [name]: {
              ...prev[name],
              touched: true,
            },
          }));

          // Validate on blur if enabled
          if (config?.validateOnBlur ?? validateOnBlur) {
            const error = validateField(name);
            
            setFieldStates((prev) => ({
              ...prev,
              [name]: {
                ...prev[name],
                error,
                valid: !error,
              },
            }));
          }
        },
      };
    },
    [fieldStates, defaultValues, validateOnChange, validateOnBlur, validateField]
  );

  /**
   * Set a field's value programmatically
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
            validating: false,
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
   * Get a field's value
   */
  const getValue = useCallback(
    (name: string) => {
      return fieldStates[name]?.value;
    },
    [fieldStates]
  );

  /**
   * Get all form values
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
   * Set an error for a field
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
   * Get a field's error
   */
  const getError = useCallback(
    (name: string) => {
      return fieldStates[name]?.error;
    },
    [fieldStates]
  );

  /**
   * Reset the form to its initial state
   */
  const reset = useCallback(() => {
    // Reset all field states to their initial values
    setFieldStates((prev) => {
      const newFieldStates: Record<string, FieldState> = {};
      
      Object.keys(fieldConfigsRef.current).forEach((name) => {
        const config = fieldConfigsRef.current[name];
        const defaultValue = config?.defaultValue ?? defaultValues[name as keyof TFormValues] ?? '';
        
        newFieldStates[name] = {
          value: defaultValue,
          error: null,
          valid: true,
          dirty: false,
          touched: false,
          validating: false,
        };
      });
      
      return newFieldStates;
    });
    
    // Reset form state
    setFormState({
      isDirty: false,
      isValid: true,
      isSubmitting: false,
      isSubmitted: false,
      isSubmitSuccessful: false,
      submitCount: 0,
    });
  }, [defaultValues]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    
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
    if (isValid && onSubmit) {
      try {
        const values = getValues();
        await onSubmit(values);
        
        // Update form state on success
        setFormState((prev) => ({
          ...prev,
          isSubmitting: false,
          isSubmitSuccessful: true,
        }));
        
        // Call onSubmitSuccess if provided
        if (onSubmitSuccess) {
          onSubmitSuccess(values);
        }
      } catch (error) {
        // Update form state on error
        setFormState((prev) => ({
          ...prev,
          isSubmitting: false,
          isSubmitSuccessful: false,
        }));
        
        // Call onSubmitError if provided
        if (onSubmitError) {
          onSubmitError(error);
        }
      }
    } else {
      // Update form state if invalid
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        isSubmitSuccessful: false,
      }));
    }
  }, [validateOnSubmit, validateAllFields, onSubmit, onSubmitSuccess, onSubmitError, getValues]);

  return {
    formState,
    fieldStates,
    register,
    handleSubmit,
    setValue,
    getValue,
    getValues,
    setError,
    getError,
    reset,
    validateAllFields,
    validateField,
  };
}

export default useForm;
