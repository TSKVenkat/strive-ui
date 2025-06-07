# SnackbarHeadless

A headless component for creating customizable snackbar notifications with extensive flexibility for developers. Snackbars provide brief messages about app processes at the bottom of the screen.

## Usage

```jsx
import { SnackbarHeadless } from 'pulseui';
import { useState } from 'react';

function MySnackbar() {
  const [isVisible, setIsVisible] = useState(false);
  
  const showSnackbar = () => {
    setIsVisible(true);
  };
  
  return (
    <>
      <button onClick={showSnackbar}>
        Show Snackbar
      </button>
      
      <SnackbarHeadless.Root
        defaultVisible={isVisible}
        autoHideTimeout={5000}
        dismissible={true}
        variant="success"
        position="bottom"
        hasAction={true}
        hasCloseButton={true}
        onDismiss={() => setIsVisible(false)}
        onAction={() => console.log('Action clicked')}
      >
        <SnackbarHeadless.Portal>
          <SnackbarHeadless.Container
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              backgroundColor: '#333',
              color: 'white',
              borderRadius: '4px',
              boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
              minWidth: '250px',
              maxWidth: '500px',
            }}
          >
            <SnackbarHeadless.Content
              style={{
                flex: 1,
                marginRight: '16px',
              }}
            >
              File successfully uploaded!
            </SnackbarHeadless.Content>
            
            <SnackbarHeadless.Action
              style={{
                background: 'none',
                border: 'none',
                color: '#4CAF50',
                fontWeight: 'bold',
                marginRight: '8px',
                cursor: 'pointer',
                padding: '4px 8px',
              }}
            >
              VIEW
            </SnackbarHeadless.Action>
            
            <SnackbarHeadless.Close
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer',
                padding: '4px',
              }}
            />
          </SnackbarHeadless.Container>
        </SnackbarHeadless.Portal>
      </SnackbarHeadless.Root>
    </>
  );
}
```

## Creating Different Snackbar Variants

```jsx
import { SnackbarHeadless } from 'pulseui';
import { useState } from 'react';

function SnackbarExample() {
  const [isVisible, setIsVisible] = useState(false);
  const [variant, setVariant] = useState('default');
  
  // Style mapping based on variant
  const variantStyles = {
    default: {
      backgroundColor: '#333',
      color: 'white',
      actionColor: '#90CAF9',
    },
    info: {
      backgroundColor: '#2196F3',
      color: 'white',
      actionColor: 'white',
    },
    success: {
      backgroundColor: '#4CAF50',
      color: 'white',
      actionColor: 'white',
    },
    warning: {
      backgroundColor: '#FF9800',
      color: 'white',
      actionColor: 'white',
    },
    error: {
      backgroundColor: '#F44336',
      color: 'white',
      actionColor: 'white',
    },
  };
  
  const currentStyle = variantStyles[variant] || variantStyles.default;
  
  const showSnackbar = (type) => {
    setVariant(type);
    setIsVisible(true);
  };
  
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => showSnackbar('default')}>Default</button>
        <button onClick={() => showSnackbar('info')}>Info</button>
        <button onClick={() => showSnackbar('success')}>Success</button>
        <button onClick={() => showSnackbar('warning')}>Warning</button>
        <button onClick={() => showSnackbar('error')}>Error</button>
      </div>
      
      <SnackbarHeadless.Root
        defaultVisible={isVisible}
        autoHideTimeout={5000}
        dismissible={true}
        variant={variant}
        position="bottom"
        hasAction={true}
        hasCloseButton={true}
        onDismiss={() => setIsVisible(false)}
        onAction={() => console.log('Action clicked')}
      >
        <SnackbarHeadless.Portal>
          <SnackbarHeadless.Container
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              backgroundColor: currentStyle.backgroundColor,
              color: currentStyle.color,
              borderRadius: '4px',
              boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
              minWidth: '250px',
              maxWidth: '500px',
            }}
          >
            <SnackbarHeadless.Content
              style={{
                flex: 1,
                marginRight: '16px',
              }}
            >
              {variant === 'default' && 'This is a default snackbar message'}
              {variant === 'info' && 'This is an informational message'}
              {variant === 'success' && 'Operation completed successfully'}
              {variant === 'warning' && 'Warning: This action cannot be undone'}
              {variant === 'error' && 'Error: Something went wrong'}
            </SnackbarHeadless.Content>
            
            <SnackbarHeadless.Action
              style={{
                background: 'none',
                border: 'none',
                color: currentStyle.actionColor,
                fontWeight: 'bold',
                marginRight: '8px',
                cursor: 'pointer',
                padding: '4px 8px',
              }}
            >
              {variant === 'error' ? 'RETRY' : 'DISMISS'}
            </SnackbarHeadless.Action>
            
            <SnackbarHeadless.Close
              style={{
                background: 'none',
                border: 'none',
                color: currentStyle.color,
                fontSize: '18px',
                cursor: 'pointer',
                padding: '4px',
              }}
            />
          </SnackbarHeadless.Container>
        </SnackbarHeadless.Portal>
      </SnackbarHeadless.Root>
    </div>
  );
}
```

## Creating a Reusable Snackbar Component

```jsx
import { SnackbarHeadless } from 'pulseui';
import { useState, useEffect } from 'react';

function useSnackbarManager() {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Add a snackbar to the queue
  const enqueue = (message, options = {}) => {
    const snackbar = {
      id: Date.now(),
      message,
      ...options,
    };
    
    setQueue(prev => [...prev, snackbar]);
  };
  
  // Process the queue
  useEffect(() => {
    if (queue.length > 0 && !current) {
      const next = queue[0];
      setCurrent(next);
      setIsVisible(true);
      setQueue(prev => prev.slice(1));
    }
  }, [queue, current]);
  
  // Handle dismiss
  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrent(null);
    }, 300); // Allow for exit animation
  };
  
  return {
    current,
    isVisible,
    enqueue,
    handleDismiss,
  };
}

function CustomSnackbar() {
  const { current, isVisible, enqueue, handleDismiss } = useSnackbarManager();
  
  // Style mapping based on variant
  const variantStyles = {
    default: {
      backgroundColor: '#333',
      color: 'white',
      actionColor: '#90CAF9',
    },
    info: {
      backgroundColor: '#2196F3',
      color: 'white',
      actionColor: 'white',
    },
    success: {
      backgroundColor: '#4CAF50',
      color: 'white',
      actionColor: 'white',
    },
    warning: {
      backgroundColor: '#FF9800',
      color: 'white',
      actionColor: 'white',
    },
    error: {
      backgroundColor: '#F44336',
      color: 'white',
      actionColor: 'white',
    },
  };
  
  const showSnackbar = (type) => {
    enqueue(`This is a ${type} message`, { 
      variant: type, 
      hasAction: true, 
      actionText: type === 'error' ? 'RETRY' : 'DISMISS',
      onAction: () => console.log(`${type} action clicked`),
    });
  };
  
  const currentStyle = current?.variant ? 
    variantStyles[current.variant] : 
    variantStyles.default;
  
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => showSnackbar('default')}>Default</button>
        <button onClick={() => showSnackbar('info')}>Info</button>
        <button onClick={() => showSnackbar('success')}>Success</button>
        <button onClick={() => showSnackbar('warning')}>Warning</button>
        <button onClick={() => showSnackbar('error')}>Error</button>
      </div>
      
      <SnackbarHeadless.Root
        defaultVisible={isVisible}
        autoHideTimeout={5000}
        dismissible={true}
        variant={current?.variant || 'default'}
        position="bottom"
        hasAction={current?.hasAction || false}
        hasCloseButton={true}
        onDismiss={handleDismiss}
        onAction={current?.onAction}
      >
        <SnackbarHeadless.Portal>
          <SnackbarHeadless.Container
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              backgroundColor: currentStyle?.backgroundColor,
              color: currentStyle?.color,
              borderRadius: '4px',
              boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
              minWidth: '250px',
              maxWidth: '500px',
              transition: 'transform 0.3s ease, opacity 0.3s ease',
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              opacity: isVisible ? 1 : 0,
            }}
          >
            <SnackbarHeadless.Content
              style={{
                flex: 1,
                marginRight: '16px',
              }}
            >
              {current?.message}
            </SnackbarHeadless.Content>
            
            {current?.hasAction && (
              <SnackbarHeadless.Action
                style={{
                  background: 'none',
                  border: 'none',
                  color: currentStyle?.actionColor,
                  fontWeight: 'bold',
                  marginRight: '8px',
                  cursor: 'pointer',
                  padding: '4px 8px',
                }}
              >
                {current?.actionText || 'ACTION'}
              </SnackbarHeadless.Action>
            )}
            
            <SnackbarHeadless.Close
              style={{
                background: 'none',
                border: 'none',
                color: currentStyle?.color,
                fontSize: '18px',
                cursor: 'pointer',
                padding: '4px',
              }}
            />
          </SnackbarHeadless.Container>
        </SnackbarHeadless.Portal>
      </SnackbarHeadless.Root>
    </div>
  );
}

// Usage
function App() {
  return (
    <div>
      <h1>Snackbar Example</h1>
      <CustomSnackbar />
    </div>
  );
}
```

## API

### SnackbarHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultVisible` | `boolean` | `false` | Whether the snackbar is initially visible |
| `autoHideTimeout` | `number` | `5000` | Auto-hide timeout in milliseconds |
| `dismissible` | `boolean` | `true` | Whether the snackbar can be dismissed |
| `onDismiss` | `() => void` | - | Callback when the snackbar is dismissed |
| `onShow` | `() => void` | - | Callback when the snackbar is shown |
| `variant` | `'default' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'default'` | Variant of the snackbar |
| `position` | `'top' \| 'top-left' \| 'top-right' \| 'bottom' \| 'bottom-left' \| 'bottom-right'` | `'bottom'` | Position of the snackbar |
| `hasAction` | `boolean` | `false` | Whether the snackbar has an action button |
| `hasCloseButton` | `boolean` | `true` | Whether the snackbar has a close button |
| `onAction` | `() => void` | - | Callback when the action button is clicked |

### Other Components

- `SnackbarHeadless.Portal`: Portal container for the snackbar
- `SnackbarHeadless.Container`: Container for the snackbar
- `SnackbarHeadless.Content`: Content container for the snackbar
- `SnackbarHeadless.Action`: Action button for the snackbar
- `SnackbarHeadless.Close`: Close button for the snackbar

### useSnackbar Hook

For even more control, you can use the `useSnackbar` hook directly:

```jsx
import { useSnackbar } from 'pulseui';

function MyCustomSnackbar() {
  const {
    visible,
    show,
    hide,
    toggle,
    variant,
    setVariant,
    position,
    setPosition,
    dismissible,
    hasAction,
    hasCloseButton,
    getSnackbarProps,
    getCloseButtonProps,
    getActionButtonProps,
  } = useSnackbar({
    defaultVisible: false,
    autoHideTimeout: 5000,
    variant: 'info',
    position: 'bottom',
    onDismiss: () => console.log('Snackbar dismissed'),
    onAction: () => console.log('Action clicked'),
  });
  
  // Custom implementation
}
```

## Accessibility

The Snackbar component follows accessibility best practices:

- The snackbar container has `role="status"` to notify screen readers of important information
- The snackbar has `aria-live="polite"` to announce changes in a non-intrusive way
- The close button has an appropriate `aria-label` for screen readers
- The action button has an appropriate `aria-label` for screen readers
