# Drawer Component

The Drawer component is a panel that slides in from the edge of the screen. It can be used for navigation, filtering options, or displaying additional information without navigating away from the current page.

## Import

```jsx
import { Drawer } from 'pulseui';
```

## Features

- Multiple placement options (left, right, top, bottom)
- Customizable sizes
- Backdrop overlay with customizable opacity
- Header, body, and footer sections
- Smooth animations
- Focus trap for accessibility
- Responsive design
- Keyboard navigation support

## Usage

```jsx
import { Drawer, Button } from 'pulseui';
import { useState } from 'react';

function DrawerExample() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>
      
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement="right"
        size="md"
      >
        <Drawer.Header>Drawer Title</Drawer.Header>
        <Drawer.Body>
          <p>This is the drawer content.</p>
        </Drawer.Body>
        <Drawer.Footer>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button variant="primary">Save</Button>
        </Drawer.Footer>
      </Drawer>
    </>
  );
}
```

## Props

### Drawer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | boolean | false | Whether the drawer is visible |
| `onClose` | () => void | - | Callback when the drawer is closed |
| `placement` | 'left' \| 'right' \| 'top' \| 'bottom' | 'right' | The edge of the screen the drawer appears from |
| `size` | 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full' \| string | 'md' | The size of the drawer |
| `closeOnEsc` | boolean | true | Whether pressing the Esc key closes the drawer |
| `closeOnOverlayClick` | boolean | true | Whether clicking the overlay closes the drawer |
| `hasOverlay` | boolean | true | Whether to show a backdrop overlay |
| `overlayOpacity` | number | 0.5 | Opacity of the backdrop overlay |
| `returnFocusOnClose` | boolean | true | Whether to return focus to the element that triggered the drawer |
| `blockScrollOnOpen` | boolean | true | Whether to block scrolling of the page when drawer is open |
| `autoFocus` | boolean | true | Whether to automatically focus the first focusable element |
| `trapFocus` | boolean | true | Whether to trap focus within the drawer |
| `animationDuration` | number | 300 | Duration of the open/close animation in milliseconds |
| `zIndex` | number | 1000 | Z-index of the drawer |
| `id` | string | - | ID of the drawer |

### Drawer.Header Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `closeButton` | boolean | true | Whether to show a close button in the header |
| `onClose` | () => void | - | Callback when the close button is clicked |
| `children` | ReactNode | - | Content of the header |

### Drawer.Body Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Content of the body |
| `padding` | string \| number | '1rem' | Padding of the body |

### Drawer.Footer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Content of the footer |
| `padding` | string \| number | '1rem' | Padding of the footer |
| `justifyContent` | 'flex-start' \| 'flex-end' \| 'center' \| 'space-between' \| 'space-around' | 'flex-end' | Justification of the footer content |

## Accessibility

The Drawer component follows accessibility best practices:
- Uses appropriate ARIA roles and attributes
- Implements focus trapping within the drawer when open
- Returns focus to the trigger element when closed
- Supports keyboard navigation (Tab for focus, Esc to close)
- Ensures proper focus management
- Provides appropriate contrast for content
- Handles screen reader announcements for drawer state changes
