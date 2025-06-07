# PulseHeadless

A headless component for creating customizable pulse effects with extensive flexibility for developers. Pulse effects are animated visual indicators that draw attention to elements through subtle pulsing animations.

## Usage

```jsx
import { PulseHeadless } from 'pulseui';

function MyPulseEffect() {
  return (
    <PulseHeadless.Root
      shape="circle"
      size="medium"
      color="rgba(33, 150, 243, 0.6)"
      duration={1.5}
      count={3}
      delay={0.3}
      scale={1.5}
      opacity={0.7}
      continuous={true}
      centered={true}
    >
      <PulseHeadless.Container
        style={{
          padding: '16px',
        }}
      >
        <PulseHeadless.Item>
          <PulseHeadless.Content
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#2196f3',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            +
          </PulseHeadless.Content>
        </PulseHeadless.Item>
      </PulseHeadless.Container>
    </PulseHeadless.Root>
  );
}
```

## Creating Different Pulse Variants

```jsx
import { PulseHeadless } from 'pulseui';
import { useState } from 'react';

function PulseExample() {
  const [shape, setShape] = useState('circle');
  
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => setShape('circle')}>Circle</button>
        <button onClick={() => setShape('rectangle')}>Rectangle</button>
        <button onClick={() => setShape('rounded')}>Rounded</button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
        <div>
          <h3>Small Pulse</h3>
          <PulseHeadless.Root
            shape={shape}
            size="small"
            color="rgba(33, 150, 243, 0.6)"
            duration={1.5}
            count={3}
            delay={0.3}
            continuous={true}
            centered={true}
          >
            <PulseHeadless.Container
              style={{
                padding: '16px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                height: '100px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <PulseHeadless.Item>
                <PulseHeadless.Content
                  style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#2196f3',
                    borderRadius: shape === 'circle' ? '50%' : shape === 'rounded' ? '4px' : '0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  +
                </PulseHeadless.Content>
              </PulseHeadless.Item>
            </PulseHeadless.Container>
          </PulseHeadless.Root>
        </div>
        
        <div>
          <h3>Medium Pulse</h3>
          <PulseHeadless.Root
            shape={shape}
            size="medium"
            color="rgba(76, 175, 80, 0.6)"
            duration={1.5}
            count={3}
            delay={0.3}
            continuous={true}
            centered={true}
          >
            <PulseHeadless.Container
              style={{
                padding: '16px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                height: '100px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <PulseHeadless.Item>
                <PulseHeadless.Content
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#4caf50',
                    borderRadius: shape === 'circle' ? '50%' : shape === 'rounded' ? '8px' : '0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                  }}
                >
                  +
                </PulseHeadless.Content>
              </PulseHeadless.Item>
            </PulseHeadless.Container>
          </PulseHeadless.Root>
        </div>
        
        <div>
          <h3>Large Pulse</h3>
          <PulseHeadless.Root
            shape={shape}
            size="large"
            color="rgba(255, 152, 0, 0.6)"
            duration={1.5}
            count={3}
            delay={0.3}
            continuous={true}
            centered={true}
          >
            <PulseHeadless.Container
              style={{
                padding: '16px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                height: '100px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <PulseHeadless.Item>
                <PulseHeadless.Content
                  style={{
                    width: '72px',
                    height: '72px',
                    backgroundColor: '#ff9800',
                    borderRadius: shape === 'circle' ? '50%' : shape === 'rounded' ? '12px' : '0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    fontSize: '36px',
                    fontWeight: 'bold',
                  }}
                >
                  +
                </PulseHeadless.Content>
              </PulseHeadless.Item>
            </PulseHeadless.Container>
          </PulseHeadless.Root>
        </div>
      </div>
    </div>
  );
}
```

## Creating a Notification Badge with Pulse

```jsx
import { PulseHeadless } from 'pulseui';

function NotificationBadge({ count }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        style={{
          padding: '8px 16px',
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Notifications
      </button>
      
      <PulseHeadless.Root
        shape="circle"
        size="small"
        color="rgba(244, 67, 54, 0.6)"
        duration={1.5}
        count={2}
        delay={0.5}
        continuous={true}
      >
        <PulseHeadless.Container
          style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
          }}
        >
          <PulseHeadless.Item>
            <PulseHeadless.Content
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: '#f44336',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              {count}
            </PulseHeadless.Content>
          </PulseHeadless.Item>
        </PulseHeadless.Container>
      </PulseHeadless.Root>
    </div>
  );
}

// Usage
function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Notification Badge Example</h1>
      
      <div style={{ marginTop: '24px' }}>
        <NotificationBadge count={5} />
      </div>
    </div>
  );
}
```

## Creating a Call-to-Action Button with Pulse

```jsx
import { PulseHeadless } from 'pulseui';

function PulseButton({ children, color = '#2196f3', onClick }) {
  return (
    <PulseHeadless.Root
      shape="rounded"
      size="medium"
      color={`${color}99`} // Add 60% opacity
      duration={1.5}
      count={2}
      delay={0.5}
      continuous={true}
      centered={true}
    >
      <PulseHeadless.Container>
        <PulseHeadless.Item
          borderRadius="4px"
        >
          <PulseHeadless.Content>
            <button
              onClick={onClick}
              style={{
                padding: '12px 24px',
                backgroundColor: color,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                width: '100%',
                height: '100%',
              }}
            >
              {children}
            </button>
          </PulseHeadless.Content>
        </PulseHeadless.Item>
      </PulseHeadless.Container>
    </PulseHeadless.Root>
  );
}

// Usage
function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Call-to-Action Buttons</h1>
      
      <div style={{ display: 'flex', gap: '24px', marginTop: '24px' }}>
        <PulseButton color="#2196f3" onClick={() => alert('Primary action clicked!')}>
          Get Started
        </PulseButton>
        
        <PulseButton color="#4caf50" onClick={() => alert('Success action clicked!')}>
          Submit
        </PulseButton>
        
        <PulseButton color="#f44336" onClick={() => alert('Danger action clicked!')}>
          Delete
        </PulseButton>
      </div>
    </div>
  );
}
```

## Creating a Feature Highlight with Pulse

```jsx
import { PulseHeadless } from 'pulseui';
import { useState } from 'react';

function FeatureHighlight({ children, title, description, position = 'right' }) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <PulseHeadless.Root
        shape="circle"
        size="medium"
        color="rgba(33, 150, 243, 0.6)"
        duration={1.5}
        count={3}
        delay={0.3}
        continuous={true}
        centered={true}
      >
        <PulseHeadless.Container
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <PulseHeadless.Item>
            <PulseHeadless.Content>
              {children}
            </PulseHeadless.Content>
          </PulseHeadless.Item>
        </PulseHeadless.Container>
      </PulseHeadless.Root>
      
      {showTooltip && (
        <div
          style={{
            position: 'absolute',
            [position === 'right' ? 'left' : 'right']: 'calc(100% + 16px)',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '4px',
            padding: '12px',
            width: '200px',
            zIndex: 10,
          }}
        >
          <h4 style={{ margin: '0 0 8px 0' }}>{title}</h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>{description}</p>
        </div>
      )}
    </div>
  );
}

// Usage
function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Feature Highlight Example</h1>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
        <div style={{ display: 'flex', gap: '100px', alignItems: 'center' }}>
          <FeatureHighlight
            title="New Feature"
            description="Check out our brand new analytics dashboard with improved insights."
            position="right"
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#2196f3',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              1
            </div>
          </FeatureHighlight>
          
          <FeatureHighlight
            title="Pro Tip"
            description="Use keyboard shortcuts to navigate faster through the application."
            position="left"
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#4caf50',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              2
            </div>
          </FeatureHighlight>
        </div>
      </div>
    </div>
  );
}
```

## API

### PulseHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the pulse |
| `shape` | `'circle' \| 'rectangle' \| 'rounded'` | `'circle'` | Shape of the pulse |
| `width` | `string \| number` | - | Width of the pulse |
| `height` | `string \| number` | - | Height of the pulse |
| `visible` | `boolean` | `true` | Whether the pulse is visible |
| `borderRadius` | `string \| number` | - | Border radius of the pulse |
| `duration` | `number` | `1.5` | Duration of the pulse animation in seconds |
| `color` | `string` | `'rgba(0, 123, 255, 0.6)'` | Color of the pulse |
| `fullWidth` | `boolean` | `false` | Whether the pulse should take up the full parent width |
| `continuous` | `boolean` | `true` | Whether the pulse should be continuous |
| `count` | `number` | `3` | Number of pulses to show |
| `delay` | `number` | `0.3` | Delay between pulses in seconds |
| `scale` | `number` | `1.5` | Scale factor for the pulse |
| `opacity` | `number` | `0.7` | Opacity of the pulse |
| `centered` | `boolean` | `false` | Whether the pulse should be centered |

### Other Components

- `PulseHeadless.Container`: Container for the pulse
- `PulseHeadless.Item`: Pulse item that contains the effect
- `PulseHeadless.Effect`: Pulse effect element (automatically created by Item)
- `PulseHeadless.Content`: Content element that sits on top of the pulse

### usePulse Hook

For even more control, you can use the `usePulse` hook directly:

```jsx
import { usePulse } from 'pulseui';

function MyCustomPulse() {
  const {
    size,
    shape,
    width,
    height,
    visible,
    setVisible,
    borderRadius,
    duration,
    color,
    fullWidth,
    continuous,
    count,
    delay,
    scale,
    opacity,
    centered,
    show,
    hide,
    toggle,
    getContainerProps,
    getPulseProps,
    getEffectProps,
  } = usePulse({
    size: 'medium',
    shape: 'circle',
    color: 'rgba(33, 150, 243, 0.6)',
    duration: 1.5,
    count: 3,
    delay: 0.3,
    continuous: true,
    centered: true,
  });
  
  // Custom implementation
}
```

## Accessibility

The Pulse component follows accessibility best practices:

- The pulse container has `role="presentation"` to indicate it's a visual effect
- The pulse has `aria-hidden="true"` when not visible to hide it from screen readers
