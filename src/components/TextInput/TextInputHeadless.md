# TextInputHeadless

A headless implementation of a text input component that provides all the functionality without any styling. This component follows the headless UI pattern, allowing developers to have complete control over styling while maintaining proper functionality and accessibility.

## Features

- **Fully customizable**: Complete control over styling with zero default styles
- **Accessible**: Built with proper ARIA attributes
- **Compound component API**: Intuitive API with nested components
- **Polymorphic**: Can render as any HTML element or React component
- **Controlled & uncontrolled modes**: Works with both controlled and uncontrolled inputs
- **Focus management**: Tracks focus state and provides focus/blur methods
- **Clear functionality**: Built-in clear method and optional clear button

## Basic Usage

### With Regular CSS

```jsx
import { TextInput } from 'pulseui';
import './styles.css'; // Your CSS file

function BasicTextInput() {
  return (
    <TextInput 
      label="Username" 
      placeholder="Enter your username"
      className="input-container"
    >
      <TextInput.Label className="input-label" />
      <div className="input-wrapper">
        <TextInput.Field className="input-field" />
        <TextInput.ClearButton className="input-clear-button" />
      </div>
    </TextInput>
  );
}

// In styles.css
/*
.input-container {
  margin-bottom: 16px;
}

.input-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-field {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}

.input-field:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.input-clear-button {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
}

.input-clear-button:hover {
  color: #1f2937;
}
*/
```

### With Tailwind CSS

```jsx
import { TextInput } from 'pulseui';

function TailwindTextInput() {
  return (
    <TextInput 
      label="Email" 
      type="email"
      placeholder="Enter your email"
      className="mb-4"
    >
      <TextInput.Label className="block mb-2 text-sm font-medium text-gray-700" />
      <div className="relative">
        <TextInput.Field className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        <TextInput.ClearButton className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" />
      </div>
    </TextInput>
  );
}
```

### With styled-components

```jsx
import { TextInput } from 'pulseui';
import styled from 'styled-components';

const Container = styled.div`
  margin-bottom: 16px;
`;

const Label = styled(TextInput.Label)`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled(TextInput.Field)`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
  
  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
`;

const ClearButton = styled(TextInput.ClearButton)`
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  
  &:hover {
    color: #1f2937;
  }
  
  &:disabled {
    color: #d1d5db;
    cursor: not-allowed;
  }
`;

function StyledTextInput() {
  return (
    <TextInput 
      label="Password" 
      type="password"
      placeholder="Enter your password"
      as={Container}
    >
      <Label />
      <InputWrapper>
        <Input />
        <ClearButton />
      </InputWrapper>
    </TextInput>
  );
}
```

### With CSS Modules

```jsx
import { TextInput } from 'pulseui';
import styles from './TextInput.module.css';

function CSSModulesTextInput() {
  return (
    <TextInput 
      label="Search" 
      type="search"
      placeholder="Search..."
      className={styles.container}
    >
      <TextInput.Label className={styles.label} />
      <div className={styles.inputWrapper}>
        <TextInput.Field className={styles.input} />
        <TextInput.ClearButton className={styles.clearButton} />
      </div>
    </TextInput>
  );
}

// In TextInput.module.css
/*
.container {
  margin-bottom: 16px;
}

.label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.inputWrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}

.input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.clearButton {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
}

.clearButton:hover {
  color: #1f2937;
}
*/
```

## Advanced Usage

### With Render Props

```jsx
import { TextInput } from 'pulseui';

function RenderPropsTextInput() {
  return (
    <TextInput 
      defaultValue="Hello World"
      placeholder="Type something..."
    >
      {({ value, isFocused, isDisabled, clear }) => (
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Custom Input
          </label>
          
          <div className={`
            relative flex items-center border rounded-md overflow-hidden
            ${isFocused ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-300'}
            ${isDisabled ? 'bg-gray-100' : 'bg-white'}
          `}>
            <TextInput.Field className="w-full px-3 py-2 focus:outline-none" />
            
            {value && (
              <button
                type="button"
                onClick={clear}
                className="absolute right-2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          
          <div className="text-xs text-gray-500">
            Current value: {value || '(empty)'}
          </div>
        </div>
      )}
    </TextInput>
  );
}
```

### With Validation

```jsx
import { TextInput } from 'pulseui';
import { useState } from 'react';

function ValidationTextInput() {
  const [error, setError] = useState('');
  
  const handleBlur = (e) => {
    const value = e.target.value;
    if (!value) {
      setError('This field is required');
    } else if (value.length < 3) {
      setError('Must be at least 3 characters');
    } else {
      setError('');
    }
  };
  
  return (
    <div className="space-y-1">
      <TextInput 
        label="Username" 
        required
        placeholder="Enter username"
        onBlur={handleBlur}
      >
        <TextInput.Label className="block text-sm font-medium text-gray-700" />
        <div className="mt-1 relative rounded-md shadow-sm">
          <TextInput.Field 
            className={`
              block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm
              ${error ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : 
                'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}
            `}
          />
          <TextInput.ClearButton className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600" />
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </TextInput>
    </div>
  );
}
```

## Props

### TextInput

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| defaultValue | string | '' | Default value for uncontrolled input |
| value | string | - | Controlled input value |
| onChange | (value: string, event: ChangeEvent) => void | - | Callback when value changes |
| onFocus | (event: FocusEvent) => void | - | Callback when input is focused |
| onBlur | (event: FocusEvent) => void | - | Callback when input loses focus |
| onKeyDown | (event: KeyboardEvent) => void | - | Callback when key is pressed |
| onKeyUp | (event: KeyboardEvent) => void | - | Callback when key is released |
| disabled | boolean | false | Whether the input is disabled |
| readOnly | boolean | false | Whether the input is read-only |
| required | boolean | false | Whether the input is required |
| placeholder | string | - | Input placeholder text |
| maxLength | number | - | Maximum length of input value |
| minLength | number | - | Minimum length of input value |
| pattern | string | - | Pattern for input validation |
| name | string | - | Input name |
| autoComplete | string | - | Input autocomplete attribute |
| autoFocus | boolean | - | Whether to auto-focus the input |
| form | string | - | Input form ID |
| size | number | - | Input size |
| spellCheck | boolean | - | Input spellcheck attribute |
| type | string | 'text' | Input type (text, password, email, etc.) |
| id | string | - | Input ID (auto-generated if not provided) |
| label | string | - | Label text for the input |
| className | string | - | Custom class name for container |
| style | object | - | Custom styles for container |
| as | React.ElementType | 'div' | Element type to render as |
| children | React.ReactNode \| Function | - | Children or render prop function |

### TextInput.Label

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | string | - | Custom class name |
| style | object | - | Custom styles |
| as | React.ElementType | 'label' | Element type to render as |
| children | React.ReactNode | - | Children to render |

### TextInput.Field

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | string | - | Custom class name |
| style | object | - | Custom styles |
| as | React.ElementType | 'input' | Element type to render as |

### TextInput.ClearButton

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | string | - | Custom class name |
| style | object | - | Custom styles |
| as | React.ElementType | 'button' | Element type to render as |
| children | React.ReactNode | '✕' | Children to render |

## Accessibility

The TextInputHeadless component includes several accessibility features:

- Proper label association using htmlFor/id
- ARIA attributes for disabled, required, and readonly states
- Focus management
- Clear button with appropriate aria-label
