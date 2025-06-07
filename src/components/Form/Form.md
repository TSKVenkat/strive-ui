# Form Component

The Form component provides a structured way to build forms with validation, error handling, and accessibility features. It includes various form controls and layout options to create consistent and user-friendly forms.

## Import

```jsx
import { Form } from 'pulseui';
```

## Features

- Built-in form validation
- Error message handling
- Accessible form controls
- Consistent styling and layout
- Support for various input types
- Form groups and sections
- Responsive design
- Integration with form libraries

## Usage

```jsx
import { Form, Button } from 'pulseui';
import { useState } from 'react';

function FormExample() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    terms: false
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label htmlFor="name">Name</Form.Label>
        <Form.Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </Form.Group>
      
      <Form.Group>
        <Form.Label htmlFor="email">Email</Form.Label>
        <Form.Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Form.HelperText>We'll never share your email.</Form.HelperText>
      </Form.Group>
      
      <Form.Group>
        <Form.Label htmlFor="password">Password</Form.Label>
        <Form.Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </Form.Group>
      
      <Form.Group>
        <Form.Checkbox
          id="terms"
          name="terms"
          checked={formData.terms}
          onChange={handleChange}
        >
          I agree to the terms and conditions
        </Form.Checkbox>
      </Form.Group>
      
      <Form.Group>
        <Button type="submit" variant="primary">Submit</Button>
      </Form.Group>
    </Form>
  );
}
```

## Form with Validation

```jsx
import { Form, Button } from 'pulseui';
import { useState } from 'react';

function ValidationFormExample() {
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  
  const [errors, setErrors] = useState({});
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form is valid, submitting:', formData);
    }
  };
  
  return (
    <Form onSubmit={handleSubmit} noValidate>
      <Form.Group>
        <Form.Label htmlFor="username">Username</Form.Label>
        <Form.Input
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={!!errors.username}
        />
        {errors.username && (
          <Form.ErrorMessage>{errors.username}</Form.ErrorMessage>
        )}
      </Form.Group>
      
      <Form.Group>
        <Form.Label htmlFor="email">Email</Form.Label>
        <Form.Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
        />
        {errors.email && (
          <Form.ErrorMessage>{errors.email}</Form.ErrorMessage>
        )}
      </Form.Group>
      
      <Form.Group>
        <Button type="submit" variant="primary">Submit</Button>
      </Form.Group>
    </Form>
  );
}
```

## Props

### Form Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSubmit` | (event: React.FormEvent) => void | - | Form submission handler |
| `noValidate` | boolean | false | Disables browser's native form validation |
| `autoComplete` | 'on' \| 'off' | 'on' | Form autocomplete attribute |
| `children` | ReactNode | - | Form content |

### Form.Group Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Group content |
| `spacing` | number \| string | '1rem' | Spacing between elements in the group |
| `inline` | boolean | false | Whether to display elements inline |

### Form.Label Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `htmlFor` | string | - | ID of the form control this label is for |
| `required` | boolean | false | Whether to show a required indicator |
| `children` | ReactNode | - | Label content |

### Form.Input Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | string | - | Input ID |
| `name` | string | - | Input name |
| `type` | string | 'text' | Input type |
| `value` | string | - | Input value |
| `defaultValue` | string | - | Default input value |
| `onChange` | (event: React.ChangeEvent<HTMLInputElement>) => void | - | Change event handler |
| `placeholder` | string | - | Input placeholder |
| `disabled` | boolean | false | Whether the input is disabled |
| `readOnly` | boolean | false | Whether the input is read-only |
| `required` | boolean | false | Whether the input is required |
| `error` | boolean | false | Whether the input has an error |
| `size` | 'sm' \| 'md' \| 'lg' | 'md' | Size of the input |

### Form.HelperText Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Helper text content |

### Form.ErrorMessage Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Error message content |

## Accessibility

The Form component follows accessibility best practices:
- Uses semantic HTML elements
- Associates labels with form controls
- Provides error messages that are announced to screen readers
- Supports keyboard navigation
- Includes focus management
- Uses appropriate ARIA attributes
- Ensures adequate color contrast for all states
