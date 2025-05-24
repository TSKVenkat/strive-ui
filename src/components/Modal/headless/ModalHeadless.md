# ModalHeadless

A headless component for creating customizable modal dialogs with extensive flexibility for developers.

## Usage

```jsx
import { ModalHeadless } from 'strive-ui';

function MyModal() {
  return (
    <ModalHeadless.Root
      closeOnOutsideClick={true}
      closeOnEscape={true}
      trapFocus={true}
      preventScroll={true}
    >
      <ModalHeadless.Trigger>
        Open Modal
      </ModalHeadless.Trigger>
      
      <ModalHeadless.Portal>
        <ModalHeadless.Overlay>
          <ModalHeadless.Content>
            <ModalHeadless.Close
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer'
              }}
            >
              ×
            </ModalHeadless.Close>
            
            <ModalHeadless.Title>
              Modal Title
            </ModalHeadless.Title>
            
            <ModalHeadless.Description>
              This is a description of the modal content.
            </ModalHeadless.Description>
            
            <div style={{ marginTop: '20px' }}>
              <p>This is the main content of the modal.</p>
              <p>You can put any elements here.</p>
            </div>
            
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <ModalHeadless.Close as="button" style={{ padding: '8px 16px' }}>
                Cancel
              </ModalHeadless.Close>
              <button style={{ padding: '8px 16px' }}>
                Confirm
              </button>
            </div>
          </ModalHeadless.Content>
        </ModalHeadless.Overlay>
      </ModalHeadless.Portal>
    </ModalHeadless.Root>
  );
}
```

## API

### ModalHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultOpen` | `boolean` | `false` | Whether the modal is initially open |
| `open` | `boolean` | - | Controlled open state |
| `onOpen` | `() => void` | - | Callback when the modal opens |
| `onClose` | `() => void` | - | Callback when the modal closes |
| `closeOnOutsideClick` | `boolean` | `true` | Whether to close the modal when clicking outside |
| `closeOnEscape` | `boolean` | `true` | Whether to close the modal when pressing Escape key |
| `trapFocus` | `boolean` | `true` | Whether to trap focus within the modal |
| `preventScroll` | `boolean` | `true` | Whether to prevent scrolling of the body when modal is open |
| `usePortal` | `boolean` | `true` | Whether to render the modal in a portal |
| `portalId` | `string` | `'modal-root'` | ID of the element to render the portal into |

### Other Components

- `ModalHeadless.Trigger`: Button that opens the modal
- `ModalHeadless.Portal`: Portal container for the modal
- `ModalHeadless.Overlay`: Background overlay for the modal
- `ModalHeadless.Content`: Content container for the modal
- `ModalHeadless.Close`: Button that closes the modal
- `ModalHeadless.Title`: Title for the modal
- `ModalHeadless.Description`: Description for the modal

### useModal Hook

For even more control, you can use the `useModal` hook directly:

```jsx
import { useModal } from 'strive-ui';

function MyCustomModal() {
  const {
    isOpen,
    open,
    close,
    toggle,
    getContainerProps,
    getOverlayProps,
    getContentProps,
    getTriggerProps,
    getCloseButtonProps,
  } = useModal({
    closeOnOutsideClick: true,
    closeOnEscape: true,
  });
  
  // Custom implementation
}
```

## Accessibility

The Modal component follows WAI-ARIA best practices for dialogs:

- The modal container has `role="dialog"` and `aria-modal="true"`
- Focus is trapped within the modal when open
- Focus is restored to the trigger element when the modal closes
- The escape key can be used to close the modal
- The modal title has an ID that can be referenced by `aria-labelledby`
- The modal description has an ID that can be referenced by `aria-describedby`
