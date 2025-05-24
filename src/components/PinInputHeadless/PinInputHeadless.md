# PinInputHeadless

A headless PIN input component that provides all the functionality for entering PIN codes or one-time passwords (OTP) without enforcing any specific styling.

## Features

- Customizable length
- Support for text, number, or password types
- Auto-focus and auto-advance
- Paste support
- Keyboard navigation
- Validation with pattern matching
- Fully accessible

## Usage

### Basic Usage

```jsx
import { PinInput } from '@strive-ui/pin-input';

function MyComponent() {
  return (
    <PinInput 
      length={4} 
      onComplete={(value) => console.log('Completed:', value)}
    />
  );
}
```

### Controlled PIN Input

```jsx
import { useState } from 'react';
import { PinInput } from '@strive-ui/pin-input';

function ControlledPinInput() {
  const [value, setValue] = useState('');
  
  return (
    <div>
      <PinInput 
        value={value} 
        onChange={setValue}
        onComplete={(value) => console.log('Completed:', value)}
        length={6}
      />
      <p>Current value: {value}</p>
      <button onClick={() => setValue('')}>Clear</button>
    </div>
  );
}
```

### Password Type

```jsx
import { PinInput } from '@strive-ui/pin-input';

function PasswordPinInput() {
  return (
    <PinInput 
      type="password"
      mask="●"
      length={4}
      onComplete={(value) => console.log('PIN entered:', value)}
    />
  );
}
```

### With Separator

```jsx
import { PinInput } from '@strive-ui/pin-input';

function PinInputWithSeparator() {
  return (
    <PinInput 
      length={6}
      separator="-"
    />
  );
}
```

### Custom Validation Pattern

```jsx
import { PinInput } from '@strive-ui/pin-input';

function AlphanumericPinInput() {
  return (
    <PinInput 
      length={6}
      pattern="[A-Za-z0-9]"
      placeholder="#"
      onComplete={(value) => console.log('Code entered:', value)}
    />
  );
}
```

### OTP Input

```jsx
import { PinInput } from '@strive-ui/pin-input';

function OTPInput() {
  return (
    <div>
      <h2>Enter the verification code sent to your phone</h2>
      <PinInput 
        length={6}
        type="number"
        autoFocus
        onComplete={(value) => {
          // Verify OTP
          console.log('Verifying OTP:', value);
        }}
      />
    </div>
  );
}
```

### Disabled State

```jsx
import { PinInput } from '@strive-ui/pin-input';

function DisabledPinInput() {
  return (
    <PinInput 
      length={4}
      disabled
      defaultValue="1234"
    />
  );
}
```

### Custom Styling

```jsx
import { PinInput } from '@strive-ui/pin-input';

function CustomStyledPinInput() {
  return (
    <PinInput
      length={4}
      onComplete={(value) => console.log('Completed:', value)}
      style={{ 
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
      }}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <PinInput.Field
          key={index}
          index={index}
          style={{ 
            width: '40px',
            height: '40px',
            fontSize: '20px',
            textAlign: 'center',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            outline: 'none',
            transition: 'all 0.2s',
            '[data-focused]': {
              borderColor: '#3b82f6',
              boxShadow: '0 0 0 1px #3b82f6',
            },
            '[data-filled]': {
              backgroundColor: '#f8fafc',
            },
          }}
        />
      ))}
      <PinInput.ClearButton
        style={{ 
          background: 'none',
          border: 'none',
          padding: '4px',
          cursor: 'pointer',
          color: '#64748b',
          display: 'var(--clear-button-display, none)',
          '[data-visible]': {
            '--clear-button-display': 'block',
          },
        }}
      />
    </PinInput>
  );
}
```

### With Custom Field Rendering

```jsx
import { PinInput } from '@strive-ui/pin-input';

function CustomFieldPinInput() {
  return (
    <PinInput
      length={4}
      type="password"
      mask="●"
      onComplete={(value) => console.log('Completed:', value)}
      style={{ 
        display: 'flex',
        gap: '12px',
      }}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          style={{ 
            position: 'relative',
            width: '40px',
            height: '40px',
          }}
        >
          <PinInput.Field
            index={index}
            style={{ 
              width: '100%',
              height: '100%',
              fontSize: '20px',
              textAlign: 'center',
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              position: 'relative',
              zIndex: 2,
            }}
          />
          <div
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: '8px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              zIndex: 1,
              pointerEvents: 'none',
              transition: 'all 0.2s',
              '[data-focused] + &': {
                borderColor: '#3b82f6',
                boxShadow: '0 0 0 1px #3b82f6',
              },
              '[data-filled] + &': {
                backgroundColor: '#e0f2fe',
              },
            }}
          />
        </div>
      ))}
    </PinInput>
  );
}
```

### Using the Hook Directly

```jsx
import { usePinInput } from '@strive-ui/pin-input';

function CustomPinInput() {
  const {
    values,
    focusedIndex,
    clear,
    getPinInputProps,
    getInputProps,
  } = usePinInput({
    length: 4,
    onComplete: (value) => console.log('Completed:', value),
  });
  
  return (
    <div>
      <div {...getPinInputProps({ className: 'pin-input-container' })}>
        {values.map((value, index) => (
          <input
            key={index}
            {...getInputProps(index, { className: 'pin-input-field' })}
            style={{
              width: '40px',
              height: '40px',
              textAlign: 'center',
              margin: '0 4px',
              border: `2px solid ${focusedIndex === index ? 'blue' : 'gray'}`,
              borderRadius: '4px',
            }}
          />
        ))}
      </div>
      <button onClick={clear}>Clear</button>
    </div>
  );
}
```

## API Reference

### PinInput (Root Component)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| defaultValue | string | '' | Default value (uncontrolled) |
| value | string | - | Controlled value |
| onChange | (value: string) => void | - | Callback when value changes |
| onComplete | (value: string) => void | - | Callback when all inputs are filled |
| length | number | 4 | Number of input fields |
| type | 'text' \| 'password' \| 'number' | 'text' | Type of input fields |
| mask | string | - | Mask character for password type |
| disabled | boolean | false | Whether the input is disabled |
| readOnly | boolean | false | Whether the input is read-only |
| required | boolean | false | Whether the input is required |
| id | string | auto-generated | ID for the pin input element |
| name | string | - | Name attribute for the pin input |
| autoFocus | boolean | false | Whether to auto focus the first input |
| autoFocusNext | boolean | true | Whether to focus the next input automatically |
| focusPrevOnBackspace | boolean | true | Whether to focus the previous input on backspace |
| clearOnReset | boolean | true | Whether to focus the first input when the value is cleared |
| oneCharPerInput | boolean | true | Whether to allow only one character per input |
| pattern | string | '[0-9]' | Regex pattern for input validation |
| placeholder | string | '○' | Placeholder for each input |
| separator | React.ReactNode | - | Separator between inputs |
| onFocus | (index: number, event: React.FocusEvent) => void | - | Callback when an input is focused |
| onBlur | (index: number, event: React.FocusEvent) => void | - | Callback when an input is blurred |
| onKeyDown | (index: number, event: React.KeyboardEvent) => void | - | Callback when a key is pressed |
| onPaste | (event: React.ClipboardEvent) => void | - | Callback when paste event occurs |

### Compound Components

The PinInput component uses a compound component pattern, providing the following sub-components:

- `PinInput.Field` - Individual input field
- `PinInput.Separator` - Separator between input fields
- `PinInput.ClearButton` - Button to clear all inputs
- `PinInput.Hide` - Utility component to hide content

### Data Attributes

The PinInput component and its sub-components expose several data attributes that can be used for styling:

- `data-disabled`: Present when the pin input is disabled
- `data-readonly`: Present when the pin input is read-only
- `data-required`: Present when the pin input is required
- `data-complete`: Present when all inputs are filled
- `data-filled`: Present on input fields that have a value
- `data-focused`: Present on the currently focused input field
- `data-visible`: Present on the clear button when it should be visible

### Hooks

#### usePinInput

```jsx
import { usePinInput } from '@strive-ui/pin-input';

function MyCustomPinInput() {
  const {
    value,
    values,
    disabled,
    readOnly,
    required,
    length,
    type,
    mask,
    id,
    name,
    placeholder,
    separator,
    focusedIndex,
    inputRefs,
    setValue,
    clear,
    focusInput,
    focusNext,
    focusPrev,
    getPinInputProps,
    getInputProps,
  } = usePinInput({
    length: 4,
    onComplete: (value) => console.log('Completed:', value),
  });
  
  // Build your custom pin input UI
}
```
