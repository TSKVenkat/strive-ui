# Compound Select

The Compound Select component is a flexible and customizable select component that uses the compound component pattern. This pattern provides both simple and advanced APIs, allowing for greater flexibility and customization.

## Features

- Simple and advanced APIs
- Fully customizable trigger and dropdown
- Keyboard navigation
- Accessibility support
- Animation support
- Custom item rendering
- Controlled and uncontrolled modes
- Different sizes
- Error and disabled states

## Installation

```jsx
import { Select } from 'pulseui';
```

## Usage

### Simple Usage

```jsx
import { Select } from 'pulseui';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
];

function MyComponent() {
  return (
    <Select.Root options={options} placeholder="Select a fruit">
      <Select.Trigger />
      <Select.Content />
    </Select.Root>
  );
}
```

### Controlled Usage

```jsx
import { Select } from 'pulseui';
import { useState } from 'react';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
];

function MyComponent() {
  const [value, setValue] = useState('apple');
  
  return (
    <Select.Root 
      options={options} 
      value={value} 
      onValueChange={(newValue) => setValue(newValue)}
      placeholder="Select a fruit"
    >
      <Select.Trigger />
      <Select.Content />
    </Select.Root>
  );
}
```

### Custom Trigger

```jsx
import { Select } from 'pulseui';
import styled from 'styled-components';

const CustomTrigger = styled(Select.Trigger)`
  border-radius: 30px;
  background: linear-gradient(to right, #6a11cb, #2575fc);
  color: white;
  border: none;
  
  &:hover {
    background: linear-gradient(to right, #5a0fcb, #1565fc);
  }
`;

function MyComponent() {
  return (
    <Select.Root options={options} placeholder="Select a fruit">
      <CustomTrigger>
        <span>Choose a fruit</span>
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d="M8 12L2 6H14L8 12Z" fill="currentColor" />
        </svg>
      </CustomTrigger>
      <Select.Content />
    </Select.Root>
  );
}
```

### Custom Items

```jsx
import { Select } from 'pulseui';
import styled from 'styled-components';

const CustomItem = styled(Select.Item)`
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: #f0f9ff;
  }
`;

const FruitIcon = ({ fruit }) => {
  const icons = {
    apple: '🍎',
    banana: '🍌',
    orange: '🍊',
  };
  
  return <span>{icons[fruit] || '🍽️'}</span>;
};

function MyComponent() {
  return (
    <Select.Root options={options} placeholder="Select a fruit">
      <Select.Trigger />
      <Select.Content>
        {options.map((option) => (
          <CustomItem key={option.value} value={option.value}>
            <FruitIcon fruit={option.value} />
            {option.label}
          </CustomItem>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
```

## Components

### Select.Root

The root component that manages the state and provides context for all other components.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `SelectOption[]` | Required | Array of options to display |
| `defaultValue` | `string` | - | The default selected value (uncontrolled) |
| `value` | `string` | - | The selected value (controlled) |
| `onValueChange` | `(value: string) => void` | - | Callback when selection changes |
| `placeholder` | `string` | 'Select an option' | Placeholder text when no option is selected |
| `disabled` | `boolean` | `false` | Whether the select is disabled |
| `error` | `boolean` | `false` | Whether the select has an error |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | The size of the select |
| `id` | `string` | - | ID for accessibility |

### Select.Trigger

The trigger component that opens the dropdown when clicked.

#### Props

Accepts all standard HTML div props.

### Select.Content

The dropdown content component that contains the options.

#### Props

Accepts all standard HTML div props.

### Select.Item

The individual option item component.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | Required | The value of the option |
| `disabled` | `boolean` | `false` | Whether the option is disabled |
| `children` | `React.ReactNode` | Required | The content of the option |

## Examples

### Different Sizes

```jsx
<Select.Root options={options} placeholder="Small size" size="sm">
  <Select.Trigger />
  <Select.Content />
</Select.Root>

<Select.Root options={options} placeholder="Medium size" size="md">
  <Select.Trigger />
  <Select.Content />
</Select.Root>

<Select.Root options={options} placeholder="Large size" size="lg">
  <Select.Trigger />
  <Select.Content />
</Select.Root>
```

### Disabled State

```jsx
<Select.Root options={options} placeholder="Disabled select" disabled>
  <Select.Trigger />
  <Select.Content />
</Select.Root>
```

### Error State

```jsx
<Select.Root options={options} placeholder="Error state" error>
  <Select.Trigger />
  <Select.Content />
</Select.Root>
```

### Fully Customized Example

```jsx
import { Select } from 'pulseui';
import styled from 'styled-components';

const CustomSelectContainer = styled.div`
  width: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const CustomSelectTrigger = styled(Select.Trigger)`
  background-color: #1e293b;
  color: white;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 12px 16px;
  font-weight: 500;
  
  &:hover {
    background-color: #334155;
  }
`;

const CustomSelectContent = styled(Select.Content)`
  background-color: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const CustomSelectItem = styled(Select.Item)`
  padding: 10px 16px;
  color: #e2e8f0;
  
  &:hover {
    background-color: #334155;
  }
  
  &[aria-selected="true"] {
    background-color: #2563eb;
    color: white;
    font-weight: bold;
  }
`;

function MyComponent() {
  return (
    <CustomSelectContainer>
      <Select.Root options={options} placeholder="Select a fruit">
        <CustomSelectTrigger>
          <span>Choose a fruit</span>
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" />
          </svg>
        </CustomSelectTrigger>
        <CustomSelectContent>
          {options.map((option) => (
            <CustomSelectItem key={option.value} value={option.value}>
              {option.label}
            </CustomSelectItem>
          ))}
        </CustomSelectContent>
      </Select.Root>
    </CustomSelectContainer>
  );
}
```

## Accessibility

The Compound Select component follows WAI-ARIA guidelines for combobox components:

- The trigger has `role="combobox"` and appropriate ARIA attributes
- The content has `role="listbox"` and is properly labeled
- Each item has `role="option"` and appropriate ARIA states
- Keyboard navigation is fully supported
- Focus is properly managed when opening and closing the dropdown
- Screen reader announcements are provided for state changes
