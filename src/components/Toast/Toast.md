# Toast Component

The Toast component displays brief, non-blocking notifications to provide feedback about an operation or to present information to the user.

## Import

```jsx
import { Toast, useToast } from 'pulseui';
```

## Features

- Multiple variants for different contexts (success, error, warning, info)
- Customizable duration and positioning
- Auto-dismiss functionality
- Progress indicator
- Support for actions and interactive elements
- Stacking of multiple toasts
- Smooth animations
- Accessible implementation

## Usage

### Using the Toast Hook

The recommended way to use toasts is with the `useToast` hook:

```jsx
import { useToast, Button } from 'pulseui';

function ToastExample() {
  const toast = useToast();
  
  const showSuccessToast = () => {
    toast({
      title: 'Success',
      description: 'Operation completed successfully',
      variant: 'success',
      duration: 5000,
      isClosable: true,
    });
  };
  
  return (
    <Button onClick={showSuccessToast}>
      Show Success Toast
    </Button>
  );
}
```

### Using the Toast Component Directly

You can also use the Toast component directly for more control:

```jsx
import { Toast, Button } from 'pulseui';
import { useState } from 'react';

function DirectToastExample() {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <>
      <Button onClick={() => setIsVisible(true)}>
        Show Toast
      </Button>
      
      <Toast
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        title="Information"
        description="This is an informational message"
        variant="info"
        duration={5000}
        position="top-right"
      />
    </>
  );
}
```

### Toast Provider

To use toasts throughout your application, wrap your app with the ToastProvider:

```jsx
import { ToastProvider } from 'pulseui';

function App() {
  return (
    <ToastProvider>
      {/* Your app components */}
    </ToastProvider>
  );
}
```

## Props

### Toast Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isVisible` | boolean | false | Whether the toast is visible |
| `onClose` | () => void | - | Callback when the toast is closed |
| `title` | ReactNode | - | Title of the toast |
| `description` | ReactNode | - | Description/content of the toast |
| `variant` | 'info' \| 'success' \| 'warning' \| 'error' \| 'neutral' | 'info' | Visual variant of the toast |
| `duration` | number | 5000 | Duration in milliseconds before auto-closing (0 for no auto-close) |
| `position` | 'top' \| 'top-right' \| 'top-left' \| 'bottom' \| 'bottom-right' \| 'bottom-left' | 'bottom-right' | Position of the toast on the screen |
| `isClosable` | boolean | true | Whether the toast has a close button |
| `showProgress` | boolean | false | Whether to show a progress indicator |
| `pauseOnHover` | boolean | true | Whether to pause the auto-close timer on hover |
| `pauseOnFocus` | boolean | true | Whether to pause the auto-close timer on focus |
| `icon` | ReactNode | - | Custom icon to display |
| `action` | ReactNode | - | Action element (e.g., button) to display |
| `zIndex` | number | 1000 | Z-index of the toast |
| `elevation` | 'none' \| 'sm' \| 'md' \| 'lg' | 'md' | Shadow elevation of the toast |

### useToast Options

The `useToast` hook accepts the same props as the Toast component:

```jsx
toast({
  title: 'Title',
  description: 'Description',
  variant: 'success',
  duration: 5000,
  position: 'top-right',
  isClosable: true,
  showProgress: true,
  pauseOnHover: true,
  pauseOnFocus: true,
  icon: <CustomIcon />,
  action: <Button size="sm">Undo</Button>,
});
```

### ToastProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultOptions` | ToastOptions | - | Default options for all toasts |
| `maxToasts` | number | 10 | Maximum number of toasts to show at once |
| `newestOnTop` | boolean | true | Whether to show newest toasts on top |
| `children` | ReactNode | - | Child components |

## Examples

### Different Variants

```jsx
const toast = useToast();

// Info toast
toast({
  title: 'Information',
  description: 'This is an informational message',
  variant: 'info',
});

// Success toast
toast({
  title: 'Success',
  description: 'Operation completed successfully',
  variant: 'success',
});

// Warning toast
toast({
  title: 'Warning',
  description: 'This action might cause issues',
  variant: 'warning',
});

// Error toast
toast({
  title: 'Error',
  description: 'An error occurred while processing your request',
  variant: 'error',
});

// Neutral toast
toast({
  title: 'Note',
  description: 'This is a neutral notification',
  variant: 'neutral',
});
```

### With Progress Indicator

```jsx
toast({
  title: 'Auto-closing',
  description: 'This toast will close in 5 seconds',
  duration: 5000,
  showProgress: true,
});
```

### With Action

```jsx
toast({
  title: 'Item deleted',
  description: 'The item has been removed',
  variant: 'success',
  action: (
    <Button 
      size="sm" 
      variant="ghost" 
      onClick={() => handleUndo()}
    >
      Undo
    </Button>
  ),
});
```

### Different Positions

```jsx
// Top center
toast({
  title: 'Top center',
  position: 'top',
});

// Top right
toast({
  title: 'Top right',
  position: 'top-right',
});

// Top left
toast({
  title: 'Top left',
  position: 'top-left',
});

// Bottom center
toast({
  title: 'Bottom center',
  position: 'bottom',
});

// Bottom right (default)
toast({
  title: 'Bottom right',
  position: 'bottom-right',
});

// Bottom left
toast({
  title: 'Bottom left',
  position: 'bottom-left',
});
```

## Accessibility

The Toast component follows accessibility best practices:
- Uses appropriate ARIA roles and attributes
- Ensures toasts are announced to screen readers
- Provides keyboard navigation for interactive elements
- Includes focus management for actions
- Allows pausing auto-dismiss on hover and focus
- Maintains adequate color contrast for all variants
