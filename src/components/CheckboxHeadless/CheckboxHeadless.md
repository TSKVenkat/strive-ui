# CheckboxHeadless

A headless checkbox component that provides all the functionality without any styling. This component can be used as a base for creating custom styled checkbox implementations.

## Features

- Supports both controlled and uncontrolled modes
- Supports indeterminate state
- Compound component API for flexible customization
- Polymorphic components (can render as any HTML element or React component)
- Fully accessible with proper ARIA attributes
- Keyboard navigation support
- Focus management

## Installation

```bash
npm install @strive-ui/checkbox
```

## Usage

### Basic Usage

```jsx
import { Checkbox } from '@strive-ui/checkbox';

function MyComponent() {
  return (
    <Checkbox label="Accept terms and conditions" />
  );
}
```

### Controlled Checkbox

```jsx
import { useState } from 'react';
import { Checkbox } from '@strive-ui/checkbox';

function ControlledCheckbox() {
  const [checked, setChecked] = useState(false);
  
  return (
    <Checkbox 
      checked={checked} 
      onChange={(isChecked) => setChecked(isChecked)}
      label="I agree to the terms and conditions"
    />
  );
}
```

### Indeterminate State

```jsx
import { useState } from 'react';
import { Checkbox } from '@strive-ui/checkbox';

function IndeterminateCheckbox() {
  const [parentChecked, setParentChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(true);
  const [childChecked1, setChildChecked1] = useState(false);
  const [childChecked2, setChildChecked2] = useState(true);
  
  const updateParentState = () => {
    if (childChecked1 && childChecked2) {
      setParentChecked(true);
      setIndeterminate(false);
    } else if (!childChecked1 && !childChecked2) {
      setParentChecked(false);
      setIndeterminate(false);
    } else {
      setParentChecked(false);
      setIndeterminate(true);
    }
  };
  
  return (
    <div>
      <Checkbox 
        checked={parentChecked}
        indeterminate={indeterminate}
        onChange={(isChecked) => {
          setParentChecked(isChecked);
          setIndeterminate(false);
          setChildChecked1(isChecked);
          setChildChecked2(isChecked);
        }}
        label="Select all"
      />
      
      <div style={{ marginLeft: 24 }}>
        <Checkbox 
          checked={childChecked1}
          onChange={(isChecked) => {
            setChildChecked1(isChecked);
            updateParentState();
          }}
          label="Option 1"
        />
        
        <Checkbox 
          checked={childChecked2}
          onChange={(isChecked) => {
            setChildChecked2(isChecked);
            updateParentState();
          }}
          label="Option 2"
        />
      </div>
    </div>
  );
}
```

### Custom Styling with Compound Components

```jsx
import { Checkbox } from '@strive-ui/checkbox';

function CustomCheckbox() {
  return (
    <Checkbox>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Checkbox.Input style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
        <Checkbox.Control 
          style={{ 
            width: '20px', 
            height: '20px', 
            border: '2px solid #6366F1', 
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white'
          }}
        >
          <Checkbox.Indicator style={{ color: '#6366F1' }} />
        </Checkbox.Control>
        <Checkbox.Label style={{ cursor: 'pointer' }}>
          Custom styled checkbox
        </Checkbox.Label>
      </div>
    </Checkbox>
  );
}
```

### Styling with Tailwind CSS

```jsx
import { Checkbox } from '@strive-ui/checkbox';

function TailwindCheckbox() {
  return (
    <Checkbox className="flex items-center gap-2">
      <Checkbox.Input className="sr-only" />
      <Checkbox.Control 
        className="w-5 h-5 border-2 border-indigo-500 rounded flex items-center justify-center bg-white"
        data-checked-class="bg-indigo-500"
      >
        <Checkbox.Indicator className="text-white" />
      </Checkbox.Control>
      <Checkbox.Label className="text-gray-700 cursor-pointer">
        Tailwind styled checkbox
      </Checkbox.Label>
    </Checkbox>
  );
}
```

### Styling with Styled Components

```jsx
import styled from 'styled-components';
import { Checkbox } from '@strive-ui/checkbox';

const StyledCheckbox = styled(Checkbox)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledInput = styled(Checkbox.Input)`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const StyledControl = styled(Checkbox.Control)`
  width: 20px;
  height: 20px;
  border: 2px solid #6366F1;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  
  &[data-state="checked"] {
    background-color: #6366F1;
  }
  
  &[data-state="indeterminate"] {
    background-color: #6366F1;
  }
  
  &[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledIndicator = styled(Checkbox.Indicator)`
  color: white;
`;

const StyledLabel = styled(Checkbox.Label)`
  color: #374151;
  cursor: pointer;
  
  &[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

function StyledComponentsCheckbox() {
  return (
    <StyledCheckbox>
      <StyledInput />
      <StyledControl>
        <StyledIndicator />
      </StyledControl>
      <StyledLabel>Styled components checkbox</StyledLabel>
    </StyledCheckbox>
  );
}
```

### Styling with CSS Modules

```jsx
// Checkbox.module.css
.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.control {
  width: 20px;
  height: 20px;
  border: 2px solid #6366F1;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
}

.control[data-state="checked"] {
  background-color: #6366F1;
}

.control[data-state="indeterminate"] {
  background-color: #6366F1;
}

.control[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.indicator {
  color: white;
}

.label {
  color: #374151;
  cursor: pointer;
}

.label[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
```

```jsx
import styles from './Checkbox.module.css';
import { Checkbox } from '@strive-ui/checkbox';

function CSSModulesCheckbox() {
  return (
    <Checkbox className={styles.checkbox}>
      <Checkbox.Input className={styles.input} />
      <Checkbox.Control className={styles.control}>
        <Checkbox.Indicator className={styles.indicator} />
      </Checkbox.Control>
      <Checkbox.Label className={styles.label}>
        CSS Modules checkbox
      </Checkbox.Label>
    </Checkbox>
  );
}
```

### Using the Render Prop Pattern

```jsx
import { Checkbox } from '@strive-ui/checkbox';

function RenderPropCheckbox() {
  return (
    <Checkbox>
      {({ checked, indeterminate, disabled, focused, toggle }) => (
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            padding: '8px',
            backgroundColor: focused ? '#F3F4F6' : 'transparent',
            borderRadius: '4px',
          }}
        >
          <Checkbox.Input />
          <div 
            style={{ 
              width: '20px', 
              height: '20px', 
              border: `2px solid ${checked || indeterminate ? '#6366F1' : '#D1D5DB'}`,
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: checked || indeterminate ? '#6366F1' : 'white',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.5 : 1,
            }}
            onClick={disabled ? undefined : toggle}
          >
            {(checked || indeterminate) && (
              <div style={{ color: 'white' }}>
                {indeterminate ? (
                  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none">
                    <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none">
                    <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            )}
          </div>
          <span 
            style={{ 
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.5 : 1,
            }}
            onClick={disabled ? undefined : toggle}
          >
            Custom render prop checkbox
          </span>
        </div>
      )}
    </Checkbox>
  );
}
```

## API Reference

### Checkbox (Root Component)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| defaultChecked | boolean | false | Default checked state (uncontrolled) |
| checked | boolean | - | Controlled checked state |
| onChange | (checked: boolean, event: ChangeEvent) => void | - | Callback when checked state changes |
| disabled | boolean | false | Whether the checkbox is disabled |
| required | boolean | false | Whether the checkbox is required |
| indeterminate | boolean | false | Whether the checkbox is in an indeterminate state |
| name | string | - | Name attribute for the input |
| value | string | - | Value attribute for the input |
| id | string | auto-generated | ID for the input element |
| label | string | - | Label text for the checkbox |
| children | ReactNode \| RenderFunction | - | Children to render inside the component |
| as | ElementType | 'div' | Element or component to render as |
| className | string | - | Custom class name |
| style | CSSProperties | - | Custom styles |

### Checkbox.Input

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | ElementType | 'input' | Element or component to render as |
| className | string | - | Custom class name |
| style | CSSProperties | - | Custom styles |
| ...rest | InputHTMLAttributes | - | All other props are passed to the underlying input element |

### Checkbox.Label

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | ElementType | 'label' | Element or component to render as |
| children | ReactNode | - | Children to render inside the label |
| className | string | - | Custom class name |
| style | CSSProperties | - | Custom styles |
| ...rest | LabelHTMLAttributes | - | All other props are passed to the underlying label element |

### Checkbox.Control

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | ElementType | 'div' | Element or component to render as |
| children | ReactNode | - | Children to render inside the control |
| className | string | - | Custom class name |
| style | CSSProperties | - | Custom styles |
| ...rest | HTMLAttributes | - | All other props are passed to the underlying element |

### Checkbox.Indicator

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | ElementType | 'div' | Element or component to render as |
| children | ReactNode \| RenderFunction | - | Children to render inside the indicator |
| className | string | - | Custom class name |
| style | CSSProperties | - | Custom styles |
| ...rest | HTMLAttributes | - | All other props are passed to the underlying element |

## Accessibility

The CheckboxHeadless component follows the WAI-ARIA checkbox pattern and includes the following accessibility features:

- Proper ARIA roles and attributes (`aria-checked`, `aria-disabled`, `aria-required`)
- Keyboard navigation support (space to toggle)
- Focus management
- Label association with the input element

## Hooks

### useCheckbox

If you need more control, you can use the `useCheckbox` hook directly:

```jsx
import { useCheckbox } from '@strive-ui/checkbox';

function MyCustomCheckbox() {
  const { 
    checked,
    indeterminate,
    disabled,
    required,
    focused,
    id,
    inputRef,
    setChecked,
    toggle,
    focus,
    getInputProps,
    getLabelProps,
  } = useCheckbox({
    defaultChecked: false,
    disabled: false,
    required: false,
    indeterminate: false,
  });
  
  return (
    <div>
      <input {...getInputProps()} />
      <label {...getLabelProps()}>Custom checkbox</label>
    </div>
  );
}
```
