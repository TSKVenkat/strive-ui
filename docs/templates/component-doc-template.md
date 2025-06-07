# ComponentName

Brief description of the component's purpose, main use cases, and how it fits into the headless architecture of Pulse UI.

## Overview

A more detailed explanation of the component, its design philosophy, and how it follows the headless component pattern.

## Installation

```bash
npm install @pulseui/core
```

## Import

```jsx
// Import the component
import { ComponentName } from '@pulseui/core';

// Import the hook (for headless usage)
import { useComponentName } from '@pulseui/core';
```

## Features

- Feature 1
- Feature 2
- Feature 3
- Accessibility support
- Keyboard navigation
- Customizable styling

## Component Usage

### Basic Usage

```jsx
<ComponentName>Content</ComponentName>
```

### With Props

```jsx
<ComponentName 
  prop1="value" 
  prop2={value}
  onChange={handleChange}
>
  Content
</ComponentName>
```

### Styled Usage

```jsx
import styled from 'styled-components';

const StyledComponent = styled(ComponentName)`
  background-color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.md};
`;

<StyledComponent>Styled Content</StyledComponent>
```

## Headless Usage

```jsx
function CustomComponent() {
  const { state, getProps } = useComponentName({
    // Initial options
    initialValue: 'value',
    onChange: handleChange,
  });
  
  return (
    <div {...getProps()}>
      {/* Custom implementation */}
      {state.isActive ? 'Active' : 'Inactive'}
    </div>
  );
}
```

## Compound Component Pattern

If the component supports the compound component pattern:

```jsx
<ComponentName.Root>
  <ComponentName.Trigger>Open</ComponentName.Trigger>
  <ComponentName.Content>
    <ComponentName.Item>Item 1</ComponentName.Item>
    <ComponentName.Item>Item 2</ComponentName.Item>
  </ComponentName.Content>
</ComponentName.Root>
```

## Props

### ComponentName Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `ElementType` | `'div'` | Polymorphic component prop to render as different element |
| `prop1` | `string` | `'default'` | Description of prop1 |
| `prop2` | `number` | `0` | Description of prop2 |
| `prop3` | `boolean` | `false` | Description of prop3 |
| `onChange` | `(value: any) => void` | `undefined` | Callback when value changes |

### useComponentName Hook Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `initialValue` | `any` | `undefined` | Initial value for the component |
| `onChange` | `(value: any) => void` | `undefined` | Callback when value changes |
| `disabled` | `boolean` | `false` | Whether the component is disabled |

### useComponentName Hook Return Value

| Property | Type | Description |
|----------|------|-------------|
| `state` | `object` | Current state of the component |
| `getProps` | `() => object` | Function to get props for the root element |
| `actions` | `object` | Actions to update the component state |

## Variants

If the component has variants, describe them here with examples:

```jsx
// Variant 1
<ComponentName variant="primary">Primary</ComponentName>

// Variant 2
<ComponentName variant="secondary">Secondary</ComponentName>
```

## Sizes

If the component has different sizes, describe them here with examples:

```jsx
// Small size
<ComponentName size="sm">Small</ComponentName>

// Medium size
<ComponentName size="md">Medium</ComponentName>

// Large size
<ComponentName size="lg">Large</ComponentName>
```

## States

If the component has different states, describe them here with examples:

```jsx
// Disabled state
<ComponentName disabled>Disabled</ComponentName>

// Loading state
<ComponentName isLoading>Loading</ComponentName>

// Error state
<ComponentName error="Invalid input">Error</ComponentName>
```

## Accessibility

Describe accessibility features and considerations:

- Keyboard navigation (Tab, Enter, Space, Arrow keys, etc.)
- Screen reader announcements
- ARIA attributes (roles, states, properties)
- Focus management and focus trapping (if applicable)
- Color contrast compliance
- Reduced motion support

## Best Practices

Provide guidelines and best practices for using the component:

- When to use this component
- When not to use this component
- Common patterns and combinations with other components
- Performance considerations and optimizations
- Server-side rendering considerations

## Examples

### Integration with Form

```jsx
function FormExample() {
  const { register, handleSubmit } = useForm();
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ComponentName {...register('fieldName')}>
        Form content
      </ComponentName>
    </form>
  );
}
```

### With Theme

```jsx
import { createTheme, ThemeProvider } from '@pulseui/core';

const theme = createTheme({
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
  },
});

function ThemedComponent() {
  return (
    <ThemeProvider theme={theme}>
      <ComponentName>Themed content</ComponentName>
    </ThemeProvider>
  );
}
```

### Advanced Usage

```jsx
function AdvancedExample() {
  const [value, setValue] = useState('');
  
  const { state, getProps } = useComponentName({
    value,
    onChange: setValue,
    disabled: false,
  });
  
  return (
    <div>
      <ComponentName {...getProps()}>
        Advanced usage
      </ComponentName>
      <p>Current state: {JSON.stringify(state)}</p>
    </div>
  );
}
```

## Troubleshooting

Common issues and solutions:

- **Issue 1**: Description and solution
- **Issue 2**: Description and solution
- **Issue 3**: Description and solution

## Related Components

List related components that work well together:

- [ComponentA](./ComponentA.md) - For similar functionality
- [ComponentB](./ComponentB.md) - For composition patterns
- [ComponentC](./ComponentC.md) - For form integration
