# ErrorBoundaryHeadless

A headless component for creating customizable error boundaries with extensive flexibility for developers. Error boundaries catch JavaScript errors in their child component tree, log those errors, and display a fallback UI instead of the component tree that crashed.

## Usage

```jsx
import { ErrorBoundaryHeadless } from 'pulseui';

function MyComponent() {
  return (
    <ErrorBoundaryHeadless.Root
      onError={(error, errorInfo) => {
        // Log error to an error reporting service
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
      }}
      fallback={<ErrorBoundaryHeadless.Fallback />}
    >
      <div>
        <h1>My Application</h1>
        <ComponentThatMightError />
      </div>
    </ErrorBoundaryHeadless.Root>
  );
}
```

## Custom Error Fallback UI

```jsx
import { ErrorBoundaryHeadless } from 'pulseui';

function CustomErrorFallback() {
  const { error, resetErrorBoundary } = ErrorBoundaryHeadless.useErrorBoundaryContext();
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#f8d7da', borderRadius: '4px', color: '#721c24' }}>
      <h3>Oops, something went wrong!</h3>
      <p>{error?.message || 'An unexpected error occurred'}</p>
      <button 
        onClick={resetErrorBoundary}
        style={{ 
          padding: '8px 16px', 
          backgroundColor: '#721c24', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: 'pointer' 
        }}
      >
        Try Again
      </button>
    </div>
  );
}

function MyApplication() {
  return (
    <ErrorBoundaryHeadless.Root
      fallback={<CustomErrorFallback />}
    >
      <MyComponent />
    </ErrorBoundaryHeadless.Root>
  );
}
```

## Developer Mode with Error Details

```jsx
import { ErrorBoundaryHeadless } from 'pulseui';
import { useState } from 'react';

function BuggyCounter() {
  const [counter, setCounter] = useState(0);
  
  const handleClick = () => {
    setCounter(prevCounter => prevCounter + 1);
  };
  
  if (counter === 5) {
    // Simulate an error when counter reaches 5
    throw new Error('I crashed when counter reached 5!');
  }
  
  return (
    <div>
      <p>Counter: {counter}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
}

function DeveloperExample() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Error Boundary Example</h2>
      <p>Click the button to increment the counter. The component will crash when the counter reaches 5.</p>
      
      <ErrorBoundaryHeadless.Root
        fallback={isDevelopment ? <ErrorBoundaryHeadless.Developer /> : <ErrorBoundaryHeadless.Fallback />}
        onReset={() => console.log('Error boundary was reset')}
      >
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '4px', marginTop: '20px' }}>
          <BuggyCounter />
        </div>
      </ErrorBoundaryHeadless.Root>
    </div>
  );
}
```

## Nested Error Boundaries

```jsx
import { ErrorBoundaryHeadless } from 'pulseui';
import { useState } from 'react';

function BuggyComponent() {
  // This component will always throw an error when rendered
  throw new Error('I crashed!');
  return <div>This will never render</div>;
}

function FeatureOne() {
  const [showBuggyComponent, setShowBuggyComponent] = useState(false);
  
  return (
    <ErrorBoundaryHeadless.Root
      fallback={
        <div style={{ padding: '16px', backgroundColor: '#fff3cd', borderRadius: '4px', marginBottom: '16px' }}>
          <h4 style={{ color: '#856404', margin: '0 0 8px 0' }}>Feature One Error</h4>
          <p style={{ color: '#856404', margin: '0 0 8px 0' }}>This feature encountered an error.</p>
          <ErrorBoundaryHeadless.Reset>Reset Feature One</ErrorBoundaryHeadless.Reset>
        </div>
      }
    >
      <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '16px' }}>
        <h3>Feature One</h3>
        {showBuggyComponent ? (
          <BuggyComponent />
        ) : (
          <button onClick={() => setShowBuggyComponent(true)}>
            Show Buggy Component
          </button>
        )}
      </div>
    </ErrorBoundaryHeadless.Root>
  );
}

function FeatureTwo() {
  const [showBuggyComponent, setShowBuggyComponent] = useState(false);
  
  return (
    <ErrorBoundaryHeadless.Root
      fallback={
        <div style={{ padding: '16px', backgroundColor: '#d1ecf1', borderRadius: '4px' }}>
          <h4 style={{ color: '#0c5460', margin: '0 0 8px 0' }}>Feature Two Error</h4>
          <p style={{ color: '#0c5460', margin: '0 0 8px 0' }}>This feature encountered an error.</p>
          <ErrorBoundaryHeadless.Reset>Reset Feature Two</ErrorBoundaryHeadless.Reset>
        </div>
      }
    >
      <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '4px' }}>
        <h3>Feature Two</h3>
        {showBuggyComponent ? (
          <BuggyComponent />
        ) : (
          <button onClick={() => setShowBuggyComponent(true)}>
            Show Buggy Component
          </button>
        )}
      </div>
    </ErrorBoundaryHeadless.Root>
  );
}

function NestedErrorBoundariesExample() {
  return (
    <ErrorBoundaryHeadless.Root
      fallback={<ErrorBoundaryHeadless.Fallback />}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h2>Nested Error Boundaries Example</h2>
        <p>Each feature has its own error boundary, so if one crashes, the others still work.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
          <FeatureOne />
          <FeatureTwo />
        </div>
      </div>
    </ErrorBoundaryHeadless.Root>
  );
}
```

## Error Boundary with Retry Logic

```jsx
import { ErrorBoundaryHeadless } from 'pulseui';
import { useState, useEffect } from 'react';

function DataFetcher({ url }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Simulate a fetch that sometimes fails
        if (Math.random() < 0.5) {
          throw new Error('Network request failed');
        }
        
        // Simulate API response
        const response = { data: 'This is the fetched data' };
        
        if (isMounted) {
          setData(response.data);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setLoading(false);
          throw error; // Re-throw to be caught by the error boundary
        }
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [url]);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <h3>Data Fetched Successfully</h3>
      <p>{data}</p>
    </div>
  );
}

function RetryExample() {
  const [retryCount, setRetryCount] = useState(0);
  
  const handleReset = () => {
    setRetryCount(count => count + 1);
  };
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Error Boundary with Retry Logic</h2>
      <p>This example simulates a data fetching component that sometimes fails.</p>
      <p>Retry Count: {retryCount}</p>
      
      <ErrorBoundaryHeadless.Root
        onReset={handleReset}
        fallback={
          <ErrorBoundaryHeadless.Container>
            <div style={{ textAlign: 'center' }}>
              <ErrorBoundaryHeadless.Icon>🔄</ErrorBoundaryHeadless.Icon>
              <ErrorBoundaryHeadless.Title>Failed to fetch data</ErrorBoundaryHeadless.Title>
              <ErrorBoundaryHeadless.Message>
                The request to fetch data failed. Please try again.
              </ErrorBoundaryHeadless.Message>
              <ErrorBoundaryHeadless.Reset>
                Retry Request
              </ErrorBoundaryHeadless.Reset>
            </div>
          </ErrorBoundaryHeadless.Container>
        }
      >
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '4px', marginTop: '20px' }}>
          <DataFetcher url={`https://api.example.com/data?retry=${retryCount}`} />
        </div>
      </ErrorBoundaryHeadless.Root>
    </div>
  );
}
```

## API

### ErrorBoundaryHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onError` | `(error: Error, errorInfo: React.ErrorInfo) => void` | - | Callback when an error is caught |
| `onReset` | `() => void` | - | Callback when the error boundary is reset |
| `logErrors` | `boolean` | `true` | Whether to log errors to the console |
| `fallback` | `React.ReactNode` | - | Custom fallback UI to show when an error is caught |
| `children` | `React.ReactNode` | - | The components that the error boundary should wrap |

### Other Components

- `ErrorBoundaryHeadless.Container`: Container for the error UI
- `ErrorBoundaryHeadless.Title`: Title component for the error UI
- `ErrorBoundaryHeadless.Message`: Message component for the error UI
- `ErrorBoundaryHeadless.Details`: Component to display detailed error information
- `ErrorBoundaryHeadless.Reset`: Button to reset the error boundary
- `ErrorBoundaryHeadless.Icon`: Icon component for the error UI
- `ErrorBoundaryHeadless.Fallback`: Pre-configured user-friendly fallback component
- `ErrorBoundaryHeadless.Developer`: Pre-configured developer-friendly fallback component with error details

### useErrorBoundary Hook

For even more control, you can use the `useErrorBoundary` hook directly:

```jsx
import { useErrorBoundary } from 'pulseui';

function MyCustomErrorBoundary() {
  const {
    hasError,
    error,
    errorInfo,
    resetErrorBoundary,
    setError,
    getErrorContainerProps,
    getResetButtonProps,
  } = useErrorBoundary({
    onError: (error, errorInfo) => {
      // Log to error reporting service
      console.error('Error caught:', error, errorInfo);
    },
    onReset: () => {
      // Do something when the error boundary is reset
      console.log('Error boundary reset');
    },
    logErrors: true,
  });
  
  // Custom implementation
}
```

## Accessibility

The Error Boundary component follows accessibility best practices:

- The error container has `role="alert"` to notify screen readers of important, time-sensitive information
- The error container has `aria-live="assertive"` to immediately interrupt the screen reader to announce the error
- The reset button has appropriate ARIA attributes for better screen reader support
