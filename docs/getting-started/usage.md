# Using Strive UI

## Overview

Strive UI follows a headless component architecture that separates logic from presentation, giving you complete styling freedom while maintaining accessibility and functionality.

## Importing Components

```jsx
// Import components
import { Button, Input, Card } from '@strive-ui/core';

// Import hooks for headless usage
import { useButton, useInput } from '@strive-ui/core';
```

## Basic Setup

Wrap your application with the `ThemeProvider`:

```jsx
import { ThemeProvider } from '@strive-ui/core';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

## Component Patterns

### Standard Usage

Use pre-built components with your own styling:

```jsx
import { Button } from '@strive-ui/core';
import './your-styles.css'; // Your custom styles

function MyComponent() {
  return (
    <Button 
      variant="primary" 
      className="my-custom-button"
      onClick={() => alert('Clicked!')}
    >
      Click Me
    </Button>
  );
}
```

### Headless Pattern

Use the logic hooks directly for complete styling control:

```jsx
import { useButton } from '@strive-ui/core';

function CustomButton({ children, ...props }) {
  const { buttonProps, state } = useButton(props);
  
  return (
    <button 
      {...buttonProps}
      className={`my-button ${state.isHovered ? 'hovered' : ''} ${state.isPressed ? 'pressed' : ''}`}
    >
      {state.isLoading ? 'Loading...' : children}
    </button>
  );
}
```

### Compound Component Pattern

Use the compound component pattern for flexible composition:

```jsx
import { Select } from '@strive-ui/core';

function FilterDropdown() {
  return (
    <Select.Root defaultValue="newest">
      <Select.Label>Sort by</Select.Label>
      <Select.Trigger className="my-trigger" />
      <Select.Content className="my-dropdown">
        <Select.Option value="newest">Newest first</Select.Option>
        <Select.Option value="oldest">Oldest first</Select.Option>
        <Select.Option value="price">Price</Select.Option>
      </Select.Content>
    </Select.Root>
  );
}
```

## Styling Approaches

Strive UI works with any styling method:

### CSS Modules

```jsx
import { Button } from '@strive-ui/core';
import styles from './Button.module.css';

<Button className={styles.button}>Click Me</Button>
```

### Tailwind CSS

```jsx
import { Button } from '@strive-ui/core';

<Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Click Me
</Button>
```

### Styled Components

```jsx
import { Button } from '@strive-ui/core';
import styled from 'styled-components';

const StyledButton = styled(Button)`
  background-color: ${props => props.theme.colors.primary.main};
  border-radius: 4px;
  padding: 8px 16px;
`;

<StyledButton>Click Me</StyledButton>
```

## Form Example

```jsx
import { useState } from 'react';
import { Box, Card, Input, Button, useForm } from '@strive-ui/core';

function LoginForm() {
  const { register, handleSubmit, errors } = useForm();
  
  const onSubmit = (data) => {
    console.log('Form submitted:', data);
  };

  return (
    <Card className="login-card">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register('username', { required: 'Username is required' })}
          label="Username"
          error={errors.username?.message}
        />
        
        <Input
          {...register('password', { required: 'Password is required' })}
          type="password"
          label="Password"
          error={errors.password?.message}
        />
        
        <Button type="submit" variant="primary">
          Log In
        </Button>
      </form>
    </Card>
  );
}
```

## Next Steps

- Explore [component API reference](../README.md)
- Learn about [theming](./theming.md)
- Review [accessibility guidelines](../guides/accessibility.md)
