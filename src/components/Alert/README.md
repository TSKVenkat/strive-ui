# Alert Component

The Alert component is designed to display important messages to users, such as success notifications, warnings, or error messages. It offers extensive customization options and interactive features.

## Features

- **Multiple Variants**: Choose from info, success, warning, error, and neutral variants
- **Customizable Appearance**: Options for filled, outlined, or default styles
- **Flexible Border Options**: Control border position (left, right, top, bottom, or all sides)
- **Expandable Content**: Show additional details that can be toggled by the user
- **Auto-Close Functionality**: Automatically dismiss alerts after a specified duration
- **Progress Indicator**: Visual countdown for auto-closing alerts
- **Pause on Hover/Focus**: Pause auto-close timer when the user interacts with the alert
- **Custom Actions**: Add action buttons or other interactive elements
- **Accessibility**: Full keyboard navigation and screen reader support
- **Smooth Animations**: Elegant transitions for showing and hiding alerts

## Usage

```jsx
import { Alert, Button } from 'pulseui';

// Basic usage
<Alert variant="info" title="Information">
  This is an informational alert message.
</Alert>

// With auto-close and progress indicator
<Alert 
  variant="success" 
  title="Success" 
  autoClose 
  autoCloseDuration={5000}
  showProgress
>
  Your changes have been saved successfully.
</Alert>

// With custom actions
<Alert
  variant="warning"
  title="Warning"
  actions={
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Button variant="secondary" size="sm">Cancel</Button>
      <Button variant="primary" size="sm">Confirm</Button>
    </div>
  }
>
  This action cannot be undone.
</Alert>

// Expandable alert with additional content
<Alert
  variant="error"
  title="Error Details"
  expandable
  expandedContent={
    <pre>
      {`Error: Unable to connect to server
at fetchData (api.js:42)
at processRequest (main.js:123)`}
    </pre>
  }
>
  An error occurred while connecting to the server.
</Alert>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | 'info' \| 'success' \| 'warning' \| 'error' \| 'neutral' | 'info' | The variant of the alert |
| `size` | 'sm' \| 'md' \| 'lg' | 'md' | The size of the alert |
| `title` | ReactNode | - | The title of the alert |
| `children` | ReactNode | - | The content of the alert |
| `closable` | boolean | true | Whether the alert is closable |
| `autoClose` | boolean | false | Whether the alert should auto close |
| `autoCloseDuration` | number | 5000 | The duration in ms before auto closing |
| `onClose` | () => void | - | Callback when the alert is closed |
| `hasIcon` | boolean | true | Whether to show an icon |
| `icon` | ReactNode | - | Custom icon to display |
| `outlined` | boolean | false | Whether the alert is outlined |
| `filled` | boolean | false | Whether the alert is filled |
| `hasBorder` | boolean | true | Whether the alert has a border |
| `borderPosition` | 'left' \| 'right' \| 'top' \| 'bottom' \| 'all' | 'left' | The border position |
| `elevated` | boolean | false | Whether the alert is elevated |
| `elevation` | 'sm' \| 'md' \| 'lg' | 'md' | The elevation level |
| `rounded` | boolean | true | Whether the alert is rounded |
| `radius` | 'sm' \| 'md' \| 'lg' \| 'full' | 'md' | The border radius |
| `actions` | ReactNode | - | Custom actions to display |
| `expandable` | boolean | false | Whether the alert is expandable |
| `defaultExpanded` | boolean | false | Whether the alert is expanded by default |
| `expanded` | boolean | - | The expanded state (controlled) |
| `onExpandedChange` | (expanded: boolean) => void | - | Callback when the expanded state changes |
| `expandedContent` | ReactNode | - | Additional content to show when expanded |
| `animationDuration` | number | 300 | Animation duration in ms |
| `dismissible` | boolean | false | Whether the alert is dismissible by clicking anywhere on it |
| `showProgress` | boolean | false | Whether the alert should show a progress bar for auto-close |
| `pauseOnHover` | boolean | true | Whether the alert should pause auto-close on hover |
| `pauseOnFocus` | boolean | true | Whether the alert should pause auto-close on focus |

## Accessibility

The Alert component follows WAI-ARIA guidelines:
- Uses `role="alert"` to ensure screen readers announce the alert content
- Provides appropriate keyboard navigation for interactive elements
- Ensures proper focus management for expandable content
- Includes ARIA attributes for expandable sections (`aria-expanded`)

## Examples

See the Storybook documentation for interactive examples and more usage scenarios.
