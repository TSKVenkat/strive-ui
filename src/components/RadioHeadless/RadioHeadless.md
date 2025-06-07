# RadioHeadless

A headless radio button component that provides all the functionality without any styling. This component can be used as a base for creating custom styled radio button implementations.

## Features

- Supports both controlled and uncontrolled modes
- Radio group management for related radio buttons
- Compound component API for flexible customization
- Polymorphic components (can render as any HTML element or React component)
- Fully accessible with proper ARIA attributes
- Keyboard navigation support
- Focus management

## Installation

```bash
npm install @pulseui/radio
```

## Usage

### Basic Usage

```jsx
import { Radio } from '@pulseui/radio';

function MyComponent() {
  return (
    <Radio label="Option 1" value="option1" name="options" />
  );
}
```

### Radio Group

```jsx
import { Radio } from '@pulseui/radio';

function RadioGroupExample() {
  return (
    <Radio.Group name="options" defaultValue="option1">
      <Radio value="option1" label="Option 1" />
      <Radio value="option2" label="Option 2" />
      <Radio value="option3" label="Option 3" />
    </Radio.Group>
  );
}
```

### Controlled Radio Group

```jsx
import { useState } from 'react';
import { Radio } from '@pulseui/radio';

function ControlledRadioGroup() {
  const [value, setValue] = useState('option1');
  
  return (
    <div>
      <h3>Selected value: {value}</h3>
      <Radio.Group 
        name="options" 
        value={value} 
        onChange={(newValue) => setValue(newValue)}
      >
        <Radio value="option1" label="Option 1" />
        <Radio value="option2" label="Option 2" />
        <Radio value="option3" label="Option 3" />
      </Radio.Group>
    </div>
  );
}
```

### Horizontal Radio Group

```jsx
import { Radio } from '@pulseui/radio';

function HorizontalRadioGroup() {
  return (
    <Radio.Group name="options" defaultValue="option1" orientation="horizontal">
      <Radio value="option1" label="Option 1" />
      <Radio value="option2" label="Option 2" />
      <Radio value="option3" label="Option 3" />
    </Radio.Group>
  );
}
```

### Disabled Radio Buttons

```jsx
import { Radio } from '@pulseui/radio';

function DisabledRadioExample() {
  return (
    <Radio.Group name="options" defaultValue="option1">
      <Radio value="option1" label="Option 1" />
      <Radio value="option2" label="Option 2" disabled />
      <Radio value="option3" label="Option 3" />
    </Radio.Group>
  );
}
```

### Custom Styling with Compound Components

```jsx
import { Radio } from '@pulseui/radio';

function CustomRadio() {
  return (
    <Radio value="custom">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Radio.Input style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
        <Radio.Control 
          style={{ 
            width: '20px', 
            height: '20px', 
            border: '2px solid #6366F1', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white'
          }}
        >
          <Radio.Indicator style={{ color: '#6366F1' }} />
        </Radio.Control>
        <Radio.Label style={{ cursor: 'pointer' }}>
          Custom styled radio
        </Radio.Label>
      </div>
    </Radio>
  );
}
```

### Styling with Tailwind CSS

```jsx
import { Radio } from '@pulseui/radio';

function TailwindRadio() {
  return (
    <Radio.Group name="tailwind-options" defaultValue="option1" className="space-y-2">
      <Radio value="option1" className="flex items-center gap-2">
        <Radio.Input className="sr-only" />
        <Radio.Control 
          className="w-5 h-5 border-2 border-indigo-500 rounded-full flex items-center justify-center bg-white"
        >
          <Radio.Indicator className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
        </Radio.Control>
        <Radio.Label className="text-gray-700 cursor-pointer">
          Tailwind Option 1
        </Radio.Label>
      </Radio>
      
      <Radio value="option2" className="flex items-center gap-2">
        <Radio.Input className="sr-only" />
        <Radio.Control 
          className="w-5 h-5 border-2 border-indigo-500 rounded-full flex items-center justify-center bg-white"
        >
          <Radio.Indicator className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
        </Radio.Control>
        <Radio.Label className="text-gray-700 cursor-pointer">
          Tailwind Option 2
        </Radio.Label>
      </Radio>
      
      <Radio value="option3" className="flex items-center gap-2">
        <Radio.Input className="sr-only" />
        <Radio.Control 
          className="w-5 h-5 border-2 border-indigo-500 rounded-full flex items-center justify-center bg-white"
        >
          <Radio.Indicator className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
        </Radio.Control>
        <Radio.Label className="text-gray-700 cursor-pointer">
          Tailwind Option 3
        </Radio.Label>
      </Radio>
    </Radio.Group>
  );
}
```

### Styling with Styled Components

```jsx
import styled from 'styled-components';
import { Radio } from '@pulseui/radio';

const StyledRadioGroup = styled(Radio.Group)`
  display: flex;
  flex-direction: ${props => props['data-orientation'] === 'horizontal' ? 'row' : 'column'};
  gap: ${props => props['data-orientation'] === 'horizontal' ? '16px' : '8px'};
`;

const StyledRadio = styled(Radio)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledInput = styled(Radio.Input)`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const StyledControl = styled(Radio.Control)`
  width: 20px;
  height: 20px;
  border: 2px solid #6366F1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  
  &[data-state="checked"] {
    border-color: #4F46E5;
  }
  
  &[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledIndicator = styled(Radio.Indicator)`
  width: 10px;
  height: 10px;
  background-color: #4F46E5;
  border-radius: 50%;
`;

const StyledLabel = styled(Radio.Label)`
  color: #374151;
  cursor: pointer;
  
  &[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

function StyledComponentsRadio() {
  return (
    <StyledRadioGroup name="styled-options" defaultValue="option1" orientation="vertical">
      <StyledRadio value="option1">
        <StyledInput />
        <StyledControl>
          <StyledIndicator />
        </StyledControl>
        <StyledLabel>Styled Option 1</StyledLabel>
      </StyledRadio>
      
      <StyledRadio value="option2">
        <StyledInput />
        <StyledControl>
          <StyledIndicator />
        </StyledControl>
        <StyledLabel>Styled Option 2</StyledLabel>
      </StyledRadio>
      
      <StyledRadio value="option3">
        <StyledInput />
        <StyledControl>
          <StyledIndicator />
        </StyledControl>
        <StyledLabel>Styled Option 3</StyledLabel>
      </StyledRadio>
    </StyledRadioGroup>
  );
}
```

### Styling with CSS Modules

```jsx
// Radio.module.css
.radioGroup {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radioGroup[data-orientation="horizontal"] {
  flex-direction: row;
  gap: 16px;
}

.radio {
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
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
}

.control[data-state="checked"] {
  border-color: #4F46E5;
}

.control[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.indicator {
  width: 10px;
  height: 10px;
  background-color: #4F46E5;
  border-radius: 50%;
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
import styles from './Radio.module.css';
import { Radio } from '@pulseui/radio';

function CSSModulesRadio() {
  return (
    <Radio.Group name="css-options" defaultValue="option1" className={styles.radioGroup}>
      <Radio value="option1" className={styles.radio}>
        <Radio.Input className={styles.input} />
        <Radio.Control className={styles.control}>
          <Radio.Indicator className={styles.indicator} />
        </Radio.Control>
        <Radio.Label className={styles.label}>
          CSS Modules Option 1
        </Radio.Label>
      </Radio>
      
      <Radio value="option2" className={styles.radio}>
        <Radio.Input className={styles.input} />
        <Radio.Control className={styles.control}>
          <Radio.Indicator className={styles.indicator} />
        </Radio.Control>
        <Radio.Label className={styles.label}>
          CSS Modules Option 2
        </Radio.Label>
      </Radio>
      
      <Radio value="option3" className={styles.radio}>
        <Radio.Input className={styles.input} />
        <Radio.Control className={styles.control}>
          <Radio.Indicator className={styles.indicator} />
        </Radio.Control>
        <Radio.Label className={styles.label}>
          CSS Modules Option 3
        </Radio.Label>
      </Radio>
    </Radio.Group>
  );
}
```

### Using the Render Prop Pattern

```jsx
import { Radio } from '@pulseui/radio';

function RenderPropRadio() {
  return (
    <Radio.Group name="render-prop-options" defaultValue="option1">
      {({ value, setValue }) => (
        <div>
          <p>Current value: {value}</p>
          
          <Radio value="option1">
            {({ checked, focused }) => (
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
                <Radio.Input />
                <div 
                  style={{ 
                    width: '20px', 
                    height: '20px', 
                    border: `2px solid ${checked ? '#6366F1' : '#D1D5DB'}`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                  }}
                >
                  {checked && (
                    <div 
                      style={{ 
                        width: '10px', 
                        height: '10px', 
                        backgroundColor: '#6366F1', 
                        borderRadius: '50%' 
                      }}
                    />
                  )}
                </div>
                <span>Render Prop Option 1</span>
              </div>
            )}
          </Radio>
          
          <Radio value="option2">
            {({ checked, focused }) => (
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
                <Radio.Input />
                <div 
                  style={{ 
                    width: '20px', 
                    height: '20px', 
                    border: `2px solid ${checked ? '#6366F1' : '#D1D5DB'}`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                  }}
                >
                  {checked && (
                    <div 
                      style={{ 
                        width: '10px', 
                        height: '10px', 
                        backgroundColor: '#6366F1', 
                        borderRadius: '50%' 
                      }}
                    />
                  )}
                </div>
                <span>Render Prop Option 2</span>
              </div>
            )}
          </Radio>
        </div>
      )}
    </Radio.Group>
  );
}
```

## API Reference

### Radio (Root Component)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| defaultChecked | boolean | false | Default checked state (uncontrolled) |
| checked | boolean | - | Controlled checked state |
| onChange | (checked: boolean, event: ChangeEvent) => void | - | Callback when checked state changes |
| disabled | boolean | false | Whether the radio is disabled |
| required | boolean | false | Whether the radio is required |
| name | string | - | Name attribute for the input |
| value | string | - | Value attribute for the input |
| id | string | auto-generated | ID for the input element |
| label | string | - | Label text for the radio |
| children | ReactNode \| RenderFunction | - | Children to render inside the component |
| as | ElementType | 'div' | Element or component to render as |
| className | string | - | Custom class name |
| style | CSSProperties | - | Custom styles |

### Radio.Group

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| defaultValue | string | '' | Default value (uncontrolled) |
| value | string | - | Controlled value |
| onChange | (value: string, event: ChangeEvent) => void | - | Callback when value changes |
| disabled | boolean | false | Whether the radio group is disabled |
| required | boolean | false | Whether the radio group is required |
| name | string | auto-generated | Name attribute for the radio inputs |
| id | string | auto-generated | ID for the radio group |
| orientation | 'horizontal' \| 'vertical' | 'vertical' | Orientation of the radio group |
| children | ReactNode \| RenderFunction | - | Children to render inside the component |
| as | ElementType | 'div' | Element or component to render as |
| className | string | - | Custom class name |
| style | CSSProperties | - | Custom styles |

### Radio.Input

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | ElementType | 'input' | Element or component to render as |
| className | string | - | Custom class name |
| style | CSSProperties | - | Custom styles |
| ...rest | InputHTMLAttributes | - | All other props are passed to the underlying input element |

### Radio.Label

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | ElementType | 'label' | Element or component to render as |
| children | ReactNode | - | Children to render inside the label |
| className | string | - | Custom class name |
| style | CSSProperties | - | Custom styles |
| ...rest | LabelHTMLAttributes | - | All other props are passed to the underlying label element |

### Radio.Control

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | ElementType | 'div' | Element or component to render as |
| children | ReactNode | - | Children to render inside the control |
| className | string | - | Custom class name |
| style | CSSProperties | - | Custom styles |
| ...rest | HTMLAttributes | - | All other props are passed to the underlying element |

### Radio.Indicator

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | ElementType | 'div' | Element or component to render as |
| children | ReactNode \| RenderFunction | - | Children to render inside the indicator |
| className | string | - | Custom class name |
| style | CSSProperties | - | Custom styles |
| ...rest | HTMLAttributes | - | All other props are passed to the underlying element |

## Accessibility

The RadioHeadless component follows the WAI-ARIA radio button pattern and includes the following accessibility features:

- Proper ARIA roles and attributes (`role="radiogroup"`, `aria-checked`, `aria-disabled`, `aria-required`, `aria-orientation`)
- Keyboard navigation support (Tab to navigate between radio groups, Arrow keys to navigate between radio buttons within a group)
- Focus management
- Label association with the input element

## Hooks

### useRadio

If you need more control, you can use the `useRadio` hook directly:

```jsx
import { useRadio } from '@pulseui/radio';

function MyCustomRadio() {
  const { 
    checked,
    disabled,
    required,
    focused,
    id,
    inputRef,
    setChecked,
    focus,
    getInputProps,
    getLabelProps,
  } = useRadio({
    defaultChecked: false,
    disabled: false,
    required: false,
    name: 'custom-radio',
    value: 'option1',
  });
  
  return (
    <div>
      <input {...getInputProps()} />
      <label {...getLabelProps()}>Custom radio</label>
    </div>
  );
}
```

### useRadioGroup

For managing a group of radio buttons:

```jsx
import { useRadioGroup, useRadio } from '@pulseui/radio';

function MyCustomRadioGroup() {
  const { 
    value,
    setValue,
    disabled,
    required,
    name,
    orientation,
    getRadioGroupProps,
    getRadioProps,
  } = useRadioGroup({
    defaultValue: 'option1',
    orientation: 'horizontal',
  });
  
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];
  
  return (
    <div {...getRadioGroupProps()}>
      {options.map((option) => (
        <div key={option.value} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input {...getRadioProps(option.value)} />
          <label htmlFor={`${name}-${option.value}`}>{option.label}</label>
        </div>
      ))}
    </div>
  );
}
```
