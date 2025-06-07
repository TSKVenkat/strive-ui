# SpinnerHeadless

A headless component for creating customizable loading spinners with extensive flexibility for developers. Spinners indicate that content is loading or that an action is being processed.

## Usage

```jsx
import { SpinnerHeadless } from 'pulseui';

function MySpinner() {
  return (
    <SpinnerHeadless.Root
      size="medium"
      variant="border"
      visible={true}
      label="Loading..."
      speed={0.75}
      centered={true}
    >
      <SpinnerHeadless.Container
        style={{
          padding: '16px',
        }}
      >
        <SpinnerHeadless.Spinner
          style={{
            color: '#2196f3',
          }}
        />
        <SpinnerHeadless.Label srOnly={true} />
      </SpinnerHeadless.Container>
    </SpinnerHeadless.Root>
  );
}
```

## Creating Different Spinner Variants

```jsx
import { SpinnerHeadless } from 'pulseui';
import { useState } from 'react';

function SpinnerExample() {
  const [variant, setVariant] = useState('border');
  
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => setVariant('border')}>Border</button>
        <button onClick={() => setVariant('grow')}>Grow</button>
        <button onClick={() => setVariant('dots')}>Dots</button>
        <button onClick={() => setVariant('ripple')}>Ripple</button>
        <button onClick={() => setVariant('dual-ring')}>Dual Ring</button>
      </div>
      
      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
        <div>
          <h3>Small</h3>
          <SpinnerHeadless.Root
            size="small"
            variant={variant}
            centered={true}
          >
            <SpinnerHeadless.Container
              style={{
                padding: '16px',
              }}
            >
              {variant === 'border' && (
                <SpinnerHeadless.Spinner
                  style={{
                    color: '#2196f3',
                  }}
                />
              )}
              
              {variant === 'grow' && (
                <SpinnerHeadless.Spinner
                  style={{
                    color: '#2196f3',
                  }}
                />
              )}
              
              {variant === 'dots' && (
                <SpinnerHeadless.Spinner
                  style={{
                    color: '#2196f3',
                  }}
                >
                  <SpinnerHeadless.Dot index={0} />
                  <SpinnerHeadless.Dot index={1} />
                  <SpinnerHeadless.Dot index={2} />
                </SpinnerHeadless.Spinner>
              )}
              
              {variant === 'ripple' && (
                <SpinnerHeadless.Spinner
                  style={{
                    color: '#2196f3',
                  }}
                >
                  <SpinnerHeadless.Ripple index={0} />
                  <SpinnerHeadless.Ripple index={1} />
                </SpinnerHeadless.Spinner>
              )}
              
              {variant === 'dual-ring' && (
                <SpinnerHeadless.Spinner
                  style={{
                    color: '#2196f3',
                  }}
                >
                  <SpinnerHeadless.Ring />
                  <SpinnerHeadless.Ring outer={true} />
                </SpinnerHeadless.Spinner>
              )}
              
              <SpinnerHeadless.Label srOnly={true} />
            </SpinnerHeadless.Container>
          </SpinnerHeadless.Root>
        </div>
        
        <div>
          <h3>Medium</h3>
          <SpinnerHeadless.Root
            size="medium"
            variant={variant}
            centered={true}
          >
            <SpinnerHeadless.Container
              style={{
                padding: '16px',
              }}
            >
              {variant === 'border' && (
                <SpinnerHeadless.Spinner
                  style={{
                    color: '#4caf50',
                  }}
                />
              )}
              
              {variant === 'grow' && (
                <SpinnerHeadless.Spinner
                  style={{
                    color: '#4caf50',
                  }}
                />
              )}
              
              {variant === 'dots' && (
                <SpinnerHeadless.Spinner
                  style={{
                    color: '#4caf50',
                  }}
                >
                  <SpinnerHeadless.Dot index={0} />
                  <SpinnerHeadless.Dot index={1} />
                  <SpinnerHeadless.Dot index={2} />
                </SpinnerHeadless.Spinner>
              )}
              
              {variant === 'ripple' && (
                <SpinnerHeadless.Spinner
                  style={{
                    color: '#4caf50',
                  }}
                >
                  <SpinnerHeadless.Ripple index={0} />
                  <SpinnerHeadless.Ripple index={1} />
                </SpinnerHeadless.Spinner>
              )}
              
              {variant === 'dual-ring' && (
                <SpinnerHeadless.Spinner
                  style={{
                    color: '#4caf50',
                  }}
                >
                  <SpinnerHeadless.Ring />
                  <SpinnerHeadless.Ring outer={true} />
                </SpinnerHeadless.Spinner>
              )}
              
              <SpinnerHeadless.Label srOnly={true} />
            </SpinnerHeadless.Container>
          </SpinnerHeadless.Root>
        </div>
        
        <div>
          <h3>Large</h3>
          <SpinnerHeadless.Root
            size="large"
            variant={variant}
            centered={true}
          >
            <SpinnerHeadless.Container
              style={{
                padding: '16px',
              }}
            >
              {variant === 'border' && (
                <SpinnerHeadless.Spinner
                  style={{
                    color: '#ff9800',
                  }}
                />
              )}
              
              {variant === 'grow' && (
                <SpinnerHeadless.Spinner
                  style={{
                    color: '#ff9800',
                  }}
                />
              )}
              
              {variant === 'dots' && (
                <SpinnerHeadless.Spinner
                  style={{
                    color: '#ff9800',
                  }}
                >
                  <SpinnerHeadless.Dot index={0} />
                  <SpinnerHeadless.Dot index={1} />
                  <SpinnerHeadless.Dot index={2} />
                </SpinnerHeadless.Spinner>
              )}
              
              {variant === 'ripple' && (
                <SpinnerHeadless.Spinner
                  style={{
                    color: '#ff9800',
                  }}
                >
                  <SpinnerHeadless.Ripple index={0} />
                  <SpinnerHeadless.Ripple index={1} />
                </SpinnerHeadless.Spinner>
              )}
              
              {variant === 'dual-ring' && (
                <SpinnerHeadless.Spinner
                  style={{
                    color: '#ff9800',
                  }}
                >
                  <SpinnerHeadless.Ring />
                  <SpinnerHeadless.Ring outer={true} />
                </SpinnerHeadless.Spinner>
              )}
              
              <SpinnerHeadless.Label srOnly={true} />
            </SpinnerHeadless.Container>
          </SpinnerHeadless.Root>
        </div>
      </div>
    </div>
  );
}
```

## Creating a Reusable Spinner Component

```jsx
import { SpinnerHeadless } from 'pulseui';

function CustomSpinner({ 
  size = 'medium',
  variant = 'border',
  color = 'primary',
  label = 'Loading...',
  visible = true,
  centered = true,
  fullWidth = false,
  inline = false,
  showLabel = false,
  speed = 0.75,
}) {
  // Color mapping
  const colorMap = {
    primary: '#2196f3',
    secondary: '#9c27b0',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    light: '#f5f5f5',
    dark: '#212121',
  };
  
  const currentColor = colorMap[color] || colorMap.primary;
  
  return (
    <SpinnerHeadless.Root
      size={size}
      variant={variant}
      visible={visible}
      label={label}
      speed={speed}
      centered={centered}
      fullWidth={fullWidth}
      inline={inline}
    >
      <SpinnerHeadless.Container
        style={{
          padding: showLabel ? '16px' : '0',
        }}
      >
        {variant === 'border' && (
          <SpinnerHeadless.Spinner
            style={{
              color: currentColor,
            }}
          />
        )}
        
        {variant === 'grow' && (
          <SpinnerHeadless.Spinner
            style={{
              color: currentColor,
            }}
          />
        )}
        
        {variant === 'dots' && (
          <SpinnerHeadless.Spinner
            style={{
              color: currentColor,
            }}
          >
            <SpinnerHeadless.Dot index={0} />
            <SpinnerHeadless.Dot index={1} />
            <SpinnerHeadless.Dot index={2} />
          </SpinnerHeadless.Spinner>
        )}
        
        {variant === 'ripple' && (
          <SpinnerHeadless.Spinner
            style={{
              color: currentColor,
            }}
          >
            <SpinnerHeadless.Ripple index={0} />
            <SpinnerHeadless.Ripple index={1} />
          </SpinnerHeadless.Spinner>
        )}
        
        {variant === 'dual-ring' && (
          <SpinnerHeadless.Spinner
            style={{
              color: currentColor,
            }}
          >
            <SpinnerHeadless.Ring />
            <SpinnerHeadless.Ring outer={true} />
          </SpinnerHeadless.Spinner>
        )}
        
        <SpinnerHeadless.Label srOnly={!showLabel} />
      </SpinnerHeadless.Container>
    </SpinnerHeadless.Root>
  );
}

// Usage
function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Spinner Examples</h1>
      
      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', marginTop: '24px' }}>
        <div>
          <h3>Primary Border</h3>
          <CustomSpinner
            variant="border"
            color="primary"
          />
        </div>
        
        <div>
          <h3>Secondary Grow</h3>
          <CustomSpinner
            variant="grow"
            color="secondary"
          />
        </div>
        
        <div>
          <h3>Success Dots</h3>
          <CustomSpinner
            variant="dots"
            color="success"
          />
        </div>
        
        <div>
          <h3>Warning Ripple</h3>
          <CustomSpinner
            variant="ripple"
            color="warning"
          />
        </div>
        
        <div>
          <h3>Error Dual Ring</h3>
          <CustomSpinner
            variant="dual-ring"
            color="error"
          />
        </div>
      </div>
      
      <div style={{ marginTop: '32px' }}>
        <h3>With Label</h3>
        <CustomSpinner
          variant="border"
          color="primary"
          showLabel={true}
        />
      </div>
      
      <div style={{ marginTop: '32px' }}>
        <h3>Inline with Text</h3>
        <p>
          Loading your data
          <CustomSpinner
            size="small"
            inline={true}
            centered={false}
            style={{ marginLeft: '8px' }}
          />
        </p>
      </div>
    </div>
  );
}
```

## Creating a Loading Overlay

```jsx
import { SpinnerHeadless } from 'pulseui';
import { useState } from 'react';

function LoadingOverlay({ 
  loading, 
  children, 
  spinnerProps = {},
  overlayColor = 'rgba(255, 255, 255, 0.8)',
}) {
  return (
    <div style={{ position: 'relative' }}>
      {children}
      
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: overlayColor,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <SpinnerHeadless.Root
            size="large"
            variant="border"
            centered={true}
            {...spinnerProps}
          >
            <SpinnerHeadless.Container>
              <SpinnerHeadless.Spinner
                style={{
                  color: '#2196f3',
                }}
              />
              <SpinnerHeadless.Label srOnly={true} />
            </SpinnerHeadless.Container>
          </SpinnerHeadless.Root>
        </div>
      )}
    </div>
  );
}

// Usage
function App() {
  const [loading, setLoading] = useState(false);
  
  const toggleLoading = () => {
    setLoading(prev => !prev);
    if (!loading) {
      setTimeout(() => setLoading(false), 3000);
    }
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Loading Overlay Example</h1>
      
      <button onClick={toggleLoading}>
        {loading ? 'Stop Loading' : 'Start Loading'}
      </button>
      
      <div style={{ marginTop: '24px' }}>
        <LoadingOverlay loading={loading}>
          <div
            style={{
              padding: '24px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              height: '200px',
            }}
          >
            <h3>Content Area</h3>
            <p>This content will be overlaid with a spinner when loading.</p>
          </div>
        </LoadingOverlay>
      </div>
    </div>
  );
}
```

## API

### SpinnerHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the spinner |
| `variant` | `'border' \| 'grow' \| 'dots' \| 'ripple' \| 'dual-ring'` | `'border'` | Variant of the spinner |
| `visible` | `boolean` | `true` | Whether the spinner is visible |
| `label` | `string` | `'Loading...'` | Label for the spinner for accessibility |
| `speed` | `number` | `0.75` | Speed of the spinner animation in seconds |
| `centered` | `boolean` | `false` | Whether the spinner should be centered |
| `fullWidth` | `boolean` | `false` | Whether the spinner should take up the full parent width |
| `inline` | `boolean` | `false` | Whether the spinner should be inline with text |

### Other Components

- `SpinnerHeadless.Container`: Container for the spinner
- `SpinnerHeadless.Spinner`: Spinner element
- `SpinnerHeadless.Dot`: Dot element for the dots variant
- `SpinnerHeadless.Ripple`: Ripple element for the ripple variant
- `SpinnerHeadless.Ring`: Ring element for the dual-ring variant
- `SpinnerHeadless.Label`: Label element for the spinner

### useSpinner Hook

For even more control, you can use the `useSpinner` hook directly:

```jsx
import { useSpinner } from 'pulseui';

function MyCustomSpinner() {
  const {
    size,
    variant,
    visible,
    setVisible,
    label,
    speed,
    centered,
    fullWidth,
    inline,
    show,
    hide,
    toggle,
    getContainerProps,
    getSpinnerProps,
  } = useSpinner({
    size: 'medium',
    variant: 'border',
    visible: true,
    label: 'Loading...',
    speed: 0.75,
    centered: true,
    fullWidth: false,
    inline: false,
  });
  
  // Custom implementation
}
```

## Accessibility

The Spinner component follows accessibility best practices:

- The spinner container has `role="status"` to notify screen readers of status information
- The spinner has `aria-busy="true"` when visible to indicate that content is loading
- The spinner has an appropriate `aria-label` for screen readers
- The label can be visually hidden but still accessible to screen readers using the `srOnly` prop
