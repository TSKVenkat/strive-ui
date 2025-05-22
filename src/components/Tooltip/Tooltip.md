# Tooltip Component

The Tooltip component displays informative text when users hover over, focus on, or tap an element. It provides additional context and information about UI elements.

## Import

```jsx
import { Tooltip } from 'strive-ui';
```

## Features

- Multiple placement options
- Customizable appearance
- Delay on show/hide
- Arrow indicator
- Support for rich content
- Controlled and uncontrolled usage
- Accessible implementation

## Usage

```jsx
import { Tooltip, Button } from 'strive-ui';

// Basic usage
<Tooltip content="This is a tooltip">
  <Button>Hover me</Button>
</Tooltip>

// Different placements
<Tooltip content="Top tooltip" placement="top">
  <Button>Top</Button>
</Tooltip>

<Tooltip content="Right tooltip" placement="right">
  <Button>Right</Button>
</Tooltip>

<Tooltip content="Bottom tooltip" placement="bottom">
  <Button>Bottom</Button>
</Tooltip>

<Tooltip content="Left tooltip" placement="left">
  <Button>Left</Button>
</Tooltip>

// With delay
<Tooltip 
  content="Delayed tooltip" 
  showDelay={500} 
  hideDelay={200}
>
  <Button>Delayed</Button>
</Tooltip>

// Without arrow
<Tooltip content="No arrow" hasArrow={false}>
  <Button>No Arrow</Button>
</Tooltip>

// With rich content
<Tooltip
  content={
    <div>
      <h4>Rich Content</h4>
      <p>This tooltip has formatted content.</p>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    </div>
  }
  maxWidth="300px"
>
  <Button>Rich Content</Button>
</Tooltip>

// Controlled tooltip
const [isOpen, setIsOpen] = useState(false);
<Tooltip 
  content="Controlled tooltip"
  isOpen={isOpen}
  onOpen={() => setIsOpen(true)}
  onClose={() => setIsOpen(false)}
>
  <Button onClick={() => setIsOpen(!isOpen)}>
    Click to {isOpen ? 'hide' : 'show'} tooltip
  </Button>
</Tooltip>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | ReactNode | - | Content to display in the tooltip |
| `children` | ReactNode | - | The element that triggers the tooltip |
| `placement` | 'top' \| 'top-start' \| 'top-end' \| 'right' \| 'right-start' \| 'right-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' | 'bottom' | Placement of the tooltip |
| `isOpen` | boolean | - | Whether the tooltip is visible (controlled) |
| `defaultIsOpen` | boolean | false | Whether the tooltip is initially visible (uncontrolled) |
| `onOpen` | () => void | - | Callback when the tooltip opens |
| `onClose` | () => void | - | Callback when the tooltip closes |
| `trigger` | 'hover' \| 'click' \| 'focus' \| 'manual' | 'hover' | What triggers the tooltip |
| `showDelay` | number | 0 | Delay in ms before showing the tooltip |
| `hideDelay` | number | 0 | Delay in ms before hiding the tooltip |
| `hasArrow` | boolean | true | Whether to show an arrow pointing to the trigger |
| `arrowSize` | number | 8 | Size of the arrow in pixels |
| `offset` | number | 8 | Distance between the tooltip and the trigger |
| `maxWidth` | string \| number | '320px' | Maximum width of the tooltip |
| `background` | string | 'neutral.800' | Background color of the tooltip |
| `color` | string | 'white' | Text color of the tooltip |
| `padding` | string \| number | '0.5rem 0.75rem' | Padding inside the tooltip |
| `borderRadius` | string \| number | '0.25rem' | Border radius of the tooltip |
| `zIndex` | number | 1000 | Z-index of the tooltip |
| `portalTarget` | HTMLElement | document.body | DOM element where the tooltip should be rendered |
| `closeOnEsc` | boolean | true | Whether to close the tooltip when Escape key is pressed |
| `closeOnClickOutside` | boolean | true | Whether to close the tooltip when clicking outside |
| `interactive` | boolean | false | Whether the tooltip content is interactive |
| `disabled` | boolean | false | Whether the tooltip is disabled |

## Placement Options

The Tooltip component supports 12 placement options:

```jsx
// Top placements
<Tooltip placement="top">Top</Tooltip>
<Tooltip placement="top-start">Top Start</Tooltip>
<Tooltip placement="top-end">Top End</Tooltip>

// Right placements
<Tooltip placement="right">Right</Tooltip>
<Tooltip placement="right-start">Right Start</Tooltip>
<Tooltip placement="right-end">Right End</Tooltip>

// Bottom placements
<Tooltip placement="bottom">Bottom</Tooltip>
<Tooltip placement="bottom-start">Bottom Start</Tooltip>
<Tooltip placement="bottom-end">Bottom End</Tooltip>

// Left placements
<Tooltip placement="left">Left</Tooltip>
<Tooltip placement="left-start">Left Start</Tooltip>
<Tooltip placement="left-end">Left End</Tooltip>
```

## Trigger Options

The Tooltip component supports different trigger methods:

```jsx
// Show on hover (default)
<Tooltip trigger="hover" content="Hover tooltip">
  <Button>Hover me</Button>
</Tooltip>

// Show on click
<Tooltip trigger="click" content="Click tooltip">
  <Button>Click me</Button>
</Tooltip>

// Show on focus
<Tooltip trigger="focus" content="Focus tooltip">
  <input placeholder="Focus me" />
</Tooltip>

// Manual control
<Tooltip trigger="manual" isOpen={isOpen} content="Manual tooltip">
  <Button onClick={() => setIsOpen(!isOpen)}>Toggle tooltip</Button>
</Tooltip>
```

## Interactive Tooltips

When a tooltip contains interactive elements, set the `interactive` prop to true:

```jsx
<Tooltip
  content={
    <div>
      <p>Would you like to continue?</p>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <Button size="sm" variant="primary">Yes</Button>
        <Button size="sm" variant="secondary">No</Button>
      </div>
    </div>
  }
  interactive
  trigger="click"
>
  <Button>Show Interactive Tooltip</Button>
</Tooltip>
```

## Accessibility

The Tooltip component follows accessibility best practices:
- Uses appropriate ARIA roles and attributes (`role="tooltip"`)
- Supports keyboard navigation
- Ensures tooltips are announced to screen readers
- Provides appropriate focus management
- Allows tooltips to be triggered by focus for keyboard users
- Maintains adequate color contrast for readability
