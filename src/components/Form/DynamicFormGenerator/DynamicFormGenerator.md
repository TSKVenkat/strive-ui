# DynamicFormGenerator

The DynamicFormGenerator component provides a powerful solution for creating forms dynamically based on a schema. It follows the headless component architecture pattern, separating the logic from the presentation to allow for maximum flexibility and customization.

## Features

- **Schema-Based Form Generation**: Create forms dynamically using a JSON schema.
- **Field Types**: Support for various field types including text, number, select, checkbox, radio, date, etc.
- **Validation**: Built-in validation with Zod schema generation.
- **Conditional Fields**: Show/hide fields based on conditions.
- **Field Groups**: Organize fields into logical groups.
- **Responsive Layout**: Grid-based layout with customizable field widths.
- **Accessibility**: Fully accessible with proper ARIA attributes and keyboard navigation.
- **Form State Management**: Built-in state management with react-hook-form.
- **Headless Architecture**: Separate logic from presentation for maximum customization.
- **Styled Components**: Pre-styled components ready for use in your application.

## Installation

```bash
npm install strive-ui
# or
yarn add strive-ui
```

## Basic Usage

```jsx
import { DynamicFormGenerator } from 'strive-ui';

function MyForm() {
  const fields = [
    { name: 'firstName', type: 'text', label: 'First Name', required: true, width: 6 },
    { name: 'lastName', type: 'text', label: 'Last Name', required: true, width: 6 },
    { name: 'email', type: 'email', label: 'Email', required: true },
    { name: 'message', type: 'textarea', label: 'Message', helperText: 'Enter your message here' },
    { name: 'subscribe', type: 'checkbox', label: 'Subscribe to newsletter', defaultValue: false },
  ];
  
  const handleSubmit = (data) => {
    console.log('Form submitted:', data);
    // Submit data to server, etc.
  };
  
  return (
    <DynamicFormGenerator
      fields={fields}
      onSubmit={handleSubmit}
      submitText="Send Message"
    />
  );
}
```

## Advanced Usage with Validation

```jsx
import { DynamicFormGenerator } from 'strive-ui';

function ValidatedForm() {
  const fields = [
    { 
      name: 'username', 
      type: 'text', 
      label: 'Username', 
      required: true,
      validation: [
        { type: 'required', message: 'Username is required' },
        { type: 'minLength', value: 3, message: 'Username must be at least 3 characters' },
      ],
    },
    { 
      name: 'email', 
      type: 'email', 
      label: 'Email', 
      required: true,
      validation: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Please enter a valid email address' },
      ],
    },
    { 
      name: 'password', 
      type: 'password', 
      label: 'Password', 
      required: true,
      validation: [
        { type: 'required', message: 'Password is required' },
        { type: 'minLength', value: 8, message: 'Password must be at least 8 characters' },
        { 
          type: 'pattern', 
          value: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)',
          message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
        },
      ],
    },
  ];
  
  const handleSubmit = (data) => {
    console.log('Form submitted:', data);
    // Submit data to server, etc.
  };
  
  return (
    <DynamicFormGenerator
      fields={fields}
      onSubmit={handleSubmit}
      submitText="Register"
      showErrorSummary={true}
    />
  );
}
```

## Conditional Fields

```jsx
import { DynamicFormGenerator } from 'strive-ui';

function ConditionalForm() {
  const fields = [
    { 
      name: 'contactMethod', 
      type: 'select', 
      label: 'Preferred Contact Method', 
      options: [
        { value: 'email', label: 'Email' },
        { value: 'phone', label: 'Phone' },
        { value: 'mail', label: 'Mail' },
      ],
      defaultValue: 'email',
      required: true,
    },
    { 
      name: 'email', 
      type: 'email', 
      label: 'Email Address', 
      required: true,
      conditions: [
        { field: 'contactMethod', operator: 'equals', value: 'email' }
      ],
    },
    { 
      name: 'phone', 
      type: 'tel', 
      label: 'Phone Number', 
      required: true,
      conditions: [
        { field: 'contactMethod', operator: 'equals', value: 'phone' }
      ],
    },
    { 
      name: 'address', 
      type: 'textarea', 
      label: 'Mailing Address', 
      required: true,
      conditions: [
        { field: 'contactMethod', operator: 'equals', value: 'mail' }
      ],
    },
  ];
  
  const handleSubmit = (data) => {
    console.log('Form submitted:', data);
    // Submit data to server, etc.
  };
  
  return (
    <DynamicFormGenerator
      fields={fields}
      onSubmit={handleSubmit}
      submitText="Submit"
    />
  );
}
```

## Field Groups

```jsx
import { DynamicFormGenerator } from 'strive-ui';

function GroupedForm() {
  const fields = [
    { name: 'firstName', type: 'text', label: 'First Name', required: true, group: 'personal', width: 6 },
    { name: 'lastName', type: 'text', label: 'Last Name', required: true, group: 'personal', width: 6 },
    { name: 'email', type: 'email', label: 'Email', required: true, group: 'personal' },
    { name: 'street', type: 'text', label: 'Street Address', group: 'address' },
    { name: 'city', type: 'text', label: 'City', group: 'address', width: 4 },
    { name: 'state', type: 'text', label: 'State', group: 'address', width: 4 },
    { name: 'zip', type: 'text', label: 'Zip Code', group: 'address', width: 4 },
  ];
  
  const groups = [
    { id: 'personal', label: 'Personal Information', description: 'Enter your personal details', order: 1 },
    { id: 'address', label: 'Address Information', description: 'Enter your address details', order: 2 },
  ];
  
  const handleSubmit = (data) => {
    console.log('Form submitted:', data);
    // Submit data to server, etc.
  };
  
  return (
    <DynamicFormGenerator
      fields={fields}
      groups={groups}
      onSubmit={handleSubmit}
      submitText="Submit"
      useAccordion={true}
    />
  );
}
```

## Headless Usage

For maximum customization, you can use the headless version of the DynamicFormGenerator:

```jsx
import { DynamicFormGeneratorHeadless } from 'strive-ui';
import styled from 'styled-components';

// Custom styled components
const StyledField = styled.div`
  margin-bottom: 16px;
  
  label {
    display: block;
    margin-bottom: 4px;
    font-weight: 500;
  }
  
  input, textarea, select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: #0066ff;
      box-shadow: 0 0 0 2px rgba(0, 102, 255, 0.2);
    }
  }
  
  .error {
    color: #d32f2f;
    font-size: 12px;
    margin-top: 4px;
  }
  
  .helper-text {
    color: #666;
    font-size: 12px;
    margin-top: 4px;
  }
`;

const StyledButton = styled.button`
  padding: 8px 16px;
  background-color: #0066ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: #0055cc;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

function CustomForm() {
  return (
    <DynamicFormGeneratorHeadless.Root
      fields={[
        { name: 'name', type: 'text', label: 'Name', required: true },
        { name: 'email', type: 'email', label: 'Email', required: true },
        { name: 'message', type: 'textarea', label: 'Message', helperText: 'Enter your message here' },
      ]}
    >
      <h2>Contact Form</h2>
      
      <DynamicFormGeneratorHeadless.Form
        onSubmit={(data) => {
          console.log('Form submitted:', data);
          // Submit data to server, etc.
        }}
      >
        <DynamicFormGeneratorHeadless.ErrorSummary title="Please fix these errors:" />
        
        <DynamicFormGeneratorHeadless.FieldsContainer
          renderField={(field, index) => (
            <StyledField key={field.name}>
              <DynamicFormGeneratorHeadless.Field
                name={field.name}
                render={(fieldConfig, formProps) => {
                  const { error, inputRef, ...restProps } = formProps;
                  
                  return (
                    <>
                      <label htmlFor={field.name}>{field.label}{field.required && ' *'}</label>
                      {field.type === 'textarea' ? (
                        <textarea
                          id={field.name}
                          ref={inputRef}
                          {...restProps}
                          rows={4}
                          placeholder={field.placeholder}
                        />
                      ) : (
                        <input
                          id={field.name}
                          type={field.type}
                          ref={inputRef}
                          {...restProps}
                          placeholder={field.placeholder}
                        />
                      )}
                      {error && <div className="error">{error}</div>}
                      {field.helperText && <div className="helper-text">{field.helperText}</div>}
                    </>
                  );
                }}
              />
            </StyledField>
          )}
        />
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <DynamicFormGeneratorHeadless.ResetButton
            as={StyledButton}
            text="Reset"
            style={{ marginRight: '8px', backgroundColor: '#666' }}
          />
          <DynamicFormGeneratorHeadless.SubmitButton
            as={StyledButton}
            text="Send Message"
          />
        </div>
      </DynamicFormGeneratorHeadless.Form>
    </DynamicFormGeneratorHeadless.Root>
  );
}
```

## API Reference

### DynamicFormGenerator Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fields` | `Array<DynamicFormField>` | Required | Array of field configurations |
| `groups` | `Array<{ id: string; label: string; description?: string; collapsible?: boolean; collapsed?: boolean; order?: number; }>` | `undefined` | Array of group configurations |
| `defaultValues` | `object` | `{}` | Default values for the form |
| `onSubmit` | `(data: any) => void` | Required | Callback when the form is submitted |
| `onError` | `(errors: any) => void` | `undefined` | Callback when there are form errors |
| `submitText` | `string` | `'Submit'` | Text for the submit button |
| `resetText` | `string` | `'Reset'` | Text for the reset button |
| `showReset` | `boolean` | `true` | Whether to show the reset button |
| `showErrorSummary` | `boolean` | `true` | Whether to show the error summary |
| `showDebug` | `boolean` | `false` | Whether to show the debug panel |
| `useAccordion` | `boolean` | `false` | Whether to use accordion for groups |
| `useCard` | `boolean` | `true` | Whether to use a card layout |
| `validateOnChange` | `boolean` | `false` | Whether to validate the form on change |
| `validateOnBlur` | `boolean` | `false` | Whether to validate the form on blur |
| `mode` | `'onChange' \| 'onBlur' \| 'onSubmit' \| 'onTouched' \| 'all'` | `'onSubmit'` | Mode for the form validation |
| `reValidateMode` | `'onChange' \| 'onBlur' \| 'onSubmit'` | `'onChange'` | Revalidation mode for the form |
| `className` | `string` | `undefined` | Custom class name |
| `style` | `React.CSSProperties` | `undefined` | Custom styles |
| `renderField` | `(field: DynamicFormField, formProps: any) => React.ReactNode` | `undefined` | Custom render function for fields |
| `renderActions` | `(props: { isSubmitting: boolean; reset: () => void }) => React.ReactNode` | `undefined` | Custom render function for actions |
| `renderGroup` | `(group: { id: string; label: string; description?: string }, children: React.ReactNode) => React.ReactNode` | `undefined` | Custom render function for groups |

### DynamicFormField Type

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Name of the field (used as form field name) |
| `type` | `FieldType` | Type of the field |
| `label` | `string` (optional) | Label for the field |
| `placeholder` | `string` (optional) | Placeholder text |
| `helperText` | `string` (optional) | Help text to display below the field |
| `defaultValue` | `any` (optional) | Default value for the field |
| `disabled` | `boolean` (optional) | Whether the field is disabled |
| `readOnly` | `boolean` (optional) | Whether the field is read-only |
| `required` | `boolean` (optional) | Whether the field is required |
| `options` | `Array<FieldOption>` (optional) | Options for select, multiselect, radio, etc. |
| `validation` | `Array<ValidationRule>` (optional) | Validation rules for the field |
| `conditions` | `Array<FieldCondition>` (optional) | Conditions for when to show this field |
| `props` | `object` (optional) | Custom props to pass to the field component |
| `component` | `React.ComponentType<any>` (optional) | Custom component to use for rendering this field |
| `width` | `number` (optional) | Width of the field (1-12 in a 12-column grid) |
| `group` | `string` (optional) | Group the field belongs to |
| `order` | `number` (optional) | Order of the field within its group |
| `hideLabel` | `boolean` (optional) | Whether to hide the label |
| `className` | `string` (optional) | Additional CSS class names |
| `style` | `React.CSSProperties` (optional) | Custom styles |

### FieldType

The following field types are supported:

- `'text'`
- `'password'`
- `'email'`
- `'number'`
- `'tel'`
- `'url'`
- `'search'`
- `'textarea'`
- `'select'`
- `'multiselect'`
- `'checkbox'`
- `'radio'`
- `'switch'`
- `'date'`
- `'time'`
- `'datetime'`
- `'color'`
- `'file'`
- `'hidden'`
- `'range'`
- `'rating'`
- `'tags'`
- `'autocomplete'`
- `'custom'`

### ValidationRule Type

| Property | Type | Description |
|----------|------|-------------|
| `type` | `'required' \| 'min' \| 'max' \| 'minLength' \| 'maxLength' \| 'pattern' \| 'email' \| 'url' \| 'custom'` | Type of validation rule |
| `value` | `any` (optional) | Value for the validation rule (e.g., minimum length) |
| `message` | `string` | Error message to display when validation fails |
| `validate` | `(value: any, formValues: Record<string, any>) => boolean \| string` (optional) | Custom validation function |

### FieldCondition Type

| Property | Type | Description |
|----------|------|-------------|
| `field` | `string` | Field to check the condition against |
| `operator` | `'equals' \| 'notEquals' \| 'contains' \| 'notContains' \| 'greaterThan' \| 'lessThan' \| 'empty' \| 'notEmpty' \| 'custom'` | Operator for the condition |
| `value` | `any` (optional) | Value to compare against |
| `custom` | `(fieldValue: any, formValues: Record<string, any>) => boolean` (optional) | Custom condition function |

### FieldOption Type

| Property | Type | Description |
|----------|------|-------------|
| `value` | `string \| number \| boolean` | Value of the option |
| `label` | `string` | Label of the option |
| `disabled` | `boolean` (optional) | Whether the option is disabled |
| `group` | `string` (optional) | Group the option belongs to (for grouped selects) |
| `meta` | `Record<string, any>` (optional) | Additional metadata for the option |

### useDynamicForm Hook

The `useDynamicForm` hook provides the core functionality for the DynamicFormGenerator component and can be used independently for custom implementations.

```jsx
import { useDynamicForm } from 'strive-ui';

function CustomForm() {
  const {
    form,
    fields,
    visibleFields,
    groups,
    schema,
    handleSubmit,
    reset,
    setValues,
    getValues,
    updateConfig,
    addField,
    removeField,
    updateField,
    errors,
    isValid,
    isSubmitting,
    isDirty,
  } = useDynamicForm({
    fields: [
      { name: 'name', type: 'text', label: 'Name', required: true },
      { name: 'email', type: 'email', label: 'Email', required: true },
    ],
    defaultValues: {
      name: '',
      email: '',
    },
    validateOnChange: true,
  });
  
  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      {/* Custom UI implementation */}
    </form>
  );
}
```

### DynamicFormGeneratorHeadless Components

The headless version of DynamicFormGenerator provides the following components:

#### DynamicFormGeneratorHeadless.Root

The root component that provides the DynamicFormGenerator context.

```jsx
<DynamicFormGeneratorHeadless.Root
  fields={fields}
  groups={groups}
  defaultValues={defaultValues}
>
  {children}
</DynamicFormGeneratorHeadless.Root>
```

#### DynamicFormGeneratorHeadless.Form

The form component that handles form submission.

```jsx
<DynamicFormGeneratorHeadless.Form
  onSubmit={handleSubmit}
  onError={handleError}
>
  {children}
</DynamicFormGeneratorHeadless.Form>
```

#### DynamicFormGeneratorHeadless.FieldsContainer

The container for form fields.

```jsx
<DynamicFormGeneratorHeadless.FieldsContainer
  renderField={(field, index) => (
    <div key={field.name}>
      <DynamicFormGeneratorHeadless.Field name={field.name} />
    </div>
  )}
  filter={(field) => field.type !== 'hidden'}
  groupId="personal"
/>
```

#### DynamicFormGeneratorHeadless.Field

The component for rendering a specific field.

```jsx
<DynamicFormGeneratorHeadless.Field
  name="email"
  component={CustomEmailInput}
  render={(field, formProps) => (
    <div>
      <label htmlFor={field.name}>{field.label}</label>
      <input
        id={field.name}
        type={field.type}
        {...formProps}
      />
      {formProps.error && <div>{formProps.error}</div>}
    </div>
  )}
/>
```

#### DynamicFormGeneratorHeadless.Group

The component for rendering a group of fields.

```jsx
<DynamicFormGeneratorHeadless.Group
  id="personal"
  renderField={(field, index) => (
    <div key={field.name}>
      <DynamicFormGeneratorHeadless.Field name={field.name} />
    </div>
  )}
/>
```

#### DynamicFormGeneratorHeadless.Actions

The container for form actions.

```jsx
<DynamicFormGeneratorHeadless.Actions>
  <DynamicFormGeneratorHeadless.ResetButton text="Reset" />
  <DynamicFormGeneratorHeadless.SubmitButton text="Submit" />
</DynamicFormGeneratorHeadless.Actions>
```

#### DynamicFormGeneratorHeadless.SubmitButton

The submit button component.

```jsx
<DynamicFormGeneratorHeadless.SubmitButton
  text="Submit Form"
  as="button"
  className="submit-button"
/>
```

#### DynamicFormGeneratorHeadless.ResetButton

The reset button component.

```jsx
<DynamicFormGeneratorHeadless.ResetButton
  text="Reset Form"
  as="button"
  className="reset-button"
/>
```

#### DynamicFormGeneratorHeadless.ErrorSummary

The component for displaying a summary of form errors.

```jsx
<DynamicFormGeneratorHeadless.ErrorSummary
  title="Please fix the following errors:"
  as="div"
  className="error-summary"
/>
```

#### DynamicFormGeneratorHeadless.Debug

The component for displaying debug information.

```jsx
<DynamicFormGeneratorHeadless.Debug
  as="pre"
  className="debug-panel"
/>
```

## Accessibility

The DynamicFormGenerator component is built with accessibility in mind:

- Proper ARIA attributes for form elements
- Keyboard navigation support
- Error messages linked to form fields
- Focus management
- Appropriate color contrast
- Screen reader friendly

## Best Practices

1. **Field Names**: Use clear and descriptive field names that match your data model.
2. **Validation**: Provide helpful error messages that guide users on how to fix issues.
3. **Conditional Fields**: Use conditions to show only relevant fields to reduce form complexity.
4. **Field Groups**: Organize related fields into groups for better user experience.
5. **Field Width**: Use appropriate field widths based on the expected input length.
6. **Helper Text**: Provide helpful instructions for complex fields.
7. **Default Values**: Set sensible default values when appropriate.
8. **Required Fields**: Clearly indicate which fields are required.
9. **Form Layout**: Use a logical and intuitive form layout.
10. **Error Handling**: Show a summary of errors at the top of the form for better accessibility.

## Examples

### Registration Form

```jsx
import { DynamicFormGenerator } from 'strive-ui';

function RegistrationForm() {
  const fields = [
    { name: 'firstName', type: 'text', label: 'First Name', required: true, width: 6 },
    { name: 'lastName', type: 'text', label: 'Last Name', required: true, width: 6 },
    { name: 'email', type: 'email', label: 'Email', required: true },
    { name: 'password', type: 'password', label: 'Password', required: true, width: 6 },
    { name: 'confirmPassword', type: 'password', label: 'Confirm Password', required: true, width: 6 },
    { name: 'birthDate', type: 'date', label: 'Birth Date' },
    { name: 'gender', type: 'radio', label: 'Gender', options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' },
    ]},
    { name: 'terms', type: 'checkbox', label: 'I agree to the terms and conditions', required: true },
  ];
  
  const handleSubmit = (data) => {
    console.log('Registration submitted:', data);
    // Submit data to server, etc.
  };
  
  return (
    <DynamicFormGenerator
      fields={fields}
      onSubmit={handleSubmit}
      submitText="Register"
      showErrorSummary={true}
    />
  );
}
```

### Survey Form

```jsx
import { DynamicFormGenerator } from 'strive-ui';

function SurveyForm() {
  const fields = [
    { name: 'name', type: 'text', label: 'Your Name', required: true },
    { name: 'email', type: 'email', label: 'Your Email', required: true },
    { name: 'age', type: 'number', label: 'Your Age', width: 6 },
    { name: 'occupation', type: 'text', label: 'Your Occupation', width: 6 },
    { name: 'satisfaction', type: 'rating', label: 'How satisfied are you with our product?', required: true },
    { name: 'usageFrequency', type: 'select', label: 'How often do you use our product?', options: [
      { value: 'daily', label: 'Daily' },
      { value: 'weekly', label: 'Weekly' },
      { value: 'monthly', label: 'Monthly' },
      { value: 'rarely', label: 'Rarely' },
    ]},
    { name: 'features', type: 'multiselect', label: 'Which features do you use the most?', options: [
      { value: 'feature1', label: 'Feature 1' },
      { value: 'feature2', label: 'Feature 2' },
      { value: 'feature3', label: 'Feature 3' },
      { value: 'feature4', label: 'Feature 4' },
    ]},
    { name: 'improvements', type: 'textarea', label: 'What improvements would you suggest?' },
    { name: 'contactForFeedback', type: 'checkbox', label: 'May we contact you for additional feedback?' },
  ];
  
  const handleSubmit = (data) => {
    console.log('Survey submitted:', data);
    // Submit data to server, etc.
  };
  
  return (
    <DynamicFormGenerator
      fields={fields}
      onSubmit={handleSubmit}
      submitText="Submit Survey"
    />
  );
}
```

## Customization

The DynamicFormGenerator component can be customized using styled-components:

```jsx
import styled from 'styled-components';
import { DynamicFormGenerator } from 'strive-ui';

const CustomDynamicFormGenerator = styled(DynamicFormGenerator)`
  /* Custom styles for the form */
  background-color: #f9f9f9;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

function StyledForm() {
  return (
    <CustomDynamicFormGenerator
      fields={[
        { name: 'name', type: 'text', label: 'Name', required: true },
        { name: 'email', type: 'email', label: 'Email', required: true },
      ]}
      onSubmit={(data) => console.log(data)}
    />
  );
}
```

## Integration with Form Libraries

The DynamicFormGenerator component is built on top of react-hook-form, which provides a powerful and flexible form management solution. The useDynamicForm hook can be used to integrate with other form libraries if needed.

## Conclusion

The DynamicFormGenerator component provides a flexible and powerful solution for creating dynamic forms in your React applications. With its headless architecture, you can either use the pre-styled components or create your own custom UI while leveraging the built-in logic for validation, conditional fields, and state management.
