# SwitchHeadless

A headless switch component that provides all the functionality without any styling. This component can be used as a base for creating custom styled switch implementations.

## Features

- Supports both controlled and uncontrolled modes
- Loading state support
- Multiple sizes (sm, md, lg)
- Compound component API for flexible customization
- Polymorphic components (can render as any HTML element or React component)
- Fully accessible with proper ARIA attributes
- Keyboard navigation support
- Focus management

## Installation

```bash
npm install @pulseui/switch
```

## Usage

### Basic Usage

```jsx
import { Switch } from '@pulseui/switch';

function MyComponent() {
  return (
    <Switch label="Dark mode" />
  );
}
```

### Controlled Switch

```jsx
import { useState } from 'react';
import { Switch } from '@pulseui/switch';

function ControlledSwitch() {
  const [checked, setChecked] = useState(false);
  
  return (
    <div>
      <p>Dark mode is {checked ? 'on' : 'off'}</p>
      <Switch 
        checked={checked} 
        onChange={(isChecked) => setChecked(isChecked)}
        label="Dark mode"
      />
    </div>
  );
}
```

### Different Sizes

```jsx
import { Switch } from '@pulseui/switch';

function SwitchSizes() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Switch size="sm" label="Small switch" />
      <Switch size="md" label="Medium switch (default)" />
      <Switch size="lg" label="Large switch" />
    </div>
  );
}
```

### Disabled State

```jsx
import { Switch } from '@pulseui/switch';

function DisabledSwitch() {
  return (
    <Switch disabled label="Notifications (disabled)" />
  );
}
```

### Loading State

```jsx
import { useState } from 'react';
import { Switch } from '@pulseui/switch';

function LoadingSwitch() {
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  
  const handleChange = (isChecked) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setChecked(isChecked);
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <Switch 
      checked={checked}
      onChange={handleChange}
      loading={isLoading}
      label="Save to cloud"
    />
  );
}
```

### Custom Styling with Compound Components

```jsx
import { Switch } from '@pulseui/switch';

function CustomSwitch() {
  return (
    <Switch>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Switch.Input style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
        <Switch.Root 
          style={{ 
            width: '44px', 
            height: '24px', 
            backgroundColor: 'var(--gray-300, #D1D5DB)', 
            borderRadius: '12px',
            padding: '2px',
            transition: 'background-color 0.2s',
            cursor: 'pointer',
          }}
          data-checked-style={{ backgroundColor: 'var(--indigo-500, #6366F1)' }}
        >
          <Switch.Thumb 
            style={{ 
              width: '20px', 
              height: '20px', 
              backgroundColor: 'white', 
              borderRadius: '50%',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s',
              transform: 'translateX(0)',
            }}
            data-checked-style={{ transform: 'translateX(20px)' }}
          />
        </Switch.Root>
        <Switch.Label style={{ cursor: 'pointer' }}>
          Custom styled switch
        </Switch.Label>
      </div>
    </Switch>
  );
}
```

### Styling with Tailwind CSS

```jsx
import { Switch } from '@pulseui/switch';

function TailwindSwitch() {
  return (
    <Switch className="flex items-center gap-2">
      <Switch.Input className="sr-only" />
      <Switch.Root 
        className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 data-[state=checked]:bg-indigo-500"
      >
        <Switch.Thumb 
          className="pointer-events-none block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out data-[state=checked]:translate-x-[22px]"
        />
      </Switch.Root>
      <Switch.Label className="text-sm font-medium text-gray-700 cursor-pointer">
        Tailwind styled switch
      </Switch.Label>
    </Switch>
  );
}
```

### Styling with Styled Components

```jsx
import styled from 'styled-components';
import { Switch } from '@pulseui/switch';

const StyledSwitch = styled(Switch)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledInput = styled(Switch.Input)`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const StyledRoot = styled(Switch.Root)`
  position: relative;
  width: 44px;
  height: 24px;
  background-color: #D1D5DB;
  border-radius: 12px;
  padding: 2px;
  transition: background-color 0.2s;
  cursor: pointer;
  
  &[data-state="checked"] {
    background-color: #6366F1;
  }
  
  &[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &[data-loading] {
    cursor: wait;
  }
`;

const StyledThumb = styled(Switch.Thumb)`
  display: block;
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  transform: translateX(0);
  
  &[data-state="checked"] {
    transform: translateX(20px);
  }
  
  .switch-loading-spinner {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const StyledLabel = styled(Switch.Label)`
  color: #374151;
  cursor: pointer;
  
  &[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

function StyledComponentsSwitch() {
  return (
    <StyledSwitch>
      <StyledInput />
      <StyledRoot>
        <StyledThumb />
      </StyledRoot>
      <StyledLabel>Styled components switch</StyledLabel>
    </StyledSwitch>
  );
}
```

### Styling with CSS Modules

```jsx
// Switch.module.css
.switch {
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

.root {
  position: relative;
  width: 44px;
  height: 24px;
  background-color: #D1D5DB;
  border-radius: 12px;
  padding: 2px;
  transition: background-color 0.2s;
  cursor: pointer;
}

.root[data-state="checked"] {
  background-color: #6366F1;
}

.root[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.root[data-loading] {
  cursor: wait;
}

.thumb {
  display: block;
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  transform: translateX(0);
}

.thumb[data-state="checked"] {
  transform: translateX(20px);
}

.label {
  color: #374151;
  cursor: pointer;
}

.label[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.loadingSpinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

```jsx
import styles from './Switch.module.css';
import { Switch } from '@pulseui/switch';

function CSSModulesSwitch() {
  return (
    <Switch className={styles.switch}>
      <Switch.Input className={styles.input} />
      <Switch.Root className={styles.root}>
        <Switch.Thumb className={styles.thumb} />
      </Switch.Root>
      <Switch.Label className={styles.label}>
        CSS Modules switch
      </Switch.Label>
    </Switch>
  );
}
```

### Using the Render Prop Pattern

```jsx
import { Switch } from '@pulseui/switch';

function RenderPropSwitch() {
  return (
    <Switch>
      {({ checked, focused, disabled, loading, toggle }) => (
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
          <Switch.Input />
          <div 
            style={{ 
              position: 'relative',
              width: '44px', 
              height: '24px', 
              backgroundColor: checked ? '#6366F1' : '#D1D5DB', 
              borderRadius: '12px',
              padding: '2px',
              transition: 'background-color 0.2s',
              cursor: disabled || loading ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.5 : 1,
            }}
            onClick={disabled || loading ? undefined : toggle}
          >
            <div 
              style={{ 
                width: '20px', 
                height: '20px', 
                backgroundColor: 'white', 
                borderRadius: '50%',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s',
                transform: checked ? 'translateX(20px)' : 'translateX(0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {loading && (
                <svg 
                  viewBox="0 0 24 24" 
                  width="16" 
                  height="16" 
                  fill="none" 
                  stroke="#6366F1" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  style={{
                    animation: 'spin 1s linear infinite',
                  }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v2" />
                </svg>
              )}
            </div>
          </div>
          <span 
            style={{ 
              cursor: disabled || loading ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.5 : 1,
            }}
            onClick={disabled || loading ? undefined : toggle}
          >
            Custom render prop switch
          </span>
        </div>
      )}
    </Switch>
  );
}
```

## API Reference

### Switch (Root Component)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| defaultChecked | boolean | false | Default checked state (uncontrolled) |
| checked | boolean | - | Controlled checked state |
| onChange | (checked: boolean, event: ChangeEvent) => void | - | Callback when checked state changes |
| disabled | boolean | false | Whether the switch is disabled |
| required | boolean | false | Whether the switch is required |
| name | string | - | Name attribute for the input |
| value | string | - | Value attribute for the input |
| id | string | auto-generated | ID for the input element |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Size of the switch |
| loading | boolean | false | Whether to show the loading state |
| label | string | - | Label text for the switch |
| children | ReactNode \| RenderFunction | - | Children to render inside the component |
| as | ElementType | 'div' | Element or component to render as |
| className | string | - | Custom class name |
| style | CSSProperties | - | Custom styles |

### Switch.Input

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | ElementType | 'input' | Element or component to render as |
| className | string | - | Custom class name |
| style | CSSProperties | - | Custom styles |
| ...rest | InputHTMLAttributes | - | All other props are passed to the underlying input element |

### Switch.Label

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | ElementType | 'label' | Element or component to render as |
| children | ReactNode | - | Children to render inside the label |
| className | string | - | Custom class name |
| style | CSSProperties | - | Custom styles |
| ...rest | LabelHTMLAttributes | - | All other props are passed to the underlying label element |

### Switch.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | ElementType | 'div' | Element or component to render as |
| children | ReactNode | - | Children to render inside the root |
| className | string | - | Custom class name |
| style | CSSProperties | - | Custom styles |
| ...rest | HTMLAttributes | - | All other props are passed to the underlying element |

### Switch.Thumb

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | ElementType | 'div' | Element or component to render as |
| children | ReactNode | - | Children to render inside the thumb |
| className | string | - | Custom class name |
| style | CSSProperties | - | Custom styles |
| ...rest | HTMLAttributes | - | All other props are passed to the underlying element |

## Accessibility

The SwitchHeadless component follows the WAI-ARIA switch pattern and includes the following accessibility features:

- Proper ARIA roles and attributes (`role="switch"`, `aria-checked`, `aria-disabled`, `aria-required`)
- Keyboard navigation support (Tab to focus, Space to toggle)
- Focus management
- Label association with the input element

## Hooks

### useSwitch

If you need more control, you can use the `useSwitch` hook directly:

```jsx
import { useSwitch } from '@pulseui/switch';

function MyCustomSwitch() {
  const { 
    checked,
    disabled,
    required,
    focused,
    loading,
    size,
    id,
    inputRef,
    setChecked,
    toggle,
    focus,
    getInputProps,
    getLabelProps,
    getSwitchProps,
    getThumbProps,
  } = useSwitch({
    defaultChecked: false,
    disabled: false,
    required: false,
    size: 'md',
    loading: false,
  });
  
  return (
    <div>
      <input {...getInputProps()} />
      <div {...getSwitchProps()}>
        <div {...getThumbProps()} />
      </div>
      <label {...getLabelProps()}>Custom switch</label>
    </div>
  );
}
```
