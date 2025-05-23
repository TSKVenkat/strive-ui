# Toast Compound Component

The Toast Compound Component is a flexible notification system built using the compound component pattern. It provides a powerful API for creating, managing, and customizing toast notifications in your application.

## Features

- **Compound Component Pattern**: Modular and customizable components
- **Animation Support**: Smooth entrance and exit animations using Framer Motion
- **Responsive Design**: Works across all screen sizes
- **Accessibility**: Proper ARIA attributes and keyboard navigation
- **Customizable**: Style and position toasts to match your design system
- **Progress Bar**: Visual indicator of toast duration
- **Multiple Positions**: 6 different positions for toast placement
- **Variant Support**: Info, Success, Warning, and Error variants
- **Custom Rendering**: Render custom toast content with full control

## Installation

```jsx
import Toast from 'strive-ui/Toast';
```

## Basic Usage

```jsx
import Toast from 'strive-ui/Toast';

function App() {
  return (
    <Toast.Provider>
      <MyComponent />
      <Toast.Container />
    </Toast.Provider>
  );
}

function MyComponent() {
  const toast = Toast.useToast();
  
  const showToast = () => {
    toast.success({
      title: 'Success!',
      description: 'Your action was completed successfully.'
    });
  };
  
  return (
    <button onClick={showToast}>
      Show Toast
    </button>
  );
}
```

## Compound Component API

The Toast component uses the compound component pattern to provide a flexible and customizable API. The main components are:

### Toast.Provider

Provides the toast context to all child components. Must be placed at the root of your application or where you want to use toasts.

```jsx
<Toast.Provider position="top-right" maxToasts={5}>
  {children}
</Toast.Provider>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `ToastPosition` | `'top-right'` | Position of the toast container |
| `maxToasts` | `number` | `5` | Maximum number of toasts to show at once |
| `children` | `ReactNode` | - | Child components |

### Toast.Container

Renders the toast container and manages the display of toasts. Should be placed at the end of your application to ensure toasts appear above all other content.

```jsx
<Toast.Container position="bottom-left" maxToasts={3} />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `ToastPosition` | From Provider | Position of the toast container |
| `maxToasts` | `number` | `5` | Maximum number of toasts to show at once |

### Toast.Custom

A customizable toast component that can be used to create custom toast designs.

```jsx
<Toast.Custom 
  variant="success" 
  hasProgressBar={true} 
  duration={3000}
  onClose={() => console.log('Toast closed')}
>
  <div>Custom toast content</div>
</Toast.Custom>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `ToastVariant` | `'info'` | The variant/type of the toast |
| `hasProgressBar` | `boolean` | `true` | Whether to show a progress bar |
| `duration` | `number` | `5000` | Duration in milliseconds before auto-closing |
| `onClose` | `() => void` | - | Function to call when the toast is closed |
| `as` | `ElementType` | `'div'` | Element type to render as (polymorphic) |
| `...rest` | - | - | Any additional props are passed to the underlying element |

### Toast.useToast

A hook that provides access to the toast API.

```jsx
const toast = Toast.useToast();

// Show a toast
toast.success({
  title: 'Success!',
  description: 'Operation completed successfully.'
});
```

#### API

| Method | Parameters | Return | Description |
|--------|------------|--------|-------------|
| `addToast` | `ToastOptions` | `string` | Adds a new toast and returns its ID |
| `updateToast` | `id: string, options: Partial<ToastOptions>` | `void` | Updates an existing toast |
| `removeToast` | `id: string` | `void` | Removes a toast by ID |
| `removeAllToasts` | - | `void` | Removes all toasts |
| `info` | `Omit<ToastOptions, 'variant'>` | `string` | Shows an info toast |
| `success` | `Omit<ToastOptions, 'variant'>` | `string` | Shows a success toast |
| `warning` | `Omit<ToastOptions, 'variant'>` | `string` | Shows a warning toast |
| `error` | `Omit<ToastOptions, 'variant'>` | `string` | Shows an error toast |

## Toast Options

The `ToastOptions` object accepts the following properties:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | `string` | - | The title of the toast |
| `description` | `string` | - | The content of the toast |
| `variant` | `ToastVariant` | `'info'` | The variant/type of the toast |
| `duration` | `number` | `5000` | Duration in milliseconds before auto-closing |
| `isClosable` | `boolean` | `true` | Whether to show a close button |
| `hasProgressBar` | `boolean` | `true` | Whether the toast has a progress bar |
| `className` | `string` | - | Additional CSS className |
| `render` | `(props: { onClose: () => void }) => ReactNode` | - | Custom render function |

## Advanced Usage

### Custom Toast Rendering

You can provide a custom render function to completely customize the toast content:

```jsx
toast.info({
  render: ({ onClose }) => (
    <div className="custom-toast">
      <img src="/logo.png" alt="Logo" />
      <div>
        <h4>Custom Toast</h4>
        <p>This is a completely custom toast with your own design.</p>
      </div>
      <button onClick={onClose}>×</button>
    </div>
  )
});
```

### Updating Toasts

You can update an existing toast by its ID:

```jsx
const toastId = toast.info({ 
  title: 'Loading...',
  description: 'Please wait while we process your request.' 
});

// Later, update the toast
setTimeout(() => {
  toast.updateToast(toastId, {
    variant: 'success',
    title: 'Success!',
    description: 'Your request has been processed successfully.'
  });
}, 3000);
```

### Custom Toast Container Placement

You can customize where the toast container appears:

```jsx
<Toast.Provider>
  <AppLayout>
    <Sidebar />
    <MainContent />
  </AppLayout>
  
  {/* Place the toast container at a specific position */}
  <Toast.Container position="bottom-center" maxToasts={3} />
</Toast.Provider>
```

### Creating a Custom Toast Component

You can create your own toast component using the `Toast.Custom` component:

```jsx
const MyCustomToast = ({ title, message, onClose }) => (
  <Toast.Custom 
    variant="info" 
    hasProgressBar={false}
    className="my-custom-toast"
  >
    <div className="toast-header">
      <h4>{title}</h4>
      <button onClick={onClose}>Close</button>
    </div>
    <div className="toast-body">
      {message}
    </div>
  </Toast.Custom>
);
```

## Accessibility

The Toast component follows accessibility best practices:

- Toasts are announced to screen readers
- Focus is properly managed
- Keyboard navigation is supported
- ARIA attributes are properly set
- Animations respect the user's reduced motion preference

## Customization

### Styling

You can customize the appearance of toasts using styled-components:

```jsx
import styled from 'styled-components';
import Toast from 'strive-ui/Toast';

const StyledToast = styled(Toast.Custom)`
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-left: 4px solid ${props => 
    props.variant === 'success' ? '#28a745' : 
    props.variant === 'error' ? '#dc3545' : 
    props.variant === 'warning' ? '#ffc107' : '#17a2b8'
  };
`;

// Usage
<StyledToast variant="success">
  <div>Custom styled toast</div>
</StyledToast>
```

### Theme Integration

The Toast component integrates with your theme:

```jsx
// In your theme
const theme = {
  colors: {
    info: { main: '#17a2b8' },
    success: { main: '#28a745' },
    warning: { main: '#ffc107' },
    error: { main: '#dc3545' },
  },
  // ...other theme values
};

// The toast will use these colors automatically
```
