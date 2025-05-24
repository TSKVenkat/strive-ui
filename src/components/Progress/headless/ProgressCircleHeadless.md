# ProgressCircleHeadless

A headless component for creating customizable circular progress indicators with extensive flexibility for developers. Progress circles visually represent the completion status of an operation or task in a circular format.

## Usage

```jsx
import { ProgressCircleHeadless } from 'strive-ui';

function MyProgressCircle() {
  return (
    <ProgressCircleHeadless.Root
      value={75}
      min={0}
      max={100}
      variant="determinate"
      animated={true}
      showLabel={true}
      circleSize={80}
      strokeWidth={8}
      onComplete={() => console.log('Progress complete!')}
    >
      <ProgressCircleHeadless.Container
        style={{
          margin: '0 auto',
        }}
      >
        <ProgressCircleHeadless.SVG>
          <ProgressCircleHeadless.Track
            style={{
              stroke: '#e0e0e0',
            }}
          />
          
          <ProgressCircleHeadless.Indicator
            style={{
              stroke: '#2196f3',
              strokeLinecap: 'round',
            }}
          />
        </ProgressCircleHeadless.SVG>
        
        <ProgressCircleHeadless.Label
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        />
      </ProgressCircleHeadless.Container>
    </ProgressCircleHeadless.Root>
  );
}
```

## Creating Different Progress Circle Variants

```jsx
import { ProgressCircleHeadless } from 'strive-ui';
import { useState, useEffect } from 'react';

function ProgressCircleExample() {
  const [value, setValue] = useState(0);
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
        <button onClick={() => setValue(0)}>Reset</button>
      </div>
      
      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
        <div>
          <h3>Standard Progress Circle</h3>
          <ProgressCircleHeadless.Root
            value={value}
            variant={variant}
            animated={true}
            showLabel={true}
            circleSize={80}
            strokeWidth={8}
          >
            <ProgressCircleHeadless.Container>
              <ProgressCircleHeadless.SVG>
                <ProgressCircleHeadless.Track
                  style={{
                    stroke: '#e0e0e0',
                  }}
                />
                
                <ProgressCircleHeadless.Indicator
                  style={{
                    stroke: '#2196f3',
                    strokeLinecap: 'round',
                  }}
                />
              </ProgressCircleHeadless.SVG>
              
              <ProgressCircleHeadless.Label
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
              />
            </ProgressCircleHeadless.Container>
          </ProgressCircleHeadless.Root>
        </div>
        
        <div>
          <h3>Large Progress Circle</h3>
          <ProgressCircleHeadless.Root
            value={value}
            variant={variant}
            animated={true}
            showLabel={true}
            circleSize={120}
            strokeWidth={12}
          >
            <ProgressCircleHeadless.Container>
              <ProgressCircleHeadless.SVG>
                <ProgressCircleHeadless.Track
                  style={{
                    stroke: '#e0e0e0',
                  }}
                />
                
                <ProgressCircleHeadless.Indicator
                  style={{
                    stroke: '#4caf50',
                    strokeLinecap: 'round',
                  }}
                />
              </ProgressCircleHeadless.SVG>
              
              <ProgressCircleHeadless.Label
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                }}
              />
            </ProgressCircleHeadless.Container>
          </ProgressCircleHeadless.Root>
        </div>
        
        <div>
          <h3>Small Progress Circle</h3>
          <ProgressCircleHeadless.Root
            value={value}
            variant={variant}
            animated={true}
            showLabel={false}
            circleSize={40}
            strokeWidth={4}
          >
            <ProgressCircleHeadless.Container>
              <ProgressCircleHeadless.SVG>
                <ProgressCircleHeadless.Track
                  style={{
                    stroke: '#e0e0e0',
                  }}
                />
                
                <ProgressCircleHeadless.Indicator
                  style={{
                    stroke: '#ff9800',
                    strokeLinecap: 'round',
                  }}
                />
              </ProgressCircleHeadless.SVG>
            </ProgressCircleHeadless.Container>
          </ProgressCircleHeadless.Root>
        </div>
      </div>
    </div>
  );
}
```

## Creating a Reusable Progress Circle Component

```jsx
import { ProgressCircleHeadless } from 'strive-ui';
import { useState, useEffect } from 'react';

function CustomProgressCircle({ 
  value, 
  variant = 'determinate',
  color = 'primary',
  size = 'medium',
  showLabel = true,
  animated = true,
  onComplete,
}) {
  // Color mapping
  const colorMap = {
    primary: '#2196f3',
    secondary: '#9c27b0',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
  };
  
  const currentColor = colorMap[color] || colorMap.primary;
  
  // Size mapping
  const sizeMap = {
    small: {
      circleSize: 40,
      strokeWidth: 4,
      fontSize: '12px',
    },
    medium: {
      circleSize: 80,
      strokeWidth: 8,
      fontSize: '16px',
    },
    large: {
      circleSize: 120,
      strokeWidth: 12,
      fontSize: '24px',
    },
  };
  
  const currentSize = sizeMap[size] || sizeMap.medium;
  
  return (
    <ProgressCircleHeadless.Root
      value={value}
      variant={variant}
      animated={animated}
      showLabel={showLabel}
      circleSize={currentSize.circleSize}
      strokeWidth={currentSize.strokeWidth}
      onComplete={onComplete}
    >
      <ProgressCircleHeadless.Container>
        <ProgressCircleHeadless.SVG>
          <ProgressCircleHeadless.Track
            style={{
              stroke: '#e0e0e0',
            }}
          />
          
          <ProgressCircleHeadless.Indicator
            style={{
              stroke: currentColor,
              strokeLinecap: 'round',
            }}
          />
        </ProgressCircleHeadless.SVG>
        
        {showLabel && (
          <ProgressCircleHeadless.Label
            style={{
              fontSize: currentSize.fontSize,
              fontWeight: 'bold',
            }}
          />
        )}
      </ProgressCircleHeadless.Container>
    </ProgressCircleHeadless.Root>
  );
}

// Usage
function App() {
  const [progress, setProgress] = useState(0);
  
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
    }, 500);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Progress Circle Examples</h1>
      
      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', marginTop: '24px' }}>
        <div>
          <h3>Primary (Medium)</h3>
          <CustomProgressCircle
            value={progress}
            color="primary"
            size="medium"
          />
        </div>
        
        <div>
          <h3>Secondary (Large)</h3>
          <CustomProgressCircle
            value={progress}
            color="secondary"
            size="large"
          />
        </div>
        
        <div>
          <h3>Success (Small)</h3>
          <CustomProgressCircle
            value={progress}
            color="success"
            size="small"
          />
        </div>
        
        <div>
          <h3>Warning (Medium)</h3>
          <CustomProgressCircle
            value={progress}
            color="warning"
            size="medium"
          />
        </div>
        
        <div>
          <h3>Error (Medium)</h3>
          <CustomProgressCircle
            value={progress}
            color="error"
            size="medium"
          />
        </div>
        
        <div>
          <h3>Indeterminate</h3>
          <CustomProgressCircle
            variant="indeterminate"
            color="primary"
            size="medium"
            showLabel={false}
          />
        </div>
      </div>
    </div>
  );
}
```

## Creating a Dashboard with Progress Circles

```jsx
import { ProgressCircleHeadless } from 'strive-ui';
import { useState, useEffect } from 'react';

function ProgressDashboard() {
  const [metrics, setMetrics] = useState([
    { id: 1, name: 'CPU Usage', value: 0, color: '#2196f3' },
    { id: 2, name: 'Memory Usage', value: 0, color: '#9c27b0' },
    { id: 3, name: 'Disk Space', value: 0, color: '#4caf50' },
    { id: 4, name: 'Network', value: 0, color: '#ff9800' },
  ]);
  
  // Simulate changing metrics
  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics(prevMetrics => 
        prevMetrics.map(metric => ({
          ...metric,
          value: Math.min(100, Math.max(0, metric.value + (Math.random() * 10 - 5))),
        }))
      );
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>System Metrics Dashboard</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '24px',
        marginTop: '24px',
      }}>
        {metrics.map(metric => (
          <div 
            key={metric.id}
            style={{
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <h3 style={{ marginBottom: '16px' }}>{metric.name}</h3>
            
            <ProgressCircleHeadless.Root
              value={metric.value}
              variant="determinate"
              animated={true}
              showLabel={true}
              circleSize={100}
              strokeWidth={10}
            >
              <ProgressCircleHeadless.Container>
                <ProgressCircleHeadless.SVG>
                  <ProgressCircleHeadless.Track
                    style={{
                      stroke: '#e0e0e0',
                    }}
                  />
                  
                  <ProgressCircleHeadless.Indicator
                    style={{
                      stroke: metric.color,
                      strokeLinecap: 'round',
                    }}
                  />
                </ProgressCircleHeadless.SVG>
                
                <ProgressCircleHeadless.Label
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                  }}
                />
              </ProgressCircleHeadless.Container>
            </ProgressCircleHeadless.Root>
            
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <div>{Math.round(metric.value)}% Used</div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                {metric.name === 'CPU Usage' && 'Core i7 @ 3.2GHz'}
                {metric.name === 'Memory Usage' && '16GB RAM'}
                {metric.name === 'Disk Space' && '1TB SSD'}
                {metric.name === 'Network' && '1Gbps Connection'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## API

### ProgressCircleHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | `0` | Current value of the progress |
| `min` | `number` | `0` | Minimum value of the progress |
| `max` | `number` | `100` | Maximum value of the progress |
| `variant` | `'determinate' \| 'indeterminate'` | `'determinate'` | Variant of the progress circle |
| `animated` | `boolean` | `true` | Whether the progress circle is animated |
| `showLabel` | `boolean` | `false` | Whether the progress circle shows a label |
| `labelFormat` | `(value: number, min: number, max: number) => string` | - | Format of the label |
| `onComplete` | `() => void` | - | Callback when the progress reaches 100% |
| `circleSize` | `number` | `48` | Size of the circle in pixels |
| `strokeWidth` | `number` | `4` | Stroke width of the circle |

### Other Components

- `ProgressCircleHeadless.Container`: Container for the progress circle
- `ProgressCircleHeadless.SVG`: SVG element for the progress circle
- `ProgressCircleHeadless.Track`: Track element for the progress circle
- `ProgressCircleHeadless.Indicator`: Indicator element for the progress circle
- `ProgressCircleHeadless.Label`: Label element for the progress circle

### useProgress Hook

For even more control, you can use the `useProgress` hook directly:

```jsx
import { useProgress } from 'strive-ui';

function MyCustomProgressCircle() {
  const {
    value,
    setValue,
    min,
    max,
    variant,
    animated,
    showLabel,
    percentage,
    isComplete,
    getFormattedLabel,
    getContainerProps,
    getLabelProps,
  } = useProgress({
    value: 50,
    min: 0,
    max: 100,
    variant: 'determinate',
    animated: true,
    showLabel: true,
    onComplete: () => console.log('Progress complete!'),
  });
  
  // Custom implementation
}
```

## Accessibility

The Progress Circle component follows accessibility best practices:

- The progress circle container has `role="progressbar"` to notify screen readers of progress information
- The progress circle has appropriate ARIA attributes (`aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`) for screen readers
- The label has `aria-hidden="true"` to prevent duplicate announcements
