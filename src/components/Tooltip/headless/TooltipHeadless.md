# TooltipHeadless

A headless component for creating customizable tooltips with extensive flexibility for developers. Tooltips are small informational elements that appear when hovering over or focusing on an element.

## Usage

```jsx
import { TooltipHeadless } from 'strive-ui';

function MyTooltip() {
  return (
    <TooltipHeadless.Root
      placement="top"
      offset={8}
      showDelay={300}
      hideDelay={200}
      showArrow={true}
    >
      <TooltipHeadless.Trigger>
        <button>Hover me</button>
      </TooltipHeadless.Trigger>
      
      <TooltipHeadless.Portal>
        <TooltipHeadless.Content
          style={{
            background: 'black',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '14px',
            maxWidth: '200px'
          }}
        >
          <TooltipHeadless.Arrow
            style={{
              background: 'black'
            }}
          />
          This is a tooltip with information about the button.
        </TooltipHeadless.Content>
      </TooltipHeadless.Portal>
    </TooltipHeadless.Root>
  );
}
```

## Creating a Reusable Tooltip Component

```jsx
import { TooltipHeadless } from 'strive-ui';

function Tooltip({ 
  children, 
  content, 
  placement = 'top',
  showDelay = 300,
  hideDelay = 200
}) {
  return (
    <TooltipHeadless.Root
      placement={placement}
      offset={8}
      showDelay={showDelay}
      hideDelay={hideDelay}
      showArrow={true}
    >
      <TooltipHeadless.Trigger>
        {children}
      </TooltipHeadless.Trigger>
      
      <TooltipHeadless.Portal>
        <TooltipHeadless.Content
          style={{
            background: 'black',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '14px',
            maxWidth: '200px',
            textAlign: 'center'
          }}
        >
          <TooltipHeadless.Arrow
            style={{
              background: 'black'
            }}
          />
          {content}
        </TooltipHeadless.Content>
      </TooltipHeadless.Portal>
    </TooltipHeadless.Root>
  );
}

// Usage
function App() {
  return (
    <div style={{ padding: '50px' }}>
      <Tooltip content="Add a new item to your collection">
        <button>Add Item</button>
      </Tooltip>
      
      <div style={{ marginTop: '20px' }}>
        <Tooltip 
          content="This is a help icon with a longer description that will wrap to multiple lines if needed."
          placement="right"
        >
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#f0f0f0',
            cursor: 'help'
          }}>?</span>
        </Tooltip>
      </div>
    </div>
  );
}
```

## Different Tooltip Styles

```jsx
import { TooltipHeadless } from 'strive-ui';

function App() {
  return (
    <div style={{ display: 'flex', gap: '20px', padding: '50px' }}>
      {/* Default tooltip */}
      <TooltipHeadless.Root placement="top">
        <TooltipHeadless.Trigger>
          <button>Default</button>
        </TooltipHeadless.Trigger>
        <TooltipHeadless.Portal>
          <TooltipHeadless.Content
            style={{
              background: 'black',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px'
            }}
          >
            <TooltipHeadless.Arrow style={{ background: 'black' }} />
            Default tooltip
          </TooltipHeadless.Content>
        </TooltipHeadless.Portal>
      </TooltipHeadless.Root>
      
      {/* Info tooltip */}
      <TooltipHeadless.Root placement="top">
        <TooltipHeadless.Trigger>
          <button>Info</button>
        </TooltipHeadless.Trigger>
        <TooltipHeadless.Portal>
          <TooltipHeadless.Content
            style={{
              background: '#3498db',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px'
            }}
          >
            <TooltipHeadless.Arrow style={{ background: '#3498db' }} />
            Info tooltip
          </TooltipHeadless.Content>
        </TooltipHeadless.Portal>
      </TooltipHeadless.Root>
      
      {/* Success tooltip */}
      <TooltipHeadless.Root placement="top">
        <TooltipHeadless.Trigger>
          <button>Success</button>
        </TooltipHeadless.Trigger>
        <TooltipHeadless.Portal>
          <TooltipHeadless.Content
            style={{
              background: '#2ecc71',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px'
            }}
          >
            <TooltipHeadless.Arrow style={{ background: '#2ecc71' }} />
            Success tooltip
          </TooltipHeadless.Content>
        </TooltipHeadless.Portal>
      </TooltipHeadless.Root>
      
      {/* Warning tooltip */}
      <TooltipHeadless.Root placement="top">
        <TooltipHeadless.Trigger>
          <button>Warning</button>
        </TooltipHeadless.Trigger>
        <TooltipHeadless.Portal>
          <TooltipHeadless.Content
            style={{
              background: '#f39c12',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px'
            }}
          >
            <TooltipHeadless.Arrow style={{ background: '#f39c12' }} />
            Warning tooltip
          </TooltipHeadless.Content>
        </TooltipHeadless.Portal>
      </TooltipHeadless.Root>
      
      {/* Error tooltip */}
      <TooltipHeadless.Root placement="top">
        <TooltipHeadless.Trigger>
          <button>Error</button>
        </TooltipHeadless.Trigger>
        <TooltipHeadless.Portal>
          <TooltipHeadless.Content
            style={{
              background: '#e74c3c',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px'
            }}
          >
            <TooltipHeadless.Arrow style={{ background: '#e74c3c' }} />
            Error tooltip
          </TooltipHeadless.Content>
        </TooltipHeadless.Portal>
      </TooltipHeadless.Root>
    </div>
  );
}
```

## API

### TooltipHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultOpen` | `boolean` | `false` | Whether the tooltip is initially open |
| `open` | `boolean` | - | Controlled open state |
| `onOpen` | `() => void` | - | Callback when the tooltip opens |
| `onClose` | `() => void` | - | Callback when the tooltip closes |
| `placement` | `PopoverPlacement` | `'top'` | Placement of the tooltip relative to the trigger |
| `offset` | `number` | `8` | Offset from the trigger element in pixels |
| `showDelay` | `number` | `300` | Delay before showing the tooltip in milliseconds |
| `hideDelay` | `number` | `200` | Delay before hiding the tooltip in milliseconds |
| `showOnHover` | `boolean` | `true` | Whether to show the tooltip on hover |
| `showOnFocus` | `boolean` | `true` | Whether to show the tooltip on focus |
| `closeOnOutsideClick` | `boolean` | `true` | Whether to close the tooltip when clicking outside |
| `closeOnEscape` | `boolean` | `true` | Whether to close the tooltip when pressing Escape key |
| `trapFocus` | `boolean` | `true` | Whether to trap focus within the tooltip |
| `showArrow` | `boolean` | `true` | Whether to show an arrow pointing to the trigger |
| `arrowSize` | `number` | `8` | Size of the arrow in pixels |
| `usePortal` | `boolean` | `true` | Whether to render the tooltip in a portal |
| `portalId` | `string` | `'tooltip-root'` | ID of the element to render the portal into |

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

- `TooltipHeadless.Trigger`: Element that triggers the tooltip
- `TooltipHeadless.Portal`: Portal container for the tooltip
- `TooltipHeadless.Content`: Content container for the tooltip
- `TooltipHeadless.Arrow`: Arrow pointing to the trigger

### useTooltip Hook

For even more control, you can use the `useTooltip` hook directly:

```jsx
import { useTooltip } from 'strive-ui';

function MyCustomTooltip() {
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
  } = useTooltip({
    placement: 'top',
    offset: 8,
    showDelay: 300,
    hideDelay: 200,
    showArrow: true,
  });
  
  // Custom implementation
}
```

## Accessibility

The Tooltip component follows WAI-ARIA best practices:

- The tooltip has `role="tooltip"`
- The trigger has `aria-describedby` pointing to the tooltip content
- The tooltip can be triggered by both hover and focus
- Tooltips can be dismissed with the Escape key
