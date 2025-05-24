# ToggleHeadless

A headless toggle component that provides all the functionality for a toggle switch without enforcing any specific styling.

## Features

- Controlled and uncontrolled modes
- Keyboard navigation and accessibility
- Focus, hover, and press states
- Compound component pattern
- Fully customizable styling

## Usage

### Basic Usage

```jsx
import { Toggle } from '@strive-ui/toggle';

function MyComponent() {
  return (
    <Toggle aria-label="Toggle feature" />
  );
}
```

### Controlled Toggle

```jsx
import { useState } from 'react';
import { Toggle } from '@strive-ui/toggle';

function ControlledToggle() {
  const [toggled, setToggled] = useState(false);
  
  return (
    <div>
      <Toggle 
        toggled={toggled} 
        onChange={setToggled}
        aria-label="Toggle feature"
      />
      <p>Feature is {toggled ? 'enabled' : 'disabled'}</p>
    </div>
  );
}
```

### With Label

```jsx
import { Toggle } from '@strive-ui/toggle';

function ToggleWithLabel() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Toggle id="feature-toggle" />
      <Toggle.Label htmlFor="feature-toggle">
        Enable feature
      </Toggle.Label>
    </div>
  );
}
```

### Disabled State

```jsx
import { Toggle } from '@strive-ui/toggle';

function DisabledToggle() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Toggle disabled aria-label="Toggle feature" />
      <span>Feature unavailable</span>
    </div>
  );
}
```

### Read-Only State

```jsx
import { Toggle } from '@strive-ui/toggle';

function ReadOnlyToggle() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Toggle readOnly defaultToggled={true} aria-label="Toggle feature" />
      <span>Feature always enabled</span>
    </div>
  );
}
```

### Custom Styling

```jsx
import { Toggle } from '@strive-ui/toggle';

function CustomStyledToggle() {
  return (
    <Toggle
      aria-label="Toggle theme"
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
      }}
    >
      <Toggle.Track
        style={{
          position: 'relative',
          width: '52px',
          height: '28px',
          backgroundColor: 'var(--track-bg, #e2e8f0)',
          borderRadius: '14px',
          transition: 'background-color 0.2s',
          '--track-bg': 'var(--state-off, #e2e8f0)',
          '--state-off': '#e2e8f0',
          '--state-on': '#3b82f6',
          '[data-state="on"] &': {
            '--track-bg': 'var(--state-on, #3b82f6)',
          },
          '[data-disabled] &': {
            opacity: 0.5,
            cursor: 'not-allowed',
          },
        }}
      >
        <Toggle.Thumb
          style={{
            position: 'absolute',
            top: '3px',
            left: '3px',
            width: '22px',
            height: '22px',
            backgroundColor: 'white',
            borderRadius: '50%',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s',
            transform: 'translateX(var(--thumb-position, 0))',
            '--thumb-position': 'var(--position-off, 0)',
            '--position-off': '0',
            '--position-on': '24px',
            '[data-state="on"] &': {
              '--thumb-position': 'var(--position-on, 24px)',
            },
          }}
        />
      </Toggle.Track>
    </Toggle>
  );
}
```

### With Icons

```jsx
import { Toggle } from '@strive-ui/toggle';

function ToggleWithIcons() {
  return (
    <Toggle
      aria-label="Toggle theme"
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
      }}
    >
      <Toggle.Track
        style={{
          position: 'relative',
          width: '60px',
          height: '30px',
          backgroundColor: 'var(--track-bg, #1e293b)',
          borderRadius: '15px',
          transition: 'background-color 0.2s',
          '--track-bg': 'var(--state-off, #1e293b)',
          '--state-off': '#1e293b',
          '--state-on': '#0ea5e9',
          '[data-state="on"] &': {
            '--track-bg': 'var(--state-on, #0ea5e9)',
          },
        }}
      >
        {/* Sun icon */}
        <div
          style={{
            position: 'absolute',
            top: '7px',
            right: '10px',
            color: 'white',
            opacity: 'var(--sun-opacity, 0)',
            transition: 'opacity 0.2s',
            '--sun-opacity': 'var(--sun-state-off, 0)',
            '--sun-state-off': '0',
            '--sun-state-on': '1',
            '[data-state="on"] &': {
              '--sun-opacity': 'var(--sun-state-on, 1)',
            },
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-15a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V5a1 1 0 0 1 1-1zm0 15a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1zM5 12a1 1 0 0 1-1-1 1 1 0 0 1 1-1h1a1 1 0 0 1 0 2H5zm15 0a1 1 0 0 1-1-1 1 1 0 0 1 1-1h1a1 1 0 0 1 0 2h-1zM6.7 6.7a1 1 0 0 1 0-1.4l.7-.7a1 1 0 0 1 1.4 1.4l-.7.7a1 1 0 0 1-1.4 0zm10.6 10.6a1 1 0 0 1 0-1.4l.7-.7a1 1 0 0 1 1.4 1.4l-.7.7a1 1 0 0 1-1.4 0zM17.3 6.7a1 1 0 0 1-1.4 0l-.7-.7a1 1 0 0 1 1.4-1.4l.7.7a1 1 0 0 1 0 1.4zM6.7 17.3a1 1 0 0 1-1.4 0l-.7-.7a1 1 0 0 1 1.4-1.4l.7.7a1 1 0 0 1 0 1.4z" />
          </svg>
        </div>
        
        {/* Moon icon */}
        <div
          style={{
            position: 'absolute',
            top: '7px',
            left: '10px',
            color: 'white',
            opacity: 'var(--moon-opacity, 1)',
            transition: 'opacity 0.2s',
            '--moon-opacity': 'var(--moon-state-off, 1)',
            '--moon-state-off': '1',
            '--moon-state-on': '0',
            '[data-state="on"] &': {
              '--moon-opacity': 'var(--moon-state-on, 0)',
            },
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22c5.5 0 10-4.5 10-10 0-.3 0-.7-.1-1-1 5-5.2 8-10.9 7-4.1-.7-7-4.2-7-8.3 0-1.2.3-2.3.8-3.4C2.5 8.1 1.5 10 1.5 12c0 5.5 4.5 10 10 10z" />
          </svg>
        </div>
        
        <Toggle.Thumb
          style={{
            position: 'absolute',
            top: '3px',
            left: '3px',
            width: '24px',
            height: '24px',
            backgroundColor: 'white',
            borderRadius: '50%',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s',
            transform: 'translateX(var(--thumb-position, 0))',
            '--thumb-position': 'var(--position-off, 0)',
            '--position-off': '0',
            '--position-on': '30px',
            '[data-state="on"] &': {
              '--thumb-position': 'var(--position-on, 30px)',
            },
          }}
        />
      </Toggle.Track>
    </Toggle>
  );
}
```

### Using the Hook Directly

```jsx
import { useToggle } from '@strive-ui/toggle';

function CustomToggle() {
  const {
    toggled,
    toggle,
    getToggleProps,
    getTrackProps,
    getThumbProps,
  } = useToggle({
    defaultToggled: false,
    onChange: (state) => console.log('Toggle state:', state),
  });
  
  return (
    <div>
      <button
        {...getToggleProps({
          style: {
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          },
        })}
      >
        <div
          {...getTrackProps({
            style: {
              position: 'relative',
              width: '52px',
              height: '28px',
              backgroundColor: toggled ? '#3b82f6' : '#e2e8f0',
              borderRadius: '14px',
              transition: 'background-color 0.2s',
            },
          })}
        >
          <div
            {...getThumbProps({
              style: {
                position: 'absolute',
                top: '3px',
                left: '3px',
                width: '22px',
                height: '22px',
                backgroundColor: 'white',
                borderRadius: '50%',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s',
                transform: toggled ? 'translateX(24px)' : 'translateX(0)',
              },
            })}
          />
        </div>
      </button>
      <p>Toggle is {toggled ? 'on' : 'off'}</p>
    </div>
  );
}
```

## API Reference

### Toggle (Root Component)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| defaultToggled | boolean | false | Default toggle state (uncontrolled) |
| toggled | boolean | - | Controlled toggle state |
| onChange | (toggled: boolean) => void | - | Callback when toggle state changes |
| disabled | boolean | false | Whether the toggle is disabled |
| readOnly | boolean | false | Whether the toggle is read-only |
| required | boolean | false | Whether the toggle is required |
| id | string | auto-generated | ID for the toggle element |
| name | string | - | Name attribute for the toggle |
| value | string | - | Value attribute for the toggle |
| aria-label | string | - | ARIA label for the toggle |
| aria-labelledby | string | - | ARIA labelledby for the toggle |
| onFocus | (event: React.FocusEvent) => void | - | Callback when toggle is focused |
| onBlur | (event: React.FocusEvent) => void | - | Callback when toggle is blurred |

### Compound Components

The Toggle component uses a compound component pattern, providing the following sub-components:

- `Toggle.Label` - Label element for the toggle
- `Toggle.Track` - Track element for the toggle
- `Toggle.Thumb` - Thumb element for the toggle

### Data Attributes

The Toggle component and its sub-components expose several data attributes that can be used for styling:

- `data-state`: `"on"` or `"off"` - The current state of the toggle
- `data-disabled`: Present when the toggle is disabled
- `data-readonly`: Present when the toggle is read-only
- `data-required`: Present when the toggle is required
- `data-focused`: Present when the toggle is focused
- `data-hovered`: Present when the toggle is hovered
- `data-pressed`: Present when the toggle is pressed

### Hooks

#### useToggle

```jsx
import { useToggle } from '@strive-ui/toggle';

function MyCustomToggle() {
  const {
    toggled,
    disabled,
    readOnly,
    required,
    focused,
    hovered,
    pressed,
    id,
    name,
    value,
    ref,
    toggle,
    setToggled,
    focus,
    blur,
    getToggleProps,
    getLabelProps,
    getTrackProps,
    getThumbProps,
  } = useToggle({
    defaultToggled: false,
    onChange: (state) => console.log('Toggle state:', state),
  });
  
  // Build your custom toggle UI
}
```
