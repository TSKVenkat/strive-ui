import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { FieldValues, Path } from 'react-hook-form';
import { DynamicFormGeneratorHeadless, RootProps as HeadlessRootProps } from './DynamicFormGeneratorHeadless';
import { DynamicFormField, FieldType } from './useDynamicForm';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';
import { Input } from '../../Input';
import { Textarea } from '../../Textarea';
import { Select } from '../../Select';
import { Checkbox } from '../../Checkbox';
import { Radio } from '../../Radio';
import { Switch } from '../../Switch';
import { DatePicker } from '../../DatePicker';
import { TimePicker } from '../../TimePicker';
import { ColorPicker } from '../../ColorPicker';
import { FileUpload } from '../../FileUpload';
import { Slider } from '../../Slider';
import { Rating } from '../../Rating';
import { TagInput } from '../../TagInput';
import { Autocomplete } from '../../Autocomplete';
import { Box } from '../../Box';
import { Flex } from '../../Flex';
import { Text } from '../../Text';
import { Button } from '../../Button';
import { Card } from '../../Card';
import { Accordion } from '../../Accordion';
import { Divider } from '../../Divider';
import { Icon } from '../../Icon';

// Styled components
const StyledRoot = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ theme }) => theme.colors.text.primary};
  width: 100%;
`;

const StyledForm = styled(DynamicFormGeneratorHeadless.Form)`
  width: 100%;
`;

const StyledFieldsContainer = styled(DynamicFormGeneratorHeadless.FieldsContainer)`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const StyledField = styled.div<{ $width?: number }>`
  grid-column: span ${({ $width }) => $width || 12};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-column: span 12;
  }
`;

const StyledGroup = styled(DynamicFormGeneratorHeadless.Group)`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const StyledGroupHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const StyledGroupTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin: 0 0 ${({ theme }) => theme.spacing[1]};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledGroupDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const StyledActions = styled(DynamicFormGeneratorHeadless.Actions)`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const StyledSubmitButton = styled(DynamicFormGeneratorHeadless.SubmitButton)`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  background-color: ${({ theme }) => theme.colors.primary[500]};
  color: ${({ theme }) => theme.colors.common.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primary[600]};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[200]};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledResetButton = styled(DynamicFormGeneratorHeadless.ResetButton)`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[200]};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledErrorSummary = styled(DynamicFormGeneratorHeadless.ErrorSummary)`
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.error[50]};
  border: 1px solid ${({ theme }) => theme.colors.error[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  h4 {
    color: ${({ theme }) => theme.colors.error[700]};
    margin-top: 0;
    margin-bottom: ${({ theme }) => theme.spacing[2]};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  }
  
  ul {
    margin: 0;
    padding-left: ${({ theme }) => theme.spacing[4]};
    
    li {
      color: ${({ theme }) => theme.colors.error[700]};
      margin-bottom: ${({ theme }) => theme.spacing[1]};
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
`;

const StyledDebug = styled(DynamicFormGeneratorHeadless.Debug)`
  margin-top: ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.neutral[50]};
  font-family: monospace;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

// Field renderer component
interface FieldRendererProps<T extends FieldValues = any> {
  field: DynamicFormField<T>;
  formProps: any;
}

const FieldRenderer = <T extends FieldValues = any>({ field, formProps }: FieldRendererProps<T>) => {
  const { type, label, helperText, required, options, props = {} } = field;
  const { error, ...restProps } = formProps;
  
  // Common props for all field components
  const commonProps = {
    id: field.name,
    label,
    error: error,
    helperText,
    required,
    ...restProps,
    ...props,
  };
  
  // Render field based on type
  switch (type) {
    case 'text':
    case 'password':
    case 'email':
    case 'tel':
    case 'url':
    case 'search':
    case 'number':
      return <Input type={type} {...commonProps} />;
      
    case 'textarea':
      return <Textarea {...commonProps} />;
      
    case 'select':
      return <Select options={options || []} {...commonProps} />;
      
    case 'multiselect':
      return <Select multiple options={options || []} {...commonProps} />;
      
    case 'checkbox':
      return <Checkbox {...commonProps} />;
      
    case 'radio':
      return <Radio options={options || []} {...commonProps} />;
      
    case 'switch':
      return <Switch {...commonProps} />;
      
    case 'date':
      return <DatePicker {...commonProps} />;
      
    case 'time':
      return <TimePicker {...commonProps} />;
      
    case 'datetime':
      return <DatePicker showTimeSelect {...commonProps} />;
      
    case 'color':
      return <ColorPicker {...commonProps} />;
      
    case 'file':
      return <FileUpload {...commonProps} />;
      
    case 'range':
      return <Slider {...commonProps} />;
      
    case 'rating':
      return <Rating {...commonProps} />;
      
    case 'tags':
      return <TagInput {...commonProps} />;
      
    case 'autocomplete':
      return <Autocomplete options={options || []} {...commonProps} />;
      
    case 'hidden':
      return <input type="hidden" {...restProps} />;
      
    case 'custom':
      if (field.component) {
        const CustomComponent = field.component;
        return <CustomComponent {...commonProps} />;
      }
      return <div>Custom field without component</div>;
      
    default:
      return <Input {...commonProps} />;
  }
};

// DynamicFormGenerator component props
export interface DynamicFormGeneratorProps<T extends FieldValues = any> extends Omit<HeadlessRootProps<T>, 'children'> {
  /**
   * Callback when the form is submitted
   */
  onSubmit: (data: T) => void;
  /**
   * Callback when there are form errors
   */
  onError?: (errors: any) => void;
  /**
   * Text for the submit button
   */
  submitText?: string;
  /**
   * Text for the reset button
   */
  resetText?: string;
  /**
   * Whether to show the reset button
   */
  showReset?: boolean;
  /**
   * Whether to show the error summary
   */
  showErrorSummary?: boolean;
  /**
   * Whether to show the debug panel
   */
  showDebug?: boolean;
  /**
   * Whether to use accordion for groups
   */
  useAccordion?: boolean;
  /**
   * Whether to use a card layout
   */
  useCard?: boolean;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Custom styles
   */
  style?: React.CSSProperties;
  /**
   * Custom render function for fields
   */
  renderField?: (field: DynamicFormField<T>, formProps: any) => React.ReactNode;
  /**
   * Custom render function for actions
   */
  renderActions?: (props: { isSubmitting: boolean; reset: () => void }) => React.ReactNode;
  /**
   * Custom render function for groups
   */
  renderGroup?: (group: { id: string; label: string; description?: string }, children: React.ReactNode) => React.ReactNode;
}

/**
 * DynamicFormGenerator component for creating forms dynamically based on a schema.
 * 
 * @example
 * ```jsx
 * import { DynamicFormGenerator } from 'strive-ui';
 * 
 * function MyForm() {
 *   const fields = [
 *     { name: 'name', type: 'text', label: 'Name', required: true },
 *     { name: 'email', type: 'email', label: 'Email', required: true },
 *     { name: 'message', type: 'textarea', label: 'Message' }
 *   ];
 *   
 *   const handleSubmit = (data) => {
 *     console.log('Form submitted:', data);
 *   };
 *   
 *   return (
 *     <DynamicFormGenerator
 *       fields={fields}
 *       onSubmit={handleSubmit}
 *       submitText="Send Message"
 *     />
 *   );
 * }
 * ```
 */
export const DynamicFormGenerator = forwardRef(<T extends FieldValues = any>(
  {
    onSubmit,
    onError,
    submitText = 'Submit',
    resetText = 'Reset',
    showReset = true,
    showErrorSummary = true,
    showDebug = false,
    useAccordion = false,
    useCard = true,
    className,
    style,
    renderField,
    renderActions,
    renderGroup,
    ...config
  }: DynamicFormGeneratorProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  // Render a field
  const renderFieldComponent = (field: DynamicFormField<T>, index: number) => {
    return (
      <StyledField key={field.name} $width={field.width}>
        <DynamicFormGeneratorHeadless.Field
          name={field.name}
          render={(fieldConfig, formProps) => 
            renderField ? 
              renderField(fieldConfig, formProps) : 
              <FieldRenderer field={fieldConfig} formProps={formProps} />
          }
        />
      </StyledField>
    );
  };
  
  // Render a group
  const renderGroupComponent = (group: { id: string; label: string; description?: string }) => {
    const groupContent = (
      <>
        <StyledGroupHeader>
          <StyledGroupTitle>{group.label}</StyledGroupTitle>
          {group.description && (
            <StyledGroupDescription>{group.description}</StyledGroupDescription>
          )}
        </StyledGroupHeader>
        
        <StyledFieldsContainer
          groupId={group.id}
          renderField={renderFieldComponent}
        />
      </>
    );
    
    if (renderGroup) {
      return renderGroup(group, groupContent);
    }
    
    if (useAccordion) {
      return (
        <Accordion key={group.id} title={group.label}>
          {group.description && (
            <Text variant="body2" color="textSecondary" mb={3}>
              {group.description}
            </Text>
          )}
          <StyledFieldsContainer
            groupId={group.id}
            renderField={renderFieldComponent}
          />
        </Accordion>
      );
    }
    
    return (
      <StyledGroup key={group.id} id={group.id}>
        {groupContent}
      </StyledGroup>
    );
  };
  
  // Main form content
  const formContent = (
    <>
      {showErrorSummary && <StyledErrorSummary />}
      
      {config.groups ? (
        // Render groups
        config.groups.map(renderGroupComponent)
      ) : (
        // Render all fields without groups
        <StyledFieldsContainer renderField={renderFieldComponent} />
      )}
      
      <StyledActions>
        {renderActions ? (
          renderActions({
            isSubmitting: false, // This will be updated by the context
            reset: () => {}, // This will be updated by the context
          })
        ) : (
          <>
            {showReset && (
              <StyledResetButton text={resetText} />
            )}
            <StyledSubmitButton text={submitText} />
          </>
        )}
      </StyledActions>
      
      {showDebug && <StyledDebug />}
    </>
  );
  
  return (
    <DynamicFormGeneratorHeadless.Root
      {...config}
    >
      <StyledRoot ref={ref} className={className} style={style}>
        <StyledForm onSubmit={onSubmit} onError={onError}>
          {useCard ? (
            <Card padding="md">
              {formContent}
            </Card>
          ) : (
            formContent
          )}
        </StyledForm>
      </StyledRoot>
    </DynamicFormGeneratorHeadless.Root>
  );
});

DynamicFormGenerator.displayName = 'DynamicFormGenerator';

export default DynamicFormGenerator;
