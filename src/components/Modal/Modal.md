# Modal Component

The Modal component displays content in a layer that appears above the main content of the page. It's commonly used for dialogs, forms, or other interactive elements that require user attention.

## Import

```jsx
import { Modal } from 'pulseui';
```

## Features

- Customizable header, body, and footer sections
- Various sizes and positions
- Backdrop overlay with customizable opacity
- Focus trap for accessibility
- Smooth animations
- Keyboard navigation support
- Responsive design

## Usage

```jsx
import { Modal, Button } from 'pulseui';
import { useState } from 'react';

function ModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="md"
      >
        <Modal.Header>Modal Title</Modal.Header>
        <Modal.Body>
          <p>This is the modal content.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button variant="primary">Save</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
```

## Props

### Modal Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | boolean | false | Whether the modal is visible |
| `onClose` | () => void | - | Callback when the modal is closed |
| `size` | 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full' | 'md' | The size of the modal |
| `closeOnEsc` | boolean | true | Whether pressing the Esc key closes the modal |
| `closeOnOverlayClick` | boolean | true | Whether clicking the overlay closes the modal |
| `hasOverlay` | boolean | true | Whether to show a backdrop overlay |
| `overlayOpacity` | number | 0.5 | Opacity of the backdrop overlay |
| `returnFocusOnClose` | boolean | true | Whether to return focus to the element that triggered the modal |
| `blockScrollOnOpen` | boolean | true | Whether to block scrolling of the page when modal is open |
| `autoFocus` | boolean | true | Whether to automatically focus the first focusable element |
| `trapFocus` | boolean | true | Whether to trap focus within the modal |
| `animationDuration` | number | 300 | Duration of the open/close animation in milliseconds |
| `zIndex` | number | 1050 | Z-index of the modal |
| `id` | string | - | ID of the modal |
| `isCentered` | boolean | true | Whether to center the modal vertically |
| `scrollBehavior` | 'inside' \| 'outside' | 'outside' | Whether to scroll inside the modal or allow the entire page to scroll |

### Modal.Header Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `closeButton` | boolean | true | Whether to show a close button in the header |
| `onClose` | () => void | - | Callback when the close button is clicked |
| `children` | ReactNode | - | Content of the header |

### Modal.Body Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Content of the body |
| `padding` | string \| number | '1rem' | Padding of the body |

### Modal.Footer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Content of the footer |
| `padding` | string \| number | '1rem' | Padding of the footer |
| `justifyContent` | 'flex-start' \| 'flex-end' \| 'center' \| 'space-between' \| 'space-around' | 'flex-end' | Justification of the footer content |

## Modal Sizes

The Modal component supports various sizes:

```jsx
<Modal size="xs">Extra Small Modal</Modal>
<Modal size="sm">Small Modal</Modal>
<Modal size="md">Medium Modal (default)</Modal>
<Modal size="lg">Large Modal</Modal>
<Modal size="xl">Extra Large Modal</Modal>
<Modal size="full">Full Screen Modal</Modal>
```

## Scroll Behavior

You can control how scrolling works when the modal content exceeds the viewport height:

```jsx
// Scroll inside the modal (content scrolls, modal stays fixed)
<Modal scrollBehavior="inside">
  {/* Long content */}
</Modal>

// Scroll outside the modal (entire modal scrolls with the page)
<Modal scrollBehavior="outside">
  {/* Long content */}
</Modal>
```

## Accessibility

The Modal component follows accessibility best practices:
- Uses appropriate ARIA roles and attributes
- Implements focus trapping within the modal when open
- Returns focus to the trigger element when closed
- Supports keyboard navigation (Tab for focus, Esc to close)
- Ensures proper focus management
- Provides appropriate contrast for content
- Handles screen reader announcements for modal state changes
