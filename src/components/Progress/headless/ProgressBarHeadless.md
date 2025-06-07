# ProgressBarHeadless

A headless component for creating customizable linear progress indicators with extensive flexibility for developers. Progress bars visually represent the completion status of an operation or task.

## Usage

```jsx
import { ProgressBarHeadless } from 'pulseui';

function MyProgressBar() {
  return (
    <ProgressBarHeadless.Root
      value={75}
      min={0}
      max={100}
      variant="determinate"
      size="medium"
      animated={true}
      striped={false}
      showLabel={true}
      hasBuffer={true}
      bufferValue={85}
      onComplete={() => console.log('Progress complete!')}
    >
      <div style={{ marginBottom: '8px' }}>
        <ProgressBarHeadless.Label
          style={{
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        />
      </div>
      
      <ProgressBarHeadless.Container
        style={{
          backgroundColor: '#e0e0e0',
          borderRadius: '4px',
        }}
      >
        <ProgressBarHeadless.Track />
        
        <ProgressBarHeadless.Buffer
          style={{
            backgroundColor: '#bbdefb',
          }}
        />
        
        <ProgressBarHeadless.Bar
          style={{
            backgroundColor: '#2196f3',
          }}
        />
      </ProgressBarHeadless.Container>
    </ProgressBarHeadless.Root>
  );
}
```

## Creating Different Progress Bar Variants

```jsx
import { ProgressBarHeadless } from 'pulseui';
import { useState, useEffect } from 'react';

function ProgressBarExample() {
  const [value, setValue] = useState(0);
  const [bufferValue, setBufferValue] = useState(0);
  const [variant, setVariant] = useState('determinate');
  
  // Simulate progress
  useEffect(() => {
    if (variant === 'determinate') {
      const timer = setInterval(() => {
        setValue(prevValue => {
          if (prevValue >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prevValue + 1;
        });
        
        setBufferValue(prevValue => {
          if (prevValue >= 100) {
            return 100;
          }
          return Math.min(prevValue + 2, 100);
        });
      }, 100);
      
      return () => {
        clearInterval(timer);
      };
    }
  }, [variant]);
  
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => setVariant('determinate')}>Determinate</button>
        <button onClick={() => setVariant('indeterminate')}>Indeterminate</button>
        <button onClick={() => { setValue(0); setBufferValue(0); }}>Reset</button>
      </div>
      
      <div style={{ marginBottom: '32px' }}>
        <h3>Standard Progress Bar</h3>
        <ProgressBarHeadless.Root
          value={value}
          variant={variant}
          size="medium"
          animated={true}
          showLabel={true}
        >
          <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Progress</span>
            <ProgressBarHeadless.Label
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            />
          </div>
          
          <ProgressBarHeadless.Container
            style={{
              backgroundColor: '#e0e0e0',
              borderRadius: '4px',
            }}
          >
            <ProgressBarHeadless.Bar
              style={{
                backgroundColor: '#2196f3',
              }}
            />
          </ProgressBarHeadless.Container>
        </ProgressBarHeadless.Root>
      </div>
      
      <div style={{ marginBottom: '32px' }}>
        <h3>Buffered Progress Bar</h3>
        <ProgressBarHeadless.Root
          value={value}
          variant="determinate"
          size="medium"
          animated={true}
          showLabel={true}
          hasBuffer={true}
          bufferValue={bufferValue}
        >
          <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Buffering...</span>
            <ProgressBarHeadless.Label
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            />
          </div>
          
          <ProgressBarHeadless.Container
            style={{
              backgroundColor: '#e0e0e0',
              borderRadius: '4px',
            }}
          >
            <ProgressBarHeadless.Buffer
              style={{
                backgroundColor: '#bbdefb',
              }}
            />
            
            <ProgressBarHeadless.Bar
              style={{
                backgroundColor: '#2196f3',
              }}
            />
          </ProgressBarHeadless.Container>
        </ProgressBarHeadless.Root>
      </div>
      
      <div style={{ marginBottom: '32px' }}>
        <h3>Striped Progress Bar</h3>
        <ProgressBarHeadless.Root
          value={value}
          variant="determinate"
          size="large"
          animated={true}
          striped={true}
          showLabel={true}
        >
          <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Progress</span>
            <ProgressBarHeadless.Label
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            />
          </div>
          
          <ProgressBarHeadless.Container
            style={{
              backgroundColor: '#e0e0e0',
              borderRadius: '4px',
            }}
          >
            <ProgressBarHeadless.Bar
              style={{
                backgroundColor: '#4caf50',
              }}
            />
          </ProgressBarHeadless.Container>
        </ProgressBarHeadless.Root>
      </div>
    </div>
  );
}
```

## Creating a Reusable Progress Bar Component

```jsx
import { ProgressBarHeadless } from 'pulseui';

function CustomProgressBar({ 
  value, 
  bufferValue,
  variant = 'determinate',
  size = 'medium',
  color = 'primary',
  label,
  showLabel = true,
  hasBuffer = false,
  striped = false,
  animated = true,
  onComplete,
}) {
  // Color mapping
  const colorMap = {
    primary: {
      main: '#2196f3',
      light: '#bbdefb',
    },
    secondary: {
      main: '#9c27b0',
      light: '#e1bee7',
    },
    success: {
      main: '#4caf50',
      light: '#c8e6c9',
    },
    warning: {
      main: '#ff9800',
      light: '#ffe0b2',
    },
    error: {
      main: '#f44336',
      light: '#ffcdd2',
    },
  };
  
  const currentColor = colorMap[color] || colorMap.primary;
  
  // Size mapping
  const sizeMap = {
    small: {
      height: '4px',
      fontSize: '12px',
    },
    medium: {
      height: '8px',
      fontSize: '14px',
    },
    large: {
      height: '12px',
      fontSize: '16px',
    },
  };
  
  const currentSize = sizeMap[size] || sizeMap.medium;
  
  return (
    <ProgressBarHeadless.Root
      value={value}
      bufferValue={bufferValue}
      variant={variant}
      size={size}
      animated={animated}
      striped={striped}
      showLabel={showLabel}
      hasBuffer={hasBuffer}
      onComplete={onComplete}
    >
      {(label || showLabel) && (
        <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
          {label && <span>{label}</span>}
          {showLabel && (
            <ProgressBarHeadless.Label
              style={{
                fontSize: currentSize.fontSize,
                fontWeight: 'bold',
              }}
            />
          )}
        </div>
      )}
      
      <ProgressBarHeadless.Container
        style={{
          backgroundColor: '#e0e0e0',
          borderRadius: '4px',
        }}
      >
        {hasBuffer && (
          <ProgressBarHeadless.Buffer
            style={{
              backgroundColor: currentColor.light,
            }}
          />
        )}
        
        <ProgressBarHeadless.Bar
          style={{
            backgroundColor: currentColor.main,
          }}
        />
      </ProgressBarHeadless.Container>
    </ProgressBarHeadless.Root>
  );
}

// Usage
function App() {
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(10);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(prevProgress + diff, 100);
      });
      
      setBuffer(prevBuffer => {
        if (prevBuffer >= 100) {
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(prevBuffer + diff, 100);
      });
    }, 500);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Progress Bar Examples</h1>
      
      <div style={{ marginBottom: '24px' }}>
        <CustomProgressBar
          value={progress}
          label="Primary Progress"
          color="primary"
        />
      </div>
      
      <div style={{ marginBottom: '24px' }}>
        <CustomProgressBar
          value={progress}
          bufferValue={buffer}
          label="Buffered Progress"
          color="secondary"
          hasBuffer={true}
        />
      </div>
      
      <div style={{ marginBottom: '24px' }}>
        <CustomProgressBar
          value={progress}
          label="Success Progress"
          color="success"
          size="large"
        />
      </div>
      
      <div style={{ marginBottom: '24px' }}>
        <CustomProgressBar
          value={progress}
          label="Warning Progress (Striped)"
          color="warning"
          striped={true}
        />
      </div>
      
      <div style={{ marginBottom: '24px' }}>
        <CustomProgressBar
          value={progress}
          label="Error Progress"
          color="error"
        />
      </div>
      
      <div style={{ marginBottom: '24px' }}>
        <CustomProgressBar
          variant="indeterminate"
          label="Indeterminate Progress"
          showLabel={false}
        />
      </div>
    </div>
  );
}
```

## API

### ProgressBarHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | `0` | Current value of the progress |
| `min` | `number` | `0` | Minimum value of the progress |
| `max` | `number` | `100` | Maximum value of the progress |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the progress bar |
| `variant` | `'determinate' \| 'indeterminate'` | `'determinate'` | Variant of the progress bar |
| `animated` | `boolean` | `true` | Whether the progress bar is animated |
| `showLabel` | `boolean` | `false` | Whether the progress bar shows a label |
| `labelFormat` | `(value: number, min: number, max: number) => string` | - | Format of the label |
| `striped` | `boolean` | `false` | Whether the progress bar is striped |
| `onComplete` | `() => void` | - | Callback when the progress reaches 100% |
| `hasBuffer` | `boolean` | `false` | Whether the progress bar has a buffer indicator |
| `bufferValue` | `number` | `0` | Buffer value of the progress |

### Other Components

- `ProgressBarHeadless.Container`: Container for the progress bar
- `ProgressBarHeadless.Track`: Track element for the progress bar
- `ProgressBarHeadless.Buffer`: Buffer element for the progress bar
- `ProgressBarHeadless.Bar`: Bar element for the progress bar
- `ProgressBarHeadless.Label`: Label element for the progress bar

### useProgress Hook

For even more control, you can use the `useProgress` hook directly:

```jsx
import { useProgress } from 'pulseui';

function MyCustomProgressBar() {
  const {
    value,
    setValue,
    min,
    max,
    size,
    variant,
    animated,
    showLabel,
    striped,
    hasBuffer,
    bufferValue,
    setBufferValue,
    percentage,
    bufferPercentage,
    isComplete,
    getFormattedLabel,
    getContainerProps,
    getProgressBarProps,
    getBufferBarProps,
    getLabelProps,
  } = useProgress({
    value: 50,
    min: 0,
    max: 100,
    variant: 'determinate',
    size: 'medium',
    animated: true,
    showLabel: true,
    striped: false,
    hasBuffer: true,
    bufferValue: 75,
    onComplete: () => console.log('Progress complete!'),
  });
  
  // Custom implementation
}
```

## Accessibility

The Progress Bar component follows accessibility best practices:

- The progress bar container has `role="progressbar"` to notify screen readers of progress information
- The progress bar has appropriate ARIA attributes (`aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`) for screen readers
- The label has `aria-hidden="true"` to prevent duplicate announcements
