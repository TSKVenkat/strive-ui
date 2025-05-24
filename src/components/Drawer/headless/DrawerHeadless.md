# DrawerHeadless

A headless component for creating customizable sliding drawers with extensive flexibility for developers.

## Usage

```jsx
import { DrawerHeadless } from 'strive-ui';

function MyDrawer() {
  return (
    <DrawerHeadless.Root
      placement="right"
      width="350px"
      hasBackdrop={true}
      closeOnOutsideClick={true}
      closeOnEscape={true}
    >
      <DrawerHeadless.Trigger>
        Open Drawer
      </DrawerHeadless.Trigger>
      
      <DrawerHeadless.Portal>
        <DrawerHeadless.Backdrop />
        
        <DrawerHeadless.Content
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          <DrawerHeadless.Header
            style={{
              padding: '16px',
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h3 style={{ margin: 0 }}>Drawer Title</h3>
            <DrawerHeadless.Close
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer'
              }}
            >
              ×
            </DrawerHeadless.Close>
          </DrawerHeadless.Header>
          
          <DrawerHeadless.Body
            style={{
              padding: '16px'
            }}
          >
            <p>This is the drawer content.</p>
            <p>You can put any elements here.</p>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
              <li>Item 3</li>
            </ul>
          </DrawerHeadless.Body>
          
          <DrawerHeadless.Footer
            style={{
              padding: '16px',
              borderTop: '1px solid #eee',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px'
            }}
          >
            <DrawerHeadless.Close
              as="button"
              style={{
                padding: '8px 16px',
                background: '#f1f1f1',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </DrawerHeadless.Close>
            <button
              style={{
                padding: '8px 16px',
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Save
            </button>
          </DrawerHeadless.Footer>
        </DrawerHeadless.Content>
      </DrawerHeadless.Portal>
    </DrawerHeadless.Root>
  );
}
```

## Creating a Reusable Drawer

```jsx
import { DrawerHeadless } from 'strive-ui';

function CustomDrawer({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  placement = 'right',
  width = '350px'
}) {
  return (
    <DrawerHeadless.Root
      open={isOpen}
      onClose={onClose}
      placement={placement}
      width={width}
    >
      <DrawerHeadless.Portal>
        <DrawerHeadless.Backdrop />
        
        <DrawerHeadless.Content
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            backgroundColor: 'white'
          }}
        >
          <DrawerHeadless.Header
            style={{
              padding: '16px',
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h3 style={{ margin: 0 }}>{title}</h3>
            <DrawerHeadless.Close
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                lineHeight: 1
              }}
            >
              ×
            </DrawerHeadless.Close>
          </DrawerHeadless.Header>
          
          <DrawerHeadless.Body
            style={{
              padding: '16px'
            }}
          >
            {children}
          </DrawerHeadless.Body>
        </DrawerHeadless.Content>
      </DrawerHeadless.Portal>
    </DrawerHeadless.Root>
  );
}

// Usage
function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  return (
    <div>
      <button onClick={() => setIsDrawerOpen(true)}>Open Settings</button>
      
      <CustomDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Settings"
      >
        <div>
          <h4>Account Settings</h4>
          <p>Manage your account settings and preferences.</p>
          
          <div style={{ marginTop: '20px' }}>
            <label>
              <input type="checkbox" /> Enable notifications
            </label>
          </div>
          
          <div style={{ marginTop: '10px' }}>
            <label>
              <input type="checkbox" /> Dark mode
            </label>
          </div>
        </div>
      </CustomDrawer>
    </div>
  );
}
```

## API

### DrawerHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultOpen` | `boolean` | `false` | Whether the drawer is initially open |
| `open` | `boolean` | - | Controlled open state |
| `onOpen` | `() => void` | - | Callback when the drawer opens |
| `onClose` | `() => void` | - | Callback when the drawer closes |
| `placement` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` | Placement of the drawer |
| `width` | `string \| number` | `'300px'` | Width of the drawer (for left/right placements) |
| `height` | `string \| number` | `'300px'` | Height of the drawer (for top/bottom placements) |
| `hasBackdrop` | `boolean` | `true` | Whether to show a backdrop behind the drawer |
| `enableGestures` | `boolean` | `false` | Whether to enable swipe gestures to open/close the drawer |
| `closeOnOutsideClick` | `boolean` | `true` | Whether to close the drawer when clicking outside |
| `closeOnEscape` | `boolean` | `true` | Whether to close the drawer when pressing Escape key |
| `trapFocus` | `boolean` | `true` | Whether to trap focus within the drawer |
| `preventScroll` | `boolean` | `true` | Whether to prevent scrolling of the body when drawer is open |
| `usePortal` | `boolean` | `true` | Whether to render the drawer in a portal |
| `portalId` | `string` | `'drawer-root'` | ID of the element to render the portal into |
| `onSwipe` | `(distance: number) => void` | - | Callback when the drawer is swiped |
| `onSwipeEnd` | `(isOpen: boolean) => void` | - | Callback when the drawer is fully swiped open or closed |

### Other Components

- `DrawerHeadless.Trigger`: Button that opens the drawer
- `DrawerHeadless.Portal`: Portal container for the drawer
- `DrawerHeadless.Backdrop`: Background overlay for the drawer
- `DrawerHeadless.Content`: Content container for the drawer
- `DrawerHeadless.Close`: Button that closes the drawer
- `DrawerHeadless.Header`: Header section of the drawer
- `DrawerHeadless.Body`: Body section of the drawer
- `DrawerHeadless.Footer`: Footer section of the drawer

### useDrawer Hook

For even more control, you can use the `useDrawer` hook directly:

```jsx
import { useDrawer } from 'strive-ui';

function MyCustomDrawer() {
  const {
    isOpen,
    open,
    close,
    toggle,
    placement,
    width,
    height,
    hasBackdrop,
    enableGestures,
    getContainerProps,
    getBackdropProps,
    getContentProps,
    getTriggerProps,
    getCloseButtonProps,
  } = useDrawer({
    placement: 'left',
    width: '400px',
    hasBackdrop: true,
  });
  
  // Custom implementation
}
```

## Accessibility

The Drawer component follows WAI-ARIA best practices for dialogs:

- The drawer container has `role="dialog"` and `aria-modal="true"`
- Focus is trapped within the drawer when open
- Focus is restored to the trigger element when the drawer closes
- The escape key can be used to close the drawer
