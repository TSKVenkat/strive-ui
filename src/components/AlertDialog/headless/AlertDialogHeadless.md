# AlertDialogHeadless

A headless component for creating customizable alert dialogs that require user acknowledgment, providing extensive flexibility for developers.

## Usage

```jsx
import { AlertDialogHeadless } from 'strive-ui';

function MyAlertDialog() {
  const handleAction = () => {
    console.log('Alert dialog action confirmed');
    // Perform action after acknowledgment
  };

  return (
    <AlertDialogHeadless.Root
      preventDismiss={true}
      onConfirm={handleAction}
    >
      <AlertDialogHeadless.Trigger>
        Delete Account
      </AlertDialogHeadless.Trigger>
      
      <AlertDialogHeadless.Portal>
        <AlertDialogHeadless.Overlay>
          <AlertDialogHeadless.Content>
            <AlertDialogHeadless.Title>
              Delete Account
            </AlertDialogHeadless.Title>
            
            <AlertDialogHeadless.Description>
              This action cannot be undone. This will permanently delete your account and remove your data from our servers.
            </AlertDialogHeadless.Description>
            
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <AlertDialogHeadless.Cancel
                style={{ 
                  padding: '8px 16px', 
                  background: '#f1f1f1', 
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              >
                Cancel
              </AlertDialogHeadless.Cancel>
              
              <AlertDialogHeadless.Action
                style={{ 
                  padding: '8px 16px', 
                  background: '#d32f2f', 
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px'
                }}
              >
                Yes, Delete Account
              </AlertDialogHeadless.Action>
            </div>
          </AlertDialogHeadless.Content>
        </AlertDialogHeadless.Overlay>
      </AlertDialogHeadless.Portal>
    </AlertDialogHeadless.Root>
  );
}
```

## Creating a Reusable Alert Dialog

```jsx
import { AlertDialogHeadless } from 'strive-ui';

function DangerAlertDialog({ 
  isOpen, 
  onClose, 
  onAction, 
  title, 
  description, 
  actionText = 'Continue', 
  cancelText = 'Cancel' 
}) {
  return (
    <AlertDialogHeadless.Root
      open={isOpen}
      onClose={onClose}
      onConfirm={onAction}
      preventDismiss={true}
    >
      <AlertDialogHeadless.Portal>
        <AlertDialogHeadless.Overlay>
          <AlertDialogHeadless.Content
            style={{
              width: '450px',
              padding: '24px',
              borderRadius: '8px',
            }}
          >
            <AlertDialogHeadless.Title
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#d32f2f',
                marginBottom: '8px'
              }}
            >
              {title}
            </AlertDialogHeadless.Title>
            
            <AlertDialogHeadless.Description
              style={{
                fontSize: '14px',
                color: '#333',
                marginBottom: '24px'
              }}
            >
              {description}
            </AlertDialogHeadless.Description>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <AlertDialogHeadless.Cancel
                style={{ 
                  padding: '8px 16px', 
                  background: 'transparent', 
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {cancelText}
              </AlertDialogHeadless.Cancel>
              
              <AlertDialogHeadless.Action
                style={{ 
                  padding: '8px 16px', 
                  background: '#d32f2f', 
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {actionText}
              </AlertDialogHeadless.Action>
            </div>
          </AlertDialogHeadless.Content>
        </AlertDialogHeadless.Overlay>
      </AlertDialogHeadless.Portal>
    </AlertDialogHeadless.Root>
  );
}

// Usage
function App() {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  
  const handleDeleteAccount = () => {
    console.log('Account deleted');
    setIsAlertOpen(false);
    // Perform actual deletion
  };
  
  return (
    <div>
      <button onClick={() => setIsAlertOpen(true)}>Delete Account</button>
      
      <DangerAlertDialog
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onAction={handleDeleteAccount}
        title="Delete Account"
        description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
        actionText="Yes, Delete Account"
      />
    </div>
  );
}
```

## API

### AlertDialogHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultOpen` | `boolean` | `false` | Whether the alert dialog is initially open |
| `open` | `boolean` | - | Controlled open state |
| `onOpen` | `() => void` | - | Callback when the alert dialog opens |
| `onClose` | `() => void` | - | Callback when the alert dialog closes |
| `preventDismiss` | `boolean` | `false` | Whether to prevent closing the alert dialog by clicking outside or pressing escape |
| `closeOnOutsideClick` | `boolean` | `!preventDismiss` | Whether to close the alert dialog when clicking outside |
| `closeOnEscape` | `boolean` | `!preventDismiss` | Whether to close the alert dialog when pressing Escape key |
| `trapFocus` | `boolean` | `true` | Whether to trap focus within the alert dialog |
| `preventScroll` | `boolean` | `true` | Whether to prevent scrolling of the body when alert dialog is open |
| `usePortal` | `boolean` | `true` | Whether to render the alert dialog in a portal |
| `portalId` | `string` | `'modal-root'` | ID of the element to render the portal into |
| `onConfirm` | `(value?: any) => void` | - | Callback when alert dialog action is confirmed |
| `onCancel` | `(value?: any) => void` | - | Callback when alert dialog is cancelled |

### Other Components

- `AlertDialogHeadless.Trigger`: Button that opens the alert dialog
- `AlertDialogHeadless.Portal`: Portal container for the alert dialog
- `AlertDialogHeadless.Overlay`: Background overlay for the alert dialog
- `AlertDialogHeadless.Content`: Content container for the alert dialog
- `AlertDialogHeadless.Action`: Button that confirms the alert dialog action
- `AlertDialogHeadless.Cancel`: Button that cancels the alert dialog
- `AlertDialogHeadless.Title`: Title for the alert dialog
- `AlertDialogHeadless.Description`: Description for the alert dialog

### useAlertDialog Hook

For even more control, you can use the `useAlertDialog` hook directly:

```jsx
import { useAlertDialog } from 'strive-ui';

function MyCustomAlertDialog() {
  const {
    isOpen,
    open,
    close,
    confirm,
    cancel,
    getConfirmButtonProps,
    getCancelButtonProps,
    // ...other properties and methods
  } = useAlertDialog({
    preventDismiss: true,
    onConfirm: () => console.log('Confirmed'),
    onCancel: () => console.log('Cancelled'),
  });
  
  // Custom implementation
}
```

## Accessibility

The Alert Dialog component follows WAI-ARIA best practices for alert dialogs:

- The alert dialog container has `role="alertdialog"` and `aria-modal="true"`
- Focus is trapped within the alert dialog when open
- Focus is restored to the trigger element when the alert dialog closes
- The alert dialog title has an ID that can be referenced by `aria-labelledby`
- The alert dialog description has an ID that can be referenced by `aria-describedby`
- When `preventDismiss` is true, the alert dialog can only be closed by explicit user action
