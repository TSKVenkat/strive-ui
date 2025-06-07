# FormStyled Component

The `FormStyled` component is a comprehensive form solution that combines the flexibility of headless form components with beautiful, accessible styling. It provides a complete form system with validation, error handling, and a variety of input types.

## Features

- **Validation**: Built-in validation with support for required fields, patterns, min/max length, custom validation functions, and more
- **Error Handling**: Automatic error display with customizable error messages
- **Accessibility**: ARIA attributes for improved accessibility
- **Flexibility**: Compound component pattern for maximum flexibility
- **Styling**: Pre-styled components that match the design system
- **Form State Management**: Tracks form state including validation, submission, and dirty state

## Installation

```jsx
import { FormStyled } from 'pulseui';
```

## Basic Usage

```jsx
import { FormStyled } from 'pulseui';

const MyForm = () => {
  const handleSubmit = (values) => {
    console.log('Form submitted with values:', values);
  };

  return (
    <FormStyled onSubmit={handleSubmit}>
      <FormStyled.Input
        name="name"
        label="Full Name"
        validation={{ required: true }}
        placeholder="John Doe"
      />
      <FormStyled.Input
        name="email"
        label="Email Address"
        validation={{
          required: true,
          pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        }}
        helperText="We'll never share your email with anyone else."
        placeholder="john@example.com"
      />
      <FormStyled.SubmitButton>Submit</FormStyled.SubmitButton>
    </FormStyled>
  );
};
```

## Components

### FormStyled

The root component that provides form context and handles form submission.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSubmit` | `(values: Record<string, any>) => void \| Promise<void>` | - | Callback function called when the form is submitted and validation passes |
| `spacing` | `'sm' \| 'md' \| 'lg'` | `'md'` | Spacing between form elements |
| `config` | `FormConfig` | `{}` | Form configuration options |
| `...props` | `React.FormHTMLAttributes<HTMLFormElement>` | - | Any additional props are passed to the form element |

### FormStyled.Input

A styled input component that connects to the form context.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | - | Name of the input field (required) |
| `validation` | `ValidationRule` | - | Validation rules for the input |
| `label` | `string` | - | Label for the input |
| `helperText` | `string` | - | Helper text displayed below the input |
| `...props` | `React.InputHTMLAttributes<HTMLInputElement>` | - | Any additional props are passed to the input element |

### FormStyled.Textarea

A styled textarea component that connects to the form context.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | - | Name of the textarea field (required) |
| `validation` | `ValidationRule` | - | Validation rules for the textarea |
| `label` | `string` | - | Label for the textarea |
| `helperText` | `string` | - | Helper text displayed below the textarea |
| `...props` | `React.TextareaHTMLAttributes<HTMLTextAreaElement>` | - | Any additional props are passed to the textarea element |

### FormStyled.Select

A styled select component that connects to the form context.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | - | Name of the select field (required) |
| `validation` | `ValidationRule` | - | Validation rules for the select |
| `label` | `string` | - | Label for the select |
| `helperText` | `string` | - | Helper text displayed below the select |
| `options` | `Array<{ value: string; label: string }>` | - | Options for the select |
| `...props` | `React.SelectHTMLAttributes<HTMLSelectElement>` | - | Any additional props are passed to the select element |

### FormStyled.Checkbox

A styled checkbox component that connects to the form context.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | - | Name of the checkbox field (required) |
| `validation` | `ValidationRule` | - | Validation rules for the checkbox |
| `label` | `string` | - | Label for the checkbox |
| `helperText` | `string` | - | Helper text displayed below the checkbox |
| `...props` | `React.InputHTMLAttributes<HTMLInputElement>` | - | Any additional props are passed to the input element |

### FormStyled.SubmitButton

A styled submit button component that connects to the form context.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loadingContent` | `React.ReactNode` | `'Submitting...'` | Content to display when the form is submitting |
| `disableOnInvalid` | `boolean` | `false` | Whether to disable the button when the form is invalid |
| `disableOnSubmitting` | `boolean` | `true` | Whether to disable the button when the form is submitting |
| `...props` | `React.ButtonHTMLAttributes<HTMLButtonElement>` | - | Any additional props are passed to the button element |

## Validation

The `validation` prop accepts a `ValidationRule` object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `required` | `boolean` | Whether the field is required |
| `minLength` | `number` | Minimum length for string values |
| `maxLength` | `number` | Maximum length for string values |
| `pattern` | `RegExp` | Pattern for string values |
| `min` | `number` | Minimum value for number values |
| `max` | `number` | Maximum value for number values |
| `validate` | `(value: any, formValues: Record<string, any>) => boolean \| string` | Custom validation function |
| `message` | `string` | Custom error message |

## Advanced Usage

### Custom Validation

```jsx
<FormStyled.Input
  name="password"
  type="password"
  label="Password"
  validation={{
    required: true,
    minLength: 8,
    validate: (value) => {
      if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
      if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
      if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
      if (!/[^A-Za-z0-9]/.test(value)) return 'Password must contain at least one special character';
      return true;
    },
  }}
/>
```

### Cross-Field Validation

```jsx
<FormStyled.Input
  name="confirmPassword"
  type="password"
  label="Confirm Password"
  validation={{
    required: true,
    validate: (value, formValues) => {
      return value === formValues.password || 'Passwords do not match';
    },
  }}
/>
```

### Dynamic Forms

```jsx
const [showExtraField, setShowExtraField] = useState(false);

<FormStyled onSubmit={handleSubmit}>
  <FormStyled.Select
    name="accountType"
    label="Account Type"
    options={[
      { value: 'personal', label: 'Personal' },
      { value: 'business', label: 'Business' },
    ]}
    onChange={(e) => setShowExtraField(e.target.value === 'business')}
  />
  
  {showExtraField && (
    <FormStyled.Input
      name="companyName"
      label="Company Name"
      validation={{ required: true }}
    />
  )}
  
  <FormStyled.SubmitButton>Submit</FormStyled.SubmitButton>
</FormStyled>
```

## Accessibility

The FormStyled components follow accessibility best practices:

- Form elements have proper labels and are associated with their inputs
- Error messages are linked to inputs with aria-describedby
- Invalid inputs are marked with aria-invalid
- Submit buttons show loading state and can be disabled during submission
- Focus management for improved keyboard navigation
