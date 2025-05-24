import { useState, useCallback, useEffect } from 'react';
import { useForm, UseFormReturn, FieldValues, Path, DeepPartial } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

/**
 * Field types supported by the dynamic form generator
 */
export type FieldType =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'date'
  | 'time'
  | 'datetime'
  | 'color'
  | 'file'
  | 'hidden'
  | 'range'
  | 'rating'
  | 'tags'
  | 'autocomplete'
  | 'custom';

/**
 * Option type for select, multiselect, radio, etc.
 */
export interface FieldOption {
  /**
   * Value of the option
   */
  value: string | number | boolean;
  /**
   * Label of the option
   */
  label: string;
  /**
   * Whether the option is disabled
   */
  disabled?: boolean;
  /**
   * Group the option belongs to (for grouped selects)
   */
  group?: string;
  /**
   * Additional metadata for the option
   */
  meta?: Record<string, any>;
}

/**
 * Validation rule for a field
 */
export interface ValidationRule {
  /**
   * Type of validation rule
   */
  type:
    | 'required'
    | 'min'
    | 'max'
    | 'minLength'
    | 'maxLength'
    | 'pattern'
    | 'email'
    | 'url'
    | 'custom';
  /**
   * Value for the validation rule (e.g., minimum length)
   */
  value?: any;
  /**
   * Error message to display when validation fails
   */
  message: string;
  /**
   * Custom validation function
   */
  validate?: (value: any, formValues: Record<string, any>) => boolean | string;
}

/**
 * Condition for conditional fields
 */
export interface FieldCondition {
  /**
   * Field to check the condition against
   */
  field: string;
  /**
   * Operator for the condition
   */
  operator: 'equals' | 'notEquals' | 'contains' | 'notContains' | 'greaterThan' | 'lessThan' | 'empty' | 'notEmpty' | 'custom';
  /**
   * Value to compare against
   */
  value?: any;
  /**
   * Custom condition function
   */
  custom?: (fieldValue: any, formValues: Record<string, any>) => boolean;
}

/**
 * Configuration for a dynamic form field
 */
export interface DynamicFormField<T extends FieldValues = any> {
  /**
   * Unique name/key for the field (used as form field name)
   */
  name: Path<T>;
  /**
   * Type of the field
   */
  type: FieldType;
  /**
   * Label for the field
   */
  label?: string;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Help text to display below the field
   */
  helperText?: string;
  /**
   * Default value for the field
   */
  defaultValue?: any;
  /**
   * Whether the field is disabled
   */
  disabled?: boolean;
  /**
   * Whether the field is read-only
   */
  readOnly?: boolean;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Options for select, multiselect, radio, etc.
   */
  options?: FieldOption[];
  /**
   * Validation rules for the field
   */
  validation?: ValidationRule[];
  /**
   * Conditions for when to show this field
   */
  conditions?: FieldCondition[];
  /**
   * Custom props to pass to the field component
   */
  props?: Record<string, any>;
  /**
   * Custom component to use for rendering this field
   */
  component?: React.ComponentType<any>;
  /**
   * Width of the field (1-12 in a 12-column grid)
   */
  width?: number;
  /**
   * Group the field belongs to
   */
  group?: string;
  /**
   * Order of the field within its group
   */
  order?: number;
  /**
   * Whether to hide the label
   */
  hideLabel?: boolean;
  /**
   * Additional CSS class names
   */
  className?: string;
  /**
   * Custom styles
   */
  style?: React.CSSProperties;
}

/**
 * Configuration for a dynamic form
 */
export interface DynamicFormConfig<T extends FieldValues = any> {
  /**
   * Fields in the form
   */
  fields: DynamicFormField<T>[];
  /**
   * Default values for the form
   */
  defaultValues?: DeepPartial<T>;
  /**
   * Whether to validate the form on change
   */
  validateOnChange?: boolean;
  /**
   * Whether to validate the form on blur
   */
  validateOnBlur?: boolean;
  /**
   * Mode for the form validation
   */
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
  /**
   * Revalidation mode for the form
   */
  reValidateMode?: 'onChange' | 'onBlur' | 'onSubmit';
  /**
   * Groups for organizing fields
   */
  groups?: {
    /**
     * ID of the group
     */
    id: string;
    /**
     * Label for the group
     */
    label: string;
    /**
     * Description of the group
     */
    description?: string;
    /**
     * Whether the group is collapsible
     */
    collapsible?: boolean;
    /**
     * Whether the group is initially collapsed
     */
    collapsed?: boolean;
    /**
     * Order of the group
     */
    order?: number;
  }[];
}

/**
 * Return type for the useDynamicForm hook
 */
export interface UseDynamicFormReturn<T extends FieldValues = any> {
  /**
   * Form instance from react-hook-form
   */
  form: UseFormReturn<T>;
  /**
   * Fields to render in the form
   */
  fields: DynamicFormField<T>[];
  /**
   * Filtered fields based on conditions
   */
  visibleFields: DynamicFormField<T>[];
  /**
   * Groups in the form
   */
  groups: DynamicFormConfig<T>['groups'];
  /**
   * Schema for the form
   */
  schema: z.ZodTypeAny;
  /**
   * Handle form submission
   */
  handleSubmit: (onSubmit: (data: T) => void, onError?: (errors: any) => void) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  /**
   * Reset the form
   */
  reset: (values?: DeepPartial<T>) => void;
  /**
   * Set form values
   */
  setValues: (values: DeepPartial<T>) => void;
  /**
   * Get current form values
   */
  getValues: () => T;
  /**
   * Update the form configuration
   */
  updateConfig: (config: Partial<DynamicFormConfig<T>>) => void;
  /**
   * Add a field to the form
   */
  addField: (field: DynamicFormField<T>) => void;
  /**
   * Remove a field from the form
   */
  removeField: (fieldName: Path<T>) => void;
  /**
   * Update a field in the form
   */
  updateField: (fieldName: Path<T>, updates: Partial<DynamicFormField<T>>) => void;
  /**
   * Get errors from the form
   */
  errors: Record<string, any>;
  /**
   * Whether the form is valid
   */
  isValid: boolean;
  /**
   * Whether the form is submitting
   */
  isSubmitting: boolean;
  /**
   * Whether the form is dirty (has changed)
   */
  isDirty: boolean;
}

/**
 * Build a Zod schema from the form configuration
 */
function buildZodSchema<T extends FieldValues>(fields: DynamicFormField<T>[]): z.ZodTypeAny {
  const schemaMap: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let schema: z.ZodTypeAny;

    // Base schema based on field type
    switch (field.type) {
      case 'number':
        schema = z.number();
        break;
      case 'checkbox':
        schema = z.boolean();
        break;
      case 'multiselect':
      case 'tags':
        schema = z.array(z.string());
        break;
      case 'date':
      case 'time':
      case 'datetime':
        schema = z.date();
        break;
      case 'custom':
        schema = z.any();
        break;
      default:
        schema = z.string();
    }

    // Apply validation rules
    if (field.validation) {
      field.validation.forEach((rule) => {
        switch (rule.type) {
          case 'required':
            schema = schema.refine((val) => val !== undefined && val !== null && val !== '', {
              message: rule.message,
            });
            break;
          case 'min':
            if (field.type === 'number') {
              schema = (schema as z.ZodNumber).min(rule.value, rule.message);
            }
            break;
          case 'max':
            if (field.type === 'number') {
              schema = (schema as z.ZodNumber).max(rule.value, rule.message);
            }
            break;
          case 'minLength':
            if (field.type !== 'number' && field.type !== 'checkbox') {
              schema = (schema as z.ZodString).min(rule.value, rule.message);
            }
            break;
          case 'maxLength':
            if (field.type !== 'number' && field.type !== 'checkbox') {
              schema = (schema as z.ZodString).max(rule.value, rule.message);
            }
            break;
          case 'pattern':
            if (field.type !== 'number' && field.type !== 'checkbox') {
              schema = (schema as z.ZodString).regex(new RegExp(rule.value), rule.message);
            }
            break;
          case 'email':
            if (field.type !== 'number' && field.type !== 'checkbox') {
              schema = (schema as z.ZodString).email(rule.message);
            }
            break;
          case 'url':
            if (field.type !== 'number' && field.type !== 'checkbox') {
              schema = (schema as z.ZodString).url(rule.message);
            }
            break;
          case 'custom':
            if (rule.validate) {
              schema = schema.refine(
                (val, ctx) => {
                  const result = rule.validate!(val, ctx.data);
                  return typeof result === 'boolean' ? result : false;
                },
                {
                  message: rule.message,
                }
              );
            }
            break;
        }
      });
    }

    // If field is not required, make it optional
    if (!field.required && !field.validation?.some((rule) => rule.type === 'required')) {
      schema = schema.optional();
    }

    schemaMap[field.name] = schema;
  });

  return z.object(schemaMap as any);
}

/**
 * Evaluate field conditions to determine visibility
 */
function evaluateFieldConditions<T extends FieldValues>(
  field: DynamicFormField<T>,
  formValues: Record<string, any>
): boolean {
  if (!field.conditions || field.conditions.length === 0) {
    return true;
  }

  return field.conditions.every((condition) => {
    const fieldValue = formValues[condition.field];

    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      case 'notEquals':
        return fieldValue !== condition.value;
      case 'contains':
        return Array.isArray(fieldValue)
          ? fieldValue.includes(condition.value)
          : typeof fieldValue === 'string'
          ? fieldValue.includes(String(condition.value))
          : false;
      case 'notContains':
        return Array.isArray(fieldValue)
          ? !fieldValue.includes(condition.value)
          : typeof fieldValue === 'string'
          ? !fieldValue.includes(String(condition.value))
          : true;
      case 'greaterThan':
        return typeof fieldValue === 'number' ? fieldValue > condition.value : false;
      case 'lessThan':
        return typeof fieldValue === 'number' ? fieldValue < condition.value : false;
      case 'empty':
        return fieldValue === undefined || fieldValue === null || fieldValue === '' || (Array.isArray(fieldValue) && fieldValue.length === 0);
      case 'notEmpty':
        return fieldValue !== undefined && fieldValue !== null && fieldValue !== '' && (!Array.isArray(fieldValue) || fieldValue.length > 0);
      case 'custom':
        return condition.custom ? condition.custom(fieldValue, formValues) : true;
      default:
        return true;
    }
  });
}

/**
 * Hook for creating and managing dynamic forms
 */
export function useDynamicForm<T extends FieldValues = any>(
  config: DynamicFormConfig<T>
): UseDynamicFormReturn<T> {
  // Store the form configuration
  const [formConfig, setFormConfig] = useState<DynamicFormConfig<T>>(config);
  
  // Build the Zod schema for validation
  const [schema, setSchema] = useState<z.ZodTypeAny>(() => buildZodSchema(config.fields));
  
  // Initialize the form with react-hook-form
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: config.defaultValues || {} as DeepPartial<T>,
    mode: config.mode || 'onSubmit',
    reValidateMode: config.reValidateMode || 'onChange',
  });
  
  // Get current form values
  const formValues = form.watch();
  
  // Filter fields based on conditions
  const visibleFields = formConfig.fields.filter((field) => 
    evaluateFieldConditions(field, formValues)
  );
  
  // Update the schema when fields change
  useEffect(() => {
    setSchema(buildZodSchema(formConfig.fields));
  }, [formConfig.fields]);
  
  // Update form configuration
  const updateConfig = useCallback((newConfig: Partial<DynamicFormConfig<T>>) => {
    setFormConfig((prev) => ({
      ...prev,
      ...newConfig,
      fields: newConfig.fields || prev.fields,
      groups: newConfig.groups || prev.groups,
    }));
  }, []);
  
  // Add a field to the form
  const addField = useCallback((field: DynamicFormField<T>) => {
    setFormConfig((prev) => ({
      ...prev,
      fields: [...prev.fields, field],
    }));
  }, []);
  
  // Remove a field from the form
  const removeField = useCallback((fieldName: Path<T>) => {
    setFormConfig((prev) => ({
      ...prev,
      fields: prev.fields.filter((f) => f.name !== fieldName),
    }));
  }, []);
  
  // Update a field in the form
  const updateField = useCallback((fieldName: Path<T>, updates: Partial<DynamicFormField<T>>) => {
    setFormConfig((prev) => ({
      ...prev,
      fields: prev.fields.map((f) =>
        f.name === fieldName ? { ...f, ...updates } : f
      ),
    }));
  }, []);
  
  // Set form values
  const setValues = useCallback((values: DeepPartial<T>) => {
    form.reset(values);
  }, [form]);
  
  return {
    form,
    fields: formConfig.fields,
    visibleFields,
    groups: formConfig.groups,
    schema,
    handleSubmit: form.handleSubmit,
    reset: form.reset,
    setValues,
    getValues: form.getValues,
    updateConfig,
    addField,
    removeField,
    updateField,
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    isSubmitting: form.formState.isSubmitting,
    isDirty: form.formState.isDirty,
  };
}

export default useDynamicForm;
