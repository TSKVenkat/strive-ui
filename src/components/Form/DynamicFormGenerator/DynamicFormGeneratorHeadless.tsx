import React, { createContext, useContext, forwardRef } from 'react';
import { Controller, FieldValues, Path } from 'react-hook-form';
import { useDynamicForm, UseDynamicFormReturn, DynamicFormField, DynamicFormConfig } from './useDynamicForm';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

// Context for the DynamicFormGenerator
interface DynamicFormContextValue<T extends FieldValues = any> extends UseDynamicFormReturn<T> {}

const DynamicFormContext = createContext<DynamicFormContextValue | null>(null);

// Hook to use DynamicForm context
export function useDynamicFormContext<T extends FieldValues = any>() {
  const context = useContext(DynamicFormContext) as DynamicFormContextValue<T> | null;
  if (!context) {
    throw new Error('useDynamicFormContext must be used within a DynamicFormGeneratorHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps<T extends FieldValues = any> extends DynamicFormConfig<T> {
  /**
   * Children of the component
   */
  children: React.ReactNode;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Custom styles
   */
  style?: React.CSSProperties;
}

// Root component
const Root = <T extends FieldValues = any>({
  children,
  className,
  style,
  ...config
}: RootProps<T>) => {
  const dynamicForm = useDynamicForm<T>(config);
  
  return (
    <DynamicFormContext.Provider value={dynamicForm}>
      <div className={className} style={style}>
        {children}
      </div>
    </DynamicFormContext.Provider>
  );
};

// Form component props
export type FormProps<C extends React.ElementType, T extends FieldValues = any> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Callback when the form is submitted
     */
    onSubmit: (data: T) => void;
    /**
     * Callback when there are form errors
     */
    onError?: (errors: any) => void;
    /**
     * Custom class name
     */
    className?: string;
    /**
     * Custom styles
     */
    style?: React.CSSProperties;
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Form component
const Form = forwardRef(
  <C extends React.ElementType = 'form', T extends FieldValues = any>(
    {
      as,
      onSubmit,
      onError,
      className,
      style,
      children,
      ...props
    }: FormProps<C, T>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'form';
    const { handleSubmit } = useDynamicFormContext<T>();
    
    return (
      <Component
        ref={ref}
        className={className}
        style={style}
        onSubmit={handleSubmit(onSubmit, onError)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

// Fields container props
export type FieldsContainerProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Custom class name
     */
    className?: string;
    /**
     * Custom styles
     */
    style?: React.CSSProperties;
    /**
     * Render function for each field
     */
    renderField?: (field: DynamicFormField, index: number) => React.ReactNode;
    /**
     * Filter function to filter fields
     */
    filter?: (field: DynamicFormField) => boolean;
    /**
     * Group ID to filter fields by group
     */
    groupId?: string;
  }
>;

// Fields container component
const FieldsContainer = forwardRef(
  <C extends React.ElementType = 'div'>(
    {
      as,
      className,
      style,
      renderField,
      filter,
      groupId,
      ...props
    }: FieldsContainerProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { visibleFields } = useDynamicFormContext();
    
    // Filter fields
    let fieldsToRender = visibleFields;
    
    if (groupId) {
      fieldsToRender = fieldsToRender.filter((field) => field.group === groupId);
    }
    
    if (filter) {
      fieldsToRender = fieldsToRender.filter(filter);
    }
    
    // Sort fields by order if specified
    fieldsToRender = [...fieldsToRender].sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      if (a.order !== undefined) {
        return -1;
      }
      if (b.order !== undefined) {
        return 1;
      }
      return 0;
    });
    
    return (
      <Component
        ref={ref}
        className={className}
        style={style}
        {...props}
      >
        {fieldsToRender.map((field, index) => (
          renderField ? (
            renderField(field, index)
          ) : (
            <Field key={field.name} name={field.name as string} />
          )
        ))}
      </Component>
    );
  }
);

// Field props
export interface FieldProps<T extends FieldValues = any> {
  /**
   * Name of the field
   */
  name: Path<T> | string;
  /**
   * Custom component to render the field
   */
  component?: React.ComponentType<any>;
  /**
   * Custom render function for the field
   */
  render?: (field: DynamicFormField<T>, formProps: any) => React.ReactNode;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Custom styles
   */
  style?: React.CSSProperties;
}

// Field component
const Field = <T extends FieldValues = any>({
  name,
  component: CustomComponent,
  render,
  className,
  style,
}: FieldProps<T>) => {
  const { form, fields } = useDynamicFormContext<T>();
  
  // Find the field configuration
  const fieldConfig = fields.find((f) => f.name === name);
  
  if (!fieldConfig) {
    console.warn(`Field with name "${name}" not found in form configuration`);
    return null;
  }
  
  // Use the custom component from props or field config
  const FieldComponent = CustomComponent || fieldConfig.component;
  
  return (
    <Controller
      control={form.control}
      name={name as Path<T>}
      render={({ field, fieldState }) => {
        const { ref, ...restField } = field;
        
        // Prepare props for the field component
        const fieldProps = {
          ...restField,
          inputRef: ref,
          label: fieldConfig.label,
          placeholder: fieldConfig.placeholder,
          helperText: fieldConfig.helperText,
          disabled: fieldConfig.disabled,
          readOnly: fieldConfig.readOnly,
          required: fieldConfig.required,
          options: fieldConfig.options,
          error: fieldState.error?.message,
          className,
          style,
          ...fieldConfig.props,
        };
        
        // Use custom render function if provided
        if (render) {
          return render(fieldConfig, fieldProps);
        }
        
        // Use custom component if provided
        if (FieldComponent) {
          return <FieldComponent {...fieldProps} />;
        }
        
        // Default rendering based on field type
        return (
          <div className={className} style={style}>
            <label>{fieldConfig.label}</label>
            <input
              type={fieldConfig.type}
              {...restField}
              ref={ref}
              placeholder={fieldConfig.placeholder}
              disabled={fieldConfig.disabled}
              readOnly={fieldConfig.readOnly}
              required={fieldConfig.required}
            />
            {fieldState.error?.message && (
              <div style={{ color: 'red' }}>{fieldState.error.message}</div>
            )}
            {fieldConfig.helperText && (
              <div style={{ fontSize: 'smaller' }}>{fieldConfig.helperText}</div>
            )}
          </div>
        );
      }}
    />
  );
};

// Group props
export interface GroupProps<T extends FieldValues = any> {
  /**
   * ID of the group
   */
  id: string;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Custom styles
   */
  style?: React.CSSProperties;
  /**
   * Children of the component
   */
  children?: React.ReactNode;
  /**
   * Render function for each field in the group
   */
  renderField?: (field: DynamicFormField<T>, index: number) => React.ReactNode;
}

// Group component
const Group = <T extends FieldValues = any>({
  id,
  className,
  style,
  children,
  renderField,
}: GroupProps<T>) => {
  const { groups } = useDynamicFormContext<T>();
  
  // Find the group configuration
  const groupConfig = groups?.find((g) => g.id === id);
  
  if (!groupConfig) {
    console.warn(`Group with id "${id}" not found in form configuration`);
    return null;
  }
  
  return (
    <div className={className} style={style}>
      <div>
        <h3>{groupConfig.label}</h3>
        {groupConfig.description && <p>{groupConfig.description}</p>}
      </div>
      
      {children || (
        <FieldsContainer
          groupId={id}
          renderField={renderField}
        />
      )}
    </div>
  );
};

// Actions props
export type ActionsProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Custom class name
     */
    className?: string;
    /**
     * Custom styles
     */
    style?: React.CSSProperties;
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Actions component
const Actions = forwardRef(
  <C extends React.ElementType = 'div'>(
    {
      as,
      className,
      style,
      children,
      ...props
    }: ActionsProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    
    return (
      <Component
        ref={ref}
        className={className}
        style={style}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

// Submit button props
export type SubmitButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Text for the submit button
     */
    text?: string;
    /**
     * Custom class name
     */
    className?: string;
    /**
     * Custom styles
     */
    style?: React.CSSProperties;
  }
>;

// Submit button component
const SubmitButton = forwardRef(
  <C extends React.ElementType = 'button'>(
    {
      as,
      text = 'Submit',
      className,
      style,
      ...props
    }: SubmitButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { isSubmitting } = useDynamicFormContext();
    
    return (
      <Component
        ref={ref}
        type="submit"
        disabled={isSubmitting}
        className={className}
        style={style}
        {...props}
      >
        {isSubmitting ? 'Submitting...' : text}
      </Component>
    );
  }
);

// Reset button props
export type ResetButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Text for the reset button
     */
    text?: string;
    /**
     * Custom class name
     */
    className?: string;
    /**
     * Custom styles
     */
    style?: React.CSSProperties;
  }
>;

// Reset button component
const ResetButton = forwardRef(
  <C extends React.ElementType = 'button'>(
    {
      as,
      text = 'Reset',
      className,
      style,
      ...props
    }: ResetButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { reset } = useDynamicFormContext();
    
    return (
      <Component
        ref={ref}
        type="button"
        onClick={() => reset()}
        className={className}
        style={style}
        {...props}
      >
        {text}
      </Component>
    );
  }
);

// Error summary props
export type ErrorSummaryProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Title for the error summary
     */
    title?: string;
    /**
     * Custom class name
     */
    className?: string;
    /**
     * Custom styles
     */
    style?: React.CSSProperties;
  }
>;

// Error summary component
const ErrorSummary = forwardRef(
  <C extends React.ElementType = 'div'>(
    {
      as,
      title = 'Please fix the following errors:',
      className,
      style,
      ...props
    }: ErrorSummaryProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { errors, fields } = useDynamicFormContext();
    
    // If no errors, don't render anything
    if (Object.keys(errors).length === 0) {
      return null;
    }
    
    // Get field labels for error messages
    const getFieldLabel = (fieldName: string) => {
      const field = fields.find((f) => f.name === fieldName);
      return field?.label || fieldName;
    };
    
    // Flatten errors object
    const flattenErrors = (obj: any, prefix = ''): Array<{ field: string; message: string }> => {
      return Object.entries(obj).reduce((acc: Array<{ field: string; message: string }>, [key, value]) => {
        const fieldKey = prefix ? `${prefix}.${key}` : key;
        
        if (value && typeof value === 'object' && !value.message) {
          return [...acc, ...flattenErrors(value, fieldKey)];
        }
        
        return [...acc, { field: fieldKey, message: value.message }];
      }, []);
    };
    
    const errorList = flattenErrors(errors);
    
    return (
      <Component
        ref={ref}
        className={className}
        style={{
          color: 'red',
          marginBottom: '1rem',
          ...style,
        }}
        {...props}
      >
        <h4>{title}</h4>
        <ul>
          {errorList.map(({ field, message }) => (
            <li key={field}>
              <strong>{getFieldLabel(field)}:</strong> {message}
            </li>
          ))}
        </ul>
      </Component>
    );
  }
);

// Debug props
export type DebugProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Custom class name
     */
    className?: string;
    /**
     * Custom styles
     */
    style?: React.CSSProperties;
  }
>;

// Debug component
const Debug = forwardRef(
  <C extends React.ElementType = 'pre'>(
    {
      as,
      className,
      style,
      ...props
    }: DebugProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'pre';
    const { getValues, errors, isValid, isDirty, isSubmitting } = useDynamicFormContext();
    
    return (
      <Component
        ref={ref}
        className={className}
        style={{
          backgroundColor: '#f5f5f5',
          padding: '1rem',
          borderRadius: '4px',
          overflow: 'auto',
          fontSize: '0.875rem',
          ...style,
        }}
        {...props}
      >
        <div>
          <strong>Form State:</strong>
          <ul>
            <li>Valid: {isValid ? 'Yes' : 'No'}</li>
            <li>Dirty: {isDirty ? 'Yes' : 'No'}</li>
            <li>Submitting: {isSubmitting ? 'Yes' : 'No'}</li>
          </ul>
        </div>
        
        <div>
          <strong>Values:</strong>
          <div>{JSON.stringify(getValues(), null, 2)}</div>
        </div>
        
        {Object.keys(errors).length > 0 && (
          <div>
            <strong>Errors:</strong>
            <div>{JSON.stringify(errors, null, 2)}</div>
          </div>
        )}
      </Component>
    );
  }
);

// Export all components
export const DynamicFormGeneratorHeadless = {
  Root,
  Form,
  FieldsContainer,
  Field,
  Group,
  Actions,
  SubmitButton,
  ResetButton,
  ErrorSummary,
  Debug,
};

export default DynamicFormGeneratorHeadless;
