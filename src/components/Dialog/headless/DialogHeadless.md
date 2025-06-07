# DialogHeadless

A headless component for creating customizable dialog boxes with confirm and cancel actions, providing extensive flexibility for developers.

## Usage

```jsx
import { DialogHeadless } from 'pulseui';

function MyDialog() {
  const handleConfirm = (value) => {
    console.log('Dialog confirmed with value:', value);
    // Perform action on confirmation
  };

  const handleCancel = () => {
    console.log('Dialog cancelled');
    // Perform action on cancellation
  };

  return (
    <DialogHeadless.Root
      closeOnOutsideClick={true}
      closeOnEscape={true}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    >
      <DialogHeadless.Trigger>
        Open Dialog
      </DialogHeadless.Trigger>
      
      <DialogHeadless.Portal>
        <DialogHeadless.Overlay>
          <DialogHeadless.Content>
            <DialogHeadless.Close
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
            </DialogHeadless.Close>
            
            <DialogHeadless.Title>
              Confirm Action
            </DialogHeadless.Title>
            
            <DialogHeadless.Description>
              Are you sure you want to perform this action?
            </DialogHeadless.Description>
            
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <DialogHeadless.Cancel
                style={{ 
                  padding: '8px 16px', 
                  background: '#f1f1f1', 
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              >
                Cancel
              </DialogHeadless.Cancel>
              
              <DialogHeadless.Confirm
                value="custom-value"
                style={{ 
                  padding: '8px 16px', 
                  background: '#4CAF50', 
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px'
                }}
              >
                Confirm
              </DialogHeadless.Confirm>
            </div>
          </DialogHeadless.Content>
        </DialogHeadless.Overlay>
      </DialogHeadless.Portal>
    </DialogHeadless.Root>
  );
}
```

## Creating a Confirmation Dialog

```jsx
import { DialogHeadless } from 'pulseui';

function ConfirmationDialog({ isOpen, onClose, onConfirm, message, title = 'Confirm Action' }) {
  return (
    <DialogHeadless.Root
      open={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <DialogHeadless.Portal>
        <DialogHeadless.Overlay>
          <DialogHeadless.Content>
            <DialogHeadless.Title>
              {title}
            </DialogHeadless.Title>
            
            <DialogHeadless.Description>
              {message}
            </DialogHeadless.Description>
            
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <DialogHeadless.Cancel>
                No
              </DialogHeadless.Cancel>
              
              <DialogHeadless.Confirm>
                Yes
              </DialogHeadless.Confirm>
            </div>
          </DialogHeadless.Content>
        </DialogHeadless.Overlay>
      </DialogHeadless.Portal>
    </DialogHeadless.Root>
  );
}

// Usage
function App() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleConfirm = () => {
    console.log('Action confirmed!');
    setIsDialogOpen(false);
  };
  
  return (
    <div>
      <button onClick={() => setIsDialogOpen(true)}>Delete Item</button>
      
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirm}
        message="Are you sure you want to delete this item? This action cannot be undone."
      />
    </div>
  );
}
```

## API

### DialogHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultOpen` | `boolean` | `false` | Whether the dialog is initially open |
| `open` | `boolean` | - | Controlled open state |
| `onOpen` | `() => void` | - | Callback when the dialog opens |
| `onClose` | `() => void` | - | Callback when the dialog closes |
| `closeOnOutsideClick` | `boolean` | `true` | Whether to close the dialog when clicking outside |
| `closeOnEscape` | `boolean` | `true` | Whether to close the dialog when pressing Escape key |
| `trapFocus` | `boolean` | `true` | Whether to trap focus within the dialog |
| `preventScroll` | `boolean` | `true` | Whether to prevent scrolling of the body when dialog is open |
| `usePortal` | `boolean` | `true` | Whether to render the dialog in a portal |
| `portalId` | `string` | `'modal-root'` | ID of the element to render the portal into |
| `defaultReturnValue` | `any` | `null` | Default return value when dialog is closed without a decision |
| `onConfirm` | `(value?: any) => void` | - | Callback when dialog is confirmed |
| `onCancel` | `(value?: any) => void` | - | Callback when dialog is cancelled |

### Other Components

- `DialogHeadless.Trigger`: Button that opens the dialog
- `DialogHeadless.Portal`: Portal container for the dialog
- `DialogHeadless.Overlay`: Background overlay for the dialog
- `DialogHeadless.Content`: Content container for the dialog
- `DialogHeadless.Close`: Button that closes the dialog
- `DialogHeadless.Confirm`: Button that confirms the dialog
- `DialogHeadless.Cancel`: Button that cancels the dialog
- `DialogHeadless.Title`: Title for the dialog
- `DialogHeadless.Description`: Description for the dialog

### useDialog Hook

For even more control, you can use the `useDialog` hook directly:

```jsx
import { useDialog } from 'pulseui';

function MyCustomDialog() {
  const {
    isOpen,
    open,
    close,
    confirm,
    cancel,
    getConfirmButtonProps,
    getCancelButtonProps,
    // ...other properties and methods
  } = useDialog({
    onConfirm: (value) => console.log('Confirmed with:', value),
    onCancel: () => console.log('Cancelled'),
  });
  
  // Custom implementation
}
```

## Accessibility

The Dialog component follows WAI-ARIA best practices for dialogs:

- The dialog container has `role="dialog"` and `aria-modal="true"`
- Focus is trapped within the dialog when open
- Focus is restored to the trigger element when the dialog closes
- The escape key can be used to close the dialog
- The dialog title has an ID that can be referenced by `aria-labelledby`
- The dialog description has an ID that can be referenced by `aria-describedby`
