# PopoverHeadless

A headless component for creating customizable popovers with extensive flexibility for developers. Popovers are small floating elements that appear next to a trigger element, perfect for tooltips, dropdown menus, and more.

## Usage

```jsx
import { PopoverHeadless } from 'strive-ui';

function MyPopover() {
  return (
    <PopoverHeadless.Root
      placement="bottom"
      offset={8}
      showArrow={true}
      closeOnOutsideClick={true}
      closeOnEscape={true}
    >
      <PopoverHeadless.Trigger>
        Click me
      </PopoverHeadless.Trigger>
      
      <PopoverHeadless.Portal>
        <PopoverHeadless.Content
          style={{
            background: 'white',
            border: '1px solid #eee',
            borderRadius: '4px',
            padding: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            width: '200px'
          }}
        >
          <PopoverHeadless.Arrow
            style={{
              background: 'white',
              border: '1px solid #eee',
              borderRight: 'none',
              borderBottom: 'none'
            }}
          />
          
          <PopoverHeadless.Header
            style={{
              borderBottom: '1px solid #eee',
              padding: '8px',
              fontWeight: 'bold'
            }}
          >
            Popover Title
            <PopoverHeadless.Close
              style={{
                background: 'none',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
                float: 'right'
              }}
            >
              ×
            </PopoverHeadless.Close>
          </PopoverHeadless.Header>
          
          <PopoverHeadless.Body
            style={{
              padding: '8px'
            }}
          >
            <p>This is the popover content.</p>
            <p>You can put any elements here.</p>
          </PopoverHeadless.Body>
          
          <PopoverHeadless.Footer
            style={{
              borderTop: '1px solid #eee',
              padding: '8px',
              textAlign: 'right'
            }}
          >
            <PopoverHeadless.Close
              as="button"
              style={{
                padding: '4px 8px',
                background: '#f1f1f1',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Close
            </PopoverHeadless.Close>
          </PopoverHeadless.Footer>
        </PopoverHeadless.Content>
      </PopoverHeadless.Portal>
    </PopoverHeadless.Root>
  );
}
```

## Creating a Tooltip

```jsx
import { PopoverHeadless } from 'strive-ui';

function Tooltip({ children, content, placement = 'top' }) {
  return (
    <PopoverHeadless.Root
      placement={placement}
      offset={8}
      showArrow={true}
      closeOnOutsideClick={true}
    >
      <PopoverHeadless.Trigger as="span" style={{ display: 'inline-block' }}>
        {children}
      </PopoverHeadless.Trigger>
      
      <PopoverHeadless.Portal>
        <PopoverHeadless.Content
          style={{
            background: 'black',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '14px',
            maxWidth: '200px'
          }}
        >
          <PopoverHeadless.Arrow
            style={{
              background: 'black'
            }}
          />
          {content}
        </PopoverHeadless.Content>
      </PopoverHeadless.Portal>
    </PopoverHeadless.Root>
  );
}

// Usage
function App() {
  return (
    <div>
      <Tooltip content="This is a helpful tooltip that explains this feature">
        <button>Hover me</button>
      </Tooltip>
    </div>
  );
}
```

## Creating a Dropdown Menu

```jsx
import { PopoverHeadless } from 'strive-ui';

function DropdownMenu({ trigger, items }) {
  return (
    <PopoverHeadless.Root
      placement="bottom-start"
      offset={4}
      closeOnOutsideClick={true}
      closeOnEscape={true}
    >
      <PopoverHeadless.Trigger>
        {trigger}
      </PopoverHeadless.Trigger>
      
      <PopoverHeadless.Portal>
        <PopoverHeadless.Content
          style={{
            background: 'white',
            border: '1px solid #eee',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            minWidth: '150px'
          }}
        >
          <div style={{ padding: '4px 0' }}>
            {items.map((item, index) => (
              <PopoverHeadless.Close
                key={index}
                as="button"
                onClick={item.onClick}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 16px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  ':hover': {
                    background: '#f5f5f5'
                  }
                }}
              >
                {item.label}
              </PopoverHeadless.Close>
            ))}
          </div>
        </PopoverHeadless.Content>
      </PopoverHeadless.Portal>
    </PopoverHeadless.Root>
  );
}

// Usage
function App() {
  const menuItems = [
    { label: 'Edit', onClick: () => console.log('Edit clicked') },
    { label: 'Duplicate', onClick: () => console.log('Duplicate clicked') },
    { label: 'Delete', onClick: () => console.log('Delete clicked') },
  ];
  
  return (
    <div>
      <DropdownMenu
        trigger={<button>Actions ▾</button>}
        items={menuItems}
      />
    </div>
  );
}
```

## API

### PopoverHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultOpen` | `boolean` | `false` | Whether the popover is initially open |
| `open` | `boolean` | - | Controlled open state |
| `onOpen` | `() => void` | - | Callback when the popover opens |
| `onClose` | `() => void` | - | Callback when the popover closes |
| `placement` | `PopoverPlacement` | `'bottom'` | Placement of the popover relative to the trigger |
| `offset` | `number` | `8` | Offset from the trigger element in pixels |
| `closeOnOutsideClick` | `boolean` | `true` | Whether to close the popover when clicking outside |
| `closeOnEscape` | `boolean` | `true` | Whether to close the popover when pressing Escape key |
| `closeOnTriggerClick` | `boolean` | `true` | Whether to close the popover when the trigger is clicked while the popover is open |
| `trapFocus` | `boolean` | `true` | Whether to trap focus within the popover |
| `showArrow` | `boolean` | `true` | Whether to show an arrow pointing to the trigger |
| `arrowSize` | `number` | `8` | Size of the arrow in pixels |
| `usePortal` | `boolean` | `true` | Whether to render the popover in a portal |
| `portalId` | `string` | `'popover-root'` | ID of the element to render the portal into |

### PopoverPlacement Type

```typescript
type PopoverPlacement = 
  | 'top' 
  | 'top-start' 
  | 'top-end' 
  | 'right' 
  | 'right-start' 
  | 'right-end' 
  | 'bottom' 
  | 'bottom-start' 
  | 'bottom-end' 
  | 'left' 
  | 'left-start' 
  | 'left-end';
```

### Other Components

- `PopoverHeadless.Trigger`: Element that triggers the popover
- `PopoverHeadless.Portal`: Portal container for the popover
- `PopoverHeadless.Content`: Content container for the popover
- `PopoverHeadless.Arrow`: Arrow pointing to the trigger
- `PopoverHeadless.Close`: Button that closes the popover
- `PopoverHeadless.Header`: Header section of the popover
- `PopoverHeadless.Body`: Body section of the popover
- `PopoverHeadless.Footer`: Footer section of the popover

### usePopover Hook

For even more control, you can use the `usePopover` hook directly:

```jsx
import { usePopover } from 'strive-ui';

function MyCustomPopover() {
  const {
    isOpen,
    open,
    close,
    toggle,
    triggerRef,
    contentRef,
    arrowRef,
    getTriggerProps,
    getContentProps,
    getArrowProps,
    getCloseButtonProps,
  } = usePopover({
    placement: 'bottom',
    offset: 8,
    showArrow: true,
  });
  
  // Custom implementation
}
```

## Accessibility

The Popover component follows WAI-ARIA best practices:

- The trigger has `aria-expanded` and `aria-haspopup` attributes
- The content has `role="dialog"` and appropriate ARIA attributes
- Focus is trapped within the popover when open
- Focus is restored to the trigger element when the popover closes
- The escape key can be used to close the popover
