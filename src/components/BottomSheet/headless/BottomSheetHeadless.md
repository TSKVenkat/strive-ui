# BottomSheetHeadless

A headless component for creating customizable bottom sheets with extensive flexibility for developers. Bottom sheets slide up from the bottom of the screen and can be resized, dragged, and customized to fit various use cases.

## Usage

```jsx
import { BottomSheetHeadless } from 'strive-ui';

function MyBottomSheet() {
  return (
    <BottomSheetHeadless.Root
      initialHeight="50vh"
      maxHeight="90vh"
      resizable={true}
      showDragHandle={true}
      enableSwipeToClose={true}
      hasBackdrop={true}
      closeOnBackdropClick={true}
      closeOnEscape={true}
    >
      <BottomSheetHeadless.Trigger>
        Open Bottom Sheet
      </BottomSheetHeadless.Trigger>
      
      <BottomSheetHeadless.Portal>
        <BottomSheetHeadless.Backdrop />
        
        <BottomSheetHeadless.Container
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <BottomSheetHeadless.DragHandle />
          
          <BottomSheetHeadless.Header
            style={{
              padding: '0 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #eee'
            }}
          >
            <h3 style={{ margin: '10px 0' }}>Bottom Sheet Title</h3>
            <BottomSheetHeadless.Close
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer'
              }}
            >
              ×
            </BottomSheetHeadless.Close>
          </BottomSheetHeadless.Header>
          
          <BottomSheetHeadless.Content>
            <BottomSheetHeadless.Body
              style={{
                padding: '16px',
              }}
            >
              <p>This is the content of the bottom sheet.</p>
              <p>You can put any elements here.</p>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
                <li>Item 3</li>
              </ul>
            </BottomSheetHeadless.Body>
            
            <BottomSheetHeadless.Footer
              style={{
                padding: '16px',
                borderTop: '1px solid #eee',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '8px'
              }}
            >
              <BottomSheetHeadless.Close
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
              </BottomSheetHeadless.Close>
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
            </BottomSheetHeadless.Footer>
          </BottomSheetHeadless.Content>
        </BottomSheetHeadless.Container>
      </BottomSheetHeadless.Portal>
    </BottomSheetHeadless.Root>
  );
}
```

## Creating a Reusable Bottom Sheet

```jsx
import { BottomSheetHeadless } from 'strive-ui';

function CustomBottomSheet({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  initialHeight = '50vh',
  resizable = true
}) {
  return (
    <BottomSheetHeadless.Root
      open={isOpen}
      onClose={onClose}
      initialHeight={initialHeight}
      resizable={resizable}
      enableFullScreen={true}
    >
      <BottomSheetHeadless.Portal>
        <BottomSheetHeadless.Backdrop />
        
        <BottomSheetHeadless.Container
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
          }}
        >
          <BottomSheetHeadless.DragHandle />
          
          <BottomSheetHeadless.Header
            style={{
              padding: '0 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #eee'
            }}
          >
            <h3 style={{ margin: '10px 0' }}>{title}</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <BottomSheetHeadless.FullScreenToggle
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              />
              <BottomSheetHeadless.Close
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </BottomSheetHeadless.Close>
            </div>
          </BottomSheetHeadless.Header>
          
          <BottomSheetHeadless.Content>
            <BottomSheetHeadless.Body
              style={{
                padding: '16px',
              }}
            >
              {children}
            </BottomSheetHeadless.Body>
          </BottomSheetHeadless.Content>
        </BottomSheetHeadless.Container>
      </BottomSheetHeadless.Portal>
    </BottomSheetHeadless.Root>
  );
}

// Usage
function App() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  return (
    <div>
      <button onClick={() => setIsSheetOpen(true)}>Open Sheet</button>
      
      <CustomBottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
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
          
          <div style={{ marginTop: '20px' }}>
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
              Save Changes
            </button>
          </div>
        </div>
      </CustomBottomSheet>
    </div>
  );
}
```

## Creating a Bottom Sheet with Snap Points

```jsx
import { BottomSheetHeadless } from 'strive-ui';

function SnapPointBottomSheet() {
  return (
    <BottomSheetHeadless.Root
      enableSnapPoints={true}
      snapPoints={[25, 50, 75, 100]}
      initialHeight="50vh"
    >
      <BottomSheetHeadless.Trigger>
        Open Snap Point Sheet
      </BottomSheetHeadless.Trigger>
      
      <BottomSheetHeadless.Portal>
        <BottomSheetHeadless.Backdrop />
        
        <BottomSheetHeadless.Container
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
          }}
        >
          <BottomSheetHeadless.DragHandle />
          
          <BottomSheetHeadless.Content>
            <div style={{ padding: '16px' }}>
              <h3>Snap Point Bottom Sheet</h3>
              <p>Drag the handle to snap to different heights:</p>
              <ul>
                <li>25% of viewport height</li>
                <li>50% of viewport height</li>
                <li>75% of viewport height</li>
                <li>100% of viewport height (full screen)</li>
              </ul>
              <p>This is useful for creating maps, image galleries, or any content that benefits from different view sizes.</p>
            </div>
          </BottomSheetHeadless.Content>
        </BottomSheetHeadless.Container>
      </BottomSheetHeadless.Portal>
    </BottomSheetHeadless.Root>
  );
}
```

## API

### BottomSheetHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultOpen` | `boolean` | `false` | Whether the bottom sheet is initially open |
| `open` | `boolean` | - | Controlled open state |
| `onOpen` | `() => void` | - | Callback when the bottom sheet opens |
| `onClose` | `() => void` | - | Callback when the bottom sheet closes |
| `initialHeight` | `string \| number` | `'50vh'` | Initial height of the bottom sheet |
| `maxHeight` | `string \| number` | `'90vh'` | Maximum height of the bottom sheet |
| `resizable` | `boolean` | `true` | Whether to allow resizing the bottom sheet by dragging |
| `showDragHandle` | `boolean` | `true` | Whether to show a drag handle |
| `enableSwipeToClose` | `boolean` | `true` | Whether to enable swipe down to close |
| `swipeThreshold` | `number` | `0.5` | Threshold for swipe to close (percentage of height) |
| `hasBackdrop` | `boolean` | `true` | Whether to show a backdrop behind the bottom sheet |
| `closeOnBackdropClick` | `boolean` | `true` | Whether to close the bottom sheet when clicking the backdrop |
| `closeOnEscape` | `boolean` | `true` | Whether to close the bottom sheet when pressing Escape key |
| `onResize` | `(height: number) => void` | - | Callback when the bottom sheet is resized |
| `enableSnapPoints` | `boolean` | `false` | Whether to enable snap points |
| `snapPoints` | `number[]` | `[25, 50, 75, 100]` | Snap points for the bottom sheet (percentage of viewport height) |
| `enableFullScreen` | `boolean` | `false` | Whether to enable full screen mode |
| `defaultFullScreen` | `boolean` | `false` | Whether to start in full screen mode |
| `showCloseButton` | `boolean` | `true` | Whether to show a close button |
| `trapFocus` | `boolean` | `true` | Whether to trap focus within the bottom sheet |
| `preventScroll` | `boolean` | `true` | Whether to prevent scrolling of the body when the bottom sheet is open |
| `usePortal` | `boolean` | `true` | Whether to render the bottom sheet in a portal |
| `portalId` | `string` | `'bottom-sheet-root'` | ID of the element to render the portal into |

### Other Components

- `BottomSheetHeadless.Trigger`: Button that opens the bottom sheet
- `BottomSheetHeadless.Portal`: Portal container for the bottom sheet
- `BottomSheetHeadless.Backdrop`: Background overlay for the bottom sheet
- `BottomSheetHeadless.Container`: Container for the bottom sheet
- `BottomSheetHeadless.DragHandle`: Drag handle for resizing the bottom sheet
- `BottomSheetHeadless.Content`: Content container for the bottom sheet
- `BottomSheetHeadless.Header`: Header section of the bottom sheet
- `BottomSheetHeadless.Body`: Body section of the bottom sheet
- `BottomSheetHeadless.Footer`: Footer section of the bottom sheet
- `BottomSheetHeadless.Close`: Button that closes the bottom sheet
- `BottomSheetHeadless.FullScreenToggle`: Button that toggles full screen mode

### useBottomSheet Hook

For even more control, you can use the `useBottomSheet` hook directly:

```jsx
import { useBottomSheet } from 'strive-ui';

function MyCustomBottomSheet() {
  const {
    isOpen,
    open,
    close,
    toggle,
    height,
    setHeight,
    isFullScreen,
    toggleFullScreen,
    containerRef,
    dragHandleRef,
    contentRef,
    getContainerProps,
    getBackdropProps,
    getContentProps,
    getDragHandleProps,
    getTriggerProps,
    getCloseButtonProps,
    getFullScreenButtonProps,
  } = useBottomSheet({
    initialHeight: '50vh',
    resizable: true,
    enableSnapPoints: true,
  });
  
  // Custom implementation
}
```

## Accessibility

The Bottom Sheet component follows WAI-ARIA best practices for dialogs:

- The bottom sheet container has `role="dialog"` and `aria-modal="true"`
- Focus is trapped within the bottom sheet when open
- Focus is restored to the trigger element when the bottom sheet closes
- The escape key can be used to close the bottom sheet
- Drag handle has appropriate ARIA labels for screen readers
